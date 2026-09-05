"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Collaborator } from "@/types/collaborator"

interface CollaboratorRowProps {
  collaborator: Collaborator
  /** Only the owner gets a remove control; collaborators see the list alone. */
  canRemove: boolean
  isRemoving: boolean
  onRemove: (collaboratorId: string) => void
}

/**
 * The initial shown while Clerk has no avatar for the collaborator. Falls back
 * to the email when there is no name either, so the badge is never blank.
 */
function initialOf(collaborator: Collaborator): string {
  const source = collaborator.name ?? collaborator.email

  return source.charAt(0).toUpperCase()
}

export function CollaboratorRow({
  collaborator,
  canRemove,
  isRemoving,
  onRemove,
}: CollaboratorRowProps) {
  // Clerk supplies neither for an email with no account, in which case the
  // address is the only thing there is to show.
  const hasName = collaborator.name !== null

  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-2">
      {collaborator.imageUrl ? (
        // Clerk serves avatars from its own CDN; `next/image` would need that
        // host allowlisted for no gain at this size.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={collaborator.imageUrl}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-xs font-medium text-copy-secondary"
        >
          {initialOf(collaborator)}
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {hasName ? (
          <>
            <span className="truncate text-sm text-copy-primary">
              {collaborator.name}
            </span>
            <span className="truncate text-xs text-copy-muted">
              {collaborator.email}
            </span>
          </>
        ) : (
          <span className="truncate text-sm text-copy-primary">
            {collaborator.email}
          </span>
        )}
      </div>

      {canRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(collaborator.id)}
          disabled={isRemoving}
          aria-label={`Remove ${collaborator.name ?? collaborator.email}`}
        >
          <X className="size-4" />
        </Button>
      )}
    </li>
  )
}
