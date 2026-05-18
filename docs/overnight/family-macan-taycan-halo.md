# Family Doc — Macan · Taycan · Halo / Limited
## Sections A · B · C

*Research compiled 2026-05-18. [VERIFY] = disputed or unconfirmed figure. RACE-ONLY = not road-legal new. Road-registerable = sold to private customers; legally road-registerable in at least one major market.*
*DO NOT modify catalog / code / DB based on this document without developer review.*

---

## Summary

**Macan 95B** — Porsche's best-selling model 2014–2021 (US). Catalog entries are mostly correct; missing Macan T (MY2022–2023), S Diesel (EU-only, discontinued 2018), and Turbo Performance Package option. Year boundary wrong: US ICE Macan continued through MY2023, not 2021.

**Macan EV (Type 1Y / PPE)** — All-electric 2024+. The catalog `macan-ii` has entirely wrong trim names (ICE era names). No EV Macan trim is correctly represented. Requires full replacement before any EV listing is ingested.

**Taycan J1** — 2020–present. Catalog covers all major sedan trims except `Taycan 4` and `Turbo GT`. Body-style ambiguity (`Cross Turismo`, `Sport Turismo` as single entries) is the highest-impact comp accuracy issue.

**Halo / Limited** — Completely absent from catalog. 959, Carrera GT, 918 Spyder, 935, GT1 Strassenversion are road-legal or road-registerable; all require new model entries before auction listings can be classified. GT3 R, GT2 RS Clubsport, 908, and 962 are RACE-ONLY; model-only with a race_only flag if added. 904 is road-legal. 550 Spyder and 906 are road-registerable but race-origin.

---

## A. Extract from Catalog (`lib/porsche/models.ts`)

### A.1 Macan 95B

| Trim | genId | Catalog Years | Status |
|---|---|---|---|
| Base | macan-i | 2014–2021 | ✅ Present |
| S | macan-i | 2014–2021 | ✅ Present |
| GTS | macan-i | 2014–2021 | ✅ Present |
| Turbo | macan-i | 2014–2021 | ✅ Present |
| T | — | — | ❌ Not in catalog |
| S Diesel | — | — | ❌ Not in catalog |
| Turbo w/ Performance Package | — | — | ❌ Not in catalog |

### A.2 Macan EV (Type 1Y, 2024+)

`macan-ii` exists in catalog (years 2022–present) but carries ICE-era trim names that do not apply to the EV generation.

| Correct EV Trim | genId | Catalog Status |
|---|---|---|
| Macan 4 | — | ❌ Not in catalog (catalog has 'Base') |
| Macan 4S | — | ❌ Not in catalog |
| Macan Turbo (EV) | — | ❌ Not in catalog (catalog 'Turbo' is ICE meaning) |
| Macan Electric (RWD) | — | ❌ Not in catalog |

### A.3 Taycan J1 (2020–present)

| Trim | genId | Catalog Years | Status |
|---|---|---|---|
| Base | taycan-i | 2020–present | ✅ Present (maps to Taycan RWD) |
| 4S | taycan-i | 2020–present | ✅ Present |
| GTS | taycan-i | 2020–present | ✅ Present |
| Turbo | taycan-i | 2020–present | ✅ Present |
| Turbo S | taycan-i | 2020–present | ✅ Present |
| Cross Turismo | taycan-i | 2020–present | ✅ Present (monolithic — covers all CT power levels) |
| Sport Turismo | taycan-i | 2020–present | ✅ Present (monolithic — covers all ST power levels) |
| 4 | — | — | ❌ Not in catalog |
| Turbo GT | — | — | ❌ Not in catalog |

### A.4 Halo / Limited (All Absent)

| Model | Catalog Status |
|---|---|
| 959 | (not in catalog) |
| Carrera GT | (not in catalog) |
| 918 Spyder | (not in catalog) |
| 935 customer racer | (not in catalog) |
| 911 GT1 Strassenversion | (not in catalog) |
| 911 GT3 R / GT2 RS Clubsport | (not in catalog) |
| 550 Spyder / 904 / 906 / 908 / 962 | (not in catalog) |

---

## B. Canonical Production Reference

*Standard columns: Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP (USD) | Notable Options | Known Issues | Collector Notes*

---

### B.1 Macan 95B (2014–2024)

**Family overview:** Compact luxury SUV on Volkswagen Group MLB Evo platform (shared with Audi Q5, Mk3). Porsche's best-selling model throughout its run. Two phases: Phase 1 (2014–2018 MY) and Phase 2 (2019–2021 US; some global markets continued through 2024). The Phase 2 refresh in 2018/2019 changed both GTS and Turbo to the 2.9L V6 biturbo (from 3.0L/3.6L), a spec-materially-significant change for comp queries.

**Total 95B worldwide production: ~360,000** [VERIFY: Porsche cited 350,000–390,000 depending on counting cutoff and global market end dates]

| Trim | Years | Body | Engine | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP (USD) | Notable Options | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Macan (Base) | 2014–2021 | 5-door SUV | 1,984 / I4 / Turbo | 252 PS (Ph1) / 261 PS (Ph2) | 370 / 273 | 7-spd PDK | AWD | ~200,000 est [VERIFY] | ~40% | ~$49,900 (2014) | Sport Chrono, panoramic roof | PDK valve body; software updates required | Volume entry; no collector premium yet |
| Macan S | 2014–2021 | 5-door SUV | 2,995 / V6 / Biturbo (Ph1) · 2,894 / V6 / Biturbo (Ph2) | 340 PS (Ph1) / 354 PS (Ph2) | 460 / 339 (Ph1) · 480 / 354 (Ph2) | 7-spd PDK | AWD | ~150,000 est [VERIFY] | ~35% | ~$57,200 (2014) | PASM, SportDesign | V6 chain tensioner (Ph1 early); transfer case wear | Sweet spot of range; most popular 95B spec |
| Macan S Diesel | 2014–2018 | 5-door SUV | 2,967 / V6 / TDI | 258 PS / 254 hp | 580 / 428 | 7-spd PDK | AWD | ~25,000 est [VERIFY] | 0 (EU only) | ~€64,800 | — | Diesel recall; AdBlue system failure; discontinued | EU-only; significant auction presence on European platforms; highest torque in 95B family |
| Macan GTS | 2016–2021 | 5-door SUV | 2,995 / V6 / Biturbo (Ph1) · 2,894 / V6 / Biturbo (Ph2) | 360 PS (Ph1) / 380 PS (Ph2) | 500 / 369 (Ph1) · 520 / 384 (Ph2) | 7-spd PDK | AWD | ~40,000 est [VERIFY] | ~25% | ~$65,700 (2017) | PASM std, Sport Chrono std | Same as S; engine change between Ph1/Ph2 notable | Ph2 GTS uses same 2.9L biturbo as 911 Carrera S; distinct drive character from Ph1 |
| Macan Turbo | 2014–2021 | 5-door SUV | 3,604 / V6 / Biturbo (Ph1) · 2,894 / V6 / Biturbo (Ph2) | 400 PS (Ph1) / 440 PS (Ph2 std) | 550 / 405 (Ph1) · 600 / 443 (Ph2) | 7-spd PDK | AWD | ~60,000 est [VERIFY] | ~20% | ~$72,300 (2014) | PDCC (air susp.), Performance Package (Ph1 option, Ph2 std) | Air suspension (PDCC) expensive; transfer case | Fastest 95B; Ph2 Turbo gained Performance Package engine as standard |
| Macan Turbo w/ Performance Package | 2016–2018 | 5-door SUV | 3,604 / V6 / Biturbo | 440 PS / 434 hp | 600 / 443 | 7-spd PDK | AWD | Subset of Turbo total [VERIFY] | ~10% | ~$78,000 | Torque Vectoring+, Sport Chrono std | Same as Turbo | Factory option package, not separate model; Ph2 Turbo made this engine standard |
| Macan T | 2022–2023 | 5-door SUV | 1,984 / I4 / Turbo | 261 PS / 257 hp | 400 / 295 | 7-spd PDK | AWD | ~15,000 est [VERIFY] | Limited US | ~$56,500 (2022) | 20" RS Spyder wheels std, crest delete option | End-of-life ICE platform | Late-cycle T variant; purist/sporty positioning; overlaps with S market |

**Notes on uncertainty — 95B:**
- Trim-level production splits are not published by Porsche AG. All split estimates are derived from market share analysis and anecdotal dealer data.
- The Performance Package was sometimes listed as a separate spec by dealers/auction houses; not a distinct model in factory terminology.
- Final US Macan ICE model year: MY2023 (last deliveries ~Q1 2023). Some EU markets continued through 2024. [VERIFY regional end dates before setting yearEnd in catalog.]

**Sources:** Porsche AG press kits MY2014 Macan launch; MY2019 refresh; MY2022 Macan T; stuttcars.com 95B; PCA Panorama Macan buyer's guide; Excellence Magazine Macan feature; Road & Track long-term tests; Porsche Newsroom model archive.

---

### B.2 Macan EV (Type 1Y / PPE Platform, 2024–present)

**Family overview:** Second-generation Macan on Porsche-Audi PPE (Premium Platform Electric) architecture. Unrelated to 95B mechanically. Shares underpinnings with Audi Q6 e-tron. Launched MY2024 with Macan 4 and Macan Turbo; Macan 4S and Macan Electric (entry RWD) added for MY2025 in select markets. 800V charging architecture; rear single-speed, front 2-speed transmission on AWD variants.

| Trim | Years | Body | Engine | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP (USD) | Notable Options | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Macan 4 | 2024– | 5-door SUV (EV) | Dual-motor electric | 402 PS (std) / 435 PS (overboost) | 519 / 383 | 2-spd front + 1-spd rear | AWD | Ongoing [VERIFY] | Yes | ~$75,900 (2024) | Panoramic roof, Sport Chrono, heat pump | New platform; long-term reliability TBD | AWD base EV; softer character than Turbo |
| Macan 4S | 2025– | 5-door SUV (EV) | Dual-motor electric (uprated) | 442 PS (std) / 509 PS (overboost) | 595 / 439 | Same | AWD | Ongoing [VERIFY] | Yes | ~$85,900 est [VERIFY] | — | — | Fills GTS-like gap between 4 and Turbo |
| Macan Electric | 2025– | 5-door SUV (EV) | Single-motor electric | ~335 PS [VERIFY] | ~400 est / 295 | 1-spd | RWD | Ongoing [VERIFY] | Select markets only [VERIFY US availability] | ~$69,900 est [VERIFY] | — | — | Entry RWD; range-focused |
| Macan Turbo (EV) | 2024– | 5-door SUV (EV) | Dual-motor electric (high-output) | 639 PS / 630 hp | 1,130 / 833 | Same | AWD | Ongoing [VERIFY] | Yes | ~$103,600 (2024) | — | — | 0–60 ~3.3s; fastest production Macan |

**Sources:** Porsche AG press kits EV Macan MY2024 and MY2025 update; Porsche AG specification sheets; Car and Driver EV Macan first drive (2024); Electrek delivery reports; trim-list-audit.md.

---

### B.3 Taycan J1 (2020–present)

**Family overview:** Porsche's first production EV, on the bespoke J1 platform (later evolved into PPE). Sedan, Cross Turismo (raised-ride wagon, +59 mm ride height), and Sport Turismo (low wagon) body styles. 800V charging architecture. AWD variants use a 2-speed front unit + 1-speed rear. Rear single-speed on the base RWD. The Taycan GTS, Turbo GT and Cross Turismo / Sport Turismo body styles were added progressively post-launch. Annual deliveries peaked at ~41,296 in 2021 [Source: Porsche AG Annual Report 2021].

**Delivery totals by year:** 2020: ~20,015 · 2021: ~41,296 · 2022: ~34,801 · 2023: ~37,526 [Source: Porsche AG Annual Reports 2020–2023]

**Note on HP figures:** Taycan power outputs depend on whether standard battery (Performance Battery) or Performance Battery Plus is fitted, and whether Sport Boost/overboost is active. Figures below reflect Performance Battery Plus overboost (maximum rated output) unless noted.

| Trim | Years | Body | Engine | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP (USD) | Notable Options | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Taycan (RWD) | 2021– | Sedan | Single-motor | 300 PS (std) / 476 PS (overboost PB+) | 345 / 254 (std) | 1-spd rear | RWD | ~20,000 est [VERIFY] | ~30% | ~$82,700 (2021) | Performance Battery Plus (+PS), Sport Chrono | Charging software early batches; range anxiety pre-network build-out | Most efficient Taycan; ~283 mi EPA with PB+; added MY2021 |
| Taycan 4 | 2021– | Sedan, Cross Turismo, Sport Turismo | Dual-motor | 390 PS (std) / 530 PS (overboost PB+) | 500 / 369 | 2-spd front + 1-spd rear | AWD | ~15,000 est [VERIFY] | ~25% | ~$89,850 (2021) | Performance Battery Plus | — | Slots between RWD and 4S; AWD without Turbo premium; absent from catalog |
| Taycan 4S | 2020– | Sedan, Cross Turismo, Sport Turismo | Dual-motor | 420 PS (std) / 571 PS (overboost PB+) | 640 / 472 | 2-spd front + 1-spd rear | AWD | ~25,000 est [VERIFY] | ~30% | ~$103,800 (2020) | Rear-axle steering, PB+ | — | Launch edition; first J1 sold; balanced tier |
| Taycan GTS | 2022– | Sedan, Sport Turismo | Dual-motor (GTS tune) | 590 PS / 581 hp | 850 / 627 | Same | AWD | ~8,000 est [VERIFY] | ~25% | ~$131,400 (2022) | GTS suspension/chassis tune std | — | Track character; added MY2022; not available Cross Turismo [VERIFY] |
| Taycan Turbo | 2020– | Sedan, Cross Turismo, Sport Turismo | Dual-motor (Turbo) | 500 PS (std) / 680 PS (overboost) | 850 / 627 | Same | AWD | ~12,000 est [VERIFY] | ~20% | ~$150,900 (2020) | Ceramic brakes, PDCC std | — | 0–60 ~3.0s; strong daily usability |
| Taycan Turbo S | 2020– | Sedan, Cross Turismo, Sport Turismo | Dual-motor (Turbo S) | 560 PS (std) / 761 PS (overboost PB+) | 1,050 / 774 | Same | AWD | ~6,000 est [VERIFY] | ~15% | ~$185,000 (2020) | Weissach Package option (sedan), ceramic brakes std | — | 0–60 ~2.6s; fastest Taycan until Turbo GT |
| Taycan Turbo GT | 2024– | Sedan only | Dual-motor (uprated stators + inverter) | 760 PS (std) / ~1,019 PS (Weissach overboost) [VERIFY exact] | 1,340 / 988 (overboost) [VERIFY] | Same (uprated) | AWD | ~2,000 est [VERIFY] | ~20% | ~$230,000 est [VERIFY] | Weissach Package (may be standard or option [VERIFY]) | Very new; reliability unknown | Nürburgring EV lap record holder at launch; 0–0–60 ~2.2s; sedan-only |
| Cross Turismo 4 | 2021– | Raised wagon (+59mm) | Same as Taycan 4 | Same | Same | Same | AWD | Incl. in Taycan 4 total | ~20% | ~$92,050 (2021) | Off-road pkg option (gravel mode) | — | Added MY2021; practical; gravel/unpaved mode |
| Cross Turismo 4S | 2021– | Raised wagon | Same as Taycan 4S | Same | Same | Same | AWD | Incl. in 4S total | ~20% | ~$107,600 (2021) | Same as sedan | — | — |
| Cross Turismo Turbo | 2021– | Raised wagon | Same as Taycan Turbo | Same | Same | Same | AWD | Incl. in Turbo total | ~15% | ~$154,700 (2021) | — | — | — |
| Cross Turismo Turbo S | 2021– | Raised wagon | Same as Taycan Turbo S | Same | Same | Same | AWD | Incl. in Turbo S total | ~10% | ~$190,000 (2021) | — | — | — |
| Sport Turismo 4 | 2022– | Low wagon | Same as Taycan 4 | Same | Same | Same | AWD | Incl. in Taycan 4 total | ~20% | ~$93,050 (2022) | — | — | Added MY2022; lower profile than CT |
| Sport Turismo 4S | 2022– | Low wagon | Same as Taycan 4S | Same | Same | Same | AWD | Incl. in 4S total | ~20% | ~$108,600 (2022) | — | — | — |
| Sport Turismo GTS | 2022– | Low wagon | Same as Taycan GTS | 590 PS | Same | Same | AWD | Incl. in GTS total | ~20% | ~$132,400 (2022) | — | — | — |
| Sport Turismo Turbo | 2022– | Low wagon | Same as Taycan Turbo | Same | Same | Same | AWD | Incl. in Turbo total | ~15% | ~$155,900 (2022) | — | — | — |
| Sport Turismo Turbo S | 2022– | Low wagon | Same as Taycan Turbo S | Same | Same | Same | AWD | Incl. in Turbo S total | ~10% | ~$190,900 (2022) | — | — | — |

**Notes on uncertainty — Taycan:**
- All production split estimates are approximations. Porsche AG does not publish trim-level Taycan production data publicly.
- Turbo GT specs are from the 2024 launch press kit. Output figures vary by whether overboost is measured with standard or Weissach package; [VERIFY] against Porsche AG official spec sheet.
- Taycan GTS availability in Cross Turismo body: most sources indicate GTS is sedan/Sport Turismo only; Cross Turismo was not offered in GTS. [VERIFY].
- The 2021 refresh introduced RWD and Taycan 4 variants alongside a general power increase across the range; the figures above reflect the refreshed 2021+ outputs.

**Sources:** Porsche AG Taycan press kit (Sept. 2019 launch); Porsche AG Annual Reports 2020–2023; Porsche Newsroom Turbo GT announcement (2024); Car and Driver Taycan long-term test; Electrek Taycan delivery/production tracking; electrive.com production reports; trim-list-audit.md.

---

### B.4 Halo / Mid-Engine / Limited Specials

---

#### B.4.1 959 (1986–1988, deliveries 1987–1988)

**ROAD-LEGAL.** Sold to private customers. Not initially EPA/DOT compliant for US; US examples required "Show or Display" rule (1999) to become road-registerable. All cars share the same sequential twin-turbo flat-six and AWD powertrain; distinction is equipment level only.

**Total production: ~292 customer-delivery cars** [Source: Porsche AG factory records as widely cited by Porsche Museum and specialist press; ~337 including all pre-production, test, and works cars]

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP | Notable Options | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 959 Komfort | 1987–1988 | Coupé | 2,850 / F6 / Sequential biturbo (water-cooled heads) | 450 PS / 444 hp | 500 / 369 | 6-spd manual | AWD (electronically controlled) | ~263 est [VERIFY: total minus Sport] | 0 new (Show & Display post-1999) | DM 420,000 (~$225,000) | Full leather, AC, electric seats, stereo | Complex drivetrain; parts near-unobtainable; specialist maintenance required | Full-equipment 959; most common survivor; museum-grade collectible |
| 959 Sport | 1987–1988 | Coupé | Same 2,850 / F6 | 450 PS | 500 / 369 | 6-spd manual | AWD | ~29 [VERIFY: some sources 17–29 range] | 0 | Same DM 420,000 base | Deleted AC, carpets, radio; Kevlar body panels; ~230 kg lighter | Same drivetrain complexity | Rarest 959; significantly higher collector premium; exact count disputed |
| 959 S (prototype) | 1988 | Coupé | Modified 2,850 / F6 | ~515 PS [VERIFY] | ~550 est | 6-spd | AWD | ~2 development cars [VERIFY — not delivered as production spec] | 0 | N/A | Works-only development mule | — | Development prototype; not a deliverable production trim |
| 959 Cabriolet | 1988 | Cabriolet | — | — | — | — | — | 1 PROTOTYPE ONLY | 0 | N/A | — | — | Shown Geneva 1988; never entered production |

**Sources:** Porsche Museum archive (cited by Road & Track 959 retrospective, 2014); Excellence Magazine 959 buyer's guide; Porsche Klassik issues #15, #27; Christophorus Magazine historical archive; autoevolution.com 959 production history; Patrick Long ownership documentation.

---

#### B.4.2 Carrera GT (2004–2007)

**ROAD-LEGAL.** Single-trim model. No official sub-variants.

**Total production: 1,270** [Source: Porsche AG; consistently cited by Road & Track, Excellence, conceptcarz.com, and Porsche press office]

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP | Notable Options | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Carrera GT | 2004–2007 | Roadster (removable targa-style top) | 5,733 / V10 / NA (Le Mans LMP program origin) | 612 PS / 603 hp | 590 / 435 | 6-spd manual + ceramic composite clutch | RWD | 1,270 [VERIFY: some sources 1,264] | ~644 US [VERIFY] | $440,000 (2004) | Carbon fiber luggage set, factory hardtop, carbon seats | Ceramic clutch extremely unforgiving; no ESC at launch; high-temp brake fluid critical; OEM tires difficult to source | No stability control at launch; ABS only; Paul Walker's car (2013 accident); collector-grade at $1M+ for clean examples; most demanding modern Porsche road car |

**Sources:** Porsche AG Carrera GT press kit (2004); Road & Track CGT retrospective; Excellence Magazine CGT guide; conceptcarz.com; Porsche Museum.

---

#### B.4.3 918 Spyder (2013–2015)

**ROAD-LEGAL.** Exactly 918 units produced by design. Weissach Package is a significant option affecting both performance and collector value.

**Total production: 918 exactly** [Source: Porsche AG official statement; not in dispute]

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) combined | Torque (Nm / lb-ft) combined | Trans | Drive | Production | US Alloc | MSRP | Notable Options | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 918 Spyder | 2013–2015 | Roadster (targa-style roof) | 4,593 / V8 / NA (mid-engine) + 2 electric motors | 887 PS / 875 hp (608 PS V8 + electric) | 1,280 / 944 | 7-spd PDK + eCVT front | AWD (hybrid) | 918 | ~300 est [VERIFY] | $845,000 (2014) | Weissach Package (~$84,000; –41 kg, carbon wheels, aero rear wing, magnesium roll hoops) | Battery health long-term; complex hybrid scheduled maintenance; high specialization cost | Exactly 918 built; collector-grade from delivery; among least-depreciated modern Porsches |
| 918 Spyder + Weissach Pkg | 2013–2015 | Same | Same | 887 PS (marginal overboost uplift) | Same | Same | Same | ~640 est [VERIFY: ~70% of production per specialist reports] | Incl. above | +$84,000 | Magnesium wheels, carbon roof struts, rear aero wing, arrow/Martini livery ($0 option) | Same as base | Weissach = highest desirability tier; VIN-specific; Porsche AG confirms on request; commands 20–30% premium over non-Weissach |

**Notes:** Weissach production share is consistently cited at "approximately 70%" in specialist media; exact count [VERIFY against Porsche AG records]. The Martini and Arrow liveries were $0 cost options.

**Sources:** Porsche AG 918 Spyder press kit (2013); Porsche Newsroom; Road & Track 918 Spyder retrospective; Excellence Magazine 918 feature; Car and Driver long-term.

---

#### B.4.4 935 (2019–2020, customer deliveries)

**RACE-ONLY — not road-legal. Customer motorsport car.**

Body styling homages the 1970s 935 that won Le Mans 1979 with the Martini livery. Based on 991.2 GT2 RS Clubsport underpinnings.

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque | Trans | Drive | Production | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 935 | 2019–2020 | Coupé (race spec; Le Mans-homage body) | 3,800 / F6 / Biturbo | 515 kW / 700 PS | ~750 Nm est | 7-spd PDK | RWD | 77 [Source: Porsche Motorsport] | Small | ~€701,948 (~$813,000 at delivery) | Race-only maintenance; track use only | All 77 sold immediately upon announcement; pure collector/track item; road use not possible |

**Sources:** Porsche Motorsport press release (October 2018); Motor Trend 935 announcement; Porsche AG delivery confirmation 77 units.

---

#### B.4.5 911 GT1 Strassenversion (1996–1997)

**ROAD-LEGAL — sold to private customers; built to satisfy FIA GT1 homologation (minimum 25 road cars required).**

Mid-engine layout — not rear-engine like the 911. Water-cooled turbocharged flat-six in mid position. Porsche's most extreme road-legal 911-badged car.

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GT1 Strassenversion | 1996–1997 | Coupé (mid-engine; 911-influenced bodywork) | 3,164 / F6 / Twin-turbo (water-cooled heads) | ~400–544 PS [VERIFY: road-car detuning level disputed across sources] | ~590 Nm / 435 lb-ft est | 6-spd manual | RWD | ~25 [VERIFY: sources range 21–25; FIA required 25 for GT1 homologation] | 0 (not US-homologated) | ~DM 1,500,000 (~$900,000 est) | Extreme specialist maintenance; parts near-unobtainable | Museum-grade; won Le Mans 1998 with race sibling; one of the rarest road-legal Porsches produced |

**Notes:** Road-car HP disputed: some sources quote the full race-spec ~544 PS; others quote a street-detuned ~400 PS. [VERIFY against Porsche AG GT1 documentation or Christophorus archive]. FIA GT1 class required 25 road-legal homologation units. Count of 25 Strassenversion is consistent with this requirement; exact split of customer deliveries vs. factory retention unknown.

**Sources:** Porsche Motorsport historical archive; Road & Track GT1 retrospective; Excellence Magazine GT1 Strassenversion feature; Christophorus historical archive; Porsche Museum records.

---

#### B.4.6 GT3 R (992) and GT2 RS Clubsport (991.2) — Customer Race Cars

**RACE-ONLY — not road-legal. Sold through Porsche Motorsport to customer racing teams.**

| Model | Years | Body | Engine | HP (PS) | Drive | Production | MSRP | Notes |
|---|---|---|---|---|---|---|---|---|
| 911 GT2 RS Clubsport | 2019–2021 | Coupé (race) | 3,800 / F6 / Biturbo | 700 PS | RWD | ~200 est [VERIFY] | ~$570,000 | Based on 991.2 GT2 RS; customer racing car |
| 911 GT2 RS Clubsport Evo | 2022 | Coupé (race) | Same | 700 PS (updated aero) | RWD | ~22 est [VERIFY] | ~$620,000 | Updated aerodynamics; limited second run |
| 911 GT3 R (992) | 2021– | Coupé (race) | 4,194 / F6 / NA (new 4.2L unit) | ~550 PS [VERIFY] | RWD | Ongoing | ~€505,000 | Customer GT3 class race car worldwide |

**Sources:** Porsche Motorsport product pages; GT3 R and GT2 RS Clubsport press releases; racer.com GT3 R spec coverage.

---

### B.5 Historic Race-Derived Production Models

---

#### B.5.1 550 Spyder / 550A (1953–1958)

**RACE-ORIGIN / ROAD-REGISTERABLE** — open-cockpit race car sold to private customers; road-registerable in some markets; not DOT-compliant new in US.

*(Full entry in canonical-porsche-production.md §2; abbreviated here)*

| Trim | Years | Body | Production | MSRP | Notes |
|---|---|---|---|---|---|
| 550/1500 RS Spyder | 1953–1956 | Open Spyder | 90 [Source: stuttcars.com] | ~$6,500 (Europe) | James Dean's car; Type 547 four-cam |
| 550A/1500 RS Spyder | 1956–1958 | Open Spyder | 40 [Source: stuttcars.com] | ~$7,000 | Revised spaceframe; lighter |

---

#### B.5.2 904 Carrera GTS (1964–1965)

**ROAD-LEGAL** — factory warranty; DOT-compliant for era; sold with road equipment.

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 904 Carrera GTS | 1964–1965 | Coupé (fiberglass, mid-engine, steel tube frame) | 1,966 / F4 4-cam / NA (Type 547/1) | 180 PS / 178 hp | 176 / 130 | 5-spd 718 | RWD | 106 total (100 customer + 6 works) [VERIFY: some sources 100 exactly for homologation] | ~40 US est [VERIFY] | ~$7,425 (US, 1964) | Type 547 four-cam extremely fragile; fiberglass body cracks with age | Road-legal with warranty; driven to races; last application of Type 547 four-cam; among most beautiful Porsches ever made |

**Note on 904 variants:** The 904/6 (six-cylinder, ~8 prototypes) and 904/8 (eight-cylinder, ~2 prototypes) were works development cars, not production variants. Do not model as catalog trims.

**Sources:** Porsche AG 904 documentation; stuttcars.com 904; conceptcarz.com; Excellence Magazine 904 retrospective; Road & Track 904 history.

---

#### B.5.3 906 Carrera 6 (1966)

**RACE-ORIGIN / ROAD-REGISTERABLE in some markets** — designed as a racing car; road-registerable in Germany and some European markets; NOT DOT-compliant new in US.

| Trim | Years | Body | Engine (cc/config/asp) | HP (PS) | Torque (Nm / lb-ft) | Trans | Drive | Production | US Alloc | MSRP | Known Issues | Collector Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 906 Carrera 6 | 1966 | Coupé (tubular spaceframe, fiberglass) | 1,991 / F6 / NA (Type 901/20) | 220 PS / 217 hp (race tune) | ~186 / 137 | 5-spd 906 | RWD | ~56 homologation + ~9 works = ~65 total [VERIFY] | ~Few (private import) | ~DM 45,000 (~$11,000) | Race-only drivetrain maintenance | Primarily a race car; road-registerable in Germany; won 1966 Targa Florio; Nürburgring |

**Sources:** Porsche AG historical archive; Road & Track 906 retrospective; stuttcars.com 906; Porsche Museum records.

---

#### B.5.4 908 (1968–1971) and 962 (1982–1991) — Pure Racing Prototypes

**RACE-ONLY — no road-legal version produced by Porsche AG.**

| Model | Years | Class | Production | Notes |
|---|---|---|---|---|
| 908 (all variants: 908, 908/2, 908/3) | 1968–1971 | FIA Group 6 / Sports Car Prototype | ~50 total [VERIFY] | Won 1968 Nürburgring, 1969 Targa Florio; no street version |
| 962 (Group C / IMSA GTP) | 1982–1991 | Group C / IMSA GTP | ~91 total [VERIFY: sources range 88–95] | Le Mans winner 1986–1987; no factory road version |

**Note on "962 street cars":** The Dauer 962 LeMans (~3 cars) and Strosek 962 conversions are third-party modifications of ex-race chassis, not Porsche AG production. Do not model as Porsche catalog entries. Any 962 appearing on an auction platform should be classified as RACE-ORIGIN / customer race car with a manual provenance note.

**Sources:** Porsche Museum archive; Porsche Motorsport history; lemansproject.com 962 register; Road & Track 908 retrospective.

---

## C. Gap Bullets

### C.1 Macan 95B — Gaps

- **Macan S Diesel** absent. EU-only trim (2014–2018), 3.0L TDI, 258 PS, discontinued post-Dieselgate. Meaningful auction presence on European platforms (Collecting Cars, mobile.de). Add `'S Diesel'` to macan-i trims; flag EU-only, no US allocation.
- **Macan T** absent. MY2022–2023 end-of-life trim; distinct visual and suspension spec; listed separately on BaT and auction platforms. Add `'T'` to macan-i trims with sub-year note 2022–2023.
- **Turbo Performance Package** not modeled. Factory option (not dealer add-on) raising Phase 1 Turbo from 400 to 440 PS. Frequently listed as a distinct spec at auction. Either add `'Turbo Performance Package'` as a trim entry or note it as a structured option code. [VERIFY whether comp engine team wants trim-level granularity or option-flag approach.]
- **Year boundary wrong**: `macan-i` ends at 2021 in catalog; last US Macan ICE was MY2023 (deliveries through ~Q1 2023). Extend `yearEnd` to 2023 minimum. EU end date ~2024. [VERIFY regional cutoff dates before setting final value.]
- **Phase 1 / Phase 2 engine split not captured**: 2019 refresh changed GTS to 2.9L (from 3.0L) and Turbo to 2.9L (from 3.6L). A 2017 Macan GTS (360 PS, 3.0L) and a 2020 Macan GTS (380 PS, 2.9L) are materially different for comp purposes. Consider a `macan-i-ph2` sub-generation split at 2019, or annotate in comp-engine heuristics.

### C.2 Macan EV — Gaps

- **Critical — entire trim list is wrong**: `macan-ii` currently has `['Base', 'S', 'GTS', 'Turbo']` — all ICE 95B names. Replace in full with `['Macan 4', 'Macan Turbo']` for the 2024 launch lineup, then add `'Macan 4S'` and `'Macan Electric'` as MY2025 additions (either same gen with sub-year note, or a `macan-ii-2025` entry).
- **Year boundary wrong**: `macan-ii` starts 2022 in catalog; EV Macan deliveries did not begin until late 2023 / early 2024 (MY2024). The 2022–2023 window currently has no valid mapping for either ICE or EV. Change `yearStart` to 2024.
- **Comp isolation critical**: EV Macan must be comp-isolated from ICE Macan at query time. Different platform, powertrain, price tier, and market. The `genId` split handles this correctly only if trim names are correct — which they currently are not.

### C.3 Taycan J1 — Gaps

- **Taycan 4 missing**: AWD base tier introduced MY2021. Without this, Taycan 4 auction listings will be misclassified as either the Base/RWD or the 4S. Add `'4'` to taycan-i trims. Confirmed missing in trim-list-audit.md.
- **Taycan Turbo GT missing**: MY2024 flagship (~1,019 PS Weissach overboost). Distinct market and value tier from Turbo S. Add `'Turbo GT'` to taycan-i trims.
- **Body-style ambiguity is the highest-impact comp-accuracy issue**: `'Cross Turismo'` and `'Sport Turismo'` are monolithic catalog entries. A Taycan 4S Sedan and a Taycan 4S Cross Turismo have materially different values (CT typically carries premium). Two paths: (a) expand to `'Cross Turismo 4'`, `'Cross Turismo 4S'`, etc. as separate trim entries; or (b) add a `body_style` column to the comp engine query and listings table. Path (b) is cleaner architecturally and avoids a combinatorial explosion of trim strings.
- **GTS availability scope**: GTS appears to be sedan/Sport Turismo only; not available Cross Turismo. [VERIFY.] If confirmed, the monolithic `'Cross Turismo'` entry should document this exclusion.
- **Sub-trim year gaps**: GTS was added MY2022, not MY2020. Taycan 4 was added MY2021. `isValidCombination()` does not enforce sub-trim start dates — a "Taycan GTS 2020" passes validation today but does not exist. Flagged for future validation refinement.
- **Generation split**: Single `taycan-i` for 2020–present will require a split when the platform refreshes. Flag for monitoring when Porsche announces a Taycan successor or major refresh.

### C.4 Halo / Limited — Gaps

- **959**: Add `genId: '959'`, `model: '959'`, `yearStart: 1986, yearEnd: 1988`, `trims: ['Komfort', 'Sport']`. Do not add `'S'` or `'Cabriolet'` — neither is a delivered production trim. Road-legal flag needed.
- **Carrera GT**: Add `genId: 'carrera-gt'`, `model: 'Carrera GT'`, `yearStart: 2004, yearEnd: 2007`, `trims: ['Carrera GT']`. Single-trim model; 1,270 units.
- **918 Spyder**: Add `genId: '918'`, `model: '918 Spyder'`, `yearStart: 2013, yearEnd: 2015`, `trims: ['Base', 'Weissach Package']`. Weissach Package deserves its own trim entry given the ~20–30% value premium and distinct specification. Alternatively, model it as a structured option flag if the database schema supports option-level value adjustments.
- **935**: RACE-ONLY. If added, requires a `race_only` flag (schema addition needed) so it is excluded from road-car comp queries by default. Without this flag, a 935 in a listing set will contaminate comp results for GT2 RS and 911 Turbo values.
- **GT1 Strassenversion**: Add `genId: 'gt1-strassenversion'`, `model: '911 GT1'`, `yearStart: 1996, yearEnd: 1997`, `trims: ['Strassenversion']`. ~25 units. Road-legal. Comp queries will rarely fire, but classification is needed when one appears on RM Sotheby's or Gooding.
- **GT3 R / GT2 RS Clubsport**: Both RACE-ONLY. Same `race_only` flag requirement as 935. GT2 RS Clubsport appears occasionally on high-profile auction platforms. Add if race-car auction data is in V1 scope; otherwise defer.
- **550 Spyder**: Add `genId: '550'`, `model: '550 Spyder'`, `yearStart: 1953, yearEnd: 1958`, `trims: ['550 RS', '550A RS']` if classic auction coverage is in scope. Road-registerable flag needed (distinct from DOT-compliant road-legal).
- **904**: Add `genId: '904'`, `model: '904'`, `yearStart: 1964, yearEnd: 1965`, `trims: ['Carrera GTS']`. Road-legal. 106 units. High auction presence on BaT and RM Sotheby's.
- **906**: Road-registerable (not DOT-legal new in US). Add with race-origin flag if European auction platforms are in scope; defer if US-only coverage.
- **908 and 962**: RACE-ONLY. Do not model as production catalog entries. Handle any auction appearances as manual/custom entries with race provenance noted. Dauer 962 is explicitly not a Porsche AG production car.

---

## Sources

| # | Source | Used For |
|---|---|---|
| 1 | Porsche AG press kits: Macan MY2014, MY2019 refresh, MY2022 Macan T | 95B specs, MSRP, phase changes |
| 2 | Porsche AG press kits: EV Macan MY2024, MY2025 update | Macan EV specs, trims, MSRP |
| 3 | Porsche AG press kit: Taycan launch (Sept. 2019) | J1 powertrain, specs, initial trims |
| 4 | Porsche AG press kit: Taycan Turbo GT (2024) | Turbo GT specs |
| 5 | Porsche AG Annual Reports 2020–2023 | Taycan delivery volumes by year |
| 6 | Porsche AG 918 Spyder press kit (2013) | 918 specs, production total, pricing |
| 7 | Porsche AG Carrera GT press kit (2004) | CGT specs, production count, MSRP |
| 8 | Porsche Museum / Porsche AG 959 documentation | 959 production records, trim breakdown |
| 9 | Porsche Motorsport press release: 935 (October 2018) | 935 specs, 77-unit production |
| 10 | Porsche Motorsport: GT3 R, GT2 RS Clubsport product pages | Race-car specs |
| 11 | Excellence Magazine: 959, CGT, 918, 904, GT1 retrospectives | Collector context, known issues |
| 12 | Porsche Klassik issues #15, #27 | 959 deep-dive; production context |
| 13 | Road & Track historical features: 959, CGT, 918, 904, 906, GT1 | Specs verification, collector notes |
| 14 | Christophorus Magazine archive (Porsche house organ) | GT1 Strassenversion; historic context |
| 15 | stuttcars.com: Macan 95B; 550 Spyder; 904; 906 | Production estimates, variant splits |
| 16 | PCA Panorama: Macan buyer's guide; Taycan first look | US market context, allocation notes |
| 17 | electrek.co / electrive.com | Taycan production/delivery tracking |
| 18 | Car and Driver: Macan long-term; Taycan long-term; EV Macan first drive | Real-world spec verification |
| 19 | conceptcarz.com: Carrera GT, 904 | Production count cross-checks |
| 20 | Ludvigsen, Karl — *Porsche: Excellence Was Expected* (3rd ed.) | 550 Spyder, 904, 906, 908 race history |
| 21 | trim-list-audit.md (project research, 2026-05-18) | Catalog gap identification |
| 22 | lemansproject.com 962 register | 962 production, race history |
| 23 | autoevolution.com 959 production history | 959 unit count cross-check |

---

*Document status: DRAFT — user review required before any catalog or database changes. All [VERIFY] items require confirmation against Porsche AG factory records or a named primary source before implementation.*
