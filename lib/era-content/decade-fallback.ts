// Static fallback content extracted from docs/reference/porsche_*_reference.md.
// Used by EraCard when a generation has no published DB content.
// `intro` is a 1–2 sentence summary shown on the analyze card.
// `notes` is the full prose for the /generations/[id] expanded page.
// `production_years`, `engine`, `cooling`, `body_styles` supplement DB fields when null.

export interface FallbackData {
  intro: string
  production_years?: string
  body_styles?: string
  engine?: string
  cooling?: string
  notes: string[]
}

const FALLBACK: Record<string, FallbackData> = {

  // ── Early air-cooled 911 ──────────────────────────────────────────────────

  // Source: porsche_1960s_reference.md §"911 / 901 launch generation"
  '911-pre-a': {
    intro: 'The original 911: unveiled at Frankfurt 1963, the first 82 production cars wore "901" badging before Peugeot objected to three-digit numbers with a middle zero. All pre-A cars use the 2.0L Type 901 flat-six and Coupe body only — fewer than 250 survive in original specification.',
    production_years: '1964–1965',
    body_styles: 'Coupe',
    engine: '2.0L Type 901 air-cooled flat-six (130 hp)',
    cooling: 'Air-cooled',
    notes: [
      'The pre-A 911 encompasses the cars produced from late 1964 through the 1965 model year, before Porsche began the lettered series (A-series = 1966 MY). All use the 2.0-litre Type 901 air-cooled flat-six producing 130 hp — a landmark engine sharing its conceptual DNA with the 356 Carrera\'s four-cam unit but now converted to a single overhead cam per bank for production feasibility. All pre-A cars are Coupes; no Targa variant exists for this production phase.',
      'Rarity defines this generation\'s collector market. The 901-badged subset — approximately 82 cars built before Peugeot\'s trademark objection forced the "1" suffix — commands the greatest premium. Any pre-A purchase warrants full authentication of body, engine stampings, and documentation; the cars\' scarcity has made rebadging and conversion attempts a documented concern.',
    ],
  },

  // Source: porsche_1960s_reference.md §"911 / 901 launch generation (F-body, 1964–1969)"
  //         porsche_1970s_reference.md §"911 Long-Hood (F-body), 1970–1973"
  '911-f-body': {
    intro: 'The long-hood F-body era — Series A through F (1966–1973) — spanning three engine families (2.0L, 2.2L, 2.4L) and culminating in the 1973 Carrera RS 2.7, the most sought-after air-cooled 911 of the long-hood generation.',
    production_years: '1966–1973',
    body_styles: 'Coupe, Targa',
    engine: '2.0–2.4L air-cooled flat-six (130–210 hp)',
    cooling: 'Air-cooled',
    notes: [
      'The 911 F-body era spans the A-series (1966 MY) through the F-series (1973 MY), with three major engine families: the 2.0L Type 901 (1966–1969), the 2.2L Type 911/20 (1970–1971), and the 2.4L Type 911 (1972–1973). The Targa body style arrived for the B-series (1967 MY) with a removable hardtop section and a zip-out rear window, upgraded to a glass rear window for 1969. All F-body cars use a five-speed transmission — the Type 901 gearbox through 1971, then the 915 from 1972.',
      'The 1973 Carrera RS 2.7 is the defining F-body collector car. Produced to homologate the RS for GT racing, 1,580 Lightweight (Leichtbau) and Touring variants were built. A Leichtbau with matching engine and gearbox numbers, original factory colour, and uncut body is the benchmark collector F-body. F-body cars showing original engine stamping numbers command meaningful premiums over unmatching-numbers examples.',
    ],
  },

  // Source: porsche_1970s_reference.md §"911 G-body, 1974–1977 (G/H/I/J Series)"
  'g-series-2.7': {
    intro: 'First G-series 911s — impact bumpers mandated by US Federal regulations mark the 1974 G-series (G/H/I/J Series). The 2.7 CIS base engine has a documented heat-exchanger cracking issue; the Carrera 2.7 is the performance variant.',
    production_years: '1974–1977',
    body_styles: 'Coupe, Targa',
    engine: '2.7L CIS air-cooled flat-six (150–210 hp)',
    cooling: 'Air-cooled',
    notes: [
      'The 1974 G-series (formally G/H/I/J series, covering 1974–1977 model years) marked a significant styling departure: integrated polyurethane impact bumpers on extendable struts replaced the chrome bumperettes, adding 75 mm to overall length. The base 911 uses a 2.7-litre CIS fuel-injected flat-six (150 hp US, 165 hp Europe); the Carrera 2.7 produces 210 hp in European trim. The 911 S (1975–1977) bridges the base and Carrera specs. Identifying features: large rubber bumper overriders front and rear, single-hole Fuchs wheels on early cars.',
      'The 2.7 CIS engine heat-exchanger cracking is the defining inspection point for this generation. Early G-series 2.7 engines are susceptible to cracked heat exchangers caused by thermal cycling, potentially introducing exhaust gases into the cabin. Genuine Carrera 2.7 examples with matching ducktail, engine stamp, and gearbox numbers command premiums over standard 911 and 911 S variants from the same years.',
    ],
  },

  // Source: porsche_1970s_reference.md §"911 SC, 1978–1979 portion (K/L Series)"
  //         porsche_1980s_reference.md §"911 G-Body (Carrera 3.2 and SC)"
  '911-sc': {
    intro: 'The Super Carrera (911 SC) unified the fragmented G-series engine range with a single 3.0-litre flat-six — the most reliable air-cooled 911 engine of its era, and the recommended first air-cooled 911 for that reason. The Cabriolet arrived for the final year (1983 MY).',
    production_years: '1978–1983',
    body_styles: 'Coupe, Targa, Cabriolet',
    engine: '3.0L air-cooled flat-six (180–204 hp)',
    cooling: 'Air-cooled',
    notes: [
      'The 911 SC replaced the fragmented 2.7/3.0 engine range with a single unified 3.0-litre unit producing 180 hp (US) to 204 hp (Europe). The SC engine is widely regarded as the most robust air-cooled 911 powerplant through its era — early 2.7 heat-exchanger issues and later 3.2 Motronic teething problems bracket it on either side. Chassis code: 930 (shared with the 911 Turbo of the same era). Body styles: Coupe and Targa through 1982 MY; the Cabriolet joined for 1983 MY as the first production 911 Cabriolet.',
      'The 1983 SC Cabriolet is the first-year open-air 911 and commands a collector premium above the Targa and Coupe from the same year. Matching-numbers SC engines with clean service histories are straightforward to maintain; the 3.0-litre requires no IMS concern and has established specialist support.',
    ],
  },

  // Source: porsche_1980s_reference.md §"911 G-Body (Carrera 3.2 and SC)"
  '911-3.2-carrera': {
    intro: 'The definitive G-series 911 — Bosch Motronic fuel injection and 3.2-litre flat-six (231 hp) arrived for 1984 MY. The Club Sport (1988 MY) stripped the Carrera to driving essentials; the M491 Turbo Look brought the wide Turbo body to the NA car. The 1989 Speedster is the generation send-off.',
    production_years: '1984–1989',
    body_styles: 'Coupe, Targa, Cabriolet, Speedster',
    engine: '3.2L Bosch Motronic air-cooled flat-six (231 hp)',
    cooling: 'Air-cooled',
    notes: [
      'The 3.2 Carrera (1984–1989) introduced Bosch Motronic 2.1 engine management alongside a 3.2-litre flat-six producing 231 hp. The G50 5-speed gearbox replaced the earlier 915 from 1987 MY, addressing a longstanding transmission weakness. Body styles: Coupe, Targa, and Cabriolet from launch; the Speedster joined for 1989 only (~2,100 built, approximately 700 sold in the US). The M491 Turbo Look package added Turbo-width bodywork, brakes, and suspension to the naturally aspirated car.',
      'The 3.2 Carrera Club Sport (1988 MY) is the most collectible naturally aspirated G-series 911. Built lighter by removing air conditioning, rear seats, sound deadening, and auxiliary systems, it produces 231 hp from the same engine in a significantly lighter package. G50-equipped cars (1987–1989) are more desirable than the earlier 915-equipped 1984–1986 cars for daily usability.',
    ],
  },

  // Source: porsche_1980s_reference.md §"911 Turbo (930) 3.3-Litre"
  '930': {
    intro: 'The 3.3-litre air-cooled 911 Turbo, produced 1978–1989 with a single KKK turbocharger and intercooler. US market absent MY1980–MY1985; returned MY1986 with catalysed engine. Final year MY1989 received the five-speed G50 gearbox.',
    production_years: '1978–1989',
    engine: '3.3L turbocharged air-cooled flat-six (930/60)',
    cooling: 'Air-cooled',
    notes: [
      'The 930 is the 3.3-litre air-cooled 911 Turbo produced from 1978 through 1989. A single KKK turbocharger with air-to-air intercooler develops 300 hp in European specification. The US market was absent from MY1980–MY1985 due to emissions and crash standards; the car returned for MY1986 with a catalysed 3.3-litre engine making 282 hp, and Targa and Cabriolet body styles were added for MY1987. The final year (MY1989) received the five-speed G50 manual, replacing the four-speed 930/34 used in all earlier cars.',
      'The Slantnose (Flachbau) programme is the most significant 930 sub-variant. Early cars were Sonderwunsch specials built at Zuffenhausen from 1981–1986; from MY1987 the Slantnose became an orderable option code (M505 in the US, M506 RoW). No IMS bearing — the failure mode that affects 996 and 997.1 base Carreras is not present on the 930.',
    ],
  },

  // Source: porsche_1990s_reference.md §"911 / 964 (1989–1994)"
  '964': {
    intro: 'First major rebody of the 911, with ~85% new components, introducing all-wheel drive as a series option, power steering, ABS, and the 3.6L M64 air-cooled flat-six.',
    production_years: '1989–1994',
    engine: '3.6L M64 air-cooled flat-six (247 hp NA)',
    cooling: 'Air-cooled',
    notes: [
      'The 964 was the first major rebody of the 911, with approximately 85 percent new components over the previous 3.2 Carrera. It introduced all-wheel drive as a series option (Carrera 4, 1989), power-assisted steering, ABS standard, and the 3.6-litre M64 air-cooled flat-six making 247 hp in naturally aspirated form. Transmission options: five-speed G50 manual standard, Tiptronic four-speed automatic on the Carrera 2 — the first 911 with an automatic. The 964 Turbo used the 3.3L engine from the 930 for 1991–1992, then switched to a turbocharged 3.6L M64 for 1993–1994 (355 hp).',
      'Key halo variants include the Carrera RS (Europe-only, 3.8L, 260 PS) and the Turbo S Leichtbau (factory-lightweight 1992 Turbo produced in tiny numbers). For collectors, the 964 is often described as a transitional generation — more modern in engineering but visually conservative. Standard Carrera 2 and Carrera 4 values have appreciated steadily from historical lows in the early 2010s.',
    ],
  },

  // ── Water-cooled 911 ──────────────────────────────────────────────────────

  // Source: porsche_2010s_reference.md §"911 (991.2, MY2017–MY2019 portion)"
  '991.2': {
    intro: 'Turbocharged base 911 for the first time since the 930, with the 3.0L 9A2 twin-turbo flat-six replacing naturally aspirated engines across all Carrera trims. The GT3 MY2018 restored the manual transmission as a factory option.',
    production_years: '2017–2019',
    engine: '3.0L 9A2 twin-turbo flat-six (370–450 hp)',
    cooling: 'Water-cooled',
    notes: [
      'The 991.2 launched for MY2017 with turbocharging on every base Carrera trim — the first turbocharged base 911 since the 930 Turbo ended production for MY1989, ending a 28-year run of naturally aspirated base Carreras. The new 3.0L 9A2 twin-turbo flat-six developed 370 hp (Carrera) and 420–450 hp (S/GTS). Visual identifiers versus the 991.1: horizontal lower front intake, four-point LED brake lights at the rear (versus the ring on 991.1), and revised PCM infotainment.',
      'The GT3 (MY2018) restored the six-speed manual as a no-cost option alongside PDK, resolving the main complaint about the 991.1 GT3. The GT3 Touring (MY2018) paired the manual with a no-wing exterior. The GT2 RS (MY2018, 700 hp, ~1,000 units worldwide) was the most powerful production 911 at its launch. The 991.2 Speedster (MY2019, 1,948 units, 4.0L NA, 6MT only) was the final 991-platform car.',
    ],
  },

  // Source: porsche_2020s_reference.md §"992.1 (MY2020–MY2024 portion)"
  '992.1': {
    intro: 'Current 911 generation (MY2020–2023), wider by 45 mm with standardised wide rear arches across all variants and aluminium-heavy construction. Eight-speed PDK standard on Carrera through Turbo; seven-speed manual available on base Carrera and Carrera T.',
    production_years: '2020–2023',
    engine: '3.0L 9A2 Evo twin-turbo flat-six / 4.0L NA flat-six (GT variants)',
    cooling: 'Water-cooled',
    notes: [
      'The 992.1 entered production for MY2020, replacing the 991.2. It is wider by 45 mm, uses more aluminium bodywork, and standardises wide rear arches across all variants — previously reserved for wide-body trims. The base engine is the 9A2 Evo 3.0L twin-turbo flat-six; GT-department variants use the 4.0L naturally aspirated flat-six carried over from the 991.2 RSR motorsport program. An eight-speed PDK is standard on Carrera through Turbo trims, with a seven-speed manual available on the base Carrera and Carrera T.',
      'The 992.1 GT3 restored the manual transmission as a no-cost factory option from launch. Notable additions across the generation: Carrera T (MY2023, manual-primary lightweight Carrera), GT3 RS (MY2022, 525 hp active aero, PDK only), Sport Classic (MY2023, 7MT only, ducktail, 1,250 units), Dakar (MY2023, lift-kit off-road Porsche, ~2,500 units), and S/T (MY2024, 60th-anniversary model, 525 hp, 6MT only).',
    ],
  },

  // Source: porsche_2020s_reference.md §"992.2 (MY2025–present)"
  '992.2': {
    intro: 'Updated 992, introducing the T-Hybrid powertrain (GTS and above) and a fully digital 12.65-inch curved instrument cluster across all variants. The GTS T-Hybrid produces 541 hp combined.',
    production_years: '2024–present',
    engine: '3.6L 9A3 T-Hybrid (GTS) / 3.0L 9A2 Evo twin-turbo (Carrera)',
    cooling: 'Water-cooled',
    notes: [
      'The 992.2 was revealed in May 2024 and entered production in June 2024. The launch trims are the Carrera and the Carrera GTS T-Hybrid — the first hybrid-powertrain 911 produced at scale. The GTS T-Hybrid uses an all-new 3.6-litre 9A3 flat-six paired with an electric exhaust-gas turbocharger (eTurbo) and an electric motor in the eight-speed PDK housing, drawing from a 1.9 kWh battery mounted under the front hood. Combined output is 541 hp.',
      'The 992.2 introduces a fully digital 12.65-inch curved instrument cluster across all trims (replacing the 992.1\'s analogue centre tachometer), push-button start, revised infotainment, and a revised front fascia consolidating all lighting into the headlamps. The rear gains a thicker full-width light bar with integrated Porsche script. The 992.2 GT3 (MY2025) carries over the 4.0L NA flat-six with revised aerodynamics; the Turbo S T-Hybrid (MY2025, 711 PS) is the most powerful production 911 ever produced.',
    ],
  },

  // ── Boxster / Cayman ────────────────────────────────────────────────────────

  // Source: porsche_1990s_reference.md §"Boxster 986"
  //         porsche_2000s_reference.md §"Boxster 986 (Type 986) — 2000–2004 portion"
  '986': {
    intro: 'The Boxster that saved Porsche, sharing its front-end sheet metal and interior architecture with the 996. The M96 IMS bearing concern applies to all 986 variants.',
    production_years: '1997–2005',
    body_styles: 'Roadster',
    engine: '2.7–3.2L M96 water-cooled flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 986 Boxster launched late 1996 for MY1997 and, together with the 996 911, is credited with saving Porsche from financial collapse in the mid-1990s. The 986 shares its front-end sheet metal and interior architecture with the 996. All 986 engines are M96 family: a 2.7L flat-six in the base Boxster and a 3.2L in the Boxster S. The same IMS bearing concern that affects the 996 Carrera applies to all 986 variants; bore scoring is a documented secondary M96 failure mode.',
      'The 986 received a mid-cycle facelift for MY2003 — revised front fascia, glass rear window replacing the earlier plastic unit, and revised interior trim. The production run ended for MY2005 when the 987.1 launched. The Boxster S is valued significantly above the base; the M96 concern suppresses all 986 values relative to the 987.2 generation, which introduced the 9A1 DFI engine free of the IMS bearing.',
    ],
  },

  // Source: porsche_2000s_reference.md §"Boxster 987.1 (Type 987) — 2005–2008"
  //         (Boxster body variant)
  '987.1-boxster': {
    intro: 'Second-generation Boxster on the 987 platform — sharper interior, stiffer chassis, and more powerful M96/M97 engines (2.7L base, 3.2–3.4L S). The M96/M97 IMS bearing concern applies to all 987.1 Boxster engines; the 987.2 (MY2009) eliminated it with the 9A1 DFI.',
    production_years: '2005–2008',
    body_styles: 'Roadster',
    engine: '2.7–3.4L M96/M97 water-cooled flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 987.1 Boxster launched for MY2005 as a comprehensive redesign. Engines are M96/M97 family: 2.7L M96 base (through MY2006), then M97 from MY2007; 3.2L M96 S (through MY2006), then 3.4L M97 from MY2007. The IMS bearing concern affects all 987.1 engines. Six-speed manual is standard; five-speed Tiptronic S automatic optional.',
      'The RS 60 Spyder (MY2008, ~1,960 units worldwide) is the collector variant of the 987.1 Boxster — 303 hp, revised aero, Sport Chrono Package Plus standard. The 987.1 → 987.2 transition (MY2009) brought the 9A1 DFI engine and PDK, eliminating the IMS bearing concern — the most important mechanical distinction across the 987 generation.',
    ],
  },

  // Source: porsche_2000s_reference.md §"Cayman 987.1 (Type 987) — MY2006–MY2008"
  //         (Cayman body variant)
  '987.1-cayman': {
    intro: 'The first Cayman — a fixed-roof coupe on the 987 platform, debuting in MY2006 as the Cayman S (3.4L M97) ahead of the base Cayman (2.7L) the following year. The stiffer coupe structure produces a sharper driver\'s car than the Boxster despite shared mechanicals. M96/M97 IMS concern applies to all 987.1 Cayman engines.',
    production_years: '2006–2008',
    body_styles: 'Coupe',
    engine: '2.7–3.4L M96/M97 water-cooled flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 987.1 Cayman launched for MY2006 as the Cayman S only (3.4L M97, 295 hp); the base Cayman (2.7L, 245 hp) followed for MY2007. The coupe body contributes significantly greater torsional rigidity than the Boxster roadster, producing handling precision that drew immediate critical acclaim. Porsche deliberately held the Cayman\'s power output below the 911 S of the same era. IMS bearing concern is identical to the 987.1 Boxster.',
      'Despite sharing most mechanical components with the Boxster, the stiffer Cayman structure produced a sharper driver\'s car than the contemporary Boxster. The Cayman S with the 3.4L M97 is the most desirable 987.1 Cayman variant. The 987.1 → 987.2 transition (MY2009) brought the 9A1 DFI engine and PDK, eliminating the IMS bearing concern.',
    ],
  },

  // Source: porsche_2000s_reference.md §"Boxster 987.2 (Type 987)"
  //         porsche_2010s_reference.md §"Boxster / Cayman (987.2 carryover, 2010–2012)"
  //         (Boxster body variant)
  '987.2-boxster': {
    intro: 'Facelift Boxster bringing the IMS-free 9A1 direct-injection flat-six (2.9L base, 3.4L S) and 7-speed PDK. The Boxster Spyder (MY2011, 3.4L at 320 hp, manually folding canvas top) is the lightweight performance variant.',
    production_years: '2009–2012',
    body_styles: 'Roadster',
    engine: '2.9–3.4L 9A1 DFI water-cooled flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 987.2 Boxster launched MY2009 with new 9A1 direct-injection flat-six engines (2.9L base, 3.4L S) and optional 7-speed PDK alongside a six-speed manual. The 9A1 eliminates the intermediate shaft and the IMS bearing concern that affected all 986 and 987.1 engines — the most important mechanical distinction in the 987 lineage.',
      'The Boxster Spyder (MY2011–MY2012, 3.4L 9A1 at 320 hp, manually folding canvas top) previewed the lightweight performance philosophy later applied to the 981 GT4 and Spyder. Chassis code: 987 (final phase). Wheelbase: 95.1 in (2,415 mm).',
    ],
  },

  // Source: porsche_2000s_reference.md §"Boxster 987.2 (Type 987)"
  //         porsche_2010s_reference.md §"Boxster / Cayman (987.2 carryover, 2010–2012)"
  //         (Cayman body variant)
  '987.2-cayman': {
    intro: 'Facelift Cayman bringing the IMS-free 9A1 direct-injection flat-six (2.9L base, 3.4L S) and 7-speed PDK. The Cayman R (MY2012, 330 hp, lighter specification) is the driver-focused send-off before the 981 generation.',
    production_years: '2009–2012',
    body_styles: 'Coupe',
    engine: '2.9–3.4L 9A1 DFI water-cooled flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 987.2 Cayman launched MY2009 with 9A1 direct-injection engines (2.9L base at 265 hp, 3.4L S at 320 hp) eliminating the IMS bearing concern. 7-speed PDK optional alongside the six-speed manual. The coupe body retains its structural rigidity advantage over the Boxster.',
      'The Cayman R (MY2012, 330 hp, stripped of air conditioning, rear seats, and sound deadening) is the most collectible 987.2 Cayman — a natural-evolution Club Sport concept that previewed the GT4 ethos of the 981 generation. Production: approximately 2,000 units worldwide. Chassis code: 987. Wheelbase: 95.1 in (2,415 mm).',
    ],
  },

  // Source: porsche_2010s_reference.md §"Boxster / Cayman (981, MY2013–MY2016)"
  //         (Boxster body variant)
  '981-boxster': {
    intro: 'Third-generation Boxster on the 981 platform shared with the 991.1, with new 2.7L and 3.4L 9A1-family flat-sixes. The Boxster Spyder (MY2016, 3.8L 991.1 Carrera S engine) is the last naturally aspirated flat-six Boxster until the 718 Spyder 4.0 (MY2020).',
    production_years: '2013–2016',
    body_styles: 'Roadster',
    engine: '2.7–3.8L 9A1 NA flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 981 Boxster launched at the 2012 Geneva Motor Show as a MY2013 model, sharing engineering DNA with the 991.1. Engines are 9A1-family naturally aspirated flat-sixes: 2.7L base, 3.4L S, and 3.4L GTS (MY2015, 330 hp). The 981 Boxster Spyder (MY2016) used a detuned 991.1 Carrera S 3.8L NA flat-six at 375 hp — the last naturally aspirated flat-six Boxster until the MY2020 718 Spyder 4.0 restored the configuration. Wheelbase: 97.4 in (2,475 mm).',
      'The 981 → 718 transition brought turbocharged flat-four engines for MY2017, and the enthusiast backlash to the flat-four was significant enough that used 981 GTS and Spyder prices held strong against new 718 prices for years. A manual Boxster Spyder is the most collectible 981 Boxster.',
    ],
  },

  // Source: porsche_2010s_reference.md §"Boxster / Cayman (981, MY2013–MY2016)"
  //         (Cayman body variant)
  '981-cayman': {
    intro: 'Third-generation Cayman on the 981 platform, with new 2.7L and 3.4L 9A1-family flat-sixes. The Cayman GT4 (MY2016, detuned 991.1 Carrera S 3.8L, 385 hp, manual-only) is widely regarded as among the finest driver\'s cars of the decade.',
    production_years: '2013–2016',
    body_styles: 'Coupe',
    engine: '2.7–3.8L 9A1 NA flat-six',
    cooling: 'Water-cooled',
    notes: [
      'The 981 Cayman launched for MY2013 with 9A1-family naturally aspirated flat-sixes: 2.7L base, 3.4L S, and 3.4L GTS (MY2015, 340 hp). The 981 Cayman GT4 (MY2016) used a detuned 991.1 Carrera S 3.8L NA flat-six at 385 hp with GT-derived suspension — the last naturally aspirated flat-six Cayman until the 718 GT4 4.0 (MY2020) restored the configuration. GT4 production: approximately 5,000 units worldwide; manual only. Wheelbase: 97.4 in (2,475 mm).',
      'The manual Cayman GT4 is consistently regarded as among the finest driver\'s cars of the 2010s. Demand consistently outpaces supply on the secondary market. The 981 → 718 transition brought turbocharged flat-four engines for MY2017; used 981 GT4 prices held strong against new 718 GT4 prices for several years as the market assigned a premium to the naturally aspirated six.',
    ],
  },

  // Source: porsche_2010s_reference.md §"Boxster / Cayman (718, MY2017–MY2019 portion)"
  //         porsche_2020s_reference.md §"718 Boxster + Cayman (982, 2020s portion)"
  //         (Cayman body variant)
  '982-cayman': {
    intro: 'The 718 Cayman — successor to the 981 with turbocharged flat-four base engines. The GT4 and GTS 4.0 (MY2020+) restored the 4.0L naturally aspirated flat-six, resolving the principal enthusiast objection to the generation.',
    production_years: '2017–present',
    engine: '2.0–2.5L flat-four turbo; 4.0L flat-six (GTS 4.0 / GT4)',
    cooling: 'Water-cooled',
    notes: [
      'The 718 Cayman launched MY2017 as a comprehensively refreshed continuation of the 981 platform, with new turbocharged flat-four engines, revised front and rear fascias, redesigned headlights and bumpers, a horizontal trim bar connecting the rear lights, and SportDesign-style mirrors derived from the 991.2 GT3. The chassis is largely carryover from the 981 with revised tuning. Chassis code: 982 (internal); marketed as "718 Cayman." Wheelbase: 97.4 in (2,475 mm).',
      'The 718 base engines are a 2.0L flat-four turbo (300 hp) and 2.5L flat-four turbo (350 hp S, 365 hp GTS). The flat-four firing order produces a notably different exhaust note from the flat-six predecessors — widely cited as the principal point of enthusiast objection to the 718 generation.',
      'The 718 Cayman GTS 4.0 and GT4 (MY2020+) use the 4.0L NA flat-six — directly addressing the enthusiast objection. The GT4 RS (MY2022) uses the 911 GT3-sourced 4.0L at 493 hp, making it the most performance-focused Cayman ever produced. Used 981 GT4 and GTS prices held strong against new flat-four 718 prices through the back half of the decade.',
      'The 718 Cayman GTS introduced MY2018 uses the 2.5L flat-four with revised tuning at 365 hp. This flat-four GTS trim ended MY2020 production when Porsche replaced it with the 4.0L NA flat-six GTS 4.0.',
    ],
  },

  // Source: porsche_2010s_reference.md §"Boxster / Cayman (718, MY2017–MY2019 portion)"
  //         porsche_2020s_reference.md §"718 Boxster + Cayman (982, 2020s portion)"
  //         (Boxster body variant)
  '982-boxster': {
    intro: 'The 718 Boxster — successor to the 981 with turbocharged flat-four base engines. The Spyder and GTS 4.0 (MY2020+) restored the 4.0L naturally aspirated flat-six.',
    production_years: '2017–present',
    body_styles: 'Roadster',
    engine: '2.0–2.5L flat-four turbo; 4.0L flat-six (GTS 4.0 / Spyder)',
    cooling: 'Water-cooled',
    notes: [
      'The 718 Boxster launched MY2017 as a comprehensively refreshed continuation of the 981 platform, with new turbocharged flat-four engines, revised front and rear fascias, redesigned headlights and bumpers, a horizontal trim bar connecting the rear lights, and SportDesign-style mirrors derived from the 991.2 GT3. The chassis is largely carryover from the 981 with revised tuning. Chassis code: 982 (internal); marketed as "718 Boxster." Wheelbase: 97.4 in (2,475 mm).',
      'The 718 base engines are a 2.0L flat-four turbo (300 hp) and 2.5L flat-four turbo (350 hp S, 365 hp GTS). The flat-four firing order produces a notably different exhaust note from the flat-six predecessors — widely cited as the principal point of enthusiast objection to the 718 generation.',
      'The 718 Boxster GTS 4.0 and Spyder 4.0 (MY2020+) use the 4.0L NA flat-six — directly addressing the enthusiast objection. The 981 → 718 transition was widely reported as poorly received in the enthusiast market; used 981 GTS and Boxster Spyder prices held strong against new 718 prices through the back half of the decade.',
      'The 718 Boxster GTS introduced MY2018 uses the 2.5L flat-four with revised tuning at 365 hp. This flat-four GTS trim ended MY2020 production when Porsche replaced it with the 4.0L NA flat-six GTS 4.0.',
    ],
  },
}

export function getDecadeFallback(generationId: string): FallbackData | null {
  const data = FALLBACK[generationId]
  if (!data || (data.notes.length === 0 && !data.intro)) return null
  return data
}
