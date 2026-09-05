"use client"

import { useState } from "react"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-provider"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareProjectDialog } from "@/components/projects/share-project-dialog"
import type { Project } from "@/types/project"

interface WorkspaceShellProps {
  children: React.ReactNode
  /** The open project. Its ID is what the share dialog invites against. */
  projectId: string
  projectName: string
  ownedProjects: Project[]
  sharedProjects: Project[]
}

/**
 * Full-viewport workspace layout: navbar on top, the project sidebar overlaying
 * from the left, the canvas filling the remaining space, and the AI sidebar
 * docked on the right. The editor home keeps using `EditorShell`, which has no
 * project context and no canvas.
 */
export function WorkspaceShell({
  children,
  projectId,
  projectName,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <ProjectDialogsProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          projectName={projectName}
          isAiSidebarOpen={isAiSidebarOpen}
          onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
          onShare={() => setIsShareOpen(true)}
        />

        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-hidden">{children}</main>
          {isAiSidebarOpen && <AiSidebar />}
        </div>

        <ShareProjectDialog
          isOpen={isShareOpen}
          projectId={projectId}
          projectName={projectName}
          onClose={() => setIsShareOpen(false)}
        />
      </div>
    </ProjectDialogsProvider>
  )
}
