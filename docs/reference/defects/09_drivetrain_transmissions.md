# 09 — Drivetrain & Transmissions

**Scope:** Transmission-specific defects across the Porsche range that have sufficient Tier A or B grounding to assert prevalence, cost, and applicability with confidence. Engine-mounted clutch hydraulics and rear-main seals belong to engine-family files (01–06); driveshaft, axle, and CV components belong to chassis (10).

**Records in this file (4):**
1. `g50_second_gear_pop_out` — air-cooled 911 manual (1987–1998)
2. `pdk_7dt_mechatronic_failure` — ZF dual-clutch in 911/Cayman/Boxster (2009+)
3. `m928_722_3_automatic` — 928 Mercedes-derived 4-speed automatic (1983–1995)
4. `cayenne_958_transfer_gear` — Cayenne 958 / Macan 95B "hang-on" transfer gear (Tier A warranty extension)

**Records originally planned but deferred:**
- Tiptronic torque-converter pump seal / valve-body wear records were planned as a single multi-platform record. Mid-research in this session, source review revealed that "Tiptronic" in the 996/997 era is not one transmission. The 1998–2001 996.1 Carrera and 986 Boxster used the **ZF 5HP-19 (A96.00)**; the 996 Turbo (2001+), 996.2 Carrera (MY2002+), and 997.1 used the **Mercedes 722.6 (A96/35, A96/50, 722.653, 722.657)**; the 964/993 used an earlier **A96-family** unit. These are mechanically and electronically distinct and their failure modes (TCU O-ring leak, valve-body wear, transfer-case gasket failure, selector-shaft seal leak) belong to specific units — not to "Tiptronic" as a category. Combining them into one record would generate the engine-family asymmetry that prior reviews flagged in file 99. They are deferred to a future session with cleaner per-unit research. Cayenne 957/958 ZF 6HP and 928 Mercedes 722.3 (record 3 in this file) were never part of the Tiptronic-family record by intent.

**Editorial constraints applied:**
- Cost and prevalence claims require a `_source_anchor` referring to a passage that actually carries the figure.
- Tier A: Porsche AG, PCNA, NHTSA-hosted PCNA TSBs, PCA. Tier B: established specialists with named technical pages. Tier C: forum/owner reports — never sole source for cost or prevalence figures.
- Quotes capped at one per source, fewer than 15 words. Default to paraphrase.
- Numeric claims framed as ranges where sources disagree, never as point estimates the sources don't carry.

---

## Record 1 — G50 second gear pop-out (dog-ring wear)

```yaml
id: g50_second_gear_pop_out
flag_title: G50 second-gear pop-out / dog-ring wear

description: >
  On 1987-and-later air-cooled 911 manuals using the Borg-Warner-synchromesh
  G50 transaxle — including the 5-speed G50/00 in the 3.2 Carrera and 964,
  the G50/20 and G50/21 6-speed in 993 Carrera 2/4, and the G64/51 and G64/52
  6-speed in 993 Turbo and AWD variants — worn dog teeth on the 2nd-gear
  dog ring cause the lever to slip out of 2nd under load, most often on
  upshift roll-off or trailing throttle. The presentation is commonly
  described as "pop-out" and is distinct from synchro-block crunch on
  fast 1-2 shifts, though the same gearbox wears synchros too. Specialists
  emphasise that the dog ring (not the synchro ring) is the failed part
  in the pop-out presentation, and that a 1st/2nd-only repair via dog-ring
  replacement is significantly cheaper than full mainshaft replacement.

  Note on G50/50: this 5-speed unit was fitted only to the 1989 911/930
  Turbo and is the bellhousing-pattern ancestor of the 996/997 Turbo G96.50.
  It is an earlier 5-speed Turbo unit, not a member of the 993 6-speed
  family, and not in scope of the dog-ring pop-out pattern described here.

applicability:
  generation: [911-3.2-carrera, 964, 993]
  engine_family: [air_cooled_911]
  year_range: [1987, 1998]
  trim_category: [carrera, carrera_4, turbo, rs]
  body: [coupe, targa, cabriolet]
  excludes: >
    Pre-1987 911 (915 transaxle, different design).
    Boxster 986/987 (G86 family, mirror of G96 — not G50-derived; see below).
    996/997 standard Carrera (G96.0x, separate family — Lüfteknic and GT40s
    confirm G96 standard Carrera shares no internals with G50).
    The 996/997 Turbo and GT3 use G96.50/.88/.90/.96 boxes that share the
    G50/50 bellhousing pattern but are otherwise different units; they are
    not in scope of this record.

severity: moderate_to_high
  # Full 1st/2nd dog-ring rebuild at California Motorsports Inc starts at
  # $1,895 labour and parts are additional (Tier B). Where dog wear has
  # propagated to the mainshaft or other gears, specialist rebuild moves
  # into the high band.

cost_range_usd:
  first_second_dog_ring_rebuild:
    low: 2500
    high: 5000
    _source_anchor: >
      California Motorsports Inc product page for G50
      rebuild lists labour starting at $1,895 with parts
      additional. Specialist consensus (CMS, Sports &
      Classic UK, Guard Transmission) is that a dog-ring-only
      job is materially less expensive than a full mainshaft
      replacement.
  full_rebuild:
    low: 5000
    high: 9000
    _source_anchor: >
      California Motorsports Inc lists G50 labour starting
      at $1,895; thread-captured specialist quotes for full
      rebuild including gear sets, bearings, and synchros
      run higher. Numeric ceiling kept conservative pending
      a current Tier-B published quote.

prevalence_rate:
  qualitative: common_after_60k_miles
  _source_anchor: >
    Multiple Rennlist and 911uk threads (G50 rebuild,
    "2nd gear pop-out fixed") establish 2nd-gear pop-out
    as a recurring, recognised G50 failure pattern;
    California Motorsports Inc and Guard Transmission
    list 1st/2nd dog-ring repair as a stocked service
    line, supporting routine — not exceptional —
    occurrence. Numeric rate not asserted; no Tier-A
    or published Tier-B prevalence figure is on file.

failure_correlation:
  - 2nd-gear synchro wear (often co-presents)
  - aggressive shifting / track use accelerates dog-ring wear
  - low fluid level or degraded gear oil

typical_failure_mileage_or_age:
  qualitative: typically_after_extensive_use
  _source_anchor: >
    Specialist sources do not publish a single mileage
    figure. Owner reports captured in prior session span
    a wide range; without a Tier-B published threshold
    no numeric value is asserted here.

retrofit_available: true
retrofit_kit_names:
  - California Motorsports Inc 993 G50/20 1st/2nd-gear repair (named dog-ring re-toothing service line for G50/20-G50/33 and G64/51-G64/52)
  - Sports & Classic Ltd full G50 rebuild with proprietary internal modifications (depth of shift sleeves, gear engagement, shift-fork pre-load)
  - Replacement dog ring + 2nd-gear repair (full fix; non-vendor-specific)
  - Guard Transmission gear sets (performance / heavy-duty replacements)

regional_amplification: none_documented

keywords:
  addressed:
    - "G50 rebuilt by [specialist] with dog-ring replacement"
    - "1st/2nd gear repair done at [year/mileage]"
    - "Guard / CMS / Sports & Classic gear set installed"
  concerning:
    - "2nd gear pops out under load"
    - "lever jumps out of 2nd"
    - "have to hold the lever in 2nd"
  active_problem:
    - "trans pops out of 2nd"
    - "won't stay in 2nd gear"
  documented:
    - rebuild invoice from named G50 specialist
    - records of fluid changes and shifter overhauls

evidence_basis:
  tier_a: none_directly_available
  tier_b:
    - California Motorsports Inc product / service pages (G50 rebuild; named 993 G50/20 1st/2nd-gear service line)
    - Sports & Classic Ltd Porsche gearbox repairs page (G50 family rebuild with proprietary internal modifications)
    - Lüfteknic transmission heritage page (G50 history, 5- vs 6-speed)
  tier_c:
    - Rennlist G50 rebuild thread (specialist commentary)
    - 6SpeedOnline gearbox synchro discussion
    - 911uk 2nd-gear pop-out fix thread
    - Design911 G50 synchro parts catalogue

sources:
  - name: California Motorsports Inc — G50 rebuild service
    tier: B
    url_or_reference: californiamotorsports.net/products/cms-g50-993-transmission-rebuild
  - name: California Motorsports Inc — 993 G50/20 1st/2nd-gear repair (named dog-ring re-toothing service)
    tier: B
    url_or_reference: californiamotorsports.net/products/porsche-993-g50-20-1st-2nd-gear-repair
  - name: Sports & Classic Ltd — Porsche gearbox repairs
    tier: B
    url_or_reference: sportsandclassic.com/porsche-gearbox-repairs/
  - name: Lüfteknic — Porsche transmission heritage page
    tier: B
    url_or_reference: lufteknic.com/trans (G50 5- and 6-speed history)
  - name: Rennlist G50 rebuild thread; 6SpeedOnline; 911uk
    tier: C
    url_or_reference: prior-session thread captures

editorial_note: >
  A pop-out condition at inspection should not be treated as a one-step
  fix. Once the dog-ring teeth are sufficiently worn to allow the lever
  to slip out under load, the durable repair is dog-ring replacement
  (or full mainshaft replacement where wear has propagated). Any prior
  symptomatic-only intervention not accompanied by an internal inspection
  should be assumed to have left the underlying wear in place.

  Note: there exists a separate detent-spring-kit ecosystem (notably
  GBox) for the water-cooled Porsche manuals — the G96 Carrera 6-speed
  family and the G86 Boxster 6-speed. That ecosystem is unrelated to
  the air-cooled G50 and is out of scope here; do not extrapolate
  GBox-style detent kit availability or specialist commentary from
  those gearboxes to the G50.

  Important taxonomy point: the failure mode is dog-ring wear, not synchro
  failure in the colloquial sense. Both wear; the "pop-out" presentation
  is specifically dog-tooth-related.

buyer_questions:
  - When was the gearbox last serviced? What fluid is in it?
  - Has 2nd ever popped out, even occasionally? Under what conditions?
  - Has any 1st/2nd repair been done? By whom? Is there an invoice?
  - If a "detent" or "spring" repair was claimed, was it actually a G50 internal repair (dog-ring) — or has someone confused this G50 with a 996/997 G96 fix?
```

---

## Record 2 — PDK 7DT45 / 7DT70 mechatronic, sensor & clutch-pack failure

```yaml
id: pdk_7dt_mechatronic_failure
flag_title: PDK (7DT45 / 7DT70) mechatronic, internal sensor, and clutch-pack failure

description: >
  The Porsche-marketed PDK in 911 / Cayman / Boxster from 2009 onward is the
  ZF 7DT45 (Carrera, Cayman, Boxster) and ZF 7DT70 (911 Turbo) — a wet
  dual-clutch 7-speed unit. The mechanical (gear-stack) section is
  generally robust; the documented failure modes cluster around (a) the
  internal speed and shift-fork-position sensors, (b) valve body and
  pressure-control solenoids in the mechatronic, (c) clutch-pack wear or
  fluid contamination, and (d) clutch-pressure sensors. Porsche's dealer
  channel has historically replaced the entire transmission as the
  prescribed remedy; specialists (MC² Autosport, BRR Performance,
  T-Design9, JUMPS, LN Engineering) now offer module-level repair at a
  small fraction of replacement cost. Porsche's recommended fluid interval
  has been revised from "lifetime" at launch to 4 years / 40,000 miles
  per multiple specialist sources.

applicability:
  generation: [997.2, 991.1, 991.2, 992.1, 992.2, 987.2, 981, 718]
  engine_family:
    - water_cooled_flat_six_DFI  # 991/981/718/997.2 with PDK
    - water_cooled_flat_four_turbo  # 718 four-cyl with PDK
  year_range: [2009, 2024]
  trim_category: [carrera, carrera_s, gts, turbo, gt3_with_pdk, boxster, cayman]
  body: [coupe, cabriolet, targa, roadster]
  excludes: >
    - Macan PDK is the Audi-derived DL501 (0B5) S-Tronic, built at VW Kassel,
      not a ZF 7DT. Multiple specialist analyses (BRR Performance; long-form
      Macan-forum threads citing former Porsche AG R&D head Wolfgang Hatz)
      confirm Macan PDK is mechanically distinct from the 911/Cayman/Boxster
      PDK. PCA's published tech Q&A lists the Macan as ZF 7DT75 and includes
      the Cayenne under PDK; both points are inconsistent with broader
      specialist evidence and the Cayenne never used PDK at all (it uses
      ZF 6HP / 8HP automatics). The Macan DL501 has its own failure profile
      (mechatronic shift-fork sludge, K1/K3 clutch issues, conductor-plate
      faults) and is not represented by this record. Treat as a separate
      future record.
    - Panamera PDK is reported by some sources (PCA, BRR) as a different
      ZF 7DT-family unit (7DT75); failure data on it is thin in the
      sources reviewed. Not in scope of this record.
    - Cayenne does not use PDK in any generation. Cayenne 957/958 use ZF 6HP
      automatics; Cayenne 9YA uses ZF 8HP. See file 12 / future Tiptronic
      records.

severity: high_to_catastrophic
  # Sensor-only repair at a specialist falls in moderate-to-high.
  # Dealer-prescribed transmission replacement is catastrophic.
  # Clutch-pack or valve-body work removed-from-car is high.

cost_range_usd:
  dealer_replacement:
    low: 20000
    high: 30000
    _source_anchor: >
      PCarwise PDK common problems page states dealer
      replacement is "north of $25,000" for 911/Cayman/Boxster
      and "$20K+" for the Macan. Multiple Rennlist
      contributors corroborate quotes in this band.
  specialist_sensor_repair:
    low: 1500
    high: 4500
    _source_anchor: >
      T-Design9 PDK speed sensor and Botong Auto Electronics
      shift-fork position sensor list parts at roughly
      $1,099-$1,599. Removing the gearbox and replacing the
      sensors with re-calibration is required (BRR
      Performance walkthrough); total labour adds materially
      but stays well below dealer-replacement quotes per
      specialist consensus.
  valve_body_or_clutch_pack:
    low: 4000
    high: 12000
    _source_anchor: >
      PCarwise specialist commentary: valve-body replacement
      does not require trans removal; clutch-pack does.
      No published Tier-B point estimate captured; this band
      reflects the consistent specialist framing of "fraction
      of dealer replacement" rather than a single quoted figure.

prevalence_rate:
  qualitative: sensor_failure_described_as_commonplace_by_specialists
  _source_anchor: >
    PCarwise: internal sensor failure described as a
    common cause of dashboard messages and limp-mode behaviour;
    BRR Performance describes the same failure mode and the
    dealer's typical "replace the transmission" response.
    No Tier-A prevalence figure is on file.

failure_correlation:
  - skipped fluid changes (worse on cars run on the original "lifetime" interval)
  - track-day use (over-temperature events on 997.2/987.2 cars without gear-oil cooler)
  - fluid intermix from incorrect fill or broken axle-shaft seal
  - hot-climate operation (multiple specialists flag heat as accelerator)

typical_failure_mileage_or_age:
  qualitative: highly_variable
  _source_anchor: >
    No published Tier-A or Tier-B mileage threshold;
    failures reported across a broad range. PCarwise notes
    Porsche maintenance recommendations have been revised
    downward over time (originally "lifetime", now 4 yr /
    40k mi per multiple specialist sources).

retrofit_available: true
retrofit_kit_names:
  - JUMPS PDK speed and distance sensor set (fully assembled)
  - T-Design9 PDK speed sensor / distance sensor
  - Botong Auto Electronics shift-fork position sensor
  - 997.2 PDK temperature sensor (Porsche P/N 997.612.930.01; addresses P0711 / P172D codes; replacement does not require transmission removal per Rennlist 997-forum guide)
  - Dodson Motorsport upgraded PDK clutch packs (high-torque / track-use applications)
  - LN Engineering PDK clutch fluid heat exchanger (track-use upgrade)

regional_amplification: hot_climate_operation_accelerates_fluid_degradation

keywords:
  addressed:
    - "PDK serviced at [4yr / 40k mi]"
    - "fluid changed at [specialist]"
    - "PDK speed/distance sensor replaced by [MC² Autosport / BRR / specialist]"
  concerning:
    - "PDK 'lifetime' fluid never changed"
    - "warning lights cleared without diagnosis"
    - "limp-mode events in service history"
  active_problem:
    - "transmission warning message"
    - "PDK won't engage reverse"
    - "stuck in current gear / no shifts"
    - "shudder under shift"
  documented:
    - PIWIS read-out with fault codes
    - specialist invoice for sensor work
    - LN Engineering heat exchanger install records (track cars)

evidence_basis:
  tier_a: none_directly_on_file
  tier_b:
    - PCarwise PDK common-problems pages
    - BRR Performance "PDK Now Repairable" technical write-up
    - Beck's European (Atlanta) PDK distance-sensor repair page with named Porsche P/Ns
  tier_c:
    - PCA tech Q&A submission on PDK manufacture (named individual contributor on a club Q&A page; ZF/Macan claim disputed by other Tier-B sources, Cayenne-as-PDK claim factually wrong)
    - Planet-9 forum (specific OBD-code cases including P1768/P1764)
    - PCGB forum (clutch-2 slipping case, 100k+ miles, 4S)
    - Rennlist 997-forum PDK repair guide

sources:
  - name: PCarwise — PDK transmission problems
    tier: B
    url_or_reference: pcarwise.com/local-help/porsche-common-problems/porsche-pdk-transmission-problems
  - name: PCarwise — PDK repairs
    tier: B
    url_or_reference: pcarwise.com/local-help/pdk-repairs
  - name: BRR Performance — Porsche PDK Transmission Now Repairable
    tier: B
    url_or_reference: brrperformance.com/porsche-pdk-transmission-now-repairable
  - name: Beck's European (Atlanta) — Porsche PDK transmission failure solved (T-Design parts; named Porsche P/Ns 0501325775, 0501327105, 0501324703; warning text "Transm. fault. Poss. no R gear. Drive on poss.")
    tier: B
    url_or_reference: beckseuropean.com/porsche-pdk-transmission-failure-solved/
  - name: T-Design9 — PDK speed sensor product page
    tier: B
    url_or_reference: t-design9.com/porsche_PDK_speed_sensor.html
  - name: PCA tech Q&A submission — "Pdk Is It Really a Zf Transmission" (community-contributed Q&A from named individual; not authoritative Porsche/PCA editorial content)
    tier: C
    url_or_reference: pca.org/tech/pdk-is-it-really-a-zf-transmission-1533088574
  - name: Rennlist 997-forum PDK repair guide
    tier: C
    url_or_reference: rennlist.com/forums/997-forum/1172826-guide-to-repairing-a-pdk-transmission.html

editorial_note: >
  Important taxonomic note. A community-submitted Q&A on PCA's website
  ("Pdk Is It Really a Zf Transmission", a single user-contributed entry
  from a named individual on the club's Q&A page) lists three ZF variants
  (7DT45 / 7DT70 / 7DT75) and assigns the 7DT75 to the Panamera, Macan,
  and Cayenne. The Cayenne assignment is factually wrong (Cayenne uses
  ZF 6HP / 8HP traditional automatics, never PDK). The Macan assignment
  is contradicted by independent specialists (BRR Performance; long-form
  Macan-forum threads citing former Porsche AG R&D head Wolfgang Hatz)
  who establish that the Macan transmission is the Audi DL501, built at
  VW Kassel. This record is therefore deliberately scoped to the
  911 / Cayman / Boxster 7DT45 and 7DT70 only. The PCA Q&A entry is
  retained as a Tier-C reference documenting that the community-level
  confusion exists, not as an authority for cross-platform applicability.

  The 991 (launched MY2012) received an early-life addition of a gear-oil
  cooler and an associated gear-oil temperature sensor; the 981 launched
  in MY2013 with the cooler fitted as standard. BRR Performance describes
  these as part of a 2013-vintage update set including sealed clutch
  revisions and an optional locking differential. The 991.2 PDK
  introduced in 2017 is described by BRR Performance as substantially
  changed; caution applying older 7DT45 specifics to 991.2 / 992 cars.

  Cross-platform note on the Macan DL501. Buyers shopping a Macan should
  not extrapolate either failure pattern in either direction. The DL501's
  documented failure profile (mechatronic shift-fork sludge, K1/K3 clutch
  pack issues, conductor-plate faults — per BRR Performance and Macan-
  forum threads) is materially different from the 7DT45/7DT70's sensor /
  valve-body / clutch-pack / flywheel pattern described above. A future
  Macan-specific record will treat the DL501 separately.

buyer_questions:
  - When was the PDK fluid last changed? With what fluid? On what interval?
  - Are there any stored fault codes? (PIWIS read-out is the only reliable answer.)
  - Has the car ever had a "transmission warning" message? When? What was done?
  - Has the car been tracked? If so, was a gear-oil cooler retrofitted on a 997.2 / 987.2?
  - Is there an invoice for any sensor or mechatronic work outside the dealer channel?
```

---

## Record 3 — Porsche 928 Mercedes-derived four-speed automatic (722.3 / A28)

```yaml
id: m928_722_3_automatic
flag_title: 928 four-speed automatic — Mercedes 722.3 internals, vacuum-modulated, hydraulic-mechanical

description: >
  The 928's optional automatic from 1983 (NA) / 1984 (RoW) onward is a
  Porsche transaxle housing the internals of the Mercedes-Benz 722.3
  4-speed (Porsche internal designation A28; a 3-speed A22, derived from
  Mercedes 722.0/.1/.2, was used 1978-1982). It is a hydraulic-mechanical
  unit with a vacuum modulator — pre-electronic in the modern sense.
  Failure modes follow the Mercedes 722.3 family: brake-band wear in
  B1/B2 (forward gears) and reverse-clutch (B3 multi-disc clutch pack)
  wear — with B3 piston spring and clutch-pack disc wear the canonical
  reverse-failure mode in the 4-speed unit. (B3 is a band in the 3-speed
  predecessor 722.0/.1/.2 but a multi-disc clutch in the 4-speed 722.3;
  some sources colloquially still refer to "B3 band" in the 4-speed,
  which is technically inaccurate.) Other modes: modulating-pressure
  drift requiring vacuum-modulator adjustment, valve-body wear and slow
  shifts (3-4 and D-R particularly), torque-converter pump seal leaks
  at the bellhousing, and (on later cars) governor-pressure issues. The
  unit is rebuildable by Mercedes-722.3-experienced specialists; the
  case, oil pan,
  and certain hose/fitment items are Porsche-specific because of the
  transaxle layout.

applicability:
  generation: [928_S2, 928_S4, 928_GT, 928_GTS]  # automatic-equipped only; 928_S3 does not exist as a model
  engine_family: [m928_v8]
  year_range: [1983, 1995]   # 4-speed era; 3-speed (1978-1982) is a separate predecessor unit
  trim_category: [928, 928_S, 928_S2, 928_S4, 928_GTS]  # GT was manual-only in most markets
  body: [coupe]
  excludes: >
    1978-1982 928 with 3-speed automatic (A22 / Mercedes 722.0/.1/.2 family)
    is mechanically distinct from the 4-speed and is not in scope of this
    record. 928s with 5-speed manual transaxle (G28-family) are unrelated.
    Mercedes 722.6 (5-speed electronic, used in 996 Turbo and 996.2/997.1
    Tiptronic) and 722.9 (7G-Tronic) are entirely different units;
    do not extrapolate failure modes from those records to the 928.

severity: moderate_to_high
  # Modulator adjustment: low. Valve-body service or shift-kit install:
  # moderate. Full rebuild with brake-band and clutch-pack work and labour
  # to remove and replace the transaxle: high.

cost_range_usd:
  modulator_or_band_adjustment:
    low: 200
    high: 600
    _source_anchor: >
      Porsche-928-Repair workshop guide (porscherepair.us)
      lists modulating-pressure check and brake-band B3
      adjustment as standard diagnostic / corrective steps.
      Numeric range reflects shop-time-only work; not a
      published Tier-B figure.
  valve_body_service_or_shift_kit:
    low: 600
    high: 1500
    _source_anchor: >
      Multiple 928 specialists (Precision Motorwerks, others)
      list valve-body rebuild and shift-kit modifications;
      no single Tier-B published price captured. Range is
      conservative pending current specialist quote.
  full_rebuild:
    low: 3000
    high: 7000
    _source_anchor: >
      A 2005-era Rennlist quote captured a $4K rebuild at
      an independent shop and a $1,995 reman from 928
      International. Those are dated; modern equivalents
      should be expected materially higher. Range is widened
      and labelled accordingly until a current Tier-B figure
      is available.

prevalence_rate:
  qualitative: wear_items_universal_at_high_mileage
  _source_anchor: >
    Specialist consensus (928srus, Precision Motorwerks,
    Rennlist 928-forum threads) treats brake-band wear,
    modulating-pressure drift, and torque-converter seal
    leakage as routine 100k+ mile service items. Numeric
    rate not asserted; no Tier-A figure is on file.

failure_correlation:
  - high mileage (150,000 km / ~93,000 mi typical for first major service per captured PFF case)
  - long periods of disuse (vacuum lines, modulator deterioration)
  - never-changed ATF (the original manual specification was extended-interval)
  - leaking vacuum modulator pulling ATF into the intake manifold (signal: blue smoke, low ATF)

typical_failure_mileage_or_age:
  qualitative: typically_after_100k_miles_or_extended_disuse
  _source_anchor: >
    PFF.de captured case: 1989 S4 with B3 reverse-clutch
    failure (multi-disc pack, not a band — the 4-speed 722.3
    uses a clutch here) at approximately 150,000 km. Single
    anecdote; broader specialist framing supports
    "high-mileage wear item" rather than a defined threshold.

retrofit_available: true
retrofit_kit_names:
  - Sonnax 722.6-line valves and components that cross-fit selected 722.3 parts (Sonnax does not publish a dedicated 722.3 valve-body kit)
  - ATSG-style master overhaul kits with K1/K2/B3 friction sets
  - Mario Aristides B3 Reverse Delay Kit (per Transmission Digest, September 2001)
  - Precision Motorwerks 928-specific valve-body modifications and economy band/clutch sets
  - Porsche / Mercedes 722.3 brake bands and clutch packs from rebuilders

regional_amplification: none_documented

keywords:
  addressed:
    - "transaxle rebuilt by [specialist] at [mileage]"
    - "vacuum modulator replaced / adjusted"
    - "brake bands and clutch pack done"
    - "ATF and filter changed at [interval]"
  concerning:
    - "ATF black or smelling burnt"
    - "metal in pan"
    - "slow 3-4 or D-R shift"
    - "delayed reverse engagement"
  active_problem:
    - "no reverse"
    - "slips in 3rd / 4th"
    - "judders / vibrates from a stop"
    - "won't shift up at speed"
  documented:
    - rebuild invoice from named 722.3 / 928 specialist
    - vacuum-modulator service record
    - ATF / filter replacement history

evidence_basis:
  tier_a: none_directly_on_file
  tier_b:
    - Porsche-928-Repair / porscherepair.us workshop-style troubleshooting page
    - 928srus, 928 International, Precision Motorwerks, California Motorsports — 928 transmission specialists with named service offerings
    - Wikipedia summary of Mercedes-Benz 4G-Tronic (722.3) torque ratings and production dates (cross-reference only)
  tier_c:
    - Rennlist 928-forum rebuild and identification threads (including the GTS reverse-gear B3-clutch DIY)
    - PFF.de 1989 S4 B3 reverse-clutch failure case
    - 928oc.org auto-gearbox-upgrade discussion (specialist confirmation that valve body / case is Porsche-specific)
    - Transmission Digest (September 2001) — 722.3/722.4/722.5 reverse-engagement note (cross-reference only)

sources:
  - name: porscherepair.us — 928 automatic transmission troubleshooting
    tier: B
    url_or_reference: porscherepair.us/porsche-928-repair/troubleshooting-automatic-transmission.html
  - name: California Motorsports Inc — 928 transmission rebuild
    tier: B
    url_or_reference: californiamotorsports.net/products/cms-928-transmission-rebuild
  - name: Precision Motorwerks — 928 transmission parts
    tier: B
    url_or_reference: precisionmtrwerks.com/products/products.htm
  - name: 928srus — 928 transmission catalogue
    tier: B
    url_or_reference: 928srus.com/collections/transmission
  - name: 928 International — 928 transmission rebuilds and exchange units (long-running 928 specialist)
    tier: B
    url_or_reference: 928intl.com (named in Rennlist 928-forum threads as primary exchange-unit source)
  - name: Rennlist 928 forum — GTS reverse-gear B3-clutch replacement DIY (B3 multi-disc clutch in 4-speed; band in 3-speed)
    tier: C
    url_or_reference: rennlist.com/forums/928-forum/853730-gts-reverse-gear-b3-clutch-replacement-diy.html
  - name: Rennlist — "Did Mercedes manufacture the complete 928 automatic transmissions?"
    tier: C
    url_or_reference: rennlist.com/forums/928-forum/476960
  - name: PFF.de — 1989 S4 automatic case
    tier: C
    url_or_reference: pff.de/en/thread/2820316
  - name: Wikipedia — Mercedes-Benz 4G-Tronic transmission (cross-reference only)
    tier: B
    url_or_reference: en.wikipedia.org/wiki/Mercedes-Benz_4G-Tronic_transmission

editorial_note: >
  Do not conflate the 928's hydraulic-mechanical 722.3 with the
  electronically-controlled Mercedes 722.6 used in the 996 Turbo and
  later Carrera Tiptronics — they are different units with different
  failure modes (722.6 has TCU-integrated valve-body assemblies; 722.3
  uses a vacuum modulator and has no integrated electronic control).

  A vacuum-modulator failure is the canonical "hidden" 928 transmission
  problem because the failed modulator can pull ATF into the intake
  manifold, presenting first as engine smoke and ATF loss rather than
  obvious transmission misbehaviour.

  Spring 1987 produced a valve-body shift-program revision allowing
  2nd-gear starts under specific conditions on later 928s; the change
  matters for shift-kit selection and for diagnosing
  "1st-gear-start-but-shouldn't-be" complaints on conversion candidates.

buyer_questions:
  - When was the ATF and filter last changed? What ATF was used?
  - Is there any history of vacuum-modulator service or replacement?
  - Has the transaxle ever been rebuilt? By whom? Is there an invoice?
  - Any history of blue smoke or unexplained ATF loss?
  - On a road test, do 3-4 and D-R shifts complete promptly? Any flare?
```

---

## Record 4 — Cayenne 958 (and Macan 95B) "hang-on" transfer gear failure

```yaml
id: cayenne_958_transfer_gear
flag_title: Cayenne 958 / Macan 95B transfer gear ("hang-on") — Porsche extended-warranty defect

description: >
  The hang-on transfer gear (Porsche PART ID 3965) used in 2011-2018
  Cayenne 92A and 2014-2018 Macan 95B exhibits long-term durability
  issues acknowledged by Porsche AG in two stages. In 2016, TSB 96/16
  introduced an "optimised" transfer case from production week 31/2016,
  with conversion of pre-production-change units required before
  installation in customer vehicles (new vent connection, new front-output
  protective ring, retrofit vent line). The post-2016 design
  incorporates GNC (gas nitrocarburised) coated plates as the
  metallurgical fix to the underlying wear mechanism. In 2020, Porsche
  issued formal warranty extensions: TSB 83/20 extended Cayenne 2011-2014
  transfer-gear warranty to 10 years / unlimited mileage; separate
  letters extended Cayenne 2015-2018 and Macan 2014-2018 to 7 years /
  unlimited mileage. Porsche's own published mechanism description
  attributes the failure to contaminated transmission oil that, over
  the vehicle's service life, induces a stick-slip condition on the
  internal disc pack. Symptoms reported by owners include shudder under
  acceleration, a sensation resembling driving over expansion joints,
  low-speed binding under tight steering lock, and reverse-direction
  shudder. A class action (Kohanof v. Porsche Cars North America,
  Central District of California, June 2024) alleges replacement units
  have failed in service and that the warranty extension is inadequate.

applicability:
  generation:
    - cayenne_958   # 2011-2014 Phase 1 (10-year warranty extension); 2015-2018 Phase 2 (7-year warranty extension)
    - macan_95B     # 2014-2018 Phase 1 (7-year warranty extension)
  engine_family:
    - cayenne_v6_3_6_NA       # MA1 V6 / VR6 (manual VR6 also affected per TSB 96/16)
    - cayenne_v8_4_8_NA_or_TT  # M48 V8 base / S / GTS / Turbo / Turbo S
    - cayenne_v8_diesel_4_2    # S Diesel
    - cayenne_v6_3_0_diesel    # MY-applicable Cayenne diesels
    - macan_95B_engines       # all engine variants in Macan 95B 2014-2018
  year_range: [2011, 2018]
  trim_category: [base, S, GTS, turbo, turbo_S, S_diesel, platinum_edition]
  body: [SUV_5dr]
  excludes: >
    Cayenne 957 (pre-2011, the prior generation) is not covered by this
    warranty extension and uses a different drivetrain layout — out of scope.
    Cayenne 9YA (2019 model year onward, 3rd generation) uses an entirely
    different transfer-case architecture on the MLB-Evo platform shared
    with Touareg III / Q7 II / Bentayga — not the Magna PL72-derivative
    hang-on unit covered by TSB 83/20 — and is not in scope of this
    record. 2019+ Macan with revised transfer case (per PCarwise Macan
    buyers-guide commentary) is reported less affected and is not
    extended-warrantied. The transfer gear is unrelated to the PDK
    transmission itself in the Macan — failures of one do not imply
    failures of the other.

severity: high
  # Out-of-warranty replacement of the transfer gear alone runs in the
  # mid-thousands; cascade failure to the front differential pushes the
  # repair into the high band per Rennlist captured cases.

cost_range_usd:
  in_warranty:
    low: 0
    high: 0
    _source_anchor: >
      TSB 83/20 (Porsche, August 3, 2020, NHTSA-hosted)
      establishes Porsche-paid coverage for in-warranty
      claims; multiple Cayenne-forum and Macan-forum cases
      report $0 dealer-billed replacements during the
      extended warranty period. Out-of-pocket repairs
      previously paid are reimbursable per Porsche's
      published statement.
  out_of_warranty_transfer_gear_only:
    low: 3000
    high: 6000
    _source_anchor: >
      Rennlist Cayenne 958 forum case: $3,700 transfer
      case replacement (2011 CTT). Carscoops / class-action
      coverage cites a 2016 Cayenne owner quoted ~$5,000
      by an independent. CarComplaints aggregation supports
      this band. eBay reman units are listed at lower
      figures but are out of scope for OE-grade pricing.
  out_of_warranty_with_front_diff_cascade:
    low: 6500
    high: 12000
    _source_anchor: >
      Rennlist captured case: $3,700 transfer case +
      $3,200 front differential (the latter taken out by
      transfer-case failure) — totalling ~$6,900 before
      tax. Owner reported a combined service event of
      ~$12,420 once unrelated 100k items were rolled in.

prevalence_rate:
  qualitative: porsche_acknowledged_durability_issue_warranty_extended_industry_wide
  _source_anchor: >
    Porsche TSB 83/20 (Cayenne 2011-2014) and the
    corresponding 2015-2018 Cayenne and 2014-2018 Macan
    warranty letters extend coverage to all VINs in the
    affected MY ranges, citing transfer-gear long-term
    durability below Porsche's quality standards. The
    universal scope of the extension is itself the
    Tier-A prevalence anchor; a per-vehicle failure rate
    is not published.

failure_correlation:
  - skipped or never-performed transfer-case fluid changes (Porsche's published mechanism: dirty transmission oil → stick-slip in disc pack)
  - 2017 oil-specification change from 000-043-301-36 to 000-043-305-63 (alleged in class action to mask rather than cure the underlying defect — allegation, not established fact)
  - tight-radius low-speed manoeuvres reveal symptoms earliest

typical_failure_mileage_or_age:
  qualitative: variable_often_within_extended_warranty_window
  _source_anchor: >
    Captured cases span ~14k miles (early Macan failure)
    to 90k+ miles. The class-action plaintiff's 2016
    Cayenne began symptoms in late 2023 at under 60,000
    miles. No single mileage threshold is defensible.

retrofit_available: partial
retrofit_kit_names:
  - Production-change "optimised" transfer case from week 31/2016 onward (per TSB 96/16; carries GNC gas-nitrocarburised coated plates as the metallurgical fix)
  - Conversion kit per TSB 96/16 (vent connection, front-output protective ring, vehicle-side vent line) for installing pre-change transfer cases
  - Specialist fluid changes (TRIAX DTF-1, Ravenol — not a Porsche-endorsed remedy; symptomatic mitigation only)

regional_amplification: none_documented

keywords:
  addressed:
    - "transfer case replaced under extended warranty"
    - "TC fluid changed at [specialist]"
    - "post-week-31/2016 'new style' transfer case fitted"
  concerning:
    - "shudder accelerating from a stop"
    - "feels like driving over expansion joints"
    - "binding turning into / out of parking"
    - "shudder in reverse"
  active_problem:
    - "transfer case warning / drivetrain message"
    - "kicking, jerking, bouncing"
    - "limp-mode AWD events"
  documented:
    - dealer record showing TC replacement under warranty
    - Porsche extended-warranty letter for the VIN
    - record of TSB 96/16 conversion or post-change unit fitment

evidence_basis:
  tier_a:
    - Porsche TSB 83/20 (Cayenne 2011-2014, 10-year extension; NHTSA-hosted)
    - Porsche TSB 96/16 (production-change "optimised" transfer case from week 31/2016; conversion procedure for older units; NHTSA-hosted)
    - Porsche regional warranty page describing the failure mechanism (now 404 on Taiwan domain; preserved in news quotation)
  tier_b:
    - PCarwise news article on transfer-case warranty extension
    - CarComplaints class-action coverage with linked warranty letters
    - Carscoops class-action coverage including Porsche's own mechanism description
  tier_c:
    - Rennlist Cayenne 958 forum (warranty extension thread, repair-cost case)
    - Cayenne and Macan forum threads (symptomatic descriptions, fluid-change mitigation reports)

sources:
  - name: Porsche TSB 83/20 — Extended Warranty for Transfer Gear (Cayenne 2011-2014)
    tier: A
    url_or_reference: static.nhtsa.gov/odi/tsbs/2020/MC-10179194-0001.pdf
  - name: Porsche TSB 96/16 — Instructions for Converting the Transfer Case to the New Style
    tier: A
    url_or_reference: static.nhtsa.gov/odi/tsbs/2016/MC-10119330-9999.pdf
  - name: PCarwise — "Porsche Extends Transfer Case Warranty for Cayenne & Macan"
    tier: B
    url_or_reference: pcarwise.com/news/porsche-extends-transfer-case-warranty
  - name: CarComplaints — class-action coverage with linked warranty letters
    tier: B
    url_or_reference: carcomplaints.com/news/2024/porsche-transfer-case-warranty-lawsuit.shtml
  - name: Carscoops — class-action coverage citing Porsche failure mechanism
    tier: B
    url_or_reference: carscoops.com/2024/06/porsche-hit-with-class-action-lawsuit-over-faulty-transfer-case-in-cayenne-and-macan
  - name: Rennlist Cayenne 958 forum — Transfer Case Warranty Extension thread
    tier: C
    url_or_reference: rennlist.com/forums/cayenne-958-2011-2018/1213363-transfer-case-warranty-extension.html

editorial_note: >
  This is one of the cleanest Tier-A-anchored records in the catalogue:
  Porsche has issued a formal warranty extension via NHTSA-published TSB,
  acknowledged the failure mechanism in writing, and produced an
  earlier production-change TSB (96/16) showing the design was already
  being revised in 2016. Buyers should treat any 2011-2018 Cayenne and
  2014-2018 Macan as having a documented transfer-gear risk — the
  question is whether (a) the unit is still in the extended-warranty
  window for that VIN, (b) replacement has already been performed under
  warranty (and how recently), and (c) the post-2016 "optimised" unit
  has been fitted. Multiple replacements on a single VIN have been
  reported (e.g., a 2016 GTS on its fourth transfer case in the captured
  Rennlist class-action thread) — a single replacement under warranty
  is not a guarantee against future failure.

  Technical detail on the design change. The post-week-31/2016
  "optimised" transfer case carries gas-nitrocarburised (GNC) coated
  internal plates — this is the metallurgical change underlying the
  TSB 96/16 procedural revisions (vent line, protective ring) and is
  the specific material-level fix Porsche applied to the disc-pack
  wear mechanism. Plate coating is the "what actually changed" answer
  behind the procedural conversion described in the TSB.

  The 2017 transfer-case oil specification change (from 000-043-301-36
  to 000-043-305-63) is alleged in the class action to have masked rather
  than cured the underlying defect. That is a plaintiff allegation, not
  an established fact, and is recorded here as such.

  Cross-platform note: the Macan 95B failure profile parallels the
  Cayenne in symptoms and remedy under warranty, which is why both fall
  under the same Porsche action. The Macan PDK transmission (DL501) is
  a separate concern entirely (see record 2 editorial note and future
  Macan-specific records).

buyer_questions:
  - What is the VIN's transfer-gear warranty expiration date per Porsche dealer lookup?
  - Has the transfer case ever been replaced? When? At what mileage? Under warranty or paid?
  - Has the transfer-case fluid ever been changed? With what fluid? At what intervals?
  - If pre-week-31/2016 manufacture, has the TSB 96/16 conversion been performed?
  - On a low-speed road test, is there shudder under acceleration from a stop, expansion-joint feel on straight pulls, or binding under tight steering lock?
  - For 2015-2018 Cayenne and 2014-2018 Macan: has the owner registered any transfer-case complaint with PCNA that did not result in a warranty repair? (Relevant to the active class action.)
```

---

## Cross-references

- **Record 1 (G50)** — Air-cooled engine and gearbox files (file 03) cross-reference for full G-series / 964 / 993 manual ownership context. The G50/50 (1989 911/930 Turbo only, 5-speed) is the bellhousing-pattern ancestor of the 996/997 Turbo G96.50; it is not a 993-family box and is not in scope of the dog-ring pop-out pattern in this record.
- **Record 2 (PDK)** — Self-contained record. PDK is a transmission concern not requiring engine-side companion records; the 718's MA1 four-cylinder context is out of scope of the 7DT45/7DT70 failure pattern. Macan PDK (DL501) belongs in a separate future record. Cayenne never used PDK.
- **Record 3 (928 auto)** — File 05 (928 V8 engine) cross-references; the 928 manual (G28-family) and the torque tube / flex-plate items belong with chassis (file 10) when authored.
- **Record 4 (Cayenne 958 / Macan 95B transfer gear)** — File 06 (Cayenne V8) and a future Cayenne V6 / Macan engine file cross-reference for engine-side context. Cayenne 957 (prior generation) is out of scope for this record but has its own drivetrain issues (rear coolant pipe, file 12 candidate).

## Items deferred from this file

- **Tiptronic A96-family in 964/993** — needs targeted research on selector-input-shaft seal leak (P/N 0099974847 → 00699701447) and any associated warranty / TSB history. Tier-A search not yet performed.
- **ZF 5HP-19 (A96.00) Tiptronic in 996.1 Carrera and 986 Boxster** — distinct unit from the later Mercedes 722.6 Tiptronic; needs its own record covering valve-body wear, TCU O-ring leak, and the documented dealer-channel "non-repairable" position versus specialist rebuild scope.
- **Mercedes 722.6 Tiptronic in 996 Turbo, 996.2 Carrera, 997.1 Carrera, and Cayenne 957** — separate unit from the 928's 722.3 (this file's record 3) and from the 5HP-19. Distinct failure modes (transfer-case gasket leak induced by failed transmission mounts on 996TT, conductor-plate/TCU faults shared with the wider Mercedes 7G family). Needs its own record.
- **ZF 6HP in Cayenne 957 / 958** — distinct from the Tiptronic family above; widely shared with VAG and BMW platforms. Specific failure modes (mechatronic, valve body) need their own anchor.
- **Cayenne wheel-speed sensor warranty extension (TSB 122-19, 10-year unlimited mileage on Cayenne 2011-2018)** — parallel Porsche extended-warranty action on the same generation as the transfer-gear extension. Not a transmission item and out of scope of this file, but indicates a pattern of MY2011-2018 extended-warranty actions that buyers should consider as a constellation when assessing a 92A Cayenne. Cross-reference candidate for the chassis or electrical files (10 / 11) when authored.
- **Macan DL501 (S-tronic) failure profile** — referenced for boundary-setting in record 2's editorial note. Documented failure modes (mechatronic shift-fork sludge, K1/K3 clutch issues, conductor-plate faults) belong in a future Macan-specific record and should not be conflated with the 7DT45/7DT70 PDK pattern.

## Schema-extension queue (carry to `00_schema.md` v2 candidates)

- **Multi-platform records** (e.g., the Tiptronic deferral question) need a `transmission_supplier_variant` enum that lets a single car carry one of several sub-platform identifiers. Currently the schema flattens this distinction into prose.
- **Tier-A documentation retrieval status**: distinguish "Tier A direct document on file" from "Tier A communication referenced via Tier B publication." Both currently end up labelled `tier: A`. Candidate refinement: `tier_a_doc_retrieved: true | referenced_only`.
- **Repair scope vs replacement scope** as separate first-class fields. Currently `cost_range_usd` accepts multiple keys, but reviewers benefit from explicit `repair_scope` vs `replacement_scope` distinction (see record 2: dealer-replacement north of $25,000 vs specialist component-level repair).
- **Negative applicability (`excludes`)** is doing more work than the schema treats it as. In record 4 in particular, four exclude lines do essential scoping work; worth elevating from afterthought to first-class.
