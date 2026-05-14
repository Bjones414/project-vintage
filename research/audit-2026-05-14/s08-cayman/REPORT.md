# Cayman Credibility Audit — REPORT
**Session:** s08-cayman  
**Date:** 2026-05-14  
**Scope:** 987.1-cayman, 987.2-cayman, 981-cayman, 982-cayman  
**Auditor:** Claude (automated overnight audit)

---

## Executive Summary

6 HIGH-confidence corrections auto-applied. 7 items staged for user review (4 MEDIUM, 2 LOW, 1 CONFLICT). The most significant error in the dataset was the **987.2 Cayman S Black Edition production figure** — content stated "~500 US units" when the actual 500-unit cap is worldwide (~180 US). A secondary cluster of errors appeared in the **987.1 base Cayman variant** (wrong engine code M96→M97/20, wrong torque 199→201 lb-ft, wrong standard gearbox). The **Design Edition 1 exact production figure** (777, not ~770) was corrected. One CONFLICT was identified: the "25 Years Anniversary" Cayman appears not to exist — the anniversary edition was Boxster-only.

**Listing data shows all four Cayman generations are severely under-represented** in the comp database. The 981 GT4 — the most significant collector variant in the lineup — has zero road-car listings.

---

## Generation-by-Generation Findings

### 987.1 Cayman (MY2006–2008)

**Variants audited:** Cayman S, Cayman (base), Cayman S Sport, Design Edition 1

**Errors found and applied:**

| # | Field | Old | New | Confidence |
|---|---|---|---|---|
| HIGH-02 | `engine` field | `2.7L M96 flat-six (base Cayman)` | `2.7L M97/20 flat-six (base Cayman)` | HIGH → applied |
| HIGH-01a | `notes[3]` | `~770 worldwide (~240 US)` | `777 worldwide (240 US)` | HIGH → applied |
| HIGH-01b | DE1 variant description | `~770 worldwide, approximately 240 US` | `777 worldwide, 240 US` | HIGH → applied |
| HIGH-03+04 | Base Cayman variant description | `M96 flat-six, 199 lb-ft, six-speed manual` | `M97/20 flat-six, 201 lb-ft, five-speed manual (six-speed optional)` | HIGH → applied |

**Staged items:**
- MEDIUM-01: `units_produced` ~23,000 vs ~20,300 from delivery data — **user review needed**

**Verified correct (no change needed):**
- Cayman S: 295 hp (SAE), 251 lb-ft — ✓ confirmed by stuttcars and Porsche US press
- Cayman S Sport: ~700 worldwide, ~100 US, MY2008, 303 hp via ECU remap — ✓ confirmed
- IMS concern applies to all 987.1 Cayman engines — ✓ correct (M97/20 and M97/21 both affected)
- Production years 2006–2008 — ✓ correct
- Body style: Coupe only — ✓ correct

**Content gaps (not errors):**
- No 0-60 or top speed in variant descriptions (not required by content schema)
- No MSRP listed

**Listing status:** 0 listings. All variants have 0 comps. Hero fallback confirmed as typography-only.

---

### 987.2 Cayman (MY2009–2012)

**Variants audited:** Cayman, Cayman S, Cayman R, Cayman S Black Edition

**Errors found and applied:**

| # | Field | Old | New | Confidence |
|---|---|---|---|---|
| HIGH-05a | `notes[3]` | `~500 US units` | `~500 worldwide (~180 US)` | HIGH → applied |
| HIGH-05b | Black Edition variant description | `~500 US units` | `~500 worldwide (~180 US)` | HIGH → applied |

**Staged items:**
- MEDIUM-02: Cayman R `years: '2012'` — worldwide context is MY2011/2012; US is MY2012 only — **low-impact, user review**

**Verified correct (no change needed):**
- Cayman R production: **1,621 worldwide** — ✓ confirmed by Wikipedia, Elferspot, and multiple community registries. The figure 1,621 is consistent across Tier 1 and Tier 2 sources. (Note: an earlier community estimate of 1,421 was cited in one source but appears to be a stale/incomplete registry count.)
- Cayman R: 330 hp, 3.4L 9A1 — ✓ correct
- Cayman S: 320 hp, 273 lb-ft — ✓ correct
- Cayman base: 265 hp, 221 lb-ft — ✓ correct
- 9A1 engine eliminates IMS — ✓ correct
- PDK 7-speed first availability — ✓ correct
- Black Edition: 330 hp via ECU remap — ✓ correct
- Production years 2009–2012 — ✓ correct

**Listing status:** 3 listings (2× Cayman R, 1× base). All variants <10 comps. Cayman S and Black Edition have zero listings.

---

### 981 Cayman (MY2013–2016)

**Variants audited:** Cayman, Cayman S, Cayman GTS, Cayman GT4

**No HIGH-confidence corrections applied.** (Torque error identified in initial analysis was a false positive — see note below.)

**Note on GTS torque false positive:** Initial analysis flagged "273 lb-ft → 280 lb-ft" as a HIGH correction for the GTS variant. On re-examination, the 981 GTS variant description does not include a torque figure at all — the 273 lb-ft in the 981 section is the Cayman S spec (which is correct: 370 Nm = 273 lb-ft). The GTS has a higher torque (380 Nm = 280 lb-ft per official Porsche spec) but this figure is absent from the current content rather than wrong. This is a **content gap** rather than a factual error. The GTS description could benefit from adding "280 lb-ft" in a future content enrichment pass.

**Staged items:**
- MEDIUM-03: GT4 production range `2,500–6,000 worldwide (disputed)` — community DB suggests 6,200–6,500; commonly cited press figure ~2,500. Range may need recalibration.
- MEDIUM-04: GT4 `years: '2016'` — evidence for both MY2015 (European) and MY2016 (US primary); '2015–2016' may be more accurate.

**Verified correct (no change needed):**
- Cayman S: 325 hp, 273 lb-ft, 2013–2016 — ✓ correct
- Cayman GTS: 340 hp, 2015–2016 — ✓ correct
- Cayman GT4: 385 hp, 3.8L, manual-only — ✓ correct
- GT4 engine from 991.1 Carrera S — ✓ correct
- GT4 uses 991 GT3 brakes and suspension hardware — ✓ correct
- Production years 2013–2016 — ✓ correct (note: production started as 2014 MY in spring 2013)
- All-new aluminum-steel platform — ✓ correct

**Content gaps (not errors):**
- GTS: torque not listed (280 lb-ft / 380 Nm per Porsche spec)
- GT4: torque not listed (310 lb-ft / 420 Nm per Porsche official tech spec PDF)
- GT4: 0-60 and top speed not listed in variant description

**Listing status:** 1 listing (Cayman GT4 Clubsport — track/race variant, not road car). All standard road car variants have 0 comps.

---

### 982 Cayman / 718 (MY2017–2025)

**Variants audited:** 718 Cayman, 718 Cayman S, GTS flat-four, GTS 4.0, GT4, GT4 RS

**Missing variants (content gaps):**
- 718 Cayman T — **not present in content** (staged as LOW-01)
- 25 Years Anniversary — **does not appear to exist as a Cayman model** (staged as CONFLICT-01)

**No HIGH-confidence corrections applied.**

**Staged items:**
- CONFLICT-01: "25 Years Anniversary" Cayman — research finds NO evidence this variant was produced; Boxster-only. **User must verify before adding to content.**
- LOW-01: 718 Cayman T missing from content variants — should be added with MY2020–2025, 300 hp, sport-focused trim.
- LOW-02: `production_years` end date and ICE-end assertion — biased to staging per task instructions.

**Verified correct (no change needed):**
- 718 Cayman: 300 hp, 280 lb-ft, 2.0L flat-four — ✓ confirmed (300 hp is the US-market figure)
- 718 Cayman S: 350 hp, 309 lb-ft, 2.5L VTG flat-four — ✓ confirmed (Porsche US press release)
- GTS flat-four: 365 hp — ✓ confirmed (365 PS = 365 hp as Porsche US quotes; Wikipedia shows 360 hp SAE, but Porsche US official quote is 365)
- GTS 4.0: 394 hp — ✓ (Wikipedia shows 395 hp; Porsche spec sheets show 394 hp SAE / 400 PS — 394 appears to be correct US-market figure)
- GT4: 414 hp — ✓ correct
- GT4 RS: 493 hp — ✓ correct (500 PS SAE-converted to 493 hp)
- GT4 RS: PDK-only, 9,000 rpm, 4.0L from 992 GT3 — ✓ correct
- Weissach Package description — ✓ correct
- Production years 2017+ — ✓ correct (staging end date per instructions)

**Listing status:** 13 listings. Breakdown:
- GTS flat-four (2018): ~9–10 listings — approaching threshold for 2018 vintage only
- GT4 RS: 3 listings (Weissach ×2, standard ×1)
- GT4: 1 listing (no price)
- Base, S, T, GTS 4.0: 0 listings each

---

## Watch-For Content Review

### 987.1-cayman watch_for
- IMS bearing (M96/M97): ✓ accurate, bearing variant distinction correct, class action data cited correctly
- Bore scoring (Lokasil): ✓ accurate
- RMS weeping: ✓ accurate
- AOS failure: ✓ accurate
- Water pump impeller: ✓ accurate — correctly identifies plastic impeller as failure mode

### 987.2-cayman watch_for
- DFI carbon buildup: ✓ accurate, 60,000–80,000 mile service interval correct
- Water pump: ✓ accurate — carry-forward from M97 family design
- PDK service intervals: ✓ accurate — ~40,000 mile PDK fluid change correct
- Cayman R authenticity: ✓ accurate — aluminum doors/decklid verification noted, COA requirement correct

### 981-cayman watch_for
- Water pump (9A1 carry-forward): ✓ accurate
- DFI carbon buildup: ✓ accurate
- GT4 clutch wear: ✓ accurate — short-ratio gearbox demand noted
- GT4 documentation/provenance: ✓ accurate — Clubsport and street spec confusion is real

### 982-cayman watch_for
- Flat-four heat soak/intercooler: ✓ accurate
- GT4 RS coolant system TSB: ✓ accurate — early MY2022 TSB documented
- GT4 RS PDK-only: ✓ accurate — PDK interval requirements noted
- GT4 RS Weissach authenticity: ✓ accurate — magnesium wheel verification correct

**Watch-for severity calibration:** All severity tags (concern/caution) appear appropriately calibrated. No upgrades or downgrades needed. The GT4 RS coolant TSB is correctly flagged as 'concern' (highest severity).

---

## Content Truncation Check

Reviewed all prose fields across all 4 generations: `intro`, `positioning`, `notes`, `variants.description`, `engineering`, `watch_for.body`, `service`, `value_drivers.description`. No truncated sentences or incomplete prose detected in any field across all four generations. All text reads as complete.

---

## Analyze Page VIN Coverage

As noted in listing status above:
- 987.1-cayman: 0 listings — no VINs to analyze
- 987.2-cayman: 3 listings — only Cayman R and base have any representation; cannot validate S or Black Edition analyze page
- 981-cayman: 1 listing (Clubsport, not applicable to standard road car analyze page)
- 982-cayman: 13 listings — GTS flat-four and GT4 RS have representation; GT4 has 1 listing (no price)

**Consequence:** The analyze page for most Cayman variants will show very limited or no comp data. The comp engine cannot produce reliable valuations for any 987-era Cayman or the 981 lineup.

---

## Era-Content File Sourcing Verification

Confirmed: All four Cayman generation pages (`987.1-cayman`, `987.2-cayman`, `981-cayman`, `982-cayman`) are defined as keys in the `CONTENT` object in `lib/era-content/generation-content.ts` and are exported via `getGenerationContent(id)`. The single-source architecture is intact.

---

## Sources Used in This Audit

**Tier 1:**
- Porsche USA Press Release (2007-08-14) — Design Edition 1 production figure
- Porsche Newsroom (newsroom.porsche.com) — GT4 tech spec PDF (binary, accessed)
- stuttcars.com — 987 Cayman guide, Cayman S 2006-2008, GT4 2015-2016, GT4 RS 2023, Black Edition

**Tier 2:**
- Wikipedia — 987 Boxster/Cayman, 981 Boxster/Cayman, 982 718 Boxster/Cayman
- Elferspot.com — Cayman R article (1,621 production confirmed)
- Excellence Magazine — Black Edition "Limited to 500" article
- Rennlist — GT4 production numbers thread, Cayman R registry, Black Edition registry
- Planet-9 — Cayman production numbers thread, 987 series production data
- 9werks.co.uk — 981 GT4 specialist buying guide
- Autoevolution, UltimateSpecs, FastestLaps, CarFolio — cross-reference specs

---

## Summary for USER TO REVIEW

```
VARIANTS AUDITED PER GENERATION:
  987.1-cayman: Cayman S, Cayman (base), Cayman S Sport, Design Edition 1  [4 variants]
  987.2-cayman: Cayman, Cayman S, Cayman R, Cayman S Black Edition          [4 variants]
  981-cayman:   Cayman, Cayman S, Cayman GTS, Cayman GT4                    [4 variants]
  982-cayman:   718 Cayman, 718 Cayman S, GTS flat-four, GTS 4.0,
                GT4, GT4 RS (Cayman T and 25 Years UNRESOLVED)               [6+2 variants]

HIGH AUTO-APPLIED: 6 changes across 2 generations
  • 987.1: M96→M97/20 engine code (2 locations); DE1 777 exact (2 locations); base torque 199→201 lb-ft + transmission fix
  • 987.2: Black Edition ~500 US → ~500 worldwide (~180 US) (2 locations)

STAGED FOR REVIEW: 7 items
  • MEDIUM-01: 987.1 total production ~23,000 vs ~20,300 from delivery data
  • MEDIUM-02: 987.2 Cayman R years '2012' vs '2011–2012' worldwide
  • MEDIUM-03: 981 GT4 production range 2,500–6,000 vs community estimate 6,200–6,500
  • MEDIUM-04: 981 GT4 years '2016' vs '2015–2016' in some markets
  • CONFLICT-01: 982 "25 Years Anniversary" Cayman — NOT CONFIRMED TO EXIST; Boxster-only
  • LOW-01: 982 Cayman T missing from content variants entirely
  • LOW-02: 982 ICE production end date — biased to staging per task instructions

CONFLICTS: 1
  • 25 Years Anniversary Cayman — evidence points to Boxster-only; no Cayman version found

TRUNCATIONS: 0 (all prose fields complete across all 4 generations)

WATCH-FOR CONCERNS: All watch_for items verified accurate. Severity calibration appropriate.
  987.1: IMS, bore scoring, RMS, AOS, water pump — all ✓
  987.2: DFI carbon, water pump, PDK service, R authenticity — all ✓
  981: Water pump, DFI carbon, GT4 clutch, GT4 provenance — all ✓
  982: Flat-four heat soak, GT4 RS TSB, GT4 RS PDK, Weissach authenticity — all ✓

ZERO-LISTING GENERATIONS:
  987.1-cayman: CONFIRMED ZERO (all variants, no hero comp data)
  987.2-cayman: 3 listings (Cayman R×2, base×1) — NOT zero as handoff stated
  981-cayman: 1 listing (Clubsport race car only) — standard variants effectively zero
  982-cayman: 13 listings (GTS flat-four×10, GT4 RS×3, GT4×1) — NOT zero as handoff stated

DATA GAPS — COMP ENGINE PRIORITY SCRAPING:
  Critical: 981 GT4 (0 street comps), 981 GTS (0), 987.2 Cayman S (0), 982 GTS 4.0 (0)
  High: 987.1 entire generation (0), 982 GT4 (1 no-price listing)

OUTPUT FILES:
  diff-log.json   — 6 auto-applied changes with sources
  staging.json    — 7 staged items with proposed values
  REPORT.md       — this file
  comp-gaps.txt   — comp coverage by variant
  PROGRESS.log    — 5 checkpoints logged
```
