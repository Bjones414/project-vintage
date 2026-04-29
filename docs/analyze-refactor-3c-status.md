# Analyze Refactor 3c — Headline Pattern, Italic Subtitle, Live Status Pill

**Status:** Complete
**Date:** 2026-04-29

## Components touched / added

| File | Change |
|------|--------|
| `components/analyze/AnalyzeHeader.tsx` | Rewritten — new headline, italic subtitle, live pill |
| `components/analyze/LiveStatusPill.tsx` | New client component |
| `lib/utils/date.ts` | Added `formatLivePillDate` |

## Headline structure

`[year, model, trim].filter(Boolean).join(' ')` — make excluded per spec ("year + model + trim"). Rendered in `font-serif font-semibold text-2xl tracking-tight`. No hardcoded "Porsche".

## Subtitle segment-drop logic

Segments built as a nullable array, filtered with `.filter((s): s is string => s != null)`, joined with `' · '`. Missing segments produce no stray separators.

```
[colorSegment, transmission, generation, mileageSegment]
```

- `colorSegment`: "[exterior] over [interior]" when both present; "[exterior]" when only exterior; null otherwise.
- `mileageSegment`: `toLocaleString()` + mapped unit ("miles" for "mi", "km" for "km").
- Italic, `text-sm`, `text-gray-500`.

## Live status pill

- **When:** `listing.listing_status === 'live'` only. Replaces the static badge for live listings.
- **Visual:** `bg-amber-600 text-white rounded-full text-xs font-semibold` (gold-tan amber accent, existing token).
- **Pulsing dot:** `h-1.5 w-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none`
- **Reduce-motion:** `motion-reduce:animate-none` is always in the DOM; browser applies based on media query.
- **Date format:** `formatLivePillDate(isoString, now)` — three branches: "ENDS TODAY [time]" / "ENDS [WEEKDAY] [time]" / "ENDS [MON DD]". All caps. Viewer-local timezone (client-side `new Date()`).
- **SSR:** Pill renders null on server (no `now`), appears after hydration. Injects `now` prop for deterministic tests.

## Tests added

- `tests/lib/utils/date.test.ts` — 5 pure-function tests for `formatLivePillDate` (all three branches + two boundary edges).
- `tests/components/analyze/components.test.tsx` — 5 new AnalyzeHeader tests (headline, subtitle, segment-drop, no-make, live-pill integration) + 7 LiveStatusPill tests (live/non-live render, all three date branches, motion-reduce class presence).

## Build / lint

- `npm run build` — passed (160 tests, 0 errors)
- `npm run lint` — no warnings or errors
- Total tests: 160 passing

## Commit hash

TBD (see git log)
