# File 20 — Chassis v2

**Status:** draft (r2 — second-opinion review resolved, 10 findings fixed)
**Schema note:** `source_anchor:` appears as a sub-key within `cost_estimate:` in records 20-001 and 20-003. Prior files used inline `_source_anchor:` tags. Both forms anchor the claim to the same Tier B source; pipeline team should confirm both parse correctly before verified promotion.  
**Records:** 4 (CHASSIS_20_001 through CHASSIS_20_004)  
**Cross-reference guard:** File 10 covers 996/997/986/987 LCA (Record 1) and cayenne_955 air
suspension (Record 2). File 20 does not duplicate those populations.  
**Deferred from:** File 13 (PADM); File 10 deferred queue (Cayenne air suspension 957/958,
PASM dampers, PDCC system).

---

## Coverage

| ID | Title | Generations |
|---|---|---|
| CHASSIS_20_001 | PADM Active Drivetrain Mount — Sensor Failure and Water Ingress | 991.1, 991.2, 992.1, 981, 718 |
| CHASSIS_20_002 | Cayenne Air Suspension — Compressor Burnout and Strut Failure Cascade (957/958) | cayenne_957, cayenne_958 |
| CHASSIS_20_003 | PASM Shock Absorber — Premature Seal Degradation and Solenoid Valve Failure | 991.2, 992.1, 981, 718, cayenne_958/9Y0 Tier-B; 997/991.1/987.2 Tier-C-supported; 970/971 excluded |
| CHASSIS_20_004 | PDCC Hydraulic Anti-Roll-Bar System — Hydraulic Line Corrosion and Pump Failure | cayenne_955/957/958, 970 |

---

```yaml
defect_id: CHASSIS_20_001
title: "PADM Active Drivetrain Mount — Sensor Failure and Water Ingress"
content_status: draft
severity: moderate

description: >
  Porsche Active Drivetrain Mounts (PADM) are hydraulic engine mounts controlled
  electromagnetically to stiffen against side-to-side chassis movement under
  acceleration and high-G cornering. They fail via two related patterns. On
  early 992.1 builds (MY 2020 early production, North America per TSB ATI-1901;
  PorscheMania, Tier B, characterizes scope as MY 2019–2020), PCNA documented that
  inadequate assembly sealing allowed water to enter the mount housing and damage
  the internal pressure sensor circuit; TSB ATI-1901 (September 2019) requires
  replacement of both mounts under work order WM 103519, which necessitates
  lifting the engine. On the broader 991.1/991.2/981/718 population the more
  common mechanism is degradation of the internal pressure sensor adhesive bond
  or corrosion of the external harness connector, producing the same
  "PADM Failure" dashboard warning. A part-number supersession chain of six
  sequential revision suffixes on the 992-1 mount (Design 911, Tier B) confirms
  Porsche's ongoing design-improvement cycle. Failure is not a safety hazard
  — the mount reverts to passive behavior — but the engine-lift requirement on
  992.1 makes repair considerably more involved than on 991-family vehicles,
  where sensor-only replacement is sometimes feasible.

applicability:
  generations:
    - 991.1
    - 991.2
    - 992.1
    - 981
    - 718
  year_range: 2011–present
  specific_model_years: >
    TSB ATI-1901 scope is MY 2020 early-production 992.1, North America only.
    PorscheMania frames the water-ingress issue as MY 2019–2020. The broader
    PADM sensor adhesive and connector degradation pattern applies across the
    full 991/992/981/718 PADM-equipped production run without year restriction.
  option_code: "JQ3 — PADM. Required for this record to apply."
  notes: >
    PADM requires Sport Chrono on 991.1/991.2/981/718; standard on most 992.1
    trims. The 997.2 GT3 was the first Porsche to use PADM but is rare at
    auction and is not the primary catalog scope here.

symptoms:
  - >
    "PADM Failure", "PADM Disabled — Requires Service", or "PADM System Fault"
    warning on the instrument cluster
  - Sport and Sport Plus driving modes unavailable or non-functional after activation
  - >
    Subtle rear-end float under hard acceleration or high-G cornering before a
    hard fault appears (mount locked in soft/passive mode)
  - >
    Fault codes C133401 (left engine mounting, pressure sensor, electrical
    malfunction) or C133301 (right engine mounting, pressure sensor, electrical
    malfunction) in Assembly Mounting control unit; B1A36F0 (PADM fault active)
    in Instrument Cluster. _source_anchor: PCNA_ATI1901

failure_mechanism: >
  Two distinct but symptom-identical failure modes. (1) Water ingress (992.1
  early builds): assembly sealing was inadequate, allowing moisture into the
  sealed mount housing where it shorts the internal pressure sensor to ground.
  PCNA TSB ATI-1901 confirms root cause and mandates both-mount replacement.
  (2) Sensor adhesive or connector degradation (991.1/991.2/981/718 and later
  992.1): the internal sensor bond ages and detaches, or the external harness
  connector corrodes, producing the same fault codes without a sealed-housing
  ingress path. Connector corrosion can fully mimic mount failure and should
  always be ruled out first; cleaning corroded connector pins is a non-
  destructive first diagnostic step before committing to mount replacement.

inspection_notes: >
  - Retrieve fault codes via PIWIS or equivalent; confirm C133301/C133401
    specifically before ordering mounts.
  - Inspect and clean external PADM harness connectors — corrosion is a common
    false-positive for full mount failure (PCA technical bulletins note
    connector corrosion as a fault trigger).
  - On 992.1 MY 2020 (early production, North America): verify VIN against TSB scope via PIWIS Vehicle
    Information before assuming both mounts need replacement.
  - Check installed part-number suffix on 992-1 mounts if VIN history is
    unclear; current revision is 992199384F (six suffixes since launch).
  - After any replacement, clear all fault memory and confirm no codes return
    under normal driving before closing repair.

buyer_questions:
  - Has the PADM warning appeared? Was it addressed, and were both mounts
    replaced or only one?
  - "For 992 MY 2020 early-production (North America): was the engine lifted for the repair? (Required per
    TSB WM 103519; confirm shop has PIWIS capability.)"
  - Request PIWIS fault-history printout to verify no stored or pending PADM
    codes.
  - Has the Sport Chrono / PADM system ever been coded out to avoid the warning?
    (Affects resale and future repair cost if the underlying mount is failed.)

cost_estimate:
  range: "$1,400–$2,300 per mount (991-family, parts and independent specialist labor)"
  notes: >
    992.1 repair requires engine lift per WM 103519; total cost is higher but
    not separately quantified at Tier B. Sensor-only repair on 991 (where mount
    housing is intact) can reduce cost materially — confirm sensor adhesive vs.
    full housing failure before quoting full replacement.
  source_anchor: "Kadunza European Auto Repair — kadunza.com/padm-engine-mount-failure"

tier_a_present: true

sources:
  tier_a:
    - name: "PCNA Advanced Technical Information Bulletin ATI-1901"
      url: "https://static.nhtsa.gov/odi/tsbs/2019/MC-10165933-9999.pdf"
      notes: >
        Issued September 20, 2019. NHTSA ODI ID MC-10165933. URL verified live
        via fetch in this authoring session — full TSB text confirmed. Scope:
        2020 MY 992 equipped with PADM (option JQ3). Root cause stated as
        inadequate sealing in early North American production allowing water
        ingress, damaging electrical components within the mount housing. Fix:
        replace both mounts per WM 103519; clear all faults. VIN-specific —
        check via PIWIS before repair. Fault codes documented in TSB:
        B1A36F0, C133401, C133301.
  tier_b:
    - name: "PorscheMania — 4 Most Common Porsche 992 Engine Problems"
      url: "https://porsche-mania.com/porsche-992-engine-problems/"
      notes: >
        Frames 2019–2020 MY 992 water-ingress issue, confirms TSB and engine-lift
        requirement. Notes failure is drivable but handling is degraded.
    - name: "Kadunza European Auto Repair — PADM Engine Mount Failure"
      url: "https://kadunza.com/padm-engine-mount-failure-the-2000-porsche-991-problem-you-can-fix-for-300/"
      notes: >
        Covers 991-family PADM. Cost range $1,400–$2,300 per mount (parts and
        labor). Identifies internal sensor adhesive failure as primary 991
        mechanism; connector corrosion as a false-positive trigger. Primary
        cost source_anchor for this record.
    - name: "PCarwise — Porsche 911 Common Problems"
      url: "https://www.pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/"
      notes: >
        Confirms PADM failure on 991 and 992 as a common problem. Notes revised
        mounts have been available but the issue persists across production runs.
    - name: "Design 911 — PADM mount listing 992-1 (part 992199384F)"
      url: "https://www.design911.com/p/active-dynamic-engine-mount-padm-for-porsche-992-1-carrera-turbo-2019-992199384f/"
      notes: >
        Documents six sequential revision suffixes (992199384A through F) on the
        992-1 PADM mount — supersession chain confirms ongoing design improvement.
  tier_c:
    - name: "Planet-9 Forum — PADM FAIL (2020)"
      url: "https://www.planet-9.com/threads/padm-fail.246126/"
    - name: "Rennlist 981 Forum — PADM Fault"
      url: "https://rennlist.com/forums/981-forum/1327881-padm-fault-anyone-seen-this.html"
    - name: "PorscheClubGB — Active Engine Mount Failure (PADM)"
      url: "https://911uk.com/porsche/porsche-active-engine-mount-failure-padm.117431/"

cross_references:
  - "**File 09 — Drivetrain.** PDK mechatronic records; PADM shares Sport Chrono
    and PASM electronics architecture."
  - "**File 11 — Electrical.** Harness connector corrosion patterns; moisture
    ingress pathways relevant to connector-triggered PADM fault codes."
  - "**File 20 Record CHASSIS_20_003 — PASM Shock Absorbers.** A discharged or
    weak battery can trigger both PASM and PADM fault codes simultaneously;
    battery condition should be confirmed before attributing codes to hardware."
```

---

```yaml
defect_id: CHASSIS_20_002
title: "Cayenne Air Suspension — Compressor Burnout and Strut Failure Cascade (957/958)"
content_status: draft
severity: elevated

description: >
  The optional air suspension on cayenne_957 (2007–2010) and cayenne_958
  (2011–2018) uses pneumatic struts, a Continental or WABCO compressor, a
  valve block, and four ride-height sensors. A single leaking air strut
  initiates a common cascade failure: the compressor runs continuously to
  maintain system pressure and eventually burns out. Moisture that enters
  the system through a degraded desiccant filter integrated into the reservoir
  can additionally contaminate the valve block and corrode height-sensor
  connectors, turning a single-strut repair into a multi-component rebuild. The 955-
  generation failure pattern documented in File 10 Record 2 is continuous with
  the 957 and 958 platforms; the cascade failure mechanism and the importance of
  early intervention are unchanged. Early diagnosis when the first corner begins
  to sag is materially less expensive than a full system rebuild after compressor
  failure.

applicability:
  generations:
    - cayenne_957
    - cayenne_958
  year_range: 2007–2018
  notes: >
    Air suspension is standard on Turbo and Turbo S variants and optional on S,
    GTS, and E-Hybrid trims. Base-trim Cayenne models use coil springs and are
    not affected by this record. Cayenne 9Y0 (2018+) shares the systemic air
    suspension risk but dedicated Tier-B documentation specific to 9Y0 failure
    is not yet available; the 9Y0 population is explicitly excluded from this
    record's sourced claims and remains in the deferred queue pending specialist
    publication.

symptoms:
  - >
    "Air Suspension" (yellow) or "Chassis Failure" (red) warning on the
    instrument cluster
  - One corner visibly lower than normal after the vehicle has sat parked
    overnight or longer
  - Compressor running continuously or cycling rapidly at engine start
    (audible from engine bay or underbody)
  - >
    "Air Suspension Not Possible" message when attempting to raise ride height;
    system unable to reach target level
  - Multiple fault codes including compressor relay on-time exceeded, pressure
    sensor signal fault, or height deviation out of range

failure_mechanism: >
  Rubber bladder elements in the pneumatic struts degrade through age, ozone
  exposure, and thermal cycling, developing slow leaks that worsen progressively.
  A leaking strut causes the compressor to run far beyond its duty cycle to
  maintain target system pressure; sustained overwork burns out the compressor
  motor. In parallel, moisture admitted through a degraded desiccant filter
  saturates the valve block, causing valve passages to stick and height-sensor
  connectors to corrode. Because every component in the air suspension depends
  on system integrity — a leaking strut overworks the compressor; a failing
  compressor starves the remaining struts of pressure — a single untreated
  fault compounds into a multi-component rebuild. The most expensive outcomes
  follow from ignoring an initial sag warning.

inspection_notes: >
  - Manually compress each air strut bladder when the system is pressurized;
    loss of resistance indicates an active leak or pressure loss at that corner.
  - During the pre-inspection drive, listen for the compressor cycling at
    start-up; continuous cycling is a strong indicator of an active strut leak.
  - Retrieve fault codes before driving if a warning is present; confirm which
    corner is flagged before assuming full-system failure.
  - Check PDCC/power steering reservoir fluid condition on Turbo/GTS variants;
    PDCC shares a tandem pump with power steering on these trims (see
    CHASSIS_20_004). A failing air suspension compressor and a PDCC fluid issue
    can present together.
  - PIWIS or equivalent scan tool is required to reset and reactivate the system
    after compressor replacement; the system cannot be self-calibrated without
    diagnostic software.

buyer_questions:
  - Has the air suspension warning appeared, and which corner sagged first?
  - Has the compressor been replaced, and at what mileage?
  - Has the air suspension desiccant filter / reservoir been serviced? (Filter
    condition affects valve block cleanliness and sensor longevity.)
  - Any conversion to coilover suspension? (Requires PIWIS recoding; coilover
    conversion cars may show persistent chassis warnings.)

tier_a_absence_rationale: >
  No Porsche NHTSA recall or TSB found for cayenne_957/958 air suspension
  system failure as a manufacturing defect. Failure is age- and use-dependent
  degradation of rubber and electromechanical components. Tier B specialist
  documentation and Pelican Parts technical coverage confirm the pattern as a
  known and common service event on this platform.

sources:
  tier_b:
    - name: "PCarwise — Porsche Cayenne Common Problems (air suspension section)"
      url: "https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/"
      notes: >
        Explicitly documents strut leaks, compressor failure, valve block
        contamination from unmaintained fluid, height sensor faults, and
        hydraulic line/connector corrosion as common Cayenne air suspension
        failure modes. Notes cascade risk and diagnosis complexity.
    - name: "Pelican Parts — Cayenne GTS/S/Turbo Air Suspension (957/958 era)"
      url: "https://www.pelicanparts.com/techarticles/Porsche-Cayenne-GTS/14-BASICS-Prepping_Your_Air_Suspension_Cayenne_to_Lift/14-BASICS-Prepping_Your_Air_Suspension_Cayenne_to_Lift.htm"
      notes: >
        Article titled "Prepping Your Air Suspension Cayenne to Lift" — primarily
        a lift-procedure guide for the 957/958 era. The Q&A section authored by
        Pelican Parts staff confirms PIWIS scan tool is required to reset and
        reactivate the system after compressor replacement, and states the air
        suspension compressor relay must also be replaced whenever the compressor
        is replaced. Note: the Pelican Q&A uses the term "PASM compressor relay"
        loosely; the relay referenced is specific to the air suspension compressor
        circuit, not the PASM shock absorber system — these are distinct subsystems.
  tier_c:
    - name: "Planet-9 Forum — Official Air Suspension Thread (956/958)"
      url: "https://www.planet-9.com/threads/the-official-air-suspension-thread.249893/"
    - name: "Rennlist — 2024 Cayenne 9Y0 Air Suspension Problem Thread"
      url: "https://rennlist.com/forums/cayenne-9y0-2019/1407214-2024-model-air-suspension-problem.html"
      notes: >
        9Y0-owner thread documenting the cascade failure pattern from prior-gen
        experience; confirms the systemic risk applies to 9Y0 but Tier B
        documentation for 9Y0-specific failure is not yet available.

cross_references:
  - "**File 10 — Chassis.** Record 2 covers cayenne_955 (2003–2006) air suspension
    compressor and strut failure — the foundational record for this pattern. This
    record is the direct continuation to cayenne_957 and cayenne_958."
  - "**File 20 Record CHASSIS_20_004 — PDCC.** On Turbo/GTS variants with both
    systems, a chassis failure warning can originate from either air suspension
    or PDCC; accurate fault-code retrieval is required to distinguish them."
```

---

```yaml
defect_id: CHASSIS_20_003
title: "PASM Shock Absorber — Premature Seal Degradation and Solenoid Valve Failure"
content_status: draft
severity: moderate

description: >
  Porsche Active Suspension Management (PASM) electronically adjustable dampers
  have been standard or optional on 911, Boxster, Cayman, Cayenne, and Macan
  models since the 997 generation. Two failure modes occur in service:
  piston-rod seal degradation causes oil weeping, producing visible residue on
  the shock body and progressively degrading damping force asymmetrically; and
  internal solenoid valve failure or sticking causes the affected corner to
  default to a fixed damping rate, triggering a "Suspension Fault" dashboard
  warning. Motronix, a Porsche specialist, documents both failure modes on
  2016–2023 vehicles covering 911, Cayenne, Macan, and Boxster/Cayman with OEM
  replacement cost ranging from $600–$1,200 per damper unit and full 4-corner
  replacement typically $3,500–$6,500 including alignment. On the earlier
  997.1/991.1 population, forum evidence confirms seal leaks at high mileage
  but Tier B documentation specific to those generations is not available. No
  Porsche TSB or recall exists for PASM shock premature failure; Porsche
  classifies dampers as wear items subject to use variability.

applicability:
  generations:
    - 991.2
    - 992.1
    - 981
    - 718
    - 997.1
    - 997.2
    - 991.1
    - 987.2
    - cayenne_958
    - cayenne_9Y0
  year_range: 2005–present
  option_code: "Verify PASM option before applying. PASM is standard on S/4S/GTS/Turbo
    trims and optional (often with Sport Chrono) on base trims."
  notes: >
    Tier B sourcing (Motronix) explicitly covers 2016–2023 911/Cayenne/Macan/
    Boxster-Cayman — mapping to 991.2, 992.1, 718, and later 981 production.
    Cayenne (cayenne_958/cayenne_9Y0) is named in the Motronix article scope
    and is Tier B confirmed. Earlier 911 generations (997.1/997.2, 991.1,
    987.2) share the identical failure mechanism and are supported by Tier-C
    forum evidence (Rennlist 997 owner confirms seal failure at 87,000 miles);
    Tier B documentation specific to those generations has not been located.
    Panamera (970, 971) also uses PASM but is not named in the Motronix article
    scope; no independent Tier B defect article found for Panamera PASM shock
    failure. Panamera is excluded from the applicability list; assume applicable
    on architectural grounds but do not cite this record as Tier-B confirmation
    for 970/971.

symptoms:
  - >
    "Suspension Fault" warning on instrument cluster; ride quality stiffens
    permanently or uniformly
  - >
    Asymmetric body roll — one corner noticeably softer or less controlled than
    the opposite (characteristic of early seal failure before a hard fault)
  - Oily residue or grime accumulation on the shock body at the piston rod
    wiper seal; damp ring at the seal lip
  - >
    In Sport mode: one corner fails to stiffen — car feels unbalanced laterally
    under load rather than uniformly tightened

failure_mechanism: >
  Each PASM damper is a sealed assembly containing an oil reservoir, nitrogen
  pre-charge chamber, piston rod, and a solenoid valve that varies oil bypass
  flow to modulate damping coefficient in real time. Piston-rod wiper seal
  degradation (age, heat cycles, track use) allows oil to escape gradually,
  reducing that corner's damping force without an immediate electronic fault.
  Solenoid valve failure — electrical fault or valve sticking from internal
  contamination — causes the damper to lock at a fixed intermediate rate; the
  PASM control module detects the absence of expected adaptive response and sets
  a fault code. External harness connector corrosion can mimic solenoid failure
  by disrupting the solenoid signal circuit; connector inspection should always
  precede mount or damper replacement. Battery voltage below specification can
  also trigger PASM fault codes without hardware failure.

inspection_notes: >
  - Physically inspect shock bodies for oil staining or wet residue at the rod
    and wiper seal area on all four corners; early seal weeping produces a damp
    ring and fine grit accumulation.
  - Retrieve fault codes; confirm damper-specific solenoid codes vs. generic
    Suspension Fault before ordering dampers.
  - Confirm battery voltage is healthy; a weak battery is a known false trigger
    for PASM and PADM codes (see CHASSIS_20_001).
  - In Sport mode, assess cornering balance — a failed corner will feel
    distinctly softer than its diagonal.
  - Bilstein B4 (OEM specification) and B6 (performance upgrade) replacements
    are available for most PASM-equipped platforms; solenoid connector
    compatibility must be verified for the specific generation.

buyer_questions:
  - Any Suspension Fault warning? Was it diagnosed, and what was replaced?
  - Has the car been on track or driven spiritedly? (Track use materially
    accelerates seal wear.)
  - Are the shock bodies dry and clean when inspected under the car?
  - Has any corner been replaced with non-PASM dampers? (Requires PIWIS
    terminator coding or recoding to avoid persistent fault codes.)

cost_estimate:
  range: "$600–$1,200 per OEM damper unit; 2–3 hours labor per corner;
    full 4-corner replacement with alignment $3,500–$6,500 depending on model"
  source_anchor: "Motronix — motronix.net/blog/porsche-pasm-shock-absorber-failure-guide/"

tier_a_absence_rationale: >
  No Porsche TSB or NHTSA recall found for PASM shock absorber premature
  failure. Porsche classifies PASM dampers as wear items subject to owner-use
  variability; failure timeline is not bounded to a manufacturing defect. Tier B
  specialist documentation (Motronix) and Tier B common-problems coverage
  (PCarwise) confirm the failure pattern and quantify cost expectations.

sources:
  tier_b:
    - name: "Motronix — Porsche PASM Shock Absorber Failure: Symptoms, Diagnosis & Repair"
      url: "https://motronix.net/blog/porsche-pasm-shock-absorber-failure-guide/"
      notes: >
        Covers 2016–2023 911/Cayenne/Macan/Boxster-Cayman (991.2, 992.1, 718
        era). Documents seal degradation and solenoid valve failure. OEM damper
        cost $600–$1,200 per unit; full 4-corner replacement with alignment
        $3,500–$6,500. Primary cost source_anchor for this record.
    - name: "PCarwise — Porsche 911 Common Problems"
      url: "https://www.pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/"
      notes: >
        Documents PASM strut-mount rubber drying and damper failure on 991 as
        common. Notes symptom of low-frequency thud from suspension over bumps.
  tier_c:
    - name: "Rennlist 997 Forum — PASM Shocks Lifespan"
      url: "https://rennlist.com/forums/997-forum/1146639-pasm-shocks-lifespan.html"
      notes: "Owner confirms OEM PASM seal failure at 87,000 miles on 997.1."
    - name: "PorscheClubGB Forum — PASM Shock Absorber Faults"
      url: "https://www.porscheclubgb.com/forum/threads/pasm-shock-absorber-faults.146847/"

cross_references:
  - "**File 10 — Chassis.** Base 996/997/986/987 non-PASM suspension and lower
    control arm records."
  - "**File 20 Record CHASSIS_20_001 — PADM.** PASM electronics integrate with PADM
    and Sport Chrono; a weak battery or wiring fault can trigger simultaneous
    PASM and PADM codes."
  - "**File 20 Record CHASSIS_20_002 — Cayenne Air Suspension.** Cayenne 958/9Y0
    PASM-equipped variants share the air suspension control module; a chassis
    warning may involve either subsystem."
```

---

```yaml
defect_id: CHASSIS_20_004
title: "PDCC Hydraulic Anti-Roll-Bar System — Hydraulic Line Corrosion and Pump Failure"
content_status: draft
severity: elevated

description: >
  Porsche Dynamic Chassis Control (PDCC) actively adjusts front and rear anti-
  roll bar stiffness via a hydraulic circuit pressurized by a tandem pump that
  is physically shared with the power steering system on cayenne_955/957/958
  and 970 Panamera. Two failure patterns emerge in service. In salt-belt
  environments, hydraulic line corrosion at bracket contact points leads to
  line cracking and fluid loss; if the fluid level drops far enough the shared
  tandem pump runs against starvation, damaging both the PDCC and power steering
  halves of the pump simultaneously. The second pattern is valve body
  contamination from degraded hydraulic fluid whose integrated filter reservoir
  has not been serviced on schedule; debris blocks valve passages and degrades
  pressure sensor readings.
  A PCNA workshop campaign (WD02, 2013) documented a sealing ring assembly
  defect on the PDCC front-axle anti-roll bar, affecting 18 North American
  vehicles — too narrow to characterize as a population defect, but confirming
  the assembly sealing risk. PCarwise documents the broader line corrosion and
  pump failure pattern on both Cayenne and Panamera platforms as a common
  failure mode. PIWIS is required for system bleeding after any component
  replacement; improper bleeding can over-pressurize lines.

applicability:
  generations:
    - cayenne_955
    - cayenne_957
    - cayenne_958
    - 970
  year_range: 2003–2018
  option_code: "PDCC is optional; fitted primarily to GTS, Turbo, and Turbo S
    trims. Not all vehicles in these generations are PDCC-equipped."
  notes: >
    cayenne_9Y0 and 971/972 Panamera use an updated PDCC architecture; this
    record covers the legacy tandem-pump design. PCarwise documents the same
    systemic failure pattern on both Cayenne and Panamera 970; this record
    covers both platforms.

symptoms:
  - >
    "Chassis System Warning" or "PDCC Fault" warning on instrument cluster;
    increased body roll in corners (system defaults to passive anti-roll mode)
  - >
    Hydraulic fluid visible under the vehicle or reservoir level low on
    inspection (PDCC and power steering share reservoir)
  - Pump audibly running continuously, unusually noisy, or making a whirring
    sound under load
  - Power steering becoming heavy or intermittent — confirms shared-pump
    circuit fluid loss
  - Intermittent amber-then-red warning that clears on ignition cycle (early
    pressure sensor or valve fault before full failure)

failure_mechanism: >
  The tandem pump pressurizes the PDCC circuit and the power steering circuit
  from a shared reservoir; if the PDCC hydraulic circuit loses fluid through
  a corroded or cracked line, the pump continues running against starvation.
  Because both halves of the tandem pump share a common shaft, damage to one
  half typically damages the other, and replacing only the PDCC pump without
  diagnosing and repairing the leak source will cause repeat pump failure.
  Valve body passages degrade when the fluid filter (integrated into the
  reservoir assembly) is not replaced on schedule; debris blocks valve orifices
  and causes pressure sensor misreadings. Pressure sensors themselves are
  susceptible to external corrosion, particularly in northern states where road
  salt contact with sensor bodies and connections is chronic. The 2013 PCNA
  workshop campaign (WD02) further documented that sealing rings on the front-
  axle PDCC anti-roll bar could be damaged during assembly, causing slow
  depressurization leaks that may not trip an immediate warning.

inspection_notes: >
  - Check PDCC/power steering reservoir fluid level and condition before
    any other diagnosis; dark or contaminated fluid indicates overdue
    maintenance and potential valve body degradation.
  - Inspect hydraulic line routing under the vehicle, especially at bracket
    contact points and rubber mount interfaces, for corrosion or weeping.
  - If the pump is running continuously or making unusual noise, do not
    continue running the vehicle before diagnosing the fluid circuit — pump
    starvation damages both PDCC and power steering simultaneously.
  - PIWIS is required to run the system pressure test and to bleed the
    circuit after any component replacement; the workshop manual explicitly
    requires both PDCC and power steering circuits to be bled together after
    repairs to either one, and the reservoir must be replaced any time a valve
    block, anti-roll bar, or tandem pump is replaced.
  - VIN-check against WD02 campaign scope via PIWIS if front-axle anti-roll
    bar sealing ring replacement history is unknown.

buyer_questions:
  - Has a PDCC or Chassis System warning appeared, and what was diagnosed?
  - When was the PDCC/power steering reservoir last replaced? (Filter is
    integrated into the reservoir assembly; check service history for this
    maintenance item.)
  - Any evidence of hydraulic fluid under the car, or has the reservoir been
    found low on inspection?
  - Has the system ever been bled with PIWIS after a component replacement?
    (Improper bleeding can over-pressurize lines and cause follow-on failures.)
  - Has the vehicle been operated in a northern / salt-belt region? (Materially
    accelerates hydraulic line corrosion and pressure sensor degradation.)

tier_a_scope_note: >
  PCNA Workshop Campaign WD02 (2013) is Tier A but covers only 18 North
  American vehicles for a specific assembly sealing defect; it is not a
  population-level TSB. Included as Tier A documentation of the sealing
  failure mechanism. The broader hydraulic line corrosion and pump failure
  pattern is Tier B only.

sources:
  tier_a:
    - name: "PCNA Workshop Campaign WD02 (Technical Information Service 3/13 ENU)"
      url: "https://static.nhtsa.gov/odi/tsbs/2013/SB-10051896-5425.pdf"
      notes: >
        Front-axle PDCC anti-roll bar sealing ring damaged during assembly on
        affected vehicles; result is PDCC leak when depressurized. Fix: replace
        front-axle anti-roll bar, part 000.043.209.04. Scope: 18 North American
        vehicles only; VIN-specific via PIWIS. Not a population recall.
  tier_b:
    - name: "PCarwise — Porsche Cayenne Common Problems (PDCC section)"
      url: "https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/"
      notes: >
        Documents PDCC pump failure (often caused by an upstream system leak),
        valve body contamination from debris in unmaintained fluid, pressure
        sensor corrosion in northern states, and hydraulic line corrosion as
        common Cayenne failure modes. Notes shared tandem-pump architecture with
        power steering. Recommends Porsche specialist diagnosis due to PIWIS
        requirement.
    - name: "PCarwise — Porsche Panamera Common Problems (PDCC section)"
      url: "https://www.pcarwise.com/local-help/porsche-common-problems/porsche-panamera-common-problems-2/"
      notes: "Confirms identical PDCC failure pattern on 970 Panamera."
    - name: "PCarwise — PASM and PDCC Dashboard Warning Guidance"
      url: "https://www.pcarwise.com/local-help/porsche-common-problems/porsche-dashboard-messages-symbols/pasm-suspension-porsche-dashboard-warnings/"
      notes: >
        Confirms system-level fault cascade; notes pump replacement is expensive
        and a PIWIS bleed procedure is required after component replacement.
  tier_c:
    - name: "Rennlist — Cayenne 955/957 PDCC Major Problems"
      url: "https://rennlist.com/forums/cayenne-955-957-2003-2010/699011-pdcc-major-problems.html"
    - name: "Planet-9 — 958 Cayenne PDCC Line Blown"
      url: "https://www.planet-9.com/threads/958-pdcc-line-blown.249318/"
      notes: "Owner account: PDCC line rupture, reservoir ran dry, pump at risk of damage."

cross_references:
  - "**File 09 — Drivetrain.** Cayenne 958 transfer case; the PDCC tandem pump
    is located above the A/C compressor in the driver-side fender well —
    access context relevant to repair planning."
  - "**File 10 — Chassis.** cayenne_955 air suspension record (File 10 Record 2)
    for platform context; 955/957/958 Turbo/GTS variants may carry both air
    suspension and PDCC."
  - "**File 20 Record CHASSIS_20_002 — Cayenne Air Suspension.** Turbo/GTS
    Cayenne variants may carry both air suspension and PDCC; a chassis warning
    can originate from either or both systems. Fault-code retrieval is required
    to distinguish them."
```
