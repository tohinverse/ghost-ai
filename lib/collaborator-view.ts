import type { ProjectCollaborator } from "@/app/generated/prisma/client"

import { getCollaboratorProfiles } from "@/lib/collaborator-profiles"
import type { Collaborator } from "@/types/collaborator"

/**
 * Joins stored collaborator rows to their Clerk display data. This is the one
 * place the two sources meet: the database supplies identity (id, email) and
 * Clerk supplies presentation (name, avatar), with the email standing alone
 * whenever Clerk has no account for it.
 */
export async function toCollaborators(
  rows: ProjectCollaborator[]
): Promise<Collaborator[]> {
  const profiles = await getCollaboratorProfiles(rows.map((row) => row.email))

  return rows.map((row) => {
    const profile = profiles.get(row.email)

    return {
      id: row.id,
      email: row.email,
      name: profile?.name ?? null,
      imageUrl: profile?.imageUrl ?? null,
    }
  })
}
