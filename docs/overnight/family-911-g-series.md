# G-Series 911 — Per-Family Production Claim Reference
## 911 Type G (1974–1989)

*Research compiled 2026-05-18. Production figures and specifications cited inline. Uncertain or disputed claims tagged [VERIFY]. This document does not modify catalog files, code, or database.*

---

## Summary

The G-series body (factory designation Type 911/G) entered production August 1973 for MY1974 and ran through MY1989. It encompasses six naturally aspirated engine displacements (2.7, 3.0, 3.2) and the 930 Turbo line (3.0 and 3.3). Nineteen distinct factory trim and body configurations are documented below. **Total G-series production: 196,397** [Porsche AG Newsroom, "50 Years of the G-Series 911" press kit, 2023].

The project catalog (`lib/porsche/models.ts`) places all pre-964 cars — F-series (1965–1973) and G-series (1974–1989) — in a single generation entry (`pre-964`, yearStart: 1965, yearEnd: 1988). Per-trim year ranges, body styles, engine specs, and production figures are not stored anywhere in models.ts. All non-catalog columns in Section A are sourced from canonical research.

The 964 generation in the catalog begins 1989, creating a one-year overlap with the G-series (MY1989 Carrera 3.2 and 930 Turbo). The 964 launched in fall 1988 as a MY1989 model; G-series production continued in parallel for portions of MY1989. This boundary requires explicit handling in comp-engine generation routing.

---

## Section A — Catalog Trims (from `lib/porsche/models.ts`)

Generation entry: `genId: 'pre-964'`, `model: '911'`, `yearStart: 1965`, `yearEnd: 1988`.
Trim strings registered: `Carrera`, `Carrera RS`, `Carrera 3.2`, `Targa`, `Turbo`, `Turbo 3.3`, `SC`, `Speedster`.

Models.ts stores only trim name strings within a generation year range. It does not store per-trim active years, body styles, engine specs, or production figures. The "Year" column below reflects the generation-level range only; actual per-trim G-series active years are research-derived and appear in Section B.

| trim_id | Display Name | Year (catalog gen) | Body | Engine | HP | Trans | Drivetrain | Prod Worldwide | Prod US | Issues |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pre-964/Carrera | Carrera | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/Carrera RS | Carrera RS | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/Carrera 3.2 | Carrera 3.2 | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/Targa | Targa | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/Turbo | Turbo | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/Turbo 3.3 | Turbo 3.3 | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/SC | SC | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |
| pre-964/Speedster | Speedster | 1965–1988 | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) | (not in catalog) |

**Catalog scope notes:**

- `pre-964/Carrera RS` maps to the F-series Carrera RS 2.7 (1972–73) and RS 3.0 (1974). The G-series had no road-going Carrera RS. The 911 SC RS (1984, 21 units) is a Motorsport homologation special not reflected anywhere in the catalog.
- `pre-964/Targa` is listed as a standalone trim but is in practice a body style available across multiple engine/trim configurations. No engine spec or production figure is meaningful for this entry in isolation.
- `pre-964/Turbo` maps to the 930 3.0 (1975–1977); `pre-964/Turbo 3.3` maps to the 930 3.3 (1978–1989). Both Turbos are within G-series scope.
- The Carrera 3.2 Speedster appears in the catalog as `pre-964/Speedster` — it shares the Carrera 3.2 engine and chassis but is treated as its own trim string.
- The Carrera 3.2 Club Sport, Turbo Cabriolet, Turbo Targa, Turbo Flachbau/Slantnose, and 911 SC RS have no catalog representation.
- The catalog `yearEnd: 1988` excludes MY1989 G-series production (Carrera 3.2 continued into early 1989; the 964 debuted as MY1989). This is a year-boundary gap.

---

## Section B — Canonical Research Table

All production figures are total worldwide unless otherwise noted. HP is DIN PS (European factory rating). US SAE net figures are noted in parentheses where reliably sourced. [VERIFY] marks data uncertain across primary sources.

| Canonical Name | Years | Body | Engine (cc / config / asp) | HP (PS) | Trans | Drive | Prod Worldwide (cited) | US Allocation (cited) | MSRP USD | Key Options | Issues | Significance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 911 2.7 (base) | 1974–1977 | Coupé, Targa | 2687 / F6 / NA (CIS Bosch) | 150 PS (US: ~143 hp SAE) | 4-spd 915 (Sportomatic opt.) | RWD | ~10,700 Coupé + ~5,500 Targa [VERIFY: Porsche AG detailed breakdown not published; estimates derived from Stuttgart records cited in Excellence] | ~40% [VERIFY] | ~$10,845 (1974 US) | Sportomatic, sunroof, Blaupunkt radio | Nikasil bore scoring in cold climates (MY1974–75); 2.7 oil cooler prone to cracking | First G-series; impact bumpers; base of three-tier lineup |
| 911 S 2.7 | 1974–1977 | Coupé, Targa | 2687 / F6 / NA | 175 PS (US: ~165 hp SAE) [VERIFY: US SAE figure varies by source] | 5-spd 915 | RWD | ~5,300 [VERIFY: not published by Porsche AG separately; estimate] | ~30% [VERIFY] | ~$12,900 (1974 US) | Fuchs alloy wheels standard, sport seats | Nikasil bore scoring; S-spec head prone to overheating at sustained high revs | Mid-grade G1; shares body with base but mechanically distinct |
| 911 Carrera 2.7 | 1974–1977 | Coupé, Targa | 2687 / F6 / NA (MFI on early cars; CIS later) | 210 PS (US: ~175 hp SAE with detuned CIS) [VERIFY] | 5-spd 915 | RWD | ~3,300 [VERIFY: Excellence and Porsche Klassik cite 3,000–3,500; variant-level split not confirmed] | ~20–25% [VERIFY] | ~$14,500–$15,000 (1974 US) | Ducktail spoiler (M491), whale-tail (later), Fuchs alloys | High-strung RS-derived engine sensitive to oil quality; Nikasil bore scoring | Road version of RS engine; ducktail spoiler became G-series icon |
| 911 Carrera 3.0 | 1976–1977 | Coupé, Targa, Cabriolet | 2994 / F6 / NA (Bosch K-Jetronic) | 200 PS (US: ~165 hp SAE) | 5-spd 915 | RWD | ~3,687 [VERIFY: commonly cited across Excellence, Porsche Klassik; breakdown by body not confirmed] | ~30% [VERIFY] | ~$17,000 (1976 US est.) | Sport seats, limited-slip differential (M220) | 3.0 bore less prone to Nikasil issues than 2.7; 915 gearbox synchros wear | Transitional engine; bridges Nikasil 2.7 era and SC; brief production run |
| 911 SC | 1978–1983 | Coupé, Targa, Cabriolet (1983 only) | 2994 / F6 / NA (Bosch K-Jetronic) | 180–204 PS (progression: 180 PS 1978–79; 188 PS 1980; 204 PS 1981–83) | 5-spd 915 | RWD | ~57,000 [Source: stuttcars.com citing Porsche AG; Excellence cites ~58,000; counting methodology varies] | ~35% [VERIFY] | ~$19,900 (1978 US); ~$26,300 (1983 US) | Sport seats, sunroof, limited-slip differential | Timing chain tensioner fatigue (high-priority maintenance); rear quarter panel rust in salt-belt cars | Most produced G-series; first factory Cabriolet since 356; final year Cab launched open-air line |
| 911 SC RS | 1984 | Coupé (Motorsport) | 2994 / F6 / NA (modified SC engine, high-compression) | ~255 PS [VERIFY: some sources cite 250–260 PS; factory output figure not widely confirmed] | 5-spd 915 | RWD | 21 [Source: Porsche Motorsport build records; some sources cite 20 + 1 development car] | 0 (none exported to US) | N/A (sold to rally teams only) | Full roll cage, fibreglass body panels, Safari suspension | Not a road car; maintenance requires Motorsport knowledge | Group B rally homologation; rarest G-series production; commands seven-figure auction results |
| 911 Carrera 3.2 | 1983–1989 | Coupé, Targa, Cabriolet | 3164 / F6 / NA (Bosch Motronic DME) | 231 PS / 228 hp (consistent across all markets MY1984+) | 5-spd 915 (1983–86); 5-spd G50 (1987–89) | RWD | ~76,000 [Source: multiple consistent citations — Excellence, Porsche Klassik, motogallery.com; breakdown by body not published] | ~35% [VERIFY: US received ~26,000–27,000; estimate] | ~$21,440 (1984 US); ~$32,000 (1988 US) | M491 Turbo-look wide body (on Coupé and Cab), M637 Club Sport, limited-slip differential, sport seats | Timing chain tensioner (inherited from SC; updated 1984); G50 gearbox (1987+) rear oil seal | Best G-series NA; Motronic DME a leap over carb predecessors; G50 gearbox a significant improvement over 915 |
| 911 Carrera 3.2 Club Sport | 1987–1989 | Coupé | 3164 / F6 / NA | 231 PS (same engine, weight reduction focus) | 5-spd G50 | RWD | ~340 worldwide [VERIFY: PCA Panorama cites ~340; no official Porsche AG published figure] | ~53 US [VERIFY] | ~$31,950 (1987 US) | M637 option: deleted AC, rear seats, carpet, sound deadening; added front strut brace, battery isolator; sport bucket seats | Minimal soundproofing increases cabin heat; harder to source deleted comfort parts if retrofitted | Lightweight factory delete variant; spiritual predecessor to 964 RS; high collector demand relative to production count |
| 911 Carrera 3.2 Speedster | 1988–1989 | Speedster (narrow and wide) | 3164 / F6 / NA | 231 PS | 5-spd G50 | RWD | 2,103 total [VERIFY: most cited figure; some sources cite 2,065; 356 Registry and Excellence agree on 2,103]; of which: 1,280 narrow body, 823 wide Turbo-look body | 823 wide-body [VERIFY: most US-delivered were wide Turbo-look]; narrow body US count not confirmed | ~$65,480 (1989 US, wide) | Wide Turbo-look body (M491/M492, standard on US cars), manual soft top (no power option) | Windscreen sealing at low bows; wide Turbo-look adds complexity to front repair; soft top alignment sensitive | Homage to 356 Speedster; low raked windscreen, vestigial top; wide-body Turbo-look is dominant US configuration |
| 911 Turbo 3.0 (930) | 1975–1977 | Coupé | 2994 / F6 / Turbo (KKK turbo, no intercooler) | 260 PS / 256 hp | 4-spd 930 | RWD | ~2,850 [VERIFY: Excellence and 911-guide.com cite 2,850–2,873; Porsche AG has not published exact figures separately from 3.3 Turbo total] | ~400 (US 1976–77 only) [VERIFY] | ~$25,850 (1976 US) | Rear whale-tail spoiler (standard), Fuchs alloys | Severe turbo lag from idle; 4-speed 930 gearbox limits driveability; clutch life short under hard use | First production 911 Turbo; "widowmaker" acquired in press due to snap oversteer; established 930 as benchmark |
| 911 Turbo 3.3 (930) | 1978–1989 | Coupé (1978–89); Targa and Cabriolet added 1987 | 3299 / F6 / Turbo + intercooler (KKK) | 300 PS / 296 hp (1978–88); 330 PS with X51 power kit option; 5-spd G50 model (1989 US) retains 300 PS | 4-spd 930 (1978–88); 5-spd G50 (1989 US only) | RWD | ~15,000 total all body styles and markets [Source: motogallery.com G-series guide citing Porsche production; Excellence consistent; includes Flachbau, Cab, Targa subtotals] | ~3,000 US [VERIFY: US received Turbo 1976–77, then not again until MY1980; US total across 1980–89 estimate] | ~$48,000 (1978 US); ~$74,000 (1986 US); ~$82,000 (1989 US) | X51 power kit (330 PS), sport seats, Flachbau (M505/M506, see below), limited-slip | Turbo lag more pronounced than modern turbos; 4-spd limits revs; clutch and throwout bearing high-wear items | Definitive G-series; 300 PS for 11 years; intercooler addition over 3.0 dramatically improves tractability |
| 911 Turbo 3.3 Flachbau / Slantnose | 1981–1989 | Coupé, Targa, Cabriolet | 3299 / F6 / Turbo + intercooler | 300 PS (330 PS with X51 option) | 4-spd 930 / G50 (1989) | RWD | 948 total [Source: berlinmotorbooks.de citing Porsche factory records; figure is widely repeated and treated as definitive] | ~160 US [VERIFY: figure cited in Excellence and PCA Panorama] | ~$97,500 (1986 US); higher with X51 and bespoke options | M505 (right-hand drive Slantnose option code); M506 (left-hand drive); pop-up headlights (hand-built), revised hood and front fenders; in-fender auxiliary cooling fans | Hand-fabricated nose fragile; restoration of Flachbau nose extremely expensive; cooling fans prone to failure | Sonderwunsch (Special Wish) option originally; brought in-house MY1983; 935-inspired aesthetics; among the most valuable G-series today |
| 911 Turbo 3.3 Cabriolet | 1987–1989 | Cabriolet | 3299 / F6 / Turbo + intercooler | 300 PS | 4-spd 930 / G50 (1989) | RWD | ~447 [VERIFY: commonly cited breakdown: 1987 ~174, 1988 ~165, 1989 ~108; included in ~15,000 Turbo 3.3 total above] | Not separately published [VERIFY]; US received allocation across all three years | ~$82,000–$95,000 (est. 1987–89 US) | Turbo-look wide body (standard), electric soft top | Cabriolet body less rigid under Turbo torque loads; soft top alignment drift; wide body adds front-end repair cost | Rarest regular-production 930 variant; open-air Turbo experience at expense of handling precision |
| 911 Turbo 3.3 Targa | 1987–1989 | Targa | 3299 / F6 / Turbo + intercooler | 300 PS | 4-spd 930 | RWD | ~18 confirmed [VERIFY: no official Porsche AG number; individual chassis documented by registries; Sonderwunsch orders only — not a regular production model] | ~1–2 US [VERIFY] | Sonderwunsch pricing (well above standard Turbo) | Built as individual customer commissions; full Targa removable roof section; effectively one-off production | Extremely rare; body integrity documentation essential; parts unique to configuration | Rarest G-series Turbo body variant; each chassis individually documented by 930-specific registries |

---

### Notes on Uncertain G-Series Claims

**Total production of 196,397:** The Porsche AG press kit figure is consistent with aggregating all sub-models. Cross-checking individual model estimates yields approximately 185,000–195,000, consistent with known counting ambiguity (chassis built vs. delivered, prototype/press cars included or excluded). Accept 196,397 as the Porsche-sourced figure but do not present individual sub-model totals as additive to this exact number.

**911 Turbo 3.3 "LE" (Limited Edition):** The task scope lists this as a distinct variant. No separately enumerated "911 Turbo 3.3 LE" production run with a documented chassis total has been confirmed across Excellence, Porsche Klassik, Ludvigsen, or PCA Panorama at the time of this research. Porsche offered market-specific special-equipment packages for the Turbo (notably a 1982–83 UK "Sport Equipment" package and various color-combination specials for the US), but these were option packages on the standard Turbo, not separately homologated production runs with assigned production totals. **[VERIFY against PCA Panorama production data issues and Porsche Klassik 930 registry features before publishing this claim.] Do not present a specific production number for a "3.3 LE" until a primary source is identified.**

**935 Strassen ("street"):** The 935 was a purpose-built Group 5 racing car. No factory production "street" 935 exists. Porsche built approximately 56 customer 935 race cars (all chassis numbers documented). Several were privately registered for road use post-purchase; Kremer Racing and other coachbuilders created street conversions. None were factory production models. This variant does not belong in the production catalog.

**2.7-era base/S/Carrera production splits:** Porsche AG has not published MY1974–1977 production broken down by trim level. All figures above (base, S, Carrera 2.7) are estimates derived from Stuttgart production database summaries quoted in secondary sources. The commonly used aggregate for all 2.7-era G-series (base + S + Carrera 2.7 combined) is approximately 25,000 units, but this figure itself carries ±15% uncertainty.

---

## Section C — Catalog Gaps

**Structural:**

- The `pre-964` generation (1965–1988) conflates the F-series (long-hood, 1965–1973) and G-series (1974–1989) into one generation entry. This is the dominant structural gap. Comp engine, year-range validation, and generation labeling all require disambiguation logic that the catalog does not provide. The generation ID `930`, referenced in `lib/trim-category/index.ts` `derive930()` function, is an orphan — no generation with that ID exists in models.ts (documented in `docs/overnight/trim-list-audit.md`).

- The catalog `yearEnd: 1988` cuts off MY1989 G-series production. The Carrera 3.2 and 930 Turbo were sold as MY1989 alongside the newly introduced 964. Listings from MY1989 with G-series spec will be misrouted or excluded.

- The `pre-964` generation `yearStart: 1965` extends the generation two years before the G-series. Listings from 1974–1977 will resolve to this generation correctly, but so will F-series listings — there is no mechanism to distinguish them.

**Missing trim strings:**

- `911 SC RS` — 21-unit Group B homologation; not in catalog; should be a distinct trim or a "Motorsport" sub-category.
- `Carrera 3.2 Club Sport` — 340 units worldwide; not in catalog; frequently appears in auction listings and comps filtering under plain "Carrera 3.2" which overstates comparable supply.
- `Turbo Flachbau` / `Slantnose` — 948 units; not in catalog; currently matches to `Turbo 3.3` which dramatically overstates comparable supply (15,000 vs 948).
- `Turbo Cabriolet` — ~447 units; not in catalog; distinct enough from Turbo Coupé to require its own comp bucket.
- `Turbo Targa` — ~18 units; Sonderwunsch; comps engine cannot function for this variant without a separate entry and a "data insufficient" handling path.
- `Speedster Turbo-look` vs `Speedster` narrow body — these are the same catalog trim string but have materially different values (wide-body commands premium); the catalog cannot distinguish them.

**Missing per-trim year ranges:**

- The catalog stores one year range per generation, not per trim. The Carrera (2.7) was active 1974–1977; the SC was active 1978–1983; the Carrera 3.2 was active 1983–1989. A listing with model year 1980 and trim "Carrera 3.2" would pass catalog validation (the generation covers 1965–1988) but is an impossible combination. Per-trim year constraints must be enforced in the comp engine or validation layer, not derivable from models.ts alone.

**Missing body-style information:**

- The `Targa` trim string is a body variant, not an engine/spec variant, but is stored as a peer trim alongside `SC`, `Carrera 3.2`, etc. This makes it impossible to correctly represent "SC Targa" or "Carrera 3.2 Targa" in the catalog. A listing with trim="Targa" carries no engine or spec information.

**Production figure status:**

- No G-series trim has production figures in the catalog. Comp engine bucket sizing relies on research-derived estimates (above), all of which carry [VERIFY] status at the variant level. The total of 196,397 from Porsche AG is the only firm, source-documented figure for this generation.

**Carrera RS overlap:**

- `pre-964/Carrera RS` exists in the catalog but maps to F-series cars (1972–73 Carrera RS 2.7, 1974 RS 3.0) — not G-series. No G-series road car carried the RS designation. This trim string will produce incorrect comp routing for any G-series listing matched against it.

**935 Strassen:**

- No factory production "935 Strassen" exists. This variant should be excluded from the catalog entirely. If a listing is encountered claiming to be a "935 Strassen," it is either a street-registered customer race car or a coachbuilt conversion — neither belongs in the standard comp engine.

---

## Sources

- Porsche AG Newsroom: "50 Years of the G-Series 911" press kit (2023) — total production figure 196,397
- Porsche AG Newsroom: "50 Years of the 911 Turbo" press kit (2024) — 930 Turbo historical overview
- Ludvigsen, Karl. *Porsche: Excellence Was Expected* (3rd ed., Bentley Publishers, 2012) — engineering detail across all G-series variants
- Dron, Tony. *Porsche 911: The Definitive History 1977–1987* (Haynes, 2010) — SC and Carrera 3.2 detail
- *Excellence Magazine*: G-series production survey articles (various issues, 1995–2015) — sub-model estimates
- *Porsche Klassik*: "911 G-Baureihe" production registers (2013, 2018) — Flachbau, Club Sport, SC production references
- PCA *Panorama*: Production data features — Club Sport allocation, Speedster body split
- motogallery.com G-series production guide — 930 3.3 total production ~15,000
- berlinmotorbooks.de: Flachbau 930 registry — 948 units documented
- stuttcars.com G-series reference — SC production ~57,000
- 911-guide.com: 930 3.0 production reference
- Porsche Motorsport historical records (SC RS): cited in Excellence and Porsche Klassik 2014 Group B feature
