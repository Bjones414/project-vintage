# Four-Step Loading State — Status Report

**Commit:** 4394530  
**Date:** 2026-04-29

## What changed

### components/analyze/AnalyzeLoadingState.tsx (new)
Shared full-page loading overlay. Props: `promise: Promise<string>`, `onSuccess`, `onError`.

- 4 steps: Identifying → Parsing → Pulling comparable sales → Generating
- Steps advance on paced timers: 0-2s / 2-5s / 5-9s / 9-12s
- Navigation fires only after BOTH the API promise resolves AND step 4 timer completes
- If API is slower than 12s, navigation fires as soon as the API resolves after step 4 is done
- Indicators: amber pulse (active), green ✓ (complete), grey dot (pending)
- `animate-pulse` with `motion-reduce:animate-none` on active dot

### app/(app)/analyze/page.tsx
- Replaced direct `setLoading(true)` → `router.replace()` pattern with `AnalyzeLoadingState`
- Form is replaced by the loading state on submit; re-shown if `onError` fires
- Removed `loading` state and `disabled` button; `urlRef` used to capture URL at submit time

### components/nav/TopNav.tsx
- Replaced inline spinner with `AnalyzeLoadingState`
- Removed the TODO comment pointing to this loading state (sequence item 6)
- `loadingPromise` state replaces `loading` boolean

## Tests added

`tests/components/analyze/AnalyzeLoadingState.test.tsx` — 8 cases (happy-dom environment):
- All four steps rendered on mount
- Step 1 active (amber) on mount, steps 2-4 pending
- Active dot has `animate-pulse` and `motion-reduce:animate-none`
- Step 2 becomes active / step 1 complete after 2000ms (via fake timers)
- `onSuccess` NOT called before step 4 timer even if promise resolves first
- `onSuccess` called after step 4 timer when promise already resolved
- `onError` called on promise rejection; `onSuccess` not called
- Existing `analyze-page.test.tsx` and `TopNav.test.tsx` updated to expect loading state appearance rather than direct navigation (navigation timing is now covered by `AnalyzeLoadingState.test.tsx`)

## Build / lint / test

All three pass. 244 tests.

## TODOs planted

None. The TODO in TopNav.tsx was removed.

## Unexpected

- `getByText` in Testing Library matched both `<li>` and inner `<span>` elements (both have the same text content). Used `getAllByText(...).find(el => el.tagName === 'SPAN')` and container-scoped `querySelectorAll` to avoid multiple-match errors.
