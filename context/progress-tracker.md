# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Authentication (`context/feature-specs/03-auth.md`)

## Current Goal

- Define the next implementation unit (see Next Up).

## Completed

- Design system and UI primitives (`context/feature-specs/01-design-system.md`): shadcn/ui installed and configured, Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, `lucide-react` installed, `lib/utils.ts` with `cn()` in place, dark theme tokens wired into `app/globals.css`.
- Editor navbar and project sidebar shell (`context/feature-specs/02-editor.md`): `components/editor/editor-navbar.tsx` (fixed-height, left/center/right sections, `PanelLeftOpen`/`PanelLeftClose` toggle, dark bg with bottom border) and `components/editor/project-sidebar.tsx` (floating overlay that slides in from the left without pushing content, `isOpen`/`onClose` props, header with title + close button, shadcn `Tabs` for My Projects/Shared with empty placeholder states, full-width `New Project` button with `Plus` icon). Dialog pattern confirmed ready for future use — the existing `components/ui/dialog.tsx` (title/description/footer, `bg-popover`/`text-popover-foreground` tokens) already satisfies the spec; no new dialog component was built, per "do not build actual dialogs yet."
- Authentication (`context/feature-specs/03-auth.md`): `@clerk/ui` installed; `ClerkProvider` wraps the root layout in `app/layout.tsx` using Clerk's `dark` theme from `@clerk/ui/themes`, with `appearance.variables` mapped onto the app's CSS custom properties (`var(--bg-surface)`, `var(--accent-primary)`, `var(--text-primary)`, etc.) — no hardcoded colors. `proxy.ts` at the project root uses `clerkMiddleware` + `createRouteMatcher` to protect every route by default, with only the sign-in/sign-up paths (read from the env vars) public. Sign-in and sign-up live at catch-all routes `app/sign-in/[[...sign-in]]` and `app/sign-up/[[...sign-up]]`, sharing `components/auth/auth-layout.tsx` (two-panel on `lg`, form-only below; compact text logo, tagline, text-only feature list; no gradients, hero, or cards). `app/page.tsx` is now a server component that redirects to `/editor` when authenticated and `/sign-in` when not. Clerk's `UserButton` sits in the editor navbar's right section with default menu/profile flows untouched.
- Wired the navbar and sidebar into a reusable `components/editor/editor-shell.tsx` (owns sidebar open/close state, `"use client"`) rendered from a new `app/editor/page.tsx` route with a `Canvas coming soon` placeholder. Route naming/auth were not specified anywhere yet, so `/editor` is a placeholder location, not a final routing decision — revisit once project/auth routing is defined.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- `components/ui/dialog.tsx` uses `rounded-xl` for `DialogContent`, but `ui-context.md` specifies `rounded-3xl` for modal/overlay surfaces. Left untouched since it's a protected shadcn foundation component and no task has explicitly required the edit yet — revisit when the first real dialog is built.
- `03-auth.md` says to "define public routes using the existing sign-in and sign-up env vars" but `.env.local` only had `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` — no sign-in/sign-up URL vars existed yet. Resolved by adding Clerk's own standard variable names, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, to `.env.local`, since those are the canonical Clerk env var names (not invented) and `/sign-in` / `/sign-up` are the routes the spec itself defines. Revisit if this assumption is wrong.
- `/editor` remains a placeholder route from the editor-chrome phase; now protected by `proxy.ts` as a non-public route, but its final path (e.g. project-scoped like `/projects/[id]`) is still not defined by any spec.

## Architecture Decisions

- shadcn was initialized with the `base-nova` preset (CLI v4.19), which uses `@base-ui/react` primitives instead of Radix. Composition uses a `render={<Component />}` prop, not Radix's `asChild`, on components like `Dialog`/`DialogTrigger`. Keep this in mind when composing shadcn primitives elsewhere in the app.
- `globals.css` defines the exact hex tokens from `ui-context.md` (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) as the source of truth, then maps shadcn's semantic tokens (`--background`, `--primary`, `--border`, ...) onto them so `components/ui/*` render correctly unmodified. App-level code should prefer the UI-context Tailwind utility names (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, etc.), exposed via `@theme inline` aliases.
- The app is dark-only: `.dark` is applied unconditionally on `<html>` in `app/layout.tsx` (no theme toggle), and `.dark`/`:root` token values are identical.
- `globals.css` previously defined `--font-sans: var(--font-sans)` (self-referential), so `body { @apply font-sans }` never resolved and the whole app rendered in the browser's serif default. Fixed during the auth phase by pointing `--font-sans`/`--font-heading` at `--font-geist-sans` and adding `--font-mono: var(--font-geist-mono)`, matching the fonts `app/layout.tsx` already loads. This is app-wide, not auth-specific.
- Clerk appearance is configured once on `ClerkProvider` in the root layout rather than per-component, so every Clerk surface (auth pages, `UserButton`, profile flows) inherits the same tokens. Clerk's `Variables` are typed as plain strings, so `var(--token)` values pass through and resolve at runtime.
- Route protection is deny-by-default in `proxy.ts`: everything not matched by the sign-in/sign-up matcher requires `auth.protect()`. New public routes must be added to that matcher explicitly.

## Session Notes

- Auth verification (headless Chromium, dev server): signed-out `/` redirects to `/sign-in`, signed-out `/editor` redirects to `/sign-in` with a `redirect_url` param, and `/sign-in` + `/sign-up` load publicly with no console errors. Screenshots confirmed the two-panel layout, Geist Sans, and the cyan `--accent-primary` on Clerk's primary button. At 390px the left panel is correctly hidden (form only). `npm run build` and `eslint` both pass.
- The signed-in path (`/` → `/editor`, `UserButton` rendering in the navbar) has NOT been verified in a browser: Clerk's dev instance puts a Cloudflare bot check on sign-up, and minting a session via the Clerk backend API was blocked by tooling permissions. Worth a manual sign-in pass to confirm.
- Verified via a temporary route (`app/ds-check-tmp`, removed after verification) that all 7 components import and render with no console warnings, `cn()` merges classes correctly, and the rendered page uses only dark-theme tokens (confirmed visually via headless Chrome screenshot). `next build` and `eslint` both pass clean.
