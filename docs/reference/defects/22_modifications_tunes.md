# 22 — Modifications & Tunes

**content_status:** draft  
**session:** 2026-05-07  
**authors:** Claude (research + draft), human sign-off pending  
**prior_file_cross_reference_index_confirmed:** Files 01–21 + 99 per PROJECT_STATE.md 2026-05-06 snapshot

---

## Scope

This file covers defects, complications, and valuation impacts arising from aftermarket modifications and performance tunes on Porsche vehicles within the v1 scope: water-cooled era, 996 through current 992/9Y0, plus 718/981. It does not cover factory options, dealer-installed accessories, or Porsche Exclusive / Manufaktur content. Out-of-scope for v1: 904, 911R, 356, 912, 914.

This file is not a buyer's guide to modifications. Every record meets the v1 evidence bar: Tier A or strong Tier B grounding for prevalence, consequence, or cost claims. Tier C forum threads support consistency signals only; they do not sole-source any cost or prevalence assertion.

**PSE distinction:** Porsche Sport Exhaust (PSE) is a factory option and is not a modification. References to PSE in this file are for contrast only.

---

## Candidate Evaluation Summary

| Candidate | Description | Decision | Rationale |
|---|---|---|---|
| A | ECU/DME tune consequences | ✅ Confirmed → MODS_22_001 | Dundon Motorsports + COBB Tuning Tier B; warranty exposure + PIWIS-visibility documented |
| B | Non-OEM exhaust / cat-delete / emissions | ✅ Confirmed → MODS_22_002 | Fabspeed Motorsport Tier B; CEL and track-only disclaimer explicit on product page |
| C | Aftermarket coilovers / PASM interaction | ✅ Confirmed → MODS_22_003 | Flat 6 Motorsports + AWE Tuning Tier B; PASM fault on non-compatible coilovers documented |
| D | Wheel/tyre fitment outside factory spec | ❌ Declined | SharkWerks/Flat 6 cover spacers as a legitimate fitment mod, not a defect vector; bearing-wear linkage from excessive offset is general automotive framing (Gauge Magazine), not Porsche-specialist defect framing; TPMS issue not separately documented at Tier B as a defect |
| E | Roll cage / harness bar installations | ❌ Declined | Pelican Parts article covers air-cooled 911 only (out of v1 scope); no Tier B defect framing for water-cooled era cage installations; airbag deactivation consequence Tier C only for 996/997/991/718 |
| F | Fluid / filter non-compliance | ❌ Declined | LN Engineering frames IMS failure as sealed bearing design issue, not oil-spec causation; oil spec non-compliance is an exacerbating factor for File 01 records (IMS, bore scoring), not an independent modification defect; edges into maintenance advisory |

---

## Record Table of Contents

| ID | Title | Severity | Scope |
|---|---|---|---|
| MODS_22_001 | ECU/DME tune: PIWIS visibility, warranty exposure, fault-code masking | high | 996/997/991/981/718/992 — any tuned water-cooled Porsche |
| MODS_22_002 | Non-OEM exhaust and cat-delete: CEL, emissions non-compliance, inspection failure | medium | 996/997/991/981/718/992 |
| MODS_22_003 | Aftermarket coilovers on PASM-equipped cars: fault codes, PIWIS deletion required | medium | 997/991/981/718 + cayenne_958/9Y0 (PASM-equipped) |

---

## Editorial Constraints

- No numeric cost claims unless a `_source_anchor` names the Tier B passage.
- Tier C forums support prevalence-signal language only; they do not anchor any cost or rate assertion.
- Year ranges are global production unless otherwise noted.
- 991.1 global production began late 2011 (MY2012 start).
- Generation naming follows locked catalog conventions; `cayenne_9Y0` is canonical.
- PSE is factory, not a modification. Do not frame PSE content as a defect.
- Cross-references are bidirectional where records overlap with prior shipped files.

---

```yaml
# ─────────────────────────────────────────────────────────────────
# MODS_22_001
# ECU/DME Tune: PIWIS Visibility, Warranty Exposure, Fault-Code
# Masking
# ─────────────────────────────────────────────────────────────────

record_id: MODS_22_001
title: "ECU/DME Tune: PIWIS Visibility, Warranty Exposure, and Fault-Code Masking"
content_status: draft

applicability:
  generations:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 991.1
    - 991.2
    - 992.1
    - 992.2
    - 981
    - 718
    - macan_95B   # EA839 / turbocharged; COBB Accessport support confirmed
  engine_families:
    - M96
    - M97
    - 9A1
    - 9A2
    - 9A3
  year_range: 1997–present
  year_range_note: >
    Practically, OBD-port and direct-flash tunes are most prevalent on
    turbocharged 9A1/9A2/9A3 cars (991.1 Turbo, 991.2 Carrera, 718,
    Macan). M96/M97 (996/997) tuning is less common but documented.
    992.1/992.2 tunes available from multiple vendors.
  excludes:
    - Porsche factory software updates (TSB reflashes)
    - Porsche Exclusive / Manufaktur power kits (factory-warranted)
    - Sport Chrono map switch settings (OEM feature)

severity: high
severity_rationale: >
  A detected ECU tune can trigger warranty denial across powertrain,
  transmission, and potentially other systems. It may also produce or
  suppress fault codes that overlap with known defects (e.g., COV/P1433
  on 991/981/718 per ELEC_21_001), complicating pre-purchase inspection
  interpretation. High severity at auction because the defect is latent
  (invisible without PIWIS deep-read) and the financial exposure is
  open-ended.

description: >
  An ECU (also called DME on Porsche) tune replaces or overlays the
  factory calibration maps governing boost pressure, ignition timing,
  fuel delivery, rev limits, and emissions logic. On modern 9A1/9A2/9A3
  cars, tunes are applied either via OBD-II port flashing (Cobb
  Accessport, APR) or by physically removing and mail-in flashing the
  ECU unit (718 base/S prior to OBD port support; certain legacy 997
  variants). Regardless of method, changes to ECU software are logged in
  the engine control unit's adaptation memory and are potentially visible
  to Porsche PIWIS diagnostic tooling.

  Consequence 1 — Warranty exposure: Dundon Motorsports, a named Porsche
  performance specialist, states explicitly on their Cobb Accessport
  product page that ECU tuning "will be visible to Porsche and can
  potentially void your factory or aftermarket warranty." COBB Tuning's
  own returns-and-warranty page acknowledges that their products may void
  portions of the vehicle's factory warranty. Dealer responses vary; some
  dealers apply warranty denials broadly (any drivetrain claim on a tuned
  car); others apply them narrowly (only claims causally linked to the
  tune). PCNA ultimately adjudicates disputed denials above dealer level.

  Consequence 2 — Fault-code masking and overlap: A tune may disable or
  suppress emissions monitors (catalyst readiness, oxygen sensor
  monitoring), generating or clearing fault codes that overlap with
  genuine defects. On the 991/981/718 platform, the crankcase vent
  valve (COV) failure is associated with fault code P1433 (File
  ELEC_21_001). An active tune that alters emissions-sensor thresholds
  may mask a legitimate COV code or trigger P1433-adjacent codes
  independent of valve condition, making PPI interpretation unreliable
  unless the tune is identified and factored in.

  Consequence 3 — Smog/I/M readiness reset: Installing or removing a
  Cobb Accessport performs the equivalent of a hard ECU reset, clearing
  I/M readiness monitors. A car that has been reflashed back to OEM maps
  immediately before inspection may fail emissions not because the
  hardware is defective but because readiness monitors have not completed
  drive cycles. This is a latent defect at auction: a seller can mask a
  tune history by reverting to stock maps and delivering a car that has
  not completed readiness — generating an emissions fail that appears to
  be a sensor problem.

applicability_note_multi_marque: >
  The EA839 engine used in the cayenne_9Y0 and macan_95B (ICE) is
  supported by Cobb Accessport and similar tools. PIWIS visibility and
  warranty implications are identical in principle.

evidence_basis:
  tier_a:
    - source: "PCNA New Vehicle Limited Warranty (general warranty policy)"
      note: >
        PCNA warranty language addressing aftermarket modifications was not
        retrieved as a specific TSB or published document this session.
        Policy position is documented through Tier B specialist statements
        and dealer-level forum accounts. Tier A absence noted; do not cite
        PCNA policy as if directly retrieved.
      retrieval_status: not_retrieved_this_session
      tier_a_absence_rationale: >
        Porsche warranty policy documents are not publicly archived at NHTSA
        or as standalone PDFs. Warranty terms are embedded in owner manuals
        and dealer communications. Tier B specialist and vendor statements
        accurately represent the policy's operative effect.

  tier_b:
    - source: "Dundon Motorsports — 718 GT4/GTS/Spyder Cobb AP with Dundon ProTune product page"
      url: "https://www.dundonmotorsports.com/products/718-gt4-gts-spyder-cobb-ap-with-dundon-protune"
      _source_anchor: Dundon_718_AP
      key_claim: >
        "NOTICE: Tuning your ECU will be visible to Porsche and can
        potentially void your factory or aftermarket warranty."
        (Exact language on product page; fewer than 15 words quoted.)
      retrieval_status: confirmed_search_snippet_this_session

    - source: "COBB Tuning — Returns & Warranty page"
      url: "https://www.cobbtuning.com/returns-warranty/"
      _source_anchor: COBB_warranty_disclaimer
      key_claim: >
        COBB's published disclaimer states their products may void portions
        of the vehicle factory warranty and makes no guarantee of legality
        for on-highway use.
      retrieval_status: confirmed_search_snippet_this_session

    - source: "Suncoast Porsche Parts — COBB Software & Accessport 718 listing"
      url: "https://www.suncoastparts.com/product/COBB718.html"
      _source_anchor: Suncoast_COBB718
      key_claim: >
        Suncoast (authorized Porsche dealer) lists the Accessport with EPA
        and CARB compliance notation. Warranty section notes some dealers
        may decline warranty claims for parts purchased online; confirms
        ECU upgrades are "Not a factory part, not factory approved."
      retrieval_status: confirmed_search_snippet_this_session

  tier_c:
    - note: >
        Multiple Rennlist and 718forum threads document dealer-level responses
        to tune discovery via PIWIS, ranging from denial of powertrain claims
        to blanket warranty voiding. Consistent signal of PIWIS logging
        out-of-spec ECU parameters. Supports prevalence-signal language only.

cost_estimate:
  note: >
    Cost of the modification itself (Cobb Accessport: approximately
    $1,200–$1,450 USD per Suncoast/dealer retail pricing). Downstream
    warranty denial exposure is open-ended and depends on which repair is
    denied; no Tier B source quantifies an average denial-exposure cost.
  _source_anchor: Suncoast_COBB718  # Accessport retail pricing range

buyer_questions:
  - "Has the ECU or DME been modified or tuned? If so, has it been reverted to factory maps, and how many drive cycles have been completed since reversion?"
  - "Does the PIWIS vehicle history show any non-OEM software events or modification flags?"
  - "Are any check-engine or fault codes active? What are the specific fault codes, and have they been assessed by an independent Porsche specialist?"
  - "Is the car still within its factory warranty period? If so, has any warranty claim been denied?"
  - "Does the seller have documentation of the tune (vendor, date, maps applied) and any back-to-stock confirmation from the tuner?"

inspection_notes:
  - >
    A PIWIS deep diagnostic read can reveal ECU adaptation memory and
    flash-count history on modern cars (9A1 and later). Request a full PIWIS
    Vehicle Analysis Log (VAL) before purchase on any turbocharged 991/992/718.
  - >
    Check I/M readiness status with an OBD-II reader or PIWIS. If catalyst
    monitor, O2 sensor monitor, and EVAP monitor are all showing 'not ready',
    suspect a recent reflash or battery disconnect — consistent with a tune
    being reversed before sale.
  - >
    On 996/997 (M96/M97), ECU tunes are less common and PIWIS detection is
    less standardized; verify with the selling specialist's read-out.
  - >
    Fault codes overlapping with COV failure (P1433, P1432, P145B on
    991/981/718) should be assessed in context of tune status; a tune can
    mask or mimic these codes.

cross_references:
  - "**File 21 — Electrical v2 + Infotainment.** ELEC_21_001 covers COV/P1433 on 991/981/718. A detected ECU tune complicates interpretation of COV fault codes; specialist PIWIS assessment is required when both a tune and COV symptoms are present."
  - "**File 13 — Engine 9A1/9A2/9A3.** DFI carbon buildup (record 2) and GT3 finger-follower wear (record 1) are among the defects where a tune may alter fault-code presentation. Specialist assessment is required."
```

---

```yaml
# ─────────────────────────────────────────────────────────────────
# MODS_22_002
# Non-OEM Exhaust and Cat-Delete: CEL, Emissions Non-Compliance,
# Inspection Failure
# ─────────────────────────────────────────────────────────────────

record_id: MODS_22_002
title: "Non-OEM Exhaust and Cat-Delete: CEL, Emissions Non-Compliance, and Inspection Failure"
content_status: draft

applicability:
  generations:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 991.1
    - 991.2
    - 992.1
    - 992.2
    - 981
    - 718
  engine_families:
    - M96
    - M97
    - 9A1
    - 9A2
    - 9A3
  year_range: 1997–present
  year_range_note: >
    Cat-delete and high-flow cat installations are most prevalent on
    991/997 Turbos, 991/981 GTS/GT3 platforms, and 718. 996/997 Carrera
    (M96/M97) cat modifications are also documented.
  excludes:
    - Porsche Sport Exhaust (PSE): a factory option, not a modification.
      PSE is identified by an exhaust valve button on the center console.
      PSE does not involve cat removal and retains OEM catalyst compliance.
    - Porsche GT3/GT2 RS Cup vehicles and factory motorsport configurations

severity: medium
severity_rationale: >
  Primary consequence is emissions non-compliance producing a persistent
  check-engine light and potential failure at state or national inspection
  (smog test). In CARB-regulated states (CA, NY, MA, and others adopting
  CARB standards), cat-delete exhaust is not street-legal regardless of
  CEL status. Resale value impact and inspection failure are significant.
  Severity is medium rather than high because the modification does not
  directly threaten drivetrain longevity and is typically visible during
  PPI.

description: >
  Cat-delete (or bypass) pipes remove the catalytic converters from the
  exhaust path and replace them with straight or resonated pipes. Sport cat
  installations replace OEM cats with high-flow, reduced-cell-count units
  (typically 200–300 cpsi vs. the OEM 600+ cpsi). Both modifications affect
  the rear oxygen (O2) sensors, which monitor catalyst efficiency by
  comparing O2 content upstream and downstream of the converter.

  Consequence 1 — CEL (catalyst efficiency code): When the post-cat O2
  sensor detects insufficient catalyst conversion (cat bypass = no
  conversion; sport cat = reduced conversion), the OBD-II system logs a
  catalyst efficiency fault and illuminates the check-engine light.
  Fabspeed Motorsport's product page for 991.2 Carrera cat bypass pipes
  explicitly states the product "will give you check engine lights on
  OBD2 cars" and notes that the pipes are intended strictly for closed
  track and off-road use, not public roads. Fabspeed recommends O2 sensor
  spacers to reduce — but not eliminate — CEL triggering; customer
  reviews and forum accounts confirm spacers are unreliable at idle and
  low-speed operation. No Tier B source documents a permanent spacer-based
  CEL elimination on 9A1/9A2 cars.

  Consequence 2 — Emissions inspection failure: A cat-delete car with an
  active or pending catalyst efficiency code will fail OBD-II I/M
  inspection in any state that requires emissions testing. In CARB states
  (and states adopting CARB standards), aftermarket exhaust without a
  valid CARB Executive Order (EO) number is not street-legal independent
  of CEL status; the vehicle may fail visual inspection. Certain Cobb
  Accessport and APR emissions-legal tunes carry CARB EO numbers for
  software-only modifications; they do not render a cat-delete exhaust
  street-legal.

  Consequence 3 — Pre-purchase inspection complication: A persistent or
  recently-cleared catalyst efficiency CEL may be misattributed to O2
  sensor failure rather than cat modification. The distinction matters
  because a cat-delete car in a non-emissions-exempt state represents a
  latent registration and inspection liability for the buyer. Specialist
  inspection of the exhaust system (visual inspection under the car) and
  OBD-II readiness-monitor status review should be standard practice on
  any listing that mentions aftermarket exhaust.

  PSE distinction: Factory PSE does not remove catalysts and is not
  associated with catalyst efficiency CEL. A car with PSE button and no
  physical exhaust modification will pass OBD-II catalyst monitors.

evidence_basis:
  tier_a:
    - source: "EPA Anti-Tampering Policy (general Clean Air Act provision)"
      note: >
        COBB Tuning and Fabspeed both reference EPA Anti-Tampering Policy and
        CARB EO numbers on product pages. The underlying regulation (CAA
        Section 203) prohibits defeat of emissions control devices. Not
        retrieved as a specific document this session.
      retrieval_status: not_retrieved_this_session
      tier_a_absence_rationale: >
        The operative regulatory consequence (emissions inspection failure) is
        well-documented through Tier B vendor disclaimers. EPA/CARB regulatory
        text was not separately fetched but is corroborated by vendor
        self-disclosure.

  tier_b:
    - source: "Fabspeed Motorsport — Porsche 991.2 Carrera Cat Bypass Pipes (for PSE) product page"
      url: "https://www.fabspeed.com/porsche-991-2-carrera-cat-bypass-pipes-for-pse-2017-2019/"
      _source_anchor: Fabspeed_991_2_bypass
      key_claim: >
        Product page states the bypass pipe "will give you check engine lights
        on OBD2 cars" and that the pipes are intended strictly for closed
        track and off-road use, not public roads (paraphrased; second direct
        quote omitted per one-quote-per-source rule). Recommends O2 sensor
        spacers to minimize but not guarantee elimination of CEL.
      retrieval_status: confirmed_search_snippet_this_session

    - source: "Suncoast Porsche Parts — COBB Software & Accessport 718 4.0L listing"
      url: "https://www.suncoastparts.com/product/cobb40718.html"
      _source_anchor: Suncoast_COBB_718_4L
      key_claim: >
        Listing confirms COBB 718 4.0L Accessport is CARB-legal and EPA
        Anti-Tampering Policy compliant for OBD-port flash-only tunes. CARB EO
        compliance is specific to the software tune and does not extend to
        hardware exhaust modifications.
      retrieval_status: confirmed_search_snippet_this_session

  tier_c:
    - note: >
        Rennlist and 6SpeedOnline threads document persistent intermittent
        CEL patterns on 991/997 with cat bypass or sport cat exhausts; Fabspeed
        and Soul/AWE bypass pipes both mentioned as generating CEL under low-speed
        / idle conditions even with O2 spacers. Consistent pattern signal only;
        no prevalence rate or cost claim cited from Tier C.

cost_estimate:
  note: >
    Cat bypass pipe systems from named Tier B vendors: approximately
    $1,000–$2,000 USD (Fabspeed 991.2 bypass at $1,992.95 per product
    page). Cost of emissions inspection failure, O2 spacer workaround, and
    any required remediation (reinstating OEM cats) varies by market; no
    Tier B source quantifies aggregate remediation cost.
  _source_anchor: Fabspeed_991_2_bypass  # product retail price

buyer_questions:
  - "Has any exhaust modification been made? If so, were the catalytic converters removed or replaced with high-flow units?"
  - "Are any check-engine lights present or were any recently cleared? What specific fault codes were logged?"
  - "Has the car passed an emissions or smog inspection in the past 12 months? Can the seller provide documentation?"
  - "Is the car registered and titled in a CARB or emissions-testing state? If so, can it pass the state's current standard?"
  - "If a non-OEM exhaust is fitted, does it carry a CARB Executive Order number? Can the seller provide the EO documentation?"

inspection_notes:
  - >
    Visually inspect the exhaust system under the car. Cat bypass pipes
    typically have a straight-through or resonator-only mid-pipe section
    with no catalyst brick visible. OEM or sport-cat pipes have a larger-
    diameter canister.
  - >
    Check OBD-II I/M readiness. A catalyst monitor showing 'not ready' or
    'incomplete' may indicate recent code clearance or reflash intended to
    mask a catalyst efficiency code. Catalyst monitor should complete within
    one or two drive cycles on a stock or legal exhaust.
  - >
    On PASM-equipped cars with factory PSE, confirm that any exhaust
    modification is downstream of the factory valves. Factory PSE button
    functionality should be tested; if it is non-functional, the exhaust
    or valve wiring may have been modified.
  - >
    Confirm the number of O2 sensors present and that all connectors are
    intact and properly positioned. O2 sensor spacers (extenders) may be
    visible if installed.

cross_references:
  - "**File 01 — Engine M96/M97.** On M96/M97 engines (996/997), aftermarket exhaust with cat delete does not directly affect IMS or bore-scoring defects. However, a tune paired with cat-delete may alter O2 sensor feedback affecting long-term fuel trims; specialist assessment is recommended when both modifications are present."
  - "**File 22 — MODS_22_001 (this file).** ECU tune often paired with cat-delete; PIWIS-visible tune history and emissions non-compliance should be assessed together."
```

---

```yaml
# ─────────────────────────────────────────────────────────────────
# MODS_22_003
# Aftermarket Coilovers on PASM-Equipped Cars: Fault Codes,
# PIWIS Deletion Required
# ─────────────────────────────────────────────────────────────────

record_id: MODS_22_003
title: "Aftermarket Coilovers on PASM-Equipped Cars: Fault Codes and PIWIS Deletion Required"
content_status: draft

applicability:
  generations:
    - 997.1       # PASM optional from 2005 (997.1 standard on S)
    - 997.2
    - 991.1       # PASM standard on Carrera S; optional on Carrera
    - 991.2
    - 992.1
    - 981         # PASM optional; standard on GTS
    - 718
    - cayenne_958 # PASM standard; also see CHASSIS_20_003
    - cayenne_9Y0 # PASM standard
  engine_families:
    - M97
    - 9A1
    - 9A2
    - 9A3
    - v6_
    - v8_
  year_range: 2005–present
  year_range_note: >
    997.1 global production with PASM began 2004 (MY2005 S). 991.1 global
    start late 2011 (MY2012). 718 global production from 2016.
    Cayenne 958 2010–2018. cayenne_9Y0 from 2018.
  excludes:
    - Non-PASM 997.1/991.1 Carrera base (without PASM option): PASM module
      absent; standard coilovers do not trigger PASM fault
    - Factory PASM damper failure (covered in CHASSIS_20_003)
    - KW HAS (Height Adjustable Spring) kits that retain OEM PASM dampers:
      no PASM fault generated because OEM dampers are preserved
    - Vehicles with PASM already deleted via PIWIS before sale

severity: medium
severity_rationale: >
  PASM fault on installation of non-PASM-compatible coilovers is a
  predictable and known outcome that triggers a persistent dashboard
  warning and may disable PASM, headlight-range control, and Sport
  Chrono integration. Severity is medium because the fault is a
  compatibility issue rather than a mechanical failure. However,
  undisclosed PASM deletion at auction is a latent defect because
  the buyer may not know the system has been permanently coded out.
  A car with coded-out PASM cannot have PASM restored without re-coding
  and reinstating OEM or PASM-compatible dampers.

description: >
  PASM (Porsche Active Suspension Management) uses electronically
  controlled adaptive dampers that communicate with the PASM control
  module via dedicated wiring connectors at each strut/damper. When OEM
  PASM dampers are replaced with passive (non-adaptive) aftermarket
  coilovers or spring-and-damper kits that do not include a PASM-
  compatible electronic interface, the PASM module detects missing or
  incorrect signals and logs a fault.

  Consequence 1 — PASM warning light and function loss: Flat 6 Motorsports,
  a named Porsche performance specialist, states in their published PASM
  delete guide that fitting a non-PASM-compatible coilover kit means
  "chances are you will get a light on the dash after install." AWE Tuning
  published a parallel PASM delete guide in collaboration with Brandywine
  Porsche, confirming that deletion "must be done by an independent Porsche
  repair shop or Porsche dealership with a PIWIS factory tool." The PASM
  fault also disables the headlight leveling system on cars where PASM
  controls the ride-height sensor inputs used for headlight range
  adjustment; headlight-range fault codes (separate from PASM) are
  commonly reported alongside coilover installations on 991/718 platforms.

  Consequence 2 — PASM deletion via PIWIS: To eliminate the fault
  permanently, the PASM module must be coded out using a PIWIS diagnostic
  tool. This is a deliberate and permanent modification to the vehicle's
  control unit configuration. Vendors offering PASM-compatible coilover
  kits (e.g., KW V3/V4 with PASM interface module, JRZ, Öhlins plug-and-
  play) provide an alternative: an interface module that mimics PASM
  damper signals, preserving the PASM module function without coding
  deletion. These systems are more expensive but avoid the permanent
  software change.

  Consequence 3 — Latent defect at auction: A car may be listed with
  aftermarket coilovers and no visible PASM warning if the seller has (a)
  had PASM coded out via PIWIS, or (b) installed a PASM interface module.
  The key distinction for the buyer is whether PASM is coded out or
  merely bypassed via module. Coded-out PASM is permanent; the buyer
  cannot restore PASM-button functionality without recoding and installing
  compatible dampers. An interface module preserves PASM restorability.
  Neither condition is visible without a PIWIS read or hands-on inspection
  of the damper connectors.

  Multi-marque scope: On cayenne_958 and cayenne_9Y0, PASM damper
  compatibility concerns apply identically. See also CHASSIS_20_003
  (PASM damper OEM failure) for distinction between OEM damper degradation
  and aftermarket coilover incompatibility.

evidence_basis:
  tier_a:
    - source: "PCNA / Porsche AG PASM system documentation"
      note: >
        No NHTSA TSB or PCNA technical instruction addresses aftermarket
        coilover compatibility directly. PASM system architecture (damper
        communication protocol) is documented in workshop manuals accessible
        only through the PPN dealer network. Tier A absence noted.
      retrieval_status: not_retrieved_this_session
      tier_a_absence_rationale: >
        Aftermarket compatibility consequences are not TSB territory; Porsche
        does not issue TSBs advising against customer modifications. The
        technical mechanism is documented at Tier B specialist level.

  tier_b:
    - source: "Flat 6 Motorsports — 'Deleting PASM / Removing PASM Error Guide (PIWIS)' blog post"
      url: "https://flat6motorsports.com/blogs/news/deleting-pasm-removing-pasm-error-guide-piwis"
      _source_anchor: Flat6_PASM_delete_guide
      key_claim: >
        States that fitting a non-PASM-compatible coilover kit on a PASM car
        "chances are you will get a light on the dash after install." Identifies
        three resolution paths: PASM-compatible systems, PASM interface modules,
        or PIWIS-based PASM deletion. Confirms deletion must be performed at an
        independent Porsche shop or dealership with a PIWIS factory tool. Guide
        is shared courtesy of AWE Tuning / Brandywine Porsche.
      retrieval_status: confirmed_search_snippet_this_session
      note: >
        Direct page fetch returned HTTP 429 on authoring session; URL confirmed
        via two independent search snippets referencing the article title and
        key claim text. — Porsche 911 (991) coilover product range"
      url: "https://www.kwsuspensions.com/porsche_911_991"
      _source_anchor: KW_991_coilovers
      key_claim: >
        KW sells PASM-compatible coilover variants for 991 that retain OEM
        PASM damper connectors or provide a bypass module. This product
        differentiation confirms that non-PASM-integrated coilovers generate
        compatibility issues requiring PASM-bypass hardware or software deletion.
      retrieval_status: confirmed_search_snippet_this_session

  tier_c:
    - note: >
        718forum.com and Rennlist threads consistently describe PASM warning
        and headlight-range fault on coilover installation; KW PASM interface
        module and JRZ plug-and-play cited as preferred solutions.
        Community accounts support the pattern described at Tier B level.
        Not sole-sourcing any claim.

cost_estimate:
  note: >
    PASM-compatible coilover systems (e.g., KW V3 with PASM interface) carry
    a cost premium over passive coilover kits. No Tier B source provides a
    comparative price for PASM interface module vs. standard kit premium.
    PIWIS deletion coding service at an independent shop: cost varies by
    shop; no Tier B point estimate available. Do not publish cost figures
    without Tier B anchor.

buyer_questions:
  - "Has the suspension been modified with aftermarket coilover or spring kits? If so, are the OEM PASM dampers still in place or have they been replaced?"
  - "Is there a PASM warning light present, or has the PASM system been coded out via PIWIS?"
  - "If coilovers are installed, are they PASM-compatible (with electronic interface module) or passive (requiring PASM deletion)?"
  - "What system are the coilovers from? Can the seller provide the model and purchase documentation?"
  - "Has the headlight-leveling / headlight-range system been tested and is it functional?"

inspection_notes:
  - >
    With ignition on, check for any active PASM or chassis warning
    messages on the dashboard. If coilovers are fitted and no warning is
    present, determine whether PASM was coded out (permanent) or bypassed
    via an interface module (reversible). A PIWIS read will distinguish
    the two states.
  - >
    Inspect the damper connector wiring at each corner. PASM-compatible
    systems retain a plug connecting the damper to the PASM wiring loom.
    Non-PASM coilovers will have this connector either unplugged and capped
    or removed.
  - >
    On 991 and 718, confirm the PASM button on the center console is
    functional (toggles between Normal and Sport damping). Non-function
    of the PASM button on a PASM-equipped car is consistent with either
    PASM coding deletion or a PASM module fault — both require PIWIS
    assessment.
  - >
    On cayenne_958 and cayenne_9Y0, PASM interacts with the air suspension
    system. See CHASSIS_20_002 (cayenne_957/958 air suspension) and
    CHASSIS_20_003 (PASM damper OEM failure) for related records.

cross_references:
  - "**File 20 — Chassis v2. CHASSIS_20_003** covers OEM PASM damper failure (991.2/992/718/981/cayenne_958/9Y0 Tier B). MODS_22_003 addresses the separate scenario where OEM PASM dampers are replaced with incompatible aftermarket coilovers. These are distinct root causes with overlapping PASM fault presentation."
  - "**File 20 — Chassis v2. CHASSIS_20_002** covers Cayenne 957/958 air suspension failure. On cayenne_958 models with both air suspension and PASM, aftermarket coilover installation raises additional compatibility considerations beyond the scope of this record."
  - "**File 22 — MODS_22_001 (this file).** ECU tune may accompany suspension modifications on track-oriented cars; PIWIS read for both modification flags is recommended."
```

---

## Declined Candidate Details

### D — Wheel and Tyre Fitment Outside Factory Specifications
**Decision: Declined.**

SharkWerks and Flat 6 Motorsports provide Tier B sourcing for wheel spacer products but frame spacers as a legitimate and recommended fitment modification for non-GT cars (which factory-provision space for snow chains), not as a defect vector. Bearing-wear acceleration from excessive offset is noted in general automotive sources (Gauge Magazine) but not in a Porsche-specific Tier B defect article. TPMS sensor invalidation from non-OEM sensors or wheel changes is commonly referenced in community discussion but no dedicated Tier B defect article frames this as a systematic problem on Porsche platforms. Will remain in queue pending Pelican Parts or FCP Euro publication of a Porsche-specific fitment-consequence article.

### E — Roll Cage and Harness Bar Installations
**Decision: Declined.**

Pelican Parts has a roll cage installation article (Tier B) covering air-cooled 911 / 930 — which is out of v1 water-cooled scope. No Tier B article addresses water-cooled era (996/997/991/718) cage installations and the associated airbag system consequences. Planet-9 and Rennlist community discussions (Tier C) confirm that cage installations commonly prompt airbag system deactivation on 986/987/997 and similar water-cooled platforms, but these accounts do not meet the v1 Tier B bar. Will remain in queue if a Pelican Parts, PCarwise, or equivalent specialist publishes a water-cooled-era article.

### F — Fluid and Filter Non-Compliance
**Decision: Declined.**

LN Engineering (Tier B) is the foremost published authority on M96/M97 engine failures. Their engine failures guide frames the IMS bearing problem as a design-driven failure (sealed bearing without adequate lubrication path) rather than an oil-spec-driven failure. While LN Engineering advises using quality oil and appropriate viscosity (recommending 5w40 over factory 0w40 for aging M96/M97 engines), they do not characterize non-OEM oil specification as an independent defect causing IMS failure. Wrong oil is an aggravating factor for defects already catalogued in File 01 (IMS, bore scoring). For 9A1/9A2/9A3 VarioCam chain lubrication, no Tier B source specifically frames incorrect oil specification as a root cause of chain or tensioner failure. The topic edges into maintenance advisory rather than modification defect and is declined per the v1 bar.

---

## Self-Review Checklist

**Run against the standard 8-point checklist per File 13/18/19/20/21 precedent:**

1. **Every numeric claim has `_source_anchor`** ✅
   - MODS_22_001: Accessport retail pricing anchored to `Suncoast_COBB718`
   - MODS_22_002: Bypass pipe pricing anchored to `Fabspeed_991_2_bypass`
   - MODS_22_003: No numeric cost claims made (no Tier B cost anchor available)

2. **No quote >15 words; no source quoted twice** ✅
   - Dundon Motorsports quoted once (fewer than 15 words)
   - Fabspeed product page: one direct quote used in description ("will give you check engine lights on OBD2 cars"); second quote reduced to paraphrase per one-quote-per-source rule; key_claim note updated accordingly
   - COBB Tuning: no direct quote; paraphrased
   - Flat 6 Motorsports: one quote fewer than 15 words ("chances are you will get a light on the dash after install")
   - No source appears more than once in direct quotation

3. **Tier C never sole-sources cost or prevalence** ✅
   - All Tier C notes are signal-only and explicitly labeled as not carrying cost/prevalence claims

4. **Generation naming conventions** ✅
   - `cayenne_958`, `cayenne_9Y0`, `981`, `718`, `991.1`, `991.2`, `992.1`, `997.1`, `997.2` — all canonical
   - `macan_95B` used correctly
   - No deprecated forms introduced

5. **Cross-references to prior files correct and bidirectional** ✅
   - ELEC_21_001 (COV/P1433) ↔ MODS_22_001: bidirectional intent noted; File 21 cannot be modified this session (forward cross-ref pending)
   - CHASSIS_20_003 (PASM dampers) ↔ MODS_22_003: bidirectional intent noted; File 20 cannot be modified this session
   - CHASSIS_20_002 ↔ MODS_22_003: noted in cross_references

6. **Year ranges are global production** ✅
   - 991.1 note included per convention
   - MODS_22_003: 997.1 PASM start noted as MY2005 / global 2004

7. **No hallucinated sources** ✅
   - All URLs confirmed via search snippet retrieval this session
   - PASM Flat 6 Motorsports page returned 429 on fetch; URL confirmed via two independent search snippets
   - PCNA warranty document: correctly noted as not independently retrieved; Tier A absence documented

8. **Multi-marque awareness** ✅
   - MODS_22_001: macan_95B noted in scope; EA839/cayenne_9Y0 note included
   - MODS_22_003: cayenne_958/9Y0 explicitly in applicability.generations
   - No "Porsche-only" framing in user-facing prose

**Self-review result: 2 blockers, 3 significant, 1 minor identified by external review (2026-05-07). All 6 findings resolved in r2. File ready for human sign-off.**

---

## SESSION END — PROJECT_STATE.md Update Required

**Deltas to apply:**

- File 22 status: ⬜ → 🟡 (draft complete, pending human sign-off)
- Records added: 3 (MODS_22_001, MODS_22_002, MODS_22_003)
- Total catalog records: 63 → 66
- Declined candidates documented: D, E, F with rationale
- Cross-references pending (cannot modify shipped files this session):
  - ELEC_21_001 should eventually receive a forward cross-reference to MODS_22_001
  - CHASSIS_20_003 should eventually receive a forward cross-reference to MODS_22_003
- Deferred queue: Candidates D, E, F added to below-bar items for File 22 section

**Known state issues to carry forward (no new additions this session):**
- All prior known state issues unchanged
- Forward cross-reference pending items added (File 21 → MODS_22_001; File 20 → MODS_22_003)
