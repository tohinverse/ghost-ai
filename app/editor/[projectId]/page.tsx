import { notFound, redirect } from "next/navigation"

import { EditorShell } from "@/components/editor/editor-shell"
import { getCurrentUserEmail, getCurrentUserId } from "@/lib/auth"
import { toProjects } from "@/lib/project-mapper"
import {
  findProjectById,
  listProjectsForCollaborator,
  listProjectsForOwner,
  serializeProject,
} from "@/lib/projects"

/**
 * The project workspace. The canvas itself lands in a later unit — this route
 * exists so the create flow has a destination and the sidebar has a target.
 */
export default async function ProjectWorkspacePage(
  props: PageProps<"/editor/[projectId]">
) {
  const userId = await getCurrentUserId()

  if (!userId) {
    redirect("/sign-in")
  }

  const { projectId } = await props.params
  const email = await getCurrentUserEmail()

  const [project, owned, shared] = await Promise.all([
    findProjectById(projectId),
    listProjectsForOwner(userId),
    email ? listProjectsForCollaborator(email) : Promise.resolve([]),
  ])

  if (!project) {
    notFound()
  }

  const isMember =
    project.ownerId === userId ||
    shared.some((candidate) => candidate.id === project.id)

  if (!isMember) {
    notFound()
  }

  return (
    <EditorShell
      ownedProjects={toProjects(owned.map(serializeProject), true)}
      sharedProjects={toProjects(shared.map(serializeProject), false)}
    >
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="text-xl font-medium text-copy-primary">{project.name}</h1>
        <p className="font-mono text-xs text-copy-muted">/{project.id}</p>
        <p className="text-sm text-copy-muted">Canvas coming soon</p>
      </div>
    </EditorShell>
  )
}
