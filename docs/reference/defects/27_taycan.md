# 27 — Taycan

**Scope:** Electrical, battery, charging, thermal, software, and mechanical
failure modes specific to the Porsche Taycan. The Taycan is the catalog's only
pure battery-electric vehicle (BEV); its 800-volt architecture, OTA software
update cadence, and charging-infrastructure dependency create failure modes
with no precedent in the rest of the catalog.

**Generation keys used in this file:**
- `taycan_j1` — 2020–2023 (J1 platform; sedan, Sport Turismo, Cross Turismo;
  all sub-trims: base, 4S, GTS, Turbo, Turbo S)
- `taycan_j1_fl` — 2024+ (J1 facelift; revised battery chemistry, updated
  power electronics, higher peak charging speeds; adds Turbo GT trim)

**Body styles in scope:** Sedan, Sport Turismo, Cross Turismo — all share the
J1 platform and are in scope under the same generation keys unless a record
is body-style specific.

**Out of scope:** 918 Spyder HV battery (covered by HALO_26_005, File 26;
architecturally distinct 400V vs. 800V system, different chemistry, different
failure population). Macan EV (out of v1 scope). Charging faults attributable
solely to charging infrastructure rather than the car (per SD-3).

---

## TAYCAN_27_001 — High-Voltage Battery Module Short-Circuit Recall Family

```yaml
id: taycan_hv_battery_short_circuit_recall
flag_title: "HV battery short-circuit recall (multi-VIN expansion)"
description: |
  Multi-stage NHTSA recall family covering most 2020–2024 Taycan production.
  Certain LG-supplied high-voltage battery modules can develop internal
  short circuits that, in rare cases, lead to thermal events and fire. The
  recall has expanded several times; the current campaigns supersede the
  earlier ones, and vehicles previously remedied may need additional work.
  Buyers must verify recall completion against the most current campaign,
  not just an older closed campaign.

# === Applicability ===
applicability:
  generation: [taycan_j1, taycan_j1_fl]
  body: [Sedan, Sport_Turismo, Cross_Turismo]
  trim_category: [Taycan, Taycan_4S, Taycan_GTS, Taycan_Turbo, Taycan_Turbo_S]
  year_range: [2020, 2024]
  year_range_note: |
    Recall scope evolved through expansions. Current campaigns (NHTSA
    24V-731 / 24V-732, Porsche ARB5 / ARB6 / ARB7) cover production through
    early 2024. Vehicles produced after March 4, 2024 are not subject to
    the original campaigns; later production (taycan_j1_fl) is partially
    affected and partially exempt depending on build date. VIN check on
    NHTSA.gov is the only authoritative scope check.

# === Quantitative fields ===

severity: catastrophic
# Fire risk; HV battery module replacement is the worst-case remedy.

prevalence_rate: "common"
prevalence_source_anchor: |
  StuttgartDNA's tabulation of NHTSA 24V-731 (193 vehicles, ARB5) and
  24V-732 (27,527 vehicles, ARB6 and ARB7) records the combined affected
  US population at 27,720 units across model years 2020–2024 [1]. This
  represents the large majority of US Taycan production through the recall
  cutoff. Mapped to qualitative band: common (10–50% of in-scope cars),
  with the practical interpretation that nearly all 2020–early-2024 US
  Taycans fall within at least one of the campaigns and need VIN-level
  verification.

failure_correlation: usage_pattern
# Root cause is a manufacturing defect in specific LG cell batches, not
# mileage- or age-driven, but charging behavior interacts with risk.

retrofit_available: yes
retrofit_kit_names: ["Porsche dealer remedy under recalls ARB5 / ARB6 / ARB7 (NHTSA 24V-731 and 24V-732)"]

# === Detection ===

keywords_addressed:
  - "ARB5 completed"
  - "ARB6 completed"
  - "ARB7 completed"
  - "24V-731 remedied"
  - "24V-732 remedied"
  - "advanced diagnostic software installed"
  - "HV battery module replaced under recall"
  - "high-voltage battery recall completed"
  - "Taycan HV battery recall closed"

keywords_concerning:
  - "open battery recall"
  - "ARB5 open"
  - "ARB6 open"
  - "ARB7 open"
  - "charging limited to 80%"
  - "80% charge cap"
  - "interim battery limit"

keywords_active_problem:
  - "HV battery fault"
  - "Stop vehicle in safe place"
  - "battery thermal event"
  - "battery fire"
  - "module replacement pending"

keywords_documented:
  - "Porsche dealer recall printout"
  - "NHTSA VIN check clean"
  - "campaign closure invoice"

# === Provenance ===

evidence_basis: manufacturer_acknowledged
# Multiple NHTSA Part 573 reports filed by Porsche Cars North America.

sources:
  tier_a:
    - "[1] StuttgartDNA — Porsche Recalls the Taycan for Battery Short Circuit (tabulates NHTSA 24V-731 / 24V-732 with VIN ranges and unit counts). Tier A (mirrors NHTSA filings)"
    - "[2] NHTSA Part 573 Safety Recall Report 24V-732 (manufacturer recall ARB6 / ARB7), supplement to 23V-840, 24V-215, 24V-217. Tier A"
    - "[3] NHTSA Part 573 Safety Recall Report 24V-217 (manufacturer recall ARA5). Tier A"
    - "[4] Cars.com Porsche Taycan recall index (ARB5 expansion notice, mailed November 22, 2024; supersedes prior remedies). Tier A (mirrors NHTSA)"
  tier_b:
    - "[5] Consumer Reports — Porsche Taycan Recalled Because a Battery Short Circuit Risks Fire (Bartlett, October 2024). Tier B"
    - "[6] Recharged — Porsche Taycan Recalls List & Battery Fire Risk Overview (specialist used-EV marketplace; treats unfinished battery recall as a real cost). Tier B"
  tier_c:
    - "[7] TaycanForum recall threads (consistency footnote only — used to confirm owner-side experience of multi-step remedy and supply availability)."

# === Buyer-facing prose ===

editorial_note: |
  This is the single most important pre-purchase verification on any
  2020–2024 Taycan. The recall has expanded multiple times, and a closure
  on an early campaign (e.g., APB5) does not mean the car is current —
  Porsche has explicitly stated that vehicles previously repaired under
  the prior recalls need the new remedy completed [4]. Run the VIN through
  NHTSA.gov immediately and request a printed campaign history from a
  Porsche dealer. If the seller cannot produce documentation that ARB5,
  ARB6, or ARB7 (whichever applies) is closed, treat the recall as open
  and price accordingly. Cars under the interim 80% charge cap behave
  normally for ownership but indicate the final remedy has not yet been
  applied. Note that a small additional recall (Porsche APB2, 2023 Taycan
  only) addresses HV battery sealant — covered by the same VIN-based
  recall-status check.

  This record covers the 800V architecture only. The 918 Spyder uses a
  400V architecture with different chemistry and a different failure
  population (see HALO_26_005, File 26).

buyer_questions:
  - "Has the current HV battery recall (ARB5, ARB6, or ARB7 — whichever your VIN falls under) been completed? Can you provide the dealer printout showing campaign closure dated after October 2024?"
  - "Has the advanced diagnostic software been installed as the final remedy, or was the work done under the interim 80% charge limit only?"
  - "Were any HV battery modules replaced during recall work? If so, which modules and when?"
  - "Is the car still operating under any factory-imposed charging limit?"
```

---

## TAYCAN_27_002 — Front Brake Hose Cracking (NHTSA 24V-455 / ARB0)

```yaml
id: taycan_front_brake_hose_arb0
flag_title: "Front brake hose recall (ARB0)"
description: |
  NHTSA recall covering 2020–2025 Taycan production through June 13, 2024
  for front brake hoses that can develop cracks at the minimum bending
  radius under specific steering and driving conditions, leading to brake
  fluid leakage and reduced front-axle braking. Remedy is replacement with
  a redesigned hose with an increased bending radius; rear axle remains
  fully functional even in the event of a front leak.

# === Applicability ===
applicability:
  generation: [taycan_j1, taycan_j1_fl]
  body: [Sedan, Sport_Turismo, Cross_Turismo]
  year_range: [2020, 2025]
  year_range_note: |
    Recall covers US-market Taycans produced October 21, 2019 through
    June 13, 2024 [1]. Model year scope per NHTSA is 2020–2025; the
    MY 2025 portion of scope is bounded by the production-date cutoff
    (cars built after May 13, 2024 have the redesigned hose from the
    factory). VIN range in the recall is non-sequential, so VIN check
    is required.

# === Quantitative fields ===

severity: high
# Reduced front braking; full braking distance impact in event of leak.

cost_range_usd: [0, 0]
cost_source_anchor: |
  Recall remedy is performed at no cost to the owner per NHTSA Part 573
  Safety Recall Report 24V-455 [1]. Cost band is the recall remedy itself,
  not aftermarket replacement; out-of-recall replacement cost is not
  source-anchored and is omitted.

prevalence_rate: "uncommon"
prevalence_source_anchor: |
  Lemon Law Experts' summary of the ARB0 / 24V-455 recall reports the
  defective brake hose has been found in less than 1% of all Taycans
  globally and approximately 5% of US-market vehicles [4]. Mapping: 5%
  US prevalence = uncommon (1–10% band). The recall scope is broader
  (all US Taycans through the production cutoff, ~31,689 units) because
  the population at risk cannot be identified VIN-by-VIN without
  inspection.

failure_correlation: usage_pattern
# Driving conditions that compress the hose at the minimum bend radius.

retrofit_available: yes
retrofit_kit_names: ["Porsche dealer remedy under recall ARB0 (NHTSA 24V-455) — redesigned front brake hose with increased bending radius"]

# === Detection ===

keywords_addressed:
  - "ARB0 completed"
  - "24V-455 remedied"
  - "front brake hose recall completed"
  - "front brake hoses replaced under recall"

keywords_concerning:
  - "open ARB0"
  - "brake hose recall pending"
  - "brake recall stop sale"

keywords_active_problem:
  - "brake fluid low warning"
  - "PSM Failure"
  - "brake fluid leak"
  - "front brake hose leak"
  - "Taycan brake pedal soft"

keywords_documented:
  - "ARB0 recall closure"
  - "brake hose part replacement invoice"

# === Provenance ===

evidence_basis: manufacturer_acknowledged

sources:
  tier_a:
    - "[1] NHTSA Part 573 Safety Recall Report 24V-455 (manufacturer recall ARB0). Tier A"
    - "[2] NHTSA Manufacturer Notice RCMN-24V455-9043 — ARB0 stop delivery / recall campaign. Tier A"
  tier_b:
    - "[3] StuttgartDNA — Porsche Taycan Front Brake Hose Recall (24V-455 tabulation with VIN range and production dates). Tier B"
    - "[4] The Lemon Law Experts — 2024 Porsche Taycan Brake Recall Overview (cites ~5% US prevalence and 2-hour repair time). Tier B"
    - "[5] Electrek — Porsche to recall over 31,000 Taycan electric cars due to a brake malfunction (Lambert, June 26, 2024). Tier B"
  tier_c:
    - "[6] TaycanForum ARB0 stop-delivery thread (consistency footnote — confirms part availability lag and dealer process)."

# === Buyer-facing prose ===

editorial_note: |
  ARB0 is a free dealer fix and the work is non-controversial — dealers
  replace both front flexible hoses with a redesigned part in roughly two
  hours. Confirm via VIN check that the recall is closed before purchase.
  If the work is open and the car is in dealer inventory, note that this
  recall carried a stop-sale instruction; a current dealer should not be
  offering an unremedied car. On private-party sales, an open ARB0 is a
  routine negotiating point — it costs the seller nothing to schedule
  before delivery.

buyer_questions:
  - "Has recall ARB0 (NHTSA 24V-455) front brake hose replacement been completed? Can you show the dealer invoice or VIN-status printout?"
  - "If the car was in dealer inventory before June 2024, was the stop-sale lifted before delivery?"
  - "Are there any current 'low brake fluid' or 'PSM Failure' warning messages in the vehicle history?"
```

---

## TAYCAN_27_003 — Loss of Motive Power Software Recall (2020–2021, NHTSA 21V-486)

```yaml
id: taycan_loss_of_motive_power_21v486
flag_title: "Loss of motive power recall (2020–2021)"
description: |
  NHTSA recall for 2020–2021 Taycan and Taycan Cross Turismo addressing
  a software defect in the power electronics and engine control unit that
  could incorrectly detect a fault and trigger a power-train shutdown,
  causing complete loss of motive power while driving. Remedy is a dealer
  software update of approximately one hour. The condition was already
  remedied in production at the time of the recall.

# === Applicability ===
applicability:
  generation: [taycan_j1]
  body: [Sedan, Cross_Turismo]
  trim_category: [Taycan, Taycan_4S, Taycan_Turbo, Taycan_Turbo_S]
  year_range: [2020, 2021]
  year_range_note: |
    NHTSA 21V-486 covers 2020 and 2021 model year only; later production
    received the corrected software at the factory.

# === Quantitative fields ===

severity: high
# Highway loss of propulsion; steering and brakes retained but acceleration
# disabled.

cost_range_usd: [0, 0]
cost_source_anchor: |
  Recall remedy performed at no cost per NHTSA 21V-486 [1]. Software
  update only.

prevalence_rate: "near-universal"
prevalence_source_anchor: |
  Sibros' regulatory analysis of NHTSA 21V-486 reports approximately
  10,373 affected units in the US (~43,000 worldwide) covering all 2020
  and 2021 Taycan trims and all Cross Turismo variants [2]. Within the
  in-scope generation/year window, the recall is essentially universal
  (all US 2020–2021 Taycans) — the worldwide failure rate of the actual
  defect is reported by Electrek as on the order of 1,000–3,000 cars
  globally [3], making the catalog applicability "near-universal for the
  recall, but only a fraction will exhibit the symptom."

failure_correlation: usage_pattern
# Software fault triggered by transient communication anomalies.

retrofit_available: yes
retrofit_kit_names: ["Porsche dealer software update under recall 21V-486 (Porsche action AMB5)"]

# === Detection ===

keywords_addressed:
  - "21V-486 completed"
  - "AMB5 completed"
  - "loss of motive power recall completed"
  - "power electronics software updated"

keywords_concerning:
  - "open 21V-486"
  - "AMB5 pending"

keywords_active_problem:
  - "Motor control error"
  - "Stop vehicle in a safe place"
  - "loss of motive power"
  - "power train shutdown"

keywords_documented:
  - "AMB5 service order"
  - "21V-486 closure invoice"

# === Provenance ===

evidence_basis: manufacturer_acknowledged

sources:
  tier_a:
    - "[1] NHTSA Part 573 Safety Recall Report 21V-486 (manufacturer recall AMB5). Tier A"
  tier_b:
    - "[2] Sibros — Porsche Taycan Power Electronics Recall NHTSA 21V486 (regulatory walkthrough; ~10,373 US units). Tier B"
    - "[3] Electrek — Porsche issues physical recall of Taycans over loss of power issue (Lambert, July 2, 2021; reports ~43,000 worldwide and ~1,000–3,000 actually affected). Tier B"
    - "[4] Recharged — 2021 Porsche Taycan Recalls List & Owner Guide (treats loss-of-power recall closure as a key used-purchase verification). Tier B"
  tier_c:
    - "[5] TaycanForum recall-receipt threads (consistency footnote — owner-side confirmation of dealer email, scheduling, and AMB5 invoice text)."

# === Buyer-facing prose ===

editorial_note: |
  This is an early-Taycan-only concern (2020–2021). The fix is a quick
  software flash, but it is mandatory verification on any used 2020 or
  2021 car. Loss of propulsion at highway speed is the central safety
  risk; steering and brakes remain operative, but a car that suddenly
  decelerates from passing speed in moving traffic is a real hazard.
  Some owners have reported receiving recall notices even after the
  remedy was applied at production — a Porsche dealer printout confirming
  AMB5 closure is the definitive answer.

buyer_questions:
  - "Has recall 21V-486 (Porsche AMB5) been completed? Can you provide a dealer service order showing the power electronics software update?"
  - "Has the car ever displayed the message 'Motor control error – Stop vehicle in a safe place'?"
  - "Is there any record of unexplained tow events or power-loss complaints in the service history?"
```

---

## TAYCAN_27_004 — High-Voltage Cabin Heater Service Campaign (2020–2023)

```yaml
id: taycan_hv_heater_campaign
flag_title: "HV cabin heater preemptive replacement campaign"
description: |
  Porsche-issued customer service campaign (manufacturer-acknowledged but
  not a formal NHTSA recall in the US) covering 2020–2023 Taycan vehicles
  for failure of the high-voltage electric cabin heater. Failure disables
  cabin heat, windshield defrosting, and battery preconditioning. Multiple
  hardware revisions exist; some replacement units have themselves failed,
  and Porsche has issued additional campaigns (including UK/Canada formal
  recalls) for revised parts.

# === Applicability ===
applicability:
  generation: [taycan_j1]
  body: [Sedan, Sport_Turismo, Cross_Turismo]
  year_range: [2020, 2023]
  year_range_note: |
    Porsche's statement to The Drive specified 2020–2023 as the
    affected population [1]. Canada's safety regulator issued a formal
    recall in May 2023; the US action remains a service campaign rather
    than a NHTSA safety recall. taycan_j1_fl (2024+) carries an updated
    heater design and is not in scope of this campaign.

# === Quantitative fields ===

severity: moderate
# Loss of windshield defrost rises to safety-relevant in cold climates;
# repair under campaign is free.

cost_range_usd: [0, 0]
cost_source_anchor: |
  Replacement under the customer service campaign is at no cost to the
  owner per Porsche's letter to affected owners reproduced on TaycanForum
  [3]. Out-of-warranty out-of-campaign replacement cost is reported by
  PistonHeads owners at approximately £1,360 for the part [4], but this
  is a UK figure not directly applicable to the US market and is omitted
  from the catalog cost band per locked principles.

prevalence_rate: "common"
prevalence_source_anchor: |
  The Drive's investigation cites 136 documented failures from an
  owner-maintained GitHub registry, with multiple owners reporting
  repeat failures (3–4 replacements on a single car) [1]. Porsche
  issued a preemptive replacement program covering all 2020–2023
  cohort cars regardless of individual failure status, and replacement
  parts have cycled through multiple hardware revisions (E → F → H10 →
  H11) documented in service-letter reproductions [3]. Catalog band:
  common (10–50%). Sources establish the failure mode and cohort-wide
  remedy but do not establish a population-level percentage; the band
  is a catalog mapping of the qualitative signal (documented incidents,
  cohort-wide preemptive campaign, multi-revision supplier history),
  not a sourced rate.

failure_correlation: climate
# typical_failure_age_years intentionally omitted. The 1–4 year window
# initially considered for this record is supported only by TaycanForum
# and Rennlist owner threads (Tier C), which cannot be the sole source
# for an age claim per locked principles. The Drive [1] establishes
# climate correlation but not a defined age window. failure_correlation
# alone (climate) stands on Tier B evidence.

retrofit_available: yes
retrofit_kit_names: ["Porsche dealer replacement HV heater under customer service campaign (replacement part revisions designated F/SW17 and later; H11 supersedes H10)"]

regional_amplification:
  cold_climate: high

# === Detection ===

keywords_addressed:
  - "HV heater replaced"
  - "high voltage heater replaced"
  - "heater campaign completed"
  - "cabin heater service campaign closed"

keywords_concerning:
  - "open heater campaign"
  - "HV heater pending"

keywords_active_problem:
  - "no cabin heat"
  - "windshield won't defrost"
  - "Taycan air conditioning error"
  - "HV heater error"
  - "Taycan heater not working"
  - "PTC heater fault"

keywords_documented:
  - "heater part number replacement invoice"
  - "HV heater revision F installed"

# === Provenance ===

evidence_basis: manufacturer_acknowledged

sources:
  tier_a:
    - "[1] The Drive — Failed Porsche Taycan Heaters Are Leaving Some Owners Out in the Cold This Winter (cites Porsche spokesperson statement acknowledging HVAC quality issue in 2020–2023 Taycans; references Porsche-issued NHTSA service bulletin). Tier A (manufacturer statement) / Tier B (publication)"
    - "[2] Porsche Excellence Magazine — All-Electric Taycan Tech (technical explainer of HV heater function in the third high-temperature cooling circuit). Tier B (specialist publication; cited via The Drive)"
    - "[3] Porsche customer-letter text reproduced on TaycanForum (Free HV Heater Replacement campaign; describes preemptive replacement program). Tier A (manufacturer document)"
  tier_b:
    - "[4] PistonHeads — Heater failure Taycan thread (cites £1,360 part cost and ~9-hour fit time; multiple repeat-failure owner reports). Tier B (specialist publication forum)"
    - "[5] Recharged — 2024 Porsche Taycan Recalls List (notes heat pump and HV heater TSBs as relevant pre-purchase items). Tier B"
  tier_c:
    - "[6] TaycanForum and Rennlist heater-failure threads (consistency footnote — confirm widespread owner experience and supply chain delays)."

# === Buyer-facing prose ===

editorial_note: |
  Unlike the formal recalls in this file, the US HV heater action is a
  Porsche customer service campaign. That distinction matters for buyer
  verification: campaign status may not appear on a standard NHTSA VIN
  check and must be confirmed by a Porsche dealer pulling the car's
  campaign history under a Porsche Customer Information Number. Most
  affected cars in the US have been preemptively replaced, but the
  replacement parts themselves have multiple revisions, and earlier
  replacements (the original H10 design) have failed at higher rates
  than the H11 revision. For a cold-climate buyer, ask specifically
  which revision is currently installed. taycan_j1_fl cars (2024+) have
  a different heater design and are not in scope for this campaign,
  though buyers in cold regions should still confirm cabin heat works
  at delivery.

buyer_questions:
  - "Has the HV cabin heater been replaced under the Porsche customer service campaign? Which revision is currently installed (E/16, F/17, H10, H11, or later)?"
  - "On a 2020–2023 car, can you have a Porsche dealer print the campaign history showing whether the heater work is open, closed, or pending a follow-up campaign?"
  - "Has the cabin heat been verified working in the most recent winter? If the car has been in storage or in a warm climate, has anyone tested the heater since installation?"
```

---

## TAYCAN_27_005 — 12V Auxiliary Battery Drain and Stranding

```yaml
id: taycan_12v_auxiliary_battery
flag_title: "12V auxiliary battery drain (Taycan-specific lithium pack)"
description: |
  The Taycan uses a lithium 12V auxiliary battery (not a conventional AGM)
  that powers the body computers, high-voltage contactors, electric power
  steering assist, brake systems, and the wake-up sequence that lets the
  car transition from off to ready. When the 12V pack fails or drains,
  the car cannot power on regardless of how much charge is in the
  high-voltage pack, and the failure mode is stranding rather than
  reduced performance. Tier B specialists treat 12V failure as the
  single most common Taycan service item.

# === Applicability ===
applicability:
  generation: [taycan_j1, taycan_j1_fl]
  body: [Sedan, Sport_Turismo, Cross_Turismo]
  year_range: [2020, 2025]

# === Quantitative fields ===

severity: moderate
# Repair is bounded; consequence is stranding rather than safety incident.

# cost_range_usd intentionally omitted per locked principle (omit if
# unsourceable rather than estimate). Recharged [1] reports a budgetary
# expectation of "$1,000+" at dealer rates as a floor figure; no Tier B
# source establishes an upper bound, and the floor itself is not a
# range. The qualitative figure appears in editorial_note instead, where
# it serves buyer guidance without claiming a sourced numeric band.

prevalence_rate: "common"
prevalence_source_anchor: |
  Repasi Motorwerks (Porsche Gold Meister independent specialist) lists
  12V battery drain as the most common Taycan service issue addressed
  at their facility [2]. Recharged's common-problems guide treats the
  12V battery as a defining Taycan ownership concern with an established
  pattern of stranding events even when the HV pack is healthy [3].
  Mapping: common (10–50% of in-scope cars exhibit issue within
  ownership horizon).

failure_correlation: usage_pattern
# typical_failure_age_years intentionally omitted. Champion Porsche [4]
# establishes 8–10 years for lithium 12V under normal use and 3–4 years
# for AGM under storage / short-trip / high-heat conditions, but does
# not establish a Taycan-lithium-under-abuse window. The 2–5 year range
# initially considered for this record is interpolation, not source-
# anchored, and is omitted per locked principle. failure_correlation
# (usage_pattern) stands on Tier B sources [1][2][3] independently.

retrofit_available: no
# Replacement is the only remedy; no kit eliminates the failure mode.

regional_amplification:
  desert_southwest: high
  cold_climate: moderate

# === Detection ===

keywords_addressed:
  - "12V battery replaced"
  - "lithium 12V replacement"
  - "auxiliary battery replaced"
  - "PIWIS update for 12V drain"

keywords_concerning:
  - "12V battery weak"
  - "phantom drain noted"
  - "Electrical System Error history"

keywords_active_problem:
  - "Electrical System Error"
  - "Park vehicle in a safe place"
  - "Taycan won't wake up"
  - "needs jump from frunk posts"
  - "Taycan stranded"
  - "12V auxiliary battery dead"
  - "lithium 12V dead"

keywords_documented:
  - "12V replacement invoice"
  - "DC-DC converter test"
  - "PIWIS phantom drain update"

# === Provenance ===

evidence_basis: specialist_consensus

sources:
  tier_b:
    - "[1] Recharged — Porsche Taycan 12V Battery Replacement Guide 2025 (specialist used-EV marketplace; characterizes lithium 12V failure as Taycan-defining; budgetary $1,000+ replacement). Tier B"
    - "[2] Repasi Motorwerks (Porsche Gold Meister independent specialist) — Taycan service pages (Newark NJ, Morristown NJ): identifies 12V battery drain as the most common Taycan service issue addressed. Tier B"
    - "[3] Recharged — Porsche Taycan Common Problems and Fixes (treats 12V as a known Taycan weak point; stranding even with full HV pack). Tier B"
    - "[4] Champion Porsche (dealer) — Battery Test and Replacement page (cites 4–5 year typical AGM life, 8–10 years for lithium upgrades; recommends OEM specification adherence). Tier B (dealer-published reference)"
  tier_c:
    - "[5] CarComplaints.com NHTSA-mirror complaint summary for 2020 Taycan electrical system (consistency footnote — multiple owner reports of stranding tied to 12V replacement)."
    - "[6] TaycanForum 12V battery threads and PCGB Forum Taycan 12v battery thread (consistency footnotes only)."

# === Buyer-facing prose ===

editorial_note: |
  This is the most likely non-recall reason a used Taycan strands its
  owner. The 12V pack is unusual for a luxury car: it is lithium rather
  than AGM, costs more than a typical 12V battery to replace (Recharged
  reports a budgetary expectation of $1,000+ at dealer rates), and
  requires PIWIS-equipped service to clear codes and verify the DC-DC
  converter is healthy after replacement. Some 12V failures are masked
  by intermittent symptoms (driver-assistance, brakes, or steering
  warnings that disappear after a restart) that owners attribute to
  separate component issues. A Tier B specialist or Porsche dealer can
  test resting voltage and load performance as part of a pre-purchase
  inspection.

  The 12V system also matters for HV battery recall work: Porsche has
  noted that a depleted 12V can deactivate the entire electrical system,
  and several open recalls in this file require a functional 12V pack
  for the dealer to perform diagnostic work. A car that cannot be woken
  for diagnostics is a car that cannot have its recall work verified.

buyer_questions:
  - "Has the 12V auxiliary battery been replaced? If so, when, with what part, and at what mileage?"
  - "Can a Porsche dealer or specialist run a resting-voltage and load test on the current 12V before delivery?"
  - "Has the car had any 'Electrical System Error – Park vehicle in a safe place' messages, even ones that resolved after a restart?"
  - "Is there any record of jump-starts via the under-frunk auxiliary posts?"
```

---

## TAYCAN_27_006 — NEMA 240V Charging Cable Equipment Recall (NHTSA 23V-841 / APB6)

```yaml
id: taycan_pmcc_charging_cable_apb6
flag_title: "NEMA 240V charging cable equipment recall"
description: |
  NHTSA equipment recall (not a vehicle recall) covering the Porsche
  Mobile Charger Connect / Plus NEMA 220V/240V charging cable shipped
  with 2020–2024 Taycan, Cayenne E-Hybrid, and Panamera. The original
  cable's NEMA plug, when used with a low-quality electrical receptacle,
  could be permanently damaged at the connector crimps, causing elevated
  electrical resistance and overheating that persists even when the
  cable is later used with proper outlets. Remedy is replacement with a
  new cable incorporating a temperature sensor, or owner reimbursement
  up to a stated cap for a third-party EVSE.

# === Applicability ===
applicability:
  generation: [taycan_j1, taycan_j1_fl]
  body: [Sedan, Sport_Turismo, Cross_Turismo]
  year_range: [2020, 2024]
  year_range_note: |
    Equipment recall scope per NHTSA 23V-841: the affected cable shipped
    as original equipment with vehicles whose manufacture preceded
    Calendar Week 48 of 2023 [1]. Vehicles built after that date have
    the new sensor-equipped cable from the factory.

# === Quantitative fields ===

severity: low
# Equipment-level concern; remedy is a free cable swap or reimbursement.

cost_range_usd: [0, 0]
cost_source_anchor: |
  Replacement cable provided at no cost; alternatively, Porsche offered
  reimbursement up to a stated cap for an aftermarket EVSE per owner
  letters reproduced on TaycanForum [3]. NHTSA Part 573 report 23V-841
  documents the no-cost remedy [1].

prevalence_rate: "common"
prevalence_source_anchor: |
  Autoevolution's coverage of recall 23V-841 reports approximately
  41,345 EV and PHEV vehicles in scope (across Taycan, Cayenne E-Hybrid,
  and Panamera), with 110 documented overheating incidents at the time
  of the filing [2]. Within the in-scope Taycan population (the
  applicable cohort for this catalog), the recall affects essentially
  the full pre-Q4-2023 production volume — common in the catalog sense
  that any given used 2020–early 2024 Taycan is likely to be within
  scope, even though the underlying defect manifests in only a small
  fraction.

failure_correlation: usage_pattern
# Triggered by use with low-quality receptacles.

retrofit_available: yes
retrofit_kit_names: ["Porsche replacement NEMA charging cable with integrated temperature sensor (under recall APB6 / NHTSA 23V-841)"]

# === Detection ===

keywords_addressed:
  - "APB6 completed"
  - "23V-841 remedied"
  - "PMCC cable replaced"
  - "new charging cable with temperature sensor"
  - "EVSE reimbursement received"

keywords_concerning:
  - "open APB6"
  - "original PMCC cable still in use"
  - "charging cable recall pending"

keywords_active_problem:
  - "charging cable hot"
  - "PMCC overheating"
  - "melted NEMA plug"
  - "charge session interrupted by cable temp"

keywords_documented:
  - "APB6 closure"
  - "replacement cable sticker"

# === Provenance ===

evidence_basis: manufacturer_acknowledged

sources:
  tier_a:
    - "[1] NHTSA Part 573 Safety Recall Report 23V-841 (manufacturer recall APB6); chronology covers December 2020 reports through December 2023 expansion to safety recall. Tier A"
  tier_b:
    - "[2] Autoevolution — Porsche recalls 41,345 electric and plug-in hybrid vehicles due to fire risk (cites 110 incidents and Calendar Week 48 production fix). Tier B"
    - "[3] Owner letter and reimbursement-process discussion on TaycanForum APB6 thread (reproduces Porsche-issued correspondence). Tier B (manufacturer document via specialist forum)"

# === Buyer-facing prose ===

editorial_note: |
  This is an equipment recall, not a vehicle recall, and is the smallest
  buyer concern in this file — but it has a quirk worth noting. The
  remedy applies to the included Porsche Mobile Charger Connect or Plus
  cable, not to the car. If a previous owner accepted the recall
  reimbursement and switched to a third-party EVSE (Tesla Mobile
  Connector, ChargePoint, etc.), the original Porsche cable may not be
  in the car at all, and a buyer expecting the OEM portable charger
  should plan accordingly. Conversely, if the car still ships with the
  original recalled cable, the recall is open and the buyer should
  schedule the swap.

buyer_questions:
  - "Is the original Porsche Mobile Charger Connect / Plus cable still with the car? If so, has it been replaced under recall APB6 (NHTSA 23V-841)?"
  - "If the included cable has been swapped for a third-party EVSE, was the replacement made under the Porsche reimbursement program?"
  - "Are there any signs of heat damage on the NEMA plug (discoloration, melted plastic, scorching)?"
```

---

## TAYCAN_27_007 — Backup Camera Software Recall (NHTSA 25V-896 / ASB2)

```yaml
id: taycan_backup_camera_asb2
flag_title: "Backup camera software recall (cross-marque)"
description: |
  NHTSA recall covering 2020–2025 Taycan among 174,000 vehicles across
  multiple Porsche models. A software issue can cause the rearview
  camera image to fail to display when the vehicle is shifted into
  reverse — most likely caused by signal noise from the surround-view
  cameras interrupting the rearview signal. Remedy is a dealer software
  update of the driver assistance module; production fix introduced
  May–June 2025.

# === Applicability ===
applicability:
  generation: [taycan_j1, taycan_j1_fl]
  body: [Sedan, Sport_Turismo, Cross_Turismo]
  year_range: [2020, 2025]
  year_range_note: |
    Per NHTSA Part 573 report 25V-896, the recall covers Taycan model
    years 2020–2025 (34,148 Taycan units) within a broader 174,000-unit
    cross-model campaign also covering Cayenne, Cayenne E-Hybrid, 911,
    Panamera, and Panamera E-Hybrid [1]. Production fix introduced
    May–June 2025; cars built after this date should not need the
    update.

# === Quantitative fields ===

severity: moderate
# FMVSS 111 noncompliance; rearward visibility impacted.

cost_range_usd: [0, 0]
cost_source_anchor: |
  Recall remedy (software update at dealer) at no cost per NHTSA Part
  573 report 25V-896 [1].

prevalence_rate: "near-universal"
prevalence_source_anchor: |
  NHTSA 25V-896 / ASB2 covers all Taycan production from 2020 through
  2025 with the affected software, with the exception of post-fix
  production (May–June 2025 onward) [1]. Within in-scope years, the
  campaign is essentially universal; the actual symptom (camera signal
  loss in reverse) occurs in "certain rare instances" per the recall
  language [2].

failure_correlation: usage_pattern
# Triggered when surround-view cameras interrupt rearview signal.

retrofit_available: yes
retrofit_kit_names: ["Porsche dealer software update under recall ASB2 (NHTSA 25V-896)"]

# === Detection ===

keywords_addressed:
  - "ASB2 completed"
  - "25V-896 remedied"
  - "backup camera recall completed"
  - "driver assistance software updated"

keywords_concerning:
  - "open ASB2"
  - "rearview camera recall pending"

keywords_active_problem:
  - "rearview camera not displaying"
  - "backup camera black screen"
  - "rear camera not working in reverse"

keywords_documented:
  - "ASB2 closure invoice"
  - "PCM driver assistance update"

# === Provenance ===

evidence_basis: manufacturer_acknowledged

sources:
  tier_a:
    - "[1] NHTSA Part 573 Safety Recall Report 25V-896 (manufacturer recall ASB2; production fix dated May–June 2025; planned dealer notification January 16, 2026). Tier A"
    - "[2] NHTSA recall acknowledgement RCAK for 25V-896 (cited via Cars.com and DealerRater recall indexes). Tier A"
  tier_b:
    - "[3] Consumer Reports — Porsche Recalls 174,000 Cars and SUVs to Fix Backup Cameras (Barry, December 2025). Tier B"
    - "[4] Yahoo Autos / Auto Reliability Index — Porsche Recalls 174,000 911s, Taycans, Panameras & Cayennes Over Backup Camera Issues (cites 34,148 Taycan units in scope). Tier B"

# === Buyer-facing prose ===

editorial_note: |
  Lowest-stakes recall in this file, but still a verification item on
  any pre-2025-fix Taycan. The fix is a software update at the dealer,
  fast and free. Note that this campaign is recent (notifications mailed
  February 2026) and may show as open even on cars whose owners are
  proactive — there has not been time for the entire fleet to cycle
  through dealer service. A car with all other recalls closed but ASB2
  still pending is normal and easily remedied.

buyer_questions:
  - "Has recall ASB2 (NHTSA 25V-896) backup camera software update been completed? If not, has it been scheduled?"
  - "Does the rearview camera image display reliably when shifting into reverse during the test drive?"
```

---

## Declined candidates (with reasons)

The following candidates from the File 27 authoring prompt were researched
and declined for v1 of the catalog. Each is documented here so a future
revision pass has the rationale and source trail.

**Taycan 800V charging system thermal-management faults (general).** Per
SD-3, the test for a charging fault is whether it manifests independent of
charging infrastructure. Tier B sources (Recharged, InsideEVs coverage
indexed via Recharged) characterize charging-side issues as a mix of
station-network problems and software-update-resolved car-side behavior,
but no Tier B source establishes a bounded car-side defect distinct from
the recalls already captured (HV battery short-circuit family,
APB6 charging cable). Decline; covered by other records via VIN check.

**Taycan charge port mechanism / charge flap faults.** Forum reports of
charge cable lock-in and charge flap mechanism failures exist (Tier C),
but no Tier B specialist establishes a bounded defect pattern with
characteristic failure mode, affected production cohort, or remedy.
Decline; defer for v2 if Tier B surfaces.

**Heat pump cold-climate range degradation.** Per locked principle "Do
not conflate range with defect," and per SD-3 distinguishing car-side
from external factors: most cold-climate range complaints are normal BEV
behavior. The bounded HV-heater defect that does exist is captured under
TAYCAN_27_004 as a hardware issue, not a range issue. Decline as a
range record.

**Taycan HV battery degradation and capacity loss.** Tier B has not yet
established a Taycan-specific degradation rate, warranty-relevant
threshold, or pre-purchase inspection protocol distinct from Porsche's
8-year / 100,000-mile HV battery warranty (which is buyer context, not
a defect record per SD-6 framework). Recharged offers a "Recharged
Score" battery diagnostic but treats it as a generic used-EV product
rather than calibrating to a specific Taycan degradation curve. Decline
for v1; defer to v2 when more service-life data exists.

**Frunk water intrusion (general).** The frequently-reported "water in
the frunk well after a wash" is design-as-intended per multiple Tier C
owner accounts and is not a defect. The narrower issue of water entering
the underbody battery compartment is partially captured by NHTSA recall
APB2 (2023 Taycan only, HV battery sealant) and folded into the editorial
of TAYCAN_27_001 via VIN-based recall verification. Community reports of
similar issues on 2020 cars exist but lack Tier B characterization.
Decline as a standalone record; defer broader pattern.

**Brake feel and regenerative braking integration.** No Tier B source
characterizes this as a bounded defect with a specific remedy. The actual
braking-system safety recall on this generation is the front brake hose
recall, captured under TAYCAN_27_002. Decline as a brake-feel record.

**Door handle electronic pop-out failures.** Forum reports exist (Tier C
only), with one TaycanForum post documenting a service campaign for
specific cars (cold-weather self-unlock behavior). No Tier B specialist
characterizes a bounded defect pattern. Decline; defer if Tier B
surfaces.

**Paint and exterior finish quality.** Generic complaints, no Tier B,
no production-cohort scoping. Decline.

**Suspension wear on PASM-equipped Taycans.** No Tier B source establishes
a Taycan-specific PASM defect pattern distinct from generic age-related
damper wear. Whether File 20's CHASSIS_20_003 (PASM dampers) record
extends its applicability to `taycan_j1` / `taycan_j1_fl` keys is not
confirmed by direct read of File 20 in this authoring pass; PROJECT_STATE.md
describes that record as covering the "997–992/718 era." Decline as a
standalone Taycan record. Deferred for File 20 review: confirm whether
CHASSIS_20_003 applicability includes Taycan keys and, if not, whether
the Tier B basis exists to extend it.

**Smaller / lower-impact NHTSA recalls** (declined as not warranting
standalone records in this file, but each is captured via the editorial
guidance to run a VIN check on NHTSA.gov):

- **APA2 (NHTSA 23V-186), seat belt warning chime software, 2020–2023
  Taycan.** US scope is 130 units (Puerto Rico only); the larger Canadian
  population is out of catalog scope. Decline as too small a US defect
  population.
- **APA5, brake pad warning indicator color, 2020–2022 Taycan.** Software
  fix; the recall corrects an FMVSS color-code noncompliance, not a
  brake-functionality issue. Low buyer impact. Decline.
- **ANA6, pre-collision hazard light activation, 2020–2021 Taycan.**
  Small population; software fix; low buyer impact. Decline.
- **ANB7, dashboard replacement, 2020–2022 Taycan.** Small population;
  decline.
- **ARB4, headlight control module software, 2024 Taycan.** Small
  population; software fix; decline.
- **APB2, HV battery sealant, 2023 Taycan.** Small population; folded
  into TAYCAN_27_001 editorial.
- **ASA2, occupant classification system, 2022–2023 Taycan, ~9,735
  units.** This is a meaningful safety recall (passenger airbag
  deactivation) but is not Taycan-architecture-specific (it's a seat
  cushion issue) and the buyer-side action — VIN check at NHTSA.gov —
  is captured generically by the editorial guidance in
  TAYCAN_27_001. Decline as standalone but worth flagging in any
  Taycan PPI.
- **ASA6, suspension strut retaining ring, 2025 Panamera E-Hybrid /
  Taycan / Panamera.** 2025-only; small Taycan population within the
  cross-marque scope; decline.

---

## Cross-references

- **HALO_26_005 (File 26)** — 918 Spyder HV battery is architecturally
  distinct (400V vs. 800V); see TAYCAN_27_001 editorial. No content
  duplication.
- **CHASSIS_20_003 (File 20)** — PASM dampers. **Applicability for
  Taycan generation keys is not confirmed by direct read of File 20**;
  PROJECT_STATE.md describes the record as covering the 997–992/718 era.
  Pending File 20 review (see Known State Issues in PROJECT_STATE.md).
  No Taycan-specific PASM record warranted in File 27 regardless of the
  outcome — Tier B does not establish a Taycan-distinct pattern.
- **File 14** — Title / mileage / accident history universal red flags
  apply to Taycan provenance verification.

---

## Sources (URLs)

- NHTSA Part 573 reports: https://www.nhtsa.gov/recalls (campaign-number
  search). Specific PDFs cited:
  - 24V-732 (ARB6/ARB7): https://static.nhtsa.gov/odi/rcl/2024/RCLRPT-24V732-8320.PDF
  - 24V-217 (ARA5): https://static.nhtsa.gov/odi/rcl/2024/RCLRPT-24V217-5008.PDF
  - 24V-455 (ARB0): https://static.nhtsa.gov/odi/rcl/2024/RCLRPT-24V455-9259.PDF
  - 23V-841 (APB6): https://static.nhtsa.gov/odi/rcl/2023/RCLRPT-23V841-5733.PDF
  - 25V-896 (ASB2): https://static.nhtsa.gov/odi/rcl/2025/RCLRPT-25V896-2258.pdf
  - 21V-486 (AMB5): https://static.nhtsa.gov/odi/rcl/2021/RMISC-21V486-1749.pdf
- StuttgartDNA — https://stuttgartdna.com/porsche-recalls-the-taycan-for-battery-short-circuit/
- StuttgartDNA — https://stuttgartdna.com/porsche-taycan-front-brake-hose-recall/
- Consumer Reports — https://www.consumerreports.org/cars/car-recalls-defects/porsche-taycan-recalled-battery-short-circuit-risks-fire-a6050249361/
- Consumer Reports — https://www.consumerreports.org/cars/car-recalls-defects/porsche-recalls-cars-and-suvs-to-fix-backup-cameras-a6173838196/
- Recharged — https://recharged.com/articles/porsche-taycan-recalls-list
- Recharged — https://recharged.com/articles/porsche-taycan-common-problems-and-fixes
- Recharged — https://recharged.com/articles/porsche-taycan-12v-battery-replacement
- Recharged — https://recharged.com/articles/2021-porsche-taycan-recalls-list
- Recharged — https://recharged.com/articles/2024-porsche-taycan-recalls-list
- Recharged — https://recharged.com/articles/2023-porsche-taycan-recalls-list
- Repasi Motorwerks — https://repasimotorwerks.com/services/porsche/porsche-taycan-service/newark-nj
- Repasi Motorwerks — https://repasimotorwerks.com/services/porsche/porsche-taycan-service/morristown-nj
- The Drive — https://www.thedrive.com/news/failed-porsche-taycan-heaters-are-leaving-some-owners-out-in-the-cold-this-winter
- Sibros — https://www.sibros.tech/post/the-recall-notice-porsche-taycan-recall-21v486
- Electrek — https://electrek.co/2021/07/02/porsche-issues-physical-recall-of-taycans-over-loss-of-power-issue/
- Electrek — https://electrek.co/2024/06/26/porsche-recall-over-31000-taycan-evs-faulty-brake/
- Champion Porsche — https://www.champion-porsche.com/battery-test-and-replacement
- Autoevolution — https://autoevolution.com/news/porsche-recalls-41345-electric-and-plug-in-hybrid-vehicles-due-to-fire-risk-226548.html
- Lemon Law Experts — https://lemonlawexperts.com/porsche-taycan-brake-recall/
- Cars.com Taycan recall index — https://www.cars.com/research/porsche-taycan/recalls/
- Cars.com 2023 Taycan recalls — https://www.cars.com/research/porsche-taycan-2023/recalls/
- Cars.com 2025 Taycan recalls — https://www.cars.com/research/porsche-taycan-2025/recalls/
- DealerRater Taycan recall tracker — https://www.dealerrater.com/recalls/Porsche/Taycan/
- KBB 2023 Taycan recalls — https://www.kbb.com/porsche/taycan/2023/recall/
- Porsche Excellence Magazine — All-Electric Taycan Tech (cited via The Drive) — https://www.excellence-mag.com/issues/269/articles/all-electric-taycan-tech
- PistonHeads — Heater failure Taycan thread (Tier B specialist forum) — https://www.pistonheads.com/gassing/topic.asp?h=0&f=275&t=2023550
- TaycanForum — Free HV Heater Replacement campaign letter reproduction (manufacturer document via specialist forum) — https://www.taycanforum.com/forum/threads/free-hv-heater-replacement-for-your-taycan-now-available-at-your-porsche-center.17545/
- TaycanForum — APB6 charging cable recall letter reproduction — https://www.taycanforum.com/forum/threads/recall-power-outlet-may-cause-charging-cable-to-overheat-20-24-apb6-december-13-2023.18185/
- The Brake Report — Porsche Recalls Taycans Over Brake Hose Issue — https://thebrakereport.com/porsche-recalls-taycans-over-brake-hose-issue/
- CarComplaints.com — 2020 Taycan electrical system complaints (consistency footnote) — https://m.carcomplaints.com/Porsche/Taycan/2020/electrical/electrical_system.shtml

*End of File 27 — Taycan*
