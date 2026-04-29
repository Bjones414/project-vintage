# Current Bid Extraction — Status Report

**Commit:** 000e222  
**Date:** 2026-04-29

## What changed

- `lib/listing-parser/bring-a-trailer.ts` — exported `extractCurrentBid(visibleText)` function; integrated into Step 11 of `parseBaTListing`, result stored as `high_bid_cents`
- `app/api/analyze/route.ts` — persists `high_bid: listing.high_bid_cents` in upsert row (column `listings.high_bid` already existed in the DB)
- `components/analyze/MetricTiles.tsx` — bid tile logic updated: prefers `final_price` for sold listings, falls back to `high_bid` for live, else "—"

## No migration needed

`listings.high_bid` was already present in the Supabase types and DB schema. No new column required.

## Tests added

`tests/listing-parser/bring-a-trailer-bid.test.ts` — 11 cases:
- `"Current Bid $48,250"` → 4825000
- `"Current Bid: $48,250"` (colon) → 4825000
- `"Current Bid: USD 48,250"` (USD prefix, no $) → 4825000
- `"Current Bid: USD $48,250"` (USD + $) → 4825000
- `"Current Bid $1,250,000"` (7-figure) → 125000000
- `"Current Bid $48,250.00"` (.00 suffix) → 4825000
- surrounding whitespace/newlines → 4825000
- `"Bid To $48,250"` → null (no "Current Bid" prefix)
- `"Sold for $48,250"` → null
- empty string, unrelated text → null

## Build / lint / test

All three pass. 244 tests.

## TODOs planted

None.

## Note on coexistence

`high_bid_cents` and `sold_price_cents` can coexist on a record — BaT shows the live bid text even on pages that eventually sold. The MetricTiles component correctly prefers `final_price` for sold listings.
