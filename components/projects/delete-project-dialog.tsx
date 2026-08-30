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
import type { Project } from "@/types/project"

interface DeleteProjectDialogProps {
  isOpen: boolean
  project: Project | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProjectDialog({
  isOpen,
  project,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            {project?.name ?? "This project"} and everything in it will be
            permanently deleted. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="rounded-b-3xl">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
