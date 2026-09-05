import type { ProjectCollaborator } from "@/app/generated/prisma/client"

import { prisma } from "@/lib/prisma"

/**
 * Prisma queries for `ProjectCollaborator`. Rows carry nothing but the email —
 * display names and avatars are layered on from Clerk in
 * `lib/collaborator-view.ts`, since there is no local user table.
 */

export function listCollaborators(projectId: string): Promise<ProjectCollaborator[]> {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  })
}

export function createCollaborator(
  projectId: string,
  email: string
): Promise<ProjectCollaborator> {
  return prisma.projectCollaborator.create({
    data: { projectId, email },
  })
}

/**
 * Looks a collaborator up by row ID *and* project, so a request cannot pair a
 * project the caller owns with a collaborator row belonging to another project.
 */
export function findCollaboratorInProject(
  projectId: string,
  collaboratorId: string
): Promise<ProjectCollaborator | null> {
  return prisma.projectCollaborator.findFirst({
    where: { id: collaboratorId, projectId },
  })
}

export async function deleteCollaborator(id: string): Promise<void> {
  await prisma.projectCollaborator.delete({ where: { id } })
}
