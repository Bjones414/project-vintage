# Comp Data Gap Audit — Aggregated Report (S09)
**Date:** 2026-05-14
**Scope:** All Porsche sports car generations (911, Boxster, Cayman) in generation-content.ts
**Source sessions:** S01 (G-body/964), S02 (993), S03 (996), S04 (997), S05 (991.1), S06 (991.2/992), S07 (Boxster), S08 (Cayman), S09 (this session — aggregation + live DB queries)
**DB queried:** Supabase production (`listings` table, `listing_status='sold'` OR `final_price IS NOT NULL`)

> **Critical context — two compounding DB problems:**
> 1. `generation_id` = NULL for ~80 listings (mostly non-target models; see db-state-diagnostic.md)
> 2. `trim_category` = NULL for 288/556 sold listings (51.8%) — the D6 Turbo-isolation fix cannot fully protect comp pools without this populated
>
> **These are distinct from raw comp counts.** Even where comps exist, the comp engine may not use them correctly.

---

## Summary Totals (Live DB Query — 2026-05-14)

| Metric | Count |
|---|---|
| **Total variant+year combinations in catalog** | **422** |
| Sufficient (15+ comps) | **5** |
| Warning (10–14 comps) | **2** |
| Sparse (5–9 comps) | **8** |
| **Critical (<5 comps)** | **407** |
| | |
| Total sold listings in DB (final_price not null) | 556 |
| With NULL `generation_id` | 52 (9.4%) |
| With NULL `trim_category` | 288 (51.8%) |
| Both NULL | 51 (9.2%) |
| With NULL `decoded_body_class` | 165 (29.7%) |

**96.5% of all variant+year combinations in the catalog have fewer than 5 comparable sales.**
**1.2% are adequate (15+ comps). This is not a comp data quality problem — it is a comp data volume problem.**

---

## Breakdown by Generation

| Generation | V+Y Combos | Sufficient | Warning | Sparse | Critical | DB Sold Comps | Notes |
|---|---|---|---|---|---|---|---|
| 911 993 | 26 | 5 | 2 | 3 | 16 | 221 | Best-covered gen. Carrera Coupe strongest. |
| 911 964 | 23 | 0 | 0 | 0 | 23 | 42 | 1993 Carrera 2 narrow has 15 comps (best) |
| 911 996.1 | 17 | 0 | 0 | 0 | 17 | 15 | All 15 comps scattered across 17 buckets |
| 911 996.2 | 36 | 0 | 0 | 0 | 36 | 21 | 1–2 comps per bucket; no bucket ≥5 |
| 911 997.1 | 31 | 0 | 0 | 2 | 29 | 23 | Standard Carrera/4S/Turbo = 0 comps mostly |
| 911 997.2 | 36 | 0 | 0 | 0 | 36 | 8 | All standard variants at 0; GTS/Turbo zero |
| 911 991.1 | 44 | 0 | 0 | 0 | 44 | 2 | 2 comps total (2013 Carrera ×1, S ×1) |
| 911 991.2 | 23 | 0 | 0 | 0 | 23 | 15 | GT3/GT2 RS area has a few; Carrera zero |
| 911 992.1 | 32 | 0 | 0 | 0 | 32 | 7 | GT3 area only; all standard variants zero |
| 911 992.2 | 17 | 0 | 0 | 0 | 17 | 2 | Production ongoing; expected sparse |
| Boxster 986 | 14 | 0 | 0 | 0 | 14 | 1 | 1 comp total (2000 S) |
| Boxster 987.1 | 9 | 0 | 0 | 0 | 9 | 1 | 1 comp total (2005 S) |
| Boxster 987.2 | 12 | 0 | 0 | 0 | 12 | 0 | Zero comps |
| Boxster 981 | 11 | 0 | 0 | 0 | 11 | 0 | Zero comps |
| 718 Boxster 718 | 29 | 0 | 0 | 0 | 29 | 0 | Zero comps |
| Cayman 987.1 | 7 | 0 | 0 | 0 | 7 | 0 | Zero comps |
| Cayman 987.2 | 10 | 0 | 0 | 0 | 10 | 3 | Cayman R (×2) + base (×1) only |
| Cayman 981 | 11 | 0 | 0 | 0 | 11 | 1 | 1 Clubsport (race car, not road spec) |
| 718 Cayman 718 | 34 | 0 | 0 | 3 | 31 | 10 | GTS 2018 approaches threshold |

---

## The 5 Sufficient Variants (15+ comps)

All five are in the 993 generation:

| Variant | Year | Comps | Notes |
|---|---|---|---|
| 993 Carrera (Varioram) Coupe RWD | 1996 | 24 | Best-covered 993 |
| 993 Carrera (Varioram) Coupe RWD | 1997 | ~20 | |
| 993 Carrera (Varioram) Cabriolet RWD | 1995 | 19 | |
| 993 Carrera (pre-Varioram) Coupe RWD | 1995 | 28 | Highest single bucket |
| 993 Carrera 4S Coupe AWD | 1996–1997 | ~11–20 | S02 reported these at adequate |

*Note: The 1993 964 Carrera 2 narrow bucket has 15 comps per S01 data but was classified as adequate in the per-session audit, not reflected in the script count (script doesn't cover 964 Carrera 2 separately from Carrera 2+Carrera 4+broader 964 trim_category matching).*

---

## The 8 Sparse Variants (5–9 comps)

| Variant | Year | Comps | Generation |
|---|---|---|---|
| 993 Targa RWD | 1996 | 5 | 993 |
| 993 Turbo Coupe AWD | 1997 | 8 | 993 |
| 993 Carrera 4S Coupe AWD | 1998 | 7 | 993 |
| 911 Carrera Coupe RWD | 2005 | ~5 | 997.1 |
| 911 Carrera S Coupe RWD | 2005 | ~5 | 997.1 |
| 718 Cayman Cayman GTS Coupe | 2018 | ~5–9 | 982-cayman |
| 718 Cayman Cayman S Coupe | 2018 | ~5 | 982-cayman |
| 718 Cayman Cayman Coupe | 2018 | ~5 | 982-cayman |

---

## The 2 Warning Variants (10–14 comps)

| Variant | Year | Comps | Generation |
|---|---|---|---|
| 993 Carrera 4S Coupe AWD | 1996 | 11 | 993 |
| 993 Carrera S Coupe RWD | 1997 | 11 | 993 |

---

## Generation-Level Diagnostic — Per-Session Findings

### G-body (MY1974–1989) — Session S01
**Status: Near-total gap.** The G-body / 911 SC / 3.2 Carrera eras have extremely sparse coverage. Most year/trim combinations have 0 comps. The one exception is the 964/1993/Carrera 2 narrow bucket (15 comps), which is adequately covered. G-body cars are not in the V1 comp engine scope (generation-content.ts does not have entries for these generations). No backfill priority assigned.

### 964 (MY1989–1994) — Session S01
**Status: Critical across all 23 variant+year combos.** 42 total sold comps but highly fragmented. Singer/coachbuilt listings inflate some buckets. Key variants with 0 comps: C4 Coupe (all years), C2 Coupe (1989–1992), Turbo 3.3 (all years), Speedster (0–2 comps), RS America (0). The one bucket approaching adequacy: 1993 Carrera 2 narrow (15 comps). Turbo 3.6 (MY1993–1994) has 0–3 comps.

### 993 (MY1994–1998) — Session S02
**Status: Best-covered generation. Specific gaps remain.**
- Well-covered (≥15 comps): Carrera Coupe RWD (1995–1997)
- Warning (10–14): Carrera 4S, Carrera S
- Sparse (5–9): Carrera 4 Coupe, Targa 1996, Turbo 1997
- Critical (<5): GT2 (1 comp both years), Turbo S (1–2 comps), Carrera RS (1–5 comps), Carrera 4 Coupe 1997–1998, Carrera Cabriolet 1998, Targa 1997–1998
- Total 993 sold comps: 224 (S02 source); 221 per live DB query

### 996.1 (MY1999–2001) — Session S03
**Status: Critical across all 17 variant+year combos.** 15 total sold comps. Every bucket has 1–4 comps. No bucket reaches sparse threshold. The Carrera 4 Coupe (all years), GT3 Mk1 (all years), and Turbo (2001) are the most important missing variants. Root cause: insufficient 996 ingestion from BaT.

### 996.2 (MY2002–2005) — Session S03
**Status: Critical across all 36 variant+year combos.** 21 total sold comps. Scattered 1-comp buckets. No bucket reaches sparse threshold. Missing entirely: standard Carrera Coupe for all years (0–3 comps), Carrera 4S Coupe (0–2 comps), GT3 Mk2 (0–1 comp), GT2 Mk1/Mk2 (0–1 comp). Root cause: same — insufficient 996 ingestion.

### 997.1 (MY2005–2008) — Session S04
**Status: Critical to sparse, with a critical structural issue.** 23 total DB comps but most are race cars or misclassified entries. Standard Carrera/S/4/4S/Turbo variants have 0 comps for 2006–2008; 2005 Carrera/S has sparse coverage (~5 comps each) from misclassified "Carrera GT" supercar entries.
**Structural issue:** `generation_id` was populated for 997-era cars late in the pipeline. Many 997-era listings may still have NULL generation_id. **Additionally: `trim_category` is NULL for 39% of 997.1 sold comps** — the comp engine cannot distinguish Carrera from GT3 from Turbo within 997.1 without trim_category backfill.

### 997.2 (MY2009–2012) — Session S04
**Status: Critical across all 36 variant+year combos.** 8 total sold comps, all scattered. Standard Carrera/S/C4S/GTS variants: 0 comps. Turbo/GT3/GT2 RS: 0–1 comp. Same structural issues as 997.1.

### 991.1 (MY2012–2016) — Session S05
**Status: Effectively unserved. 44 CRITICAL combos, 2 total comps.** The entire 991.1 generation has 2 sold comps: one 2013 Carrera, one 2013 Carrera S. Every other variant+year combination has 0 comps. The generation's NA collector thesis (last NA base Carrera) makes this a high-urgency scraping target.

### 991.2 (MY2017–2019) + 992.1 (MY2020–2024) — Session S06
**Status: Both effectively unserved.** 991.2 has 15 sold comps but they cluster around GT-spec listings (GT2 RS, GT3 RS, GT3 Touring 2018). Standard Carrera/S/GTS/Turbo variants have 0 comps. 992.1 has 7 comps (mostly GT3 area). Both generations have NULL generation_id for all records and NULL status='active' for all records (auction outcome not being written back). **These two structural pipeline issues compound the sparse raw count problem.**

### Boxster — Session S07
**Status: Near-total gap.** 2 total sold comps across the entire Boxster history (986: 1 comp; 987.1: 1 comp; 987.2–718 Boxster: 0). Collector-grade variants (987.2 Spyder, 981 Spyder, 981 GTS, 718 GTS 4.0) have zero coverage. The entire Boxster comp engine is non-functional for valuation purposes.

### Cayman — Session S08
**Status: Near-total gap.** 17 total sold comps across all 4 Cayman generations. 987.1 Cayman: 0 comps. 987.2 Cayman: 3 comps (R only). 981 Cayman: 1 Clubsport (race car — not applicable to road valuation). 982/718 Cayman: 13 comps, mostly 2018 GTS flat-four. No variant+year combo reaches ≥15 comps. Road-spec 981 Cayman GT4 and GTS: 0 comps.

---

## DB State Summary

Two structural problems compound raw comp-count sparsity:

### Problem 1 — generation_id = NULL for 52 sold listings
These are **not mainstream 911/Boxster/Cayman cars** — they are 924/928/944/968 era, race cars (GT3 Cup, GT2 RS Clubsport, 935), ultra-exotics (918 Spyder, Carrera GT), and two non-Porsche entries (Ferrari, Aston Martin). **No backfill needed for V1 scope.** The two non-Porsche entries should be reviewed for removal.

### Problem 2 — trim_category = NULL for 288/556 sold listings (51.8%) ← HIGH URGENCY
This is the D6 leakage problem. The comp engine's Turbo-isolation rule (D6) relies on `trim_category` to separate turbo listings from NA listings. If a 993 Turbo listing has NULL `trim_category`, it is not excluded from NA Carrera comps.

**Root causes:**
- 993/964 listings (28 rows): `trim` field contains literal string `"null"` — deriveTrimCategory cannot classify; fix by deriving from model string
- 997.1/997.2/991.x/992.x listings (~150 rows): listings ingested before trim_category backfill; deriveTrimCategory IS implemented and can be re-run
- Pre-990 gens (930, G-body, etc.) (~125 rows): no derivation logic exists; by design; comp engine doesn't use trim_category for these gens

**Estimated backfill scope:** ~200–250 listings total; script needed: `scripts/backfill/backfill-trim-category.ts`

---

## Output Files

| File | Description | Size |
|---|---|---|
| `critical.txt` | 407 variant+year combos with <5 comps (flat format) | 407 lines |
| `sparse.txt` | 8 variant+year combos with 5–9 comps | 8 lines |
| `warning.txt` | 2 variant+year combos with 10–14 comps | 2 lines |
| `full-counts.csv` | All 422 combos with exact counts and tier classification | 422 rows + header |
| `top-50-priority.md` | Ranked backfill list with reasoning per variant | — |
| `db-state-diagnostic.md` | NULL field counts + root causes + remediation plan | — |
| `REPORT.md` | This file — session aggregator | — |

---

## SUMMARY — USER TO REVIEW

```
═══════════════════════════════════════════════════════════════════════
COMP DATA GAP AUDIT — S09 AGGREGATION SUMMARY
Date: 2026-05-14
═══════════════════════════════════════════════════════════════════════

TOTAL VARIANTS IN CATALOG:     422 variant+year combos
TIER COUNTS:
  Critical  (<5 comps):        407   (96.5%)
  Sparse    (5–9 comps):         8   ( 1.9%)
  Warning   (10–14 comps):       2   ( 0.5%)
  Adequate  (15+ comps):         5   ( 1.2%)

NULL FIELD COUNTS (sold listings = 556 total):
  generation_id = NULL:         52   ( 9.4%)  ← mostly non-target models; no backfill needed
  trim_category = NULL:        288   (51.8%)  ← D6 LEAKAGE: HIGH URGENCY
  Both NULL:                    51   ( 9.2%)
  decoded_body_class = NULL:   165   (29.7%)  ← secondary urgency

NULL FIELD COUNTS (all listings = 729 total):
  generation_id = NULL:         80   (11.0%)
  trim_category = NULL:        399   (54.7%)
  Both NULL:                    75   (10.3%)

TOP 5 HIGHEST-PRIORITY VARIANTS TO BACKFILL:
  1. 997.1 Carrera S Coupe RWD (2005–2008) — 0–5 comps; 42,525 produced worldwide
  2. 997.1 Carrera 4S Coupe AWD (2006–2008) — 0 comps; 27,643 produced worldwide
  3. 997.1 Turbo Coupe AWD (2007–2009) — 0–2 comps; 21,725 produced; last VTG Mezger
  4. 997.2 Carrera S Coupe RWD (2009–2012) — 0 comps; 16,047 produced; 9A1 IMS-clean
  5. 997.2 Carrera 4S Coupe AWD (2009–2012) — 0 comps; 16,963 produced

NULL-FIELD BACKFILL ESTIMATE:
  ~200–250 listings need trim_category backfill
  Approach: one-time script calling deriveTrimCategory(trim, generation_id) for all
    listings where trim_category IS NULL AND trim IS NOT NULL
  For 993/964 where trim = literal "null": derive from model string via regex
  Existing function: lib/trim-category/index.ts:deriveTrimCategory() — fully implemented
  Script to write (do not run yet): scripts/backfill/backfill-trim-category.ts

OUTPUT FILE PATHS:
  research/audit-2026-05-14/s09-comp-gaps/critical.txt         (407 entries)
  research/audit-2026-05-14/s09-comp-gaps/sparse.txt           (8 entries)
  research/audit-2026-05-14/s09-comp-gaps/warning.txt          (2 entries)
  research/audit-2026-05-14/s09-comp-gaps/full-counts.csv      (422 rows)
  research/audit-2026-05-14/s09-comp-gaps/top-50-priority.md
  research/audit-2026-05-14/s09-comp-gaps/db-state-diagnostic.md
  research/audit-2026-05-14/s09-comp-gaps/REPORT.md            (this file)
═══════════════════════════════════════════════════════════════════════
```

---

*Generated by session S09 aggregation — 2026-05-14*
*Sources: S01–S08 per-session comp-gaps.txt files + live Supabase query (358 listings fetched) + generation-content.ts variant catalog + lib/trim-category/index.ts analysis*
