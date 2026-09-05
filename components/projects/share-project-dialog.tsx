"use client"

import { Check, Link2 } from "lucide-react"

import { CollaboratorRow } from "@/components/projects/collaborator-row"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCopyLink } from "@/hooks/use-copy-link"
import { useShareProject } from "@/hooks/use-share-project"

interface ShareProjectDialogProps {
  isOpen: boolean
  projectId: string
  projectName: string
  onClose: () => void
}

/**
 * Project sharing. The owner invites and removes collaborators and copies the
 * project link; a collaborator sees the same list read-only, with no invite
 * field and no remove controls. `isOwner` is decided by the API rather than the
 * client, so what renders matches what the server would permit.
 */
export function ShareProjectDialog({
  isOpen,
  projectId,
  projectName,
  onClose,
}: ShareProjectDialogProps) {
  const {
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
  } = useShareProject(projectId, isOpen)

  // The form and its transient errors are cleared on the way out rather than
  // on the way in, so the next open starts clean without an effect doing it.
  const close = () => {
    reset()
    onClose()
  }

  // Built in the browser so the link carries whatever origin the app is
  // actually served from.
  const projectUrl =
    typeof window === "undefined" ? "" : `${window.location.origin}/editor/${projectId}`

  const { isCopied, copy } = useCopyLink(projectUrl)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? `Invite people to collaborate on ${projectName}.`
              : `People with access to ${projectName}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isOwner && (
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                void invite()
              }}
            >
              <Label htmlFor="share-project-email">Invite by email</Label>
              <div className="flex gap-2">
                <Input
                  id="share-project-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teammate@example.com"
                  disabled={isInviting}
                  className="flex-1"
                />
                <Button type="submit" disabled={!email.trim() || isInviting}>
                  {isInviting ? "Inviting…" : "Invite"}
                </Button>
              </div>
              {inviteError && (
                <p className="text-sm text-destructive">{inviteError}</p>
              )}
            </form>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-copy-primary">
              People with access
            </p>

            {isLoading ? (
              <p className="px-2 py-2 text-sm text-copy-muted">Loading…</p>
            ) : loadError ? (
              <p className="px-2 py-2 text-sm text-destructive">{loadError}</p>
            ) : collaborators.length > 0 ? (
              <ul className="flex max-h-64 flex-col overflow-y-auto">
                {collaborators.map((collaborator) => (
                  <CollaboratorRow
                    key={collaborator.id}
                    collaborator={collaborator}
                    canRemove={isOwner}
                    isRemoving={removingId === collaborator.id}
                    onRemove={remove}
                  />
                ))}
              </ul>
            ) : (
              <p className="px-2 py-2 text-sm text-copy-muted">
                No collaborators yet
              </p>
            )}

            {removeError && (
              <p className="px-2 text-sm text-destructive">{removeError}</p>
            )}
          </div>

          {/* Copying the link is an owner action; the Done button is not. */}
          <div className="flex items-center justify-between border-t border-surface-border pt-4">
            {isOwner ? (
              <Button variant="ghost" size="sm" onClick={() => void copy()}>
                {isCopied ? (
                  <Check data-icon="inline-start" className="size-4" />
                ) : (
                  <Link2 data-icon="inline-start" className="size-4" />
                )}
                {isCopied ? "Copied!" : "Copy link"}
              </Button>
            ) : (
              <span />
            )}
            <Button variant="outline" onClick={close}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
