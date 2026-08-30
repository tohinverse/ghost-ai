"use client"

import { createContext, useContext } from "react"

import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
import { RenameProjectDialog } from "@/components/projects/rename-project-dialog"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
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
  const dialogs = useProjectDialogs()

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: dialogs.openCreate,
        openRename: dialogs.openRename,
        openDelete: dialogs.openDelete,
      }}
    >
      {children}

      <CreateProjectDialog
        isOpen={dialogs.openDialog === "create"}
        name={dialogs.name}
        isSubmitting={dialogs.isSubmitting}
        onNameChange={dialogs.setName}
        onClose={dialogs.closeDialog}
        onSubmit={dialogs.submit}
      />
      <RenameProjectDialog
        isOpen={dialogs.openDialog === "rename"}
        project={dialogs.activeProject}
        name={dialogs.name}
        isSubmitting={dialogs.isSubmitting}
        onNameChange={dialogs.setName}
        onClose={dialogs.closeDialog}
        onSubmit={dialogs.submit}
      />
      <DeleteProjectDialog
        isOpen={dialogs.openDialog === "delete"}
        project={dialogs.activeProject}
        isSubmitting={dialogs.isSubmitting}
        onClose={dialogs.closeDialog}
        onConfirm={dialogs.submit}
      />
    </ProjectDialogsContext.Provider>
  )
}
