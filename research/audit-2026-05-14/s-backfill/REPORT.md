# S-Backfill Report — 2026-05-14

Backfill session to populate NULL `trim_category` and `generation_id` fields ahead of S10's comp engine D6 fix.

---

## Pre-Backfill Baseline (from S09)

| Field | NULL count (sold) | NULL count (all) |
|---|---|---|
| `trim_category` | 288 | 418 |
| `generation_id` | 63 | 80 |

Total listings at start of session: **763**

---

## 1. trim_category Backfill

**Script:** `scripts/backfill/backfill-trim-category.ts`  
**Log:** `trim-category-log.json`

### Bug fix applied before running

`lib/trim-category/index.ts` had `case '996':` but DB stores `996.1` / `996.2` — causing all 996-era listings to fall through to `default: return null`. Two fixes applied:

- Added `case '996.1': case '996.2':` to the `deriveTrimCategory` switch
- Added `derive930()` function and `case '930':` (G-series Turbo, all rows have "Turbo" in trim)

### Results

| Metric | Count |
|---|---|
| Rows processed | 418 |
| **Rows updated** | **158** |
| Skipped — deriveTrimCategory returned null | 129 |
| Skipped — trim is null/absent and no model | 131* |

*The 131 "trim=null" skips are older generations (911-f-body, 911-sc, 911-3.2-carrera, g-series-2.7, 930 with model="930" only, 356-era) where no derive function exists for that generation or where the model field provides no discriminating trim information. These are correct skips — no rules exist to map them.

### Post-backfill NULL counts

| Field | NULL (sold) | NULL (all) |
|---|---|---|
| `trim_category` | **228** (was 288, Δ−60) | **260** (was 418, Δ−158) |

### Derivation paths used

- **normal** — trim field is a real string, passed directly to `deriveTrimCategory`
- **from_model** — trim is null or literal "null"; generation prefix stripped from model field and pseudo-trim passed to `deriveTrimCategory`

### Residual NULLs — manual review candidates

The 228 sold NULLs that remain are one of:
1. Race cars / competition variants (GT3 Cup, GT2 RS Clubsport, RSR, etc.) — correctly NULL, out of comp scope
2. Out-of-scope marques (Ferrari, Aston Martin captured in the DB)
3. Early air-cooled generations (930, G-series, F-body, SC, 3.2, 356) with no trim taxonomy defined — comp engine doesn't apply D6 trim filtering to these anyway
4. Mid-engine specials (918 Spyder, Carrera GT) — no applicable generation entry
5. 996.x Carrera base listings where the trim string contains body type only (e.g., "Carrera Coupe 6-Speed" → the cabriolet/targa separation is still working, but many base-carrera 996 trims still skip because of format variation — see note below)

**Note on remaining 996.x NULLs:** Several 996.x rows still have NULL trim_category after backfill. Investigation shows their trim strings include format variants that don't match the derive pattern (e.g., the existing `derive996` function looks for `t.includes('carrera')` but some trimstrings with that text still return null if they hit an early branch). These are candidates for a targeted follow-up backfill.

---

## 2. generation_id Backfill

**Script:** `scripts/backfill/backfill-generation-id.ts`  
**Log:** `generation-id-log.json`  
**Status: DRY-RUN ONLY — live run not executed**

### Dry-run findings

Of 80 total NULL generation_id rows:
- **76 skipped** — "Model family unresolved": race cars (GT3 Cup, GT2 RS Clubsport, RSR-17, GT3 RSR), out-of-scope models (928, 944, 968, 959, 918, 914/6, 906, 904, 912, 550, 934, 935, 917, 962), non-Porsche (RUF, Kremer, Ferrari 360 Spider), vintage racers (RS61, 550A). These were intentionally left NULL by prior migration `20260510060000_backfill_generation_id_null_listings.sql`.
- **4 would-update — all incorrect**: `matchFromTitle`'s keyword fallback matches "911" in generation IDs like `911-sc` against any "911 ..." model string. This produces incorrect results for 2019 GT3 Cup, 2017 RSR-17, 1988 "911", 1974 "911 Carrera 3.0 RSR" — all mapped to `911-sc` which is wrong.

**Decision: generation_id live run aborted.** All 80 NULL rows are either legitimately un-derivable (76) or would receive incorrect values from the keyword-fallback bug (4). The generation_id NULL count remains at 80 total / 63 sold.

### Impact assessment

The 63 sold listings with NULL generation_id are all out-of-scope cars (race cars, vintage racers, other marques) that would not appear in any comp pool. S10's comp engine improvement is not gated on these rows.

---

## 3. cascade_level Migration

**File:** `supabase/migrations/20260514000000_add_cascade_level_to_comp_engine_runs.sql`  
**Status: Applied** ✓

`comp_engine_runs.cascade_level` (integer, nullable) added. The S10 logger was already writing `cascade_level` but the column was missing — inserts were silently failing on that field. Now fixed.

TypeScript types updated in both `lib/supabase/types.ts` and `lib/database.types.ts`.

---

## 4. Test Suite

```
Test Files  42 passed | 4 skipped (46)
Tests       737 passed (737)
```

All 737 tests pass. ✓

---

## 5. Comp Engine Verification — VIN WP0CA299X2S650260

**Listing:** 2002 996.2 Carrera Cabriolet 6-Speed  
**Listing ID:** `e8fdd053-586f-4e48-8c50-0b5aaadd3c90`

**Post-backfill listing state:**
- `trim_category`: `carrera_base` (was NULL — now populated by backfill)
- `generation_id`: `996.2` (was already set)

**Comp engine result:**

| Field | Value |
|---|---|
| `generation_used` | `default` |
| `cascade_level` | `5` |
| `cascade_caveat` | "Comps include broader 996.2 Carrera variants due to limited data for this specific configuration." |
| `comp_count` | 10 |
| `predicted_median` | $30,500 |
| `verdict` | `priced_fairly` |

**Turbo/GT leakage check:** ✓ CLEAN — zero Turbo, GT2, GT3, or halo listings in the comp pool.

**cascade_level returned:** ✓ Yes (level 5, stored in `comp_engine_runs`).

**Note:** `generation_used: default` means no specific weight config exists for `996.2` in `generation_weight_config` table — this is a pre-existing gap, not introduced by this session. cascade_level 5 indicates a wide pool was needed due to limited 996.2 Carrera Cabriolet sold comps within the 36-month window.

---

## Summary for Review

| Item | Before | After | Δ |
|---|---|---|---|
| trim_category NULL (sold listings) | 288 | 228 | −60 |
| trim_category NULL (all listings) | 418 | 260 | −158 |
| generation_id NULL (sold listings) | 63 | 63 | 0 (all un-derivable) |
| generation_id NULL (all listings) | 80 | 80 | 0 (all un-derivable) |
| cascade_level column in comp_engine_runs | missing | present | ✓ |
| Test suite | 737 | 737 | ✓ |
| Comp pool Turbo/GT leakage for VIN | — | NONE | ✓ |
| cascade_level in comp engine response | — | 5 | ✓ |

**Rows flagged for manual review:**
- The 4 generation_id rows where `matchFromTitle` produces false matches via "911" keyword (IDs: `70092485`, `efacb65c`, `0b4fc8a7`, `353c5282`) — these should stay NULL (correct state) or be manually assessed.
- 996.x Carrera base listings still showing NULL trim_category (base Carrera format variation issue) — candidates for follow-up if comp pool gaps persist.

**Bug fix applied to `lib/trim-category/index.ts`:**
- Added `case '996.1': case '996.2':` — fixes 50+ rows that were silently returning null despite valid trim strings
- Added `derive930()` and `case '930':` — fixes ~22 930-era Turbo rows
