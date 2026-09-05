import { badRequest, forbidden, jsonOk, notFound, unauthorized } from "@/lib/api-response"
import { getCurrentUserId } from "@/lib/auth"
import { parseRenameProjectInput, readJsonBody } from "@/lib/project-input"
import {
  deleteProject,
  findProjectById,
  renameProject,
  serializeProject,
  type ProjectResponse,
} from "@/lib/projects"

export interface DeleteProjectResponse {
  id: string
  deleted: true
}

/** PATCH /api/projects/[projectId] — rename a project the caller owns. */
export async function PATCH(request: Request, ctx: RouteContext<"/api/projects/[projectId]">) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return unauthorized()
  }

  const { projectId } = await ctx.params

  const body = await readJsonBody(request)

  if (!body.ok) {
    return badRequest(body.error)
  }

  const input = parseRenameProjectInput(body.value)

  if (!input.ok) {
    return badRequest(input.error)
  }

  const project = await findProjectById(projectId)

  if (!project) {
    return notFound()
  }

  if (project.ownerId !== userId) {
    return forbidden()
  }

  const updated = await renameProject(projectId, input.value.name)

  return jsonOk<ProjectResponse>(serializeProject(updated))
}

/** DELETE /api/projects/[projectId] — delete a project the caller owns. */
export async function DELETE(_request: Request, ctx: RouteContext<"/api/projects/[projectId]">) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return unauthorized()
  }

  const { projectId } = await ctx.params
  const project = await findProjectById(projectId)

  if (!project) {
    return notFound()
  }

  if (project.ownerId !== userId) {
    return forbidden()
  }

  await deleteProject(projectId)

  return jsonOk<DeleteProjectResponse>({ id: projectId, deleted: true })
}
