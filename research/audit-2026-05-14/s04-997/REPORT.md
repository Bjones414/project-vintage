# S04-997 Overnight Credibility Audit — REPORT
**Date:** 2026-05-14  
**Generations:** 997.1 (MY2005–2008) and 997.2 (MY2009–2012)  
**Auditor:** Claude Sonnet 4.6

---

## SUMMARY FOR USER REVIEW

**9 HIGH-confidence changes auto-applied** to `lib/era-content/generation-content.ts`  
**3 priority conflicts resolved** (all three adjudicated to HIGH confidence, all auto-applied — flag below for human verification)  
**2 items staged** for user decision (GT3 RS 4.0 and GT2 RS cap-vs-actual distinction)  
**Critical comp data gap:** Nearly all 997.1/997.2 standard variants have zero comps in DB  

---

## THE THREE CONFLICTS — SOURCE ADJUDICATION

### Conflict 1: 997.1 Turbo — 21,725 vs ~19,200

**Prior file:** `~19,200 worldwide; ~8,870 US`  
**Resolution:** **21,725 is correct.** Auto-applied.

| Source | Figure | Tier | Notes |
|--------|--------|------|-------|
| ianbevis.co.uk (year-by-year) | **15,626 coupe + 6,099 cab = 21,725** | 2 | Arithmetic: 13+2,150+7,885+4,263+1,315=15,626; 608+4,282+1,209=6,099 |
| elferspot.com buyer's guide | **21,725** | 2 | Explicit: "15,626, with 6,099 cabrios" |
| Total 911 via Rennlist | 19,201 ("coupes worldwide") | 2 | Likely coupe-only or combined-generation figure |
| Search synthesis | ~8,869 US | — | 5,482 US coupe + 3,387 US cab = 8,869 |

**Why 19,200 was wrong:** The `~19,200` figure appears to be the sum of 997.1 Turbo coupes (15,626) + 997.2 Turbo coupes (3,301) = 18,927 ≈ 19,200 — a combined two-generation coupe total attributed to the 997.1 alone. The Rennlist/Total 911 citation of 19,201 as "coupes worldwide" is internally inconsistent (coupe-only should be 15,626, not 19,201) and likely either misidentifies the generation scope or the coupe-vs-total distinction. Ian Bevis arithmetic is independently verifiable and matches elferspot's explicit disclosure.

---

### Conflict 2: 997.1 GT3 — 3,329 vs 2,378

**Prior file:** `~2,370 worldwide; ~910 US`  
**Resolution:** **3,329 is correct.** Auto-applied.

| Source | Figure | Tier | Notes |
|--------|--------|------|-------|
| ianbevis.co.uk (year-by-year) | **1+44+2,333+951 = 3,329** | 2 | Calendar years 2005-2008 |
| elferspot.com specs table | **3,329** | 2 | Direct table entry |
| porscheknowledge.com | 2,378 | 2 | Excludes 2008 production run (951 units) |
| Total 911 via Rennlist | 2,378 | 2 | Same exclusion as porscheknowledge |

**Arithmetic proof:** The 997.2 GT3 = 2,256 is confirmed by ALL sources (including those citing 2,378 for 997.1 GT3). Ian Bevis's calendar-year breakdown for the 997.2 GT3: 766(2009)+1,167(2010)+320(2010.2R)+3(2011)=2,256. This accounts for all Ian Bevis production years from 2009 onward. The remaining 2005-2008 production (3,329) is exclusively 997.1 GT3 — there is no room in the accounting for the 951-unit 2008 cohort to belong to the 997.2. The 2,378 figure (Total 911, porscheknowledge) appears to count only through calendar year 2007 (MY2007 production), excluding the MY2008 production run of 951 units.

**User verification question:** Does Ian Bevis's 2008 GT3 production of 951 represent MY2008 997.1 GT3 (3.6L Mezger), or could any of it be pre-production 997.2 GT3 (3.8L)? The latter is implausible since the 997.2 GT3 debuted in MY2010 with first deliveries in 2009-2010.

---

### Conflict 3: 997.2 GT3 RS 3.8L — ~2,000 vs 1,619

**Prior file:** `~2,000 worldwide; ~610 North America`  
**Resolution:** **1,619 is correct for the 3.8L variant.** Auto-applied.

| Source | Figure | Tier | Notes |
|--------|--------|------|-------|
| ianbevis.co.uk (year-by-year) | **1,223+295+100 = 1,618 ≈ 1,619** | 2 | Separated from 4.0L which = 613 |
| elferspot.com specs table | **1,619** | 2 | Explicit, separate from 4.0L |
| nweuro.com | 1,500 worldwide | 2 | Likely announced production target |
| autofolio.info | 1,500 worldwide | 2 | Same sourcing as nweuro |
| Total 911 via Rennlist | 1,500 worldwide | 2 | Matches announced cap |
| porscheknowledge.com | 2,000 worldwide | 2 | Likely combines 3.8L + partial 4.0L, or rounded |
| GT3RS registry via Rennlist | 2,000 worldwide | 2 | Same as porscheknowledge |

**Why 2,000 was wrong:** The `~2,000` figure appears to conflate the 3.8L run (1,619) with the separate 4.0L run (613), or use a pre-completion registry figure. Ian Bevis separates them explicitly: 997.2 GT3 RS 3.8 = 1,618 (2010: 1,223 + 2010.2R: 295 + 2011: 100) vs 997.2 GT3 RS 4.0 = 613 (2011: 550 + 2012: 63). The 1,500 figure from nweuro/autofolio/Total 911 appears to be the announced production target; actual builds slightly exceeded it at 1,619. NA figure refined from ~610 to ~612 (nweuro: 541 US + 71 Canada = 612 NA).

---

## HIGH-CONFIDENCE AUTO-APPLIES SUMMARY

| ID | Generation | Variant | Change | Sources |
|----|-----------|---------|--------|---------|
| DA-001 | 997.1 | units_produced (summary) | ~16,580/~25,690 → exact 16,521/27,237 | Elferspot |
| DA-002 | 997.1 | Turbo | ~19,200 → 21,725 (15,626 Coupe; 6,099 Cab) | Ian Bevis + Elferspot |
| DA-003 | 997.1 | Turbo Cabriolet | (no field) → 6,099 worldwide | Ian Bevis + Elferspot |
| DA-004 | 997.1 | GT3 | ~2,370 → 3,329 | Ian Bevis (arithmetic) + Elferspot |
| DA-005 | 997.1 | GT3 RS | ~1,910/~410 US → 1,909/~413 US | Ian Bevis + Elferspot + GT3RS registry |
| DA-006 | 997.1 | GT2 | ~1,240 → 1,242 | Elferspot + Total 911 + search |
| DA-007 | 997.2 | units_produced (summary) | ~10,500/~15,000/~5,050 → exact 11,098/16,047/5,053 | Prior audit + Elferspot |
| DA-008 | 997.2 | GT3 RS (3.8L) | ~2,000/~610 → 1,619/~612 | Ian Bevis (arithmetic) + Elferspot |
| DA-009 | 997.2 | Turbo S | ~5,150 → 5,150 (3,095 Coupe; 2,055 Cab) | Elferspot buyer's guide |

**Prior audit figures CONFIRMED CORRECT (no change needed):**
- 997.1: Carrera (25,770), Carrera S (42,525), C4 (7,006), C4S (27,643), Targa 4 (1,525), Targa 4S (3,328) ✓
- 997.2: Carrera (11,098), Carrera S (16,047), C4 (2,992), C4S (16,963), Targa 4/4S (1,115/2,560), GTS (5,259), Turbo (5,053), GT3 (2,256) ✓

---

## STAGING ITEMS FOR USER DECISION

### ST-004: GT3 RS 4.0 actual builds vs cap
- **Current:** "600 worldwide cap; 158 North America"
- **Finding:** Ian Bevis + Elferspot show 613 actual builds vs 600 announced cap
- **Recommended:** Add "613 built (600 worldwide cap)" to distinguish cap from actual
- **Decision:** Collector-relevant nuance; "600 worldwide cap" is not wrong

### ST-005: GT2 RS actual builds vs cap
- **Current:** "500 worldwide cap; 142 North America"
- **Finding:** Elferspot shows ~510 actual builds
- **Same decision as ST-004**

---

## CONTENT TRUNCATION CHECK

All prose fields in 997.1 and 997.2 sections reviewed:
- `notes[]` — 3 entries each; all complete, no truncation
- `engineering[]` — 4-5 entries; all complete
- `watch_for[].body` — all complete, buyer questions present
- `service[]` — 3 entries; all complete
- `value_drivers[].description` — all complete

**No truncation detected.**

---

## WATCH-FOR CONTENT AUDIT

(NOTE: Cannot modify watch_for catalog — this is Session 11 scope.)

| Watch-For Item | IMS applies? | Mezger exempt? | Notes |
|---------------|-------------|----------------|-------|
| IMS bearing (997.1) | ✓ M96/M97 only | ✓ Turbo/GT3/GT3 RS/GT2 correctly excluded | CORRECT |
| Bore scoring (997.1) | ✓ M96/M97 only | ✓ Mezger correctly excluded | CORRECT |
| AOS failure (997.1) | ✓ M96/M97 | — | CORRECT |
| Water pump (997.1) | ✓ M96/M97 | — | CORRECT |
| DFI carbon buildup (997.2) | 9A1 only | — | CORRECT |
| IMS not applicable (997.2) | ✓ Informational entry | — | CORRECT — good buyer education |
| SAI pump/valve (997.2) | 9A1 9A1 only | — | CORRECT |

**GAP FLAGGED (ST-006): PDK clutch pack degradation** — no dedicated watch_for entry exists for 997.2 PDK clutch packs despite being a known service concern on high-mileage examples. Currently covered only via a service note. Recommend adding watch_for entry when Session 11 scope opens. Severity: caution.

---

## COMP DATA GAPS (CRITICAL)

The 997.1 and 997.2 era has virtually no comp data in the database:

- **Only 1 variant-year with ≥10 comps:** 2008 GT2 (14 priced comps)
- **Zero records** for all standard Carrera/S/C4/C4S, all Turbo variants, all standard GT3
- **<5 records** for most GT variants
- **Generation column is NULL** for all 997-era cars — comp engine cannot distinguish 997.1 vs 997.2

**This is the most significant operational finding of this audit.** The comp engine will have essentially no data to work with for any 997 analysis until BaT/C&B/PCM scraping is completed for this era.

See `comp-gaps.txt` for full detail and priority scraping targets.

---

## SOURCE TIER INVENTORY

Sources used in this audit:

| Source | Tier | Used For |
|--------|------|---------|
| ianbevis.co.uk | 2 | Year-by-year production arithmetic (definitive for 3 conflicts) |
| elferspot.com | 2 | Variant production tables + buyer's guide |
| nweuro.com | 2 | GT3 RS production + NA allocation |
| autofolio.info | 2 | GT3 RS production corroboration |
| porscheknowledge.com | 2 | GT3 production (conflicting — see conflict 2) |
| Total 911 via Rennlist | 2 | GT3/GT2 production + Turbo (conflicting on 997.1 GT3) |
| GT3RS registry via Rennlist | 2 | GT3 RS worldwide + US allocation |
| Porsche Newsroom | 1 | Total 997 production (213,004) — no variant breakdown |
| Wikipedia (Porsche 911 997) | 2 | Verified production caps for GT3 RS 4.0 / Speedster |

**Note:** No Tier 1 source (Porsche official, Christophorus, Excellence) provides variant-level production breakdowns for the 997 era. All variant-level figures rely on Tier 2 sources, with the Ian Bevis arithmetic providing the highest internal consistency.

---

## ENGINE SPECS VERIFIED

All factory specs verified against multiple sources (no changes needed):

| Variant | Power | Engine | Transmission | Status |
|---------|-------|--------|-------------|--------|
| 997.1 Carrera | 320 hp | 3.6L M96/05 | 6MT/Tip | ✓ |
| 997.1 Carrera S | 355 hp (X51: 376) | 3.8L M97/01 | 6MT/Tip | ✓ |
| 997.1 Turbo | 480 hp (X50: 530) | 3.6L Mezger VTG | 6MT | ✓ |
| 997.1 GT3 | 415 hp | 3.6L Mezger NA | 6MT | ✓ |
| 997.1 GT2 | 530 hp | 3.6L Mezger TT | 6MT | ✓ |
| 997.2 Carrera | 345 hp | 3.6L 9A1 DFI | 6MT/7PDK | ✓ |
| 997.2 Carrera S | 385 hp (X51: 408) | 3.8L 9A1 DFI | 6MT/7PDK | ✓ |
| 997.2 GTS | 408 hp | 3.8L 9A1 DFI | 6MT/7PDK | ✓ |
| 997.2 Turbo | 500 hp | 3.8L Mezger VTG | 6MT/PDK | ✓ |
| 997.2 Turbo S | 530 hp | 3.8L Mezger VTG | PDK only | ✓ |
| 997.2 GT3 (3.8L) | 435 hp | 3.8L Mezger NA | 6MT only | ✓ |
| 997.2 GT3 RS (3.8L) | 450 hp | 3.8L Mezger NA | 6MT only | ✓ |
| 997.2 GT3 RS 4.0 | 500 hp | 4.0L Mezger NA | 6MT only | ✓ |
| 997.2 GT2 RS | 620 hp | 3.6L Mezger TT | 6MT only | ✓ |

**PDK introduction confirmed:** 997.2 only. 997.1 correctly describes "no PDK — only 6MT or Tiptronic S."

---

## OUTPUT FILES

| File | Description |
|------|-------------|
| `diff-log.json` | All 9 HIGH-confidence auto-applies with source citations |
| `staging.json` | 7 staged items including 3 resolved conflicts + 2 user decisions |
| `REPORT.md` | This file |
| `comp-gaps.txt` | DB query results + priority scraping targets |
| `PROGRESS.log` | Session progress log |
