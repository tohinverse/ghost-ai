/**
 * Holds the canvas area until Liveblocks and React Flow mount here. It fills
 * whatever space the workspace layout gives it.
 */
export function CanvasPlaceholder({ projectName }: { projectName: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-bg-base px-6 text-center">
      <p className="text-sm text-copy-secondary">{projectName}</p>
      <p className="text-sm text-copy-muted">Canvas coming soon</p>
    </div>
  )
}
