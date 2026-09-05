"use client"

import { UserButton } from "@clerk/nextjs"
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  /** The open project's name. Absent on the editor home, which has no project. */
  projectName?: string
  /**
   * Workspace-only actions. Omitted together on the editor home, where there
   * is nothing to share and no canvas for the AI sidebar to act on.
   */
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onShare?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onShare,
}: EditorNavbarProps) {
  return (
    <nav className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border bg-bg-surface px-3">
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        {projectName && (
          <p className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </p>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {onToggleAiSidebar && (
          <>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 data-icon="inline-start" className="size-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleAiSidebar}
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
            >
              {isAiSidebarOpen ? (
                <PanelRightClose className="size-4" />
              ) : (
                <PanelRightOpen className="size-4" />
              )}
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </nav>
  )
}
