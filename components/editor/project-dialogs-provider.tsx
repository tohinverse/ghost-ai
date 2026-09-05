"use client"

import { createContext, useContext } from "react"

import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
import { RenameProjectDialog } from "@/components/projects/rename-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"

interface ProjectDialogsContextValue {
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
}

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(
  null
)

/**
 * Lets any client component below the editor shell open a project dialog
 * without threading callbacks through server-rendered page content.
 */
export function useProjectDialogActions(): ProjectDialogsContextValue {
  const context = useContext(ProjectDialogsContext)
  if (!context) {
    throw new Error(
      "useProjectDialogActions must be used within a ProjectDialogsProvider"
    )
  }
  return context
}

export function ProjectDialogsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const actions = useProjectActions()

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: actions.openCreate,
        openRename: actions.openRename,
        openDelete: actions.openDelete,
      }}
    >
      {children}

      <CreateProjectDialog
        isOpen={actions.openDialog === "create"}
        name={actions.name}
        roomId={actions.roomId}
        isSubmitting={actions.isSubmitting}
        error={actions.error}
        onNameChange={actions.setName}
        onClose={actions.closeDialog}
        onSubmit={actions.submit}
      />
      <RenameProjectDialog
        isOpen={actions.openDialog === "rename"}
        project={actions.activeProject}
        name={actions.name}
        isSubmitting={actions.isSubmitting}
        error={actions.error}
        onNameChange={actions.setName}
        onClose={actions.closeDialog}
        onSubmit={actions.submit}
      />
      <DeleteProjectDialog
        isOpen={actions.openDialog === "delete"}
        project={actions.activeProject}
        isSubmitting={actions.isSubmitting}
        error={actions.error}
        onClose={actions.closeDialog}
        onConfirm={actions.submit}
      />
    </ProjectDialogsContext.Provider>
  )
}
