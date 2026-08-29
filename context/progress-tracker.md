# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor chrome (`context/feature-specs/02-editor.md`)

## Current Goal

- Define the next implementation unit (see Next Up).

## Completed

- Design system and UI primitives (`context/feature-specs/01-design-system.md`): shadcn/ui installed and configured, Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, `lucide-react` installed, `lib/utils.ts` with `cn()` in place, dark theme tokens wired into `app/globals.css`.
- Editor navbar and project sidebar shell (`context/feature-specs/02-editor.md`): `components/editor/editor-navbar.tsx` (fixed-height, left/center/right sections, `PanelLeftOpen`/`PanelLeftClose` toggle, dark bg with bottom border) and `components/editor/project-sidebar.tsx` (floating overlay that slides in from the left without pushing content, `isOpen`/`onClose` props, header with title + close button, shadcn `Tabs` for My Projects/Shared with empty placeholder states, full-width `New Project` button with `Plus` icon). Dialog pattern confirmed ready for future use — the existing `components/ui/dialog.tsx` (title/description/footer, `bg-popover`/`text-popover-foreground` tokens) already satisfies the spec; no new dialog component was built, per "do not build actual dialogs yet."
- Wired the navbar and sidebar into a reusable `components/editor/editor-shell.tsx` (owns sidebar open/close state, `"use client"`) rendered from a new `app/editor/page.tsx` route with a `Canvas coming soon` placeholder. Route naming/auth were not specified anywhere yet, so `/editor` is a placeholder location, not a final routing decision — revisit once project/auth routing is defined.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- `components/ui/dialog.tsx` uses `rounded-xl` for `DialogContent`, but `ui-context.md` specifies `rounded-3xl` for modal/overlay surfaces. Left untouched since it's a protected shadcn foundation component and no task has explicitly required the edit yet — revisit when the first real dialog is built.
- No spec yet defines the real editor route path (e.g. project-scoped like `/projects/[id]`) or auth protection for it. `/editor` was used as a placeholder route per explicit instruction; confirm final routing once `project-overview.md`'s "project workspace" flow is scoped in a feature spec.

## Architecture Decisions

- shadcn was initialized with the `base-nova` preset (CLI v4.19), which uses `@base-ui/react` primitives instead of Radix. Composition uses a `render={<Component />}` prop, not Radix's `asChild`, on components like `Dialog`/`DialogTrigger`. Keep this in mind when composing shadcn primitives elsewhere in the app.
- `globals.css` defines the exact hex tokens from `ui-context.md` (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) as the source of truth, then maps shadcn's semantic tokens (`--background`, `--primary`, `--border`, ...) onto them so `components/ui/*` render correctly unmodified. App-level code should prefer the UI-context Tailwind utility names (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, etc.), exposed via `@theme inline` aliases.
- The app is dark-only: `.dark` is applied unconditionally on `<html>` in `app/layout.tsx` (no theme toggle), and `.dark`/`:root` token values are identical.

## Session Notes

- Verified via a temporary route (`app/ds-check-tmp`, removed after verification) that all 7 components import and render with no console warnings, `cn()` merges classes correctly, and the rendered page uses only dark-theme tokens (confirmed visually via headless Chrome screenshot). `next build` and `eslint` both pass clean.
