# 04 — Engine Defects: Transaxle Four-Cylinder Family (924 / 944 / 968)

The transaxle four-cylinder family covers Porsche's water-cooled,
front-engine inline-four cars produced from 1976 to 1995. Three engine
groups are in scope:

- **924 (Audi-derived 2.0L, 1976–1985)** — the original 924 used an
  Audi-sourced 2.0L inline-four (with a 924 Turbo / 931 variant
  1980–1982). Different engine from the 944 mechanically. The 924
  Turbo (931) is an interference engine like the M44 cars; the
  naturally aspirated base 924 (1976–1985) is widely considered
  non-interference by specialist sources, though parts-catalog data
  is mixed and the question is debated. The base 924 NA is therefore
  scoped out of the catastrophic-severity timing belt record below
  and noted separately in the "Considered and Not Included" section.
- **944 family (Porsche M44, 1982–1991)** — Porsche's own 2.5L (later
  2.7L S2 3.0L) inline-four with twin balance shafts. Used in the 944
  base (M44/01), 944 Turbo / 951 (M44/51, M44/52), 944S (M44/40), and
  944S2 (M44/41).
- **924S (1987–1988)** — uses the 944's M44/02 engine. Belongs in this
  file alongside the 944 cars even though it carries the 924 nameplate.
- **968 (1992–1995)** — 3.0L M44/43 inline-four, the final evolution
  of the M44 family. Inherits all 944-era belt-system upgrades plus a
  928-derived tensioner that meaningfully reduces failure rates.

This file contains three flagged defects: timing belt service neglect
(catastrophic engine destruction on belt failure for interference
engines), water pump failure tied to the same service interval, and
torque tube bearing failure (age-driven, shared across the entire
924/944/968 transaxle architecture). A "considered and not included"
section at the end documents items deliberately omitted with their
rationale.

---

## Defect: Timing belt service neglect

```yaml
id: transaxle_4cyl_timing_belt_service
flag_title: "Timing belt service interval"
description: |
  The 924 Turbo (931), 944 family (944, 944 Turbo, 944S, 944S2), 924S,
  and 968 are all interference engines. If the rubber timing belt
  breaks or skips teeth, the valves and pistons collide and the engine
  destroys itself. The belt is a wear item with a defined replacement
  interval; the most important pre-purchase question on any of these
  cars is whether belt service is current. The naturally aspirated base
  924 (1976–1985, Audi-derived 2.0L) is widely considered
  non-interference and is scoped out of this record — see the
  "Considered and Not Included" section.

applicability:
  generation: [924_Turbo, 944, 944_Turbo, 944S, 944S2, 924S, 968]
  engine_family: [Audi_2_0_924_Turbo, M44]
  year_range: [1980, 1995]
  trim_category: [924_Turbo, 924S, 944_base, 944_Turbo, 944S, 944S2, 968_base, 968_Cabriolet, 968_Sport]
  excludes:
    - description: "Naturally aspirated base 924 (1976–1985) uses the Audi-derived 2.0L engine, which is widely characterized as non-interference by specialist sources (Honest John, Rennlist 924/944 forum specialists). Belt failure on this engine is typically a no-start condition rather than catastrophic engine destruction. Parts-catalog data on the interference question is mixed; this record applies the conservative scoping and routes the base 924 NA out. A buyer should still ask about belt history on a base 924 — failure is a roadside event regardless — but the severity tier here does not apply."
      trim_category: [924_base]
      engine_family: [Audi_2_0_924]
    - description: "Air-cooled 911s, 928 V8s, and water-cooled flat-six engines (M96/M97/Mezger/9A1+) use different engine architectures and are out of scope. The 924 GTS and 924 Carrera GT racing variants are mechanically related but rare enough to be out of catalog scope."
      engine_family: [aircooled_flat_6_pre_carrera, aircooled_flat_6_magnesium_case, aircooled_flat_6_aluminum_case, M28_V8, M96, M97, Mezger, 9A1, 9A2, 9A3]

severity: catastrophic
# Belt failure on an interference engine destroys the engine. Atlantic
# Motorcar Center [AMC1] characterizes the result as bent valves and
# potentially damaged pistons, requiring engine teardown for repair.

cost_range_usd: [800, 2000]
cost_source_anchor: |
  Atlantic Motorcar Center's 944 timing belt service article [AMC1]
  describes the proper service scope as a comprehensive job that
  bundles the timing belt, balance shaft belt, tensioners, water pump
  with updated guide rail and outlet block-off plate, and related seals
  — performed at room temperature with Porsche's specialty tensioning
  tool. Specialist labor for the bundled job typically falls in the
  high-three-figure to low-four-figure range at independent shop rates
  with parts; standalone belt-only replacement is cheaper but is widely
  considered an incomplete service. The cost of NOT performing the
  service on schedule (engine teardown, valve replacement, possible
  piston work) starts in the mid-four-figure range and easily exceeds
  the value of many cars in this family. Forum-reported figures from
  944 owners on Pelican Parts and Rennlist forums [PEL-T1] are
  consistent with this Tier B reasoning and are noted as a consistency
  footnote.

prevalence_rate: "near-universal as a service requirement; failures are uncommon when the schedule is followed"
prevalence_source_anchor: |
  PCA Tech Q&A [PCA-TB1] establishes through George Beuselinck's
  responses (reproducing Bruce Anderson's recommendations) that the
  944's timing belt issue is fundamentally one of adjustment
  specifications and maintenance rather than of inherent unreliability:
  belt failures are very few when the service is properly performed,
  and most early belt failures occurred on cars that had never had the
  required readjustment. The 968 specifically benefits from all 944
  upgrades plus a 928-style tensioner and shows lower failure rates,
  per PCA Tech Q&A [PCA-TB2]. The buyer-due-diligence framing is
  therefore "is service current and properly performed" rather than
  "does this engine fail" — the answer to the second question is "no,
  if maintained correctly." Prevalence applies to the service
  requirement itself, which is universal across the engine family.

failure_correlation: mixed
# Service is mileage-driven primarily but specialists also recommend a
# calendar interval (3-5 years per Atlantic Motorcar [AMC1]; 6 years
# per PCA's George Beuselinck for low-use cars [PCA-TB3]). Cars driven
# rarely with old belts are at high risk despite low mileage.

typical_failure_mileage: [30000, 60000]
typical_failure_mileage_source_anchor: |
  PCA Tech Q&A [PCA-TB1] documents the recommended replacement interval
  spread: Bruce Anderson historically recommended 30,000 miles with
  re-tensioning at 1,000–2,500 miles after replacement and re-checks
  every 10,000 miles thereafter. Porsche's later official position
  recommended 45,000 miles with checks every 15,000 miles. Atlantic
  Motorcar [AMC1] uses 30,000 miles plus a 3–5 year time cap. PCA's
  George Beuselinck recommends 30,000 miles for both 8-valve and
  16-valve cars [PCA-TB3]. The 30,000–60,000 mile range used here
  spans Anderson's conservative recommendation through Porsche's later
  official figure; the upper bound is at the boundary of where multiple
  specialists consider replacement overdue.

typical_failure_age_years: [3, 6]
typical_failure_age_source_anchor: |
  Atlantic Motorcar Center [AMC1] establishes a 3-5 year time cap
  alongside the mileage interval, citing rubber deterioration
  independent of use. PCA Tech Q&A [PCA-TB3] cites George Beuselinck's
  recommendation to change at 6 years for cars not driven much. The
  3-6 year range used here brackets these specialist recommendations.

retrofit_available: preventive_only
retrofit_kit_names:
  - "Porsche updated belt set with revised tensioner (current part progression: belt 944.105.157.04 et seq.)"
  - "Porsche 951 water pump with guide rail and outlet block-off plate (944 service upgrade)"
  - "Porsche specialty belt tensioning tool 9201 (required for correct service)"

keywords_addressed:
  - "timing belt replaced"
  - "timing belt service"
  - "timing and balance shaft belts replaced"
  - "belt and water pump done"
  - "full belt service"
  - "water pump and belts"
  - "tensioner replaced"
  - "belt service with tool 9201"
  - "Porsche specialty tool used"

keywords_concerning:
  - "timing belt due"
  - "belt service overdue"
  - "belts not addressed"
  - "unknown belt history"
  - "no belt service records"
  - "belt service deferred"

keywords_active_problem:
  - "timing belt broke"
  - "belt snapped"
  - "bent valves"
  - "engine destroyed"
  - "tensioner failed"
  - "balance shaft belt failure"
  - "valve to piston contact"
  - "engine seized"

keywords_documented:
  - "belt service invoice"
  - "with full service records"
  - "complete service history"
  - "Porsche specialist invoice"
  - "PCA documentation"

evidence_basis: specialist_consensus
sources:
  - "[AMC1] Atlantic Motorcar Center — Porsche 944 and 951 Timing Belt Service. Tier B"
  - "[PCA-TB1] PCA Tech Q&A — 944 Timing Belt Change Interval (Beuselinck citing Anderson). Tier A"
  - "[PCA-TB2] PCA Tech Q&A — 1993 968 Cam Belt Replacement Interval. Tier A"
  - "[PCA-TB3] PCA Tech Q&A — 944S Timing Belt Intervals (Beuselinck). Tier A"
  - "[PCA-TB4] PCA Tech Q&A — 944 Turbo Timing Belt. Tier A"
  - "[PCA-TB5] PCA Tech Q&A — 1983 944 Timing Belt Failure (case example). Tier A"
  - "[PEL-T1] Pelican Parts Forums — 944 Timing Belt Change Interval discussion. Tier C"
  - "[REN-T1] Rennlist Forum — Timing belt tensioner failed, 8 bent valves (failure case). Tier C"
  - "[ATI1] Automotive Tech Info — German Time: Porsche 944 Timing Belts (1991 service article confirming 924S shares M44 engine). Tier B"

editorial_note: |
  This is the single most important pre-purchase question on any 924,
  944, 924S, or 968. The engine is interference, the belt is rubber, and
  if the belt fails the engine destroys itself. A car with documented
  recent belt service (within roughly 30,000 miles or 5 years, performed
  with the proper tensioning tool, including the balance shaft belt and
  water pump) is in good shape. A car with unknown or overdue belt
  history is on borrowed time regardless of how well it runs at the
  moment of inspection — failure mode is sudden. Specialist consensus
  is consistent: belts are inexpensive relative to engine rebuilds, and
  replacement on schedule is the standard approach. The 968 is somewhat
  more forgiving than the 944 because of its 928-style tensioner, but
  the same service discipline applies.

buyer_questions:
  - "When was the timing belt last replaced? At what mileage and how many years ago?"
  - "Was the balance shaft belt and water pump replaced at the same service?"
  - "Can you provide invoices for the belt service?"
  - "Was the belt re-tensioned 1,000–2,500 miles after replacement, and re-checked at the recommended interval thereafter?"
  - "Was the service performed by a Porsche specialist using the proper tensioning tool?"
```

---

## Defect: Water pump failure (tied to belt service)

```yaml
id: transaxle_4cyl_water_pump_failure
flag_title: "Water pump failure"
description: |
  The 944 family water pump is driven by the timing belt and is widely
  considered a routine service item to replace alongside belt service.
  Pump failure causes coolant loss and overheating; in severe cases,
  the pump can interfere with belt drive and contribute to belt
  failure. The standard practice is to replace the water pump every
  belt service, not as a separate event.

applicability:
  generation: [944, 944_Turbo, 944S, 944S2, 924S]
  engine_family: [M44]
  year_range: [1982, 1991]
  trim_category: [944_base, 944_Turbo, 944S, 944S2, 924S]
  excludes:
    - description: "Original 924 (Audi-derived 2.0L, 1976–1985) uses a different cooling-system architecture and is out of scope of this M44-specific record."
      engine_family: [Audi_2_0_924, Audi_2_0_924_Turbo]
    - description: "968 water pumps are reportedly more durable than 944 water pumps and many specialists do not recommend replacing them at every belt service. 968-specific buyer guidance differs from 944."
      generation: [968]

severity: high
# Pump failure can cause overheating (with consequent head warpage,
# head gasket failure) and can take the timing belt with it, leading to
# the catastrophic interference-engine failure documented in the
# timing belt record.

# cost_range_usd: omitted — almost always bundled with the timing belt
# service rather than performed standalone. The bundled cost is
# captured in transaxle_4cyl_timing_belt_service.

prevalence_rate: "common — Atlantic Motorcar [AMC1] characterizes the 944 water pump as failing more frequently than typical for water pumps generally"
prevalence_source_anchor: |
  Atlantic Motorcar Center [AMC1] documents three failure mechanisms
  for the 944 water pump — internal bearing failure (audible), impeller
  separation from shaft or shaft seal failure (causing coolant leakage),
  and pulley slip or breakage (which can cause engine failure via belt
  involvement) — and characterizes the 944 water pump as failing more
  frequently than typical for water pumps generally. The 951 water pump
  with guide rail and outlet block-off plate is the standard service
  upgrade. PCA Tech Q&A [PCA-TB1] reports that George Beuselinck has
  seen multiple cases where a failed water pump led to timing belt
  failure. 968-specific reporting on 968Forums [968F1] characterizes
  the 968 water pump as much better-built, typically lasting 100,000+
  miles and not requiring replacement at every belt service.

failure_correlation: mixed
# Bearing wear and seal degradation are mileage-and-age driven. Cars
# stored for long periods can develop seal issues even at low mileage.

retrofit_available: yes
retrofit_kit_names:
  - "Porsche 951 water pump (944 service upgrade with guide rail and outlet block-off plate)"
  - "OEM Porsche 944 water pump (later revisions with updated impeller)"

keywords_addressed:
  - "water pump replaced"
  - "water pump and belts"
  - "951 water pump installed"
  - "water pump with belt service"
  - "new water pump"

keywords_concerning:
  - "water pump original"
  - "water pump not replaced"
  - "coolant leak from front of engine"
  - "occasional overheating"
  - "minor coolant loss"

keywords_active_problem:
  - "water pump failed"
  - "pump bearing noise"
  - "water pump seizure"
  - "pump impeller separated"
  - "pump took out timing belt"

keywords_documented:
  - "water pump invoice"
  - "with belt and pump service records"

evidence_basis: specialist_consensus
sources:
  - "[AMC1] Atlantic Motorcar Center — Porsche 944 and 951 Timing Belt Service (water pump section). Tier B"
  - "[PCA-TB1] PCA Tech Q&A — 944 Timing Belt Change Interval (water-pump-induced belt failure). Tier A"
  - "[968F1] 968 Forums — Timing Belt Change Without Water Pump Change (968-specific durability). Tier C"

editorial_note: |
  On 944-family cars (944, 944 Turbo, 944S, 944S2, 924S), the standard
  service practice is to replace the water pump at every timing belt
  service, since the labor to access the pump is already required for
  the belt and pump failure can independently destroy the engine. A
  car with documented water pump replacement at the most recent belt
  service is in the ideal state. A car with an "old" water pump and a
  recent belt is an incomplete service that the buyer should ask about.
  968 is different — specialists consider the 968 pump much
  longer-lived and don't routinely replace it with every belt service.

buyer_questions:
  - "Was the water pump replaced at the most recent timing belt service?"
  - "If not, when was the water pump last replaced?"
  - "Are there any signs of coolant leakage from the front of the engine?"
  - "Has the car ever shown signs of overheating?"
```

---

## Defect: Torque tube bearing failure

```yaml
id: transaxle_4cyl_torque_tube_bearings
flag_title: "Torque tube bearings"
description: |
  The 924, 944, 968 (and 928) use a torque tube — an enclosed driveshaft
  connecting the engine to the rear-mounted transaxle. Inside the tube
  are sealed ball bearings supporting the shaft. The grease in these
  factory-sealed bearings dries out with age and the bearings begin to
  squeal or rattle, eventually failing entirely. Diagnostic signal is a
  steady screeching noise from underneath that is present at idle and
  while driving and does not diminish over time.

applicability:
  generation: [924, 924_Turbo, 944, 944_Turbo, 944S, 944S2, 924S, 968]
  engine_family: [Audi_2_0_924, Audi_2_0_924_Turbo, M44]
  year_range: [1976, 1995]
  trim_category: [924_base, 924_Turbo, 924S, 944_base, 944_Turbo, 944S, 944S2, 968_base, 968_Cabriolet, 968_Sport]
  excludes:
    description: "928 also has a torque tube and shares the same failure mode, but is covered separately in 05_engine_928_v8.md."
    engine_family: [M28_V8]

severity: moderate
# Bearing replacement is a real job (transaxle and rear suspension
# removal in the conventional method) but the failure mode is gradual
# and the car remains drivable while the noise progresses. Severe
# bearing failure can damage the shaft itself, escalating cost.

cost_range_usd: [1500, 9000]
cost_source_anchor: |
  Specialist 928-944parts [928P1] offers an in-car bearing replacement
  service (using a custom tool that avoids removing the rear axle) at
  €1,599 — the lower bound for a properly performed bearing-only fix.
  PCA Tech Q&A [PCA-TT3] documents an owner-reported dealer quote of
  approximately $9,000 for the conventional engine-out / transaxle-out
  approach with bundled clutch and flywheel work, with the same
  question's responder noting that specialist bearing replacement
  shops can substantially reduce that cost. The wide range reflects
  the spread between in-car specialist service at the low end and
  full dealer engine-out repair with bundled "while you're in there"
  work at the high end. Most specialist bearing-only jobs fall in the
  $1,500–$3,000 range; conventional engine-out service typically
  $4,000–$9,000 depending on bundled scope.

prevalence_rate: "common — described by specialists as eventual on
40+ year old cars"
prevalence_source_anchor: |
  928-944parts [928P1] characterizes torque tube bearing failure as
  age-and-mileage driven and effectively eventual on cars approaching
  40 years old, attributing the failure to dried grease in factory
  sealed bearings that cannot be re-lubricated in service. PCA Tech
  Q&A [PCA-TT2] (George Beuselinck on a 1986 944 Turbo) documents
  bearing noise as the typical torque tube failure mode and describes
  the conventional repair as requiring transaxle and full rear
  suspension removal. PCA Tech Q&A [PCA-TT1] (Bill Burris on a 1987
  944S) and [PCA-TT3] both treat the failure as an established issue
  with multiple repair paths. Augment Automotive [AUG1] and BlackSeaRD
  [BSRD1] both maintain dedicated torque tube refurbishment services
  and Super Bearings products for these cars, indicating sustained
  service demand across the specialist community.

failure_correlation: mixed
# Calendar age is the dominant factor (grease degradation), but mileage
# and use accelerate failure. Stored cars with low mileage are not
# protected because the grease dries regardless of use.

retrofit_available: yes
retrofit_kit_names:
  - "BlackSeaRD Super Bearings (premium replacement, 924S/944/968 specific)"
  - "928-944parts torque tube revision service (€1,599 in-car method)"
  - "Augment Automotive 944 / 924 Torque Tube Refurbishment service and rebuild kits"
  - "944online Torque Tube Bearing Deluxe Kit (924S, 944, 944S, 951)"
  - "Standard SKF / FAG 6006 2Z C3 or C4 sealed bearings (DIY rebuild path)"

keywords_addressed:
  - "torque tube rebuilt"
  - "torque tube bearings replaced"
  - "Super Bearings installed"
  - "BlackSeaRD bearings"
  - "torque tube refurbished"
  - "transaxle bearings replaced"
  - "928-944parts torque tube"
  - "Augment torque tube service"

keywords_concerning:
  - "torque tube noise"
  - "screeching from underneath"
  - "drive train noise"
  - "transaxle bearing noise"
  - "whirring sound"
  - "torque tube original"
  - "drivetrain rumble"

keywords_active_problem:
  - "torque tube bearing failure"
  - "loud screeching"
  - "metal-on-metal noise"
  - "bearing seized"
  - "drivetrain failure"

keywords_documented:
  - "torque tube rebuild invoice"
  - "Super Bearings invoice"
  - "specialist drivetrain service records"

evidence_basis: specialist_consensus
sources:
  - "[PCA-TT1] PCA Tech Q&A — 1987 944s Torque Tube Bearing Replacement (Bill Burris). Tier A"
  - "[PCA-TT2] PCA Tech Q&A — 1986 944 Turbo Torque Tube (George Beuselinck on bearing diagnosis and repair scope). Tier A"
  - "[PCA-TT3] PCA Tech Q&A — 924s/944 Torque Tube Rebuilder Recommendations? (dealer cost example, specialist alternatives). Tier A"
  - "[928P1] 928-944parts (Netherlands) — The Annoying Noise from Transaxle Bearings (in-car service method, €1,599). Tier B"
  - "[BSRD1] BlackSeaRD — Super Bearings product line for 924/944/968 torque tube. Tier B"
  - "[AUG1] Augment Automotive (UK) — Porsche 944 and 924 Torque Tube Refurbishment. Tier B"
  - "[CG-TT] Clark's Garage — Torque Tube Removal, Rebuilding, and Installation (DIY procedure). Tier B"
  - "[944O] 944online — Torque Tube Bearing Deluxe Kit (parts catalog). Tier B"

editorial_note: |
  Torque tube bearing failure is a near-certainty on any 924, 944, or
  968 that hasn't had the bearings serviced — the factory-sealed
  bearings dry out with age regardless of how the car is driven. The
  diagnostic signal is specific: a steady screech or whirr from
  underneath that's present at idle and during driving and that does
  not change with road speed or load in the way wheel bearings would.
  A car with documented torque tube rebuild (especially with BlackSeaRD
  Super Bearings or a specialist refurbishment) is in good shape. A car
  with a noise the seller hasn't acknowledged is a real flag — the
  failure is gradual but the repair scope ranges from a $1,500
  specialist in-car job to a $9,000 dealer engine-out bundle. Worth
  bundling with clutch service if the transaxle is opened anyway.

buyer_questions:
  - "Has the torque tube been rebuilt or had its bearings replaced? When and by which shop?"
  - "Is there any noise from underneath the car at idle or while driving — particularly a screeching or whirring sound?"
  - "If a rebuild was performed, were specialist bearings (BlackSeaRD Super Bearings or equivalent) used, or standard replacement bearings?"
  - "If the clutch has been replaced, was the torque tube serviced at the same time?"
```

---

## Considered and Not Included

The following items came up in the sourcing review and were considered
for inclusion but did not meet the bar for a flagged defect record at
this stage:

- **DME relay failure (944).** Common enough that Octoclassic [OC1]
  lists it among the four most common 944 problems, but the relay is
  inexpensive (under $50) and replacement is straightforward. Below
  the buyer-due-diligence bar — fits the "easy fix at home" category
  rather than the "ask the seller before bidding" category. Mention
  flagged here as a known item rather than as its own record.

- **Cam tensioner pad wear (944S, 944S2, 968 — 16-valve only).** Real
  on the 16-valve M44/40 and M44/41 engines. Forum-discussed and
  confirmed in PCA Tech Q&A [PCA-TB3] as a service item alongside the
  timing belt service. Captured by the timing belt record's broader
  service-history signal. May warrant its own record in v2 if catalog
  granularity increases.

- **Clutch (rubber-centered vs spring-centered).** Original-equipment
  rubber-centered clutches on early 944s degrade with age and modest
  power increases reveal the limit. Replacement with spring-centered
  is common during clutch service. Below the v1 bar — this is the
  kind of item most knowledgeable buyers will simply ask about as
  part of general clutch-condition due diligence.

- **AC evaporator (944).** Famously buried behind the dashboard and
  expensive to replace because of dash-out labor. Real and frequently
  cited by 944 owners. Considered for inclusion; deferred because it's
  a comfort-system item rather than a drivability item, and the labor
  scope (rather than the failure rate) is what makes it noteworthy.
  May be added to a future interior/HVAC file.

- **Hood release cable.** Stretches and breaks on aging 944 cars. A
  nuisance, not a flag-worthy defect.

- **Sunroof motor failures (944).** Discussed on forums but not
  consistently documented in specialist sources. Defer pending stronger
  Tier B sourcing; may revisit in a body/sunroof file.

- **Power window regulators.** Plastic guides crack with age. Routine
  age item rather than flag-worthy defect. Below the v1 bar.

- **Naturally aspirated base 924 (1976–1985) timing belt.** The base
  924 NA uses an Audi-derived 2.0L engine that is widely characterized
  as non-interference by specialist sources (Honest John classic-car
  guide, Rennlist 924/944 forum specialists in long-running threads on
  the topic). Belt failure on this engine is typically a no-start
  condition that can be addressed by replacing the belt rather than
  rebuilding the engine. Some aftermarket parts-catalog data (Gates,
  Continental) lists the 924 2.0L as an "interference engine
  application," so the question is genuinely disputed across sources
  rather than settled. The catalog applies the conservative scoping
  and treats the base 924 NA as out of scope for the
  catastrophic-severity timing belt record. A buyer should still ask
  about belt history on a base 924 — failure is at minimum a
  drivability event — but the engine-destruction severity does not
  apply. May warrant its own moderate-severity record in v2 if a
  definitive specialist source resolves the interference question.

- **Speed/reference sensor failure (944 family).** Documented as a
  no-start cause by Pelican Parts DIY articles and Clark's Garage.
  Comparable in scope to the DME relay (diagnostic problem,
  inexpensive fix, below the buyer-due-diligence bar). May add to a
  shared "diagnostic and electrical items" file if catalog scope
  expands.

- **924 / 924 Turbo specific issues outside the timing belt.** The
  Audi-derived 2.0L has its own quirks (CIS fuel injection
  maintenance, K-Jetronic specifics, Audi-sourced parts availability)
  but these are general age-and-maintenance items rather than
  specific catalog-flag defects. The 924 Turbo (931) has additional
  turbo-specific items that may warrant their own future record if
  catalog scope expands to turbo-specific issues across families.

- **Fuel tank corrosion (924).** Honest John notes that internally
  corroded fuel tanks on the 924 are expensive to replace because the
  job involves dropping the rear suspension and gearbox. Real but
  documentation in specialist sources is light. May warrant a v2
  record for the 924 specifically if stronger Tier B sourcing surfaces.

If field experience or further sourcing surfaces clear specialist
consensus on any of these, they can be added in a v2 pass.

---

## Sources

[AMC1] Atlantic Motorcar Center — Porsche 944 and 951 Timing Belt Service - Doing It Right. Tier B.
https://atlanticmotorcar.com/casestudies/porsche-944-and-951-timing-belt-service-doing-it-right/

[PCA-TB1] PCA Tech Q&A — 944 Timing Belt Change Interval (George Beuselinck citing Bruce Anderson). Tier A.
https://www.pca.org/tech/944-timing-belt-change-interval

[PCA-TB2] PCA Tech Q&A — 1993 968 Cam Belt Replacement Interval. Tier A.
https://www.pca.org/tech/1993-968-cam-belt-replacement-interval

[PCA-TB3] PCA Tech Q&A — 944S Timing Belt Intervals (Beuselinck). Tier A.
https://www.pca.org/tech/944s-timing-belt-intervals-1492460155

[PCA-TB4] PCA Tech Q&A — 944 Turbo Timing Belt. Tier A.
https://www.pca.org/tech/944-turbo-timing-belt-1497481435

[PCA-TB5] PCA Tech Q&A — 1983 944 Timing Belt Failure (case example). Tier A.
https://www.pca.org/tech/1983-944-timing-belt-failure

[PEL-T1] Pelican Parts Forums — 944 Timing Belt Change Interval (time vs mileage). Tier C.
http://forums.pelicanparts.com/porsche-924-944-968-technical-forum/13977-timing-belt-change-interval-time-vs-milage.html

[REN-T1] Rennlist Forum — Timing belt tensioner failed, 8 bent valves. Tier C.
https://rennlist.com/forums/924-931-944-951-968-forum/284294-timing-belt-tensioner-failed-8-bent-valves.html

[ATI1] Automotive Tech Info — German Time: Porsche 944 Timing Belts (1991 service article, 924S confirmation). Tier B.
https://automotivetechinfo.com/wp-content/uploads/1991/02/German-Time-Porsche-944-Timing-Belts.pdf

[968F1] 968 Forums — Timing Belt Change Without Water Pump Change (968-specific durability). Tier C.
https://www.968forums.com/topic/13117-timing-belt-change-wo-water-pump-change/

[OC1] Octoclassic — The 4 Most Common Porsche 944 Problems. Tier B.
https://octoclassic.com/blog/the-4-most-common-porsche-944-problems

[PCA-TT1] PCA Tech Q&A — 1987 944s Torque Tube Bearing Replacement (Bill Burris). Tier A.
https://www.pca.org/tech/1987-944s-torque-tube-bearing-replacement

[PCA-TT2] PCA Tech Q&A — 1986 944 Turbo Torque Tube (George Beuselinck on bearing diagnosis and repair scope). Tier A.
https://www.pca.org/tech/1986-944-turbo-torque-tube

[PCA-TT3] PCA Tech Q&A — 924s/944 Torque Tube Rebuilder Recommendations? Tier A.
https://www.pca.org/tech/924s-944-torque-tube-rebuilder-recommendations-1497454527

[928P1] 928-944parts (Netherlands) — The Annoying Noise from Transaxle Bearings (in-car service method). Tier B.
https://928-944parts.com/en/blogs/news/the-annoying-noise-from-transaxle-bearings

[BSRD1] BlackSeaRD — Super Bearings product line for Porsche 924/944/968/928. Tier B.
http://www.blackseard.com/

[AUG1] Augment Automotive (UK) — Porsche 944 and 924 Torque Tube Refurbishment. Tier B.
https://augmentautomotive.co.uk/944-and-924-torque-tube-refurbishment/

[CG-TT] Clark's Garage — Torque Tube Removal, Rebuilding, and Installation (DIY procedure). Tier B.
https://www.clarks-garage.com/shop-manual/trans-05.htm

[944O] 944online — Torque Tube Bearing Deluxe Kit (parts catalog). Tier B.
https://944online.com/torque-tube-bearing-deluxe-kit-924s-944-944s-951/

[HJ1] Honest John — Porsche 924 Classic Car Buyer's Guide (interference question, fuel tank corrosion notes). Tier B.
https://classics.honestjohn.co.uk/reviews/porsche/924/

[REN-924NA] Rennlist 924/931/944/951/968 Forum — extended discussion of base 924 NA non-interference status. Tier C.
https://rennlist.com/forums/924-931-944-951-968-forum/43762-
