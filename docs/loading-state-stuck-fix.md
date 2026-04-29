# Loading State Stuck — Fix Status

**Date:** 2026-04-29  
**Resolves:** `docs/loading-state-stuck-diagnostic.md`

---

## Fix Applied

Added `setLoadingPromise(null)` immediately before the router navigation call in both submit handlers, so React clears the overlay before the route transition fires.

---

## Files Changed

| File | Change |
|---|---|
| `components/nav/TopNav.tsx` | `handleSuccess`: added `setLoadingPromise(null)` before `router.push` |
| `app/(app)/analyze/page.tsx` | `handleSuccess`: added `setLoadingPromise(null)` before `router.replace` |

---

## Tests Added

No existing test covered the post-redirect state cleanup. Two new test files were added:

| File | What it covers |
|---|---|
| `tests/components/nav/TopNav.redirect-cleanup.test.tsx` | Submits via TopNav, fires `onSuccess`, verifies loading overlay clears and `router.push` is called |
| `tests/components/analyze-page.redirect-cleanup.test.tsx` | Submits via AnalyzePage, fires `onSuccess`, verifies loading overlay clears and `router.replace` is called |

Both tests mock `AnalyzeLoadingState` to expose its `onSuccess` prop for direct invocation, bypassing the 12-second step timer. The test fails without the fix (loading overlay stays visible after `onSuccess`) and passes with it (overlay gone, form re-appears).

---

## Build and Test Results

- `npm run lint` — clean
- `npm run build` — clean (22 routes, no type errors)
- `npm test` — 246 passed (244 existing + 2 new)
