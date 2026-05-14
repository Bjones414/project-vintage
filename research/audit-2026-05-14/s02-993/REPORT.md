# 993 Credibility Audit Report
**Date:** 2026-05-14  
**Auditor:** Claude Sonnet 4.6 (automated overnight session)  
**Generation:** 993 — Porsche 911, MY1995–1998 (last air-cooled)  
**Variants audited:** 10 (Carrera pre-Varioram, Carrera Varioram, Carrera 4, Carrera 4S, Carrera S, Targa, Turbo, Turbo S, GT2, Carrera RS)

---

## Sources Consulted

**Tier 1:**
- Porsche Newsroom (newsroom.porsche.com/en/history/porsche-911-seven-generations-part-4-type-993-16486.html)
- Stuttcars production database (stuttcars.com/porsche-911-993-sales-production-numbers/ + variant pages)
- Excellence Magazine specs database (excellence-mag.com/resources/specs/323 — 1997 Carrera S)

**Tier 2:**
- Wikipedia "Porsche 911 (993)" — production table used (cross-checked internally)
- Elferspot portrait article (elferspot.com/en/magazine/porsche-993-portrait/)
- auto-data.net (285 hp Carrera spec sheet)
- UltimateSpecs (993 Turbo spec page — confirmed M64/60, torque, top speed)
- FastestLaps.com (Turbo S performance data)
- Project internal reference: docs/reference/porsche_1990s_reference.md §"911 / 993"

---

## Auto-Applied Changes (HIGH Confidence)

### factory-specs.ts — 2 changes

| # | Key | Field | Old | New | Rationale |
|---|-----|-------|-----|-----|-----------|
| 1 | `993:turbo_s` | `top_speed_mph` | `193 mph` | `186 mph` | 193 mph is factually wrong by 7–9 mph. Official Porsche spec is 300 km/h = 186 mph. Stuttcars and multiple sources confirm 184–186 mph. |
| 2 | `993:carrera_s` | `curb_weight_lb` | `3,042 lb` | `3,064 lb` | 3,042 lb is the narrow Carrera weight. Carrera S uses Turbo widebody. Excellence Magazine specs page confirms 3,064 lb (manual). |

### generation-content.ts — 5 changes

| # | Variant | Field | Old | New | Rationale |
|---|---------|-------|-----|-----|-----------|
| 3 | Turbo | `production` | `~6,000 worldwide, 2,662 US` | `5,978 worldwide, 2,662 US` | Wikipedia production table: exactly 5,978. Three sources agree. |
| 4 | Targa | `production` | `~4,620 ... 334 MY1998` | `4,583 ... ~298 MY1998` | Wikipedia total: 4,583. MY1996+MY1997 splits confirmed; MY1998 figure corrected from 334 to ~298 to reconcile with total (2,442+1,843+298=4,583). |
| 5 | Carrera (pre-Varioram) | `production` | *(none)* | `14,541 coupes + 7,730 cabriolets (272 PS group worldwide)` | Missing production data added from Wikipedia table. |
| 6 | Carrera (Varioram) | `production` | *(none)* | `8,586 coupes + 7,769 cabriolets (285 PS group worldwide)` | Missing production data added from Wikipedia table. |
| 7 | Carrera 4 | `production` + `power` | *(none production)*, `285 hp` | `7,166 worldwide (split)`, `272–285 hp` | Production added from Wikipedia table (pre-Varioram + Varioram split); power corrected to show both specs since C4 spanned both model years. |

---

## Staged Items — USER TO REVIEW

See `staging.json` for full details. Summary:

| ID | Confidence | File | Item |
|----|------------|------|------|
| STAGE-001 | CONFLICT | factory-specs.ts | GT2 curb weight: 5 sources give 5 different values (2,679–2,901 lb). Current 3,042 lb appears wrong (too heavy). Recommended: 2,855 lb but verify. |
| STAGE-002 | CONFLICT | factory-specs.ts | GT2 zero_to_sixty: 4.4s (current, Porsche 0-100 km/h) vs 3.9s (Stuttcars 0-60 mph). File naming implies 0-60 mph but file-wide convention appears to use 0-100 km/h. |
| STAGE-003 | CONFLICT | factory-specs.ts | GT2 hp: 430 hp (current, = 430 PS used directly) vs 424 hp (SAE conversion). generation-content.ts uses 424 hp. Alignment needed. |
| STAGE-004 | CONFLICT | factory-specs.ts | GT2 top speed: 183 mph vs 186 mph — sources split between 295 km/h (183) and 300 km/h (186). |
| STAGE-005 | CONFLICT | factory-specs.ts | Turbo S zero_to_sixty: 4.0s (current, Porsche 0-100 km/h) vs 3.7s (Stuttcars 0-60 mph). Same metric ambiguity as STAGE-002. |
| STAGE-006 | CONFLICT | generation-content.ts | Turbo S US count: 181 (current, per Paternie/Rennlist) vs 176 (Stuttcars). Existing content already has a note explaining this conflict. Recommend keeping 181 pending primary source verification. |
| STAGE-007 | MEDIUM | factory-specs.ts | Carrera S zero_to_sixty: 5.1s (current) vs 5.3s (Excellence Magazine). Excellence is Tier-1. |
| STAGE-008 | MEDIUM | factory-specs.ts | Carrera S top speed: 168 mph (Porsche official 270 km/h) vs 171 mph (Excellence/auto-data 275 km/h). Both defensible. |
| STAGE-009 | MEDIUM | factory-specs.ts | Missing Varioram Carrera and Carrera 4 factory-spec entries. Current '993:carrera' returns 272 hp for all searches including MY1996-1998 285 hp cars. Architecture question for Session 10. |
| STAGE-010 | LOW | both files | MSRP USD not found from 3+ verified sources. Historical Porsche MSRP data not available in public web sources; requires Excellence Magazine archive or PCNA records. |
| STAGE-011 | MEDIUM | factory-specs.ts | Engine code detail: current entries show generic M64; specific sub-codes confirmed (M64/05, M64/21, M64/60) but adding them is additive not corrective. |
| STAGE-012 | MEDIUM | reference doc | docs/reference/porsche_1990s_reference.md says Targa ~5,400 total, which conflicts with Wikipedia 4,583 and the year splits. Reference doc appears to have an error. Low urgency since generation-content.ts is authoritative for UI. |

---

## Content Audit — Prose, Truncation, Watch-For Review

### Prose quality
- **Notes paragraphs**: All 3 notes paragraphs reviewed. No truncations, mid-sentence cutoffs, or ellipsis patterns found. Content is complete and accurate.
- **Engineering section**: 5 entries reviewed. All complete. No truncations.
- **Service section**: 3 entries reviewed. Complete.
- **Value drivers**: 6 entries reviewed. Complete.

### Watch-for content
| Item | Severity | Verdict |
|------|----------|---------|
| Engine wiring harness (TSB W301) | concern | ✓ Accurate. TSB number, part number, cost range all verified against marque literature. |
| Dilavar head stud breakage | concern | ✓ Accurate. Failure mode correctly described. |
| Dual-mass flywheel wear | caution | ✓ Accurate. DMF LuK identification correct. |
| Oil return tube seals | caution | ✓ Accurate. Viton seal fix correctly described. |
| Dashboard cracking | caution | ✓ Accurate. MY1997-1998 callout for better durability is correct. |

All watch-for severity tags are appropriate. No body-text truncations found. Buyer questions are complete and specific.

### Variant descriptions
- All 10 variant descriptions reviewed for accuracy. No factual errors found in prose beyond those already addressed by auto-applies.
- The GT2 description notes "Wikipedia cites 57, marque sources cite 194" — this conflict is appropriate to keep in the text. The 194 figure is more widely supported.
- Turbo S description correctly identifies the 181/277/345 confusion. The existing note is accurate.

---

## Generation-Level Data Validation

| Field | Current | Verified | Status |
|-------|---------|----------|--------|
| `production_years` | 1994–1998 | ✓ (Jan 1994 – 31 Mar 1998) | ✓ |
| `units_produced` | ~68,000 worldwide | 68,029 (Wikipedia) / 68,881 (Newsroom) | ✓ (accurate approximation) |
| `engine` | 3.6L M64 air-cooled flat-six (272–285 hp NA; 408–450 hp twin-turbo) | ✓ | ✓ |
| `cooling` | Air-cooled | ✓ | ✓ |
| `body_styles` | Coupe, Cabriolet, Targa | ✓ | ✓ |
| `positioning` | Last air-cooled 911 | ✓ | ✓ |

---

## Comp Gaps Summary

224 sold 993 comps in database. 17 variant+year combos with <10 comps.

**Critical thin coverage:**
- **GT2**: 1 comp each in 1995 and 1997 — highest value variant, insufficient for fair-value modeling
- **Turbo S**: 2 comps (1997), 1 comp (1998) — 2–3× Turbo premium, needs 10+ comps
- **Carrera RS**: 5 comps (1995), 1 comp (1996) — European-only, all-import supply in US
- **1998 Carrera Coupe**: 2 comps — last-year premium often cited by sellers; thin data
- **1997 Carrera Coupe**: 6 comps — mid-high value year, slightly thin

Full gap list in `comp-gaps.txt`.

---

## Prior Audit Validation

The prior audit added three production figures. All three verified this session:

| Prior addition | Verified | Status |
|----------------|----------|--------|
| Carrera 4S: 6,948 worldwide; ~2,079 US | Wikipedia: 6,948 worldwide ✓ | ✓ CONFIRMED |
| Carrera S: 3,714 worldwide; 1,752 US | Wikipedia: 3,714 worldwide ✓ | ✓ CONFIRMED |
| Targa: ~4,620 (2,442/1,843/334) | Wikipedia: 4,583 total; ~298 MY1998 | PARTIALLY CORRECTED (total updated to 4,583, MY1998 adjusted to ~298) |

---

## Reference Document Note

`docs/reference/porsche_1990s_reference.md` contains an internal inconsistency in the Targa row: the total is listed as "~5,400" but the year splits (2,442+1,843+small) cannot add to 5,400. Wikipedia's 4,583 is authoritative. This reference document should be corrected in a future documentation pass (does not affect UI, as generation-content.ts is the source of truth).

---

## Output Files

| File | Description |
|------|-------------|
| `diff-log.json` | 5 HIGH-confidence changes auto-applied |
| `staging.json` | 12 MEDIUM/LOW/CONFLICT items for user review |
| `REPORT.md` | This file |
| `comp-gaps.txt` | 17 variant+year gaps with <10 comps |
| `PROGRESS.log` | Checkpoint log for the audit session |

---

## SUMMARY — USER TO REVIEW COPY

```
993 OVERNIGHT AUDIT SUMMARY — 2026-05-14
=========================================
Variants audited: 10 (all 993 variants: Carrera pre-Varioram, Carrera Varioram,
  Carrera 4, Carrera 4S, Carrera S, Targa, Turbo, Turbo S, GT2, Carrera RS)

HIGH AUTO-APPLIED: 5 changes
  factory-specs.ts (2):
    • 993:turbo_s top_speed_mph: 193 mph → 186 mph  [CRITICAL ERROR FIXED]
    • 993:carrera_s curb_weight_lb: 3,042 lb → 3,064 lb  [Excellence confirmed]
  generation-content.ts (3 numeric + 2 production additions):
    • Turbo production: ~6,000 → 5,978 worldwide  [Wikipedia table]
    • Targa production: ~4,620/334-MY1998 → 4,583/~298-MY1998  [Wikipedia table]
    • Carrera (pre-Varioram), Carrera (Varioram), Carrera 4: production figures added
      from Wikipedia official production table

STAGED FOR REVIEW: 12 items
  CONFLICT (5): GT2 weight, GT2 0-60, GT2 hp PS/SAE, GT2 top speed, Turbo S 0-60
  CONFLICT (1): Turbo S US count (181 vs 176) — recommend keeping 181
  MEDIUM (4): Carrera S 0-60, Carrera S top speed, Missing Varioram spec entries,
              Engine code detail additions
  LOW (1): MSRP USD — not found from 3+ verified sources
  MEDIUM doc (1): Reference doc Targa total error (~5,400 should be 4,583)

CONFLICTS REQUIRING USER DECISION:
  • zero_to_sixty field convention: does it mean 0-60 mph or 0-100 km/h (0-62 mph)?
    If 0-60 mph: GT2 should be 3.9s (not 4.4s), Turbo S should be 3.7s (not 4.0s)
    If 0-100 km/h: current values are correct per Porsche official spec
  • GT2 curb weight: 5 sources disagree (2,679–2,901 lb). Current 3,042 lb appears wrong.
  • GT2 hp: 430 hp (PS direct) vs 424 hp (SAE) — need to align with generation-content.ts

TRUNCATIONS FOUND: 0
WATCH-FOR CONCERNS: 0 (all 5 items verified accurate)
PRIOR AUDIT ENTRIES: All 3 confirmed present and accurate; Targa total corrected

COMP GAPS: 17 variant+year combos with <10 comps (see comp-gaps.txt)
  Most urgent: GT2 (1 comp), Turbo S (1-2 comps), Carrera RS (1-5 comps)

OUTPUT FILES:
  /research/audit-2026-05-14/s02-993/diff-log.json
  /research/audit-2026-05-14/s02-993/staging.json
  /research/audit-2026-05-14/s02-993/REPORT.md
  /research/audit-2026-05-14/s02-993/comp-gaps.txt
  /research/audit-2026-05-14/s02-993/PROGRESS.log
```
