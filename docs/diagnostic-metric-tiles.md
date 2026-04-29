# Diagnostic: Metric Tiles Showing Blank on /analyze/[id]

**Date:** 2026-04-29  
**Investigator:** Claude Code  
**Scope:** Read-only investigation. No code changes made.

---

## What I checked

- `SCHEMA.md` and `ARCHITECTURE.md` for intended data model
- `components/analyze/MetricTiles.tsx` — the reader (both current and the Phase 4 version from `c13fbc5`)
- `app/(app)/analyze/[id]/page.tsx` — the page-level query and prop chain
- `app/api/analyze/route.ts` — the writer (both current and the Phase 4 version from `c13fbc5`)
- `lib/listing-parser/bring-a-trailer.ts` — only live parser; what it does and doesn't extract
- `lib/listing-parser/types.ts` — `CanonicalListing` field list
- `lib/comp-engine/default.ts` and `porsche.ts` — to check if comp engine exists
- `lib/utils/currency.ts` — `formatCents` formatter (not a culprit)
- `lib/supabase/types.ts` — confirmed which columns exist in the DB
- `tests/components/analyze/fixtures.ts` — to understand why tests pass when production doesn't
- All migrations under `supabase/migrations/` — searched for pricing columns
- Git log for all paths involved — to look for regression commits

---

## What I found

### current_bid (label: "Current Bid" when live / "Sale Price" when sold)

**Writer status: partially wired / broken for live listings**

**Reader:**  
`MetricTiles.tsx:31` — `const bidCents = isLive ? listing.high_bid : listing.final_price`  
For live listings → reads `listing.high_bid`.  
For sold/no-sale → reads `listing.final_price`.

**Writer — `final_price`:**  
`route.ts:115` — `final_price: listing.sold_price_cents`  
`bring-a-trailer.ts:100–136` — `sold_price_cents` extracted from JSON-LD `offers.price`.  
This chain **works for sold BaT listings** if the JSON-LD contains the price. The mapping exists end to end.

**Writer — `high_bid`:**  
`CanonicalListing` type (`lib/listing-parser/types.ts`) has **no `high_bid` field** — only `sold_price_cents`.  
The route `row` object has **no `high_bid` key** — only `final_price`.  
Therefore `listing.high_bid` is **always null** in the DB for any analyzed listing, regardless of status.

**Root cause:** For live auctions — the most common case when a user pastes a URL into the analyze flow — `listing.high_bid` is never written. `CanonicalListing` has no field for the current bid value, and the route has no mapping from any parsed field to `high_bid`. The tile always shows "—" for live listings.

For sold listings, `final_price` IS written. Whether it shows a real value depends on whether BaT's JSON-LD `offers.price` contains the hammer price (it usually does for sold listings). This sub-path is the most likely to "work" but has not been confirmed against a real production row.

**Evidence:**
- `lib/listing-parser/types.ts:13–38` — `CanonicalListing` interface, no `high_bid` field
- `lib/listing-parser/bring-a-trailer.ts:265–268` — only `sold_price_cents` in return object
- `app/api/analyze/route.ts:114–115` — row maps only `final_price`, no `high_bid`
- `components/analyze/MetricTiles.tsx:31` — reads `listing.high_bid` for live

---

### reserve

**Writer status: never wired**

**Reader:**  
`MetricTiles.tsx:41–45` — reads `listing.reserve_met` (boolean → "Met" / "Not met" / "—")

**Writer:**  
`route.ts:117` — `reserve_met: listing.reserve_met`  
This looks correct, but...  
`bring-a-trailer.ts:268` — `reserve_met: null` **hardcoded** in the BaT parser's return object.  
The parser never reads the page for reserve status. The value `null` is always written.

`listing.reserve_met` is therefore always `null` in the DB for any BaT-sourced listing → tile always shows "—".

BaT does expose reserve status textually on the page ("Reserve Met", "Reserve Not Met"). The parser's Step 9 (listing status detection) does detect sold/no-sale from "Sold for $X" / "Bid to $X" adjacent to a price, but reserve status is a separate signal and no extraction was ever written.

**Root cause:** BaT parser hardcodes `reserve_met: null` and does not read reserve status from the page. This has been true since the parser was first written (`a3fd76d`).

**Evidence:**
- `lib/listing-parser/bring-a-trailer.ts:268` — `reserve_met: null`
- `app/api/analyze/route.ts:117` — correctly propagates whatever the parser returns
- `components/analyze/MetricTiles.tsx:41–45` — reads `listing.reserve_met`

---

### fair_value_range

**Writer status: never wired — comp engine is a stub**

**Reader:**  
`MetricTiles.tsx:34–38` — reads `analysisData?.fair_value_low_cents` and `analysisData?.fair_value_high_cents`  
`analysisData` comes from `parseAnalysisData(analysisResult.data?.analysis_data ?? null)` in `page.tsx:71`

**Writer:**  
`route.ts:161–172` — `analysis_data` is written as:
```ts
{
  parsed_at: new Date().toISOString(),
  listing_status: listing.listing_status,
}
```
`fair_value_low_cents` and `fair_value_high_cents` are never included.

**Comp engine:**  
`lib/comp-engine/default.ts` — 3-line file, comment only: `// Stub — implement in V1.`  
`lib/comp-engine/types.ts` — `CompQuery`, `CompResult`, `ValuationRange` all typed as `unknown`  
`lib/comp-engine/porsche.ts` — same, comment stub.  
No comp engine has ever been called from `route.ts`.

**Root cause:** The comp engine is a planned stub — not implemented, not called. `fair_value_low_cents` and `fair_value_high_cents` have never been written to `analysis_data`. Both values are `undefined` when `parseAnalysisData` deserializes the row → `undefined != null` is `false` in JS → `fairValueStr = "—"`.

**Evidence:**
- `lib/comp-engine/default.ts:1–3` — stub comment only
- `app/api/analyze/route.ts:161–172` — `analysis_data` never includes fair value fields
- `components/analyze/MetricTiles.tsx:34–38` — reads `analysisData?.fair_value_low_cents`
- `tests/components/analyze/fixtures.ts:269–314` — `ANALYSIS_DATA_GT4_RS` fixture has full fair value populated manually, which is why tests pass

---

### comps

**Writer status: never wired — same root cause as fair_value_range**

**Reader:**  
`MetricTiles.tsx:55–58` — reads `analysisData?.comps_used`

**Writer:**  
Same `analysis_data` object as above — `comps_used` is never included.  
Note: `listing_analyses.comp_count` column DOES exist (added in Phase 5 migration `20260429000000_phase_5_analyze_v3_schema.sql:102`), and the Phase 7+ findings work writes `finding_count` — but `comp_count` is still never written. More critically, `MetricTiles` reads `analysisData.comps_used` (from the jsonb), not `listing_analyses.comp_count` (the denormalized integer column).

**Root cause:** Same as fair_value_range — comp engine stub, `comps_used` never written to `analysis_data`.

**Evidence:**
- `app/api/analyze/route.ts:161–172` — no `comps_used` in `analysis_data`
- `components/analyze/MetricTiles.tsx:55` — reads `analysisData?.comps_used`
- `supabase/migrations/20260429000000_phase_5_analyze_v3_schema.sql:102` — `comp_count` column added but never written

---

## On the "worked before" claim

The git log shows the analyze route (`app/api/analyze/route.ts`) has always written the same minimal `analysis_data` since Phase 4 (`c13fbc5` is the earliest full implementation). The original scaffold (`77fbd59`) was a 501 stub. There is no commit in the history where fair value, comps, or reserve was written.

The test fixtures (`tests/components/analyze/fixtures.ts`) have all four values **manually populated** with realistic numbers:
- `GT4_RS_LISTING`: `high_bid: 21500000`, `final_price: 22000000`, `reserve_met: true`
- `ANALYSIS_DATA_GT4_RS`: `fair_value_low_cents: 19500000`, `fair_value_high_cents: 24000000`, `comps_used: 12`

These fixtures make all component tests pass. The tiles render correctly in test snapshots. In production, the route never writes these values.

**Working hypothesis:** The tiles were never populated with live data in production. "Worked before" likely refers to the component tests, or to the UI design intent visible in those tests — not to actual production data.

---

## Recommended fix order

Fix in this order (each tier unblocks or informs the next):

**1. reserve** — quickest win, self-contained.  
The BaT parser's Step 9 already reads `visibleText` to detect status. Reserve phrases are adjacent to the price text ("Reserve Met", "Reserve Not Met"). Add extraction to `bring-a-trailer.ts` and map `reserve_met: true/false/null` based on presence. No schema changes needed.

**2. current_bid (live auctions)** — second quickest, self-contained.  
Add `high_bid: number | null` to `CanonicalListing`. In the BaT parser, extract the bid amount from the "Current Bid $X" phrase already used for `listing_status` detection (the price is already in the visibleText search). Map `high_bid: listing.high_bid` in the route's `row` object. No schema changes needed.

**3. comps_used + fair_value_range** — depends on comp engine, which is the biggest lift.  
These both require the comp engine to be implemented. They cannot be addressed without building the core feature. They share a single root cause (stub engine) and should be tackled together as one unit of work.

Within the comps/fair-value work, `comps_used` is a byproduct of running the comp engine, and `fair_value_low/high` is the primary output. Fix order within that feature: implement comp query → return count + range → write both to `analysis_data`.

---

## Open questions for Blake

1. **Was "worked before" based on a seed/demo mode?** Is there a seed script, an admin override, or a manually-inserted row in the DB with fake comp data? If so, where — that would explain the perception.

2. **For "Sale Price" on sold listings:** The BaT parser extracts `sold_price_cents` from JSON-LD `offers.price`, which should populate `final_price` for sold listings. Has Blake tested with a sold BaT URL (e.g., an auction that completed)? If so and it still shows blank, the JSON-LD extraction itself may have a gap.

3. **Reserve extraction priority:** BaT has distinct text for "Reserve Met", "Reserve Not Met", and "No Reserve". Should "No Reserve" display as a specific label in the tile, or should it be treated as a null/unknown state? This affects the parser logic.

4. **`high_bid` for live auctions:** BaT renders the current bid in the page as "Current Bid: USD $X,XXX". The parser already extracts this text for `listing_status` detection. The dollar amount is in the visibleText. Is extracting the current bid amount from that string acceptable for V1, knowing it will be stale after the initial parse?

---

## Suggested query for Blake to run

```sql
SELECT 
  l.id,
  l.listing_status,
  l.high_bid,
  l.final_price,
  l.reserve_met,
  la.analysis_data -> 'fair_value_low_cents'  AS fv_low,
  la.analysis_data -> 'fair_value_high_cents' AS fv_high,
  la.analysis_data -> 'comps_used'            AS comps_used,
  la.created_at
FROM listing_analyses la
JOIN listings l ON l.id = la.listing_id
ORDER BY la.created_at DESC
LIMIT 5;
```

Expected result: `high_bid` = null for all rows, `reserve_met` = null for all rows, `fv_low/fv_high/comps_used` = null for all rows. `final_price` may have values for sold listings.
