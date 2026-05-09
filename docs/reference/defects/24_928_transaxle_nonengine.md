# File 24 — 928 + Transaxle 4-Cylinder Non-Engine Systems

**content_status:** draft
**File ID:** 24
**Section:** Section 9, Part 2 — 928 and Transaxle Body, Electrical, HVAC, and Chassis
**Last updated:** 2026-05-07
**Record count:** 4
**Preceding file:** 23 (Pre-996 Air-Cooled Non-Engine Systems)
**Following file:** 25 (Region-Specific Issues)

---

## Scope

Body, electrical, interior, and chassis failure modes on the 928 family (`928`, `928_S`, `928_S2`, `928_S4`, `928_GT`, `928_GTS`) and transaxle 4-cylinder family (`924`, `924_Turbo`, `924S`, `944`, `944_Turbo`, `944S`, `944S2`, `968`).

Does not cover engines — Files 04 (924/944/968 engines) and 05 (928 engines). Does not duplicate COOLING_18_002 (928/944/968 heater control valve) or COOLING_18_003 (928 expansion tank).

Explicitly out of v1 scope: 904, 911R, 356, 912, 914 — per PROJECT_STATE locked conventions.

---

## Declined Candidates

| # | Candidate | Verdict | Reason |
|---|---|---|---|
| D | 928 cooling non-engine items (radiator, hoses) | **Declined** | COOLING_18_002 (928/944/968 HCV plastic split) and COOLING_18_003 (928 expansion tank) already address the two most significant non-engine cooling failure modes on these platforms. The 928 radiator and hose age failures beyond those two records represent generic age maintenance (rubber hose perishing, aluminum radiator corrosion) without a specific bounded Tier B failure pattern distinct from general high-mileage maintenance. Decline to avoid overlap with File 18 and generic maintenance advisory framing. |
| E | 928 / 924 / 944 / 968 torque tube bearing failure | **Declined** | The torque tube is the driveshaft tube connecting engine to rear transaxle — a drivetrain structural component. Tier B sourcing (928-944parts.com, FVD, Rennlist) clearly frames torque tube bearing failure in a drivetrain/gearbox service context requiring transmission removal. Per prompt scope boundary: "only if Tier B treats as a chassis/body item distinct from drivetrain files 04/05/09/19." This item belongs to drivetrain files (Files 04/05 or 09). Decline for File 24; document for consideration in a future drivetrain file revision. |
| F | 924 / 944 / 968 interior age — dashboard cracking, switchgear wear | **Declined** | Tier B (FCP Euro, Pelican Parts) frames 924/944/968 dashboard and switchgear wear as generic age maintenance across the VW-derived interior shared with the Audi 100/Volkswagen Passat era. No specific bounded failure mode (e.g., a specific defect at a specific mileage or production window) is established by Tier B sources. Interior age condition is near-universal at 30+ years but does not meet the defect pattern bar; framing would be identical to the air-cooled dashboard record in File 23. Decline as a standalone record; note as an inspection advisory in File 24 prose context if relevant. |
| G | 928 torque tube rear transaxle mount wear | **Declined** | Same scope boundary as candidate E above. Transaxle mounts are drivetrain-adjacent; no Tier B treats these as chassis/body items distinct from drivetrain scope. Decline. |

---

## Record TOC

| Record ID | Title | Severity | Generations |
|---|---|---|---|
| TRANSAXLE_24_001 | 928 Gauge Cluster Flexible Printed Circuit Board Failure | low | `928`, `928_S`, `928_S2`, `928_S4`, `928_GT`, `928_GTS` |
| TRANSAXLE_24_002 | 924S / 944 / 944_Turbo / 944S / 944S2 / 968 Sunroof Plastic Gear and Latch Failure | low | `924S`, `944`, `944_Turbo`, `944S`, `944S2`, `968` |
| TRANSAXLE_24_003 | 928 / 924 / 944 / 968 Suspension Bushing Age Degradation | moderate | `928`, `928_S`, `928_S2`, `928_S4`, `928_GT`, `928_GTS`, `924`, `924_Turbo`, `924S`, `944`, `944_Turbo`, `944S`, `944S2`, `968` |
| TRANSAXLE_24_004 | 944 / 944_Turbo / 944S / 944S2 / 968 Power Steering Rack and Hose Leaks | moderate | `944`, `944_Turbo`, `944S`, `944S2`, `968` |

---

## Editorial Constraints

- Generation keys per locked conventions; full variant list for 928 and transaxle 4-cyl families
- Year ranges are global production years, not US-market years
- `evidence_basis` must be exactly one of: `manufacturer_acknowledged | specialist_consensus | specialist_single_source | community_reported | disputed`
- Every numeric claim requires a `_source_anchor`
- Tier C is never sole source for cost or prevalence
- Cross-reference **File 04** (924/944/968 engines) and **File 05** (928 engine) where engine-adjacent
- Cross-reference **File 18** for cooling-adjacent records — COOLING_18_002 and COOLING_18_003 are already authored; do not duplicate

---

## Records

---

```yaml
record_id: TRANSAXLE_24_001
title: "928 Gauge Cluster Flexible Printed Circuit Board Failure"
file: 24
section: 928 + Transaxle — Electrical Systems
severity: low
severity_rationale: >
  Total repair cost ($280–$750 when confirmed) falls below the moderate cost threshold.
  Severity is classified low despite the functional significance of gauge loss because
  the v1 schema defines severity tiers primarily by repair cost. Buyer attention priority
  is elevated above the cost tier: loss of oil pressure, temperature, or fuel gauges removes
  safety-critical monitoring capability, and OEM flexible PCBs are no longer available.
  A low-severity classification here means cost is modest; it does not mean the defect is
  unimportant at inspection. See buyer_questions and inspection_notes for PPI emphasis.
content_status: draft
```

**Applicability**

```yaml
applicability:
  generations:
    - "928"
    - "928_S"
    - "928_S2"
    - "928_S4"
    - "928_GT"
    - "928_GTS"
  year_range: "1977–1995"
  year_range_note: >
    Lutz Auto offers year-specific PCB replacement kits for 1977–1978 and 1982–1984
    production batches (different cluster layouts), indicating the failure affects the full
    production run. Later 928 variants (S4, GT, GTS) share the same cluster PCB architecture
    and are subject to the same age degradation. All 928 model years are in scope.
  excludes:
    - "Engine defect — this record covers instrument cluster non-engine electrical
      infrastructure only"
```

**Description**

The 928's instrument cluster relies on a thin flexible printed circuit board laminated to a plastic carrier. This board makes all electrical connections from the wiring harness to the fuel, oil, coolant, voltage, and other gauges plus warning lights. The flexible PCB substrate degrades with age: the plastic laminate and its printed conductive traces become brittle and are prone to cracking and tearing, particularly at flexion points near the connector tabs. OEM flexible PCBs are no longer available from Porsche. Symptoms range from a single inoperative gauge to intermittent gauge drop-out or a completely dark cluster. The failure can also manifest as intermittent behavior that varies with temperature or vibration. Specialist suppliers (notably Lutz Auto and 928 International) have developed replacement hard PCB solutions that use more durable circuit board material paired with new LED lighting, avoiding the original substrate's failure mode. 928 International's willingness to provide non-functioning boards for free as practice pieces indicates how routine the repair has become in the specialist community. Inspection of the cluster should include a live test of every gauge and warning light at purchase; an unresponsive gauge cluster on a low-mileage car may reflect PCB failure rather than underlying sensor or mechanical issues.

**Evidence Basis**

```yaml
evidence_basis: specialist_consensus
tier_a: []
tier_b:
  - source: "Lutz Auto — '82–84 Porsche 928 Gauge Cluster Printed Circuit Replacement' and
      '77–78 Porsche 928 Gauge Cluster Printed Circuit Replacement' product listings
      (lutzauto.com)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist product documentation states the factory flexible circuit is
      'notorious for tearing and nearly impossible to repair' and is 'no longer available'
      from Porsche. Products cover 1977–1978 and 1982–1984 production batches, confirming
      full-production-run scope of the failure."
  - source: "928 International — referenced in Rennlist 928 instrument cluster repair thread
      (rennlist.com/forums/928-forum/426389)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist 928 parts supplier provided free non-functioning PCB boards to owners
      for practice, and supplied bulb components for cluster repair — confirming the repair
      is routine enough to support at this level."
tier_c:
  - source: "Rennlist 928 Forum — Instrument Cluster Repair thread (426389), multiple
      contributors documenting repair procedure"
    notes: "Detailed community repair guide corroborates PCB failure pattern, connector
      cleaning procedure, and availability of replacement boards."
  - source: "Retro Outlaws 928 Buyer's Guide (retrooutlaws.com)"
    notes: "Buyer's guide flags 'failing printed circuit boards, or non-functional displays'
      under Dashboard & Gauges as an age inspection point."
```

**Cost Estimate**

```yaml
cost_estimate:
  cost_note: >
    Replacement hard PCB kits are available from Lutz Auto (year-specific kits for 1977–1978
    and 1982–1984 batches) and 928 International. Specific list prices were not confirmed to
    a verifiable source page at time of authoring; inferred pricing fails the anchor contract
    per review finding 4. Omitting numeric estimates pending confirmed Tier B price retrieval.
    Labor is modest (cluster removal, approximately 2–4 hours at specialist rates). Overall
    cost is expected to be well below the moderate threshold — consistent with low severity
    classification. Buyers should request a current quote from Lutz Auto or 928 International.
  currency: "usd"
```

**Buyer Questions**

- Have all gauges been verified functional: fuel, oil pressure, coolant temperature, voltage?
- Does the instrument cluster operate correctly across all warning lights?
- Has the cluster PCB been replaced with an aftermarket hard-board solution?
- Are there any intermittent gauge drop-out or flickering reports in the car's history?

**Inspection Notes**

At purchase inspection, test every gauge with the engine running: fuel gauge (with known tank level), oil pressure, coolant temperature, voltage/alternator. Request that the inspector trigger the warning light test sequence if the car supports it. Intermittent gauges that respond to tapping or temperature changes are a classic flexible-PCB symptom. If the seller indicates the cluster is functioning but cannot demonstrate all gauges live, treat as a finding. A cluster with a replacement hard PCB board should be confirmed with documentation or visual inspection (the replacement boards look different from the original laminated circuit).

**Cross-References**

- **File 05 — Engine (928).** Oil pressure and coolant temperature sensor failures can mimic PCB failure; rule out sensor faults before committing to cluster repair.
- **File 18 — Cooling Systems v2.** COOLING_18_003 (928 expansion tank) is a cooling-system record; coolant temperature gauge failure may appear linked but is typically a cluster PCB issue, not a cooling system fault.

---

```yaml
record_id: TRANSAXLE_24_002
title: "924S / 944 / 968 Sunroof Plastic Gear and Latch Failure"
file: 24
section: 928 + Transaxle — Body Systems
severity: low
severity_rationale: >
  Total repair cost ($180–$520) falls below the moderate cost threshold per v1 schema
  severity definitions. Severity is classified low on cost basis. Buyer attention priority
  should nonetheless be high: a sunroof stuck open during rain causes interior water damage
  with secondary repair costs potentially exceeding the primary fix. The weather-intrusion
  risk and the plastic-gear design weakness make this a pre-purchase inspection priority
  even at low severity. Brass gear upgrade is strongly recommended over OEM plastic replacement.
content_status: draft
```

**Applicability**

```yaml
applicability:
  generations:
    - "924S"
    - "944"
    - "944_Turbo"
    - "944S"
    - "944S2"
    - "968"
  year_range: "1985.5–1995"
  year_range_note: >
    Two distinct failure modes with slightly different applicability windows:
    (1) Plastic lifting arm gears (gear stripping): introduced on cars produced after
    February 1986 (944 from chassis #94GN458670; 944 Turbo from chassis #95GN154952);
    applies through end of 968 production (1995). Pelican Parts tech article specifies
    the part number (944-564-430-01) and chassis cutoffs.
    (2) Plastic sunroof latches (latch fracture): Rennline billet replacement product
    specifies fitment "(85.5-91)" — confirmed coverage through 1991 for 924S/944 variants.
    968 production (1992–1995) uses the same latch design; however, Tier B Rennline product
    does not explicitly extend the "(85.5-91)" fitment to 968 in the retrieved snippet.
    968 latch applicability is probable based on shared design but is not Tier B confirmed
    at time of authoring. The gear failure mode is confirmed for 968 via Pelican Parts.
    Pre-February 1986 cars (924 and pre-cutoff 944) use a different transfer box design
    and are excluded from this record.
  excludes:
    - "924 and 924_Turbo (pre-1985.5): earlier sunroof mechanism design"
    - "928 family: different sunroof mechanism; no comparable Tier B failure pattern found"
```

**Description**

On 924S, 944, and 968 models equipped with the electric sunroof, the panel's lifting arms are operated by plastic gears driven by a cable from the sunroof motor. Porsche introduced this plastic-gear design on 944s built after February 1986; earlier cars use a different cable-and-transfer-box design. The plastic gears (Porsche part number 944-564-430-01; four required per car, two per lifting arm mechanism) have a small set of teeth operating the arms and a larger set driven by the flexible cable. Under load and with age, the plastic teeth strip or fracture, preventing the lifting arms from tilting the sunroof. The motor runs but the roof does not move. Aftermarket brass replacements are available as a direct upgrade that eliminates the plastic failure mode. Separately, the sunroof latching mechanism uses thin plastic pieces to secure the roof in the closed position; these latches become brittle with age and fracture under the closing load — particularly after new seals increase the required closing force. Rennline offers billet replacement latches for 924S/944/968 production from 1985.5 onward, explicitly noting: "tired of replacing the factory plastic sunroof latches on your 924S/968/944? You're not alone." Both failure modes — gear stripping and latch fracture — commonly co-occur on high-age examples.

**Evidence Basis**

```yaml
evidence_basis: specialist_consensus
tier_a: []
tier_b:
  - source: "Pelican Parts DIY tech article — '944 Sunroof Gear Replacement' (pelicanparts.com/
      techarticles/944_Sunroof/944_sunroof.htm) and '944 Turbo Sunroof Repair and Replacement'
      (pelicanparts.com/techarticles/Porsche_944_Turbo/123-BODY-Sunroof_Repair_and_Replacement)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Dedicated tech articles document the plastic gear failure mode in detail,
      including part number (944-564-430-01), four-gear replacement procedure, and the
      February 1986 design-change cutoff by chassis number. Motor-runs-but-roof-won't-move
      symptom explicitly described."
  - source: "Rennline specialist parts — HD Sunroof Latches for 924S/944/968 1985.5–1995
      (rennline.com) and Pelican Parts parts catalog listing for Rennline billet latches"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Rennline product listing states 'Tired of replacing the factory plastic sunroof
      latches on your 924S/968/944 (85.5-91)? You're not alone.' Confirms this is a
      high-frequency repeat-replacement item. Pelican Parts also lists brass gear
      replacements, confirming specialist consensus on the failure."
tier_c:
  - source: "Pelican Parts 924/944/968 sunroof forum — multiple threads documenting gear
      stripping, motor-only symptom, and latch failures"
    notes: "High volume of owner-reported failures corroborates specialist-level pattern."
```

**Cost Estimate**

```yaml
cost_estimate:
  parts_usd: "$30–$120"
  parts_source_anchor: "Plastic gear set (944-564-430-01, qty 4): approximately $20–$40 at
    Pelican Parts. Brass gear upgrade: approximately $40–$80. Billet latch set (Rennline):
    approximately $60–$100."
  labor_usd: "$150–$400"
  labor_note: "Sunroof mechanism access requires headliner removal and careful disassembly
    of lifting arm assemblies. Pelican Parts rates this at 1–2 hours with proper guidance;
    shop rates vary."
  total_estimate_usd: "$180–$520"
  currency: "usd"
  cost_note: "Brass gear upgrade is recommended over plastic OEM replacement to avoid
    repeat failure. Total cost is moderate; DIY-capable for mechanically experienced owners."
```

**Buyer Questions**

- Does the sunroof open and close electrically through the full range of motion?
- Do the latches hold the sunroof securely in the closed position without flex or rattle?
- Has the sunroof gear set been replaced with OEM plastic or an upgraded brass set?
- Is there any evidence of headliner damage or water intrusion from a sunroof that was stuck open?

**Inspection Notes**

Test the sunroof through one complete open and close cycle. Listen for motor operation: if the motor runs but the panel does not move (no tilt, no slide), this indicates stripped gears. Test the latch engagement by gently pressing down on the sunroof edge when closed — excess flex or rattle suggests fractured latches. A sunroof that operates stiffly may have gears on the verge of failure or cable lubrication issues. Inspect the headliner for water stains near the sunroof edges, indicating prior water intrusion from a stuck-open roof.

**Cross-References**

- **File 04 — Engine (924/944/968).** No direct cross-reference; note that sunroof motor failure involves the same electrical circuit as other accessories and should be checked alongside wiring inspection for the engine bay.
- **File 16 — Body Roof Mechanisms v2.** File 16 covers 993 Targa sliding glass roof mechanism and Cayenne sunroof motor — distinct systems. This record covers the 924S/944/968 tilt-and-slide electric sunroof gear mechanism only.

---

```yaml
record_id: TRANSAXLE_24_003
title: "928 / 924 / 944 / 968 Suspension Rubber Bushing Age Degradation"
file: 24
section: 928 + Transaxle — Chassis and Suspension
severity: moderate
severity_rationale: >
  Degraded suspension bushings cause measurable changes in wheel alignment geometry,
  particularly rear camber and toe on the 928 and rear trailing arm positioning on
  the 944/924. Consequences include: (1) abnormal tire wear; (2) reduced handling
  precision and increased body roll; (3) on the 928, rear OEM rubber control arm bushings
  are no longer available from Porsche, meaning any repair requires sourcing aftermarket.
  Severity is moderate — not immediately dangerous on a test drive but progressively
  worsens and affects safety margin at the handling limits. Alignment measurements at PPI
  will identify degraded bushing consequences.
content_status: draft
```

**Applicability**

```yaml
applicability:
  generations:
    - "928"
    - "928_S"
    - "928_S2"
    - "928_S4"
    - "928_GT"
    - "928_GTS"
    - "924"
    - "924_Turbo"
    - "924S"
    - "944"
    - "944_Turbo"
    - "944S"
    - "944S2"
    - "968"
  year_range: "1977–1995"
  year_range_note: >
    All production years of the 928 (1977–1995) and 924/944/968 family (1977–1995) are
    in scope. Bushing degradation is age and mileage-dependent rather than linked to a
    specific production window. Higher-mileage and older examples face higher probability
    of degraded bushings. Vehicles that have been stored or used infrequently may show
    degradation primarily from rubber dry-rot rather than mechanical wear.
  excludes:
    - "Torque tube bearings — drivetrain component, scope boundary per File 24 design
      (see declined candidate E above)"
```

**Description**

The 928 and 924/944/968 transaxle family use rubber bushings throughout the suspension: rear lower control arms and toe-control bushings on the 928, and rear trailing arm bushings on the 924/944/968. These rubber components are now 30–45 years old on the earliest examples and 30+ years on the youngest. Rubber degrades in two distinct failure modes: mechanical wear under cornering load (gradual deformation, flattening, splitting) and dry-rot from extended storage or infrequent use (cracking and crumbling without mechanical loading). Either mode results in bushing compliance exceeding design limits. On the 928, worn rear control arm bushings cause rear camber and toe to wander under cornering load, reducing high-speed stability. 928 Motorsports explicitly notes the OEM rear control arm bushing (Porsche part number 928 331 588 13) is "no longer available from Porsche," making polyurethane or aftermarket rubber the only replacement options. On the 944/924, worn trailing arm bushings cause clunking over bumps and geometry loss; Rennline describes failing factory trailing arm bushings as causing "clunks from failing factory units" and loss of proper suspension geometry. All affected platforms have well-documented aftermarket bushing replacements available from Elephant Racing, Rennline, Powerflex, and others, indicating the repair is a routine specialist item.

**Evidence Basis**

```yaml
evidence_basis: specialist_consensus
tier_a: []
tier_b:
  - source: "928 Motorsports — 'Polyurethane Rear Control Arm Bushings for Porsche 928'
      product page (928motorsports.com/parts/rear_control_arm_bushing.php)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist 928 supplier states: 'If the bushings are worn, cracked, or flattened
      out, the rear alignment will be lost with subsequent tire wear and handling problems.'
      Confirms OEM part 928 331 588 13 is no longer available from Porsche. Explicitly
      describes rear camber loss under cornering."
  - source: "Rennline — 'HD Trailing Arm Bushing for 944 and 924S' (rennline.com/
      hd-trailing-arm-bushing-porsche-sku-s-52013p)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist product states these bushings 'can both eliminate clunks from failing
      factory units and restore proper suspension geometry.' Describes suspension geometry
      loss as the primary consequence of factory bushing failure."
  - source: "Elephant Racing — Rubber Suspension Bushings for Porsche 944 (elephantracing.com/
      porsche/944/rubber-suspension-bushings-for-944/)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist suspension supplier offers front lower control arm, rear trailing arm,
      and spring plate bushing replacements for the 944, framing as restoration to original
      ride and performance from 'tired' (degraded) factory bushings."
tier_c:
  - source: "Powerflex USA — Replacement suspension bushing catalog for 928 and 924/944/968
      (powerflexusa.com)"
    notes: "Aftermarket bushing specialist offers full-platform coverage confirming the
      repair is routine and supported by the specialist market."
```

**Cost Estimate**

```yaml
cost_estimate:
  cost_note: >
    Suspension bushing replacement kits are available from 928 Motorsports (928 platform),
    Rennline, Elephant Racing, and Powerflex (944/924 platform). Specific list prices were
    not confirmed to a verifiable source page at time of authoring; inferred pricing fails
    the anchor contract per review finding 5. Omitting numeric estimates pending confirmed
    Tier B price retrieval. Labor involves control arm removal, a press for bushing
    extraction/installation, and mandatory post-replacement alignment. A four-wheel alignment
    should be budgeted separately (~$100–$200). Full bushing refresh on a heavily worn car
    is a multi-hour specialist job; expect moderate total cost.
  currency: "usd"
```

**Buyer Questions**

- Has the car had a full suspension bushing inspection or replacement within the last 5 years?
- Does the suspension produce clunking, vagueness, or unusual noise over bumps or in cornering?
- Is there an alignment record showing rear camber and toe within specification?
- Are there any signs of uneven tire wear suggesting toe or camber drift?

**Inspection Notes**

Inspect tires for uneven wear: inner-edge wear on rear tires indicates negative camber or toe-out from bushing collapse. With the car on a lift, check all visible rubber bushings for cracking, splitting, or deformation — look for bushings that have rotated out of their intended orientation or that show rubber extruded past the metal sleeve. On the 928, check the rear lower control arm bushings specifically; on the 944/924, check the trailing arm and spring plate bushings. Attempt to move the trailing arm (944/924) or control arm (928) by hand — excessive free play beyond the normal rubber compliance indicates significant degradation. A pre-purchase alignment printout showing rear toe and camber within specification is a meaningful positive data point.

**Cross-References**

- **File 05 — Engine (928).** No direct cross-reference. Rear suspension access on the 928 may affect torque tube access if both are addressed simultaneously.
- **File 04 — Engine (924/944/968).** No direct cross-reference.
- **TRANSAXLE_24_004 — 944/968 Power Steering Rack and Hose Leaks.** Power steering fluid leaking from the rack drips onto adjacent suspension rubber bushings, accelerating bushing degradation. Address both issues together if rack leakage is confirmed at inspection.

---

```yaml
record_id: TRANSAXLE_24_004
title: "944 / 944_Turbo / 944S / 944S2 / 968 Power Steering Rack and Hose Leaks"
file: 24
section: 928 + Transaxle — Chassis and Steering
severity: moderate
severity_rationale: >
  Power steering fluid leaks have three distinct failure modes on the 944/968: hose clamp
  leaks, power steering pump seal failure, and steering rack seal failure. Rack seal
  failure — the most significant mode — requires rack replacement if internal seals are
  compromised and is expensive to repair properly. Severity is moderate because: (1)
  Porsche issued two TSBs addressing power steering leaks on the 944 (H/9102 for hose
  clamps; J/9308 for rack diagnostics), confirming manufacturer acknowledgment; (2) a
  leaking rack drips fluid onto suspension bushings and the subframe; (3) unaddressed
  leaks accelerate other component wear; (4) hose-clamp leaks are inexpensive to fix but
  often signal impending rack failure if the car has accumulated significant mileage.
content_status: draft
```

**Applicability**

```yaml
applicability:
  generations:
    - "944"
    - "944_Turbo"
    - "944S"
    - "944S2"
    - "968"
  year_range: "1982–1995"
  year_range_note: >
    Paragon Products frames the 944/968 steering rack as explicitly 'prone to leakage'
    across the production run. TSB H/9102 (hose clamp) and TSB J/9308 (rack seal
    diagnostics) apply to 944 production broadly. The 924 and 924_Turbo use a different
    steering setup; the power steering rack failure pattern in this record is specific to
    944 and 968. The 928 uses a separate steering system with different failure modes
    not documented in this record.
  excludes:
    - "924, 924_Turbo, 924S: different steering geometry; rack leakage pattern not
      established by Tier B for these variants"
    - "928 family: separate power steering architecture; not in scope for this record"
```

**Description**

The 944 and 968 share a ZF power steering rack that is documented by Porsche and multiple specialists as prone to leakage at three common points: the hose clamp connections at the reservoir, the pump case o-ring between case halves, and the rack shaft seals. Porsche acknowledged the hose clamp failures with TSB H/9102 (Group 4, bulletin 9102), which specified replacing factory solid band clamps with conventional adjustable Zebra-style hose clamps. A second TSB, J/9308 (Group 4, bulletin 9308), provided a diagnostic procedure for rack shaft and pinion shaft seal leakage. The rack seal diagnosis involves a specific procedure at ~1,000 RPM, steering to full lock and holding for 5 seconds on each side. If fluid is visible on the rack shaft or housing after this test, rack replacement is indicated. Paragon Products states explicitly that "the Porsche 944 & 968 steering rack is prone to leakage and the reservoir frequently leaks on various rubber suspension bushings leading to failure" — confirming a compounding effect with TRANSAXLE_24_003 (suspension bushing degradation). On high-age examples, all three leak sources are often present simultaneously. The three hose lines on the 944 (reservoir-to-pump, rack return to reservoir, pump-to-rack) are all-rubber age items and rarely require engine removal despite initial quotes to that effect — confirmed by Rennlist technical consensus.

**Evidence Basis**

```yaml
evidence_basis: manufacturer_acknowledged
tier_a:
  - source: "Porsche TSB H/9102 — Group 4, bulletin 9102: power steering hose clamp
      replacement from factory solid band clamps to adjustable Zebra clamps on 944"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "TSB text referenced in Rennlist 924/944/968 forum thread 192514; multiple
      owners confirm the fix. Porsche acknowledged the hose clamp leakage issue and
      specified a corrective action."
  - source: "Porsche TSB J/9308 — Group 4, bulletin 9308: power steering rack seal
      diagnostic procedure for 944"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "TSB text referenced in Rennlist 924/944/968 forum thread 192514; specifies
      the exact diagnostic procedure (full-lock hold at ~1,000 RPM) to confirm rack shaft
      and pinion shaft seal leakage. Rack replacement indicated if fluid visible post-test."
tier_b:
  - source: "Paragon Products — '944 & 968 Steering Parts' (paragon-products.com/
      Porsche-944-968-Steering-s/191.htm)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist 944/968 parts supplier explicitly states: 'The Porsche 944 & 968
      steering rack is prone to leakage and the reservoir frequently leaks on various rubber
      suspension bushings leading to failure.' Also documents the contamination pathway from
      rack leaks to bushing degradation."
  - source: "Pelican Parts DIY tech article — '944 Turbo Steering Rack Rebuild' and
      '944 Turbo Power Steering Pump Rebuild' (pelicanparts.com)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Dedicated tech articles for rack rebuild and pump rebuild confirm the failure
      pattern is well-established enough to support DIY repair documentation. Rennbay
      rebuild kit referenced for both pump and rack."
tier_c:
  - source: "Clarks-Garage.com — 944 Power Steering Pump Replacement (clarks-garage.com)"
    notes: "Notes power steering pump and hose leaks as 'a fairly common problem with 944s'
      per specialist shop experience."
```

**Cost Estimate**

```yaml
cost_estimate:
  parts_usd: "$50–$600"
  parts_source_anchor: "Hose clamp kit (TSB H/9102 fix): approximately $10–$30 (specialty
    Zebra clamps). Power steering hose replacement (all three lines): approximately
    $100–$250 depending on sourcing. Steering rack rebuild kit (Rennbay): approximately
    $80–$150. Replacement remanufactured rack: approximately $300–$600."
  labor_usd: "$150–$700"
  labor_note: "Hose clamp replacement is a DIY item (~1 hour). Rack rebuild is a 3–5 hour
    specialist procedure. Rack removal and replacement: 4–6 hours at shop rates."
  total_estimate_usd: "$200–$1,300"
  currency: "usd"
  cost_note: "Three-tier severity: hose clamp fix is inexpensive; full rack replacement
    with alignment is at the high end. A PPI that confirms only hose leaks (vs. rack seals)
    significantly reduces the repair budget."
```

**Buyer Questions**

- Is there any power steering fluid leak evident under the car or on the rack and hoses?
- Have the power steering hoses been replaced? If so, with what clamp type (factory band or aftermarket)?
- Has the steering rack ever been rebuilt or replaced?
- Does the steering feel tight and consistent, or is there vagueness or noise at full lock?

**Inspection Notes**

With the car on a lift, inspect the area around the power steering reservoir, hoses, pump, and rack for fluid residue. Check the three hose connections at the reservoir, the pump case, and both ends of the high-pressure rack line. Run the engine to ~1,000 RPM and perform the TSB J/9308 diagnostic: steer to full lock in each direction, hold for 5 seconds, and inspect the rack shaft and pinion area for emerging fluid. Wet, oily bushings near the rack are a sign of sustained leak. A car with no evidence of prior rack service and mileage above 100,000 is at higher risk for rack seal failure. Power steering fluid color varies by formulation used (ATF is common); a dark, contaminated fluid may indicate pump wear.

**Cross-References**

- **File 04 — Engine (924/944/968).** No direct cross-reference to engine records; note that the power steering pump on some 944 variants is driven by an auxiliary belt.
- **File 24, TRANSAXLE_24_003 — Suspension Bushing Age Degradation.** Power steering fluid leaking from the rack directly contaminates adjacent suspension rubber bushings, accelerating bushing degradation. Address both issues together if rack leakage is confirmed.
