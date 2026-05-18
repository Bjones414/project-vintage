// Rich structured content for the full /generations/[id] page.
// Distinct from decade-fallback.ts (which serves the lightweight EraCard).
// Add a GenerationContent object here when a generation is ready for a full guide page.

export interface GenerationVariant {
  name: string
  years: string
  drivetrain?: string
  power?: string
  production?: string  // notable production figure
  description: string
}

export interface WatchForItem {
  title: string
  severity: 'concern' | 'caution'
  body: string
  buyer_question: string
}

export interface ValueDriver {
  name: string
  description: string  // generic description ≤280 chars; V2 can add specific_delta_cents later
  applies_to?: {
    trim_categories?: string[]  // trimCategory must be in this list if set
    body_styles?: string[]      // listing.body_style must match (case-insensitive) if set
  }
}

export interface GenerationContent {
  positioning: string       // hero tagline, e.g. "Last air-cooled 911"
  intro: string             // 1–2 sentence summary (also used by EraCard)
  production_years: string
  body_styles: string
  engine: string
  cooling: string
  units_produced?: string
  notes: string[]           // "Why This Generation Matters" paragraphs
  variants: GenerationVariant[]
  engineering: string[]
  watch_for: WatchForItem[]
  service: string[]
  value_drivers?: ValueDriver[]
}

const CONTENT: Record<string, GenerationContent> = {
  // ──────────────────────────────────────────────────────────────────────────
  // 993 (1994–1998)
  // Source: docs/reference/porsche_1990s_reference.md §"911 / 993"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  '993': {
    positioning: 'Last air-cooled 911',
    intro: 'The last air-cooled 911, featuring multi-link rear suspension and a six-speed manual gearbox — the first on a base 911. Commands a sustained collector premium as the final expression of the air-cooled lineage.',
    production_years: '1994–1998',
    body_styles: 'Coupe, Cabriolet, Targa',
    engine: '3.6L M64 air-cooled flat-six (272–285 hp NA; 408–450 hp twin-turbo)',
    cooling: 'Air-cooled',
    units_produced: '~68,000 worldwide',
    notes: [
      'The 993 is the last air-cooled 911. Production ran from January 1994 through 31 March 1998, with US-market cars sold as MY1995–MY1998. The generation introduced multi-link rear suspension — an alloy subframe design derived from the abandoned 989 sedan project — alongside a six-speed manual gearbox (first 911 with a six-speed base) and a 3.6-litre M64 producing 272 hp pre-Varioram or 285 hp with the MY1996 Varioram variable-intake upgrade. The Carrera 4S and Carrera S brought the Turbo widebody to naturally aspirated cars, establishing the design language every subsequent 4S generation would use.',
      'The Turbo arrived for MY1996 with a twin-turbocharged 3.6L M64 developing 408 hp and all-wheel drive — the first AWD 911 Turbo. The Turbo S (MY1997) raised output to 450 hp (424 hp US) with the K24 turbocharger pair, Aerokit II body, yellow brake calipers, quad-pipe exhaust, and 345 units produced worldwide (181 US). The GT2 was the RWD homologation Turbo for circuit competition — approximately 194 road cars total, with the 21 1998 GT2 Evo the most collectible variant.',
      'The 993 commands a collector premium as the last air-cooled 911 — a status that has held through multiple market cycles since production ended. The transition to the water-cooled 996 was driven by European noise regulations and the Boxster platform-sharing strategy. Air-cooled valuations have appreciated continuously since, with the 993 Turbo S and GT2 now among the most liquid blue-chip collector Porsches in the market.',
    ],
    variants: [
      {
        name: 'Carrera (pre-Varioram)',
        years: 'MY1995',
        drivetrain: 'RWD',
        power: '272 hp',
        production: '14,541 coupes + 7,730 cabriolets (272 PS group worldwide)',
        description: 'Single model year only — identified by the absence of Varioram tubes in the intake manifold. Sells at a modest discount to Varioram for the same body style. 4-speed Tiptronic available alongside the standard 6MT.',
      },
      {
        name: 'Carrera (Varioram)',
        years: 'MY1996–1998',
        drivetrain: 'RWD',
        power: '285 hp',
        production: '8,586 coupes + 7,769 cabriolets (285 PS group worldwide)',
        description: 'Most common 993 specification. The MY1996 Varioram update added variable-length intake runners, lifting output to 285 hp and broadening the torque curve. Available as Coupe, Cabriolet, and Targa (MY1996+). Tiptronic S with steering-wheel buttons added at this revision.',
      },
      {
        name: 'Carrera 4',
        years: 'MY1995–1998',
        drivetrain: 'AWD',
        power: '272–285 hp',
        production: '7,166 worldwide (2,884 coupe + 1,284 cab pre-Varioram; 1,860 coupe + 1,138 cab Varioram)',
        description: 'Narrow-body AWD Carrera with a viscous-coupling AWD system — simpler and more reliable than the 964\'s electronically-controlled setup. No Tiptronic option; 6MT only. Lower US uptake than RWD Carrera.',
      },
      {
        name: 'Carrera 4S',
        years: 'MY1996–1998',
        drivetrain: 'AWD',
        power: '285 hp',
        production: '6,948 worldwide; ~2,079 US',
        description: 'Turbo widebody on the C4 AWD drivetrain with the NA engine — the first Turbo-bodied naturally-aspirated 911. The 4S established the widebody NA design language that continued through every subsequent Carrera 4S generation. Coupe only.',
      },
      {
        name: 'Carrera S',
        years: 'MY1997–1998',
        drivetrain: 'RWD',
        power: '285 hp',
        production: '3,714 worldwide; 1,752 US',
        description: 'Same widebody and brakes as the 4S, but RWD — marketed primarily in North America. Carries a Tiptronic option. Purists prize the S for the widebody aesthetic with manual-friendly RWD dynamics.',
      },
      {
        name: 'Targa',
        years: 'MY1996–1998',
        drivetrain: 'RWD',
        power: '285 hp',
        production: '4,583 worldwide (2,442 in MY1996; 1,843 in MY1997; ~298 in MY1998)',
        description: 'Panoramic glass roof that retracts electrically beneath the rear window — a fundamentally different Targa concept than the 911 Targa\'s traditional roll-bar design. Architecture continued directly into the 996 and 997 Targa.',
      },
      {
        name: 'Turbo',
        years: 'MY1996–1998',
        drivetrain: 'AWD',
        power: '408 hp',
        production: '5,978 worldwide, 2,662 US',
        description: 'Twin K16 turbochargers, G64 6-speed manual, and AWD — the first AWD 911 Turbo. Aerokit I body with the fixed rear wing. The standard Turbo is the entry point to 993 Turbo ownership; it is not a diluted car.',
      },
      {
        name: 'Turbo S',
        years: 'MY1997',
        drivetrain: 'AWD',
        power: '450 hp (424 hp US)',
        production: '345 worldwide, 181 US',
        description: 'Largest K24 turbos, modified Motronic E50, Aerokit II body (front brake-cooling ducts on European cars), yellow Brembo calipers, quad-pipe exhaust, carbon-fibre interior trim, and "Turbo S" badging. Commands roughly 2–3× a standard Turbo premium at current market. The 181 and 345 production figures are the correct ones — 277 (sometimes cited) is the UK Turbo total, not the Turbo S count.',
      },
      {
        name: 'GT2',
        years: 'MY1995–1998',
        drivetrain: 'RWD',
        power: '424–444 hp',
        production: '~194 road cars worldwide',
        description: 'RWD homologation Turbo for GT2-class circuit competition (AWD banned in class). Badged "911 GT" until MY1997. Plastic bolt-on fenders over the Turbo chassis — visually widebody but not steel. The 21 MY1998 GT2 Evo (dual ignition, 444 hp) are the rarest and most collectible road 993s. Production figures are disputed: Wikipedia cites 57, marque sources cite 194. Neither was US-legal as new.',
      },
      {
        name: 'Carrera RS',
        years: 'MY1995–1996',
        drivetrain: 'RWD',
        power: '300 hp (DIN)',
        production: '~1,014 worldwide',
        description: 'Track-oriented RS with a 3.8L M64/20 engine, seam-welded shell, lightweight glass, and aluminium bonnet. Europe-only; not US-legal as new. The Clubsport (M003) variant added a roll cage, larger fixed wing, and deleted carpets, A/C, and sound deadening.',
      },
    ],
    engineering: [
      'Multi-link rear suspension: The 993 replaced the 911\'s trailing-arm rear suspension with an alloy multi-link subframe derived from the abandoned 989 sedan project. The change dramatically improved on-throttle and lift-off behaviour — the 993 was the first 911 that genuinely rewarded drivers who applied throttle mid-corner rather than punishing them for it. The rear axle geometry change is the single most significant 993 handling departure from every prior 911.',
      'Six-speed G50 manual: First 911 to offer a six-speed manual as standard equipment on a base Carrera. The close ratios improved on-track performance and lowered highway cruising RPM. The Turbo uses the G64 — a strengthened derivative of the G50 — to handle the additional torque output.',
      'VarioRam variable-intake manifold (MY1996): Variable-length intake runners that extend or retract depending on engine speed, lifting output from 272 hp to 285 hp and broadening the torque curve across the RPM range. Identifiable by the additional plastic manifold runners visible with the engine lid open. The VarioRam update is the most consequential mid-cycle change — buy Varioram if you have a choice.',
      'M64 hydraulic valve adjusters: The M64 flat-six uses hydraulic valve lifters, eliminating the manual valve clearance adjustments required on every air-cooled 911 before it. This simplified routine service intervals materially and reduced the consequence of extended service intervals on engine longevity.',
      'AWD Turbo: First AWD 911 Turbo. The Carrera 4\'s viscous-coupling AWD system was redesigned from the 964\'s electronically-controlled AWD — simpler, lighter, and more durable. The Turbo\'s AWD system uses a viscous centre differential with a different torque-split calibration to manage the twin-turbo torque delivery.',
    ],
    watch_for: [
      {
        title: 'Engine wiring harness insulation failure',
        severity: 'concern',
        body: 'The 993 engine wiring harness is secured at the No. 2 cylinder intake stack, placing it in sustained contact with a hot cylinder head bolt. Insulation becomes brittle and cracks, eventually causing shorts that produce rough running, stalling, dead battery from parasitic draw, and CEL illumination — often intermittent before full failure. Porsche issued TSB W301 (January 2003) requiring inspection and replacement on affected MY1995–1996 cars. Replacement harness cost is approximately $1,400–$2,400 all-in. Most affected cars have had the repair, but verification at purchase is essential.',
        buyer_question: 'Has the engine wiring harness been inspected or replaced under Porsche TSB W301? If replaced, what is the replacement harness part number (should be 993.607.016.15 for Varioram cars), and is there a service invoice?',
      },
      {
        title: 'Dilavar head stud breakage',
        severity: 'concern',
        body: 'From 1978 onward, air-cooled 911 head studs break from corrosion at the head-nut interface rather than pulling out of the case (the magnesium-case failure mode). The 964 and 993 use revised Dilavar studs with a lower observed breakage rate than the 911 SC, but the failure mode still occurs on high-mileage and poorly-stored examples. A broken stud produces an audible exhaust-like leak under load; multiple broken studs on one cylinder require immediate repair. Documented replacement with 993-generation Dilavar, Raceware, or ARP studs is the positive signal.',
        buyer_question: 'Have the head studs been replaced? With which type — 993-generation Dilavar, Raceware, or ARP — and at what mileage? Have the lower valve covers ever been removed for inspection?',
      },
      {
        title: 'Dual-mass flywheel wear (NA cars)',
        severity: 'caution',
        body: 'Naturally aspirated 993 Carreras (not Turbo or GT2) use a Luk dual-mass flywheel whose internal springs and dampers wear with age and use, producing a knocking or rattling noise at idle that can be mistaken for engine bearing failure. Replacement is most economically performed alongside clutch service. Single-mass flywheel conversion is a common owner choice during clutch replacement. A rattle at idle in an NA 993 is a DMF finding until proven otherwise.',
        buyer_question: 'Has the dual-mass flywheel been replaced or converted to single-mass? At what mileage and during which service? Does the car make any rattle or knocking at idle when warm?',
      },
      {
        title: 'Oil return tube seals',
        severity: 'caution',
        body: 'Oil returns from the cam towers to the crankcase through tubes sealed with rubber O-rings. On 30-year-old cars, the original seals are hardened and leaking — near-universal at age. The leak produces oil on heat exchangers, occasional blue smoke from the engine bay, and sometimes a cabin oil smell when the heater runs. The fix is straightforward: collapsible replacement tubes with Viton seals, typically addressable without engine removal.',
        buyer_question: 'Have the oil return tube seals been replaced with Viton seals? Is there any current oil drip from the cam tower or heat exchanger area, or an oil smell with the heater on?',
      },
      {
        title: 'Dashboard cracking',
        severity: 'caution',
        body: 'Dashboard cracking is a near-universal cosmetic condition on 30-year-old air-cooled 911s — not a mechanical defect, but a market-value factor and a restoration cost. Later-production 993s (MY1997–1998) stored in temperate climates show less severe cracking; sun-exposed cars or those stored in hot climates are most affected. Dashboard restoration or replacement is an expensive item at US specialist rates.',
        buyer_question: 'What is the condition of the dashboard — cracked, repaired, or uncracked? Has any dashboard restoration or covering work been performed?',
      },
    ],
    service: [
      'Major service intervals for the M64 are 15,000 miles or annually, whichever comes first. The hydraulic valve lifters require no manual adjustment — a meaningful simplification versus every prior air-cooled 911. Oil changes should use 15W-50 or an air-cooled-specific formulation; many specialists recommend shortening the OEM 15,000-mile oil interval to 7,500–10,000 miles on a 30-year-old engine.',
      'Pre-purchase inspection priorities, in order: (1) Full oil leak survey — survey the heat exchanger area, cam towers, and crankshaft seal. (2) Compression and leak-down test on all six cylinders. (3) Engine wiring harness inspection — on MY1995 and MY1996 cars specifically, verify TSB W301 has been performed; ask for the replacement harness part number. (4) VarioRam operation check (MY1996+) — with engine warm, verify all intake runners cycle through their range at the appropriate RPM threshold. (5) Clutch engagement and DMF noise check on NA cars.',
      'Clutch and dual-mass flywheel on NA Carreras are most economically addressed together — bundling avoids a second engine-out service when the DMF inevitably wears. A 993 with documented clutch work but no DMF documentation is a candidate for near-term DMF service. Turbo and GT2 cars use different flywheel architecture; the DMF concern is NA-specific.',
    ],
    value_drivers: [
      {
        name: 'Mileage',
        description: 'Below-50K-mile examples consistently command premiums. Documented low-mileage, unmolested Varioram Carreras are the reference benchmark for the generation.',
      },
      {
        name: 'Transmission',
        description: 'Six-speed manual is essential for full value. The 4-speed Tiptronic (MY1995) and Tiptronic S examples trade at a meaningful discount in the collector market.',
      },
      {
        name: 'Wiring harness service',
        description: 'MY1995–1996 cars require TSB W301 harness replacement. Documented completion is a positive signal; an original unrepaired harness is a depreciation risk and near-term expense.',
      },
      {
        name: 'Originality',
        description: 'Unmodified original paint and matching-numbers configuration increases value substantially. Factory Porsche Certificate of Authenticity confirms original specification.',
      },
      {
        name: 'Color rarity',
        description: 'Rare period colors and paint-to-sample options carry premiums. Standard Guards Red and Midnight Blue hold well; Seal Grey and Silver Metallic are considered neutral-to-discount.',
      },
      {
        name: 'Sunroof delete',
        description: 'Sunroof delete is an uncommon factory option, particularly desirable on 993 Carrera 2 Coupes. Factory documentation or a Porsche COA confirms the configuration.',
        applies_to: {
          trim_categories: ['carrera_2_narrow'],
          body_styles: ['Coupe'],
        },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 996.1 (1999–2001)
  // Source: docs/reference/porsche_1990s_reference.md §"911 / 996"
  //         docs/reference/porsche_2000s_reference.md §"996"
  //         docs/reference/defects/01_engine_m96_m97.md
  //         docs/reference/defects/99_shared_water_cooled_era.md
  // ──────────────────────────────────────────────────────────────────────────
  '996.1': {
    positioning: 'First water-cooled 911',
    intro: 'The 996 broke with 35 years of air-cooled tradition — a complete chassis redesign, water-cooled flat-six, and shared platform with the Boxster. Controversial at launch, the 996.1 is now the entry point to modern 911 ownership, with a compressed valuation that rewards buyers who understand its engineering.',
    production_years: '1999–2001',
    body_styles: 'Coupe, Cabriolet',
    engine: '3.4L M96 water-cooled flat-six (300 hp); 3.6L Mezger (GT3: 360 hp; Turbo: 415 hp)',
    cooling: 'Water-cooled',
    units_produced: '~37,750 Carrera Coupes worldwide (all 996 combined)',
    notes: [
      'The 996 was the most consequential 911 in the marque\'s history — and the most controversial. Porsche\'s survival as an independent company in the mid-1990s required a complete redesign: a new water-cooled engine, a new platform shared with the Boxster 986, and front bodywork (doors, hood, headlamps, windscreen) shared across both cars. The "fried-egg" composite headlamps were the visible symbol of platform-sharing economics, and they drove early 996 valuations significantly below equivalent 993s — a discount that persists today and continues to attract buyers who understand the platform for what it is.',
      'Two distinct engine families coexist in the 996.1 lineup. Base Carrera and Carrera 4 models use the M96 flat-six — an all-new water-cooled design with an integrated wet sump that eliminated the external dry-sump oil tank of every air-cooled 911. The GT3 and Turbo use the Mezger-derived engine, an architecture descended directly from the 911 GT1 Le Mans race car with a separate dry-sump system, no intermediate shaft bearing, and none of the M96\'s documented failure modes. The split matters fundamentally: buying a 996.1 GT3 or Turbo is categorically different from buying a 996.1 Carrera.',
      'The GT3 Mk1 (1999–2001) produced 360 hp from the naturally aspirated Mezger 3.6L and was never federalized for North America — 1,868 units produced worldwide with zero US-legal examples as new cars. The 996.1 Turbo debuted for MY2001 with 415 hp and AWD, arriving with Turbo-specific headlamps that previewed the forthcoming 996.2 facelift. The base Carrera\'s market position has compressed significantly since its launch-era discount: the M96 engine concerns are now well-documented, the IMS and bore-scoring remediation is established, and properly maintained examples offer genuine 911 character at entry pricing.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: 'MY1999–2001',
        drivetrain: 'RWD',
        power: '300 hp',
        production: '55,562 worldwide (31,688 Coupe; 23,874 Cab)',
        description: 'Narrow-body RWD coupe on the new water-cooled 3.4L M96. MY2000 revised output from 296 hp to 300 hp. Most common 996.1 specification; the IMS bearing and bore-scoring considerations apply directly. 5-speed Tiptronic S optional alongside the standard 6-speed manual.',
      },
      {
        name: 'Carrera Cabriolet',
        years: 'MY1999–2001',
        drivetrain: 'RWD',
        power: '300 hp',
        production: '23,874 worldwide',
        description: 'Soft-top convertible on the narrow-body Carrera platform. Shares all M96 drivetrain components and associated service considerations. Power soft top with heated glass rear window.',
      },
      {
        name: 'Carrera 4',
        years: 'MY1999–2001',
        drivetrain: 'AWD',
        power: '300 hp',
        production: '22,284 worldwide (12,720 Coupe; 9,564 Cab)',
        description: 'Narrow-body AWD Carrera — the final generation of the narrow-body C4. From MY2002 onward, the Carrera 4 moved to the wide-body C4S body. 6-speed manual only; no Tiptronic option on C4.',
      },
      {
        name: 'Carrera 4 Cabriolet',
        years: 'MY1999–2001',
        drivetrain: 'AWD',
        power: '300 hp',
        production: '9,564 worldwide',
        description: 'AWD soft-top companion to the narrow-body C4 Coupe. Continues as the narrow-body C4 Cabriolet into the 996.2 facelift, where the Coupe does not.',
      },
      {
        name: 'Millennium Edition',
        years: 'MY2000',
        drivetrain: 'AWD',
        power: '300 hp',
        production: 'Exactly 911 worldwide',
        description: 'Based on the Carrera 4 Coupe with Violet Chromaflair paint — a color-shift metallic that appears deep purple or dark blue depending on angle and light. Exactly 911 units produced worldwide. One of the more coherent 996 limited editions; the production number and color-shift paint remain collectible.',
      },
      {
        name: 'GT3 Mk1',
        years: 'MY1999–2001',
        drivetrain: 'RWD',
        power: '360 hp',
        production: '1,868 worldwide; 0 US',
        description: 'Mezger 3.6L naturally aspirated engine derived directly from the 911 GT1 Le Mans race program. Never federalized for North America; no US-market GT3 Mk1 exists as a new-car sale. M003 Clubsport package (roll cage, harnesses, Recaro racing seats) available on roughly one-third of Mk1 production. The Mk1 is the rarer of the two 996 GT3 generations.',
      },
      {
        name: 'Turbo',
        years: 'MY2001',
        drivetrain: 'AWD',
        power: '415 hp',
        production: '~5,340 worldwide',
        description: 'First water-cooled 911 Turbo. Twin-turbocharged Mezger 3.6L with AWD. Arrived with Turbo-specific headlamps that previewed the 996.2 facelift — a 996.1 Turbo looks more like a facelifted car than its contemporary 996.1 Carrera. No M96 reliability concerns; Mezger architecture throughout.',
      },
    ],
    engineering: [
      'First water-cooled 911: The 996 is the first 911 with a water-cooled engine, ending 35 years of air-cooled tradition. The new M96 flat-six eliminated the external dry-sump oil tank, moved cooling to a water jacket around the cylinder heads, and allowed the engine to pass European noise regulations the M64 could not. The architecture is shared with the Boxster 986 — though the 911 version is longitudinally mounted where the Boxster\'s is mid-mounted.',
      'Boxster platform sharing: The 996 and Boxster 986 share front bodywork, doors, headlamps, windscreen, and platform architecture. The cost-sharing arrangement saved Porsche from a genuine financial crisis that was threatening the company\'s independence in the early 1990s. The shared "fried-egg" headlamps became the most visible marker of the generation and the primary driver of its initial market discount versus the 993.',
      'Two engine families coexist: The M96 (base Carrera/C4) and the Mezger (GT3 Mk1, Turbo) are architecturally distinct. The M96 uses an intermediate shaft (IMS) to drive the cam timing — a design that creates the IMS bearing failure mode documented extensively in the community. The Mezger uses a separate external dry-sump, no intermediate shaft, and is derived from the GT1 race program. Buying a 996.1 Turbo or GT3 Mk1 is not buying an M96 engine.',
      'Five-chain M96 (3.4L): The 996.1 M96 uses a five-chain cam drive system — engines identified by codes M96/01, M96/02, M96/04. The five-chain design adds a Variocam tensioner with plastic timing-chain pads that shed debris into the oil on high-mileage examples. Porsche issued a revised pad part number (996 105 253 00). The 996.2 moved to a three-chain 3.6L M96 that eliminates this issue; the pad wear concern is specific to 996.1 Carrera engines.',
      'GT3 Mk1 Mezger: The 996 GT3 Mk1 engine (code M96/76) produces 360 hp from a 3.6L naturally aspirated Mezger — derived directly from the 911 GT1 Le Mans car. Never submitted for US federal certification; no examples were sold new in North America. The GT3 Mk2 (996.2, MY2003) was the first GT3 ever sold legally in the United States.',
    ],
    watch_for: [
      {
        title: 'IMS bearing failure (M96 3.4L Carrera engines) — specification varies by year',
        severity: 'concern',
        body: 'The 996.1 M96 3.4L IMS bearing specification changed mid-production. MY1999 cars (and some early MY2000 builds) carry the earlier dual-row bearing — estimated failure rate approximately 1%, similar in risk to the larger bearing used later. MY2000–2001 production predominantly uses the single-row sealed bearing, which carries an estimated 8% lifetime failure rate per class action discovery data and is the highest-risk IMS variant. A 1999 996.1 buyer is materially lower risk than a 2001 buyer. Confirm the specific bearing variant before purchase. Failure of either bearing is catastrophic: collapse destroys the engine without warning. The LN Engineering IMS Retrofit and IMS Solution are the established preventive fixes, best performed during clutch service. This concern applies only to M96-engined cars — GT3 Mk1 and Turbo use the Mezger, which has no intermediate shaft.',
        buyer_question: 'Has the IMS bearing been upgraded to an LN Engineering IMS Retrofit or IMS Solution? At what mileage and during what service? Is there an invoice showing the part number and installer?',
      },
      {
        title: 'Cylinder bore scoring (M96 3.4L)',
        severity: 'concern',
        body: 'The M96 3.4L\'s Lokasil cylinder linings are susceptible to bore scoring — abrasive wear that creates scoring marks on cylinder walls, most commonly cylinder 6. Causes include oil starvation at the cylinder head, insufficient oil film thickness on the Lokasil composite surface, and thermal cycling. Prevalence estimates range from 5% to 10% of the M96 population. A borescope inspection of all six cylinders is essential before purchase. A scored engine requires full teardown and cylinder sleeving at significant cost; there is no patch.',
        buyer_question: 'Has a borescope inspection of all six cylinders been performed within the last 10,000 miles? Are there any records of oil consumption above 1 quart per 1,000 miles? Has the engine ever been apart for any reason?',
      },
      {
        title: 'Variocam tensioner pad wear (5-chain M96, 996.1 specific)',
        severity: 'caution',
        body: 'The 996.1 M96 uses a five-chain cam drive with plastic Variocam tensioner pads (engine codes M96/01, M96/02, M96/04) that degrade on high-mileage examples, shedding debris into the oil system. Porsche issued a revised pad (P/N 996 105 253 00). The failure mode produces metallic contamination detectable via oil analysis. This issue is specific to the five-chain 3.4L 996.1 engine and does NOT apply to the 996.2\'s three-chain 3.6L M96.',
        buyer_question: 'Have the Variocam tensioner pads been replaced with the revised Porsche part (P/N 996 105 253 00)? Is there a recent oil analysis showing metal particle counts within normal range?',
      },
      {
        title: 'Air-oil separator diaphragm failure',
        severity: 'caution',
        body: 'The M96\'s air-oil separator uses a rubber diaphragm that fatigues with heat and age, allowing oil vapour into the intake manifold. Symptoms include blue smoke at startup or under load, oil residue in the throttle body, and elevated oil consumption. In severe cases, accumulated oil in the intake can cause hydrolock. A failed AOS is an early indicator that the engine needs attention. Repair cost ranges from $800 to $1,500 in labour and parts.',
        buyer_question: 'When was the air-oil separator last inspected or replaced? Is there any blue smoke at cold start or during hard acceleration? What is the current oil consumption rate between changes?',
      },
      {
        title: 'Coolant expansion tank cracking',
        severity: 'caution',
        body: 'The plastic coolant expansion tank yellows and becomes brittle with age — visible yellowing is a warning sign of impending failure. A cracked or failed tank can result in coolant loss and engine overheating. Tank replacement is low-cost; the downstream repair if overheating causes a cracked head is not. Inspection at every service is standard practice on 996-era cars.',
        buyer_question: 'When was the coolant expansion tank last replaced? Is the current tank clear or has it yellowed noticeably? Has the cooling system been pressure-tested recently?',
      },
    ],
    service: [
      'Major service intervals for the M96 are 15,000 miles or annually. Oil changes should use a 5W-40 or 0W-40 full-synthetic formulation. Many specialists recommend shortening the factory 15,000-mile interval to 7,500 miles on high-mileage examples to reduce bore-scoring risk — oil film thickness on the Lokasil cylinder walls degrades as the oil ages and the additive package depletes.',
      'Pre-purchase inspection priorities for a 996.1 Carrera: (1) Borescope all six cylinders — cylinder 6 shows early bore-scoring most frequently. (2) IMS bearing service record — verify retrofit part number and service date. (3) Variocam tensioner pad status — request an oil analysis showing metal particle counts. (4) AOS inspection — check for blue smoke, oil in throttle body, and elevated oil consumption. (5) Coolant expansion tank visual — yellowing means imminent replacement. (6) Water pump impeller — composite impellers fail; confirm replacement with metal impeller.',
      'IMS bearing and clutch replacement are most economically bundled because both require engine removal. A 996.1 with documented clutch replacement but no IMS documentation is a candidate for immediate IMS bearing inspection. Verify installer (Porsche dealer or specialist with documented M96 experience), part number, and mileage at service. The LN Engineering IMS Solution is generally considered the definitive fix — confirm specifically which product was installed.',
    ],
    value_drivers: [
      {
        name: 'IMS bearing service',
        description: 'Documented IMS bearing replacement (LN Engineering IMS Solution or equivalent) is the single most important service record. Documented replacement substantially increases value and buyer confidence.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Engine family',
        description: 'Base Carrera uses the M96 engine with known IMS and bore-scoring concerns. GT3 and Turbo use the Mezger dry-sump engine — no IMS bearing, a fundamentally higher valuation tier.',
      },
      {
        name: 'Bore-scope results',
        description: 'A clean bore-scope report across all six cylinders is the most objective pre-purchase data point. Cylinder 6 is most prone to early scoring on the M96; a clean report is a strong positive signal.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Service history',
        description: 'Complete documented records — IMS status, oil change frequency, water pump replacement (metal impeller), and AOS inspection — are critical for confident valuation.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Color',
        description: 'Silver Metallic and Polar Silver depress value relative to period colors such as Speed Yellow, Ocean Blue Metallic, and Arena Red. Color is a meaningful second-order value driver.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 996.2 (2002–2005)
  // Source: docs/reference/porsche_2000s_reference.md §"996 facelift"
  //         docs/reference/defects/01_engine_m96_m97.md
  //         docs/reference/defects/99_shared_water_cooled_era.md
  // Variant production figures: Supercar Nostalgia per-variant 996.2 breakdown,
  //   cross-checked against jtcars.net aggregates. Figures include all transmissions
  //   (6MT + Tiptronic); manual-vs-automatic splits not published by Porsche.
  // ──────────────────────────────────────────────────────────────────────────
  '996.2': {
    positioning: 'Facelifted 996 — 3.6L M96',
    intro: 'The 996.2 facelift introduced Turbo-derived headlamps, a 3.6L M96 producing 320 hp, and the first US-legal 911 GT3. The generation carries the same IMS and bore-scoring considerations as the 996.1 — with the critical exception that the five-chain Variocam pad wear issue is specific to the earlier 3.4L engine.',
    production_years: '2002–2005',
    body_styles: 'Coupe, Cabriolet, Targa',
    engine: '3.6L M96 water-cooled flat-six (320–345 hp NA); 3.6L Mezger twin-turbo (415–483 hp Turbo/GT2); 3.6L Mezger NA (GT3: 381 hp)',
    cooling: 'Water-cooled',
    units_produced: '~29,380 Carrera Coupes worldwide; ~17,290 Carrera 4S Coupes worldwide',
    notes: [
      'The 996.2 facelift is distinguished externally by Turbo-derived headlamps that replaced the controversial "fried-egg" composite units of the 996.1, a redesigned front fascia, and the addition of a glove box — correcting an omission that had puzzled early buyers. The 3.4L M96 was replaced by a 3.6L unit producing 320 hp, a 20 hp gain that also brought a revised lubrication system to the cylinder head area. The X51 Power Kit (factory option) raised output to 345 hp via revised heads, camshafts, intake, and exhaust manifolds.',
      'The 996.2 hosts the most diverse halo variant lineup of any 996 generation. The GT3 Mk2 (MY2003–2005) produced 381 hp from a naturally aspirated Mezger 3.6L and was the first 911 GT3 ever sold legally in the United States. The GT2 evolved from 462 hp (Mk1, 2001–2003) to 483 hp (Mk2, 2004–2005), making the combined 996 GT2 production of approximately 1,287 units one of the rarest non-limited-edition 996 variants in the market. The Turbo Cabriolet (MY2003) was the first mass-production 911 Turbo Cabriolet since the 930 ended in 1989.',
      'The 40 Jahre 911 (40th Anniversary Edition, MY2004) produced exactly 1,963 units worldwide — a number deliberate in its reference to the 911\'s 1963 debut. Built on the narrow-body Carrera platform with the X51 Power Kit (345 hp), a limited-slip differential, the M030 sport suspension, and the Turbo front bumper, the 40th Anniversary is the most desirable narrow-body 996.2 Carrera variant. Approximately 800 went to North America.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: 'MY2002–2005',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '14,629 worldwide (all transmissions)',
        description: 'Narrow-body RWD with the revised 3.6L M96. X51 Power Kit option raises output to 345 hp. The 3.6L engine brings a revised cylinder head lubrication system compared to the 996.1 3.4L. IMS and bore-scoring considerations remain; Variocam pad wear is NOT present on the three-chain 3.6L.',
      },
      {
        name: 'Carrera Cabriolet',
        years: 'MY2002–2005',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '14,961 worldwide (all transmissions)',
        description: 'Soft-top convertible on the narrow-body Carrera platform. Available with X51 Power Kit.',
      },
      {
        name: 'Carrera 4',
        years: 'MY2002–2003',
        drivetrain: 'AWD',
        power: '320 hp',
        production: '3,231 worldwide (all transmissions)',
        description: 'Narrow-body AWD Carrera, produced briefly into the 996.2 facelift before the wide-body Carrera 4S became the sole AWD Carrera Coupe option from MY2004.',
      },
      {
        name: 'Carrera 4 Cabriolet',
        years: 'MY2002–2004',
        drivetrain: 'AWD',
        power: '320 hp',
        production: '7,155 worldwide (all transmissions)',
        description: 'Narrow-body AWD soft-top. Continued into the 996.2 facelift alongside the wide-body Carrera 4S Cabriolet from MY2003; remained available through MY2004.',
      },
      {
        name: 'Targa',
        years: 'MY2002–2005',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '5,089 worldwide (all transmissions)',
        description: 'All 996 Targas are 996.2 — no 996.1 Targa was produced. Uses the sliding glass panoramic roof architecture from the 993 Targa, not the traditional roll-bar design. RWD only.',
      },
      {
        name: 'Carrera 4S',
        years: 'MY2002–2005',
        drivetrain: 'AWD',
        power: '320 hp',
        production: '17,283 Coupes; 5,757 Cabriolets worldwide (all transmissions)',
        description: 'Turbo-wide body on the AWD drivetrain with the NA 3.6L engine. The wide-body 996.2 is visually the most resolved of the 996 variants. Coupe and Cabriolet available from MY2003.',
      },
      {
        name: '40 Jahre 911',
        years: 'MY2004',
        drivetrain: 'RWD',
        power: '345 hp',
        production: 'Exactly 1,963 worldwide; ~800 North America',
        description: 'Narrow-body Carrera with X51 Power Kit (345 hp), limited-slip differential, M030 suspension, and Turbo front bumper. GT Silver Metallic paint exclusively. The most desirable narrow-body 996.2 Carrera variant; production number references the 911\'s 1963 Frankfurt debut.',
      },
      {
        name: 'Turbo',
        years: 'MY2001–2005',
        drivetrain: 'AWD',
        power: '415 hp (X50: 444 hp)',
        production: '~16,960 Coupes worldwide; ~3,420 Cabriolets',
        description: 'Mezger 3.6L twin-turbo. X50 Power Kit raises output to 444 hp via larger turbos and intercoolers; no external badge change. Turbo Cabriolet (MY2003) was the first 911 Turbo Cab since the 930. All MY2005 US-market Turbo Cabriolets were Turbo S.',
      },
      {
        name: 'Turbo S',
        years: 'MY2005',
        drivetrain: 'AWD',
        power: '444 hp',
        production: '600 Coupes, 960 Cabriolets worldwide',
        description: 'X50 Power Kit standard along with PCCB ceramic brakes, aluminum-faced gauges, and 6-disc CD changer. The Turbo S Cabriolet includes an aluminum hardtop as standard equipment.',
      },
      {
        name: 'GT2 Mk1',
        years: 'MY2001–2003',
        drivetrain: 'RWD',
        power: '462 hp',
        production: '963 worldwide; ~245 US',
        description: 'Mezger twin-turbo, rear-wheel drive, 6MT only. PCCB ceramic brakes standard. The 996 GT2 was the only twin-turbo RWD 911 of its era — no AWD as on the Turbo.',
      },
      {
        name: 'GT2 Mk2',
        years: 'MY2004–2005',
        drivetrain: 'RWD',
        power: '483 hp',
        production: '324 worldwide',
        description: 'Power upgrade for the final two production years; otherwise identical to Mk1 specification.',
      },
      {
        name: 'GT3 Mk2',
        years: 'MY2003–2005',
        drivetrain: 'RWD',
        power: '381 hp',
        production: '2,589 worldwide; ~960 US',
        description: 'First 911 GT3 sold legally in the United States. Mezger 3.6L naturally aspirated; 6MT only. The Mk2 introduced the RS as a separate variant. A US-market 996 GT3 is by definition a Mk2.',
      },
      {
        name: 'GT3 RS',
        years: 'MY2004',
        drivetrain: 'RWD',
        power: '381 hp',
        production: '682 worldwide',
        // TODO: Verify exact US allocation, RS-specific weight figure, and any dealer-exclusive market restrictions from a primary source before publication.
        description: 'Motorsport-focused lightweight variant of the 996.2 GT3 Mk2. Same Mezger 3.6L NA producing 381 hp; 6MT only. Wide body sourced from the Turbo/GT2 platform — the first RS to adopt the wide-body shell in the water-cooled era. Interior stripped of most sound deadening and convenience equipment; fixed rear wing standard. No IMS concern (Mezger engine). Extremely limited production and motorsport provenance support a meaningful premium over the GT3 Mk2.',
      },
    ],
    engineering: [
      'Turbo-derived headlamps (facelift): The 996.2 replaced the shared Boxster/996 composite headlamps with units derived from the 996 Turbo — a more angular design with clear turn signals. The change addressed the 996.1\'s most visible criticism and restored a more distinctly 911 face. The 996.1 Turbo had already previewed this headlamp design, which is why 996.1 Turbo and 996.2 Carrera look similar.',
      '3.6L M96 with revised cylinder head lubrication: The 3.6L unit raises output to 320 hp and brings a revised cylinder head lubrication system intended to reduce oil starvation events at the cylinder walls — one of the documented contributors to bore scoring on the 3.4L. Whether this meaningfully reduces bore-scoring prevalence on the 3.6L vs. 3.4L remains debated; both remain subject to the IMS concern.',
      'GT3 Mk2 — first US-legal GT3: The GT3 Mk2 (MY2003) was the first 911 GT3 submitted for US federal certification and the first GT3 sold legally in North America. The Mezger 3.6L NA produces 381 hp; no intermediate shaft, no IMS concern. A US-market 996 GT3 is always a Mk2; the Mk1 was never imported as a new car.',
      'X51 Power Kit: Factory option raising M96 Carrera output from 320 hp to 345 hp via revised cylinder heads, camshafts, valvetrain, and intake/exhaust manifolds. Uncommon option that commands a market premium. The X51 also includes improved cylinder 4–6 lubrication targeting the oil starvation risk area. Porsche stamped the X51 notation in the service book — verify at purchase.',
      '40th Anniversary (40 Jahre 911) engineering: The 40 Jahre 911 combined the X51 Power Kit (345 hp) with a mechanical limited-slip differential, M030 sport suspension with lower and stiffer springs, and the Turbo front bumper on the narrow-body platform. This combination makes the 40th Anniversary the most capable narrow-body 996.2 Carrera from a chassis standpoint, in addition to its rarity and collector appeal.',
    ],
    watch_for: [
      {
        title: 'IMS bearing failure (M96 3.6L Carrera engines) — specification varies by build date',
        severity: 'concern',
        body: 'The 996.2 M96 3.6L IMS bearing specification changed across the production run. MY2002–2005 cars predominantly carry the single-row sealed bearing — estimated 8% lifetime failure rate per class action discovery data. Late-production 996.2 cars (build dates from approximately mid-2005 onward, near the end of 996 production) may have received Porsche\'s updated larger non-serviceable bearing at approximately 1% estimated failure rate. The failure rate difference between the two variants is substantial — confirm the bearing specification before purchase. Failure of either bearing is catastrophic — engine destruction without warning. The LN Engineering IMS Retrofit and IMS Solution are the documented preventive fixes. This concern does NOT apply to GT3 Mk2, GT2, or Turbo, all of which use Mezger engines with no intermediate shaft.',
        buyer_question: 'Has the IMS bearing been replaced with an LN Engineering IMS Retrofit or IMS Solution? At what mileage, with which specific product, and performed by which shop? Is there a service invoice?',
      },
      {
        title: 'Cylinder bore scoring (M96 3.6L)',
        severity: 'concern',
        body: 'The M96 3.6L\'s Lokasil cylinder linings remain susceptible to bore scoring, most commonly on cylinder 6. Prevalence estimates are 5–10% of the M96 population across both 3.4L and 3.6L engines. The 3.6L\'s revised cylinder head lubrication is intended to reduce oil starvation events but the bore-scoring failure mode persists. A borescope inspection of all six cylinders is essential before purchase.',
        buyer_question: 'Has a borescope inspection of all six cylinders been performed within the last 10,000 miles? What was found? Any history of unusual oil consumption or misfires that were not promptly diagnosed?',
      },
      {
        title: 'Air-oil separator diaphragm failure',
        severity: 'caution',
        body: 'The M96 AOS uses a rubber diaphragm that fatigues with heat and age, allowing oil vapour into the intake. Blue smoke at startup or under load, oil residue in the throttle body, and elevated consumption are the primary indicators. Severe cases risk hydrolock from accumulated intake manifold oil. Repair cost: $800–$1,500. A proactive AOS replacement is common practice at higher mileage.',
        buyer_question: 'When was the air-oil separator last replaced? Is there any blue smoke at cold start or during hard acceleration? What is the oil consumption rate between changes?',
      },
      {
        title: 'Water pump composite impeller failure',
        severity: 'caution',
        body: 'The M96\'s original water pump uses a composite (plastic) impeller that can fracture and shed debris into the cooling system. A failed impeller reduces coolant flow, causing overheating that can crack the cylinder head — a significantly more expensive downstream consequence. Replacement with a metal impeller water pump is the standard preventive measure and should be documented in the service history.',
        buyer_question: 'Has the water pump been replaced with a metal-impeller unit? What is the replacement part number, mileage at service, and which shop performed the work?',
      },
      {
        title: 'Coolant expansion tank cracking',
        severity: 'caution',
        body: 'The plastic coolant expansion tank yellows and becomes brittle with age — visible yellowing is a warning sign of imminent failure. A cracked tank can result in coolant loss and overheating. This is a low-cost proactive repair that avoids a high-cost consequence. Inspect visually at every service interval.',
        buyer_question: 'When was the coolant expansion tank last replaced? Is the current tank clear or visibly yellowed? Has the cooling system been pressure-tested recently?',
      },
    ],
    service: [
      'Major service intervals for the M96 3.6L are 15,000 miles or annually. Oil changes should use a 5W-40 or 0W-40 full-synthetic formulation rated for water-cooled flat-six applications. Specialists routinely recommend shortening the interval to 7,500 miles on high-mileage examples. The Variocam tensioner pad wear concern specific to the 996.1 five-chain 3.4L does NOT apply to the 996.2 three-chain 3.6L.',
      'Pre-purchase inspection priorities: (1) Borescope all six cylinders — cylinder 6 shows early bore-scoring most frequently. (2) IMS bearing service record — verify LN Engineering part number, date, and installer. (3) AOS inspection — check for blue smoke, oil in throttle body, and elevated consumption. (4) Water pump — confirm metal impeller replacement with part number. (5) Coolant expansion tank visual. (6) X51 documentation on Power Kit cars — verify stamp in service book.',
      'IMS bearing and clutch are most economically bundled because both require engine removal. Water pump and thermostat are commonly replaced as a set during any cooling system service. The 996.2 GT3 Mk2 and GT2 use Mezger engines with no IMS concern; their service priorities center on Mezger-specific items: dry-sump oil level, clutch wear (GT3/GT2 are manual-only), and brake pad thickness given the performance driving these cars typically see.',
    ],
    value_drivers: [
      {
        name: 'IMS bearing service',
        description: 'Documented IMS bearing replacement is the lead value factor. The 3.6L M96 carries the same IMS concern as the 996.1; LN Engineering IMS Solution with documented part number and installer is the benchmark.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'X51 power kit',
        description: 'Factory X51 option raised output to 345 hp and included reinforced lubrication mitigating bore-scoring risk. X51-equipped cars command a premium; the 40 Jahre Anniversary Edition includes it as standard.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Service history',
        description: 'Complete records including IMS status, bore-scope results, water pump replacement (metal impeller), and AOS inspection are essential. Incomplete records carry a significant pricing discount.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Color',
        description: 'Period colors (Speed Yellow, Arena Red, Midnight Blue) hold value better than Silver Metallic. The Turbo headlamp facelift and glove box (vs. cubby hole) are details buyers verify on 996.2 cars.',
      },
      {
        name: 'GT3 / GT2 tier',
        description: 'GT3 Mk2 (first US-legal 911 GT3) and GT2 Mk2 use the Mezger engine — no IMS concern. These cars price in a distinct collectibility tier entirely above M96 Carrera comps.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 997.1 (2005–2008)
  // Source: docs/reference/porsche_2000s_reference.md §"997"
  //         docs/reference/defects/01_engine_m96_m97.md
  // ──────────────────────────────────────────────────────────────────────────
  '997.1': {
    positioning: 'Round headlamps return — 3.6L and 3.8L',
    intro: 'The 997.1 restored the round headlamps that defined every 911 before the 996, broadened the lineup with a 3.8L Carrera S, and introduced VTG turbochargers on the Turbo. Base Carrera models carry forward the M96/M97 IMS and bore-scoring concerns; the Turbo and GT cars use the Mezger engine and are free of them.',
    production_years: '2005–2009',
    body_styles: 'Coupe, Cabriolet, Targa (AWD only)',
    engine: '3.6L M96/05 (Carrera: 320 hp SAE); 3.8L M97/01 (Carrera S: 355 hp SAE); 3.6L Mezger VTG twin-turbo (Turbo: 480 hp); 3.6L Mezger NA (GT3: 415 hp); 3.6L Mezger twin-turbo (GT2: 530 hp)',
    cooling: 'Water-cooled',
    units_produced: '16,521 Carrera Coupes; 27,237 Carrera S Coupes worldwide',
    notes: [
      'The 997.1 marked a decisive stylistic retreat from the 996\'s Boxster-shared design. Round headlamps returned — the design cue most associated with the 911 since 1963 — alongside a wider track, more muscular fender flares, and a nose that reads unambiguously as 911 rather than platform-shared economy. The exterior change was commercially significant: 997 sales significantly outpaced the 996 it replaced, validating the design pivot.',
      'The most important 997.1 engineering development arrived on the Turbo: variable turbine geometry (VTG) turbochargers — the first use of VTG on a production gasoline engine. VTG had been established in diesel applications for its broad torque bandwidth; adapting it to gasoline required solving sustained exposure to significantly higher exhaust temperatures. The result was 480 hp with Diesel-like response across the RPM range. The X50 Power Kit (factory option) raised the Turbo to 530 hp.',
      'The 997.1 vs. 997.2 valuation split is the most consequential divide inside the entire 997 era. The 997.1 base Carrera and Carrera S use the M96/M97 engine family with the IMS bearing concern — but with an important distinction from the 996: the 997.1 inherited the larger non-serviceable IMS bearing from late 996.2 production, not the single-row unit. Estimated failure rate is approximately 1% per post-settlement registry data, materially lower than the ~8% single-row rate documented in M96/M97 class action discovery. The concern is real and the failure mode is still catastrophic, but the 997.1 IMS risk is a different calculation from a MY2000–2005 996 or early 987.1. The 997.2 (MY2009) replaced the M96/M97 entirely with the new 9A1 direct-injection engine, which eliminates the intermediate shaft by design. Buyers who don\'t distinguish between 997.1 and 997.2 take on significantly different risk profiles at similar price points.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: 'MY2005–2008',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '25,770 worldwide (16,521 Coupe; 9,249 Cab)',
        description: 'Narrow-body RWD with the 3.6L M96/05. IMS bearing and bore-scoring considerations apply; the 997.1 carries the larger non-serviceable IMS bearing inherited from late 996.2 production — approximately 1% estimated failure rate, materially lower than the single-row bearing in MY2000–2005 996/987 cars. 5-speed Tiptronic S optional alongside 6MT.',
      },
      {
        name: 'Carrera S',
        years: 'MY2005–2008',
        drivetrain: 'RWD',
        power: '355 hp (X51: 376 hp)',
        production: '42,525 worldwide (27,237 Coupe; 15,288 Cab)',
        description: 'The most popular 997.1 trim. 3.8L M97/01 engine with 355 hp; X51 Power Kit raises output to 376 hp. IMS and bore-scoring concerns apply; same bearing specification as the 3.6L Carrera. PASM active suspension standard.',
      },
      {
        name: 'Carrera 4',
        years: 'MY2006–2008',
        drivetrain: 'AWD',
        power: '320 hp',
        production: '7,006 worldwide (3,809 Coupe; 3,197 Cab)',
        description: 'Narrow-body AWD with the new PTM (Porsche Traction Management) electronically controlled AWD system — a significant improvement over the 996\'s viscous coupling. 6MT or Tiptronic S.',
      },
      {
        name: 'Carrera 4S',
        years: 'MY2006–2008',
        drivetrain: 'AWD',
        power: '355 hp (X51: 376 hp)',
        production: '27,643 worldwide (15,056 Coupe; 12,587 Cab)',
        description: 'Wide-body AWD with the 3.8L S engine and PTM. The 997.1 C4S is the most common wide-body 997.1 variant and broadly considered the strongest value proposition in the 997.1 lineup.',
      },
      {
        name: 'Targa 4',
        years: 'MY2007–2008',
        drivetrain: 'AWD',
        power: '320 hp',
        production: '1,525 worldwide',
        description: 'First AWD-only 997 Targa. Same 3.6L M96/05 as the base Carrera. Sliding glass electric roof continuing the 993/996 architecture. All 997.1 Targas are AWD — no RWD Targa option.',
      },
      {
        name: 'Targa 4S',
        years: 'MY2007–2008',
        drivetrain: 'AWD',
        power: '355 hp',
        production: '3,328 worldwide',
        description: 'Wide-body AWD Targa with the 3.8L S engine. Same sliding glass roof architecture as the Targa 4.',
      },
      {
        name: 'Turbo',
        years: 'MY2007–2009',
        drivetrain: 'AWD',
        power: '480 hp (X50: 530 hp)',
        production: '21,725 worldwide (15,626 Coupe; 6,099 Cab); ~8,869 US',
        description: 'First gasoline production car with VTG (variable turbine geometry) turbochargers. 3.6L Mezger engine — no IMS, external dry-sump. X50 Power Kit raises to 530 hp with no exterior badge change. Mezger architecture; none of the M96/M97 concerns apply.',
      },
      {
        name: 'Turbo Cabriolet',
        years: 'MY2008–2009',
        drivetrain: 'AWD',
        power: '480 hp',
        production: '6,099 worldwide',
        description: 'Convertible companion to the Turbo Coupe. Mezger engine with VTG turbochargers.',
      },
      {
        name: 'GT3',
        years: 'MY2007–2009',
        drivetrain: 'RWD',
        power: '415 hp',
        production: '3,329 worldwide; ~910 US',
        description: 'Mezger 3.6L naturally aspirated; 6MT only. No IMS concern. The 997.1 GT3 is the first generation of GT3 that commands a meaningful collector premium on the secondary market as a 911 driving purist\'s car.',
      },
      {
        name: 'GT3 RS',
        years: 'MY2007–2009',
        drivetrain: 'RWD',
        power: '415 hp',
        production: '1,909 worldwide; ~413 US',
        description: 'First US-legal 911 GT3 RS in any generation — the 996 GT3 RS Mk2 was RoW-only. Wider track and body versus the GT3, carbon rear wing, polycarbonate rear window on European cars. Mezger engine; 6MT only.',
      },
      {
        name: 'GT2',
        years: 'MY2008–2009',
        drivetrain: 'RWD',
        power: '530 hp',
        production: '1,242 worldwide; ~205 US',
        description: 'Mezger twin-turbo, rear-wheel drive, 6MT only. The only 997.1 combining Mezger turbocharging with rear-wheel drive. PCCB standard. Approximately 205 came to the US.',
      },
    ],
    engineering: [
      'Round headlamps restored: The 997.1 returned to round headlamps — the visual signature every 911 carried from 1963 through 1993. More than styling, the change signalled Porsche\'s willingness to address the 996\'s most visible commercial weakness and its most persistent enthusiast criticism. The 997 platform also added a wider track (15mm at the front, 37mm at the rear on S models) and more pronounced fender flares.',
      'VTG turbochargers (Turbo, MY2007): Variable turbine geometry turbochargers adapt the turbine vane angle to engine RPM, allowing a turbocharger calibrated for high-speed flow to also behave efficiently at low speeds. The result is broad torque across the RPM range without the traditional boost threshold of a fixed-geometry turbocharger. Adapting VTG to gasoline required solving sustained exposure to exhaust gas temperatures significantly above those in diesel applications — a BorgWarner engineering achievement.',
      'M96/M97 bearing specification — larger non-serviceable, not single-row: The 997.1 M96/M97 inherited the larger non-serviceable IMS bearing introduced in late 996.2 production (approximately MY2006 build dates onward) — not the single-row unit responsible for the ~8% failure rate documented in M96/M97 class action discovery. Post-settlement registry data puts the larger bearing\'s failure rate at approximately 1%. This is a meaningful improvement, but not a clean break: the failure mode is still catastrophic and the retrofit recommendation still applies. The 997.2\'s 9A1 eliminates the intermediate shaft entirely.',
      'PTM all-wheel drive (C4/C4S/Targa, MY2006+): The 997 AWD models introduced Porsche Traction Management — an electronically controlled multi-plate clutch replacing the viscous coupling of the 993/996 C4. PTM uses the clutch to variably engage the front axle in response to rear-wheel slip, traction conditions, and PSM input. The system is rear-biased by default and routes torque forward as needed — a faster and more flexible response than any viscous coupling arrangement. The system is tunable via the PSM sport mode.',
      'First US-legal GT3 RS: The 997.1 GT3 RS (MY2007) was the first GT3 RS ever sold legally in the United States. The 996 GT3 RS Mk2 was a RoW-only car with no US federal certification. The 997.1 GT3 RS brought the wider body, carbon rear wing, and polycarbonate rear window to North American buyers for the first time.',
    ],
    watch_for: [
      {
        title: 'IMS bearing (M96/M97 — larger non-serviceable bearing, ~1% rate)',
        severity: 'concern',
        body: 'The 997.1 M96/M97 carries the larger non-serviceable IMS bearing introduced in late 996.2 production — not the single-row unit. Estimated failure rate is approximately 1% per post-settlement registry data, materially lower than the ~8% single-row rate in MY2000–2005 996/987 cars, but failure remains catastrophic: bearing collapse destroys the engine. The LN Engineering IMS Solution is the established retrofit. The concern applies only to M96/M97-engined cars (Carrera/C4/S/4S/Targa) — Turbo, GT3, GT3 RS, and GT2 all use Mezger engines with no intermediate shaft.',
        buyer_question: 'Has the IMS bearing been upgraded with an LN Engineering IMS Solution? At what mileage and by which shop? Is there a service invoice? If no retrofit, has the bearing been inspected using the IMS check kit?',
      },
      {
        title: 'Cylinder bore scoring (M96/M97 3.6L and 3.8L)',
        severity: 'concern',
        body: 'Both the 3.6L M96/05 and 3.8L M97/01 carry the bore-scoring risk of the M96 family. Lokasil cylinder linings are susceptible to scoring, most commonly on cylinder 6. Prevalence is estimated at 5–10% of the M96/M97 population. A borescope inspection of all six cylinders is essential before purchase. Once scored, the only repair is full engine teardown and cylinder sleeving.',
        buyer_question: 'Has a borescope inspection of all six cylinders been performed within the last 10,000 miles? Are there records of unusual oil consumption? Has the engine ever been torn down or apart for any reason?',
      },
      {
        title: 'Air-oil separator diaphragm failure',
        severity: 'caution',
        body: 'The M96/M97 AOS uses a rubber diaphragm that fatigues with age and heat cycles, allowing oil vapour into the intake manifold. Symptoms: blue smoke at startup, oil residue in the throttle body, elevated oil consumption. In severe cases, oil accumulation in the intake can cause hydrolock. Repair cost: $800–$1,500. Proactive replacement is common practice on high-mileage 997.1 M96/M97 cars.',
        buyer_question: 'When was the air-oil separator last replaced? Any blue smoke at cold start or during hard acceleration? What is the current oil consumption rate?',
      },
      {
        title: 'Water pump composite impeller failure',
        severity: 'caution',
        body: 'The M96/M97 original water pump uses a composite impeller that can fracture and shed debris into the cooling system. A failed impeller causes overheating that can crack the cylinder head. Replacement with a metal-impeller pump is the standard preventive measure and should be documented in the service history.',
        buyer_question: 'Has the water pump been replaced with a metal-impeller unit? What is the replacement mileage, part number, and which shop performed the work?',
      },
      {
        title: 'Coolant expansion tank cracking',
        severity: 'caution',
        body: 'The plastic coolant expansion tank yellows and becomes brittle with age — visible yellowing signals imminent failure. A cracked tank causes coolant loss and overheating. Low-cost to replace proactively; high-cost if overheating damages the cylinder head. Standard inspection item at every service on water-cooled 911s through 2012.',
        buyer_question: 'When was the coolant expansion tank last replaced? Is the current tank clear or visibly yellowed? Has the cooling system been pressure-tested recently?',
      },
    ],
    service: [
      'Major service intervals for the M96/M97 are 15,000 miles or annually. Oil changes should use 5W-40 or 0W-40 full-synthetic. Many specialists recommend 7,500-mile oil changes on high-mileage examples to reduce bore-scoring risk. The 997.1 vs. 997.2 engine distinction is the most important valuation and service factor in the 997 era — always verify the model year and engine code before purchase.',
      'Pre-purchase inspection priorities for a 997.1 Carrera/S/C4/C4S: (1) Borescope all six cylinders — cylinder 6 shows early bore-scoring most often. (2) IMS bearing status — verify LN Engineering IMS Solution installation with part number and date. (3) AOS inspection — blue smoke and oil consumption indicators. (4) Water pump — confirm metal impeller replacement. (5) Coolant expansion tank visual. (6) RMS (rear main seal) — check for oil accumulation at the engine-to-gearbox joint.',
      'IMS, clutch, and rear main seal are most economically addressed together because all three require engine removal. A 997.1 with a documented clutch replacement but no IMS documentation is a priority inspection item. Turbo, GT3, GT3 RS, and GT2 cars use Mezger engines with no IMS concern; their service priorities focus on Mezger dry-sump oil condition, brake wear commensurate with track use, and clutch condition.',
    ],
    value_drivers: [
      {
        name: 'IMS bearing service',
        description: 'M96/M97 IMS concern carries into the 997.1. LN Engineering IMS Solution documentation is essential; engine-out preventive service is the primary separator between well-maintained and concern-level examples.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Carrera vs. Carrera S',
        description: 'The 3.8L Carrera S (355 hp) commands a clear premium over the 3.6L base Carrera. The S also offers more tuning headroom and a slightly different IMS profile via the revised M97 engine.',
        applies_to: { trim_categories: ['m96'] },
      },
      {
        name: 'Engine family',
        description: 'Turbo, GT2, GT3, and GT3 RS use the Mezger dry-sump engine — no IMS bearing. These trims occupy a higher valuation tier entirely separate from the M96/M97 Carrera market.',
      },
      {
        name: 'Transmission',
        description: 'Manual gearbox is strongly preferred. The 5-speed Tiptronic S carries a discount. PDK was not available on the 997.1 — it arrived with the 997.2 — making manual the only sporting option.',
      },
      {
        name: 'Service documentation',
        description: 'Complete records including IMS status, bore-scope results, and oil change frequency are the core inspection points and the most direct value signal for an M96/M97 car.',
        applies_to: { trim_categories: ['m96'] },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 997.2 (2009–2012)
  // Source: docs/reference/porsche_2000s_reference.md §"997.2"
  //         docs/reference/porsche_2010s_reference.md §"997.2"
  //         docs/reference/defects/13_engine_9a1_9a2_9a3.md
  // ──────────────────────────────────────────────────────────────────────────
  '997.2': {
    positioning: 'New 9A1 engine — IMS eliminated by design',
    intro: 'The MY2009 997.2 facelift brought three simultaneous changes: the all-new 9A1 direct-injection engine (eliminating the intermediate shaft entirely), the 7-speed PDK replacing the 5-speed Tiptronic, and LED daytime running lights. The 9A1 engine is the single most consequential engineering change in water-cooled 911 history.',
    production_years: '2009–2012',
    body_styles: 'Coupe, Cabriolet, Targa (AWD only)',
    engine: '3.6L 9A1 DFI (Carrera: 345 hp); 3.8L 9A1 DFI (Carrera S/GTS: 385–408 hp); 3.8L Mezger twin-turbo (Turbo: 500–530 hp); 3.8L Mezger NA (GT3: 435–450 hp); 4.0L Mezger NA (GT3 RS 4.0: 500 hp); 3.6L Mezger twin-turbo (GT2 RS: 620 hp)',
    cooling: 'Water-cooled',
    units_produced: '11,098 Carreras; 16,047 Carrera S; 5,053 Turbos worldwide',
    notes: [
      'The 997.2\'s MY2009 launch was the most consequential engineering transition in water-cooled 911 history. Three simultaneous changes — the new 9A1 direct-injection engine, the 7-speed PDK dual-clutch gearbox replacing the 5-speed Tiptronic, and LED daytime running lights — transformed the platform. The 9A1\'s defining change is the elimination of the intermediate shaft entirely. No intermediate shaft means no IMS bearing, and no IMS bearing means no IMS bearing failure mode. This architectural decision had been anticipated by the community since the 996\'s documented problems, and its arrival in the 997.2 marked a clean break from the M96/M97 era\'s most serious concern.',
      'The 997.2 GT halo variants are among the most significant collector Porsches of any era. The GT3 RS 4.0 (MY2011) uses the RSR motorsport crankshaft with an 80.4mm stroke in a 4.0L naturally aspirated Mezger producing 500 hp — hard-capped at 600 units worldwide, 158 in North America. The GT2 RS (MY2011) produces 620 hp from a 3.6L Mezger twin-turbo, capped at 500 units worldwide, 142 in North America. Both represent the final road-going expressions of the Mezger engine: the GT3 RS 4.0 is the last Mezger NA, the GT2 RS the last Mezger turbocharged road car. From the 991 onward, no road-going 911 in any trim uses the Mezger.',
      'The 997.2 base Carrera with a 6-speed manual is increasingly sought by buyers who recognise it as the last 911 combining the 9A1\'s clean-sheet engine architecture with traditional manual gearbox character. PDK take rate across the 997.2 lineup was approximately 70% — meaning manual examples exist but are substantially less common. Manual 997.2 Carreras and Carrera S cars carry a premium over equivalent PDK examples in the current market, a premium that has grown as the generation has aged into collector territory.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: '2009–2012',
        drivetrain: 'RWD',
        power: '345 hp',
        production: '11,098 worldwide (7,190 Coupe; 3,908 Cab)',
        description: '9A1 3.6L DFI; no intermediate shaft, no IMS concern. 6MT or 7-speed PDK. Manual examples command a premium at current market; ~30% of production was manual-equipped.',
      },
      {
        name: 'Carrera S',
        years: '2009–2012',
        drivetrain: 'RWD',
        power: '385 hp (X51: 408 hp)',
        production: '16,047 worldwide (9,470 Coupe; 6,577 Cab)',
        description: '9A1 3.8L DFI. No IMS concern. X51 Power Kit option raises output to 408 hp via revised heads and intake. PASM active suspension standard.',
      },
      {
        name: 'Carrera 4',
        years: '2009–2012',
        drivetrain: 'AWD',
        power: '345 hp',
        production: '2,992 worldwide (1,748 Coupe; 1,244 Cab)',
        description: '9A1 3.6L DFI with updated PTM AWD. No IMS concern.',
      },
      {
        name: 'Carrera 4S',
        years: '2009–2012',
        drivetrain: 'AWD',
        power: '385 hp',
        production: '16,963 worldwide (9,188 Coupe; 7,775 Cab)',
        description: 'Wide-body AWD with 9A1 3.8L and PTM. No IMS concern.',
      },
      {
        name: 'Targa 4 / Targa 4S',
        years: '2009–2012',
        drivetrain: 'AWD',
        power: '345 / 385 hp',
        production: 'Targa 4: 1,115 worldwide; Targa 4S: 2,560 worldwide',
        description: 'Sliding glass panoramic roof (AWD only; this Targa design was retired with the 997.2 — the 991 Targa returned to the classic bar design). No IMS concern.',
      },
      {
        name: 'Carrera GTS',
        years: '2011–2012',
        drivetrain: 'RWD',
        power: '408 hp',
        production: '5,259 worldwide (3,092 Coupe; 2,167 Cab)',
        description: 'X51 Power Kit (408 hp), wide-body C4 bodywork, centre-lock wheels, Sport Exhaust, and Alcantara interior on the RWD drivetrain. The GTS is the most performance-focused naturally aspirated 997.2; its NA status makes it increasingly collectible as the 991.2 and later moved all Carreras to forced induction.',
      },
      {
        name: 'Carrera 4 GTS',
        years: '2012',
        drivetrain: 'AWD',
        power: '408 hp',
        description: 'AWD GTS available for approximately one model year before the 991 launched. Rarer than the RWD GTS.',
      },
      {
        name: 'Turbo',
        years: '2010–2013',
        drivetrain: 'AWD',
        power: '500 hp',
        production: '5,053 worldwide (3,301 Coupe; 1,752 Cab); ~1,490 North America',
        description: 'First 911 Turbo to offer PDK as an option alongside the 6-speed manual. 3.8L Mezger twin-turbo — final generation of Turbo production using the Mezger engine.',
      },
      {
        name: 'Turbo S',
        years: '2011–2013',
        drivetrain: 'AWD',
        power: '530 hp',
        production: '5,150 worldwide (3,095 Coupe; 2,055 Cab); ~2,330 North America',
        description: 'PDK only — no manual option on the Turbo S. PCCB ceramic brakes and Sport Chrono standard. The 997.2 Turbo S is PDK-only and is the more common of the two Turbo variants in North America.',
      },
      {
        name: 'GT3 (3.8L)',
        years: '2010–2011',
        drivetrain: 'RWD',
        power: '435 hp',
        production: '2,256 worldwide; 715 North America',
        description: 'Mezger 3.8L NA; 6MT only — the last GT3 with manual-only transmission until the 991.2 GT3. No IMS concern.',
      },
      {
        name: 'GT3 RS (3.8L)',
        years: '2010–2011',
        drivetrain: 'RWD',
        power: '450 hp',
        production: '1,619 worldwide; ~612 North America',
        description: 'Mezger 3.8L; wider track than GT3; magnesium roof on later production. 6MT only.',
      },
      {
        name: 'GT3 RS 4.0',
        years: '2011',
        drivetrain: 'RWD',
        power: '500 hp',
        production: '600 worldwide cap; 158 North America (141 US + 17 Canada)',
        description: 'RSR motorsport crankshaft (80.4mm stroke); 4.0L displacement; front dive planes from GT2 RS; final road-going naturally aspirated Mezger ever produced. 600 units hard cap. Widely regarded as the apex 997 from a collector standpoint.',
      },
      {
        name: 'GT2 RS',
        years: '2011',
        drivetrain: 'RWD',
        power: '620 hp',
        production: '500 worldwide cap; 142 North America (132 US + 10 Canada)',
        description: '3.6L Mezger twin-turbo; 6MT only; 500 units worldwide cap. The final road-going Mezger turbocharged engine ever. Developed from the GT1 racing program lineage that began with the 996 GT3 Mk1. An irreplaceable end-of-an-era road car.',
      },
      {
        name: 'Sport Classic',
        years: '2010',
        drivetrain: 'RWD',
        power: '408 hp',
        production: '250 worldwide (RoW only — not US-federalized from factory)',
        description: 'X51 Power Kit (408 hp), 6MT only. Produced exclusively in Sport Classic Grey; no other color option. Double-bubble roof, ducktail rear spoiler, Fuchs-style 19-inch alloys, PCCB ceramic brakes standard. Based on the Carrera GTS specification, delivered exclusively through Porsche Exclusive. All 250 units sold within 48 hours of order opening. Not federalized for US sale — examples appearing on US auction platforms arrived via Show and Display exemption or grey-market import pathways.',
      },
      {
        name: 'Speedster',
        years: '2011',
        drivetrain: 'RWD',
        power: '408 hp',
        production: '356 worldwide; ~108 US',
        description: '7-speed PDK only (no manual option). Wide C4 rear body on RWD chassis. Raked windscreen (60–77 mm lower than Cabriolet), manually folding roof with double-bubble tonneau cover. X51 Power Kit (408 hp). Available exclusively in Pure Blue or Carrara White. Production count of 356 is a deliberate tribute to the original Porsche 356 — the fourth production 911 Speedster in the model\'s history. Lightest of the 997.2 open variants.',
      },
    ],
    engineering: [
      '9A1 direct-injection engine eliminates the intermediate shaft: The 9A1 redesigns the cam drive architecture from the ground up, routing cam timing directly from the crankshaft without an intermediate shaft. No intermediate shaft means no IMS bearing, eliminating the primary concern of the M96/M97 era entirely. The 9A1 also uses a closed-deck Alusil block with a different oiling architecture — the M96/M97-pattern bore-scoring failure mode is not documented on the 9A1.',
      'Triple simultaneous transition (MY2009): The 997.2 launch introduced the 9A1 engine, the 7-speed PDK dual-clutch gearbox (replacing the 5-speed Tiptronic), and LED daytime running lights simultaneously. The PDK offers faster shifts than any prior Porsche transmission and is widely regarded as one of the best dual-clutch implementations in the industry. The combination of DFI and PDK lifted the 3.6L base Carrera from 325 hp to 345 hp and improved fuel economy simultaneously.',
      'DFI (direct fuel injection): The 9A1 injects fuel directly into the combustion chamber rather than into the intake port. Direct injection enables higher compression ratios (11.3:1 on the 3.8L) and more precise fuel metering, delivering the 20–30 hp gains over the equivalent M96/M97 displacement. The trade-off is intake valve carbon buildup — without fuel washing over the intake valves as in port injection, carbon accumulates over high mileage. This is a manageable service item (walnut-shell blast cleaning), not a structural concern.',
      'Last generation of the Mezger engine in any road car: The 997.2 GT cars use the Mezger for the final time in any road-car application. The GT3 RS 4.0 (500 hp, 4.0L NA) and GT2 RS (620 hp, 3.6L turbo) are both MY2011 cars, both with hard production caps. From the 991 onward, all 911 road cars use 9A1-family engines — including the GT3, which switched to a 9A1-derived unit for the first time in MY2014.',
      'GT3 RS 4.0 RSR crankshaft: The GT3 RS 4.0\'s 4.0L displacement is achieved using the crankshaft from the GT3 RSR racing car — an 80.4mm stroke (versus the 3.8L\'s 76.4mm). Combined with the GT2 RS\'s front dive planes and a magnesium roof as standard, the RS 4.0 is the most track-focused naturally aspirated road 911 produced through 2012. Porsche\'s engineers described it as a road-legal race car rather than a road car with race-car-inspired elements.',
    ],
    watch_for: [
      {
        title: 'DFI intake valve carbon buildup (9A1 base Carrera engines)',
        severity: 'caution',
        body: 'Direct fuel injection bypasses the intake valves, eliminating the natural fuel-wash that removes carbon deposits in port-injected engines. Over high mileage (typically above 60,000–80,000 miles), carbon accumulates on the intake valve heads and seats, reducing airflow and potentially causing rough idle or misfires. Remediation is walnut-shell blasting — an established, non-invasive cleaning procedure. The 9A1\'s DFI carbon buildup is less prevalent than on equivalent VW/Audi DFI engines; it is a service item, not a structural concern.',
        buyer_question: 'At what mileage is the car currently, and have the intake valves ever been cleaned via walnut-shell blasting or an equivalent method? Is there any rough idle or hesitation under acceleration that has been investigated?',
      },
      {
        title: 'IMS bearing — not applicable to 997.2 9A1 engines',
        severity: 'caution',
        body: 'The 997.2 base Carrera, Carrera S, C4, C4S, Targa, and GTS models use the 9A1 engine, which eliminates the intermediate shaft entirely. There is no IMS bearing to fail on these cars. However, this is the single most common point of confusion when buyers compare 997.1 and 997.2 pricing: the 997.1 carries the IMS concern; the 997.2 does not. Confirm the model year and engine family before evaluating any quoted IMS risk.',
        buyer_question: 'Is this a 997.1 (MY2005–2008) or 997.2 (MY2009–2012)? Has the seller confirmed the engine code? If the car is presented as a 997.2 with an IMS retrofit, that is a red flag — the 9A1 has no IMS.',
      },
      {
        title: 'Secondary air injection pump and valve failure',
        severity: 'caution',
        body: 'The secondary air injection system, required for US emissions compliance, uses a pump and diverter valves that fail with age and accumulated hours. Failure produces P0410 or P1411 fault codes and an illuminated CEL; the car runs normally but fails emissions testing. Repair cost ranges from $200 (valves only) to $2,500 if the pump has seized and requires the head-side ports to be reamed. The 9A1\'s port geometry differs from the M96/M97; port clogging is less severe, but pump and valve failures still occur.',
        buyer_question: 'Is the check engine light currently illuminated? Have any P0410 or P1411 codes been logged? When was the secondary air injection system last inspected or serviced?',
      },
      {
        title: 'Coolant expansion tank cracking',
        severity: 'caution',
        body: 'The 997.2 uses a coolant expansion tank architecture shared with the 997.1 and earlier water-cooled 911s through 2012. Yellowing of the plastic tank indicates imminent cracking. A failed tank causes coolant loss and potential overheating. Standard proactive replacement at 60,000–80,000 miles or visible yellowing, whichever comes first.',
        buyer_question: 'When was the coolant expansion tank last inspected or replaced? Is it clear or visibly yellowed? Has the cooling system been pressure-tested recently?',
      },
    ],
    service: [
      'Major service intervals for the 9A1 are 20,000 miles or annually using 0W-40 or 5W-40 full-synthetic. The extended factory interval is appropriate for the 9A1 architecture; unlike the M96/M97, specialists do not routinely recommend shortening it. PDK transmission fluid service (Porsche recommends every 40,000 miles) is often extended by owners — adhere to the interval on a used purchase, as PDK service history directly affects transmission longevity.',
      'Pre-purchase inspection priorities for a 997.2 Carrera/S/C4/C4S/GTS: (1) Confirm 9A1 engine by model year (MY2009–2012) and VIN decode — the 997.1 IMS concern is the most common confusion point. (2) Borescope all six cylinders to check for any cylinder wall anomalies. (3) SAI system check — scan for P0410/P1411 codes. (4) PDK fluid condition and service history if equipped. (5) Coolant expansion tank visual. (6) Carbon buildup status on high-mileage examples (above 70,000 miles).',
      'Turbo, GT3, GT3 RS, GT3 RS 4.0, and GT2 RS cars use Mezger engines. Priorities for those: dry-sump oil level and condition, clutch wear (all manual-only), brake pad thickness (GT cars frequently see track use), and documentation of any racing or track-day history. The GT3 RS 4.0 and GT2 RS at production caps of 600 and 500 units respectively warrant full specialist pre-purchase inspection regardless of stated condition — replacement cost if something is wrong is significantly elevated.',
    ],
    value_drivers: [
      {
        name: 'Engine generation (9A1 vs. M97)',
        description: 'The MY2009+ 997.2 uses the 9A1 direct-injection engine, eliminating the IMS bearing concern entirely. Always confirm model year when buying a 997 — this is the single most important generation-level distinction.',
      },
      {
        name: 'Transmission',
        description: 'Manual gearbox carries a premium over PDK. PDK was introduced as standard on the 997.2 Carrera; the manual is increasingly valued as collector preference shifts away from automatics.',
      },
      {
        name: 'GTS specification',
        description: 'The GTS (MY2011–2012) adds sport exhaust, Carrera S suspension, and PASM as standard at a price point many consider the best value specification in the 997.2 range.',
        applies_to: { trim_categories: ['9a1'] },
      },
      {
        name: 'GT variants (Mezger)',
        description: 'GT3, GT3 RS, GT3 RS 4.0, and GT2 RS use Mezger engines. The GT3 RS 4.0 (600 units) and GT2 RS (500 units) are production-capped collectibles at the top of the generation.',
        applies_to: { trim_categories: ['mezger'] },
      },
      {
        name: 'Service history',
        description: 'With no IMS concern, priorities shift to PDK fluid condition, carbon buildup on high-mileage examples, and SAI system status. Complete records still command a meaningful premium.',
        applies_to: { trim_categories: ['9a1'] },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 991.1 (2012–2016)
  // Source: docs/reference/porsche_2010s_reference.md §"991.1"
  //         docs/reference/defects/13_engine_9a1_9a2_9a3.md
  // ──────────────────────────────────────────────────────────────────────────
  '991.1': {
    positioning: 'Last naturally aspirated base Carrera',
    intro: 'The 991.1 was the first all-new 911 platform since the 996 in 1997, bringing an aluminum-steel hybrid body, a 100mm longer wheelbase, and the 7-speed manual. Most critically, it is the last 911 generation with naturally aspirated base Carrera engines — from the 991.2 onward, every non-GT Carrera uses twin turbochargers.',
    production_years: '2012–2016',
    body_styles: 'Coupe, Cabriolet, Targa (AWD only; motorized classic-bar design)',
    engine: '3.4L 9A1 NA (Carrera/C4: 350 hp); 3.8L 9A1 NA (Carrera S/4S/GTS: 400–430 hp); 3.8L 9A1 twin-turbo (Turbo: 520 hp; Turbo S: 560 hp); 3.8L 9A1 NA (GT3/MA175: 475 hp); 4.0L 9A1 NA (GT3 RS/911 R: 500 hp)',
    cooling: 'Water-cooled',
    units_produced: '233,540 total 991 generation (991.1 + 991.2 combined, Porsche official)',
    notes: [
      'The 991 was the most ambitious 911 redesign since the 996, with approximately 90% of components new or substantially redesigned versus the 997. The aluminum-steel hybrid monocoque reduced curb weight by approximately 45 kg despite a larger overall footprint and a 100mm longer wheelbase. The wheelbase extension allowed the transaxle to move 76mm rearward, improving weight distribution closer to 50/50. Electromechanical power steering (EPAS) replaced the hydraulic rack — a change that generated sustained criticism from enthusiasts who valued the hydraulic system\'s direct feedback, and which remains the most debated aspect of the 991.1\'s driver character.',
      'The 991.1 GT3 broke the most significant tradition in the 911 GT line: it was the first GT3 not powered by the Mezger engine. The new MA175 (3.8L, 9A1-derived) produces 475 hp with a 9,000 rpm redline and was available only with PDK — another break from tradition that drew intense criticism from manual-transmission enthusiasts. Porsche\'s reasoning (PDK is faster on every measurable metric) did not satisfy a community that had used the GT3 as the last word in driver-focused, manual-equipped track machines. The 991.2 GT3 restored the manual option. The 911 R (MY2016) was Porsche\'s direct response: 500 hp from the GT3 RS 4.0L unit, with a 6-speed manual and no fixed wing, in an edition of exactly 991 units.',
      'The 991.1 is the last 911 generation with naturally aspirated base Carrera engines. The 3.4L (350 hp) in the base Carrera and Carrera 4, and the 3.8L (400 hp) in the Carrera S, 4S, GTS, and Targa 4S, were both discontinued when the 991.2 launched in MY2017 with twin-turbocharged units across the entire non-GT lineup. This timing has made 991.1 NA Carrera variants — particularly the GTS — increasingly collectible as buyers recognise the end of an unbroken line of naturally aspirated base 911s stretching back to 1963.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: '2012–2016',
        drivetrain: 'RWD',
        power: '350 hp',
        description: '3.4L 9A1 NA; last-ever 911 with a naturally aspirated 3.4L engine. 7MT (first 911 with a 7-speed manual, seventh gear used as overdrive) or 7-speed PDK. EPAS standard across all 991 trims.',
      },
      {
        name: 'Carrera S',
        years: '2012–2016',
        drivetrain: 'RWD',
        power: '400 hp (X51: 430 hp)',
        description: '3.8L 9A1 NA; last-ever 911 with a naturally aspirated 3.8L engine in any base/sport trim. X51 Power Kit raises to 430 hp. PASM active suspension standard.',
      },
      {
        name: 'Carrera 4',
        years: '2012–2016',
        drivetrain: 'AWD',
        power: '350 hp',
        description: '3.4L 9A1 NA with updated PTM. Narrow body.',
      },
      {
        name: 'Carrera 4S',
        years: '2012–2016',
        drivetrain: 'AWD',
        power: '400 hp',
        description: 'Wide-body AWD with 3.8L 9A1 NA and PTM.',
      },
      {
        name: 'Targa 4',
        years: '2014–2016',
        drivetrain: 'AWD',
        power: '350 hp',
        description: 'Classic Targa-bar design returns — automated motorized mechanism raises and lowers the bar and glass. AWD only on all 991 Targas. The sliding glass roof of the 993/996/997 Targa is retired.',
      },
      {
        name: 'Targa 4S',
        years: '2014–2016',
        drivetrain: 'AWD',
        power: '400 hp',
        description: 'Wide-body Targa 4 with 3.8L NA.',
      },
      {
        name: 'Carrera GTS',
        years: '2015–2016',
        drivetrain: 'RWD',
        power: '430 hp',
        production: '~8,634 worldwide RWD GTS (5,510 Coupe; 3,124 Cab)',
        description: 'X51 Power Kit (430 hp), wide-body bodywork on the RWD drivetrain, centre-lock wheels standard, Sport Exhaust, Alcantara interior. The most collectible naturally aspirated non-GT 991.1 variant. NA status makes it increasingly scarce as the 991.2 GTS moved to turbocharging.',
      },
      {
        name: 'Carrera 4 GTS',
        years: '2015–2016',
        drivetrain: 'AWD',
        power: '430 hp',
        description: 'AWD GTS with wide-body, X51, and centre-lock wheels.',
      },
      {
        name: 'Targa 4 GTS',
        years: '2015–2016',
        drivetrain: 'AWD',
        power: '430 hp',
        production: '1,525 worldwide',
        description: 'First-ever 911 Targa GTS in any generation. Wide-body, AWD, motorized classic Targa bar, 430 hp.',
      },
      {
        name: 'Turbo',
        years: '2014–2016',
        drivetrain: 'AWD',
        power: '520 hp',
        production: '~5,350 worldwide; ~1,710 North America (Coupe + Cab)',
        description: '3.8L 9A1 twin-turbocharged — first 911 Turbo NOT using the Mezger engine. Active aerodynamics (deployable front spoiler and rear wing), rear-wheel steering, and adaptive engine mounts standard. PDK only.',
      },
      {
        name: 'Turbo S',
        years: '2014–2016',
        drivetrain: 'AWD',
        power: '560 hp',
        production: '9,629 worldwide (Coupe + Cab; Porsche Newsroom); ~4,130 North America',
        description: 'PCCB ceramic brakes and dynamic engine mounts standard. PDK only. More common than the base Turbo in North America.',
      },
      {
        name: '50th Anniversary Edition',
        years: '2014',
        drivetrain: 'RWD',
        power: '430 hp',
        production: 'Exactly 1,963 worldwide; ~750 North America',
        description: 'C4S wide-body on the RWD drivetrain; X51 standard (430 hp); Pepita houndstooth seats; period-correct green-numbered gauges; three colors (Geyser Grey Metallic — exclusive to this edition — Graphite Grey, Basalt Black).',
      },
      {
        name: 'GT3',
        years: '2014–2016',
        drivetrain: 'RWD',
        power: '475 hp',
        production: '~6,050 worldwide; ~2,070 North America',
        description: 'First GT3 not using the Mezger engine (MA175, 9A1-derived, 3.8L, 9,000 rpm). PDK only — no manual option on the 991.1 GT3. Subject to two Porsche-acknowledged service campaigns: a 2014 rod-bolt recall and a 2017 finger-follower warranty extension.',
      },
      {
        name: 'GT3 RS',
        years: '2016',
        drivetrain: 'RWD',
        power: '500 hp',
        production: '~4,250 worldwide; ~1,530 North America',
        description: '4.0L MA176 (9A1-derived); PDK only; magnesium roof standard; Lightweight Package option (carbon buckets, magnesium wheels). Not subject to the GT3 rod-bolt recall or finger-follower campaign.',
      },
      {
        name: '911 R',
        years: '2016',
        drivetrain: 'RWD',
        power: '500 hp',
        production: 'Exactly 991 worldwide; ~323 North America',
        description: '4.0L GT3 RS engine with a 6-speed manual — the direct enthusiast response to the PDK-only GT3. No fixed rear wing; 991 production units (referencing the 991 chassis code). Secondary market premiums of 100–200% over $185,000 MSRP appeared within days of the Geneva 2016 announcement.',
      },
    ],
    engineering: [
      'Aluminum-steel hybrid monocoque: The 991 is the first 911 built on an aluminum-steel hybrid platform — approximately 90% of components new or substantially redesigned versus the 997. Curb weight reduced by approximately 45 kg despite a larger overall footprint. The hybrid construction uses aluminum for the front crash structure, front and rear bulkheads, and floor, with high-strength steel in the safety cell. Torsional rigidity improved substantially versus the 997.',
      'Extended wheelbase and revised weight distribution: The 991\'s wheelbase is 2,450 mm — 100mm longer than the 997. The transaxle moved 76mm rearward within the same engine bay footprint, improving weight distribution toward 50/50 front-to-rear. The longer wheelbase also improved straight-line stability and reduced sensitivity to mid-corner disturbances — improvements that came at the cost of some of the 997\'s compactness.',
      '991.1 GT3 breaks the Mezger lineage: The MY2014 GT3 is the first GT3 in any 911 generation not powered by the Mezger engine. The new MA175 (internally coded, 3.8L, 9A1-derived) produces 475 hp and a 9,000 rpm redline with direct fuel injection. PDK-only at launch — a decision that drove more enthusiast debate than any other 991.1 product choice. The 991.2 GT3 restored the manual option.',
      '991.1 GT3 engine — rod-bolt recall and warranty extension: Two Porsche-acknowledged campaigns apply to the 991.1 GT3 (MA175 engine) specifically: (a) NHTSA recall 14V-090 (2014) — rod bolt torque specification issue; approximately 785 cars worldwide (~400 US) had their complete engines replaced. Post-recall engines are identified by community shorthand as "G-code" engines. (b) 2017 Porsche warranty extension — all internal engine components covered 10 years/120,000 miles from in-service date, fully transferable. This campaign does NOT apply to the GT3 RS (MA176) or the 911 R.',
      '7-speed manual gearbox: The 991.1 introduced a 7-speed manual to the 911 — the first production 911 with a 7-speed manual transmission. The seventh gear functions as a long-ratio overdrive for motorway cruising; the first six gears are spaced similarly to the 997.1\'s 6-speed manual. The PDK alternative offers meaningfully faster shift times; the 7MT offers a more traditional manual experience. Both are available on the base Carrera, Carrera S, C4, and C4S.',
    ],
    watch_for: [
      {
        title: '991.1 GT3 rod-bolt recall and finger-follower warranty',
        severity: 'concern',
        body: 'The 991.1 GT3 (MA175 engine, MY2014–2016) is subject to two Porsche-acknowledged engine campaigns. The 2014 NHTSA recall (14V-090) addressed a rod bolt torque specification issue in approximately 785 GT3s worldwide (~400 US); affected cars received complete engine replacements. Post-recall engines are identified by community shorthand as "G-code." The 2017 warranty extension covers all internal engine components for 10 years/120,000 miles from the original in-service date, fully transferable — meaning a used GT3 purchase may still be within warranty. Verify the engine code, recall history, and current warranty status before purchase. This campaign does NOT apply to the GT3 RS (MA176) or 911 R.',
        buyer_question: 'What is the engine code stamped on this GT3? Has the 2014 rod-bolt recall been completed, and is there documentation from Porsche? Is the 2017 finger-follower warranty extension still active — if so, through what date and mileage?',
      },
      {
        title: 'DFI intake valve carbon buildup (9A1 Carrera/Turbo engines)',
        severity: 'caution',
        body: 'All 991.1 Carrera, C4, S, 4S, GTS, Targa, Turbo, and Turbo S models use 9A1-family direct-injection engines. Direct injection does not wash the intake valves with fuel, allowing carbon to accumulate over high mileage (typically above 60,000–80,000 miles). Symptoms include rough idle and reduced throttle response. Remediation is walnut-shell blasting — an established non-invasive procedure costing approximately $400–$800 at a specialist. The 9A1\'s carbon buildup rate is notably less severe than on equivalent VW/Audi DFI engines.',
        buyer_question: 'At what mileage is the car currently? Have the intake valves been cleaned via walnut-shell blasting or an equivalent method? Is there any rough idle or hesitation that has been investigated?',
      },
      {
        title: 'EPAS (electromechanical power steering) feel — buyer expectation',
        severity: 'caution',
        body: 'All 991.1 trims use electromechanical power steering replacing the hydraulic rack of the 997. EPAS is not a mechanical defect — it is a design choice that has consistently divided enthusiast opinion. The feedback quality of the 991.1 EPAS is subjectively less communicative than the 997 hydraulic rack at the limit, particularly around the steering centre. This is worth a test drive evaluation, not a pre-purchase inspection item. The 991.2 EPAS was refined further; the 992 uses the same electromechanical approach.',
        buyer_question: 'Have you driven the car at speed and on varied road surfaces to evaluate the steering feel relative to your expectations? Is the steering self-centering appropriately and free of any wandering or dead zone at centre?',
      },
      {
        title: 'Secondary air injection pump and valve failure',
        severity: 'caution',
        body: 'US-specification 991.1 cars use a secondary air injection system for emissions compliance — pump and diverter valve failures are the most common emissions-related issue on 9A1-engined cars. Failure produces P0410 or P1411 fault codes and a CEL; the car runs normally but fails emissions testing. Repair cost: $200–$2,500 depending on which components have failed. Standard scan of fault codes is part of any pre-purchase inspection.',
        buyer_question: 'Is the check engine light currently illuminated? Has the car been scanned for fault codes, specifically P0410 or P1411? Has the secondary air injection system been inspected or serviced?',
      },
    ],
    service: [
      'Major service intervals for the 9A1 NA engines are 20,000 miles or annually using 0W-40 or 5W-40 full-synthetic. The PDK transmission (if equipped) requires fluid service every 40,000 miles — verify this is current on any used purchase, as PDK service history directly affects longevity. The 7MT requires a gearbox oil check at 40,000 miles; no scheduled fluid change in normal use.',
      'Pre-purchase inspection priorities for a 991.1 Carrera/S/C4/C4S/GTS/Targa: (1) SAI system scan for P0410/P1411 codes. (2) DFI carbon assessment on high-mileage examples — inquire about walnut blasting history above 70,000 miles. (3) PDK fluid condition and service history. (4) Steering — evaluate EPAS feel on a test drive. (5) For GT3 (MA175): confirm engine code and recall/warranty status before proceeding.',
      'GT3 (MA175) specific: Before completing any GT3 purchase, obtain the engine code (stamped on the block) and cross-reference with Porsche\'s recall database. G-code engines (post-recall replacement) are the desired state; E and F codes (community shorthand for pre-fix) require verification that the recall has been completed. Contact Porsche with the VIN for the authoritative warranty status. The finger-follower warranty extension is transferable and may still be active — this is a significant value consideration on low-mileage examples.',
    ],
    value_drivers: [
      {
        name: 'Last NA base Carrera',
        description: 'The 991.1 is the last generation with a naturally aspirated base Carrera engine. The 991.2 moved all variants to turbocharged direct injection — a strong long-term collector tailwind.',
      },
      {
        name: 'Manual vs. PDK',
        description: 'The 7-speed manual is increasingly collectible as PDK becomes dominant. The GT3 was PDK-only (MY2014–2016), making any 991.1 manual a more valued configuration long-term.',
      },
      {
        name: '911 R premium',
        description: 'The 911 R (2016, 991 units) — GT3 RS engine with a manual and no fixed wing — commands secondary-market premiums of 100–200% over MSRP. Documentation and low mileage are essential for full value.',
      },
      {
        name: 'Engine cleanliness (9A1)',
        description: 'The 9A1 engine has no intermediate shaft and no IMS bearing concern. Service priorities shift to SAI system status (P0410/P1411 codes), DFI carbon buildup above 70K miles, and PDK fluid condition.',
      },
      {
        name: 'GT3 recall status',
        description: 'The 991.1 GT3 (MA175 engine) is subject to NHTSA recall 14V-090 (rod bolts). Post-recall "G-code" engines are the verified state. A 10-year/120K-mile warranty extension may still be active.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 991.2 (2017–2019)
  // Source: docs/reference/porsche_2010s_reference.md §"991.2"
  //         docs/reference/defects/13_engine_9a1_9a2_9a3.md
  // ──────────────────────────────────────────────────────────────────────────
  '991.2': {
    positioning: 'First turbocharged base Carrera since 1989',
    intro: 'The 991.2 ended a 28-year run of naturally aspirated base 911s, introducing the 3.0L 9A2 twin-turbo to every non-GT Carrera trim. Simultaneously, the GT3 restored the manual gearbox and the GT2 RS reached 700 hp — the generation where the base cars went fully turbocharged while the GT program peaked.',
    production_years: '2017–2019',
    body_styles: 'Coupe, Cabriolet, Targa (AWD only)',
    engine: '3.0L 9A2 twin-turbo flat-six (Carrera/C4: 370 hp; Carrera S/4S/T: 420 hp; GTS: 450 hp); 3.8L 9A1 twin-turbo (Turbo: 540 hp; Turbo S: 580 hp); 4.0L NA flat-six (GT3/GT3 Touring: 500 hp; GT3 RS: 520 hp; Speedster: 502 hp); 3.8L 9A1 twin-turbo (GT2 RS: 700 hp)',
    cooling: 'Water-cooled',
    units_produced: '233,540 total across 991.1 + 991.2 combined (Porsche official); per-trim 991.2 breakdown not publicly released',
    notes: [
      'The 991.2\'s defining technical fact is the introduction of the 3.0L 9A2 twin-turbo flat-six to every non-GT Carrera trim — the first turbocharged base 911 since the 930 Turbo ended production in MY1989, a 28-year gap. The 9A2 produces 370 hp in Carrera/C4 tune and 420 hp in S/4S trim, versus the 991.1\'s 350 and 400 hp naturally aspirated figures respectively. The visual identifier separating 991.1 from 991.2 is the rear lighting: the 991.2 uses a thin horizontal strip connecting the tail lights for the brake light element, versus the 991.1\'s ringed LED design. The PCM infotainment moved to a new touchscreen generation simultaneously. Physical body shells carry over with minor revisions; the powertrain is the generation-defining change.',
      'The 991.2 GT3 (MY2018) is the direct response to the 991.1 GT3\'s PDK-only controversy. The new 4.0L NA flat-six, derived from the 991 RSR motorsport engine, revs to 9,000 rpm and produces 500 hp. The six-speed manual returned as a no-cost option — approximately 50/50 take rate between manual and PDK in some markets. The GT3 Touring (MY2018), offered as a no-cost option package on the GT3, deletes the fixed rear wing for a deployable Carrera-style spoiler and is available only with the manual gearbox. The 991.2 GT3 RS (MY2019) raised output to 520 hp from the same 4.0L unit; the optional Weissach Package adds magnesium BBS wheels (saving 11.5 kg unsprung) and additional carbon-fiber panels.',
      'The 991.2 Speedster (MY2019) closed the 991 generation: 1,948 units worldwide, referencing Porsche\'s 1948 founding year. VIN 1948/1948 — a Heritage Design Package Speedster — was the final car to leave the Zuffenhausen line on 20 December 2019. The GT2 RS (MY2018–2019) carried the production-911 power record at 700 hp from a 3.8L twin-turbo unit; the optional Weissach Package saved approximately 30 kg via carbon anti-roll bars, magnesium wheels, and titanium cage. The Turbo S Exclusive Series (500 Coupes worldwide, 200 Cabriolets NA-only) was the most extensively specified Manufaktur car of the 991 generation, with CFRP body parts and carbon-braided composite wheels.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: '2017–2019',
        drivetrain: 'RWD',
        power: '370 hp',
        description: '3.0L 9A2 twin-turbo — the first turbocharged base Carrera since the 930. 7MT or 7-speed PDK. Manual Carrera examples command a growing premium; manual take rate was approximately 30% in the US across the generation.',
      },
      {
        name: 'Carrera T',
        years: '2018–2019',
        drivetrain: 'RWD',
        power: '370 hp',
        description: 'Revives the 1968 T nameplate as a lightweight-focused base Carrera: mechanical LSD standard, PASM Sport suspension (20mm lower), Sport Chrono standard, shortened gear lever, reduced sound insulation, rear-seat delete optional. Same engine as base Carrera. Coupe only; 7MT standard, PDK optional.',
      },
      {
        name: 'Carrera S / Carrera 4S',
        years: '2017–2019',
        drivetrain: 'RWD / AWD',
        power: '420 hp',
        description: '3.0L 9A2 twin-turbo at higher boost; PASM active suspension standard. Carrera 4S uses the wide-body platform and PTM AWD. Most popular 991.2 Carrera tier.',
      },
      {
        name: 'Carrera GTS / 4 GTS',
        years: '2017–2019',
        drivetrain: 'RWD / AWD',
        power: '450 hp',
        description: 'First turbocharged Carrera GTS in 911 history. 3.0L 9A2 at 450 hp with Sport Chrono, sport exhaust, and PASM Sport standard. Four-wheel steering (rear-axle steering) was optional on GTS trims. Available as Coupe, Cabriolet; Targa 4 GTS also produced.',
      },
      {
        name: 'Turbo',
        years: '2017–2019',
        drivetrain: 'AWD',
        power: '540 hp',
        description: '3.8L 9A1 twin-turbo (+20 hp vs 991.1 Turbo); PDK only. Active aerodynamics (deployable front spoiler and rear wing) and rear-axle steering standard. Wide-body platform.',
      },
      {
        name: 'Turbo S',
        years: '2017–2019',
        drivetrain: 'AWD',
        power: '580 hp',
        description: '580 hp with Dynamic Boost PDK function; PCCB ceramic brakes standard. Turbo S Exclusive Series Coupe (500 units worldwide, 607 hp) and Cabriolet (200 units, NA-only allocation, 607 hp) represent the Manufaktur peak of the 991.2 Turbo line.',
      },
      {
        name: 'GT3 / GT3 Touring',
        years: '2018–2019',
        drivetrain: 'RWD',
        power: '500 hp',
        production: '~9,520 worldwide (GT3 + Touring combined); ~3,250 North America',
        description: '4.0L NA flat-six derived from 991 RSR motorsport engine; 9,000 rpm redline; 6MT or PDK at no cost from launch. GT3 Touring (6MT only) deletes the fixed rear wing for the deployable Carrera-style spoiler — the enthusiast daily-driver specification, at the same MSRP as the winged GT3.',
      },
      {
        name: 'GT3 RS',
        years: '2019',
        drivetrain: 'RWD',
        power: '520 hp',
        production: '~4,750 worldwide; ~1,760 North America (1,465 US + 295 Canada)',
        description: '4.0L NA; 9,000 rpm; PDK only. Nürburgring 6:56.4 at factory testing. Weissach Package adds magnesium BBS wheels (−11.5 kg unsprung), carbon-fiber panels, and stiffer suspension. Single model year.',
      },
      {
        name: 'GT2 RS',
        years: '2018–2019',
        drivetrain: 'RWD',
        power: '700 hp',
        production: '~1,000–1,580 worldwide (source conflict documented); ~1,000–1,315 North America',
        description: '700 hp from the 3.8L 9A1 twin-turbo; PDK only; fixed carbon-fiber rear wing. Most powerful production 911 ever at launch. Weissach Package (US +$31,000) saves ~30 kg via carbon anti-roll bars, magnesium wheels, and titanium roll cage.',
      },
      {
        name: 'Speedster',
        years: '2019',
        drivetrain: 'RWD',
        power: '502 hp',
        production: 'Exactly 1,948 worldwide; ~717 North America',
        description: 'Final 991-platform car. GT3 chassis and 4.0L NA drivetrain; 6MT only (lighter unit than standard 7MT); Carrera 4 Cabriolet body with extensive carbon-fiber panels; manually-folding top. Heritage Design Package available (two-tone GT Silver/white, cognac interior, race graphics). VIN 1948/1948 was the last car built.',
      },
    ],
    engineering: [
      '3.0L 9A2 twin-turbo replaces the 3.4/3.8L NA: The 9A2 is the first forced-induction unit in a base Carrera since the 930 ended in MY1989. It uses a twin-scroll twin-turbo layout (one per exhaust bank) in a compact packaging designed to minimize lag — in daily driving the 9A2 feels more flexible and accessible than the NA engines it replaced, with a broader torque curve. The trade-off is a different character at the limit: less high-rpm drama, more mid-range linearity. Power gains of 20 hp across Carrera/S and 50 hp on GTS represent the 9A2\'s output advantage.',
      '9A2 vs 9A1 distinction — no rod-bolt recall on 991.2: The 991.2 uses the 9A2, an evolution of the 9A1 sharing the same closed-deck block architecture and DFI. The critical distinction is that the 9A2 is NOT subject to NHTSA recall 14V-090 (the 991.1 GT3 MA175 rod-bolt issue). The 991.2 GT3\'s 4.0L engine is derived from the 991 RSR motorsport program — an entirely new unit from the 991.1 GT3\'s 3.8L MA175. No GT3 rod-bolt recall or finger-follower warranty extension applies to any 991.2 GT-car engine.',
      'Manual gearbox returns to GT3: The 991.2 GT3 (MY2018) offers a six-speed manual as a no-cost option from launch, resolving the PDK-only controversy that dominated the 991.1 GT3 era. The manual gearbox uses a shorter-ratio sixth gear than the 997.2 GT3\'s unit, optimizing the spread for circuit use. Rear-axle steering is standard on all GT3 variants regardless of transmission. Manual take rate was approximately 50% in some markets at launch.',
      'GT3 Touring format: The GT3 Touring is specified as a no-cost option package on the GT3 — not a separate model in Porsche\'s order system. Available only with the 6MT, it deletes the fixed rear wing for the deployable Carrera spoiler and adds brushed-aluminum window trim. Mechanically identical to a manual GT3. The format offers GT3 performance in a discreet, road-focused presentation without the RS\'s track-optimization priority.',
      'GT2 RS 700 hp and Weissach Package: The GT2 RS produces 700 hp from a PDK-only, RWD platform. The Weissach Package is the most comprehensive factory weight-reduction program applied to any 991-generation 911: carbon-fiber anti-roll bars and coupling rods (a motorsport-derived change also improving handling precision), magnesium BBS wheels saving approximately 8 kg per corner, titanium cage structure within the standard cabin, and additional CFRP panels. Combined saving: approximately 30 kg, reducing curb weight to approximately 1,440 kg.',
    ],
    watch_for: [
      {
        title: 'DFI intake valve carbon buildup (9A2 engines)',
        severity: 'caution',
        body: 'All 991.2 Carrera, S, C4S, T, GTS, and Targa variants use the 9A2 direct-injection engine. DFI does not wash intake valves with fuel; carbon accumulates over high mileage (typically above 60,000–80,000 miles), causing rough idle, reduced throttle response, and potential misfires. Remediation is walnut-shell blasting — a non-invasive procedure costing approximately $400–$800 at a specialist. The 9A2 shows similar carbon accumulation rates to the 9A1 it supersedes; this is a service item, not a structural concern.',
        buyer_question: 'At what mileage is the car currently? Have the intake valves been walnut-shell blasted above 70,000 miles? Is there any rough idle, hesitation, or misfires that have been investigated?',
      },
      {
        title: 'PDK transmission fluid service (7-speed)',
        severity: 'caution',
        body: 'The 7-speed PDK in 991.2 Carrera, S, C4S, GTS, Turbo, and Turbo S variants requires fluid and filter service every 40,000 miles per Porsche\'s schedule. Many owners extend or skip this service. Degraded PDK fluid causes shifting roughness, low-speed hesitation, and in advanced cases transmission damage. Verify PDK service history on any used purchase; an overdue service at 40,000-mile intervals is a negotiating point.',
        buyer_question: 'When was the PDK transmission fluid and filter last serviced, and at what mileage? Are there any shift quality concerns — hesitation, jerking at low speed, or refusal to engage a gear?',
      },
      {
        title: 'PCCB ceramic brake rotor wear',
        severity: 'caution',
        body: 'PCCB ceramic brakes are standard on the Turbo S and optional across most 991.2 trims. PCCB rotors cost $5,000–$10,000 per axle set to replace. Track use and aggressive street braking accelerate rotor wear. Minimum thickness markings are stamped on the rotor hat; also inspect for radial cracks extending to the friction ring edge — fine surface cracks in the ring are normal aging, but cracks through the ring indicate imminent replacement.',
        buyer_question: 'Are PCCB brakes fitted? What is the remaining rotor thickness at each corner versus the stamped minimum? Any track use — how many sessions and at which venues? Any cracking beyond surface crazing in the friction ring?',
      },
      {
        title: '9A1 GT3 rod-bolt recall — does not apply to 991.2',
        severity: 'caution',
        body: 'A common buyer confusion: NHTSA recall 14V-090 (rod-bolt torque specification, ~785 US cars) applies to the 991.1 GT3 with the MA175 3.8L engine only. The 991.2 GT3 uses a different 4.0L engine derived from the 991 RSR motorsport program. The recall does not apply to any 991.2 car. A seller presenting 991.2 GT3 recall documentation tied to the 14V-090 campaign has misidentified the car. Verify the model year on the title and confirm it is 2018 or later.',
        buyer_question: 'Is this confirmed as a 991.2 (MY2018 or later) GT3 by VIN and title? Has the seller confused any recall paperwork with the 991.1 MA175 rod-bolt recall, which does not apply to 991.2 engines?',
      },
      {
        title: 'PCM software calibration updates — early MY2017 cars',
        severity: 'caution',
        body: 'Some early MY2017 991.2 base Carrera and Carrera S cars had PCM software with throttle-tip-in behavior that owners found abrupt in Normal mode. Porsche issued software updates improving drivability calibration. This is a software service item, not a mechanical failure; confirm the current calibration level at a dealer. Also relevant for Sport mode PDK shift aggression settings on early production.',
        buyer_question: 'For a MY2017 car: Has the PCM software been updated to the current production calibration? Is there any throttle hesitation or abruptness at tip-in in Normal driving mode?',
      },
    ],
    service: [
      'Major service intervals for the 9A2 twin-turbo are 20,000 miles or annually using 0W-40 or 5W-40 full-synthetic. The 7-speed PDK requires fluid and filter service every 40,000 miles — verify this is current on any used purchase. On examples above 60,000–80,000 miles, inquire about walnut-shell intake valve cleaning history; DFI carbon buildup is a normal service item on high-mileage 9A2 cars.',
      'Pre-purchase inspection priorities for 991.2 Carrera/S/C4S/GTS/T/Targa: (1) Confirm 9A2 engine by model year (MY2017–2019) and VIN. (2) PDK fluid service date and mileage. (3) SAI system scan for P0410/P1411 fault codes. (4) DFI carbon status on examples above 70,000 miles. (5) On GTS or any car with optional rear-axle steering: verify 4WS system operation on a test drive. (6) PCM software calibration version for early MY2017 cars.',
      'GT3 / GT3 Touring / GT3 RS / GT2 RS / Speedster service priorities: (a) Track-use history — service records should disclose track sessions; many GT and GT2 RS owners track their cars. (b) Clutch wear on 6MT cars (track use significantly accelerates wear). (c) PCCB rotor condition and measured thickness. (d) Oil specification — GT department recommends 0W-40 full-synthetic and adherence to annual oil change regardless of mileage. (e) Speedster manually-folding top condition and sealing integrity.',
    ],
    value_drivers: [
      {
        name: 'Manual transmission',
        description: 'Manual-equipped 991.2 Carreras, Carrera T, and GT3/GT3 Touring cars command a growing premium over PDK equivalents. The GT3 manual/PDK split was approximately neutral at MSRP; on the secondary market, manual GT3 and GT3 Touring examples trade at a meaningful premium as the car ages into collector territory.',
      },
      {
        name: 'Speedster rarity and generation-closing status',
        description: 'The 991.2 Speedster (1,948 units worldwide) was the final 991-platform car. Heritage Design Package Speedsters are less common and carry a premium; standard-color examples are more liquid. The car\'s historical status as the last 991 produced is durable collector appeal.',
      },
      {
        name: 'GT3 Touring specification',
        description: 'The 991.2 GT3 Touring — wingless, 6MT only, GT3 performance — is the definitive driver-focused daily-usable 991.2. Original factory Touring-spec cars are identifiable from build documentation and command a premium over equivalent standard GT3 configurations.',
      },
      {
        name: 'GT2 RS with Weissach Package',
        description: 'The 991.2 GT2 RS (700 hp, approximately 1,000–1,580 worldwide) was the most powerful production 911 ever at launch. Weissach Package cars (carbon anti-roll bars, magnesium wheels, titanium cage, −30 kg) are the preferred specification; original Weissach documentation substantially increases value.',
      },
      {
        name: 'Turbo S Exclusive Series',
        description: 'The Turbo S Exclusive Series (500 Coupes worldwide, 200 Cabriolets NA-only) is the most comprehensively specified Manufaktur 991.2. CFRP body components, individually numbered plaques on each fender, and carbon-braided wheels distinguish it from standard Turbo S production.',
      },
      {
        name: 'Carrera GTS — first turbocharged GTS',
        description: 'The 991.2 GTS was the first turbocharged Carrera GTS in 911 history, marking the end of the naturally aspirated GTS era. Buyers comparing 991.1 NA GTS (collector tailwind for natural aspiration) versus 991.2 turbocharged GTS (more power, newer chassis) must weigh collector thesis against daily-use priorities.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 992.1 (2020–2024)
  // Source: docs/reference/porsche_2020s_reference.md §"992.1"
  //         docs/reference/defects/13_engine_9a1_9a2_9a3.md
  // ──────────────────────────────────────────────────────────────────────────
  '992.1': {
    positioning: 'All-new platform — wide arches standardized, GT3 manual restored',
    intro: 'The 992.1 debuted MY2020 on an all-new platform: 45mm wider body with uniform wide rear arches across all variants, an 8-speed PDK, and the first 911 GT3 to offer both manual and PDK as no-cost options from launch. An unusually dense limited-edition program — Sport Classic, Dakar, S/T, and Heritage Design editions — defines the generation\'s collector character.',
    production_years: '2020–2024',
    body_styles: 'Coupe, Cabriolet, Targa (4 and 4S only)',
    engine: '3.0L 9A2 Evo twin-turbo flat-six (Carrera/S/4/4S/GTS/Dakar: 379–473 hp); 3.745L 9A2 twin-turbo (Turbo: 572 hp; Turbo S: 641 hp); 3.7L 9A2 Evo twin-turbo (Sport Classic: 543 hp); 4.0L NA flat-six (GT3/GT3 RS/GT3 Touring/S/T: 502–525 hp)',
    cooling: 'Water-cooled',
    units_produced: 'Production ran MY2020–MY2024; per-trim data not publicly broken out. GT3 + GT3 Touring combined: 15,667 worldwide / 5,328 North America per registry compilation.',
    notes: [
      'The 992 launched MY2020 as the widest 911 ever produced at base specification — all variants use the wide rear arches previously reserved for wide-body Carrera 4S and Turbo trims in prior generations. The body is 45mm wider than the 991.2, uses expanded aluminum construction, and standardizes the Turbo\'s dramatic rear haunches as the platform baseline. The 8-speed PDK replaced the 7-speed unit, with the architecture deliberately designed to accommodate a hybrid motor in the bell housing — a provision that went unused on all 992.1 production trims and was first activated in the 992.2 GTS T-Hybrid. The Carrera S became the highest-volume 992.1 trim per Porsche\'s own internal sales reporting.',
      'The 992.1 GT3 (MY2022) is the first 911 GT3 in any generation to offer both six-speed manual and seven-speed PDK as no-cost options from the first day of ordering. Porsche disclosed approximately 50% manual take rate in some markets in the first year of production. The GT3 RS (MY2023) introduced a DRS-style active aerodynamic system generating 860 kg of downforce at 285 km/h — more than many dedicated track cars. The S/T (MY2024, 1,963 units) pairs the GT3 RS 4.0L engine at 525 hp with a six-speed short-ratio manual and an approximately 1,380 kg curb weight, making it the lightest production 992 and the most powerful manual-transmission 911 at its launch.',
      'The 992.1 produced the densest limited-edition program of any modern 911 generation. The Dakar (2,500 units, MY2023) is the first production off-road-capable 911 since the Porsche 959 — 50mm raised suspension, pneumatic lift system, Pirelli all-terrain tires. The Sport Classic (1,250 units, MY2023, Heritage Design #2) combines the Turbo wide-body with a seven-speed manual, RWD, 543 hp, and a ducktail spoiler. The Targa 4S Heritage Design Edition (992 units, MY2021) was the first Heritage Design 911. The S/T (MY2024, 1,963 units) is the 60th-anniversary 911, with its production count matching the year of the 911\'s debut.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: '2020–2024',
        drivetrain: 'RWD',
        power: '379 hp',
        description: '3.0L 9A2 Evo twin-turbo; 8-speed PDK or 7-speed manual as no-cost option. All 992.1 variants use wide rear arches — the base Carrera is visually as broad as the prior generation\'s Turbo.',
      },
      {
        name: 'Carrera S / Carrera 4S',
        years: '2020–2024',
        drivetrain: 'RWD / AWD',
        power: '443 hp',
        description: '3.0L 9A2 Evo at higher boost; PASM Sport standard. Carrera S is the highest-volume 992.1 trim. Carrera 4S uses PTM AWD. Both available as Coupe and Cabriolet.',
      },
      {
        name: 'Targa 4 / Targa 4S',
        years: '2021–2024',
        drivetrain: 'AWD',
        power: '379 / 443 hp',
        description: 'Classic Targa-bar body, AWD only. The Targa 4S Heritage Design Edition (MY2021, 992 units) is the first Heritage Design 911 — Cherry Metallic launch color, gold period-correct lettering, heritage badging.',
      },
      {
        name: 'Carrera T',
        years: '2023–2024',
        drivetrain: 'RWD',
        power: '379 hp',
        description: 'Lightweight-focused Carrera: 7-speed manual standard (PDK optional), PASM Sport (10mm lower), no rear seats, reduced insulation. Returns as a regular catalogue model for MY2023. After the 992.2 dropped the manual Carrera S, the 992.1 Carrera T manual became the most recent non-GT manual 911 above the base Carrera.',
      },
      {
        name: 'Carrera GTS / 4 GTS',
        years: '2022–2024',
        drivetrain: 'RWD / AWD',
        power: '473 hp',
        description: '3.0L 9A2 Evo with GTS-specific intercooler relocation and higher boost; PASM Sport standard. Optional Aerokit replaces the deployable rear spoiler with a fixed wing. GTS family (Coupe, Cabriolet, 4 GTS, Targa 4 GTS) launched MY2022.',
      },
      {
        name: 'Turbo / Turbo S',
        years: '2020–2024',
        drivetrain: 'AWD',
        power: '572 / 641 hp',
        description: '3.745L 9A2 twin-turbo; PDK only; AWD. Turbo 50 Years (MY2024, 1,974 units) closed the 992.1 Turbo line with a Ferry Porsche tribute Tartan interior and $270,500 US MSRP.',
      },
      {
        name: 'Sport Classic',
        years: '2023',
        drivetrain: 'RWD',
        power: '543 hp',
        production: '1,250 worldwide',
        description: '3.7L 9A2 Evo twin-turbo; 7-speed manual only; Turbo wide-body platform on RWD. Heritage Design #2: ducktail rear spoiler, Sport Classic Grey Metallic (exclusive color), Pepita houndstooth seat inserts. The only modern production 911 combining the Turbo wide-body with a manual transmission and rear-wheel drive. MSRP $283,430 US.',
      },
      {
        name: 'Dakar',
        years: '2023',
        drivetrain: 'AWD',
        power: '473 hp',
        production: '2,500 worldwide',
        description: '3.0L 9A2 Evo; PDK only; AWD; 50mm raised standard ride height; pneumatic +30mm lift system; Pirelli Scorpion All Terrain Plus tires; no rear seats. Optional Rallye Design Package homages the 1984 Porsche 953 Paris-Dakar winner. MSRP $223,450 US.',
      },
      {
        name: 'GT3 / GT3 Touring',
        years: '2022–2024',
        drivetrain: 'RWD',
        power: '502 hp',
        production: '15,667 worldwide (GT3 + Touring combined); 5,328 North America',
        description: '4.0L NA flat-six; 6MT or 7-speed PDK as no-cost options from launch. GT3 Touring uses deployable rear spoiler; unlike the 991.2 Touring, it is available with both manual and PDK. Unequal-length control-arm front suspension derived from the 991 RSR.',
      },
      {
        name: 'GT3 RS',
        years: '2023–2024',
        drivetrain: 'RWD',
        power: '518 hp',
        production: '~5,000 worldwide est. (allocation-disciplined, not officially limited)',
        description: '4.0L NA; PDK only; DRS-style active aerodynamics generating 860 kg downforce at 285 km/h. Weissach Package available; GT3 RS Carrera RS Tribute Edition (150 US units, White/Python Green) produced alongside. MSRP $241,300 US.',
      },
      {
        name: '911 S/T',
        years: '2024',
        drivetrain: 'RWD',
        power: '525 hp',
        production: '1,963 worldwide',
        description: 'GT3 RS 4.0L engine with six-speed short-ratio manual; lightest 992 at approximately 1,380 kg. Carbon-fiber roof, carbon-fiber doors, no rear seats, no PDCC. Heritage Design Package optional. Production count references the 1963 debut year. MSRP ~$292,000 US.',
      },
    ],
    engineering: [
      'All-new 992 platform — wide body and 8-speed PDK: The 992 is 45mm wider than the 991.2, with wide rear arches standardized across all trims. The new 8-speed PDK was designed from the outset with a hybrid motor provision in the bell housing — unfulfilled in 992.1 production and first activated in the 992.2 GTS T-Hybrid. LED matrix headlamps, a digital-centre-tachometer cluster with analogue-style display (replacing the fully analogue 991.2 cluster), and expanded aluminum construction are the other major platform-level changes.',
      '992.1 GT3 — both manual and PDK from launch: The 992.1 GT3 is the first in the GT3 lineage to offer both six-speed manual and seven-speed PDK as no-cost options from the first day of ordering — resolving the debate that defined GT car discourse since the 991.1\'s PDK-only GT3 debut. The GT3 Touring (no fixed wing, deployable spoiler, both manual and PDK available) breaks from the 991.2 Touring\'s manual-only restriction. Combined 992.1 GT3 + Touring production reached 15,667 worldwide per registry compilation.',
      'GT3 RS active aerodynamics: The 992.1 GT3 RS is the most aerodynamically complex road-legal 911 produced to its launch date. The DRS-style rear wing uses an active element that flattens under braking and opens in straight-line running. Combined with swan-neck wing mounts, enlarged front splitter dive planes, and NACA-duct front fender intakes, the system generates 860 kg of downforce at 285 km/h — exceeding many track-dedicated machines. Controlled entirely by the PCM without driver input.',
      'Sport Classic — manual wide-body Turbo-chassis 911: The Sport Classic (1,250 units, MY2023) is the first production Porsche to combine the Turbo\'s wide-body platform with rear-wheel drive and a manual gearbox since the 993 era. The 3.7L engine produces 543 hp — the highest-output manual-transmission 992.1 and one of only three production 911s ever offered with a manual above 500 hp. Heritage Design status means individually numbered Manufaktur production.',
      'S/T — lightest 992.1, GT3 RS engine, 6MT: The 911 S/T (1,963 units, MY2024) uses the GT3 RS 4.0L engine at 525 hp paired with a six-speed short-ratio manual. Curb weight of approximately 1,380 kg is about 70 kg lighter than the GT3 RS, achieved through carbon-fiber roof and doors, absence of rear seats, and removal of PDCC. The 1,963-unit production number references the 1963 Frankfurt Motor Show debut of the 911.',
    ],
    watch_for: [
      {
        title: 'Coolant pipe failure — early 992.1 production (MY2020–MY2021)',
        severity: 'concern',
        body: 'Early 992.1 production cars (some MY2020–MY2021 Carrera and Carrera S) were affected by a coolant pipe connection failure in the intercooler area in which a plastic fitting could develop a leak, causing coolant loss and potential overheating with minimal warning. Porsche issued a service campaign for affected VIN ranges. Verify at a Porsche dealer that any early-production 992.1 has had the campaign completed. Later production (MY2022+) received revised fittings from the factory.',
        buyer_question: 'For a MY2020 or MY2021 992.1 Carrera: Has Porsche\'s coolant pipe service campaign been completed on this specific VIN? Is there a Porsche service history printout documenting the campaign completion date and mileage?',
      },
      {
        title: 'DFI intake valve carbon buildup (9A2 Evo)',
        severity: 'caution',
        body: 'All 992.1 Carrera through GTS trims use the 9A2 Evo direct-injection engine. Carbon accumulates on intake valve heads and seats over high mileage (typically above 60,000–80,000 miles). Most 992.1 examples entering the used market are still below this threshold given the generation\'s MY2020 launch date, but verify on any high-mileage example. Remediation is walnut-shell blasting ($400–$800).',
        buyer_question: 'At what mileage is the car? Have the intake valves been walnut-shell blasted on examples above 70,000 miles? Any rough idle, hesitation, or reduced power complaints?',
      },
      {
        title: 'PDK (8-speed) transmission fluid service',
        severity: 'caution',
        body: 'The 992.1\'s 8-speed PDK requires fluid and filter service every 40,000 miles. The 8-speed unit is a new generation from the 991.2\'s 7-speed, with revised fluid specifications. Many owners extend or miss this interval. Degraded fluid causes shifting roughness and over extended periods, internal wear. Verify PDK service history on any used purchase.',
        buyer_question: 'When was the 8-speed PDK fluid and filter last serviced, and at what mileage? Any shift quality concerns — hesitation, roughness at low speed, or delayed engagement in any gear?',
      },
      {
        title: 'PCCB rotor wear on GT3 RS, S/T, and Turbo S',
        severity: 'caution',
        body: 'PCCB ceramic brakes are standard on the Turbo S, GT3 RS, S/T, and Dakar; optional on most other trims. The 992.1 GT3 RS uses larger rotors than prior GT3 RS generations, with correspondingly higher replacement cost ($6,000–$12,000 per axle set estimated). Inspect for radial cracks extending to the friction ring edge (surface crazing is normal aging) and measure rotor thickness against the stamped minimum on the hat.',
        buyer_question: 'Are PCCB brakes fitted? What is the current rotor thickness versus the minimum specification? Any track use disclosed? Visible cracking in the friction ring beyond surface crazing?',
      },
      {
        title: 'GT3 RS and S/T documentation — allocation cars, secondary-market provenance',
        severity: 'caution',
        body: 'The 992.1 GT3 RS and S/T are relationship-allocated cars that routinely traded above MSRP on the secondary market in 2023–2024. When evaluating either car, verify the factory order documentation, Porsche Certificate of Authenticity, and full title history. Cars presented without factory order paperwork or with undisclosed mileage gaps have a higher incidence of title complications or undisclosed track use.',
        buyer_question: 'Does the car have its original factory order sheet and Porsche Certificate of Authenticity? What is the complete purchase history — original dealer, original buyer, and all subsequent transfers? Has a vehicle history report been run?',
      },
    ],
    service: [
      'Major service intervals for the 9A2 Evo are 20,000 miles or annually using 0W-40 or 5W-40 full-synthetic. The 8-speed PDK requires fluid service every 40,000 miles. For early 992.1 cars (MY2020–MY2021), confirm the coolant pipe service campaign has been completed before purchase — this is the single highest-priority pre-purchase check on those VIN ranges.',
      'Pre-purchase inspection priorities for a 992.1 Carrera/S/C4S/GTS/T/Targa: (1) Coolant pipe campaign completion on MY2020–MY2021 cars. (2) PDK fluid service record. (3) SAI system scan for P0410/P1411 fault codes. (4) DFI carbon status on examples above 60,000 miles. (5) For GTS with Aerokit: verify fixed wing is factory-installed, not aftermarket. (6) For GT3 RS and S/T: factory order documentation and CoA.',
      'GT car (GT3, GT3 Touring, GT3 RS, S/T) service priorities: clutch wear on manual-equipped cars (track use significantly accelerates wear), PCCB rotor thickness measurement, oil service records with confirmed specification (Mobil 1 0W-40 or equivalent, annual change regardless of mileage), and full disclosure of any track sessions. The S/T\'s carbon-fiber doors and roof are structural — verify no hidden collision damage on any lightweight panel.',
    ],
    value_drivers: [
      {
        name: 'Sport Classic — manual wide-body, 1,250 units',
        description: 'The 992.1 Sport Classic combines the Turbo wide-body with a seven-speed manual and RWD — a combination with no prior modern 911 precedent. Heritage Design status and 1,250-unit production cap have driven consistent secondary-market premiums above the $283,430 MSRP.',
      },
      {
        name: '911 S/T — lightest 992, GT3 RS engine, 6MT only',
        description: 'The 992.1 S/T (1,963 units) pairs the GT3 RS 4.0L engine at 525 hp with a six-speed manual and a 1,380 kg curb weight — the lightest 992.1 variant. Heritage Design Package adds further premium. It is the most powerful manual-transmission 911 in production at its launch date.',
      },
      {
        name: 'Dakar — only production off-road 911 since the 959',
        description: 'The 992.1 Dakar (2,500 units worldwide) is unique: raised all-terrain suspension, Pirelli Scorpion tires, and pneumatic lift. The first production off-road-capable 911 since the Porsche 959. Early examples have appreciated from the $223,450 MSRP; Rallye Design Package cars carry additional premium.',
      },
      {
        name: 'Targa 4S Heritage Design Edition — first Heritage Design 911',
        description: 'The Targa 4S Heritage Design Edition (992 units, MY2021) is the inaugural Heritage Design 911. Cherry Metallic paint, gold lettering, and period-correct badging distinguish it from standard Targa production; all subsequent Heritage Design 911s have appreciated from MSRP.',
      },
      {
        name: 'Carrera T manual — most recent manual non-GT Carrera',
        description: 'After the 992.2 eliminated the manual from the Carrera S and GTS, the 992.1 Carrera T (7-speed manual, lightweight) became the most recent non-GT3 manual-transmission 911 available. This structural shift in the lineup has driven growing recognition and a modest premium on manual-equipped examples.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 992.2 (2024–present)
  // Source: docs/reference/porsche_2020s_reference.md §"992.2"
  //         docs/reference/defects/13_engine_9a1_9a2_9a3.md
  // ──────────────────────────────────────────────────────────────────────────
  '992.2': {
    positioning: 'First hybrid 911 — T-Hybrid and new 9A3 engine',
    intro: 'The 992.2 arrived MY2025 with two simultaneous changes: the first production hybrid 911 (the Carrera GTS T-Hybrid using the all-new 9A3 engine with eTurbo), and a decisive narrowing of manual-transmission availability to the Carrera T and GT3/GT3 Touring only. Production is ongoing.',
    production_years: '2024–present',
    body_styles: 'Coupe, Cabriolet, Targa (4S only confirmed at launch)',
    engine: '3.0L 9A2 Evo twin-turbo flat-six (Carrera/S/4S/T: 388–473 hp); 3.6L 9A3 T-Hybrid flat-six (GTS variants: 541 hp; Turbo S T-Hybrid: 701 hp); 4.0L NA flat-six (GT3/GT3 Touring: 503 hp)',
    cooling: 'Water-cooled; 9A3 T-Hybrid variants also use a separate 400V battery cooling circuit',
    units_produced: 'Production ongoing — MY2025–present. Full-generation totals not yet available.',
    notes: [
      'The 992.2 is the most consequential mid-cycle update in modern 911 history because it introduces a fundamentally new engine family, not merely a revised tune. The 9A3 flat-six, developed for T-Hybrid integration, uses a 400-volt electrical architecture, redesigned cylinder heads, repositioned intercoolers, and eTurbo turbocharger units that incorporate small electric motors on the turbine shafts to eliminate lag at low rpm. The system is non-plug-in: the 1.9 kWh battery recharges via brake regeneration and through the eTurbo acting as a generator. On the Carrera GTS T-Hybrid (RWD), one eTurbo and one electric motor integrated into the 8-speed PDK produce 541 hp. The 992.2 Turbo S T-Hybrid (MY2026, 701 hp) uses two eTurbos and is the most powerful production 911 ever built.',
      'The 992.2 narrowed manual-transmission availability decisively. At launch (MY2025), the manual Carrera S and GTS family — which had been no-cost options in the 992.1 — were discontinued. Through early 2026, manual 992.2 variants are the Carrera T (manual-only) and the GT3/GT3 Touring (manual or PDK at no cost). The base Carrera (PDK-only at launch), Carrera S (PDK-only), and Carrera GTS T-Hybrid (PDK-only, integral to the T-Hybrid system) are all automatic-only. This is a structural shift: a manual non-GT 911 now means the Carrera T exclusively, making the 992.1 manual-transmission Carrera S the last of its kind.',
      'The 992.2 cycle continues the dense limited-edition cadence established in the 992.1. The Spirit 70 (MY2026, 1,500 units) is Heritage Design #3 — a GTS Cabriolet T-Hybrid in Olive Neo metallic with Pasha fabric interior referencing 1970s Porsche heritage. A Carrera T Club Coupe (MY2026, PCA partnership) is in production. The 992 GT2 RS had not been officially launched as of April 2026 despite extensive spy reports. The Turbo S T-Hybrid ($272,650 US MSRP with destination, MY2026) represents a $31,000–$34,000 increase over the outgoing 992.1 Turbo S and sets the platform\'s performance ceiling at 701 hp with a 7:03.92 Nürburgring lap.',
    ],
    variants: [
      {
        name: 'Carrera',
        years: '2024–present',
        drivetrain: 'RWD',
        power: '388 hp',
        description: '3.0L 9A2 Evo twin-turbo; 8-speed PDK only — no manual at launch. Revised fascias with larger functional intakes feeding relocated intercoolers; fully digital 12.65-inch curved instrument cluster; push-button start (replacing left-hand ignition key); full-width rear light bar with integrated Porsche script.',
      },
      {
        name: 'Carrera T',
        years: '2024–present',
        drivetrain: 'RWD',
        power: '388 hp',
        description: 'The only non-GT3 manual-transmission 992.2 variant. 7-speed manual standard; PASM Sport, reduced insulation, no rear seats optional. With the Carrera S and GTS now PDK-only, the 992.2 Carrera T is the default choice for any buyer seeking a manual gearbox below the GT3 tier.',
      },
      {
        name: 'Carrera S / Carrera 4S / Targa 4S',
        years: '2025–present',
        drivetrain: 'RWD / AWD',
        power: '473 hp',
        description: '3.0L 9A2 Evo with new turbochargers and relocated intercoolers; +30 hp versus 992.1 Carrera S. 8-speed PDK only — manual dropped for all three variants. Carrera S launched January 2025; Carrera 4S and Targa 4S revealed July 2025.',
      },
      {
        name: 'Carrera GTS T-Hybrid',
        years: '2024–present',
        drivetrain: 'RWD / AWD',
        power: '541 hp',
        description: 'First production hybrid 911 in any generation. 3.6L 9A3 flat-six with single eTurbo and electric motor in 8-speed PDK housing; 1.9 kWh 400V battery (non-plug-in); PDK only. Available as GTS (RWD Coupe and Cabriolet), Carrera 4 GTS (AWD), and Targa 4 GTS (AWD).',
      },
      {
        name: 'Spirit 70',
        years: '2026',
        drivetrain: 'RWD',
        power: '541 hp',
        production: '1,500 worldwide',
        description: 'Heritage Design #3. GTS Cabriolet T-Hybrid base; Olive Neo metallic exclusive paint; Pasha fabric interior referencing 1970s Porsche; Bronzite lower body and five-spoke Fuchs-style wheels. Cabriolet only. MSRP $242,250 US with destination.',
      },
      {
        name: 'GT3 / GT3 Touring (992.2)',
        years: '2024–present',
        drivetrain: 'RWD',
        power: '503 hp',
        description: '4.0L NA flat-six (carry-over architecture, revised gearing); 6MT or 7-speed PDK at no cost. Lower final-drive ratio vs 992.1 GT3 improves 0–100 km/h marginally; top speed reduces slightly to 311 km/h. GT3 Touring available with both manual and PDK. Revealed October 2024.',
      },
      {
        name: 'Turbo S T-Hybrid',
        years: '2025–present (MY2026)',
        drivetrain: 'AWD',
        power: '701 hp (711 PS)',
        description: 'Most powerful production 911 ever built. 3.6L 9A3 with two eTurbos (vs one on GTS) plus electric motor in PDK; 1.9 kWh battery. Nürburgring 7:03.92. Standard 420mm/410mm PCCB — largest ceramic brake system ever fitted to a two-door Porsche. MSRP $272,650 US (Coupe with destination).',
      },
    ],
    engineering: [
      '9A3 engine and T-Hybrid architecture: The 9A3 is a clean-sheet flat-six designed around the T-Hybrid powertrain. It uses a 400-volt electrical architecture, revised two-piece exhaust headers, redesigned cylinder heads, repositioned intercoolers, and eTurbo units incorporating small electric motors on the turbine shafts. The eTurbo motors can spool the turbine before exhaust gas reaches operating pressure, eliminating lag across the rpm range. The system is non-plug-in; the 1.9 kWh battery recharges via regenerative braking and eTurbo regeneration in overrun. Total system weight increase over the 992.1 GTS is approximately 50 kg on the GTS; approximately 85 kg on the Turbo S.',
      'Two eTurbos on Turbo S vs one on GTS: The 992.2 GTS uses one eTurbo; the Turbo S T-Hybrid uses two (one per exhaust bank). This creates a deliberate performance hierarchy: GTS (541 hp) is the entry-point T-Hybrid, while the Turbo S (701 hp) doubles the eTurbo count and adds more aggressive intercooling. The Turbo S also receives electro-hydraulic PDCC (ehPDCC) actuated by the 400V battery for faster response, and an optional front-axle lift system on the same electrical circuit.',
      'Manual transmission narrowing in 992.2: The 992.2 eliminates the manual from every Carrera-tier variant except the Carrera T. Base Carrera, Carrera S, Carrera 4S, and the entire GTS family are PDK-only in the 992.2. The Carrera T (manual-only) and GT3/GT3 Touring (manual or PDK) are the only remaining manual options through Q1 2026. This makes the 992.1 manual Carrera S, manual Carrera GTS, and manual base Carrera the last of their kind within the 992 platform.',
      'Cabin and electronics overhaul across all 992.2 trims: The 992.2 introduces a fully digital curved 12.65-inch instrument cluster, replacing the 992.1\'s analogue central tachometer. A push-button start replaces the traditional left-hand ignition key. Revised PCM infotainment includes Apple CarPlay+ integration. The front headlamp functions are consolidated into the Matrix LED units (no separate indicator housing in the bumper). The rear features a full-width light bar with integrated Porsche script in raised lettering. These changes apply across all 992.2 trims including GT3.',
      '992.2 GT3 — carry-over engine, lower final drive: The 992.2 GT3 retains the 4.0L NA flat-six at 503 hp (same as 992.1). The engineering change is a lower final-drive ratio improving 0–100 km/h by approximately 0.2 seconds; top speed reduces slightly to 311 km/h. GT3 Touring continues with both manual and PDK, breaking from the 991.2 Touring\'s manual-only restriction (which it had established and then revised in the 992.1). This signals Porsche\'s intent to maintain the Touring as a format option regardless of transmission preference.',
    ],
    watch_for: [
      {
        title: 'T-Hybrid system longevity — limited service history data',
        severity: 'caution',
        body: 'The 9A3 T-Hybrid system debuted MY2025; as of 2026, no long-term field data exists on eTurbo motor durability, 400V battery degradation rate, or inverter reliability. For early-adopter purchases, Porsche\'s new-car warranty covers all hybrid components. Used buyers should verify remaining warranty coverage and request a hybrid system health check at a Porsche dealer scanning for eTurbo and battery management fault codes. This is a caution flag for uncertainty, not a documented failure mode.',
        buyer_question: 'For a 9A3 T-Hybrid car: What is the remaining factory warranty period on the hybrid system? Has a Porsche dealer health check of the eTurbo and battery management system been performed? Are there any stored fault codes in the hybrid system modules?',
      },
      {
        title: 'PCCB rotor wear on Turbo S T-Hybrid',
        severity: 'caution',
        body: 'The 992.2 Turbo S T-Hybrid uses the largest ceramic composite brake system ever fitted to a two-door Porsche (420mm front / 410mm rear). As of early 2026, first-cycle replacement costs have not yet been widely documented in the market, but will exceed prior Turbo S PCCB costs given the larger rotor diameter. Inspect for radial cracks in the friction ring and measure rotor thickness against the stamped minimum.',
        buyer_question: 'Are the PCCB brakes standard fitment (they should be on Turbo S T-Hybrid)? What is the current rotor thickness versus minimum specification? Any track use disclosed? Visual cracking in the friction ring beyond surface crazing?',
      },
      {
        title: 'PDK fluid service (8-speed)',
        severity: 'caution',
        body: 'The 992.2 uses the same 8-speed PDK architecture as the 992.1. PDK fluid service every 40,000 miles is required. Most 992.2 examples as of 2026 are low-mileage new-car or near-new-car purchases and are unlikely to have overdue PDK service; verify as the odometer approaches the 40,000-mile interval.',
        buyer_question: 'What is the current mileage? Has the 8-speed PDK fluid and filter been serviced if mileage approaches 40,000 miles? Any shift quality concerns?',
      },
      {
        title: 'Manual transmission availability — Carrera T and GT3 only in 992.2',
        severity: 'caution',
        body: 'A 992.2 Carrera S, Carrera GTS, or base Carrera (non-T) does not exist with a manual transmission. Buyers expecting a manual-transmission 992.2 must choose either the Carrera T (manual-only, no rear seats optional, lightweight focus) or the GT3/GT3 Touring (manual or PDK, track-focused character). A listing claiming a "manual 992.2 Carrera S" or "manual 992.2 GTS" is either misrepresenting the car or presenting a 992.1 (check the model year on the title).',
        buyer_question: 'Does this car\'s build documentation confirm the exact transmission and trim? For a Carrera or GTS claimed to have a manual, verify by VIN that it is a Carrera T (or GT3 Touring) and not a standard Carrera or GTS — those variants are PDK-only in the 992.2.',
      },
    ],
    service: [
      'The 992.2 launched MY2025 and production is ongoing. Most examples entering the market through 2026 are either new cars or low-mileage cars within the original factory warranty. Service intervals are 20,000 miles or annually for 9A2 Evo variants; the 9A3 T-Hybrid service schedule has not yet been documented through a first full service interval in the market. All servicing within warranty should be performed at a Porsche dealer or authorized facility to preserve coverage.',
      'Pre-purchase inspection priorities for a 992.2: (1) Confirm the specific engine family — 9A2 Evo (Carrera, Carrera S, Carrera T, GT3/GT3 Touring), or 9A3 T-Hybrid (GTS, Turbo S T-Hybrid). (2) On 9A3 T-Hybrid cars, request a Porsche dealer hybrid system health check and scan for eTurbo or battery management fault codes. (3) On GT3/GT3 Touring manual-equipped cars, verify clutch condition. (4) On Turbo S T-Hybrid, PCCB rotor inspection and track-use disclosure are essential given the car\'s performance envelope. (5) Verify remaining factory warranty period and check for any open Porsche service campaigns by VIN before completing any purchase.',
    ],
    value_drivers: [
      {
        name: 'Carrera T — sole non-GT3 manual in the 992.2 lineup',
        description: 'The 992.2 Carrera T is the only 992.2 variant below the GT3 with a manual gearbox. With the Carrera S, GTS, and base Carrera all PDK-only, the Carrera T occupies a structurally unique position. Manual Carrera T examples already carry a premium over PDK-equipped production.',
      },
      {
        name: 'Spirit 70 — Heritage Design #3 on hybrid platform',
        description: 'The Spirit 70 (1,500 units worldwide, MY2026) is the first Heritage Design 911 built on the T-Hybrid platform. Olive Neo exclusive paint, Pasha fabric interior, and cabriolet-only specification create a distinct collectible. All three prior Heritage Design 911s appreciated from their respective MSRPs.',
      },
      {
        name: 'GT3 / GT3 Touring — manual availability in a narrowing manual market',
        description: 'With the 992.2 restricting manuals to the Carrera T and GT3/GT3 Touring, the GT3 manual has increased structural importance: it is the highest-performance manual-transmission 992.2 variant. GT3 Touring manual examples (wingless, discreet) are particularly sought for road use.',
      },
      {
        name: 'Turbo S T-Hybrid — most powerful production 911 ever',
        description: 'The 992.2 Turbo S T-Hybrid (701 hp, 7:03.92 Nürburgring) is the most powerful road-legal 911 ever produced at its launch date. As the first Turbo S on the T-Hybrid platform and the first two-eTurbo production Porsche, first-year MY2026 production carries strong provenance.',
      },
      {
        name: '9A3 T-Hybrid — engineering inflection point',
        description: 'The 9A3 flat-six T-Hybrid system is the first powertrain architecture change in the base 911 since the 9A2 twin-turbo arrived in MY2017. Carrera GTS T-Hybrid examples from MY2025 first production represent the opening chapter of a platform-level change comparable to the 930\'s turbocharging, the 996\'s water-cooling, or the 991.2\'s base-Carrera turbocharging.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 356 Pre-A (1948–1955)
  // Source: docs/reference/porsche_1960s_reference.md (lineage context)
  //         356 Registry / Porsche Kardex primary sources
  // ──────────────────────────────────────────────────────────────────────────
  '356-pre-a': {
    positioning: 'The founding car — Gmünd aluminum to Reutter steel',
    intro: 'The 356 pre-A encompasses the hand-built Gmünd aluminum cars (1948–1951) and the first Reutter steel-bodied Stuttgart production (1950–1955) — the entirety of Porsche\'s existence before the 356 A arrived. These are among the most historically significant and rarest collector cars of any marque.',
    production_years: '1948–1955',
    body_styles: 'Coupe, Cabriolet (Reutter, Stuttgart); Coupe, Cabriolet (hand-built aluminum, Gmünd, Austria)',
    engine: '1.1L Type 369 flat-four (40 hp); 1.3L Type 506 flat-four (44–60 hp); 1.5L Type 527 flat-four (55 hp); 1.5L Type 528 Super flat-four (70 hp); 1.5L Type 547 GS Carrera four-cam (100 hp DIN)',
    cooling: 'Air-cooled',
    units_produced: '~52 Gmünd aluminum cars (1948–1951); ~7,627 Stuttgart steel production (1950–1955)',
    notes: [
      'Ferry Porsche\'s team built the first 356 prototype in June 1948 in Gmünd, Austria — a mid-engine roadster using a VW Beetle-derived 1,131cc flat-four producing 40 hp. The second car, a coupe, moved the engine behind the rear axle, establishing the rear-engine rear-drive architecture that every air-cooled Porsche through the 993 inherited. Approximately 52 coupes and 8 cabriolets were hand-built at Gmünd with aluminum bodies before Porsche transferred production to Stuttgart in 1950. Each Gmünd car was individually hand-formed — no two are identical — making them among the rarest production Porsches ever built.',
      'Stuttgart production began in late 1950 with Reutter supplying steel coupe and cabriolet bodies. These Stuttgart cars were sold simply as "Porsche 356" until the 356 A arrived in September 1955; the "pre-A" designation is retrospective. Engine displacement escalated in deliberate steps: from the 1.1L VW-derived unit through the 1.3L family (44–60 hp) and into the 1.5L Normal (55 hp) and Super (70 hp). For MY1955 the Carrera arrived: the Type 547 four-cam flat-four, designed entirely by Ernst Fuhrmann without VW parts, producing 100 hp DIN — Porsche\'s graduation from modified-Volkswagen manufacturer to independent engine designer. Max Hoffman, the New York importer, was instrumental in building American demand; by 1954 the United States was the largest single Porsche market.',
      'Pre-A values span a vast range today. Gmünd aluminum coupes in confirmed matching-numbers condition have sold above $1.5M at major auction. Stuttgart Carrera (Type 547 GS) examples trade at $300K–$600K+ depending on body style and condition. Pushrod pre-As — the 1.1L through 1.5L Super cars — represent the entry point to 356 ownership: driver-quality coupes from $60K–$120K, cabriolets carrying a 25–50% premium. For any pre-A purchase, the single most important step is registry verification: the 356 Registry maintains chassis records that can confirm or contradict a car\'s claimed history. VIN fraud and component misrepresentation have had more than 70 years to accumulate on these cars.',
    ],
    variants: [
      {
        name: 'Gmünd Coupe / Cabriolet (aluminum)',
        years: '1948–1951',
        drivetrain: 'RWD',
        power: '40 hp (Type 369, 1.1L)',
        production: '~52 coupes, ~8 cabriolets',
        description: 'Hand-beaten aluminum bodies formed individually in Gmünd, Austria. VW Beetle-derived 1,131cc flat-four producing 40 hp. No two cars are structurally identical. Essentially museum pieces — any surviving Gmünd car requires full provenance documentation and specialist appraisal before changing hands.',
      },
      {
        name: '1100 Stuttgart Coupe / Cabriolet',
        years: '1950–1951',
        drivetrain: 'RWD',
        power: '40 hp (Type 369)',
        description: 'First Reutter-bodied steel production. VW-origin drivetrain; modified VW floor pan shortened and stiffened. Earliest Stuttgart cars use VW gearbox with incomplete synchronization. Distinguished from later pre-A cars by lower displacement badging and earliest-chassis-number range.',
      },
      {
        name: '1300 / 1300 Super Coupe / Cabriolet',
        years: '1951–1954',
        drivetrain: 'RWD',
        power: '44–60 hp (Type 506 / 506A)',
        description: 'Transition engine family moving from VW displacement origins toward Porsche-developed architecture. The 1300 Normal (44 hp) and 1300 Super (60 hp) use Porsche-designed pistons and heads on a progressively developed bottom end. Meaningful step toward the fully independent engine designs of the 1.5L era.',
      },
      {
        name: '1500 / 1500 Super Coupe / Cabriolet',
        years: '1952–1955',
        drivetrain: 'RWD',
        power: '55–70 hp (Type 527 / Type 528)',
        description: 'The 1.5L Super (Type 528, 70 hp) was the most powerful production Porsche built through 1954, exceeding the specific output of most contemporary British sports cars at the same displacement. The volume entry into the pre-A collector market; driver-quality examples represent accessible 356 ownership.',
      },
      {
        name: '1500 GS Carrera',
        years: '1954–1955',
        drivetrain: 'RWD',
        power: '100 hp DIN (Type 547 four-cam)',
        production: '~100 cars (combined pre-A and early 356 A production)',
        description: 'Ernst Fuhrmann\'s Type 547: the first Porsche engine designed without any VW component. Four overhead camshafts driven by a gear-and-shaft arrangement through the crankcase center, producing 100 hp at 6,200 rpm DIN. The name honored the Carrera Panamericana, which Porsche\'s 550 Spyder had just won. Carrera GS pre-As in matching-numbers condition trade at $300K–$600K+.',
      },
    ],
    engineering: [
      'Rear-engine layout decision (1948): The 356/2 coupe moved the engine behind the rear axle — a deliberate departure from the 356/1 mid-engine prototype. Ferry Porsche chose it for trunk space and weight distribution over the drive wheels, creating the rear-weight-bias architecture every air-cooled Porsche through the 993 inherited. The handling consequence — oversteer tendency at the limit on throttle-off — was understood at the time; it became a defining characteristic of the lineage.',
      'VW Beetle platform origins (1950–1952): The Stuttgart pre-A uses a shortened, stiffened VW Beetle floor pan. Front torsion bar suspension, rear swing axles, steering, and original 1.1L engine are VW-derived. Porsche began replacing VW components systematically: proprietary gearbox synchronization, Porsche-designed pistons and heads, and ultimately the wholly original Type 527/528 engine family — a process that concluded in the 356 A era with a fully independent drivetrain.',
      'Type 547 Fuhrmann four-cam engine (MY1955): Ernst Fuhrmann\'s Type 547 is the first Porsche engine with no VW lineage. The 1.5L four-cam flat-four drives its camshafts via a gear-and-bevel-shaft arrangement running through the crankcase center — a complex architecture requiring specialized knowledge to disassemble correctly. Output: 100 hp at 6,200 rpm DIN. The Type 547 family continued through the 356 B Carrera 2 and is the structural ancestor of all Porsche four-cam racing engines of the 1960s.',
      'Coachwork transition — Gmünd aluminum to Reutter steel: The Gmünd cars used hand-beaten aluminum bodies with fitting variations between individual examples. The move to Reutter-bodied steel production in Stuttgart brought consistent panel gaps and surface finish, establishing the manufacturing baseline that allowed Porsche to scale from 52 cars in three years to more than 7,000 in five. The decision to source bodies from a dedicated coachbuilder — rather than build in-house — was an early Porsche cost-structure choice that held through 1963.',
      'Engine displacement progression (40 hp → 100 hp): Porsche grew displacement from 1.1L (40 hp) through 1.3L (44–60 hp) to 1.5L (55–70 hp), pushing the VW-derived pushrod architecture further at each step. The progression demonstrated that a small-displacement rear-engine car could compete with larger-engined British and Italian sports cars, building the performance reputation on which the early US market was founded. The endpoint of the pushrod line in this era — the 1.5L Super at 70 hp — exceeded the specific output of most contemporary British sports cars at the same displacement.',
    ],
    watch_for: [
      {
        title: 'VIN fraud and registry verification',
        severity: 'concern',
        body: 'Pre-A chassis numbers must be cross-referenced against the 356 Registry database before any purchase. The long production history and high values have produced misrepresented cars — correct engine numbers on incorrect bodies, transplanted engines, and cars assembled from parts to create a desirable specification that never left the factory. No pre-A should change hands without a marque-specialist pre-purchase inspection and 356 Registry cross-check.',
        buyer_question: 'Has the chassis number been cross-referenced with the 356 Registry? Is there a factory Kardex record or registry certificate on file? What is the name of the marque specialist who completed the pre-purchase inspection, and what is their documented experience with pre-A cars specifically?',
      },
      {
        title: 'Type 547 four-cam condition and service history',
        severity: 'concern',
        body: 'The Type 547 Fuhrmann four-cam cannot be serviced correctly without specialized knowledge and tooling. Incorrect reassembly of the cam drive gear stack produces rapid and catastrophic cam wear — a failure mode that is expensive and sometimes irreversible. A Type 547 with unknown or non-specialist service history must be treated as suspect. Budget for a specialist inspection with a valve cover pull and cam drive backlash measurement before purchase.',
        buyer_question: 'Who has serviced the Type 547 engine, specifically? At what intervals has the cam drive been inspected and the gear backlash set? Is there documentation of compression and leakdown test results across all four cylinders?',
      },
      {
        title: 'Gmünd aluminum body structural integrity',
        severity: 'concern',
        body: 'Gmünd aluminum bodies cannot be repaired with conventional steel-panel techniques. Incorrect repairs are visible on close inspection of panel contours and weld quality. Additionally, aluminum-to-steel contact at body mounting points causes galvanic corrosion; inspect all mounting points carefully. A claimed Gmünd car must be inspected by a specialist with direct aluminum coachwork experience before any commitment.',
        buyer_question: 'Has the body been formally inspected for hidden structural repairs, including panel contour measurement? Are there any areas of galvanic corrosion at body-to-chassis mounting points? Has the panel thickness at the sills and floor been checked with an ultrasound gauge?',
      },
      {
        title: 'Pushrod engine oil leaks and carburetor specification',
        severity: 'caution',
        body: 'Pre-A pushrod engines (Types 369, 506, 527, 528) have universally aged rubber seals; light oil weeping at valve covers, pushrod tube ends, and the crankshaft seal is near-universal on unrestored cars. Carburetor specification authenticity matters: replacement with non-period Webers or Dellortos is common and reduces value on an originality-focused car. Verify the carburetor type number against the correct period specification for this engine code.',
        buyer_question: 'Is there visible oil weeping at the valve covers, pushrod tubes, or engine tin? What carburetor type and model number is currently fitted, and has this been confirmed as the correct period specification for this engine number?',
      },
    ],
    service: [
      'Pre-A service requires marque-specialist ownership. Valve clearance adjustment (manual, non-hydraulic) every 10,000–15,000 miles; oil changes every 3,000 miles using a 20W-50 period-correct formulation; ignition point inspection and adjustment every 6,000 miles. For the Type 547 Carrera four-cam: the cam gear backlash setting is the critical service item — incorrect setting accelerates cam wear. This work requires a specialist with documented Type 547 experience. The number of qualified practitioners worldwide is small and well-known within the 356 Registry community; request references before entrusting a four-cam to any shop.',
      'Pre-purchase inspection priorities: (1) Registry and chassis number verification before visiting the car. (2) For Carrera: engine specialist inspection with a valve cover pull and cam drive backlash measurement. (3) Body integrity survey — paint thickness gauge and under-body inspection at sill seams and floor pans; for Gmünd cars, assess all aluminum-to-steel mounting points for galvanic corrosion. (4) Compression and leakdown test on all four cylinders. (5) Road test by a specialist familiar with pre-A character — original swing-axle rear suspension behaves fundamentally differently from modern independent suspension and requires familiarity to evaluate correctly.',
    ],
    value_drivers: [
      {
        name: 'Gmünd aluminum vs. Stuttgart steel',
        description: 'Gmünd aluminum cars (approximately 60 total) are in a different valuation universe from any steel-bodied 356. Confirmed-authentic Gmünd coupes in good condition have sold above $1.5M. Any steel pre-A is priced orders of magnitude below a Gmünd car regardless of engine spec.',
      },
      {
        name: 'Type 547 four-cam Carrera vs. pushrod',
        description: 'The pre-A Carrera GS with the Type 547 four-cam engine commands a 4–6× premium over an equivalent pushrod car in the same body style and condition tier. The premium is entirely contingent on matching-numbers registry verification — a non-matching Carrera trades at a severe discount.',
      },
      {
        name: 'Matching numbers with registry verification',
        description: 'A pre-A with confirmed matching chassis, engine, and gearbox numbers — verified against the 356 Registry and supported by a factory Kardex record — commands a substantial premium over any car without this documentation. Numbers-matching status is not assumed; it must be proved.',
      },
      {
        name: 'Cabriolet premium over Coupe',
        description: 'The 356 pre-A Cabriolet consistently commands a 25–50% premium over equivalent Coupes at the same engine specification and condition tier. The premium reflects lower Cabriolet production volume and stronger open-top collector demand.',
      },
      {
        name: 'Continuous documented ownership history',
        description: 'Pre-As with provenance traceable from the original buyer — factory Kardex, service records, known ownership chain — command a premium over same-condition cars with breaks in the chain. A complete provenance file materially reduces fraud risk and increases buyer confidence, translating directly to price.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 356 A (1955–1959)
  // Source: docs/reference/porsche_1960s_reference.md (lineage context)
  //         356 Registry / Porsche Kardex primary sources
  // ──────────────────────────────────────────────────────────────────────────
  '356a': {
    positioning: 'Speedster, curved windscreen, Carrera four-cam matures',
    intro: 'The 356 A introduced a one-piece curved windshield, Porsche\'s first fully synchromesh all-Porsche gearbox, and the Speedster — the most collectible open-top 356 and the car Max Hoffman designed for the American market. The Carrera GS brought four-cam power to 100–110 hp, competing directly with Italian sports cars at a fraction of the price.',
    production_years: '1955–1959',
    body_styles: 'Coupe, Cabriolet (Reutter); Speedster (Reutter, 1955–1958); Convertible D (Drauz, 1958–1959)',
    engine: '1.3L Type 506A (44 hp); 1.6L Type 616/1 (60 hp); 1.6L Type 616/2 Super (75 hp); 1.5L Type 547/1 GS Carrera (100–110 hp DIN, 4-cam); 1.6L Type 692/0 Carrera GS (105 hp DIN, 4-cam)',
    cooling: 'Air-cooled',
    units_produced: '~21,045 worldwide',
    notes: [
      'The 356 A debuted at the Frankfurt Motor Show in September 1955 as a thorough evolution of the pre-A formula. The curved one-piece windshield was the most visible change, replacing the split V-screen; the mechanical update mattered more to buyers: a fully Porsche-designed 4-speed all-synchromesh gearbox replaced the VW-derived unit. Engine choices expanded: the 1.6L Normal (60 hp, Type 616/1) became the volume engine, and the 1.6L Super (75 hp, Type 616/2) the preferred performance choice. The 356 A was the first Porsche that read as a fully resolved production sports car rather than a modified Volkswagen.',
      'The Speedster is the 356 A\'s most famous variant. Max Hoffman proposed a stripped, low-windscreen sports car at around $3,000 to compete with the Triumph TR3 and MG. The result — a minimalist two-seater with a rakishly low windscreen, no roll-up windows, and a rudimentary folding top — became the defining image of 1950s Porsche in America. Approximately 4,024 Speedsters were built across the 356 A production run. The Speedster was succeeded in 1958 by the Convertible D (Drauz-bodied), which added wind-up windows and a more practical top; the Convertible D is significantly less collected than the Speedster. On the performance end, the Carrera GS with the Type 547 four-cam (100+ hp) competed directly with Ferrari at a fraction of the price, winning class at Le Mans in 1956 and 1957.',
      'The 356 A market is the deepest part of the 356 collector world. Speedsters in numbers-correct condition with documented history routinely sell between $200K–$500K+; top examples have exceeded $700K at major auction. Carrera GS coupes and cabriolets with confirmed four-cam engines trade at $300K–$700K depending on body style and specification. Base 1.6L Coupes in excellent driver condition — the most accessible 356 A entry point — trade at $70K–$120K, with Cabriolets carrying a 25–40% premium. The 1.6L Super commands a 10–20% premium over the Normal at equivalent condition. These tiers have compressed significantly over the past decade as mainstream collector demand has reached the 356 market.',
    ],
    variants: [
      {
        name: '1600 Normal Coupe',
        years: '1955–1959',
        drivetrain: 'RWD',
        power: '60 hp (Type 616/1)',
        description: 'The volume 356 A: 1.6L pushrod flat-four with a single Zenith carburetor. Most common 356 A body/spec combination. Accessible entry into the 356 A market; driver-quality coupes represent value relative to more exotic variants while offering the same fundamental 356 A driving character.',
      },
      {
        name: '1600 Super Coupe / Cabriolet',
        years: '1955–1959',
        drivetrain: 'RWD',
        power: '75 hp (Type 616/2)',
        description: 'Twin-Zenith carburetor mid-trim with 75 hp. The preferred driver\'s specification among pushrod 356 As — enough power to enjoy the car enthusiastically without the cost and complexity of a Carrera. Commands a 10–20% premium over the Normal at equivalent condition.',
      },
      {
        name: 'Speedster (1600 / 1600 Super)',
        years: '1955–1958',
        drivetrain: 'RWD',
        power: '60–75 hp (Normal or Super engine)',
        production: '~4,024 cars',
        description: 'Minimalist open-top body with a low-rake windshield, rudimentary folding top, and no roll-up windows. Max Hoffman\'s concept for the American market, built on a modified Cabriolet floor pan. Approximately 50–70 kg lighter than the Coupe in equivalent engine spec. The most collectible open-top 356 A; authentic examples with documented history trade at multiples of the equivalent Coupe.',
      },
      {
        name: 'Convertible D',
        years: '1958–1959',
        drivetrain: 'RWD',
        power: '60–75 hp (Normal or Super engine)',
        production: '~1,330 cars',
        description: 'Drauz-bodied replacement for the Speedster with wind-up windows and a more practical folding top. Named for the Drauz coachbuilder. Significantly less collected than the Speedster despite its practical improvements; commands a Cabriolet-adjacent premium rather than a Speedster premium.',
      },
      {
        name: 'Carrera GS (1500 GS and 1600 GS)',
        years: '1955–1959',
        drivetrain: 'RWD',
        power: '100–110 hp (Type 547/1 1.5L 4-cam); 105 hp (Type 692/0 1.6L 4-cam)',
        production: '~700 cars total across Carrera variants',
        description: 'The 356 A Carrera initially used the 1.5L Type 547/1 four-cam (100 hp) carried from the pre-A. From ~1958, the Type 692/0 brought 1.6L four-cam technology (105 hp) with improved low-RPM tractability. Won class at Le Mans 1956, 1957, and the Targa Florio with production-derived cars. Confirmed four-cam Carreras trade at $300K–$700K+ depending on body and condition.',
      },
    ],
    engineering: [
      'All-Porsche synchromesh gearbox (1955): The 356 A introduced a fully Porsche-designed 4-speed all-synchromesh transmission — a complete replacement for the VW-derived unit of the pre-A era. All four gears synchronize cleanly; the shift quality improvement is material. This gearbox carried forward into the 356 B and C and, in evolved form, underpinned Porsche\'s gearbox philosophy through the 1960s.',
      'One-piece curved windshield: The single most visible 356 A exterior change replaced the pre-A\'s split V-screen with a one-piece curved glass. The change modernized the car\'s appearance substantially and is the simplest visual identification point between a pre-A and a 356 A. The new screen also reduced aerodynamic drag slightly and eliminated the structural split that had required a center pillar on the pre-A screen.',
      'Speedster body engineering: The Speedster used a modified Cabriolet floor pan with a cut-down windshield frame, bucket seat inserts, and a rudimentary folding top designed for occasional protection rather than comfortable touring. Typically 50–70 kg lighter than the Coupe at equivalent engine spec, contributing meaningful performance benefit per unit displacement. The low-windscreen body design influenced every subsequent lightweight open Porsche, including the 550 Spyder road cars and ultimately the 914.',
      'Type 692/0 Carrera 1.6L four-cam (1958): The Type 692/0 brought the Fuhrmann four-cam architecture to 1.6L (1,587cc) displacement, producing 105 hp with improved torque delivery across a broader RPM range compared to the 1.5L 547/1. This was the most tractable Carrera engine to date for road use. The 1.6L four-cam designation (Type 692 family) continued into the 356 B and early 356 C Carrera variants.',
      'Pirelli Cinturato radial tyres (optional from 1958): Porsche made the Pirelli Cinturato 155HR15 radial available as a factory option on the 356 A — among the earliest production sports cars to offer radials. The improvement in cornering grip and wet-weather handling over crossply was significant. Most well-maintained 356 As today run radials regardless of original specification; correct-spec Cinturatos remain available from vintage-tyre specialists.',
    ],
    watch_for: [
      {
        title: 'Speedster body authenticity',
        severity: 'concern',
        body: 'The Speedster\'s extraordinary collector premium has produced a documented population of converted Cabriolets and fabricated Speedsters. A genuine Speedster body uses a unique windshield frame mounting height and angle, Speedster-specific door structures, and a different top mechanism from the Cabriolet. All claimed Speedsters must be verified against the 356 Registry chassis records and inspected by a marque specialist who can confirm factory Speedster construction. The Convertible D (Drauz body, 1958–1959) is structurally distinct from both the Speedster and the Cabriolet, and is sometimes misrepresented as a Speedster.',
        buyer_question: 'Has this Speedster been cross-referenced against the 356 Registry chassis database, with body style confirmed as Speedster on the factory Kardex? Has the windshield frame height and angle, door structure, and top mechanism been confirmed as Speedster-original by a marque specialist with Speedster-specific experience?',
      },
      {
        title: 'Four-cam (Carrera) engine authenticity and condition',
        severity: 'concern',
        body: 'The value premium for a confirmed Carrera four-cam engine creates strong incentive for fraudulent engine number matching and installation of sourced four-cam engines into non-Carrera bodies. The engine number must be cross-referenced with the 356 Registry to confirm it is the engine originally assigned to this chassis. The Type 547/692 four-cam also requires specialist service — cam drive reassembly without correct tooling and knowledge causes rapid cam wear.',
        buyer_question: 'Has the engine number been verified against the 356 Registry as the original engine for this chassis? Who has performed four-cam service, and can they demonstrate experience specifically with the Type 547 or 692 cam drive? Is there documentation of cam drive backlash measurement at the last service?',
      },
      {
        title: 'Floor pan and inner sill rust',
        severity: 'concern',
        body: 'The 356 A unibody steel structure rusts at the floor pans, inner sill sections, and front inner wheel arch areas — none of which are visible without panel removal or a lift inspection. A car presenting well cosmetically can have significant structural rust beneath the lower body panels. Any 356 A purchase at driver pricing or above requires an under-body lift inspection; on cars with cosmetic restoration, paint thickness measurement at the sills is warranted.',
        buyer_question: 'When was the car last lifted for an under-body inspection? Are there any floor pan repairs visible on the underside, and if so, where and by what method? Has the inner sill structure been probed or inspected — if so, by whom and with what finding?',
      },
      {
        title: 'Gearbox baulk ring wear',
        severity: 'caution',
        body: 'The Porsche-designed 4-speed synchromesh gearbox\'s baulk rings (synchro rings) wear after 65+ years of use. Worn rings produce resistance or crunching on 3→2 and 2→1 downshifts. Replacement requires correct 356 A-specification parts; reproductions of varying quality are available. A 356 A with crunching or resistance in the downshift sequence requires gearbox inspection before purchase.',
        buyer_question: 'Does the gearbox shift cleanly through all four gears, specifically on 3→2 and 2→1 downshifts, without resistance or crunching? Has the gearbox been rebuilt, and if so, with which parts and by which specialist?',
      },
    ],
    service: [
      '356 A service intervals: valve clearance adjustment (manual) every 10,000–15,000 miles; oil changes every 3,000 miles using 20W-50; ignition point inspection every 6,000 miles. The 1.6L Super\'s twin-carb setup requires periodic synchronization with a flow meter; an out-of-balance Super runs rough and wears plugs unevenly. For Carrera four-cam variants, all pre-A Carrera service notes apply: the Type 547/692 requires specialist shops with documented four-cam experience for cam drive work.',
      'Pre-purchase inspection priorities for a 356 A: (1) Registry check before visiting — verify chassis number and confirm body style matches the registry record. (2) Under-body lift for floor pan and inner sill assessment. (3) Compression and leakdown on all four cylinders. (4) Carburettor specification confirmation and twin-carb balance check on Super variants. (5) For Speedsters: marque-specialist body authentication before proceeding. (6) For Carreras: four-cam specialist inspection including cam drive assessment. These inspections are not optional at 356 A price levels.',
    ],
    value_drivers: [
      {
        name: 'Speedster body',
        description: 'The Speedster consistently commands the highest values of any 356 A body style. Confirmed-authentic Speedsters with documented history trade at multiples of an equivalent Coupe — typically 3–5× — reflecting the body\'s rarity (~4,024 produced), its American market origin story, and its status as the defining 356 image.',
      },
      {
        name: 'Carrera four-cam engine',
        description: 'A confirmed matching-numbers 356 A Carrera GS commands roughly 3–5× the value of an equivalent pushrod car in the same body style and condition. The premium is contingent on registry-verified matching numbers — a non-matching four-cam does not carry the Carrera premium.',
      },
      {
        name: 'Matching numbers with registry verification',
        description: 'A single mismatched drivetrain component — engine, gearbox, or transaxle — significantly discounts value on any 356 A. Numbers-matching status must be proved via 356 Registry records, not assumed from seller representation.',
      },
      {
        name: 'Body style premium',
        description: 'The 356 A Cabriolet commands a 25–40% premium over the equivalent Coupe at the same engine spec and condition. The Speedster is above both by multiples. The Convertible D (1958–1959) trades at a Cabriolet-adjacent premium rather than a Speedster premium.',
      },
      {
        name: 'Color and specification Kardex match',
        description: 'Cars with confirmed factory colors and equipment options matching the factory Kardex trade at a premium over cars with assumed or unverified specifications. The Kardex confirmation eliminates speculation about whether the current color is original, which has an outsized effect on collector-tier pricing.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 356 B (1959–1963) — T5 and T6 bodies
  // Source: docs/reference/porsche_1960s_reference.md §"356 B (1959–1963)"
  // ──────────────────────────────────────────────────────────────────────────
  '356b': {
    positioning: 'T5 and T6 bodies — Super 90 peak pushrod, Carrera 2 arrives',
    intro: 'The 356 B ran from 1959 through 1963 across two body sub-generations — the lower-beltline T5 (1959–1961) and the raised-windshield T6 (1961–1963) — and introduced the 90 hp Super 90 as the peak of the pushrod engine line, culminating with the 130 hp Carrera 2 four-cam from 1962. At 31,810 units, it is the highest-volume 356 generation.',
    production_years: '1959–1963',
    body_styles: 'Coupe, Cabriolet (Reutter / Karmann); Roadster (Drauz / d\'Ieteren, 1960–1962); Hardtop Coupe / Notchback (Karmann, 1961–1962)',
    engine: '1.6L Type 616/1 (60 hp DIN); 1.6L Type 616/2 Super (75 hp DIN); 1.6L Type 616/7 Super 90 (90 hp DIN); 2.0L Type 587/1 Carrera 2 four-cam (130 hp DIN)',
    cooling: 'Air-cooled',
    units_produced: '~31,810 worldwide (T5: ~17,000; T6: ~14,000; Carrera 2: ~280–310)',
    notes: [
      'The 356 B was introduced in late 1959 in T5 body form — an evolutionary update with revised bumpers, repositioned headlamps, and a new windshield angle. The engine range consolidated around the 1.6L pushrod family: the 1600 Normal (60 hp, Type 616/1), the 1600 Super (75 hp, Type 616/2), and from 1960 the new 1600 Super 90 (90 hp, Type 616/7) with twin Solex 40 PII-4 carburetors and 9.0:1 compression. The Super 90 was the most powerful naturally aspirated pushrod flat-four Porsche had built, completing the arc from the 40 hp pre-A entry car to a 90 hp sports-car-class engine within the same fundamental architecture. The T5 body is generally considered more visually elegant than the T6 — its lower beltline and smaller rear window create a more delicate proportion — and commands a modest collector premium today.',
      'The T6 body (introduced for MY1962) raised the windshield and rear window for improved visibility, added twin engine-lid grilles, and moved the fuel filler to an external right-fender flap. More significantly, the T6 introduction coincided with the debut of the Carrera 2: the 2.0L Type 587/1 four-cam flat-four producing 130 hp DIN, the most powerful naturally aspirated four-cylinder road car engine Porsche had produced. The Carrera 2 name honored competition heritage while signaling the displacement step beyond the earlier 1.5L–1.6L Carreras. Approximately 280–310 Carrera 2s were built across Coupe and Cabriolet body styles; confirmed matching-numbers examples in the collector market currently command $400K–$900K+ depending on body style and condition.',
      'The 356 B\'s collector market is the broadest part of the 356 ecosystem — its production volume means a meaningful number of cars survive, but the T5/T6 body split, wide body-style range (Coupe, Cabriolet, Roadster, Notchback), and dramatic engine-based valuation differences make it a nuanced market. At current pricing: Super 90 Coupes in excellent condition $90K–$150K; Roadsters in good condition $100K–$175K (lower production, Speedster-adjacent desirability); Cabriolets 25–40% above equivalent Coupes; Notchbacks at modest coachwork premiums over equivalent Coupes. The Carrera 2, where authentic, occupies a separate valuation universe. The 356 B rewards patient buying — and penalizes careless buying more than any modern Porsche.',
    ],
    variants: [
      {
        name: '1600 Normal Coupe (T5 and T6)',
        years: '1959–1963',
        drivetrain: 'RWD',
        power: '60 hp (Type 616/1)',
        description: 'Highest-volume 356 B variant. 1.6L single-carburetor pushrod flat-four. The T5 (1959–1961) carries a small premium over the T6 (1961–1963) for its more delicate body proportion; mechanically the two are identical.',
      },
      {
        name: '1600 Super Coupe (T5 and T6)',
        years: '1959–1963',
        drivetrain: 'RWD',
        power: '75 hp (Type 616/2)',
        description: 'Twin-Zenith carburetor mid-trim. Preferred driver\'s pushrod specification in the 356 B — meaningful power advantage over the Normal without the complexity of the Super 90\'s twin Solex setup. Commands a 10–20% premium over the Normal at equivalent condition.',
      },
      {
        name: '1600 Super 90 Coupe / Cabriolet',
        years: '1960–1963',
        drivetrain: 'RWD',
        power: '90 hp (Type 616/7)',
        description: 'Peak pushrod 356 performance: twin Solex 40 PII-4 carburetors, 9.0:1 compression ratio, higher-lift cams. The most demanding of the pushrod 356 engines to maintain correctly. Commands a 20–35% premium over the Super at equivalent condition and body style.',
      },
      {
        name: 'Roadster (T5 and T6)',
        years: '1960–1962',
        drivetrain: 'RWD',
        power: '60–90 hp (Normal, Super, or Super 90 engine)',
        production: '~2,900 cars total',
        description: 'Low-windscreen open-top built by Drauz (T5) and d\'Ieteren (T6). Lighter and more open than the Cabriolet; positioned between the Cabriolet\'s practicality and the 356 A Speedster\'s minimalism. Ended mid-1962 with no successor. Approximately 2,900 built across both series; commands a higher desirability premium than the Cabriolet at equivalent spec.',
      },
      {
        name: 'Hardtop Coupe / Notchback (Karmann)',
        years: '1961–1962',
        drivetrain: 'RWD',
        power: '60–90 hp (various engines)',
        production: '~1,750 combined T5 + T6',
        description: 'Cabriolet shell with a welded-in steel hardtop, built by Karmann of Osnabrück. The T5 Notchback (1961) and T6 Notchback (1962) are structurally distinct despite visual similarity. Combined production approximately 1,750 units. Carries a modest coachwork-novelty premium in the collector market.',
      },
      {
        name: 'Carrera 2 (2000 GS) Coupe / Cabriolet',
        years: '1962–1963',
        drivetrain: 'RWD',
        power: '130 hp (Type 587/1 2.0L four-cam)',
        production: '~280–310 total (all body styles)',
        description: 'The most powerful production 356 at launch: 2.0L four-cam flat-four derived from the Fuhrmann engine architecture, producing 130 hp DIN. Coupe and Cabriolet body styles. Confirmed matching-numbers examples in the current market command $400K–$900K+ depending on body and condition. A Carrera 2 purchase requires the same registry verification and specialist inspection as any other 356 Carrera.',
      },
    ],
    engineering: [
      'Type 616/7 Super 90 engine (1960): The 616/7 used revised twin Solex 40 PII-4 carburetors, a 9.0:1 compression ratio (vs 8.2:1 on the 616/2 Super), and higher-lift cams to reach 90 hp DIN — the peak of the 356-era pushrod engine program. The Super 90 requires correct carburetor synchronization and ignition timing for proper operation. An out-of-balance Super 90 runs rough and burns plugs unevenly; the symptoms are frequently misattributed to deeper mechanical problems when the cause is a simple carburetor imbalance.',
      'Type 587/1 Carrera 2 four-cam engine (1962): A 2.0L evolution of the Fuhrmann four-cam architecture, producing 130 hp from 1,966cc — a specific output (66 hp/litre) matching contemporary Italian sports cars at a fraction of their price. The cam drive architecture is related to but distinct from the earlier 1.5L/1.6L units; rebuilders familiar with the 547/692 families will find the 587 recognisable but should treat it as a related, separate engine requiring its own specialist knowledge.',
      'T5 vs T6 body evolution: The T5 (1959–1961) represented the 356\'s most elegant body proportion — lower beltline, smaller rear window, and a more delicate hood line than any previous 356. The T6 (1961–1963) traded visual delicacy for practicality: a taller windshield and rear window improved sightlines, twin engine-lid grilles improved cooling marginally, and the external fuel filler eliminated awkward inside-the-trunk access. The two bodies use the same chassis and mechanical components; the visual distinction is the primary collector-market differentiator.',
      'Karmann coachwork (Notchback and T6 Coupe supplement): From 1961, Karmann of Osnabrück began supplying hardtop coupes (Notchback) and supplementing Reutter\'s Coupe production during the T6 period. Karmann-built 356 Bs are identifiable by coachbuilder badge but mechanically identical to Reutter-built cars. The Notchback — approximately 1,750 across T5 and T6 combined — is a lower-production coachwork variant of growing collector interest.',
      'Roadster body design (1960–1962): The Roadster replaced the 356 A\'s Convertible D as the low-windscreen open-top 356. With a shorter windshield and lighter folding top than the Cabriolet, it was positioned between the Cabriolet\'s practicality and the Speedster\'s minimalism. Built by Drauz (T5) and d\'Ieteren Belgium (T6) rather than Reutter, it is rarer than the Cabriolet. The Roadster ended mid-1962 with no successor, and the Targa concept that eventually filled the open-top slot did not arrive until 1967.',
    ],
    watch_for: [
      {
        title: 'Carrera 2 engine number verification',
        severity: 'concern',
        body: 'The Carrera 2 (Type 587/1) commands a 5–10× value premium over an equivalent pushrod 356 B. This premium creates strong incentive for fraudulent engine number matching or installation of sourced four-cam engines into non-Carrera bodies. All claimed Carrera 2s must be verified against the 356 Registry, with engine number, chassis number, and body style confirmed as a matching factory combination. A pre-purchase inspection by a marque specialist with specific 356 Carrera experience is non-negotiable at these values.',
        buyer_question: 'Has the engine number been verified against the 356 Registry as the original engine for this chassis? Is there a factory Kardex record showing Carrera 2 specification? Who is the marque specialist who completed the pre-purchase inspection, and what is their documented four-cam experience?',
      },
      {
        title: 'Roadster body authenticity',
        severity: 'concern',
        body: 'The Roadster\'s production premium and collector desirability have produced misrepresented cars — Cabriolets modified to Roadster appearance. A genuine Roadster uses a distinct windshield frame height and angle, different door structures, and a different cowl-to-hood transition from the Cabriolet. Roadster purchases require 356 Registry verification and marque-specialist body confirmation. The T5 Roadster (Drauz) and T6 Roadster (d\'Ieteren) differ in coachwork details despite being the same concept.',
        buyer_question: 'Has this body been confirmed as a factory Roadster via the 356 Registry and a marque specialist inspection? What does the factory Kardex record show for body style? Can the windshield frame, door structure, and cowl transition be verified against confirmed Roadster reference cars?',
      },
      {
        title: 'Floor pan and sill structural rust',
        severity: 'concern',
        body: 'The 356 B unibody rusts at the floor pans, inner sills, and front inner wheel arch areas — none visible without a lift inspection. A cosmetically excellent 356 B can have significant structural rust beneath the lower panels. Under-body inspection on a lift is non-negotiable; on cars with cosmetic restoration, use a paint thickness gauge at the sills to detect filler over rust.',
        buyer_question: 'Has the car been lifted for an under-body inspection as part of this pre-purchase process? Are there any floor pan repairs visible, and if so, where and with what method? Has the inner sill structure been inspected or probed?',
      },
      {
        title: 'Super 90 carburetor balance and ignition timing',
        severity: 'caution',
        body: 'The 616/7 Super 90 runs correctly only when both Solex 40 PII-4 carburetors are synchronized and ignition timing is set to spec. An out-of-balance Super 90 runs rough, burns plugs unevenly, and produces less power than rated — symptoms often misattributed to mechanical problems. Any Super 90 that does not pull cleanly through its RPM range should have carburetor balance and timing checked before deeper diagnostics.',
        buyer_question: 'When were the Solex carburetors last synchronized and balanced? Has the ignition timing been set to the correct 616/7 specification? Does the engine pull cleanly through the full RPM range without flat spots?',
      },
    ],
    service: [
      '356 B service follows the same fundamentals as the 356 A: valve clearance adjustment (manual) every 10,000–15,000 miles; oil changes every 3,000 miles using 20W-50; ignition point inspection every 6,000 miles. The Super 90\'s twin Solex 40 PII-4 carburetors require periodic synchronization — a specialist with a flow meter should balance them. For Carrera 2 four-cam service, the Type 587/1 uses the same cam-drive-in-crankcase architecture as the 547/692 family; correct cam drive backlash setting is the critical item requiring specialist knowledge and tooling.',
      'Pre-purchase inspection priorities for a 356 B: (1) Registry verification before visiting — confirm chassis, engine, and body style. (2) Under-body lift for floor pan and sill assessment. (3) Compression and leakdown on all four cylinders. (4) For Super 90: carburetor balance test and visual inspection of both Solex units. (5) For Carrera 2: marque specialist four-cam inspection including cam drive assessment. (6) For Roadster or Notchback: specialist body authentication. Identify which service items are current before negotiating price.',
    ],
    value_drivers: [
      {
        name: 'Engine specification tier',
        description: 'Within the pushrod 356 B, each engine tier commands a consistent premium: Super 90 (90 hp) over Super (75 hp) over Normal (60 hp), approximately 10–25% per step at equivalent condition. The Super 90 is the preferred driver\'s specification and commands the strongest pushrod premium.',
      },
      {
        name: 'T5 vs T6 body aesthetic',
        description: 'The T5 (1959–1961) commands a small premium over the T6 (1961–1963) on visual elegance alone — its lower beltline and smaller rear window are considered the more delicate 356 proportion. T5 and T6 are mechanically identical; the premium is purely aesthetic.',
      },
      {
        name: 'Body style — Roadster and Cabriolet',
        description: 'The Roadster (~2,900 cars) commands a higher desirability premium than the Cabriolet at the same engine spec and condition, driven by lower production and Speedster-adjacent aesthetics. The Cabriolet commands 25–40% over the equivalent Coupe. The Notchback (1,750 combined) carries a modest coachwork novelty premium.',
      },
      {
        name: 'Carrera 2 matching numbers',
        description: 'The 5–10× pushrod premium for a 356 B Carrera 2 depends entirely on confirmed matching-numbers registry verification. A non-matching Carrera 2 — or a Carrera 2 body with a replacement pushrod engine — does not carry the Carrera premium and may carry a significant discount.',
      },
      {
        name: 'Documented ownership and service history',
        description: 'A 356 B with provenance traceable from the original buyer — factory Kardex, service records, known ownership chain — commands a meaningful premium over same-condition cars with undocumented periods. Provenance reduces fraud risk and increases buyer confidence in matching-numbers claims.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 356 C (1963–1965)
  // Source: docs/reference/porsche_1960s_reference.md §"356 C (1963–1965)"
  // ──────────────────────────────────────────────────────────────────────────
  '356c': {
    positioning: 'Disc brakes, SC motor — the most refined 356',
    intro: 'The 356 C was the final 356 series, introducing four-wheel ATE disc brakes and the most powerful pushrod flat-four Porsche ever built — the 1600 SC at 95 hp DIN. Coupe and Cabriolet only; 16,810 units across two and a half years, with the last ten cabriolets assembled in March 1966 for the Dutch national police closing the 356 production story.',
    production_years: '1963–1965',
    body_styles: 'Coupe (Reutter / Karmann); Cabriolet (Reutter)',
    engine: '1.6L Type 616/15 C (75 hp DIN); 1.6L Type 616/16 SC (95 hp DIN); 2.0L Type 587/1 Carrera 2 four-cam (130 hp DIN, through 1964)',
    cooling: 'Air-cooled',
    units_produced: '~16,810 worldwide (Coupe: ~13,500; Cabriolet: ~3,260; Carrera 2: ~126)',
    notes: [
      'Production of the 356 C ran from July 1963 through September 1965 — a compressed 26-month window, the shortest of any 356 series, because the 911 was already in production from September 1964. The defining mechanical update was ATE four-wheel disc brakes, replacing drums used on every previous 356. The disc conversion required a revised rear axle carrier and uprated master cylinder; stopping distances from 60 mph improved approximately 20% over the 356 B Super 90. Engine designations were simplified: the 356 B\'s three pushrod choices (60 hp / 75 hp / 90 hp) consolidated to two — the 1600 C (Type 616/15, 75 hp) as the base and the 1600 SC (Type 616/16, 95 hp) as the top pushrod trim, surpassing the Super 90\'s 90 hp while replacing it.',
      'The 356 C ran alongside the early 911 in Porsche\'s Stuttgart plant from late 1964 through 1965, creating a deliberate generational overlap. The 911 was priced at DM 21,900 vs the 356 C Coupe at DM 14,950 — a meaningful gap — but once the 912 (356 engine in a 911 body, DM 16,250) arrived in April 1965, the 356 C\'s sales rationale evaporated and remaining inventory was finished quickly. The last ten cabriolets, assembled in March 1966 from remaining parts for the Dutch Rijkspolitie national police as 1965 models, close the 356 production story on a fittingly institutional note. The ~1,690 cars built in calendar year 1965 are a particularly rare subset; a confirmed 1965-build 356 C commands a chronological rarity premium in the current market.',
      'The 356 C is the most refined 356: disc brakes, the SC\'s 95 hp, Pirelli Cinturato radials standard, and the finishing of the original design language before the 911 replaced it. In the current collector market: 356 C Cabriolets in excellent condition trade from $130K–$220K+; SC Coupes from $80K–$140K; C (base) Coupes from $60K–$90K. The 356 C Carrera 2 — 126 units across all body styles — is among the rarest production 356s; confirmed matching-numbers examples in the top condition tier have exceeded $800K at auction. The 356 C is the most maintenance-ready vintage 356 for modern use, with disc brakes materially improving real-world safety over drum-braked predecessors.',
    ],
    variants: [
      {
        name: '1600 C Coupe',
        years: '1963–1965',
        drivetrain: 'RWD',
        power: '75 hp (Type 616/15)',
        description: 'Base trim and most common 356 C variant. 1.6L pushrod with ATE four-wheel disc brakes. The 75 hp C replaced both the 60 hp Normal and 75 hp Super from the 356 B in a single trim level. Entry point into 356 C ownership.',
      },
      {
        name: '1600 SC Coupe',
        years: '1963–1965',
        drivetrain: 'RWD',
        power: '95 hp (Type 616/16)',
        description: 'The most powerful pushrod flat-four Porsche ever produced. Twin Solex 40 PII-4 carburetors, 9.5:1 compression, revised cam timing. Commands a 20–40% premium over the C at equivalent condition. The preferred specification for buyers who want the most capable pushrod 356 C.',
      },
      {
        name: '1600 C Cabriolet',
        years: '1963–1965',
        drivetrain: 'RWD',
        power: '75 hp (Type 616/15)',
        production: '~3,260 total (all 356 C Cabriolets, including 10 for Dutch police)',
        description: 'The final 356 Cabriolet body. The last ten cars, assembled in March 1966 for the Dutch Rijkspolitie, are the last 356s ever built. Cabriolets command a 35–50% premium over equivalent Coupes; the open-top body on the final 356 series carries a "last of the line" status premium.',
      },
      {
        name: '1600 SC Cabriolet',
        years: '1963–1965',
        drivetrain: 'RWD',
        power: '95 hp (Type 616/16)',
        description: 'Top pushrod trim in the most desirable 356 C body style. Combines the SC\'s 95 hp with the Cabriolet\'s open-top body and the generation\'s disc brakes. Strong collector demand; confirmed-original examples trade at $150K–$220K+ in excellent condition.',
      },
      {
        name: 'Carrera 2 Coupe / Cabriolet',
        years: '1963–1964',
        drivetrain: 'RWD',
        power: '130 hp (Type 587/1 2.0L four-cam)',
        production: '~126 total (all body styles)',
        description: 'The rarest 356 C variant: 126 units total across Coupe and Cabriolet. The Type 587/1 four-cam carried over from the 356 B T6; the 356 C Carrera 2 ended production in early 1965. Confirmed matching-numbers examples have exceeded $800K at major auction. Registry verification and specialist inspection are non-negotiable.',
      },
    ],
    engineering: [
      'ATE four-wheel disc brakes (1963): The 356 C was the first 356 with discs on all four corners — a significant safety upgrade over the drum brakes of every preceding 356. The ATE system required a revised rear axle carrier and a more powerful brake master cylinder. For modern ownership, the disc system is more easily serviced than the drum equivalent: fresh brake fluid (hygroscopic deterioration is universal on 60-year-old systems), caliper rebuild or replacement, and fresh lines are the standard service package on any 356 C purchased today.',
      'Type 616/16 SC engine — peak pushrod output: The SC (95 hp DIN) is the highest-output pushrod flat-four Porsche ever built. Twin Solex 40 PII-4 carburetors at 9.5:1 compression ratio; revised cam timing pushes the engine harder through the upper RPM range than any previous pushrod 356. The SC is more demanding of correct ignition timing than the 616/2 Super or 616/7 S90 — a slightly retarded timing setting reduces output noticeably.',
      'Engine lineup consolidation: The 356 B\'s four pushrod engine choices consolidated to three in the 356 C (75 hp C, 95 hp SC, 130 hp Carrera 2). The 60 hp Normal was discontinued — in 1963 the market for a sub-75 hp sports car had narrowed materially against the TR4 and early Lotus Elan, and the SC at 95 hp competed credibly in its class. The simplification reflects Porsche\'s maturing production process and the reality that the 911 was about to reset all performance benchmarks.',
      'Pirelli Cinturato radials standard (1963): Where the 356 A offered Cinturatos optionally and the 356 B carried them as preferred equipment, the 356 C made 155HR15 Cinturatos standard. The handling improvement over crossply — particularly in cornering and wet conditions — is significant. Correct-spec replacement Cinturatos remain available; the 356 C\'s standard radial fitment makes it the most capable-handling 356 on modern roads.',
      '911 overlap and production close-out: The 356 C and early 911 coexisted on the Stuttgart factory floor from September 1964 through September 1965. Once the 912 (356 engine in 911 body, DM 16,250, April 1965) arrived below the 911\'s price and above the 356 C\'s, the 356 C\'s market position was eliminated. The remaining inventory — about 1,690 cars in the 1965 calendar year — was finished quickly. This compressed late-production run makes 1965-build 356 Cs among the chronologically rarest cars in the generation.',
    ],
    watch_for: [
      {
        title: 'Disc brake caliper and line condition',
        severity: 'caution',
        body: 'The 356 C\'s ATE disc brakes have been in service for 60+ years. Caliper pistons seize from corrosion and fluid degradation; brake lines develop internal corrosion that restricts flow without external appearance of failure; master cylinder bore can corrode or develop seal failure. A brake system flush, caliper inspection, and pressure test should be part of every 356 C pre-purchase process. Budget for caliper rebuild or replacement on any car without documented brake service in the last five years.',
        buyer_question: 'When was the brake fluid last fully flushed? Has the brake system been pressure-tested for line integrity? Have the calipers been rebuilt or replaced, and if so, when and with what parts? Does the car stop straight under firm braking without pulling?',
      },
      {
        title: 'Carrera 2 authenticity — 126 units total',
        severity: 'concern',
        body: 'The 356 C Carrera 2 (126 units, Type 587/1 four-cam) represents the highest per-unit value in the 356 C range. The same fraud risk as in the 356 B applies — non-Carrera bodies with transplanted or misrepresented four-cam engines. Registry verification and marque-specialist inspection are non-negotiable on any claimed 356 C Carrera 2. All 126 cars are effectively known to the 356 Registry; an unregistered "Carrera 2" should be treated as a major red flag.',
        buyer_question: 'Has this car been cross-referenced against the 356 Registry to confirm the chassis number as a factory Carrera 2, and the engine number as the original four-cam for this chassis? Is there a factory Kardex confirming the Carrera 2 specification?',
      },
      {
        title: 'Late-1965 build date verification',
        severity: 'caution',
        body: 'The approximately 1,690 cars built in calendar year 1965 are the chronologically last 356 Cs and carry a rarity premium. Build date is established from the chassis number range and factory Kardex documentation. Misrepresentation of an early 1963- or 1964-built car as a late-1965 example is less common than other 356 fraud forms, but the build-date premium warrants Kardex confirmation for any car sold as a 1965-built example.',
        buyer_question: 'What is the confirmed build date for this car, and is it documented on the factory Kardex? Does the chassis number fall within the confirmed 1965 calendar-year production range for the 356 C?',
      },
      {
        title: 'Floor pan and sill structural rust',
        severity: 'concern',
        body: 'The 356 C unibody shares the same structural rust vulnerabilities as the 356 A and B: floor pans, inner sills, and front inner wheel arch areas are the primary corrosion points. Under-body inspection on a lift is non-negotiable. The 356 C\'s revised rear axle mounting for the disc brake system adds a check point: inspect the rear axle mounting brackets for corrosion where they integrate into the floor structure.',
        buyer_question: 'Has the car been placed on a lift for an under-body inspection, including the rear disc brake axle mounting area? Are there any floor pan repairs visible, and if so, where and by what method?',
      },
    ],
    service: [
      '356 C service follows the same fundamentals as earlier 356 generations: valve clearance adjustment (manual) every 10,000–15,000 miles; oil changes every 3,000 miles using 20W-50; ignition point inspection every 6,000 miles. The SC\'s twin Solex 40 PII-4 carburetors require periodic synchronization. The disc brake system adds a service item not present on the 356 A and B: brake fluid flush every 2–3 years (hygroscopic fluid absorbs moisture and degrades caliper seals), caliper inspection at each annual service, and brake pad check every 10,000 miles.',
      'Pre-purchase priorities for a 356 C: (1) Registry verification before visiting. (2) Under-body lift — floor pans, inner sills, rear axle mounting area. (3) Brake system — fluid condition, caliper freedom, line integrity, pedal feel on a test drive. (4) Compression and leakdown on all four cylinders. (5) SC carburetor balance test. (6) For Carrera 2: marque specialist four-cam inspection. (7) A spongy or pulsing brake pedal warrants brake system disassembly before purchase. The 356 C is the most appropriate vintage 356 for regular modern use: disc brakes materially improve safety over the drum-braked predecessors.',
    ],
    value_drivers: [
      {
        name: 'SC (95 hp) over C (75 hp)',
        description: 'The most consistent value premium within the 356 C generation: the 1600 SC commands approximately 20–40% over the 1600 C at equivalent condition and body style. The SC is the most powerful pushrod Porsche ever made and the preferred specification for driving-focused 356 C buyers.',
      },
      {
        name: 'Cabriolet premium',
        description: 'The 356 C Cabriolet carries a 35–50% premium over the equivalent Coupe — the final 356 Cabriolet body, combining "last of the line" status with the open-top premium that applies to all 356 generations.',
      },
      {
        name: 'Late-1965 calendar-year build',
        description: 'The ~1,690 cars built in calendar year 1965 are the chronologically last 356 Cs. Confirmed 1965-build examples with Kardex documentation command a premium among buyers who prize "last of the line" provenance within the generation.',
      },
      {
        name: 'Carrera 2 — 126 units, extreme rarity',
        description: 'The 356 C Carrera 2 (126 units total across all body styles) is one of the rarest production 356s. Confirmed matching-numbers examples occupy a separate valuation tier from all pushrod 356 Cs; top-condition examples have exceeded $800K at major auction.',
      },
      {
        name: 'Documented continuous ownership',
        description: 'A 356 C with provenance traceable from the original buyer — factory Kardex, service records, known ownership chain — commands a premium over same-condition cars with undocumented periods. Continuous history eliminates fraud risk on matching-numbers claims and is a direct value driver.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 911-pre-a (1964 O-series launch cars)
  // Source: docs/reference/porsche_1960s_reference.md §"911/901 launch generation"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  '911-pre-a': {
    positioning: 'The founding 911 — 901-badged originals and 1964 launch cars',
    intro: 'The 1964 calendar-year production run of approximately 230 cars — including the ~80 badged "901" before Peugeot\'s trademark challenge forced the rename — are the rarest street-legal 911s in existence. Confirmed original examples command museum-grade valuations and require specialist authentication before any transaction.',
    production_years: '1964',
    body_styles: 'Coupe',
    engine: '2.0L Type 901/01 air-cooled flat-six (130 PS DIN; Solex 40PI carburetors, replaced mid-series by Weber 40 IDA3C in February 1966)',
    cooling: 'Air-cooled',
    units_produced: '~230 calendar-year 1964 production (of which ~80 delivered with "901" badging before the rename)',
    notes: [
      'The 911 was first shown as the "901" at the September 1963 Frankfurt Motor Show — a designation Peugeot claimed infringed a French trademark covering three-digit car names with a middle zero. Series production began in August 1964; approximately 80 cars were delivered through late 1964 with 901 badging intact before the factory switched to 911 nomenclature. Porsche AG counts the 901-badged examples as 911s, but the collector community tracks them as a distinct sub-cohort. Of the roughly 230 cars built in calendar year 1964, the 901-badged examples carry the greatest documentary premium — provenance must trace to original delivery records to confirm the badge specification.',
      'Every 1964-build car is a short-wheelbase (SWB) coupe at 2,211 mm, fitted with the 2.0L Type 901/01 flat-six producing 130 PS DIN. Twin Solex 40PI float carburetors feed the engine; the five-speed Type 901 gearbox is standard (four-speed optional); the aluminum crankcase is characteristic of the 1964–1967 production window before Porsche switched to magnesium in MY1968. The body design — by Ferdinand "Butzi" Porsche — was developed entirely apart from the 356, sharing no sheet metal with it. The air-cooled rear-drive architecture is identical in principle to every 911 through the 993, but the 1964 car is the most basic and uncompromised expression of that layout.',
      'At major auction, confirmed 901-badged cars with factory documentation and matching-numbers drivetrains have cleared $1M in recent years. Wider 1964-build O-series cars without 901 badging trade at $400K–$700K depending on condition and provenance quality. The attrition across six decades means the surviving population of authentic 1964-build cars is small enough that essentially every remaining example is known within the specialist community. No 1964-build 911 should change hands without a Porsche Classic Certificate of Authenticity, independent chassis-number verification, and a full drivetrain inspection by a recognized O-series specialist.',
    ],
    variants: [
      {
        name: '901 (factory-badged)',
        years: '1964',
        drivetrain: 'RWD',
        power: '130 PS DIN (Type 901/01)',
        production: '~80 cars worldwide',
        description: 'First series-production examples, delivered through approximately November 1964 with "901" badging on the engine lid, steering wheel horn button, and instruments. Identified by the earliest chassis-number range. A confirmed 901-badged example with original delivery paperwork is the rarest regularly-transacted 911 variant — top-condition sales above $1M are documented at RM Sotheby\'s and Gooding.',
      },
      {
        name: '911 O-series (1964 rebadge)',
        years: '1964',
        drivetrain: 'RWD',
        power: '130 PS DIN (Type 901/01)',
        production: '~150 cars worldwide',
        description: 'Remaining 1964 calendar-year production after the 901→911 rename, carrying revised 911 badging. Mechanically identical to the 901-badged cars: same Type 901/01 engine, same five-speed Type 901 gearbox, same SWB aluminum-case platform. Authenticated 1964-build cars of either sub-group share museum-grade collectibility; the 901 badge adds a documented premium at auction.',
      },
    ],
    engineering: [
      'Type 901/01 flat-six — no shared architecture with the 356: The 911\'s 2.0L flat-six was an entirely new engine with zero parts commonality with the VW-derived pushrod units of the 356. All-aluminum construction, single overhead camshaft per bank, dry-sump lubrication, twin Solex 40PI carburetors, 130 PS DIN at 6,100 rpm — approximately 65 PS per litre from a naturally aspirated production engine in 1964. The Type 901 designation covered both the engine and transmission; this engine family in continuously evolved form remained in production through the 993\'s final year in 1998.',
      'Aluminum crankcase (1964–1967): The earliest 911s used a pressure-cast aluminum crankcase, a material retained through MY1967 before Porsche switched to magnesium for the A-series (MY1968). Aluminum has different structural characteristics from magnesium: the head-stud pull-out failure mode specific to magnesium cases (1968–1977) does not apply to these early aluminum-case cars. The aluminum case\'s age-specific risk is instead oil-seal degradation from heat cycling — universal chronic weeping at the pushrod tube ends, crankshaft rear seal, and case-half joining gasket on unrestored examples.',
      'Short-wheelbase chassis (2,211 mm): All 1964 O-series cars are SWB. The 57 mm wheelbase extension that arrived with the B-series (MY1969) fundamentally changed the 911\'s handling signature; SWB cars have a shorter moment arm and a sharper tail response on throttle-off that defines the earliest 911\'s driving character. The nervousness widely described as inherent oversteer at the limit on SWB cars is exactly what serious collectors prize as authentic founding-generation character — and equally why SWB 911s require experienced, attentive driving.',
      'Solex 40PI carburetors — the original induction system: The 1964 launch cars use twin Solex 40PI float carburetors, a specification that continued through early 1966 before the factory switched to Weber 40 IDA3C for the remainder of the O-series. Original Solex-carbureted 1964 cars are valued for pure specification authenticity; the Solex setup requires period-correct specialist knowledge to tune and balance correctly, and an out-of-specification Solex pair runs poorly and unevenly. A confirmed original Solex installation is simultaneously a provenance marker and a service complexity.',
      'Five-speed Type 901 gearbox as standard equipment: For the first time on any Porsche production car, a five-speed manual was standard (four-speed optional on T-trim from MY1968). The Type 901 transmission was developed in-house using a gate shift pattern. Compact and well-suited to the rear-engine layout, it remained in production for the 911 through MY1971 before the stronger Type 915 replaced it for the 2.4L era. The gearbox\'s long first-gear ratio and close upper ratios reward high-RPM driving — the intended operating mode for the Type 901/01 engine.',
    ],
    watch_for: [
      {
        title: 'Chain tensioner failure (pre-1984 mechanical tensioners)',
        severity: 'concern',
        body: 'All air-cooled 911s through the 1983 model year — including every 1964-build car — use sealed mechanical spring-loaded chain tensioners that fail with age. When a tensioner fails, the chain jumps a sprocket, pistons contact valves, and the engine destroys itself. The failure mechanism is age-driven seal degradation, not use — a stored low-mileage car is equally at risk as a high-mileage driver. Porsche issued the oil-fed hydraulic tensioner retrofit kit (P/N 930 105 911 99) specifically to address this failure mode. Aluminum-case cars (1964–1967) require an additional adapter pipe for the retrofit; confirm the correct aluminum-case kit was used.',
        buyer_question: 'Have the chain tensioners been upgraded to the 1984 Carrera oil-fed hydraulic style (P/N 930 105 911 99)? At what mileage and date was the retrofit performed? Was the aluminum-case adapter pipe installed? If original tensioners remain, have safety collars been fitted, and when were they last inspected? Has the engine ever made chain rattle on cold start or under load?',
      },
      {
        title: 'Chassis number and provenance authentication',
        severity: 'concern',
        body: 'At valuations of $400K–$1M+ for confirmed 1964-build examples, the incentive to misrepresent a later O-series car as a 1964-build — or to rebadge a standard car as a 901 — is significant. The Porsche factory archive and the specialist historian community can confirm build year and badge specification for any O-series 911 from chassis number records. A factory Certificate of Authenticity (COA) from Porsche Classic is the minimum documentation standard. For claimed 901-badged cars, original badge hardware should be present and verifiable against known 901-badged car documentation.',
        buyer_question: 'Has a factory Certificate of Authenticity from Porsche Classic been obtained confirming the build date and original specification? Has the chassis number been independently verified against the 1964 O-series production range by a recognized specialist? For claimed 901-badged cars: is the original 901 badge hardware present, and is there delivery documentation confirming the 901 designation?',
      },
      {
        title: 'Aluminum crankcase oil seal and pushrod tube leaks',
        severity: 'caution',
        body: 'The aluminum crankcase\'s rubber oil seals and pushrod tube O-rings are 60+ years old on any unrestored 1964-build car. Near-universal weeping at the pushrod tube ends, crankshaft rear seal, and case half-joining gasket is expected on original-seal examples. A car presented as "no oil leaks" on a 60-year-old unrestored engine warrants close inspection — light weeping is normal and expected; significant leaks indicate deferred maintenance. The seal package requires engine-out work; Viton replacement seals are the correct modern specification for long-term durability.',
        buyer_question: 'When were the pushrod tube seals, crankshaft rear seal, and case gaskets last replaced? With what material — original rubber, Viton, or aftermarket equivalent? Is there visible oil weeping at the pushrod tubes or crankshaft tail area currently?',
      },
      {
        title: 'Solex carburetor originality and condition',
        severity: 'caution',
        body: 'The 1964-build cars use the original Solex 40PI specification. Many early O-series cars had their Solex carbs replaced — either by the factory during the February 1966 Weber transition or by independent shops — with Weber 40 IDA3C units. For maximum originality value, a confirmed Solex-equipped 1964 car must have the carburetors verified against period service documentation. Correctly set up Solex carbs are harder to maintain than Webers and should be evaluated by a specialist familiar with the type; an unbalanced Solex pair runs rough and masks the engine\'s actual condition.',
        buyer_question: 'Are the current carburetors the original Solex 40PI specification or later Weber 40 IDA3C units? Is there documentation of carburetor history? If Solex-equipped, when were the carburetors last rebuilt and balanced to specification?',
      },
    ],
    service: [
      'Service intervals for the 2.0L Type 901/01: valve clearance adjustment (manual — no hydraulic lifters) every 10,000–12,000 miles; oil changes every 3,000 miles using 20W-50 air-cooled formulation; ignition point inspection every 6,000 miles. The chain tensioner retrofit (P/N 930 105 911 99 with aluminum-case adapter pipe) is the single most important preventive service — it must be addressed before any other assessment. The number of specialists worldwide with documented O-series experience is small; the PCA marque registry and Porsche Club Deutschland can provide referrals. Any engine-out work on a 1964-build car should be treated as an opportunity to address the complete seals package.',
      'Pre-purchase inspection priorities for a 1964-build 911: (1) Factory COA and chassis-number verification before visiting the car — at these valuations this step is non-negotiable. (2) Chain tensioner status: oil-fed retrofit confirmed with invoice, or original mechanical tensioners requiring immediate action. (3) Compression and leakdown on all six cylinders. (4) Carburetor specification and condition — original Solex or Weber conversion, and last balanced when? (5) Under-body inspection for sill and floor pan rust. (6) Drivetrain matching-numbers verification by a recognized O-series specialist with archive access.',
    ],
    value_drivers: [
      {
        name: '901 badging vs 911 rebadge',
        description: 'A confirmed 901-badged car with original badge hardware and factory documentation commands the highest valuations in the 1964 cohort — documented sales above $1M at RM Sotheby\'s and Gooding. A 1964-build car with 911 badging (post-rename) occupies a distinct but still exceptional tier at $400K–$700K for top examples.',
      },
      {
        name: 'Factory COA and matching numbers',
        description: 'A Porsche Classic Certificate of Authenticity confirming build date, original specification, and matching-numbers drivetrain is the minimum documentation standard for any 1964-build transaction. A numbers-correct 1964-build car without verifiable COA carries a significant discount — fraud risk at these valuations is documented and real.',
      },
      {
        name: 'Chain tensioner retrofit status',
        description: 'A documented oil-fed hydraulic tensioner retrofit (P/N 930 105 911 99, with correct aluminum-case adapter) is the essential preventive maintenance record. A 1964-build car with original mechanical tensioners — 60 years old — carries an undisclosed catastrophic risk: failure will destroy the engine regardless of mileage.',
      },
      {
        name: 'Continuous documented ownership history',
        description: 'A 1964-build 911 with provenance traceable from the original buyer — factory Kardex, delivery receipt, service records, known ownership chain — commands a premium over same-condition cars with gaps in provenance. Continuous history materially reduces fraud risk and supports matching-numbers claims.',
      },
      {
        name: 'Solex carburetor originality',
        description: 'A 1964-build car retaining its original Solex 40PI carburetors in factory-correct specification commands an additional originality premium over a Weber-converted equivalent. Weber carbs became standard in February 1966 and are correct for later O-series production; Solex specification is a component of full 1964-build authenticity.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 911-f-body (1965–1973 long-hood 911)
  // Source: docs/reference/porsche_1960s_reference.md §"911/901 launch generation"
  //         docs/reference/porsche_1970s_reference.md §"911 Long-Hood (F-body) 1970–1973"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  '911-f-body': {
    positioning: 'Long-hood 911 — SWB origins through the Carrera RS 2.7',
    intro: 'The F-body 911 spans 1965 through 1973 across four displacement steps (2.0L, 2.2L, 2.4L, 2.7L RS), a fundamental wheelbase change from short to long in 1969, and the T/E/S trim hierarchy that defined Porsche for decades. The generation\'s apex — the 1973 Carrera RS 2.7 — became the template for every road-going RS that followed.',
    production_years: '1965–1973',
    body_styles: 'Coupe, Targa (from MY1967)',
    engine: '2.0L Type 901/0X flat-six (130–170 PS DIN); 2.2L Type 911/0X (125–180 PS DIN); 2.4L Type 911/5X (130–190 PS DIN); 2.7L Type 911/83 Carrera RS (210 PS DIN)',
    cooling: 'Air-cooled',
    units_produced: '~89,000 worldwide (1965–1973 combined long-hood production); Carrera RS 2.7 road cars: ~1,525',
    notes: [
      'The F-body designation covers the 911 body shell in production from 1965 through 1973 — nine model years across which the car evolved from a single 130 PS 2.0L SWB coupe into a three-trim-level, two-wheelbase-generation family with Coupe and Targa body styles. Three internal series transitions managed the 1965–1968 SWB period (O, A, and B-series), introducing the Targa body style (MY1967), the T/E/S trim hierarchy (MY1968), and Bosch mechanical fuel injection on E and S trims (MY1969). The SWB cars (2,211 mm wheelbase, 1965–1968) carry a reputation for live handling at the limit — the shorter wheelbase amplifies the inherent oversteer tendency of the rear-engine layout. The LWB transition at MY1969 (+57 mm to 2,268 mm) made the 911 meaningfully more stable and is the dominant sub-generation valuation split across the F-body.',
      'The 2.2L (MY1970–1971) and 2.4L (MY1972–1973) engine evolutions stepped the T-trim from 110 PS to 125 PS and the flagship S from 160/170 PS to 180 PS and then 190 PS, adding torque at each step. The 1972 E-series introduced the Type 915 five-speed gearbox — a substantially stronger unit replacing the original Type 901 — alongside the displacement increase and the one-year-only external oil-filler door behind the right B-pillar, eliminated after one model year because fuel-station attendants filled the oil tank with gasoline. The 1973 F-series moved the tank back, added a front chin spoiler to the S, replaced chrome and gold exterior trim with black, and introduced the Bosch K-Jetronic CIS on US-spec T cars from January 1973 — the "1973.5" cars that are the first K-Jet 911s and the start of the injection system that would carry every air-cooled 911 through the end of the SC era.',
      'The 1973 Carrera RS 2.7 was conceived as a homologation special for the 2.8L RSR race program — Porsche needed 500 road cars for FIA Group 4 qualification and expected to struggle to sell them. They sold out within weeks at the Paris Motor Show, prompting additional production runs. The final road-car count of approximately 1,525 units breaks down as 17 RSH "Homologation" cars (ultra-stripped, ~960 kg, all LHD), ~200 M471 "Sport/Lightweight" cars (Recaro shells, fiberglass bumpers, thin steel and glass, ~975 kg), and ~1,308 M472 "Touring" cars (911 S–level interior, rear seats, carpet, ~1,075 kg). The RS established every principle the subsequent GT-class road cars would reference: stripped weight, purpose-built aerodynamics, displacement increase, MFI induction. In the 2026 market, M471 Lightweights trade from $800K to beyond $1.5M; M472 Tourings from $350K–$700K.',
    ],
    variants: [
      {
        name: '911 / 911 S (O-series and A-series SWB, 2.0L)',
        years: '1965–1968',
        drivetrain: 'RWD',
        power: '130 PS DIN (base 911); 160 PS DIN (911 S from MY1967)',
        description: 'The standard 911 across the O-series (1965–1967) and A-series (1968 single-model-year). Solex 40PI carburetors through early 1966, then Weber 40 IDA3C; the 911 S (MY1967) added forged Fuchs alloys, ventilated discs, and 160 PS. All SWB (2,211 mm). These are the purest expression of the original F-body design intent — in 2026, unmolested SWB examples with documented history occupy the most actively appreciated sub-tier within the broader F-body collector market.',
      },
      {
        name: '911 T',
        years: '1968–1973',
        drivetrain: 'RWD',
        power: '110 PS (2.0L 1968); 125 PS (2.2L 1970–71); 130 PS carb RoW / 140 PS US MFI (2.4L 1972–73)',
        description: 'Base-trim 911 across the A-series through F-series. Carbureted on RoW throughout; MFI on US-spec 1972–73 T cars; Bosch K-Jetronic CIS on the "1973.5" US T from January 1973. SWB in MY1968 (A-series); LWB from MY1969 (B-series) onward. The 2.0L T used cast-iron cylinders; the 2.2L switched to alloy. Volume long-hood car and the accessible entry to F-body ownership — carbureted RoW 2.4L T examples trade at a small premium over K-Jet 1973.5 US cars among MFI purists.',
      },
      {
        name: '911 E',
        years: '1969–1973',
        drivetrain: 'RWD',
        power: '140 PS DIN (2.0L 1969); 155 PS (2.2L 1970–71); 165 PS (2.4L 1972–73)',
        description: 'Mid-trim replacement for the one-year-only 911 L, introduced for MY1969 with the LWB B-series. Bosch MFI throughout; the 2.0L E also featured Boge hydropneumatic front struts (E-only feature, discontinued MY1972). The 2.4L E (1972–73) in LWB specification with Type 915 gearbox is widely regarded as the F-body sweet spot for road use — meaningful MFI output, broader torque band, stable chassis. The MY1969 B-series 911 E (~2,820 Coupe and Targa combined) is recognized as a separate collector tier for its combination of LWB introduction and 2.0L MFI.',
      },
      {
        name: '911 S',
        years: '1967–1973',
        drivetrain: 'RWD',
        power: '160 PS DIN (2.0L 1967–68); 170 PS (2.0L 1969 B-series); 180 PS (2.2L 1970–71); 190 PS (2.4L 1972–73)',
        description: 'Top performance trim across every F-body year. Bosch MFI from MY1969; hotter cams; forged Fuchs alloy wheels standard; ventilated discs. Not US-legal MY1968 on emissions grounds; returned MY1969. The 2.4L S (F-series, 1973) with front chin spoiler and standard-equipment secondary oil cooler is the last and most refined pre-RS S. US-market buyers strongly prefer cars with documented factory MFI over any K-Jet or carbureted substitution.',
      },
      {
        name: '911 L (Lux)',
        years: '1968',
        drivetrain: 'RWD',
        power: '130 PS DIN (Type 901/06 RoW; 901/14 US)',
        production: '~1,610 Coupes + ~500–570 Targas (A-series, combined)',
        description: 'Single-model-year US-market top trim for MY1968 (A-series). Carries the 911 S brake specification and added comfort equipment over the base car. One-model-year rarity — the A-series 911 L is among the most unusual collector targets within the F-body; its single-year production and position at the historical hinge between the SWB era and the LWB B-series make it a distinct documentation challenge and an increasing collector target.',
      },
      {
        name: 'Carrera RS 2.7 — M471 Sport/Lightweight',
        years: '1973',
        drivetrain: 'RWD',
        power: '210 PS DIN (2.7L Type 911/83 Bosch MFI)',
        production: '~200 worldwide (17 RHD); 0 US factory import',
        description: 'Lightweight homologation variant: thinner-gauge steel body, fiberglass engine lid and bumpers, thin glass, Recaro shell seats, no rear seats, no clock, ~975 kg. First-series Lightweights (chassis ~001–500) with the most aggressive lightweighting command the greatest premiums — the lightweighting measures were reduced as the homologation threshold was met in later series. In 2026, M471 Lightweights trade from $800K to beyond $1.5M for documented top examples. Never factory-imported to the US; any US-titled example entered via grey market.',
      },
      {
        name: 'Carrera RS 2.7 — M472 Touring',
        years: '1973',
        drivetrain: 'RWD',
        power: '210 PS DIN (2.7L Type 911/83 Bosch MFI)',
        production: '~1,308–1,319 worldwide; 0 US factory import',
        description: 'Volume RS variant with 911 S–level interior: carpet, full sound-deadening, standard-weight steel, rear seats, clock, ~1,075 kg. Outsold the M471 roughly 6.5:1. The Touring is the accessible RS entry — matching-numbers confirmed examples in good condition trade at $350K–$700K. Shares the RS body (wide rear arches, ducktail or whale-tail spoiler), 2.7L Type 911/83 engine, and RS-specification chassis tuning with the M471; the distinction is entirely interior specification and weight.',
      },
      {
        name: '911 R',
        years: '1967–1968',
        drivetrain: 'RWD',
        power: '210 PS DIN (2.0L Type 901/22, Weber 46 IDA3C, twin-plug)',
        production: '24 total (4 prototypes + 20 customer cars)',
        description: 'Factory lightweight under Ferdinand Piëch: fiberglass bonnet, doors, fenders, and engine cover by Karl Baur of Stuttgart; Plexiglas side windows; magnesium crankcase; titanium connecting rods; ~810 kg. Won the 1967 Nürburgring Marathon de la Route (84 hours) and 1969 Tour de France overall. Never produced in sufficient numbers for FIA homologation. The structural ancestor of every GT-class lightweight 911; documented sales above $3M for provenance-correct examples.',
      },
    ],
    engineering: [
      'T/E/S trim hierarchy and the MFI/carb induction split: The T/E/S structure — entry, mid, top — was formalized for MY1968 and anchored to MY1969 with the LWB B-series. The T remained carbureted on most markets through 1973; the E and S used Bosch MFI from MY1969. This induction split is the most technically significant variant-level distinction within the F-body: MFI cars breathe more freely across the RPM range, produce more consistent output, and require less carburetor maintenance than the T. The performance gap between a 1972 E and a 1972 T is larger than the power-figure difference suggests; the MFI car\'s broader torque delivery defines the driving experience difference.',
      'SWB to LWB transition (MY1969, +57 mm wheelbase): The B-series (MY1969) extended the wheelbase by 57 mm (2,211 mm → 2,268 mm), moved the rear wheels rearward, widened the track via flared arches to accommodate 5.5J×15" wheels and 185-section tires, and introduced the magnesium crankcase and MFI on E and S trims simultaneously. The longer moment arm damped the tail-snap characteristic of SWB cars. The LWB B-series is the largest single-year engineering step in the F-body generation — and the year that established the handling baseline the 911 would carry through 1989.',
      'Type 915 gearbox introduction (MY1972 E-series): The original Type 901 five-speed had reached its torque capacity limit; the 2.4L displacement increase required a stronger transmission. The new Type 915 brought BorgWarner synchromesh, a conventional H-pattern shift (the 901 had a dogleg-first layout on some configurations), and materially greater gear-set durability. The Type 915 continued in production through the Carrera 3.2 (replaced by the Getrag G50 at MY1987). A 1972+ long-hood with Type 915 is a mechanically more durable car than its 1971-and-earlier equivalent at the gearbox.',
      'Carrera RS 2.7 homologation philosophy — founding the RS template: The RS 2.7 was engineered from a specific regulatory premise: 500 units to homologate the 2.8 RSR for FIA Group 4 GT class. The engineering response established every subsequent RS principle: stripped weight (thin steel, fiberglass components, interior deletions), displacement increase beyond the standard car (2.7L from 2.4L), purpose-built aerodynamics (ducktail spoiler, wide rear arches), and dedicated induction (MFI Type 911/83 engine). The 2.8 RSR became the dominant privateer GT platform of the early 1970s. The Touring (M472) outsold the Lightweight (M471) at launch; the collector market has since fully inverted that preference.',
      'Magnesium crankcase and the head stud pull-out failure mode (1968–1977): From the A-series (MY1968) forward, F-body 911s use a magnesium crankcase — lighter than aluminum but with differential thermal expansion from the steel head studs threaded into it. Heat cycling over years causes the magnesium threads to fatigue and the studs to pull out of the case material, leaving cylinder heads unsealed. The repair requires Time-Sert steel thread inserts machined into the case — typically $2,000–$3,000 in machining cost before reassembly labor. Prevalence is described as common, particularly on the 2.4L and the subsequent 2.7L G-body engines. Head stud condition is a mandatory pre-purchase inspection item on any 1968–1977 air-cooled 911.',
    ],
    watch_for: [
      {
        title: 'Chain tensioner failure (pre-1984 mechanical tensioners)',
        severity: 'concern',
        body: 'All F-body 911s (1965–1973) use sealed mechanical spring-loaded chain tensioners. Failure destroys the engine: the chain jumps a sprocket, pistons meet valves, and a full rebuild is required. The failure mechanism is age-driven seal degradation — a stored low-mileage car is equally at risk as a high-mileage driver. Porsche issued the oil-fed hydraulic tensioner retrofit kit (P/N 930 105 911 99) specifically for this failure mode. Cars from 1965–1968 (aluminum crankcase) require an additional adapter pipe for the retrofit; confirm the aluminum-case-specific kit was used, not a later-car kit fitted without the adapter. A car with the retrofit documented and invoiced is in the correct preventive state; a car with original mechanical tensioners — potentially 50–60 years old — carries unresolved catastrophic risk regardless of mileage.',
        buyer_question: 'Have the chain tensioners been upgraded to the 1984 Carrera oil-fed hydraulic style (P/N 930 105 911 99)? At what mileage and date was the retrofit performed? For 1965–1968 aluminum-case cars: was the aluminum-case adapter pipe installed? If original mechanical tensioners remain: have safety collars been fitted, and when were they last inspected? Has the engine made chain rattle on cold start or under load at any point?',
      },
      {
        title: 'Magnesium crankcase head stud pull-out (1968–1977 cars)',
        severity: 'concern',
        body: 'MY1968–1977 F-body 911s — the A-series through the last 2.4L F-series cars — use magnesium crankcases. Steel head studs expand and contract at a different rate than magnesium, fatiguing the case threads over heat cycles until the studs pull out. The repair requires Time-Sert steel inserts machined into the case: $2,000–$3,000 in machining cost before reassembly labor, with total repair varying enormously depending on how many studs have pulled and whether the case needs align-bore work. Prevalence is described as common, particularly on 2.4L engines. An exhaust-like sound from the cylinder head area under load is the primary symptom. Pre-purchase inspection must include head stud status.',
        buyer_question: 'Has the head stud condition been inspected by a specialist, and what was found? Is there evidence of Time-Sert or case-saver installation — a positive sign that the issue has been addressed? Are there any exhaust sounds from the cylinder head area under load? Has the engine ever been apart for any reason?',
      },
      {
        title: 'Carrera RS 2.7 — M471 vs M472 misrepresentation and VIN fraud',
        severity: 'concern',
        body: 'The price gap between a confirmed M471 Lightweight and an M472 Touring can exceed $500K–$800K, creating strong incentive to misrepresent a Touring as a Lightweight or to fabricate an RS body from a standard 911 S with a 2.7L engine swap. Authentication requires: (1) chassis number in the range 9113600011–9113601590, cross-referenced in the Porsche factory archive to confirm the M-package designation; (2) factory COA from Porsche Classic confirming M471 or M472 specification; (3) physical inspection by a recognized RS 2.7 specialist who can confirm lightweight steel gauge, fiberglass component specification, and correct interior delete items for M471 cars. Any claimed M471 Lightweight without an authenticated factory COA must be treated as unverified.',
        buyer_question: 'Has a Porsche Classic Certificate of Authenticity been obtained confirming this car\'s M471 or M472 package specification? Has the chassis number been independently cross-referenced in the Porsche factory archive? For M471 claimed cars: has a specialist physically confirmed the lightweight steel gauge at the relevant body panels, the fiberglass bumper and engine lid specification, and the correct interior deletions?',
      },
      {
        title: '1972 E-series oil-filler door car status',
        severity: 'caution',
        body: 'The 1972 E-series (MY1972) was the sole year in which the external oil-filler door was located behind the right B-pillar. The configuration was eliminated after MY1972 — the oil tank moved back to its standard location for the F-series — and many E-series bodies had the B-pillar opening modified or filled by previous owners. An original, unmodified 1972 filler-door car is sought by collectors for singular specification authenticity; a car with the opening filled, disguised, or modified represents non-disclosed bodywork alteration that should be disclosed.',
        buyer_question: 'If this is a 1972 E-series car: is the original oil-filler door opening present on the right B-pillar, or has it been modified? If modified, what method was used and is there documentation? Is the oil tank currently in the forward E-series position or the later behind-the-wheel position?',
      },
      {
        title: '1973.5 K-Jet vs MFI T-trim engine specification',
        severity: 'caution',
        body: 'US-spec 911 T cars built from January 1973 onward ("1973.5") switched from Bosch MFI to K-Jetronic CIS injection. The K-Jet T cars are the first 911s with the CIS system that would carry every air-cooled US-market 911 through the SC era; they are mechanically sound but the throttle response of the K-Jet is noticeably less immediate than the MFI cars. Some collectors strongly prefer pre-January-1973 MFI T cars and discount K-Jet equivalents. Engine code and build date establish which specification is correct for a given car.',
        buyer_question: 'For a 1973 US-spec T: what is the engine code, and does it confirm MFI (Type 911/51 or 911/52) or K-Jetronic (Type 911/91) specification? Is the build date documented to confirm which side of the January 1973 production transition this car falls on?',
      },
    ],
    service: [
      'Service intervals for the F-body 911 (all displacements): valve clearance adjustment (manual — no hydraulic lifters) every 10,000–12,000 miles; oil changes every 3,000 miles using 20W-50 or an air-cooled-specific formulation; ignition point inspection every 6,000 miles; carburetor synchronization on T-trim carbureted cars annually. The chain tensioner retrofit (P/N 930 105 911 99, with aluminum-case adapter pipe for 1965–1968 cars) is the single most important preventive action on any F-body — confirm it is documented before any other assessment. For 1968–1977 magnesium-case cars, head stud condition is the second mandatory evaluation.',
      'Pre-purchase inspection priorities for an F-body 911: (1) Chain tensioner retrofit documentation — no exceptions, regardless of stated mileage. (2) For 1968–1977 cars: head stud inspection by a specialist; Time-Sert status; any exhaust sounds from the cylinder head area. (3) Compression and leakdown on all six cylinders. (4) Engine number and gearbox number cross-referenced with chassis against the Porsche factory archive — critical on RS 2.7 and any claimed-rare variant. (5) For carbureted T-trim cars: carburetor balance test and ignition timing confirmation. (6) For Carrera RS 2.7: factory COA, chassis-number archive verification, and specialist physical inspection before any commitment — at these valuations, an independent authentication process is non-negotiable.',
    ],
    value_drivers: [
      {
        name: 'Carrera RS 2.7 — M471 Lightweight commands the highest long-hood valuations',
        description: 'The M471 Sport/Lightweight (~200 produced) commands $800K–$1.5M+ in 2026 versus $350K–$700K for the M472 Touring (~1,308 produced). The Lightweight\'s lower production, stripped specification, and direct connection to the RSR race program drive the premium. Authentication of M-package specification via factory COA is mandatory before any RS transaction.',
      },
      {
        name: 'SWB (1965–1968) vs LWB (1969–1973) — a distinct collector tier',
        description: 'SWB F-body 911s (2,211 mm wheelbase, 1965–1968) occupy a separate collector tier from LWB cars (2,268 mm, 1969–1973). SWB cars carry premiums for their founding-configuration character, original Solex/Weber specification, and pre-MFI authenticity. Within the SWB group, soft-window Targa cars (MY1967 and approximately half of MY1968) command further premiums for rarity and 1960s-era specification.',
      },
      {
        name: 'Engine displacement and induction system tier',
        description: 'Within the T/E/S hierarchy, MFI cars (E and S, all years; US T 1972–73 pre-K-Jet) command premiums over carbureted equivalents. Each displacement step commands a premium in equivalent trim: 2.4L > 2.2L > 2.0L. The 2.4L S (F-series, 1973) is the most valued standard long-hood drivetrain outside the RS. K-Jet 1973.5 US T cars trade at a discount versus MFI equivalents among condition-equivalent buyers.',
      },
      {
        name: 'Chain tensioner retrofit documentation',
        description: 'A documented oil-fed tensioner retrofit (P/N 930 105 911 99 with correct aluminum-case adapter for pre-1968 cars) is a positive value signal. A car with original mechanical tensioners — no retrofit documented — carries an undisclosed catastrophic risk and should be priced to reflect both the retrofit cost and the risk premium. Tensioner documentation is a standard pre-purchase requirement on any pre-1984 air-cooled 911.',
      },
      {
        name: 'Matching numbers and Porsche Classic COA',
        description: 'A confirmed matching-numbers long-hood — chassis, engine, and gearbox numbers verified against the Porsche factory archive and supported by a Porsche Classic Certificate of Authenticity — commands a meaningful premium over a same-condition car with undocumented drivetrain history. The COA is the reference standard for high-value F-body transactions and eliminates ambiguity about numbers-matching claims.',
      },
      {
        name: 'SWB soft-window Targa rarity',
        description: 'Original soft-window Targa cars — MY1967 and approximately half of MY1968 production, with the flexible plastic rear screen — are a sought-after F-body sub-cohort. Most were converted to fixed-glass rear windows in the decades following production; a confirmed original soft-window Targa with documented unaltered specification commands a substantial premium.',
        applies_to: {
          body_styles: ['Targa'],
        },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // g-series-2.7 (1974–1977 G/H/I/J-series impact-bumper 911)
  // Source: docs/reference/porsche_1970s_reference.md §"911 G-body, 1974–1977"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  'g-series-2.7': {
    positioning: 'Impact-bumper G-body — the last MFI street 911 and the first galvanized body',
    intro: 'The 1974–1977 G-body generation absorbed federal 5-mph impact bumper regulations without sacrificing the 911 formula, introduced three mechanically distinct cars all wearing the "Carrera" badge — a naming confusion that persists in valuations today — and closed the Bosch MFI era on street 911s with the Euro Carrera 2.7. The 1976 introduction of full hot-dip galvanizing was one of the most consequential production changes in 911 history.',
    production_years: '1974–1977',
    body_styles: 'Coupe, Targa',
    engine: '2.7L K-Jet flat-six (150–175 PS DIN, base and S); 2.7L Type 911/83 Bosch MFI Euro Carrera (207 PS DIN — same engine as 1973 Carrera RS 2.7); 3.0L Type 930/02 K-Jet Carrera 3.0 (200 PS DIN, MY1976–1977 Euro only)',
    cooling: 'Air-cooled',
    units_produced: '~36,800 G/H/I/J-series naturally aspirated 911s (1974–1977 only); includes ~2,260 Euro Carrera 2.7 MFI, ~910 US Carrera 2.7 K-Jet, ~3,680 Carrera 3.0',
    notes: [
      'The MY1974 G-series was the most consequential year-on-year exterior redesign in 911 history short of the 964 launch in 1989. Federally mandated 5-mph impact bumpers reshaped both ends of the car; despite initial enthusiast pessimism, the integration was executed with enough engineering clarity that the body architecture survived structurally unchanged through 1989. Less visibly but more significantly, the 1974 redesign committed the entire US lineup to Bosch K-Jetronic CIS injection — the system that, with refinements, carried every air-cooled US-market 911 through the end of the SC era.',
      'The "Carrera" badge in 1974–1977 names three mechanically distinct cars and is the single largest source of valuation errors in this generation. The Euro Carrera 2.7 MFI (1974–1976) carries the Type 911/83 engine at 207 DIN horsepower — the same mechanical injection setup as the 1973 Carrera RS 2.7, in a galvanized G-body shell, never sold in the US as new production. The US Carrera 2.7 (1974–1975) is a K-Jet 911 S in wide-arch bodywork — visually a Carrera, mechanically a 911 S — worth considerably less. The Carrera 3.0 (1976–1977, Euro only) is a fundamentally different car with the new 3.0L naturally aspirated engine that prefigures every 911 SC and Carrera 3.2 to follow. Authentication of MFI specification via engine number is essential before any Carrera transaction in this generation.',
      'The MY1976 introduction of full hot-dip galvanizing was a watershed for long-term 911 ownership. Pre-1976 G-bodies (MY1974 G-series and MY1975 H-series) were built with partial galvanizing and are substantially more rust-prone in floors, inner sills, and wheel arches. The 1976+ galvanized shells regularly outlive three or four powertrains when properly maintained, and the 6-year corrosion warranty Porsche issued at that launch (extended to 10 years by 1985) reflected genuine engineering confidence. For collectors, the pre-1976 versus post-1976 split governs both restoration cost estimates and the credibility of any underbody originality claims.',
    ],
    variants: [
      {
        name: '911 (base) 2.7',
        years: '1974–1975',
        drivetrain: 'RWD',
        power: '150 hp DIN (143 SAE, US)',
        production: '~9,360 worldwide (Coupe and Targa)',
        description: 'Narrow-body entry-level 2.7L K-Jet coupe and Targa, built only for MY1974–1975 before the lineup consolidated. Replaced by the 911 Lux (RoW) and 911 S (US) from MY1976 onward. The most common early G-body and the most accessible entry point for this generation.',
      },
      {
        name: '911 S 2.7 / 911 Lux 2.7',
        years: '1974–1977',
        drivetrain: 'RWD',
        power: '175 hp DIN (1974); 165 hp DIN (1975+ after emissions detuning)',
        production: '~6,730 (MY1974–1975); ~13,830 (MY1976–1977 combined Lux/S)',
        description: 'Narrow-body volume trim through the generation. Named "S" in the US and Japan, "Lux" in RoW from MY1976 — mechanically identical. California MY1975 H-series 911 S cars were fitted with a thermal reactor directly below the left cylinder bank, causing above-average magnesium-case head-stud failure rates on that bank — a specific pre-purchase inspection flag for California-delivered H-series cars.',
      },
      {
        name: 'Carrera 2.7 MFI (Euro/RoW)',
        years: '1974–1976',
        drivetrain: 'RWD',
        power: '207 hp DIN (210 PS) — Type 911/83 Bosch MFI',
        production: '~1,630 Coupes + ~630 Targas worldwide; MY1976 DE Sondermodell: 113 coupes',
        description: 'The most desired naturally aspirated G-body configuration. Wide RS-style rear arches; ducktail spoiler standard on MY1974 cars (whale-tail optional from MY1975). Same Type 911/83 engine as the 1973 Carrera RS 2.7 — same MFI, same 210 PS — in a galvanized G-body shell. Never sold in the US as new production. The MY1976 German Sondermodell (113 coupes) exhausted the last stock of 911/83 RS engines; the 20 Belgian-Gendarmerie narrow-body 1976 Targas are scarcer still. The Euro Carrera 2.7 MFI is the last mechanical-injection street 911.',
      },
      {
        name: 'Carrera 2.7 K-Jet (US-spec)',
        years: '1974–1975',
        drivetrain: 'RWD',
        power: '175 hp SAE (1974); 165 hp (1975)',
        production: '~910 US only',
        description: 'Wide-arch Carrera body on a K-Jet 911 S drivetrain — visually a Carrera, mechanically a 911 S. The principal source of "Carrera" valuation confusion in this generation: buyers paying MFI premiums for K-Jet cars is a documented market error. Engine number cross-reference is definitive: Type 911/83 = MFI; Type 911/92 or 911/93 = K-Jet.',
      },
      {
        name: 'Carrera 3.0 (Euro/RoW)',
        years: '1976–1977',
        drivetrain: 'RWD',
        power: '200 hp DIN — Type 930/02 K-Jet 3.0L NA',
        production: '~3,680 worldwide (Coupe and Targa)',
        description: 'Wide-arch body on the new naturally aspirated 3.0L engine — a derivative of the 930 Turbo block — at 200 DIN. Euro only; not imported to the US. Heavier and more luxuriously specified than the MFI Carreras, but the 3.0L engine is the foundation of every 911 SC and Carrera 3.2 to follow. Frequently cited as the most refined G-body 911 to use regularly.',
      },
      {
        name: '911 S Silver Anniversary Edition',
        years: '1975',
        drivetrain: 'RWD',
        power: '165 hp DIN — same as H-series 911 S 2.7',
        production: '1,063 worldwide (~504 US)',
        description: "Porsche's first commemorative limited edition, marking 25 years of production. Distinguished by Diamond Silver Metallic paint, black-leatherette-and-tweed upholstery, and a numbered console plaque. Available as Coupe and Targa. Mechanically identical to a standard H-series 911 S. Collector premium is modest but consistent; intact numbered plaque with edition documentation is the key provenance item.",
      },
    ],
    engineering: [
      "K-Jetronic CIS injection across the US lineup from MY1974: The G-series was the first 911 generation to use Bosch K-Jetronic on all US-spec cars from launch. K-Jet's primary advantage over carburetion is cold-start and warm-up refinement; its tradeoff versus Bosch MFI is less immediate throttle response and marginally lower peak output. The K-Jet system carries every US air-cooled 911 through the SC era and is well-understood by specialists; aging fuel distributors and warm-up regulators are the primary maintenance items after five decades.",
      "G-body impact bumper integration (MY1974): Federal 5-mph requirements reshaped both ends of the car. The front bumper incorporated directional indicators; the rear gained rubber-faced overriders. Porsche's solution was executed with enough engineering coherence that the body architecture ran unchanged through 1989 — a 16-year run on an originally compliance-driven design.",
      'Three-tier Carrera variants and the MFI/K-Jet split: The Carrera name in 1974–1977 spans three mechanically distinct cars. The Euro Carrera 2.7 MFI is the direct street continuation of the 1973 RS 2.7 — same Type 911/83 engine, 207 DIN. The US Carrera 2.7 is a wide-arch 911 S with K-Jet. The Carrera 3.0 is a new engine entirely. The Euro MFI Carrera is the last air-cooled 911 with Bosch mechanical injection; all subsequent normally aspirated air-cooled 911s use K-Jet or, from the Carrera 3.2, Bosch Motronic.',
      'Full hot-dip galvanizing from MY1976 (I-series): Progressive galvanizing began for MY1975; the full hot-dip treatment across the entire shell was achieved from MY1976 onward, enabling Porsche\'s contemporaneous 6-year corrosion warranty. Pre-1976 G-bodies suffer sill, floor, and wheel arch rust substantially more than 1976+ examples. The MY1976+ shell is the structural reason why G-body 911s regularly outlive multiple powertrains when maintained.',
      'Magnesium crankcase head stud pull-out (all 2.7L G-body cars, 1974–1977): All 2.7L G-body engines retain the magnesium crankcase of the prior F-body generation. Steel-to-magnesium thread fatigue over heat cycles remains the dominant engine-structural failure mode. California-spec MY1975 H-series cars with the thermal reactor below the left bank suffered above-average failure rates from localized heat. The Carrera 3.0 and all subsequent SC engines switched to aluminum, ending the magnesium failure mode permanently.',
    ],
    watch_for: [
      {
        title: 'Chain tensioner failure (pre-1984 — all G-body 1974–1977)',
        severity: 'concern',
        body: 'All G-body 2.7L and 3.0L normally aspirated 911s through MY1977 use sealed mechanical spring-loaded chain tensioners subject to age-driven seal failure. Failure causes chain jump, valve-piston contact, and engine destruction — not recoverable. Age, not mileage, drives the failure: a well-stored low-mileage car is equally at risk as a high-mileage driver. The oil-fed hydraulic tensioner retrofit (P/N 930 105 911 99) eliminates this risk. Confirm documented retrofit before any other mechanical assessment. G-body cars use the magnesium-case kit; the aluminum-case adapter pipe specific to 1965–1968 F-body cars does not apply here.',
        buyer_question: 'Have the chain tensioners been upgraded to the 1984 Carrera oil-fed hydraulic style (P/N 930 105 911 99)? At what mileage and date was the retrofit performed? If original mechanical tensioners remain, have safety collars been fitted and when were they last inspected? Has the engine produced chain rattle on cold start or under load at any point?',
      },
      {
        title: 'Magnesium crankcase head stud pull-out (2.7L cars, 1974–1977)',
        severity: 'concern',
        body: 'All 2.7L G-body 911s use the magnesium crankcase introduced with the A-series in MY1968. Steel head studs fatigue the magnesium threads over heat cycles until studs pull out. Repair requires Time-Sert steel inserts: $2,000–$3,000 in machining cost before labor. California-delivery MY1975 H-series 911 S and Carrera cars with the thermal reactor are at elevated risk on the left bank. The 3.0L SC engine (MY1978+) switched to aluminum, permanently resolving this failure mode.',
        buyer_question: 'Has the head stud condition been inspected by a specialist, and what was found? Is there evidence of Time-Sert or case-saver installation — a positive finding? Are there exhaust-like sounds from the cylinder head area under load? Has the engine ever been disassembled, and if so, what was the head stud status?',
      },
      {
        title: '"Carrera" badge misrepresentation — three distinct cars',
        severity: 'concern',
        body: 'The 1974–1977 Carrera badge covers three mechanically distinct configurations with significantly different values: (1) Euro Carrera 2.7 MFI — 207 hp, Bosch MFI, Euro only, most desired; (2) US Carrera 2.7 K-Jet — same wide arch, K-Jet injection, mechanically a 911 S; (3) Carrera 3.0 — separate 3.0L car. A K-Jet car priced as an MFI car is a valuation error of $80K–$150K. Authentication requires engine type number: Type 911/83 = MFI; Type 911/92 or 911/93 = K-Jet.',
        buyer_question: 'What is the engine type number stamped on this car — Type 911/83 (MFI) or Type 911/92/93 (K-Jet)? Has the engine number been cross-referenced in the Porsche factory archive to confirm chassis match? If described as a Euro MFI Carrera: has a Porsche Classic COA been obtained confirming original engine specification?',
      },
      {
        title: 'Pre-1976 body rust (MY1974–1975 non-fully-galvanized shells)',
        severity: 'concern',
        body: 'MY1974 G-series and MY1975 H-series cars lack full hot-dip galvanizing. After five decades, floor pans, inner sills, lower A- and B-pillars, and wheel arch closing panels are the primary rust zones. Structural rust in the sill or floor is a significant repair cost affecting chassis integrity. Pre-1976 G-bodies require more thorough underbody evaluation than 1976+ galvanized examples — underbody sealant can conceal rust on uninspected cars.',
        buyer_question: 'Has the underbody been inspected on a lift with sill probing? Are floor pans, inner sills, and wheel arch areas structurally solid? Has any underbody repair been done, and what was the scope? Is the car a MY1976+ galvanized body or a pre-1976 car — confirmed by build date?',
      },
      {
        title: 'California MY1975 thermal reactor head stud damage',
        severity: 'caution',
        body: 'US-spec H-series (MY1975) 911 S and Carrera cars delivered to California were fitted with a thermal reactor below the left cylinder bank for California emissions compliance. The sustained localized heat caused above-average left-bank head stud failure rates on the magnesium case. Many affected cars have had Time-Sert or case-saver repairs; some have had the crankcase replaced. Any California-delivery H-series car requires specific left-bank head stud inspection.',
        buyer_question: 'Is this a California-delivery MY1975 car? If so, what is the left-bank head stud status? Is there documentation of Time-Sert or case repair? Is the original crankcase installed, or has it been replaced? Has the thermal reactor been removed or retained?',
      },
    ],
    service: [
      'Service priorities for any G-series 2.7L car: (1) Chain tensioner retrofit (P/N 930 105 911 99) — the non-negotiable first check; confirm documented retrofit before any other assessment. (2) Head stud inspection — inherent to all 2.7L magnesium-case cars; Time-Sert evidence is a positive finding. (3) Compression and leakdown on all six cylinders. (4) K-Jet injection system calibration: metering head condition, warm-up regulator function, fuel pressure at idle and wide-open throttle. (5) Valve clearance adjustment (no hydraulic lifters; 10,000–12,000-mile intervals) and ignition distributor condition. For Carrera 3.0 cars: the 3.0L aluminum-case engine has no head-stud risk, but chain tensioner retrofit still applies; confirm gearbox oil seals and shift quality on the Type 915.',
      'Pre-purchase checklist for a G-body 1974–1977: (1) Chain tensioner retrofit documentation — no exceptions regardless of mileage. (2) For 2.7L cars: engine number confirming K-Jet vs MFI specification; head stud inspection. (3) For pre-1976 cars: underbody lift inspection with sill probing. (4) For claimed Euro Carrera 2.7 MFI: engine number cross-referenced in the factory archive; Porsche Classic COA confirming original specification. (5) For California MY1975 S or Carrera: left-bank head stud assessment. (6) Oil pressure cold and hot; external oil cooler condition. (7) Dashboard surface — G-body dashboards crack with age; a cracked pad is cosmetic but a budget item.',
    ],
    value_drivers: [
      {
        name: 'Euro Carrera 2.7 MFI — the most desired naturally aspirated G-body',
        description: 'The Euro Carrera 2.7 MFI (1974–1976, ~2,260 cars) carries the Type 911/83 Bosch MFI engine — the same specification as the 1973 Carrera RS 2.7 — and is the last mechanical-injection street 911. Auction values in strong condition: $150K–$300K+ depending on year and specification. The MY1976 German Sondermodell (113 coupes, last MFI 911s) trades at the top of the range. Authentication via engine number and factory COA is essential — the value gap versus a K-Jet car can exceed $100K.',
      },
      {
        name: 'MY1976+ galvanized body — the long-term ownership dividing line',
        description: 'MY1976+ G-bodies (I-series and J-series) built with full hot-dip galvanizing carry a meaningful structural integrity premium over pre-1976 equivalents. The galvanized shell is the structural reason why well-maintained G-body 911s outlive multiple powertrains and support the kind of maintenance investment that makes them appreciating assets. Pre-1976 G-bodies can be desirable configurations — particularly MY1974 Carrera MFI — but carry higher restoration cost risk.',
      },
      {
        name: 'Chain tensioner retrofit documentation',
        description: 'Documented oil-fed tensioner retrofit (P/N 930 105 911 99) is a positive value signal on any pre-1984 G-body. A car without documented retrofit carries an undisclosed catastrophic engine-destruction risk that must be reflected in price or remedied before purchase. Tensioner documentation is standard pre-purchase practice on all pre-1984 air-cooled 911s.',
      },
      {
        name: 'MY1974 Carrera ducktail — period specification premium',
        description: 'The MY1974 Euro Carrera 2.7 MFI with original ducktail spoiler (standard on G-series, regulation-restricted in Germany only) is the most photographed G-body configuration. An unmodified example retaining the original factory ducktail and wide-arch specification commands a premium for period-correct appearance over later whale-tail cars. Factory-fitment provenance can be confirmed via the Porsche archive.',
        applies_to: {
          trim_categories: ['carrera_27_mfi'],
        },
      },
      {
        name: 'Silver Anniversary Edition — first Porsche commemorative edition',
        description: "The 1975 Silver Anniversary Edition (1,063 cars, ~504 US) is Porsche's first commemorative limited edition. Collector premium is modest but consistent; original Diamond Silver Metallic paint, intact numbered console plaque, and documented edition specification are the value-supporting provenance items.",
        applies_to: {
          trim_categories: ['silver_anniversary'],
        },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 911-sc (1978–1983 — consolidated SC lineup, 3.0L aluminum case, K-Jet)
  // Source: docs/reference/porsche_1970s_reference.md §"911 SC, 1978–1979"
  //         docs/reference/porsche_1980s_reference.md §"911 G-Body (Carrera 3.2 and SC)"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  '911-sc': {
    positioning: 'The 911 SC — single-trim consolidation and the first factory 911 Cabriolet',
    intro: "The 911 SC replaced the three-tier 911/S/Carrera lineup with a single normally aspirated model, running from 1978 through 1983. Originally positioned as the 911's final production run before the water-cooled 928 was expected to take over the brand, the SC's strong sales helped Peter Schutz reverse that plan in 1981 and confirm the 911 as Porsche's permanent flagship. The SC introduced the 3.0L aluminum crankcase that definitively solved the magnesium head-stud failure mode, and produced the first factory Porsche Cabriolet since the 356 in its final model year.",
    production_years: '1978–1983',
    body_styles: 'Coupe, Targa, Cabriolet (1983 only)',
    engine: '3.0L Type 930/03 (US 49-state), 930/04 (US California), 930/02 (RoW) air-cooled flat-six — K-Jetronic injection; 180 hp at launch, rising to 188 hp RoW (MY1980) and 204 PS RoW (MY1981+)',
    cooling: 'Air-cooled',
    units_produced: '~58,900–60,700 worldwide (full six-year run 1978–1983); ~19,000 from the 1978–1979 portion alone',
    notes: [
      "The 911 SC was conceived as a production simplification model — one normally aspirated 911 instead of three trim levels — and was expected to be the 911's last chapter as chairman Ernst Fuhrmann planned to transition the brand to the front-engined 928. The plan was reversed when Peter Schutz took over as chief executive in early 1981 on the strength of SC demand, immediately extending the 911 program indefinitely. MY1978 K-series cars are visually distinctive for their chrome window surrounds and headlight bezels, unique in the SC family; MY1979 L-series cars switched to black-anodized surrounds. Power was 180 hp at launch across all markets, with RoW cars gaining 188 hp for MY1980 and 204 PS for MY1981.",
      "The SC's 3.0L engine uses an aluminum crankcase — a deliberate departure from the magnesium cases used on every 911 from MY1968 through MY1977. The switch definitively resolved the head-stud pull-out failure mode: aluminum and steel expand at compatible rates under heat cycling, so the steel-to-magnesium thread fatigue mechanism simply does not apply to SC engines. This was one of the most consequential engineering changes in 911 history. The aluminum case design runs from the SC through the final 993. The chain tensioner retrofit (P/N 930 105 911 99) remains the single most important preventive action on SC engines — all SC years through MY1983 retain mechanical tensioners, as the 1984 Carrera 3.2 was the first 911 to receive the oil-fed hydraulic tensioner from the factory.",
      'The 1983 MY SC Cabriolet is one of the landmark Porsche production events of the decade: the first factory open 911 since the 356 era, approximately 4,200 produced in the single introductory model year. The SC/RS Type 954 — 21 homologation coupes built in 1984 for FIA Group B Evolution, after the SC nameplate had been replaced by the Carrera 3.2 — uses the older 3.0L block with Kugelfischer mechanical injection and is a distinct racing-homologation car unrelated to the regular SC.',
    ],
    variants: [
      {
        name: '911 SC (1978–1979 K/L-series)',
        years: '1978–1979',
        drivetrain: 'RWD',
        power: '180 hp DIN/SAE (all markets at launch)',
        production: '~19,030 worldwide (Coupe and Targa)',
        description: 'First-generation SC. MY1978 K-series cars are visually distinguished by chrome window surrounds and headlight bezels — unique in the SC family. MY1979 L-series switched to black-anodized surrounds. Sportomatic semi-automatic available through MY1979 (dropped for MY1980). Power unchanged at 180 hp for both years. Chrome trim is authentic to MY1978 only; confirm specification if a K-series premium is part of the asking price.',
      },
      {
        name: '911 SC (1980–1983 A/B/C/D-series)',
        years: '1980–1983',
        drivetrain: 'RWD',
        power: '188 hp RoW (MY1980); 204 PS RoW (MY1981+); 180 hp US throughout',
        production: '~39,900 worldwide (1980–1983)',
        description: "Main production run following Peter Schutz's decision to continue the 911 program. RoW cars gained power in MY1980 (188 hp) and again in MY1981 (204 PS); US-spec cars remained at 180 hp throughout due to catalytic-converter constraints. These are the most common SC cars and form the baseline for SC valuation.",
      },
      {
        name: '911 SC Cabriolet',
        years: '1983',
        drivetrain: 'RWD',
        power: '180 hp DIN (US); 204 PS (RoW)',
        production: '~4,210 worldwide (introductory year only)',
        description: 'The first factory open-top 911 since the 356 era. Manual soft top; rear jump seats retained. All MY1983 Cabriolets use the Type 915 gearbox and the 3.0L engine. The body required sill and floor stiffening to compensate for the removed roof structure. A well-preserved first-year SC Cabriolet commands a meaningful premium over same-year Coupe and Targa.',
      },
      {
        name: '911 SC/RS (Type 954)',
        years: '1984',
        drivetrain: 'RWD',
        power: '250–255 hp — Type 930/18 Kugelfischer mechanical injection',
        production: '21 cars (20 production + 1 museum car)',
        description: 'FIA Group B Evolution homologation special, built after the SC nameplate had been replaced by the Carrera 3.2. Uses the older 3.0L block — switching to the 3.2L would have placed the car in a heavier weight class — with Kugelfischer mechanical injection, close-ratio Type 915 gearbox, single-piece Recaro buckets, and lightweight panels. Claimed unladen weight ~960 kg. Five of the 20 production cars went to Rothmans/Prodrive for the 1984 European and Middle East rally programmes. Museum-grade valuation; independent specialist authentication required for any transaction.',
      },
    ],
    engineering: [
      'Aluminum crankcase — definitive resolution of the magnesium head-stud failure mode: The 3.0L SC engine used a pressure-cast aluminum crankcase, replacing the magnesium units that had caused head-stud pull-out failures on every 911 from MY1968 through MY1977. Aluminum and steel expand at compatible rates under heat cycling, so the thread-fatigue failure mechanism does not apply to SC engines. This was a deliberate engineering decision that Porsche accepted at the cost of slightly higher case weight; the aluminum design runs from the SC through the final 993.',
      "Type 915 five-speed gearbox throughout: All SC production uses the Type 915 gearbox introduced with the 2.4L F-body in MY1972. The 915 is known for characteristically notchy shift quality in cold conditions and oil-seal degradation with age — inspection items rather than defects, but relevant on high-mileage cars. The Carrera 3.2 replaced the 915 with the Getrag G50 from MY1987; the G50's shift quality improvement is widely considered the most significant mid-cycle improvement in G-body history.",
      'K-Jetronic fuel injection retained and refined: The SC uses Bosch K-Jetronic mechanical CIS injection, carried forward from the G-body era. By the SC era the system is well-understood by Porsche specialists; aging fuel distributors, warm-up regulators, and injection line check valves are the primary maintenance items after four decades. The Carrera 3.2 replaced K-Jet with Bosch Motronic — a substantially more reliable electronic system — which accounts for the Carrera\'s stronger reputation as a daily-usable air-cooled 911.',
      'Pre-1984 chain tensioners apply through MY1983: The oil-fed hydraulic tensioner retrofit that eliminates the chain-jump failure mode was introduced on the 1984 Carrera 3.2. All SC engines through MY1983 retain the sealed mechanical tensioners. The retrofit kit (P/N 930 105 911 99) applies to SC engines without modification; no adapter pipes are required. Documenting the retrofit is the single most important pre-purchase action on any SC.',
      'First factory 911 Cabriolet (MY1983): The SC Cabriolet introduced the open-top body style to the 911 for the first time since the 356, using a manual soft top. The power-operated soft top arrived on the Carrera 3.2 Cabriolet from MY1987. The structure required stiffening of the body sills and floor. The Cabriolet body continued into the Carrera 3.2 era and ran through the G-body\'s end in 1989.',
    ],
    watch_for: [
      {
        title: 'Chain tensioner failure (all SC through MY1983)',
        severity: 'concern',
        body: 'All SC engines through MY1983 use the sealed mechanical spring-loaded chain tensioners subject to age-driven seal failure. Failure is catastrophic: chain jumps, valves meet pistons, engine is destroyed. The age-driven mechanism means low-mileage stored cars are equally at risk as high-mileage drivers. The oil-fed hydraulic retrofit (P/N 930 105 911 99) eliminates this risk permanently on SC engines without requiring adapters. Confirm documented retrofit before any other assessment. The 1984 Carrera 3.2 received the oil-fed tensioner from the factory; the last MY1983 SC production did not.',
        buyer_question: 'Have the chain tensioners been upgraded to the 1984 Carrera oil-fed hydraulic style (P/N 930 105 911 99)? At what mileage and date was the retrofit performed? If original mechanical tensioners remain, have safety collars been fitted and when were they last inspected? Has the engine made chain rattle on cold start or under load at any point?',
      },
      {
        title: 'Type 915 gearbox oil seals and shift quality',
        severity: 'caution',
        body: 'The Type 915 gearbox on all SC cars is a four-decade-old design with known oil-seal degradation at the input shaft, output shaft, and shifter rod. Weeping seals are a maintenance item but often neglected on cars with incomplete service histories; a dry 915 damages synchros. Cold-condition notchiness is normal. Abnormal: excessive notchiness when fully warm, difficulty finding gears, grinding synchros, or oil residue on the underside of the gearbox casing.',
        buyer_question: 'Has the Type 915 gearbox been serviced recently, and are the oil seals known to be in good condition? Is there any oil residue on the underside of the gearbox? Does the gearbox shift cleanly in all gears when fully warmed up?',
      },
      {
        title: 'K-Jet fuel system aging — distributor and warm-up regulator',
        severity: 'caution',
        body: "The SC's K-Jetronic fuel distributor, warm-up regulator, and injection line check valves are now 40+ years old. An out-of-specification fuel distributor causes rough cold-start, unstable idle, lean or rich running at part-throttle, and hesitation. Neither failure is catastrophic, but an unserviced K-Jet system on a high-mileage SC is a real reliability concern and a maintenance budget item. Fuel pressure testing by a K-Jet-familiar specialist should be part of any SC pre-purchase inspection.",
        buyer_question: 'Has the K-Jetronic system been serviced or calibrated recently — specifically the fuel distributor and warm-up regulator? Are there idle quality, cold-start, or fuel delivery issues in the service history? What is the fuel pressure at idle and under load?',
      },
      {
        title: 'Dashboard surface cracking — cosmetic but budgeted',
        severity: 'caution',
        body: 'The vinyl-covered dashboard padding on G-body cars (1974–1989) is prone to surface cracking under sustained UV and heat cycling — near-universal on well-aged SC cars without interior protection or storage. Cosmetic condition only; does not indicate mechanical neglect. A cracked dashboard pad is a restoration budget item; a replacement or re-covered pad in good condition is a notable positive.',
        buyer_question: 'Has the dashboard been replaced, re-covered, or restored? If so, by whom and when? Has the car been stored indoors or protected from sustained UV exposure?',
      },
    ],
    service: [
      'Service priorities for any 911 SC: (1) Chain tensioner retrofit (P/N 930 105 911 99) — the single non-negotiable check; confirm documented retrofit regardless of stated mileage. (2) Compression and leakdown on all six cylinders. (3) K-Jetronic fuel system: fuel pressure at idle and WOT, warm-up regulator condition, fuel distributor calibration. (4) Type 915 gearbox oil seals — check for weeping at input shaft, output shaft, and shifter rod. (5) Valve clearance adjustment (no hydraulic lifters; 12,000-mile intervals). (6) Oil pressure cold and hot; inspect the external oil cooler for condition and seal integrity.',
      'Pre-purchase inspection checklist for a 911 SC: (1) Chain tensioner retrofit documentation — no exceptions. (2) Compression and leakdown on all six cylinders. (3) K-Jet fuel system calibration and delivery pressure. (4) Type 915 gearbox oil seal condition and shift quality when fully warm. (5) For MY1978 K-series: confirm chrome trim authenticity if a first-year premium is included in the asking price. (6) For SC Cabriolet: soft top operation, seal condition, and sill/floor structural integrity. (7) Dashboard pad condition — cosmetic but a budget item. (8) Engine and gearbox numbers cross-referenced with chassis via the Porsche factory archive for any high-value transaction.',
    ],
    value_drivers: [
      {
        name: '1983 SC Cabriolet — first factory open 911 since the 356',
        description: 'The MY1983 SC Cabriolet (~4,210 produced) is a landmark variant: the first factory open-top 911 since the 356 era, never offered in 14 years of prior 911 production. Well-preserved first-year SC Cabriolets command a meaningful premium over same-year Coupe and Targa. The soft-top mechanism, sill/floor structural integrity, and top condition are the primary inspection items.',
        applies_to: {
          body_styles: ['Cabriolet'],
        },
      },
      {
        name: 'MY1978 chrome trim — visually unique first-year SC',
        description: "The MY1978 K-series SC is visually distinct within the SC family for its chrome window surrounds and headlight bezels — a one-year specification before transitioning to black-anodized for MY1979 onward. Chrome-trim first-year SCs carry a consistent modest premium among SC buyers; documented K-series build date and intact chrome are the supporting provenance items.",
      },
      {
        name: 'Chain tensioner retrofit documentation',
        description: 'Documented oil-fed tensioner retrofit (P/N 930 105 911 99) is a positive value signal on any SC. A car without documented retrofit carries an undisclosed catastrophic risk. Tensioner documentation is standard pre-purchase practice on all pre-1984 air-cooled 911s including the SC.',
      },
      {
        name: '911 SC/RS Type 954 — Group B homologation special',
        description: 'The SC/RS Type 954 (21 cars, 1984) is a museum-grade homologation special with ~960 kg kerb weight, Kugelfischer mechanical injection, and direct connection to the Rothmans/Prodrive rally programme. Values are in the range of major homologation Porsches; independent specialist authentication of chassis type and engine specification is mandatory before any transaction.',
        applies_to: {
          trim_categories: ['sc_rs'],
        },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 911-3.2-carrera (1984–1989)
  // Source: docs/reference/porsche_1980s_reference.md §"911 G-Body (Carrera 3.2 and SC)"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  '911-3.2-carrera': {
    positioning: 'The definitive G-body — Motronic management, factory Cabriolet, and the G50 revolution',
    intro: 'The 3.2 Carrera refined the G-body 911 to its high-water mark, introducing Bosch Motronic engine management and the factory Cabriolet, then the Getrag G50 five-speed in 1987. That mid-cycle transmission change — the most significant 911 mechanical update of the 1980s — split the generation into two distinct collector cars.',
    production_years: '1984–1989',
    body_styles: 'Coupe, Targa, Cabriolet, Speedster (1989)',
    engine: '3.2L Type 930/20 (RoW) / 930/21 (US) air-cooled flat-six, Bosch Motronic; 207 hp US (1984–1986), 214–217 hp US (1987–1989), 231 hp RoW',
    cooling: 'Air-cooled',
    units_produced: '~76,473 worldwide (all body styles)',
    notes: [
      'The 3.2 Carrera launched for MY1984 as the replacement for the 911 SC, distinguished by a decisive engineering step: Bosch Motronic 2.x fully electronic engine management replaced the SC\'s mechanical K-Jetronic fuel injection, lifting displacement to 3,164 cc, power to 207 hp US and 231 hp RoW, and dramatically reducing the mixture sensitivity that had plagued the older injection system. The hydraulic chain tensioner — replacing the spring-loaded units prone to catastrophic failure on SC-era engines — arrived at the same time. The factory Cabriolet, introduced for the SC\'s final year in 1983, continued through the full 3.2 Carrera run. Total production across Coupe, Targa, Cabriolet, and Speedster was approximately 76,473 units worldwide over six model years.',
      'The MY1987 introduction of the Getrag G50 five-speed manual gearbox is the generation\'s defining event. The Type 915 it replaced was a direct descendant of the 1972 911 gearbox, carrying notchy synchronisation and a cable clutch. The G50 brought BorgWarner synchromesh, a hydraulic clutch actuator (identifiable by the reservoir in the front trunk), and a conventional H-pattern shift layout. Power rose to 214–217 hp US concurrently. Post-G50 Carreras are universally preferred by buyers, and 1987-and-later examples command a meaningful collector premium over pre-G50 cars in all body styles. The M491 Turbo-Look package (also called \'Supersport\' in the UK) carried the 930 Turbo\'s wider body, brakes, and suspension on the naturally-aspirated 3.2 engine from 1984 — Coupe first, extended to Targa and Cabriolet from 1986; approximately 3,660 units total.',
      'Three limited variants define the Carrera 3.2\'s halo tier. The Club Sport (M637, 1987–1989) is the most performance-focused: blueprinted engine with hollow intake valves and a raised 6,840 rpm rev limit, approximately 70 kg saved by deleting sound deadening, A/C, rear seats, and other comfort equipment, and an \'SP\' stamp on the crankcase and cylinder head — 340 units worldwide with only 28 documented US examples. The Speedster (M503, 1989 only) is a body style premium in two specifications: narrow-body (171 units, very rare) and Turbo-Look widebody (1,933 units), total production 2,104 cars built in 1989 only. The 1988 Commemorative Edition (875 units worldwide, including 300 US) marked the 250,000th 911; the 1989 25th Anniversary (500 units, US only) carried Ferry Porsche\'s signature in the headrest area.',
    ],
    variants: [
      {
        name: 'Carrera Coupe / Targa / Cabriolet (Type 915)',
        years: '1984–1986',
        drivetrain: 'RWD',
        power: '207 hp (US); 231 hp (RoW)',
        description: 'Pre-G50 cars using the Type 915 five-speed gearbox with cable clutch. Notchy shift quality is an inherent characteristic rather than a defect, but worn synchronisers on 40-year-old gearboxes are common and addressable. The 1986 model year introduced a redesigned dashboard with larger HVAC vents — earlier cars have the SC-era instrument panel.',
      },
      {
        name: 'Carrera Coupe / Targa / Cabriolet (G50)',
        years: '1987–1989',
        drivetrain: 'RWD',
        power: '214–217 hp (US); 231 hp (RoW)',
        description: 'Post-G50 cars are the preferred collector specification. The G50 hydraulic clutch, BorgWarner synchromesh, and revised H-pattern shift gate are clear improvements over the 915. Sixteen-inch Fuchs wheels standardised for MY1989. The G50 introduction mid-way through the generation means a 1987 Coupe commands a premium over a 1986 Coupe at equivalent condition.',
      },
      {
        name: 'M491 Turbo-Look',
        years: '1984–1989',
        drivetrain: 'RWD',
        power: '207–217 hp (US); 231 hp (RoW)',
        production: '~3,660 worldwide',
        description: 'Factory option M491 carries the 930 Turbo\'s wider steel body panels, 7J/8J Fuchs wheels, Turbo disc brakes, Turbo rear suspension, and Turbo front spoiler on the naturally-aspirated 3.2 engine. Visually indistinguishable from a 930 Turbo from most angles. Authentication via M491 option code on the VIN sticker is essential — non-factory wide-body conversions are common.',
      },
      {
        name: 'Club Sport (M637)',
        years: '1987–1989',
        drivetrain: 'RWD',
        power: '217 hp (US); 231 hp (RoW)',
        production: '340 worldwide, ~28 US',
        description: 'Blueprinted 3.2L with hollow intake valves and 6,840 rpm rev limit. Approximately 70 kg lighter than the standard Carrera through deleted A/C, rear seats, sound deadening, and electrical equipment. Identified by the \'SP\' crankcase stamp, \'Carrera CS\' fender decals on most cars, and factory build record. UK cars are uniformly Grand Prix White with red decals and red Fuchs centres.',
      },
      {
        name: 'Speedster (narrow-body)',
        years: '1989',
        drivetrain: 'RWD',
        power: '217 hp (US); 231 hp (RoW)',
        production: '171 worldwide',
        description: 'Rare narrow-body Speedster with steeply raked windscreen and twin-hump body-coloured tonneau cover. Mechanically identical to the 1989 Carrera. The narrow-body specification is by far the rarer of the two Speedster variants and commands a substantial premium over the more numerous Turbo-Look version.',
      },
      {
        name: 'Speedster (Turbo-Look)',
        years: '1989',
        drivetrain: 'RWD',
        power: '217 hp (US); 231 hp (RoW)',
        production: '1,933 worldwide',
        description: 'Wide-body Speedster using 930 Turbo fenders, brakes, and wheels on the Carrera 3.2 drivetrain. Narrow-body and Turbo-Look were built on the same Cabriolet-derived floor; the wide-body version accounts for the vast majority of Speedster production. All Speedsters were built in 1989 only.',
      },
      {
        name: 'Commemorative Edition / 25th Anniversary',
        years: '1988–1989',
        drivetrain: 'RWD',
        power: '217 hp (US)',
        production: '875 CE worldwide; 500 25th Anniversary (US only)',
        description: 'Colour and trim packages with no mechanical differentiation. The 1988 Commemorative Edition (CE) used Diamond Blue Metallic paint with colour-matched Fuchs centres to mark the 250,000th 911; 300 US examples split across Coupe, Cabriolet, and Targa. The 1989 25th Anniversary was a US-only package in Silver or Satin Black Metallic with Ferry Porsche\'s signature in the headrest.',
      },
    ],
    engineering: [
      'Bosch Motronic engine management: The 3.2 Carrera\'s Type 930/20-/21 engine uses Bosch Motronic 2.x fully integrated electronic management — the first production 911 to do so. Motronic combines ignition timing and fuel injection in a single ECU with closed-loop lambda control on catalysed US cars, enabling reliable cold starting, altitude compensation, and mixture precision far beyond what K-Jetronic could achieve. The practical result is a 911 that starts cleanly regardless of temperature and requires no periodic injection recalibration.',
      'Getrag G50 five-speed manual (MY1987): The G50 replaced the 915 across the 911 line from MY1987. BorgWarner synchromesh produced a substantially smoother gearchange; a hydraulic clutch actuator replaced the cable, eliminating cable adjustment as a service item. The shift pattern moved to a conventional H with reverse behind fifth on US-spec cars. The G50/50 used in the concurrent 930 Turbo is a heavier derivative with different ratios — the two gearboxes are not interchangeable.',
      'Oil-fed hydraulic chain tensioners (standard from 1984): The Carrera 3.2 received hydraulic chain tensioners as standard — replacing the spring-loaded sealed units used through the 1983 SC that had a known catastrophic failure mode as they aged. The oil-fed tensioners are maintained by the engine\'s lubrication system and require no periodic replacement. Earlier engines can be retrofitted with the hydraulic kit.',
      'M491 Turbo-Look package: Factory option M491 brought the 930 Turbo\'s wide steel body panels, 7J/8J Fuchs wheels, Turbo brake hardware, and Turbo rear suspension geometry to the naturally-aspirated Carrera — creating a car that is visually the 930 Turbo with the 3.2 Carrera\'s more tractable drivetrain. Approximately 3,660 units were produced. The M491 option code is stamped on the VIN sticker; its presence (or absence) is the primary authentication test for any wide-body 3.2.',
      'Type 930/21 US engine specification: The US 3.2 uses the catalysed Type 930/21, tuned for three-way catalyst compatibility with an oxygen sensor in the exhaust system. Rated output is 207 hp (1984–1986) and 214–217 hp (1987–1989) versus 231 hp for the uncatalysed RoW 930/20. The compression ratio is slightly lower and the Motronic map is calibrated for leaner part-throttle operation. Internals are otherwise identical to the RoW unit.',
    ],
    watch_for: [
      {
        title: 'Type 915 gearbox synchroniser wear (pre-1987 cars)',
        severity: 'caution',
        body: 'Pre-MY1987 Carrera 3.2 Coupes, Targas, and Cabriolets use the Type 915 gearbox — a 1972-derived architecture with cone-and-ring synchronisers that wear with age and use. Second and third gear are most susceptible, producing reluctant engagement or crunch under normal shifting. A fully rebuilt 915 with upgraded Rennline or Raby Racing baulk rings is a positive signal. Sellers often represent the characteristic 915 feel as normal; a notchy gearchange is normal, but grinding or missed engagement is wear.',
        buyer_question: 'Is this a pre-1987 (Type 915) or post-1987 (G50) car? If pre-1987, has the transmission been rebuilt or had synchronisers replaced? Do second and third gears engage cleanly, without crunch, at moderate shift speeds?',
      },
      {
        title: 'Head stud condition',
        severity: 'concern',
        body: 'The 3.2 Carrera\'s pressure-cast aluminum case uses Dilavar alloy head studs that fail by breaking at the head-nut interface rather than pulling from the case — the dominant stud failure mode on post-1977 air-cooled 911s. A broken stud produces an exhaust-area leak audible under load; multiple broken studs on one cylinder require immediate repair before the car is driven. Risk increases with age, high mileage, and poor-fit cylinder tin. Documented replacement with Dilavar, Raceware, or ARP studs is the positive signal.',
        buyer_question: 'Have the head studs been inspected or replaced? With which specification — Dilavar, Raceware, or ARP — and at what mileage? Have the lower valve covers ever been removed? Are there any exhaust-area leaks audible under load?',
      },
      {
        title: 'Oil return tube seal leaks',
        severity: 'caution',
        body: 'Oil returns from the cam towers to the crankcase through rubber-sealed tubes that harden and leak on 35+ year examples — effectively universal on untouched cars. The leak deposits oil on heat exchangers, can produce intermittent blue smoke from the engine bay, and creates a cabin oil smell when the heater runs. Repair uses collapsible replacement tubes with Viton seals, typically addressable without engine removal. A 3.2 Carrera showing no evidence of this repair is either exceptional or overdue.',
        buyer_question: 'Have the oil return tube seals been replaced with Viton seals? Is there any oil residue on the heat exchangers, or an oil smell with the heater running? When was the last time the cam tower area was inspected?',
      },
      {
        title: 'M491 Turbo-Look authentication',
        severity: 'caution',
        body: 'The M491 wide-body option was the most expensive 3.2 Carrera option, and non-factory wide-body conversions using 930 body panels are common. A genuine M491 car carries the M491 code on the VIN sticker inside the front trunk lid and in the Porsche Certificate of Authenticity. Aftermarket wide-body conversions are not structurally inferior but represent a fundamentally different car — and a misrepresented one if sold as factory M491. Inspect panel gaps and seam welds: factory M491 cars were built on the wide body from the start; conversions show evidence of panel replacement.',
        buyer_question: 'Does the front trunk VIN sticker include M491 in the options list? Has a Porsche Certificate of Authenticity been obtained showing M491 as a factory option? Is there any history of body panel modification or accident repair?',
      },
      {
        title: 'Dashboard cracking',
        severity: 'caution',
        body: 'Dashboard cracking is a near-universal cosmetic condition on 35+ year G-body 911s. The padded vinyl degrades from UV exposure and thermal cycling, typically cracking first at the top of the centre binnacle and spreading toward the A-pillars. Sun-belt stored cars are most affected; temperate-climate examples can show considerably less damage. Dashboard restoration is expensive at US specialist rates — an uncracked original dashboard on a 1984–1989 car warrants verification.',
        buyer_question: 'What is the condition of the dashboard — cracked, intact, or previously restored? Has any crack-filling, re-covering, or replacement been performed? If restored, what specialist performed the work?',
      },
    ],
    service: [
      'Major service intervals are 15,000 miles or annually. Oil changes should use 15W-50 or an air-cooled formulation; many specialists recommend shortening to 7,500–10,000 miles on a 35-year-old engine. The Bosch Motronic system is generally low-maintenance compared to K-Jetronic, but the lambda sensor on US-spec cars requires periodic replacement and should be verified functional during any pre-purchase inspection.',
      'Pre-purchase inspection priorities: (1) Compression and leak-down on all six cylinders. (2) Head stud survey — listen under load for exhaust-area leaks, check whether lower valve covers have been removed. (3) Oil return tube seal condition — inspect cam tower area and heat exchangers for oil deposits. (4) On Type 915 cars (pre-1987): gearbox synchroniser function in second and third. (5) On G50 cars: hydraulic clutch fluid condition and reservoir seal integrity. (6) M491 authentication if applicable — confirm M491 option code on VIN sticker.',
    ],
    value_drivers: [
      {
        name: 'Transmission generation',
        description: 'The Getrag G50 five-speed manual (1987–1989) commands a meaningful premium over the Type 915 five-speed (1984–1986) in all body styles. A 1987 G50 Carrera Coupe is materially more desirable than a 1986 Type-915 Coupe at equivalent mileage and condition.',
      },
      {
        name: 'Speedster rarity',
        description: 'The 1989 Speedster narrow-body (171 units worldwide) commands a substantial premium above the Turbo-Look Speedster (1,933 units), which itself commands a collector premium above standard Cabriolets of comparable condition and mileage.',
      },
      {
        name: 'Club Sport M637',
        description: 'The Club Sport (340 units worldwide, ~28 documented US) carries a significant premium over the standard Carrera 3.2 Coupe. Authentication via crankcase SP-stamp and factory build record is mandatory; unverified claims of Club Sport specification are common in the market.',
      },
      {
        name: 'Factory M491 Turbo-Look',
        description: 'Authentic factory M491 wide-body Carreras (option code confirmed on VIN sticker and COA) trade at a premium over narrow-body examples. Non-factory wide-body conversions are common and should not command the M491 premium — authentication is the critical step.',
      },
      {
        name: 'Originality and documentation',
        description: 'Unmolested, matching-numbers Carrera 3.2 examples with documented service history command a premium over modified or undocumented cars. A Porsche Certificate of Authenticity confirming factory specification adds tangible market value and supports insurance declarations.',
      },
      {
        name: 'Color',
        description: 'Classic period Porsche colors (Guards Red, Grand Prix White, Slate Blue) are broadly neutral-to-positive. Commemorative Edition Diamond Blue Metallic and 25th Anniversary Satin Black Metallic are documentation-dependent premiums on their respective special editions.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 930 (1975–1989 — 3.0L and 3.3L Turbo)
  // Source: docs/reference/porsche_1980s_reference.md §"911 Turbo (930) 3.3-Litre"
  //         docs/reference/porsche_1970s_reference.md §"930 3.0L"
  //         docs/reference/defects/03_engine_aircooled_911.md
  // ──────────────────────────────────────────────────────────────────────────
  '930': {
    positioning: 'The original Turbo 911 — one KKK turbocharger, no driver aids, no excuses',
    intro: 'The 930 is the original 911 Turbo: a single KKK turbocharger, air-to-air intercooling as a production first, and a reputation earned through abrupt boost delivery and rear-engine weight bias. The 1989 model year introduced the Getrag G50/50 five-speed — the most sought-after 930 specification. The Slantnose evolved from Sonderwunsch exclusivity to a factory option code.',
    production_years: '1975–1989',
    body_styles: 'Coupe, Targa (MY1987+), Cabriolet (MY1987+)',
    engine: '3.0L Type 930/50 RoW (245 hp DIN) / 930/51 US (234 hp) — 1975–1977; 3.3L Type 930/60 RoW (300 hp) / 930/68 US catalysed (282 hp) — 1978–1989; KKK single turbocharger with air-to-air intercooler',
    cooling: 'Air-cooled',
    units_produced: '~18,770 worldwide (3.3L lifespan, all bodies)',
    notes: [
      'The 930 was engineered as the road-car homologation base for a Group 4 turbocharged racing machine, launching at Frankfurt 1973 and reaching production in MY1975. The 3.0-litre version (Type 930/50, 245 hp DIN RoW; 930/51, 234 hp US in 1976–1977) introduced air-to-air intercooling as a production-car first — compressing the intake charge, cooling it through a rear-spoiler-fed heat exchanger, and delivering it to the engine at manageable temperatures. The 3.3-litre successor arrived for MY1978, retaining the intercooler concept with a larger KKK K27 turbocharger and revised displacement; rated at 300 hp RoW (and 265 hp for the US\'s 1978–1979 tenure before the US and Japan markets lost the 930 entirely from MY1980 through MY1985, when Porsche could not certify the turbocharged engine for emissions regulations). The 1986 US reintroduction used the catalysed Type 930/68 engine at 282 hp — a meaningful drop from the RoW rating, but at a list price of approximately $48,000, demand was immediate.',
      'The 930\'s four-speed Type 930 manual gearbox was almost universally regarded as inadequate for the engine\'s power delivery. Ratios were too wide for the abrupt turbocharger surge, and the final drive assembly was fragile under sustained load. The 1989 model year rectified both complaints with the Getrag G50/50 five-speed — a strengthened derivative of the Carrera 3.2\'s G50 with ratios calibrated specifically for the Turbo\'s torque curve and a more robust final drive. The 1989 Turbo is universally the most desirable 930 specification, commanding a clear premium across all markets. The Slantnose / Flachbau programme evolved across three generations: 58 exclusive \'hammerhead\' Sonderwunsch cars (1981–1983, no pop-up lights); approximately 250 Gen 2 pop-up-headlight conversions (1983–1987, also Sonderwunsch); and the Gen 3 dealer-orderable M505 (US) and M506 (RoW) option codes from 1987 — approximately 630 M505 US cars and 56 M506 RoW cars. Total factory Slantnose production across all generations is most often cited at 948 cars, though the figure is not officially published by Porsche.',
      'The 930 sustains its collector premium as the progenitor of the turbocharged 911 lineage — a car that established the template (single rear-engined turbo, rear-wheel drive, no electronic driver aids) that every subsequent 911 Turbo departed from rather than built upon. Open-body variants (Targa and Cabriolet) were Sonderwunsch special orders in RoW markets from earlier in the production run but became standardised dealer orders for all markets from MY1987. Turbo Targa production was the lowest of the three body styles — fewer than 300 cars worldwide across 1987–1989 — making it an extreme rarity in the current market. The 930 LE (50 UK-only cars, MY1989, standard nose, full leather) is the cleanest and best-documented limited edition of the generation.',
    ],
    variants: [
      {
        name: '3.0 Turbo',
        years: '1975–1977',
        drivetrain: 'RWD',
        power: '245 hp DIN (RoW); 234 hp (US, 1976–1977)',
        production: 'Approx. 2,800–3,000 worldwide across 3 model years',
        description: 'The original 930, with 3.0-litre engine (Type 930/50 RoW, 930/51 US) and the production debut of air-to-air intercooling. Magnesium crankcase (1968–1977 family), with the head stud pull-out failure mode rather than the later Dilavar breakage mode. US examples sold only in 1976–1977. Rarer and separately priced from the 3.3L cars; original matching-numbers examples are the rarest of all production 930 variants.',
      },
      {
        name: '3.3 Turbo Coupe (4-speed)',
        years: '1978–1988',
        drivetrain: 'RWD',
        power: '300 hp RoW; 265 hp US (1978–1979); 282 hp US (1986–1988)',
        description: 'The main 930 production run. Type 930/60 (RoW) or 930/68 (US from 1986) with KKK K27 turbocharger, four-speed Type 930 manual, and air-to-air intercooler. US cars absent from the market MY1980–MY1985; US and Japan grey-market imports during this period. The four-speed gearbox is the definitive liability of this specification — ratios too wide for the turbo\'s surge, fragile final drive.',
      },
      {
        name: '3.3 Turbo (1989 G50/50)',
        years: '1989',
        drivetrain: 'RWD',
        power: '300 hp RoW; 282 hp US',
        production: '~2,520 worldwide (all 1989 body styles)',
        description: 'The most desirable 930 specification. The Getrag G50/50 five-speed debuted as standard equipment for the final production year — the only year it was offered. Ratios calibrated for the Turbo\'s power band, stronger final drive than the four-speed. Available in Coupe, Targa, and Cabriolet. Identification: 1989 model year on VIN sticker; G50/50 gearbox code.',
      },
      {
        name: 'Targa',
        years: '1987–1989',
        drivetrain: 'RWD',
        power: '300 hp RoW; 282 hp US',
        production: 'Approx. 290 worldwide (1987–1989 combined)',
        description: 'Standardised as a dealer-orderable body style from MY1987 after earlier years as a RoW Sonderwunsch option. Fewer than 300 Turbo Targas were produced worldwide across three model years — making the Turbo Targa the rarest production 930 body style by a wide margin. The removable centre Targa panel carries the traditional 911 Targa design rather than the 993\'s panoramic architecture.',
      },
      {
        name: 'Cabriolet',
        years: '1987–1989',
        drivetrain: 'RWD',
        power: '300 hp RoW; 282 hp US',
        production: '~1,630 worldwide (1987–1989 combined)',
        description: 'Also standardised from MY1987 after earlier Sonderwunsch availability in RoW markets. Considerably more numerous than the Targa but still a small fraction of overall 930 production. The 1989 Cabriolet with G50/50 is the ultimate open 930 specification — the rarest body style in the most desirable transmission year.',
      },
      {
        name: 'Slantnose Gen 1 (Hammerhead)',
        years: '1981–1983',
        drivetrain: 'RWD',
        power: '300+ hp RoW (many with 330 hp Performance Kit)',
        production: '58 worldwide',
        description: 'The original Sonderwunsch Slantnose: smooth front fenders without pop-up headlights, twin lamps recessed in the lower front valance. All 58 cars are right-hand-drive-market Sonderwunsch builds. Authentication requires a Porsche COA from the factory archive; no option code appears on the VIN sticker for these cars.',
      },
      {
        name: 'Slantnose Gen 2 (Pop-up headlights)',
        years: '1983–1987',
        drivetrain: 'RWD',
        power: '300+ hp RoW (most with 330 hp Performance Kit)',
        production: 'Approx. 250 worldwide',
        description: 'Pop-up headlights in flat fenders and a deeper front valance with centrally mounted oil cooler — the most visually dramatic Slantnose iteration. Also Sonderwunsch; no M-code on the VIN sticker. COA from factory archive required for authentication. Most carry the 330 hp Performance Kit.',
      },
      {
        name: 'Slantnose Gen 3 M505 (US) / M506 (RoW)',
        years: '1987–1989',
        drivetrain: 'RWD',
        power: '282 hp US (M505); 300+ hp RoW (M506, most with Performance Kit)',
        production: '~630 M505 (US); 56 M506 (RoW)',
        description: 'Dealer-orderable Slantnose from MY1987: M505 for the US (standard 930 lower valance, oil cooler relocated to rear right fender to meet state safety regulations) and M506 for RoW (deeper valance with central oil cooler). US cars are identified by M505 on the VIN sticker. A meaningful number of additional US cars were assembled by Alan Johnson Racing from factory-supplied kits — authentic in content but lacking original-VIN provenance.',
      },
    ],
    engineering: [
      'Air-to-air intercooling (1975, production first): The 930 was the first production car to use a charge air cooler between the turbocharger outlet and the intake manifold, reducing compressed-air temperature before it entered the engine. The intercooler sits in the rear engine compartment, fed by ram air through the rear spoiler. Cooling the intake charge allows the compression ratio to be maintained at a useful level without detonation risk, materially increasing achievable power for a given boost pressure — the same principle used by every turbocharged production car since.',
      'KKK turbocharger and abrupt power delivery: The 3.3L uses a KKK K27 turbocharger with boost controlled by a wastegate valve. Maximum boost arrives at approximately 3,000 rpm and produces a pronounced surge — turbo lag followed by a significant thrust increase — that defines the car\'s character and requires specific driver technique. The wastegate diaphragm and boost plumbing are age-sensitive components that require verification on any prospective purchase.',
      'Getrag G50/50 five-speed (1989 only): The final 930 model year received the G50/50 — a heavier, differently-rationed derivative of the Carrera 3.2\'s G50 with ratio spacings calibrated for the Turbo\'s power band and a stronger final drive assembly. No other production year of the 930 3.3L was fitted with the G50/50; model year identification on the factory sticker is the confirmation. The G50/50 is universally regarded as the correct transmission for the engine\'s character.',
      'Type 930/68 catalysed engine (US, MY1986–1989): The returning US 930 carried the catalysed 930/68 engine at 282 hp — 18 hp less than the RoW unit — with revised exhaust routing and an oxygen sensor. The 930/68 retains K-Jetronic mechanical injection throughout the production run: unlike the concurrent Carrera 3.2, the Turbo never transitioned to Motronic. K-Jetronic maintenance requires periodic airflow meter calibration and fuel distributor service that many general shops cannot perform correctly.',
      'Oil-fed hydraulic chain tensioners (1984 retrofit): The spring-loaded chain tensioners used on 930s through 1983 were replaced by oil-fed hydraulic units in 1984. Pre-1984 cars (the Gen 1 and most Gen 2 Slantnose cars, and early 3.3L Coupes) that have not received this retrofit carry a latent catastrophic risk — tensioner failure allows the timing chain to jump a sprocket and destroy the engine. US-market 930s reintroduced for MY1986 carried hydraulic tensioners as standard.',
    ],
    watch_for: [
      {
        title: 'Snap oversteer and driving competence baseline',
        severity: 'caution',
        body: 'The 930\'s abrupt boost delivery combined with rear-engine weight bias creates a snap-oversteer tendency on boost application or mid-corner lift-off that has earned the car a \'widowmaker\' reputation. This is inherent to the design, not a defect — but it warrants establishing the car\'s dynamic history before purchase. Evidence of prior impact (misaligned panels, repainted sections, deformed sill edges) is more significant on a 930 than on most collector cars, as the failure mode under provocation is sudden and severe.',
        buyer_question: 'Has the car ever been in an accident, however minor? Are panel gaps and paint thickness consistent across the body? Has the boost pressure ever been modified beyond factory specification?',
      },
      {
        title: 'Four-speed final drive fragility (pre-1989 cars)',
        severity: 'concern',
        body: 'The Type 930 four-speed gearbox used through MY1988 has a final drive assembly documented as fragile under sustained high-power use. Symptoms progress from gear noise and oil seepage around the differential to sudden disengagement of drive under load. Any 930 with documented track use, aggressive street driving, or deferred transmission service warrants inspection of the transmission and differential before purchase. Specialist rebuilds using Elephant Racing or Raby Racing components are the established remedy.',
        buyer_question: 'Has the transmission been rebuilt or the differential inspected? What is the car\'s track and sustained-use history? Are there any gear noises, transmission oil leaks, or drivability changes under load?',
      },
      {
        title: 'Boost system age — intercooler, wastegate, and plumbing',
        severity: 'concern',
        body: 'The 930\'s boost system components age materially over 35–50 years. The intercooler develops internal corrosion and external scale; the wastegate diaphragm hardens and can crack, causing uncontrolled boost excursions; the boost-pressure hoses degrade and split; and the intake boot between the air filter housing and turbocharger inlet is a known failure point. A cracked wastegate diaphragm is the highest-urgency item — it can produce sustained overboost events that risk engine damage. Full boost system inspection — pressure test of intercooler and all plumbing, wastegate diaphragm condition, intake boot integrity — is essential before purchase.',
        buyer_question: 'Has the wastegate diaphragm been replaced, and with what part? Has the intercooler been pressure-tested for leaks? Are there any torn hoses, boost leaks, or evidence of overboost history? What is the current maximum boost pressure under full throttle?',
      },
      {
        title: 'Slantnose authentication',
        severity: 'concern',
        body: 'Factory Slantnose 930s (M505, M506, or authenticated Sonderwunsch) are outnumbered in the market by aftermarket and dealer conversions. Gen 3 M505 and M506 cars carry the option code on the factory sticker inside the front trunk lid — this is the primary authentication step and takes 30 seconds. Gen 1 and Gen 2 Sonderwunsch cars require a Porsche Certificate of Authenticity from the factory archive. Alan Johnson Racing assembled approximately 21 additional US cars from factory-supplied kits: authentic in mechanical content but lacking original VIN provenance and not correctly represented as factory Slantnose cars.',
        buyer_question: 'Does the front trunk lid sticker include M505 (US) or M506 (RoW) in the options list? For cars claimed as Sonderwunsch, has a Porsche COA been obtained from the factory archive confirming the Flachbau conversion? Is there any documentation of the conversion shop or specification?',
      },
      {
        title: 'US grey-market provenance (1980–1985 cars)',
        severity: 'caution',
        body: 'US-titled 930s from 1980 through 1985 were not officially imported by Porsche — the Turbo was absent from the US market during these years. Any US car from this period entered through grey-market channels with conversion of varying quality and legal ambiguity. Original European sales documentation (Zulassungsbescheinigung, purchase contract, window sticker) establishes the car\'s history before US import. Federalised 1986–1989 cars with clean North American title histories are significantly simpler to own, insure, and sell.',
        buyer_question: 'For 1980–1985 cars: is there original German or European documentation — purchase agreement, Zulassungsbescheinigung, original window sticker? How was the car federalised and by whom? Is there documentation of the conversion process?',
      },
    ],
    service: [
      'Service intervals follow the 15,000-mile or annual schedule of the air-cooled 911. Many specialists recommend shortening oil change intervals to 7,500 miles on a 40+ year K-Jetronic engine. The Type 930/68 US catalytic system requires a functional lambda sensor. K-Jetronic maintenance is more demanding than the concurrent Carrera 3.2\'s Motronic — periodic airflow meter calibration and fuel distributor service require a specialist equipped to work on mechanical injection systems. Chain tensioner retrofit verification is essential on any pre-1984 engine without documented conversion.',
      'Pre-purchase inspection priorities: (1) Full boost system inspection — pressure-test intercooler and all boost plumbing, check wastegate diaphragm and actuator condition, inspect intake boot. (2) Chain tensioner verification on pre-1984 engines. (3) Head stud survey — listen under load for exhaust-area leaks; the 3.3L uses Dilavar studs with the same breakage mode as the Carrera 3.2 and 964. (4) Gearbox inspection — gear noise under load, differential oil condition and seepage check. (5) Full oil leak survey including cam towers, heat exchangers, and crankshaft seal. (6) For Slantnose cars: panel construction inspection to distinguish factory from conversion.',
    ],
    value_drivers: [
      {
        name: '1989 G50/50 five-speed',
        description: 'The 1989 model year 930 with the Getrag G50/50 five-speed transmission is the most sought-after 930 specification and commands a significant premium over otherwise comparable 1987–1988 four-speed cars. The premium is consistent across Coupe, Targa, and Cabriolet body styles.',
      },
      {
        name: 'Slantnose authenticity',
        description: 'Factory Slantnose 930s (M505 US, M506 RoW, or authenticated Sonderwunsch Gen 1/Gen 2) command a substantial premium over standard-nose Turbos. Authentication via M505/M506 option code on the VIN sticker or Porsche COA is essential before applying a Slantnose valuation uplift — non-factory conversions are common and do not command the same premium.',
      },
      {
        name: 'Body style — Targa and Cabriolet',
        description: 'The Turbo Targa (fewer than 300 worldwide, 1987–1989) commands a significant rarity premium. The Turbo Cabriolet is more numerous but still a fraction of overall 930 production. Open-body Turbos in any model year trade at a premium over equivalent Coupes.',
      },
      {
        name: 'US market federalisation (1986–1989)',
        description: 'Federalised 1986–1989 US-market Turbos (Type 930/68 engine) carry clean title histories and straightforward insurability. Grey-market 1980–1985 US cars have provenance complexity that materially affects liquidity and value. The 1989 G50/50 premium applies cleanly only to federalised cars.',
      },
      {
        name: '3.0L Turbo (1975–1977)',
        description: 'The original 3.0-litre 930 is a separate collector tier from the 3.3-litre cars, priced by originality, provenance, and condition rather than specification comparison. US examples are rare by any measure — North American sales ran only 1976–1977 — and original matching-numbers examples are the rarest of all production 930 variants.',
      },
      {
        name: 'Mileage and service history',
        description: 'Documented low-mileage 930s with complete K-Jetronic and boost system service records command strong premiums. Boost system inspection history and wastegate service documentation are the most meaningful service records for this generation; their absence is a discount signal.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 964 (1989–1994)
  // Source: docs/reference/porsche_1990s_reference.md §"911 / 964 (1989–1994)"
  //         docs/reference/defects/03_engine_aircooled_911.md
  //         docs/reference/defects/23_pre996_aircooled_nonengine.md
  // ──────────────────────────────────────────────────────────────────────────
  '964': {
    positioning: 'The bridge generation — modern engineering in the last naturally-aspirated body',
    intro: 'The 964 modernised the 911 with power steering, ABS, and the first factory AWD — while keeping air cooling and the essential rear-engined character. Tiptronic arrived and divided opinion. The RS and Turbo variants have since become the generation\'s most important collector cars; the mainstream Carrera 2 and 4 sit at the entry of air-cooled ownership.',
    production_years: '1989–1994',
    body_styles: 'Coupe, Cabriolet, Targa',
    engine: '3.6L M64 air-cooled flat-six, twin-spark, hydraulic lifters (247 hp NA); 3.3L single-turbo M30/69 (Turbo 3.3: 320 hp); 3.6L single-turbo M64-derived (Turbo 3.6: 355 hp)',
    cooling: 'Air-cooled',
    units_produced: '~62,000–66,500 worldwide',
    notes: [
      'The 964 was engineered as Porsche\'s answer to a product line that had been commercially constrained through the late 1980s by noise regulations, emissions targets, and rising competitor standards for ride quality and driver assistance. The solution was thorough: a new 3.6-litre M64 flat-six with twin-spark ignition, hydraulic valve lifters (eliminating manual valve adjustments from the service schedule), and an expanded 85% of new or revised parts versus the G-body. Power steering and four-wheel ABS arrived as standard equipment — the first 911 to include either. The Carrera 4 debuted for MY1989 as the first series-production AWD 911, with a viscous-centre-differential AWD system distributing torque approximately 31/69 front-to-rear. Despite Porsche\'s claim of near-total redesign, the 964 is immediately recognisable as a 911: the integrated bumpers, retracted door handles, and cleaned-up body lines are the most visible departures from the G-body.',
      'The Tiptronic four-speed automatic, introduced on the Carrera 2 from MY1991, was the first automatic transmission in any 911 — a development that arrived with immediate and sustained controversy in the collector community. Purists rejected the concept; some markets and configurations could only be ordered with Tiptronic. By contrast, the generation\'s halo variants are universally revered. The Turbo 3.3 (MY1991–1992, 320 hp, carryover 930/60 engine on the 964 platform) was followed by the rarer Turbo 3.6 (MY1993–1994, 355 hp, new turbocharged M64-derived unit) — the 3.6 is the more sought-after car. The Turbo S Leichtbau (86 units, 1992) is the generation\'s blue-chip exception: Kevlar body panels, aluminium doors, deleted power steering and air conditioning, 381 hp from the 3.3L engine in Weissach-prepared M30/69 SL specification.',
      'The RS family defines the 964\'s collector standing. The European Carrera RS (MY1992, 3.6L M64/03 at 260 hp, 2,282 units across three trim levels — Lightweight, Touring M002, and N/GT M003) revived the RS nameplate after nearly twenty years and established the modern lightweight RS template with a seam-welded shell, aluminium bonnet, and M030 competition suspension. The RS America (MY1993–1994, 701 units) shares the RS name but uses the standard Carrera 2 drivetrain with whale-tail spoiler and M030 suspension — a different car at a different value tier. The Carrera RS 3.8 (55 Weissach hand-built examples, MY1993) is the rarest series-built 964 RS — widebody Turbo shell, aluminium doors, 300 hp from the M64/04 3.8L — and prices at the top of the generation. The Speedster (930 narrow-body, 15 Exclusiv widebody Turbo-look, MY1993–1994) and the 30 Jahre Anniversary (911 units, MY1993, widebody Turbo shell on a Carrera 4 drivetrain) complete a generation whose rarest cars have appreciated substantially faster than the mainstream Carrera.',
    ],
    variants: [
      {
        name: 'Carrera 4',
        years: '1989–1994',
        drivetrain: 'AWD',
        power: '247 hp',
        production: '20,395 worldwide (13,353 Coupe; 4,802 Cab; 1,329 Targa; 911 Jubilee Coupé)',
        description: 'First series-production AWD 911 and the only model offered for MY1989. Electronically-controlled viscous centre differential distributes torque approximately 31/69 front/rear under normal conditions, with the front differential able to close during severe rear slip. The electronic AWD control system is more complex than the 993\'s later viscous-coupling setup; control module failures and engagement irregularities are documented age items.',
      },
      {
        name: 'Carrera 2',
        years: '1990–1994',
        drivetrain: 'RWD',
        power: '247 hp',
        production: '34,398 worldwide (18,219 Coupe; 11,013 Cab; 3,534 Targa; 1,532 Turbo-look Cab; 936 Speedster)',
        description: 'Rear-wheel-drive Carrera on the standard 3.6L M64. Lighter than the Carrera 4 and the chassis preferred by driver-oriented buyers. Offered with the five-speed G50 manual or the Tiptronic four-speed automatic (MY1991+). Coupe, Cabriolet, and Targa body styles available. Tiptronic-equipped examples trade at a consistent discount in the collector market.',
      },
      {
        name: 'Turbo 3.3',
        years: 'MY1991–1992',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '3,660 worldwide',
        description: 'The 964 Turbo\'s first two years used the carryover Type 930/60 engine from the 930 Turbo — K-Jetronic mechanical injection, single KKK turbocharger, no intercooler improvements beyond what the 930 already had. The 964 Turbo 3.3 is a 930 engine in a modernised body; that heritage is part of its identity. Not the rarer Turbo, but the entry point to 964 Turbo ownership.',
      },
      {
        name: 'Turbo 3.6',
        years: 'MY1993–1994',
        drivetrain: 'RWD',
        power: '355 hp',
        production: '~1,437 worldwide',
        description: 'The 964 Turbo\'s final two model years received a new turbocharged 3.6L engine — M64-derived but with a single large turbocharger and significantly improved low-end torque versus the 3.3L. Fewer than 1,500 worldwide; the Turbo 3.6 is the mainstream rarity of the 964 lineup and commands a clear premium over the Turbo 3.3 at auction.',
      },
      {
        name: 'Turbo S Leichtbau',
        years: '1992 (sold as MY1993)',
        drivetrain: 'RWD',
        power: '381 hp',
        production: '86 worldwide',
        description: 'Weissach-built at the Exclusiv facility in a single batch beginning July 1992. M30/69 SL specification 3.3L engine at 381 hp, Kevlar body panels replacing steel front fenders and bonnet, aluminium doors, no power steering, no air conditioning standard. Approximately 397 lb (180 kg) lighter than the standard Turbo 3.3. The Turbo S Leichtbau is the top of the 964 collector tier and the direct ancestor of the 993 Turbo S.',
      },
      {
        name: 'Turbo 3.6 S (Flachbau and Package)',
        years: 'MY1994',
        drivetrain: 'RWD',
        power: '380 hp',
        production: '76 worldwide (39 US Flachbau + 27 RoW + 10 Japan); 17 US Package (no slantnose)',
        description: 'End-of-production Exclusiv builds from leftover Turbo 3.6 chassis. Turbo 3.6 S Flachbau (X83/X84/X85 option codes) carries the Slantnose front end; the 17-car US \'Package\' variant is the same drivetrain with the standard nose — built at PCNA\'s request and the rarest US-market 964 Turbo variant.',
      },
      {
        name: 'Carrera RS (Europe)',
        years: 'MY1992',
        drivetrain: 'RWD',
        power: '260 hp',
        production: '2,282 worldwide (Lightweight + M002 Touring + M003 N/GT)',
        description: 'Seam-welded 964 shell with aluminium bonnet, rear-weight-biased suspension geometry, and the M64/03 3.6L producing 260 hp — the most extensively prepared standard-road RS since the original 2.7 RS. Not US-legal as new. Three trim levels: Lightweight (bare-shell competition preparation), Touring M002 (creature comforts added back), and N/GT M003 (roll cage, race prep). The 1,910 Lightweight cars are the benchmark; the 55-car Carrera RS 3.8 (MY1993, M64/04 300 hp, Weissach hand-built widebody) is the peak of the RS family.',
      },
      {
        name: 'RS America',
        years: 'MY1993–1994',
        drivetrain: 'RWD',
        power: '247 hp',
        production: '~701 US and Canada',
        description: 'US-market lightweight using the standard Carrera 2 247 hp drivetrain — not the European RS engine. Distinguished by a whale-tail fixed rear spoiler, deleted rear seats and sound deadening, and M030 sport suspension. Approximately 80 lb lighter than the stock C2. The RS America shares the RS name but not the RS engineering of the European car; the two should not be conflated in valuation.',
      },
      {
        name: 'Speedster',
        years: 'MY1993–1994',
        drivetrain: 'RWD',
        power: '247 hp',
        production: '930 narrow-body; 15 Exclusiv widebody (Turbo-look)',
        description: 'Based on the Carrera 2 Cabriolet with a steeply raked windscreen and twin-hump tonneau cover. 930 narrow-body Speedsters were built over two model years; the 15 Exclusiv widebody Turbo-look Speedsters are the rarest production 964 body variant. RHD Speedsters number just 27 worldwide (13 UK / 8 Australia / 4 Singapore / 2–3 Hong Kong).',
      },
      {
        name: '30 Jahre Anniversary',
        years: 'MY1993',
        drivetrain: 'AWD',
        power: '247 hp',
        production: '911 worldwide',
        description: 'Carrera 4 drivetrain in the Turbo widebody with the naturally-aspirated 3.6L — the direct predecessor to the 993 Carrera 4S concept. Available only in three colours: Viola Metallic, Polar Silver Metallic, and Amethyst Metallic. Exactly 911 production units — the number is deliberate. Manual and Tiptronic both available.',
      },
    ],
    engineering: [
      '3.6L M64 flat-six — twin-spark, hydraulic lifters, dual-mass flywheel: The M64 is the most thoroughly revised air-cooled 911 engine to that point — twin plugs per cylinder for improved combustion efficiency and lower emissions, hydraulic valve lifters eliminating manual valve adjustment from every service interval, and a dual-mass flywheel on naturally-aspirated cars absorbing drivetrain torsional pulses. Output is 247 hp. The dual-mass flywheel is a wear item that produces characteristic idle rattle as it ages — a specific inspection point on any naturally-aspirated 964.',
      'First AWD 911 (Carrera 4): The 964 Carrera 4 debuted for MY1989 as the first series-production AWD 911, using an electronically-controlled viscous centre differential with approximately 31/69 front/rear torque distribution under normal driving. The system includes a front differential and a Porsche Differential System (PSD) rear limited-slip differential. The electronic AWD control module is more complex than the 993\'s later system and is an age-sensitive item; control module diagnostics are a standard pre-purchase step on Carrera 4 cars.',
      'Tiptronic four-speed automatic (first automatic in the 911 lineage): The Tiptronic, developed by Porsche and ZF, debuted on the Carrera 2 from MY1991 as the first production 911 automatic. The ZF 4HP18-derived unit allows manual sequential shifting via a separate gate position and steering-wheel-mounted buttons (Tiptronic S functionality was added during the production run). Automatic-equipped 964s trade at a consistent discount in the collector market relative to manual cars. The transmission requires periodic fluid and filter service.',
      'Power-assisted rack-and-pinion steering and ABS standard: The 964 was the first 911 with power-assisted steering — replacing the recirculating-ball manual system used on all prior 911 generations — and four-wheel ABS as standard equipment on all models. The rack-and-pinion system uses a hydraulic power-assist circuit that can develop rack leaks and pump seal failures on high-mileage examples. ABS uses a Robert Bosch 2S controller; modulator faults and wheel-speed sensor failures are documented age items.',
      'Turbo 3.6 engine (MY1993–1994): The 964 Turbo gained a new turbocharged 3.6L engine for its final two model years, replacing the carryover 930/60 K-Jetronic unit from the 930 generation. The new engine uses a single large KKK turbocharger (not the twin-turbo configuration that would define the 993 Turbo), producing 355 hp with improved torque delivery versus the 3.3L. Fewer than 1,500 were built worldwide; the Turbo 3.6 is the rarest mainstream 964 variant.',
    ],
    watch_for: [
      {
        title: 'Head stud breakage (M64 3.6L)',
        severity: 'concern',
        body: 'The 964\'s 3.6L M64 uses Dilavar alloy head studs that fail by breaking at the head-nut interface — the same failure mode documented across the 993 M64 and the Carrera 3.2\'s aluminum-case engine. A broken stud produces an exhaust-area leak audible under load; multiple broken studs on one cylinder require immediate repair before the car is driven. Risk increases with age and extended service intervals. The 964 Turbo 3.3 uses the carryover 930/60 engine with its own stud specification; the same inspection applies with different part numbers.',
        buyer_question: 'Have the head studs been inspected or replaced? With which specification — Dilavar, Raceware, or ARP — and at what mileage? Are there any exhaust-area leaks audible under load? Have the lower valve covers ever been removed?',
      },
      {
        title: 'Dual-mass flywheel wear (Carrera 2 and Carrera 4)',
        severity: 'caution',
        body: 'Naturally-aspirated 964 Carreras use a Luk dual-mass flywheel whose internal springs and dampers wear with mileage and age, producing a knocking or rattling noise at idle that is frequently mistaken for engine bearing failure. The noise causes significant buyer anxiety and is a common reason cars are presented with deferred repairs. Replacement is most economically done concurrent with clutch service; single-mass flywheel conversion is a common owner choice at that interval. A rattling noise at idle on any naturally-aspirated 964 is a DMF finding until definitively ruled out.',
        buyer_question: 'Has the dual-mass flywheel been replaced or converted to single-mass? At what mileage? Does the car make any rattle or knocking noise at idle when warm?',
      },
      {
        title: 'HVAC servo motor conductive track wear',
        severity: 'caution',
        body: 'The 964 and 993 share a climate control system whose servo motors position the air-flap mixing assembly. The motor\'s internal conductive track wears, causing the air direction control to stop responding — heating and cooling air enter without proper mixing, making precise cabin temperature control impossible. The failure is non-catastrophic but significantly degrades everyday usability. Rebuilt servo motors are available from specialists; new-old-stock units are increasingly scarce.',
        buyer_question: 'Do all HVAC controls respond correctly — air direction, temperature blend, and fan speed? Is there any constant discharge of heat or cold air that the controls cannot correct? Has the HVAC servo motor been replaced or rebuilt?',
      },
      {
        title: 'Tiptronic transmission deferred service',
        severity: 'caution',
        body: 'Carrera 2 models equipped with the four-speed Tiptronic require periodic fluid and filter service that is commonly deferred by owners who assume the unit is sealed. Extended service intervals on an ageing ZF 4HP18 accelerate valve body and clutch pack wear, producing slipping, delayed engagement under load, or refused gear selection. A Tiptronic-equipped 964 without documented fluid service history warrants a transmission inspection before purchase.',
        buyer_question: 'Has the Tiptronic had fluid and filter service within the last 30,000 miles? Is there any slipping, rough shifting, or delayed engagement? Do all gear selections — Drive, Reverse, and the manual gate — function correctly?',
      },
      {
        title: 'Dashboard cracking',
        severity: 'caution',
        body: 'Dashboard cracking is a near-universal cosmetic condition on 30+ year 964s — not a mechanical defect but a meaningful valuation factor. The padded vinyl degrades from UV exposure and heat cycling, typically starting at the top of the centre binnacle. Sun-belt stored cars are most affected; temperate-climate examples show less severe damage. An uncracked original 964 dashboard is uncommon; a restored or re-covered dashboard is not the same as an original uncracked unit.',
        buyer_question: 'What is the condition of the dashboard — cracked, intact, or previously restored? Has any crack-filling, re-covering, or replacement been performed? If restored, what specialist did the work?',
      },
    ],
    service: [
      'The M64 service interval is 15,000 miles or annually. Hydraulic valve lifters require no manual adjustment — a significant simplification over every prior air-cooled 911. Oil changes should use 15W-50 or an air-cooled formulation; many specialists recommend shortening to 7,500–10,000 miles on a 30-year-old engine. The dual-mass flywheel monitoring principle is simple: a rattling noise at idle on a warm engine is a DMF finding until ruled out.',
      'Pre-purchase inspection priorities: (1) Compression and leak-down on all six cylinders. (2) Head stud survey — listen under load for exhaust-area leaks, check whether lower valve covers have been removed for prior stud work. (3) DMF noise check at idle on a warmed engine — rattle indicates wear. (4) Carrera 4 AWD control module diagnostics and engagement check. (5) HVAC servo motor response verification under all control inputs. (6) Tiptronic fluid condition if applicable — inspect for slipping or delayed engagement. (7) Power steering rack survey — hydraulic seepage around rack boots or pump.',
    ],
    value_drivers: [
      {
        name: 'Turbo variant — 3.6 versus 3.3',
        description: 'The 964 Turbo 3.6 (MY1993–1994, fewer than 1,500 worldwide) commands a significant premium over the Turbo 3.3 (MY1991–1992). Both are rear-wheel-drive turbocharged 964s, but the 3.6 is the rarer and more modern unit; auction pricing reflects this consistently.',
      },
      {
        name: 'European Carrera RS versus RS America',
        description: 'The European Carrera RS (2,282 units, seam-welded shell, M64/03 260 hp) and the US-market RS America (701 units, standard 247 hp Carrera 2 drivetrain) share a name but occupy fundamentally different value tiers. Do not conflate them in any valuation; the European RS commands multiples of the RS America at comparable condition.',
      },
      {
        name: 'Transmission',
        description: 'The five-speed G50 manual commands a consistent premium over Tiptronic-equipped Carrera 2 examples in all condition brackets. Tiptronic 964s trade at a discount that reflects genuine collector preference, not just stigma; buyers pricing Tiptronic examples should model this liquidity differential.',
      },
      {
        name: 'Turbo S Leichtbau',
        description: 'The 964 Turbo S Leichtbau (86 units worldwide, 1992/MY1993) is the top of the 964 collector tier — Kevlar panels, aluminium doors, 381 hp, no power steering or A/C, Weissach-built. Authentication via Porsche COA and factory build record is mandatory; no transaction at this level should proceed without independent specialist verification.',
      },
      {
        name: 'Head stud documentation',
        description: 'Documented head stud replacement (Raceware or ARP specification) is a positive value signal on any 964 Carrera or Turbo. A car with no stud history and unknown original specification carries a latent repair risk that informed buyers routinely price as a discount.',
      },
      {
        name: 'Speedster rarity',
        description: 'The 964 Speedster widebody Exclusiv (15 units worldwide) is one of the rarest production 964 variants — Porsche built fewer of these than any other Speedster configuration. The narrow-body Speedster (930 units) carries a collector premium above equivalent Cabriolets. RHD Speedsters (27 worldwide) are exceptional rarities in any configuration.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 986 (1997–2004 — Boxster first generation)
  // Source: docs/reference/porsche_1990s_reference.md §"Boxster 986"
  //         docs/reference/porsche_2000s_reference.md §"Boxster 986"
  //         docs/reference/defects/01_engine_m96_m97.md
  // ──────────────────────────────────────────────────────────────────────────
  '986': {
    positioning: "Mid-engine roadster that saved Porsche",
    intro: 'The Boxster 986 was Porsche\'s first purpose-built mid-engine roadster since the 550 Spyder, credited alongside the 996 with rescuing the company from financial collapse in the mid-1990s. The M96 engine family — shared with the 996 — brings identical IMS bearing considerations that dominate value calculations on every example.',
    production_years: '1997–2004',
    body_styles: 'Roadster',
    engine: '2.5L M96/20 flat-six (201 hp, MY1997–1999); 2.7L M96/22 flat-six (217–228 hp, MY2000–2004 base); 3.2L M96/21 flat-six S (250–264 hp)',
    cooling: 'Water-cooled',
    units_produced: '~164,800 worldwide (full generation, MY1997–MY2004, base + S combined)',
    notes: [
      'The Boxster 986 arrived in US showrooms as a 1997 model, sharing its front end — doors, headlamps, windscreen, dashboard architecture — with the concurrent 996 Carrera. The shared tooling was a deliberate cost-saving measure that reduced platform development costs by roughly 40 percent versus two independent designs, a financial imperative for a company that had nearly failed twice in the preceding decade. At launch the base Boxster used a 2.5L M96/20 producing 201 hp; the MY2000 update brought a displacement increase to 2.7L (217 hp) and the debut of the Boxster S with a 3.2L M96/21 at 250 hp. The S arrived with a six-speed manual against the base car\'s five-speed, larger red-caliper brakes, a third front grille opening, and twin tailpipes — functional and visual differentiators that persist in current resale valuations.',
      'The MY2003 facelift is the significant mid-cycle event: a glass rear window replaced the plastic unit on earlier cars, the front bumper was revised, and interior trim was updated. The plastic rear window on pre-2003 cars yellows, crazes, and scratches with age — a cosmetic and visibility issue on unrestored early cars. The 986 generation closed with the MY2004 "50 Years 550 Spyder" limited edition: 264 hp, GT Silver Metallic exclusively, cocoa-colored leather, a numbered center-console plaque, and 1,953 units worldwide — the figure chosen to match the year of the 1953 550 Spyder\'s introduction. 500 units were US-market allocation.',
      'The 986\'s valuation sits at the intersection of genuine Porsche sports-car experience and documented engine reliability risk. The M96 carries the IMS bearing concern identical to the 996 Carrera: a single-row intermediate shaft bearing on later production has a documented failure mode where the bearing seizes suddenly, driving debris into the engine. Pre-purchase IMS status — whether the bearing has been inspected, replaced, or upgraded with a Billet or LN Engineering retrofit — is the central valuation variable. A 986 with documented IMS retrofit and clean compression test is a materially different purchase from one with unknown IMS history. The base price point makes the 986 the most accessible Porsche sports car, and buyers who understand the IMS situation can acquire excellent examples at values that reflect engine risk rather than actual condition.',
    ],
    variants: [
      {
        name: 'Boxster 2.5',
        years: 'MY1997–1999',
        drivetrain: 'RWD',
        power: '201 hp',
        description: 'Launch specification with the 2.5L M96/20 and a five-speed manual or Tiptronic. Most 2.5L cars have the dual-row IMS bearing — the more robust of the two IMS variants. Plastic rear window only. Visually identical to later 2.7L cars from outside.',
      },
      {
        name: 'Boxster 2.7 (pre-facelift)',
        years: 'MY2000–2002',
        drivetrain: 'RWD',
        power: '217 hp',
        description: 'Base specification after the 2.7L displacement increase for MY2000. Five-speed manual or Tiptronic. Both dual-row and single-row IMS variants exist in this production window — IMS status requires pre-purchase verification. Plastic rear window.',
      },
      {
        name: 'Boxster 2.7 (post-facelift)',
        years: 'MY2003–2004',
        drivetrain: 'RWD',
        power: '228 hp',
        description: 'MY2003 facelift cars carry the glass rear window — substantially better visibility and no degradation risk. Power rose to 228 hp. The glass window is the quickest visual identifier for post-facelift. All other base specifications carry over from the pre-facelift car.',
      },
      {
        name: 'Boxster S',
        years: 'MY2000–2004',
        drivetrain: 'RWD',
        power: '250–258 hp',
        production: '50,896 worldwide (all 986 Boxster S incl. 1,953 50th Anniversary units)',
        description: '3.2L M96/21, six-speed manual (versus five-speed base), larger four-piston front calipers in red, wider rear track, third grille opening in the front bumper. The preferred collector specification: more power, better brakes, six-speed gearbox. Power rose from 250 to 258 hp across the production run.',
      },
      {
        name: '50 Years 550 Spyder',
        years: 'MY2004',
        drivetrain: 'RWD',
        power: '264 hp',
        production: '1,953 worldwide, 500 US',
        description: 'Final-year limited edition commemorating the 1953 550 Spyder. GT Silver Metallic exclusively, cocoa-colored leather, numbered center-console plaque, 264 hp via revised ECU mapping. The 1,953-unit production figure deliberately matches the year of the original 550\'s introduction. Authentication requires the numbered plaque present and GT Silver confirmed on the COA.',
      },
    ],
    engineering: [
      'Mid-engine layout: The 986 is Porsche\'s first production roadster with a mid-mounted engine since the 550/718 racing cars of the 1950s. The flat-six sits longitudinally behind the passenger compartment, producing near-ideal front-to-rear balance and eliminating the 911\'s characteristic lift-off oversteer tendency. The mid-engine architecture is native to the 986 — not adapted from any prior Porsche platform.',
      'M96 engine and 996 platform sharing: The 986 and 996 share the M96 water-cooled flat-six family, along with front bodywork, headlamps, door structures, and HVAC architecture. The shared "fried-egg" headlamps became the most visible marker of the generation. Both models received revised lighting at their respective facelifts, resolving the shared-part aesthetic criticism.',
      'Displacement evolution and S variant: The base engine grew from 2.5L (MY1997–1999, M96/20) to 2.7L (MY2000+, M96/22) for greater torque. The Boxster S (MY2000) introduced the 3.2L M96/21 — a longer-stroke variant with a separate intake manifold configuration and revised fuel delivery, not simply a bored 2.7L. The six-speed gearbox on the S versus the five-speed on the base is a different transmission housing, not a parts change.',
      'MY2003 glass rear window: The original 986 plastic rear window yellows and crazes over time. The MY2003 facelift addressed this with a heated glass unit operating in the same power-top mechanism. Pre-facelift cars with degraded windows require custom-fabricated glass retrofits or a full top replacement — neither is inexpensive.',
      'IMS bearing variants: The M96 intermediate shaft bearing transitioned from a dual-row unit (earlier production, lower failure rate) to a single-row sealed unit (later production, higher failure rate). Both variants are present across the 986 generation. Buyers should confirm which variant the engine contains or whether an aftermarket retrofit has been installed.',
    ],
    watch_for: [
      {
        title: 'IMS bearing failure — specification varies by model year',
        severity: 'concern',
        body: 'The M96 intermediate shaft bearing can seize suddenly with little warning, driving debris into the engine and causing catastrophic failure. The 986 spans two distinct IMS specifications: MY1997–1999 cars (2.5L era) predominantly carry the earlier dual-row bearing — estimated ~1% failure rate, the lowest-risk M96 IMS variant. MY2000–2004 cars (2.7L era and early 3.2L S) predominantly carry the single-row sealed bearing — estimated ~8% failure rate per class action discovery data. A 1999 Boxster is materially lower risk than a 2002 car at the same mileage. Confirm which bearing variant is installed before purchase. An oil filter inspection for metallic particles is the primary pre-purchase indicator. IMS retrofit cost is approximately $2,500–$4,500 all-in from an independent specialist.',
        buyer_question: 'Has the IMS bearing been inspected or replaced? Is the current bearing dual-row OEM, single-row OEM, or an aftermarket retrofit? Has an oil analysis or filter inspection been performed within the last 5,000 miles, and were metallic particles found?',
      },
      {
        title: 'Cylinder bore scoring',
        severity: 'concern',
        body: 'The M96 can suffer cylinder wall scoring — metal-to-metal contact between piston skirt and cylinder wall — under conditions of oil starvation at the liner interface. Presents as increased oil consumption, compression loss, and sometimes blue smoke at startup. Bore scoring requires cylinder re-lining or engine replacement. A compression and leak-down test on all six cylinders is essential before purchase.',
        buyer_question: 'Has a compression and leak-down test been performed? What were the cylinder-by-cylinder readings? Has the engine shown elevated oil consumption or blue smoke at startup?',
      },
      {
        title: 'Rear main seal (RMS) leak',
        severity: 'caution',
        body: 'The M96 rear main seal between engine and gearbox is a documented early wear item on the 986. A leaking RMS deposits oil on the gearbox housing and can contaminate the clutch. Repair requires engine or gearbox removal and is most economically combined with clutch service. A 986 with 60,000+ miles and no documented RMS history is a probable near-term expense.',
        buyer_question: 'Has the rear main seal been replaced? At what mileage and in conjunction with what other work? Is there any oil film on the top of the gearbox housing under the car?',
      },
      {
        title: 'Pre-facelift plastic rear window degradation',
        severity: 'caution',
        body: 'MY1997–2002 cars use a plastic rear window that yellows, crazes, and scratches with age. Visibility through a degraded unit is meaningfully compromised, and replacement is expensive. MY2003+ cars have the glass window standard and do not have this concern. A degraded plastic window in a listing photograph is a reliable indicator that the car has not been carefully maintained.',
        buyer_question: 'If pre-2003: what is the condition of the rear window — clear, or showing yellowing/crazing/scratching? Has the window been replaced with a glass unit?',
      },
      {
        title: 'Convertible top hydraulics',
        severity: 'caution',
        body: 'The 986 power top uses a hydraulic actuator system. On 20–25-year-old cars, hydraulic cylinder seals leak, pump motors wear, and linkage pivots corrode. A top that operates slowly, incompletely, or with visible fluid seeping from actuator areas is a near-term repair. Full open/close inspection is mandatory before purchase.',
        buyer_question: 'Does the convertible top cycle fully — open and close completely — without hesitation? Is there any hydraulic fluid visible at the actuator areas under the rear deck?',
      },
    ],
    service: [
      'Pre-purchase inspection priorities: (1) Oil analysis or oil filter inspection for metallic particles — the IMS bearing check, non-negotiable. (2) Compression and leak-down test on all six cylinders. (3) RMS inspection — look for oil film on top of the gearbox. (4) Power top full cycle. (5) Pre-2003: rear window condition. An independent Porsche specialist PPI is worth its cost; the potential expense of IMS failure far exceeds the inspection fee.',
      'Oil changes at 7,500–10,000 miles using a quality full-synthetic; maintain oil level above the sight glass midpoint at all times. The IMS bearing is sensitive to oil level and quality — low oil is a contributing failure factor. Coolant system service (water pump, thermostat, flush) at approximately 60,000-mile intervals. The water pump weep hole should be inspected at each service — coolant seeping from the weep hole indicates impending pump failure.',
    ],
    value_drivers: [
      {
        name: 'IMS bearing status',
        description: 'A documented IMS retrofit (LN Engineering Billet or equivalent) commands a material premium. Buyers rationally pay the retrofit cost ($2,500–$4,500) as a premium to avoid the catastrophic downside risk — unknown-IMS cars are discounted accordingly.',
      },
      {
        name: 'S vs base',
        description: 'The 3.2L Boxster S is significantly more desirable than the 2.7L base — more power, six-speed manual, larger brakes, wider stance. The S commands roughly 25–40 percent more than a comparable base car at current market.',
      },
      {
        name: 'Post-facelift (MY2003–2004)',
        description: 'MY2003–2004 cars carry the glass rear window and revised front bumper. The glass window does not degrade, is functionally superior, and carries a consistent modest premium over pre-facelift examples at equivalent mileage and condition.',
      },
      {
        name: 'Manual transmission',
        description: 'Six-speed manual S cars and five-speed manual base cars trade above Tiptronic examples at current pricing. The performance-oriented buyer base for the 986 disproportionately values manual gearboxes.',
      },
      {
        name: '50 Years 550 Spyder documentation',
        description: 'The numbered limited edition requires GT Silver paint confirmed on the build sheet and the original numbered plaque present for full premium. A 550 Spyder with missing plaque or repainted exterior does not command the limited-edition value.',
      },
      {
        name: 'Service documentation and mileage',
        description: 'Below-60,000-mile examples with documented service history command clear premiums. IMS history, oil change intervals, and water pump replacement are the specific service records most relevant to 986 valuations.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 987.2-boxster (2009–2012 — Boxster 987 second half, 9A1 DFI)
  // Source: docs/reference/porsche_2000s_reference.md §"Boxster 987.2"
  //         docs/reference/porsche_2010s_reference.md §"987.2 carryover"
  // ──────────────────────────────────────────────────────────────────────────
  '987.2-boxster': {
    positioning: 'IMS-free Boxster — 9A1 generation begins',
    intro: 'The 987.2 is the most significant reliability upgrade in Boxster history: the 9A1 direct-injection flat-six eliminates the intermediate shaft bearing entirely, ending the IMS concern that defined every Boxster before it. The Boxster Spyder — Porsche\'s lightest production car at its 2011 launch — is the generation\'s performance and collector peak.',
    production_years: '2009–2012',
    body_styles: 'Roadster',
    engine: '2.9L 9A1 flat-six (255 hp); 3.4L 9A1 flat-six S/Spyder (310–320 hp)',
    cooling: 'Water-cooled',
    units_produced: '~12,220 base + ~7,550 S worldwide; Spyder: ~1,944',
    notes: [
      'The 987.2 launched for MY2009 alongside the 997.2, both sharing the new 9A1 direct-injection engine and 7-speed PDK dual-clutch transmission. The 9A1 is an architectural departure from the M96/M97: direct fuel injection instead of port injection, no intermediate shaft, and no IMS bearing. The engine code change from M97 to 9A1 marks the most significant mid-cycle improvement in Boxster history from a reliability standpoint. A 987.1 and a 987.2 are not the same risk proposition despite the similar body. The base 987.2 uses a 2.9L 9A1 (255 hp); the S uses the 3.4L 9A1 (310 hp). The 7-speed PDK replaced the 5-speed Tiptronic as the automatic option; the six-speed manual carried over.',
      'The Boxster Spyder (MY2011–MY2012) is the 987.2\'s halo variant and was Porsche\'s lightest production car at launch: 1,275 kg achieved through aluminum doors and decklid (saving ~15 kg combined), a manually operated canvas top replacing the power roof (saving 21 kg), and deleted carpets and air conditioning as standard. The 3.4L 9A1 was tuned to 320 hp with a 20 mm lower sport suspension and sport exhaust. The Porsche Historisches Archiv records total Spyder production at 1,944 units: 33 cars built in CY2009, 1,418 in CY2010, 493 in CY2011. Approximately 890 were US-allocation. PDK take rate on the Spyder was higher than the enthusiast demographic later recalled.',
      'The 987.2 closed the 987 body style in MY2012, superseded by the entirely new 981 for MY2013. The Black Edition (MY2011, exactly 987 units worldwide, +10 hp ECU remap, all-black trim) and Porsche Design Edition 2 (MY2009, 250–500 units worldwide and only 32 US, Carrara White with white-faced gauges) are the generation\'s limited editions outside the Spyder. For collectors the 987.2 Spyder is the primary target — COA authentication and physical confirmation of aluminum doors/decklid are the key verification steps.',
    ],
    variants: [
      {
        name: 'Boxster (base)',
        years: 'MY2009–2012',
        drivetrain: 'RWD',
        power: '255 hp',
        description: '2.9L 9A1 flat-six — no IMS bearing concern. Six-speed manual or new 7-speed PDK. The base 987.2 is the most cost-effective entry to the IMS-free Boxster generation. PDK is noticeably faster than the outgoing Tiptronic on the same route.',
      },
      {
        name: 'Boxster S',
        years: 'MY2009–2012',
        drivetrain: 'RWD',
        power: '310 hp',
        description: '3.4L 9A1 flat-six with six-speed manual or PDK. Large-caliper front brakes, sport suspension, third front grille. The 9A1\'s direct injection improves part-throttle response versus the port-injected M96/M97. Widely regarded as the most sorted naturally-aspirated S Boxster before the 981 replaced it.',
      },
      {
        name: 'Boxster Spyder',
        years: 'MY2011–2012',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '~1,944 worldwide, ~890 US',
        description: '1,275 kg via aluminum doors/decklid, manual canvas top, and deleted A/C. 3.4L 9A1 at 320 hp, 20 mm lower suspension, sport exhaust, unique double-hump top cover. Six-speed manual or PDK. The Spyder is the most collectible 987.2 — COA confirmation and physical aluminum-door verification are the authentication steps.',
      },
      {
        name: 'Boxster S Black Edition',
        years: 'MY2011',
        drivetrain: 'RWD',
        power: '320 hp',
        production: '987 worldwide',
        description: 'Final-run special with +10 hp ECU remap, all-black exterior and interior trim, 19-inch wheels, unique badging. Based on the Boxster S. Production capped at exactly 987 units — a deliberate reference to the 987 chassis designation. Less collectible than the Spyder due to appearance-only differentiation.',
      },
      {
        name: 'Porsche Design Edition 2',
        years: 'MY2009',
        drivetrain: 'RWD',
        power: '310 hp',
        production: '250–500 worldwide (sources conflict), 32 US',
        description: 'Carrara White exterior, black-and-white leather interior, white-faced instrument cluster. Based on the Boxster S at launch-spec 310 hp. Only 32 US examples make this extremely rare domestically. Production total is disputed (250 vs 500 worldwide); COA confirming Edition 2 designation is essential.',
      },
    ],
    engineering: [
      '9A1 direct-injection — IMS elimination: The 9A1 engine has no intermediate shaft and therefore no IMS bearing. Direct fuel injection replaces port injection, improving fuel atomization and enabling higher compression ratios. The 9A1 in the 987.2 base displaces 2.9L (versus 2.7L in the 987.1) to compensate for the low-end torque that port injection provided. This architecture change is the most consequential reliability improvement in Boxster history.',
      '7-speed PDK dual-clutch: PDK uses two input shafts — one for odd gears, one for even — allowing the next gear to be pre-selected for shifts in approximately 100 milliseconds. This replaces the 5-speed Tiptronic S, which was comparatively slow. PDK take rate on the 987.2 was materially higher than Tiptronic had been on the 987.1, driven by both performance improvement and Porsche\'s positioning of PDK as the technically superior option.',
      'Boxster Spyder lightweight program: The 987.2 Spyder achieves 1,275 kg through three simultaneous reductions: aluminum doors and decklid (saving ~15 kg), manual canvas top replacing the power soft top (saving 21 kg), and deleted carpets and standard A/C (saving ~15–20 kg further). The manual top — a two-person, ~two-minute process requiring roadside stowage of the cover — was a deliberate choice to avoid the weight of any mechanical assist.',
      'LED daytime running lights and revised fascias: The 987.2 adopted LED DRL strips in revised front and rear fascias, the same change applied simultaneously to the 997.2. LED strips integrated into a new lower valence are the quickest visual identifier of a 987.2 versus 987.1.',
      '9A1 intake carbon deposit susceptibility: As with all direct-injection engines, the 9A1 does not wash intake valves with fuel mist. Carbon accumulates on intake valve stems over time, particularly above 60,000–70,000 miles. Walnut-blast intake cleaning is the standard remedy (~$500–$900) and is a maintenance item, not a defect.',
    ],
    watch_for: [
      {
        title: 'Confirm 9A1 engine — no IMS on MY2009+ cars',
        severity: 'caution',
        body: 'The 987.2 uses the 9A1 engine with no IMS bearing. Buyers should confirm the car is genuinely a MY2009+ 987.2 and not a MY2008 987.1 misrepresented as a 987.2. Verify model year from the VIN plate and confirm the engine code is 9A1 family on the door-jamb sticker. If the car has had an engine replacement, confirm the replacement is also 9A1.',
        buyer_question: 'Can you confirm the VIN and model year? What is the engine code on the door-jamb sticker? Has the engine ever been replaced, and if so, was the replacement a 9A1-family unit?',
      },
      {
        title: 'Spyder aluminum door and decklid authentication',
        severity: 'caution',
        body: 'The Spyder uses aluminum doors and rear decklid unique to the model. A seller could misrepresent a standard Boxster S as a Spyder. Authentication: aluminum panels are noticeably lighter when unlatched; confirm manual canvas top mechanism rather than a power top; obtain Porsche COA showing Spyder specification. Double-hump top cover and Spyder badges are also Spyder-specific.',
        buyer_question: 'Can you provide the Porsche COA showing Spyder specification? Are the doors and decklid confirmed aluminum? Is the manual canvas top mechanism present and complete (not a power top)?',
      },
      {
        title: 'Power top condition (non-Spyder)',
        severity: 'caution',
        body: 'Standard 987.2 Boxster and Boxster S retain hydraulic power tops. On 13–16-year-old cars, cylinder seals, pump motors, and linkage wear produce slow or incomplete operation. Full open/close inspection before purchase is essential.',
        buyer_question: 'Does the convertible top cycle completely — open and close without hesitation? Is there hydraulic fluid visible at the actuator areas?',
      },
      {
        title: '9A1 intake carbon buildup',
        severity: 'caution',
        body: 'Above 60,000–80,000 miles without documented intake cleaning, carbon accumulation on intake valves can cause rough idle or hesitation. Walnut-blast cleaning is approximately $500–$900 at a specialist — a maintenance item. Factor it in as an upcoming service if mileage is high and no cleaning history is documented.',
        buyer_question: 'Has intake valve carbon cleaning (walnut blast) been performed? At what mileage? Is there any rough idle, cold-start hesitation, or elevated oil consumption currently?',
      },
      {
        title: 'Coolant system age',
        severity: 'caution',
        body: 'Water pump replacement (~60,000 miles), thermostat replacement, and coolant flush (every 4 years) should be in the service history. A 987.2 approaching or past these intervals without documentation is a near-term maintenance item; a failing water pump can overheat the engine before the gauge provides meaningful warning.',
        buyer_question: 'Has the water pump been replaced? At what mileage? When was coolant last flushed and thermostat serviced?',
      },
    ],
    service: [
      'Pre-purchase inspection priorities: (1) Confirm 9A1 engine code — verify model year and no engine swap. (2) Compression and leak-down test. (3) For Spyder: COA authentication, aluminum door/decklid confirmation. (4) Coolant system history — water pump, thermostat, flush. (5) Intake carbon cleaning history above 70,000 miles. The absence of IMS concern makes the 987.2 inspection substantially simpler than the 987.1 — focus is on age-related maintenance rather than structural engine risk.',
    ],
    value_drivers: [
      {
        name: '9A1 engine — IMS elimination',
        description: 'The 987.2\'s 9A1 engine is the generation\'s defining value attribute versus the 987.1. Buyers rationally pay a premium for the same-body car with the safer engine. The spread widens in markets where IMS awareness is high.',
      },
      {
        name: 'Boxster Spyder rarity',
        description: '~1,944 units worldwide (~890 US) makes the Spyder the generation\'s collectible halo. Full COA, confirmed manual top, aluminum doors/decklid, and original spec are required for the full Spyder premium. PDK Spyders trade at modest discounts to manual cars.',
      },
      {
        name: 'Manual vs PDK',
        description: 'Both transmissions are desirable — PDK is genuinely quicker and the market accepts it. Six-speed manual holds slightly better long-term; PDK examples typically trade within 5–10 percent of manual cars depending on spec.',
      },
      {
        name: 'Documented service history',
        description: 'Coolant system records (water pump, thermostat) and carbon cleaning history above 70,000 miles are positive signals. Below-50,000-mile examples command clear premiums.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 981-boxster (2013–2016 — Boxster 981, last NA flat-six base/S/GTS)
  // Source: docs/reference/porsche_2010s_reference.md §"Boxster/Cayman 981"
  // ──────────────────────────────────────────────────────────────────────────
  '981-boxster': {
    positioning: 'Last naturally-aspirated flat-six Boxster',
    intro: 'The 981 is the last Boxster generation with a naturally-aspirated flat-six across base, S, and GTS trims — an attribute that commands sustained premiums as the turbocharged 718 era has reshaped the used market. The Boxster Spyder\'s 3.8L engine from the 991.1 Carrera S, manual-only mandate, and GT-department hardware make it the generation\'s definitive specification.',
    production_years: '2013–2016',
    body_styles: 'Roadster',
    engine: '2.7L 9A1 flat-six (265 hp); 3.4L 9A1 flat-six S (315 hp); 3.4L 9A1 flat-six GTS (330 hp, MY2015–2016); 3.8L 9A1 flat-six Spyder (375 hp, MY2016)',
    cooling: 'Water-cooled',
    units_produced: '~23,600 total 981 Boxster/Cayman per PAG 2014 annual report; Spyder: ~2,400 worldwide',
    notes: [
      'The 981 launched at the 2012 Geneva Motor Show as a MY2013 model — the most comprehensive Boxster redesign since the 987. The new platform used an aluminum-steel hybrid monocoque (parallel to the concurrent 991.1 architecture), increasing torsional rigidity while reducing weight by approximately 35 kg versus the 987.2. Wheelbase grew to 97.4 inches. Engine displacement changed: the 9A1 base dropped from 2.9L to 2.7L while retaining 265 hp via revised mapping, and the S continued at 3.4L/315 hp. Electric power steering replaced the hydraulic rack — the first Boxster/Cayman generation with EPS — a change that divided the enthusiast community at launch. The GTS variants arrived for MY2015 with the 3.4L at 330 hp, Sport Chrono, PASM, and sport exhaust all standard.',
      'The 981 Boxster Spyder (MY2016) is the generation\'s definitive halo. Porsche sourced a detuned version of the 991.1 Carrera S\'s 3.8L 9A1 (375 hp versus 400 hp in the donor), installed a six-speed manual as the only transmission option, fitted the Cayman GT4\'s front and rear fascias with additional cooling vents, deleted the power top for a manually-folding canvas roof, and used a steering rack ratio from the 991 Turbo S. Aluminum doors and decklid carried over from the 987.2 Spyder lineage. Approximately 2,400 units were produced worldwide; US allocation was approximately 850 cars. The 981 Spyder is the only Boxster in which GT-department chassis hardware (GT3-derived brakes, GT4 fascias, Turbo S steering rack) is bundled with the open roadster body.',
      'The 981\'s market position has strengthened significantly since the 718 replaced it with a turbocharged flat-four for MY2017. Buyers who value the naturally-aspirated flat-six character — linear power delivery, high-revving, and the exhaust note — have sustained premiums on GTS and Spyder examples. The Spyder in clean documented condition trades near its original MSRP in many markets. The 718 Spyder with 4.0L NA flat-six (MY2020) created a higher-powered alternative, but at a significantly higher price tier — the 981 Spyder remains the accessible entry to the manual NA roadster experience.',
    ],
    variants: [
      {
        name: 'Boxster (base)',
        years: 'MY2013–2016',
        drivetrain: 'RWD',
        power: '265 hp',
        description: '2.7L 9A1 naturally-aspirated flat-six with six-speed manual or PDK. The most accessible entry to the naturally-aspirated flat-six Boxster generation. Same fundamental chassis and character as the S at lower cost.',
      },
      {
        name: 'Boxster S',
        years: 'MY2013–2016',
        drivetrain: 'RWD',
        power: '315 hp',
        description: '3.4L 9A1 flat-six with six-speed manual or PDK. Larger front brakes, sport suspension, 20-inch wheels standard. The preferred general specification — enough power to be genuinely engaging without the Spyder\'s open-car compromises.',
      },
      {
        name: 'Boxster GTS',
        years: 'MY2015–2016',
        drivetrain: 'RWD',
        power: '330 hp',
        description: 'Only available in the final two model years of the 981 generation. 3.4L 9A1 at 330 hp via ECU remap, Sport Chrono, PASM sport suspension, sport exhaust, and Alcantara interior — all standard equipment. The most complete non-Spyder 981 Boxster specification; GTS values have held particularly well relative to the S.',
      },
      {
        name: 'Boxster Spyder',
        years: 'MY2016',
        drivetrain: 'RWD',
        power: '375 hp',
        production: '2,486 worldwide; ~829 North America',
        description: '3.8L 9A1 from the 991.1 Carrera S (detuned from 400 hp). Six-speed manual only — no PDK. GT4 front and rear fascias, manually-folding canvas top, aluminum doors and decklid, 991 Turbo S steering rack, 20 mm lower suspension. Manual-only is a deliberate collector specification.',
      },
    ],
    engineering: [
      'Aluminum-steel hybrid monocoque: The 981 uses aluminum for key structural members alongside high-strength steel — the same approach as the concurrent 991.1. The result is a 35 kg weight reduction versus the 987.2 with increased torsional rigidity. The stiffer structure translates into more precise transient response and reduced vibration intrusion.',
      'Electric power steering (EPS): The 981 replaced the hydraulic steering rack with an EPS unit — the first mid-engine Porsche to do so. The change was controversial at launch due to reduced tactile feedback compared to the 987.2 hydraulic system. Porsche revised the EPS software calibration twice during the production run. The Boxster Spyder uses a different steering ratio sourced from the 991 Turbo S, producing a faster, more involved response.',
      '3.8L engine in the Spyder: The Spyder is the only 981 variant with the 3.8L 9A1 — borrowed from the 991.1 Carrera S at 375 hp (25 hp below the donor). This is the only time in Boxster history that the roadster received a Carrera S engine. The resulting power-to-weight ratio of approximately 315 hp per tonne makes the 981 Spyder one of the quickest normally-aspirated Porsches of its era.',
      'GTS formula (MY2015): The 981 GTS established the production-line GTS formula used in all subsequent 718/982 generations: Sport Chrono, PASM, sport exhaust, and Alcantara interior bundled as standard. This distinguishes the GTS from a heavily-optioned S — the GTS is a factory performance package, not a parts collection.',
      'GT4-derived hardware for the Spyder: The 981 Spyder shares its front and rear aerodynamic fascias with the concurrent Cayman GT4, adding cooling vents absent from the standard Boxster bumpers. Both the Spyder and GT4 use 991 GT3 brake calipers and suspension components. The Spyder\'s 991 Turbo S steering rack is the fastest fitted to any 981 and is unique to this variant.',
    ],
    watch_for: [
      {
        title: 'Spyder authentication — manual-only and GT4 hardware',
        severity: 'caution',
        body: 'The 981 Spyder is manual-only — no PDK option was offered. A claimed Spyder with PDK is a misidentification. Verify the GT4-derived vented front bumper and revised rear fascia (distinct from the standard Boxster bumpers), aluminum doors and decklid, and the manually-folding canvas top (no power mechanism). The Porsche COA should confirm Spyder specification and the 3.8L engine.',
        buyer_question: 'Can you provide the Porsche COA confirming Spyder specification? Is the transmission confirmed 6-speed manual? Are the front and rear fascias the GT4-vented units, and are doors and decklid aluminum?',
      },
      {
        title: 'GTS equipment verification',
        severity: 'caution',
        body: 'The 981 GTS includes Sport Chrono, PASM, sport exhaust, and Alcantara as factory standard. A heavily-optioned S might have similar individual options. Confirm GTS on the VIN sticker and COA; verify the sport exhaust is the factory unit (identifiable by tip design and routing). MY2015–2016 are the only model years the 981 GTS was offered.',
        buyer_question: 'Is GTS designation confirmed on the VIN sticker or COA? Is sport exhaust confirmed factory-fitted? What model year is the car — is it MY2015 or MY2016 (the only two GTS years)?',
      },
      {
        title: 'Intake carbon buildup',
        severity: 'caution',
        body: 'All 9A1-family direct-injection engines accumulate carbon on intake valves. Above 70,000 miles without documented walnut-blast cleaning, rough idle or hesitation may indicate meaningful buildup. The repair is ~$500–$900 at a specialist and is a maintenance item, not a defect.',
        buyer_question: 'Has intake valve carbon cleaning (walnut blast) been performed, and at what mileage? Any rough idle, cold-start hesitation, or elevated oil consumption currently?',
      },
      {
        title: 'Electric power steering character',
        severity: 'caution',
        body: 'The 981 EPS has a distinct feel from the 987.2 hydraulic rack — lighter, with different feedback texture at the limit. This is not a defect but a character difference that some buyers switching from 987.2 find unsatisfying. Buyers with strong hydraulic steering preference should drive a 981 before committing.',
        buyer_question: 'If coming from a hydraulic-steering Porsche: have you driven the 981 specifically to assess the EPS feel? Is the steering operating correctly — smooth centering, no unexpected behaviors through the wheel?',
      },
      {
        title: 'Coolant system age',
        severity: 'caution',
        body: 'The 981 is 9–12 years old as of 2025. Water pump replacement (~60,000 miles), thermostat, and coolant flush (4-year intervals) should be documented. A 981 with 70,000+ miles and no documented water pump service is a near-term maintenance item.',
        buyer_question: 'Has the water pump been replaced, and at what mileage? When was coolant last flushed? Any overheating history or temperature gauge anomalies?',
      },
    ],
    service: [
      'Pre-purchase inspection priorities: (1) Spyder authentication if applicable — COA, manual transmission confirmed, aluminum doors/decklid, GT4 fascias. (2) GTS verification if applicable — VIN sticker, factory exhaust, PASM. (3) Compression and leak-down test. (4) Coolant system service history. (5) Intake carbon cleaning history above 70,000 miles. The 9A1 engine\'s absence of IMS concern means inspection focuses on age-related maintenance rather than structural engine risk.',
    ],
    value_drivers: [
      {
        name: 'Last NA flat-six generation',
        description: 'The 981 is the last Boxster generation with a naturally-aspirated flat-six across base, S, and GTS. The turbocharged 718 that replaced it has driven sustained premiums on 981 GTS and Spyder examples, with the spread widening as the 718 era has matured.',
      },
      {
        name: 'Boxster Spyder',
        description: '2,486 worldwide production, manual-only, 3.8L Carrera S engine, and GT-department hardware command the generation\'s highest premium. Full documentation (COA, original spec, correct color) supports the premium; modified or undocumented Spyders do not command equivalent values.',
      },
      {
        name: 'GTS trim (MY2015–2016 only)',
        description: 'Only available in the final two model years of the 981 generation. Sport Chrono, PASM, and sport exhaust standard make it the best-equipped non-Spyder 981 Boxster. GTS values have held particularly well against the S.',
      },
      {
        name: 'Manual vs PDK',
        description: 'Six-speed manual 981 Boxsters hold a collector premium over PDK cars, particularly on GTS and Spyder variants. The Spyder is manual-only by design — the manual premium is already embedded in all Spyder values.',
      },
      {
        name: 'Special-order color on GTS / Spyder',
        description: 'Miami Blue, Carmine Red, and Lava Orange command premiums on GTS and Spyder variants. Standard colors on base and S examples are broadly neutral. Color premium applies principally to the performance-tier variants where color is a documented spec item.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 982-boxster (2017–2024 — 718 Boxster: flat-four era + NA six return)
  // Source: docs/reference/porsche_2010s_reference.md §"718 Boxster/Cayman"
  //         docs/reference/porsche_2020s_reference.md §"718 generation"
  // ──────────────────────────────────────────────────────────────────────────
  '982-boxster': {
    positioning: '718 Boxster — turbocharged flat-four, with NA flat-six return',
    intro: 'The 718 Boxster replaced the 981\'s naturally-aspirated flat-six with turbocharged flat-four engines — mechanically faster but widely criticized for exhaust character. The MY2020 GTS 4.0 and Boxster Spyder returned the naturally-aspirated flat-six, creating two mechanically distinct sub-families within the same generation. ICE production ended October 2025.',
    production_years: '2017–2024 (ICE production ended October 2025)',
    body_styles: 'Roadster',
    engine: '2.0L flat-four turbo (300 hp base); 2.5L flat-four turbo (350–365 hp S/GTS); 4.0L NA flat-six GTS 4.0 (394 hp, MY2020+); 4.0L NA flat-six Spyder (414 hp, MY2020+); 4.0L NA flat-six Spyder RS (500 hp, MY2024, PDK only)',
    cooling: 'Water-cooled',
    units_produced: 'Not publicly broken out per trim or year; ICE production ended October 2025',
    notes: [
      'The 718 Boxster arrived for MY2017 with a 2.0L turbocharged flat-four (300 hp, base) and a 2.5L turbocharged flat-four (350 hp, S) replacing the 981\'s naturally-aspirated flat-six. The flat-four firing order produces a distinct exhaust note that was the principal point of enthusiast objection in period reviews — Top Gear, Motor Trend, and Car and Driver all noted the 718 was measurably faster than the 981 while describing the sound as less compelling. The 718 designation references Porsche\'s mid-1950s Type 718 racing roadster, a callback meant to reframe the controversial powertrain decision. The GTS trim arrived for MY2018 with the 2.5L at 365 hp via revised turbocharger mapping, with that flat-four GTS running through MY2019.',
      'For MY2020 Porsche made the most significant mid-generation change in modern Boxster history: the GTS 4.0 and Boxster Spyder were introduced with a 4.0L naturally-aspirated flat-six derived from the 991.2 GT3 base engine — 394 hp on the GTS 4.0, 414 hp on the Spyder. The GTS 4.0 replaced the flat-four GTS entirely. Both the GTS 4.0 and Spyder are available with six-speed manual or PDK. The MY2024 Spyder RS escalated further: the 4.0L from the 992 GT3 (approximately 500 hp), PDK only, widened body, and PCCB standard — the most powerful production Boxster ever built and the final expression of the generation before ICE production ended.',
      'The 718 generation now splits cleanly into two sub-families for buyers: flat-four turbocharged (base, S, flat-four GTS MY2018–2019) and naturally-aspirated flat-six (GTS 4.0, Spyder, Spyder RS). Flat-four cars offer turbocharged performance at significantly lower price points. The NA six cars — particularly the Spyder and Spyder RS — are expected to hold values strongly as the last open mid-engine NA flat-six Porsches available before the 718\'s electrification. A gas particulate filter (GPF) was added to later flat-four production for European emissions compliance; US-market cars were less consistently affected but some late examples carry GPF equipment affecting exhaust character marginally.',
    ],
    variants: [
      {
        name: '718 Boxster (flat-four)',
        years: 'MY2017–2024',
        drivetrain: 'RWD',
        power: '300 hp',
        description: '2.0L turbocharged flat-four with six-speed manual or PDK. Mechanically faster than the 981 it replaced. The flat-four exhaust note is the principal buyer consideration — hearing the car before purchasing is strongly recommended for anyone transitioning from the NA flat-six 981 or 987.',
      },
      {
        name: '718 Boxster S (flat-four)',
        years: 'MY2017–2024',
        drivetrain: 'RWD',
        power: '350 hp',
        description: '2.5L turbocharged flat-four with six-speed manual or PDK. Fifty horsepower more than the base — the gap is felt in back-to-back driving. The 2.5L\'s larger turbocharger and twin-scroll design give broader torque delivery and better in-gear responsiveness versus the 2.0L base.',
      },
      {
        name: '718 Boxster GTS (flat-four)',
        years: 'MY2018–2019',
        drivetrain: 'RWD',
        power: '365 hp',
        description: '2.5L flat-four at 365 hp via revised turbocharger mapping, with Sport Chrono, PASM, sport exhaust, and Alcantara standard. Replaced in MY2020 by the GTS 4.0 with a fundamentally different engine. Buyers wanting GTS equipment without the GTS 4.0 price premium can find these flat-four GTS cars at lower used prices.',
      },
      {
        name: '718 Boxster GTS 4.0',
        years: 'MY2020–2024',
        drivetrain: 'RWD',
        power: '394 hp',
        description: '4.0L naturally-aspirated flat-six derived from the 991.2 GT3 base engine — the reason this variant commands a substantial premium over the flat-four GTS. Linear power delivery, high-revving character, and the flat-six exhaust note that defined every Boxster before the 718. Six-speed manual or PDK. Sport Chrono, PASM, sport exhaust, Alcantara standard.',
      },
      {
        name: '718 Boxster Spyder',
        years: 'MY2020–2024',
        drivetrain: 'RWD',
        power: '414 hp',
        description: '4.0L NA flat-six, 20 hp more than the GTS 4.0. Manually-folding canvas top, GT4-derived front fascia, six-speed manual or PDK. Lower ride height and revised spring rates versus the GTS 4.0. The NA flat-six open-top Boxster in its most focused form — the primary successor to the 981 Spyder formula.',
      },
      {
        name: '718 Boxster Spyder RS',
        years: 'MY2024',
        drivetrain: 'RWD',
        power: '~500 hp',
        production: 'Limited allocation; US figures not published',
        description: '4.0L NA flat-six from the 992 GT3, PDK only. Widened body, PCCB standard, track-focused setup. The most powerful and extreme production Boxster ever built. Rare US allocation; dealer-relationship dependent. The final and highest expression of the 982 generation before ICE production ended.',
      },
    ],
    engineering: [
      '2.0L/2.5L turbocharged flat-four (9A2 family): The base and S engines share architectural lineage with the 991.2\'s 9A2 family. Both use a twin-scroll single turbocharger; the 2.5L adds a variable turbine geometry stage for improved spool response. The flat-four firing order produces a fundamentally different exhaust character from the flat-six predecessors — the source of the most widely-cited enthusiast objection. Neither engine has an IMS bearing concern.',
      '4.0L NA flat-six (MY2020 GTS 4.0 and Spyder): Derived from the 991.2 GT3 base engine, the 4.0L is a high-revving naturally-aspirated unit with a dry-sump lubrication system and no IMS bearing. It revs to approximately 7,800 rpm and is widely regarded as one of the finest NA engines Porsche has built. The NA flat-six return was driven by sustained market demand — used 981 GTS and Spyder prices had held against new flat-four 718 pricing through MY2017–2019, demonstrating that the market valued the NA character distinctly.',
      'Revised chassis tuning versus 981: The 718 chassis is largely carryover from the 981 with revised spring rates, damper calibrations, and steering geometry. The EPS calibration was improved from the 981\'s controversial initial setup — most reviews found the 718\'s steering more communicative than the 981\'s despite both using EPS. The chassis revision, combined with better power delivery from the turbocharged engines, gives the 718 improved objective handling balance versus the 981.',
      'Spyder manually-folding canvas top: The 982 Spyder revives the 987.2 Spyder\'s philosophy: a manually-removed and stored canvas top saving 21 kg versus the power top on standard Boxsters. The 982 Spyder simplified the mechanism versus the 987.2\'s dual-hump design — a single latch process rather than two separate cover halves.',
      'Gas particulate filter (GPF) on later flat-four production: Late-production flat-four 718 cars built primarily for European markets from approximately 2020 onward incorporate a GPF for Euro 6d compliance. The GPF has marginal power effect but modestly affects exhaust tone on some cars. US-market cars were less consistently GPF-equipped; verify on specific late examples if exhaust character is a priority.',
    ],
    watch_for: [
      {
        title: 'Flat-four vs flat-six character — verify preference before purchase',
        severity: 'caution',
        body: 'The flat-four turbocharged base, S, and early GTS (MY2018–2019) produce a fundamentally different exhaust note from the flat-six models they followed. This is a character difference, not a defect, but it has driven significant used-market behavior — buyers who prefer the NA sound have sustained strong premiums for 981 cars and 718 NA-six models. Anyone transitioning from an 981 or earlier Boxster should drive a flat-four 718 before committing.',
        buyer_question: 'Have you driven a flat-four 718 specifically to evaluate the exhaust note and power delivery character? Does it meet your expectations relative to prior flat-six Boxster experience?',
      },
      {
        title: 'GTS 4.0 vs flat-four GTS identity verification',
        severity: 'concern',
        body: 'The GTS 4.0 (MY2020+, 4.0L NA flat-six, 394 hp) and the flat-four GTS (MY2018–2019, 2.5L turbo, 365 hp) share similar exterior specification. A seller misrepresenting a flat-four GTS as a GTS 4.0 is the most common 718 identity error — the difference is approximately $15,000–$25,000 in market value. Verify "GTS 4.0" on the VIN sticker and COA, confirm the 4.0L engine code, and verify via the exhaust note before purchase.',
        buyer_question: 'Does the VIN sticker confirm "GTS 4.0" specification? Can you provide the COA showing the 4.0L naturally-aspirated engine? What is the engine code on the VIN sticker?',
      },
      {
        title: 'Spyder RS PDK-only character',
        severity: 'caution',
        body: 'The MY2024 Spyder RS is PDK-only — the most powerful 718 Boxster but without a manual option. Buyers specifically seeking a manual-transmission NA flat-six Spyder should confirm the model year — MY2020–2023 Spyders offered both 6MT and PDK. The Spyder RS is a different price tier and character from the standard Spyder.',
        buyer_question: 'Is this confirmed as a Spyder (manual or PDK, MY2020–2023) or Spyder RS (PDK only, MY2024)? Is manual transmission available on this specific car?',
      },
      {
        title: 'Spyder canvas top condition',
        severity: 'caution',
        body: 'The 982 Spyder\'s manually-folded canvas top ages like all soft tops. Inspect for tears, zipper integrity, and the seal where the top meets the windscreen frame. A damaged Spyder top requires custom replacement, not a standard Boxster soft-top part. Confirm the storage cover is present — it is required for the manual stowage process.',
        buyer_question: 'Is the canvas top intact — no tears, zipper damage, or leaks at the windscreen seal? Has the top been replaced? Is the frunk storage cover present and undamaged?',
      },
      {
        title: 'Flat-four turbocharger and cooling system health',
        severity: 'caution',
        body: 'The 2.0L and 2.5L flat-four turbo engines require attention to intercooler integrity and turbocharger condition at higher mileages. Boost pressure irregularities or oil consumption above 1 quart per 3,000 miles may indicate turbocharger wear. Service history should document coolant flush, water pump service at ~60,000-mile intervals, and fresh oil at OEM-specified intervals.',
        buyer_question: 'Is there any history of boost irregularity or elevated oil consumption? Has the coolant system been serviced — water pump, thermostat, flush — at appropriate intervals?',
      },
    ],
    service: [
      'Pre-purchase inspection priorities: (1) Engine identity — confirm flat-four or 4.0L NA flat-six (GTS 4.0 or Spyder) via VIN and COA. (2) For Spyder: canvas top inspection and COA confirmation. (3) For flat-four variants: turbocharger condition; intake carbon deposits above 60,000 miles. (4) Coolant system documentation — water pump, thermostat. (5) For Spyder RS: confirm PDK and post-delivery service record. The 982 is mechanically robust — primary buyer considerations are character preference and routine maintenance documentation rather than structural reliability concerns.',
    ],
    value_drivers: [
      {
        name: 'GTS 4.0 / Spyder (4.0L NA) vs flat-four variants',
        description: 'The 4.0L NA flat-six GTS 4.0 and Spyder command substantial premiums over flat-four 718 variants. The premium has widened as the generation has matured and flat-four base/S/GTS cars have depreciated. The NA character is the primary driver — buyers pay a significant premium to avoid the flat-four.',
      },
      {
        name: 'Spyder RS rarity (MY2024)',
        description: 'PDK-only 992 GT3 engine, widened body, PCCB standard — the most extreme 982 Boxster. Tight US allocation and dealer-relationship dependency at time of sale support its premium. COA and factory delivery documentation are required.',
      },
      {
        name: 'Manual transmission',
        description: 'Six-speed manual commands collector premiums across all 982 trims. The NA flat-six plus manual combination (GTS 4.0 or Spyder) is the most sought specification. The Spyder RS is PDK-only — all Spyder RS values are PDK by default.',
      },
      {
        name: 'Flat-four GTS (MY2018–2019) vs GTS 4.0 value distinction',
        description: 'The flat-four GTS and GTS 4.0 look similar externally but are different market segments. Flat-four GTS cars at lower used prices appeal to buyers who want GTS equipment without the 4.0L premium. Verify model year and engine to avoid paying GTS 4.0 pricing for a flat-four GTS.',
      },
      {
        name: 'Special-order color on GTS 4.0 / Spyder',
        description: 'Paint-to-sample and special-order colors carry measurable premiums on the GTS 4.0 and Spyder specifically. Standard colors on base and S flat-four variants are neutral. Color premium applies principally to the NA-six performance tier.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 987.1-boxster (2005–2008 — Boxster 987 first half, M96/M97)
  // Source: docs/reference/porsche_2000s_reference.md §"Boxster 987.1"
  //         docs/reference/defects/01_engine_m96_m97.md
  // ──────────────────────────────────────────────────────────────────────────
  '987.1-boxster': {
    positioning: 'Redesigned Boxster — single-row IMS era',
    intro: 'The comprehensively redesigned second-generation Boxster, wider and more powerful than the 986, sharing its platform with the new Cayman coupe. M96/M97 engine concerns carry over from the 986 — with the single-row IMS bearing on early 987.1 production representing the highest documented failure rate of any IMS variant in the water-cooled era.',
    production_years: '2005–2008',
    body_styles: 'Roadster',
    engine: '2.7L M96/25 flat-six (240 hp); 3.2L M96/26 flat-six S (280 hp, MY2005–2006); 3.4L M97/21 flat-six S (295 hp, MY2007–2008, VarioCam Plus)',
    cooling: 'Water-cooled',
    units_produced: '~31,920 base + ~23,420 S worldwide (full generation)',
    notes: [
      'The 987.1 launched for MY2005 as the most comprehensive Boxster redesign since the original 986. The new body was wider at both axles, with more prominent side air intakes and larger headlamps with separate turn-signal clusters — a clean visual break from the 986\'s shared-with-996 aesthetic. The 987 platform was simultaneously developed as the basis for the Cayman coupe, which launched for MY2006 as the fixed-roof sibling sharing chassis, engines, and most interior components. The base Boxster used a 2.7L M96/25 (240 hp); the Boxster S launched with the 3.2L M96/26 (280 hp) for MY2005–2006.',
      'The most significant mechanical event inside the 987.1 generation is the Boxster S engine change for MY2007. The 3.2L M96/26 was replaced by the 3.4L M97/21 with VarioCam Plus — a system that adds variable intake valve lift to the existing variable camshaft timing, raising output to 295 hp and broadening the torque curve. For buyers this creates two mechanically distinct Boxster S cars under the same 987.1 body: MY2005–2006 (3.2L, 280 hp) and MY2007–2008 (3.4L, 295 hp, VarioCam Plus). The generation closed with the RS 60 Spyder for MY2008: 1,960 units worldwide (approximately 800 US), GT Silver Metallic exclusively, carmine red leather, 19-inch SportDesign wheels, sport exhaust standard, and 303 hp from revised ECU mapping.',
      'For valuation purposes the 987.1 carries significant IMS risk that varies by production year. Early 987.1 production — predominantly MY2005 and early MY2006 builds — is equipped with the single-row IMS bearing, the highest-failure-rate variant in the water-cooled era (~8% per class action discovery data). A MY2005 987.1 is the highest-risk IMS production year of any modern Porsche. Later 987.1 production (predominantly late MY2006 through MY2008) received Porsche\'s updated larger non-serviceable bearing at approximately 1% estimated failure rate. Buyers should treat IMS status — and the specific bearing variant — as the primary screening criterion before any other mechanical evaluation. The MY2008 → MY2009 transition brought the 9A1 DFI engine that eliminates the IMS bearing entirely; the 987.1 and 987.2 are fundamentally different risk propositions despite sharing a visual family resemblance.',
    ],
    variants: [
      {
        name: 'Boxster (base)',
        years: 'MY2005–2008',
        drivetrain: 'RWD',
        power: '240 hp',
        description: '2.7L M96/25 with five-speed manual or Tiptronic S. The base 987.1 retains the five-speed gearbox of the 986 base — the S\'s six-speed is a meaningful upgrade. Visual differentiators from the S: no third front grille, single tailpipe, no red brake calipers.',
      },
      {
        name: 'Boxster S (3.2L)',
        years: 'MY2005–2006',
        drivetrain: 'RWD',
        power: '280 hp',
        description: '3.2L M96/26 with six-speed manual or Tiptronic S. Larger front brakes, sport suspension. This variant predates the MY2007 VarioCam Plus upgrade. Engine code on the VIN sticker distinguishes this car from the 3.4L — do not rely on model year alone since some early MY2007 builds carry the M96/26.',
      },
      {
        name: 'Boxster S (3.4L, VarioCam Plus)',
        years: 'MY2007–2008',
        drivetrain: 'RWD',
        power: '295 hp',
        description: '3.4L M97/21 with VarioCam Plus — variable intake valve lift in addition to variable cam timing. Fifteen horsepower more than the 3.2L with a broader torque curve. The preferred Boxster S spec within the 987.1 generation. Confirm via M97/21 engine code on the VIN sticker.',
      },
      {
        name: 'Boxster RS 60 Spyder',
        years: 'MY2008',
        drivetrain: 'RWD',
        power: '303 hp',
        production: '1,960 worldwide, ~800 US',
        description: 'Limited edition commemorating the RS 60 Spyder\'s 1960 racing victories. GT Silver Metallic only, carmine red leather, 19-inch SportDesign wheels, sport exhaust, numbered certificate, and 303 hp via ECU remap. Factory documentation — numbered certificate and COA confirming GT Silver — is essential for full premium.',
      },
    ],
    engineering: [
      'IMS bearing — two variants present across production: Early 987.1 production (MY2005 and early MY2006) is predominantly equipped with the single-row sealed IMS bearing — the highest-failure-rate IMS variant across the M96/M97 era (~8% per class action data). Later 987.1 production (late MY2006 through MY2008) received Porsche\'s larger non-serviceable bearing (~1% estimated rate) — the same bearing carried by the 997.1. Confirm which variant is installed via the build date or engine serial number. The failure mode is identical regardless: the bearing seizes without audible warning and destroys the engine. IMS retrofit (LN Engineering Billet or equivalent) is recommended for any 987.1 regardless of bearing generation.',
      'VarioCam Plus (MY2007 S onward): The M97/21 in the MY2007+ Boxster S adds variable intake valve lift to the existing VarioCam variable timing. The sliding cam lobe varies both opening duration and valve lift depending on engine speed and load — a system that broadens the power band and improves part-throttle fuel economy. Buyers seeking the best 987.1 S specification should verify the M97/21 engine code confirms MY2007 or later.',
      'Wider chassis versus 986: The 987.1 is 4 mm wider at the front and 34 mm wider at the rear than the 986. The additional rear track width improves high-speed stability and the handling balance at the limit. Combined with revised suspension geometry developed alongside the 997.1, the 987.1 handles more predictably at the limit than its predecessor.',
      'Cayman platform sharing (MY2006): The 987.1 Boxster and 987.1 Cayman (MY2006) are the same car with different body styles — shared platform, suspension, drivetrain, and most interior components. The Cayman\'s fixed roof produces a stiffer structure; the Boxster offers open-air motoring. For buyers deciding between them: the choice is body style and suspension calibration, not architecture.',
      'RS 60 Spyder MY2008 limited edition: The RS 60 Spyder is one of three MY2008 special variants (also Limited Edition Orange base and S at 250 units each). The RS 60 is distinguished by genuine performance differentiation — factory sport exhaust, 303 hp ECU remap, and the SportDesign wheel specification — versus the Orange Limited Edition\'s appearance-only upgrades.',
    ],
    watch_for: [
      {
        title: 'IMS bearing — two variants, highest risk on MY2005 and early MY2006',
        severity: 'concern',
        body: 'The 987.1 spans two IMS specifications. Early production (MY2005 and early MY2006) is predominantly equipped with the single-row sealed bearing — the highest-failure-rate variant in the water-cooled era, approximately 8% per class action discovery data. A MY2005 987.1 carries the highest documented IMS risk of any production-year 987. Later production (late MY2006 through MY2008) received the larger non-serviceable bearing at approximately 1% estimated failure rate. Confirm the specific variant via build date or engine serial number — the risk difference is substantial. The bearing seizes without audible warning, driving metallic debris into the engine. IMS retrofit (LN Engineering Billet or equivalent) is recommended regardless of bearing generation. All-in retrofit cost: approximately $2,500–$4,500.',
        buyer_question: 'What IMS bearing variant is in the engine — single-row OEM, dual-row OEM, or aftermarket retrofit? Has an oil analysis or filter inspection been performed recently? Is there documented IMS inspection or replacement in the service history?',
      },
      {
        title: 'Rear main seal (RMS) leak',
        severity: 'concern',
        body: 'The M96/M97 rear main seal between engine and gearbox is a documented early wear item, identical in failure mode to the 986. Oil on the gearbox housing is the visual indicator. Repair requires engine or gearbox removal; combining with clutch service is the cost-efficient approach. A 987.1 with 70,000+ miles and no documented RMS history is a probable near-term expense.',
        buyer_question: 'Has the rear main seal been replaced? At what mileage and during what other service? Is there any current oil film on the gearbox housing?',
      },
      {
        title: 'Engine code verification (3.2L vs 3.4L S variants)',
        severity: 'caution',
        body: 'MY2005–2006 and MY2007–2008 Boxster S cars are visually nearly identical but mechanically distinct. Listings occasionally misidentify engine year. Verify the engine code on the VIN sticker in the driver\'s door jamb: M96/26 = 3.2L/280 hp (MY2005–2006); M97/21 = 3.4L/295 hp (MY2007–2008). Buyers seeking the VarioCam Plus 3.4L should verify directly.',
        buyer_question: 'What is the engine code on the VIN sticker? If claiming to be a 3.4L, does the sticker confirm M97/21 specification?',
      },
      {
        title: 'Convertible top hydraulics',
        severity: 'caution',
        body: 'The 987.1 power top uses the same hydraulic actuator design as the 986. On 17–20-year-old cars, cylinder seals leak, pump motors wear, and linkage pivots develop play. A slow or hesitant top cycle is the early warning. Full open/close inspection is mandatory before purchase.',
        buyer_question: 'Does the convertible top cycle fully — open and close without pausing — at a single press? Is there hydraulic fluid visible at the actuator areas?',
      },
      {
        title: 'Bore scoring',
        severity: 'caution',
        body: 'Cylinder bore scoring applies to the M96/M97 family across the 986 and 987.1. Risk is highest under conditions of low oil level or degraded oil quality. Elevated oil consumption or blue smoke at startup are primary warning signs. Compression and leak-down test on all six cylinders is mandatory.',
        buyer_question: 'Have compression and leak-down tests been done? What were the cylinder readings? Any history of elevated oil consumption between service intervals?',
      },
    ],
    service: [
      'Pre-purchase inspection priorities: (1) IMS status — oil analysis or filter inspection for metallic particles, plus documentation of any retrofit. (2) Compression and leak-down on all six cylinders. (3) RMS inspection. (4) Full power-top cycle. (5) Engine code verification for S variants. A specialist PPI is strongly recommended — IMS failure cost ($10,000–$15,000+ for engine replacement) far exceeds the PPI fee.',
      'Oil changes at 7,500–10,000 miles, maintaining level above the sight glass midpoint. Coolant system service at ~60,000-mile intervals: water pump, thermostat, and flush. Inspect the water pump weep hole at each service — visible coolant indicates impending pump failure.',
    ],
    value_drivers: [
      {
        name: 'IMS bearing status',
        description: 'Documented IMS retrofit (LN Engineering Billet or equivalent) is the primary 987.1 valuation variable. Cars with confirmed retrofits and clean oil analysis command meaningful premiums over unknown-IMS examples — buyers correctly price the retrofit cost and failure risk into unretrofitted cars.',
      },
      {
        name: 'S variant (3.4L MY2007–2008 vs 3.2L early)',
        description: 'The MY2007–2008 Boxster S with 3.4L M97/21 and VarioCam Plus is the preferred 987.1 S specification — 15 hp more and a broader torque curve versus the MY2005–2006 3.2L S. The engine code distinction is the critical verification.',
      },
      {
        name: 'RS 60 Spyder',
        description: 'The MY2008 RS 60 Spyder (~1,960 units, ~800 US) carries a collector premium requiring full documentation: numbered certificate, matching GT Silver paint confirmed on COA, and carmine red interior intact. Incomplete or undocumented cars should not receive the limited-edition premium.',
      },
      {
        name: 'Manual transmission',
        description: 'Six-speed manual S and five-speed manual base cars command premiums over Tiptronic examples. The 987.1 buyer base strongly prefers the manual gearbox.',
      },
      {
        name: 'Service documentation',
        description: 'Documented service history — oil intervals, IMS status, water pump service — is unusually important on the 987.1 because IMS history has direct market-value implications. Below-60,000-mile examples with complete records command clear premiums.',
      },
    ],
  },

  '987.1-cayman': {
    positioning: 'First Cayman — mid-engine coupe that out-specified the contemporary Boxster S at launch',
    intro: 'The 987.1 Cayman arrived in MY2006 as the Cayman S, carrying the 3.4L M97/21 flat-six that the contemporary Boxster S would not receive until the 987.2 update. That displacement advantage defined the 987.1 Cayman\'s character: more power, better torsional rigidity from its fixed roof, and a driving dynamic that enthusiasts ranked above the Boxster of the same era. The base 2.7L Cayman followed in MY2007, completing the lineup.',
    production_years: '2006–2008',
    body_styles: 'Coupe',
    engine: '3.4L M97/21 flat-six (Cayman S) / 2.7L M97/20 flat-six (base Cayman)',
    cooling: 'Water-cooled',
    units_produced: '~23,000 worldwide (estimated)',
    notes: [
      'Cayman S launched MY2006 with 3.4L M97/21 — one displacement class above the 987.1 Boxster S (3.2L at launch)',
      'Base 2.7L Cayman followed MY2007',
      'M96/M97 IMS bearing concern applies equally to all 987.1 Cayman engines',
      'Design Edition 1 limited to 777 worldwide (240 US) — MY2008 appearance package on Cayman S base',
      'Cayman S Sport limited to ~700 worldwide (~100 US) — MY2008, 303 hp via ECU remap, PASM standard',
    ],
    variants: [
      {
        name: 'Cayman S',
        years: '2006–2008',
        power: '295 hp',
        description: '3.4L M97/21 flat-six, 251 lb-ft, six-speed manual or five-speed Tiptronic. Launched ahead of the base Cayman and defined the generation\'s performance benchmark. Fixed roof gives a torsional rigidity advantage over the contemporary Boxster.',
      },
      {
        name: 'Cayman',
        years: '2007–2008',
        power: '245 hp',
        description: '2.7L M97/20 flat-six, 201 lb-ft, five-speed manual or five-speed Tiptronic (six-speed optional). Base model that rounded out the lineup a model year after the S launch. Same M97 IMS exposure as the Boxster.',
      },
      {
        name: 'Cayman S Sport',
        years: '2008',
        power: '303 hp',
        description: 'Factory ECU remap adds 8 hp over the standard Cayman S. PASM active suspension included as standard. ~700 worldwide, approximately 100 delivered to the US. Commands a premium requiring confirmed build documentation.',
      },
      {
        name: 'Design Edition 1',
        years: '2008',
        power: '295 hp',
        description: 'Appearance edition based on the Cayman S. 777 worldwide, 240 US. Distinguishable by its two-tone Sport Design exterior and specific interior treatment. Same mechanical specification as the standard Cayman S.',
      },
    ],
    engineering: [
      'Steel unibody coupe derived from the 987 Boxster platform, gaining significant torsional rigidity from the fixed roof structure',
      'Cayman S receives the 3.4L M97/21 flat-six at launch (MY2006) — one displacement step ahead of the 987.1 Boxster S, which retained the 3.2L M96 until the 987.2 update',
      'M97/21 features VarioCam Plus variable valve timing on both intake and exhaust camshafts, improving mid-range torque delivery',
      'Mid-engine layout with engine mounted ahead of the rear axle produces near-ideal weight distribution and sharper turn-in than the rear-engined 911',
      'PASM (Porsche Active Suspension Management) optional across the lineup; limited-slip differential available as factory option on the Cayman S',
    ],
    watch_for: [
      {
        title: 'IMS bearing failure (M96/M97) — bearing variant depends on build date',
        severity: 'concern',
        body: 'The intermediate shaft bearing in the M96 and M97 engine family is a documented failure mode — a failed IMS bearing typically destroys the engine. The 987.1 Cayman launched for MY2006 and ran through MY2008, a production window spanning Porsche\'s transition from the single-row bearing (~8% failure rate, class action data) to the larger non-serviceable bearing (~1% estimated rate). Early MY2006 Caymans may carry either variant; MY2007–2008 Caymans are more likely to have the larger bearing. Confirm the specific bearing variant with an independent specialist before purchase, as risk differs substantially between them.',
        buyer_question: 'Has the IMS bearing been replaced or upgraded, and do you have documentation? What is the current mileage and service interval history?',
      },
      {
        title: 'Bore scoring (Lokasil cylinder linings)',
        severity: 'concern',
        body: 'M96/M97 engines use Lokasil composite cylinder linings that are vulnerable to scoring if oil circulation is disrupted. Extended oil intervals, low oil levels, or overheating can trigger premature bore wear. A compression and leak-down test is the primary pre-purchase diagnostic. Oil analysis can detect metal particulate before symptoms appear.',
        buyer_question: 'When was the last oil analysis performed, and were any anomalies detected? Has the engine had compression testing recently?',
      },
      {
        title: 'Rear main seal (RMS) weeping',
        severity: 'caution',
        body: 'The M96/M97 rear main seal develops weeping leaks with age, particularly on high-mileage or infrequently driven cars. The repair requires engine removal, making it a significant labor event. Check the underside for oil film at the transmission bell housing junction.',
        buyer_question: 'Has the rear main seal been replaced? Is there any oil residue at the bell housing?',
      },
      {
        title: 'Air-oil separator (AOS) diaphragm failure',
        severity: 'caution',
        body: 'The crankcase ventilation AOS diaphragm hardens and cracks with age, causing rough idle, blue smoke, and excessive oil consumption. A failed AOS is a modest repair on its own but is often a sign of deferred maintenance across the car.',
        buyer_question: 'Has the AOS been inspected or replaced? Is there any blue-tinged smoke at idle or under load?',
      },
      {
        title: 'Water pump impeller failure',
        severity: 'concern',
        body: 'The M97 uses a plastic impeller water pump that can delaminate and shed its impeller blades without warning, causing rapid overheating. The pump is a wear item typically replaced at 60,000–80,000-mile intervals. An overheating event can trigger IMS failure or bore scoring as a cascade.',
        buyer_question: 'Has the water pump been replaced, and when? Is there a record of coolant system service?',
      },
    ],
    service: [
      'The 987.1 Cayman requires ownership with higher mechanical awareness than its smooth driving manners suggest. IMS retrofit, water pump replacement, and AOS service are the three highest-priority preventative items. If none have been addressed on a high-mileage car, budget for all three before purchase rather than after.',
      'Oil change intervals of 5,000–7,500 miles (not the 15,000-mile Porsche factory interval) are strongly recommended by the independent specialist community. Frequent oil analysis is the most reliable early-warning system for bore scoring and IMS wear.',
    ],
    value_drivers: [
      {
        name: 'Cayman S over base',
        description: 'The 3.4L M97/21 Cayman S commands a consistent premium over the 2.7L base. The displacement advantage, higher output, and stronger resale demand all favor the S designation.',
      },
      {
        name: 'Manual gearbox',
        description: 'Six-speed manual examples command premiums over Tiptronic-equipped cars across the 987.1 Cayman lineup. The collector market strongly prefers the manual.',
      },
      {
        name: 'Limited editions with documentation',
        description: 'The Cayman S Sport and Design Edition 1 command premiums over the standard Cayman S only when accompanied by confirmed build documentation. A factory COA and numbers-matching paint/option codes are required to justify the premium on either car.',
      },
      {
        name: 'IMS and preventative service history',
        description: 'Documented IMS retrofit, water pump replacement, and consistent short-interval oil changes are directly market-valued on the 987.1. A car with this paper trail commands measurably more than an equivalent example without it.',
      },
      {
        name: 'Low mileage with records',
        description: 'Sub-40,000-mile examples with complete service documentation trade at clear premiums. Very low mileage without records is less compelling than moderate mileage with a full paper trail, given the IMS concern.',
      },
    ],
  },

  '987.2-cayman': {
    positioning: 'IMS eliminated — 9A1 DFI engine arrives in the Cayman for 2009',
    intro: 'The 987.2 Cayman is the first generation free of the IMS bearing concern that defined the 987.1 ownership calculus. Porsche\'s 9A1 direct fuel injection engine eliminates the intermediate shaft entirely, and the result is a generation that enthusiasts can buy on its driving merits rather than its mechanical risk profile. PDK became available for the first time, and the lineup gained genuine range with the Cayman R — a factory-lightweight, track-capable variant that remains one of the most desirable mid-engine Porsches of the water-cooled era.',
    production_years: '2009–2012',
    body_styles: 'Coupe',
    engine: '2.9L 9A1 flat-six (base) / 3.4L 9A1 flat-six (S, R, Black Edition)',
    cooling: 'Water-cooled',
    notes: [
      '9A1 DFI engine eliminates the intermediate shaft (IMS) — no IMS bearing failure risk',
      'PDK 7-speed dual-clutch available for the first time in the Cayman',
      'Cayman R (MY2012): 330 hp, mechanical LSD, aluminum doors and decklid, ~55 kg lighter than standard S — manual only',
      'Cayman S Black Edition (MY2012): ~500 worldwide (~180 US), appearance package with R engine output — manual or PDK',
    ],
    variants: [
      {
        name: 'Cayman',
        years: '2009–2012',
        power: '265 hp',
        description: '2.9L 9A1 flat-six, 221 lb-ft, six-speed manual or 7-speed PDK. First IMS-free base Cayman. DFI improves fuel economy and throttle response over the M96-based predecessor.',
      },
      {
        name: 'Cayman S',
        years: '2009–2012',
        power: '320 hp',
        description: '3.4L 9A1 flat-six, 273 lb-ft, six-speed manual or 7-speed PDK. Significant power increase over the 987.1 S (295 hp → 320 hp). DFI combined with VarioCam Plus delivers a broader torque band.',
      },
      {
        name: 'Cayman R',
        years: '2012',
        power: '330 hp',
        production: '1,621 worldwide',
        description: '3.4L 9A1 flat-six, mechanical LSD, aluminum doors and decklid, 20mm lower ride height, approximately 55 kg lighter than the standard Cayman S. Manual-only — no PDK offered. Air conditioning and audio system deleted from base specification. Track-focused factory lightweight that defines the top of the 987.2 collector hierarchy.',
      },
      {
        name: 'Cayman S Black Edition',
        years: '2012',
        power: '330 hp',
        description: 'Final-run appearance edition with Cayman R engine output (330 hp via ECU remap). ~500 worldwide (~180 US). Jet Black exterior with matching black interior and accent package. Manual or PDK available, unlike the R.',
      },
    ],
    engineering: [
      '9A1 (MA1) direct fuel injection engine eliminates the intermediate shaft, removing the primary structural reliability concern of the M96/M97 family',
      '7-speed PDK dual-clutch gearbox introduced as an option — first PDK availability in the Cayman lineup',
      'Cayman R achieves weight reduction through aluminum outer doors and decklid, deleted air conditioning and audio, and revised front fascia with fog light delete',
      'Mechanical limited-slip differential standard on the Cayman R, optional on the Cayman S — improves traction balance and lap-time consistency on track',
      'PASM adaptive dampers optional across the lineup, standard on the Black Edition',
    ],
    watch_for: [
      {
        title: 'DFI intake valve carbon buildup',
        severity: 'caution',
        body: 'Direct fuel injection eliminates port injection, so the intake valves are never washed by fuel. Carbon deposits accumulate on valve stems and seats over time, eventually restricting airflow and causing rough idle or misfires. Walnut blasting (media cleaning) at approximately 60,000–80,000-mile intervals addresses the buildup. Ask for documentation of this service on high-mileage examples.',
        buyer_question: 'Has walnut blasting or intake valve cleaning been performed? At what mileage, and do you have records?',
      },
      {
        title: 'Water pump failure',
        severity: 'concern',
        body: 'The 9A1 retains a belt-driven water pump with a plastic impeller susceptible to delamination. Failure causes rapid overheating and can cascade to head gasket damage. Replacement is recommended at 60,000–80,000-mile intervals or on condition.',
        buyer_question: 'Has the water pump been replaced? When, and is there documentation?',
      },
      {
        title: 'PDK service intervals',
        severity: 'caution',
        body: 'PDK-equipped cars require fluid changes at approximately 40,000-mile intervals — longer than many owners realize. Neglected PDK service causes shift harshness, hesitation, and eventual actuator wear. Confirm the PDK service history on high-mileage PDK cars.',
        buyer_question: 'Has the PDK fluid been changed per the factory service schedule? What is the current mileage?',
      },
      {
        title: 'Cayman R documentation and authenticity',
        severity: 'caution',
        body: 'The Cayman R commands a significant premium, which has produced examples with R-spec components grafted onto standard Cayman S bodies. A genuine R requires VIN-confirmed aluminum doors and decklid, factory mechanical LSD, and factory delete of air conditioning and audio. COA and Porsche PCNA registry confirmation are the minimum documentation standard.',
        buyer_question: 'Is this a genuine Cayman R with COA? Have the aluminum doors and decklid been VIN-confirmed as factory components?',
      },
    ],
    service: [
      'The 987.2 Cayman is mechanically cleaner than its predecessor but still requires informed ownership. Walnut blasting for DFI carbon, water pump replacement, and PDK fluid service (where applicable) are the headline items. A car with documented service across these three areas is substantially lower risk than one without.',
      'The Cayman R demands particularly careful pre-purchase inspection: verify the mechanical LSD function, confirm the aluminum body panels are original factory components, and check for deferred service resulting from track use. R examples with high track miles but no supporting service history should be avoided.',
    ],
    value_drivers: [
      {
        name: 'Cayman R',
        description: 'The R is the definitive collector variant of the 987.2 generation. Manual-only, factory lightweight, mechanical LSD, and strict production limits establish it at the top of the market. Fully documented examples — COA, service records, factory specification — command significant premiums over the standard Cayman S.',
      },
      {
        name: 'Manual gearbox',
        description: 'Six-speed manual examples hold premiums over PDK-equipped cars in the broader 987.2 market, consistent with buyer preference across the 987 era. The Cayman R is manual-only by design.',
      },
      {
        name: 'Cayman S over base',
        description: 'The 3.4L 9A1 S carries a consistent premium over the 2.9L base. Power, drivetrain spec, and stronger buyer demand all favor the S in the used market.',
      },
      {
        name: 'Service documentation',
        description: 'The 9A1\'s cleaner mechanical profile reduces but does not eliminate the value of service documentation. Documented walnut blast service and water pump history are direct market differentiators on higher-mileage examples.',
      },
    ],
  },

  '981-cayman': {
    positioning: 'Last naturally aspirated flat-six base Cayman — and the platform that gave us the GT4',
    intro: 'The 981 Cayman is the last generation to offer a naturally aspirated flat-six in the base and S positions, and it produced the Cayman GT4 — a model that fundamentally changed how the collector market values mid-engine Porsches. Built on an all-new aluminum-intensive platform shared with the 981 Boxster, it is lighter, stiffer, and more dynamically capable than its predecessor. The GT4\'s use of the 991.1 Carrera S engine, GT3 brakes, GT3 suspension hardware, and fixed rear wing made it the first Cayman to genuinely challenge the 911 GT3 as a collector object.',
    production_years: '2013–2016',
    body_styles: 'Coupe',
    engine: '2.7L flat-six (base) / 3.4L flat-six (S, GTS) / 3.8L flat-six (GT4)',
    cooling: 'Water-cooled',
    units_produced: 'GT4: 2,500–6,000 worldwide (disputed; Porsche has not published confirmed figures)',
    notes: [
      'All-new aluminum-steel hybrid platform — stiffer and lighter than the 987 Cayman steel monocoque',
      'Last generation with naturally aspirated flat-six in base and S positions',
      'Cayman GTS introduced MY2015: 340 hp, standard PASM, Sport Chrono, bi-xenon headlights',
      'Cayman GT4 (MY2016): 3.8L from 991.1 Carrera S, 991 GT3 brakes and suspension, fixed rear wing, manual-only',
      'GT4 production volume disputed in automotive press — Porsche has not confirmed final worldwide total',
    ],
    variants: [
      {
        name: 'Cayman',
        years: '2013–2016',
        power: '275 hp',
        description: '2.7L naturally aspirated flat-six, 213 lb-ft, six-speed manual or 7-speed PDK. Entry point into the final NA flat-six Cayman lineup. The new platform delivers notably sharper responses than the 987 base despite similar power figures.',
      },
      {
        name: 'Cayman S',
        years: '2013–2016',
        power: '325 hp',
        description: '3.4L naturally aspirated flat-six, 273 lb-ft, six-speed manual or 7-speed PDK. Last Cayman S with a naturally aspirated engine. More communicative steering than the turbocharged 718 that followed.',
      },
      {
        name: 'Cayman GTS',
        years: '2015–2016',
        power: '340 hp',
        description: '3.4L naturally aspirated flat-six, Sport Chrono Package standard, PASM standard, bi-xenon headlights standard, SportDesign front fascia. Mid-tier between the S and the GT4 in power, without the GT4\'s full GT hardware suite.',
      },
      {
        name: 'Cayman GT4',
        years: '2016',
        power: '385 hp',
        description: '3.8L flat-six sourced from the 991.1 Carrera S, 991 GT3 brakes and suspension hardware, mechanical LSD, fixed rear wing, front splitter, six-speed manual only — no PDK offered. Production volume disputed (press estimates range 2,500–6,000 worldwide). The most significant collector Cayman of the water-cooled era.',
      },
    ],
    engineering: [
      'All-new aluminum-steel multi-material platform reduces body mass and improves torsional rigidity over the 987 steel monocoque',
      'Electric power steering replaces hydraulic — a point of contention among purists, though the 981 is widely considered dynamically superior to the 987',
      '3.8L engine in the GT4 is the same unit used in the 991.1 Carrera S, integrated with a short-ratio six-speed gearbox developed specifically for the GT4 application',
      'GT4 receives 991 GT3 front and rear suspension, 991 GT3 six-piston front brakes, and a mechanical Torsen-type limited-slip differential as standard equipment',
      'PASM adaptive suspension optional on S, standard on GTS and GT4; torque vectoring by brake standard on GT4',
    ],
    watch_for: [
      {
        title: 'Water pump failure (9A1 carry-forward)',
        severity: 'concern',
        body: 'The 981 Cayman uses a derivation of the 9A1 engine family with the same plastic-impeller water pump vulnerability as the 987.2. Pump failure causes rapid overheating and can cascade to head gasket damage. Replacement at 60,000–80,000 miles is the standard preventative recommendation.',
        buyer_question: 'Has the water pump been replaced? When, and at what mileage?',
      },
      {
        title: 'DFI intake valve carbon buildup',
        severity: 'caution',
        body: 'Like the 987.2, the 981 uses direct fuel injection without port injection, making intake valve carbon buildup an expected maintenance item. Walnut blasting at 60,000–80,000-mile intervals is the standard service. High-mileage examples without this service will show diminished throttle response and idle quality.',
        buyer_question: 'Has walnut blasting or intake valve cleaning been documented? At what mileage?',
      },
      {
        title: 'GT4 clutch wear and gearbox health',
        severity: 'caution',
        body: 'The GT4\'s short-ratio six-speed gearbox places higher demands on the clutch, particularly on cars with track use. Track-driven GT4s may show clutch wear well before highway-driven examples. Confirm the clutch specification (original or replacement), mileage on current clutch, and whether the car has been used on track.',
        buyer_question: 'Has the GT4 been driven on track? What is the current clutch status and mileage?',
      },
      {
        title: 'GT4 documentation and provenance',
        severity: 'caution',
        body: 'The GT4\'s collector status creates incentive to misrepresent standard Cayman S examples. Confirm the GT4 designation through the factory build sheet (available through Porsche PCNA or independent registries), matching VIN, and factory wing and splitter in original condition.',
        buyer_question: 'Is the factory build sheet available? Are the rear wing and front splitter original factory components?',
      },
    ],
    service: [
      'The 981 Cayman is the most mechanically mature of the water-cooled Cayman generations. Water pump replacement, DFI carbon service, and regular oil changes at 7,500-mile intervals cover the headline maintenance needs. The platform is stable and the 9A1-derived engines are well understood by the specialist community.',
      'GT4 ownership requires additional diligence: verify track use history, assess clutch condition, and confirm factory equipment completeness. A GT4 that has been well maintained and lightly used is an exceptional driver and collector car; one with deferred service and heavy track exposure requires significant budgeting before purchase.',
    ],
    value_drivers: [
      {
        name: 'Cayman GT4',
        description: 'The GT4 leads all 981 Cayman values by a substantial margin. Factory GT hardware, the 3.8L NA engine, manual-only gearbox, and limited production create collector-grade demand. Low-mileage, unmodified GT4s with factory documentation are among the most sought-after mid-engine Porsches of the water-cooled era.',
      },
      {
        name: 'Cayman GTS over S',
        description: 'The GTS carries a premium over the standard S, driven by higher output, standard Sport Chrono and PASM, and the SportDesign body treatment. The premium is modest relative to the GT4 but consistent in the market.',
      },
      {
        name: 'Manual gearbox',
        description: 'Six-speed manual examples command premiums over PDK-equipped cars across the 981 Cayman lineup. The GT4 is manual-only by design, reinforcing the market preference.',
      },
      {
        name: 'Last naturally aspirated flat-six',
        description: 'The 981 Cayman S and GTS are the last Caymans with a NA flat-six in non-GT positions. As the turbocharged 718 era recedes, the 981\'s naturally aspirated character is increasingly recognized as a period-defining attribute.',
      },
      {
        name: 'Factory options and unmodified condition',
        description: 'Full PASM, Sport Chrono, sport exhaust, and desirable color combinations contribute measurable premiums. Modified GT4s — particularly those with aftermarket exhaust, suspension, or wheels — typically trade below equivalent unmodified examples despite the modifications\' cost.',
      },
    ],
  },

  '982-cayman': {
    positioning: 'Flat-four turbo era — and the return of the 9,000 rpm flat-six in the GT4 RS',
    intro: 'The 982 generation, marketed as the 718 Cayman, is the most divisive production Cayman in the nameplate\'s history. The 2.0L and 2.5L turbocharged flat-four engines that replaced the beloved NA flat-six drew significant criticism from the enthusiast community at launch. Porsche\'s answer arrived in MY2020: the GT4 and GTS 4.0 restored naturally aspirated flat-six power, and the GT4 RS of MY2022 took it further — a 4.0L, 9,000 rpm, 493 hp flat-six derived directly from the 992 GT3, with individual throttle bodies, PDK only, and a fixed rear wing that confirmed its GT3-adjacent standing.',
    production_years: '2017–2025 (ICE production ended October 2025)',
    body_styles: 'Coupe',
    engine: '2.0L flat-four turbo (base) / 2.5L flat-four turbo (S, GTS MY2018–2019) / 4.0L flat-six NA (GTS 4.0, GT4, GT4 RS)',
    cooling: 'Water-cooled',
    notes: [
      'Rebranded as "718 Cayman" for the 982 generation at launch (MY2017)',
      'Base 2.0L and S 2.5L flat-four turbos replaced the naturally aspirated flat-six — received poorly by enthusiasts',
      'GTS flat-four (MY2018–2019): 2.5L flat-four, 365 hp — short production before 4.0L transition',
      'GTS 4.0 (MY2020+): 4.0L NA flat-six restored, 394 hp — marks the return of the flat-six to non-GT positions',
      'GT4 (MY2020–2023): 4.0L NA flat-six, 414 hp, 8,000 rpm, six-speed manual or PDK',
      'GT4 RS (MY2022–2025): 4.0L NA flat-six from 992 GT3, 493 hp, 9,000 rpm, PDK only, swan-neck rear wing, fixed splitter',
      'Weissach Package (GT4 RS): magnesium wheels, titanium Akrapovic exhaust, exposed CFRP body panels, factory roll cage',
      'ICE production for all 718 Cayman variants ended October 2025',
    ],
    variants: [
      {
        name: '718 Cayman',
        years: '2017–2025',
        power: '300 hp',
        description: '2.0L turbocharged flat-four, 280 lb-ft, six-speed manual or 7-speed PDK. Entry-level 718 generation. The turbo flat-four delivers strong low-end torque but lacks the high-rpm character of the naturally aspirated engines it replaced.',
      },
      {
        name: '718 Cayman S',
        years: '2017–2025',
        power: '350 hp',
        description: '2.5L turbocharged flat-four with variable turbine geometry (VTG), 309 lb-ft, six-speed manual or 7-speed PDK. VTG turbo improves response versus the base flat-four, but the NA flat-six character that defined earlier S models is absent.',
      },
      {
        name: '718 Cayman GTS (flat-four)',
        years: '2018–2019',
        power: '365 hp',
        description: '2.5L turbocharged flat-four, 317 lb-ft. Short-production run before the lineup transitioned to the 4.0L flat-six GTS. The flat-four GTS occupies a transitional position in the 982 collector hierarchy.',
      },
      {
        name: '718 Cayman GTS 4.0',
        years: '2020–2025',
        power: '394 hp',
        description: '4.0L naturally aspirated flat-six, 309 lb-ft, six-speed manual or 7-speed PDK. Restored flat-six engine in a non-GT position. The accessible entry point into the NA flat-six 718 tier.',
      },
      {
        name: '718 Cayman GT4',
        years: '2020–2023',
        power: '414 hp',
        description: '4.0L naturally aspirated flat-six, 309 lb-ft, 8,000 rpm, six-speed manual or PDK. GT-spec braking, suspension, and aerodynamics. The successor to the 981 GT4 and a legitimate track car in factory specification.',
      },
      {
        name: '718 Cayman GT4 RS',
        years: '2022–2025',
        power: '493 hp',
        description: '4.0L naturally aspirated flat-six derived from the 992 GT3, individual throttle bodies, 9,000 rpm redline, PDK only — no manual offered. Fixed swan-neck rear wing, front splitter, NACA ducts, lightweight interior. Weissach Package adds magnesium wheels, titanium exhaust, exposed CFRP bodywork. ICE production ended October 2025, making this the final expression of the NA flat-six 718 Cayman.',
      },
    ],
    engineering: [
      'Flat-four turbocharged engines (2.0L / 2.5L) use a horizontally opposed layout retaining the fundamental mid-engine balance while delivering significantly more low-end torque than the NA flat-sixes they replaced',
      'VTG (variable turbine geometry) turbocharger on the 2.5L S dramatically reduces turbo lag compared to conventional wastegate turbos, though it does not replicate the NA flat-six\'s linear power delivery',
      '4.0L GT4 RS engine sourced from the 992 GT3 with individual throttle bodies and a firing order that enables the 9,000 rpm redline — the highest-revving production Cayman engine ever offered',
      'GT4 RS uses PDK exclusively — Porsche engineering judged the high-revving engine\'s power delivery best managed by the dual-clutch gearbox\'s faster shifts at extreme rpm',
      'Weissach Package for the GT4 RS reduces curb weight by approximately 35 lb through magnesium wheels, titanium exhaust, and CFRP roof, hood, and door panel inserts',
    ],
    watch_for: [
      {
        title: 'Flat-four turbo heat soak and intercooler efficiency',
        severity: 'caution',
        body: 'The 2.0L and 2.5L flat-four turbos generate significant heat in the compact mid-engine bay. Extended track sessions or aggressive driving in high ambient temperatures can lead to heat soak and power falloff. Road use is generally unaffected, but track-day buyers should confirm the car\'s cooling history and inspect intercooler condition.',
        buyer_question: 'Has this car been used on track? Has the intercooler or cooling system been inspected or serviced recently?',
      },
      {
        title: 'GT4 RS coolant system (early production TSB)',
        severity: 'concern',
        body: 'Early MY2022 GT4 RS examples received a TSB related to coolant reservoir integrity. Confirm that the TSB has been addressed on any early-production GT4 RS. The 9,000-rpm engine generates significant thermal load; verify oil cooling system condition on track-driven examples.',
        buyer_question: 'Has the coolant TSB for early GT4 RS production been addressed? Has the oil cooling system been inspected?',
      },
      {
        title: 'GT4 RS PDK-only configuration',
        severity: 'caution',
        body: 'The GT4 RS is PDK-only by design — there is no manual option. PDK service intervals (fluid change approximately every 40,000 miles) should be confirmed on higher-mileage examples. The PDK in the GT4 RS is calibrated specifically for the high-revving engine\'s demands.',
        buyer_question: 'What is the PDK service history? Has the dual-clutch fluid been changed per the factory schedule?',
      },
      {
        title: 'GT4 RS Weissach Package authenticity',
        severity: 'caution',
        body: 'The Weissach Package commands a significant premium on the GT4 RS. Confirm factory Weissach specification via the build sheet (COA or PCNA factory options list). Key identifiers: magnesium wheels, titanium Akrapovic exhaust, exposed CFRP roof and hood. Aftermarket approximations of these components do not qualify for the Weissach premium.',
        buyer_question: 'Is the Weissach Package confirmed on the factory build sheet? Are the magnesium wheels and titanium exhaust original factory components?',
      },
    ],
    service: [
      'The 982 flat-four turbos (base and S) are mechanically robust in road use but respond poorly to deferred oil service. The 4.0L GT4 and GTS 4.0 engines share the fundamental architecture of the 991-era flat-six and are well understood by Porsche specialists. All 982 engines benefit from 7,500-mile oil change intervals.',
      'GT4 RS ownership carries the highest due-diligence threshold of any 982 variant: TSB history, PDK service records, Weissach Package documentation, and track-use history should all be confirmed before purchase. These are collector-grade cars with values that depend heavily on specification and documentation completeness.',
    ],
    value_drivers: [
      {
        name: 'GT4 RS over GT4',
        description: 'The GT4 RS commands a significant premium over the GT4, driven by the 9,000 rpm 992 GT3-derived engine, higher output (493 vs. 414 hp), PDK-only configuration, and lower production totals. Weissach-equipped examples command additional premium.',
      },
      {
        name: '4.0L flat-six models over flat-four',
        description: 'All GT4, GTS 4.0, and GT4 RS examples carry premiums over their flat-four counterparts (base, S, GTS flat-four). The restoration of naturally aspirated flat-six character — widely considered the more desirable engine configuration — drives consistent buyer preference for the 4.0L variants.',
      },
      {
        name: 'Weissach Package on GT4 RS',
        description: 'Weissach-equipped GT4 RS examples command premiums reflecting the cost and performance value of magnesium wheels, titanium exhaust, and CFRP components. Full factory documentation is required for the Weissach premium to be market-supported.',
      },
      {
        name: 'Final ICE production',
        description: 'ICE production for all 718 Cayman variants ended October 2025. The GT4 RS and GTS 4.0 are the last naturally aspirated flat-six Caymans ever produced, establishing a permanent ceiling on production numbers that is expected to support long-term values.',
      },
      {
        name: 'Flat-four GTS (MY2018–2019) as transitional collector',
        description: 'The short-production flat-four GTS occupies a niche position: higher output and factory GTS designation in a brief production window before the 4.0L arrived. These cars are not currently premiumed above the GTS 4.0 but represent a documented limited-run variant worth tracking.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // cayenne-i (955 + 957, 2003–2010)
  // ──────────────────────────────────────────────────────────────────────────
  'cayenne-i': {
    positioning: 'Porsche\'s first SUV — PL71 platform with sports-car DNA',
    intro: 'The 955 launched in 2003 as Porsche\'s controversial first SUV, co-developed with Volkswagen on the PL71 platform shared with the Touareg and Audi Q7. The 957 facelift (MY2008) introduced the 4.8L V8 family and the GTS model. Despite initial purist skepticism, the Cayenne became the brand\'s best-selling nameplate and funded continued 911 development.',
    production_years: '2003–2010',
    body_styles: 'SUV (5-door)',
    engine: '3.2L V6 (955 Base) / 3.6L V6 (957 Base) / 4.5L V8 (955 S/Turbo) / 4.8L V8 (957 S/GTS/Turbo) / 3.0L V6 TDI (957 Diesel, EU only)',
    cooling: 'Water-cooled',
    units_produced: '~152,000 combined 955+957 [VERIFY]',
    notes: [
      'The 955 (MY2003–2007) was built at Magna Steyr in Graz, Austria — the same facility later used for the 718 Spyder. It shared its PL71 platform with the VW Touareg and first-generation Audi Q7. The base model used a 3.2L V6 producing 250 PS; the S used a 4.5L V8 producing 340 PS. The Turbo with its 450 PS twin-turbocharged 4.5L V8 and VTG turbos was the performance flagship. A Turbo S was offered for MY2006 only with 521 PS, making it one of the shortest-production Cayenne special variants.',
      'The 957 (MY2008–2010) replaced the 4.5L V8 with an all-new 4.8L V8 family, adding 45–50 PS across the range and introducing the GTS model. The GTS brought the Cayenne closer to sports car territory with a 20mm lower suspension, PASM standard, sport exhaust, and 405 PS. The Diesel (EU only, MY2009–2010) was the first diesel Cayenne and quickly became the highest-volume variant in European markets. The Transsyberia, introduced for MY2009, was a factory-approved special edition based on the GTS with raised suspension and underbody protection, inspired by the off-road endurance rally of the same name.',
    ],
    variants: [
      { name: 'Base (955)', years: 'MY2003–2007', drivetrain: 'AWD', power: '250 PS / 247 hp', description: '3.2L V6. Entry-level Cayenne; V6 discontinued at the 957 transition. Transfer case wear at high mileage is the primary concern.' },
      { name: 'Base (957)', years: 'MY2008–2010', drivetrain: 'AWD', power: '290 PS / 286 hp', description: '3.6L V6. Enlarged from 3.2L at 957. Only 955 base trim remaining in the lineup alongside larger GTS/Turbo siblings.' },
      { name: 'S (955)', years: 'MY2003–2007', drivetrain: 'AWD', power: '340 PS / 335 hp', description: '4.5L V8 NA. Volume model. 4.5L V8 rod bearings are a documented concern above 100k miles.' },
      { name: 'S (957)', years: 'MY2008–2010', drivetrain: 'AWD', power: '385 PS / 380 hp', description: '4.8L V8 NA. New engine family replacing 4.5L; crankcase vent and cam housing seal are known service items.' },
      { name: 'GTS', years: 'MY2008–2010', drivetrain: 'AWD', power: '405 PS / 399 hp', description: '4.8L V8 sport-tuned. 957 era only. 20mm lower suspension; PASM standard; sport exhaust. Most driver-focused non-Turbo 957.' },
      { name: 'Turbo (955)', years: 'MY2003–2007', drivetrain: 'AWD', power: '450 PS / 444 hp', description: '4.5L twin-turbo V8. VTG turbos provide strong response. Air suspension compressor failure common after 8–10 years.' },
      { name: 'Turbo (957)', years: 'MY2008–2010', drivetrain: 'AWD', power: '500 PS / 493 hp', description: '4.8L twin-turbo V8. 50 PS gain over 955 Turbo. Same air suspension concern applies.' },
      { name: 'Turbo S (955)', years: 'MY2006 only', drivetrain: 'AWD', power: '521 PS / 514 hp', production: '~3,900 [VERIFY]', description: 'Single model year. First Cayenne Turbo S. Limited production; air suspension compressor failure documented.' },
      { name: 'Turbo S (957)', years: 'MY2008–2009 [VERIFY]', drivetrain: 'AWD', power: '550 PS / 542 hp', description: 'Uprated 4.8L TT. Production years and volume unclear [VERIFY against Porsche AG records].' },
      { name: 'Diesel', years: 'MY2009–2010 (957 era only)', drivetrain: 'AWD', power: '240 PS / 237 hp', description: '3.0L V6 TDI. EU market only; not sold in North America. First Cayenne diesel; debuted Paris 2009. High-volume EU auction car.' },
      { name: 'Transsyberia', years: 'MY2009–2010 [VERIFY]', drivetrain: 'AWD', power: '405 PS / 399 hp', production: '~500 [VERIFY]', description: 'Factory-approved special edition. GTS engine, raised suspension, underbody protection. Rally-inspired livery option. Limited collector attention to date.' },
    ],
    engineering: [
      'PL71 platform shared with VW Touareg and first-gen Audi Q7; Porsche retained PTM all-wheel drive system with rear-biased torque split',
      'Tiptronic S 6-speed automatic only throughout the generation — no manual option in any Cayenne, ever',
      'Air suspension (PDCC optional) requires bladder and compressor replacement every 80–100k miles — budget-line item for any used purchase',
      '4.5L V8 (955) rod bearing concern at very high mileage; 4.8L V8 (957) improved bearing journals but not fully immune',
    ],
    watch_for: [
      { title: 'Air suspension failure', severity: 'concern', body: 'Air spring bladder cracks and compressor wear are the single most common expensive repair on all 955/957 Cayennes. Symptoms: car sits low overnight or after parking; compressor runs audibly at startup.', buyer_question: 'When was the air suspension last serviced? Has the compressor been replaced?' },
      { title: '4.5L V8 rod bearings', severity: 'caution', body: 'The 955 S and Turbo 4.5L V8 is documented with rod bearing wear at high mileage (typically 120k+ miles). Pre-purchase inspection should include oil analysis for bearing material.', buyer_question: 'Do you have oil analysis records? Any lifter tick or knock at idle?' },
      { title: 'Transfer case seal', severity: 'caution', body: 'Output shaft seals on the transfer case are a routine failure point. Oil leak from the transfer case area is common on examples with deferred maintenance.', buyer_question: 'Any evidence of transfer case oil leak? Has the PTM fluid been changed on schedule?' },
    ],
    service: [
      'Air suspension inspection every 40,000 miles; bladder and compressor replacement budget at 80–100k miles',
      'Transfer case fluid service every 30,000 miles',
      'Tiptronic fluid and mechatronics seal inspection at 60,000 miles',
      '4.5L V8 (955): oil analysis recommended at purchase to assess rod bearing condition',
      'Plastic coolant expansion tank replacement at first signs of seepage; crack failure can cause sudden coolant loss',
    ],
  },

  // macan-i (Macan 95B, 2014–2023)
  // Source: docs/overnight/family-macan-taycan-halo.md §B.1 + §C.1
  // ──────────────────────────────────────────────────────────────────────────
  'macan-i': {
    positioning: 'Porsche\'s best-selling model on the VW Group MLB Evo platform',
    intro: 'The 95B Macan launched in 2014 as Porsche\'s compact luxury SUV, becoming the brand\'s best-selling model throughout its run. Built on the MLB Evo platform shared with the Audi Q5, it earned genuine driver praise — the only car in its segment regularly cited for Porsche-like driving feel.',
    production_years: '2014–2023',
    body_styles: '5-door SUV',
    engine: '2.0L I4 turbo (Base/T) · 2.9–3.0L V6 biturbo (S/GTS) · 3.0L TDI V6 (S Diesel, EU only) · 3.6L/2.9L V6 biturbo (Turbo)',
    cooling: 'Water-cooled',
    units_produced: '~360,000 worldwide [VERIFY: Porsche cited 350,000–390,000 depending on counting cutoff]',
    notes: [
      'The 95B launched on the VW Group MLB Evo platform — shared with the Audi Q5 — but Porsche tuned suspension, transmission calibration, and powertrain to produce a genuinely sporty compact SUV. For its generation, the Macan had no real rival for driving feel in the compact luxury SUV segment.',
      'A meaningful Phase 2 refresh arrived for MY2019: S and GTS moved from the 3.0L V6 to the 2.9L EA839 biturbo (shared with the Panamera and 911 Carrera S). The Turbo moved from the 3.6L to the same 2.9L at a higher state of tune. These engine changes are spec-materially significant for comp queries — a 2017 Macan GTS (3.0L, 360 PS) and a 2020 Macan GTS (2.9L, 380 PS) have different powertrain provenance.',
      'US ICE production ended with MY2023, overlapping with the launch announcement of the all-electric PPE-platform Macan EV. The Macan T trim was added for MY2022–2023 as a sportier-positioned end-of-life ICE model with distinct visual treatment. The S Diesel (EU-only, 2014–2018) was discontinued post-Dieselgate and had zero US allocation.',
    ],
    variants: [
      { name: 'Macan (Base)', years: '2014–2023', drivetrain: 'AWD, 7-spd PDK', power: '252 PS (Ph1) / 261 PS (Ph2)', description: 'I4 entry trim. PDK valve body issues known in early Ph1 examples; addressed by software update.' },
      { name: 'Macan S', years: '2014–2023', drivetrain: 'AWD, 7-spd PDK', power: '340 PS (Ph1) / 354 PS (Ph2)', production: '~150,000 est [VERIFY]', description: 'V6 sweet spot; most popular 95B specification. Ph1 chain tensioner concern on early examples.' },
      { name: 'Macan GTS', years: '2016–2021', drivetrain: 'AWD, 7-spd PDK', power: '360 PS (Ph1 3.0L) / 380 PS (Ph2 2.9L)', production: '~40,000 est [VERIFY]', description: 'Sport-focused with PASM and Sport Chrono standard. Ph1/Ph2 engine change is a known comp differentiator.' },
      { name: 'Macan Turbo', years: '2014–2021', drivetrain: 'AWD, 7-spd PDK', power: '400 PS (Ph1 3.6L) / 440 PS (Ph2 2.9L)', production: '~60,000 est [VERIFY]', description: 'Fastest 95B. Ph2 Turbo made the Performance Package output standard. PDCC air suspension on most examples.' },
      { name: 'Macan Turbo w/ Performance Package', years: '2016–2018', drivetrain: 'AWD, 7-spd PDK', power: '440 PS / 600 Nm', production: 'Subset of Turbo total [VERIFY]', description: 'Factory option on Ph1 Turbo; bump from 400 to 440 PS with Torque Vectoring+. Ph2 Turbo made this output standard for all Turbos.' },
      { name: 'Macan S Diesel', years: '2014–2018', drivetrain: 'AWD, 7-spd PDK', power: '258 PS / 580 Nm', production: '~25,000 est [VERIFY]', description: 'EU-only; zero US allocation. 3.0L TDI with highest torque in 95B family. Discontinued after Dieselgate recall campaign.' },
      { name: 'Macan T', years: '2022–2023', drivetrain: 'AWD, 7-spd PDK', power: '261 PS / 400 Nm', production: '~15,000 est [VERIFY]', description: 'Late-cycle I4 trim with 20" RS Spyder wheels standard and optional crest delete. End-of-life ICE positioning.' },
    ],
    engineering: [
      'MLB Evo platform shared with Audi Q5 (Mk3), with Porsche-specific PASM adaptive dampers (GTS/Turbo standard), Porsche Torque Vectoring Plus on the Performance Package, and Porsche-tuned seven-speed wet-clutch PDK.',
      'Phase 2 (MY2019) engine transition: S/GTS moved to 2.9L EA839 biturbo from 3.0L; Turbo moved from 3.6L to 2.9L. The EA839 family is shared with the Panamera 4S and 911 Carrera S — a meaningful upgrade in both outputs and refinement.',
      'The S Diesel used the 3.0L TDI V6 with 580 Nm — the highest torque of any 95B model. It was excluded from the US market throughout its production life and discontinued globally after the Dieselgate emissions recall.',
    ],
    watch_for: [
      {
        title: 'PDK valve body (early I4 models)',
        severity: 'concern',
        body: 'Early 95B Base and T models with the 2.0L I4 experienced PDK valve body wear and software-related shift hesitation. Porsche dealer software updates and replacement valve bodies addressed most cases, but verify service history includes the PDK campaign on any pre-2018 example.',
        buyer_question: 'Has the PDK valve body been inspected, updated, or replaced? Any history of rough shifts or delayed engagement at low speeds?',
      },
      {
        title: 'V6 timing chain tensioner (Phase 1 S and GTS)',
        severity: 'concern',
        body: 'Phase 1 S and GTS models (2014–2018) with the 3.0L V6 have documented timing chain tensioner wear. Cold-start rattle is the primary symptom. Porsche extended warranty coverage and issued updated parts for affected VIN ranges; verify the repair was completed on any Phase 1 V6 example.',
        buyer_question: 'Has the timing chain tensioner been inspected or replaced? Any cold-start rattle? Dealer records for this campaign?',
      },
      {
        title: 'PDCC air suspension (Turbo)',
        severity: 'caution',
        body: 'Turbos equipped with PDCC active suspension are expensive to maintain at high mileage. Air strut failure is common beyond 60,000 miles. Replacement runs $3,000–$6,000 per corner at independent shops. Inspect all four corners before purchase.',
        buyer_question: 'Is the air suspension functional? When were the struts last inspected? Any warning lights on the suspension or chassis?',
      },
      {
        title: 'Transfer case wear (Turbo and GTS)',
        severity: 'caution',
        body: 'High-mileage Turbo and GTS examples can develop transfer case wear — particularly with a history of repeated hard launches or occasional off-road use. Vibration under acceleration load is the primary symptom.',
        buyer_question: 'Any vibration under acceleration? Transfer case fluid service history documented?',
      },
      {
        title: 'S Diesel recall and AdBlue system (EU only)',
        severity: 'concern',
        body: 'The S Diesel is subject to ongoing Dieselgate-related emissions recall work in Europe. The AdBlue SCR system is a documented failure point; repair is costly. Confirm all recall campaigns are completed and the AdBlue system is fully functional before purchase.',
        buyer_question: 'Have all Porsche recall campaigns been completed? Is the AdBlue SCR system fully functional? Any recent DEF/AdBlue warning lights?',
      },
    ],
    service: [
      'All 95B Macans benefit from oil service at 7,500–10,000 mile intervals. The PDK requires fluid changes every 40,000 miles — it is not a lifetime fill despite some dealer claims. Transfer case and front differential fluid should be serviced by 60,000 miles.',
      'Phase 1 V6 S and GTS models (2014–2018) should have timing chain tensioner history confirmed at purchase. If no documentation exists, budget for inspection before buying.',
      'Air suspension-equipped Turbos should be pressure-tested at every pre-purchase inspection. Porsche-trained technicians can assess individual corner condition. Factor deferred air suspension cost into any offer.',
    ],
    value_drivers: [
      {
        name: 'Phase 2 engine (MY2019+)',
        description: 'Phase 2 models with the 2.9L EA839 biturbo (S, GTS, Turbo) are generally preferred over Phase 1 for the more current powertrain, resolved early-car reliability concerns, and the spec connection to 911 Carrera S. Phase 2 GTS and Turbo typically carry a slight premium over comparable-mileage Phase 1.',
        applies_to: { trim_categories: ['s', 'gts', 'turbo'] },
      },
      {
        name: 'Turbo Performance Package (Phase 1)',
        description: 'Factory-optioned Phase 1 Turbos with the Performance Package (440 PS, Torque Vectoring+) command a modest premium over the base Phase 1 Turbo (400 PS). Confirm via COA or factory build sheet — aftermarket tunes do not qualify.',
        applies_to: { trim_categories: ['turbo_pp'] },
      },
      {
        name: 'S Diesel (EU market only)',
        description: 'EU-market S Diesel examples have a distinct buyer population on European auction platforms. Zero US market relevance. The diesel powertrain, discontinued status, and highest-torque 95B spec create niche collector interest in Europe.',
        applies_to: { trim_categories: ['s_diesel'] },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // cayenne-ii (958, 2011–2017)
  // ──────────────────────────────────────────────────────────────────────────
  'cayenne-ii': {
    positioning: 'MLB platform Cayenne — last with naturally aspirated V8',
    intro: 'The 958 Cayenne (MY2011–2018) moved to the VW Group MLB platform shared with the 2010 Audi Q7. The 958.1 (MY2011–2014) offered the last naturally-aspirated V8 in the S and GTS trim lines; the 958.2 facelift (MY2015–2018) replaced those V8s with V6 biturbo engines and added the PHEV S E-Hybrid, presaging the electrification direction of the 9Y0.',
    production_years: '2011–2018',
    body_styles: 'SUV (5-door)',
    engine: '3.6L V6 NA / 4.8L V8 NA (958.1 S/GTS) / 3.6L V6 biturbo (958.2 S/GTS) / 4.8L TT V8 (Turbo/Turbo S) / 3.0L SC V6 hybrid (S Hybrid) / 3.0L SC V6 PHEV (S E-Hybrid) / 3.0L V6 TDI (Diesel, EU) / 4.2L V8 TDI (S Diesel, EU)',
    cooling: 'Water-cooled',
    units_produced: '~170,000 combined 958.1+958.2 [VERIFY]',
    notes: [
      'The 958 represented a full platform change from the 955/957\'s PL71 to the MLB aluminum-intensive architecture. The Cayenne S and Turbo gained 8-speed Tiptronic automatics and significant interior refinement. The 958.1 S used the final version of the naturally-aspirated 4.8L V8 — a configuration collectors note as more engaging than the turbocharged V6 that replaced it at 958.2.',
      'At the 958.2 facelift (MY2015), Porsche replaced the naturally-aspirated 4.8L V8 in the S and GTS with a 3.6L V6 biturbo — the same engine-family substitution that occurred in the Panamera simultaneously. This drew comparison to the 996/997 NA-to-turbo S transitions. The 958.2 also introduced the S E-Hybrid PHEV, replacing the non-PHEV S Hybrid. The diesel lineup (Diesel and S Diesel) was available throughout the 958 generation in EU markets and represents high auction volume on Collecting Cars and PCarMarket EU listings.',
    ],
    variants: [
      { name: 'Base', years: 'MY2011–2018', drivetrain: 'AWD', power: '300 PS / 296 hp', description: '3.6L V6 NA. Same engine throughout both 958.1 and 958.2. Entry market; lower collector interest.' },
      { name: 'S (958.1)', years: 'MY2011–2014', drivetrain: 'AWD', power: '400 PS / 394 hp', description: '4.8L V8 NA. Last naturally-aspirated V8 S Cayenne. Collector distinction over 958.2 S.' },
      { name: 'S (958.2)', years: 'MY2015–2018', drivetrain: 'AWD', power: '420 PS / 414 hp', description: '3.6L V6 biturbo. Engine family switch at 958.2 facelift. Different character than 958.1 V8 S.' },
      { name: 'S Hybrid', years: 'MY2012–2013 (958.1 only)', drivetrain: 'AWD', power: '380 PS / 375 hp combined', description: '3.0L supercharged V6 + 47 kW electric motor. Non-PHEV parallel hybrid; no plug-in capability. Replaced by PHEV S E-Hybrid at 958.2. Auction volume lower than later PHEV.' },
      { name: 'E-Hybrid (S E-Hybrid)', years: 'MY2014–2017 (958.2)', drivetrain: 'AWD', power: '416 PS / 410 hp combined', description: '3.0L SC V6 + 70 kW electric PHEV. First plug-in Cayenne. Catalog entry is "E-Hybrid"; factory name was "S E-Hybrid".' },
      { name: 'GTS (958.1)', years: 'MY2013–2014', drivetrain: 'AWD', power: '420 PS / 414 hp', description: '4.8L V8 NA uprated. Added MY2013; not available 2011–2012. Sport exhaust, PASM, lowered.' },
      { name: 'GTS (958.2)', years: 'MY2015–2018', drivetrain: 'AWD', power: '440 PS / 434 hp', description: '3.6L V6 biturbo uprated. Same engine-family change as S; GTS fans note the V8 absence.' },
      { name: 'Turbo (958.1)', years: 'MY2011–2014', drivetrain: 'AWD', power: '500 PS / 493 hp', description: '4.8L TT V8.' },
      { name: 'Turbo (958.2)', years: 'MY2015–2018', drivetrain: 'AWD', power: '520 PS / 513 hp', description: '4.8L TT V8 uprated at 958.2.' },
      { name: 'Turbo S (958.1)', years: 'MY2013–2014', drivetrain: 'AWD', power: '550 PS / 542 hp', description: '4.8L TT V8 uprated. Added MY2013.' },
      { name: 'Turbo S (958.2)', years: 'MY2015–2018', drivetrain: 'AWD', power: '570 PS / 562 hp', description: '4.8L TT V8 further uprated.' },
      { name: 'Turbo S E-Hybrid', years: 'MY2014–2017 (958.2) [VERIFY]', drivetrain: 'AWD', power: 'Unknown [VERIFY]', description: 'Existence in 958 era is unconfirmed [VERIFY against Porsche AG press]. May be 9Y0 exclusive. Do not rely on this entry for comp matching until verified.' },
      { name: 'Diesel', years: 'MY2011–2018', drivetrain: 'AWD', power: '245–262 PS / 242–258 hp', description: '3.0L V6 TDI. EU market only. 245 PS (958.1) / 262 PS (958.2). Most popular Cayenne trim in EU by volume.' },
      { name: 'S Diesel', years: 'MY2012–2018 [VERIFY range]', drivetrain: 'AWD', power: '385 PS / 380 hp', description: '4.2L V8 TDI. EU market only. Distinct from base Diesel; higher auction value. [VERIFY exact model year range against Porsche AG press].' },
    ],
    engineering: [
      'MLB aluminum-intensive platform shared with 2010 Audi Q7; significant reduction in unsprung weight versus 955/957',
      '8-speed Tiptronic replaced 6-speed; noticeably smoother motorway behavior',
      '958.2 engine-family change (V8 NA → V6 biturbo in S and GTS) paralleled Panamera contemporaneously — shared powertrain strategy decision',
      'Air suspension continues from 955/957; same bladder-and-compressor lifecycle concern',
      '3.0L V6 TDI diesel: highest-volume EU Cayenne; requires adBlue fluid service on some market configurations',
    ],
    watch_for: [
      { title: 'Air suspension wear', severity: 'concern', body: 'Bladder cracking and compressor wear carry over from 955/957. Same symptoms and budget: plan for air suspension service at 80–100k miles.', buyer_question: 'Air spring and compressor service history?' },
      { title: '4.8L V8 rod bearings (958.1 S/GTS/Turbo)', severity: 'caution', body: 'The 4.8L naturally-aspirated and twin-turbo V8s share similar rod bearing design concerns to the 955\'s 4.5L at very high mileage. Oil analysis at purchase is advisable.', buyer_question: 'Oil analysis records available? Any ticking at cold start?' },
      { title: '3.6L V6 biturbo timing chain (958.2)', severity: 'caution', body: 'The 958.2 S and GTS V6 biturbo has a service interval for timing chain tensioner inspection. Deferred service can lead to chain elongation noise.', buyer_question: 'Has the timing chain been inspected per schedule? Any chain rattle at cold start?' },
    ],
    service: [
      'Air suspension inspection every 40,000 miles; budget for full replacement at 80–100k miles',
      '958.2 V6 biturbo: timing chain inspection per Porsche schedule (approximately 60,000 miles)',
      'Tiptronic 8-speed fluid service every 30,000–40,000 miles',
      'Transfer case output shaft seal inspection at each service interval',
      'S Hybrid (non-PHEV): supercharger belt tensioner inspection every 30,000 miles',
      'Plastic coolant tank inspection annually; replace at first sign of seepage',
    ],
  },

  // macan-ii (Macan EV / PPE platform, 2024–present)
  // Source: docs/overnight/family-macan-taycan-halo.md §B.2 + §C.2
  // ──────────────────────────────────────────────────────────────────────────
  'macan-ii': {
    positioning: 'All-electric Macan on Porsche–Audi PPE platform',
    intro: 'The second-generation Macan (Type 1Y) is a purpose-built electric SUV on the Premium Platform Electric (PPE) architecture co-developed with Audi. Unrelated to the 95B mechanically — new platform, 800V charging, and Taycan-derived powertrain thinking. Launched MY2024.',
    production_years: '2024–present',
    body_styles: '5-door SUV (EV)',
    engine: 'Dual-motor electric AWD (Macan 4 / 4S / Turbo) · Single-motor electric RWD (Macan Electric)',
    cooling: 'Electric (800V architecture)',
    units_produced: 'Ongoing [VERIFY annual delivery figures when available]',
    notes: [
      'The Type 1Y Macan shares the PPE platform with the Audi Q6 e-tron. Porsche-specific tuning includes Sport Chrono, PASM, and rear-axle steering options on Turbo variants. The 800V charging architecture matches the Taycan and enables high-rate DC charging up to 270 kW.',
      'The lineup launched MY2024 with Macan 4 (AWD) and Macan Turbo (AWD high-output). Macan 4S and Macan Electric (RWD entry) were added for MY2025 in select markets. HP figures represent overboost (launch control) output; standard output is lower in normal driving.',
      'Comp isolation from the 95B ICE Macan is critical: different platform, powertrain, price tier, and market. The genId split (macan-i vs macan-ii) handles this correctly. Do not compare ICE and EV Macan auction results in the same comp pool.',
    ],
    variants: [
      { name: 'Macan Turbo', years: '2024–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '639 PS std / ~630 hp overboost [VERIFY]', description: 'Flagship EV Macan. 0–60 ~3.1s. Fastest production Macan to date.' },
      { name: 'Macan 4S', years: '2025–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '509 PS overboost [VERIFY]', description: 'MY2025 addition filling GTS-like gap between Macan 4 and Turbo. Specs [VERIFY] pending Porsche AG release.' },
      { name: 'Macan 4', years: '2024–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '435 PS overboost', description: 'Launch-edition AWD base EV Macan. Softer character than Turbo; strong range with optional heat pump.' },
      { name: 'Macan Electric', years: '2025–', drivetrain: 'RWD, 1-spd', power: '~335 PS [VERIFY]', description: 'Entry RWD EV; select markets only. US availability [VERIFY]. Range-focused positioning.' },
    ],
    engineering: [
      'PPE platform (Premium Platform Electric) is a co-development between Porsche and Audi, shared with the Audi Q6 e-tron. The rear motor uses a single-speed reduction; the front motor uses a two-speed transmission for improved low-speed torque and highway efficiency on AWD variants.',
      '800V charging architecture supports up to 270 kW DC peak charging rate, matching the Taycan. This enables ~10–80% charging in approximately 21 minutes under ideal conditions.',
      'The Macan Turbo uses uprated stators and power electronics relative to the Macan 4, producing ~639 PS in standard mode and higher under overboost — the same architecture used in the Audi Q6 e-tron RS.',
    ],
    watch_for: [
      {
        title: 'Early-build software quality',
        severity: 'caution',
        body: 'MY2024 launch examples have reported OTA software bugs affecting infotainment, charging behavior, and ADAS calibration. Most have been resolved via OTA updates, but verify that all software updates are current before purchase. Porsche\'s online update history for the VIN should be confirmed.',
        buyer_question: 'Is the vehicle\'s software fully up to date? Any OTA update failures or persistent fault codes?',
      },
      {
        title: 'Long-term battery health (ongoing)',
        severity: 'caution',
        body: 'The Type 1Y is too new for long-term battery degradation data. For high-mileage examples, check the battery health report via the Porsche Vehicle History portal or a dealer scan. PPE battery warranty covers 8 years / 100,000 miles to 70% capacity.',
        buyer_question: 'What is the current battery state of health (SoH)? Is the battery warranty still active?',
      },
    ],
    service: [
      'The Macan EV has no traditional oil service, but brake fluid requires replacement every two years, coolant loops should be inspected per Porsche EV service schedule, and tire wear on EV Macans can be accelerated by regenerative braking patterns. Annual Porsche service check recommended.',
      'Battery health should be verified at pre-purchase inspection for any example beyond 30,000 miles. A Porsche dealer can produce a battery health report from the vehicle\'s BMS data.',
    ],
    value_drivers: [
      {
        name: 'Macan Turbo over Macan 4',
        description: 'The Macan Turbo commands a significant premium over the Macan 4 at launch ($103,600 vs $75,900). In the used market, Turbo examples are expected to hold stronger values as the performance halo of the EV lineup.',
        applies_to: { trim_categories: ['turbo'] },
      },
      {
        name: 'MY2024 launch examples',
        description: 'First-year EV examples carry both early-adopter novelty and early-build risk. No strong market signal yet on whether MY2024 commands a premium or discount vs MY2025. Monitor as the used market develops.',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // cayenne-iii (9Y0 + 9YA, 2018–present)
  // Note: 9YA (2024 facelift) is grouped here; a gen split at MY2024 is a Phase 2.5 item
  // ──────────────────────────────────────────────────────────────────────────
  'cayenne-iii': {
    positioning: 'MLB Evo platform — fully modern SUV with Coupé body option',
    intro: 'The 9Y0 Cayenne (MY2018–2023) moved to Audi/Porsche\'s MLB Evo platform, introducing an all-new 3.0L turbo V6 (EA839), the 2.9L V6 biturbo, and 4.0L twin-turbo V8. The fastback Coupé body (9YB) was added MY2020. The 9YA facelift (MY2024) restructured the powertrain tier toward electrification. All trims marked [VERIFY] require confirmation against Porsche AG press materials.',
    production_years: '2018–present',
    body_styles: 'SUV (5-door), Coupé (fastback 5-door, MY2020+)',
    engine: '3.0L V6 turbo EA839 / 2.9L V6 biturbo / 4.0L V8 biturbo / 3.0L V6 + 100 kW electric PHEV / 4.0L V8 + 100 kW electric PHEV',
    cooling: 'Water-cooled',
    notes: [
      'The 9Y0 represents the most capable Cayenne to date. The EA839 3.0L V6 turbo base engine is shared with several Audi products but tuned distinctively. The 2.9L V6 biturbo S shares architecture with the Panamera 4S and delivers 440 PS. The 4.0L twin-turbo V8 in GTS (MY2021+), Turbo, and Turbo S E-Hybrid configurations returns the GTS to V8 power after the 958.2\'s controversial V6 substitution.',
      'The Coupé body (9YB factory code) was introduced at MY2020 with a fastback roofline and active rear spoiler. All sedan trim lines received Coupé equivalents: S Coupé, GTS Coupé, E-Hybrid Coupé, Turbo Coupé, and Turbo S E-Hybrid Coupé. Coupé variants typically command a slight premium over same-spec SUV bodies in the current market. The Turbo S as a standalone ICE trim is disputed [VERIFY] — the flagship ICE car may simply be the Turbo; the PHEV flagship is the Turbo S E-Hybrid.',
    ],
    variants: [
      { name: 'Base', years: 'MY2018–2023', drivetrain: 'AWD', power: '340 PS / 335 hp', description: '3.0L EA839 V6 turbo. Entry; 3.0L water pump — inspect at service.' },
      { name: 'S', years: 'MY2018–2023', drivetrain: 'AWD', power: '440 PS / 434 hp', description: '2.9L V6 biturbo.' },
      { name: 'GTS', years: 'MY2021–2023', drivetrain: 'AWD', power: '460 PS / 454 hp', description: '4.0L V8 biturbo. Added MY2021; not available 2018–2020. Returns GTS to V8 power.' },
      { name: 'E-Hybrid', years: 'MY2018–2023', drivetrain: 'AWD', power: '462 PS / 455 hp combined', description: '3.0L V6 + 100 kW electric PHEV. ~14-mile EV range. 12V auxiliary battery drain documented.' },
      { name: 'Turbo', years: 'MY2018–2023', drivetrain: 'AWD', power: '550 PS / 542 hp', description: '4.0L V8 biturbo.' },
      { name: 'Turbo S', years: '[VERIFY — standalone ICE may not exist]', drivetrain: 'AWD', power: '[VERIFY]', description: 'Standalone non-hybrid Turbo S disputed. Flagship ICE may be the Turbo only; PHEV flagship is Turbo S E-Hybrid. [VERIFY against Porsche AG press before using for comp matching].' },
      { name: 'Turbo S E-Hybrid', years: 'MY2018–2023', drivetrain: 'AWD', power: '680 PS / 670 hp combined', description: '4.0L V8 biturbo + 100 kW electric PHEV. Flagship. Complex thermal management; PHEV coolant sensor documented issue.' },
      { name: 'Coupé', years: 'MY2020–2023', drivetrain: 'AWD', power: '340 PS / 335 hp', description: '3.0L V6 turbo. Fastback body; active rear spoiler; panoramic fixed glass roof standard.' },
      { name: 'Turbo Coupé', years: 'MY2020–2023', drivetrain: 'AWD', power: '550 PS / 542 hp', description: '4.0L V8 biturbo. Coupé body.' },
      { name: 'S Coupé', years: 'MY2020–2023 [VERIFY]', drivetrain: 'AWD', power: '440 PS / 434 hp', description: '2.9L V6 biturbo. Coupé body [VERIFY production confirmation].' },
      { name: 'GTS Coupé', years: 'MY2021–2023 [VERIFY]', drivetrain: 'AWD', power: '460 PS / 454 hp', description: '4.0L V8 biturbo. GTS Coupé [VERIFY production confirmation].' },
      { name: 'E-Hybrid Coupé', years: 'MY2020–2023 [VERIFY]', drivetrain: 'AWD', power: '462 PS / 455 hp combined', description: '3.0L V6 PHEV. Coupé body [VERIFY production confirmation].' },
      { name: 'Turbo S E-Hybrid Coupé', years: 'MY2020–2023 [VERIFY]', drivetrain: 'AWD', power: '680 PS / 670 hp combined', description: '4.0L V8 PHEV flagship. Coupé body [VERIFY production confirmation].' },
    ],
    engineering: [
      'MLB Evo platform: stiffer, lighter than 958 MLB; shared with Audi Q7 gen 2 and Bentley Bentayga',
      'Rear-axle steering standard on Turbo and Turbo S E-Hybrid; optional on other trims',
      'PHEV system (E-Hybrid and Turbo S E-Hybrid): 100 kW electric motor integrated into 8-speed Tiptronic; 14.1 kWh battery',
      '4.0L V8 twin-turbo: two turbos in the valley between cylinder banks (hot-vee configuration); fast spool, high thermal load',
      'GTS MY2021+ reinstates V8 after 958.2 V6 substitution — significant spec distinction for buyers',
    ],
    watch_for: [
      { title: '3.0L EA839 water pump', severity: 'caution', body: 'The EA839 3.0L turbo V6 water pump is a known service item. Inspect at every major service interval; premature failure can cause overheating.', buyer_question: 'Has the water pump been inspected or replaced? Service records?' },
      { title: 'PHEV 12V auxiliary battery (E-Hybrid)', severity: 'caution', body: 'Cayenne E-Hybrid and Turbo S E-Hybrid 12V aux battery drain is a documented pattern, especially on cars that sit unused. Symptoms: infotainment lockup, PHEV system faults.', buyer_question: 'Any PHEV system fault codes? When was the 12V battery last replaced?' },
    ],
    service: [
      'EA839 3.0L V6: water pump inspection at every major service; replacement if any signs of bearing play or seepage',
      'PHEV models: high-voltage battery health check; 12V aux battery replacement on schedule (typically every 3–4 years)',
      '8-speed Tiptronic fluid service every 40,000 miles',
      'Rear-axle steering (if equipped): actuator and sensor inspection at 60,000 miles',
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // panamera-i (970, 2010–2016)
  // ──────────────────────────────────────────────────────────────────────────
  'panamera-i': {
    positioning: 'Four-door Porsche sport saloon — first generation',
    intro: 'The 970 Panamera debuted at Shanghai 2009 for MY2010. A four-door fastback hatchback body built in Leipzig alongside the 911 and Boxster. The base, S, and Turbo used PDK; the hybrid variants used an 8-speed Tiptronic. A 970.2 mid-cycle refresh at MY2014 changed the S and 4S engines from naturally-aspirated V8 to V6 biturbo and added the long-wheelbase Executive and the first PHEV (4 E-Hybrid).',
    production_years: '2010–2016',
    body_styles: 'Fastback sedan (4-door hatchback)',
    engine: '3.6L V6 NA / 4.8L V8 NA (S/4S/GTS/Turbo/Turbo S pre-970.2) / 3.0L V6 biturbo (S/4S post-970.2) / 3.0L SC V6 hybrid / 4.8L TT V8 + electric PHEV',
    cooling: 'Water-cooled',
    units_produced: '~65,000 [VERIFY]',
    notes: [
      'The 970 was Porsche\'s boldest new model since the Cayenne. The S and 4S used the naturally-aspirated 4.8L V8 (same family as 957 Cayenne) for MY2010–2013; at the 970.2 refresh both received the 3.0L V6 biturbo with higher power output but different character. The key collector distinction in the 970 is RWD vs. AWD: the S is the RWD variant, the 4S is AWD; both use the same engine family. The 970 S (RWD) is absent from the original catalog, causing comp misclassification of 970 S auction results as the base V6.',
      'The GTS (added MY2012) used the naturally-aspirated 4.8L V8 throughout both 970.1 and 970.2, making it the last Panamera generation with a V8 GTS. The Turbo S (added MY2012) used an uprated TT V8 producing 570 PS — the most powerful road Panamera at launch. The S Hybrid (MY2012–2013) was a non-PHEV parallel hybrid; it was replaced at MY2014 by the true PHEV 4 E-Hybrid, which charged from an external source and offered a short all-electric range.',
    ],
    variants: [
      { name: 'Base (Panamera)', years: 'MY2010–2016', drivetrain: 'RWD', power: '300 PS / 296 hp', description: '3.6L V6 NA. 7-spd PDK. Entry model; RWD only.' },
      { name: 'S', years: 'MY2010–2013 (V8) / MY2014–2016 (V6T)', drivetrain: 'RWD', power: '400 PS (V8) / 420 PS (V6T)', description: 'RWD counterpart to the AWD 4S. V8 NA (MY2010–2013) changed to V6 biturbo at 970.2 (MY2014). Missing from original catalog — causes comp misclassification.' },
      { name: '4', years: 'MY2011–2016', drivetrain: 'AWD', power: '300 PS / 296 hp', description: '3.6L V6 NA. AWD base. Added MY2011.' },
      { name: '4S', years: 'MY2010–2013 (V8) / MY2014–2016 (V6T)', drivetrain: 'AWD', power: '400 PS (V8) / 420 PS (V6T)', description: 'AWD equivalent of the S; same engine-family change at 970.2.' },
      { name: 'GTS', years: 'MY2012–2016', drivetrain: 'AWD', power: '430 PS / 424 hp', description: '4.8L V8 NA uprated. AWD. Added MY2012. M-differential; sport exhaust. V8 retained throughout 970.1 and 970.2.' },
      { name: 'Turbo', years: 'MY2010–2016', drivetrain: 'AWD', power: '500 PS / 493 hp', description: '4.8L TT V8. AWD.' },
      { name: 'Turbo S', years: 'MY2012–2016', drivetrain: 'AWD', power: '570 PS / 562 hp', description: '4.8L TT V8 uprated. Added MY2012. Most powerful road Panamera at launch.' },
      { name: 'S Hybrid', years: 'MY2012–2013', drivetrain: 'AWD', power: '380 PS / 375 hp combined', description: '3.0L SC V6 + 34 kW electric motor. Non-PHEV parallel hybrid; 8-spd Tiptronic AWD. Replaced by PHEV 4 E-Hybrid at MY2014.' },
      { name: '4 E-Hybrid', years: 'MY2014–2016', drivetrain: 'AWD', power: '416 PS / 410 hp combined', description: '3.0L SC V6 + 70 kW electric PHEV. First plug-in Panamera.' },
      { name: 'Turbo S E-Hybrid', years: 'MY2014–2016', drivetrain: 'AWD', power: '680 PS / 670 hp combined', description: '4.8L TT V8 + 70 kW electric PHEV. Most powerful Panamera at time of launch.' },
      { name: 'Executive', years: 'MY2014–2016 (970.2)', drivetrain: 'Various', power: 'Multiple', description: 'LWB +15 cm wheelbase. Available on 4S, Turbo, Turbo S, Turbo S E-Hybrid drivetrains. Added MY2014 at 970.2 refresh.' },
    ],
    engineering: [
      'PDK 7-speed standard on ICE models; 8-speed Tiptronic on hybrid variants — unique among the lineup',
      'RWD vs. AWD is the primary comp-engine differentiator: Base and S are RWD; 4, 4S, GTS, Turbo, Turbo S are AWD',
      '970.2 engine-family change: V8 NA replaced by V6 biturbo in S and 4S at MY2014; GTS retained V8 throughout',
      'Leipzig production facility; same building as contemporary 911 and Boxster manufacturing',
    ],
    watch_for: [
      { title: 'PDK oil seal', severity: 'caution', body: 'PDK 7-speed oil seal failures are documented on high-mileage 970 examples. Symptoms include gear hesitation and fluid leakage from the transmission bellhousing area.', buyer_question: 'PDK fluid change history? Any hesitation in gear changes?' },
      { title: 'V8 coolant pipe routing', severity: 'caution', body: '4.8L V8 (both NA and TT) has a coolant cross-pipe routing failure point behind the engine. Not easily visible; check service records for this preventive replacement.', buyer_question: 'Has the coolant cross-pipe been replaced? Any overheating history?' },
      { title: 'Plastic coolant expansion tank', severity: 'concern', body: 'Plastic coolant tank is a common crack failure point across the 970 lineup. Replace at first sign of seepage; sudden failure causes rapid coolant loss.', buyer_question: 'Has the coolant tank been replaced? Any coolant loss or low-coolant warnings?' },
    ],
    service: [
      'PDK fluid service every 30,000 miles; seal inspection at 60,000 miles',
      'V8 coolant cross-pipe preventive replacement — ideally done at 80,000–100,000 miles',
      'Coolant expansion tank replacement at first signs of discoloration or seepage',
      'S Hybrid 3.0L SC V6: supercharger belt tensioner inspection every 30,000 miles',
      '8-speed Tiptronic (hybrid models): fluid service every 40,000 miles',
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // panamera-ii (971 + 972, 2017–present)
  // Note: 972 (2024 facelift) is grouped here; a gen split at MY2024 is a Phase 2.5 item
  // ──────────────────────────────────────────────────────────────────────────
  'panamera-ii': {
    positioning: 'Type 971 — Sport Turismo wagon, biturbo V6/V8 across the range',
    intro: 'The entirely new Type 971 body (MY2017) is longer, wider, and lower than the 970. The Sport Turismo wagon body was added MY2018 — the only true Panamera wagon and a significant auction volume contributor in EU/Asia markets. The 971.2 Tech facelift (MY2021) brought minor exterior updates and powertrain refinements. The 972 (MY2024) restructured the tier toward E-Hybrid leadership.',
    production_years: '2017–present',
    body_styles: 'Fastback sedan (4-door), Sport Turismo (wagon, MY2018+), Executive (LWB sedan)',
    engine: '3.0L V6 turbo EA839 / 2.9L V6 biturbo / 4.0L V8 biturbo / 2.9L V6 + 100 kW electric PHEV / 4.0L V8 + 100 kW electric PHEV',
    cooling: 'Water-cooled',
    units_produced: '~65,000+ [VERIFY — includes all body styles and powertrains]',
    notes: [
      'The 971 uses a new 8-speed PDK throughout (replacing the prior 7-speed PDK and 8-speed Tiptronic split). The 2.9L V6 biturbo in the 4S and S replaces the prior V6T; the 4.0L twin-turbo V8 debuts in the GTS (added MY2019) and Turbo tiers. The GTS returning to V8 power echoed the same decision in the Cayenne 9Y0.',
      'The Sport Turismo wagon (MY2018+) shares all sedan drivetrains, adding roughly 4,800 USD/EUR to the base sedan price. It accounts for a disproportionate share of EU and Asian auction volume on BaT, PCarMarket, and Collecting Cars. The 4 E-Hybrid Sport Turismo is the single highest-volume PHEV green-plate Panamera variant in European auction data. The Executive LWB is present throughout the 971 but rarely appears at US auction; more common in EU/Middle East markets.',
    ],
    variants: [
      { name: 'Base (Panamera)', years: 'MY2017–2023', drivetrain: 'RWD', power: '330 PS / 325 hp', description: '3.0L EA839 V6 turbo. 8-spd PDK.' },
      { name: 'S', years: 'MY2017–2023 [VERIFY US availability]', drivetrain: 'RWD', power: '440 PS [VERIFY]', description: '2.9L V6 biturbo RWD. [VERIFY US market availability — may be EU/RoW only.] Distinct from AWD 4S.' },
      { name: '4', years: 'MY2017–2023', drivetrain: 'AWD', power: '330 PS / 325 hp', description: '3.0L EA839 V6 turbo. AWD base.' },
      { name: '4S', years: 'MY2017–2023', drivetrain: 'AWD', power: '440 PS / 434 hp', description: '2.9L V6 biturbo. AWD.' },
      { name: 'GTS', years: 'MY2019–2023', drivetrain: 'AWD', power: '460 PS / 454 hp', description: '4.0L V8 biturbo. Added MY2019; not available 2017–2018. Returns to V8.' },
      { name: 'Turbo', years: 'MY2017–2023', drivetrain: 'AWD', power: '550 PS / 542 hp', description: '4.0L V8 biturbo.' },
      { name: 'Turbo S', years: 'MY2019–2023', drivetrain: 'AWD', power: '620 PS / 611 hp', description: '4.0L V8 biturbo uprated. Added MY2019.' },
      { name: '4 E-Hybrid', years: 'MY2017–2023', drivetrain: 'AWD', power: '462 PS / 455 hp combined', description: '2.9L V6 + 100 kW electric PHEV.' },
      { name: 'Turbo S E-Hybrid', years: 'MY2018–2023', drivetrain: 'AWD', power: '680 PS / 670 hp combined', description: '4.0L V8 + 100 kW electric PHEV.' },
      { name: 'Sport Turismo', years: 'MY2018–2023', drivetrain: 'Various', power: 'Multiple', description: 'Wagon body. All sedan ICE and PHEV drivetrains available. ~+4,800 USD/EUR vs. sedan at equivalent spec. Distinct comp market.' },
      { name: '4 E-Hybrid Sport Turismo', years: 'MY2018–2023', drivetrain: 'AWD', power: '462 PS / 455 hp combined', description: '2.9L V6 PHEV in Sport Turismo wagon body. Highest EU/Asia auction volume of any 971 variant.' },
      { name: 'Executive', years: 'MY2017–2023', drivetrain: 'Various', power: 'Multiple', description: 'LWB sedan +10 cm wheelbase. All major drivetrain configurations available. Primarily EU/Middle East market.' },
    ],
    engineering: [
      '8-speed PDK throughout (971 eliminated the 8-speed Tiptronic split from 970 — all variants now PDK)',
      '4.0L twin-turbo V8 in hot-vee configuration; same engine family as 992 911 Turbo and Cayenne Turbo',
      '2.9L V6 biturbo: turbo inlet hose split is a documented early failure (approx. 40,000 miles); inexpensive repair if caught early',
      'PHEV: 2.9L V6 + 100 kW electric motor; 14.1 kWh battery (same pack as Cayenne E-Hybrid); ~25 km EV range',
      'Sport Turismo: identical platform and body sealing as sedan to roof line; wagon extension adds structural reinforcement at D-pillar',
    ],
    watch_for: [
      { title: '4.0L V8 timing chain (high mileage)', severity: 'caution', body: 'The 4.0L twin-turbo V8 timing chain is documented with elongation at high mileage (typically 80,000+ miles). Symptom: cold-start rattle from engine front. Pre-purchase oil analysis and inspection recommended on high-mileage examples.', buyer_question: 'Any cold-start rattle? Timing chain inspection history?' },
      { title: '2.9L V6 biturbo turbo inlet hose', severity: 'caution', body: 'The turbo inlet hose on the 2.9L V6 biturbo is prone to splitting at the joint. Symptoms include boost loss and whistling under acceleration. The hose is inexpensive; the failure mode is well-documented and easy to diagnose.', buyer_question: 'Has the turbo inlet hose been replaced or inspected? Any boost hesitation?' },
      { title: 'PHEV coolant temperature sensor', severity: 'caution', body: 'PHEV models (4 E-Hybrid and Turbo S E-Hybrid) have documented coolant temp sensor failures generating false overheating warnings. Verify against actual coolant temperature before replacing expensive components.', buyer_question: 'Any PHEV-related warning lights? Coolant temp sensor history?' },
    ],
    service: [
      '2.9L V6 biturbo: turbo inlet hose inspection at 40,000 miles; replacement as preventive measure',
      '4.0L V8: timing chain inspection at 80,000 miles on higher-mileage examples',
      '8-speed PDK fluid service every 40,000 miles',
      'PHEV models: high-voltage battery health check; coolant temp sensor inspection at annual service',
      'Airmatic suspension (if equipped): height sensor and actuator inspection at 60,000 miles',
    ],
  },

  // taycan-i (Taycan J1, 2020–present)
  // Source: docs/overnight/family-macan-taycan-halo.md §B.3 + §C.3
  // ──────────────────────────────────────────────────────────────────────────
  'taycan-i': {
    positioning: 'Porsche\'s first production EV on the bespoke J1 platform',
    intro: 'The Taycan is Porsche\'s first production electric vehicle, built on the bespoke J1 platform with 800V charging architecture. Available as sedan, raised-ride Cross Turismo wagon, and low-profile Sport Turismo wagon. The Turbo GT added in MY2024 set an EV lap record at the Nürburgring.',
    production_years: '2020–present',
    body_styles: 'Sedan · Cross Turismo (raised wagon, +59 mm) · Sport Turismo (low wagon)',
    engine: 'Single-motor electric (RWD — Base) · Dual-motor electric (AWD — 4, 4S, GTS, Turbo, Turbo S, Turbo GT)',
    cooling: 'Electric (800V architecture)',
    units_produced: '~134,000 through 2023 (20,015 · 41,296 · 34,801 · 37,526 by year)',
    notes: [
      'The Taycan launched for MY2020 with 4S, Turbo, and Turbo S sedan variants. MY2021 added the RWD base Taycan, the Taycan 4, and the Cross Turismo body style. MY2022 brought the Sport Turismo body and the GTS. MY2024 added the Turbo GT — the most powerful Taycan and the fastest production EV around the Nürburgring at its launch.',
      'Power figures vary significantly by battery specification (Performance Battery vs Performance Battery Plus) and whether Sport Boost overboost is active. Figures cited in this catalog reflect Performance Battery Plus maximum rated output — standard output is materially lower.',
      'Body-style ambiguity is the highest-impact comp-accuracy issue for the Taycan: a Taycan 4S Sedan and a Taycan 4S Cross Turismo have materially different values (CT typically carries a $3,000–$5,000 premium). The current catalog models Cross Turismo and Sport Turismo as monolithic body-style entries — a Phase 2.5 design item to resolve.',
    ],
    variants: [
      { name: 'Taycan (RWD / Base)', years: '2021–', drivetrain: 'RWD, 1-spd rear', power: '476 PS PB+ overboost / 300 PS std', production: '~20,000 est [VERIFY]', description: 'Most efficient Taycan; ~283 mi EPA with PB+. Added MY2021.' },
      { name: 'Taycan 4', years: '2021–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '530 PS PB+ overboost', production: '~15,000 est [VERIFY]', description: 'AWD entry tier; absent from catalog before this release. Slots between RWD and 4S.' },
      { name: 'Taycan 4S', years: '2020–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '571 PS PB+ overboost', production: '~25,000 est [VERIFY]', description: 'Launch edition; first J1 sold to customers. Balanced performance/range sweet spot.' },
      { name: 'Taycan GTS', years: '2022–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '590 PS', production: '~8,000 est [VERIFY]', description: 'Track-tuned chassis; GTS suspension calibration standard. Sedan and Sport Turismo only [VERIFY CT availability].' },
      { name: 'Taycan Turbo', years: '2020–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '680 PS overboost', production: '~12,000 est [VERIFY]', description: '0–60 ~3.0s; PDCC standard. Strong daily usability at the high-performance tier.' },
      { name: 'Taycan Turbo S', years: '2020–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '761 PS PB+ overboost', production: '~6,000 est [VERIFY]', description: '0–60 ~2.6s; ceramic brakes standard. Weissach Package option on sedan adds carbon components and aero.' },
      { name: 'Taycan Turbo GT', years: '2024–', drivetrain: 'AWD, 2-spd front + 1-spd rear', power: '~1,019 PS Weissach overboost [VERIFY]', production: '~2,000 est [VERIFY]', description: 'Nürburgring EV lap record holder at launch. Sedan-only. 0–60 ~2.2s. Weissach Package may be standard or option [VERIFY].' },
      { name: 'Cross Turismo', years: '2021–', drivetrain: 'AWD', power: 'Mirrors sedan tiers (4 / 4S / Turbo / Turbo S)', description: 'Raised-ride wagon (+59 mm); gravel/unpaved mode option. Power level ambiguous in current monolithic catalog entry — Phase 2.5 design item.' },
      { name: 'Sport Turismo', years: '2022–', drivetrain: 'AWD', power: 'Mirrors sedan tiers (4 / 4S / GTS / Turbo / Turbo S)', description: 'Low-profile wagon body. Lower and sportier than Cross Turismo. Power level ambiguous in current monolithic catalog entry — Phase 2.5 design item.' },
    ],
    engineering: [
      'J1 platform is Porsche-bespoke (later evolved into PPE for the Macan EV). 800V architecture enables up to 270 kW DC charging. The two-speed front gearbox on AWD variants provides torque for launch while allowing a relaxed gear ratio at highway speeds.',
      'The Turbo GT uses uprated stators and inverters relative to the Turbo S — the same mechanical approach as the Mission E race program. Weissach Package (carbon wheels, aero wing, reduced weight) targets the Nürburgring record configuration.',
      'All Taycans use regenerative braking integrated into the blended brake pedal. Ceramic brakes are standard on Turbo S; available on Turbo. The GTS uses a tuned suspension calibration distinct from the Turbo family.',
    ],
    watch_for: [
      {
        title: 'Charging software (early MY2020 batches)',
        severity: 'caution',
        body: 'Early MY2020 Taycans had OTA software issues affecting charge rate management and displayed range. Most have been resolved via dealer OTA updates. Confirm software version is current and verify charging behavior with a DC fast-charge test before purchase.',
        buyer_question: 'Is the vehicle fully updated to the latest Porsche Connect software? Any history of charging errors or unexpected charge interruptions?',
      },
      {
        title: 'Battery health on high-mileage examples',
        severity: 'caution',
        body: 'Taycan battery degradation data is now available for 2020–2021 models at 50,000+ miles. Battery health reports are accessible via Porsche dealer scan. Taycan battery warranty covers 8 years / 100,000 miles to 70% capacity under the original Porsche warranty.',
        buyer_question: 'What is the current battery state of health (SoH) from a dealer scan? Is the original battery warranty still active?',
      },
      {
        title: 'Turbo GT Weissach Package verification',
        severity: 'caution',
        body: 'The Turbo GT Weissach Package commands a premium and includes carbon wheels and aero components. Confirm factory specification via Porsche COA. The Weissach configuration on the Turbo GT [VERIFY whether it is standard or an option — Porsche launch materials are ambiguous].',
        buyer_question: 'Is the Weissach Package confirmed on the factory COA? Are the carbon wheels original factory specification?',
      },
      {
        title: 'Body-style comp isolation (Cross Turismo / Sport Turismo)',
        severity: 'caution',
        body: 'Cross Turismo and Sport Turismo variants carry price premiums over comparable sedan variants (typically $3,000–$5,000 for CT). The current catalog models these as monolithic body-style entries — comp queries may undervalue CT/ST examples until body-style isolation is added in Phase 2.5.',
        buyer_question: 'Is the body style (sedan vs CT vs ST) correctly identified in the listing? Cross-reference the VIN body code.',
      },
    ],
    service: [
      'Taycan has no oil service, but brake fluid must be replaced every two years regardless of mileage — a common EV owner oversight. Coolant loop inspection per Porsche EV schedule. Tire wear can be higher than expected for an EV due to regenerative braking patterns and vehicle weight (~5,000 lb).',
      'Pre-purchase inspection should include a battery health scan from a Porsche dealer or trained EV technician. For Turbo and Turbo S examples, confirm PDCC system function and ceramic brake pad thickness.',
      'The GTS and Turbo GT have unique chassis tuning. Alignment and suspension inspection is recommended at purchase for any track-driven example.',
    ],
    value_drivers: [
      {
        name: 'Turbo GT over Turbo S',
        description: 'The Turbo GT commands a strong premium over the Turbo S, driven by the Nürburgring record, sedan-only production, and significantly higher output. Weissach-equipped examples carry additional premium. Long-term values will depend on production totals [VERIFY] — estimated ~2,000 units.',
        applies_to: { trim_categories: ['turbo_gt'] },
      },
      {
        name: 'Cross Turismo premium over sedan',
        description: 'Cross Turismo variants (all power tiers) typically carry a $3,000–$5,000 premium over comparable sedan variants in the used market. The premium reflects the rarer body style, the gravel mode option, and stronger SUV-buyer crossover demand.',
        applies_to: { trim_categories: ['cross_turismo'] },
      },
      {
        name: 'Taycan 4 — absent from catalog until Phase 2',
        description: 'The Taycan 4 was absent from the catalog prior to this release. Any Taycan 4 auction listings ingested before this update may have been misclassified as Base/RWD or 4S. Flag listings with uncertain trim classification from before the Phase 2 catalog update.',
        applies_to: { trim_categories: ['4'] },
      },
      {
        name: 'Performance Battery Plus specification',
        description: 'All Taycan variants perform significantly better with Performance Battery Plus (PB+). A 4S with PB+ is spec-materially different from a 4S with standard Performance Battery. Confirm PB+ from the factory build sheet — it affects power, range, and comp pool.',
      },
    ],
  },

}

export function getGenerationContent(id: string): GenerationContent | null {
  return CONTENT[id] ?? null
}

export function getValueDrivers(id: string): ValueDriver[] | null {
  return CONTENT[id]?.value_drivers ?? null
}

export type ProductionResult = {
  /** Human-readable label — e.g. "Carrera Cabriolet built" or "996.2 total production" */
  label: string
  /** The production figure or range string */
  figure: string
  /** Which fallback tier fired */
  tier: 'variant' | 'generation'
}

function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function findBestVariantMatch(
  variants: GenerationVariant[] | undefined,
  trim: string | null | undefined,
): GenerationVariant | null {
  if (!variants?.length || !trim) return null
  const normTrim = normalizeName(trim)
  // Exact match first
  for (const v of variants) {
    if (normTrim === normalizeName(v.name)) return v
  }
  // Longest prefix match (either direction)
  let best: GenerationVariant | null = null
  let bestLen = 0
  for (const v of variants) {
    const normVariant = normalizeName(v.name)
    if (
      (normTrim.startsWith(normVariant) || normVariant.startsWith(normTrim)) &&
      normVariant.length > bestLen
    ) {
      best = v
      bestLen = normVariant.length
    }
  }
  return best
}

/**
 * Returns a production figure for the given listing, with a 3-tier fallback:
 *   1. Variant match — matched variant has production data
 *   2. Generation content — content.units_produced from generation-content.ts
 *   3. null — no data available (caller may try DB-level fallback)
 */
export function lookupVariantProduction(
  generationId: string | null | undefined,
  trim: string | null | undefined,
): ProductionResult | null {
  if (!generationId) return null
  const content = getGenerationContent(generationId)
  if (!content) return null

  // Tier 1: find the best variant match; use its production data if present
  const matched = findBestVariantMatch(content.variants, trim)
  if (matched?.production) {
    return { label: `${matched.name} built`, figure: matched.production, tier: 'variant' }
  }

  // Tier 2: generation-level units_produced from content
  if (content.units_produced) {
    if (!matched && trim) {
      console.warn(
        `[production-lookup] No variant matched trim="${trim}" in generation="${generationId}" — falling back to generation total`,
      )
    }
    return {
      label: `${generationId} total production`,
      figure: content.units_produced,
      tier: 'generation',
    }
  }

  console.warn(
    `[production-lookup] No production data at all for generation="${generationId}" — needs data audit`,
  )
  return null
}

/**
 * Generation IDs for which no acceptable hero image could be sourced.
 * The generation page hero renders a warm gradient fallback for these
 * rather than a wrong or low-quality image.
 *
 * Currently empty — all generations have been reviewed and corrected
 * (2026-05-10 re-search pass). Update this list if future image sources
 * are removed or found to be mismatched.
 */
export const GENERATIONS_WITHOUT_IMAGE: readonly string[] = []
