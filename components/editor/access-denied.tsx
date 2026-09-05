import Link from "next/link"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Shown for a project the caller cannot open — whether it does not exist or
 * simply is not theirs. Both cases render identically so the page never
 * confirms that an unknown project ID belongs to someone else.
 */
export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-base px-6 text-center">
      <Lock className="size-8 text-copy-muted" />
      <h1 className="text-xl font-medium text-copy-primary">
        You don&apos;t have access to this project
      </h1>
      <p className="max-w-md text-sm text-copy-muted">
        It may have been deleted, or you may not have been invited to it.
      </p>
      {/*
        `nativeButton={false}` tells Base UI the rendered element is an anchor,
        not a <button> — without it the primitive warns about lost button
        semantics.
      */}
      <Button nativeButton={false} render={<Link href="/editor" />}>
        Back to projects
      </Button>
    </div>
  )
}
