"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const COPIED_FEEDBACK_MS = 2000

interface CopyLinkState {
  /** True for a short window after a successful copy, driving the `Copied!` label. */
  isCopied: boolean
  copy: () => Promise<void>
}

/**
 * Copies a value to the clipboard and flips `isCopied` for a couple of seconds.
 * The timer is cleared on unmount so a dialog closed mid-feedback does not set
 * state on an unmounted component.
 */
export function useCopyLink(value: string): CopyLinkState {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard access can be denied; there is nothing to report beyond not
      // showing the confirmation.
      return
    }

    setIsCopied(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
  }, [value])

  return { isCopied, copy }
}
