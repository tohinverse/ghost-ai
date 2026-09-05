import { redirect } from "next/navigation"

import { EditorHome } from "@/components/editor/editor-home"
import { EditorShell } from "@/components/editor/editor-shell"
import { getCurrentUserEmail, getCurrentUserId } from "@/lib/auth"
import { toProjects } from "@/lib/project-mapper"
import {
  listProjectsForCollaborator,
  listProjectsForOwner,
  serializeProject,
} from "@/lib/projects"

/**
 * Server component: owned and shared projects are read straight from the data
 * layer and handed to the sidebar. There is no client-side fetch on first load.
 */
export default async function EditorPage() {
  const userId = await getCurrentUserId()

  if (!userId) {
    redirect("/sign-in")
  }

  const email = await getCurrentUserEmail()

  const [owned, shared] = await Promise.all([
    listProjectsForOwner(userId),
    email ? listProjectsForCollaborator(email) : Promise.resolve([]),
  ])

  return (
    <EditorShell
      ownedProjects={toProjects(owned.map(serializeProject), true)}
      sharedProjects={toProjects(shared.map(serializeProject), false)}
    >
      <EditorHome />
    </EditorShell>
  )
}
