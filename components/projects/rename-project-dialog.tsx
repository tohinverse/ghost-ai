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
import type { Project } from "@/types/project"

interface RenameProjectDialogProps {
  isOpen: boolean
  project: Project | null
  name: string
  isSubmitting: boolean
  error: string | null
  onNameChange: (name: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function RenameProjectDialog({
  isOpen,
  project,
  name,
  isSubmitting,
  error,
  onNameChange,
  onClose,
  onSubmit,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Currently named {project?.name ?? "this project"}.
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
            <Label htmlFor="rename-project-name">Project name</Label>
            <Input
              id="rename-project-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              autoFocus
              disabled={isSubmitting}
            />
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
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
