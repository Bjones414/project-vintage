# 15 — Body Exterior Systems

**File:** `docs/reference/defects/15_body_exterior.md`
**content_status:** draft
**Session:** 2026-05-07
**Record count:** 3 (BODY_EXT_15_001 through BODY_EXT_15_003)

---

## Scope

Paint, glass, door regulators and window mechanisms, lock mechanisms, headlight assemblies (physical assembly only — lens fogging/yellowing/cracking; ballast/igniter electrical failures remain in the electrical deferred queue per File 21), side mirrors, trunk/frunk mechanisms, and tailgate wiring harness chafing on Cayenne. Body and trim failure modes detectable on inspection.

**Out of scope for this file:**
- Roof mechanisms — **File 16 — Body Roof Mechanisms v2**
- Cabriolet tops and hydraulics — **File 07 — Cabriolet**
- Interior trim — **File 17 — Interior + HVAC v2**
- Electrical failures within headlight assemblies — **File 21 — Electrical v2 + Infotainment** deferred queue
- Pre-996 air-cooled non-engine body systems — **File 23 — pre-996 air-cooled non-engine systems**
- 928/transaxle 4-cyl body systems — **File 24 — 928 + transaxle 4-cyl non-engine systems**

**Headlight scope boundary (resolved at authoring):** Physical-assembly lens fogging/yellowing declined at v1 bar — see Declined Candidates below. Ballast/igniter electrical failures remain in File 21 deferred queue.

---

## Declined Candidates

The following candidates were researched and declined for v1. Documented to prevent re-debate.

**Paint delamination and clear-coat failure** — Tier C only. No Tier B defect article with Porsche-specific clear-coat failure rate found. Multiple forum threads (Pelican forums, Rennlist, 911UK) confirm the pattern, but specialist-level defect framing with prevalence quantification is absent. Remain in deferred queue pending Pelican Parts, FCP Euro, or PCarwise publication of a generation-specific clear-coat defect article.

**Headlight lens fogging and UV degradation (all gens)** — Tier C only. Pelican Parts article for the 996/997 covers lens/bulb *replacement procedure*, not defect prevalence. No standalone Tier B defect article with Porsche-specific fogging prevalence found. Decline at v1 bar. Deferred queue.

**Weatherstrip and door seal failure (water intrusion at A-pillar, door seals)** — No Tier B defect framing found. Seal degradation acknowledged as a maintenance item in multiple forums but without specialist-level defect characterization. Decline.

**Sunroof drain blockage (water intrusion from clogged drains)** — Identified as a scheduled maintenance item on the Porsche maintenance interval sheet (per PCarwise). Not a defect-level failure pattern independent of maintenance neglect. Cross-referenced in File 16 for Cayenne 958 sunroof record as maintenance note.

**Door lock mechanism failure (vacuum-actuated / electric solenoid)** — Pelican Parts 986/987 door lock/handle technical article covers repair procedure only; no prevalence claim. No Tier B defect article with Porsche-specific failure rate found. Decline.

**Side mirror failure (motor, fold mechanism, glass delamination)** — No Tier B defect article found. Decline.

**Frunk/trunk latch and strut failures** — PCarwise (Cayenne Common Problems) frames Cayenne gas strut weakening as a maintenance item ("cheapest fix there is"). No Tier B defect article with population-level failure rate. Decline as maintenance advisory.

---

## Record TOC

| ID | Title | Generations |
|---|---|---|
| BODY_EXT_15_001 | Door/window regulator cable failure | 996.1, 996.2, 986, 987.1, 987.2, 997.1, 997.2 |
| BODY_EXT_15_002 | Cayenne tailgate wiring harness flex failure | cayenne_955, cayenne_957 |
| BODY_EXT_15_003 | 992.1 windshield and rear window bonding recall | 992.1 |

---

## Editorial Constraints

- **Cross-reference File 07** (Cabriolet) for soft-top body and seal failures on 996/997 and 986/987/981/718 cabriolet variants — these are not covered here.
- **Cross-reference File 11** (Electrical) or **File 21** (Electrical v2 + Infotainment) for electrical failures that are downstream consequences of body-level failures. For example, water intrusion from a failed body seal causing ECU or module damage is a body root cause; electrical damage is a downstream consequence.
- **Cross-reference File 16** (Roof Mechanisms) for Targa sliding glass roof seal failures and Cayenne sunroof motor failures.
- Generation naming: `cayenne_955` / `cayenne_957` / `cayenne_958` / `cayenne_9Y0` per locked conventions. `992.1` for the first-generation 992.
- No Porsche-only framing in editorial prose.

---

## Records

---

```yaml
id: BODY_EXT_15_001
flag_title: "Door window regulator cable failure"
description: |
  The door window regulator on 996, 986, 997, and 987-platform cars uses a
  cable-and-pulley design in which the steel cable can snap or the plastic
  pulley and guide components can crack with age. When the cable snaps, the
  window drops into the door cavity and cannot be raised; the failure is
  usually announced by a loud grinding or crunching sound. Repair requires
  door panel removal and regulator assembly replacement; the motor is
  typically reusable. Regulators for the 996/986 generation and the 997/987
  generation are not interchangeable — generation must be confirmed before
  ordering parts.

applicability:
  generation: [996.1, 996.2, 986, 987.1, 987.2, 997.1, 997.2]
  body: [Coupe, Cabriolet, Targa]
  year_range: [1997, 2012]
  notes: >
    Cayman 987 (2006–2012) shares the 987-platform regulator and is in scope.
    981 and 718 platforms are explicitly excluded; they use a revised door
    architecture for which no Tier B defect article was found. For Cabriolet
    variants, window regulator failure can prevent the window from dropping the
    required amount to clear the soft-top sealing strip, which is an additional
    failure presentation distinct from the cable-snap failure mode.

severity: low
# Low: drivable but vehicle is unsecured from weather and theft if window
# is stuck in the lowered or partially lowered position; repair is a
# straightforward parts replacement.

prevalence_rate: "common"
prevalence_source_anchor: |
  Pelican Parts' 986/987 technical article frames regulator replacement as a
  routine and expected repair rather than an exceptional failure, describing
  the component as among the most frequently replaced on these platforms [B1].
  Go-Parts' dedicated defect guide independently characterizes regulator failure
  on the 996, 986, 997, and 987 as very common, noting that plastic component
  and cable degradation is a well-documented pattern across all four platforms
  and that no NHTSA TSB or recall exists because the failure is classified as
  normal wear [B3].

failure_correlation: mixed
# Mixed: age (accumulated opening/closing cycles degrade cable and plastic
# pulley components) and, for Cabriolet variants, usage pattern (roof
# operation cycles add an additional opening/closing load per roof cycle).

keywords_addressed:
  - "window regulator replaced"
  - "new window regulator"
  - "window regulator replacement"
  - "regulator replaced"
  - "window mechanism replaced"
keywords_concerning:
  - "window slow to close"
  - "window slow to open"
  - "window not dropping"
  - "window grinding noise"
  - "window won't go up"
  - "window clicking noise"
  - "window stuck"
keywords_active_problem:
  - "window dropped into door"
  - "glass fell in door"
  - "window won't close"
  - "window inoperative"
  - "window fell"

evidence_basis: specialist_consensus

sources:
  - "[B1] Pelican Parts — Porsche Boxster Window Regulator Replacement (986/987 1997–08). Tier B. https://www.pelicanparts.com/techarticles/Boxster_Tech/77-BODY-Window_Regulator/77-BODY-Window_Regulator.htm"
  - "[B2] Pelican Parts — Porsche 911 Carrera Window Regulator and Motor Replacement (996 1998–2005; 997 2005–2012). Tier B. https://www.pelicanparts.com/techarticles/porsche-996-997-carrera/77-body-replacing_your_window_regulator_and_motor/77-body-replacing_your_window_regulator_and_motor.htm"
  - "[B3] Go-Parts — Porsche 911, Boxster & Cayman Window Regulator Failure: Noises, Fixes & Part Numbers (1997–2012). Tier B. https://www.go-parts.com/garage/window-regulator-porsche-911-porsche-boxster-porsche-cayman-1997-2012"

editorial_note: |
  Window regulator failure is a normal wear item on 996, 986, 997, and 987
  cars — expected on any high-mileage or well-aged example. The failure is not
  dangerous, but a window stuck in the lowered position leaves the cabin open
  to weather and theft until repaired. Parts for the 996/986 generation and the
  997/987 generation are incompatible, so repair history should reference which
  generation regulator was fitted. On Cabriolet variants, a worn regulator may
  prevent the window from dropping far enough to clear the soft-top seal —
  see **File 07 — Cabriolet** for related soft-top coverage.

buyer_questions:
  - "Has either window regulator been replaced? If so, which side, which generation part, and at what mileage?"
  - "Do both windows drop and rise fully when opening or closing a door from inside and outside? Any grinding, clicking, or hesitation?"
  - "On Cabriolet variants: do both windows drop freely before the soft top begins to move?"
```

---

```yaml
id: BODY_EXT_15_002
flag_title: "Cayenne 955/957 tailgate harness flex failure"
description: |
  The wiring harness supplying electrical power to the 955 and 957 Cayenne
  tailgate routes through the tailgate hinge area, where it is subject to
  repeated flex stress every time the liftgate is opened or closed. Over time,
  individual wires within the harness fatigue and break at the flex point,
  producing intermittent or complete failure of any or all tailgate-supplied
  circuits — commonly the rear wiper, tailgate lock, backup camera, license
  plate lights, and defroster — before the fault becomes permanent. Fault codes
  and dashboard warnings may appear without a clear cause until the harness is
  inspected at the hinge.

applicability:
  generation: [cayenne_955, cayenne_957]
  year_range: [2003, 2010]
  notes: >
    cayenne_958 is explicitly excluded — the 958 introduced a revised tailgate
    architecture; no Tier B defect article characterizing the same flex-failure
    pattern on the 958 was found. This record covers 955 (MY2003–2006) and 957
    (MY2007–2010) only.

severity: low
# Low: failure produces intermittent electrical annoyances rather than
# safety-critical or drivability consequences; the harness can be inspected,
# bypassed, or replaced at moderate cost.

failure_correlation: age
# Age and accumulated open/close cycles degrade the harness at the flex point.

keywords_addressed:
  - "tailgate harness replaced"
  - "wiring harness replaced"
  - "rear harness repaired"
  - "liftgate harness replaced"
keywords_concerning:
  - "rear wiper intermittent"
  - "tailgate lock not working"
  - "backup camera not working"
  - "license plate lights not working"
  - "tailgate warning light"
  - "rear wiper fault"
  - "hatch warning light"
keywords_active_problem:
  - "tailgate not opening"
  - "rear wiper inoperative"
  - "backup camera failure"
  - "tailgate electrical failure"

evidence_basis: specialist_single_source

sources:
  - "[B4] PCarwise — Porsche Cayenne Common Problems (955 / 957 / 958 / 9Y0). Tier B. https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/"

editorial_note: |
  Before buying a 955 or 957, verify that the rear wiper, tailgate lock,
  backup camera (if equipped), license plate lights, and rear defroster all
  function with the tailgate both open and closed. A scan tool may surface
  tilt-angle sensor, wiper motor, or tailgate module fault codes before any
  visible wire damage at the hinge flex point. The fix is usually a harness
  repair or bypass rather than an expensive dealer assembly, but intermittent
  faults misattributed to unrelated modules can accumulate unnecessary repair
  costs. Cross-reference **File 11 — Electrical** for the related but distinct
  water-intrusion harness failure pattern on the 955/957.

buyer_questions:
  - "Do the rear wiper, tailgate lock, backup camera, license plate lights, and defroster all work properly?"
  - "Has the tailgate wiring harness been inspected or replaced? Any history of tailgate electrical faults or fault codes?"
```

---

```yaml
id: BODY_EXT_15_003
flag_title: "992 windshield and rear glass bonding recall"
description: |
  NHTSA Safety Recall 24V-155 (Porsche recall designation ARA3) covers certain
  2020–2024 Porsche 911 vehicles in which the front windshield and rear window
  may not be adequately bonded to the body due to insufficiently cleaned
  contact surfaces at the factory. An improperly bonded windshield may
  partially detach and, in a crash, may fail to support the front airbags as
  intended. Dealers inspect and replace the windshield and rear window as
  necessary at no charge to the owner. A VIN check at nhtsa.gov/recalls is
  required to determine whether the specific vehicle is within the affected
  production batch and whether the recall has been completed.

applicability:
  generation: [992.1]
  year_range: [2020, 2024]
  notes: >
    Recall covers vehicles manufactured July 8, 2019, through October 30, 2023
    (992.1 production). 8,101 vehicles total within the recall scope. All body
    styles (Coupe, Cabriolet, Targa) are within scope; NHTSA documentation does
    not restrict by body style or trim. Verify via VIN at nhtsa.gov/recalls —
    not all 992.1 units are affected, only those within the production batch.

severity: low
# Low: cost to owner is $0 (recall remedy is free of charge per PCNA/NHTSA).
# The safety risk of an unresolved recall is captured in the editorial note.
# A schema-extension-queue entry has been filed for a future `safety_recall`
# boolean field that would allow the matcher to route recall records
# independently of the cost-anchored severity tier.

cost_range_usd: [0, 0]
cost_source_anchor: |
  NHTSA 24V-155 and Porsche recall ARA3 both specify that dealers will inspect
  and replace the windshield and rear window as necessary at no charge to the
  owner [A1][A2].

failure_correlation: age
# The bonding deficiency was present at manufacture; adhesive weakness may
# become more susceptible to detachment over time and under impact. As a
# manufacturing recall, production-batch membership is the primary scope
# criterion — mileage and usage pattern are secondary.

keywords_addressed:
  - "recall completed"
  - "ARA3 recall complete"
  - "windshield replaced under recall"
  - "glass bonding recall done"
  - "recall ARA3"
  - "recall 24V-155"
  - "windshield recall"
keywords_concerning:
  - "windshield recall open"
  - "recall not completed"
  - "windshield seal"
  - "windshield cloudy"
keywords_active_problem:
  - "windshield detached"
  - "rear glass loose"
  - "windshield partially detached"
  - "windshield falling"

evidence_basis: manufacturer_acknowledged

sources:
  - "[A1] NHTSA Safety Recall Report 24V-155 — Porsche 2020-2024 911, Visibility: Glass. Tier A. https://static.nhtsa.gov/odi/rcl/2024/RCLRPT-24V155-4707.PDF"
  - "[A2] Justia — NHTSA Campaign ID 24V155000, Porsche 911 2020-2024 windshield/rear window bonding recall summary. Tier A. https://auto-recalls.justia.com/porsche/911/2024/24v155000/index.html"

editorial_note: |
  This is a safety recall with a straightforward resolution: a VIN check
  confirms whether the car is affected, and if so, whether the recall has
  been completed. On any 992.1 offered at auction, the listing should either
  confirm recall completion or the buyer should verify at nhtsa.gov/recalls
  before bidding. Most affected cars manufactured in 2020–2021 have had
  substantial time for recall completion; later 2023-build cars may be more
  likely to have an open recall at the time of first auction appearance.
  A car with an unresolved safety recall is a meaningful due-diligence gap
  regardless of the recall's actual repair cost.

buyer_questions:
  - "Has NHTSA recall 24V-155 (Porsche recall ARA3) been completed on this vehicle? Can you provide the service record or dealer completion documentation?"
  - "Has the VIN been checked at nhtsa.gov/recalls to confirm recall status?"
```

---

## Sources (File Level)

### Tier A

- **[A1]** NHTSA Safety Recall Report 24V-155 — Porsche 2020–2024 911, Visibility: Glass (windshield and rear window bonding deficiency). Recall designation: Porsche ARA3. 8,101 vehicles. Manufactured July 8, 2019 – October 30, 2023. PCNA notification mailed August 30, 2024.
  URL: https://static.nhtsa.gov/odi/rcl/2024/RCLRPT-24V155-4707.PDF

- **[A2]** Justia / NHTSA — Campaign ID 24V155000 recall summary. Confirms free-of-charge dealer inspection and replacement.
  URL: https://auto-recalls.justia.com/porsche/911/2024/24v155000/index.html

### Tier B

- **[B1]** Pelican Parts — Porsche Boxster Window Regulator Replacement / Window Switch Replacement / Window Motor Replacement (986/987, 1997–2008). Technical article by Wayne R. Dempsey and staff. Describes regulator as "one of the most worn out parts" and covers failure modes and replacement procedure.
  URL: https://www.pelicanparts.com/techarticles/Boxster_Tech/77-BODY-Window_Regulator/77-BODY-Window_Regulator.htm

- **[B2]** Pelican Parts — Porsche 911 Carrera Window Regulator and Motor Replacement (996 1998–2005; 997 2005–2012). Technical article covering cable-type regulator replacement and generation compatibility.
  URL: https://www.pelicanparts.com/techarticles/porsche-996-997-carrera/77-body-replacing_your_window_regulator_and_motor/77-body-replacing_your_window_regulator_and_motor.htm

- **[B3]** Go-Parts — Porsche 911, Boxster & Cayman Window Regulator Failure: Noises, Fixes & Part Numbers (1997–2012). Defect guide. Confirms "very common" failure, no NHTSA TSB/recall, cable-snap failure mechanism, and generation incompatibility of parts. Applies to 996, 986, 997, 987, and Cayman 987.
  URL: https://www.go-parts.com/garage/window-regulator-porsche-911-porsche-boxster-porsche-cayman-1997-2012

- **[B4]** PCarwise — Porsche Cayenne Common Problems (955 / 957 / 958 / 9Y0). Explicitly identifies tailgate wiring harness fatigue through the hinge flex point as a common cause of rear-circuit failures on 955 and 957.
  URL: https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/

---

*End of 15_body_exterior.md*
