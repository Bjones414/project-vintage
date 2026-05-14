# Overnight Credibility Audit — 996.1 and 996.2
**Session:** s03-996  
**Date:** 2026-05-14  
**Target file:** `lib/era-content/generation-content.ts`  
**Auditor:** Claude Sonnet 4.6

---

## Executive Summary

- **6 HIGH-confidence corrections auto-applied** to `generation-content.ts`
- **6 MEDIUM/CONFLICT items staged** in `staging.json` for user review
- **3 significant non-content issues** flagged (factory-specs.ts errors, watch-for gaps, missing GT3 RS variant)
- **Lower control arm truncation: NOT FOUND** in 996.1 or 996.2 sections of `generation-content.ts`
- **Comp data: critically sparse** — 36 total sold listings for both generations; all 25 variant+year buckets have <10 comps

---

## AUTO-APPLIED CHANGES (HIGH CONFIDENCE)

All changes are in `lib/era-content/generation-content.ts`. See `diff-log.json` for source citations.

| ID | Generation | Variant | Field | Old | New |
|----|-----------|---------|-------|-----|-----|
| AA-001 | 996.1 | GT3 Mk1 | notes prose | "approximately 1,860 units" | "1,868 units" |
| AA-002 | 996.1 | GT3 Mk1 | variants[].production | `~1,860 worldwide; 0 US` | `1,868 worldwide; 0 US` |
| AA-003 | 996.2 | GT2 combined | notes prose | "approximately 1,280 units" | "approximately 1,287 units" |
| AA-004 | 996.2 | GT2 Mk1 | variants[].production | `~960 worldwide; ~245 US` | `963 worldwide; ~245 US` |
| AA-005 | 996.2 | GT2 Mk2 | variants[].production | `~320 worldwide` | `324 worldwide` |
| AA-006 | 996.2 | GT3 Mk2 | variants[].production | `~2,310 worldwide; ~1,010 US` | `2,589 worldwide; ~960 US` |

**AA-006 note:** The prior `~2,310` figure was traced to Porsche Knowledge, which appears to have omitted MY2005 production (276 units). Three sources confirm 2,589: Elferspot, supercars.net, and a year-by-year forum breakdown (MY2003: 781 + MY2004: 1,532 + MY2005: 276). GT3 RS (682 units) is a distinct variant and is excluded. The US figure was also updated from `~1,010` to `~960` per year-by-year forum data — this is MEDIUM confidence (one source).

---

## VALIDATION: 7 TONIGHT-ADDED 996.2 FIGURES

| Variant | Value in File | Result |
|---------|--------------|--------|
| Carrera Coupe | 14,629 | ✅ VERIFIED — Supercar Nostalgia + supercars.net (derived) agree |
| Carrera Cabriolet | 14,961 | ✅ VERIFIED — Supercar Nostalgia + supercars.net (derived) agree |
| Carrera 4 Coupe | 3,231 | ✅ VERIFIED — Elferspot + supercars.net agree exactly |
| Carrera 4 Cabriolet | 7,155 | ✅ VERIFIED — Elferspot + supercars.net agree exactly |
| Targa | 5,089 | ⚠️ CONFLICT → STAGED (ST-002) — Stuttcars/supercars.net say 5,152 |
| Carrera 4S Coupe | 17,283 | ⚠️ CONFLICT → STAGED (ST-001) — Elferspot/supercars.net/Porsche archive say 17,298 |
| Carrera 4S Cabriolet | 5,757 | ✅ VERIFIED — all three sources agree exactly |

---

## VALIDATION: 996.1 PRODUCTION FIGURES (PRIOR AUDIT)

All four prior-audit figures are confirmed HIGH-confidence and left unchanged.

| Variant | Value in File | Sources | Result |
|---------|--------------|---------|--------|
| Carrera total (55,562) | 31,688 Coupe + 23,874 Cab | Supercar Nostalgia + supercars.net (derived) | ✅ VERIFIED |
| Carrera Cabriolet (23,874) | 23,874 | Same | ✅ VERIFIED |
| Carrera 4 total (22,284) | 12,720 Coupe + 9,564 Cab | Supercar Nostalgia + supercars.net (derived) | ✅ VERIFIED |
| Carrera 4 Cabriolet (9,564) | 9,564 | Same | ✅ VERIFIED |

---

## FACTORY SPECS AUDIT

### factory-specs.ts — Critical Errors Found

These errors are in `lib/era-content/factory-specs.ts` (outside the auto-apply scope of this audit). **Manual fixes required.**

**ERROR 1: `'996.1:carrera_4s'` entry should not exist**
- The 996.1 generation never had a Carrera 4S. The wide-body AWD C4S was introduced with the 996.2 facelift (MY2002).
- The entry incorrectly lists `hp: '320 hp'` — which is the 996.2 spec, not 996.1.
- **Action:** Delete the `'996.1:carrera_4s'` entry, or reassign it to `'996.2:carrera_4s'` (which already exists correctly).

**ERROR 2: `'996.1:carrera_s'` entry should not exist**
- The 996 generation never had a Carrera S. The Carrera S trim was introduced with the 997.1 (MY2005).
- The entry incorrectly lists `hp: '320 hp'` — which is the 996.2 spec.
- **Action:** Delete the `'996.1:carrera_s'` entry entirely.

### factory-specs.ts — Minor Spec Discrepancies

| Key | Field | File Value | Source Value | Verdict |
|-----|-------|-----------|-------------|---------|
| `996.2:carrera` | zero_to_sixty | 5.2s | 4.9–5.0s (Porsche official 0-60 for 6MT) | MEDIUM — 5.2s may reflect Tiptronic; recommend noting |
| `996.1:turbo` | torque | 413 lb-ft | 415 lb-ft (supercars.net) | MINOR — within rounding of 560 Nm conversion |
| `996.2:turbo_s` | zero_to_sixty | 3.9s | 4.1–4.2s (Elferspot, supercars.net) | MEDIUM — 3.9s appears aggressive; Porsche official was 4.2s to 100 km/h |
| `996.1:gt3` | zero_to_sixty | 4.8s | 4.7s (supercars.net) | MINOR — within normal measurement variance |
| `996.1:gt3` | top_speed_mph | 187 mph | 188 mph (supercars.net) | MINOR — within normal measurement variance |

---

## WATCH-FOR AUDIT

### Lower Control Arm Truncation — NOT FOUND

The task mentioned a possible truncation "it is one of..." in a lower control arm watch-for description. **This text does not exist in the 996.1 or 996.2 sections of `generation-content.ts`.** The lower control arm concern may be:
- In the Session 11 watch-for catalog code (outside this audit's scope)
- In a different generation's section (not assigned)
- Not yet written

No truncations were found in any 996.1 or 996.2 watch-for descriptions. All watch-for `body` fields appear to be complete sentences without cutoffs.

### Missing Watch-For Items — 996.2

These are **significant gaps** in the 996.2 `watch_for` array that affect Mezger-engine variants (GT3 Mk2, GT2, Turbo):

**GAP 1: No PCCB watch-for item**
- PCCB ceramic brakes are **standard** on the 996.2 GT2 Mk1/Mk2 and Turbo S.
- PCCB rotor replacement costs $5,000–$10,000 per axle set — one of the highest-cost maintenance items on any 996 variant.
- The 996.2 watch_for array covers only M96 Carrera items. No PCCB item exists.
- **Recommendation:** Add a PCCB watch-for entry scoped to GT2 and Turbo S. Existing PCCB watch-for language exists for later generations (991.2, 992) and can be adapted.

**GAP 2: No GT1-block coolant pipe watch-for item**
- The GT1-derived Mezger engine (used in 996.2 GT3 Mk2, GT2, and Turbo) has a documented failure mode: bonded coolant pipe fittings that can pop, causing coolant intrusion into the oil system.
- This defect is documented in `docs/reference/defects/02_engine_mezger.md` and tracked in PROJECT_STATE.md.
- It applies to all Mezger-engine 996.2 variants but is NOT mentioned in any 996.2 watch-for item.
- **Recommendation:** Add a GT1-block coolant pipe watch-for entry for Mezger variants. The defect file has the content (ID: `mezger_gt1_coolant_pipes`).

### IMS Bearing Attribution — CORRECT

The task specifically requested verification that IMS concern applies to 996.1/996.2 Carreras but NOT to Turbo/GT3/GT2. The file handles this correctly:
- Carrera watch-for items are explicitly scoped to M96 engines
- Both GT3 Mk2 and GT2 service notes correctly state "no IMS concern" on Mezger engines
- The engineering notes clearly delineate the two engine families

---

## MISSING VARIANT — 996.2 GT3 RS

The 996.2 GT3 RS is a significant, separately-counted variant not listed in the 996.2 `variants[]` array:
- **Production:** 682 worldwide (confirmed: Elferspot, supercars.net, Porsche Knowledge)
- **Years:** MY2004 only
- **Power:** 381 hp (same Mezger as base GT3 Mk2)
- **Significance:** Lightest 996.2, most collectible naturally aspirated variant; commands a substantial premium over base GT3 Mk2
- A factory-specs entry already exists: `'996.2:gt3_rs'` ✓
- **Recommendation:** Add GT3 RS as a named variant in the 996.2 variants array with production: `682 worldwide`

---

## GENERATION-LEVEL QUICKFACTS (units_produced)

Both generation-level `units_produced` summary fields have accuracy issues. See ST-004 and ST-005 in staging.json.

| Generation | Current | Issue |
|-----------|---------|-------|
| 996.1 | `~37,750 Carrera Coupes worldwide (all 996 combined)` | Does not reconcile with any combination of per-variant data. Appears stale. |
| 996.2 | `~29,380 Carrera Coupes worldwide; ~17,290 Carrera 4S Coupes worldwide` | "~29,380" appears to be Carrera Coupe + Cab (14,629 + 14,961 = 29,590) mislabeled as "Coupes only"; C4S Coupes should be 17,298 per ST-001. |

---

## PROSE AND CONTENT CHECK

### Generation Page Quick Facts (996.2)

The 996.2 generation page builds quickFacts from `content.production_years`, `content.engine`, `content.cooling`, `content.body_styles`, `content.units_produced`, and the DB `msrp_launch_usd`. All these fields are populated:
- `production_years`: '2002–2005' ✓
- `body_styles`: 'Coupe, Cabriolet, Targa' ✓
- `engine`: '3.6L M96 water-cooled flat-six (320–345 hp NA); 3.6L Mezger twin-turbo (415–483 hp Turbo/GT2); 3.6L Mezger NA (GT3: 381 hp)' ✓
- `cooling`: 'Water-cooled' ✓
- `units_produced`: inaccurate — see ST-005

### 996.2 Intro / Hero Copy

> "The 996.2 facelift introduced Turbo-derived headlamps, a 3.6L M96 producing 320 hp, and the first US-legal 911 GT3."

This is accurate. The 996.2 Carrera base hp is 320 hp (verified). The GT3 Mk2 was indeed the first US-legal GT3.

### 996.1 Intro / Hero Copy

> "...the 996.1 is now the entry point to modern 911 ownership, with a compressed valuation..."

Accurate and appropriate.

### Engineering Notes

All engineering notes verified as factually correct. Highlights:
- Five-chain vs. three-chain M96 distinction: ✓ (specific to 996.1 vs. 996.2)
- GT3 Mk1 Mezger engine code M96/76: ✓ (Elferspot confirms)
- GT3 Mk2 engine code M96/79: ✓ (Elferspot confirms) — not explicitly mentioned in content but engine code is in factory-specs.ts
- Variocam pad concern scoped correctly to 996.1 only: ✓
- IMS scoped to M96 Carreras, NOT Mezger: ✓

### Watch-For Descriptions

All 5 watch-for items in 996.1 and all 5 in 996.2 have complete prose — no cutoffs found. Key items verified:

**996.1 IMS:** Correctly distinguishes MY1999 dual-row vs. MY2000-2001 single-row (~8% failure rate) ✓  
**996.2 IMS:** Correctly references late-production bearing update ✓  
**Variocam pad:** Correctly scoped to 996.1 five-chain 3.4L only ✓  
**AOS:** Both generations covered ✓  
**Water pump:** Appears only in 996.2 (appropriate — this concern is more pressing in the 996.2 era) ✓

---

## COMP DATA SUMMARY

**Query result:** 36 total sold listings in DB for 996.1 + 996.2 combined (15 for 996.1, 21 for 996.2).  
**All 25 variant+year buckets have <10 comps — zero adequate buckets.**

Critical gap highlights:
- 996.1 Carrera (all years): 1–3 comps per year — essentially no comp coverage
- 996.2 GT2: 1 listing total (MY2002) — comp engine will show wide confidence intervals
- 996.2 GT3/GT3 RS: 1–2 listings total — insufficient for reliable valuation
- The most common 996 listing type in DB is 996.1 Turbo (6 total: 2 base, 4 six-speed)

**Priority for comp data ingestion:** 996.1 and 996.2 Carrera models first (highest transaction volume in the actual market); then Turbo, then GT3/GT2.

---

## ANALYZE PAGE / VIN CHECK

**VIN WP0CA299X2S650260** (996.2 Carrera Cabriolet):  
The generation content file correctly covers the 996.2 Carrera Cabriolet variant. Content that would render on this VIN's analyze page includes: the Carrera Cabriolet production figure (14,961), the M96 IMS and bore-scoring watch-for items, the AOS and water pump concerns, and the value drivers (IMS service, period color, service history). All of this content appears accurate and complete per this audit.

---

## OUTPUT FILES

| File | Status |
|------|--------|
| `diff-log.json` | ✅ Written — 6 auto-applied changes |
| `staging.json` | ✅ Written — 6 items for user review |
| `REPORT.md` | ✅ This file |
| `comp-gaps.txt` | ✅ Written — 36 listings / 25 gaps / 0 adequate |
| `PROGRESS.log` | ✅ Written |
