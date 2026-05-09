# 21 — Electrical v2 + Infotainment

**Scope:** Electrical and infotainment defects requiring new records beyond those shipped in
File 11, plus the COV failure deferred from File 13. File 11 covered: wheel-speed sensor TSB
(cayenne_958 / macan_95B), instrument-cluster LCD pixel loss (996/997/986/987 + cayenne_955/957),
window-regulator Bowden-cable failure (996/997/986/987), and sunroof-drain water-intrusion
harness corrosion (cayenne_955/957/958/cayenne_9Y0, macan_95B, panamera_970/971). The present file does
not duplicate any of those records.

Items researched and declined at the v1 evidence bar this session: xenon ballast failure
(no dedicated Tier-B defect article found for OEM ballast failure as a defect pattern — Pelican
coverage is an HID upgrade guide, not a defect article); alternator/starter failures by
generation (Tier C only for defect framing); ADAS sensor degradation (Tier C only; 992 coverage
too thin); stop-start battery management (Tier B framing is maintenance-advisory, not defect).
All remain in the deferred queue.

**Records in this file (4):**

1. `porsche_991_981_718_change_over_valve_cov_p1433` — 991 / 981 / 718 change-over valve (COV)
   solenoid moisture failure; phantom P1433 / cooling-system fault; impaired PDK cooling in
   extreme conditions; Porsche PCNA service campaign TI-64-12 / WC-43 (3,718 NA vehicles)

2. `porsche_pcm_2x_navigation_display_lcd_failure` — PCM 2.0/2.1 navigation head-unit LCD
   display failure on 996.2/997/987/cayenne_955 era: dead pixels, screen fading, polarizer
   degradation, ink-run

3. `porsche_pcm_3x_infotainment_system_failure` — PCM 3.1 hard-drive failure causing reboot
   loops and blank screens on 991.1/981/cayenne_958/panamera_970 era; PCM Cluster-26 software
   memory crash on 992.1/cayenne_9Y0/macan_95B (MY 2019–2021), covered by PCNA ATI 2224.2

4. `porsche_991_instrument_cluster_tft_failure` — 991.1/991.2 instrument cluster central TFT
   display failure; blank or distorted multi-function display; distinct from PCM head unit

**Editorial constraints applied (mirroring files 11–20):**
- Cost and prevalence claims require a `_source_anchor` referring to a passage that actually
  carries the figure. Omit rather than estimate.
- Tier A: Porsche AG / PCNA / NHTSA-hosted PCNA bulletins / PCA editorial / court-approved
  class actions. Tier B: named specialists with technical pages (Go-Parts, German Audio Tech,
  PCarwise, Suncoast Porsche Parts, Pelican Parts, Kadunza, FCP Euro). Tier C: forum threads
  and named-individual community contributions — never sole source for cost or prevalence.
- Direct quotation capped at one per source, fewer than 15 words. Default to paraphrase.
- Numeric ranges, not point estimates. Omit if unsourceable at Tier B or above.
- Generation names per locked conventions: cayenne_9Y0 is canonical (not 9YA/9YB/E3/PO536).

---

## Record 1 — 991 / 981 / 718 change-over valve (COV) failure and phantom P1433

```yaml
id: porsche_991_981_718_change_over_valve_cov_p1433
flag_title: >
  991 / 981 / 718 change-over valve (COV) solenoid moisture failure — phantom
  "cooling system fault" (P1433), loss of PSE exhaust-flap control, heater
  shut-off valve failure, and PDK cooling impairment (PDK-equipped vehicles)

description: >
  The electro-pneumatic solenoid valves distributed throughout the vacuum
  system of 9A-family 911, Boxster, and Cayman models are subject to
  moisture ingress through the solenoid vent port, causing progressive
  internal diaphragm deterioration and eventual valve failure. PCNA
  acknowledged the root cause in a 2012 service campaign — Technical
  Information bulletin TI-64-12 (service campaign WC-43) — citing
  insufficient sealing as the documented mechanism. The campaign covered
  3,718 North American vehicles in the early 991 production run and
  replaced up to eight COVs per vehicle depending on installed equipment.

  The same COV solenoid design (OEM part 7PP906283B and its successive
  revisions through suffix F) controls multiple independent systems: thermal
  management (engine coolant bypass; on PDK cars, the clutch-fluid heat
  exchanger and gear-wheel-set heat exchanger); the exhaust flap valves
  (Porsche Sports Exhaust / PSE option); the air-cleaner housing flap; the
  acoustic simulator (symposer); the resonator flap; and the fuel tank vent.
  Because fault code P1433 is labeled "cooling system fault" by the DME and
  PSM modules, a failing COV consistently triggers a dashboard warning that
  appears unrelated to a small vacuum solenoid. Owners and technicians who
  treat P1433 at face value have historically replaced water pumps,
  thermostats, and coolant sensors before identifying the COV as the root
  cause. Kadunza specialist technicians identify COV failure as the primary
  cause of misdiagnosed faults — and of escalating repair bills — on the
  991, 718, and modern Cayenne/Panamera platforms.

  Multiple part-number revisions followed the original campaign: C, D, E, and
  F suffix versions progressively improved the vent-port moisture shield and
  connector shroud. The current part (suffix F per Suncoast's listing) requires
  a short wire-harness adaptor when replacing B- or C-suffix connectors.
  Despite iterative hardware revisions, post-campaign 991 production cars and
  the full 981 and 718 generations carry the same COV architecture; no second
  fleet-wide PCNA campaign has been issued. PCarwise characterises COV failure
  as a common problem across the 991 platform following the original campaign
  period.

  On PDK-equipped vehicles, TI-64-12 specifically identifies impaired clutch
  cooling and gear-wheel-set cooling as consequences of COV failure in extreme
  driving conditions (race starts, sustained high ambient temperature, frequent
  gear changes). This is the highest-severity consequence of the failure mode
  and the specific language used in the Tier-A bulletin to justify the campaign.

applicability:
  model_line:
    - 911
    - boxster
    - cayman
  generation:
    - 991.1
    - 991.2
    - 981
    - 718
  engine_family:
    - 9A1
    - 9A2
    - 9A3
  year_range: [2011, 2024]
  # year_range note: 991.1 global production from 2011 (late-2011 start, MY2012);
  # year_range opens at 2011 to capture late-2011 build cars consistent with
  # the per-generation breakdown below. 2024 is a conservative upper bound;
  # the COV architecture continues into current 718 production.
  # Per-generation global ranges:
  #   991.1: 2011–2016  991.2: 2016–2019  981: 2012–2016  718: 2016–present
  excludes:
    description: >
      992-generation 911 (2019+) uses a revised vacuum and engine-management
      architecture; COV-type failure of the TI-64-12 design has not been
      confirmed at Tier B for the 992. Pre-991 sport-car generations
      (997, 996, 987, 986) use a different vacuum-solenoid arrangement and
      are not covered by TI-64-12 or by Tier-B sources for this specific
      failure mode.
    generation: [992.1, 992.2, 997.1, 997.2, 996.1, 996.2, 987.1, 987.2, 986]

severity: moderate
# Severity note: the most common day-to-day manifestation (phantom P1433,
# PSE flaps not operating, heater shut-off valve failure) is an inconvenience,
# not a safety issue. Severity is set to moderate because: (a) the PDK cooling
# consequence in TI-64-12 is operationally significant under track or
# sustained hard use; (b) the misdiagnosis rate is high and the misdiagnosis
# labour cost frequently exceeds the actual part cost; (c) failures are
# progressive and multi-valve — owners commonly return for sequential
# replacements as additional COVs fail.

cost_range_usd:
  parts_per_valve:
    qualitative: available_from_porsche_dealers_and_specialist_vendors
    _source_anchor: >
      Suncoast Porsche Parts lists the current COV revision (OEM part
      7PP906283F, suffix F) as the latest version for 991 and 981 generation
      models, noting that a wire harness adaptor is required when replacing
      B/C-suffix connectors (suncoastparts.com/product/7PP906283F.html,
      confirmed in search results this session). Specific retail dollar price
      not carried in the search snippet; dollar figure omitted per locked
      principle 3.
  total_repair_note:
    qualitative: variable_and_potentially_high_if_misdiagnosed
    _source_anchor: >
      Kadunza describes the COV replacement as potentially escalating to a
      multi-thousand-dollar bill when misdiagnosis adds labour hours chasing
      unrelated codes, or when sequential individual-valve replacements are
      made rather than a single comprehensive access event
      (kadunza.com/the-owners-guide-to-porsche-vacuum-system-failures-from-
      diagnosis-to-definitive-repair/, retrieved this session). No Tier-B
      source provides a bounded dollar range for correctly diagnosed COV-only
      replacement; total cost figure omitted.

prevalence_rate:
  qualitative: common_across_entire_991_981_718_fleet
  _source_anchor: >
    Tier-A signal: PCNA TI-64-12 (NHTSA ID 10048760, October 2012) covered
    3,718 North American vehicles in the early 991 run, acknowledging
    insufficient sealing as a manufacturing-origin defect in the COV design.
    PCarwise (Tier B) characterises COV failure as a common problem across
    the 991 platform and notes that early 991 cars had all COV solenoids
    replaced in a maintenance campaign (pcarwise.com/local-help/porsche-
    common-problems/porsche-911-common-problems/, retrieved this session).
    Kadunza (Tier B) identifies COV failure as the primary cause of
    misdiagnosed faults on the 991, 718, and modern Cayenne/Panamera.
    Part-number supersession from B through F suffix (confirmed via
    Suncoast listing) is consistent with a documented failure mode
    requiring iterative hardware correction. Numeric failure rate not
    published; qualitative framing anchored in Tier-A campaign scope
    and converging Tier-B characterisations.

failure_correlation:
  - moisture_ingress (primary documented mechanism per TI-64-12: vent-port
    water ingress deteriorates internal diaphragm, leading to vacuum leak)
  - age (diaphragm degradation is time-dependent; post-campaign 991 cars
    typically present in years 4–10 of vehicle life)
  - pse_option (PSE-equipped cars carry additional COVs for exhaust-flap
    circuits; failure may be detected earlier via PSE non-operation before
    a fault code appears)
  - pdk_option (PDK cars carry two additional COVs for transmission cooling
    heat exchangers; impaired PDK cooling is the highest-severity consequence)

symptoms:
  - "yellow 'Fault cooling system' / P1433 warning with no actual coolant anomaly"
  - "PSE exhaust flaps not opening or stuck open"
  - "heater output absent or reduced (heater shut-off COV)"
  - "acoustic simulator (symposer) non-operational"
  - "air-cleaner flap or resonator flap fault code"
  - "on PDK cars: PDK cooling warning under hard use or at track"

inspection_notes: >
  A PIWIS scan is required for definitive COV diagnosis; generic OBD-II readers
  report P1433 as a coolant-circuit fault and do not identify the vacuum-system
  root cause. Correct diagnosis requires a Porsche-specific scan tool and
  familiarity with the vacuum-system schematic. Kadunza and PCarwise both note
  that the apparent simplicity of individual COV replacement belies the access
  complexity required on the 991/981/718 — some valve positions require removing
  fuel rails, injectors, and wiring harnesses.

  Key pre-purchase checks: (1) confirm via VIN at a Porsche dealer whether the
  original WC-43 campaign was performed; (2) verify what COV suffix revision is
  currently installed — if B or C suffix parts remain, they are candidates for
  future failure; (3) confirm all eight positions have been upgraded to the
  F-suffix part if any replacements have been made, rather than only the
  failed valves being replaced reactively.

buyer_questions:
  - "Has the WC-43 COV replacement campaign been performed? This is VIN-verifiable at any Porsche dealer."
  - "Which COV part-number suffix revision is currently fitted — B/C/D/E or the current F-suffix with moisture shroud?"
  - "Has the car ever displayed a 'cooling system fault' or P1433 code, and was the diagnosis confirmed to be a COV rather than a coolant-system component?"
  - "On PDK cars: has the car been used at track or in sustained high-load conditions, and is there any history of PDK heat warnings?"

cross_references:
  - "**File 13 — Engine 9A1/9A2/9A3 modern flat-six.** COV failure was deferred from File 13 into this record. File 13 covers the 9A1 rod-bolt recall and DFI carbon buildup on the same engine family."
  - "**File 18 — Cooling Systems v2.** File 18, Record 1 covers the 9A2 water-pump failure (COOLING_18_001). P1433 is routinely confused with a cooling-system fault; buyers should be aware that a 991.2 P1433 may implicate the COV (this record) or the water pump (File 18), and correct diagnosis via PIWIS is required to distinguish them."

content_status: draft

evidence_basis:
  tier_a:
    - name: >
        Porsche Cars North America — Technical Information Service TI-64-12
        (service campaign WC-43), SB-10048760-5824, NHTSA ID 10048760,
        October 2, 2012. Root-cause statement: insufficient sealing allows
        moisture ingress into change-over valve solenoids; PDK clutch cooling
        and gear-wheel-set cooling identified as impaired in extreme driving
        conditions on PDK-equipped vehicles. Scope: 3,718 North American
        vehicles in early 991 production. Up to eight COVs replaced per
        vehicle depending on equipment.
      tier: A
      url_or_reference: "static.nhtsa.gov/odi/tsbs/2012/SB-10048760-5824.pdf"
      retrieval_status: confirmed_in_search_results_this_session
  tier_b:
    - name: >
        Kadunza (European Auto Repair Specialists, Knoxville TN and Alcoa TN)
        — The Owner's Guide to Porsche Vacuum System Failures: From Diagnosis
        to Definitive Repair. Named Tier-B specialist with technical page.
        Explicitly identifies COV failure as the primary cause of misdiagnosed
        phantom P1433 cooling faults on 991, 718, and modern Cayenne/Panamera
        platforms. Describes diaphragm failure mechanism, escalating
        misdiagnosis costs, and access complexity.
      tier: B
      url_or_reference: "kadunza.com/the-owners-guide-to-porsche-vacuum-system-failures-from-diagnosis-to-definitive-repair/"
      retrieval_status: retrieved_this_session
    - name: >
        PCarwise — Porsche 911 Common Problems. Named Tier-B specialist
        diagnostic and repair guidance site. Notes the early-991 COV campaign
        and characterises COV failure as a common problem across the 991
        platform following the campaign period.
      tier: B
      url_or_reference: "pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/"
      retrieval_status: retrieved_this_session
    - name: >
        Suncoast Porsche Parts — Change-Over Valve OEM part 7PP906283F,
        latest F-suffix revision for 991/981 generation models. Confirms
        current part number, harness-adaptor requirement for B/C-suffix
        replacement, and current availability.
      tier: B
      url_or_reference: "suncoastparts.com/product/7PP906283F.html"
      retrieval_status: confirmed_in_search_results_this_session
    - name: >
        Pelican Parts — Porsche 991 Change Over Valve Flap Replacement.
        Procedural how-to article confirming COV replacement as a documented
        service procedure on the 991 platform.
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche_991/Change_Over_Valve_Flap_Replacement/Change_Over_Valve_Flap_Replacement.htm"
      retrieval_status: url_confirmed_in_search_results_403_on_fetch
  tier_c:
    - name: >
        Rennlist 991 forum — Ongoing change over valve issues on 991 (multi-
        page thread with owner-documented failure progression, part-number
        revision history from B through F, and case captures across multiple
        991.1 build years including post-campaign cars).
      tier: C
      url_or_reference: "rennlist.com/forums/991/800240-ongoing-change-over-valve-issues-on-991-a.html"
    - name: >
        Planet-9 Porsche Forum — Weird Cooling System Fault Message (case
        captures from 991.1 and 981 owners confirming P1433 presentation with
        COV root cause; includes 981 CS owner confirmation of the same fault
        pattern on the 981 generation).
      tier: C
      url_or_reference: "planet-9.com/threads/weird-cooling-system-fault-message.190530/"
    - name: >
        PCGB Forum — 991.1 Coolant Fault — Change Over Valve Diagnosis
        (detailed owner diagnostic post with vacuum-pump testing methodology,
        COV schematic cross-reference, and confirmed COV root cause on a
        2012/MY2013 991.1 C4S; notes multiple COV revision iterations).
      tier: C
      url_or_reference: "porscheclubgb.com/forum/threads/991-1-coolant-fault-change-over-valve-diagnosis.131420/"

editorial_note: >
  The WC-43 campaign covered early 991 production only and does not extend
  to 981, 718, or later 991 builds. For post-campaign 991 and for 981/718
  cars, COV failures are out-of-warranty events. The key pre-purchase
  question is whether any of the eight positions has already failed (and
  whether it was correctly diagnosed and the root cause addressed rather than
  a water pump or thermostat replaced at greater cost), and whether the
  remaining positions have been proactively upgraded to F-suffix parts.
  Dealer warranty coverage is generation- and VIN-specific; the campaign
  is not transferable to non-covered generations.
```

---

## Record 2 — PCM 2.0/2.1 navigation head-unit LCD display failure (996.2 / 997 / 987 / cayenne_955 era)

```yaml
id: porsche_pcm_2x_navigation_display_lcd_failure
flag_title: >
  PCM 2.0/2.1 navigation head-unit LCD display failure — dead pixels, screen
  fading, polarizer degradation, and ink-bleed on 996.2 / 997 / 987 /
  cayenne_955 (approximately 2002–2008)

description: >
  The Porsche Communication Management navigation head unit fitted as an option
  to 996.2, 997, 987 Boxster/Cayman, and cayenne_955 models uses a Sharp
  LQ058T5AR04 5.8-inch TFT LCD panel. The panel is subject to characteristic
  age-related failure modes: dead or stuck pixels appearing as black dots or
  lines; colour fading and reduced brightness; polarizer surface breakdown
  producing washed-out or blotchy display areas; and ink-run (fluid migration
  between panel layers producing expanding dark blotches). German Audio Tech,
  a named specialist in Porsche display repair, explicitly lists dead pixels,
  polarizer wear, ink runs, and cracks as the common failure presentations
  addressed by their PCM 2.1 LCD service.

  The PCM 2.x was an optional factory extra — not standard equipment — so
  this record applies only to vehicles equipped with PCM navigation. On
  PCM 2.1-equipped cars, the navigation DVD drive is located separately
  (frunk area on 911/Boxster/Cayman; dash area on Cayenne); the head-unit
  display failure is independent of the DVD drive, which has its own failure
  modes not covered by this record.

  The Porsche-dealer repair path is full head-unit replacement, which Go-Parts
  characterises as expensive and which requires PIWIS coding for proper options
  matching (Bose system, CD changer, satellite radio). Unlike PCM 3.1, the
  PCM 2.1 is not VIN-locked to the vehicle — a replacement unit will function
  without coding, though option-specific features may misbehave. The more
  cost-effective repair is LCD panel replacement: the Sharp LQ058T5AR04 is
  available as an isolated part from German Audio Tech, allowing screen
  replacement without unit replacement. German Audio Tech also offers a
  mail-in LCD repair service for the complete unit.

  This record covers the PCM navigation head-unit display only. The
  instrument-cluster centre LCD pixel failure on the same generation
  (996/997/986/987/cayenne_955/957) is covered in File 11, Record 2,
  which addresses the cluster — a physically separate component.

applicability:
  model_line:
    - 911
    - boxster
    - cayman
    - cayenne
  generation:
    - 996.2
    - 997.1
    - 987.1
    - cayenne_955
  engine_family:
    # Engine family is non-determinative; the PCM head unit is shared
    # across all powertrain variants in scope. Included for pipeline
    # compatibility only.
    - M96
    - M97
    - Mezger
    - v8_
    - v6_
  year_range: [2002, 2008]
  # German Audio Tech scopes the LQ058T5AR04 panel to "2003–2007 Porsche
  # PCM 2.1 navigation monitor installed into the 996, 997, Boxster and
  # Cayman." Go-Parts' broader PCM 2.x article covers "2002–2008" for the
  # 911/Boxster/Cayman/cayenne_955 fleet. [2002, 2008] brackets the full
  # span; most failures concentrate in 2003–2007 PCM 2.1 units.
  condition: >
    Applies only to vehicles equipped with the PCM 2.0 or PCM 2.1 navigation
    option. Non-navigation-equipped cars are not affected. Confirm by checking
    the original window sticker, Porsche options list, or by pressing MAIN
    and TRIP simultaneously on the head unit to display system version.
  excludes:
    description: >
      997.2 (2009–2012) and 987.2 (2009–2012) may be fitted with PCM 3.0
      rather than PCM 2.1 depending on build date; confirm installed PCM
      version before applying this record. Cayenne 957 (production from 2007)
      uses a different PCM revision; confirm the installed PCM version on any
      2007–2008 cayenne_957 before applying this record. The 991/981/992 era
      PCM failures are covered in ELEC_21_003.
    generation: [997.2, 987.2, cayenne_957, cayenne_958, 991.1, 991.2, 981, 718, 992.1]

severity: low_to_moderate
# Display failure does not affect vehicle driveability or safety. Severity
# scales with extent of failure: minor dead pixels are cosmetic; a fully
# failed or ink-run display renders the navigation system unusable and
# degrades resale value. Low-to-moderate is appropriate for the spectrum.

cost_range_usd:
  lcd_panel_replacement_specialist:
    qualitative: available_and_cost_effective_vs_full_unit
    _source_anchor: >
      German Audio Tech offers the LQ058T5AR04 LCD panel as an isolated
      replacement part and a mail-in LCD repair service as alternatives to
      full unit replacement, noting that dealers will not offer panel-only
      replacement (germanaudiotech.com/products/porsche-996-997-pcm2-1-
      navigation-monitor-radio-lcd-display-lq058t5ar04 and
      germanaudiotech.com/products/lcd-replacement-repair-service-for-
      porsche-pcm-2-1-navigation-radio, both confirmed in search results
      this session). Specific dollar prices not carried in retrieved search
      snippets; figures omitted per locked principle 3.
  full_unit_replacement_dealer:
    qualitative: expensive_per_go_parts_tier_b
    _source_anchor: >
      Go-Parts characterises the dealer path as full unit replacement at
      significant cost and notes that PIWIS coding at $150–$350 is
      recommended when fitting a used replacement unit for correct
      option-matching (go-parts.com/garage/infotainment-display-porsche-
      boxster-porsche-911-porsche-cayenne-2002-2008, retrieved this session).

prevalence_rate:
  qualitative: common_in_aged_pcm_2x_fleet
  _source_anchor: >
    German Audio Tech offers a dedicated mail-in LCD replacement service and
    stocks the replacement panel part as isolated products, explicitly listing
    dead pixels, polarizer wear, and ink runs as the common failure
    presentations for this unit (germanaudiotech.com, retrieved this session).
    Go-Parts characterises the LCD screen as a frequent point of failure in
    the PCM 2.1, listing screen fading, blotching, and display artefacts as
    typical symptoms (go-parts.com/garage/infotainment-display-porsche-boxster-
    porsche-911-porsche-cayenne-2002-2008, retrieved this session). The
    existence of an established third-party repair and parts industry for a
    specific panel part number is treated as a Tier-B prevalence signal.
    Numeric failure rate not published; qualitative framing anchored in
    converging Tier-B characterisations.

failure_correlation:
  - age (panel degradation is time-cumulative; failures concentrate in
    units beyond approximately 15 years from production)
  - thermal_cycling (dashboard heat cycling accelerates polarizer and
    LCD panel material aging)

symptoms:
  - "dead or stuck pixels visible as black dots, lines, or clusters on the navigation screen"
  - "progressive screen fading or reduced brightness"
  - "polarizer surface breakdown producing washed-out or blotchy areas"
  - "ink-run: expanding dark or discoloured blotches on the display surface"
  - "full screen failure (black or white screen)"

inspection_notes: >
  Inspect with the PCM system fully powered on and navigation active. A
  failed or degraded LCD is directly visible as dead pixels, fading, or
  blotches against map content. Confirm the installed PCM version by pressing
  MAIN and TRIP simultaneously — PCM 2.1 will self-identify in the version
  display. This record covers the head-unit display only; also confirm that
  the navigation DVD drive (frunk area on 911/Boxster/Cayman) reads discs
  correctly, as DVD drive failure is a separate failure mode.

buyer_questions:
  - "Is the PCM navigation display fully functional, with no dead pixels, fading, or discoloration visible when running navigation?"
  - "Has the PCM display or head unit been replaced or repaired? If a replacement unit, was it coded to the car's options configuration?"
  - "Does the navigation DVD drive read discs correctly, and is navigation fully functional?"

cross_references:
  - "**File 11 — Electrical.** Record 2 in File 11 covers instrument-cluster centre LCD pixel failure on 996/997/986/987/cayenne_955/957 — the cluster is a separate physical component from the PCM head unit covered here."
  - "**ELEC_21_003 (this file).** PCM 3.1 head-unit failures on the 991/981 era are covered in Record 3 of this file."

content_status: draft

evidence_basis:
  tier_a:
    - tier_a_absence_rationale: >
        LCD panel degradation in the PCM 2.x unit is a known age-related
        failure across the 996.2/997/987/cayenne_955 fleet. No NHTSA recall
        or PCNA TSB for this specific failure mode was located this session.
        The absence of a Tier-A bulletin is consistent with the non-safety-
        functional nature of the failure — the display affects navigation
        usability, not vehicle control.
  tier_b:
    - name: >
        German Audio Tech — LCD Replacement Repair Service for Porsche 996/997
        PCM 2.1 Navigation (mail-in LCD repair service; explicitly lists dead
        pixels, scratches, cracks, and polarizer wear as the covered failure
        presentations on the PCM 2.1 unit).
      tier: B
      url_or_reference: "germanaudiotech.com/products/lcd-replacement-repair-service-for-porsche-pcm-2-1-navigation-radio"
      retrieval_status: confirmed_in_search_results_this_session
    - name: >
        German Audio Tech — New LCD Display for Porsche PCM 2.1, 911 (996/997)
        2003–2007 Navigation (brand-new OEM-specification LQ058T5AR04 LCD panel
        as isolated replacement part; explicitly lists dead pixels, ink runs,
        and discoloration as the failure modes it resolves; notes dealers
        replace the entire unit rather than the panel).
      tier: B
      url_or_reference: "germanaudiotech.com/products/porsche-996-997-pcm2-1-navigation-monitor-radio-lcd-display-lq058t5ar04"
      retrieval_status: confirmed_in_search_results_this_session
    - name: >
        Go-Parts — Porsche 911, Boxster, Cayman & Cayenne PCM 2.1 Display:
        Fixing Failures from 2002–2008. Named Tier-B specialist with technical
        page. Characterises the LCD screen as a frequent point of failure on
        the PCM 2.1; describes fading, blotching, and display artefacts as
        typical symptoms; covers failure modes, diagnostic steps, and repair
        options.
      tier: B
      url_or_reference: "go-parts.com/garage/infotainment-display-porsche-boxster-porsche-911-porsche-cayenne-2002-2008"
      retrieval_status: confirmed_in_search_results_this_session
  tier_c:
    - name: >
        Planet-9 Porsche Forum — PCM 2.1 Screen Just Died (2005 Boxster S
        owner case capture: garbled lines and distorted display presentation
        on the PCM 2.1; consistent with Go-Parts Tier-B failure description).
      tier: C
      url_or_reference: "planet-9.com/threads/pcm-2-1-screen-just-died-any-ideas.33459/"
```

---

## Record 3 — PCM 3.1 infotainment system failure (991 / 981 / cayenne_958 era) and PCM Cluster-26 software crash (992 / cayenne_9Y0 / macan_95B, MY 2019–2021)

```yaml
id: porsche_pcm_3x_infotainment_system_failure
flag_title: >
  PCM 3.1 hard-drive failure (991.1 / 981 / cayenne_958 / panamera_970,
  2010–2018) — reboot loops and blank screens; and PCM Cluster-26 software
  memory crash (992.1 MY 2020–2021 / cayenne_9Y0 MY 2019–2021 /
  macan_95B MY 2019–2021) covered by PCNA ATI 2224.2

description: >
  Two distinct but related failure modes affect the Porsche Communication
  Management head unit across the 991/981 era and the early 992/9Y0/95B era.
  Both manifest as a blank or repeatedly rebooting PCM screen.

  PCM 3.1 hard-drive failure (991.1 / 981 / cayenne_958 / panamera_970,
  approximately 2010–2018): The PCM 3.1 head unit stores navigation map data,
  Jukebox content, and system software on an internal mechanical 2.5-inch
  SATA hard disk drive. As the HDD ages, progressive read errors trigger a
  reboot loop: the unit powers on, displays the Porsche logo, crashes, and
  restarts continuously. A system-wide reboot event in May 2020, triggered
  by a SiriusXM satellite signal update, simultaneously affected a large
  number of PCM 3.1 units and highlighted the underlying HDD vulnerability
  across the fleet; Go-Parts describes this event as sufficiently widespread
  that PCNA issued guidance. The definitive repair is cloning the failing
  HDD to a solid-state drive on the original unit — an approach that requires
  no PIWIS recoding because the original unit is preserved. A full used-unit
  replacement requires PIWIS VIN-coding at a dealer or qualified independent
  specialist to restore navigation and audio features; without coding, those
  features are disabled. Go-Parts provides a sourced PIWIS coding cost of
  $150–$350 for the used-unit path.

  PCM Cluster-26 software memory crash (992.1 / cayenne_9Y0 / macan_95B,
  MY 2019–2021): PCNA issued Advanced Technical Information bulletin ATI
  2224.2 (NHTSA-mirrored, original August 2022; last revised July 2023)
  covering 992 (MY 2020–2021), cayenne_9Y0 (referred to in the bulletin as
  9YA/9YB, MY 2019–2021), and macan_95B (MY 2019–2021). The root cause
  documented in the bulletin is a software memory-allocation error: the PCM
  navigation system in Cluster-26 (CL26) software exceeds its allowed memory
  allocation and overwrites system memory, crashing the entire PCM. Symptoms
  include sporadic PCM reboots (screen freezes before restarting; audio
  continues), and Porsche Innodrive non-functioning. The remedy is a PCM
  software update to version 2865 or higher (cayenne_9Y0 / macan_95B) or
  2872 or higher (992); where the existing hardware cannot support the new
  software, a new PCM at the specified hardware revision is required.

applicability:
  model_line:
    - 911
    - boxster
    - cayman
    - cayenne
    - macan
    - panamera
  generation:
    # PCM 3.1 HDD sub-issue:
    - 991.1
    - 981
    - cayenne_958
    - panamera_970
    # CL26 software sub-issue (per PCNA ATI 2224.2):
    - 992.1
    - cayenne_9Y0
    - macan_95B
  engine_family:
    # Engine family is non-determinative; PCM head unit is shared across
    # all powertrain variants in scope. Included for pipeline compatibility.
    - 9A1
    - 9A2
    - 9A3
    - v6_
    - v8_
    - i4_2_0_TT
  year_range: [2010, 2021]
  specific_model_years:
    # PCM 3.1 HDD sub-issue (Go-Parts scope: 2010–2018):
    991.1:       [2012, 2013, 2014, 2015, 2016]
    981:         [2012, 2013, 2014, 2015, 2016]
    cayenne_958: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
    panamera_970: [2010, 2011, 2012, 2013, 2014, 2015, 2016]
    # CL26 software sub-issue (per PCNA ATI 2224.2 exact MY scope):
    992.1:       [2020, 2021]
    cayenne_9Y0: [2019, 2020, 2021]
    macan_95B:   [2019, 2020, 2021]
    # macan_95B note: MY 2019–2021 corresponds to the 95B phase-2 (post-
    # refresh) generation; specific_model_years [2019–2021] constrains
    # the CL26 scope to this sub-population per ATI 2224.2.
  excludes:
    description: >
      991.2 (2016–2019) uses PCM 4.x, not PCM 3.1; PCM 4.x does not use a
      mechanical HDD and is not affected by the PCM 3.1 HDD failure mode.
      991.2 PCM failures have not been confirmed at Tier B at time of authoring
      and remain in the deferred queue. Pre-991 platforms (997, 996, 987, 986)
      are covered by ELEC_21_002 where PCM 2.x is fitted.
    generation: [991.2, 997.1, 997.2, 996.1, 996.2, 987.1, 987.2, 986]

severity: low_to_moderate
# PCM 3.1 HDD failure: affects infotainment and navigation only; does not
# affect driveability or safety. CL26 software crash: Tier-A bulletin confirms
# a defined remedy that should be addressed under warranty or goodwill for
# affected MY ranges; not a persistent defect on post-remedy cars.

cost_range_usd:
  pcm_3_1_hdd_ssd_upgrade:
    qualitative: cost_effective_via_ssd_clone_on_original_unit
    _source_anchor: >
      Go-Parts characterises the SSD upgrade as the most reliable and
      often cheapest repair path for the PCM 3.1 HDD failure; cloning the
      original HDD to a new SSD while retaining the original unit requires
      no PIWIS recoding (go-parts.com/garage/infotainment-display-porsche-
      boxster-porsche-cayman-porsche-911-2010-2016, retrieved this session).
      Specific SSD or labour cost not carried in retrieved snippets; figure
      omitted per locked principle 3.
  pcm_3_1_used_unit_replacement_coding:
    low: 150
    high: 350
    basis: piwis_coding_for_used_unit_replacement_at_dealer_or_specialist
    _source_anchor: >
      Go-Parts states that PIWIS coding for a used PCM 3.1 replacement unit
      costs $150–$350 at a dealer or qualified independent specialist
      (go-parts.com/garage/infotainment-display-porsche-cayenne-porsche-911-
      porsche-boxster-2010-2018, retrieved this session). This is coding
      cost only; full used-unit cost is additional.
  cl26_software_remedy:
    qualitative: covered_under_pcna_ati_2224_2_for_affected_my_range
    _source_anchor: >
      PCNA ATI 2224.2 defines the software update as the prescribed remedy;
      hardware replacement at specified revision is required where the update
      cannot be applied. Vehicles in the affected MY range should have this
      addressed by a Porsche dealer, who has had access to the bulletin
      since August 2022 (static.nhtsa.gov/odi/tsbs/2023/MC-10240413-0001.pdf,
      fetched this session).

prevalence_rate:
  pcm_3_1_hdd:
    qualitative: widespread_in_aged_pcm_3_1_fleet
    _source_anchor: >
      Go-Parts describes the PCM 3.1 HDD failure as widespread across the
      2010–2018 fleet and notes that the 2020 SiriusXM reboot event was so
      prevalent that it prompted PCNA guidance. The existence of a dedicated
      SSD upgrade and specialist repair industry for this specific unit is
      treated as a Tier-B prevalence signal (go-parts.com/garage/
      infotainment-display-porsche-boxster-porsche-cayman-porsche-911-
      2010-2016, retrieved this session).
  cl26_software:
    qualitative: model_year_specific_pcna_acknowledged_condition
    _source_anchor: >
      PCNA ATI 2224.2 confirms the CL26 software fault as a known condition
      on MY 2020–2021 992, MY 2019–2021 cayenne_9Y0, and MY 2019–2021
      macan_95B with Cluster-26 PCM software (static.nhtsa.gov/odi/tsbs/2023/
      MC-10240413-0001.pdf, fetched and read this session).

failure_correlation:
  - pcm_3_1: age and mechanical HDD wear (HDD degradation is time-cumulative
    and heat-cycling dependent; mechanical drives in a dashboard environment
    are subject to thermal cycling and vibration)
  - cl26_software: specific to Cluster-26 software version on affected MY range
    (software-origin defect; does not apply to units with post-remedy software)

symptoms:
  pcm_3_1_hdd:
    - "continuous reboot loop: PCM powers on to logo screen, crashes, repeats"
    - "blank PCM screen (no image)"
    - "navigation non-functional or disappears mid-trip"
    - "Jukebox inaccessible"
    - "fault codes 0x3019 (HDD internal error), 8005, 8E01, D004"
  cl26_software:
    - "PCM sporadically reboots; screen freezes briefly before restart; audio continues during reboot"
    - "Porsche Innodrive non-functional or intermittent"
    - "reboot condition persists across key cycles"

inspection_notes: >
  PCM 3.1 HDD (991.1 / 981 / cayenne_958 era): confirm whether the
  original HDD has been upgraded to an SSD. A car with an SSD upgrade on
  the original unit is preferable and eliminates the primary failure trigger.
  For a replacement unit, confirm PIWIS VIN-coding was completed.

  CL26 software (992.1 / cayenne_9Y0 / macan_95B, MY 2019–2021): confirm
  current PCM software version via a PIWIS scan or Porsche dealer check.
  ATI 2224.2 has been available to dealers since August 2022; any affected
  vehicle that has had a dealer visit since then should have had the remedy
  applied. An unresolved CL26 fault on a car within the affected MY range
  suggests it has not had a dealer service visit since the bulletin's release.

buyer_questions:
  - "On 991.1 / 981 / cayenne_958: has the PCM hard drive been upgraded to an SSD? If a replacement unit was fitted, was PIWIS coding completed?"
  - "On 992 / cayenne_9Y0 / macan_95B (MY 2019–2021): has PCNA ATI 2224.2 been addressed? What is the current PCM software version — 2865 or higher for Cayenne/Macan, 2872 or higher for 992?"
  - "Does the PCM power on cleanly, hold navigation without rebooting, and operate all connected features without error messages?"

cross_references:
  - "**ELEC_21_002 (this file).** PCM 2.x display failures (996.2/997/987 era) are covered in Record 2 of this file."
  - "**ELEC_21_004 (this file).** The 991 instrument cluster TFT failure (a separate component from the PCM head unit) is covered in Record 4 of this file."
  - "**File 11 — Electrical.** Record 2 in File 11 covers instrument-cluster LCD pixel failure on 996/997/986/987/cayenne_955/957 — the cluster is separate from the PCM head unit covered here."

content_status: draft

evidence_basis:
  tier_a:
    - name: >
        Porsche Cars North America — Advanced Technical Information ATI 2224.2
        (NHTSA-mirrored), Bulletin 2224.2, Part ID 9152. Original release
        August 19, 2022; revised April 11, 2023 and July 24, 2023. Scope:
        992 MY 2020–2021; cayenne_9Y0 (PCNA designation 9YA/9YB) MY 2019–2021;
        macan_95B MY 2019–2021. Root cause: Cluster-26 PCM software exceeds
        its allowed navigation memory allocation, overwriting system memory
        and crashing the PCM. Remedy: software update to version 2865+
        (9Y0/95B) or 2872+ (992); hardware replacement at specified revision
        where software update cannot be applied.
      tier: A
      url_or_reference: "static.nhtsa.gov/odi/tsbs/2023/MC-10240413-0001.pdf"
      retrieval_status: fetched_and_read_this_session
  tier_b:
    - name: >
        Go-Parts — Porsche PCM 3.1 Display Failure: Rebooting, Blank Screens
        & Replacement Guide for 911, Boxster, Cayenne & More (2010–2016).
        Named Tier-B specialist with technical page. Identifies HDD failure as
        the primary cause of PCM 3.1 reboot loops; confirms the May 2020
        SiriusXM event as widespread; provides fault code reference (0x3019,
        8005, 8E01, D004) and repair pathway options.
      tier: B
      url_or_reference: "go-parts.com/garage/infotainment-display-porsche-boxster-porsche-cayman-porsche-911-2010-2016"
      retrieval_status: confirmed_in_search_results_this_session
    - name: >
        Go-Parts — Porsche PCM 3.1 Rebooting or Black Screen? A Guide for
        Cayenne, 911, Panamera & More (2010–2018). Named Tier-B specialist
        with technical page. Extends PCM 3.1 HDD failure coverage to cayenne_958
        and panamera_970; confirms HDD as the primary failure component;
        provides PIWIS coding cost figure of $150–$350 for used-unit
        replacement.
      tier: B
      url_or_reference: "go-parts.com/garage/infotainment-display-porsche-cayenne-porsche-911-porsche-boxster-2010-2018"
      retrieval_status: confirmed_in_search_results_this_session
  tier_c:
    - name: >
        Rennlist 991 forum — PCM3.1 Reboot Problem Repair Attempt (detailed
        DIY thread documenting HDD-to-SSD migration procedure for the
        PCM 3.1; consistent with Go-Parts Tier-B HDD failure framing).
      tier: C
      url_or_reference: "rennlist.com/forums/991/1484228-pcm3-1-reboot-problem-repair-attempt.html"
```

---

## Record 4 — 991 instrument cluster central TFT display failure (991.1 / 991.2)

```yaml
id: porsche_991_instrument_cluster_tft_failure
flag_title: >
  991.1 / 991.2 instrument cluster central TFT display failure — blank or
  distorted multi-function display (distinct from PCM head unit)

description: >
  The 991 generation 911 introduced a colour TFT LCD screen as the central
  information display within the instrument cluster, replacing the dot-matrix
  segment display used in the 997.2. Go-Parts identifies failure of this TFT
  screen as the most widely reported instrument-cluster issue on the 991
  generation. The display may go fully black, show distorted graphics or
  pixel artefacts, or flicker before failing. The failure is specific to the
  TFT panel within the cluster assembly; the surrounding analogue gauges
  (tachometer, speedometer, fuel level, oil temperature) typically remain
  operational, but warning and status information routed through the TFT
  display — including navigation, performance data, vehicle settings, and
  critical system warnings — is lost when the panel fails.

  The Porsche-dealer repair path is full cluster replacement. Go-Parts
  characterises this as very expensive and notes that any replacement cluster
  (new or used) requires mandatory PIWIS VIN-coding, because the cluster
  stores the vehicle's VIN and immobiliser data. Dealers typically refuse to
  program used clusters; the practical options are a new OEM cluster with
  dealer programming, or a specialist mail-in repair service that replaces
  only the faulty TFT panel without requiring recoding. The 991.1 and 991.2
  clusters are not interchangeable due to feature and connector differences.

  This record covers the instrument cluster TFT display. The PCM navigation
  head-unit failures on the 991 era (a separate component in the centre
  console) are covered in ELEC_21_003. File 11, Record 2 covers the
  predecessor instrument-cluster LCD pixel failure pattern on 996/997/986/987
  and cayenne_955/957.

applicability:
  model_line:
    - 911
  generation:
    - 991.1
    - 991.2
  engine_family:
    # Engine family is non-determinative; the instrument cluster TFT
    # is shared across all 991 powertrain variants.
    - 9A1
    - 9A2
  year_range: [2012, 2019]
  # year_range note: 991.1 global production from 2011 (late-2011 start,
  # MY2012); year_range opens at 2012 per model-year convention. 991.2
  # global production ran 2016–2019.
  specific_model_years:
    991.1: [2012, 2013, 2014, 2015, 2016]
    991.2: [2016, 2017, 2018, 2019]
  excludes:
    description: >
      992-generation 911 (2019+) uses a full-digital instrument cluster
      architecture that differs from the 991's analogue-gauge-plus-TFT
      layout; 992 cluster failures are not covered by this record.
      981 Boxster/Cayman uses a different cluster arrangement. Pre-991
      sport cars (997, 996, 987, 986) use the dot-matrix segment display
      covered in File 11, Record 2.
    generation: [992.1, 992.2, 997.1, 997.2, 996.1, 996.2, 981, 718, 987.1, 987.2, 986]

severity: moderate
# The TFT failure disables the central information display — navigation
# feed to cluster, performance data, SPORT CHRONO display, media info,
# and vehicle-status warnings — while leaving analogue gauges operational.
# Moderate severity because critical warning information that routes
# through the TFT (oil pressure, coolant temp alerts, system faults) may
# be suppressed when the display is non-functional.

cost_range_usd:
  full_cluster_replacement_dealer:
    qualitative: very_expensive_per_go_parts_tier_b
    _source_anchor: >
      Go-Parts describes full cluster replacement as very expensive for
      the 991 generation and identifies it as the only dealer-recommended
      solution for TFT failure; notes that some specialist services can
      replace only the faulty TFT panel without replacing the entire
      cluster assembly (go-parts.com/garage/instrument-cluster-porsche-
      911-2010-2019, retrieved this session). Bounded dollar range not
      carried in retrieved snippet; figure omitted per locked principle 3.

prevalence_rate:
  qualitative: most_widely_reported_991_cluster_issue
  _source_anchor: >
    Go-Parts characterises TFT screen failure as the most widely reported
    instrument-cluster issue on the 991 generation and identifies blank or
    distorted TFT display as the primary failure presentation
    (go-parts.com/garage/instrument-cluster-porsche-911-2010-2019,
    retrieved this session). No Tier-B source quantifies a failure rate;
    qualitative framing anchored in Go-Parts' characterisation.

failure_correlation:
  - age (TFT panel degradation is time-cumulative)
  - thermal_cycling (dashboard heat exposure accelerates TFT panel aging)

symptoms:
  - "central TFT display goes blank (black screen) while driving or on startup"
  - "distorted graphics or pixel artefacts on TFT display"
  - "TFT display flickers or intermittently blanks, sometimes recovering after key cycle"
  - "loss of navigation feed, trip computer, performance data, and vehicle status in cluster"
  - "analogue gauges (tachometer, speedometer, fuel, oil temperature) remain operational"

inspection_notes: >
  Inspect with the engine running and system fully booted. The TFT display
  should show an active multi-function screen. A blank or distorted TFT
  while analogue gauges are functional is the characteristic presentation.
  Confirm whether the cluster has been replaced; if so, confirm PIWIS
  coding was completed. A dealer will typically refuse to program a used
  cluster — if a used cluster is present without confirmed coding, navigation
  feed to the cluster and other digitally configured features may be absent.

buyer_questions:
  - "Is the central TFT display in the instrument cluster fully operational — no blank areas, distortion, or artefacts visible with the engine running?"
  - "Has the instrument cluster been replaced? If so, was PIWIS VIN-coding completed by a Porsche dealer or qualified specialist?"

cross_references:
  - "**File 11 — Electrical.** Record 2 in File 11 covers the predecessor instrument-cluster LCD pixel failure on 996/997/986/987/cayenne_955/957 — the 991 TFT failure is the forward continuation of that pattern on the next-generation cluster."
  - "**ELEC_21_003 (this file).** PCM 3.1 infotainment head-unit failures on the 991 era are covered in Record 3 of this file; the PCM head unit and the instrument cluster are separate physical components."

content_status: draft

evidence_basis:
  tier_a:
    - tier_a_absence_rationale: >
        No NHTSA recall or PCNA TSB specific to the 991 instrument cluster
        TFT failure was located this session. The absence of a safety-
        functional consequence — analogue gauges remain operational when the
        TFT fails — is consistent with no formal recall or service campaign.
  tier_b:
    - name: >
        Go-Parts — Porsche 911 Instrument Cluster (2010–2019): A Guide to
        Swaps, Failures, and Programming. Named Tier-B specialist with
        technical page. Identifies TFT screen failure as the most widely
        reported instrument-cluster issue on the 991 generation; describes
        blank and distorted display as the primary failure presentations;
        notes mandatory PIWIS VIN-coding for any replacement cluster and
        the availability of specialist TFT panel replacement as an
        alternative to full cluster replacement.
      tier: B
      url_or_reference: "go-parts.com/garage/instrument-cluster-porsche-911-2010-2019"
      retrieval_status: confirmed_in_search_results_this_session
  tier_c:
    - name: >
        911UK Forum — 991.2 Instrument Cluster thread (991.2 owner case capture:
        blank LCD with intermittent flicker; consistent with Go-Parts Tier-B
        TFT failure description).
      tier: C
      url_or_reference: "911uk.com/porsche/991-2-instrument-cluster.127025/"
    - name: >
        911UK Forum — Dead Pixels on Instrument Cluster (992.1 C2S) thread
        (Tier-C consistency: owner reporting a pixel line on the cluster LCD;
        listed for cross-generation pattern consistency only — 992.1 is
        explicitly excluded from this record's applicability scope).
      tier: C
      url_or_reference: "911uk.com/porsche/dead-pixels-on-instrument-cluster-992-1-c2s.133568/"
```

---

## Source list (consolidated)

### Tier A — Porsche AG / PCNA / NHTSA-hosted bulletins

[1] PCNA Technical Information TI-64-12 (service campaign WC-43), NHTSA ID 10048760,
October 2, 2012. COV moisture ingress root cause; 3,718 NA vehicles; PDK cooling impairment
documented. Tier A.
https://static.nhtsa.gov/odi/tsbs/2012/SB-10048760-5824.pdf

[2] PCNA Advanced Technical Information ATI 2224.2 (NHTSA-mirrored), July 24, 2023. PCM
Cluster-26 software memory crash; 992 MY2020–21, cayenne_9Y0 (bulletin uses manufacturer
designation 9YA/9YB) MY2019–21, macan_95B MY2019–21; software and hardware remedy specified.
Tier A.
https://static.nhtsa.gov/odi/tsbs/2023/MC-10240413-0001.pdf

### Tier B — Named specialists with technical pages

[3] Kadunza — The Owner's Guide to Porsche Vacuum System Failures: From Diagnosis to
Definitive Repair. COV as primary cause of phantom P1433 on 991, 718, modern Cayenne/Panamera.
Tier B.
https://kadunza.com/the-owners-guide-to-porsche-vacuum-system-failures-from-diagnosis-to-definitive-repair/

[4] PCarwise — Porsche 911 Common Problems. COV campaign noted; COV framed as common
post-campaign failure on 991 platform. Tier B.
https://www.pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/

[5] Suncoast Porsche Parts — Change-Over Valve 7PP906283F for 991/981. Current F-suffix part,
harness-adaptor requirement confirmed. Tier B.
https://www.suncoastparts.com/product/7PP906283F.html

[6] Pelican Parts — Porsche 991 Change Over Valve Flap Replacement. Procedural how-to
confirming COV replacement as documented 991 service. Tier B.
https://www.pelicanparts.com/techarticles/Porsche_991/Change_Over_Valve_Flap_Replacement/Change_Over_Valve_Flap_Replacement.htm

[7] German Audio Tech — LCD Replacement Repair Service for Porsche 996/997 PCM 2.1
Navigation. Mail-in repair; dead pixels, polarizer wear, ink runs as covered presentations. Tier B.
https://www.germanaudiotech.com/products/lcd-replacement-repair-service-for-porsche-pcm-2-1-navigation-radio

[8] German Audio Tech — New LCD Display for Porsche PCM 2.1, 911 (996/997) 2003–2007
Navigation. OEM-spec LQ058T5AR04 panel as isolated replacement part. Tier B.
https://www.germanaudiotech.com/products/porsche-996-997-pcm2-1-navigation-monitor-radio-lcd-display-lq058t5ar04

[9] Go-Parts — Porsche 911, Boxster, Cayman & Cayenne PCM 2.1 Display: Fixing Failures
from 2002–2008. LCD screen as frequent point of failure; failure mode descriptions. Tier B.
https://www.go-parts.com/garage/infotainment-display-porsche-boxster-porsche-911-porsche-cayenne-2002-2008

[10] Go-Parts — Porsche PCM 3.1 Display Failure: Rebooting, Blank Screens & Replacement
Guide for 911, Boxster, Cayenne & More (2010–2016). HDD as primary failure; SiriusXM 2020
event; fault codes; repair options. Tier B.
https://www.go-parts.com/garage/infotainment-display-porsche-boxster-porsche-cayman-porsche-911-2010-2016

[11] Go-Parts — Porsche PCM 3.1 Rebooting or Black Screen? A Guide for Cayenne, 911,
Panamera & More (2010–2018). Extends PCM 3.1 HDD coverage to cayenne_958/panamera_970;
PIWIS coding cost $150–$350. Tier B.
https://www.go-parts.com/garage/infotainment-display-porsche-cayenne-porsche-911-porsche-boxster-2010-2018

[12] Go-Parts — Porsche 911 Instrument Cluster (2010–2019): A Guide to Swaps, Failures,
and Programming. 991 cluster TFT failure as most widely reported cluster issue;
mandatory PIWIS coding for replacement. Tier B.
https://www.go-parts.com/garage/instrument-cluster-porsche-911-2010-2019

### Tier C — Forums and named-individual community contributions

[13] Rennlist 991 forum — Ongoing change over valve issues on 991 (multi-page; part-number
revision history; case captures across multiple 991.1 builds). Tier C.
https://rennlist.com/forums/991/800240-ongoing-change-over-valve-issues-on-991-a.html

[14] Planet-9 Porsche Forum — Weird Cooling System Fault Message (991.1 and 981 P1433
case captures; 981 CS confirmation). Tier C.
https://www.planet-9.com/threads/weird-cooling-system-fault-message.190530/

[15] PCGB Forum — 991.1 Coolant Fault — Change Over Valve Diagnosis (detailed vacuum-pump
testing methodology; COV root cause confirmed on 2012/MY2013 991.1 C4S). Tier C.
https://www.porscheclubgb.com/forum/threads/991-1-coolant-fault-change-over-valve-diagnosis.131420/

[16] Planet-9 Porsche Forum — PCM 2.1 Screen Just Died (2005 Boxster S; garbled/line
display presentation). Tier C.
https://www.planet-9.com/threads/pcm-2-1-screen-just-died-any-ideas.33459/

[17] Rennlist 991 forum — PCM3.1 Reboot Problem Repair Attempt (detailed HDD-to-SSD
migration procedure). Tier C.
https://rennlist.com/forums/991/1484228-pcm3-1-reboot-problem-repair-attempt.html

[18] 911UK Forum — 991.2 Instrument Cluster thread (blank cluster LCD with flicker). Tier C.
https://911uk.com/porsche/991-2-instrument-cluster.127025/

[19] 911UK Forum — Dead Pixels on Instrument Cluster (992.1 C2S) thread (listed for
cross-generation pattern consistency; 992.1 excluded from Record 4 applicability). Tier C.
https://911uk.com/porsche/dead-pixels-on-instrument-cluster-992-1-c2s.133568/
