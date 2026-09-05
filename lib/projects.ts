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

export function createProject(input: {
  ownerId: string
  name: string
  description: string | null
}): Promise<Project> {
  return prisma.project.create({
    // `id` is left to the schema's `@default(cuid())` strategy.
    data: {
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
