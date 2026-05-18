# Long-Hood 911 Production Claim Reference
## Family: 911 O/A/B/C/D/E/F-series (1963–1973)

**Scope:** First-generation 911 — 901/early 911 (1963–1967 SWB), 911 T/E/L/S (1968–1973, Coupe + Targa), 1967 911 R, 1973 Carrera RS 2.7 (M471 Lightweight, M472 Touring, RSH), Carrera RSR 2.8. G-series (1974+) excluded.  
**Generated:** 2026-05-18. Figures are DIN PS unless noted. [VERIFY] = uncertain against primary source.

---

## A — Catalog Coverage

**Generation-ID mapping in the codebase:**

- `models.ts` `GENERATION_DEFS` has one entry covering this era: `pre-964` (yearStart: 1965, yearEnd: 1988, trims: `[Carrera, Carrera RS, Carrera 3.2, Targa, Turbo, Turbo 3.3, SC, Speedster]`).
- `factory-specs.ts` uses two separate genIds — `911-pre-a` and `911-f-body` — that do **not** appear in `models.ts` `GENERATION_DEFS`.
- `trim-category/index.ts` has no handler for `pre-964`, `911-pre-a`, or `911-f-body`; all returns `null`.
- Consequence: no long-hood car can be reached via `validTrimsForModelYear()`, `lookupFactorySpecs()`, or `deriveTrimCategory()` through the standard generation-dispatch path.

| trim_id (factory-specs.ts key) | Display name | Year | Body | Engine | HP | Trans | Drive | Prod WW | Prod US | Issues |
|---|---|---|---|---|---|---|---|---|---|---|
| `911-pre-a:901` | 901 (pre-rename) | 1963–64 | Cpe | 2.0L Type 901/01 (Solex 40PI, alum case) | 130 | 901 5MT dogleg | RWD | ~82 | (not in catalog) | genId not in models.ts; year precedes pre-964 yearStart:1965 |
| `911-pre-a:911` | 911 base (O/A-series) | 1965–67 | Cpe; Targa MY67 | 2.0L Type 901/01→Weber IDA, alum case, SWB | 130 | 901 5MT | RWD | ~9,300 est | ~800 est | genId not in models.ts; HP is catch-all; Targa body not separate |
| `911-f-body:t_20` | 911 T 2.0L | 1968 A-series | Cpe + Targa | 2.0L Type 901/03 (Weber, cast-iron cyls) | 110 | 901 5MT | RWD | ~2,775 | ~1,600 est | genId not in models.ts; T not in pre-964 trim array |
| `911-f-body:l` | 911 L (Lux) | 1968 A-series | Cpe + Targa | 2.0L Type 901/06 RoW / 901/14 US, SWB | 130 | 901 5MT | RWD | ~2,186 | ~2,186 (US/Japan) | genId not in models.ts; L not in pre-964 trim array; single-year only |
| `911-f-body:s_20` | 911 S 2.0L | 1967–69 | Cpe + Targa | 2.0L Type 901/02 Weber (MY67–68) / MFI B-series (MY69) | 160 (MY67–68); 170 (MY69) | 901 5MT | RWD | ~3,700 est | ~0 MY68; ~500 MY69 est | genId not in models.ts; hp field = 160 but MY69 B-series = 170 (see §C discrepancy 1) |
| `911-f-body:e_20` | 911 E 2.0L | 1969 B-series | Cpe + Targa | 2.0L Type 901/09 (Bosch MFI, LWB intro) | 140 | 901 5MT | RWD | ~2,050 | ~400 est | genId not in models.ts; E not in pre-964 trim array; single-year 2.0L not separable |
| `911-f-body:t_22` | 911 T 2.2L | 1970–71 C/D | Cpe + Targa | 2.2L Type 911/03 (Weber, alloy cyls) | 125 | 901 5MT | RWD | ~6,558 | ~3,800 est | genId not in models.ts |
| `911-f-body:e_22` | 911 E 2.2L | 1970–71 C/D | Cpe + Targa | 2.2L Type 911/01 (Bosch MFI) | 155 | 901 5MT | RWD | ~4,006 | ~1,100 est | genId not in models.ts |
| `911-f-body:s_22` | 911 S 2.2L | 1970–71 C/D | Cpe + Targa | 2.2L Type 911/02 (Bosch MFI, hot cams) | 180 | 901 5MT | RWD | ~3,465 | ~1,200 est | genId not in models.ts |
| `911-f-body:t` / `t_24` | 911 T 2.4L | 1972–73 E/F | Cpe + Targa | 2.4L Type 911/57 carb RoW / 911/51–52 MFI US / 911/91 K-Jet US Jan73+ | 130 carb / 140 MFI | 915 5MT | RWD | ~5,207 | ~3,500 est | Duplicate entries (catch-all + _24); three sub-specs in one row; K-Jet vs MFI is a valuation split (see §C disc. 5) |
| `911-f-body:e` / `e_24` | 911 E 2.4L | 1972–73 E/F | Cpe + Targa | 2.4L Type 911/52 (Bosch MFI) | 165 | 915 5MT | RWD | ~3,502 | ~1,000 est | Duplicate entries (catch-all + _24); genId not in models.ts |
| `911-f-body:s` / `s_24` | 911 S 2.4L | 1972–73 E/F | Cpe + Targa | 2.4L Type 911/53 (Bosch MFI, hot cams) | 190 | 915 5MT | RWD | ~3,782 | ~1,400 est | Duplicate entries (catch-all + _24); genId not in models.ts |
| `911-f-body:carrera_rs_27_sport` | Carrera RS 2.7 M471 Lightweight | 1973 F-series | Cpe | 2.7L Type 911/83 (Bosch MFI, 90 mm bore) | 210 | 915 5MT | RWD | ~200 (17 RHD) | 0 | genId not in models.ts; M471 not in pre-964 trim array |
| `911-f-body:carrera_rs_27_touring` | Carrera RS 2.7 M472 Touring | 1973 F-series | Cpe | 2.7L Type 911/83 (Bosch MFI) | 210 | 915 5MT | RWD | ~1,308–1,319 | 0 | genId not in models.ts; M472 not in pre-964 trim array |
| `911-f-body:carrera_rs` | Carrera RS 2.7 (catch-all) | 1973 | Cpe | 2.7L Type 911/83 | 210 | 915 5MT | RWD | (not in catalog) | (not in catalog) | Resolves to Touring spec per engine description; M471 vs M472 not distinguishable via this key |
| `911-f-body:r` | 911 R | 1967–68 | Cpe | 2.0L Type 901/22 (Weber 46 IDA3C, twin-plug, Ti rods, Mg case) | 210 | 901 5MT | RWD | 24 | 0 | genId not in models.ts; R not in pre-964 trim array |
| — | Carrera RS 2.7 RSH (Homologation) | 1973 | Cpe | 2.7L Type 911/83 | 210 | 915 5MT | RWD | 17 | 0 | No factory-specs.ts entry; not in catalog at all |
| — | Carrera RSR 2.8 | 1973 | Cpe (race) | 2.8L Type 911/72 (Bosch MFI, 92 mm bore) | ~308 [VERIFY] | 915 5MT race | RWD | ~55 [VERIFY] | 0 | Not in catalog; race car; risk of ingestion as RS road car |

**`models.ts` pre-964 trim array note:** `Targa` is listed as a trim alongside Carrera/Turbo/SC — in the long-hood era Targa is a body style, not a trim level. `Carrera 3.2` is a G-body (1984–89) trim incorrectly available in this gen from yearStart: 1965.

---

## B — Canonical Production Lineup

All cars RWD. HP = DIN PS. MSRP USD is US retail at approximate launch; DM figures noted for Europe-only cars. Sources cited inline.

| Canonical name | Year | Body | Engine | HP (DIN) | Trans | Prod WW | US alloc | MSRP USD | Key options | Issues / notes | Significance |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 901 (pre-rename) | 1963–64 | Cpe | 2.0L Type 901/01 flat-six, Solex 40PI carb, alum case, SWB 2,211 mm | 130 | 901 5MT dogleg | ~82 [1, 2] | ~0 (pre-export) | n/a | — | All re-plated "911" after Peugeot trademark dispute Sep 1964; count varies 82–83 by source [VERIFY: 1, 2] | Founding production 911-architecture cars |
| 911 base (O-series) | 1965–67 | Cpe; Targa from MY67 | 2.0L Type 901/01 flat-six, Solex→Weber IDA Feb1966, alum case, SWB | 130 | 901 5MT dogleg | ~9,291 cpe+Targa combined [VERIFY: 1, 3] | ~800–1,000 est [VERIFY: 4] | ~$6,490 (MY65) – $6,990 (MY67) [VERIFY: 7] | Targa body (MY67), Sportomatic, Webasto sunroof | Single model 1965–66; S and Targa added MY67; soft-window Targa (MY67, ~½ of MY68) collector sub-tier; alum crankcase | SWB founding configuration; highest-tier SWB collector market |
| 911 S 2.0L | 1967–69 | Cpe + Targa | 2.0L Type 901/02 Weber IDA3C (MY67–68); Type 901/22 Bosch MFI (MY69 B-series LWB) | 160 (MY67–68); 170 (MY69 MFI) | 901 5MT | ~1,999 all years combined [VERIFY: 1, 3] | 0 (MY68 not US); ~500 MY69 [VERIFY: 4] | n/a MY67–68 (not US); ~$10,170 MY69 [VERIFY: 7] | Fuchs alloys std, ventilated discs std, LSD option | Not imported to US MY68 (emissions); carb→MFI transition within displacement; LWB introduced MY69 B-series; power increases from 160→170 PS MY69 | Performance flagship SWB/LWB transition |
| 911 T 2.0L | 1968 A-series | Cpe + Targa | 2.0L Type 901/03 flat-six, Weber carbs, cast-iron cyls, SWB | 110 | 901 5MT | ~2,775 [VERIFY: 1, 3] | ~1,600 est [VERIFY: 4] | ~$7,295 [VERIFY: 7] | Sportomatic, Targa body | Last SWB T; cast-iron cylinders (2.2L switched to alloy); carbureted throughout | Entry SWB; accessible collector entry |
| 911 L (Lux) | 1968 A-series | Cpe + Targa | 2.0L Type 901/06 RoW / 901/14 US flat-six, SWB | 130 | 901 5MT | ~2,186 [VERIFY: 1, 3] | ~2,186 (US/Japan) [VERIFY: 4] | ~$7,990 est [VERIFY: 7] | S-spec brakes, additional comfort equipment | Single-year only; replaced by 911 E for MY69; US/Japan primary market | Single-year rarity; documentation challenge for correct-trim COA |
| 911 E 2.0L | 1969 B-series | Cpe + Targa | 2.0L Type 901/09 flat-six, Bosch MFI, LWB (2,268 mm) intro | 140 | 901 5MT | ~2,050 [VERIFY: 1] | ~400 est [VERIFY: 4] | ~$9,195 est [VERIFY: 7] | Boge hydropneumatic front struts (E-only MY69–71), Sportomatic | Single-year 2.0L E; struts are E-only feature discontinued MY72; LWB debut year | B-series debut; 2.0L E is a distinct one-year collector niche |
| 911 T 2.2L | 1970–71 C/D-series | Cpe + Targa | 2.2L Type 911/03 flat-six, Weber carbs, alloy cyls | 125 | 901 5MT | ~6,558 combined [VERIFY: 1] | ~3,800 est [VERIFY: 4] | ~$7,695 (MY70 est) [VERIFY: 7] | Sportomatic, LSD | Alloy cylinders vs MY68 cast-iron; carbureted throughout; volume model | High-volume entry LWB; accessible driver |
| 911 E 2.2L | 1970–71 C/D-series | Cpe + Targa | 2.2L Type 911/01 flat-six, Bosch MFI | 155 | 901 5MT | ~4,006 combined [VERIFY: 1] | ~1,100 est [VERIFY: 4] | ~$9,695 (MY70 est) [VERIFY: 7] | Boge struts (discontinued MY72), Sportomatic, LSD | MY72 Boge struts dropped; MFI throughout | Mid-trim 2.2L; broader torque than T |
| 911 S 2.2L | 1970–71 C/D-series | Cpe + Targa | 2.2L Type 911/02 flat-six, Bosch MFI, hotter cams | 180 | 901 5MT | ~3,465 combined [VERIFY: 1] | ~1,200 est [VERIFY: 4] | ~$11,295 (MY70 est) [VERIFY: 7] | Fuchs alloys std, ventilated discs std, LSD option | US-sold from MY70 [VERIFY: 4, 10]; top 2.2L | Top LWB 2.2L; collector preferred over T |
| 911 T 2.4L | 1972–73 E/F-series | Cpe + Targa | 2.4L Type 911/57 carb RoW / 911/51–52 MFI early-US / 911/91 K-Jet US from Jan 1973 ("1973.5") | 130 carb / 140 MFI | 915 5MT | ~5,207 combined [VERIFY: 1, 3] | ~3,500 est [VERIFY: 4] | ~$9,195 (MY72 est) [VERIFY: 7] | Type 915 gearbox (new MY72), oil-filler door on B-pillar (MY72 E-series only), K-Jet from Jan 1973 US | Three induction sub-specs; K-Jet "1973.5" cars trade at discount vs MFI; oil-filler door MY72 one-year feature; Type 915 gearbox stronger than 901 | Volume model; first K-Jet 911 (Jan 1973 build) |
| 911 E 2.4L | 1972–73 E/F-series | Cpe + Targa | 2.4L Type 911/52 flat-six, Bosch MFI | 165 | 915 5MT | ~3,502 combined [VERIFY: 1] | ~1,000 est [VERIFY: 4] | ~$11,195 (MY72 est) [VERIFY: 7] | LSD, Sportomatic, oil-filler door (MY72 only) | MY72 E-series: unique oil-filler door on B-pillar; many modified/filled by previous owners | Mid-trim 2.4L; "sweet spot" for road use per collector consensus [3] |
| 911 S 2.4L | 1972–73 E/F-series | Cpe + Targa | 2.4L Type 911/53 flat-six, Bosch MFI, hot cams | 190 | 915 5MT | ~3,782 combined [VERIFY: 1] | ~1,400 est [VERIFY: 4] | ~$12,895 (MY72 est) [VERIFY: 7] | Fuchs alloys std, secondary oil cooler std (MY73 F-series), chin spoiler (MY73), LSD | MY68 not US-sold; MY73 F-series is most developed pre-RS standard S; not US-certified MY68 | Most valued standard long-hood drivetrain outside RS |
| Carrera RS 2.7 — M471 Lightweight (Sport) | 1973 F-series (prod Nov 1972 – Jun 1973) | Cpe | 2.7L Type 911/83 flat-six, Bosch MFI, 90 mm bore, wide rear arches (M491) | 210 | 915 5MT | ~200 (17 RHD) [VERIFY: 2, 5, 6] | 0 (no factory US import) | n/a US; DM 33,000 est [VERIFY: 7] | Fiberglass engine lid + bumpers, thin-gauge steel, thin glass, Recaro shells, no rear seat, no clock, ducktail spoiler, ~975 kg | Announced Paris Show Oct 1972; M471 vs M472 misrepresentation risk (price gap $500K+); RHD count 17 or 18 [VERIFY: 5, 6]; first-series cars (~001–500) most aggressively lightweighted | Homologation apex; highest long-hood valuations ($800K–$1.5M+ 2026) |
| Carrera RS 2.7 — M472 Touring | 1973 F-series | Cpe | 2.7L Type 911/83 flat-six, Bosch MFI | 210 | 915 5MT | ~1,308–1,319 [VERIFY: 2, 5] | 0 (no factory US import) | n/a US; DM 33,000 est [VERIFY: 7] | 911 S–level interior, carpet, rear seats, clock, standard-weight steel, ~1,075 kg | Shares body/aero/engine with M471; interior spec is the only distinction; COA required for M472 authentication | Volume RS; accessible RS entry ($350K–$700K 2026) |
| Carrera RS 2.7 — RSH (Homologation) | 1973 F-series | Cpe | 2.7L Type 911/83, Bosch MFI | 210 | 915 5MT | 17 (all LHD) [2, 5] | 0 | n/a | Ultra-stripped ~960 kg, max interior deletions, all cosmetic deletions | All LHD; separate from M471 despite being heavier stripped than later M471 series; rarely traded as a distinct category | FIA Group 4 homologation trigger |
| 911 R | 1967–68 | Cpe | 2.0L Type 901/22 flat-six, Weber 46 IDA3C, twin-plug, Ti connecting rods, Mg case, ~810 kg | 210 | 901 5MT | 24 (4 factory proto + 20 customer) [1, 2, 9] | 0 factory | n/a US | Fiberglass bonnet/doors/fenders/engine lid (Karl Baur, Stuttgart), Plexiglas side windows | Factory destroyed 1 crash car; surveyable pool ~22–23; $3M+ for provenance-correct examples; never homologation-sufficient | GT-class lightweight founder; structural ancestor of every RS-class 911 |
| Carrera RSR 2.8 | 1973 (race car) | Cpe (race) | 2.8L Type 911/72 flat-six, Bosch MFI, 92 mm bore, RSR bodywork | ~300–315 [VERIFY: sources vary; 7, 8] | 915 5MT race-spec | ~55 [VERIFY: Porsche AG; sources range 49–59] | 0 | n/a | Wide RSR arches, flat nose, ducktail, FIA roll cage, full race prep | Not road-registered; purpose-built from RS 2.7 homologation; power varies by track prep; not a road car | Won 1973 Daytona 24H, Sebring 12H, Targa Florio overall |

---

## C — Gap Analysis

### ADD CANDIDATES

1. **T, E, L trims absent from `models.ts` `pre-964` trim array.** The volume long-hood trims — 911 T, 911 E, 911 L — are not listed in `validTrimsForModelYear()` for any year 1965–1973. A 911 T or 911 E listing cannot be correctly categorized or routed to a comp pool via the catalog layer. Add `'911 T', '911 E', '911 L'` to the `pre-964` trim array at minimum, or restructure into displacement-specific sub-generations (preferred — see item 9).

2. **911 R absent from catalog.** `factory-specs.ts` has a detailed `911-f-body:r` entry; `models.ts` has no "R" trim. The 911 R is a $3M+ car that appears on BaT. Without a trim entry it would ingest as a generic 1967 base 911. Add `'R'` or `'911 R'` to the appropriate trim list.

3. **Carrera RS 2.7 M471 and M472 not differentiated.** `models.ts` lists `'Carrera RS'` as one undifferentiated trim. The $500K+ price gap between M471 and M472 makes a single comp category unusable. Add `'Carrera RS 2.7 Lightweight'` and `'Carrera RS 2.7 Touring'` as separate catalog trims.

4. **Carrera RS 2.7 RSH not in catalog.** 17 cars, all LHD, a distinct ultra-stripped specification. Add as a non-comped reference entry or flag as `race-class` to prevent comp against road RS 2.7.

5. **Carrera RSR 2.8 not catalogued.** Race car but expected on BaT/PCarMarket. Without a catalog entry it will be ingested and potentially comped against RS 2.7 road cars. Add as a `race-car` class entry; mark non-comped.

6. **901 designation absent.** ~82 pre-rename 1963–1964 cars. Sellers use "901" as a premium descriptor in listing titles. Currently would ingest as a generic `pre-964` car with no gen match (yearStart: 1965 misses 1963–64). Add `'901'` as a trim or handle via a 1963–1964 `911-pre-a` generation entry in `models.ts`.

7. **`911-pre-a` genId not in `models.ts`.** `factory-specs.ts` entries under `911-pre-a` cannot be reached by `lookupFactorySpecs()` because `validTrimsForModelYear()` uses `pre-964` (not `911-pre-a`) for 1965+. A 1965 listing routed via the comp engine will get `null` from `lookupFactorySpecs('911-pre-a', ...)` because the comp engine dispatches with `pre-964`.

8. **`911-f-body` genId not in `models.ts`.** Same problem as item 7 for all 1966–1973 long-hood listings. Every `911-f-body` spec entry is unreachable. The three-way mismatch — `models.ts` uses `pre-964`; `factory-specs.ts` uses `911-f-body`; `generation-content.ts` uses `911-f-body` — means spec lookup, generation content, and model validation all use different IDs for the same car.

9. **SWB (1965–1968) / LWB (1969–1973) not a filterable attribute.** This is the most fundamental collector valuation split in the F-body family. Currently no table column, no catalog attribute, and no comp filter captures it. Add as a `body_subtype` or `wheelbase` field on listings for pre-964 era cars, or split the generation into SWB and LWB sub-generations in `models.ts`.

10. **Displacement-specific spec suffixes (`_20`, `_22`, `_24`) have no models.ts counterpart.** The spec granularity exists in `factory-specs.ts` but is unreachable. No mechanism routes a 1970 listing to `911-f-body:t_22` vs a 1973 listing to `911-f-body:t_24`.

### REMOVE CANDIDATES

1. **`Targa` as a trim in `pre-964` trim array.** In the long-hood era Targa is a body style, not a trim level — any T, E, L, or S could be ordered as a Targa. Listing `Targa` as a trim alongside `Carrera` and `SC` conflates body style with performance hierarchy. If `body_style` is the authoritative field, this entry is redundant and will cause mis-categorization (a 911 T Targa could be tagged `Targa` trim instead of `T` trim).

2. **`Carrera 3.2` available from yearStart: 1965 in `pre-964`.** `Carrera 3.2` is a G-body designation (1984–1989 only). Including it in a generation that starts in 1965 makes it a valid trim option on a 1966 catalog year — which is incorrect. It should be scoped to a MY1984–1989 sub-range or moved to its own `911-3.2-carrera` generation entry in `models.ts` (matching the existing `factory-specs.ts` genId `911-3.2-carrera`).

### DISCREPANCIES

1. **`factory-specs.ts` `911-f-body:s_20` hp = 160; MY1969 B-series spec = 170.** The `hp` field is set to 160 (Weber 1967–68 specification). The engine description notes "Bosch MFI B-series 170 hp" for MY1969. Any MY1969 B-series 911 S resolved to this entry displays 160 hp instead of 170 hp. Correct options: (a) split into `s_20_carb` (160 hp) and `s_20_mfi` (170 hp) keyed by year range; or (b) set hp to "160–170 hp" and add a note field.

2. **`models.ts` `pre-964` yearStart: 1965 predates the 901/early-production cars.** Factory-specs.ts `911-pre-a` entries cover 1963–1964 (`901`) and 1965–1967 (`911`). Any 1963 or 1964 listing ingested by the platform has no matching generation in `models.ts` (yearStart: 1965) and cannot match any trim or generation filter.

3. **Three-way genId mismatch for all long-hood listings.** `models.ts` dispatch genId = `pre-964`. `factory-specs.ts` spec genId = `911-f-body` or `911-pre-a`. `generation-content.ts` content genId = `911-f-body`. No component uses the same identifier, so `lookupFactorySpecs('pre-964', trim)` returns `null` for every long-hood lookup — the spec lookup function scans for `pre-964:` prefix and finds no keys.

4. **Two separate "17" counts in generation-content.ts RS 2.7 content are coincidentally equal but refer to different subsets.** The text at line ~2243 records `production: '~200 worldwide (17 RHD)'` for the M471 Lightweight — meaning 17 right-hand-drive examples within the ~200 M471 total. The notes text at line ~2198 separately describes "17 RSH 'Homologation' cars (ultra-stripped, ~960 kg, all LHD)." Both figures are 17, but the "(17 RHD)" parenthetical in the M471 production line could be misread as referring to the 17 RSH homologation cars (which are, confusingly, all LHD — the opposite). Clarify in generation-content.ts: change M471 line to "(17 RHD; separate from the 17 RSH homologation cars, all LHD)". [VERIFY M471 RHD count against current registry: 5, 6]

5. **`factory-specs.ts` `911-f-body:t_24` engine description omits the pre-Jan-1973 MFI US T spec.** The entry describes "carb RoW / 911/91 (K-Jet US 1973.5)" — omitting Type 911/51/52 MFI on US-spec T cars built before the January 1973 K-Jet transition. A December-1972-build US T has a MFI engine and trades at a premium over a February-1973 K-Jet T; the catalog entry makes them indistinguishable. Add "/ 911/51–52 (MFI US pre-Jan 1973)" to the engine description.

6. **`trim-category/index.ts` returns `null` for all long-hood cars.** No `derive911FBody()` handler exists; the `default: return null` branch catches every long-hood genId. The comp engine's D6 rule (skip trim hard-filter when category is null) therefore applies to every F-body listing, disabling trim-category filtering for this entire family. A handler covering at minimum `t / touring`, `e / einspritzung`, `s / sport`, `l / lux`, `r`, `rs_lightweight`, `rs_touring` categories should be added once the genId is registered in `models.ts`.

7. **`models.ts` `pre-964` yearEnd: 1988 spans G-body, SC, and 3.2 Carrera.** This gen's trim array is used for comp filtering for every air-cooled non-964 911 from 1965–1988. A 1972 911 T and a 1987 Carrera 3.2 are in the same generation bucket. Without hard year or SWB/LWB filters downstream, the comp engine could construct comps that cross generation boundaries with fundamentally different valuations (a 1987 Carrera 3.2 at ~$75K vs a 1972 911 T at ~$100K for good examples). The `pre-964` catch-all is functional for now but should be split into discrete sub-generations as soon as the long-hood comp engine is activated.

---

## Sources

| # | Source | Used for |
|---|---|---|
| 1 | Ludvigsen, Karl. *Porsche: Excellence Was Expected*, 3rd ed. Bentley Publishers, 2003 | Production numbers, engine type designations, wheelbase transitions, O/A/B/C/D/E/F-series boundaries |
| 2 | Porsche AG factory archive / Porsche Classic Certificate of Authenticity program | RS 2.7 variant production counts (M471, M472, RSH); 901 pre-rename count |
| 3 | *Excellence Magazine*, issues 158, 160, 178 (various dates 2000–2015) | O/A-series production splits; F-body valuation commentary |
| 4 | *Porsche Panorama* (PCA official magazine, various issues) | US allocation estimates; T/E/S import records; 911 S MY68 US non-import confirmation |
| 5 | *Porsche Klassik*, issues 14, 22 | RS 2.7 production breakdown (M471/M472/RSH); RHD count; RSH LHD confirmation |
| 6 | Vieten, Lars. Carrera RS 2.7 registry (accessed 2024–2025) | M471 RHD unit count (17 cited; cross-reference against current registry data) |
| 7 | Porsche AG press archives; period US dealer price sheets 1965–1973 | MSRP figures; DM list prices; factory option availability by model year |
| 8 | BaT / PCarMarket transaction histories 2020–2025 | 2026 market value estimates; RSR power-output range in sold-car descriptions |
| 9 | Schlegelmilch, Rainer / Lehbrink, Hartmut. *The 911 Book*. Könemann, 2004 | 911 R production details; Karl Baur bodywork specification |
| 10 | NHTSA import records / EPA emissions compliance files (1968–1973) | 911 S MY1968 US non-importation; K-Jet introduction Jan 1973 US-spec T |
