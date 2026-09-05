import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { CanvasPlaceholder } from "@/components/editor/canvas-placeholder"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { toProjects } from "@/lib/project-mapper"
import { getCurrentIdentity, hasProjectAccess } from "@/lib/project-access"
import {
  findProjectById,
  listProjectsForCollaborator,
  listProjectsForOwner,
  serializeProject,
} from "@/lib/projects"

/**
 * The project workspace. The route param is both the project ID and the
 * Liveblocks room ID — they are the same value by construction. Access is
 * resolved server-side before anything renders; the canvas itself lands in a
 * later unit.
 */
export default async function ProjectWorkspacePage(
  props: PageProps<"/editor/[projectId]">
) {
  const identity = await getCurrentIdentity()

  if (!identity.userId) {
    redirect("/sign-in")
  }

  const { projectId } = await props.params
  const project = await findProjectById(projectId)

  // A missing project and an unauthorized one render the same denial.
  if (!project || !(await hasProjectAccess(project, identity))) {
    return <AccessDenied />
  }

  const [owned, shared] = await Promise.all([
    listProjectsForOwner(identity.userId),
    identity.email
      ? listProjectsForCollaborator(identity.email)
      : Promise.resolve([]),
  ])

  return (
    <WorkspaceShell
      projectName={project.name}
      ownedProjects={toProjects(owned.map(serializeProject), true)}
      sharedProjects={toProjects(shared.map(serializeProject), false)}
    >
      <CanvasPlaceholder projectName={project.name} />
    </WorkspaceShell>
  )
}
