# Task 6a Status — Analyze Page v3 Layout

**Date:** 2026-04-29  
**Branch:** main  
**Status:** Complete

---

## Files Created / Modified

### New files
| Path | Purpose |
|---|---|
| `components/analyze/types.ts` | `ViewerTier`, `AnalysisData`, `ComparableSale` types; `parseAnalysisData` and `parseWatchOuts` JSON-safe coercions |
| `components/analyze/AnalyzeHeader.tsx` | Full-width header: status badge, canonical title, comps count, formatted end time (Task 6b stub) |
| `components/analyze/VerdictBlock.tsx` | Serif lede, secondary line, confidence locked for anonymous |
| `components/analyze/MetricTiles.tsx` | 4-tile grid: sale price, fair value, comps used (locked for anon), reserve |
| `components/analyze/ChassisIdentityCard.tsx` | VIN, generation, model year, engine, plant, body, transmission — all viewers |
| `components/analyze/ComparableSalesCard.tsx` | Anon: 1 comp + upsell; member: full set |
| `components/analyze/ActionRow.tsx` | `"use client"` — View on Platform (primary), Watch, Save (secondary); anon opens SignupModal |
| `components/analyze/EraCard.tsx` | Anon: first paragraph of verified editorial; member: full; no row: development fallback |
| `components/analyze/WatchOutsCard.tsx` | Anon: 1 item + N more; member: full list from `generation_editorial.watch_outs` |
| `components/analyze/ColorRarityCard.tsx` | One-word rarity visible to all; stats locked for anon |
| `components/analyze/AnonymousSignupCTA.tsx` | Bottom CTA: headline, 6 benefit lines, Create account link |
| `components/analyze/SignupModal.tsx` | `"use client"` — modal dialog with Escape key + backdrop dismiss |
| `components/ui/badge.tsx` | Badge primitive (default/success/warning/neutral/danger) |
| `components/ui/card.tsx` | Card primitive with optional title |
| `lib/utils/cn.ts` | `cn()` class concatenation helper |
| `lib/utils/platforms.ts` | `PLATFORM_NAMES` lookup map for all 10 approved source platforms |
| `tests/components/analyze/fixtures.ts` | Phase 3/4 fixtures: 2024 GT4 RS, 1988 930 Turbo, generations, verified editorials, color rows, analysis data |
| `tests/components/analyze/components.test.tsx` | 34 tests: individual component snapshots + 3 integration scenarios |
| `tests/setup.ts` | Vitest global mock for `next/navigation` and `next/headers` |

### Modified files
| Path | Change |
|---|---|
| `app/(app)/search/[listingId]/page.tsx` | Rebuilt as v3 layout Server Component (was placeholder) |
| `lib/utils/currency.ts` | Implemented `formatCents()` |
| `lib/utils/date.ts` | Implemented `formatAuctionEndTime()` and `formatDateShort()` |
| `vitest.config.ts` | Added `@vitejs/plugin-react`; extended include to `.{ts,tsx}`; added setup file |
| `package.json` | Added `@vitejs/plugin-react` devDependency |

---

## Test Output

```
Tests  89 passed (89)
Test Files  4 passed | 4 skipped (8)
```

All 34 new component tests pass alongside the 55 existing tests. 15 snapshots written on first run.

---

## tsc Result

```
npx tsc --noEmit  → (no output, exit 0)
```

Zero type errors in strict mode.

---

## Schema Deviations Found

The following columns exist in the live DB (`lib/supabase/types.ts`) but are absent from `SCHEMA.md`:

| Table | Column | Note |
|---|---|---|
| `users` | `role: string` | Used for `viewerTier` computation. Present in types, not in SCHEMA.md. |
| `porsche_generations` | `model_family: string \| null` | Present in types, not in SCHEMA.md spec. |
| `porsche_generations` | `production_count: number \| null` | Present in types, not in SCHEMA.md spec. |
| `listings` | `auction_ends_at: string \| null` | Present in types (added by Phase 3/4 migrations), not in SCHEMA.md. |
| `listings` | `generation_id: string \| null` | Present in types (FK to porsche_generations), not in original SCHEMA.md spec. |
| `listings` | `decoded_*` columns | All 7 decoded columns present in types, not in SCHEMA.md. |
| `listings` | `last_verified_at: string \| null` | Present in types, not in SCHEMA.md. |
| `listings` | `vin_decode_raw: Json \| null` | Present in types, not in SCHEMA.md. |
| `listings` | `listing_status` | In SCHEMA.md as proposed; confirmed live. |

No contradictions that required stopping — all are additive columns. Reported here for SCHEMA.md update (Task 8).

---

## Hard Constraint Compliance

| Constraint | Status |
|---|---|
| Multi-marque-neutral copy | ✓ — "for collectors / for serious buyers"; no "Porsche-only" |
| `viewerTier` bypass comment | ✓ — `page.tsx:47` has `// TODO: V1 launch — remove role IN ('admin', 'beta') bypass…` |
| `generation_editorial` content_status filter | ✓ — `.eq('content_status', 'verified')` in page.tsx; all reads guarded |
| No verified row → fallback message | ✓ — EraCard renders "Era guide for this generation is in development." |
| Primary CTA: "View on [Platform]" | ✓ — dynamic from PLATFORM_NAMES lookup |
| Watch + Save → SignupModal for anon | ✓ — ActionRow.tsx |
| No Garage button | ✓ — absent from all components |
| AI grounding: no LLM calls | ✓ — all fields traced to DB columns or verified editorial |
| Lock affordances inline only | ✓ — no blur, no banners, no overlays |
| Mobile responsive: md: collapse | ✓ — `flex-col md:flex-row` on two-column grid |
| No `"use client"` at page level | ✓ — page.tsx is a plain async Server Component |

---

## Open TODOs (file:line)

| Location | Note |
|---|---|
| `app/(app)/search/[listingId]/page.tsx:47` | `// TODO: V1 launch — remove role IN ('admin', 'beta') bypass when beta gates flip on` |
| `components/analyze/AnalyzeHeader.tsx:41` | `// TODO: Task 6b — replace static time with <AuctionCountdown endsAt={…} />` |
| `components/analyze/ActionRow.tsx:35` | `// TODO: persist watch for authenticated members` |
| `components/analyze/ActionRow.tsx:41` | `// TODO: persist save-analysis for authenticated members` |

---

## What Task 6b Plugs Into

`AnalyzeHeader.tsx` at the comment on line 41. The page passes `listing.auction_ends_at` (an ISO 8601 string from the DB). Task 6b should:

1. Create `components/analyze/AuctionCountdown.tsx` as a `"use client"` component
2. Accept `endsAt: string | null` as a prop
3. Compute `timeLeft = new Date(endsAt).getTime() - Date.now()` and update on a 1-second interval via `setInterval`
4. Render live countdown when `listing_status === 'live'` and `timeLeft > 0`; fall back to the formatted static end time otherwise
5. Replace the static `formatAuctionEndTime(listing.auction_ends_at)` block in `AnalyzeHeader.tsx` with `<AuctionCountdown endsAt={listing.auction_ends_at} />`

The surrounding layout and props are already in place; Task 6b is a drop-in swap.
