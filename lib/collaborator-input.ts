import type { ParseResult } from "@/lib/project-input"

export const COLLABORATOR_EMAIL_MAX_LENGTH = 254

/**
 * Deliberately permissive: the authoritative check is whether Clerk knows the
 * address, and an invite is allowed to exist before that person signs up. This
 * only rejects input that could not be an address at all.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

export interface InviteCollaboratorInput {
  email: string
}

/**
 * Emails are stored and compared lowercased so that an invite and the
 * invitee's primary Clerk address match regardless of how either was typed.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function parseInviteCollaboratorInput(
  body: Record<string, unknown>
): ParseResult<InviteCollaboratorInput> {
  const rawEmail = body.email

  if (typeof rawEmail !== "string") {
    return { ok: false, error: "Email address is required" }
  }

  const email = normalizeEmail(rawEmail)

  if (!email) {
    return { ok: false, error: "Email address cannot be empty" }
  }

  if (email.length > COLLABORATOR_EMAIL_MAX_LENGTH) {
    return {
      ok: false,
      error: `Email address must be ${COLLABORATOR_EMAIL_MAX_LENGTH} characters or fewer`,
    }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid email address" }
  }

  return { ok: true, value: { email } }
}
