# 997 Family Reference — 997.1 (2005–2008) & 997.2 (2009–2012)

*Per-family doc | Sections A / B / C*
*Compiled 2026-05-18. Uncertain claims tagged [VERIFY]. Read alongside `trim-list-audit.md`, `canonical-porsche-production.md`, and `production-counts.md`.*

---

## Summary

The 997 ran from MY2005 through early MY2013 (final Turbo and Turbo S deliveries) and is internally divided by Porsche into two distinct sub-generations separated by a three-part mechanical discontinuity at MY2009: new 9A1 direct-injection engine family (replacing M96/M97 on Carrera trims), new 7-speed PDK dual-clutch (replacing Tiptronic S 5-speed), and revised LED-DRL front fascia. These three changes happened simultaneously, making the 997.1/997.2 boundary effectively a generation break for valuation purposes rather than a mid-cycle facelift. Total 997 production across both sub-generations: approximately **213,000 units** worldwide. [Source: Ian Bevis / Stuttcars combined citing Porsche AG]

**Two engine families coexist inside the 997 era:**

- **M96/M97 (997.1 Carrera family only):** water-cooled flat-six with intermediate shaft (IMS) bearing concern. Carrera, Carrera S, Carrera 4, Carrera 4S, Targa 4, Targa 4S, Turbo (997.1 only has the Mezger — see below). *Bore scoring 5–10% prevalence on 3.6L/3.8L engines.*
- **Mezger (all GT cars and all 997.1 Turbo variants):** dry-sump motorsport-derived flat-six, no IMS bearing. Powers GT3, GT3 RS, GT2 in 997.1; GT3, GT3 RS, GT3 RS 4.0, GT2 RS, Turbo, Turbo S in 997.2. The Mezger persists in all halo trims through MY2011 (GT3 RS 4.0, GT2 RS — the final road-going Mezger applications). **No IMS risk.**
- **9A1 (997.2 Carrera family and 997.2 Turbo/Turbo S):** direct-injection flat-six with no intermediate shaft. Eliminates IMS concern entirely. Also powers the 997.2 Turbo S (which is *not* Mezger — see note in Section C). 997.2 GT cars retain the Mezger through end of production.

**Catalog flag:** The 997.1 Turbo S **does NOT exist.** The Turbo S designation debuted with the 997.2 for MY2010. The catalog entry `'Turbo S'` in the `997.1` generation entry is incorrect and must be removed. See Section C.

---

## Section A — Catalog Extract

Data extracted from `lib/porsche/models.ts` `GENERATION_DEFS` and cross-referenced against `trim-list-audit.md` section 3.7. Column "Catalog Status" reflects the current state of the models.ts entry.

### A.1 — 997.1 (2005–2008)

| Trim | Catalog Status | Engine | Trans Options | Drivetrain | Production Years | US-Legal New |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed | 3.6L M96/05 NA | 6MT, 5-spd Tip S | RWD | MY2005–2008 | Yes |
| Carrera S | ✅ Confirmed | 3.8L M97/01 NA | 6MT, 5-spd Tip S | RWD | MY2005–2008 | Yes |
| Carrera 4 | ✅ Confirmed | 3.6L M96/05 NA | 6MT, 5-spd Tip S | AWD | MY2006–2008 | Yes |
| Carrera 4S | ✅ Confirmed | 3.8L M97/01 NA | 6MT, 5-spd Tip S | AWD | MY2006–2008 | Yes |
| Targa 4 | ✅ Confirmed | 3.6L M96/05 NA | 6MT, 5-spd Tip S | AWD | MY2007–2008 | Yes |
| Targa 4S | ✅ Confirmed | 3.8L M97/01 NA | 6MT, 5-spd Tip S | AWD | MY2007–2008 | Yes |
| Turbo | ✅ Confirmed | 3.6L Mezger twin-turbo (VTG) | 6MT, 5-spd Tip S | AWD | MY2007–2009 | Yes |
| Turbo S | ⛔ WRONG GENERATION | — does not exist — | — | — | NOT 997.1 | — |
| GT3 | ✅ Confirmed | 3.6L Mezger NA | 6MT only | RWD | MY2007–2009 | Yes |
| GT3 RS | ✅ Confirmed | 3.6L Mezger NA | 6MT only | RWD | MY2007–2009 | Yes |
| GT2 | ✅ Confirmed | 3.6L Mezger twin-turbo | 6MT only | RWD | MY2008–2009 | Yes |

**Notes — 997.1:**
- Cabriolet body styles are not separate catalog trim entries; they are body-style variants within each trim.
- Turbo, GT3, GT3 RS, and GT2 officially carry MY2007–2009 and MY2008–2009 production spans straddling the 997.1/997.2 calendar boundary — these trims were not mechanically updated until their respective 997.2-engine successors launched (MY2010 for GT3/Turbo, MY2011 for GT2 RS). There are no 997.1 X50-option Turbo S cars with a "Turbo S" badge; the X50 power kit was an option on the standard Turbo without any exterior badging change.
- Targa 4 and Targa 4S launched for MY2007 only (not available in MY2005–2006); AWD only.
- C4 / C4S launched for MY2006 (US); Carrera and Carrera S launched MY2005.

### A.2 — 997.2 (2009–2012)

| Trim | Catalog Status | Engine | Trans Options | Drivetrain | Production Years | US-Legal New |
|---|---|---|---|---|---|---|
| Carrera | ✅ Confirmed | 3.6L 9A1 DFI NA | 6MT, 7-spd PDK | RWD | MY2009–2012 | Yes |
| Carrera S | ✅ Confirmed | 3.8L 9A1 DFI NA | 6MT, 7-spd PDK | RWD | MY2009–2012 | Yes |
| Carrera 4 | ✅ Confirmed | 3.6L 9A1 DFI NA | 6MT, 7-spd PDK | AWD | MY2009–2012 | Yes |
| Carrera 4S | ✅ Confirmed | 3.8L 9A1 DFI NA | 6MT, 7-spd PDK | AWD | MY2009–2012 | Yes |
| Carrera GTS | ✅ Confirmed | 3.8L 9A1 + X51 (408 hp) | 6MT, 7-spd PDK | RWD | MY2011–2012 | Yes |
| Carrera 4 GTS | ✅ Confirmed | 3.8L 9A1 + X51 (408 hp) | 6MT, 7-spd PDK | AWD | MY2012 (one-year run) | Yes |
| Targa 4 | ✅ Confirmed | 3.6L 9A1 DFI NA | 6MT, 7-spd PDK | AWD | MY2009–2012 | Yes |
| Targa 4S | ✅ Confirmed | 3.8L 9A1 DFI NA | 6MT, 7-spd PDK | AWD | MY2009–2012 | Yes |
| Turbo | ✅ Confirmed | 3.8L Mezger twin-turbo | 6MT, 7-spd PDK | AWD | MY2010–2013 | Yes |
| Turbo S | ✅ Confirmed | 3.8L Mezger twin-turbo | 7-spd PDK only | AWD | MY2011–2013 | Yes |
| GT3 | ✅ Confirmed | 3.8L Mezger NA | 6MT only | RWD | MY2010–2011 | Yes |
| GT3 RS | ✅ Confirmed | 3.8L Mezger NA | 6MT only | RWD | MY2010–2011 | Yes |
| GT2 RS | ✅ Confirmed | 3.6L Mezger twin-turbo | 6MT only | RWD | MY2011 | Yes |
| R | ✅ Confirmed | 3.8L 9A1 NA (500 hp GT3 RS engine tune) | 6MT only | RWD | MY2011 | Yes |
| Sport Classic | ❌ Missing from catalog | 3.8L 9A1 + X51 (408 hp) | 6MT only | RWD | MY2010 | No (RoW only) |
| Speedster | ❌ Missing from catalog | 3.8L 9A1 + X51 (408 hp) | 7-spd PDK only | RWD | MY2011 | Yes |
| Black Edition | ❌ Missing from catalog | 3.6L/3.8L 9A1 NA | 6MT or PDK | RWD | MY2011–2012 | Yes |
| GT3 RS 4.0 | (not scoped as catalog trim — see Section C) | 4.0L Mezger NA | 6MT only | RWD | MY2011 | Yes |

**Notes — 997.2:**
- `'R'` is listed in `models.ts` as a 997.2 trim. This is the 911 R (356 units, MY2011); it uses the 997.2 GT3 RS 3.8 engine bored and stroked to 3.8L with GT3 RS specifications, 500 hp. Not to be confused with the 991 R (which is more commonly known as "the" 911 R).
- The GT3 RS 4.0 is distinct from the GT3 RS — different displacement, chassis derivation from GT2 RS, 600-unit cap. Whether it warrants a separate catalog trim entry or a note under GT3 RS is a catalog decision; currently absent.
- Sport Classic: RoW-only new, Sport Classic Grey paint only, ducktail, double-bubble roof, Fuchs-style wheels, PCCB standard. 250 units. Not US-legal from factory; US buyers imported via Show & Display or 25-year exemption pathway.
- Speedster: wide C4 body on RWD chassis; 356 units. PDK only (no manual).
- Turbo and Turbo S carried over into calendar MY2013 for final deliveries; some sources cite "2013" as a final production year for these trims.
- 997.2 Turbo: first 911 Turbo offered with PDK. 997.2 Turbo S: PDK only, PCCB and Sport Chrono standard.

---

## Section B — Canonical Specification Table

All figures are US-market unless noted. HP figures are SAE net unless labeled PS. MSRP is US new-car price rounded to nearest $1,000. Production figures are worldwide unless marked (US) or (NA). [VERIFY] tags indicate figures that diverge across sources.

### B.1 — 997.1 (2005–2008) Core Trims

| Trim | Body(ies) | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Wheelbase | Curb Wt (lb) | MSRP (USD, launch year) | WW Production | US Production | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Carrera | Coupe, Cab | 3.6L M96/05 NA | 321 | 273 | 6MT or 5-spd Tip S | RWD | 92.5 in | ~3,042 (Coupe) | $71,000 (2005) | ~16,500 est. | Not split | IMS bearing concern; bore scoring risk on 3.6L |
| Carrera S | Coupe, Cab | 3.8L M97/01 NA | 355 (X51: 376) | 295 | 6MT or 5-spd Tip S | RWD | 92.5 in | ~3,064 (Coupe) | $81,000 (2005) | ~27,200 est. | Not split | Most popular 997.1 trim; X51 power kit optional |
| Carrera 4 | Coupe, Cab | 3.6L M96/05 NA | 321 | 273 | 6MT or 5-spd Tip S | AWD | 92.5 in | ~3,197 (Coupe) | $76,000 (2006) | ~6,000 est. | Not split | PTM AWD; launched MY2006 |
| Carrera 4S | Coupe, Cab | 3.8L M97/01 NA | 355 (X51: 376) | 295 | 6MT or 5-spd Tip S | AWD | 92.5 in | ~3,220 (Coupe) | $86,000 (2006) | ~14,500 est. | Not split | Wide Turbo body; AWD; S engine; launched MY2006 |
| Targa 4 | Targa (glass roof canopy) | 3.6L M96/05 NA | 325 | 273 | 6MT or 5-spd Tip S | AWD | 92.5 in | ~3,240 | $87,000 (2007) | ~5,100 est. (T4+T4S combined) | Not split | AWD only; electric sliding glass roof; MY2007–2008 |
| Targa 4S | Targa (glass roof canopy) | 3.8L M97/01 NA | 355 | 295 | 6MT or 5-spd Tip S | AWD | 92.5 in | ~3,263 | $97,000 (2007) | Included above | Not split | Same glass-roof Targa body as Targa 4; S engine |

### B.2 — 997.1 Turbo & GT Cars

| Trim | Body(ies) | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch year) | WW Production | US/NA Production | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Turbo | Coupe, Cab | 3.6L Mezger twin-turbo (VTG) | 480 (X50: 530) | 457 | 6MT or 5-spd Tip S | AWD | ~3,417 (Coupe) | $123,000 (2007) | ~21,700 (Coupe + Cab combined MY2006–2009) [VERIFY: some sources cite this for full 997.1 run including overlap] | ~8,870 (US, Coupe + Cab combined) | First gasoline car with VTG turbochargers; X50 option (no badge change); Mezger no IMS |
| GT3 | Coupe | 3.6L Mezger NA | 415 | 299 | 6MT only | RWD | ~2,998 | $107,000 (2007) | ~2,378 | ~910 (US) | Mezger; Clubsport package optional; center-lock wheels; first US-legal 997 GT3 |
| GT3 RS | Coupe | 3.6L Mezger NA | 415 | 299 | 6MT only | RWD | ~2,998 | $124,000 (2007) | ~1,106–1,168 [VERIFY — range reflects source conflict] | ~410 US + ~42 Canada = 452 NA | First US-legal 911 GT3 RS; wide C4 body; carbon wing; lithium battery option; 997.1 RS uses 3.6L not 3.8L |
| GT2 | Coupe | 3.6L Mezger twin-turbo | 523 | 502 | 6MT only | RWD | ~3,175 | $192,000 (2008) | ~1,240–1,261 [VERIFY] | ~205 US | Mezger turbo + RWD only; PCCB standard; no Cabriolet version in any GT2 generation |

### B.3 — 997.2 (2009–2012) Core Trims

| Trim | Body(ies) | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch year) | WW Production | US Production | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Carrera | Coupe, Cab | 3.6L 9A1 DFI NA | 345 | 288 | 6MT or 7-spd PDK | RWD | ~3,042 | $76,300 (2009) | ~7,190 | Not split | No IMS; DFI engine; PDK standard option |
| Carrera S | Coupe, Cab | 3.8L 9A1 DFI NA | 385 | 310 | 6MT or 7-spd PDK | RWD | ~3,064 | $86,200 (2009) | ~9,470 | Not split | X51 Power Kit option (408 hp) |
| Carrera 4 | Coupe, Cab | 3.6L 9A1 DFI NA | 345 | 288 | 6MT or 7-spd PDK | AWD | ~3,197 | $82,400 (2009) | ~1,380 est. [VERIFY] | Not split | Updated PTM AWD |
| Carrera 4S | Coupe, Cab | 3.8L 9A1 DFI NA | 385 | 310 | 6MT or 7-spd PDK | AWD | ~3,220 | $92,300 (2009) | ~9,188 | Not split | Wide Turbo body; AWD |
| Carrera GTS | Coupe, Cab | 3.8L 9A1 + X51 | 408 | 310 | 6MT or 7-spd PDK | RWD | ~3,263 | $103,000 (2011) | ~2,300 est. (GTS + 4 GTS combined) [VERIFY per-trim split] | Not split | Wide Carrera 4 body on RWD; center-lock wheels; Alcantara; GTS designation revived |
| Carrera 4 GTS | Coupe, Cab | 3.8L 9A1 + X51 | 408 | 310 | 6MT or 7-spd PDK | AWD | ~3,285 | $111,000 (2012) | Included in GTS above | Not split | AWD GTS; late-cycle one-year run (MY2012 only) |
| Targa 4 | Targa (glass roof) | 3.6L 9A1 DFI NA | 345 | 288 | 6MT or 7-spd PDK | AWD | ~3,240 | $89,000 (2010) | ~3,380 (T4+T4S combined 997.2) | Not split | Sliding glass-roof Targa; final generation of this Targa style (replaced by targa-bar in 991) |
| Targa 4S | Targa (glass roof) | 3.8L 9A1 DFI NA | 385 | 310 | 6MT or 7-spd PDK | AWD | ~3,263 | $99,000 (2010) | Included above | Not split | |

### B.4 — 997.2 Turbo, GT, and Limited-Edition Cars

| Trim | Body(ies) | Engine | HP (SAE) | Torque (lb-ft) | Trans | Drive | Curb Wt (lb) | MSRP (USD, launch year) | WW Production | US/NA Production | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Turbo | Coupe, Cab | 3.8L Mezger twin-turbo | 493 | 516 | 6MT or 7-spd PDK | AWD | ~3,417 | $133,000 (2010) | ~5,050 est. (Coupe + Cab) | ~1,490 NA | First 911 Turbo with PDK option; Mezger no IMS |
| Turbo S | Coupe, Cab | 3.8L Mezger twin-turbo | 523 | 516 | 7-spd PDK only | AWD | ~3,439 | $160,000 (2011) | ~5,150 est. (Coupe + Cab) [VERIFY — source range wide] | ~2,330 NA [VERIFY] | PDK only; PCCB + Sport Chrono standard; MY2011 debut |
| GT3 | Coupe | 3.8L Mezger NA | 429 | 317 | 6MT only | RWD | ~3,042 | $114,000 (2010) | ~2,250 | ~715 NA (656 US + 59 Canada) | Last manual-only GT3 until 991.2; 8,500 rpm redline |
| GT3 RS (3.8) | Coupe | 3.8L Mezger NA | 444 | 317 | 6MT only | RWD | ~2,998 | $133,000 (2010) | ~2,000 est. [VERIFY — sources cite 1,600–2,000] | ~612 NA (541 US + 71 Canada) | Magnesium roof on later build; lighter than GT3 |
| GT3 RS 4.0 | Coupe | 4.0L Mezger NA | 493 | 339 | 6MT only | RWD | ~2,954 | $185,000 (2011) | 600 (worldwide cap) | 158 NA (141 US + 17 Canada) | Final road-going Mezger NA; 4.0L RSR crankshaft; chassis from GT2 RS; 600-unit hard cap; apex 997 |
| GT2 RS | Coupe | 3.6L Mezger twin-turbo | 611 | 516 | 6MT only | RWD | ~3,042 | $245,000 (2011) | 500 (worldwide cap) | 142 NA (132 US + 10 Canada) | Final road-going Mezger turbo; 620 PS; no AWD; no Cab |
| Sport Classic | Coupe | 3.8L 9A1 + X51 | 408 | 310 | 6MT only | RWD | ~3,263 | €169,300 ex-VAT (2010 DE) | 250 (worldwide cap) | 0 US (RoW only; not federalized) | Ducktail; double-bubble roof; Sport Classic Grey only; 250 sold within 48 hours; Porsche Exclusive |
| Speedster | Roadster (low windscreen) | 3.8L 9A1 + X51 | 408 | 310 | 7-spd PDK only | RWD | ~3,197 | $204,000 (2011) | 356 (worldwide cap) | ~108 US | 356 units = tribute to the Porsche 356; C4 wide body on RWD; no manual option |
| R (911 R, 997.2) | Coupe | 3.8L 9A1 NA | 493 | 339 | 6MT only | RWD | ~2,954 | (not widely published separately) [VERIFY] | 356 [VERIFY — this figure is contested; some sources attribute 356 to the Speedster, not the R] | Not split | [VERIFY: the 356-unit figure in the catalog may be the Speedster; the 997.2 "R" entry needs research — see Section C] |
| Black Edition (Carrera / Carrera S) | Coupe, Cab | 3.6L / 3.8L 9A1 NA | 345 / 385 | 288 / 310 | 6MT or PDK | RWD | ~3,042 / ~3,064 | Varies | Not publicly broken out | Not split | Appearance package; black trim exterior + interior; does not change powertrain |

---

## Section C — Gap Bullets

The following gaps, errors, and flag items require action or further verification. They are ordered by urgency.

### C.1 — MUST FIX: 997.1 Turbo S Does Not Exist

**Flag:** The `997.1` generation entry in `lib/porsche/models.ts` includes `'Turbo S'`. This trim did **not** exist in the 997.1 generation.

- The 997.1 Turbo (MY2007–2009) was optioned with the X50 power kit (raising output from 480 hp to 530 hp), but no exterior Turbo S badge was applied. The X50 is an option code, not a model designation.
- The 997.2 Turbo S debuted for **MY2010** as a distinct factory model with PDK-only transmission, 530 hp (523 SAE), PCCB and Sport Chrono Plus as standard.
- **Action:** Remove `'Turbo S'` from the `997.1` generation entry. Source: trim-list-audit.md §3.7; 2000s reference §997.1 Turbo notes; production-counts.md §997.

### C.2 — MISSING FROM CATALOG: Sport Classic and Speedster

Both are 997.2 production models absent from `lib/porsche/models.ts`:

**Sport Classic (MY2010)**
- 250 units worldwide; not US-legal as new (RoW only); Porsche Exclusive department.
- Engine: 3.8L 9A1 + X51, 408 hp. Transmission: 6MT only. Drivetrain: RWD.
- Distinctive: ducktail rear spoiler, double-bubble roof, Fuchs-style 19-inch alloys, Sport Classic Grey paint, PCCB standard, wide C4 rear body on RWD chassis.
- All 250 sold within 48 hours of order opening. [Source: Stuttcars; production-counts.md]
- **Action:** Add `'Sport Classic'` to `997.2` trim array. Flag as non-US-federalized in comp engine routing.

**Speedster (MY2011)**
- 356 units worldwide (number is a tribute to the Porsche 356); approximately 108 delivered to US.
- Engine: 3.8L 9A1 + X51, 408 hp. Transmission: 7-spd PDK only (no manual). Drivetrain: RWD.
- Distinctive: shorter, more raked windscreen (60–77 mm lower), manually folding roof, double-bubble tonneau. Wide C4 body on RWD chassis. Colors: Pure Blue (exclusive) or Carrara White.
- Fourth production 911 Speedster in the model's history.
- **Action:** Add `'Speedster'` to `997.2` trim array. [Source: 2010s reference; production-counts.md]

### C.3 — VERIFY: 997.2 "R" Entry in Catalog

The current `models.ts` `997.2` trim array includes `'R'`. This needs clarification:

- There is a confirmed 997.2-era car called the **911 R** (not to be confused with the 991.1 R, which is more famous). The 997.2 R was produced in approximately **356 units** for MY2011. It uses the GT3 RS 3.8L Mezger engine. Manual-only, lightweight. [VERIFY: confirm the 997.2 R production count; some sources give 356, others attribute 356 to the Speedster; it is possible both are 356 units, a tribute choice made twice, or that one figure is in error.]
- If the 997.2 R and the 997.2 Speedster are both 356 units, this would be an intentional double tribute (both reference the 356); [VERIFY] with Porsche official records.
- **Action:** Verify the 997.2 R production figure independently. Confirm it is a distinct catalog-warranted trim (not the Speedster) before retaining `'R'` in the trim array.

### C.4 — VERIFY: GT3 RS 4.0 Catalog Treatment

The GT3 RS 4.0 (MY2011, 600 units worldwide) is currently absent from `models.ts` as a distinct trim. Options:

1. Add `'GT3 RS 4.0'` as a distinct 997.2 trim — most accurate for comp isolation, since the 4.0 trades at a meaningfully higher price tier than the GT3 RS 3.8.
2. Subsume under `'GT3 RS'` with a note — simpler but loses comp precision.

Given the 4.0's distinct engine (4.0L vs 3.8L), production cap (600 vs ~2,000), and collector premium, **Option 1 is recommended**. The trim-category derivation in `lib/trim-category/index.ts` would need a new routing key for `gt3_rs_40` or similar.

**Action:** Decide and document. If added, use `'GT3 RS 4.0'` as the trim string.

### C.5 — ENGINE ARCHITECTURE: IMS Boundary at 997.1/997.2

The IMS bearing concern does NOT apply uniformly to all 997s:

- **997.1 Carrera / S / 4 / 4S / Targa 4 / Targa 4S:** M96/M97 engines. **IMS bearing applies.** The 997.1 single-row IMS bearing (most 2005–2008 cars) has an approximately 1% failure rate (the larger non-serviceable bearing variant introduced ~late 2005 reduced risk vs. the ~8% single-row rate on 996/987.1). [Source: LN Engineering; defects/01_engine_m96_m97.md]
- **997.1 Turbo / GT3 / GT3 RS / GT2:** Mezger engine. **No IMS bearing. No bore scoring.** External dry-sump lubrication. Fundamentally different engine family.
- **997.2 Carrera / S / 4 / 4S / GTS / Targa 4 / 4S:** 9A1 engine. **No IMS bearing whatsoever.** No intermediate shaft in the engine architecture.
- **997.2 Turbo / Turbo S:** Mezger engine (3.8L). No IMS. Note: 997.2 Turbo/Turbo S uses Mezger despite the 9A1 being used for base Carrera — this coexistence of two engine families within one generation (997.2) is the defining technical characteristic of the generation.
- **997.2 GT3 / GT3 RS / GT3 RS 4.0 / GT2 RS:** Mezger engine. No IMS.

**Comp engine implication:** `generation_id = '997.1'` AND `trim_category IN ('carrera', 'carrera_s', 'carrera_4', 'carrera_4s', 'targa_4', 'targa_4s')` → apply IMS flag. All other 997.x trim categories → suppress IMS flag.

### C.6 — BORE SCORING: M97 Cylinder Bank / Cylinder Specifics

The M97 3.8L engine used in the 997.1 Carrera S and Carrera 4S is subject to bore scoring. Specific pattern:

- **Cylinder 6** is the most frequently affected cylinder. Cylinder 6 sits in the right bank at the rear of the engine, farthest from the coolant inlet, in a thermal stress position that makes Lokasil liner wear more likely. [Source: defects/01_engine_m96_m97.md; Weissach UK; LN Engineering]
- The M97 3.8L has the **same bore-scoring risk** as the M96 3.6L, but specialist sources do not indicate that the 3.8L is significantly more or less prone. Both share the Lokasil liner that is susceptible.
- **Not applicable to:** Mezger-engined 997.1 trims (Turbo, GT3, GT3 RS, GT2) which use different cylinder construction. Not applicable to 997.2 Carrera-family trims (9A1 architecture).
- **Pre-purchase action:** Borescope of cylinder walls (especially cylinder 6, bottom of bore), recent used oil analysis. [Source: defects/01_engine_m96_m97.md §buyer_questions]

### C.7 — PRODUCTION FIGURE CONFLICTS

The following 997-family production figures have material source conflicts. All are tagged [VERIFY] in Section B and should not be cited without cross-referencing the primary source:

| Trim | Conflict |
|---|---|
| 997.1 GT3 RS | Sources cite 1,106 (some), 1,168 (others), ~1,909 (one source that may span additional production years). Registry consensus: 1,168. NA: 410 US + 42 Canada confirmed. |
| 997.1 GT2 | ~1,240–1,261 across sources. US: ~205. |
| 997.2 GT3 RS (3.8) | 1,600–2,000 across sources; registry consensus ~2,000. NA: ~612. |
| 997.2 Turbo S | Wide range 2,000–5,150 across sources. NA: ~2,330 is the most cited figure. |
| 997.2 "R" | 356 units is cited; [VERIFY] this is not a conflation with Speedster (also 356 units). |

### C.8 — TRIM BOUNDARY: Carrera 4 and 4S Launch Year

- **Carrera 4 / Carrera 4S:** Did **not** launch for MY2005. US availability was MY2006. Some sources cite a late-2005 production start, but the MY2006 US designation is correct.
- **Targa 4 / Targa 4S:** Launched MY2007 in all markets. Not available MY2005 or MY2006.
- The `yearStart: 2005` on the `997.1` generation entry is correct for the generation but the individual trims above have constrained start years. The `isValidCombination` function in `models.ts` does not check sub-trim year constraints; this is a known limitation flagged in trim-list-audit.md §3.7.

### C.9 — NOT IN CATALOG: Black Edition

The 997.2 **Black Edition** (MY2011–2012, Carrera and Carrera S variants) is an appearance package with no powertrain change — black exterior trim, black wheels, black interior accents. It is not currently in the catalog. Recommend treating it as a sub-variant option rather than a distinct trim entry, unless comp data shows it trades at a consistent premium vs. standard Carrera. Low priority.

### C.10 — SPORT CLASSIC: US Federalization Path

The Sport Classic was not sold new in the United States. It is increasingly present on US auction platforms via two legal pathways:

1. **Show and Display exemption** (requires NHTSA petition, limited to 2,500 miles/year; practically infeasible for most buyers).
2. **25-year EPA/DOT exemption** — Sport Classic produced in 2010; eligible for 25-year import by approximately 2035. Not yet in scope for current US auction analysis.

Any Sport Classic appearing on US auction platforms now is either a gray-market import (verify DOT/EPA compliance) or a non-running display vehicle. The comp engine should flag this if parsing a US-platform listing for a Sport Classic.

---

## Sources

- [1] Ian Bevis — Porsche 911 997 Series Production Numbers. Primary production data for 997.1 and 997.2 volume trims.
- [2] Stuttcars — 911 997 Sales & Production Numbers. Secondary production data and trim-level breakdowns.
- [3] Porsche Knowledge — GT3 Production Build Numbers. GT3 and GT3 RS production figures by variant.
- [4] Autofolio — Porsche GT3 RS Production Numbers. GT3 RS Registry-derived figures.
- [5] Production-counts.md — internal research doc. 997 section. Cited figures from Stuttcars and Porsche Knowledge.
- [6] 2000s reference (docs/reference/porsche_2000s_reference.md). 997.1 generation overview, variant tables, and variant differentiation notes.
- [7] 2010s reference (docs/reference/porsche_2010s_reference.md). 997.2 carryover section; GT car differentiation notes.
- [8] trim-list-audit.md §3.7 — 997 audit section with confirmed/missing/wrong-generation trim flags.
- [9] defects/01_engine_m96_m97.md — M96/M97 IMS, bore scoring, RMS, AOS defect records with prevalence rates and source anchors.
- [10] Porsche Newsroom — 997 GT3 RS 4.0 and GT2 RS press materials. Hard production caps.
- [11] Porsche Knowledge — 911 997 GT3 RS 4.0. 600-unit cap; NA allocation 158 cars confirmed.
- [12] Stuttcars — 911 GT2 RS 997. 500-unit cap confirmed.
- [13] Stuttcars — 911 997 Sport Classic and Speedster. 250 and 356 unit figures.
- [14] PCA Panorama / Excellence Magazine — 997 generation buyer guides (general editorial authority; not individually cited above).
- [15] LN Engineering — IMS Bearing Problem Years. Prevalence rates by bearing variant; 997.1 single-row vs larger bearing distinction.
- [16] Weissach UK — Porsche 997 Bore Scoring. 997.1 bore scoring prevalence and cylinder 6 specifics.
