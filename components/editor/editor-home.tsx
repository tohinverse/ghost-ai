"use client"

import { Plus } from "lucide-react"

import { useProjectDialogActions } from "@/components/editor/project-dialogs-provider"
import { Button } from "@/components/ui/button"

export function EditorHome() {
  const { openCreate } = useProjectDialogActions()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-medium text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="max-w-md text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the
        sidebar.
      </p>
      <Button onClick={openCreate}>
        <Plus data-icon="inline-start" className="size-4" />
        New Project
      </Button>
    </div>
  )
}
