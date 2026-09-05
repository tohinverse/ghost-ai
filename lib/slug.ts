/**
 * Turns a project name into a URL-safe slug. Used for the live preview in the
 * create dialog and, later, for project routing.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * A short, collision-resistant suffix appended to a project's slug. Kept to the
 * slug charset (lowercase alphanumerics) so the result stays URL- and
 * room-ID-safe.
 */
export function shortSuffix(length: number = 6): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")
}

/**
 * Builds the project's room ID from its name. This value is used as BOTH the
 * project's database ID and its Liveblocks room ID, so the two stay aligned by
 * construction. Falls back to `project` when the name slugifies to nothing
 * (e.g. a name of only punctuation or non-Latin characters).
 */
export function buildProjectRoomId(name: string): string {
  const slug = slugify(name) || "project"

  return `${slug}-${shortSuffix()}`
}
