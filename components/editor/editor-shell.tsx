"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-provider"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ProjectDialogsProvider>
      <div className="flex h-screen flex-col bg-bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ProjectDialogsProvider>
  )
}
