import { forbidden, jsonOk, notFound, unauthorized } from "@/lib/api-response"
import { getCurrentUserId } from "@/lib/auth"
import {
  deleteCollaborator,
  findCollaboratorInProject,
} from "@/lib/collaborators"
import { findProjectById } from "@/lib/projects"

export interface DeleteCollaboratorResponse {
  id: string
  deleted: true
}

/**
 * DELETE /api/projects/[projectId]/collaborators/[collaboratorId] — remove a
 * collaborator. Owner-only, matching invite: a collaborator cannot remove
 * themselves or anyone else.
 */
export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators/[collaboratorId]">
) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return unauthorized()
  }

  const { projectId, collaboratorId } = await ctx.params
  const project = await findProjectById(projectId)

  if (!project) {
    return notFound()
  }

  if (project.ownerId !== userId) {
    return forbidden()
  }

  // Scoped to the project in the path, so a URL cannot pair an owned project
  // with a collaborator row belonging to a different one.
  const collaborator = await findCollaboratorInProject(projectId, collaboratorId)

  if (!collaborator) {
    return notFound()
  }

  await deleteCollaborator(collaboratorId)

  return jsonOk<DeleteCollaboratorResponse>({ id: collaboratorId, deleted: true })
}
