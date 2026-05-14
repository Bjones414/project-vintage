# Audit Report — G-body 911 and 964
**Session:** s01-gbody-964  
**Date:** 2026-05-14  
**Generations covered:** g-series-2.7 (MY1974–1977), 911-sc (MY1978–1983), 911-3.2-carrera (MY1984–1989), 964 (MY1989–1994)

---

## Executive Summary

10 HIGH-confidence corrections auto-applied to `lib/era-content/generation-content.ts`. 11 items staged for review. One HIGH-PRIORITY confirmed factual error (SC Cabriolet soft top) requires immediate correction — it appears in two locations in the file and is clearly wrong. One structural dead-code issue (orphaned generation key) is flagged but was not auto-fixed per task instructions.

No content truncations were found across any of the four target generations. No watch-for severity miscalibrations were identified. Generation and variant pages confirmed to pull content exclusively from `getGenerationContent()` — no hardcoded duplicates.

---

## 1. Auto-Applied Changes (10 total)

All changes are in `lib/era-content/generation-content.ts`. Full details in `diff-log.json`.

| ID | Generation | Field | Change |
|---|---|---|---|
| DL-001 | g-series-2.7 | Belgian Gendarmerie car count | 30 → 20 |
| DL-002 | 911-3.2-carrera | Speedster Turbo-Look production (variant) | 1,930 → 1,933 |
| DL-003 | 911-3.2-carrera | Speedster counts in notes paragraph | 1,930 → 1,933; 2,100 → 2,104; end month removed |
| DL-004 | 911-3.2-carrera | Commemorative Edition production (variant) | 870 CE → 875 CE |
| DL-005 | 911-3.2-carrera | Commemorative Edition count in notes | 870 units → 875 units |
| DL-006 | 911-3.2-carrera | units_produced | ~76,470 → ~76,473 |
| DL-007 | 911-3.2-carrera | Total production in notes[0] | 76,470 → 76,473 |
| DL-008 | 964 | Turbo S Leichtbau weight saving | 300 lb → 397 lb (180 kg) |
| DL-009 | 911-3.2-carrera | Speedster Turbo-Look end date | "January through July 1989 only" → "in 1989 only" |
| DL-010 | 911-3.2-carrera | Speedster Turbo-Look count in value_drivers | 1,930 → 1,933 (missed field, caught at REPORT time) |

**DL-010 note:** The DL-002 Node.js auto-apply script corrected the production count in the variant and notes paragraph but did not catch the same figure in the `value_drivers` array. DL-010 corrects this residual inconsistency at the same HIGH confidence as DL-002.

---

## 2. Staged Items Requiring Review (11 total)

Full details with sources and recommended corrections in `staging.json`.

### 2a. Structural Issue

**ST-STRUCT-001 — `'911-g-body'` orphaned key in `generation-display.ts` [HIGH PRIORITY]**

The key `'911-g-body': 'G-body'` at line 12 of `generation-display.ts` is a dead alias. Database confirms: no `porsche_generations` row with this ID, no `CONTENT` entry, zero listings with `generation_id='911-g-body'`. The G-body era is fully split into `g-series-2.7`, `911-sc`, and `911-3.2-carrera` in both the DB and content file.

Recommended action: Remove this single mapping from `DISPLAY_OVERRIDES`. Safe dead-code deletion with no live UI impact. Not auto-fixed per task instructions.

---

### 2b. ⚠️ HIGH-PRIORITY FACTUAL ERROR — SC Cabriolet Soft Top (ST-002)

**Two locations in `911-sc` content claim the 1983 SC Cabriolet had a power-operated soft top. It did not.**

The 1983 SC Cabriolet had a **manual** soft top. The power-operated soft top arrived on the **1987 Carrera 3.2 Cabriolet**. This is a well-established fact in Porsche marque history; the manual top is documented in SC-era service literature.

**Location 1 — variant description** (`CONTENT['911-sc'].variants[2].description`, line ~2509):  
Current: `"Fully operational power soft top; rear jump seats retained."`  
Should be: `"Manual soft top; rear jump seats retained."`

**Location 2 — engineering note** (`CONTENT['911-sc'].engineering[4]`, line ~2525):  
Current: `"using a power-operated soft top developed with Webasto."`  
Should be: `"using a manual soft top. The power-operated soft top arrived on the Carrera 3.2 Cabriolet from MY1987."`

The Webasto attribution in engineering[4] is also incorrect or misplaced — Webasto is primarily associated with pop-up sunroofs, not Porsche convertible top mechanisms.

This error would be immediately visible to any SC Cabriolet owner or serious marque specialist. **Recommend applying this correction before publishing.**

---

### 2c. Other Staged Items

| ID | Generation | Issue | Confidence |
|---|---|---|---|
| ST-001 | 930 | 3.0L Turbo power: 245 DIN (content) vs 260 PS (Wikipedia) | CONFLICT |
| ST-003 | 964 | Tiptronic intro year: MY1991 (content) vs MY1990 (some sources) | MEDIUM |
| ST-004 | 964 | Engine field uses "M30/69" for Turbo 3.3; all other refs use "930/60" | HIGH internal |
| ST-005 | 911-3.2-carrera | Speedster end month: July vs September 1989 (date removed in DL-009; documented dispute) | CONFLICT |
| ST-007 | 964 | RS Lightweight sub-count "1,910" — verify against Porsche build data | MEDIUM |
| ST-008 | 964 | RS 3.8 production: "55 cars" vs conflicting specialist sources (51, 55, 56) | LOW |
| ST-009 | 911-3.2-carrera | Club Sport US count: "~28 US" vs registry counts of ~50–53 | MEDIUM |
| ST-010 | 964 | Speedster narrow-body count: "930" vs some sources giving "936" | LOW |

**ST-004 (964 engine code inconsistency) warrants early attention:** The top-level `engine` field for the 964 describes the Turbo 3.3 engine as "M30/69" but the variant description, the notes paragraph, and the watch-for item all call it "930/60." The M30/69 SL designation belongs only to the Leichtbau engine. This is almost certainly a copy error in the engine field, but confirm "930/60" in a technical source before applying.

---

## 3. Truncation Scan Results

A Node.js script scanned all four target generation sections for truncation indicators (trailing ellipsis, mid-sentence cutoffs, suspiciously short prose fields). **No truncations were found.** Two `positioning` taglines (g-series-2.7 and 964) were noted as intentionally lacking terminal punctuation — this is the correct style for positioning lines and requires no change.

---

## 4. Source Integrity Check — Generation Pages

Both the generation page (`app/(app)/generations/[id]/page.tsx`, line 62) and the variant page (`app/(app)/generations/[id]/[variant]/page.tsx`, line 15) call `getGenerationContent(id)` as the sole content source. `EraCard.tsx` (line 209) follows the same pattern. **No hardcoded duplicates were found.**

---

## 5. Watch-For Severity Calibration

All watch-for items across the four target generations were reviewed against the `concern / caution / positive` severity taxonomy.

**No miscalibrations identified.** Severity assignments are appropriate:
- **concern** (HIGH): Chain tensioner failure, magnesium head-stud pull-out, Carrera badge misrepresentation, 930 four-speed final drive fragility, 930 boost system age, Slantnose authentication, 964 head stud breakage — all correctly at highest severity
- **caution** (MEDIUM): Type 915 gearbox wear, K-Jet aging, pre-1976 body rust, dashboard cracking, dual-mass flywheel, HVAC servo — all correctly at moderate severity
- No watch-for items are undercalibrated for their failure mode

---

## 6. Comp Data Gaps

Full gap list in `comp-gaps.txt`. Summary:

- **Only adequately covered group:** 964/1993/Carrera 2 narrow-body (n=15)
- **All g-series-2.7 years:** 0–6 comps per year/trim — no year has ≥10
- **911-sc years:** 0–1 comps per year — effectively no comp coverage
- **911-3.2-carrera:** 0–3 comps for most year/trim combos; 1989 Speedster (n=2) and 1985/1987/1988 base Carrera (n=1–2) are the only coverage
- **964:** Carrera RS/S Leichtbau/Speedster combos have 0–2 comps; 1994 Turbo 3.6 has n=3

These gaps reflect BaT/C&B coverage patterns (high-dollar cars sell more frequently) but leave almost all G-body and early 964 valuations without statistical confidence. Recommend prioritizing data acquisition for 911-sc (1978–1983) and 911-3.2-carrera base Coupe — the highest-volume cars with the most buyer activity.

---

## 7. Output Files

| File | Status |
|---|---|
| `diff-log.json` | Complete — 10 auto-applied changes |
| `staging.json` | Complete — 11 staged items |
| `comp-gaps.txt` | Complete |
| `PROGRESS.log` | Updated at session close |
| `REPORT.md` | This file |

**Primary file modified:** `lib/era-content/generation-content.ts`  
(Unchanged files: all other source files, DB schema, comp engine, watch-for catalog)

---

## 8. Recommended Morning Actions (Priority Order)

1. **Apply ST-002** — SC Cabriolet soft top correction (two locations). HIGH-confidence factual error visible to any specialist. 10-minute edit.
2. **Apply ST-STRUCT-001** — Remove `'911-g-body'` dead mapping from `generation-display.ts`. One-line deletion.
3. **Review ST-004** — 964 engine field "M30/69" vs "930/60". Likely a one-line fix once "930/60" is confirmed in a technical source.
4. **Review ST-003** — 964 Tiptronic MY1990 vs MY1991. Check a Geneva 1990 press release or a 964 factory introduction document.
5. **Investigate ST-009** — Club Sport US count (~28 vs ~53). A specialist registry query resolves this in minutes.
6. **Defer ST-001, ST-007, ST-008, ST-010** — Lower impact; wait for authoritative primary sources before acting.
