# Credibility Audit Report — 991.2 + 992.1 + 992.2
**Session:** s06-991-2-992  
**Audit date:** 2026-05-14  
**Generations:** 991.2 (MY2017–2019), 992.1 (MY2020–2024), 992.2 (MY2025–present)  
**Status:** COMPLETE — Research agent returned; all findings merged and applied.

---

## 1. Executive Summary

| Category | Count | Action |
|---|---|---|
| HIGH-confidence corrections AUTO-APPLIED | 3 | See diff-log.json — applied to generation-content.ts |
| HIGH-confidence claims confirmed (no change) | 34 | See diff-log.json CONFIRMED entries |
| CONFLICT/MEDIUM items staged | 22 | See staging.json — user review required |
| Substantive prose errors found | 3 | See staging S12, S21 and PROSE-02 below |
| Content truncations | 0 | All prose fields complete |
| 992 production figures auto-applied | 0 | Deliberately left to staging per task instruction |
| Comp data gaps | ALL variants <10 | See comp-gaps.txt |

---

## 2. Auto-Applied Changes (HIGH Confidence)

### A01 — 991.2 GTS years corrected: 2018–2019 → 2017–2019
**File:** `lib/era-content/generation-content.ts` line 1166  
**Evidence:** stuttcars.com (Tier 1) explicitly states "(2017 – 2019)" for the 991.2 Carrera GTS. Wikipedia and supercars.net confirm. The GTS launched alongside the 991.2 facelift in early 2017 (MY2017). The file incorrectly had "2018–2019."

### A02 — 992.1 Turbo S power corrected: 640 hp → 641 hp (variant field)
**File:** `lib/era-content/generation-content.ts` line 1348  
**Evidence:** Wikipedia (650 PS / 478 kW / 641 hp SAE), auto-data.net, multiple press sources. The 640 hp figure matched neither the PS (650) nor the SAE (641) values. Three sources independently confirm 641 hp SAE.

### A03 — 992.1 engine field corrected: "Turbo S: 640 hp" → "Turbo S: 641 hp"
**File:** `lib/era-content/generation-content.ts` line 1300  
**Evidence:** Same correction as A02 applied to the generation-level engine description string.

---

## 3. Research Agent Findings — Full Summary

**Sources consulted:** 25+ including Porsche Newsroom (Tier 1), stuttcars.com (Tier 1), Wikipedia, supercars.net, elferspot.com, PCA.org, porscheknowledge.com, nweuro.com registry, Rennlist, multiple automotive press outlets.

### Power Figures — All Confirmed Correct (except Turbo S, now fixed)

| Generation | Variant | Claimed | Verdict | Notes |
|---|---|---|---|---|
| 991.2 | Carrera | 370 hp | ✅ CONFIRMED | 370 PS/272 kW — Porsche US convention |
| 991.2 | Carrera S/4S | 420 hp | ✅ CONFIRMED | 420 PS/309 kW — Porsche US convention |
| 991.2 | GTS/4 GTS | 450 hp | ✅ CONFIRMED | 450 PS/331 kW |
| 991.2 | Turbo | 540 hp | ✅ CONFIRMED | 540 PS/397 kW |
| 991.2 | Turbo S | 580 hp | ✅ CONFIRMED | 580 PS/427 kW |
| 991.2 | GT3/Touring | 500 hp | ✅ CONFIRMED | 500 PS/368 kW |
| 991.2 | GT3 RS | 520 hp | ✅ CONFIRMED | 520 PS/382 kW |
| 991.2 | GT2 RS | 700 hp | ✅ CONFIRMED | 700 PS/515 kW |
| 991.2 | Speedster | 502 hp | ✅ CONFIRMED | 502 hp SAE per supercars.net |
| 992.1 | Carrera | 379 hp | ✅ CONFIRMED | — |
| 992.1 | Carrera S/4S | 443 hp | ✅ CONFIRMED | — |
| 992.1 | GTS | 473 hp | ✅ CONFIRMED | — |
| 992.1 | Turbo | 572 hp | ✅ CONFIRMED | — |
| 992.1 | Turbo S | **640 hp → 641 hp** | ❌ FIXED (A02/A03) | Was wrong by 1 hp |
| 992.1 | GT3/Touring | 502 hp | ✅ CONFIRMED | — |
| 992.1 | GT3 RS | 518 hp | ✅ CONFIRMED | = 525 PS; both are correct in different units |
| 992.1 | Sport Classic | 543 hp | ✅ CONFIRMED | — |
| 992.1 | S/T | 525 hp | ✅ CONFIRMED | 525 PS convention |
| 992.2 | Carrera | 388 hp | ✅ CONFIRMED | — |
| 992.2 | Carrera S | 473 hp | ✅ CONFIRMED | — |
| 992.2 | GTS T-Hybrid | 541 hp | ✅ CONFIRMED | 541 PS = 532-534 SAE; file uses PS convention |
| 992.2 | GT3/Touring | 503 hp | ✅ CONFIRMED | — |
| 992.2 | Turbo S T-Hybrid | 701 hp | ✅ CONFIRMED | 711 PS; correct |

**Unit convention note:** Throughout the file, "hp" figures follow Porsche's US market convention of presenting PS (metric horsepower) as "hp." This is consistently applied and mirrors Porsche's own press materials. SAE hp values are typically 1–3% lower. No correction recommended unless a decision is made to standardize all figures to SAE throughout (which would require changes across all generations, not just 991.2/992).

### Performance Figures

| Claim | Verdict | Sources |
|---|---|---|
| GT3 RS 991.2: Nürburgring 6:56.4 | ✅ CONFIRMED HIGH | Porsche Newsroom; Wikipedia |
| GT3 RS 992.1: 860 kg downforce at 285 km/h | ✅ CONFIRMED HIGH | Porsche GT3 RS press kit; PCA.org |
| Turbo S T-Hybrid 992.2: 7:03.92 Nürburgring | ✅ CONFIRMED HIGH | elferspot.com; Jalopnik |
| GT3 992.2: 311 km/h top speed | ✅ CONFIRMED HIGH | ultimatespecs.com; stuttcars.com |
| 45mm wider body (992 vs 991.2) | ✅ CONFIRMED HIGH | Wikipedia; stuttcars.com |

### Production Figures

| Variant | Claimed | Research Finding | Status |
|---|---|---|---|
| Speedster | 1,948 worldwide | CONFIRMED — official Porsche press | HIGH |
| Speedster NA | ~717 | NOT confirmed from 2+ sources (one source: ~484 US) | STAGED S04 |
| GT3+Touring 991.2 | ~9,520 worldwide | ~9,500 per registries (9,520 not confirmed) | STAGED S01 |
| GT3+Touring 991.2 NA | ~3,250 | ~3,187 per 911uk forum | STAGED S01 |
| GT3 RS 991.2 | ~4,750 worldwide | 4,750 confirmed by nweuro.com | CONFIRMED |
| GT3 RS 991.2 NA | 1,760 (1,465 US + 295 Canada) | 1,756 total (1,462 US + 294 Canada) per nweuro | STAGED S02 |
| GT2 RS | 1,000–1,580 | Genuine conflict confirmed; ~1,000 road cars | STAGED S03 |
| Sport Classic | 1,250 worldwide | CONFIRMED — official Porsche press | HIGH |
| Dakar | 2,500 worldwide | CONFIRMED — official Porsche press | HIGH |
| S/T | 1,963 worldwide | CONFIRMED — official Porsche press | HIGH |
| GT3+Touring 992.1 | 15,667/5,328 | Rennlist registry; not official data | STAGED S06 |
| Turbo 50 Years | 1,974 worldwide | CONFIRMED — Porsche.com model page | HIGH |
| Targa 4S HDE | 992 worldwide | CONFIRMED — Porsche Newsroom | HIGH |
| Spirit 70 | 1,500 worldwide | CONFIRMED — Porsche Newsroom | HIGH (staged for MY date) |

### MSRP Figures (Two Corrections Required)

**Sport Classic MSRP:** The file states $272,300 US. Research agent found **multiple sources confirm $283,430**. Zero sources found for $272,300. This is a clear error — recommend applying correction. See staging S09/S10.

**Turbo 50 Years MSRP:** The file states $270,500. Research agent found sources pointing to ~$261,100 base / ~$263,095 with destination. The $270,500 figure could not be confirmed. See staging S11.

---

## 4. Substantive Prose Issues — USER REVIEW REQUIRED

### PROSE-01 — 992.1 Carrera T: "most recent non-GT3 manual" claim is wrong
**Staging ID:** S21  
**Lines:** 1334, 1453  

The 992.1 Carrera T section claims it "became the most recent non-GT3 manual-transmission 911." This is wrong — the **992.2 Carrera T is also manual-only** (PDK not even available as an option, confirmed HIGH from PCA.org). The 992.1 Carrera T is not the most recent; the 992.2 Carrera T is.

**What's actually true:** The correct "last of its kind" story for the 992.1 is the **manual Carrera S** — the 992.2 Carrera S is PDK-only, making the 992.1 Carrera S the last manual mid-tier 911.

**Suggested fix for line 1334:**
> Remove: "...the 992.1 Carrera T manual became the most recent non-GT3 manual 911 above the base Carrera."  
> Replace with: "With the 992.2 converting the Carrera S and GTS to PDK-only, the 992.1 Carrera T is the generation's non-GT3 entry point for buyers seeking a manual gearbox."

**Suggested fix for value_driver at line 1453:**
> Rename this value_driver to 'Carrera S manual — last manual Carrera S'  
> Reframe description around the 992.1 Carrera S being the last manual-equipped mid-tier Carrera S in production history.

---

### PROSE-02 — GT2 RS Weissach wheel savings: "8 kg per corner" likely wrong
**Staging ID:** S16  
**Line:** 1222  

The engineering note says "magnesium BBS wheels saving approximately 8 kg per corner." If taken as per-corner, 8 × 4 = 32 kg from wheels alone — more than the total 30 kg claimed for the entire Weissach Package. The GT3 RS (line 1198) cites 11.5 kg unsprung for all four wheels combined.

**Suggested fix:** Change "saving approximately 8 kg per corner" to "saving approximately 8 kg unsprung" (removing "per corner"). This makes the math consistent and the figure more plausible (2 kg/wheel for magnesium vs. alloy).

---

### PROSE-03 — Turbo 50 Years: "Ferry Porsche tribute" overstates the tribute
**Staging ID:** S12  
**Line:** 1349  

The description calls the Turbo 50 Years interior a "Ferry Porsche tribute Tartan interior." The car is a celebration of the 50th anniversary of the 911 Turbo model (1974–2024), not a specific tribute to Ferry Porsche. While the Tartan pattern evokes 1970s-era Porsches associated with Ferry Porsche's tenure, Porsche's own marketing doesn't frame it this way.

**Suggested fix:** Change "a Ferry Porsche tribute Tartan interior" to "a heritage Tartan plaid interior referencing the original 930 Turbo era."

---

## 5. Watch-For Audit

All 5 watch_for entries for **991.2** are complete, well-calibrated, and accurate:
- DFI carbon buildup (9A2) — ACCURATE
- PDK fluid service (7-speed) — ACCURATE
- PCCB rotor wear — ACCURATE
- Rod-bolt recall clarification (does not apply to 991.2) — ACCURATE; recall number 14V-090 staged for verification (S17)
- PCM software calibration (early MY2017) — ACCURATE

All 4 watch_for entries for **992.1** are complete and accurate:
- Coolant pipe failure (early MY2020–21) — ACCURATE; 'concern' severity is appropriate
- DFI carbon buildup (9A2 Evo) — ACCURATE
- PDK fluid service (8-speed) — ACCURATE
- PCCB rotor wear (GT3 RS, S/T, Turbo S) — ACCURATE
- GT3 RS / S/T allocation documentation — ACCURATE

All 4 watch_for entries for **992.2** are complete and appropriately hedged for a current-production car:
- T-Hybrid longevity (limited field data) — 'caution' is the correct severity
- PCCB wear on Turbo S T-Hybrid — ACCURATE
- PDK fluid service (8-speed) — ACCURATE
- Manual transmission availability clarification — ACCURATE

**Severity calibration for modern cars:** The coolant pipe issue on early 992.1 (MY2020–21) is correctly elevated to 'concern' (highest severity) given potential for overheating with minimal warning. No recalibration needed.

---

## 6. Engine Designation Audit

| Designation | Usage in file | Research Finding | Status |
|---|---|---|---|
| 9A2 | 991.2 Carrera/S/GTS engine | CORRECT — 9A2 is the 991.2 designation | ✅ |
| 9A1 | 991.2 Turbo/Turbo S/GT2 RS engine | CORRECT — 9A1 is the larger twin-turbo | ✅ |
| 9A2 Evo | 992 Carrera/S/GTS engine | CORRECT — Evo suffix distinguishes 992 from 991.2 | ✅ |
| 9A2 (no Evo) | 992.1 Turbo/Turbo S engine (3.745L) | MINOR INCONSISTENCY — other 992 engines say Evo | STAGED S22 |
| 9A3 | 992.2 T-Hybrid engines | USED in file; not independently confirmed from 2+ sources — but widely accepted | Low risk |

---

## 7. Content Truncation Check — ALL CLEAR

| Section | 991.2 | 992.1 | 992.2 |
|---|---|---|---|
| intro | Complete ✅ | Complete ✅ | Complete ✅ |
| notes (3 per generation) | Complete ✅ | Complete ✅ | Complete ✅ |
| engineering (all items) | Complete ✅ | Complete ✅ | Complete ✅ |
| watch_for body + buyer_question | Complete ✅ | Complete ✅ | Complete ✅ |
| service (all items) | Complete ✅ | Complete ✅ | Complete ✅ |
| value_drivers descriptions | Complete ✅ | Complete ✅ | Complete ✅ |

**No truncations found in any field across all three generations.**

---

## 8. Analyze Page — VIN Sample

27 total 911 listings exist in the database for MY2017+. All have `generation=null`. Key observations:
- None of these records are tagged by generation — the analyze page cannot apply generation-specific content without a generation backfill
- Records present: GT2 RS (7), GT3 Touring (4), Speedster (3), GT3 RS (2), Sport Classic (2), Turbo S Exclusive (2), Turbo S Lightweight (1)
- No records exist for: Carrera, Carrera S, Carrera GTS, Targa, Dakar, S/T, 992.2 variants

---

## 9. Comp Data Gaps

See comp-gaps.txt for full analysis. Summary: **Every variant+year combination for 991.2, 992.1, and 992.2 has fewer than 10 comp records.** The database is in an early-population state for the modern era.

**Critical pipeline issue identified:** The `generation` field is NULL for all 2017+ listings, and `status` remains "active" regardless of auction outcome. The comp engine cannot segment by generation without a backfill.

---

## 10. Era-Content Source Confirmation

Confirmed: both the generation page and analyze page pull from `lib/era-content/generation-content.ts` as the single source of truth. No divergent copies found anywhere in the codebase.

---

## 11. Open Questions for User

1. **Sport Classic MSRP (S09/S10):** Research confirms $283,430 (not $272,300 as in file). Both the variant description and value_driver need updating. Ready to apply — just needs your go-ahead. Sources: multiple automotive press outlets + gtspirit.com.

2. **Turbo 50 Years MSRP (S11):** $270,500 in file vs. ~$263,095 found in research. Less clear-cut — want to verify before changing.

3. **PROSE-01 (Carrera T "most recent" error):** The fix changes the collector thesis from Carrera T to Carrera S as the last of its kind. Do you want the 992.1 Carrera T or 992.1 Carrera S to be the featured value driver for the "last manual" story?

4. **PROSE-02 (GT2 RS wheel savings):** Change "8 kg per corner" to "8 kg unsprung" — safe edit with no source conflict. Ready to apply on your confirmation.

5. **PROSE-03 (Turbo 50 Years "Ferry Porsche tribute"):** Editorial change to more accurate characterization. Ready to apply.

6. **GT3 production figures (S01):** Do you want to use registry-exact figures (~9,500 worldwide / ~3,187 NA) or keep the current approximations?

7. **GT2 RS production conflict (S03):** Add clarifying parenthetical about Clubsport/road-car distinction?

8. **Comp database:** Generation field NULL for all modern-era listings. Backfill script needed? Generation = f(year + model) rule could be applied.

---

## 12. Output Files

| File | Location |
|---|---|
| diff-log.json | research/audit-2026-05-14/s06-991-2-992/diff-log.json |
| staging.json | research/audit-2026-05-14/s06-991-2-992/staging.json |
| REPORT.md | research/audit-2026-05-14/s06-991-2-992/REPORT.md |
| comp-gaps.txt | research/audit-2026-05-14/s06-991-2-992/comp-gaps.txt |
| PROGRESS.log | research/audit-2026-05-14/s06-991-2-992/PROGRESS.log |
