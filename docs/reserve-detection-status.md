# Reserve Detection — Status Report

**Commit:** 9e7f77f  
**Date:** 2026-04-29

## What changed

- `lib/listing-parser/types.ts` — added `has_no_reserve: boolean` and `high_bid_cents: number | null` to `CanonicalListing` (both tasks touched this file; committed together in Task 1)
- `lib/listing-parser/bring-a-trailer.ts` — exported `detectReserveStatus(visibleText)` function; integrated into Step 10 of `parseBaTListing`
- `supabase/migrations/20260429010000_add_has_no_reserve.sql` — `ALTER TABLE listings ADD COLUMN IF NOT EXISTS has_no_reserve BOOLEAN NOT NULL DEFAULT FALSE`
- `lib/supabase/types.ts` — `has_no_reserve` added to `listings` Row/Insert/Update
- `app/api/analyze/route.ts` — persists `has_no_reserve: listing.has_no_reserve` in upsert row
- `components/analyze/MetricTiles.tsx` — reserve tile renders "No Reserve" (amber), "Reserve Met", "Reserve Not Met", or "—"; `MetricTile` gained optional `valueClassName` prop
- `tests/components/analyze/fixtures.ts` — added `has_no_reserve: false` to both listing fixtures
- `tests/components/analyze/components.test.tsx` — updated reserve assertion to check for "Reserve Met" (was "Met")

## Tests added

`tests/listing-parser/bring-a-trailer-reserve.test.ts` — 11 cases:
- "reserve met" / "Reserve Met" / "RESERVE MET" → `reserve_met: true`
- "reserve not met" / "Reserve Not Met" → `reserve_met: false`
- critical: "reserve not met" does NOT match as "reserve met"
- "No Reserve" / "no reserve" → `has_no_reserve: true`, `reserve_met: null`
- "Bid To $48,250" (no reserve language) → all nulls
- empty string, unrelated text → all nulls

## Build / lint / test

All three pass. 244 tests.

## TODOs planted

None.

## Migration note

The migration file is committed but must be applied with `npx supabase db push` against the hosted project. Not run automatically in this session.

## Unexpected

- `CanonicalListing` types change affected both Tasks 1 and 2 — handled in one file touch.
- Snapshot file deleted and regenerated cleanly with the new "Reserve Met" copy.
