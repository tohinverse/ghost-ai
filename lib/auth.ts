import { auth, currentUser } from "@clerk/nextjs/server"

/**
 * Resolves the Clerk user ID for the current request, or `null` when the
 * request is unauthenticated. Route handlers use this as their auth boundary
 * and answer `401` on `null`.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()

  return userId ?? null
}

/**
 * The caller's primary email address, or `null` when unauthenticated or when
 * Clerk has no primary address on the account. `ProjectCollaborator` is keyed
 * by email rather than user ID, so shared-project reads resolve through this
 * rather than through the user ID.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const user = await currentUser()

  return user?.primaryEmailAddress?.emailAddress ?? null
}
