import type { Project } from "@/app/generated/prisma/client"

import { prisma } from "@/lib/prisma"

export const DEFAULT_PROJECT_NAME = "Untitled Project"

/**
 * Serialized shape returned by every project route. Dates are ISO strings so
 * the payload survives JSON without the client having to revive them.
 */
export interface ProjectResponse {
  id: string
  ownerId: string
  name: string
  description: string | null
  status: Project["status"]
  canvasJsonPath: string | null
  createdAt: string
  updatedAt: string
}

export function serializeProject(project: Project): ProjectResponse {
  return {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    description: project.description,
    status: project.status,
    canvasJsonPath: project.canvasJsonPath,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export function listProjectsForOwner(ownerId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Projects shared with the caller. `ProjectCollaborator` is keyed by email, so
 * membership resolves through the caller's address rather than their user ID.
 */
export function listProjectsForCollaborator(email: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { collaborators: { some: { email } } },
    orderBy: { createdAt: "desc" },
  })
}

export function createProject(input: {
  /**
   * Supplied by the client so the project ID doubles as the Liveblocks room
   * ID. Omitted, it falls back to the schema's `@default(cuid())`.
   */
  id?: string
  ownerId: string
  name: string
  description: string | null
}): Promise<Project> {
  return prisma.project.create({
    data: {
      ...(input.id ? { id: input.id } : {}),
      ownerId: input.ownerId,
      name: input.name,
      description: input.description,
    },
  })
}

export function findProjectById(projectId: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { id: projectId } })
}

export function renameProject(projectId: string, name: string): Promise<Project> {
  return prisma.project.update({
    where: { id: projectId },
    data: { name },
  })
}

export async function deleteProject(projectId: string): Promise<void> {
  await prisma.project.delete({ where: { id: projectId } })
}

/**
 * Narrows an unknown thrown value to Prisma's unique-constraint failure (P2002)
 * without importing the error class, which differs between the Accelerate and
 * driver-adapter client builds.
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  )
}
