import { DEFAULT_PROJECT_NAME } from "@/lib/projects"

export const PROJECT_NAME_MAX_LENGTH = 100
export const PROJECT_DESCRIPTION_MAX_LENGTH = 500
export const PROJECT_ID_MAX_LENGTH = 120

/**
 * A project ID doubles as the Liveblocks room ID and as a URL segment, so it is
 * restricted to the same lowercase slug charset the client generates.
 */
const PROJECT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string }

export interface CreateProjectInput {
  id?: string
  name: string
  description: string | null
}

export interface RenameProjectInput {
  name: string
}

/**
 * Route handlers receive `unknown` from `request.json()`. Everything below
 * narrows that input before any database work runs.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function readJsonBody(request: Request): Promise<ParseResult<Record<string, unknown>>> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return { ok: false, error: "Request body must be valid JSON" }
  }

  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object" }
  }

  return { ok: true, value: body }
}

export function parseCreateProjectInput(
  body: Record<string, unknown>
): ParseResult<CreateProjectInput> {
  const rawName = body.name
  let name: string

  // A missing or blank name falls back to the default rather than failing.
  if (rawName === undefined || rawName === null) {
    name = DEFAULT_PROJECT_NAME
  } else if (typeof rawName === "string") {
    name = rawName.trim() || DEFAULT_PROJECT_NAME
  } else {
    return { ok: false, error: "Project name must be a string" }
  }

  if (name.length > PROJECT_NAME_MAX_LENGTH) {
    return { ok: false, error: `Project name must be ${PROJECT_NAME_MAX_LENGTH} characters or fewer` }
  }

  const rawDescription = body.description
  let description: string | null = null

  if (rawDescription !== undefined && rawDescription !== null) {
    if (typeof rawDescription !== "string") {
      return { ok: false, error: "Project description must be a string" }
    }

    description = rawDescription.trim() || null

    if (description && description.length > PROJECT_DESCRIPTION_MAX_LENGTH) {
      return {
        ok: false,
        error: `Project description must be ${PROJECT_DESCRIPTION_MAX_LENGTH} characters or fewer`,
      }
    }
  }

  const rawId = body.id
  let id: string | undefined

  // Optional: omitted, the schema's `@default(cuid())` assigns the ID instead.
  if (rawId !== undefined && rawId !== null) {
    if (typeof rawId !== "string") {
      return { ok: false, error: "Project id must be a string" }
    }

    id = rawId.trim()

    if (!PROJECT_ID_PATTERN.test(id)) {
      return {
        ok: false,
        error: "Project id must contain only lowercase letters, numbers, and hyphens",
      }
    }

    if (id.length > PROJECT_ID_MAX_LENGTH) {
      return { ok: false, error: `Project id must be ${PROJECT_ID_MAX_LENGTH} characters or fewer` }
    }
  }

  return { ok: true, value: { id, name, description } }
}

export function parseRenameProjectInput(
  body: Record<string, unknown>
): ParseResult<RenameProjectInput> {
  const rawName = body.name

  if (typeof rawName !== "string") {
    return { ok: false, error: "Project name is required" }
  }

  const name = rawName.trim()

  // Rename has no default: an empty new name is a client error.
  if (!name) {
    return { ok: false, error: "Project name cannot be empty" }
  }

  if (name.length > PROJECT_NAME_MAX_LENGTH) {
    return { ok: false, error: `Project name must be ${PROJECT_NAME_MAX_LENGTH} characters or fewer` }
  }

  return { ok: true, value: { name } }
}
