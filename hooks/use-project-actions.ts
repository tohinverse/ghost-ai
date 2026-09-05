"use client"

import { useParams, useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { shortSuffix, slugify } from "@/lib/slug"
import type { Project } from "@/types/project"

export type ProjectDialog = "create" | "rename" | "delete"

interface ProjectActionsState {
  /** Which dialog is currently open, or `null` when all are closed. */
  openDialog: ProjectDialog | null
  /** The project the rename/delete dialogs are acting on. */
  activeProject: Project | null
  /** Shared name field for the create and rename forms. */
  name: string
  /** The room ID the create dialog previews and will submit. */
  roomId: string
  isSubmitting: boolean
  /** Message from the last failed mutation, cleared on the next attempt. */
  error: string | null
  setName: (name: string) => void
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
  closeDialog: () => void
  /** Runs the mutation for whichever dialog is open. */
  submit: () => Promise<void>
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body: unknown = await response.json()

    if (typeof body === "object" && body !== null && "error" in body) {
      const message = (body as { error: unknown }).error

      if (typeof message === "string" && message) {
        return message
      }
    }
  } catch {
    // Fall through to the generic message below.
  }

  return fallback
}

/**
 * Owns dialog state and the project create/rename/delete mutations against the
 * project REST routes.
 *
 * The room ID is generated once when the create dialog opens rather than
 * derived from the name on submit, so the ID the user previews is exactly the
 * one that gets persisted. It is sent as the project's `id`, which keeps the
 * project ID and the Liveblocks room ID aligned.
 */
export function useProjectActions(): ProjectActionsState {
  const router = useRouter()
  const params = useParams<{ projectId?: string }>()
  const activeProjectId = params?.projectId

  const [openDialog, setOpenDialog] = useState<ProjectDialog | null>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [name, setNameState] = useState("")
  // Held separately from the room ID so it survives every keystroke: the user
  // must see the same suffix that ultimately gets persisted.
  const [suffix, setSuffix] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The slug half tracks the name; the suffix half is fixed for the life of
  // the dialog, so the previewed ID is the one that gets created.
  const roomId = suffix ? `${slugify(name) || "project"}-${suffix}` : ""

  const setName = useCallback((next: string) => {
    setNameState(next)
  }, [])

  const reset = useCallback(() => {
    setOpenDialog(null)
    setActiveProject(null)
    setNameState("")
    setSuffix("")
    setError(null)
  }, [])

  const openCreate = useCallback(() => {
    setActiveProject(null)
    setNameState("")
    setSuffix(shortSuffix())
    setError(null)
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: Project) => {
    setActiveProject(project)
    setNameState(project.name)
    setSuffix("")
    setError(null)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project)
    setNameState("")
    setSuffix("")
    setError(null)
    setOpenDialog("delete")
  }, [])

  const closeDialog = useCallback(() => {
    reset()
  }, [reset])

  const create = useCallback(async () => {
    const trimmed = name.trim()

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: roomId, name: trimmed }),
    })

    if (!response.ok) {
      setError(await readErrorMessage(response, "Could not create the project"))
      return
    }

    const project: { id: string } = await response.json()

    reset()
    router.push(`/editor/${project.id}`)
  }, [name, roomId, reset, router])

  const rename = useCallback(async () => {
    if (!activeProject) return

    const response = await fetch(`/api/projects/${activeProject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!response.ok) {
      setError(await readErrorMessage(response, "Could not rename the project"))
      return
    }

    reset()
    router.refresh()
  }, [activeProject, name, reset, router])

  const remove = useCallback(async () => {
    if (!activeProject) return

    const response = await fetch(`/api/projects/${activeProject.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      setError(await readErrorMessage(response, "Could not delete the project"))
      return
    }

    // Deleting the workspace currently open would leave the user on a route
    // that no longer resolves, so leave for the editor home instead.
    const wasActiveWorkspace = activeProject.id === activeProjectId

    reset()

    if (wasActiveWorkspace) {
      router.push("/editor")
    } else {
      router.refresh()
    }
  }, [activeProject, activeProjectId, reset, router])

  const submit = useCallback(async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (openDialog === "create") {
        await create()
      } else if (openDialog === "rename") {
        await rename()
      } else if (openDialog === "delete") {
        await remove()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [create, isSubmitting, openDialog, remove, rename])

  return {
    openDialog,
    activeProject,
    name,
    roomId,
    isSubmitting,
    error,
    setName,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submit,
  }
}
