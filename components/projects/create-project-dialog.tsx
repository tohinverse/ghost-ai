"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateProjectDialogProps {
  isOpen: boolean
  name: string
  /** The ID the project will be created with, previewed as the user types. */
  roomId: string
  isSubmitting: boolean
  error: string | null
  onNameChange: (name: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function CreateProjectDialog({
  isOpen,
  name,
  roomId,
  isSubmitting,
  error,
  onNameChange,
  onClose,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Name your architecture workspace. You can rename it later.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (name.trim()) onSubmit()
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-project-name">Project name</Label>
            <Input
              id="create-project-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Payments Platform"
              autoFocus
              disabled={isSubmitting}
            />
            <p className="font-mono text-xs text-copy-muted">
              {name.trim() ? `/${roomId}` : "Room ID preview appears as you type"}
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="rounded-b-3xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
