import type { ProjectResponse } from "@/lib/projects"
import type { Project } from "@/types/project"

/**
 * Bridges the API's `ProjectResponse` to the sidebar's `Project`. The API shape
 * carries neither `slug` nor `isOwner`: the slug is derived from the ID, and
 * ownership is decided by which list the project arrived in, since
 * `GET /api/projects` returns owned and shared separately.
 */
export function toProject(project: ProjectResponse, isOwner: boolean): Project {
  return {
    id: project.id,
    name: project.name,
    slug: project.id,
    isOwner,
  }
}

export function toProjects(projects: ProjectResponse[], isOwner: boolean): Project[] {
  return projects.map((project) => toProject(project, isOwner))
}
