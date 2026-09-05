import { badRequest, jsonOk, unauthorized } from "@/lib/api-response"
import { getCurrentUserId } from "@/lib/auth"
import { parseCreateProjectInput, readJsonBody } from "@/lib/project-input"
import {
  createProject,
  listProjectsForOwner,
  serializeProject,
  type ProjectResponse,
} from "@/lib/projects"

export interface ProjectListResponse {
  projects: ProjectResponse[]
}

/** GET /api/projects — the current user's projects, newest first. */
export async function GET() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return unauthorized()
  }

  const projects = await listProjectsForOwner(userId)

  return jsonOk<ProjectListResponse>({ projects: projects.map(serializeProject) })
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

  const project = await createProject({
    ownerId: userId,
    name: input.value.name,
    description: input.value.description,
  })

  return jsonOk<ProjectResponse>(serializeProject(project), 201)
}
