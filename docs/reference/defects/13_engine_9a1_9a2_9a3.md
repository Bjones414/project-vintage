# 13 — Engine Defects: 9A1 / 9A2 / 9A3 Modern Flat-Six (2009–present)

The 9A1, 9A2, and 9A3 are the direct-injection flat-six engines that
replaced the M96/M97 family in the 911 / Boxster / Cayman volume cars
and that power most current Porsches. Family scope:

- **9A1** (DFI naturally aspirated, 2008/MY2009–2016): 997.2 Carrera /
  Carrera S / Targa, 997.2 Turbo and Turbo S (NOT Mezger — see file 02
  boundary note), 991.1 Carrera / Carrera S / Targa / Turbo / Turbo S,
  981 Boxster GT4 and Spyder (3.8L 9A1 variant), and the 4.0L
  naturally-aspirated GT engine in 991.1 GT3 (MA175 sub-variant) and
  991.1 GT3 RS / 911 R (MA176 sub-variant). Boxster 987.2 / Cayman
  987.2 / 981 base also use a 9A1-derivative (MA1) treated within the
  same family for catalog scoping.
- **9A2** (DFI twin-turbo 3.0L, 2016–2019): 991.2 Carrera /
  Carrera S / Carrera GTS / Targa / Turbo / Turbo S. Some specialist
  sources also use the platform code MA2 for the 991.2 turbocharged
  flat-six.
- **9A3** (DFI twin-turbo 3.0L evolved, 2019–present): 992.1 Carrera /
  Carrera S / Carrera GTS / Targa / Turbo / Turbo S, 992.2 (including
  T-Hybrid). The 992 GT3 / GT3 RS use a 4.0L naturally-aspirated GT
  variant in the same lineage as the 991 GT3 engines.

Compared to the M96/M97 family that preceded it, the 9A1/9A2/9A3
family eliminates or substantially reduces every catastrophic failure
mode documented in file 01: **there is no intermediate shaft, no IMS
bearing, no Lokasil cylinder bore-scoring failure mode of the
M96/M97 form, and no M96/M97-pattern rear main seal weeping
architecture.** LN Engineering's 9A1 product documentation [LN-9A1]
confirms the architectural change: the 9A1 eliminated the intermediate
shaft and introduced a vastly improved oiling system (wet sump on
most variants, true dry sump with external oil tank on some later
variants) that eliminates the oil-starvation pathway common to
M96/M97. Across forum, specialist, and TÜV-index ownership reporting,
the consistent message is that the 9A1 family successor engines are
among the more reliable modern Porsche engines, and that the 992
specifically is one of the more defect-light generations Porsche has
shipped.

This file therefore contains two flagged defects — both narrow in
scope:

1. **991.1 GT3 (2014–2016) engine concerns** — the rod-bolt recall
   that replaced every 2014 MY GT3 engine, plus the subsequent
   finger-follower / camshaft warranty extension that Porsche made
   transferable across the 991.1 GT3 (3.8L) population.
2. **9A1-family DFI intake-valve carbon buildup** — the
   industry-wide direct-injection phenomenon as it manifests on
   9A1-family engines, framed conservatively as a high-mileage
   service item rather than a catastrophic failure.

A "What is NOT a flagged defect" section parallels file 02's Mezger
treatment: the absence of M96/M97 failure modes on this engine family
is itself buyer-relevant information. A "Considered and not
included" section documents items that surfaced in research and were
deferred to other files or below the v1 evidence bar.

---

## Defect: 991.1 GT3 engine — 2014 rod-bolt recall and 2017 finger-follower warranty extension

```yaml
id: 991_1_gt3_engine_concerns
flag_title: "991.1 GT3 engine — recall and FF warranty extension"
description: |
  The 991.1 generation 911 GT3 (model years 2014–2016, 3.8L
  naturally-aspirated 9A1 GT variant, internally MA175) was subject
  to two distinct Porsche-acknowledged campaigns. First, in early
  2014, Porsche issued a global recall after two engine fires
  traced to loose connecting rod bolts; every 2014 MY GT3 engine
  was replaced with a redesigned engine. Second, in 2017, after a
  Concerned Owners Group meeting with Porsche Motorsport leadership,
  Porsche extended the warranty on all 991.1 GT3 internal engine
  components to 10 years or 120,000 miles (whichever first) to
  cover finger-follower wear failures linked to inclusions in the
  follower's diamond-like-coating (DLC) surface.

applicability:
  generation: [991.1]
  engine_family: [9A1]
  trim_category: [GT3]
  year_range: [2014, 2016]
  excludes:
    - description: "991.1 GT3 RS and 991 R are not subject to either campaign per Porsche's official statement on the 2017 warranty extension; reason for exclusion not publicly specified by Porsche. Catalog scope here is GT3 only."
      trim_category: [GT3_RS, 911_R]
    - description: "991.2 GT3 (2017+) and all 992 GT3 / GT3 RS variants use revised valvetrain components and are not subject to the 991.1 finger-follower campaign."
      generation: [991.2, 992.1, 992.2]
      trim_category: [GT3, GT3_RS]
    - description: "997.2 GT3 / GT3 RS / GT3 RS 4.0 are Mezger-engined and unrelated to the 9A1-family GT engine. See file 02."
      engine_family: [Mezger]

severity: catastrophic
# 2014 recall was an active fire risk — Porsche told owners to park
# affected cars and replaced 100% of the 2014 MY engine population.
# Subsequent FF wear, when it manifests, ranges from misfire codes
# at high RPM (recoverable via FF replacement) up to engine
# replacement on cars where wear progressed before detection.

# cost_range_usd: omitted. The 2014 recall remedy and the 2017
# warranty-extension repairs are performed at Porsche's cost
# while the relevant coverage is in force. Out-of-warranty repair
# pricing for finger-follower replacement, finger-follower-plus-
# camshaft replacement, used GT3 / GT3 RS engine swaps, and new
# OEM engine swaps is Tier-C-anchored only (specialist community
# discussion on Rennlist [REN-FF], including a referenced Dundon
# Motorsports podcast statement on a customer at 130,000 miles
# with three finger-follower replacements). Per catalog principle
# that Tier C is never sole source for a cost claim, the
# structured cost field is omitted at v1. The editorial note below
# describes the in-warranty-versus-out-of-warranty cost spread
# qualitatively. If a Tier-B specialist publishes the post-warranty
# repair pricing matrix in a future pass, this record can be
# updated.

prevalence_rate: "manufacturer-acknowledged (2014 recall: 100% of 2014 MY GT3 population, ~785 cars worldwide; subsequent FF wear: rate not published, sufficient for Porsche to extend warranty 10yr/120k transferable globally)"
prevalence_source_anchor: |
  The 2014 rod-bolt recall is documented in NHTSA campaign 14V-090
  (which mirrors Porsche Technical Information Service 20/14 ENU
  AE01), covering approximately 785 vehicles worldwide and
  approximately 400 in the United States [NHTSA-RCRIT, NHTSA-RCONL,
  SPRINT-RECALL]. The 2017 finger-follower warranty extension was
  announced via formal letter from Porsche Cars North America to
  all 991.1 GT3 owners following a Concerned Owners Group meeting
  attended by Dr. Frank-Steffen Walliser of Porsche Motorsport
  [P9-LETTER, CARBUZZ-FF, AUTOEVOL-FF, PH-FF]. Note on tier
  evidence: the warranty-extension terms (10yr/120k, transferable,
  covering all internal engine components) are sourced via Tier-C
  reproduction and reporting of the Porsche-issued PCNA letter; no
  independent Tier-A or named-Tier-B technical page covering the
  warranty extension surfaced in catalog research. The cross-source
  consistency of the letter's reproduction across multiple Tier-C
  sources, plus the fact that those sources cite Porsche AG's
  formal statement directly, gives the underlying terms
  manufacturer-acknowledged status — but the structural caveat is
  documented here in the source anchor for transparency. The
  extension is global, transferable, and applies to all internal
  engine components (broader in scope than just the finger
  follower and camshaft). Porsche has not published a population-
  level FF failure rate; the warranty extension itself is the
  manufacturer's acknowledgement that the rate is non-trivial.

failure_correlation: mixed
# 2014 recall was a manufacturing defect uncorrelated with mileage
# or use. Finger-follower wear correlates loosely with mileage and
# track use, but documented failures span low-mileage road cars to
# high-mileage cars; the underlying cause is an inclusion in the
# DLC surface of specific batches of finger followers (an
# manufacturing-batch issue, not a wear issue per se), which
# Porsche resolved via a revised camshaft and finger-follower
# design.

retrofit_available: yes
retrofit_kit_names:
  - "Porsche revised engine assembly with new connecting rod bolts (2014 recall fix; installed by Porsche dealers under campaign AE01 / NHTSA 14V-090)"
  - "Porsche revised camshafts and finger followers (2017 campaign fix; installed under the 10yr/120k engine-internals warranty extension when failure pattern is identified)"
# No aftermarket FF or camshaft retrofit is currently in market;
# specialist community (Dundon Motorsports and others) has
# discussed solid-lifter conversions but these have not surfaced as
# a shipping product.

keywords_addressed:
  - "engine replaced under recall"
  - "AE01 recall"
  - "14V-090"
  - "NHTSA 14V-090"
  - "GT3 engine replacement"
  - "finger followers replaced"
  - "FF replacement done"
  - "camshafts and finger followers replaced"
  - "engine replaced under FF warranty"
  - "Porsche extended engine warranty"
  - "engine replaced by Porsche"
  - "G-coded engine"
  - "engine code G"
  - "post-recall replacement engine"

keywords_concerning:
  - "original 2014 engine"
  - "original engine still installed"
  - "FF warranty expired"
  - "engine code E"
  - "engine code F"
  - "E-coded engine"
  - "F-coded engine"
  - "no FF inspection"
  - "warranty extension expired"
  - "out of FF warranty"

keywords_active_problem:
  - "misfire at high revs"
  - "misfire above 7000"
  - "high RPM misfire"
  - "engine fire"
  - "engine seized"
  - "metal in oil"
  - "FF wear detected"
  - "finger follower wear"
  - "camshaft wear"
  - "loss of power at high RPM"
  - "power drop above 7000"

keywords_documented:
  - "Porsche recall completion certificate"
  - "AE01 completion"
  - "FF replacement invoice"
  - "engine replacement invoice"
  - "Porsche service record G-code"
  - "PIWIS engine code report"

evidence_basis: manufacturer_acknowledged
sources:
  - "[NHTSA-RCRIT] NHTSA — Recall Campaign 14V-090 RCRIT (mirrors Porsche TIS 20/14 ENU AE01, the engine replacement procedure for the 2014 GT3 recall). Tier A"
  - "[NHTSA-RCONL] NHTSA — Recall Campaign 14V-090 RCONL (owner notification). Tier A"
  - "[SPRINT-RECALL] Sprint Motorsports — Porsche Replacing Engine in the 911 GT3 (specialist write-up of the 2014 recall, ~785 cars worldwide and ~400 in the US). Tier B"
  - "[CALLAS-RR] Callas Rennsport — 2014 GT3 Engine Failures technical writeup (specialist analysis of rod-bolt failure mechanism). Tier B"
  - "[P9-LETTER] Planet-9 Forum — 991.1 GT3 Engine Warranty Enhancement (PCNA letter text quoted in full; covers all internal engine components for 10yr/120k). Tier C"
  - "[CARBUZZ-FF] Carbuzz — Porsche extends warranty for 991.1 911 GT3 to 10 years and 120,000 miles (2017). Tier C"
  - "[AUTOEVOL-FF] AutoEvolution — Porsche offers 120,000-mile / 10-year warranty for 991.1 GT3 engines (2017; documents COG meeting and Dr. Walliser presentation). Tier C"
  - "[REN-FF] Rennlist — 991.1 GT3 Porsche Engine Support Post Extended Warranty (specialist community discussion of post-warranty repair options and prices). Tier C"
  - "[PH-FF] PistonHeads — Porsche give 10 year 120k warranty on exploding GT3 engines (full Porsche statement quoted). Tier C"

editorial_note: |
  The 991.1 GT3 (2014–2016 model years) is the single most
  campaign-laden engine in the modern Porsche flat-six lineup.
  Two separate Porsche-acknowledged actions touch it: the 2014
  rod-bolt recall replaced every 2014 MY GT3 engine globally
  (Porsche told owners to stop driving the cars until replacement
  engines were available); the 2017 finger-follower warranty
  extension covers the internal engine for 10 years and 120,000
  miles, transferable to subsequent owners.

  Two practical implications for buyers. First, on a 2014 MY GT3,
  the engine should be the post-recall replacement — confirm via
  Porsche service records or a PIWIS engine-code readout. Specialist
  community convention treats engine-code letter G as the post-fix
  marker, with E and F engines as pre-fix; this convention is not
  a Porsche-published statement and should be verified with the
  dealer rather than relied on as a community shorthand. Second, on
  any 991.1 GT3 (2014, 2015, or 2016), confirm that the 10-year /
  120,000-mile engine warranty extension is still active by
  in-service date — for 2014 and 2015 cars this window is
  approaching expiry, and the cost spread between an in-warranty
  failure (Porsche's cost) and an out-of-warranty failure (owner's
  cost, potentially substantial) is the most important financial
  variable for buyers of these cars.

  Porsche's official statement is explicit that the FF wear issue
  is limited to the GT3 (3.8L MA175); the GT3 RS (4.0L MA176) and
  the 911 R are not affected. A buyer evaluating those variants
  should not apply this flag.

  This record does not apply to 991.2 GT3 (2017+), 992 GT3, or
  any other 9A1/9A2/9A3-family car. The 991.2 and 992 GT3 engines
  use revised valvetrain components.

buyer_questions:
  - "Has the engine been replaced under the 2014 GT3 recall (AE01 / NHTSA 14V-090)? Can you provide the Porsche service record showing campaign completion?"
  - "What is the engine code letter (E, F, or G)? Has a PIWIS readout been performed at recent service?"
  - "Has any finger-follower or camshaft work been performed under the 2017 warranty extension? Are invoices available?"
  - "When does the 10-year / 120,000-mile engine warranty extension expire (in-service date plus 10 years, or 120,000 miles, whichever comes first)?"
  - "Are there any current or recent high-RPM misfire codes, or any reports of power loss above approximately 7,000 RPM?"
```

---

## Defect: 9A1-family DFI intake-valve carbon buildup (high-mileage service item)

```yaml
id: 9a1_family_dfi_intake_valve_carbon_buildup
flag_title: "9A1-family DFI intake valves — carbon buildup at high mileage"
description: |
  Direct fuel injection (DFI) sprays fuel into the combustion
  chamber rather than past the back of the intake valve, which
  removes the gasoline-wash that historically kept port-injected
  intake valves clean. Over time, oil mist from the crankcase
  ventilation system condenses on the back of the hot intake
  valves and bakes into a hard carbon deposit. On 9A1 engines
  (997.2, 991.1, 987.2, 981) the phenomenon is real but specialist
  and forum consensus is that 9A1 engines are notably less
  affected than peer-marque DFI engines (VW/Audi 2.0T, BMW N54,
  Mazda Skyactiv, Audi 4.2 FSI). The standard remediation is
  walnut-shell media blasting of the intake ports with the
  manifold removed.

applicability:
  generation: [997.2, 991.1, 987.2, 981]
  engine_family: [9A1]
  year_range: [2009, 2016]
  excludes:
    - description: "991.1 GT3 / GT3 RS / 911 R (4.0L MA175/MA176 GT variants) operate at higher oil temperatures and are less subject to crankcase-ventilation-driven valve deposits; community walnut-blasting reporting on these GT engines is not specialist-documented at the v1 evidence bar. Out of scope for v1; reconsider if specialist coverage emerges."
      trim_category: [GT3, GT3_RS, 911_R]
    - description: "9A2 / 991.2 turbocharged flat-six and 9A3 / 992-generation flat-six are out of scope for v1 absent specialist sources documenting the same phenomenon on those engines. Both have different airpath dynamics and different crankcase ventilation architectures from the 9A1; whether the older pattern persists is not yet documented at the catalog evidence bar. Reconsider if Tier-B specialist coverage of 9A2 or 9A3 carbon buildup surfaces."
      generation: [991.2, 992.1, 992.2]
      engine_family: [9A2, 9A3]

severity: low
# Drivability impact at the high-mileage end (loss of high-RPM
# power, rough cold idle); not catastrophic; remediation is a
# scheduled service procedure rather than a repair. Severity
# below the M96/M97 IMS / bore-scoring tier by a wide margin.

# cost_range_usd: omitted. Walnut blasting service pricing for
# 9A1-family Porsches is not Tier-A- or Tier-B-published in any
# source surfaced for this record; specialist shops describe the
# procedure but pricing references in available material are
# Tier-C owner reports rather than published Tier-B specialist
# rates. Per catalog principle that Tier C is never sole source
# for a cost claim, both cost_range_usd and cost_source_anchor are
# omitted at v1. Editorial note below frames the cost qualitatively
# (manifold-off labor at specialist shop rates, plus media and
# gaskets). If a Tier-B specialist publishes pricing in a future
# pass, this record can be updated.

prevalence_rate: "uncommon to common at high mileage; less prevalent than peer-marque DFI engines per specialist and community consensus"
prevalence_source_anchor: |
  Specialist FCP Euro walnut-blasting reference [FCP-WB] documents
  the procedure as a recurring service item across the
  direct-injection engine population, with a recommended initial
  cleaning around 25,000 to 50,000 miles on a generic DI car and
  a 40,000-to-50,000-mile interval thereafter — establishing that
  the phenomenon is real on the platform and that Porsche-
  specialist shops (Germany's Best Inc. service-page documentation
  [GBI-WB], Porschify, others) offer the procedure as a known
  Porsche service. The 9A1-specific qualitative consensus —
  that the 9A1 motor is less carbon-affected than VW/Audi 2.0T,
  BMW N54/N55, and similar peer-marque DFI engines — is
  established across the Rennlist 991 cleaning-intake thread
  [REN-CLEAN] and Planet-9 walnut-blasting threads [P9-WB,
  P9-981CS-WB]. Owner walnut-blasting documentation on Planet-9
  shows visible carbon at 42,000 miles (69,000 km) on one car
  and continued accumulation through 211,000 miles on another.
  No Tier-A Porsche AG prevalence figure exists; the qualitative
  prevalence framing here is anchored on Tier-B specialist
  service-offering documentation (the procedure is a recognized
  Porsche-specialist service, indicating the pattern is real on
  the platform) plus consistent qualitative Tier-C community
  framing (the pattern is less prevalent on 9A1 than on
  peer-marque DFI engines). Treat this as a high-mileage
  maintenance flag rather than a prevalence-quantified defect.

failure_correlation: mileage
# Carbon accumulation is mileage-driven, with an oil-temperature
# and short-trip-frequency amplifier. Deposits are progressive,
# not stochastic; a high-mileage car that has not had walnut
# blasting performed is more likely to benefit from it than a
# low-mileage car or a track-driven car running hot oil.

# typical_failure_mileage: omitted. Specific mileage thresholds
# for preventative walnut blasting are surfaced in the catalog
# source pool only as community-recommended intervals (Rennlist
# 991 thread [REN-CLEAN] and Planet-9 [P9-WB, P9-981CS-WB] cite
# owner-experience-based intervals) plus a generic-DI Tier-B
# recommendation in [FCP-WB] that is not Porsche-specific. No
# Porsche-specialist Tier-B mileage anchor specific to 9A1
# exists. Per catalog principle, the structured field is left
# empty rather than populated; the editorial note below
# describes the high-mileage / short-trip-amplified pattern
# qualitatively.

retrofit_available: preventive_only
retrofit_kit_names:
  - "Walnut-shell media blasting service (manifold-off, performed by Porsche specialist shops; not a single-vendor product but a procedure with multiple specialist providers)"
  - "Aftermarket oil catch can systems (preventative; no specific Porsche-applicability brand documented in the catalog source pool, but mentioned in [P9-WB] as a preventative measure to reduce oil mist reaching the intake)"
# No retrofit modification eliminates DFI carbon at the
# manufacturing level; Porsche has not retrofitted port
# injection or dual injection on any 9A1-family engine.

keywords_addressed:
  - "walnut blasting performed"
  - "intake valves cleaned"
  - "carbon cleaning done"
  - "media blasted intake"
  - "DFI carbon clean"
  - "intake manifold off carbon clean"
  - "valve cleaning service"
  - "preventative carbon service"

keywords_concerning:
  - "no carbon cleaning performed"
  - "valve cleaning never done"
  - "high mileage, original valves"
  - "DFI carbon never addressed"

keywords_active_problem:
  - "loss of power at high RPM"
  - "rough cold start"
  - "rough idle when cold"
  - "stumble at high revs"
  - "flat spot at high RPM"
  - "power drop above 7000"

keywords_documented:
  - "walnut blasting invoice"
  - "carbon cleaning invoice"
  - "intake service records"

evidence_basis: specialist_consensus
sources:
  - "[P9-WB] Planet-9 forum — Walnut blasting of intake ports thread (DIY 9A1 owner walnut-blasting writeup with photos of carbon at 42,000 miles / 69,000 km). Tier C"
  - "[P9-981CS-WB] Planet-9 forum — Before and after walnut blasting on 211,000-mile 981 Cayman S thread (high-mileage 9A1 walnut-blasting case with photographic before/after documentation). Tier C"
  - "[REN-CLEAN] Rennlist 991 forum — Cleaning intake? thread (specialist community consensus that the 9A1 motor shows less carbon accumulation than Audi DI engines). Tier C"
  - "[FCP-WB] FCP Euro — Walnut Blasting walkthrough (MK7 GTI specific; cited here for generic-DI mileage-interval framing only — not Porsche-specific documentation). Tier B"
  - "[GBI-WB] Germany's Best Inc. — Professional Porsche Intake System Cleaning service page (Oakland, CA Porsche specialist describing walnut blasting on Porsche DFI engines). Tier B"
  - "[PEL-DFI] Pelican Parts — generic DFI carbon-cleaning technical content (industry-wide DI mechanism, Pelican-recommended walnut blast procedure). Tier B"
  - "[MFM-WB] Macan forum — practitioner thread describing the walnut blasting procedure at approximately three hours per job (cross-engine practitioner experience referenced for 9A1 applicability; URL not catalog-verified at v1). Tier C"

editorial_note: |
  This is a high-mileage maintenance flag, not a catastrophic
  failure mode. On lower-mileage 9A1 cars, this can typically
  be disregarded by a buyer evaluating the car. On higher-mileage
  cars, especially those with a predominantly short-trip
  ownership history (which amplifies oil-mist deposition),
  walnut blasting is a reasonable preventative service that
  pays for itself in restored high-RPM power and reduced
  cold-start roughness. Specialist and community consensus is
  that the 9A1 family is notably less carbon-affected than
  peer-marque DFI engines — a documented walnut blast on a
  high-mileage 9A1 is a positive maintenance signal, not an
  indicator that the engine had a serious problem.

  This record is not a substitute for an oil-air separator
  inspection, which interacts with carbon accumulation by
  way of the crankcase ventilation system that delivers oil
  mist to the intake. A failing AOS will accelerate carbon
  formation. The catalog does not currently carry a 9A1-family
  AOS record; the 9A1 AOS architecture differs materially from
  the M96/M97 AOS covered in file 01, and 9A1 AOS failure
  rates are not specialist-quantified at the v1 evidence bar.

  Track-driven 9A1 cars (high oil temperatures, frequent
  high-RPM operation) typically show less carbon buildup than
  street-driven equivalents per community owner reporting on
  the platform. This is an unusual case in the catalog where
  track use reduces a failure-mode rate rather than amplifying
  it.

buyer_questions:
  - "Has walnut blasting / intake carbon cleaning been performed? At what mileage and by which shop?"
  - "Is there an oil catch can installed, and if so, when was it added?"
  - "Has the air-oil separator been inspected or replaced? (Independent of carbon buildup, AOS failure accelerates carbon formation.)"
  - "Has the car shown any high-RPM power loss, rough cold start, or flat-spot symptoms above approximately 5,000 RPM?"
```

---

## What is NOT a flagged defect on 9A1 / 9A2 / 9A3 engines

Parallel to file 02's Mezger treatment, this section documents the
absence of M96/M97 failure modes on this engine family. The negative
information is buyer-relevant: a 991.1 Carrera S and a 997.1 Carrera
S are not equivalent reliability propositions, and a buyer cross-
shopping water-cooled 911s should understand that the 9A1 family
resolves most of the M96/M97 catastrophic-failure-mode landscape.

- **No IMS bearing concern.** The 9A1 has no intermediate shaft.
  Camshaft drive is direct via a primary chain off the crankshaft.
  There is nothing equivalent to the M96/M97 IMS bearing to fail.
  LN Engineering's 9A1 product documentation [LN-9A1] confirms
  the architectural change explicitly: the elimination of the
  intermediate shaft is one of the central design changes
  introduced when the 9A1 replaced M96/M97 in 2009. LN's
  knowledge-base IMS bearing-type guide [LN-IMS-DOCS] adds that
  models from the late-2008 styling revision onward use the 9A1
  engine and have no intermediate shaft or IMS bearing.

- **No Lokasil bore-scoring failure mode of the M96/M97 form.**
  The 9A1 family uses revised cylinder construction (closed-deck
  Alusil block on most variants per [LN-9A1]) and an oiling
  architecture change that eliminates the oil-starvation pathway
  documented as contributing to M96/M97 bore scoring. LN
  Engineering describes the 9A1 oiling change as a vastly improved
  wet sump on most variants (with true dry sump on some later
  variants) that resolves the oil-starvation issues common in
  M96/M97 engines. Community and specialist reporting on 9A1 cars
  has not produced a bore-scoring failure pattern equivalent to the
  M96/M97 case — i.e., the catalog has not surfaced specialist
  documentation of an aggregated 9A1 bore-scoring incidence study.
  The architectural inference is well-supported; the absence of an
  equivalent failure-pattern literature is consistent with that
  inference.

- **No M96/M97-form rear main seal weeping pattern.** The 9A1
  rear-main-seal architecture differs from M96/M97 and does not
  exhibit the chronic weeping that file 01 documents. Pelican
  Parts' 996/997 common-engine-problems article [PEL-996-997]
  notes that M96/M97 RMS leaks were partially traced to
  intermediate-shaft-cover seal failures (not the rear main seal
  itself); with the IMS architecture eliminated on the 9A1, that
  contribution is gone. RMS leakage can occur on any flat-six
  with sufficient age; the M96/M97-pattern catastrophic case
  does not apply.

- **No catastrophic AOS failure pattern of the M96/M97 form.**
  The 9A1 crankcase ventilation architecture differs from
  M96/M97. AOS service is occasionally needed on high-mileage
  9A1 cars (cross-reference to file 01 record 4 for the
  M96/M97 mechanism, with the caveat that the 9A1 architecture
  is different). 9A1-specific AOS failure rates are not
  specialist-quantified at the v1 evidence bar; if specialist
  coverage emerges, a 9A1 AOS record could be added in v2.

For runtime matcher behavior, this means a 9A1 / 9A2 / 9A3 car
must NOT have IMS / bore scoring (M96/M97 record) / RMS (M96/M97
record) / AOS (M96/M97 record) / Variocam tensioner (M96/M97
record) flags returned by applicability lookups. The `excludes`
blocks on the file 01 records carrying `engine_family: [9A1,
9A2, 9A3]` enforce this on the file 01 side; this file does
not need a counter-direction excludes block because it does
not author parallel records.

---

## Cross-references to file 99 (shared water-cooled era)

Two file 99 records apply to 9A1 / 9A2 / 9A3 cars and should be
returned by the matcher for any in-scope listing:

- **File 99 — Secondary Air Injection (SAI).** Per file 99
  applicability, SAI applies to 9A1 cars on a port-side-hardware-
  only basis. The pump, change-over valve, vacuum-operated air
  valve, check valve, and electric pneumatic valve hardware
  remain in scope on 9A1 cars and can fail in the same component-
  level patterns documented in file 99. The head-port carbon-
  clogging mode that drives the high-end of the M96/M97 cost
  range is NOT documented as transferring to 9A1 cylinder-head
  geometry; SAI failures on 9A1-family cars are pump-and-valve-
  weighted rather than port-weighted, similar to the Cayenne V8
  pattern. See file 99 record 1 for the canonical content and
  cost spread.

- **File 99 — Ignition coils.** Coil pack failure is universal
  across the water-cooled era and applies to 9A1 / 9A2 / 9A3
  cars on the mileage interval documented in file 99. The
  bore-scoring secondary-risk linkage that file 99 calls out is
  materially weaker on 9A1+ engines because the bore-scoring
  failure mode itself is less prevalent on these engines (see
  "What is NOT a flagged defect" above); on 9A1 family, coil
  failure is closer to pure service. See file 99 record 2 for
  the canonical content and the source-anchored mileage range.

---

## Considered and not included

The following items came up in the sourcing review and were
considered for inclusion but did not meet the bar for a flagged
defect record at this stage. Documented here for transparency and
to prevent the same scoping debate from recurring on future passes:

- **991.2 (early build, MY 2017 to early MY 2018) coolant pump
  failure.** Substantial owner-reported pattern (Rennlist 991.2
  Water Pump Failures thread, 6SpeedOnline water pump reliability
  thread, PCGB water pumps thread, Carpokes early-build thread)
  documenting frequent pump failures on early 991.2 builds at low
  mileage, often replaced under Porsche goodwill / CPO coverage.
  Pelican Parts' 991 coolant pump replacement article confirms
  the two failure modes (plastic impeller breakup; bearing
  failure). Per project-state file plan, 991-generation cooling
  is scoped to file 18 (Cooling Systems v2), parallel to file
  12's ownership of 996/997/986/987 water pump rather than file
  01. Authoring this record in file 13 would pre-empt that
  organization.

- **992 PADM (active engine mount) sensor failure / water
  ingress on 2019–2020 builds.** Documented at PorscheMania
  [PMANIA-992] (description of an early-build sealing issue
  allowing water ingress into the active engine mounts and
  electrically tripping the sensor) and what-breaks.com
  [WB-DKKA] (active engine mounts losing damping function due
  to sensor failure, with the sensor isolated as the failure
  point in the large majority of cases) — both Tier C per
  catalog tier discipline (enthusiast publication and
  reliability aggregator respectively). Porsche has issued a
  TSB and recall, with engine-out repair required, providing
  Tier-A manufacturer-acknowledged confirmation. Engine
  mounts are physically attached to the engine but functionally
  a chassis / vibration-control component. Per project-state
  file plan, chassis v2 (file 20) is the better organizational
  home, alongside the file-10 deferred items for 991/992 LCA
  and similar.

- **991 / 992 change-over valve (COV) failures and phantom
  cooling system fault (P1433).** Documented Tier-B at Kadunza
  Porsche specialist content [KAD-COV] (cooling fault often
  misdiagnosed as water pump or thermostat when root cause is
  a failed COV vacuum solenoid), with multiple Tier-C reports
  of Porsche's WC-43 servicing campaign that replaced eight COV
  solenoids on early 991 cars. The COV is an engine-bay vacuum
  control component shared across 911 / Cayenne / Panamera
  platforms, not engine-internal. Per project-state file plan,
  electrical v2 (file 21) is the better home, alongside other
  vacuum-and-electrical control items.

- **9A1 timing chain tensioner wear.** Surfaces in aggregator
  content (myenginespecs Tier-C content) but does not have
  Tier-A or Tier-B specialist quantification of prevalence or
  cost. Below v1 evidence bar; revisit if Pelican / LN
  Engineering / Hartech publishes 9A1-specific coverage.

- **9A1 oil pump failure.** Investigated against the Go-Parts
  9A1 oil pump technical reference [G-PARTS]; the specialist
  framing on that page is that pump failure on the 9A1 is rare
  and that there are no widespread recalls or known oil-pump
  defects on 2009–2016 911 / Boxster / Cayman applications.
  This is not a flagged defect; what owners occasionally
  experience is a low-oil-pressure-warning pattern that traces
  back to a TSB-related oil contamination issue and is resolved
  with an oil change rather than a pump replacement. Below v1
  bar.

- **991.2 (9A2 / MA2) intercooler water buildup.** PCarwise 911
  page mentions the issue and notes that Porsche revised the
  drain design. Single-Tier-B-source mention without specialist
  quantification. Below v1 bar; reconsider if a second specialist
  source documents the pattern with cost or prevalence.

- **DKKA-specific (992 Carrera S coupe automatic) fuel injector
  fault under launch control / Sport Boost.** Documented at
  what-breaks.com with reference to a Porsche TSB and the
  P0201–P0206 code set. Single-source Tier-B mention without
  cross-confirmation; the variant scope (one specific 992
  Carrera S sub-trim) is also too narrow for a v1 record.
  Below v1 bar; revisit if specialist or Tier-A coverage
  surfaces.

- **9A2 / 9A3 turbocharger or wastegate failures.** Surfaces in
  aggregator content (AutoNation Mobile Service common-issues
  page) without Tier-A or Tier-B quantification. The 992
  generation is generally reported as defect-light at the
  engine level across forum and TÜV-style ownership reporting,
  which is consistent with the absence of a specialist-quantified
  turbocharger failure pattern on this engine family. Below v1
  bar.

- **9A1-family AOS failure pattern.** PCarwise 911 page notes
  that AOS-failure-causing-RMS-leak patterns continue on 9A1
  and into 992. The 9A1 AOS architecture differs materially
  from the M96/M97 AOS covered in file 01, but specialist
  quantification of 9A1-specific AOS prevalence is not
  available. Below v1 bar; cross-reference framing in the
  carbon-buildup record's editorial note above prompts the
  buyer to ask about AOS service alongside walnut blasting on
  high-mileage cars.

If field experience surfaces a clear specialist consensus that
any of these warrants its own record, they can be added in a v2
pass. Several have a clear v2 home already noted (file 18, 20,
21).

---

## Sources

Full source URLs for the citations used above. Tier indicators
match the convention in the decade reference docs.

[NHTSA-RCRIT] NHTSA — Recall Campaign 14V-090 RCRIT (mirrors Porsche TIS 20/14 ENU AE01, the engine replacement procedure for the 2014 GT3 recall). Tier A.
https://static.nhtsa.gov/odi/rcl/2014/RCRIT-14V090-2676.pdf

[NHTSA-RCONL] NHTSA — Recall Campaign 14V-090 RCONL (owner notification). Tier A.
https://static.nhtsa.gov/odi/rcl/2014/RCONL-14V090-2309.pdf

[SPRINT-RECALL] Sprint Motorsports — Porsche Replacing Engine in the 911 GT3 (specialist write-up of the 2014 recall, ~785 cars worldwide and ~400 in the US). Tier B.
https://sprintmotorsports.com/porsche-replacing-engine-911-gt3/

[CALLAS-RR] Callas Rennsport — 2014 GT3 Engine Failures (specialist analysis of rod-bolt failure mechanism). Tier B.
https://www.callasrennsport.com/Files/Documents/2014-GT3-Engine-Failures.pdf

[P9-LETTER] Planet-9 Forum — 991.1 GT3 Engine Warranty Enhancement (PCNA letter text, "all internal engine components" 10yr/120k extension). Tier C.
https://www.planet-9.com/threads/991-1-gt3-engine-warranty-enhancement.212114/

[CARBUZZ-FF] Carbuzz — Porsche extends warranty for 991.1 911 GT3 to 10 years and 120,000 miles. Tier C.
https://carbuzz.com/news/porsche-extends-warranty-for-991-1-911-gt3-to-10-years-and-120-000-miles/

[AUTOEVOL-FF] AutoEvolution — Porsche offers 120,000-mile / 10-year warranty for 991.1 GT3 engines (documents COG meeting and Dr. Walliser presentation). Tier C.
https://www.autoevolution.com/news/porsche-offers-120000-mile-10-year-warranty-for-exploding-9911-911-gt3-engines-119675.html

[REN-FF] Rennlist — 991.1 GT3 Porsche Engine Support Post Extended Warranty (post-warranty repair options and specialist community pricing). Tier C.
https://rennlist.com/forums/991-gt3-gt3rs-gt2rs-and-911r/1442263-991-1-gt3-porsche-engine-support-post-extended-warranty-2.html

[PH-FF] PistonHeads — Porsche give 10 year 120k warranty on exploding GT3 engines (full Porsche statement quoted). Tier C.
https://www.pistonheads.com/gassing/topic.asp?h=0&f=230&t=1689019

[LN-9A1] LN Engineering — Nickies Lite for Boxster Cayman 987.2/981 and 911 997.2/991/991.2 with the 9A1/9A2 MA1/MA2 Engine (specialist product page documenting 9A1 architectural changes from M96/M97: closed-deck Alusil block, direct injection, elimination of intermediate shaft, vastly improved wet-sump oiling on most variants with true dry-sump on some later variants; resolves M96/M97 oil-starvation pathway). Tier B.
https://lnengineering.com/products/watercooled-porsche-cylinders-sleeves-and-pistons/9a1-2009-boxster-cayman-911/

[LN-IMS-DOCS] LN Engineering Knowledge Base — 2005-2008 Porsche IMS Bearing Type by Engine Serial Number (confirms that models from late 2008 onward use the 9A1 engine and have no intermediate shaft or IMS bearing). Tier B.
https://docs.lnengineering.com/article/32-2005-2008-porsche-ims-bearing-type-by-engine-serial-number

[G-PARTS] Go-Parts — Porsche 911, Boxster & Cayman (2009-2016) 9A1 Engine Oil Pump: Failure, Diagnosis & Buying Used (auto-parts marketplace technical reference; retained as supporting reference for the negative claim that 9A1 oil-pump failure is rare in the considered-and-not-included section). Tier C.
https://www.go-parts.com/garage/engine-oil-pump-porsche-911-porsche-boxster-porsche-cayman-2009-2016

[PEL-DFI] Pelican Parts — generic DFI carbon-cleaning content (Pelican-recommended walnut blast procedure for Porsche DFI engines). Tier B.
(Reference content surfaced via Pelican forum thread on water-cooled DFI carbon; standalone Pelican tech article URL not catalog-cited as a single anchor — Pelican's role here is the procedure documentation referenced by multiple specialist shops.)

[GBI-WB] Germany's Best Inc. — Professional Porsche Intake System Cleaning (Oakland, CA Porsche specialist describing walnut blasting on Porsche DFI engines). Tier B.
https://germanysbestinc.com/professional-porsche-intake-system-cleaning-in-oakland

[REN-CLEAN] Rennlist 991 forum — Cleaning intake? thread (specialist community consensus that the 9A1 motor shows less carbon accumulation than Audi DI engines). Tier C.
https://rennlist.com/forums/991/1350016-cleaning-intake.html

[P9-WB] Planet-9 forum — Walnut blasting of intake ports thread (DIY 9A1 owner walnut-blasting writeup with photos of carbon at 42,000 miles / 69,000 km). Tier C.
https://www.planet-9.com/threads/walnut-blasting-of-intake-ports.251094/

[P9-981CS-WB] Planet-9 forum — Before and after of walnut blasting / carbon cleaning on 211,000-mile 981 Cayman S thread (high-mileage 9A1 walnut-blasting case). Tier C.
https://www.planet-9.com/threads/before-and-after-of-walnut-blasting-carbon-cleaning-on-211-000-mile-981-cs.255957/

[FCP-WB] FCP Euro — Walnut Blasting walkthrough (MK7 GTI specific; cited here for generic-DI mileage-interval framing only — not Porsche-specific documentation). Tier B.
https://www.fcpeuro.com/blog/how-to-carbon-clean-walnut-blast-intake-valves-mk7-gti

[MFM-WB] Macan Forum — Direct Injection = Gunk on Intake Valves? thread (cross-engine practitioner experience referenced for 9A1 applicability; URL not catalog-verified at v1 — kept as descriptive citation, no URL claimed). Tier C.

[KAD-COV] Kadunza — The Owner's Guide to Porsche Vacuum System Failures (specialist content on COV-failure-mimicking-water-pump-failure pattern; 991/718 platform applicability). Tier B.
https://kadunza.com/the-owners-guide-to-porsche-vacuum-system-failures-from-diagnosis-to-definitive-repair/

[PEL-996-997] Pelican Parts — Porsche 911 Carrera Common Engine Problems 996 / 997 (M96/M97 RMS-and-IMS-cover discussion referenced for the absence-of-failure-mode-on-9A1 framing). Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/13-ENGINE-Common_Engine_Carrera_Problems/13-ENGINE-Common_Engine_Carrera_Problems.htm

[PCW-911] PCarwise — Porsche 911 Common Problems (referenced in considered-and-not-included for AOS-on-9A1+ qualitative framing and 991.2 MA2 intercooler water buildup mention). Tier B.
https://www.pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/

[PMANIA-992] Porsche Mania — The 4 Most Common Porsche 992 Engine Problems (enthusiast publication; referenced in considered-and-not-included for 992 PADM water-ingress description). Tier C.
https://porsche-mania.com/porsche-992-engine-problems/

[WB-DKKA] what-breaks.com — Porsche Carrera S 992 (DKKA) common problems and reliability (reliability aggregator; referenced in considered-and-not-included for DKKA injector and 992 PADM mentions). Tier C.
https://what-breaks.com/porsche/911-992/carrera-s-dkka-331kw-automatic-coupe/
