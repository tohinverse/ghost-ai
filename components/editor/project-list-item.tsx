"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

interface ProjectListItemProps {
  project: Project
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectListItem({
  project,
  onRename,
  onDelete,
}: ProjectListItemProps) {
  // The open workspace reads its own route param rather than taking a prop, so
  // the item highlights correctly under both /editor and /editor/[projectId].
  const { projectId } = useParams<{ projectId?: string }>()
  const isActive = projectId === project.id

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-bg-elevated",
        isActive && "bg-bg-elevated"
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className="min-w-0 flex-1"
        aria-current={isActive ? "page" : undefined}
      >
        <p
          className={cn(
            "truncate text-sm",
            isActive ? "text-brand" : "text-copy-primary"
          )}
        >
          {project.name}
        </p>
        <p className="truncate font-mono text-xs text-copy-muted">
          /{project.slug}
        </p>
      </Link>

      {/* Rename and delete are owner-only; shared projects show no actions. */}
      {project.isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${project.name}`}
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem onClick={() => onRename(project)}>
              <Pencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(project)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
