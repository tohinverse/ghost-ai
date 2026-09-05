import {
  badRequest,
  conflict,
  forbidden,
  jsonOk,
  notFound,
  unauthorized,
} from "@/lib/api-response"
import { parseInviteCollaboratorInput } from "@/lib/collaborator-input"
import { toCollaborators } from "@/lib/collaborator-view"
import {
  createCollaborator,
  listCollaborators,
} from "@/lib/collaborators"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"
import { readJsonBody } from "@/lib/project-input"
import { findProjectById, isUniqueConstraintError } from "@/lib/projects"
import type { Collaborator } from "@/types/collaborator"

export interface CollaboratorListResponse {
  collaborators: Collaborator[]
  /** Drives the dialog's read-only mode; only the owner may invite or remove. */
  isOwner: boolean
}

/**
 * GET /api/projects/[projectId]/collaborators — the project's collaborators,
 * enriched with Clerk display data. Readable by any project member: a
 * collaborator sees the list, they just cannot change it.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/projects/[projectId]/collaborators">) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return unauthorized()
  }

  const { projectId } = await ctx.params
  const project = await findProjectById(projectId)

  if (!project) {
    return notFound()
  }

  if (!(await hasProjectAccess(project, identity))) {
    return forbidden()
  }

  const rows = await listCollaborators(projectId)

  return jsonOk<CollaboratorListResponse>({
    collaborators: await toCollaborators(rows),
    isOwner: project.ownerId === identity.userId,
  })
}

/**
 * POST /api/projects/[projectId]/collaborators — invite a collaborator by
 * email. Owner-only: a collaborator cannot widen access to a project that is
 * not theirs.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/projects/[projectId]/collaborators">) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    return unauthorized()
  }

  const { projectId } = await ctx.params

  const body = await readJsonBody(request)

  if (!body.ok) {
    return badRequest(body.error)
  }

  const input = parseInviteCollaboratorInput(body.value)

  if (!input.ok) {
    return badRequest(input.error)
  }

  const project = await findProjectById(projectId)

  if (!project) {
    return notFound()
  }

  if (project.ownerId !== identity.userId) {
    return forbidden()
  }

  // The owner is already a member by definition; a row for them would show a
  // duplicate entry in the list and imply they could be removed.
  if (identity.email && input.value.email === identity.email.toLowerCase()) {
    return badRequest("You already have access to this project")
  }

  try {
    const collaborator = await createCollaborator(projectId, input.value.email)
    const [enriched] = await toCollaborators([collaborator])

    return jsonOk<Collaborator>(enriched, 201)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("That person is already a collaborator")
    }

    throw error
  }
}
