# Top Nav — Implementation Status

**Status:** Complete  
**Date:** 2026-04-29

## Component location

`components/nav/TopNav.tsx` — `'use client'` component. Receives `userEmail: string | null` as a prop from the server layout.

## Layout integration

`app/(app)/layout.tsx` — upgraded from placeholder to an async Server Component that calls `supabase.auth.getUser()` and passes `user?.email ?? null` to `<TopNav>`. This is the only layout change made; no other layouts were touched.

## Where it renders / doesn't render

| Route | Renders? | Reason |
|-------|----------|--------|
| `/analyze` | No | `usePathname() === '/analyze'` check inside TopNav returns null |
| `/analyze/[id]` | Yes | Under `(app)`, pathname doesn't match `/analyze` exactly |
| `/dashboard`, `/account`, `/garage`, `/alerts`, `/search` | Yes | All under `(app)` |
| `/` (root marketing page) | No | Outside `(app)` route group — root layout has no TopNav |
| `/login`, `/signup` | No | Under `(auth)` route group, different layout |

The `/analyze` exclusion is handled inside the component via `usePathname()` — no layout restructuring or page moves required.

## Anonymous vs signed-in

- **Anonymous (`userEmail = null`):** URL field is shown and functional (1 free analysis). Right cluster shows a "Sign in" text link to `/login`.
- **Signed in (`userEmail` present):** Right cluster shows initials avatar (first 2 chars of email, uppercase). Clicking opens a dropdown stub with "Account" (→ `/account`) and "Sign out" (calls `supabase.auth.signOut()` then pushes to `/login`).

## TODO planted

`components/nav/TopNav.tsx` line 37:
```
// TODO: smooth transition into /analyze/[id] — results shouldn't pop in cold. Coordinate with the four-step progressive loading state (sequence item 6).
```

## Build / lint / tests

- `npm run build` — passed (22 pages, 0 errors)
- `npm run lint` — no warnings or errors
- `npx vitest run` — 132 tests passed, 0 failed (7 new TopNav tests in `tests/components/nav/TopNav.test.tsx`)
