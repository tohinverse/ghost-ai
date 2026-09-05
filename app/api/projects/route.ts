import { badRequest, conflict, jsonOk, unauthorized } from "@/lib/api-response"
import { getCurrentUserEmail, getCurrentUserId } from "@/lib/auth"
import { parseCreateProjectInput, readJsonBody } from "@/lib/project-input"
import {
  createProject,
  isUniqueConstraintError,
  listProjectsForCollaborator,
  listProjectsForOwner,
  serializeProject,
  type ProjectResponse,
} from "@/lib/projects"

export interface ProjectListResponse {
  owned: ProjectResponse[]
  shared: ProjectResponse[]
}

/**
 * GET /api/projects — the caller's owned and shared projects, newest first.
 * Shared projects resolve through the caller's email, which is how
 * `ProjectCollaborator` records membership.
 */
export async function GET() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return unauthorized()
  }

  const email = await getCurrentUserEmail()

  const [owned, shared] = await Promise.all([
    listProjectsForOwner(userId),
    email ? listProjectsForCollaborator(email) : Promise.resolve([]),
  ])

  return jsonOk<ProjectListResponse>({
    owned: owned.map(serializeProject),
    shared: shared.map(serializeProject),
  })
}

/** POST /api/projects — create a project owned by the current user. */
export async function POST(request: Request) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return unauthorized()
  }

  const body = await readJsonBody(request)

  if (!body.ok) {
    return badRequest(body.error)
  }

  const input = parseCreateProjectInput(body.value)

  if (!input.ok) {
    return badRequest(input.error)
  }

  try {
    const project = await createProject({
      id: input.value.id,
      ownerId: userId,
      name: input.value.name,
      description: input.value.description,
    })

    return jsonOk<ProjectResponse>(serializeProject(project), 201)
  } catch (error) {
    // The client generates the ID, so a collision is a client-recoverable
    // conflict rather than a server fault.
    if (isUniqueConstraintError(error)) {
      return conflict("A project with that id already exists")
    }

    throw error
  }
}
