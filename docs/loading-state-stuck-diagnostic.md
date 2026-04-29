# Loading State Stuck — Diagnostic Report

**Date:** 2026-04-29  
**Status:** Diagnosed, not yet fixed

---

## Symptom

After submitting a URL (via TopNav search bar or landing form), the four-step loading animation completes, the URL changes to `/analyze/[id]`, and the API returns 200 with page data. But the loading overlay remains visible and blocks the analyze page content. Hard refresh on `/analyze/[id]` renders correctly.

---

## Root Cause

**`loadingPromise` is never cleared after a successful navigation.**

Both submit handlers (`TopNav` and `AnalyzePage`) call `router.push()` / `router.replace()` inside `onSuccess` but never call `setLoadingPromise(null)`. The state persists across the route transition, and because `TopNav` lives in the persistent `(app)` layout, it re-renders on the new route with `loadingPromise` still set — immediately mounting `AnalyzeLoadingState` again, which covers all page content with a `fixed inset-0 z-50` overlay.

Hard refresh works because it destroys the full React tree and resets all component state.

---

## Component Inventory

### `AnalyzeLoadingState`
**File:** `components/analyze/AnalyzeLoadingState.tsx`

- Props: `promise`, `onSuccess`, `onError`
- Renders a `fixed inset-0 z-50` full-screen white overlay — nothing beneath it is interactive or visible.
- **Effect 1 (lines 40–73):** Four `setTimeout` calls advance the visual step states on a hardcoded schedule (2 s, 5 s, 9 s, 12 s). These timers are independent of API completion.
- **Effect 2 (lines 76–93):** Resolves `promise` and calls `onSuccess` / `onError` only after *both* conditions are true: (a) the promise has settled and (b) the 12-second step timer has fired. The component itself has no logic to remove itself from the DOM — unmounting is entirely the parent's responsibility.
- The component never clears its own parent's state.

### `TopNav`
**File:** `components/nav/TopNav.tsx`

- Local state (line 18): `const [loadingPromise, setLoadingPromise] = useState<Promise<string> | null>(null)`
- On submit (lines 27–31): sets `loadingPromise` → overlay appears.
- `handleSuccess` (lines 34–36): calls `router.push('/analyze/${listingId}')`. **Does not call `setLoadingPromise(null)`.**
- `handleError` (lines 38–41): calls `setLoadingPromise(null)` → overlay hides correctly on error.
- Conditional render (lines 51–59): if `loadingPromise` is truthy, returns `<AnalyzeLoadingState>` instead of the normal nav.

### `AnalyzePage` (landing form)
**File:** `app/(app)/analyze/page.tsx`

- Identical state structure (line 11): `const [loadingPromise, setLoadingPromise] = useState<Promise<string> | null>(null)`
- `handleSuccess` (lines 23–25): calls `router.replace('/analyze/${listingId}')`. **Does not call `setLoadingPromise(null)`.**
- `handleError` (lines 27–30): calls `setLoadingPromise(null)` correctly.
- Conditional render (lines 32–39): same pattern as TopNav.

---

## Mount Points and Layout Hierarchy

```
app/layout.tsx                          ← root layout (no TopNav)
└── app/(app)/layout.tsx                ← (app) group layout — mounts <TopNav />
    ├── app/(app)/analyze/page.tsx      ← landing form (mounts its own AnalyzeLoadingState)
    └── app/(app)/analyze/[id]/page.tsx ← detail page (server component, no loading state)
```

**`TopNav` is mounted in the persistent `(app)` layout.** It is never unmounted during client-side navigation within the `(app)` route group. Its local state therefore survives the route change from `/analyze` → `/analyze/[id]`.

There is no intermediate layout between `(app)/layout.tsx` and `analyze/[id]/page.tsx`, so no layout boundary resets TopNav state during the transition.

---

## Failure Sequence (Step by Step)

1. User submits a URL via TopNav.
2. `setLoadingPromise(promise)` → TopNav renders `<AnalyzeLoadingState>` (overlay on).
3. Four visual step timers run to completion (~12 seconds).
4. API promise resolves; `onSuccess` fires.
5. `handleSuccess` calls `router.push('/analyze/${id}')`. **`loadingPromise` is still set.**
6. Next.js navigates: the `(app)` layout re-renders, TopNav re-renders.
7. TopNav evaluates `if (loadingPromise)` — still truthy — and immediately returns a fresh `<AnalyzeLoadingState>`.
8. New `AnalyzeLoadingState` mounts, starts its 12-second timers from scratch, and covers the entire viewport.
9. The `/analyze/[id]` page content rendered by the server component is present in the DOM but fully obscured.

---

## Why Hard Refresh Fixes It

A hard refresh destroys the React tree entirely. All `useState` values are reset to their initializers. TopNav reinitializes with `loadingPromise = null` and renders the normal nav.

---

## Secondary Case: Landing Form (`AnalyzePage`)

The same bug exists when submitting from the `/analyze` landing page. `AnalyzePage`'s own `loadingPromise` is never cleared on success. However, this path may be partially masked by a separate condition in TopNav (line 25): TopNav returns `null` when `pathname === '/analyze'`, so TopNav's overlay is not active during a landing-form submit. But once `router.replace` fires and pathname changes to `/analyze/${id}`, TopNav is no longer suppressed — and at that point TopNav's `loadingPromise` is already `null` (it was never set by the landing form submit). So the visible stuck overlay in the landing-form case comes from `AnalyzePage`'s own conditional render, not TopNav's.

---

## No Global State Involved

Confirmed: there is no Zustand store, React context, or other global state managing `loadingPromise`. State is entirely local `useState` in `TopNav` and `AnalyzePage`. No `useEffect` in any component listens to `pathname` or router events to reset this state.

---

## Candidates Ruled Out

| Candidate | Verdict |
|---|---|
| Timer not clearing (stuck in animation) | Ruled out — `AnalyzeLoadingState` is fully remounted, timers restart from scratch |
| Route change not triggering re-render | Ruled out — TopNav re-renders; the problem is what it renders |
| React 18 strict-mode double-mount | Ruled out — symptom is deterministic on prod behavior, not mount ordering |
| Search params or URL state controlling visibility | Ruled out — visibility is pure local `useState` |
| Layout boundary preventing state reset | Confirmed as a contributing factor — no layout boundary between `(app)` and `[id]` that would force TopNav remount |

---

## Files to Change When Fixing

| File | What needs to change |
|---|---|
| `components/nav/TopNav.tsx` | `handleSuccess` must call `setLoadingPromise(null)` before or after `router.push` |
| `app/(app)/analyze/page.tsx` | `handleSuccess` must call `setLoadingPromise(null)` before or after `router.replace` |
