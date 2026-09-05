import type { Project } from "@/app/generated/prisma/client"

import { getCurrentUserEmail, getCurrentUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * The caller's Clerk identity as the access checks need it: the user ID that
 * `Project.ownerId` stores, plus the primary email that `ProjectCollaborator`
 * is keyed by. `userId` is `null` when the request is unauthenticated; `email`
 * is additionally `null` when the account has no primary address.
 */
export interface CurrentIdentity {
  userId: string | null
  email: string | null
}

export async function getCurrentIdentity(): Promise<CurrentIdentity> {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { userId: null, email: null }
  }

  return { userId, email: await getCurrentUserEmail() }
}

/**
 * Whether the identity may open the project: it owns it, or it is listed as a
 * collaborator. Membership is the same rule the Liveblocks room token will be
 * issued against, so it lives here rather than inside a page component.
 */
export async function hasProjectAccess(
  project: Project,
  identity: CurrentIdentity
): Promise<boolean> {
  if (!identity.userId) {
    return false
  }

  if (project.ownerId === identity.userId) {
    return true
  }

  if (!identity.email) {
    return false
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: { projectId: project.id, email: identity.email },
    },
    select: { id: true },
  })

  return collaborator !== null
}
