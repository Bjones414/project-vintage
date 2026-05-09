# 05 — Engine Defects: 928 V8 (M28 family, 1977–1995)

The 928 V8 is the M28 family — Porsche's all-aluminum, water-cooled,
front-mounted V8 produced from 1977 to 1995. The engine evolved through
four major displacement and head-design generations across the 928's
production run:

- **4.5L SOHC 16-valve (1977–1982)** — base 928, 4474cc M28/01–M28/12
  family, single overhead cam per bank, 16 valves total. US cars were
  detuned for emissions.
- **4.7L SOHC 16-valve (1983–1986)** — 928 S, 4664cc M28/13 and later
  variants, larger displacement, still 16 valves.
- **5.0L DOHC 32-valve (1987–1991)** — 928 S4 and 928 GT, 4957cc
  M28/41–M28/47 family, dual overhead cams per bank, 32 valves total.
- **5.4L DOHC 32-valve (1992–1995)** — 928 GTS, 5397cc M28/49 and
  M28/50, the final iteration with the largest displacement and most
  power.

The engine is mechanically related to the 944 family in some senses
(both are Porsche-designed water-cooled engines with rubber timing
belts and transaxle drivetrains), but the 928 is a fundamentally
different design — bigger, more complex, and with different failure
modes. The 928 also shares the torque tube architecture with the
924/944/968, and torque tube bearing failure on the 928 is covered by
the existing record in `04_engine_transaxle_4cyl.md` rather than
duplicated here (with applicability extended to include the M28).

This file contains two flagged defects: timing belt service neglect
(interference engine destruction on belt failure for 32-valve cars;
specialist disagreement on the interference question for pre-1985
16-valve cars, with the conservative reading being to treat them as
interference unless they are specifically 1978–79 8.2:1 cars) and
thrust bearing failure (TBF) on automatic-transmission 928s
(catastrophic, well-documented, with a specific maintenance procedure
and named retrofits). A "considered and not included" section at the
end documents items deliberately omitted with their rationale. A
separate cross-reference note establishes the 928's inclusion in the
04-file torque tube record.

---

## Defect: Timing belt service neglect

```yaml
id: 928_timing_belt_service
flag_title: "Timing belt service interval"
description: |
  All 928s use a long rubber timing belt that drives the camshafts, oil
  pump, and water pump. The 5.0L and 5.4L 32-valve engines (1985+ S4,
  GT, GTS) are interference designs without specialist disagreement —
  belt failure causes valve-piston contact and engine destruction. The
  pre-1985 16-valve 4.5L and 4.7L engines are subject to specialist
  disagreement on the interference question. Kim Crumb (PCA's 928 tech
  advisor) holds the narrowest non-interference position: only 1978–79
  cars with the 8.2:1 compression ratio are definitively non-
  interference; all other 16-valve cars (later 4.5L US, 4.7L S) will
  experience valve-piston contact on belt failure per his account.
  Other specialists hold broader views: Wally Plumley acknowledges no
  consensus on the transition year; 928 International reports never
  finding crashed valves on US 4.7L and earlier engines they have
  disassembled. The conservative buyer-due-diligence framing is to
  assume interference unless the engine is specifically a 1978–79
  8.2:1 car.

applicability:
  generation: [928, 928_S, 928_S2, 928_S4, 928_GT, 928_GTS]
  engine_family: [M28_V8]
  year_range: [1977, 1995]
  trim_category: [928_4_5, 928_S_4_7, 928_S2_4_7, 928_S4_5_0, 928_GT_5_0, 928_GTS_5_4]
  excludes:
    description: "Air-cooled 911s, water-cooled flat-six engines (M96/M97/Mezger/9A1+), and four-cylinder transaxle engines (Audi 2.0L, M44) use different architectures and are out of scope."
    engine_family: [aircooled_flat_6_pre_carrera, aircooled_flat_6_magnesium_case, aircooled_flat_6_aluminum_case, M96, M97, Mezger, 9A1, 9A2, 9A3, Audi_2_0_924, Audi_2_0_924_Turbo, M44]

severity: catastrophic
# Catastrophic on the 32-valve engines (S4, GT, GTS) where belt failure
# bends valves and may damage pistons. On 16-valve engines (1977–1984
# 4.5L and 4.7L) the typical outcome is engine stoppage without
# valve-piston contact per PCA tech advisor Kim Crumb. Severity is set
# to catastrophic because the catalog treats the highest-impact
# applicable case as the ranking driver, with editorial language
# explaining the variant.

cost_range_usd: [700, 1500]
cost_source_anchor: |
  Members.rennlist.com 928 S4 timing belt service article [RR-928TB]
  documents typical specialist shop quotes in the $700–$1,200 range
  for the bundled timing belt, water pump, and tensioner service —
  consistent with the labor scope of pulling and resealing one of the
  longest production timing belts ever fitted to a car. Rennlist's
  928 common issues article [RL-928CI] cites approximately $1,000 as
  a typical shop cost for belt, water pump, and pulleys. The
  $700–$1,500 range used here brackets these quoted figures across
  the 928 specialist community.

prevalence_rate: "near-universal as a service requirement; failures are uncommon when the schedule is followed"
prevalence_source_anchor: |
  Rennlist's 928 Engine FAQ [RL-FAQ] documents the canonical 928
  belt-service consensus: Porsche specifies 60,000 miles or roughly
  five years, with most specialists recommending a more conservative
  40,000–50,000 mile interval given that few owners drive 928s the
  full 60,000 miles before the belt ages out. The 928's belt is
  characterized as one of the longest production timing belts ever
  fitted, driving multiple accessory systems beyond just the cams.
  Stuttcars [STC1] reports specialist shops favor 45,000-mile
  intervals over the factory 60,000-mile recommendation. The buyer
  framing is therefore "is service current" rather than "does this
  engine fail" — properly maintained 928 belts very rarely fail.

failure_correlation: mixed
# Mileage-and-time driven. Stuttcars [STC1] explicitly recommends
# replacement every 5–7 years independent of mileage; rubber
# degradation accelerates on cars stored in heat or driven rarely.

typical_failure_mileage: [40000, 60000]
typical_failure_mileage_source_anchor: |
  Rennlist's 928 Engine FAQ [RL-FAQ] documents Porsche's official
  recommendation as 60,000 miles or 5 years and cites specialist
  consensus on a more conservative 40,000–50,000 mile interval.
  Members.rennlist.com [RR-928TB] reproduces a 40,000–45,000 mile
  specialist recommendation. Stuttcars [STC1] reports specialist
  shops favor 45,000-mile intervals over the factory 60,000-mile
  recommendation. The 40,000–60,000 mile range used here spans the
  specialist-conservative position through the factory recommendation;
  specialists treat replacement as overdue beyond the upper bound
  regardless of visible belt condition.

typical_failure_age_years: [4, 7]
typical_failure_age_source_anchor: |
  Stuttcars [STC1] documents the calendar-time recommendation as
  every 5–7 years. Rennlist's Common Issues article [RL-928CI]
  recommends replacement every 5–7 years independent of mileage,
  noting that even unused belts dry up with age. The 4–7 year range
  used here brackets the conservative end of specialist
  recommendations through the factory's 5-year position.

retrofit_available: preventive_only
retrofit_kit_names:
  - "Porsche OE belt and tensioner kit (current part progression varies by 16V vs 32V engine)"
  - "Specialist water pump replacement (recommended at every belt service due to shared labor)"

keywords_addressed:
  - "timing belt replaced"
  - "timing belt and water pump"
  - "928 belt service"
  - "tensioner rebuilt"
  - "belt and water pump done"
  - "full belt service with tensioner"

keywords_concerning:
  - "timing belt due"
  - "belt service overdue"
  - "no belt service records"
  - "belt history unknown"
  - "tensioner light flickering"
  - "tensioner warning light"

keywords_active_problem:
  - "timing belt broke"
  - "belt snapped"
  - "bent valves"
  - "engine destroyed by belt failure"
  - "tensioner failed"
  - "valve to piston contact"

keywords_documented:
  - "belt service invoice"
  - "928 specialist invoice"
  - "with full service records"
  - "complete service history"

evidence_basis: specialist_consensus
sources:
  - "[RL-FAQ] Rennlist — Porsche 928 Engine FAQ (Wally Plumley and 928 specialist community). Tier B"
  - "[RL-928CI] Rennlist — Porsche 928: Common Issues (timing belt section). Tier B"
  - "[RL-INT] Rennlist Forum — Question - Interference Engines? (Kim Crumb / PCA 928 tech guru on 1978–1979 8.2:1 non-interference status). Tier C"
  - "[RR-928TB] Members.rennlist.com (Pirtle) — Timing Belt: Porsche 928 S4 Service. Tier B"
  - "[STC1] Stuttcars — Porsche 928 Reliability & Issues. Tier B"
  - "[EEU1] eEuroparts — Ultimate Guide: Avoid Costly Porsche 928 Timing Belt Mistakes. Tier B"
  - "[BLS1] 928 BuckeyeLandsharks — Timing Belt & Water Pump Service (79–84) (16V non-interference confirmation). Tier B"
  - "[928INT-TB] 928 International — The 928 Timing Belt and Tensioner System (specialist whitepaper). Tier B"

editorial_note: |
  Timing belt service is the most important pre-purchase question on any
  928. On the S4, GT, and GTS (1985 onward, 32-valve 5.0L and 5.4L
  engines), belt failure is engine-destroying and the service must be
  current — there is no specialist disagreement on this point. On the
  pre-1985 16-valve cars, specialists genuinely disagree about whether
  belt failure causes valve-piston contact: PCA's 928 tech advisor
  Kim Crumb takes the narrowest position (only 1978–79 8.2:1-compression
  cars are non-interference; all later 16V cars are interference and
  will bend valves), while 928 International reports never finding
  crashed valves on US 4.7L and earlier engines they have torn down.
  The conservative reading is to treat any 16V 928 as interference
  unless it is specifically a 1978–79 8.2:1 car. Either way the service
  is required to keep the car running. The MY1985+ tensioner warning
  light is a legitimate diagnostic tool — overriding it (which some
  uninformed mechanics have done by grounding the connector) defeats
  the design and is a red flag if disclosed. A car with documented belt
  service in the last 4–5 years and under 40,000 miles since service
  is in good shape; older service or unknown history is overdue.

buyer_questions:
  - "When was the timing belt last replaced? At what mileage and how many years ago?"
  - "Was the water pump and tensioner replaced at the same service?"
  - "Can you provide invoices for the belt service?"
  - "On a 1985+ car: does the belt tension warning light operate normally? Has it ever been bypassed?"
  - "On a pre-1985 car: do you know whether the engine is the 8.2:1 compression non-interference variant or a higher-compression interference variant?"
```

---

## Defect: Thrust bearing failure (TBF, automatic transmission)

```yaml
id: 928_thrust_bearing_failure
flag_title: "Thrust bearing failure (auto)"
description: |
  On automatic-transmission 928s, the front flexplate clamp can migrate
  along the splined driveshaft, putting constant forward pressure on
  the flexplate. That pressure transfers to the crankshaft and grinds
  the central thrust bearing into the engine block until the bearing
  disintegrates and the crank starts machining the block itself. The
  result is total engine destruction. The fix is annual inspection and
  release of flexplate tension, or installation of a Ritech Flex Plate
  Clamp that physically prevents migration.

applicability:
  generation: [928, 928_S, 928_S2, 928_S4, 928_GT, 928_GTS]
  engine_family: [M28_V8]
  transmission_family: [Mercedes_3AT_928, Mercedes_4AT_928]
  year_range: [1977, 1995]
  trim_category: [928_4_5, 928_S_4_7, 928_S2_4_7, 928_S4_5_0, 928_GT_5_0, 928_GTS_5_4]
  excludes:
    description: "Manual-transmission 928s use a different drivetrain coupling architecture and are not subject to the flexplate-migration mechanism that drives TBF. Per Ritech [RITECH] and 928.org.uk [928UK1], the issue principally affects automatic-transmission cars from 1984 onward, when Porsche dropped the bearing-washer-circlip clamp arrangement used on earlier cars. Pre-1984 auto cars used a different design that is less prone to clamp migration; they are still subject to flexplate-tension issues but at a substantially lower rate."
    transmission_family: [928_5MT_manual]

severity: catastrophic
# Failure destroys the engine block — not just the bearing. Jim Bailey
# of 928 International on Nichols.nu [NICH-TBF] documents that once
# the crankshaft has worn into the case webbing, the block itself is
# typically not rebuildable. Effectively requires engine replacement.

# cost_range_usd: omitted — once TBF has occurred, the engine is
# typically not rebuildable per Bailey's reporting on Nichols.nu.
# Replacement engines are scarce and expensive; total cost varies
# enormously by parts availability. The cost of PREVENTION (annual
# flexplate tension check or Ritech retrofit) is well under $500. The
# cost of cure is functionally an engine replacement, often exceeding
# the value of all but GTS-grade cars.

prevalence_rate: "common architecturally — every automatic 928 from 1984 onward is exposed to the failure mechanism, though realized failure rates are lower than forum discussion suggests"
prevalence_source_anchor: |
  Ritech Systems' 928 flexplate clamp page [RITECH] characterizes the
  issue as affecting any 928 fitted with an automatic transmission
  from 1984 onwards (when Porsche changed the clamp design), and
  describes the failure mode as catastrophic — leading to total engine
  loss. 928.org.uk's flex plate clamp article [928UK1] reproduces this
  framing. Rennlist's 928 Common Issues article [RL-928CI] identifies
  thrust bearing failure as one of the most common issues 928 owners
  report on automatic-transmission cars. Rennlist's TBF discussion
  thread [RL-TBF] documents the underlying mechanism and reports
  multiple owners discovering forward flexplate bow on their cars
  during inspection. Jim Bailey of 928 International on Nichols.nu
  [NICH-TBF] documents that Porsche increased the bearing shoulder
  width as of engine number 81 E 05344 (model year 1984), indicating
  Porsche themselves recognized a need for a design revision. The
  same source observes that the issue is less common than forum
  discussion suggests, with Bailey noting that as a 928 parts vendor
  he hears disproportionately from owners experiencing problems
  rather than from owners whose cars are running fine. The framing
  the catalog adopts: every automatic 928 is architecturally exposed
  to the failure mechanism (so prevention is universally recommended);
  realized failure rates are uncommon when prevention is performed.

failure_correlation: mixed
# Driven primarily by service history (whether the flexplate has been
# checked annually) and previous driveline work (incorrect installation
# after transmission or torque tube R&R is a common precipitating
# event per multiple specialist sources). Mileage and age accelerate
# the wear but do not directly cause failure.

retrofit_available: yes
retrofit_kit_names:
  - "Ritech Systems Flex Plate Clamp (UK-designed retrofit, prevents migration mechanically)"
  - "Annual flexplate tension check and release (factory procedure, requires specialist access)"
  - "Loctite-secured flexplate clamp bolts (DIY mitigation per Rennlist owner reports, less reliable than Ritech retrofit)"

keywords_addressed:
  - "Ritech flex plate clamp installed"
  - "flexplate tension checked"
  - "TBF inspection performed"
  - "thrust bearing inspection"
  - "flexplate released"
  - "annual flexplate service"
  - "no forward flexplate bow"

keywords_concerning:
  - "automatic transmission, flexplate not checked"
  - "auto trans, no TBF inspection"
  - "no Ritech clamp"
  - "previous transmission work, flexplate uncertain"
  - "torque tube R&R unknown reassembly"

keywords_active_problem:
  - "thrust bearing failure"
  - "TBF"
  - "engine seizure 928"
  - "crank worn into block"
  - "flexplate severely bowed"
  - "engine starts cold then seizes when warm"
  - "block machining damage"

keywords_documented:
  - "Ritech invoice"
  - "928 specialist flexplate inspection"
  - "TBF inspection records"
  - "annual driveline service records"

evidence_basis: specialist_consensus
sources:
  - "[RITECH] Ritech Systems — Porsche 928 Flexplate Clamp (named retrofit, mechanism explanation). Tier B"
  - "[928UK1] 928.org.uk — Ritech Flex Plate Clamp article. Tier B"
  - "[RL-928CI] Rennlist — Porsche 928: Common Issues (thrust bearing failure section). Tier B"
  - "[RL-TBF] Rennlist Forum — Things everyone should know about 928 Engine Thrust Bearing Failure (mechanism and owner reports). Tier C"
  - "[NICH-TBF] Nichols.nu — Flexplate Pressure Results in Serious Damage (Jim Bailey of 928 International on the engine number 81 E 05344 / MY1984 bearing shoulder revision and parts-business sampling-bias observation). Tier B"
  - "[LSO-TBF] Landsharkoz (Australia) — TBF: Whoa There! (mechanism analysis). Tier B"
  - "[RR-FP] Members.rennlist.com (Andrade) — 928 Tech: Check Your A/T Flex Plate (procedure with measurements on 1993 GTS). Tier B"

editorial_note: |
  Thrust bearing failure is the canonical 928-specific catastrophic
  defect on automatic-transmission cars, and the single most important
  pre-purchase question on any auto 928. The mechanism is gradual —
  the flexplate clamp migrates along the splined driveshaft over time,
  putting forward pressure on the crankshaft until the thrust bearing
  destroys itself. Once the crankshaft has worn into the engine block
  webbing, the engine is typically not rebuildable. The fix is either
  (a) annual flexplate tension inspection and release (factory
  procedure, requires specialist access) or (b) installation of the
  Ritech Flex Plate Clamp, a UK-designed retrofit that physically
  prevents clamp migration. A car with documented annual flexplate
  inspection or Ritech clamp installation is in good shape. A car with
  recent transmission or torque tube work and no documented post-work
  flexplate adjustment is at elevated risk regardless of how the car
  currently drives. Manual-transmission 928s are not subject to this
  failure mode and don't carry this flag.

buyer_questions:
  - "Is the car automatic or manual? (TBF flag applies to automatic only.)"
  - "Has the flexplate tension been checked or released within the last 12 months?"
  - "Has a Ritech Flex Plate Clamp been installed? When and by which shop?"
  - "Has the transmission or torque tube been removed at any point in the car's history? If so, was the flexplate adjustment performed correctly during reassembly?"
  - "Is there any history of the engine starting cold and seizing when warm — a classic late-stage TBF symptom?"
```

---

## Cross-reference: Torque tube bearing failure

The 928 shares the torque tube architecture with the 924, 944, and 968.
Torque tube bearings dry out and fail with age regardless of which car
they're installed in, and the diagnostic signal (a screeching noise
from underneath that's present at idle and while driving) is the same.

The catalog flags this issue once, in the
`transaxle_4cyl_torque_tube_bearings` record in
`04_engine_transaxle_4cyl.md`. That record's applicability includes
`engine_family: [Audi_2_0_924, Audi_2_0_924_Turbo, M44, M28_V8]` and
covers all 928 generations (`928, 928_S, 928_S2, 928_S4, 928_GT,
928_GTS`). For 928 buyers, the relevant questions about torque tube
bearings are documented in that record's `buyer_questions` block. This
file does not duplicate the record; the matcher routes a 928 listing
to file 04's torque tube record automatically.

---

## Considered and Not Included

The following items came up in the sourcing review and were considered
for inclusion but did not meet the bar for a flagged defect record at
this stage:

- **Suspension ball joints (aluminum and steel revisions).** Rennlist
  Buyer's Guide [RL-BG] documents these as a notable cost item,
  originally aluminum and later replaced with steel, generally not
  serviceable individually and requiring control arm replacement at
  approximately $1,500–$2,000 per Rennlist's reporting. Real and
  noteworthy but fits a future suspension-and-chassis file better
  than the engine-specific scope of this file. Will likely warrant
  its own record in a `chassis_suspension_928.md` file or a shared
  suspension file.

- **Engine mounts (vibration at idle).** Multiple buyer's guides
  (Classics World [CW1], Rennlist [RL-BG]) cite worn engine mounts as
  a common idle-vibration cause. Service item rather than catalog
  flag at v1; below the buyer-due-diligence bar.

- **Power steering rack and lines.** Documented as a high-cost
  failure item by Stuttcars [STC1] and Classics World [CW1]. Fits a
  future steering-and-hydraulics file better than the engine file.

- **Cooling system / radiator corrosion.** All-aluminum engine and
  cooling system means coolant changes are critical to prevent
  internal corrosion, and radiator replacement is reportedly very
  expensive. Real and noteworthy. Could be a v2 record in this file
  or in a shared cooling-systems file.

- **LH-Jetronic / EZK ignition / MAF sensor failures (1987 onward).**
  Classic & Sports Car [CSC1] cites these as common on later 928s and
  notes specialists like JDSPorsche offer remedies. Fits a future
  electrical-and-electronics file better than the engine file.

- **Rod bearing oil starvation at high RPM.** Mark Anderson (928
  Specialists) is reported on Landsharkoz [LSO-TBF] as having
  identified an oil-galleries-orientation issue in the 4.7L and later
  engines that causes oil starvation above approximately 7,200 RPM.
  This is a real motorsports-context failure mode but is below the
  buyer-due-diligence bar for street cars driven in normal-use ranges
  — most owners will never approach the RPM threshold.

- **Belt tension warning light bypass (1985+).** Real concern that
  some uninformed mechanics have grounded the warning light to defeat
  it. Captured by the editorial note on the timing belt record above
  rather than a separate flag.

- **Door-mounted heater vents and HVAC complexity.** 928 has an
  unusually complex HVAC system. Classics World [CW1] notes
  R12-to-R134a conversion costs are real but this is comfort-system
  rather than drivability. Below the v1 bar.

- **Aluminum body panel corrosion at dissimilar-metal contacts
  (specific spots near rear quarter glass and hatch).** Rennlist
  Buyer's Guide [RL-BG] flags these specific corrosion locations.
  Belongs in a future body-and-corrosion file rather than the engine
  file.

If field experience or further sourcing surfaces clear specialist
consensus on any of these, they can be added in a v2 pass.

---

## Sources

[RL-FAQ] Rennlist — Porsche 928 Engine FAQ. Tier B.
https://rennlist.com/porsche-928-faq/porsche-928-engine-faq/

[RL-928CI] Rennlist — Porsche 928: Common Issues. Tier B.
https://rennlist.com/how-tos/a/porsche-928-common-issues-376717

[RL-INT] Rennlist Forum — Question - Interference Engines? (Kim Crumb on 1978–1979 8.2:1 non-interference status). Tier C.
https://rennlist.com/forums/928-forum/38435-question-interference-engines.html

[RR-928TB] Members.rennlist.com (Pirtle) — Timing Belt: Porsche 928 S4 Service. Tier B.
https://members.rennlist.com/pirtle/tbelt.html

[STC1] Stuttcars — Porsche 928 Reliability & Issues. Tier B.
https://www.stuttcars.com/porsche-928-reliability-issues/

[EEU1] eEuroparts — Ultimate Guide: Avoid Costly Porsche 928 Timing Belt Mistakes. Tier B.
https://eeuroparts.com/blog/ultimate-guide-avoid-costly-porsche-928-timing-belt-mistakes

[BLS1] 928 BuckeyeLandsharks — Timing Belt & Water Pump Service (79–84). Tier B.
http://www.928buckeyelandsharks.com/cm/tsg/tbwp/

[928INT-TB] 928 International — The 928 Timing Belt and Tensioner System. Tier B.
https://www.928intl.com/repair/T-belt1.pdf

[RITECH] Ritech Systems — Porsche 928 Flexplate Clamp. Tier B.
http://www.ritech-systems.com/928_flexplate_clamp.html

[928UK1] 928.org.uk — Ritech Flex Plate Clamp article. Tier B.
https://www.928.org.uk/articles/678-flex-plate-clamp.html

[RL-TBF] Rennlist Forum — Things everyone should know about 928 Engine Thrust Bearing Failure. Tier C.
https://rennlist.com/forums/928-forum/570465-things-everyone-should-know-about-928-engine-thrust-bearing-failure.html

[NICH-TBF] Nichols.nu — Flexplate Pressure Results in Serious Damage (Jim Bailey of 928 International: bearing shoulder revision at engine number 81 E 05344 / MY1984; parts-business sampling-bias observation). Tier B.
https://www.nichols.nu/tip598.htm

[LSO-TBF] Landsharkoz (Australia) — TBF: Whoa There! Tier B.
https://www.landsharkoz.com/tt/tttbf.htm

[RR-FP] Members.rennlist.com (Andrade) — 928 Tech: Check Your A/T Flex Plate. Tier B.
https://members.rennlist.com/v1uhoh/928TechFlexPlatearticleTH.pdf

[RL-BG] Rennlist — Porsche 928 Buyer's Guide. Tier B.
https://rennlist.com/how-tos/a/porsche-928-buyers-guide-376725

[CW1] Classics World — Porsche 928 buyer's guide. Tier B.
https://classicsworld.co.uk/guides/porsche-928-buyers-guide/

[CSC1] Classic & Sports Car — Porsche 928 buyer's guide. Tier B.
https://www.classicandsportscar.com/features/buyers-guide-porsche-928
