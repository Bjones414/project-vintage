# 11 — Electrical

**Scope:** Electrical defects across the Porsche range with sufficient Tier A or B grounding to assert prevalence, cost, and applicability with confidence. This file covers (a) Porsche-acknowledged extended-warranty actions on water-cooled-era sensors, (b) age-related LCD pixel failures on the 1999–2012 sport-car and Cayenne instrument-cluster fleet, (c) the 996/997/986/987 Bowden-cable window-regulator failure pattern, and (d) the sunroof / cowl drain-blockage water-intrusion mechanism that corrodes footwell wiring on Cayenne, Macan, and Panamera. Engine-electrical items (ignition coils, secondary air injection) belong to file 99 (shared water-cooled era) where they are already authored. Convertible-top motor and microswitch failures belong to file 07 (cabriolet). HVAC-control button stickiness and segment LCD failures on the centre-stack climate display belong to file 08 (interior sticky buttons). PCM head-unit and instrument-cluster failures on Panamera and 991+ generations are deferred to v2 alongside that of the 9YA Cayenne — published Tier-B failure-prevalence material on those generations is currently thin.

**Records in this file (4):**

1. `cayenne_macan_wheel_speed_sensor_warranty_extension` — Cayenne 92A (MY 2011–2018) and Macan 95B (MY 2014–2018) front and rear wheel-speed sensor failure (Porsche TSB 122/19 — 10-year unlimited-mileage extended warranty)
2. `water_cooled_sport_and_cayenne_instrument_cluster_centre_lcd_pixel_loss` — 996/997/986/987 sport-car and Cayenne 955/957 instrument-cluster centre LCD age-related pixel/segment failure
3. `water_cooled_911_boxster_cayman_window_regulator_bowden_cable` — 996/997/986/987 Bowden-cable window-regulator plastic-spool and cable failure
4. `cayenne_macan_panamera_sunroof_drain_water_intrusion_harness_corrosion` — sunroof and cowl drain blockage causing cabin water intrusion and footwell wiring-harness corrosion (Cayenne 955/957/958/9YA, Macan 95B, Panamera 970/971), with Porsche-settled class action covering MY 2014/2015–2023 sunroof-equipped applications

**Editorial constraints applied (mirroring files 09 and 10):**
- Cost and prevalence claims require a `_source_anchor` referring to a passage that actually carries the figure.
- Tier A: Porsche AG, PCNA, NHTSA-hosted PCNA TSBs, PCA editorial, court-approved class-action documents. Tier B: established specialists with named technical pages (Pelican Parts, Tanin Auto Electronix, German Audio Tech, UpFix, Suncoast Porsche Parts, Go-Parts, PCarwise, eEuroParts, Strutmasters, FCP Euro). Tier C: forum threads and named-individual community contributions — never sole source for cost or prevalence figures.
- Direct quotation capped at one per source, fewer than 15 words. Default to paraphrase. Watch for close paraphrase that mirrors source phrasing structurally — that is a violation even without quote marks.
- Numeric claims framed as ranges where sources disagree; never as point estimates the sources do not carry.
- Where a record's applicability spans cars of different model lines, the applicability axes (`generation`, `model_line`, `trim_category`, `body`) carry the scoping; the editorial framing carries the model-line-specific qualifiers.

---

## Record 1 — Cayenne 92A and Macan 95B wheel-speed sensor failure (Porsche TSB 122/19 extended warranty)

```yaml
id: cayenne_macan_wheel_speed_sensor_warranty_extension
flag_title: Cayenne 92A / Macan 95B wheel-speed sensors — Porsche TSB 122/19 extended warranty (10 years, unlimited mileage)

description: >
  The front and rear wheel-speed sensors fitted to the Cayenne 92A
  (MY 2011–2018) and Macan 95B (MY 2014–2018) are subject to an
  extended factory warranty action published by Porsche Cars North
  America in May 2020 as Technical Information bulletin 122/19. The
  bulletin extends warranty cover on PART ID 4511 (front speed
  sensor) and PART ID 4515 (rear speed sensor) to ten years from the
  new-vehicle delivery date with unlimited mileage. The extension
  applies in the USA, Canada, and Puerto Rico, and transfers
  automatically to subsequent owners.

  The extended warranty is Porsche's response to a documented failure
  mode in which moisture ingress through a crack in the sensor housing
  shorts the internal electronics, producing intermittent or persistent
  dashboard fault cascades. Because the Porsche Stability Management
  (PSM) module distributes wheel-speed data to multiple downstream
  control modules, a failing speed sensor typically presents as a
  multi-system fault rather than as an isolated ABS warning: the
  dashboard may light up with simultaneous warnings for ABS, PSM,
  parking brake, AWD, engine control, and transmission, and the
  vehicle may enter limp mode or refuse to engage drive. The repair
  itself is mechanically simple and inexpensive (a single plug-in
  sensor replaceable in roughly an hour of labour on each corner) but
  the cascade of warnings frequently leads to misdiagnosis and
  unnecessary parts replacement before the underlying cause is
  identified.

applicability:
  model_line:
    - cayenne_958
    - macan_95B
  generation:
    # File-10 specialist-canonical naming (cayenne_958 covers MY2011–2018
    # of the 92A chassis; the pre-facelift / facelift split is preserved
    # via specific_model_years and editorial framing rather than separate
    # generation entries). Reconciliation toward file-10 form per file
    # 11 review feedback.
    - cayenne_958
    - macan_95B
  engine_family:
    # Engine family is non-determinative for this record — the wheel-
    # speed sensor is shared across all Cayenne 92A and Macan 95B
    # engine variants. The record applies regardless of powertrain.
    - cayenne_v8_4_8_NA_or_TT
    - cayenne_v6_3_6_NA
    - cayenne_v6_3_0_diesel
    - cayenne_v8_4_2_diesel  # Audi-sourced 4.2L V8 TDI (Cayenne S Diesel); file 11 review fix
    - cayenne_hybrid
    - macan_v6_3_0_TT       # Macan 95B never had a NA V6; all Macan 95B gasoline V6 variants are turbocharged. File 11 review fix.
    - macan_v6_3_6_TT
    - macan_i4_2_0_TT       # Macan 2.0L is an inline-4 (EA888); naming convention corrected from V4 prefix per file 11 review.
    # macan_i4_2_0_diesel removed: the 2.0L diesel Macan was announced
    # for MY2017 but was never put into production in any market. File
    # 11 review fix.
  body:
    - SUV
  trim_category:
    # Cayenne 92A
    - cayenne_base
    - cayenne_S
    - cayenne_S_diesel
    - cayenne_S_hybrid
    - cayenne_GTS
    - cayenne_turbo
    - cayenne_turbo_S
    # Macan 95B
    - macan_base
    - macan_S
    - macan_S_diesel
    - macan_GTS
    - macan_turbo
  year_range: [2011, 2018]
  specific_model_years:
    cayenne_958: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
    macan_95B: [2014, 2015, 2016, 2017, 2018]
    # Note on Macan MY2014: TSB 122/19 (Macan 95B model line, NHTSA
    # PDF reference [2]) literally states "Model Year: As of 2014 up
    # to 2018" with country/market scoped to USA, Canada, and Puerto
    # Rico. US-market Macan retail launch was as MY2015 (April 2014),
    # so MY2014 cars in the eligible markets are uncommon (predominantly
    # Canadian-market early-production cars or grey-market imports).
    # The catalogue preserves the TSB's literal scope rather than
    # narrowing to MY2015–2018 — the bulletin governs eligibility, and
    # any 2014 Macan presented in the eligible markets is in scope of
    # the warranty extension per the bulletin's text.
  market:
    # Porsche TSB 122/19 explicitly limits the extended warranty to
    # USA, Canada, and Puerto Rico. Owners outside these markets
    # experience the same failure mode but cannot claim under this
    # warranty extension.
    extended_warranty_eligible_markets: [USA, Canada, Puerto_Rico]
  excludes:
    description: >
      Cayenne 9YA (third-generation, 2019+) and Macan 95B Phase 2
      (the 2019+ refresh) are out of scope of TSB 122/19. The bulletin
      is explicit on the model-year boundaries (Cayenne up to 2018,
      Macan up to 2018). Pre-2011 Cayennes (955 and 957 generations)
      use a different sensor part number and architecture and are
      similarly not in scope of this bulletin.
    generation: [cayenne_955, cayenne_957, cayenne_9Y0, macan_95B]

severity: moderate
  # Repair cost itself is low (single sensor part typically $30–$400
  # depending on OEM vs aftermarket; one to two hours labour). The
  # severity ranking reflects the cascade-of-faults presentation: a
  # failed sensor on a 2011–2018 Cayenne or 2014–2018 Macan can
  # disable AWD, PSM, ABS, and transmission control simultaneously,
  # and the misdiagnosis tax (chasing apparently unrelated codes
  # before identifying the sensor as the root cause) frequently
  # exceeds the actual repair cost. Within the warranty window, the
  # part and labour are at Porsche's expense; outside it, owner-
  # reported figures are consistent with $200–$800 per corner at
  # independent specialists.

cost_range_usd:
  in_warranty_period_eligible_markets:
    qualitative: covered_by_porsche_tsb_122_19
    _source_anchor: >
      Porsche TSB 122/19 (NHTSA-mirrored at static.nhtsa.gov, May 27,
      2020) states that the extended warranty on PART ID 4511 (front)
      and PART ID 4515 (rear) lasts ten years from new-vehicle
      delivery date with unlimited mileage. Within that window, parts
      and labour for the listed components are covered at no cost to
      the owner at an authorised Porsche dealer in the USA, Canada,
      or Puerto Rico. Reimbursement for prior owner-paid repairs is
      handled through the dedicated claims website
      WheelSpeedSensorWarrantyExtension.com (referenced in 6SpeedOnline
      and Rennlist owner letters from the warranty mailing).
  out_of_warranty_independent_specialist_per_corner:
    low: 150
    high: 600
    _source_anchor: >
      Owner-reported figures across Rennlist Cayenne 958 forum and
      Planet-9 capture sensor part costs from approximately $30
      (aftermarket) to approximately $400 (Porsche OEM) per corner,
      with installation labour at independent specialists at
      approximately one to two hours. The $150–$600 band brackets
      sensor-only replacement at independent rates outside the
      warranty window. The figure scales linearly when multiple
      corners require replacement.
  out_of_warranty_dealer_per_corner:
    low: 400
    high: 900
    _source_anchor: >
      Owner-reported dealer figures on Rennlist 958 forum capture
      single-corner sensor replacement at PCNA dealer hourly rates
      with OEM parts at approximately $400–$900. The figure is
      relevant primarily to owners outside the eligible markets (USA,
      Canada, Puerto Rico) or after the ten-year window expires; in-
      warranty US/Canada/Puerto Rico owners pay $0.

prevalence_rate:
  qualitative: common_to_near_universal_for_92a_warranty_population
  _source_anchor: >
    Tier-A signal: Porsche issued TSB 122/19 covering the Cayenne 92A
    (2011–2018) and Macan 95B (2014–2018) fleets — the issuance of a
    ten-year unlimited-mileage warranty extension is itself evidence
    of a failure rate Porsche assessed as high enough to warrant
    voluntary post-warranty cover, parallel in shape to the Cayenne
    transfer-gear extension (file 09 record 4). The catalogue does
    not have a Tier-B specialist source quantifying or framing this
    defect — the prevalence claim rests on the Tier-A bulletin
    itself. Tier-C consistency on Planet-9, Rennlist 958 forum, and
    Macan Forum captures the failure-mechanism description (housing
    crack admits moisture and shorts internal electronics) and
    documents the warranty mailing being received by a wide swath of
    owners; threads describe multiple-sensor replacement as routine.
    Numeric prevalence rate not asserted (Porsche has not published a
    defect-rate figure); the qualitative framing is anchored in the
    warranty extension itself plus consistent owner reporting.

failure_correlation:
  - moisture (the documented mechanism is housing crack admitting water that shorts internal electronics)
  - age (the warranty extension's ten-year framing implies failures are concentrated in years 4–10 of vehicle life)
  - climate (humid and salt-belt regions experience earlier and more frequent failures, consistent with a moisture-driven mechanism; sources do not break out a regional-amplification figure)

retrofit_available: yes
retrofit_kit_names:
  - "Porsche OEM replacement wheel-speed sensor (PART ID 4511 front, PART ID 4515 rear) — the warranty extension uses these factory parts; aftermarket equivalents available from Bosch, FAE, AutohausAZ"

regional_amplification:
  salt_belt: moderate
  coastal_humid: moderate
  # Source-supported only qualitatively: the moisture-driven failure
  # mechanism implies amplification in salt-belt and humid coastal
  # regions, but no Tier-A or Tier-B source breaks out a per-region
  # figure. The Rennlist DIY thread (Tier C, used as consistency
  # signal only) describes corroded sensor housings on a salt-belt
  # 958. Cold-climate and desert-southwest amplification not
  # source-discussed and intentionally omitted.

keywords:
  addressed:
    - "wheel speed sensor replaced under TSB 122-19"
    - "wheel speed sensor warranty claim"
    - "TSB 122/19 sensors replaced"
    - "all four speed sensors replaced"
    - "ABS sensor replacement under extended warranty"
    - "speed sensor claim reimbursed"
  concerning:
    - "intermittent ABS warning"
    - "PSM warning"
    - "AWD fault"
    - "all dash warnings"
    - "PSM error value improbable"
    - "wheel speed sensor fault"
    - "intermittent traction control warning"
    - "limp mode at low speed"
    - "P0500 wheel speed"
  active_problem:
    - "all dash warnings on"
    - "ABS PSM AWD all faulted"
    - "car will not engage drive"
    - "limp mode at speed"
    - "wheel speed sensor failed"
    - "P0500 fault"
    - "P2162 vehicle speed sensor"
  documented:
    - "Porsche TSB 122-19 invoice"
    - "extended warranty claim approved"
    - "PCNA reimbursement approved"
    - "WheelSpeedSensorWarrantyExtension claim filed"

evidence_basis:
  tier_a:
    - name: "Porsche Cars North America, Inc. — Technical Information Service Bulletin 122/19 (Cayenne 92A model line, MY 2011–2018) — NHTSA-mirrored, directly retrieved"
      tier: A
      url_or_reference: "static.nhtsa.gov/odi/tsbs/2020/MC-10175910-0001.pdf"
      retrieval_status: retrieved
    - name: "Porsche Cars North America, Inc. — Technical Information Service Bulletin 122/19 (Macan 95B model line, MY 2014–2018) — NHTSA-mirrored, directly retrieved"
      tier: A
      url_or_reference: "static.nhtsa.gov/odi/tsbs/2020/MC-10175911-0001.pdf"
      retrieval_status: retrieved
  tier_b:
    # Per the locked tier convention, forum threads are Tier C
    # regardless of how specialist-quality the analysis is in a
    # single post. Planet-9 thread previously listed here (specialist-
    # framing of failure mechanism) demoted to tier_c per file 11
    # review feedback. The remaining tier_b entry (AutohausAZ) is a
    # parts vendor's catalogue page with OEM-equivalent fitment notes.
    # The Tier-A bulletin carries the prevalence claim adequately on
    # its own — the issuance of a ten-year unlimited-mileage warranty
    # extension is itself the strongest available evidence of failure
    # prevalence on this fleet.
    - name: "AutohausAZ — Porsche Cayenne ABS Wheel Speed Sensor catalogue page (parts vendor with replacement-pricing reference)"
      tier: B
      url_or_reference: "autohausaz.com/porsche-auto-parts/porsche-cayenne-abs_wheel_speed_sensor-replacement.html"
  tier_c:
    - name: "Planet-9 Porsche Forum — 958.1 2011 Wheel Speed ABS Sensors thread (failure-mechanism description from a knowledgeable forum contributor: housing crack admits moisture, shorts internal electronics, framed as common point of failure on the Cayenne 958 generation)"
      tier: C
      url_or_reference: "planet-9.com/threads/958-1-2011-wheel-speed-abs-sensors.250428/"
    - name: "Rennlist Cayenne 958 forum — MY2011-2018 Porsche Cayenne Wheel Speed Sensors Warranty Extension thread (owner letters, reimbursement-claim case captures)"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-958-2011-2018/1221234-my2011-2018-porsche-cayenne-wheel-speed-sensors-warranty-extension-2.html"
    - name: "6SpeedOnline Cayenne 958 forum — Cayenne Wheel Speed Sensor Warranty Extension thread (warranty letter, claims website URL: WheelSpeedSensorWarrantyExtension.com, access code SENSOR)"
      tier: C
      url_or_reference: "6speedonline.com/forums/cayenne-958/442086-cayenne-wheel-speed-sensor-warranty-extension.html"
    - name: "Macan Forum — Just received MY2014-2018 Macan wheel speed sensor warranty extension thread (consistent reports across Macan ownership)"
      tier: C
      url_or_reference: "macanforum.com/threads/just-received-my2014-2018-macan-wheel-speed-sensor-warranty-extension.177470/"
    - name: "Planet-9 Porsche Forum — So this happened thread (cascade-of-faults presentation case capture: ABS / PSM / parking brake / AWD / engine-control / transmission warnings simultaneously, traced to wheel-speed sensor)"
      tier: C
      url_or_reference: "planet-9.com/threads/so-this-happened.253989/"

editorial_note: >
  This is the most clear-cut Porsche-acknowledged electrical defect
  on the Cayenne 92A (2011–2018) and Macan 95B (2014–2018). The
  ten-year unlimited-mileage extended warranty on US, Canadian, and
  Puerto Rican cars is transferable to subsequent owners and remains
  in force regardless of who paid for prior repairs (Porsche
  reimburses retroactively). The pre-purchase question is therefore
  whether the seller has filed a claim, whether the sensors have
  already been replaced under the extension, and how many years of
  the ten-year window remain at the in-service date. On a 2014
  Cayenne the warranty expires in 2024; on a 2018 Cayenne it expires
  in 2028. After expiry, repair is at the owner's expense; the
  failure itself remains common.

  The diagnostic complication on this record is not the sensor
  failure but the cascade-of-faults presentation. A buyer evaluating
  a 2011–2018 Cayenne or 2014–2018 Macan with a recent history of
  multiple simultaneous warning messages — particularly ABS, PSM,
  AWD, parking brake, and limp-mode events that resolved on a
  restart — should treat the wheel-speed sensors as the first
  suspect rather than the more visible warnings. Many of those
  cars have already had the work done under TSB 122/19; verify the
  invoice rather than assuming the seller's description of "minor
  electrical issues, all resolved" implies the sensors specifically.

  This record sits inside the Cayenne 92A pre-purchase constellation
  alongside file 09 record 4 (transfer-gear extended warranty) and
  file 10 record 2 (air suspension on equipped cars). All three
  Porsche-acknowledged or specialist-documented Cayenne 92A risks
  cluster on the same MY 2011–2018 cohort and should be addressed
  together. Buyers of 2015–2018 Cayennes with sunroofs additionally
  inherit Record 4's class-action-settled drain-water-intrusion risk;
  the constellation broadens to four pre-purchase questions on those
  cars.

buyer_questions:
  - For 2011–2018 Cayenne and 2014–2018 Macan owners in the USA, Canada, or Puerto Rico — has TSB 122/19 been filed against this car? If so, which sensors were replaced and at what mileage?
  - Has the car ever shown simultaneous ABS, PSM, AWD, parking-brake, or transmission warnings, even briefly? At what mileage and were they diagnosed?
  - Is the in-service date and original-delivery date documented? (This is needed to compute the remaining warranty window.)
  - Does the seller have the original Porsche letter from PCNA notifying of the warranty extension? (Mailed to original owners around 2020–2021.)
  - For cars outside the eligible markets (Europe, UK, Asia, Australia) — has any speed-sensor work been done at owner expense? Are the sensors original?
```


---

## Record 2 — 996/997/987 sport-car and Cayenne 955/957 instrument-cluster centre LCD pixel loss

```yaml
id: water_cooled_sport_and_cayenne_instrument_cluster_centre_lcd_pixel_loss
flag_title: 996/997/987 + Cayenne 955/957 instrument cluster — centre LCD pixel loss, fade, and segment failure

description: >
  The instrument cluster fitted to the 996 (1999–2005), 997 (2005–2012),
  987 Boxster and Cayman (2005–2012), and Cayenne 955/957 (2003–2010)
  carries a centre LCD module behind the analogue speedometer face that
  displays the digital odometer, trip computer, on-board-computer
  readouts, gear-position indicator on Tiptronic and PDK cars, and
  driver warnings. The module is built on Continental/VDO-supplied
  passive LCD technology of the era and develops three age-related
  failure modes: individual pixel and segment loss (rendering portions
  of digits unreadable), creeping black-bar or "spider-web" pattern
  bleeding across the display surface, and progressive fade or
  delamination of the polariser layer. Failures accumulate with sun
  exposure, dashboard temperature cycling, and cumulative time-on
  rather than vehicle mileage; cars that lived their lives in
  garage-kept low-mileage duty are not exempt.

  The remedy market is well-developed: a cluster of US specialist
  repair vendors (Tanin Auto Electronix, German Audio Tech, UpFix,
  Best Cluster Repair, Speedo Solutions) operate mail-in LCD-swap
  services in the $300–$500 range with lifetime warranties on the
  replacement screen, performing the work without disturbing the
  cluster's stored mileage. The economic alternative — OEM cluster
  replacement at a Porsche dealer — is materially more expensive
  (approximately $3,000 list for a new 911 cluster and approximately
  $850 for a Cayenne cluster, both excluding labour and recoding) and
  introduces an additional complication: a used cluster that has
  accumulated more than approximately 500 miles has the donor car's
  odometer reading burned into non-volatile memory, rendering it
  unsuitable for swap into a different VIN without specialist
  reprogramming. The mail-in LCD-swap path is therefore the
  specialist-recommended remedy in most cases.

applicability:
  generation:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 987.1   # Boxster 2005–2008, Cayman 2006–2008 (the first Cayman launched MY2006; correction per file 11 review)
    - 987.2   # Boxster and Cayman, 2009–2012
    - cayenne_955  # 2003–2007
    - cayenne_957  # 2008–2010
  engine_family:
    # The cluster is a body/chassis-side electrical component shared
    # across all engine families on each generation. Listed here to
    # make matcher routing exhaustive across the in-scope generations.
    - M96
    - M97
    - Mezger
    - 9A1
    - cayenne_v8_4_5_NA_or_TT
    - cayenne_v8_4_8_NA_or_TT
    - cayenne_v6_3_2_NA
    - cayenne_v6_3_6_NA
    - cayenne_v6_3_0_diesel
    # cayenne_hybrid removed: no production Cayenne hybrid in the 955
    # or 957 generations. The Cayenne S Hybrid was developed during the
    # 957 cycle but production was deferred to the 958 (Cayenne S
    # Hybrid launched as MY2011 on the 92A platform). File 11 review
    # fix.
  body:
    - Coupe
    - Cabriolet
    - Targa
    - Roadster
    - SUV
  trim_category:
    # 996/997/987 sport-car platforms — all trims
    - Carrera
    - Carrera_4
    - Carrera_S
    - Carrera_4S
    - Carrera_GTS
    - Targa
    - Turbo
    - Turbo_S
    - GT3
    - GT3_RS
    - GT3_RS_4_0
    - GT2
    - GT2_RS
    - Cayman
    - Cayman_S
    - Cayman_R
    - Cayman_GT4
    - Boxster
    - Boxster_S
    - Boxster_Spyder
    # Cayenne 955/957 trims
    - cayenne_base
    - cayenne_S
    - cayenne_GTS
    - cayenne_turbo
    - cayenne_turbo_S
    - cayenne_S_diesel
  year_range: [1999, 2012]
  excludes:
    description: >
      The 986 Boxster (1997–2004) is intentionally not listed. Its
      cluster is a different generation of LCD architecture and the
      specialist-repair market for the 986 cluster is materially
      thinner than for the 996/997/987 cluster — UpFix, Tanin Auto
      Electronix, and German Audio Tech do not list a 986-specific
      product line in the same way they list 996, 997, 987, and 957
      products. Failures on the 986 cluster are real but below the
      v1 evidence bar of this record. A v2 expansion may add the 986
      once specialist documentation strengthens.
    generation: [986]

severity: moderate
  # Specialist mail-in LCD-swap repair at $300–$500 places the
  # repair-cost path in the low band on its own. The severity ranking
  # is moderate because (a) the cluster is legally and practically
  # required for road use (odometer, speedometer, warnings), so a
  # severely-failed cluster is not a deferrable cosmetic issue, and
  # (b) the OEM-replacement path approaches $3,000 plus dealer labour
  # and recoding on the 911 platform, which sits at the boundary of
  # the moderate band. On Cayenne 955/957 the OEM-replacement path is
  # lower ($849 list per UpFix benchmark) but still meaningful.

cost_range_usd:
  specialist_mail_in_lcd_swap_repair:
    low: 250
    high: 600
    _source_anchor: >
      UpFix product listings document Porsche 996 (1999–2004), 997
      (2005–2012), 987 Boxster, and 987C Cayman instrument cluster
      panel repair at a sale price of $399.99 (regular $899.99,
      MSRP $1,200). Cayenne 957 (2002–2010) is listed at $299.99
      sale / $399.99 regular / $849 MSRP. Tanin Auto Electronix
      lists 2005–2012 Porsche 997 and 987 cluster centre-screen
      repair as a similarly-priced mail-in service with lifetime
      warranty on the replacement LCD. German Audio Tech and Best
      Cluster Repair list the same service in the same price band.
      The $250–$600 range brackets specialist mail-in LCD-swap
      pricing across the US specialist market, with Cayenne 955/957
      at the lower end of the band and 911 / Boxster / Cayman at
      the upper end.
  oem_porsche_911_boxster_cayman_replacement_cluster_dealer:
    low: 2500
    high: 3500
    qualitative: owner_reported_no_tier_b_anchor_available
    _source_anchor: >
      6SpeedOnline 997 forum capture (Tier C) documents a 997.1
      owner quoted approximately $3,000 USD list price for a new OEM
      instrument cluster on the 997 platform, with the operator
      noting that used clusters are limited by the odometer burn-in
      after approximately 500 miles. The catalogue does not have a
      Tier-B specialist source publishing OEM cluster MSRP for the
      996 / 997 / 987 sport-car platforms. Per the locked principle
      against Tier-C-only cost anchoring, the $2,500–$3,500 band is
      presented as owner-reported and qualified accordingly. The
      figure brackets owner-reported OEM-replacement pricing on
      996/997/987 sport-car applications across US dealers; labour
      and PIWIS recoding additional; a buyer should treat the band
      as indicative.
  oem_cayenne_955_957_replacement_cluster_dealer:
    low: 700
    high: 1200
    _source_anchor: >
      UpFix product listing for the Cayenne 957 (2002–2010)
      instrument cluster panel publishes an MSRP of $849 alongside
      its repair pricing. UpFix is a Tier-B specialist with named
      pricing data for the part across multiple Porsche platforms
      and is the primary anchor for this band. The $700–$1,200 band
      brackets OEM-replacement pricing on the Cayenne 955/957
      platform across US dealers around UpFix's $849 MSRP figure;
      labour and PIWIS recoding additional. The Cayenne cluster is
      materially cheaper than the sport-car cluster largely
      because the Cayenne uses a smaller centre LCD module with
      less elaborate ancillary hardware.

prevalence_rate:
  qualitative: common_to_near_universal_with_age_and_sun_exposure
  _source_anchor: >
    Tier-B specialist consensus: the existence of multiple US
    specialist mail-in repair vendors (Tanin Auto Electronix,
    German Audio Tech, UpFix, Best Cluster Repair, Speedo
    Solutions) operating dedicated 996/997/987/Cayenne 957 cluster
    repair product lines with lifetime warranties is itself a
    signal of common failure — a niche specialist business model
    is not viable on a rare defect. German Audio Tech's product
    page describes more than ten years of experience and
    "hundreds" of repaired clusters; UpFix lists Porsche cluster
    repair as a recurring product line across 996, 997, 987, and
    Cayenne 957 applications. The PistonHeads UK and 911UK forum
    threads on dead pixels in 997.1 clusters describe the failure
    as recognised across the ownership community. Tier-C
    consistency on 6SpeedOnline 997 forum and Planet-9 captures
    multiple-thread-volume confirmation. Numeric prevalence rate
    not asserted (no published owner-survey data on this defect);
    the qualitative framing is anchored in the sustained
    specialist-market presence and consistent age-correlated
    presentation.

failure_correlation:
  - age (failures concentrate in years 8+ of vehicle life regardless of mileage)
  - sun and heat exposure (cars parked outside or in hot climates fail earlier; cars garage-kept fail later but not exempt)
  - thermal cycling (the dashboard environment subjects the LCD to wide temperature ranges that progressively degrade the polariser and adhesive layers)

retrofit_available: yes
retrofit_kit_names:
  - "Tanin Auto Electronix replacement LCD (specialist supplier; lifetime guarantee on replacement screen)"
  - "German Audio Tech LCD replacement service (mail-in repair; specific to PCM 2.1 navigation and 996/997/987 instrument cluster; brand-new replacement screens)"
  - "UpFix instrument cluster panel repair (multi-platform mail-in)"
  - "Best Cluster Repair pixel-repair service (multi-platform mail-in)"
  - "Speedo Solutions cluster centre-LCD replacement service"

regional_amplification:
  desert_southwest: high
  coastal_humid: moderate
  # Source-supported qualitatively: dashboard temperature in desert-
  # southwest climates accelerates LCD polariser degradation; humid
  # coastal climates contribute moisture-related polariser
  # delamination. Specialist sources frame the failure as sun-and-
  # heat driven (Tanin Auto Electronix product description). Salt-
  # belt and cold-climate amplification not source-discussed and
  # intentionally omitted.

keywords:
  addressed:
    - "instrument cluster LCD replaced"
    - "cluster pixel repair done"
    - "Tanin Electronix cluster repair"
    - "UpFix cluster repaired"
    - "German Audio Tech cluster"
    - "centre display repaired"
    - "dashboard LCD swapped"
    - "OE cluster fitted, original recoded"
    - "Porsche replacement cluster"
  concerning:
    - "dead pixels on cluster"
    - "missing pixels speedometer"
    - "fading dashboard display"
    - "centre display dim"
    - "lines through odometer"
    - "spider web on display"
    - "cracked dashboard display"
    - "LCD bleeding"
    - "discolouration on dash display"
  active_problem:
    - "cannot read odometer"
    - "centre display blank"
    - "trip computer not displaying"
    - "gear indicator black"
    - "PRND display dead"
    - "dash display unreadable"
  documented:
    - "Tanin Electronix invoice"
    - "UpFix repair receipt"
    - "specialist cluster repair invoice"
    - "lifetime warranty LCD"

evidence_basis:
  tier_a: []
    # No Porsche AG TSB or warranty-extension action covers this
    # defect. The cluster is treated by Porsche as a wear part
    # outside warranty extensions; remedy is at owner expense via
    # specialist or dealer paths.
  tier_b:
    - name: "Tanin Auto Electronix — 2005-2012 Porsche 997 & 987 Instrument Cluster Repair Service (specialist mail-in repair, lifetime warranty on replacement Tanin Electronix LCD)"
      tier: B
      url_or_reference: "taninautoelectronix.com/product/2005-2012-porsche-911-997-cayman-987-gauge-cluster-screen-repair/"
    - name: "UpFix — Porsche Instrument Cluster Repair product range (996 1999–2004, 997 2005–2012, 987 Boxster 2005–2012, 987C Cayman 2006–2012, Cayenne 957 2002–2010 — Tier-B benchmark for cross-platform repair pricing and MSRP)"
      tier: B
      url_or_reference: "upfix.com/product-category/repair-return/icp-instrument-cluster-repair/porsche-icp-instrument-cluster-repair/"
    - name: "German Audio Tech — Pixel Odometer Display Repair Service for Porsche 997 987 911 Boxster Carrera 4S Turbo Instrument Speedometer Cluster LCD (specialist mail-in repair; product description discusses ten-plus years experience and odometer-burn-in constraint on used cluster swap)"
      tier: B
      url_or_reference: "germanaudiotech.com/products/pixel-odometer-display-repair-service-for-porsche-997-987-911-boxster-carrera-4s-turbo-instrument-speedometer-cluster-lcd"
    - name: "Best Cluster Repair — Porsche 911 (997) Boxster (987) Instrument Cluster LCD Display Pixel Repair Service (specialist mail-in repair)"
      tier: B
      url_or_reference: "bestclusterrepair.com/product/porsche-911-997-boxter-987-instrument-cluster-lcd-display-pixel-repair-service/"
    - name: "Speedo Solutions — Porsche 911 / Boxster / Cayman (987 / 997) Instrument Cluster Repair Service (specialist mail-in repair, centre LCD driver-info-display replacement)"
      tier: B
      url_or_reference: "speedosolutions.com/Porsche-911-Boxster-Cayman-987-997-Instrument-Cluster-Repair-Service--Center-LCD-Driver-Info-Display-Replacement_p_221.html"
  tier_c:
    - name: "6SpeedOnline 997 forum — Instrument Cluster display problem thread (owner case capture: 997.1 cluster pixel-loss progression and OEM-replacement $3,000 figure; used-cluster odometer-burn-in constraint described)"
      tier: C
      url_or_reference: "6speedonline.com/forums/997/342249-instrument-cluster-display-problem.html"
    - name: "911UK Forum — Dead Pixels on Instrument Cluster threads (consistent owner-side reports of pixel loss across 997 ownership)"
      tier: C
      url_or_reference: "911uk.com/porsche/dead-pixels-on-instrument-cluster-992-1-c2s.133568/"

editorial_note: >
  This is a routine pre-purchase question on a 996/997/987 or
  Cayenne 955/957. The defect is visible at inspection: a buyer
  starting the car and viewing the cluster from the driver's seat
  can directly observe whether the centre LCD is intact, fading,
  pixel-dropping, or showing the characteristic creeping bar
  pattern. A car presented for sale with a clear, fully-readable
  cluster on a 15-plus-year-old chassis has either had the LCD
  swapped (specialist repair) or has been unusually well preserved;
  asking which is part of the standard pre-purchase question set.

  The repair economics are tractable: the specialist mail-in LCD-
  swap path is materially cheaper than dealer cluster replacement,
  preserves the original-mileage burn-in, and carries lifetime
  warranties at established vendors. A buyer who detects pixel loss
  on inspection can budget $300–$500 plus shipping for the repair
  and treat the issue as a minor service item rather than a deal-
  breaker. The OEM-replacement path is reserved for cases where the
  cluster has suffered electrical damage beyond LCD-only failure or
  where a dealer is performing the work as part of a broader
  service event.

  No Porsche AG warranty extension or recall covers this defect.
  Porsche treats the cluster as a wear item, and the remedy market
  has filled in around independent specialists.

buyer_questions:
  - Are all segments of the centre display readable at startup, including the odometer digits, trip computer readouts, gear-position indicator, and warning text?
  - Has the cluster ever been replaced or repaired? If so, by which vendor (specialist mail-in repair vs OEM dealer replacement) and at what mileage?
  - If the cluster was OEM-replaced, was the original mileage recoded into the new cluster via PIWIS at delivery? (Lack of recoding leaves the displayed mileage at the new-cluster value.)
  - For cars stored outside or in hot/sunny climates — when was the cluster last inspected for pixel loss? (The failure mode is heat- and sun-driven and may have begun without the seller noticing.)
```


---

## Record 3 — 996/997/986/987 Bowden-cable window-regulator plastic-spool and cable failure

```yaml
id: water_cooled_911_boxster_cayman_window_regulator_bowden_cable
flag_title: 996/997/986/987 window regulator — Bowden-cable plastic-spool failure (door windows; cabriolet rear quarter windows)

description: >
  Beginning with the 986 Boxster (1997) and the 996 (1999), Porsche
  moved away from the older scissors-style metal window regulator and
  fitted a Bowden-cable design in which a small electric motor turns
  a plastic drum that pulls flexible cables through plastic spools at
  the top and bottom of the door, raising and lowering the glass via
  a slider on a single guide rail. The architecture is shared
  unchanged in its essentials across the 996, 997, 986, and 987
  platforms. The failure mode is well-recognised and predictable: the
  plastic spools at the top of the door fracture, or one of the
  Bowden cables fatigues and either snaps or stretches enough that
  the glass no longer seals against the convertible-top or hard-top
  rubber seal at full close. On the 996 and 997 cabriolet, an
  additional rear-quarter-window regulator carries the same
  architecture and the same failure mode.

  Pelican Parts' canonical 996/997 window-regulator how-to article
  describes the regulator as a routine wear item rather than a fault.
  Pelican-thread commentary further captures a recurrence pattern not
  seen on earlier scissors-style regulators: a single car may need
  multiple regulator replacements through its service life rather
  than the once-per-life cadence the older design typically required.
  PCGB Forum owner experience reports driver-side and passenger-side
  regulator failures typically arrive in close succession on the same
  car, often within months of each other, suggesting that age and
  accumulated cycle count drive failure on both sides similarly.
  Replacement is mechanically accessible: the door panel comes off
  in approximately twenty minutes, the regulator unbolts, and the
  job sits in the one-to-three-hour DIY range with the additional
  caveat that the door-panel plastic clips are not designed to be
  undone and should be replaced (typically a separate small parts
  purchase) when the panel goes back together.

applicability:
  generation:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 986.1   # Boxster, 1997–2002
    - 986.2   # Boxster, 2003–2004
    - 987.1   # Boxster and Cayman, 2005–2008
    - 987.2   # Boxster and Cayman, 2009–2012
  engine_family:
    # Window regulator is body/chassis-side, engine-agnostic. Listed
    # for matcher exhaustiveness across in-scope generations.
    - M96
    - M97
    - Mezger
    - 9A1
  body:
    - Coupe
    - Cabriolet
    - Targa
    - Roadster
  trim_category:
    - Carrera
    - Carrera_4
    - Carrera_S
    - Carrera_4S
    - Carrera_GTS
    - Targa
    - Turbo
    - Turbo_S
    - GT3
    - GT3_RS
    - GT3_RS_4_0
    - GT2
    - GT2_RS
    - Cayman
    - Cayman_S
    - Cayman_R
    - Cayman_GT4
    - Boxster
    - Boxster_S
    - Boxster_Spyder
  year_range: [1997, 2012]
  excludes:
    description: >
      The 991 / 992 generation 911 (2012+) and 981 / 718 generation
      Boxster and Cayman (2013+) moved to a different regulator
      architecture controlled through a body-side electronics module
      and are out of scope of this v1 record. The aftermarket
      regulator catalogue reflects the architectural split: vendors
      who sell 996/997/986/987 regulators (Pelican Parts, Suncoast
      Porsche Parts, Design 911, FCP Euro) carry distinct part
      numbers and product pages for the 991+ / 981+ platforms. A v2
      extension may add the 991/981 once specialist failure-
      prevalence documentation strengthens.
    generation: [991.1, 991.2, 992.1, 992.2, 981, 718]

severity: low
  # Single-side regulator replacement at independent rates is
  # generally under $1,000 (parts $80–$300, labour 1–3 hours at
  # specialist rates). DIY at home is one to three hours of labour
  # for a competent owner. The severity ranking is low at the per-
  # side level. Bilateral failure (driver and passenger side within
  # a common timeframe) pushes the practical cost into the lower end
  # of the moderate band but each side remains an independent low-
  # severity event from the matcher's perspective.

cost_range_usd:
  diy_oem_parts_per_side:
    low: 200
    high: 400
    _source_anchor: >
      Suncoast Porsche Parts catalogue lists the 986 / 996 OEM
      driver's-door window regulator (motor not included) as a
      standalone OEM part fitting Boxster 1997–04.5 and Carrera
      1999–04.5. Rennlist 997-forum capture documents owner-purchased
      regulator parts at approximately $250 per side. The $200–$400
      band reflects OEM regulator-part cost across 996/997/986/987
      applications at common-fitment specialist parts vendors;
      motor-included assemblies sit at the upper end.
  diy_aftermarket_parts_per_side:
    low: 60
    high: 150
    _source_anchor: >
      PCGB Forum capture documents Design 911 aftermarket regulator
      pricing at approximately one-third of OEM cost on the 987.2
      Boxster, with owner-reported successful fitments at multiple
      mileage points. Pelican Parts threads document URO-Parts and
      generic aftermarket pricing in the same band. The $60–$150
      band brackets aftermarket regulator-part cost; quality varies
      and PCGB owner experience suggests "tested-replacement" parts
      have outperformed "repair-kit" parts for cables and springs.
  independent_specialist_per_side_parts_and_labour:
    low: 400
    high: 950
    qualitative: owner_reported_no_tier_b_anchor_available
    _source_anchor: >
      Planet-9 Cayman owner capture (Tier C) documents an independent
      Porsche specialist quote of approximately $915 for driver-side
      window-regulator replacement labour and parts; the same owner
      reports a prior passenger-side replacement at approximately
      $600. The catalogue does not have a Tier-B specialist source
      publishing single-side independent-specialist labour rates for
      this defect specifically — the locked principle bars Tier-C-only
      cost anchoring as a primary figure, so the band is presented
      here as owner-reported with explicit qualification rather than
      asserted as a primary cost figure. The $400–$950 band brackets
      Tier-C-aggregate-reported independent-specialist pricing for
      single-side window-regulator replacement on 996/997/986/987
      across US markets; a buyer using this band for budgeting should
      treat it as indicative rather than authoritative.
  dealer_per_side_parts_and_labour:
    low: 800
    high: 1500
    qualitative: aggregator_and_owner_reported_no_tier_b_anchor_available
    _source_anchor: >
      RepairPal aggregator (reclassified to Tier C in this catalogue
      per file 10 convention) documents Porsche 911 window-regulator-
      and-motor replacement at $922–$1,194 average across reporting
      shops. Owner-reported dealer figures on Rennlist and Pelican
      forums (Tier C) extend the upper end to approximately $1,500
      for cars where a regulator-and-motor combined assembly is
      replaced together. As with the independent-specialist band
      above, the catalogue does not have a Tier-B specialist source
      publishing dealer labour rates for this defect specifically.
      The $800–$1,500 band is presented as aggregator-and-owner-
      reported and qualified accordingly; the locked principle
      against Tier-C-only cost anchoring is acknowledged. A buyer
      should treat this band as indicative.

prevalence_rate:
  qualitative: common_to_near_universal_with_age_on_996_997_986_987
  _source_anchor: >
    Tier-B specialist consensus: Pelican Parts' canonical 996/997
    window-regulator how-to article frames the Bowden-cable design
    as a routine wear item recurring through vehicle life. PCGB
    Forum owner experience documents driver-side and passenger-side
    regulator failures arriving in close succession on the same car
    (one owner reports passenger-side failure approximately three
    years after driver-side, both at common mileage points). Pelican
    Parts forum commentary repeatedly notes that 996/997/986/987
    cars accumulate multiple regulator replacements over their
    service life — a pattern that did not characterise the older
    scissors-style regulators that the Bowden-cable architecture
    replaced. Tier-C consistency on Rennlist 997 forum, Planet-9,
    and PistonHeads UK confirms multi-thread-volume reporting across
    ownership communities. Numeric prevalence rate not asserted (no
    Tier-A or Tier-B published owner-survey data for this defect
    specifically); the qualitative framing is anchored in the
    sustained specialist-market presence of regulator-rebuild and
    regulator-replacement product lines and consistent age- and
    cycle-count-correlated presentation.

failure_correlation:
  - age (failure rate increases markedly past approximately ten years of vehicle life)
  - usage_pattern (cycle count: cars used as daily drivers accumulate failures faster than weekend cars; convertible cars where windows cycle with top operation see additional usage)
  - mileage (correlated weakly; age and cycle count are the primary drivers)

retrofit_available: yes
retrofit_kit_names:
  - "Porsche OEM replacement regulator (Suncoast Porsche Parts; FCP Euro; Pelican Parts) — like-for-like factory part, two-year unlimited-mileage parts warranty when not installed by Porsche Service Centre"
  - "Design 911 aftermarket regulator (UK-based; cheaper than OEM; PCGB owner-reported successful fitment)"
  - "URO Parts aftermarket regulator (US aftermarket; commonly stocked at Pelican Parts)"
  - "Mail-in Bowden-cable rebuild service (specialist eBay sellers offering regulator rebuilds at lower cost than full replacement; PCGB Forum experience suggests tested-replacement parts outperform repair-kit-and-springs alternatives)"

regional_amplification:
  desert_southwest: moderate
  cold_climate: moderate
  # Source-supported qualitatively: hot dashboard / hot interior
  # cycles in desert-southwest climates accelerate plastic-spool
  # fatigue; cold-climate operation increases cable stiffness and
  # spool stress at startup. PCGB Forum owner reports come
  # disproportionately from cars stored outside in temperate-to-cold
  # regions. Salt-belt and coastal-humid amplification not source-
  # discussed and intentionally omitted.

keywords:
  addressed:
    - "window regulator replaced"
    - "both regulators replaced"
    - "OEM regulator fitted"
    - "Design 911 regulator"
    - "URO regulator installed"
    - "regulator rebuild service done"
    - "Bowden cables replaced"
    - "rear quarter window regulator replaced"
  concerning:
    - "window slow on auto-up"
    - "window drops at end of travel"
    - "window not sealing fully"
    - "intermittent window"
    - "passenger window sticky"
    - "regulator clicking"
    - "broken plastic spool"
    - "cable visible in door"
  active_problem:
    - "window stuck down"
    - "window will not go up"
    - "window dropped into door"
    - "regulator failed"
    - "window cable snapped"
    - "rear quarter window stuck"
    - "passenger window inoperative"
  documented:
    - "regulator invoice"
    - "Pelican regulator part"
    - "Design 911 part receipt"
    - "Suncoast OEM regulator"

evidence_basis:
  tier_a: []
    # No Porsche AG TSB or warranty-extension action covers this
    # defect. The regulator is treated by Porsche as a wear part
    # outside warranty extensions; remedy is at owner expense.
  tier_b:
    - name: "Pelican Parts — Porsche 911 Carrera Window Regulator and Motor Replacement (996/997) — Tier-B canonical how-to with failure-mode description and step-by-step procedure; commenter discussion documents the Bowden-cable design's recurrent-replacement pattern over vehicle life"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/77-BODY-Replacing_Your_Window_Regulator_and_Motor/77-BODY-Replacing_Your_Window_Regulator_and_Motor.htm"
    - name: "Pelican Parts — Porsche Boxster Window Regulator Replacement (986/987) — Tier-B canonical how-to for the Boxster and Cayman variants"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Boxster_Tech/77-BODY-Window_Regulator/77-BODY-Window_Regulator.htm"
    - name: "Suncoast Porsche Parts — Porsche 996 / 986 OEM window regulator catalogue page (driver's door, passenger's door; documents OEM applicability ranges and pricing band)"
      tier: B
      url_or_reference: "suncoastparts.com/product/99654207504.html"
    - name: "Suncoast Porsche Parts — Porsche 987 Boxster window regulator catalogue page (2005–2012 fitment, OEM)"
      tier: B
      url_or_reference: "suncoastparts.com/product/987WINREG.html"
    - name: "Pelican Parts — Porsche 911 Carrera Door Panel Removal (996/997) — Tier-B procedural reference for door-panel removal, plastic-clip replacement, and airbag-disconnect protocol; commenter discussion documents broken plastic spools as primary failure mode"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/76-BODY-Door_Panel_Removal/76-BODY-Door_Panel_Removal.htm"
  tier_c:
    - name: "RepairPal — Porsche 911 Window Regulator Motor Replacement Cost Estimate (aggregator with cost-band data across reporting shops: $922–$1,194 average). Reclassified to Tier C per file 10 RepairPal classification convention (file 11 review fix); used as cross-reference for owner-reported dealer-band pricing rather than as a primary cost anchor"
      tier: C
      url_or_reference: "repairpal.com/estimator/porsche/911/window-regulator-motor-replacement-cost"
    - name: "PCGB Forum — Window regulator: Repairable or replace? OE or aftermarket? thread (multi-mileage owner experience: 987.2 driver and passenger sides within months, Design 911 vs OEM choice, door-clip-replacement requirement)"
      tier: C
      url_or_reference: "porscheclubgb.com/forum/threads/window-regulator-repairable-or-replace-oe-or-aftermarket.215726/"
    - name: "Rennlist 997 forum — Window Regulator Replacement thread (DIY-time capture: three hours total, ~$250 part cost, plastic spool primary failure)"
      tier: C
      url_or_reference: "rennlist.com/forums/997-forum/779331-window-regulator-replacement.html"
    - name: "Planet-9 Cayman / Boxster forum — Left Window Regulator Repair Cost thread (independent specialist quote $915 driver-side, $600 prior passenger-side capture)"
      tier: C
      url_or_reference: "planet-9.com/threads/left-window-regulator-repair-cost.249234/"

editorial_note: >
  This is a service item rather than a failure mode unique to
  Porsche, but the Bowden-cable architecture's predictable wear
  pattern makes it the most common single electrical-mechanical
  question on a 996, 997, 986, or 987 at the 100,000-mile-plus
  ownership stage. The pre-purchase signal is binary and easy: at
  inspection, every window — driver, passenger, both rear quarters
  on cabriolets — should travel smoothly through full range of
  motion, complete the auto-up cycle without dropping at the end
  of travel, and seal cleanly against the upper rubber. A car that
  fails any of these tests has a regulator at or near end-of-life;
  a buyer should budget approximately $400–$950 per side at an
  independent specialist or $200–$400 in OEM parts plus DIY
  effort.

  Because failures often present bilaterally within a common
  service window, a buyer who finds one failed regulator should
  treat the contralateral side as "due soon" rather than fully
  serviceable. Sellers presenting a car with one recently-replaced
  regulator and an original-on-the-other-side configuration
  generally have not addressed the underlying age driver. Sellers
  presenting a car with both sides replaced at known mileage with
  documented OEM or specialist parts have pre-empted the question.

  No Porsche AG TSB or warranty extension covers this defect.
  Repair is at owner expense throughout vehicle life. The repair
  market is mature: OEM, specialist aftermarket, and rebuild paths
  all coexist with predictable cost-versus-quality trade-offs.

buyer_questions:
  - At inspection, do all door windows (and on cabriolets, the rear quarter windows) travel through their full range smoothly and seal completely on auto-up? Any clicking, dropping, or hesitation?
  - Have either of the door-window regulators been replaced? Both? At what mileage and using OEM or aftermarket parts?
  - On a cabriolet — have the rear-quarter-window regulators been replaced? (These carry the same architecture and the same failure mode but are accessed differently.)
  - For replacement regulators, were the door-panel plastic clips also replaced, or were the original (likely brittle and partially broken) clips re-used?
```


---

## Record 4 — Cayenne / Macan / Panamera sunroof- and cowl-drain water intrusion and footwell wiring-harness corrosion

```yaml
id: cayenne_macan_panamera_sunroof_drain_water_intrusion_harness_corrosion
flag_title: Cayenne / Macan / Panamera — sunroof and cowl drain blockage causing cabin water intrusion and footwell wiring-harness corrosion (class-action settlement on 2014/2015–2023)

description: >
  Across the Cayenne, Macan, and Panamera platforms, water management
  is handled by a small set of interlinked drain paths: paired
  drain tubes from the sunroof tray (where fitted), drain holes from
  the windscreen cowl plenum at the base of the windscreen, and the
  HVAC evaporator condensate drain. Each path can clog with
  accumulated leaves, twigs, and organic debris, and on the
  windscreen-cowl drains a small ball-valve at the body sill
  exit-point can stick closed. When any of these paths block, water
  has nowhere to go but into the cabin: from the cowl plenum it
  spills through the firewall and pillars into the front passenger
  and driver footwells; from the sunroof tray it runs down the
  A-pillars and into the same footwell area; from the HVAC
  evaporator it pours through the dashboard onto the front
  passenger's feet.

  The consequential damage is to the main body wiring harness, which
  Porsche routes along the cabin floor under the carpet. The factory
  wiring topology in the footwell relies on splice-and-tape junctions
  rather than sealed connectors at the points where individual circuit
  branches break out of the main loom; when carpet saturates, those
  splice points are exposed to water, and copper-oxide formation
  progressively breaks circuit continuity in ways that present as a
  constellation of intermittent, seemingly-unrelated electrical
  faults: simultaneous ABS / airbag / PSM / AWD warnings, intermittent
  power-window or radio operation, no-start conditions or "Ignition
  Fault" messages on severely-affected cars, and CAN-bus
  communication loss across multiple control modules. The
  presentation is hard to diagnose from the symptoms alone and
  frequently misroutes to expensive control-module replacements
  before the harness is pulled back to the splices.

  The legal status varies by model year. For 2015–2023 Cayenne and
  Macan and 2014–2023 Panamera vehicles equipped with a factory
  sunroof, imported by PCNA and sold or leased through authorised
  US Porsche dealers, a class-action settlement (Washburn v.
  Porsche Cars North America, Inc., Civil Action No. 2:22-cv-01233-TL,
  US District Court for the Western District of Washington) was
  granted final approval on 4 April 2025. The settlement extends
  Porsche's new-car limited warranty to cover sunroof-related
  repairs on a tiered reimbursement schedule keyed to vehicle age
  and mileage at the time of repair, provides free annual sunroof
  drain cleaning for nine years or 90,000 miles from the in-service
  date, and offers retroactive reimbursement for prior owner-paid
  repairs subject to the same tiered schedule. For pre-2014 Cayennes
  (955 and 957 generations), pre-2015 Cayenne 958 model years, and
  pre-2014 Panameras, the same failure mechanism is documented at
  Tier-B specialists but no Porsche AG action covers the repair —
  remedy is at owner expense.

applicability:
  generation:
    # File-10 specialist-canonical naming: cayenne_955 (2003–2007),
    # cayenne_957 (2008–2010), cayenne_958 (2011–2018, covers the
    # 958 pre-facelift and facelift phases), cayenne_9Y0 (2019+).
    # The class-action / out-of-class-action split within the 958
    # cohort is preserved via specific_model_years and editorial
    # framing rather than via separate generation entries.
    # Reconciliation toward file-10 form per file 11 review feedback.
    - cayenne_955
    - cayenne_957
    - cayenne_958   # 2011–2018; class-action scope from MY2015 onward
    - cayenne_9Y0   # 2019+; class-action scope through MY2023
    - macan_95B     # 2015–2018 (US-market) / 2014–2018 (other markets) Phase 1 + 2019+ Phase 2; class-action scope from MY2015 through MY2023
    - panamera_970  # 2010–2016; class-action scope from MY2014
    - panamera_971  # 2017+; class-action scope through MY2023
  engine_family:
    # Body/chassis-side defect; engine-agnostic. Listed for matcher
    # exhaustiveness across in-scope generations.
    - cayenne_v8_4_5_NA_or_TT
    - cayenne_v8_4_8_NA_or_TT
    - cayenne_v6_3_2_NA
    - cayenne_v6_3_6_NA
    - cayenne_v6_3_0_TT          # 92A facelift + 9YA gasoline V6 (no NA variant in this scope; correction per file 11 review)
    - cayenne_v6_3_0_diesel
    - cayenne_v8_4_2_diesel       # Audi-sourced 4.2L V8 TDI on Cayenne S Diesel (Europe-primary; correction per file 11 review — V8 not V6)
    - cayenne_hybrid              # Cayenne S Hybrid / S E-Hybrid / Turbo S E-Hybrid; in-scope on 958 and 9YA
    - macan_v6_3_0_TT             # Macan 95B / 95B Phase 2 V6 (turbo only; correction per file 11 review)
    - macan_v6_3_6_TT             # Macan Turbo 95B
    - macan_i4_2_0_TT             # Inline-4 prefix corrected per file 11 review
    # macan_i4_2_0_diesel removed — 2.0L diesel Macan never produced.
    - panamera_v6_3_0_supercharged_hybrid  # 970.1 S Hybrid only used a supercharged 3.0L V6 (Audi-sourced); correction per file 11 review
    - panamera_v6_3_0_TT          # 971 Panamera 4 base 3.0L V6 turbo
    - panamera_v6_3_6_NA
    - panamera_v8_4_8_NA_or_TT
    - panamera_v8_4_0_TT          # 971 Turbo / Turbo S
    - panamera_v6_3_0_diesel
    - panamera_v8_4_0_diesel      # 971 4S Diesel (Europe only; correction per file 11 review — original entry "panamera_v6_4_8_diesel" was not a real variant)
    - panamera_hybrid
  body:
    - SUV
    - Sedan
    - Sport_Turismo
  trim_category:
    # Cayenne — all trims with sunroof option taken; trim list is
    # exhaustive of in-scope generations
    - cayenne_base
    - cayenne_S
    - cayenne_S_diesel
    - cayenne_S_hybrid
    - cayenne_S_E_hybrid
    - cayenne_GTS
    - cayenne_turbo
    - cayenne_turbo_S
    - cayenne_turbo_S_E_hybrid
    # Macan — all trims with sunroof option taken
    - macan_base
    - macan_S
    - macan_S_diesel
    - macan_GTS
    - macan_turbo
    # Panamera — all trims with sunroof option taken
    - panamera_base
    - panamera_4
    - panamera_S
    - panamera_4S
    - panamera_S_E_hybrid
    - panamera_GTS
    - panamera_turbo
    - panamera_turbo_S
    - panamera_turbo_S_E_hybrid
  year_range: [2003, 2023]
  excludes:
    description: >
      The class-action settlement scope and the broader failure-
      mechanism scope diverge. The matcher routes both populations
      to this record but the editorial framing carries the legal-
      coverage distinction. Cayenne 955/957/958 (pre-MY2015) and
      Panamera 970 prior to MY 2014 are in scope of the failure
      mechanism (specialist-documented) but NOT in scope of the
      class-action reimbursement. The class-action scope additionally
      requires (a) factory-installed sunroof, (b) PCNA import, and
      (c) sale or lease through an authorised US Porsche dealer —
      cars sold outside the US, or imported privately, are not
      covered by the settlement regardless of model year. The
      Washburn settlement also explicitly excludes vehicles with
      damaged sunroof glass; the protected scope is sunroofs that
      leak despite being fully closed and undamaged.
    market: [non_USA_for_class_action_eligibility_only]
    requires_factory_sunroof_for_class_action: true

severity: high
  # Repair cost spans a wide range driven by extent of harness
  # damage and whether control modules also require replacement.
  # Owner-reported and dealer-quoted figures cluster in the
  # $1,500–$5,000 band for harness splice repair where damage is
  # confined to the footwell splices; PistonHeads UK capture
  # documents a £2,800-plus-VAT (~$3,600+VAT) OPC quote on a 2004
  # Cayenne. Severe cases where corrosion has reached body control
  # modules or where the harness is replaced wholesale push into
  # five-figure territory; Rennlist 92A capture documents a $32,000
  # PCNA estimate as an outlier on a 2009 Cayenne with extensive
  # corrosion. The high severity ranking is driven by the upper
  # band of practical outcomes and by the diagnostic complexity:
  # cars frequently arrive at the harness diagnosis after multiple
  # control modules have already been replaced unsuccessfully.

cost_range_usd:
  in_class_action_scope_eligible_owner_reimbursement:
    qualitative: tiered_per_settlement_schedule_through_MY2023
    _source_anchor: >
      Washburn v. Porsche Cars North America, Inc. settlement
      (court-approved 4 April 2025) provides a tiered reimbursement
      schedule keyed to vehicle age and mileage at the time of
      sunroof-drain-related repair. The Carscoops and ClaimDepot
      summaries of the settlement document the structure: vehicles
      under three years old or under 36,000 miles receive
      approximately 100% reimbursement; the band steps down through
      mileage and age tiers; vehicles over six years old or over
      80,000 miles receive a flat 35% reimbursement. Free annual
      sunroof drain cleaning is provided for nine years or 90,000
      miles from in-service date. The settlement document at
      sunroofdrainsettlement.com is the primary source; the PCA
      editorial (PCA Tech Tips, December 2024) is the Tier-A
      reference for the existence and scope of the settlement.
  drain_cleaning_only_proactive_service:
    low: 100
    high: 350
    _source_anchor: >
      PCarwise editorial frames sunroof drain cleaning as a routine
      service item recommended at least annually. Pelican Parts and
      Suncoast Porsche Parts catalogue drain-screen kits in the
      sub-$50 parts band. Independent specialist labour for a
      cabin-drain inspection-and-clean service runs approximately
      one to three hours; the $100–$350 band brackets shop labour
      across US markets for a proactive cleaning event. For class-
      action-eligible owners, this service is provided free at
      authorised dealers under the settlement.
  harness_splice_repair_independent_specialist_no_module_damage:
    low: 1000
    high: 3500
    _source_anchor: >
      Rennlist Cayenne 955/957 forum DIY guide documents that the
      harness-splice repair, performed by a competent owner or
      specialist, consists of pulling back the footwell carpet,
      opening the flat-cable protector, locating the corroded
      splices, and either re-soldering or splice-cap repairing the
      affected wires. Specialist labour at independent rates for
      this work, where damage is confined to the splices and no
      control modules require replacement, is reported on the
      Rennlist Wiring Harness Repair in Central NJ thread at the
      lower end of the band; PistonHeads UK capture of a £2,800-
      plus-VAT figure (~$3,600+VAT) on an OPC quote sits in the
      middle of the band. The $1,000–$3,500 band brackets harness-
      splice-only repair at independent specialists across US
      markets.
  harness_splice_plus_control_module_replacement_dealer:
    low: 4000
    high: 12000
    _source_anchor: >
      Where corrosion has reached control modules — most commonly
      the body control module (BCM) or the rear-electronics module
      (REM) on the 955/957 — replacement-and-coding adds to the
      harness work. PistonHeads UK case capture documents
      £1,900 labour plus £900 parts plus VAT (~$3,300+VAT) on a
      955 OPC quote inclusive of a control-module replacement.
      Rennlist 92A forum captures owner-quoted dealer figures in
      the $4,000–$8,000 range for combined harness-and-module
      repair on Cayenne 92A applications. The $4,000–$12,000 band
      brackets dealer-rate repair where harness damage extends
      into module replacement.
  worst_case_dealer_full_harness_replacement:
    qualitative: outlier_quotation_uncommon_in_practice
    _source_anchor: >
      Rennlist Wiring Harness Repair in Central NJ thread documents
      a $32,000 PCNA dealer estimate on a 2009 Cayenne GTS with
      approximately 140,000 miles where the dealer assessed the
      harness as unrepairable in-place and quoted full body-harness
      replacement plus extensive labour. The same thread shows the
      owner ultimately routed to an independent electrical specialist
      and resolved the issue at materially lower cost. The figure
      captures the upper bound of dealer-pathway pricing on severe
      cases but is not representative of typical practice; most
      cases resolve at the harness-splice or splice-plus-module
      pathways above.

prevalence_rate:
  qualitative: common_across_in_scope_generations
  _source_anchor: >
    Tier-A signal: the existence and final approval of the Washburn
    settlement is itself evidence that PCNA-imported 2014/2015–2023
    Cayenne, Macan, and Panamera populations experienced the
    failure mechanism at a rate sufficient to support class
    certification. Porsche's settlement structure (proactive annual
    cleaning, retroactive reimbursement, warranty extension) is the
    response to that pattern. Tier-B specialist framing (Go-Parts,
    PCarwise, eEuroParts) describes the failure mechanism as
    persistent across multiple Cayenne generations, predating the
    class-action-scope vehicles by approximately a decade. Tier-C
    consistency on Rennlist Cayenne 955/957/958 forum, PistonHeads
    UK, and Planet-9 documents the failure across the broader 2003–
    2014 cohort. Numeric prevalence rate not asserted (PCNA has not
    published a defect-rate figure in the settlement documents);
    the qualitative framing is anchored in the class-certification
    threshold plus consistent specialist documentation.

failure_correlation:
  - drain blockage (the proximate cause; cars parked under trees, in leafy areas, or with skipped drain-cleaning service intervals are at substantially elevated risk)
  - age (failure rate climbs sharply past approximately 8 years of vehicle life as the design-defective splice tape degrades and drain-blockage probability rises with cumulative debris exposure)
  - service neglect (drain cleaning is on the manufacturer's maintenance schedule but is frequently overlooked at routine service events, particularly when service intervals run to 20,000 miles)
  - climate (regions with deciduous-tree leaf-fall season concentrate failures in autumn through early winter; humid coastal regions amplify the harness-corrosion progression once water has entered)

retrofit_available: partial
retrofit_kit_names:
  - "Porsche OEM drain screen kit (Suncoast Porsche Parts, Pelican Parts) — small mesh screens fitted at the sunroof drain inlets to prevent leaf and debris ingress; preventive only, does not remediate corrosion already present"
  - "Aftermarket drain-clearing brush sets (trombone-brush style; commonly recommended on Planet-9 forum threads as a DIY cleaning tool)"
  - "Wiring-splice repair kits (specialist eBay sellers offer Porsche-specific footwell harness repair kits with weatherproof splice caps; Rennlist Cayenne 955/957/958 DIY thread documents successful resolution by competent owners)"

regional_amplification:
  coastal_humid: high
  cold_climate: moderate   # cold-climate regions have shorter leaf-fall season but cars sat outside in cold winter accumulate water-and-snow ingress that follows the same path
  desert_southwest: low
  # Source-supported: PCarwise and PistonHeads UK both note that
  # cars parked in leafy areas or in regions with extended autumn
  # leaf-fall seasons accumulate drain blockages faster. Coastal-
  # humid amplification is implicit in the corrosion-progression
  # half of the failure mechanism. Desert-southwest cars have low
  # exposure due to arid climate plus minimal leaf-fall.

keywords:
  addressed:
    - "sunroof drains cleaned"
    - "drains flushed"
    - "footwell harness repaired"
    - "splice repair done"
    - "Washburn settlement claim filed"
    - "sunroof drain settlement reimbursement"
    - "BCM replaced after water damage"
    - "body harness repair"
    - "wiring repaired in footwell"
    - "carpet replaced after water"
    - "annual drain cleaning under settlement"
  concerning:
    - "wet carpet"
    - "wet footwell"
    - "water in passenger footwell"
    - "water in driver footwell"
    - "damp carpet"
    - "musty smell after rain"
    - "windows fog inside"
    - "water sloshing in door"
    - "drain blocked"
    - "intermittent electrical faults"
    - "random warning lights"
    - "ABS airbag PSM faults all on"
  active_problem:
    - "footwell flooded"
    - "water in cabin"
    - "carpet soaked"
    - "vehicle electrical system error"
    - "Ignition Fault message"
    - "no start after rain"
    - "multiple control modules faulted"
    - "windows seats radio sporadic"
    - "wiring loom corroded"
    - "BCM water damage"
  documented:
    - "Washburn settlement claim approved"
    - "sunroof drain settlement payout"
    - "PCNA reimbursement received"
    - "drain cleaning service receipt"
    - "harness repair invoice"
    - "specialist electrical repair documentation"

evidence_basis:
  tier_a:
    - name: "Washburn v. Porsche Cars North America, Inc., Civil Action No. 2:22-cv-01233-TL (US District Court for the Western District of Washington) — class-action settlement (final approval 4 April 2025) covering 2015–2023 Cayenne, 2015–2023 Macan, and 2014–2023 Panamera with factory sunroof"
      tier: A
      url_or_reference: "sunroofdrainsettlement.com"
      retrieval_status: referenced_only
      # Settlement document not directly retrieved by the catalogue;
      # existence and scope confirmed via PCA Tech Tips editorial
      # and multiple Tier-B class-action-tracking sources.
    - name: "Porsche Club of America — PCA Tech Tips: Cayenne, Macan, and Panamera owners may be eligible for restitution in the drain settlement (December 10, 2024 editorial; Tier-A reference for settlement scope, model-year coverage, warranty extension, and claim-filing process; PCA editorial commentary explicitly notes that pre-2014/2015 vehicles experience the same failure mechanism)"
      tier: A
      url_or_reference: "pca.org/news/cayenne-macan-panamera-owners-restitution-clogged-drains-pca-tech-tips"
      retrieval_status: retrieved
  tier_b:
    - name: "Go-Parts — 2019-2023 Cayenne Electrical Problems: Water Leaks, Battery Faults, and Harness Failures (Tier-B specialist parts vendor with explicit failure-mechanism description: blocked drains → footwell water → splice corrosion → multi-module communication loss)"
      tier: B
      url_or_reference: "go-parts.com/garage/body-wiring-harness-porsche-cayenne-2019-2023"
    - name: "PCarwise — Porsche Cayenne and Panamera Common Problems (Tier-B specialist with cross-generation framing of the drain-blockage / footwell-water mechanism on Cayenne and Panamera, including class-action settlement reference)"
      tier: B
      url_or_reference: "pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/"
    - name: "ClassAction.org — Porsche Settlement Resolves Class Action Lawsuit Over Alleged Sunroof Leaks (Tier-B legal-tracking aggregator with detailed reimbursement-tier description and final-approval-date confirmation)"
      tier: B
      url_or_reference: "classaction.org/news/porsche-settlement-resolves-class-action-lawsuit-over-alleged-sunroof-leaks"
    - name: "ClaimDepot — Porsche Sunroof Drain Defect Settlement summary (Tier-B legal-tracking source with reimbursement-tier table: <36k mi 100%, 36-50k 100%, 50-72k 70%/65%, 72-80k 60%/55%, >6yr or >80k mi 35%)"
      tier: B
      url_or_reference: "claimdepot.com/settlements/porsche-sunroof-drain-defect-settlement"
    - name: "Carscoops — Porsche Settles Leaky Sunroof Lawsuit (Tier-B automotive editorial summary of settlement structure)"
      tier: B
      url_or_reference: "carscoops.com/2024/12/porsche-settles-class-action-over-sunroof-defects-in-cayenne-macan-and-panamera/"
  tier_c:
    - name: "Rennlist 955/957/958 Cayenne DIY: Wiring problems due to moisture thread (Tier-C DIY repair guide with photographs of corroded footwell splices and step-by-step repair procedure across all three Cayenne generations pre-9YA)"
      tier: C
      url_or_reference: "rennlist.com/forums/diy-cayenne-955-957/1062900-955-957-958-cayenne-diy-wiring-problems-due-to-moisture.html"
    - name: "Rennlist Wiring Harness Repair in Central NJ thread (Tier-C case capture: 2009 Cayenne GTS at 140,000 miles, $32,000 PCNA estimate, ultimate routing to independent electrical specialist)"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-955-957-2003-2010/1318532-wiring-harness-repair-in-central-nj.html"
    - name: "PistonHeads UK — Cayenne V8 S 2004 Electrical Gremlins thread (Tier-C case capture: £1,900 labour + £900 parts + VAT OPC quote on 2004 Cayenne S, plus diagnosis pointing to bulkhead drain blockage and rear-washer-jet pipe split as root causes)"
      tier: C
      url_or_reference: "pistonheads.com/gassing/topic.asp?h=0&f=48&t=1066696"
    - name: "Planet-9 Cayenne 955 Water issues thread (Tier-C case capture: firewall plug missing as additional water-ingress path on 955 generation)"
      tier: C
      url_or_reference: "planet-9.com/threads/cayenne-955-water-issus.249645/"
    - name: "Planet-9 Lets clean those drains thread (Tier-C cross-platform DIY: Boxster, Cayman, and Cayenne drain-cleaning procedures with diagrams; framing of drain cleaning as essential preventive service)"
      tier: C
      url_or_reference: "planet-9.com/threads/lets-clean-those-drains.255068/"
    - name: "PistonHeads UK — Cayenne Water leak into passenger footwell thread (Tier-C consistency: multi-owner reporting of the same failure presentation across model years)"
      tier: C
      url_or_reference: "pistonheads.com/gassing/topic.asp?h=0&f=48&t=813443"
    - name: "Rennlist Cayenne 9Y0 forum — Sunroof Drain Settlement Class action lawsuit thread (Tier-C consistency on settlement awareness in 9YA ownership community)"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-9y0-2019/1441480-sunroof-drain-settlement-class-action-lawsuit-reimbursement-for-2014-2023-a.html"

editorial_note: >
  This is the most consequential single electrical record on a US-
  market 2014/2015–2023 Cayenne, Macan, or Panamera, and the most
  expensive failure pattern on a pre-2014 Cayenne 955 / 957 / 958 or
  Panamera 970 — different in its legal status across the cohort
  but the same defect mechanically. The pre-purchase question
  splits cleanly along the model-year boundary.

  For 2014/2015–2023 sunroof-equipped cars sold or leased through
  authorised US Porsche dealers, the Washburn class-action settlement
  is in force. Porsche has extended the new-car limited warranty to
  cover sunroof-related repairs on a tiered reimbursement schedule
  for up to six years or 80,000 miles from the in-service date, and
  provides free annual sunroof drain cleaning at authorised dealers
  for nine years or 90,000 miles from the in-service date.
  Retroactive reimbursement for prior owner-paid repairs was
  available through a one-time claim-filing window that closed on
  February 4, 2025; that window is now closed and a buyer of a
  previously-unfiled-but-eligible car cannot now file a retroactive
  reimbursement claim. The ongoing benefits — the warranty extension
  for new sunroof-related repairs and the free annual drain
  cleaning — remain available throughout the respective benefit
  windows and transfer to subsequent owners. A buyer evaluating an
  in-scope car should therefore ask whether the previous owner
  filed a retroactive claim before the February 2025 deadline, and
  separately whether the ongoing drain-cleaning benefit has been
  used (and is on file with PCNA). Sellers who never engaged the
  settlement on an eligible car forfeited the retroactive
  reimbursement opportunity but the ongoing-benefit window remains
  intact for the next owner.

  For pre-2014 Cayennes (955, 957, 958 (pre-MY2015)) and pre-2014
  Panameras (970 first three model years), the same mechanism
  applies but the legal coverage does not. The pre-purchase
  question on these cars is whether the carpet has ever been damp,
  whether any of the warning-light constellation has appeared, and
  whether drain cleaning has been documented as a recurring
  service event. A car presented for sale with a fully-dry interior,
  a clean OBD scan on body-control modules, and documented drain-
  cleaning history is at low risk; a car with damp carpet, current
  multi-system warning lights, or a service-history gap on drain
  cleaning carries elevated risk regardless of nominal age.

  The diagnostic complication here parallels Record 1 (wheel-speed
  sensor): the constellation-of-faults presentation routinely leads
  to misdiagnosis. Owners who arrive at OPC dealers with multiple
  random warning lights are often quoted control-module replacements
  before the harness splices are inspected. A buyer evaluating a
  car with recent multi-module repair history should verify whether
  the underlying root cause was identified and remedied (drains
  cleaned, splices repaired) or whether the dealer simply replaced
  the modules and sent the car on. The latter case will recur.

  This record sits inside the Cayenne 92A pre-purchase constellation
  alongside file 09 record 4 (transfer-gear extended warranty),
  file 10 record 2 (air suspension on equipped cars), and Record 1
  of this file (wheel-speed sensor TSB 122/19). For 2015–2018 Cayenne
  92A buyers the constellation is four pre-purchase questions; for
  2011–2014 Cayenne 92A buyers the constellation is three (this
  record applies via the specialist-documented pre-class-action
  scope, transfer gear and wheel-speed sensor are Tier-A
  acknowledged, air suspension is option-equipped only).

buyer_questions:
  - At inspection, are all carpets in the cabin and rear cargo area dry to the touch? Is there any musty odour, condensation on glass that does not clear, or sloshing sound from the door-sill or bulkhead area when the car rocks side-to-side?
  - Has the car ever shown the multi-system warning constellation (ABS, PSM, AWD, airbag, parking brake, "Ignition Fault" or "Vehicle electrical system error")? At what mileage and what was diagnosed?
  - For 2015–2023 Cayenne, 2015–2023 Macan, or 2014–2023 Panamera owners with factory sunroof — did the previous owner file a Washburn class-action retroactive-reimbursement claim before the February 4, 2025 deadline? (The retroactive-reimbursement window is now closed; this question is informational about the car's prior repair history rather than an actionable benefit for the buyer.)
  - For the same in-scope cars — has the free annual sunroof drain cleaning been performed at an authorised dealer under the settlement's nine-year / 90,000-mile benefit? When does that benefit window expire on this car? (This benefit transfers to subsequent owners.)
  - Is there any in-warranty sunroof-related repair record under the settlement's six-year / 80,000-mile new-car-limited-warranty extension? Does coverage remain available going forward?
  - Is there a service-history record of drain cleaning at any point in the car's life? At what intervals?
  - For cars where multi-module electrical repair has been performed — was the underlying root cause (drain blockage / harness splice corrosion) identified and remedied, or were the modules simply replaced? Can the seller provide invoices that distinguish?
  - For 955, 957, 958 (pre-MY2015), and 970 (pre-MY2014) cars (out of class-action scope) — has any repair to the body wiring harness ever been performed? At what mileage and by which shop?
```


---

## Cross-references

- **File 09 — drivetrain and transmissions.** Record 4 of file 09 (Cayenne 92A transfer-gear extended warranty) is the matching Tier-A Porsche-acknowledged action on the same generation as this file's Record 1 (wheel-speed sensor TSB 122/19). The two extended-warranty actions cover different parts on the same MY 2011–2018 Cayenne fleet, both granted ten-year unlimited-mileage cover from new-vehicle delivery, both transferable to subsequent owners, and both eligible for retroactive reimbursement on owner-paid repairs. A buyer evaluating a 2011–2018 Cayenne should treat both records as joint pre-purchase questions.

- **File 10 — chassis and suspension.** Record 2 of file 10 (Cayenne air suspension on 955 / 957 / 958 generations) and this file's Record 4 (sunroof / cowl drain water intrusion and harness corrosion) overlap in their Cayenne applicability. The air-suspension record applies only to cars factory-equipped with air suspension (standard on Turbo and Turbo S; option on other trims), while the drain / harness record applies broadly across sunroof-equipped Cayennes. Record 3 of file 10 (PCCB carbon-ceramic disc replacement economics) is unrelated mechanically but applies on a parallel set of trims (Cayenne Turbo, Turbo S, GTS) — a Cayenne Turbo S buyer should treat the constellation of file 09 record 4, file 10 records 2 and 3, and file 11 records 1 and 4 together.

- **File 06 — Cayenne V8 engine.** File 06's "Considered and Not Included" section explicitly defers PCM unit failures and electronic instrument-cluster issues to "a future electrical / electronics file" — that file is this one. Record 2 of this file fulfils the cluster-pixel half of that deferral with applicability spanning the 996 / 997 / 987 sport-car platforms and the Cayenne 955 / 957. The PCM head-unit failure deferral remains deferred at v1 of this file (see "Items deferred" below).

- **File 07 — body and cabriolet.** File 07 covers convertible-top mechanism failures including top-motor and microswitch issues on the 996 / 997 / 986 / 987 cabriolets. Those failures are mechanically and electrically distinct from this file's Record 3 (door-window regulator failure) — the cabriolet top motor is its own dedicated motor on its own dedicated regulator-equivalent assembly. Record 3 of this file does add the cabriolet rear-quarter-window regulator to its scope, which is the Bowden-cable architecture in a body-side application; that addition is separate from anything in file 07.

- **File 08 — interior sticky buttons.** File 08 covers the 996 / 986 / Cayenne / Panamera HVAC control unit's button stickiness, soft-touch coating peeling, and segment-LCD failures on the centre-stack climate display. Those failures sit on physically and supplier-distinct hardware from this file's Record 2 (instrument cluster centre LCD pixel loss); file 08's HVAC display is a different part with a different failure mode (button typeface wear, soft-touch coating degradation, segment LCD on a passive-matrix display). The two records together cover the centre-stack and behind-the-wheel cabin LCDs on the 996 / 997 / 987 / Cayenne 955 / 957 era; they do not overlap.

- **File 99 — shared water-cooled-era issues.** File 99 already covers secondary air injection (SAI) failure and ignition-coil-pack failure as cross-engine-family records. Both have electrical components but neither is treated as an "electrical defect" in this file — they live in file 99 because their applicability is engine-side and cross-family rather than chassis-electrical. This file does not duplicate them. A buyer evaluating a 1997–2012 water-cooled-era Carrera, Boxster, Cayman, or Cayenne should treat file 99 as the engine-electrical companion to this file's chassis-electrical scope.

- **Cayenne 92A pre-purchase constellation.** The 2011–2018 Cayenne (92A) carries the densest cluster of pre-purchase questions in the catalogue. For MY 2015–2018 sunroof-equipped cars sold through US authorised dealers, the constellation is four discrete records: file 09 record 4 (transfer-gear extended warranty), file 10 record 2 (air suspension on equipped cars), this file's Record 1 (wheel-speed sensor extended warranty), and this file's Record 4 (sunroof drain / harness class-action settlement). For MY 2011–2014 cars, the constellation is three Tier-A items (transfer gear, wheel-speed sensors, air suspension on equipped cars) plus the same drain / harness mechanism documented at Tier B but without class-action reimbursement. The matcher's `cross_file_constellation_id` v2 candidate (described in file 10's schema-extension queue) is reinforced by this file's two additional 92A-cohort records.

- **Macan 95B pre-purchase constellation (partial).** The 2014–2018 Macan 95B inherits two records from this file: Record 1 (wheel-speed sensor TSB 122/19) and Record 4 (sunroof drain class-action settlement, applicable to MY 2015 onward). The Macan platform is otherwise thinly covered in the catalogue at v1 — Macan-specific transmission, engine, and chassis records are deferred to future authoring as the platform's failure-mode evidence base develops.

- **Panamera 970 / 971 partial coverage.** Panamera 970 (2010–2016) and 971 (2017–2023) appear in this file's Record 4 only. Panamera-specific engine, transmission, and chassis records are deferred to future authoring. The class-action settlement (Washburn) covers Panamera MY 2014–2023 with sunroof; pre-MY-2014 Panamera 970 cars (2010–2013) are out of class-action scope but inherit the same drain / harness failure mechanism documented at Tier B.

- **Future file (electrical, 991+ / 981 / 718 / 9YA / 95B Phase 2).** The 991 / 992 generation 911, 981 / 718 generation Boxster and Cayman, 9YA generation Cayenne (2019+), and 95B Phase 2 generation Macan (2019+) are intentionally out of scope of this v1 file's records 2 and 3. Window-regulator architecture changed on 991+ / 981+ to a body-electronics-module-controlled design; instrument-cluster architecture moved to TFT colour displays with different failure modes. Both warrant v2 records when specialist failure-prevalence material on those generations matures. The 9YA and 95B Phase 2 are within scope of this file's Record 4 (drain / harness) by virtue of the Washburn settlement.

---

## Items deferred from this file

- **PCM-2 and PCM-2.1 navigation display dead-pixel failure.** Specialist mail-in repair vendors (Tanin Auto Electronix, German Audio Tech, UpFix) operate dedicated PCM-2 / 2.1 navigation-display LCD repair product lines parallel to the instrument-cluster repair lines documented in Record 2. Failure mode is similar: passive-matrix LCD pixel loss, polariser delamination, segment failure. Cost band sits at $200–$400 for specialist mail-in repair and approximately $1,500–$3,000 for OEM head-unit replacement. Deferred from v1 because the failure is cosmetic-only (the car remains drivable; only navigation, audio-display, and reverse-camera display are affected on equipped cars), and because the buyer-due-diligence weight is materially lower than Record 2's instrument cluster (which is required for legal road use). Candidate for v2 once a more comprehensive Tier-B sourcing pass is performed; the existing specialist-vendor product pages establish the failure mechanism but do not quantify prevalence.

- **Xenon / Litronic headlight ballast and bulb failure.** Real and well-recognised on 996, 997, Cayenne 955 / 957, and 987 platforms. Specialist coverage exists at Pelican Parts and aftermarket vendors (Retrofitlab supplies bi-xenon retrofit kits with failure-mode framing). However, Tier-B prevalence quantification is patchy and the failure mode straddles two distinct issues (ballast-electronics failure versus projector reflective-layer degradation) that warrant separate treatment. Deferred to v2 when sourcing matures; cost band approximately $80–$300 per ballast plus replacement bulb for ballast-only repair, materially higher when projector-housing replacement is required.

- **964 and 993 DME relay failure.** A well-documented air-cooled-era issue at Pelican Parts (canonical DME-relay troubleshooting article on the 993, plus extensive forum coverage on 964). The relay itself is approximately $30–$100 and the failure presents as a no-start condition that is resolved by paper-clip-jumper diagnostic and relay swap. Below the v1 severity bar — captured by the broader "service history present" signal rather than a flagged defect record. Candidate for v2 if a buyer-due-diligence framing develops (e.g., as part of a broader 964 / 993 reliability cluster).

- **996 / 997 PCM head-unit and CDR-23 / CDR-24 MOST-bus communication failures.** Real and well-documented on the 996 / 997 / 987 / Cayenne 955 / 957 platforms. Failures present as "system error" messages, optical-loop drop-outs, head-unit booting issues, and CDC / phone-module losses. Specialist coverage exists at Pelican Parts and Mr12Volt (CDR replacement and Bluetooth-retrofit vendor). Deferred from v1 because the failure mode straddles three distinct issues (head-unit hardware failure, MOST-bus optical-cable degradation, security-coding lock-out) that warrant separate treatment, and because the typical remedy (Bluetooth-interface aftermarket replacement) is now common enough that many cars in the field have already moved off the original hardware. Candidate for v2.

- **Cayenne tailgate and liftgate wiring-harness chafing (separate from drain-induced corrosion).** The wiring harness that crosses the rear-tailgate hinge on the Cayenne 955 / 957 / 958 chafes against the hinge structure with cumulative open / close cycles, breaking individual conductors at the fold point. Documented at 6SpeedOnline 957 forum (case capture: tilt-angle-sensor ground wire broken at hinge after the car had sat for several months) and at PCarwise editorial (rear wiper, tailgate locking, and licence-plate-light failures attributed to the same harness). Distinct mechanism from Record 4 (drain-induced corrosion). Deferred from v1 as a separate candidate record; a v2 entry can be added when the failure-mode mileage-and-age band is more cleanly quantified.

- **Cayenne 955 firewall plug missing as additional water-ingress vector.** Planet-9 forum capture documents that the 955 carries a hole in the firewall at the inner-fender / firewall junction that should be sealed by a plastic body plug — and that some 955s left the factory without the plug fitted. Water from the windscreen cowl is guided directly to that hole and floods the cabin behind the dashboard rather than through the documented drain-blockage pathway. Deferred from v1 as an additional water-ingress sub-pathway within Record 4's broader scope; could be carried as a sub-population annotation in v2.

- **986 Boxster instrument-cluster pixel loss.** The 986 (1997–2004) carries a different generation of LCD instrument-cluster module from the 996 / 997 / 987. Specialist mail-in repair coverage on the 986 cluster specifically is materially thinner than on the 996 / 997 / 987 cluster — Tanin, German Audio Tech, and UpFix do not list a 986-specific repair product line of comparable maturity. Deferred from Record 2's scope on those grounds, with a v2 expansion possible once specialist documentation matures.

- **991 / 992 / 981 / 718 / 9YA / 95B-Phase-2 instrument cluster and PCM dead-pixel failures.** The newer-generation instrument clusters on 991 / 992 / 981 / 718 sport cars and 9YA / 95B-Phase-2 SUVs use TFT colour displays with different failure-mode profiles. 911UK forum capture on a 992.1 cluster documents an emerging dead-pixel issue, and 718 Forum captures on PCM display blanking on 982 Boxster / Cayman cars indicate an active warranty-handling pattern at PCNA. These are not yet at sufficient field-failure age for specialist Tier-B repair markets to have developed the way they have on 996 / 997 / 987. Deferred to v2; the Record 2 architecture (cross-platform LCD-failure record with sub-population pricing bands) can extend cleanly to these generations when sourcing matures.

- **928 dashboard, instrument cluster, and centre-console LCD repair.** The 928 (1978–1995) carries a different generation of LCD displays in the climate control and trip-computer subsystems. Specialist repair exists at 928 International and Devek but the failure-mode and prevalence sourcing has not been compiled in this file's Record 2 scope. The 928 is already covered by file 05 (engine, with chassis records in file 10). A 928-specific electrical record may be authored as part of a future expansion or carried alongside other 928 service-cluster items in a future cooling / electrical hybrid file.

- **944 / 968 instrument cluster and dashboard issues.** Transaxle-era 4-cylinder cars (924 / 944 / 968) carry their own electrical-cluster and dash-electronics issues distinct from the water-cooled-era population. Niche relative to the catalogue's v1 scope and below the buyer-due-diligence flag bar; deferred until a transaxle-electrical sub-file is justified.

- **Cayenne / Panamera battery management on 9YA-era 12V LiFePO4 batteries.** Go-Parts editorial notes a documented failure pattern on the 2019+ Cayenne 9YA where the 12-volt LiFePO4 battery's internal management system fails and the battery goes fully dead. Deferred from v1 because the 9YA platform is otherwise thinly covered in the catalogue at v1 (most 9YA records are deferred to v2) and because the failure mode is sufficiently new that prevalence is poorly quantified.

If field experience surfaces clear specialist consensus on any of these, they can be added in a v2 pass.

---

## Schema-extension queue (carry to `00_schema.md` v2 candidates)

Authoring this file surfaced the following structural issues that the locked v1 schema does not cleanly accommodate. They are documented here for the v2 schema pass.

- **`market` axis with `extended_warranty_eligible_markets` sub-key.** Record 1 (wheel-speed sensor TSB 122/19) is the canonical case. The Porsche TSB explicitly limits the extended warranty to the USA, Canada, and Puerto Rico — owners outside these markets experience the same defect mechanism but cannot claim under the bulletin. The applicability axes in v1 (`generation`, `engine_family`, `body`, `trim_category`, `year_range`) do not encode this, and the matcher cannot currently route a UK or German 2014 Cayenne 92A to the same record with a "warranty does not apply at your location" framing. The current workaround embeds the market scope in a free-form `market` key under applicability and the editorial note carries the qualifier in prose. A v2 schema extension formalising a `market` enum (with values such as `USA`, `Canada`, `Puerto_Rico`, `EU`, `UK`, `China`, `Japan`, `RoW`) and a sub-key for warranty eligibility would let the matcher distinguish "defect applies, warranty does not" from "defect does not apply" cleanly.

- **`requires_factory_sunroof_for_class_action: true` flag.** Record 4 (Cayenne / Macan / Panamera sunroof-drain water intrusion) is the canonical case. The Washburn class-action settlement requires the vehicle to have a factory-installed sunroof — cars without sunroof are not class members regardless of model year. The current workaround carries this requirement in a free-form `requires_factory_sunroof_for_class_action` key under applicability and the editorial note explains the qualifier. The shape of this requirement parallels the `requires_positive_keyword_match` v2 candidate documented in file 10's schema-extension queue (PCCB record): a record where applicability depends on a factory-option presence and the matcher needs both a positive identifier and a negative-exclusion behaviour. A v2 schema extension generalising option-code-and-keyword-conditional applicability (already proposed for PCCB) would extend cleanly to the sunroof case.

- **`retrieval_status: retrieved | referenced_only` on tier-A sources.** Records 1 and 4 of this file populate `tier_a` source lists with explicit retrieval-status annotations. Record 1's two TSB 122/19 PDFs (Cayenne 92A and Macan 95B) are NHTSA-mirrored and directly retrieved by the catalogue (status `retrieved`). Record 4's primary settlement document at sunroofdrainsettlement.com is `referenced_only` — the catalogue confirms the settlement's existence, scope, and final-approval date through the PCA editorial (status `retrieved`) and through multiple Tier-B class-action-tracking sources, but does not directly retrieve the court-filed settlement document. This pattern reinforces the existing v2 candidate documented in file 09's schema-extension queue (`tier_a_doc_retrieved: true | referenced_only`) — Record 4 of this file is a clean second precedent.

- **Sub-population legal status (extends the existing sub-population prevalence and severity v2 candidates).** Record 4 has a fundamental discontinuity along the model-year axis: 2014/2015–2023 sunroof-equipped cars sold through PCNA-imported channels in the US are class-action-covered with retroactive reimbursement and warranty extension; pre-2014 / pre-2015 cars (and non-PCNA-imported cars) experience the same defect mechanism with no manufacturer or legal coverage. The matcher routes both populations to the same record (correct: same defect, same mechanism), but the buyer-facing rendering should distinguish "drain blockage on a 2017 Cayenne (class-action coverage available)" from "drain blockage on a 2007 Cayenne (specialist remedy at owner expense)". A v2 schema extension allowing a `legal_status_by_subpopulation` map keyed on year-range would let the matcher render the differential framing cleanly. This combines with the existing `prevalence_by_subpopulation` (v2 IMS candidate) and the per-subpopulation severity (v2 928-ball-joint candidate from file 10) into a unified per-subpopulation extension that covers prevalence, severity, and legal-status differentials within a single record.

- **Cross-file constellation flagging (reinforces the existing v2 candidate from file 10).** Records 1 and 4 of this file extend the Cayenne 92A pre-purchase constellation already partially mapped in files 09 and 10 from three records (transfer gear, air suspension, wheel-speed sensor) to four records (adding the sunroof-drain class-action coverage on MY 2015–2018). For the matcher to surface this cohort-level pattern as a single VIN-level pre-purchase question, the `cross_file_constellation_id` v2 candidate (documented in file 10's schema-extension queue) is reinforced. This file's authoring also surfaces an analogous though smaller Macan 95B constellation (Records 1 and 4 of this file) and Panamera 970 / 971 constellation (Record 4 only at v1, with future records pending). A v2 implementation should permit per-constellation editorial annotation that the matcher renders together rather than as four separate items.

- **`evidence_basis` sub-listed canonical form (reinforces the file 10 schema-extension queue point).** All four records in this file use the sub-listed `evidence_basis` form (`tier_a` / `tier_b` / `tier_c` lists with name / tier / URL-reference objects). The v1 schema's `evidence_basis: <single keyword>` form is not used. The sub-listed form has now been used across files 09, 10, and 11 — three consecutive files. The v2 schema pass should formalise the sub-listed structure as canonical and retire the single-keyword form.

- **Per-entry `tier` field redundancy in the sub-listed `evidence_basis` form.** This file's evidence_basis entries carry a per-object `tier: A | B | C` field while also being nested under `tier_a` / `tier_b` / `tier_c` lists. The nesting position already determines the tier; the per-entry field is duplicative. Per file 11 review feedback, the v2 schema pass should drop the per-entry `tier` field and rely on the nested-list position alone. The `name` and `url_or_reference` fields (and where present, `retrieval_status`) carry the entry-level information without redundancy.

- **`tier_a_absence_rationale` field as a v2 promotion of inline YAML comments.** Records 2 and 3 use YAML comments under `tier_a: []` to document why no Tier-A source applies (e.g., "No Porsche AG TSB or warranty-extension action covers this defect — the cluster is treated as a wear part outside warranty extensions; remedy is at owner expense"). YAML comments are not data and will not survive matcher serialisation. A v2 schema extension promoting this rationale to a structured `tier_a_absence_rationale` field (or analogously `tier_b_absence_rationale` for records lacking specialist coverage) would let the matcher render the absence framing in the buyer-facing display.

- **Tier-C-with-specialist-content classification ambiguity.** Record 1's Planet-9 forum thread was initially listed under tier_b on the editorial argument that the contributor's analysis was specialist-tier. Per file 11 review feedback, this is an upgrade pattern that the locked tier convention does not formally permit (Tier C explicitly includes forum threads, regardless of contributor specialist quality). The Planet-9 entry has been demoted to tier_c in v1. A v2 schema decision should either (a) tighten the rule to "forum is forum, no upgrades" formally, or (b) introduce a `tier_c_with_specialist_authorship: true` annotation that the matcher can use to weight specific forum entries higher when adjudicating evidence weight without reclassifying the venue.

- **Cayenne generation naming convention reconciliation — partial completion logged.** As of the May 2026 catalogue-wide cleanup pass, the deprecated chassis-code variants (`Cayenne_92A` for 2nd-gen, plus `Cayenne_PO536` / `Cayenne_E3` / `cayenne_9YA` for 3rd-gen) have been retired across files 06, 08, 09, and 11 in favour of the decade-reference-aligned canonical names: `cayenne_955` / `cayenne_957` / `cayenne_958` / `cayenne_9Y0`. One residual structural distinction remains: file 09 uses `cayenne_958_phase_1` / `cayenne_958_phase_2` sub-keys to encode the warranty-extension phase split (10-year on 2011–2014 cars; 7-year on 2015–2018 cars), whereas file 10 and file 11 use a flat `cayenne_958` with phase distinctions encoded in `specific_model_years` + editorial framing. A v2 schema decision should either (a) retire the file-09 phase suffixes and migrate to flat `cayenne_958` for catalogue-wide consistency, or (b) formalise the phase-suffix convention in `00_schema.md` for cases where warranty/legal scope is the defining axis of the record. The phase-suffix form is genuinely useful for warranty-extension records; the v2 call is whether to spread it to other files or contain it.

- **Engine-family naming convention: `v4_` versus `i4_` / `l4_` for inline-four-cylinder variants.** File 11 v1 originally used `v4_2_0_TT` and `v4_2_0_diesel` for the Macan 2.0L EA888 inline-four (this is technically a misnomer — true V4 engines are vanishingly rare in production cars). Per file 11 review feedback, the v1 file has been corrected to `i4_2_0_TT` (inline-4). A v2 schema pass should formalise the engine-family-naming convention in `00_schema.md`: standardising on `i4_` / `l4_` prefixes for inline-four engines, `v6_` and `v8_` for vee-block engines, and explicit boxer-flat-six naming (`flat6_` or engine codes like `M96` / `M97` / `Mezger` / `9A1`) for the sport-car platforms. The catalogue currently uses a mix of structured naming (file 09/10/11 SUV / sedan platforms) and engine-code naming (file 01–06 sport-car platforms); the v2 pass should reconcile these or document the dual convention.


---

## Sources

### Tier A — Porsche AG, PCNA, NHTSA-mirrored TSBs, PCA editorial, court-approved class actions

[1] Porsche Cars North America, Inc. — Technical Information Service Bulletin 122/19, Cayenne (92A) model line, MY 2011–2018, "Warranty Information: Extended Warranty for Wheel Speed Sensors," published May 27, 2020. NHTSA-mirrored, directly retrieved. Tier A.
https://static.nhtsa.gov/odi/tsbs/2020/MC-10175910-0001.pdf

[2] Porsche Cars North America, Inc. — Technical Information Service Bulletin 122/19, Macan (95B) model line, MY 2014–2018, "Warranty Information: Extended Warranty for Wheel Speed Sensors," published May 27, 2020. NHTSA-mirrored, directly retrieved. Tier A.
https://static.nhtsa.gov/odi/tsbs/2020/MC-10175911-0001.pdf

[3] Washburn v. Porsche Cars North America, Inc., Civil Action No. 2:22-cv-01233-TL, US District Court for the Western District of Washington — class-action settlement (Final Fairness Hearing March 27, 2025; final approval April 4, 2025) covering MY 2015–2023 Cayenne, MY 2015–2023 Macan, and MY 2014–2023 Panamera with factory-installed sunroof, imported by Porsche Cars North America, sold or leased through authorised US Porsche dealers. Settlement administrator: Angeion Group. Tier A. (Settlement document referenced via PCA editorial; not directly retrieved by the catalogue.)
https://sunroofdrainsettlement.com/

[4] Porsche Club of America — PCA Tech Tips: "Cayenne, Macan, and Panamera owners may be eligible for restitution in the drain settlement," authored by Manny Alban, December 10, 2024. Tier-A reference for Washburn v. PCNA settlement scope, model-year coverage, warranty-extension structure, and claim-filing process. Editorial commentary explicitly notes that pre-2014 / pre-2015 vehicles experience the same failure mechanism and warns owners outside the settlement scope to maintain drain cleaning. Directly retrieved. Tier A.
https://www.pca.org/news/cayenne-macan-panamera-owners-restitution-clogged-drains-pca-tech-tips

### Tier B — established specialists with documented expertise

[5] AutohausAZ — Porsche Cayenne ABS Wheel Speed Sensor catalogue page (parts vendor with replacement-pricing reference and OEM-equivalent fitment notes). Tier B.
https://www.autohausaz.com/porsche-auto-parts/porsche-cayenne-abs_wheel_speed_sensor-replacement.html

[6] Tanin Auto Electronix — 2005-2012 Porsche 997 & 987 Instrument Cluster Repair Service (specialist mail-in repair service with lifetime warranty on Tanin Electronix replacement LCD; sun-and-heat-driven failure-mode framing). Tier B.
https://taninautoelectronix.com/product/2005-2012-porsche-911-997-cayman-987-gauge-cluster-screen-repair/

[7] UpFix — Porsche Instrument Cluster Repair product range (cross-platform mail-in repair with sale and MSRP pricing data: 996 Carrera 1999–2004 ICP, 997 Carrera 2005–2012 ICP, 987 Boxster 2005–2012 ICP, 987C Cayman 2006–2012 ICP, Cayenne 957 2002–2010 IPC; benchmark pricing for the cross-platform cost band). Tier B.
https://www.upfix.com/product-category/repair-return/icp-instrument-cluster-repair/porsche-icp-instrument-cluster-repair/

[8] German Audio Tech — Pixel Odometer Display Repair Service for Porsche 997 / 987 / 911 / Boxster / Carrera 4S / Turbo Instrument Speedometer Cluster LCD (specialist mail-in repair; product description discusses ten-plus years experience and odometer-burn-in constraint on used cluster swap). Tier B.
https://www.germanaudiotech.com/products/pixel-odometer-display-repair-service-for-porsche-997-987-911-boxster-carrera-4s-turbo-instrument-speedometer-cluster-lcd

[9] Best Cluster Repair — Porsche 911 (997) Boxster (987) Instrument Cluster LCD Display Pixel Repair Service (specialist mail-in repair). Tier B.
https://bestclusterrepair.com/product/porsche-911-997-boxter-987-instrument-cluster-lcd-display-pixel-repair-service/

[10] Speedo Solutions — Porsche 911 / Boxster / Cayman (987 / 997) Instrument Cluster Repair Service (specialist mail-in repair; centre LCD driver-info-display replacement). Tier B.
https://www.speedosolutions.com/Porsche-911-Boxster-Cayman-987-997-Instrument-Cluster-Repair-Service--Center-LCD-Driver-Info-Display-Replacement_p_221.html

[11] Pelican Parts — Porsche 911 Carrera Window Regulator and Motor Replacement, 996 (1998-2005) and 997 (2005-2012). Canonical Tier-B how-to with Bowden-cable failure-mode description and step-by-step procedure. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/77-BODY-Replacing_Your_Window_Regulator_and_Motor/77-BODY-Replacing_Your_Window_Regulator_and_Motor.htm

[12] Pelican Parts — Porsche Boxster Window Regulator Replacement / Window Switch Replacement / Window Motor Replacement, 986 / 987 (1997-08). Canonical Tier-B how-to for Boxster and Cayman variants. Tier B.
https://www.pelicanparts.com/techarticles/Boxster_Tech/77-BODY-Window_Regulator/77-BODY-Window_Regulator.htm

[13] Suncoast Porsche Parts — Window Regulator Driver's Door (986 / 996 OEM, fits Boxster 1997–04.5 and Carrera 1999–04.5). Tier-B parts vendor reference for OEM regulator pricing and fitment. Tier B.
https://www.suncoastparts.com/product/99654207504.html

[14] Suncoast Porsche Parts — Boxster Window Regulator 2005–2012 (987 OEM, motor not included). Tier B.
https://www.suncoastparts.com/product/987WINREG.html

[15] Pelican Parts — Porsche 911 Carrera Door Panel Removal, 996 (1998-2005) and 997 (2005-2012). Tier-B procedural reference for door-panel removal, plastic-clip replacement, and airbag-disconnect protocol. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/76-BODY-Door_Panel_Removal/76-BODY-Door_Panel_Removal.htm

[16] Go-Parts — 2019-2023 Cayenne Electrical Problems: Water Leaks, Battery Faults, and Harness Failures (Tier-B specialist parts vendor with explicit failure-mechanism description: blocked drains → footwell water → splice corrosion → multi-module CAN-bus communication loss; cross-references to broader Cayenne generations). Tier B.
https://www.go-parts.com/garage/body-wiring-harness-porsche-cayenne-2019-2023

[17] PCarwise — Porsche Cayenne and Panamera Common Problems (Tier-B specialist with cross-generation failure-mode framing of the drain-blockage / footwell-water mechanism on Cayenne and Panamera; references the Washburn class-action settlement). Tier B.
https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/

[18] ClassAction.org — Porsche Settlement Resolves Class Action Lawsuit Over Alleged Sunroof Leaks (Tier-B legal-tracking aggregator with detailed settlement-structure description and class-vehicle-scope confirmation; primary court-document sourcing). Tier B.
https://www.classaction.org/news/porsche-settlement-resolves-class-action-lawsuit-over-alleged-sunroof-leaks

[19] ClaimDepot — Porsche Sunroof Drain Defect Settlement summary (Tier-B legal-tracking source with reimbursement-tier table by mileage and age, and final-approval-date confirmation: April 4, 2025). Tier B.
https://www.claimdepot.com/settlements/porsche-sunroof-drain-defect-settlement

[20] Carscoops — Porsche Settles Leaky Sunroof Lawsuit, But Some Owners Get A Better Deal Than Others (Tier-B automotive editorial summary of settlement structure including reimbursement tiers by vehicle age and mileage). Tier B.
https://www.carscoops.com/2024/12/porsche-settles-class-action-over-sunroof-defects-in-cayenne-macan-and-panamera/

### Tier C — Forums, named-individual community contributions, and aggregator sites without primary Porsche-specialist sourcing (consistency footnote only; never sole source for cost or prevalence)

[21] Planet-9 Porsche Forum — "958.1 2011 Wheel Speed ABS Sensors" thread (Tier-C forum venue with knowledgeable-contributor failure-mechanism description: housing crack admits moisture and shorts internal electronics; framed as common point of failure on the Cayenne 958 generation). Tier C — demoted from Tier B per file 11 review feedback (locked principle: forum threads are Tier C regardless of contributor specialist quality).
https://www.planet-9.com/threads/958-1-2011-wheel-speed-abs-sensors.250428/

[22] RepairPal — Porsche 911 Window Regulator Motor Replacement Cost Estimate ($922–$1,194 average across reporting shops; consistency cross-reference for owner-reported dealer-band pricing on Record 3). Tier-C aggregator (consistent with file 10 RepairPal classification convention).
https://repairpal.com/estimator/porsche/911/window-regulator-motor-replacement-cost

[23] Rennlist Cayenne 958 forum — "MY2011-2018 Porsche Cayenne Wheel Speed Sensors Warranty Extension" thread (Tier-C consistency: owner letters, reimbursement-claim case captures). Tier C.
https://rennlist.com/forums/cayenne-958-2011-2018/1221234-my2011-2018-porsche-cayenne-wheel-speed-sensors-warranty-extension-2.html

[24] 6SpeedOnline Cayenne 958 forum — "Cayenne Wheel Speed Sensor Warranty Extension" thread (Tier-C consistency: warranty letter, claims-website URL, transfer-of-warranty notes). Tier C.
https://www.6speedonline.com/forums/cayenne-958/442086-cayenne-wheel-speed-sensor-warranty-extension.html

[25] Macan Forum — "Just received MY2014-2018 Macan wheel speed sensor warranty extension" thread (Tier-C consistency: same warranty letter pattern across Macan ownership community). Tier C.
https://www.macanforum.com/threads/just-received-my2014-2018-macan-wheel-speed-sensor-warranty-extension.177470/

[26] Planet-9 Porsche Forum — "So this happened" thread (Tier-C cascade-of-faults case capture: ABS / PSM / parking-brake / AWD / engine-control / transmission warnings simultaneously, traced to wheel-speed sensor as the common upstream input). Tier C.
https://www.planet-9.com/threads/so-this-happened.253989/

[27] 6SpeedOnline 997 forum — "Instrument Cluster display problem" thread (Tier-C consistency: 997.1 cluster pixel-loss progression case capture; OEM-replacement $3,000 figure; used-cluster odometer-burn-in constraint at 500 miles described). Tier C.
https://www.6speedonline.com/forums/997/342249-instrument-cluster-display-problem.html

[28] 911UK Forum — "Dead Pixels on Instrument Cluster" threads (Tier-C consistency on cluster pixel-loss reports across 997 and 992.1 ownership). Tier C.
https://911uk.com/porsche/dead-pixels-on-instrument-cluster-992-1-c2s.133568/

[29] PCGB Forum — "Window regulator: Repairable or replace? OE or aftermarket?" thread (Tier-C consistency: 987.2 Boxster owner-experience case capture across driver and passenger sides within a common timeframe; Design 911 vs OEM choice; door-panel-clip replacement requirement). Tier C.
https://www.porscheclubgb.com/forum/threads/window-regulator-repairable-or-replace-oe-or-aftermarket.215726/

[30] Rennlist 997 forum — "Window Regulator Replacement" thread (Tier-C consistency: DIY-time and parts-cost capture; plastic-spool primary failure observation; Bowden-cable-as-maintenance-item commentary). Tier C.
https://rennlist.com/forums/997-forum/779331-window-regulator-replacement.html

[31] Planet-9 Cayman / Boxster forum — "Left Window Regulator Repair Cost" thread (Tier-C case capture: independent-specialist quote $915 driver-side, $600 prior passenger-side capture). Tier C.
https://www.planet-9.com/threads/left-window-regulator-repair-cost.249234/

[32] Rennlist Cayenne 955/957/958 DIY forum — "955/957/958 Cayenne DIY: Wiring problems due to moisture" thread (Tier-C DIY repair guide with photographs of corroded footwell splices and step-by-step repair procedure across all three Cayenne pre-9YA generations). Tier C.
https://rennlist.com/forums/diy-cayenne-955-957/1062900-955-957-958-cayenne-diy-wiring-problems-due-to-moisture.html

[33] Rennlist Cayenne 955-957 forum — "Wiring Harness Repair in Central NJ" thread (Tier-C case capture: 2009 Cayenne GTS at 140,000 miles; $32,000 PCNA dealer estimate as outlier; ultimate routing to independent electrical specialist). Tier C.
https://rennlist.com/forums/cayenne-955-957-2003-2010/1318532-wiring-harness-repair-in-central-nj.html

[34] PistonHeads UK — "Cayenne V8 S 2004 Electrical Gremlins" thread (Tier-C case capture: £1,900 labour + £900 parts + VAT OPC quote on a 2004 Cayenne S; root-cause diagnosis pointing to bulkhead drain blockage and rear-washer-jet pipe split as sub-pathways). Tier C.
https://www.pistonheads.com/gassing/topic.asp?h=0&f=48&t=1066696

[35] Planet-9 Porsche Forum — "Cayenne 955 Water issues" thread (Tier-C case capture: firewall plug missing as additional water-ingress vector on the 955 generation; behind-dashboard wiring-harness exposure observation). Tier C.
https://www.planet-9.com/threads/cayenne-955-water-issus.249645/

[36] Planet-9 Porsche Forum — "Lets clean those drains" thread (Tier-C cross-platform DIY: Boxster, Cayman, and Cayenne drain-cleaning procedures with diagrams; framing of drain cleaning as essential preventive service to protect floor-mounted control modules). Tier C.
https://www.planet-9.com/threads/lets-clean-those-drains.255068/

[37] PistonHeads UK — "Cayenne Water leak into passenger footwell" thread (Tier-C consistency: multi-owner reporting of the same failure presentation across Cayenne model years). Tier C.
https://www.pistonheads.com/gassing/topic.asp?h=0&f=48&t=813443

[38] Rennlist Cayenne 9Y0 forum — "Sunroof Drain Settlement Class action lawsuit Reimbursement for 2014-2023" thread (Tier-C consistency on settlement awareness and reimbursement-process discussion in the 9YA ownership community). Tier C.
https://rennlist.com/forums/cayenne-9y0-2019/1441480-sunroof-drain-settlement-class-action-lawsuit-reimbursement-for-2014-2023-a.html

