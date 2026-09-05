import { auth } from "@clerk/nextjs/server"

/**
 * Resolves the Clerk user ID for the current request, or `null` when the
 * request is unauthenticated. Route handlers use this as their auth boundary
 * and answer `401` on `null`.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()

  return userId ?? null
}
