# DB State Diagnostic — NULL Field Audit
**Date:** 2026-05-14
**DB:** production (wbtgrmpojkpcdqyiohow.supabase.co)
**Table:** `listings`

---

## 1. Field-Level NULL Counts

### Sold Listings (final_price IS NOT NULL) — 556 total

| Field | NULL Count | % of Sold |
|---|---|---|
| `generation_id` | 52 | 9.4% |
| `trim_category` | 288 | 51.8% |
| Both NULL | 51 | 9.2% |
| `decoded_body_class` | 165 | 29.7% |

### All Listings — 729 total

| Field | NULL Count | % of All |
|---|---|---|
| `generation_id` | 80 | 11.0% |
| `trim_category` | 399 | 54.7% |
| Both NULL | 75 | 10.3% |

---

## 2. Generation Breakdown (Sold Listings, final_price not null)

| generation_id | Sold Comps |
|---|---|
| 993 | 221 |
| NULL | 52 |
| 964 | 42 |
| 911-f-body | 31 |
| 930 | 21 |
| 996.2 | 21 |
| 356a | 21 |
| 997.1 | 23 |
| 996.1 | 15 |
| 356c | 15 |
| 991.2 | 15 |
| 356b | 12 |
| 982-cayman | 10 |
| 911-3.2-carrera | 10 |
| 997.2 | 8 |
| 356-pre-a | 8 |
| g-series-2.7 | 8 |
| 992.1 | 7 |
| 911-pre-a | 4 |
| 987.2-cayman | 3 |
| (others <3 each) | ~18 |

---

## 3. NULL generation_id — What Are These 52 Listings?

The 52 sold listings with NULL `generation_id` are **not mainstream 911/Boxster/Cayman sports cars**. They fall into four categories:

### 3a. Non-Sports-Car Porsches (not in comp engine scope)
- Porsche 912 (1965, 1966): 2 listings
- Porsche 914/6 (1970): 2 listings
- Porsche 924 (1980): 3 listings
- Porsche 928 (1978–1981): 4 listings
- Porsche 944 / 944 Turbo / 944 S2 (1987–1991): 5 listings
- Porsche 968 (1992–1995): 7 listings

### 3b. Race / Competition Cars (inappropriate as comparable sales)
- Porsche RS61 (1961): 1 listing
- Porsche 904 Carrera GTS (1964): 1 listing
- Porsche 906 (1966): 2 listings
- Porsche 935 (1976, 2019): 2 listings
- Porsche Carrera GT (2005): 2 listings — supercar, not a 911
- Porsche 997 GT3 RSR (2008): 1 listing
- Porsche 991 GT3 Cup (2017, 2019): 2 listings
- Porsche 991 GT2 RS Clubsport (2018, 2019): 2 listings
- Porsche GT2 RS Clubsport 25 (2022): 1 listing
- Porsche 911 RSR-17 (2017): 1 listing

### 3c. Halo / Ultra-Exotic Porsches (separate market, expected NULL)
- Porsche 959 (1987–1988): 3 listings (including 959 Komfort)
- Porsche 918 Spyder / Weissach (2015): 5 listings

### 3d. Non-Porsche Cars (data pipeline leakage)
- Ferrari 360 Spider (2001): 1 listing
- Aston Martin Vantage Roadster (2021): 1 listing

**Conclusion:** The 52 NULL-generation sold listings represent expected edge cases — non-sports-car Porsches, race cars, ultra-exotics, and two non-Porsche entries. **These do NOT require `generation_id` backfill.** The correct fix for the Ferrari/Aston Martin entries is either flagging or removal from the listings table. The 924/928/944/968/912/914 era cars need generation_id only if Project Vintage expands to those marques/models — out of V1 scope.

**Exception:** The `1992 964 Carrera Cup USA` and `1997 993 Cup RSR` should have generation_id assigned to their respective generation IDs (`964` and `993`), but as race cars they should be excluded from civilian comp pools via a `listing_type` or `is_race_car` flag.

**Net rows needing generation_id backfill:** ~2–3 edge cases. Not a meaningful problem.

---

## 4. NULL trim_category — Root Causes and Generation Breakdown

### 4a. Breakdown by Generation (Sold Listings)

| generation_id | Total Sold Comps | NULL trim_category | % Null |
|---|---|---|---|
| 993 | 221 | 14 | 6.3% |
| 964 | 42 | 14 | 33.3% |
| 997.1 | 23 | 9 | 39.1% |
| 997.2 | 8 | 5 | 62.5% |
| 991.2 | 15 | 12 | 80.0% |
| 992.1 | 7 | 5 | 71.4% |
| 992.2 | 2 | 2 | 100.0% |
| 982-cayman | 10 | 8 | 80.0% |
| 987.2-cayman | 3 | 2 | 66.7% |
| 991.1 | 2 | 2 | 100.0% |
| 996.1 | 15 | 15 | 100.0% |
| 996.2 | 21 | 21 | 100.0% |
| 911-f-body | 31 | 31 | 100.0% |
| 930 | 21 | 21 | 100.0% |
| 911-3.2-carrera | 10 | 10 | 100.0% |
| 911-sc | 2 | 2 | 100.0% |
| g-series-2.7 | 8 | 8 | 100.0% |
| 356-era (all) | 56 | 56 | 100.0% |

### 4b. Root Cause Analysis — Three Distinct Failure Modes

**Mode 1 — trim field is literal "null" string (highest urgency for 993/964)**

The BaT scraper stored the string `"null"` rather than SQL NULL when no trim was available. Since `deriveTrimCategory("null", gen)` produces no match, trim_category is never written. Observed examples from 993:
- `1996 993 Carrera / trim="null"` — should be `carrera_2_narrow`
- `1997 993 Turbo / trim="null"` — should be `turbo_base`
- `1997 993 Turbo S / trim="null"` — should be `turbo_s`
- `1996 993 Carrera Cabriolet / trim="null"` — should be `carrera_2_narrow`
- `1998 993 Carrera 4S / trim="null"` — should be `carrera_4s_wide`

These 14 993 NULL-trim_category listings are **the most dangerous for the comp engine** because 993 IS the only generation where trim_category hard-filtering is currently active. A 993 Turbo listing with NULL trim_category leaks into Carrera comps via D6 fallback.

**Mode 2 — trim field non-null but unmatched by derive function (997.1/997.2)**

Some 997.1/997.2 listings have trim values that don't match any derive997 rule:
- `trim="GT"` on a 2005 Carrera — "GT" alone doesn't match (Carrera GT is a supercar, not a 997)
- `trim="GT3 Cup"` — not a road car trim, no rule maps it
- `trim="Targa 4S"` on a 997.2 — `derive997("Targa 4S")` → matches `targa` ✓ (should work)
- `trim="GT3 RS"` on 997.2 — `derive997("GT3 RS")` → matches `gt3_rs` ✓ (should work)

Wait: if `derive997("Targa 4S")` and `derive997("GT3 RS")` return non-null, why are these listings showing NULL trim_category? **The trim_category column was never backfilled** — `deriveTrimCategory` is called at ingestion time, but these 997.2 listings were ingested when generation_id was already set but trim_category derivation was either not running or was not backfilled after the function was added.

**Mode 3 — Generations where deriveTrimCategory has no logic (pre-997 non-target gens)**

Generations `911-f-body`, `930`, `911-3.2-carrera`, `911-sc`, `g-series-2.7`, and all 356 gens return `null` from `deriveTrimCategory` because their `generationId` hits the `default: return null` branch in `lib/trim-category/index.ts`. This is **by design** — the comp engine doesn't use trim_category for these gens and they are outside V1 comp scope. Not a bug.

---

## 5. Remediation Plan

### 5a. 993 NULL trim_category — HIGH URGENCY

**Scope:** 14 sold listings (known) + ~14 unsold listings
**Risk:** These are the highest-impact rows. The comp engine uses `trim_category` for 993 hard-filtering. A 993 Turbo with NULL trim_category passes through as a Carrera comp via D6 fallback — price contamination of ~2–5× the correct comp price.

**Fix:**
1. Write a one-off script to update trim_category from model string when trim IS NULL or equals literal `"null"`:
   - `model LIKE '%Turbo S%'` → `turbo_s`
   - `model LIKE '%Turbo%'` → `turbo_base`
   - `model LIKE '%Carrera 4S%'` → `carrera_4s_wide`
   - `model LIKE '%Carrera S%'` → `carrera_s_wide`
   - `model LIKE '%Carrera 4%'` → `carrera_4_narrow`
   - `model LIKE '%Carrera%'` or `model LIKE '%Cabriolet%'` → `carrera_2_narrow`
   - `model LIKE '%Targa%'` → `targa`
   - `model LIKE '%GT2%'` → `gt2`
   - `model LIKE '%RS%'` → `rs_touring`

2. For coachbuilt entries (`Gunther Werks`, `Singer`): set trim_category = `coachbuilt` (same as existing Singer 964/993 convention) or `NULL` with an explicit `ALWAYS_SEPARATE_MARKET` flag.

3. For `1998 993 Turbo XLC` — verify whether "XLC" is a variant designation; if not resolvable, set to `turbo_base` as the closest match.

**Estimated rows:** ~28 listings (14 sold + ~14 unsold)

### 5b. 964 NULL trim_category — HIGH URGENCY

**Scope:** 14 sold listings (known) + ~10 unsold
**Risk:** Same as 993. The comp engine uses trim_category for 964 hard-filtering.

**Fix:** Same model-string derivation approach as 993. Run deriveTrimCategory against the model string using the 964 derive function after stripping the generation prefix:
- `"964 Carrera 2 Coupe"` → extract `"Carrera 2"` → `derive964("Carrera 2")` → `carrera_2_narrow`
- `"964 Turbo 3.6"` → `turbo_base`

**Estimated rows:** ~24 listings

### 5c. 997.1/997.2 NULL trim_category — MEDIUM URGENCY

**Scope:** 9 997.1 + 5 997.2 = 14 sold listings; likely ~30 total listings
**Risk:** Medium. The comp engine does NOT currently hard-filter by trim_category for 997-era cars (they use coarse generation_id + body + drivetrain matching). However, once trim_category is populated, D6 Turbo-isolation can be activated.

**Fix:**
```sql
-- For listings where trim IS NOT NULL and generation_id IN ('997.1', '997.2'):
-- Re-run deriveTrimCategory(trim, generation_id) in application code
-- The derive997 function handles: gt2_rs, gt2, gt3_rs, gt3, sport_classic, speedster, 
-- turbo_s, turbo, gts, targa, carrera_4s, carrera_s, carrera_4, carrera, cabriolet
```

The existing `lib/trim-category/index.ts:derive997()` is already implemented. A one-time backfill script calling `deriveTrimCategory(listing.trim, listing.generation_id)` and writing back the result will fix most of these rows. Exceptions:
- `trim="GT"` (Carrera GT misclassification) → cannot be derived; these need to be manually reviewed and probably removed or tagged as `EXCLUDED_MARKET`
- `trim="GT3 Cup"` → race car; exclude from comp pool

**Estimated rows:** ~50–70 listings (all 997.1/997.2 with non-null trim)

### 5d. 991.x/992.x NULL trim_category — LOWER URGENCY

**Scope:** ~26 sold listings across 991.1, 991.2, 992.1, 992.2
**Risk:** Low short-term (comp engine uses coarse matching for these gens). Medium long-term when trim-based D6 is activated.

**Fix:** Same as 997 — run `deriveTrimCategory(trim, generation_id)` for all 991.x/992.x listings with non-null trim. The derive functions exist in `lib/trim-category/index.ts`.

**Estimated rows:** ~80–100 listings

### 5e. 982-cayman / 987.2-cayman NULL trim_category — MEDIUM URGENCY

**Scope:** 8 of 10 sold 982-cayman + 2 of 3 sold 987.2-cayman = 10 sold listings
**Risk:** Medium — without trim_category, the comp engine cannot distinguish 718 Cayman GTS from base 718 Cayman.

**Fix:** Run `deriveTrimCategory(trim, generation_id)` for all Cayman listings with non-null trim. The `deriveCayman718()` and `deriveCayman987()` functions are already implemented.

**Estimated rows:** ~25–30 listings

---

## 6. Backfill Job Summary

| Category | Rows | Urgency | Approach |
|---|---|---|---|
| 993 NULL trim_category (trim="null") | ~28 | CRITICAL | Derive from model string via regex |
| 964 NULL trim_category | ~24 | CRITICAL | Derive from model string via regex |
| 997.1/997.2 NULL trim_category | ~50–70 | MEDIUM | Re-run deriveTrimCategory(trim, gen) |
| 991.x/992.x NULL trim_category | ~80–100 | LOWER | Re-run deriveTrimCategory(trim, gen) |
| 982-cayman/987.2-cayman NULL trim_category | ~25–30 | MEDIUM | Re-run deriveTrimCategory(trim, gen) |
| generation_id NULL (non-target models) | 80 | LOW | No action needed for V1 scope |
| Non-Porsche entries (Ferrari, Aston Martin) | 2 | LOW | Flag for review / remove |

**Total rows requiring trim_category backfill: ~200–250**

**Recommended script:** A single `scripts/backfill/backfill-trim-category.ts` that:
1. Fetches all listings where trim_category IS NULL AND generation_id IS NOT NULL
2. For each, calls `deriveTrimCategory(trim, generation_id)` — or derives from model string if trim is null/"null"
3. Writes back any non-null result

**Existing function:** `lib/trim-category/index.ts:deriveTrimCategory()` — fully implemented for all target generations. Can be invoked directly. **Do not implement the backfill script in this session — reporting only.**

---

## 7. body_style NULL (decoded_body_class) — Secondary Issue

165 of 556 sold listings (29.7%) have NULL `decoded_body_class`. The comp engine uses body style as a hard filter — a Cabriolet should not comp against a Coupe.

**Root cause:** The decoded_body_class field depends on either the BaT/C&B scraper extracting body style from the listing title, or NHTSA vPIC VIN decode returning a body class. For many air-cooled and older listings, neither source reliably provides this field.

**Impact:** Without body style, the comp engine cannot prevent Cabriolet from matching Coupe comps. This dilutes valuations for all generations where Cabriolet commands a premium or discount (993, 997.x, 991.x).

**Remediation:** Derive body style from trim string (e.g., trim contains "Cabriolet" → body = "Cabriolet") or model string, as a fallback. A separate backfill job. **Scope: ~165 listings.**

---

*Generated: 2026-05-14 | Session S09 | Source: Supabase listings table + lib/trim-category/index.ts analysis*
