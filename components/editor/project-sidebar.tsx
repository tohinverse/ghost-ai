"use client"

import { Plus, X } from "lucide-react"

import { ProjectListItem } from "@/components/editor/project-list-item"
import { useProjectDialogActions } from "@/components/editor/project-dialogs-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_OWNED_PROJECTS, MOCK_SHARED_PROJECTS } from "@/lib/mock-projects"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { openCreate, openRename, openDelete } = useProjectDialogActions()

  return (
    <>
      {/* Mobile scrim — tapping outside the sidebar closes it. */}
      {isOpen && (
        <div
          className="fixed inset-0 top-14 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 flex w-80 flex-col border-r border-surface-border bg-bg-surface/95 backdrop-blur-sm transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border px-4">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex flex-1 flex-col overflow-hidden px-4 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex-1 overflow-y-auto">
            {MOCK_OWNED_PROJECTS.length > 0 ? (
              <div className="flex flex-col gap-0.5 py-2">
                {MOCK_OWNED_PROJECTS.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    onRename={openRename}
                    onDelete={openDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-copy-muted">No projects yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared" className="flex-1 overflow-y-auto">
            {MOCK_SHARED_PROJECTS.length > 0 ? (
              <div className="flex flex-col gap-0.5 py-2">
                {MOCK_SHARED_PROJECTS.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    onRename={openRename}
                    onDelete={openDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-copy-muted">
                  Nothing shared with you yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-4">
          <Button className="w-full" onClick={openCreate}>
            <Plus data-icon="inline-start" className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
