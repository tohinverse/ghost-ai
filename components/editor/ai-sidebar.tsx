import { Sparkles } from "lucide-react"

/**
 * Right-hand placeholder for the AI chat panel. No chat behavior yet — this
 * reserves the layout slot the workspace navbar's toggle controls.
 */
export function AiSidebar() {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-surface-border bg-bg-surface">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-surface-border px-4">
        <Sparkles className="size-4 text-ai-text" />
        <h2 className="text-sm font-medium text-copy-primary">AI Assistant</h2>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-copy-muted">AI chat coming soon</p>
      </div>
    </aside>
  )
}
