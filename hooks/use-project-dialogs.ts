"use client"

import { useCallback, useState } from "react"

import type { Project } from "@/types/project"

export type ProjectDialog = "create" | "rename" | "delete"

interface ProjectDialogsState {
  /** Which dialog is currently open, or `null` when all are closed. */
  openDialog: ProjectDialog | null
  /** The project the rename/delete dialogs are acting on. */
  activeProject: Project | null
  /** Shared name field for the create and rename forms. */
  name: string
  isSubmitting: boolean
  setName: (name: string) => void
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
  closeDialog: () => void
  /** Marks the dialog busy while a submit is in flight, then closes it. */
  submit: () => Promise<void>
}

/**
 * Owns dialog, form, and loading state for the project create/rename/delete
 * flows. No persistence yet — `submit` only drives the loading state and
 * closes the dialog. Replace its body with the real mutation when the project
 * API routes land.
 */
export function useProjectDialogs(): ProjectDialogsState {
  const [openDialog, setOpenDialog] = useState<ProjectDialog | null>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openCreate = useCallback(() => {
    setActiveProject(null)
    setName("")
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: Project) => {
    setActiveProject(project)
    setName(project.name)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project)
    setName("")
    setOpenDialog("delete")
  }, [])

  const closeDialog = useCallback(() => {
    setOpenDialog(null)
    setActiveProject(null)
    setName("")
  }, [])

  const submit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // No API calls or persistence in this unit.
    } finally {
      setIsSubmitting(false)
      setOpenDialog(null)
      setActiveProject(null)
      setName("")
    }
  }, [])

  return {
    openDialog,
    activeProject,
    name,
    isSubmitting,
    setName,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submit,
  }
}
