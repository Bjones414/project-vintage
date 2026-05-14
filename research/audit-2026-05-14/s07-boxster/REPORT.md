# Audit Report — S07 Boxster Generations
**Date:** 2026-05-14  
**Scope:** 986 (MY1997–2004), 987.1 (MY2005–2008), 987.2 (MY2009–2012), 981 (MY2013–2016), 982/718 (MY2017+)

---

## Prior Audit Verification

| Claim | Status | Location |
|---|---|---|
| 986 Boxster S 50,896 worldwide | ✓ PRESENT | generation-content.ts:3101 |
| 981 Spyder 2,486 worldwide | ✓ PRESENT | generation-content.ts:3348 |

---

## Auto-Applied Changes (HIGH confidence)

### 1. 987.2 Boxster S Black Edition: ~990 → 987 units
- **Old:** `production: '~990 worldwide'`
- **New:** `production: '987 worldwide'`
- **Source:** Official Porsche AG press release "Only 987 cars: Boxster S Black Edition." The 987-unit cap was deliberate — it matches the 987 chassis designation. Also corrected the notes prose from "~990 units" to "exactly 987 units worldwide."
- **Confidence:** HIGH

### 2. 981 Spyder value_drivers description: ~2,400 → 2,486
- **Old:** `'~2,400 worldwide production, manual-only...'`
- **New:** `'2,486 worldwide production, manual-only...'`
- **Source:** Prior audit established 2,486 as HIGH confidence (Wikipedia, stuttcars, multiple community sources). The variants[].production field was already updated in the prior session; this fixes the value_drivers description for consistency.
- **Confidence:** HIGH

---

## Staged Items (USER TO REVIEW — 10 items)

See `staging.json` for full proposed text. Summary:

| ID | Generation | Type | Confidence | Summary |
|---|---|---|---|---|
| s07-stage-001 | 987.2 | Numeric update | MEDIUM | PDE2 production: "250–500 (sources conflict)" → "500 worldwide" (Wikipedia + 2 corroborating sources) |
| s07-stage-002 | 986 | Numeric conflict | CONFLICT | Post-facelift base: 228 hp vs 225 hp (stuttcars says 225 SAE, other sources vary) |
| s07-stage-003 | 987.1 | Numeric omission | MEDIUM | Base engine power upgrade omitted: MY2007–2008 base rose to 245 hp via VarioCam Plus |
| s07-stage-004 | 981 | Misleading label | CONFLICT | units_produced "~23,600 combined Boxster/Cayman" appears to be a single-year figure, not full-generation total |
| s07-stage-005 | 982 | New variant | MEDIUM | 718 Boxster T missing from variants (MY2020–2024, 300 hp, 6MT only, sport-tuned PASM, LSD) |
| s07-stage-006 | 982 | New variant | MEDIUM | 718 Boxster 25 Years missing (MY2021–2022, 1,250 units, 4.0L 394 hp, GT Silver, Bordeaux Red) |
| s07-stage-007 | 986, 987.1 | Watch-for addition | MEDIUM | AOS failure not listed in 986/987.1 Boxster sections despite being known M96/M97 concern |
| s07-stage-008 | 982 | Watch-for addition | MEDIUM | Flat-four intake carbon buildup not listed in 982 watch_for (applies to 2.0L/2.5T direct injection) |
| s07-stage-009 | ALL | Editorial decision | LOW | Power figures throughout appear to use PS labeled as hp; SAE standardization requires cross-generation editorial decision |
| s07-stage-010 | 986 | Verification gap | LOW | Boxster S 50,896 figure cannot be independently confirmed (no Tier 2 source found); not contradicted |

---

## Watch-For Content Audit

### Mezger Coolant Pipe Issue
**Verdict: Correctly excluded from all Boxster content.**  
The Mezger engine (GT1-block, M96/75 / M97/70-71) is found only in 996 Turbo, 996 GT2, 996 GT3, 997 Turbo (997.1), 997 GT2, 997 GT3/RS. No Boxster variant ever used the Mezger engine. All Boxsters used M96/M97/MA1/MA2/MDG families. The coolant pipe adhesive failure concern does not apply to any Boxster. The file correctly omits this — no action required.

### IMS Bearing (986, 987.1)
Content is accurate and well-calibrated. Key points verified correct:
- Dual-row (earlier, ~1% failure rate) on predominantly MY1997–1999 986 cars
- Single-row sealed (~8% failure rate) on early 987.1 (MY2005, early MY2006) — highest-risk production year
- Updated larger non-serviceable bearing (~1%) on later 987.1 (late MY2006–MY2008)
- 987.2 and later: 9A1 engine has no IMS bearing

### RMS Leak (986, 987.1)
Correctly listed in both sections. No changes needed.

### Bore Scoring
Correctly listed in both 986 and 987.1 sections. No changes needed.

### AOS Failure
**Gap identified.** The 987.1 Cayman section includes AOS in watch_for; the 986 and 987.1 Boxster sections do not, despite sharing the M96/M97 engine. See staging item s07-stage-007.

### 9A1 Intake Carbon (987.2, 981)
Correctly covered in both sections.

### 718 Flat-Four Carbon Buildup (982)
**Gap identified.** The 982 watch_for section covers turbocharger/cooling but not direct-injection carbon buildup for the flat-four base/S/GTS cars. See staging item s07-stage-008.

### Water Pump / Coolant System
Correctly covered in 986, 987.1, 987.2, 981, and 982 sections.

---

## Generation-by-Generation Findings

### 986 Boxster (MY1997–2004)

**Verified correct:**
- Total production ~164,800 worldwide — multiple sources converge near this figure
- 550 Spyder: 1,953 worldwide, 500 US — HIGH confidence (5+ sources)
- Engine codes M96.20 / M96.22 / M96.21 (file uses slash notation — dot notation is Porsche standard, but a global notation pass is needed across all generations, not just Boxster)
- IMS watch_for content — accurate and well-calibrated
- RMS, bore scoring, plastic rear window, convertible top hydraulics — all accurate

**Issues flagged:**
- Post-facelift base power 228 hp vs 225 hp — CONFLICT (see staging s07-stage-002)
- 50,896 Boxster S figure — cannot be independently verified from open sources (see staging s07-stage-010); not contradicted
- AOS failure absent from watch_for (see staging s07-stage-007)
- Facelift engine codes M96.23 (base) and M96.24 (S) not reflected in the engine field

**Prose completeness:** All notes fields complete. No truncation observed.

---

### 987.1 Boxster (MY2005–2008)

**Verified correct:**
- RS 60 Spyder: 1,960 worldwide, ~800 US — HIGH confidence (stuttcars, Wikipedia, elferspot)
- Boxster S engine evolution: 3.2L M96/26 at 280 hp (MY2005–2006) → 3.4L M97/21 at 295 hp (MY2007–2008) — HIGH confidence
- RS 60 Spyder 303 hp — correct as PS figure; 299 SAE bhp (minor measurement ambiguity, LOW priority)
- PDE2 is correctly classified as a 987.2 (MY2009) car — HIGH confidence; file correctly places it in 987.2 section
- IMS content — accurate, correctly identifies MY2005 and early MY2006 as highest-risk
- RMS, bore scoring, convertible top hydraulics — accurate

**Issues flagged:**
- Base engine power: 240 hp shown for all MY2005–2008; MY2007–2008 cars had 245 hp via VarioCam Plus (see staging s07-stage-003)
- Total production ~31,920 base + ~23,420 S — unverifiable from open sources (not contradicted)
- AOS absent from watch_for (see staging s07-stage-007)

**Note on PDE2 classification in task brief:** The task brief listed "S Porsche Design Edition 2" under 987.1, but this is correctly a 987.2 car. The file has it correctly placed.

**Prose completeness:** All notes fields complete. No truncation observed.

---

### 987.2 Boxster (MY2009–2012)

**Verified correct:**
- 9A1 engine — IMS elimination — accurate
- Boxster Spyder: 1,944 worldwide (33+1,418+493), ~890 US — MEDIUM confidence (community data, specific breakdown not found in Tier 1)
- Spyder weight 1,275 kg — HIGH confidence (stuttcars, Wikipedia, autoevolution)
- Base 255 hp, S 310 hp, Spyder 320 hp — HIGH confidence (all major sources agree)
- 7-speed PDK (replaced 5-speed Tiptronic) — correct
- Spyder aluminum doors/decklid, manual canvas top — correct

**Issues found and addressed:**
- **AUTO-APPLIED:** Black Edition: ~990 → 987 units (official Porsche press release)
- PDE2 production: 250–500 (sources conflict) — resolvable to 500 per Wikipedia + corroborating sources (see staging s07-stage-001)

**Prose completeness:** All notes fields complete. No truncation observed.

---

### 981 Boxster (MY2013–2016)

**Verified correct:**
- 981 Spyder: 2,486 worldwide, ~829 North America — HIGH confidence (Wikipedia, stuttcars, community sources)
- 981 Spyder manual-only — HIGH confidence (Wikipedia confirms, no PDK option)
- GTS: MY2015–2016 only — HIGH confidence
- Power figures: 265 hp base, 315 hp S, 330 hp GTS, 375 hp Spyder — all correct as PS figures
- Spyder engine from 991.1 Carrera S block (3.8L, detuned from 400 hp) — confirmed
- EPS on 981 — correct
- 35 kg weight reduction vs 987.2 via aluminum-steel hybrid monocoque — accurate
- GTS formula (Sport Chrono, PASM, sport exhaust, Alcantara standard) — accurate

**Issues flagged:**
- **AUTO-APPLIED:** value_drivers description: ~2,400 → 2,486 (consistency with prior audit's production field update)
- units_produced "~23,600 total 981 Boxster/Cayman per PAG 2014 annual report" — appears to be a single production year figure labeled as if it's a full-generation total; misleading (see staging s07-stage-004)

**Prose completeness:** All notes fields complete. No truncation observed.

---

### 982/718 Boxster (MY2017+)

**Verified correct:**
- 718 base: 300 hp (Porsche Newsroom USA confirmed)
- 718 S: 350 hp — HIGH confidence
- 718 GTS flat-four: 365 hp, MY2018–2019 — HIGH confidence
- 718 GTS 4.0: 394 hp — confirmed per Porsche Newsroom USA (394, not 395)
- 718 Spyder 4.0L: 414 hp — HIGH confidence
- 718 Spyder RS: ~500 hp — official figure is 500 PS / 493 SAE bhp; "~500 hp" is acceptable shorthand
- ICE production end: October 2025 — HIGH confidence (Carscoops, 718forum.com, elferspot)
- Flat-four sub-family vs NA flat-six sub-family distinction — accurate
- GPF on late flat-four European production — accurate

**Omissions identified (staged):**
- 718 Boxster T missing (MY2020–2024, 300 hp, 6MT only, sport PASM, LSD) — see staging s07-stage-005
- 718 Boxster 25 Years missing (MY2021–2022, 1,250 units, 4.0L 394 hp, GT Silver) — see staging s07-stage-006

**Issues flagged:**
- Flat-four intake carbon buildup absent from watch_for — see staging s07-stage-008

**Zero listings:** 982-boxster confirmed zero sold listings in DB. Content audit performed for future use when listings populate. The NA flat-six variants (GTS 4.0, Spyder, Spyder RS) are the highest-value targets to prioritize once BaT scraping resumes.

**Prose completeness:** All notes fields complete. No truncation observed.

---

## Era-Content File Source Audit

All 5 Boxster generation pages are confirmed to read from the single `lib/era-content/generation-content.ts` source. Generation IDs confirmed:
- `'986'` — line 3061
- `'987.1-boxster'` — line 3552
- `'987.2-boxster'` — line 3189
- `'981-boxster'` — line 3308
- `'982-boxster'` — line 3423

No evidence of any Boxster generation page pulling from a separate or duplicated data source.

---

## Content Truncation Check

No truncation found in any prose fields across all 5 generations:
- All `notes[]` arrays: complete (3 entries each)
- All `variants[]` descriptions: complete
- All `engineering[]` entries: complete
- All `watch_for[]` body fields: complete
- All `service[]` entries: complete
- All `value_drivers[]` descriptions: complete

---

## Watch-For Severity Calibration

| Generation | Item | Current Severity | Verdict |
|---|---|---|---|
| 986 | IMS bearing | concern | CORRECT — catastrophic failure risk |
| 986 | Bore scoring | concern | CORRECT — engine replacement territory |
| 986 | RMS leak | caution | CORRECT — significant but repairable |
| 986 | Plastic rear window | caution | CORRECT — cosmetic/visibility issue |
| 986 | Convertible top hydraulics | caution | CORRECT — age-related maintenance |
| 987.1 | IMS bearing | concern | CORRECT |
| 987.1 | RMS leak | concern | CORRECT (elevated from 986's caution — reflects higher mileage/age) |
| 987.1 | Engine code verification | caution | CORRECT |
| 987.2 | Confirm 9A1 engine | caution | CORRECT |
| 987.2 | Spyder authentication | caution | CORRECT |
| 987.2 | 9A1 carbon buildup | caution | CORRECT |
| 981 | Spyder authentication | caution | CORRECT |
| 981 | GTS verification | caution | CORRECT |
| 981 | EPS character | caution | CORRECT — preference, not defect |
| 982 | GTS 4.0 vs flat-four identity | concern | CORRECT — $15k–25k value gap |
| 982 | Spyder RS PDK-only | caution | CORRECT |

**Calibration verdict:** All current severities appropriate. No recalibration needed.

---

## DB Comp Data State

Total sold Boxster listings: **2** (see comp-gaps.txt for full detail).

All Boxster variant/year combinations are effectively comp gaps. Priority scraping order:
1. BaT — 986 Boxster S (high volume, longest history)
2. BaT — 981 GTS (actively traded, collector tier)
3. BaT — 987.2 Spyder (collector premium)
4. BaT — 981 Spyder (near-MSRP trading, important reference)
5. BaT — 718 GTS 4.0 (current-gen pricing)

---

## Output Files

| File | Purpose |
|---|---|
| `diff-log.json` | 3 HIGH-confidence changes auto-applied to generation-content.ts |
| `staging.json` | 10 MEDIUM/LOW/CONFLICT items requiring user review |
| `REPORT.md` | This document |
| `comp-gaps.txt` | All Boxster variant/year combos with <10 comps (effectively all) |
| `PROGRESS.log` | Session checkpoints |
