# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Design system setup

## Current Goal

- Define the next implementation unit (see Next Up).

## Completed

- Design system and UI primitives (`context/feature-specs/01-design-system.md`): shadcn/ui installed and configured, Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, `lucide-react` installed, `lib/utils.ts` with `cn()` in place, dark theme tokens wired into `app/globals.css`.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn was initialized with the `base-nova` preset (CLI v4.19), which uses `@base-ui/react` primitives instead of Radix. Composition uses a `render={<Component />}` prop, not Radix's `asChild`, on components like `Dialog`/`DialogTrigger`. Keep this in mind when composing shadcn primitives elsewhere in the app.
- `globals.css` defines the exact hex tokens from `ui-context.md` (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) as the source of truth, then maps shadcn's semantic tokens (`--background`, `--primary`, `--border`, ...) onto them so `components/ui/*` render correctly unmodified. App-level code should prefer the UI-context Tailwind utility names (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, etc.), exposed via `@theme inline` aliases.
- The app is dark-only: `.dark` is applied unconditionally on `<html>` in `app/layout.tsx` (no theme toggle), and `.dark`/`:root` token values are identical.

## Session Notes

- Verified via a temporary route (`app/ds-check-tmp`, removed after verification) that all 7 components import and render with no console warnings, `cn()` merges classes correctly, and the rendered page uses only dark-theme tokens (confirmed visually via headless Chrome screenshot). `next build` and `eslint` both pass clean.
