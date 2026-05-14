# Ingestion Pipeline Changes — 2026-05-14

## Files Modified

### `lib/listing-parser/bring-a-trailer.ts`
**Two changes in this file.**

**1. `splitModelTrim` — handle variant-letter and hyphen separators**
- **Before:** Prefix check required exact match OR `postMake.startsWith(prefix + ' ')` (space mandatory)
- **After:** Also accepts prefix followed by an uppercase letter (e.g. "911S") or hyphen (e.g. "914-6")
- Strips leading hyphen from the remainder so "914-6" → trim "6", not "-6"
- The digit-after-prefix case remains rejected ("9110" still returns null)

**2. `parseBatHtml` step 5 — generic non-Porsche model extraction**
- **Before:** Always called `splitModelTrim(postMake)`, which returned `null` for non-Porsche titles
- **After:** Checks `make.toLowerCase() === 'porsche'` first; for other makes uses first-token-as-model, rest-as-trim approach
- Non-Porsche listings now cache with real `make`, `model`, `year` values instead of failing with 422

### `lib/generation-match.ts`
**`FAMILY_PATTERNS` regex fix**
- **Before:** `[/\b911\b/, '911']` — requires word boundary after '1', fails on "911S" because 'S' is `\w`
- **After:** `[/\b911(?!\d)/, '911']` — negative lookahead rejects only digit-following context; "911S", "911T", "911SC" all resolve to family '911'
- All other patterns unchanged

### `components/analyze/EraCard.tsx`
**New optional props + fallback rendering branches**
- Added `make?: string | null` and `model?: string | null` to Props type
- Added `OUT_OF_V1_SCOPE_PORSCHE` set: 912, 912E, 914, 924, 928, 944, 959, 968
- When `generation === null`:
  - Non-Porsche make → renders "We don't currently support [brand] for full analysis. Cached as comparable sale data."
  - Out-of-scope Porsche model → renders "Porsche [model] — not yet in V1 catalog. Cached as comparable sale."
  - In-scope Porsche with null generation (e.g., failed match) → falls through to existing decade/content fallback

### `app/(app)/analyze/[id]/page.tsx`
**Pass `make` and `model` to EraCard**
- Added `make={listing.make}` and `model={listing.model}` to the EraCard call
- No other changes to the page

## Files Created (Tests)

### `tests/listing-parser/bring-a-trailer-model-trim.test.ts` (additions)
- 7 new tests: 911S Targa, 911T Coupe, 911E, 911SC Cabriolet, 911L (variant-letter suffix cases); 914-6 Coupe, 914-6 (hyphen cases)

### `tests/generation-match/generation-match.test.ts` (additions)
- 3 new tests: "1975 Porsche 911S Targa" title → g-series-2.7; "1983 Porsche 911SC Cabriolet" → 911-sc; decoded year 1975 + 911S title → g-series-2.7

### `tests/listing-parser/bring-a-trailer-nonporsche.test.ts` (new file)
- 24 tests covering: non-Porsche makes (Mercedes-Benz, BMW, Ferrari, Alfa Romeo), out-of-scope Porsche (944, 928, 912, 914-6, 924), early 911 variant-letter suffix via `parseBatHtml`, comp engine cross-brand isolation structural verification

## Files NOT Changed (per task constraints)

- `lib/comp-engine-v2/*` — comp engine unchanged; cross-brand isolation already guaranteed
- `lib/watch-for/*` — watch-for catalog unchanged
- `lib/era-content/*` — era-content unchanged
- No background jobs created or modified
- Safety posture unchanged: all fetches remain user-triggered only
