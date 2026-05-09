# File 26 — Halo Models (959 / Carrera GT / 918)

**Catalog path:** docs/reference/defects/26_halo_models.md
**Status:** 🟡 Draft — pending human sign-off
**Records:** 6 (HALO_26_001 through HALO_26_006)
**Authored:** 2026-05-07

---

## Scope

Body, mechanical, electrical, and chassis failure modes specific to three Porsche
halo models: `959` (1986–1989), `carrera_gt` (2004–2006), and `918` (2013–2015).
These are low-volume, high-value vehicles with specialist-only maintenance
requirements and distinct failure modes not shared with production cars. All records
are framed as inspection priorities for prospective buyers — not as defect-rate
claims across a fleet.

**Population context:**

| Model | Production | US/Canada | Framing |
|---|---|---|---|
| 959 | ~292 road cars globally | Show or Display only | Inspection priorities |
| carrera_gt | 1,270 globally; 675 US/Canada | ~489 in current recall | Inspection priorities |
| 918 | 918 globally | ~305 in suspension recalls | Inspection priorities |

**Out of scope for this file:** Production-car engine records that may overlap
these platforms; Taycan battery/EV systems (File 27); 904, 906, 917, racing
variants (v1 out of scope per PROJECT_STATE.md).

---

## Scope Decisions

### SD-1 — 918 Spyder high-voltage battery: keep here or defer to File 27?

**Decision: Keep here with distinct framing.**

The 918's 400-volt lithium-ion hybrid battery (~6.8 kWh) uses an architecture
and chemistry entirely distinct from the Taycan's 800-volt system. Failure modes,
inspection protocols, and specialist requirements differ. Tier B sourcing exists
specifically for the 918 HV system (Repasi Motorwerks, February 2026) and Tier A
NHTSA TSBs reference the 918 HV Control Unit specifically. There is no meaningful
content overlap with planned File 27 Taycan battery records. Record retained here
as HALO_26_005.

### SD-2 — 959 framing

**Decision: Frame as inspection priorities; omit fleet-prevalence claims.**

With approximately 292 road cars globally and no Porsche factory parts supply for
bespoke drivetrain and engine components, defect-rate language is inapplicable.
All 959 records frame conditions as pre-purchase inspection requirements. Canepa
(Scotts Valley, CA) is the documented North American specialist for 959 work.
US cars operate under the Show or Display exemption (2,500 annual road miles).

### SD-3 — Carrera GT clutch: defect or driver-skill advisory?

**Decision: Confirmed defect/inspection record.**

Tier B sources (Stuttcars.com buyer's guide; Repasi Motorwerks specialist feature)
document the CGT clutch as generating a bounded, named failure pattern: premature
wear from cold or inexpert engagement, requiring engine-out replacement at
$20,000–$30,000. This is not framed as driver education only — it is a documented
pre-purchase inspection item with a specific cost consequence. An alternative
replacement clutch (3-piece stainless steel, AP Racing co-development) is available
from Repasi Motorwerks. Record confirmed as HALO_26_002.

---

## Candidate Verdicts

| # | Candidate | Verdict | Reason |
|---|---|---|---|
| 1 | CGT wishbone spherical joint recall (NHTSA 23V-241) | **Confirmed** → HALO_26_001 | Tier A: NHTSA recall / PCNA APA3; stop-use advisory |
| 2 | CGT carbon fiber clutch wear | **Confirmed** → HALO_26_002 | Tier B: Stuttcars + Repasi Motorwerks; cost anchored |
| 3 | CGT fuel pump diaphragm ethanol deterioration | **Confirmed** → HALO_26_003 | Tier B: Stuttcars buyer's guide; bounded pattern |
| 4 | CGT PCCB brake inspection | **Declined** | General PCCB wear applies to any PCCB-equipped car; no CGT-specific bounded defect distinct from standard PCCB inspection; cross-reference chassis files |
| 5 | CGT shock absorber leaks | **Declined** | Noted in Repasi Motorwerks PPI guidance as general inspection item; Tier B documents inspection priority but no bounded defect pattern with severity/cost anchor independent of HALO_26_001 |
| 6 | 918 suspension control arm recalls | **Confirmed** → HALO_26_004 | Tier A: Multiple NHTSA recalls (AE03, 16V-885, AJ04) |
| 7 | 918 HV battery and hybrid system age | **Confirmed** → HALO_26_005 | Tier A: NHTSA TSBs; Tier B: Repasi Motorwerks |
| 8 | 918 Weissach Package CF panels / magnesium wheels | **Declined** | Tier B absent for bounded defect pattern; noted as buyer inspection note in HALO_26_005 editorial |
| 9 | 918 E-fuel (synthetic fuel) compatibility | **Declined** | No bounded defect pattern documented; not a pre-purchase inspection item |
| 10 | 959 drivetrain, AWD, and age inspection | **Confirmed** → HALO_26_006 (merged) | Tier A: PCA Tech Tips; Tier B: Canepa |
| 11 | 959 engine and turbo system age | **Confirmed** → HALO_26_006 (merged) | Merged with drivetrain record; same inspection event; Canepa Tier B |
| 12 | 959 electrical/wiring age separately | **Declined** | No Tier B for bounded defect pattern beyond general age inspection covered within HALO_26_006 |

---

## Records

---

### HALO_26_001 — Carrera GT wishbone spherical joint recall

```yaml
id: HALO_26_001
flag_title: "CGT suspension spherical joint recall"
description: |
  NHTSA recall 23V-241 (PCNA recall APA3, April 2023) affects 2004–2005 Carrera
  GTs: the X46Cr13 stainless steel spherical joints connecting wishbone suspension
  components at front and rear axles are susceptible to intergranular stress
  corrosion from salt exposure and mechanical load, potentially leading to joint
  fracture and loss of vehicle control without prior warning. Porsche issued a
  stop-use advisory pending dealer inspection and remedy. Any prospective buyer
  must verify recall completion via NHTSA VIN lookup before purchase or bidding.

applicability:
  generation: [carrera_gt]
  year_range: [2004, 2005]
  # Note: Recall production VIN range (December 2003 – October 2005) covers
  # essentially all US-market CGTs. Any CGT buyer regardless of listed model year
  # should verify via nhtsa.gov VIN lookup.

severity: catastrophic
# Sudden suspension failure at speed confirmed possible without prior warning;
# Porsche issued stop-use advisory; parts availability delayed at recall issuance.

prevalence_rate: "near-universal"
prevalence_source_anchor: |
  NHTSA recall 23V-241 primary report: 489 of 675 US/Canada-market Carrera GTs
  called back (72.4% of the US/Canada fleet), covering production December 19,
  2003 – October 27, 2005. Under the schema threshold (≥50% → near-universal),
  the recall coverage maps to near-universal. Note: this reflects recall scope,
  not a spontaneous defect rate — the only confirmed failure was a single car
  found during unrelated dealer service. Porsche found elevated surface corrosion
  in salt-belt vehicles. [1]

failure_correlation: age, climate

regional_amplification:
  salt_belt: high
  # NHTSA 23V-241 report explicitly notes elevated surface corrosion in
  # salt-belt vehicles as a contributing factor.

keywords_addressed:
  - "recall completed"
  - "spherical joints replaced"
  - "APA3 completed"
  - "23V-241 completed"
  - "suspension recall done"
  - "wishbone replaced"

keywords_concerning:
  - "recall open"
  - "recall pending"
  - "recall not completed"

keywords_active_problem:
  - "suspension noise"
  - "suspension vibration"
  - "handling issue"
  # Note: per NHTSA report, joint fracture can occur without prior warning.
  # Active-problem keywords may not precede failure.

keywords_documented:
  - "dealer documentation"
  - "recall completion documented"
  - "APA3 completion letter"
  - "NHTSA VIN lookup confirmed"
  - "inspection and remedy complete"

evidence_basis:
  tier_a:
    - "NHTSA Recall 23V-241 / PCNA Recall APA3 (April 2023). Primary NHTSA
      recall report confirmed directly reviewed. Material identification (X46Cr13),
      failure mechanism, affected VIN range, stop-use advisory, and remedy
      procedure all sourced from primary document. [1]"

sources:
  - "[1] NHTSA — Recall Report 23V-241 / PCNA Recall APA3. Carrera GT wishbone
    spherical joint stress corrosion. April 2023. Tier A.
    https://static.nhtsa.gov/odi/rcl/2023/RCLRPT-23V241-7631.PDF"

editorial_note: |
  NHTSA recall 23V-241 is the single most important pre-purchase item for any
  Carrera GT. The spherical joints can fracture from age-related stress corrosion
  without any prior handling warning to the driver — the only known real-world
  case was discovered during unrelated dealer service. Porsche issued a stop-use
  advisory, and some UK insurers suspended road-use coverage for non-compliant
  cars. Any buyer must run the specific car's VIN at nhtsa.gov before bidding
  and obtain written dealer documentation that the inspection and remedy are
  complete. Salt-belt cars should receive additional scrutiny even after recall
  completion. The recall remedy involves inspection followed by replacement with
  higher-grade material parts once available.

buyer_questions:
  - "Can you confirm via NHTSA VIN lookup that recall 23V-241 (Porsche APA3)
    is complete on this specific car? Can you provide dealer documentation showing
    inspection and remedy status?"
  - "Has the car been driven since the stop-use advisory was issued? Is there any
    documentation of ongoing Porsche dealer contact regarding recall status?"
```

---

### HALO_26_002 — Carrera GT twin-plate carbon fiber clutch

```yaml
id: HALO_26_002
flag_title: "CGT carbon fiber clutch wear inspection"
description: |
  The Carrera GT's twin-plate carbon fiber clutch demands specialist operating
  technique and is a non-negotiable pre-purchase inspection item. Cold engagement
  or inexpert technique causes accelerated wear; replacement requires engine
  removal and costs $20,000–$30,000 in parts and labor. A factory-alternative
  3-piece stainless steel clutch co-developed with AP Racing is available from
  Repasi Motorwerks for owners seeking a more forgiving engagement characteristic.

applicability:
  generation: [carrera_gt]
  year_range: [2004, 2006]

severity: catastrophic
# Engine-out service plus parts puts total cost above typical high threshold;
# clutch wear can leave the car undriven pending repair.

cost_range_usd: [20000, 30000]
cost_source_anchor: |
  Stuttcars.com Carrera GT buyer's guide (January 2026) documents clutch
  replacement as costing $20,000–$30,000 and occurring "every 10,000–20,000
  miles." Repasi Motorwerks CGT service feature (American Collectors Insurance,
  December 2023) confirms engine-out service requirement and offers aftermarket
  clutch alternative. [2][3]

prevalence_rate: "common"
prevalence_source_anchor: |
  Stuttcars.com buyer's guide characterizes clutch replacement as a common event
  at 10,000–20,000 mile intervals, driven by driver technique and cold-engagement
  history. Rennlist owner discussion (Tier C, consistency reference only)
  documents 30,000-mile clutch life with careful street technique as a positive
  outcome. [2][4]

failure_correlation: usage_pattern, age

typical_failure_mileage: [10000, 30000]
typical_failure_mileage_source_anchor: |
  Stuttcars.com documents common replacement at 10,000–20,000 miles. Rennlist
  Tier C owner discussion (consistency reference) documents a 30,000-mile
  example with careful street use as a favorable outcome, not a typical one. [2][4]

retrofit_available: yes
retrofit_kit_names:
  - "Repasi Motorwerks 3-piece stainless steel clutch (AP Racing co-developed)"

keywords_addressed:
  - "new clutch"
  - "clutch replaced"
  - "clutch inspected"
  - "upgraded clutch"
  - "Repasi clutch"
  - "clutch rebuilt"

keywords_concerning:
  - "original clutch"
  - "factory clutch"
  - "clutch wear"
  - "clutch checked"

keywords_active_problem:
  - "clutch slip"
  - "clutch slipping"
  - "clutch judder"
  - "clutch failure"
  - "clutch engagement issue"

keywords_documented:
  - "clutch measurement report"
  - "clutch inspection invoice"
  - "clutch replacement invoice"
  - "specialist clutch inspection"

evidence_basis:
  tier_b:
    - "Stuttcars.com — Carrera GT Buyer's Guide (January 2026). Documents
      replacement frequency (10,000–20,000 miles), cost ($20,000–$30,000), and
      characterizes clutch as 'one of the most demanding supercars to operate.'
      Tier B. [2]"
    - "Repasi Motorwerks (via American Collectors Insurance feature, December
      2023). Confirms factory clutch as engine-out service, describes factory
      unit as 'a particular point of contention,' and documents aftermarket
      3-piece stainless steel alternative co-developed with AP Racing. Tier B. [3]"
  tier_c:
    - "Rennlist — Carrera GT Clutch Replacement thread. Owner accounts of
      10,000–30,000-mile clutch life depending on technique. Consistency
      reference only; not sole-sourced for any claim. [4]"

sources:
  - "[2] Stuttcars.com — Porsche Carrera GT Buyer's Guide. January 2026. Tier B.
    https://www.stuttcars.com/porsche-buyers-guides/porsche-carrera-gt-buyers-guide/"
  - "[3] Repasi Motorwerks — Specialists in Porsche Carrera GT (Type 980) Service
    (American Collectors Insurance). December 2023. Tier B.
    https://americancollectors.com/articles/repasi-motorwerks/"
  - "[4] Rennlist — Carrera GT Clutch Replacement. Tier C (consistency reference
    only). https://rennlist.com/forums/porsche-supercars-carrera-gt-918-960/848866-carrera-gt-clutch-replacement.html"

editorial_note: |
  Every Carrera GT buyer should treat the clutch as a potential immediate expense.
  A CGT whose clutch was managed well can deliver 20,000+ miles of life; one that
  was cold-engaged repeatedly or operated inexpertly may need replacement at 5,000
  miles. There is no reliable way to assess clutch history from a listing — only
  physical inspection and measurement by a CGT specialist will establish wear
  status. Repasi Motorwerks (Stratford, CT) offers clutch measurement as part of
  CGT pre-purchase inspections; a thorough PPI at this level also covers shock
  absorber condition, which the Stuttcars.com buyer's guide notes as a separate
  common area of age-related wear on the CGT. The aftermarket stainless steel
  clutch is a documented option for buyers who want a more conventional engagement
  feel and lower long-term replacement cost.

buyer_questions:
  - "Has the clutch been inspected or measured by a specialist recently? What is
    the current wear measurement?"
  - "Is this the original factory clutch or has it been replaced? If replaced,
    when, by which shop, and with which clutch?"
  - "Who is the primary driver and what is their prior experience with the Carrera
    GT clutch?"
```

---

### HALO_26_003 — Carrera GT fuel pump diaphragm deterioration

```yaml
id: HALO_26_003
flag_title: "CGT fuel pump diaphragm ethanol deterioration"
description: |
  Ethanol content in modern pump gasoline (E10+) deteriorates the fuel pump
  diaphragm in the Carrera GT's integrated fuel system over time, a known issue
  that in severe cases can require replacement of the entire fuel tank — a major
  repair given the CGT's carbon monocoque construction. Any CGT now 18–22 years
  old should have its fuel system evaluated by a specialist as part of pre-purchase
  inspection, particularly if operated predominantly on standard pump fuel.

applicability:
  generation: [carrera_gt]
  year_range: [2004, 2006]

severity: high
# Fuel pump diaphragm failure alone is significant; full fuel tank replacement
# in the CGT's integrated monocoque is at the upper end of this severity tier.
# Cost not anchored with a specific figure; qualitative per Tier B source.

failure_correlation: age, usage_pattern
# Usage pattern: cars operated on ethanol-blended pump fuel at higher risk than
# those run on ethanol-free fuel or stored dry.

typical_failure_age_years: [15, 22]
typical_failure_age_source_anchor: |
  Stuttcars.com Carrera GT buyer's guide (January 2026) characterizes fuel pump
  diaphragm deterioration as a "known issue" for CGTs at their current age
  (18–22 years as of authoring), linked to ethanol content in modern gasoline. [2]

keywords_addressed:
  - "fuel system inspected"
  - "fuel pump replaced"
  - "fuel system serviced"
  - "fuel tank replaced"
  - "ethanol-free fuel"

keywords_concerning:
  - "fuel smell"
  - "fuel odor"

keywords_active_problem:
  - "fuel leak"
  - "fuel system fault"
  - "fuel pump fault"

keywords_documented:
  - "fuel system inspection report"
  - "fuel pump inspection"
  - "fuel cell inspected"

evidence_basis:
  tier_b:
    - "Stuttcars.com — Carrera GT Buyer's Guide (January 2026). Identifies fuel
      pump diaphragm deterioration from ethanol as a 'known issue' that can
      necessitate 'replacement of the entire fuel tank, a repair that can be
      very expensive.' Tier B. [2]"

sources:
  - "[2] Stuttcars.com — Porsche Carrera GT Buyer's Guide. January 2026. Tier B.
    https://www.stuttcars.com/porsche-buyers-guides/porsche-carrera-gt-buyers-guide/"

editorial_note: |
  The Carrera GT's fuel system was not designed for the ethanol-blended pump
  gasoline that is now standard in most markets. Over 18–22 years, ethanol
  attacks the rubber diaphragm in the integrated fuel pump; a failed diaphragm
  can require complete fuel tank replacement — a significant operation in a car
  where the fuel tank is integrated into the carbon monocoque. Any prospective
  buyer should ask specifically about fuel history and request a fuel system
  inspection. Owners who store the car should use ethanol-free fuel where
  available or a fuel stabilizer rated for ethanol-sensitive systems.

buyer_questions:
  - "Has the fuel pump diaphragm been inspected, and when? Has the car been
    operated primarily on standard pump gasoline or ethanol-free fuel?"
  - "Has there ever been any fuel odor in the cabin or engine bay, or any
    fuel system service beyond routine filter replacement?"
```

---

### HALO_26_004 — 918 Spyder suspension control arm stress corrosion

```yaml
id: HALO_26_004
flag_title: "918 control arm stress corrosion recalls"
description: |
  The 918 Spyder is subject to three NHTSA recall campaigns for suspension control
  arm stress corrosion cracking: recall AE03 (rear axle control arms, 2014),
  recall 16V-885 (front lower control arms at ball joint, 2016), and recall AJ04
  (longitudinal and transverse control arm connecting shafts, 2018). Control arm
  fracture from stress corrosion can cause sudden loss of vehicle control. Any
  prospective buyer must verify completion of all open campaigns via NHTSA VIN
  lookup before purchase.

applicability:
  generation: [918]
  year_range: [2013, 2015]

severity: catastrophic

prevalence_rate: "near-universal"
prevalence_source_anchor: |
  NHTSA recall 16V-885 (December 2016) covers 306 US-specification 918 Spyders;
  NHTSA recall AJ04 (September 2018) covers 305 US units. Both campaigns
  individually cover approximately one-third of total global production (918 cars),
  and across three cumulative campaigns virtually the entire US-market fleet has
  been addressed. Maps to near-universal under the schema threshold (≥50% of
  identifiable affected population across combined campaigns). [5]

failure_correlation: age, climate

regional_amplification:
  salt_belt: high
  # NHTSA recall AJ04 (2018) documents corrosion risk from salt and moisture
  # exposure as the mechanism in the control arm connecting shafts.

keywords_addressed:
  - "recall completed"
  - "control arms replaced"
  - "AE03 completed"
  - "AJ04 completed"
  - "suspension recalls done"

keywords_concerning:
  - "recall open"
  - "recall pending"

keywords_active_problem:
  - "suspension noise"
  - "handling fault"
  - "suspension creak"

keywords_documented:
  - "dealer documentation"
  - "recall completion documented"
  - "control arm replacement documented"
  - "AE03 completion letter"
  - "AJ04 completion letter"

evidence_basis:
  tier_a:
    - "NHTSA Recall AE03 / PCNA — 918 Spyder rear axle control arms, 2014. Tier A.
      Primary NHTSA campaign PDF not directly retrieved (tier_a_doc_retrieved:
      referenced_only). [5]"
    - "NHTSA Recall 16V-885 — 918 Spyder front lower control arm ball joint, December
      2016. Affects 306 US-market 918s. Tier A. Primary NHTSA campaign PDF not
      directly retrieved (tier_a_doc_retrieved: referenced_only). [5]"
    - "NHTSA Recall AJ04 — 918 Spyder longitudinal and transverse control arm
      connecting shaft stress corrosion. Recall began September 6, 2018; 305 US
      units affected. Tier A. Primary NHTSA campaign PDF not directly retrieved
      (tier_a_doc_retrieved: referenced_only). [5]"

sources:
  - "[5] NHTSA — 918 Spyder recall campaigns AE03 (2014), 16V-885 (2016), AJ04
    (2018). Tier A. Primary campaign PDFs on file at NHTSA; not directly retrieved
    this session (tier_a_doc_retrieved: referenced_only). Canonical recall lookup:
    https://www.nhtsa.gov/vehicle/2015/PORSCHE/918%20SPYDER"

editorial_note: |
  Like the Carrera GT's spherical joint recall, the 918 Spyder's repeated
  suspension recall campaigns reflect a systemic stress corrosion susceptibility
  in specific alloy components — the same physical mechanism across both halo
  models. Three separate NHTSA campaigns addressed different suspension points;
  a specific 918 may have one, two, or all three open or completed. Buyers must
  confirm each campaign's status individually via NHTSA VIN lookup and obtain
  written dealer documentation for each. Salt-belt cars require additional
  scrutiny. Unresolved recalls can also affect insurance coverage and track
  day eligibility.

buyer_questions:
  - "Can you confirm via NHTSA VIN lookup that all three recall campaigns (AE03,
    16V-885, and AJ04) are complete on this specific car? Can you provide dealer
    documentation for each?"
  - "Where has this car been primarily garaged and driven? Salt-belt or coastal
    humid exposure increases corrosion risk."
```

---

### HALO_26_005 — 918 Spyder high-voltage battery and hybrid system

```yaml
id: HALO_26_005
flag_title: "918 HV battery and hybrid system age"
description: |
  The 918 Spyder's 400-volt lithium-ion hybrid battery and dual-motor system is
  now 10–13 years old. Battery capacity degradation, high-voltage connector
  corrosion, and hybrid control unit fault codes are documented age-related
  concerns requiring evaluation by a high-voltage–certified specialist before
  purchase. No buyer should acquire a 918 without a specialist pre-purchase HV
  system inspection; the 400-volt system poses serious safety risk to
  uncertified technicians.

applicability:
  generation: [918]
  year_range: [2013, 2015]

severity: catastrophic
# HV battery replacement cost on the 918 is not publicly anchored with a
# specific Tier B dollar figure; catastrophic severity reflects: system
# complexity, certified-technician-only access, and the materiality of battery
# degradation to the 918's defining performance characteristic.

failure_correlation: age

typical_failure_age_years: [10, 15]
typical_failure_age_source_anchor: |
  Repasi Motorwerks 918 battery guide (February 2026) documents annual HV system
  inspection as necessary for 918s at 10+ years, noting battery capacity
  degradation and HV connector corrosion as primary inspection priorities.
  States: "The 918's 400-volt system can kill without proper training and safety
  protocols." Tier B. [7]

keywords_addressed:
  - "hybrid system inspected"
  - "battery inspected"
  - "HV system evaluated"
  - "hybrid evaluation"
  - "battery health check"

keywords_concerning:
  - "hybrid warning"
  - "battery warning"
  - "hybrid fault code"

keywords_active_problem:
  - "hybrid system fault"
  - "battery fault"
  - "reduced hybrid power"
  - "HV warning"
  - "yellow hybrid warning"
  - "red hybrid warning"

keywords_documented:
  - "HV inspection report"
  - "hybrid inspection report"
  - "battery health report"
  - "TSB confirmed in service records"
  - "HV system certification"

evidence_basis:
  tier_a:
    - "NHTSA TSB 10165159 (Porsche TSB 122-Q6M4M-09, August 2019) — Instructions
      for reprogramming the High Voltage Control Unit on 918 Spyder models in the
      event of red or yellow hybrid warning messages. Confirms HV system fault
      codes as a documented service event requiring specialist equipment. Tier A.
      Primary TSB document (MC-10165159-9999.pdf) on file at NHTSA static CDN;
      not directly retrieved this session (tier_a_doc_retrieved: referenced_only).
      [6]"
  tier_b:
    - "Repasi Motorwerks — 918 Spyder Battery Replacement: Costs & Information
      (February 2026). Documents annual inspection requirements, HV certification
      requirement, battery capacity degradation and connector corrosion as age
      concerns, and offers pre-purchase HV system evaluations. Tier B. [7]"

sources:
  - "[6] NHTSA TSB 10165159 (Porsche TSB 122-Q6M4M-09, August 29, 2019). 2015
    Porsche 918 Spyder HV Control Unit reprogramming for hybrid warning messages.
    Tier A. Primary document MC-10165159-9999.pdf on file at NHTSA; not directly
    retrieved this session (tier_a_doc_retrieved: referenced_only).
    https://static.nhtsa.gov/odi/tsbs/2019/MC-10165159-9999.pdf"
  - "[7] Repasi Motorwerks — 918 Spyder Battery Replacement: Costs & Information.
    February 2026. Tier B.
    https://repasimotorwerks.com/blog/918-spyder-battery-replacement-cost"

editorial_note: |
  The 918 Spyder's hybrid system is integral to the car's performance character —
  the two electric motors contribute materially to its sub-3-second 0–60 time.
  At 10–13 years old, battery degradation reduces EV range and hybrid performance
  in measurable ways; HV connector corrosion and software calibration drift add
  further risk. The 400-volt system requires certified high-voltage technicians
  for any diagnosis or service — this is a safety requirement, not a preference.
  Repasi Motorwerks (Stratford, CT) is a documented 918 specialist offering
  pre-purchase hybrid system evaluations including battery health analysis and
  HV system diagnostics. Buyers of Weissach Package cars should additionally
  inspect carbon fiber body panels for UV-related clearcoat degradation and
  delamination, and magnesium wheels for corrosion, as part of the broader PPI.

buyer_questions:
  - "Has the high-voltage battery and hybrid system been inspected by a
    HV-certified specialist within the last 12 months? Can you provide the
    inspection report?"
  - "Has the car received the HV Control Unit software update per Porsche TSB
    122-Q6M4M-09? Can this be confirmed via dealer service records?"
  - "Has the car ever displayed a red or yellow hybrid system warning? How was
    it resolved, and by which shop?"
```

---

### HALO_26_006 — 959 bespoke drivetrain and age inspection priorities

```yaml
id: HALO_26_006
flag_title: "959 bespoke systems age inspection"
description: |
  The Porsche 959's bespoke 2.85L sequential-twin-turbo flat-six with
  water-cooled heads, unique 6-speed gearbox, electronically-controlled AWD
  system, and (on Komfort models) hydraulic self-leveling suspension have no
  production-car equivalents and virtually no Porsche factory parts supply after
  35+ years. A comprehensive specialist inspection — requiring documented 959
  expertise — is essential before purchase. In North America, Canepa (Scotts
  Valley, CA) is the established specialist for 959 work. US 959s operate under
  the Show or Display exemption, limiting road use to 2,500 annual miles.

applicability:
  generation: [959]
  year_range: [1986, 1989]
  trim_category: [Komfort, Sport]
  # Komfort-specific: hydraulic self-leveling suspension adds an additional
  # age-related inspection item not present on Sport models.

severity: catastrophic
# Parts unavailability alone makes any major failure potentially unresolvable
# without specialist fabrication or global 959 parts sourcing. Cost not
# anchored — Canepa full rebuilds have involved $200,000+ in documented cases.

failure_correlation: age

keywords_addressed:
  - "Canepa inspection"
  - "Canepa serviced"
  - "959 specialist inspection"
  - "full mechanical refurbishment"
  - "comprehensive service"
  - "specialist serviced"

keywords_concerning:
  - "no service records"
  - "unknown service history"
  - "barn find"
  - "long-term storage"

keywords_active_problem:
  - "turbo fault"
  - "AWD fault"
  - "gearbox fault"
  - "suspension fault"
  - "hydraulic system fault"

keywords_documented:
  - "Canepa inspection report"
  - "specialist inspection report"
  - "full service documentation"
  - "mechanical refurbishment documented"

evidence_basis:
  tier_a:
    - "PCA Tech Tips — Nine facts you may not have known about the Porsche 959
      (January 2022). Confirms Canepa as the North American 959 specialist with
      documented expertise, Show or Display law history, and unique technical
      features of the 959 (hollow magnesium wheels with integrated TPMS, unique
      gearbox pattern with Gelände gear, etc.). Tier A. [8]"
  tier_b:
    - "Canepa.com — 1987 Porsche 959 specialist inventory documentation. Describes
      'Canepa Difference' comprehensive inspection process; documents $200,000+
      refurbishment by a prior owner; characterizes the goal as 'mechanically and
      cosmetically like new, front to back.' Tier B. [9]"
    - "RM Sotheby's Miami 2025 auction catalog — 1988 Porsche 959 SC Reimagined
      by Canepa. Documents 4,000+ hours per full rebuild; 3,000 individual
      components restored, rebuilt, or upgraded; confirms 2.85L sequential-twin-
      turbo flat-six as the engine designation. Secondary Canepa reference. Tier B.
      [10]"

sources:
  - "[8] PCA Tech Tips — Nine facts you may not have known about the Porsche 959.
    January 2022. Tier A.
    https://pca.org/news/nine-facts-you-may-not-have-known-about-the-porsche-959-pca-tech-tips"
  - "[9] Canepa.com — 1987 Porsche 959 specialist inventory listing. Tier B.
    https://www.canepa.com/photo-gallery/1987-porsche-9597044/"
  - "[10] RM Sotheby's — 1988 Porsche 959 SC Reimagined by Canepa, Miami 2025
    auction catalog. Tier B (secondary Canepa reference).
    https://rmsothebys.com/auctions/mi25/lots/r0030-1988-porsche-959-sc-reimagined-by-canepa/"

editorial_note: |
  The 959 requires a fundamentally different pre-purchase approach than any other
  car in this catalog. With approximately 292 road cars built, no Porsche factory
  parts support for the bespoke drivetrain and engine, and an AWD and
  suspension architecture shared with no other production car, any unresolved
  mechanical issue may be difficult or impossible to remedy without specialist
  fabrication or global parts sourcing. Canepa (Scotts Valley, California) has
  documented more 959 inspections, rebuilds, and Show or Display conversions than
  any other North American specialist and should be engaged for any pre-purchase
  evaluation. Buyers should additionally confirm the car's US Show or Display
  documentation is current and verify remaining annual mileage allowance under
  the 2,500-mile limit. Komfort-model buyers should specifically ask about the
  hydraulic self-leveling suspension, which adds a unique age-related failure
  point. Sport-model buyers should confirm the factory coilover suspension
  condition. Both variants require inspection of the sequential turbocharger
  system, including the small/large KKK turbo sequencing mechanism and
  water-cooled cylinder head cooling circuit.

buyer_questions:
  - "Has this car been comprehensively inspected by a documented 959 specialist
    (Canepa or equivalent European specialist) within the last five years? Can you
    provide the full inspection report?"
  - "For Komfort models: is the hydraulic self-leveling suspension fully
    functional? When was it last serviced and what was found?"
  - "What is the condition of both KKK turbochargers? Have they been rebuilt or
    inspected within the last 10 years? Are the water-cooled cylinder head cooling
    hoses original?"
  - "Is the car's US Show or Display documentation current and complete? What is
    the current odometer reading, and does the recorded annual mileage history
    comply with the 2,500-mile annual limit?"
```

---

## Declined Candidates — Documentation

**CGT PCCB brake inspection:** General PCCB inspection applies to any PCCB-equipped
Porsche and is a standard PPI item; no CGT-specific bounded defect pattern is distinct
from standard PCCB wear, caliper inspection, and bedding history. Cross-reference
chassis files (File 10) if a general PCCB record is in scope. Declined as a standalone
File 26 record.

**CGT shock absorber leaks:** Stuttcars.com buyer's guide and Repasi Motorwerks PPI
guide both note shock absorber condition as a pre-purchase inspection item. However,
Tier B does not establish a bounded defect pattern (specific failure mode, affected
population, or cost anchor) independent from general age-related shock wear. Declined
as a standalone record. Shock absorber inspection is noted in the HALO_26_002
editorial note as part of the broader specialist PPI scope for CGT buyers.

**918 Weissach Package carbon fiber and magnesium wheels:** Carbon fiber UV clearcoat
degradation and magnesium wheel corrosion are real inspection concerns for 10–13-year-old
Weissach Package cars, but Tier B sourcing for a bounded defect pattern specific to the
918 CF panels or wheels is absent. Declined as standalone record; noted as a buyer
inspection item in HALO_26_005 editorial note.

**918 E-fuel (synthetic fuel) compatibility:** No bounded defect pattern documented.
Relevant only to long-term storage decisions. Declined.

**959 electrical/wiring age:** Real concern given 35+ year old wiring architecture, but
Tier B does not establish a bounded, specifically-documented defect pattern for the 959
wiring system distinct from general age-related wiring inspection. Declined as standalone
record; covered within general HALO_26_006 inspection guidance.

---

## Cross-Reference Notes

- **File 10 (Chassis/Suspension v1):** Confirmed no PCCB-specific record identified in
  File 10 cross-reference data; general PCCB inspection deferred to chassis files if
  subsequently authored. No duplication risk in this file.
- **File 22 (Modifications and Tunes):** No modification records authored here.
  Canepa 959 SC upgrades are disclosed pre-purchase (not a covert modification
  pattern); no cross-reference needed.
- **File 27 (Taycan):** 918 HV battery architecture (400V, ~6.8 kWh) is confirmed
  architecturally distinct from Taycan (800V, 79–93 kWh). No content duplication.

---

## Sources

| # | Source | Tier | URL |
|---|---|---|---|
| [1] | NHTSA Recall 23V-241 / PCNA Recall APA3 — CGT wishbone spherical joint stress corrosion (April 2023) | A | https://static.nhtsa.gov/odi/rcl/2023/RCLRPT-23V241-7631.PDF |
| [2] | Stuttcars.com — Porsche Carrera GT Buyer's Guide (January 2026) | B | https://www.stuttcars.com/porsche-buyers-guides/porsche-carrera-gt-buyers-guide/ |
| [3] | Repasi Motorwerks (via American Collectors Insurance) — CGT Type 980 Service feature (December 2023) | B | https://americancollectors.com/articles/repasi-motorwerks/ |
| [4] | Rennlist — Carrera GT Clutch Replacement thread | C (consistency reference) | https://rennlist.com/forums/porsche-supercars-carrera-gt-918-960/848866-carrera-gt-clutch-replacement.html |
| [5] | NHTSA — 918 Spyder recall campaigns AE03 (2014), 16V-885 (2016), AJ04 (2018). Primary PDFs on file at NHTSA; not directly retrieved (tier_a_doc_retrieved: referenced_only) | A | https://www.nhtsa.gov/vehicle/2015/PORSCHE/918%20SPYDER |
| [6] | NHTSA TSB 10165159 (Porsche TSB 122-Q6M4M-09, August 2019) — 918 HV Control Unit reprogramming. Primary doc MC-10165159-9999.pdf; not directly retrieved (tier_a_doc_retrieved: referenced_only) | A | https://static.nhtsa.gov/odi/tsbs/2019/MC-10165159-9999.pdf |
| [7] | Repasi Motorwerks — 918 Spyder Battery Replacement: Costs & Information (February 2026) | B | https://repasimotorwerks.com/blog/918-spyder-battery-replacement-cost |
| [8] | PCA Tech Tips — Nine facts about the Porsche 959 (January 2022) | A | https://pca.org/news/nine-facts-you-may-not-have-known-about-the-porsche-959-pca-tech-tips |
| [9] | Canepa.com — 1987 Porsche 959 specialist inventory documentation | B | https://www.canepa.com/photo-gallery/1987-porsche-9597044/ |
| [10] | RM Sotheby's — 1988 Porsche 959 SC Reimagined by Canepa, Miami 2025 (secondary Canepa reference) | B | https://rmsothebys.com/auctions/mi25/lots/r0030-1988-porsche-959-sc-reimagined-by-canepa/ |

---

## Self-Review — 8-Point Checklist (Original)

**Point 1 — Required fields present in all records?**
Checked. All six records contain: id, flag_title, description, applicability,
keywords_addressed/concerning/active_problem, evidence_basis, sources,
editorial_note, buyer_questions.
**Finding: None.** *(keywords_documented absent — caught in second-opinion review, fixed)*

**Point 2 — All numeric claims have source anchors?**
- HALO_26_001: prevalence_rate anchored [1]. ✓
- HALO_26_002: cost_range_usd anchored [2][3]; prevalence_rate anchored [2]; mileage anchored [2][4]. ✓
- HALO_26_003: typical_failure_age_years anchored [2]. ✓
- HALO_26_004: prevalence_rate added in second-opinion review; anchored [5]. ✓
- HALO_26_005: typical_failure_age_years anchored [7]. ✓
- HALO_26_006: No numeric cost claim made; cost_range omitted per convention. ✓
**Finding: None.**

**Point 3 — No Tier C sole-sourcing for cost or prevalence?**
Rennlist [4] is used only as a consistency reference in HALO_26_002, explicitly
labeled "not sole-sourced for any claim." ✓
**Finding: None.**

**Point 4 — Generation keys match locked conventions?**
`carrera_gt`, `918`, `959` added to PROJECT_STATE.md Locked Conventions.
**Finding resolved.**

**Point 5 — No duplicate records?** ✓ **Finding: None.**

**Point 6 — evidence_basis uses valid sub-listed format?** ✓ **Finding: None.**

**Point 7 — Paraphrase-first; no direct quotes >15 words?**
One 14-word quote in HALO_26_005 `typical_failure_age_source_anchor`. Under limit. ✓
**Finding: None.**

**Point 8 — Population framing appropriate throughout?**
HALO_26_001 prevalence_rate corrected to "near-universal" in second-opinion review. ✓
**Finding resolved.**

---

## Second-Opinion Review — Results

**Reviewer finding count:** 6 (2 critical, 1 high, 1 moderate, 2 minor)
**All 6 findings resolved in this revision.**

| # | Severity | Finding | Fix applied |
|---|---|---|---|
| 1 | Critical | HALO_26_004 source [5] cars.com URL cited as Tier A | Retargeted to nhtsa.gov with tier_a_doc_retrieved: referenced_only |
| 2 | Critical | HALO_26_005 source [6] carcomplaints.com URL cited as Tier A | Retargeted to NHTSA static CDN primary document path with referenced_only |
| 3 | High | HALO_26_001 prevalence_rate "common" should be "near-universal" | Changed to near-universal; anchor updated with schema-mapping rationale |
| 4 | Moderate | HALO_26_004 missing prevalence_rate | Added near-universal with source anchor covering cumulative recall coverage |
| 5 | Minor | keywords_documented absent from all 6 records | Added to all 6 records |
| 6 | Minor | CGT shock absorber declined candidate pointed to wrong editorial note | Fixed cross-reference; shock absorber mention added to HALO_26_002 editorial note |

---

*End of File 26*
