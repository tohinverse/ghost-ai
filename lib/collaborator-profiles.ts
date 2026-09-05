import { clerkClient } from "@clerk/nextjs/server"
import type { User } from "@clerk/nextjs/server"

import { normalizeEmail } from "@/lib/collaborator-input"

/**
 * Display data for a collaborator, resolved from Clerk. There is no local user
 * table, so Clerk is the only source of names and avatars: `name` and
 * `imageUrl` are `null` whenever no Clerk account matches the email, and the
 * UI falls back to showing the address alone.
 */
export interface CollaboratorProfile {
  name: string | null
  imageUrl: string | null
}

/** Clerk's list endpoint accepts at most 100 email addresses per request. */
const EMAIL_BATCH_SIZE = 100

/**
 * The best display name Clerk has: full name, then either name alone, then the
 * username. `null` when the account carries none of them, which keeps the email
 * as the only thing worth rendering.
 */
function displayName(user: User): string | null {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()

  return fullName || user.username || null
}

/**
 * Every address on the account, not just the primary one: a collaborator may
 * have been invited at a secondary address that Clerk still resolves to the
 * same user.
 */
function emailsOf(user: User): string[] {
  return user.emailAddresses.map((address) => normalizeEmail(address.emailAddress))
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size))
  }

  return batches
}

/**
 * Looks up Clerk profiles for a set of collaborator emails, keyed by the
 * normalized email. Emails with no matching Clerk account are simply absent
 * from the map rather than mapped to a placeholder.
 *
 * Enrichment is best-effort: a Clerk outage returns an empty map so the
 * collaborator list still renders with emails, rather than failing the request.
 */
export async function getCollaboratorProfiles(
  emails: string[]
): Promise<Map<string, CollaboratorProfile>> {
  const profiles = new Map<string, CollaboratorProfile>()
  const unique = [...new Set(emails.map(normalizeEmail))].filter(Boolean)

  if (unique.length === 0) {
    return profiles
  }

  try {
    const clerk = await clerkClient()

    const responses = await Promise.all(
      chunk(unique, EMAIL_BATCH_SIZE).map((batch) =>
        clerk.users.getUserList({ emailAddress: batch, limit: batch.length })
      )
    )

    for (const response of responses) {
      for (const user of response.data) {
        const profile: CollaboratorProfile = {
          name: displayName(user),
          imageUrl: user.hasImage ? user.imageUrl : null,
        }

        // Map every address the account owns, so a lookup by the invited
        // address hits regardless of which one is primary.
        for (const email of emailsOf(user)) {
          if (unique.includes(email)) {
            profiles.set(email, profile)
          }
        }
      }
    }
  } catch {
    // Fall through: the caller renders emails without display data.
    return new Map()
  }

  return profiles
}
