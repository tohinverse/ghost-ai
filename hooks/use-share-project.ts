"use client"

import { useCallback, useEffect, useState } from "react"

import type { Collaborator } from "@/types/collaborator"

interface ShareProjectState {
  collaborators: Collaborator[]
  /** Whether the caller owns the project. Collaborators get a read-only list. */
  isOwner: boolean
  isLoading: boolean
  /** Failure from the initial load, which leaves the list unusable. */
  loadError: string | null
  email: string
  setEmail: (email: string) => void
  isInviting: boolean
  /** Failure from the last invite, cleared on the next attempt. */
  inviteError: string | null
  /** The collaborator currently being removed, or `null` when none is. */
  removingId: string | null
  /** Failure from the last removal, cleared on the next attempt. */
  removeError: string | null
  invite: () => Promise<void>
  remove: (collaboratorId: string) => Promise<void>
  /** Clears the form and any transient errors, so the next open starts clean. */
  reset: () => void
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
 * Owns the share dialog's collaborator list and its invite/remove mutations
 * against the collaborator routes.
 *
 * The list is fetched when the dialog opens rather than with the page: sharing
 * is an occasional action, and the fetch costs a Clerk lookup per collaborator.
 * `isOwner` comes back from the server with the list rather than being inferred
 * on the client, so the read-only mode matches what the API will actually
 * allow.
 */
export function useShareProject(projectId: string, isOpen: boolean): ShareProjectState {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    // Guards against a slow response from a previous open landing after the
    // dialog has been closed and reopened.
    let isCurrent = true

    const load = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        const response = await fetch(`/api/projects/${projectId}/collaborators`)

        if (!isCurrent) return

        if (!response.ok) {
          setLoadError(await readErrorMessage(response, "Could not load collaborators"))
          return
        }

        const body: { collaborators: Collaborator[]; isOwner: boolean } =
          await response.json()

        if (!isCurrent) return

        setCollaborators(body.collaborators)
        setIsOwner(body.isOwner)
      } catch {
        if (isCurrent) {
          setLoadError("Could not load collaborators")
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isCurrent = false
    }
  }, [isOpen, projectId])

  const invite = useCallback(async () => {
    const trimmed = email.trim()

    if (!trimmed || isInviting) return

    setIsInviting(true)
    setInviteError(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })

      if (!response.ok) {
        setInviteError(await readErrorMessage(response, "Could not invite that person"))
        return
      }

      const collaborator: Collaborator = await response.json()

      setCollaborators((current) => [...current, collaborator])
      setEmail("")
    } catch {
      setInviteError("Something went wrong. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }, [email, isInviting, projectId])

  const reset = useCallback(() => {
    setEmail("")
    setInviteError(null)
    setRemoveError(null)
  }, [])

  const remove = useCallback(
    async (collaboratorId: string) => {
      if (removingId) return

      setRemovingId(collaboratorId)
      setRemoveError(null)

      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          { method: "DELETE" }
        )

        if (!response.ok) {
          setRemoveError(await readErrorMessage(response, "Could not remove that person"))
          return
        }

        setCollaborators((current) =>
          current.filter((collaborator) => collaborator.id !== collaboratorId)
        )
      } catch {
        setRemoveError("Something went wrong. Please try again.")
      } finally {
        setRemovingId(null)
      }
    },
    [projectId, removingId]
  )

  return {
    collaborators,
    isOwner,
    isLoading,
    loadError,
    email,
    setEmail,
    isInviting,
    inviteError,
    removingId,
    removeError,
    invite,
    remove,
    reset,
  }
}
