# 10 — Chassis & Suspension

**Scope:** Suspension and chassis defects across the Porsche range with sufficient Tier A or B grounding to assert prevalence, cost, and applicability with confidence. Engine-mounted accessory drives belong to engine-family files (01–06); transmissions and final drives to file 09; cooling-system items to file 12 (when authored). This file covers control-arm and ball-joint wear, air-suspension durability, brake-disc replacement economics on PCCB-equipped cars, and steering-rack sealing on the 928.

**Records in this file (5):**

1. `water_cooled_911_boxster_cayman_lower_control_arm` — 996/997/986/987 front and rear lower control arm: thrust-arm bushing wear and integrated ball-joint failure
2. `cayenne_air_suspension` — Cayenne 955/957/958 air-suspension compressor, strut, and valve-block failures
3. `pccb_carbon_ceramic_disc_replacement` — Porsche Ceramic Composite Brake disc wear and replacement economics on PCCB-equipped cars
4. `928_lower_ball_joint_aluminum` — 928 aluminum lower ball-joint support failure (pre-September-1983 cars) and routine ball-joint wear (later cars)
5. `928_power_steering_rack_leak` — 928 ZF power-steering rack outer-seal leak and pump cascade

**Editorial constraints applied (mirroring file 09):**
- Cost and prevalence claims require a `_source_anchor` referring to a passage that actually carries the figure.
- Tier A: Porsche AG, PCNA, NHTSA-hosted PCNA TSBs, PCA editorial. Tier B: established specialists with named technical pages (Pelican Parts, Tarett Engineering, Elephant Racing, FCP Euro, Essex Parts, Surface Transforms, Rennlist editorial how-tos, Stuttcars, 928 International, Precision Motorwerks). Tier C: forum threads and named-individual community contributions — never sole source for cost or prevalence figures.
- Direct quotation capped at one per source, fewer than 15 words. Default to paraphrase.
- Numeric claims framed as ranges where sources disagree; never as point estimates the sources do not carry.
- Where a record spans cars equipped with an *option* (PCCB, air suspension), applicability lists the generations and trims on which the option was offered, and editorial framing carries the "only when factory-equipped" qualifier.

---

## Record 1 — 996/997/986/987 lower control arm: thrust-arm bushing wear and ball-joint failure

```yaml
id: water_cooled_911_boxster_cayman_lower_control_arm
flag_title: 996/997/986/987 lower control arm — thrust-arm bushing wear and integrated ball-joint failure

description: >
  The water-cooled 911, Boxster, and Cayman use a multi-link front and
  rear lower-suspension layout in which the lower wishbone (Porsche's
  term; commonly nicknamed the "coffin arm") and a forward diagonal
  arm (the "thrust arm" or "tuning fork") together locate the wheel
  carrier. Two distinct failure modes accumulate with age and mileage
  on this assembly. The first is wear and tear in the rubber thrust-arm
  bushing — the central bushing in the lower control arm that the thrust
  arm bolts into — which causes caster to wander under acceleration
  and braking, gives a vague on-centre feel, and produces a clunk over
  bumps. The second is wear in the integrated ball joints at each end
  of the wishbone, which Porsche fitted as non-serviceable units. A
  worn ball joint typically presents as a sharper clunk on low-speed
  steering input and pry-bar play at the wheel; the fix is replacement
  of the entire control arm.

  Pelican Parts' suspension overhaul article frames the components as
  routine wear items and recommends a complete refresh in the 80,000-
  to 100,000-mile band. Tarett Engineering, Elephant Racing, Powerflex,
  and Vertex offer aftermarket remedies that range from like-for-like
  rubber replacement, through harder-rubber "sport" bushings, to solid
  monoball or aluminium thrust-arm bushings, to replacement arms with
  serviceable ball joints (the Vertex pattern). Specialists are
  consistent that pressing replacement bushings into a control arm
  whose ball joints already have 60,000+ miles is poor economics —
  the labour is shared, and the ball joint will follow the bushing into
  failure within a service interval or two.

applicability:
  generation: [996.1, 996.2, 997.1, 997.2, 986, 987.1, 987.2]
  engine_family: [M96, M97, Mezger, 9A1]
  year_range: [1997, 2012]
  trim_category:
    - Carrera
    - Carrera_S
    - Carrera_4
    - Carrera_4S
    - Targa
    - Targa_4
    - Targa_4S
    - Turbo
    - Turbo_S
    - GT2
    - GT3
    - GT3_RS
    - Boxster_base
    - Boxster_S
    - Boxster_Spyder
    - Cayman_base
    - Cayman_S
    - Cayman_R
  body: [coupe, targa, cabriolet]
  excludes: >
    991 / 992 / 981 / 718 are out of scope for this v1 record. The
    aftermarket evidence base (Tarett product range, Elephant Racing
    catalogue) shows the same family of thrust-arm bushings is
    compatible across 996/997/986/987/991/992/981/718, indicating
    architectural continuity, but specialist documentation of failure
    prevalence and presentation on 991+ chassis is currently thinner
    than on 996/997/986/987 and the catalogue defers those generations
    to a future v2 record. Carrera GT (980 chassis, M80 engine) uses
    bespoke suspension hardware and is out of scope. The 996 GT3 (and
    by extension the 996/997 GT3 and Cup-spec arms used as
    upgrades on Carreras) carry stiffer factory bushings and a
    ball-joint design closer to the aftermarket "serviceable" pattern;
    they do age, but the bushing-wear presentation on the standard
    Carrera is the canonical case described here. There is a known
    dimensional difference between the thrust-arm bushing height on
    986/996 versus 987/997 chassis — Rennline supplies a spacer kit
    specifically to allow 996 GT3 control arms to be fitted to 987/997
    cars, and this dimensional difference is documented at the parts
    level. The failure mode is shared across both generations even
    though the part numbers diverge.

severity: moderate
  # Routine wear-tear repair on a healthy car; bundled corner-by-corner
  # with alignment, parts-and-labour at independent specialists puts
  # the job in the moderate band. Worst case (delayed repair on a high-
  # mileage car presenting with both bushing-wear and ball-joint failure
  # at multiple corners) climbs to the high end of moderate or low end
  # of high, but does not reach catastrophic territory.

cost_range_usd:
  bushing_only_diy_parts_per_corner:
    low: 80
    high: 250
    _source_anchor: >
      Pelican Parts catalogues Tarett Engineering's adjustable
      thrust-arm bushing kit at $135 per arm and a non-adjustable
      version at $100 per arm; Powerflex polyurethane bushing sets
      are commonly listed under $100 per pair on Pelican and partner
      retailers; Elephant Racing's centre-bushing replacement is
      listed at parts cost in a similar band. The $80–$250 range
      brackets DIY-parts cost per corner across these aftermarket
      Tier-B-published options.
  whole_arm_replacement_per_corner_diy_parts:
    low: 90
    high: 450
    _source_anchor: >
      Rennlist owner case in the 996-forum control-arm thread reports
      a Meyle aftermarket coffin arm at approximately $92 each via
      retailer (the band's low end), with a typical full-set (four
      arms) bill of about $1,000 in parts using Meyle/OEM-pattern
      arms. Pelican Parts catalogues OEM-style arms at higher list
      prices (~$418 each cited by forum posters as expensive). Vertex
      remanufactured arms with serviceable ball joints are quoted at
      ~$403 each in the same Rennlist thread. The $90–$450 range
      covers the spread from value-aftermarket Meyle (low end at
      ~$92 each) through premium aftermarket OEM-pattern through
      Vertex serviceable-ball-joint pattern through genuine OEM
      (high end at ~$418 each).
  specialist_shop_full_corner_with_alignment:
    low: 600
    high: 1500
    _source_anchor: >
      Synthesised band — no single Tier-B publication carries a
      per-corner installed figure. Anchored on the inputs Pelican
      Parts' 996/997 suspension overhaul article and Go-Parts'
      996/986 control-arm guide do publish: parts cost (per the
      whole_arm_replacement_per_corner_diy_parts band above),
      alignment cost ($125–$200 per the cited articles), and the
      job-as-corner-by-corner labour scope. Adding typical
      independent-specialist labour at 1.5–3 hours per side per
      Detroit Axle's general failure-progression article (cited as
      Tier C, general-automotive, not Porsche-specialist) yields
      the $600–$1,500 per-corner installed band. Dealer rates fall
      outside this band and are not used for the catalogue figure.
      The synthesis is explicit; reviewers should treat the band as
      Tier-B-derived with synthesis caveat rather than as a single
      direct anchor.
  specialist_shop_full_set_four_corners_with_alignment:
    low: 2500
    high: 5500
    _source_anchor: >
      Aggregating per-corner figures across four corners with one
      alignment shared yields the published-Tier-B specialist-shop
      band. RepairPal estimates for 911 control-arm replacement
      ($1,766–$1,832 average, single-corner aggregation) fall within
      this range and are noted for cross-reference; RepairPal is
      Tier-C-equivalent (aggregator without Porsche specialist
      authority) and is not the primary anchor for this figure.

prevalence_rate:
  qualitative: common_after_60k_to_100k_miles
  _source_anchor: >
    Pelican Parts' 996/997 suspension overhaul article recommends
    a full refresh of control arms, ball joints, sway-bar bushings,
    and tie rods in the 80,000–100,000-mile band as routine
    maintenance, not as exceptional repair. Multiple specialist
    shops (Elephant Racing, Tarett Engineering) treat the bushing-wear
    presentation as an expected age-and-mileage outcome on cars
    decades old. Numeric prevalence rate not asserted; no Tier-A
    or quantified Tier-B figure is on file.

failure_correlation:
  - mileage (bushing rubber and ball-joint grease degrade with cycle count)
  - age (rubber bushings dry out and crack independent of miles in long-stored cars)
  - climate (cold-weather rubber stiffens and accelerates bushing crack propagation; salt-belt amplifies ball-joint boot degradation)
  - usage pattern (track-driven cars wear thrust-arm bushings faster due to repeated braking-acceleration caster cycling)

typical_failure_mileage_or_age:
  qualitative: refresh_window_60k_to_100k_miles_or_15_to_25_years
  _source_anchor: >
    Pelican Parts' 996/997 suspension overhaul article cites the
    80,000–100,000-mile band as the routine refresh window. Specialists
    (Elephant Racing, Tarett) frame the refresh as appropriate after
    "decades" of service on rubber bushings. The age band of 15–25
    years brackets cars that have aged out of the original rubber's
    serviceable life regardless of mileage, consistent with how the
    rubber-degradation mechanism is described.

retrofit_available: yes
retrofit_kit_names:
  - Tarett Engineering Thrust Arm Bushing Kit, adjustable (PEL-TE-TABKA01) and non-adjustable (PEL-TE-TABKA02), solid aluminium replacement for the rubber thrust-arm bushing
  - Powerflex polyurethane thrust-arm bushings (street-friendly intermediate hardness)
  - Elephant Racing rubber thrust-arm and central wishbone bushings, available in Stock and Sport hardness
  - Elephant Racing GT3 Street and GT3 Cup inner lower control arms (factory-pattern arms with serviceable bushings)
  - Vertex remanufactured lower control arms with serviceable ball joints (replacement-arm pattern)
  - Rennline thrust-arm spacer kit (REN-S24) for cross-fitment of 996 GT3 control arms onto 987/997 chassis (specific compatibility solution)

regional_amplification:
  salt_belt: high
  cold_climate: high
  # Salt-belt amplifies ball-joint boot corrosion and grease loss; cold-
  # weather rubber stiffening accelerates bushing crack propagation.
  # Sources: Detroit Axle (Tier C — general-automotive, not Porsche-
  # specialist) on the weeks-to-months progression after boot tear;
  # Pelican Parts and Elephant Racing specialist coverage on rubber-
  # bushing aging in cold climates.

keywords:
  addressed:
    - "control arms replaced"
    - "lower control arms replaced"
    - "front control arms replaced"
    - "rear control arms replaced"
    - "thrust arm bushings replaced"
    - "Tarett bushings installed"
    - "Powerflex bushings installed"
    - "Elephant Racing bushings"
    - "wishbones replaced"
    - "coffin arms replaced"
    - "all four control arms replaced"
    - "suspension refresh"
    - "ball joints replaced"
  concerning:
    - "control arms original"
    - "factory bushings"
    - "original wishbones"
    - "suspension bushings unknown"
    - "control arm bushings cracked"
    - "thrust arm bushings worn"
  active_problem:
    - "clunk over bumps"
    - "clunking from front suspension"
    - "steering wheel shimmy"
    - "vague on-center feel"
    - "ball joint play"
    - "torn ball joint boot"
    - "control arm bushing failed"
    - "wishbone bushing failed"
  documented:
    - "control arm replacement invoice"
    - "Tarett Engineering invoice"
    - "Elephant Racing invoice"
    - "alignment after suspension work"
    - "specialist suspension refresh records"

evidence_basis:
  tier_a: []
  tier_b:
    - Pelican Parts technical article — 996/997 Suspension Overhaul (canonical layout, refresh window)
    - Tarett Engineering / Pelican Parts catalogue — Thrust Arm Bushing Kit product pages (cross-platform applicability and adjustable vs non-adjustable variants)
    - Elephant Racing — Rubber Suspension Bushings and Control Arm Services for 996/997 (rubber and monoball options; refurbishing service caveat that ball joints are not serviceable)
    - Rennlist editorial how-to — Porsche 997: How to Replace Lower Control Arms (procedure framing)
    - Go-Parts — 996/986 control-arm guide (terminology, 2005 transition warning, ball-joint integrated nature)
  tier_c:
    - Rennlist 996-forum thread "Replace entire control arm or just bushing" (owner-reported parts pricing and decision framework)
    - Detroit Axle — Lower Control Arm Ball Joint Explained (general-automotive content-marketing source, not Porsche-specialist; cited only for general failure-progression timing where the claim is generic mechanical-engineering rather than Porsche-specific)

sources:
  - name: Pelican Parts — Porsche 911 Carrera Suspension Overhaul (996 1998-2005, 997 2005-2012) Technical Article
    tier: B
    url_or_reference: pelicanparts.com/techarticles/Porsche-996-997-Carrera/59-SUSPEN-Suspension_Overhaul/59-SUSPEN-Suspension_Overhaul.htm
  - name: Pelican Parts product page — Tarett Engineering Thrust Arm Bushing Kit, Adjustable, all 996/997/986/987/991/981 (PEL-TE-TABKA01)
    tier: B
    url_or_reference: pelicanparts.com/More_Info/PELTETABKA01.htm
  - name: Pelican Parts product page — Tarett Engineering Thrust Arm Bushing Kit, Non Adjustable, all 996/997/986/987 (PEL-TE-TABKA02)
    tier: B
    url_or_reference: pelicanparts.com/More_Info/PELTETABKA02.htm
  - name: Pelican Parts product page — Rennline Thrust Arm Spacers for 996 GT3 control arms in 997/987 (REN-S24)
    tier: B
    url_or_reference: pelicanparts.com/More_Info/RENS24.htm
  - name: Tarett Engineering — Thrust Arm Bushing Kit (pr) all 996/997/986/987/981/991/992/718 product page
    tier: B
    url_or_reference: tarett.com/products/thrust-arm-bushing-kit-ea-all-996-997-986-987-981-991-718
  - name: Elephant Racing — Rubber Suspension Bushings For Porsche 996 997
    tier: B
    url_or_reference: elephantracing.com/porsche/996-997/rubber-suspension-bushings/
  - name: Elephant Racing — Control Arm Services For Porsche 996 997
    tier: B
    url_or_reference: elephantracing.com/porsche/996-997/control-arm-services-for-996-997/
  - name: Rennlist editorial how-to — Porsche 997 How to Replace Lower Control Arms
    tier: B
    url_or_reference: rennlist.com/how-tos/a/porsche-997-how-to-replace-lower-control-arms-386605
  - name: Go-Parts — Porsche 911 (996) and Boxster (986) Control Arm Guide (terminology, 2005 transition)
    tier: B
    url_or_reference: go-parts.com/garage/suspension-control-arm-porsche-911-porsche-boxster-1997-2006-2
  - name: Detroit Axle — Lower Control Arm Ball Joint Explained (general-automotive content-marketing; not Porsche-specialist)
    tier: C
    url_or_reference: detroitaxle.com/lower-control-arm-ball-joint/
  - name: Rennlist 996 forum — Replace entire control arm or just bushing (owner-reported pricing)
    tier: C
    url_or_reference: rennlist.com/forums/996-forum/941353-replace-entire-control-arm-or-just-bushing.html
  - name: RepairPal — Porsche 911 Control Arm Replacement Cost (Tier-C-equivalent aggregator, cross-reference only)
    tier: C
    url_or_reference: repairpal.com/estimator/porsche/911/control-arm-replacement-cost

editorial_note: >
  The water-cooled 911/Boxster/Cayman lower control arm is a wear-and-
  tear item, not a defect in the strict sense — but on cars now 15–25
  years old it is one of the highest-yield questions a buyer can ask.
  A car with documented control-arm and bushing work in the last 20,000
  miles is in materially better shape than one with original parts at
  100,000 miles. The two failure presentations to listen for are
  separable: a clunk over bumps with vague centre feel points to the
  thrust-arm bushing and is the cheaper repair; a sharper clunk on
  parking-lot manoeuvres with measurable pry-bar play at the wheel
  points to the integrated ball joint and means whole-arm replacement.
  Specialists agree it is poor economics to press new bushings into
  a control arm whose ball joints already have 60,000+ miles — the
  labour cost is shared and the ball joint typically follows the
  bushing into wear within a service interval or two. The
  bushing-versus-arm choice is the buyer's first signal of how the
  prior owner approached the car: arm-only replacement with a
  documented full set is the sign of a methodical custodian, while
  a bushing-only "minimum viable repair" is the sign of a car kept
  on a shoestring.

  Cross-platform note. The same family of thrust-arm bushings is
  catalogued for 991/992 and 981/718, but specialist documentation
  of failure prevalence on those generations is thinner and the
  catalogue defers them to a future v2 record. The 996 GT3 / GT3 RS,
  996 GT2, 997 GT3 / GT3 RS, and 997 GT2 / GT2 RS use stiffer
  factory bushings and a ball-joint design closer to the aftermarket
  "serviceable" pattern; they do age, but the canonical bushing-wear
  presentation described here is most clearly documented on the
  Carrera, Carrera S, Boxster, and Cayman trims that volume specialist
  articles (Pelican, Elephant Racing) target.

buyer_questions:
  - Have the lower control arms been replaced? Front, rear, or all four? With which brand of arm (OEM, OEM-pattern, Vertex serviceable, GT3 pattern)?
  - Have the thrust-arm bushings been replaced separately, or were full arms replaced? At what mileage?
  - Was an alignment performed after the suspension work?
  - Is there a clunk over bumps or under braking? A clunk on parking-lot manoeuvres? Steering shimmy on the highway?
  - Can you provide invoices and the shop name for the suspension work?
```

---

## Record 2 — Cayenne 955 / 957 / 958 air suspension: compressor, strut, and valve-block failures

```yaml
id: cayenne_air_suspension
flag_title: Cayenne 955/957/958 air suspension — compressor, strut, valve-block, and ride-height-sensor failures

description: >
  The first- and second-generation Cayenne (955 2003–2007, 957
  2008–2010, 958 2011–2018) was offered with self-levelling air
  suspension as an option on most trims and as standard equipment
  on Turbo and Turbo S models. The system uses a compressor and
  reservoir to pressurise four corner air struts (rolling-bladder
  design), with ride height controlled by per-corner level sensors,
  a central valve block, and a suspension control module. Every
  major component is wear-prone with age and mileage. Specialists
  describe the canonical failure cascade as a slow strut-bellows or
  O-ring leak that forces the compressor to run more often, eventually
  burning the compressor out; as the compressor weakens, error messages
  ("Chassis System Faulty," "Air Suspension Faulty," "Regulation Not
  Permissible") begin appearing intermittently and the vehicle may
  fail to lift to commanded ride height.

  An important architectural distinction: the 955 and 957 air-suspension
  layout is not a closed/sealed system, while the 958 is a closed
  nitrogen-filled system. The 958 architecture is widely characterised
  as more reliable than the 955/957 — the sealed loop keeps moisture
  out of the valve block — but both architectures are subject to strut-
  bellows and O-ring leaks that age out over 80,000–120,000 miles or
  10–15 years and cascade into compressor wear.

  Common failure presentations (drawn from FCP Euro's first-generation
  Cayenne suspension guide and consistent Tier-B specialist coverage):
  one corner sagging overnight, the vehicle pumping itself back up at
  unlock, a chassis-fault warning that intermittently disappears after
  a restart, audible compressor running for unusually long intervals,
  cold-weather-only fault triggering (rubber stiffening at low
  temperatures presents the leak earliest), a corner stuck low or
  stuck high, and progressive loss of the ride-height-adjustment
  function.

applicability:
  generation:
    - cayenne_955    # 9PA Phase 1, 2003-2007
    - cayenne_957    # 9PA Phase 2, 2008-2010
    - cayenne_958    # 92A, 2011-2018
  engine_family:
    - cayenne_v8_4_5_NA       # 955 S only (note: very early 955 was V8-only; V6 added later)
    - cayenne_v8_4_5_TT       # 955 Turbo / Turbo S
    - cayenne_v8_4_8_NA_or_TT # 957 and 958 V8 family
    - cayenne_v6_3_2          # 955 base (3.2L VR6 supplied by VW Group)
    - cayenne_v6_3_6_NA       # 957 base and 958 V6 (introduced for 957 MY2008)
    - cayenne_v8_diesel_4_2   # 958 V8 Diesel S
    - cayenne_v6_3_0_diesel   # 957 (from February 2009) and 958 V6 Diesel
    - cayenne_hybrid          # 958 S Hybrid (supercharged V6) and S E-Hybrid
  year_range: [2003, 2018]
  trim_category:
    - base
    - S
    - GTS
    - turbo
    - turbo_S
    - S_diesel
    - S_hybrid
    - S_e_hybrid
    - platinum_edition
  body: [SUV_5dr]
  excludes: >
    Cayenne 9YA (E3, 2019 model year onward) is out of scope. The 9YA
    introduces a redesigned three-chamber air-suspension architecture
    on the MLB-Evo platform; Porsche has issued TSB-level technical
    information addressing 9YA air-suspension symptoms, but
    specialist Tier-B published material on 9YA failure prevalence
    is currently thin and the catalogue defers the 9YA to a future
    v2 record. Cayenne models factory-equipped with the standard
    steel-spring suspension (the conventional coil layout offered as
    standard on most non-Turbo 955/957/958 trims) are not subject to
    this defect — the matcher's "factory-equipped" qualifier is
    captured at the listing level via the keywords below ("air
    suspension," "PASM Air Suspension," yellow Turbo-style ride-
    height controls), and editorial framing in the buyer view should
    qualify the flag with "applies only to cars factory-equipped
    with the optional or standard air-suspension package." Note that
    the air suspension on Turbo/Turbo S was standard, not optional —
    a Turbo-trim car always has it.

severity: high
  # Per-strut replacement at OEM dealer rates is in the high-band
  # mid-thousands per corner; full-set strut replacement reaches
  # five-figures at dealer rates. Specialist independent and
  # aftermarket-compressor strategies bring the ceiling down but
  # the floor is still moderate-to-high. The cascade-to-compressor
  # pattern means delayed repair compounds cost.

cost_range_usd:
  compressor_replacement_aftermarket_diy_to_independent:
    low: 400
    high: 1500
    _source_anchor: >
      Miessler Automotive (Tier B specialist remanufacturer for VAG-
      Group air-suspension components, including the Continental
      compressor used in 955/957/958 Cayenne) catalogues remanufactured
      OE-pattern compressor assemblies and complete air-supply units
      with valve block at specialist parts pricing in the $300–$900
      band. Independent-specialist shop labour for compressor
      replacement is typically 2–4 hours per general European-shop
      labour rates, putting the all-in independent figure in the
      $400–$1,500 band. Planet-9 Porsche Forum's Official Air
      Suspension Thread and Rennlist 958 air-suspension threads
      provide owner-case corroboration on Miessler-source pricing
      (Tier C, supporting). eBay rebuild kits (piston-and-seal) are
      inexpensive (<$100) but require disassembly and a known leak
      diagnosis.
  per_corner_strut_replacement_independent_specialist:
    low: 800
    high: 2500
    _source_anchor: >
      Strutmasters' Cayenne air-suspension guide cites a RepairPal
      average of approximately $2,400 to replace one Porsche Cayenne
      air strut at typical labour rates. Independent-shop strut
      replacement using OE-quality Bilstein or Continental remanufactured
      struts runs lower, in the $800–$1,800 per-corner band. The
      published $2,400 figure is the high end and reflects dealer or
      dealer-equivalent rates with OEM Porsche parts.
  full_set_four_struts_dealer:
    low: 8000
    high: 12000
    _source_anchor: >
      Strutmasters' Cayenne air-suspension guide (Tier B) frames the
      typical full-system OEM repair as four air struts plus a
      compressor, citing the RepairPal per-strut average of
      approximately $2,400. Multiplying through (4 × $2,400 =
      $9,600 strut-only at dealer rates, plus compressor) yields
      the $8,000–$12,000 dealer band depending on whether the
      compressor is also replaced and on regional dealer-rate
      variation. Rennlist 958 air-suspension thread captures an
      owner-reported 2011 Cayenne Turbo dealer bill of approximately
      $11,000 for all-four-strut replacement (Tier C corroboration);
      PCGB Forum threads reproduce similar dealer-quoted figures
      (Tier C corroboration). Specialist independent replacement
      using aftermarket struts brings the same job into the
      $4,000–$7,000 band but is not the dealer-rate anchor.

prevalence_rate:
  qualitative: common_to_near_universal_after_100k_miles_or_10_years_on_955_957_lower_on_958
  _source_anchor: >
    FCP Euro's Definitive Guide to First-Generation Porsche Cayenne
    Suspension (955/957) frames the air-suspension components as
    "starting to become more common in terms of routine failures" as
    the 9PA fleet ages, with bellows leaks, ride-height-sensor wear,
    and compressor failure described as expected outcomes. Go-Parts'
    Tier-B 955/957 compressor guide cites a typical compressor wear
    window of 70,000–120,000 miles, accelerating in hot climates.
    Owner-reported 958 cases on Rennlist and Planet-9 indicate the
    closed nitrogen-filled architecture has materially lower failure
    rates than the 9PA but is not failure-proof — strut O-ring leaks
    in the cold are a recurring 958 presentation. Numeric prevalence
    rate not asserted; no Tier-A figure is on file.

failure_correlation:
  - mileage (bellows fatigue cycles with each ride-height adjustment)
  - age (rubber bellows and O-rings age out independent of miles, especially in long-stored cars)
  - climate (cold weather presents the leak earliest by stiffening rubber; hot/desert climate accelerates compressor wear)
  - usage pattern (frequent off-road use, towing, and ride-height-mode toggling cycle the system more aggressively)

typical_failure_mileage_or_age:
  qualitative: cascade_window_80k_to_150k_miles_or_10_to_15_years
  _source_anchor: >
    Go-Parts cites compressor-wear typical at 70,000–120,000 miles
    in the 955/957. Strut-leak-onset cases captured on Rennlist and
    Planet-9 span 50,000–150,000 miles, with cold-climate cases
    presenting earlier than warm-climate cases at comparable mileage.
    The 80,000–150,000-mile / 10-to-15-year band brackets the
    expected onset window across the fleet.

retrofit_available: partial
retrofit_kit_names:
  - Miessler Automotive remanufactured Continental compressor (Tier-B remanufacturer; OE-pattern unit)
  - Wabco-style aftermarket compressor assemblies (multiple suppliers)
  - Bilstein aftermarket replacement air struts (multiple Cayenne applications)
  - Continental remanufactured air struts
  - Compressor rebuild kits (piston, seal, and cylinder-liner sets) for Wabco-style units
  - Strut conversion-to-coil-spring kits (Strutmasters and similar; permanent removal of air-suspension functionality, not a like-for-like remedy)

regional_amplification:
  cold_climate: high
  desert_southwest: high
  salt_belt: moderate
  # Cold-climate amplifies rubber stiffening and presents leaks earliest;
  # desert/hot-climate amplifies compressor wear (the Go-Parts guide is
  # explicit on this); salt-belt has moderate amplification through
  # corrosion of valve-block fittings and connector hardware.

keywords:
  addressed:
    - "air struts replaced"
    - "all four air struts replaced"
    - "compressor replaced"
    - "air suspension compressor replaced"
    - "Bilstein air struts"
    - "valve block replaced"
    - "ride height sensors replaced"
    - "Miessler compressor"
    - "air suspension serviced"
    - "converted to coil springs"
    - "Strutmasters conversion"
  concerning:
    - "air suspension original"
    - "air struts original"
    - "compressor original"
    - "air suspension service unknown"
    - "compressor runs frequently"
    - "compressor runs longer than usual"
  active_problem:
    - "Chassis System Faulty"
    - "Chassis System Failure"
    - "Air Suspension Faulty"
    - "Regulation Not Permissible"
    - "car sits low overnight"
    - "one corner sagging"
    - "air suspension stuck low"
    - "won't lift to ride height"
    - "PSM Fault"
  documented:
    - "air suspension service invoice"
    - "compressor replacement records"
    - "strut replacement invoices"
    - "Miessler invoice"
    - "Bilstein strut invoice"

evidence_basis:
  tier_a: []
  tier_b:
    - FCP Euro — Definitive Guide to First-Generation Porsche Cayenne Suspension (955/957) — canonical Tier B for the 9PA failure pattern
    - Go-Parts — Porsche Cayenne Air Suspension Compressor Guide 2003–2010 — compressor wear window
    - Strutmasters — Porsche Cayenne Air Suspension Problems — RepairPal-citing per-strut cost band, full-system pricing analysis, conversion-to-coil option
    - Miessler Automotive — Cayenne air-supply system specialist remanufacturer (Continental compressor, valve block; primary anchor for Tier-B compressor pricing band)
    - eEuroparts — Porsche Cayenne 958 Air Suspension In-Depth Repair Guide — 958 architecture, fault messages, repair procedure
    - PCarwise — Porsche Cayenne Common Problems — failure-presentation framing
  tier_c:
    - Rennlist Cayenne 958 forum — Air Suspension Sags/Leaks thread (owner-captured cold-weather presentation, dealer cost capture)
    - Rennlist Cayenne 955/957 forum — Air Suspension Failure thread (compressor rebuild experience, fuse location)
    - Planet-9 Porsche Forum — Official Air Suspension Thread (community-aggregated diagnostic and repair guidance, parts sources)
    - Cayenne Forums — multi-thread discussion on 958 reliability vs 955/957

sources:
  - name: FCP Euro — The Definitive Guide To First-Generation Porsche Cayenne Suspension (955/957)
    tier: B
    url_or_reference: fcpeuro.com/blog/the-definitive-guide-to-first-generation-porsche-cayenne-suspension-955-957
  - name: Go-Parts — Porsche Cayenne Air Suspension Compressor Guide (2003-2010)
    tier: B
    url_or_reference: go-parts.com/garage/ps-2003-2010-porsche-cayenne-air-suspension-compressor
  - name: Strutmasters — Porsche Cayenne Air Suspension Problems — Here's How To Fix Them
    tier: B
    url_or_reference: strutmasters.com/blogs/maintenance-repairs/porsche-cayenne-suspension-problems-fix
  - name: Miessler Automotive — Cayenne air-supply unit and compressor remanufacturing specialist
    tier: B
    url_or_reference: miessler-automotive.com (Cayenne 92A air-supply system product range)
  - name: eEuroparts — Porsche Cayenne 958 Air Suspension In-Depth Repair Guide
    tier: B
    url_or_reference: eeuroparts.com/blog/porsche-cayenne-958-air-suspension-in-depth-repair-guide
  - name: PCarwise — Porsche Cayenne and Panamera Common Problems (air suspension failure framing)
    tier: B
    url_or_reference: pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/
  - name: Rennlist Cayenne 958 forum — Air Suspension Sags/Leaks thread
    tier: C
    url_or_reference: rennlist.com/forums/cayenne-958-2011-2018/1335806-air-suspension-sags-leaks-how-long-until-failure.html
  - name: Rennlist Cayenne 955/957 forum — Air Suspension Failure all the way down (compressor rebuild and dealer-bill capture)
    tier: C
    url_or_reference: rennlist.com/forums/cayenne-955-957-2003-2010/1330119-air-suspension-failure-all-the-way-down.html
  - name: Planet-9 Porsche Forum — The Official Air Suspension Thread
    tier: C
    url_or_reference: planet-9.com/threads/the-official-air-suspension-thread.249893/
  - name: 6SpeedOnline Cayenne 955/957 forum — Repaired Suspension Compressor thread (open-vs-closed-system distinction)
    tier: C
    url_or_reference: 6speedonline.com/forums/cayenne-955-957/419908-repaired-suspension-compressor-now-won-t-turn.html

editorial_note: >
  This is the single most important pre-purchase question on a Cayenne
  optionally fitted with — or standard-equipped with — air suspension.
  The 955 and 957 are now decidedly old enough that strut-bellows
  leaks, ride-height-sensor wear, and compressor failure are expected
  outcomes rather than exceptional events. The 958's closed nitrogen
  architecture is materially more reliable but not failure-proof; cold-
  weather strut O-ring leaks remain a recurring presentation, and the
  cascade pattern (slow strut leak → compressor runs longer → compressor
  fails) is the same on both architectures.

  The Turbo-and-Turbo-S car is a particular case: air suspension was
  standard on those trims, never an option. A Turbo-trim Cayenne always
  has the system; the buyer-due-diligence question is therefore
  unconditional on these trims.

  The 9YA (third-generation 2019+) Cayenne uses a redesigned
  three-chamber air-suspension architecture and is out of scope of this
  v1 record; Porsche has issued TSBs addressing 9YA air-suspension
  symptoms but the published Tier-B specialist material is currently
  thin and the catalogue defers the 9YA to a future v2 record.

  No formal Porsche AG warranty extension or recall covers Cayenne
  air suspension. The Cayenne extended-warranty actions on this
  generation address the transfer gear (file 09 record 4) and the
  wheel-speed sensors (TSB 122-19, covered in File 11 record 1); the air
  suspension is not part of those actions and out-of-warranty repair
  is at the owner's expense.

buyer_questions:
  - Is the Cayenne factory-equipped with air suspension or with conventional steel springs? (Turbo and Turbo S always have air; on other trims it was an option.)
  - Has the air-suspension compressor ever been replaced? At what mileage and by which shop?
  - Have any of the air struts been replaced? Which corners, when, and using OEM, Bilstein, or Continental remanufactured units?
  - Are there any current chassis-fault, air-suspension-fault, or "Regulation Not Permissible" warning messages? Has any such message ever appeared, even intermittently?
  - Does the vehicle sit at the same height after sitting overnight, or does any corner sag? Does the compressor run audibly at startup or for unusual durations?
  - On a road test in the morning before the car has been driven (worst-case for cold-weather leak presentation), does the system lift to commanded ride height promptly?
  - Have the ride-height sensors ever been replaced or recalibrated?
```

---

## Record 3 — Porsche Carbon Ceramic Brake (PCCB) disc replacement economics

```yaml
id: pccb_carbon_ceramic_disc_replacement
flag_title: PCCB carbon-ceramic discs — replacement-cost catastrophe on track-aged sets

description: >
  Porsche introduced the Porsche Ceramic Composite Brake (PCCB) — a
  carbon-fibre-reinforced silicon-carbide disc paired with composite
  pads, identifiable by yellow brake calipers — on the 996 generation
  for the 2001 model year, as standard equipment on the 996 GT2 and as
  an option on the 996 Turbo, and has offered it across most of the
  range since (as an option on most trims, as standard on certain GT
  and Turbo S trims). PCCB discs do not fail; they are working as designed
  for as long as their carbon-fibre matrix retains enough density to
  absorb braking heat without surface spalling. The defect-record
  framing here is replacement-cost economics, not a manufacturing
  defect — the disc's wear mechanism is heat-cycle-driven (carbon-
  fibre vaporisation at high temperatures progressively lowers disc
  density) rather than abrasive (street pads barely touch the carbon
  surface), and the OEM replacement cost on a worn-out set is
  catastrophic.

  Specialist Tier-B coverage establishes three points of buyer-due-
  diligence importance. First, visual inspection of a PCCB disc tells
  you almost nothing about its remaining life — surface cracks (Porsche
  describes them as spalling) indicate high thermal load history but
  are not in themselves a disqualifying signal, while a smooth-looking disc
  may be near its minimum density. Second, the only definitive wear
  measurement is by weight: the disc's hub is etched with both its
  original new weight and its minimum service weight, and a
  high-precision scale (Porsche dealers carry the Carbotech tool for
  this measurement) is required to compare. Third, replacement is
  expensive in the precise way that matters most to a buyer: a single
  new OEM front rotor on the Cayenne is published at over $5,000 by
  Tier-B aggregator Go-Parts; full-set OEM replacement on a 911 or
  Panamera is reported at approximately $20,000 (Elferspot, with PCGB
  Forum and Rennlist owner cases consistent). Aftermarket alternatives
  exist — Surface Transforms (CCST) supplies continuous-fibre
  carbon-ceramic discs at substantially lower per-axle cost than OEM
  with refurbishment available; Essex Parts (AP Racing by Essex
  Radi-CAL) sells iron-disc conversion kits that retain the original
  calipers — but the buyer must understand that an unworn-checked
  PCCB-equipped car is carrying a contingent liability on the order
  of $10,000–$25,000 depending on the car and disc state, and the
  liability is realised by track or aggressive road use, not by
  street miles.

applicability:
  generation:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 987.2  # Boxster Spyder, Cayman R were 987.2 trims with PCCB optional
    - 991.1
    - 991.2
    - 992.1
    - 992.2
    - 981
    - 718
    - cayenne_957
    - cayenne_958
    - cayenne_9Y0
    - panamera_970
    - panamera_971
    - macan_95B
    - taycan_j1   # Note: applicability to taycan_j1_fl (2024+) not confirmed in original record; left as-authored
    - carrera_gt   # Carrera GT — PCCB was the only brake fitment, standard
  engine_family:
    # Note: PCCB is a factory option, not engine-determined. The
    # engine_family axis is doing matcher-routing scoping only; the
    # actual in-scope qualification happens at the generation +
    # trim_category + factory-equipped-keyword level. The list below
    # covers engine families known to occur on cars where PCCB was
    # offered or standard.
    - Mezger
    - 9A1
    - 9A2  # covers 991/992; the 992 uses 9A2 Evo, still in the 9A2 family per Porsche Newsroom
    - cayenne_v8_4_8_NA_or_TT
    - cayenne_v8_diesel_4_2
    - cayenne_v6_3_6_NA
    - cayenne_v6_3_0_diesel
    - cayenne_hybrid
    - carrera_gt_M80  # Carrera GT V10 — confirmed Porsche internal designation
    # Panamera, Macan, and Taycan engine_family entries are not given
    # here because the catalogue's Panamera, Macan, and Taycan engine-
    # family naming conventions are not yet formally registered in
    # Locked Conventions (Files 06–13 use ad-hoc engine_family values;
    # Locked Conventions defines generation keys only for these
    # platforms). Matcher routing on those platforms can rely on
    # generation + trim_category alone for v1.
  year_range: [2001, 2025]
  trim_category:
    - Carrera_S
    - Carrera_GTS
    - Turbo
    - Turbo_S
    - GT3
    - GT3_RS
    - GT3_RS_4_0
    - GT2
    - GT2_RS
    - 911_R
    - 911_Speedster
    - Carrera_GT
    - Cayman_GT4
    - Cayman_GT4_RS
    - Boxster_Spyder
    - Cayman_R
    - cayenne_turbo
    - cayenne_turbo_S
    - cayenne_GTS
    - panamera_turbo
    - panamera_turbo_S
    - macan_GTS
    - macan_turbo
    - taycan_GTS
    - taycan_turbo
    - taycan_turbo_S
  excludes: >
    Cars factory-equipped with steel brakes (the standard fitment on
    most non-GT, non-Turbo-S trims) are not subject to this record.
    The keyword-detection layer is doing the in-scope qualification
    here — a listing that lacks any of the PCCB-identifying terms
    ("PCCB," "ceramic brakes," "carbon ceramic," "yellow calipers,"
    Porsche option code 450) likely refers to a steel-braked car and
    the record should not fire as "not_mentioned" on that listing.
    The matcher's not_mentioned policy on this record should require
    a positive PCCB indicator before applying any penalty; this is
    documented as a v2 schema-extension candidate (a
    requires_positive_keyword_match flag on records that scope by
    factory option) in the file's schema-extension queue. Note that
    PCCB on the Carrera GT (980) is the only brake fitment offered —
    every Carrera GT is in scope. Note that Porsche announced in
    May 2022 that PCCB would be reserved for models on which it is
    standard equipment going forward, which limits the applicability
    of this record on post-2022 cars to the standard-PCCB trims
    listed above.

severity: catastrophic
  # OEM full-set replacement at ~$20,000 places this in the catastrophic
  # band by the catalogue's threshold (>$20k or >30% of typical car
  # value at current market). Aftermarket alternatives bring the
  # replacement cost into the high band ($10,000-$15,000) but the
  # severity ranking follows the worst-case applicable cost. On lower-
  # value PCCB-equipped cars the cost-as-fraction-of-value criterion
  # also drives the catastrophic ranking.

cost_range_usd:
  weight_measurement_at_dealer_diagnostic_only:
    low: 0
    high: 300
    _source_anchor: >
      Porsche dealers carry the Carbotech disc-density measurement
      tool as part of standard PCCB service equipment. Dealer fees
      for the measurement vary; Taycan-forum capture and Rennlist
      capture are consistent with $0–$300 depending on whether the
      measurement is bundled with another service event. The
      measurement itself is the one buyer-due-diligence step that
      definitively answers the wear-state question.
  surface_transforms_aftermarket_ccst_full_axle:
    low: 5500
    high: 7000
    _source_anchor: >
      Rennlist 991-forum capture from Essex Parts cites Surface
      Transforms CCST per-axle list at approximately $6,325 for a
      front axle and $6,325 for a rear axle on a 991 application,
      with up to three refurbishments available at approximately
      $600 per rotor. The $5,500–$7,000 per-axle band brackets
      published Surface Transforms axle pricing across applications;
      specific car application drives the figure.
  surface_transforms_full_set_two_axles:
    low: 11000
    high: 14000
    _source_anchor: >
      Two-axle aggregation of the Surface Transforms per-axle figure
      ($6,325 + $6,325 = $12,650 captured on Rennlist 991 forum) sits
      in the published-Tier-B per-axle band aggregated across both
      axles. The $11,000–$14,000 range brackets full-set CCST
      replacement on representative applications.
  essex_ap_racing_iron_conversion_full_system_with_calipers:
    low: 9000
    high: 13000
    _source_anchor: >
      Essex Parts (Radi-CAL by AP Racing) full conversion-to-iron
      systems including calipers are quoted on the Essex Parts blog
      at approximately $11,000 for a complete four-wheel system on
      the 718 GT4 application, with weight saving over the OEM iron
      system and a wider pad-selection envelope. The $9,000–$13,000
      band brackets full-system iron-conversion pricing across
      Porsche applications; disc-only iron retrofits using OE
      calipers are lower-cost.
  oem_porsche_full_set_two_axles_dealer:
    low: 18000
    high: 25000
    _source_anchor: >
      PCGB Forum capture documents a Panamera owner quoted
      approximately £20,000 for OEM full-set PCCB replacement.
      Elferspot's PCCB feature article cites OEM disc and pad
      replacement reaching approximately €20,000. Rennlist 991 forum
      cases reproduce similar five-figure dealer-bill captures. The
      $18,000–$25,000 band reflects representative dealer-rate
      figures across 911, Panamera, and similar OEM-PCCB
      applications; Cayenne PCCB is at the upper end of the band
      due to disc size.

prevalence_rate:
  qualitative: low_for_street_use_high_for_track_use_binary_correlated
  _source_anchor: >
    The Tier-B and Tier-C consensus across Rennlist, PistonHeads,
    PCGB Forum, 718 Forum, and Taycan Forum is that street-driven
    PCCB sets typically last vehicle-life or 100,000+ miles, while
    track-driven sets wear in proportion to the number and
    intensity of high-speed brake events. A captured Rennlist case
    reports approximately 30 track-day events per year for three
    consecutive years on a 991.2 GT3 to wear one of four rotors to
    replacement; another captured case (PistonHeads) reports two
    front pairs and one rear pair worn through in 22,000 miles on
    a tuned GT2 with track use. The buyer-due-diligence framing is
    therefore that the prevalence rate is dichotomous: it depends
    almost entirely on the car's track-use history, not on age or
    street mileage in any normal range. Numeric prevalence rate
    not asserted; the heat-cycle-versus-mileage distinction is the
    salient framing.

failure_correlation:
  - usage pattern (track use is the primary driver; street use is rarely a driver)
  - heat exposure (carbon-fibre vaporisation at high temperatures progressively lowers disc density)
  - tuned car / increased weight / increased speed (higher kinetic energy per stop accelerates wear)

typical_failure_mileage_or_age:
  qualitative: highly_correlated_with_track_use_uncorrelated_with_street_mileage
  _source_anchor: >
    Rennlist 991 forum capture (with linked GT3 owner-reported wear
    data) establishes that approximately 30 track days per year for
    three years on a dedicated track-prepped 991.2 GT3 wore one of
    four rotors to replacement. PistonHeads UK capture documents a
    tuned GT2 with two front-axle pairs and one rear pair replaced
    in 22,000 miles of mixed road and track use. Street-only cases
    on Taycan Forum and PCGB report no measurable wear after
    100,000-plus miles. The "typical failure" framing for this
    record is therefore not mileage-based; it is event-based and
    asks whether the car has seen track use that compresses the
    heat-cycle history into a small number of intense braking events.

retrofit_available: yes
retrofit_kit_names:
  - Surface Transforms CCST carbon-ceramic discs (continuous-fibre construction; aftermarket with up to three refurbishment cycles per disc)
  - Essex Parts / AP Racing Radi-CAL conversion to iron discs (complete system with calipers; OEM-caliper retention also available on certain applications)
  - Disc-only iron-disc replacement using OE PCCB-compatible calipers (multiple suppliers; lowest-cost remediation but with weight gain)
  - Brembo and similar OEM-quality iron-disc replacement kits for Cayenne, Panamera, and Macan PCCB applications

regional_amplification: none_documented

keywords:
  addressed:
    - "converted to iron discs"
    - "converted to steel rotors"
    - "Surface Transforms discs"
    - "CCST discs"
    - "AP Racing brake conversion"
    - "Essex Radi-CAL"
    - "PCCB disc weight measured"
    - "ceramic discs measured at dealer"
    - "PCCB replaced under warranty"
    - "new PCCB rotors"
  concerning:
    - "PCCB original"
    - "ceramic discs original"
    - "carbon ceramic discs original"
    - "PCCB wear unknown"
    - "discs not measured"
    - "tracked occasionally"
    - "track day history"
    - "occasional track use"
  active_problem:
    - "PCCB warning light"
    - "ceramic disc cracking"
    - "spalling visible on disc surface"
    - "PCCB replacement quoted"
    - "discs at minimum weight"
  documented:
    - "PCCB weight measurement records"
    - "Carbotech measurement"
    - "PCCB inspection at dealer"
    - "Surface Transforms invoice"
    - "iron conversion invoice"

evidence_basis:
  tier_a: []
  tier_b:
    - Elferspot — Porsche Ceramic Composite Brake (PCCB) feature (introduction history, Porsche 2022 policy change, ~€20k OEM replacement)
    - Go-Parts — 2011-2018 Porsche Cayenne Carbon Ceramic Rotor Guide (per-rotor OEM cost, weight-measurement methodology, identification by yellow calipers and 20"+ wheels)
    - Essex Parts — Radi-CAL conversion blog and product pages (iron conversion systems, Surface Transforms per-axle pricing comparison)
    - Surface Transforms — CCST product line (continuous-fibre construction, refurbishment cycles)
    - Design 911 — Replacement for Ceramic Disc product range (alternative HTCIC ceramic and steel replacements)
  tier_c:
    - PCGB Forum — Ceramic Disc PCCB Replacement thread (£20k OEM full-set quote on Panamera; specialist measurement assessment)
    - Rennlist 991 forum — Cost of PCCB Replacement thread (Surface Transforms per-axle pricing capture, GT3 track-wear data)
    - PistonHeads UK — PCCB Replacement / alternate for Carbon Ceramic Brakes thread (tuned GT2 wear-rate capture)
    - 718 Forum — multiple PCCB-longevity threads (street-vs-track wear framing)
    - Taycan Forum — PCCB-replacement-cost thread (Carbotech measurement methodology)

sources:
  - name: Elferspot — Porsche Ceramic Composite Brake (PCCB) feature article
    tier: B
    url_or_reference: elferspot.com/en/magazine/porsche-ceramic-composite-brake-pccb/
  - name: Go-Parts — 2011-2018 Porsche Cayenne Carbon Ceramic (PCCB) Rotor Guide
    tier: B
    url_or_reference: go-parts.com/garage/disc-brake-kit-porsche-cayenne-2011-2018-2
  - name: Essex Parts blog — Are Carbon Ceramic Brake Discs Better than Iron? (and product pages)
    tier: B
    url_or_reference: essexparts.com (multiple PCCB-conversion product and editorial pages)
  - name: Surface Transforms — CCST product information
    tier: B
    url_or_reference: surfacetransforms.com (Porsche application catalogue)
  - name: Design 911 — Replacement for Ceramic Disc product range
    tier: B
    url_or_reference: design911.com/porsche/replacement-for-ceramic-disc/
  - name: PCGB Forum — Ceramic Disc PCCB Replacement thread (Panamera owner case)
    tier: C
    url_or_reference: porscheclubgb.com/forum/threads/ceramic-disc-pccb-replacement.207262/
  - name: Rennlist 991 forum — Cost of PCCB Replacement thread (Essex Parts pricing capture)
    tier: C
    url_or_reference: rennlist.com/forums/991/1280505-cost-of-pccb-replacement-2.html
  - name: 718 Forum — Porsche Ceramic Composite Brakes Are They Worth The Cost thread
    tier: C
    url_or_reference: 718forum.com/threads/porsche-ceramic-composite-brakes-pccbs-are-they-worth-the-cost.24086/
  - name: Taycan Forum — How much does it cost to replace PCCB brakes thread
    tier: C
    url_or_reference: taycanforum.com/forum/threads/how-much-does-it-cost-to-replace-pccb-brakes-in-yellow.19395/

editorial_note: >
  PCCB framing in the catalogue is wear-state pre-purchase, not defect.
  The discs do their job correctly throughout their service life;
  what matters to a buyer is where in the service life they are. The
  question separates cleanly along track-use history. A street-driven
  PCCB-equipped car is rarely an open liability — every captured case
  of street-only ownership through 100,000+ miles shows minimal
  measurable wear. A car with documented track use is a different
  proposition: each weekend session writes heat into the disc that
  cannot be undone, and a buyer accepting an unmeasured set is taking
  on a contingent five-figure exposure.

  The actionable buyer step is the dealer weight-measurement check.
  Porsche dealers carry the Carbotech tool that compares current disc
  weight against the etched factory minimum, and the procedure
  produces an unambiguous answer (above minimum: usable; at or below:
  replace). A pre-purchase inspection on a PCCB-equipped car is
  materially incomplete without this measurement.

  Replacement-strategy framing is now well-established: Surface
  Transforms (a UK manufacturer; Rennlist-cited as $6,325 per axle
  on representative applications) supplies continuous-fibre CCST
  discs at meaningfully lower cost than OEM with up to three
  refurbishments built into the product life; Essex Parts and similar
  iron-conversion kits eliminate the ceramic system entirely while
  retaining (in many cases) the OEM calipers, with weight saving and
  pad-selection benefits. Owners of PCCB-equipped cars who plan
  serious track use generally find iron conversion more economical
  than continued ceramic; owners who prioritise the original-spec
  factory configuration (and resale value of a numbers-matching car)
  generally accept the OEM or Surface Transforms replacement path.

  Note Porsche's May 2022 policy change. After that point, Porsche has
  reserved PCCB for models where it is standard equipment, ending its
  availability as a retrofit or stand-alone option choice on
  applications where it had previously been optional. This does not
  retroactively affect cars already built with PCCB but does explain
  the reduced new-car PCCB take rate since 2022 and is relevant to
  buyers comparing new versus used examples.

buyer_questions:
  - Is the car factory-equipped with PCCB? (Confirm via yellow caliper colour, "PCCB" in window-sticker option list, or option code 450.)
  - Has the car been tracked? How many track days per year, on which circuits, and over what period?
  - Have the PCCB discs been weight-measured at a Porsche dealer using the Carbotech (or equivalent) tool? Can you provide the measurement values and the etched minimum weight values for cross-reference?
  - Have the discs ever been replaced (with OEM, Surface Transforms, or refurbished units), or has the car been converted to iron-disc brakes?
  - If the discs are original, are there visible cracks, surface spalling, or chips at the disc edge? (Cracks indicate high thermal load history but are not in themselves a failure indicator; chips at the edge are a serious red flag.)
```

---

## Record 4 — 928 lower ball joint: aluminum-support safety failure (pre-September-1983) and routine wear (all 928s)

```yaml
id: 928_lower_ball_joint_aluminum
flag_title: 928 lower ball joint — aluminum-support failure on pre-September-1983 cars and routine wear on all 928s

description: >
  The 928's front lower ball joint is mounted on a separate carrier
  bolted to the lower control arm via two adjusting eccentrics and a
  pair of brackets — a Porsche-specific architecture in which the
  joint and its support can be serviced without replacing the whole
  arm. From the start of 928 production through approximately September
  1983, the lower ball joint support was cast in aluminium. From
  approximately September 1983 onward (specifically: chassis number
  92ES860404, per Rennlist's 928 Suspension FAQ written by Wally
  Plumley, the long-standing PCA-channel 928 specialist), the support
  was redesigned in steel, identifiable visually by a figure-eight
  outline (the aluminium support has an oval outline) and confirmable
  by magnet test — visible from below the car: a figure-eight outline
  indicates the steel support is fitted, an oval outline indicates the
  original aluminium is still in place. The aluminium supports are documented as having
  failed in service on multiple 928s — in some cases the ball stud has
  separated from the socket while driving, with documented near-misses
  at low speed and the ever-present risk of separation at higher speed.
  Specialist consensus is that any pre-cutoff 928 with original
  aluminium supports should be retrofitted to the steel support
  pattern at the earliest opportunity, regardless of perceived ball-
  joint condition.

  All 928s — pre- and post-cutoff — also accumulate routine ball-joint
  wear with age and mileage in the same way as any other front
  suspension. The Porsche 928 maintenance literature (Rennlist editorial
  how-to articles, Pelican Parts technical material, 928 International
  documentation) treats lower ball-joint replacement as a routine
  age-and-mileage item and recommends inspection at every major service.
  The presentations are the standard ones: a clunk over bumps, judder
  in the steering wheel, wandering on the highway, tramlining, and
  squeaking when going over uneven surfaces.

applicability:
  generation: [928, 928_S, 928_S2, 928_S4, 928_GT, 928_GTS]
  engine_family: [M28_V8]
  year_range: [1977, 1995]
  trim_category: [928_4_5, 928_S_4_7, 928_S2_4_7, 928_S4_5_0, 928_GT_5_0, 928_GTS_5_4]
  body: [coupe]
  excludes: >
    Aluminium-support safety risk applies only to cars built before
    chassis number 92ES860404 (approximately September 1983). Cars
    from that VIN forward carry the steel support from the factory
    and are not subject to the aluminium-failure presentation; they
    are still subject to routine ball-joint wear with age. Air-cooled
    911s, water-cooled flat-six cars, and four-cylinder transaxle
    cars (924/944/968) use different ball-joint architectures and are
    out of scope. The 944 and 968 share design lineage with the 928
    in some respects but the front lower-ball-joint carrier
    architecture differs and the aluminium-versus-steel transition
    has no analogue in the four-cylinder transaxle family.

severity: catastrophic
  # Pre-cutoff cars: aluminium-support failure in service is
  # documented and the consequence is loss-of-wheel-control at
  # potentially highway speeds. Severity ranked at the highest
  # applicable case per catalogue convention. Routine ball-joint
  # wear on later cars, considered alone, is moderate.

cost_range_usd:
  aluminum_to_steel_retrofit_parts_only:
    low: 250
    high: 700
    _source_anchor: >
      The retrofit parts list is documented in Rennlist's 928
      Suspension FAQ — ball-joint supports (P/N 928.341.049.12,
      qty 2), adjusting eccentrics (P/N 928.341.466.00, qty 4),
      and a left/right bracket pair (P/Ns 928.341.091.05 and
      928.341.092.05). AASE Sales currently catalogues the URO
      ball joint for the steel-type carrier at approximately $108
      each (Tier-B specialist parts retailer). Bracket and
      eccentric parts cost varies by supplier and current stock;
      the $250–$700 band brackets the all-parts cost across
      specialist vendors at the time of writing.
  aluminum_to_steel_retrofit_specialist_shop_labor_inclusive:
    low: 800
    high: 1800
    _source_anchor: >
      The procedure on Rennlist's How-To "How to Replace Front
      Suspension Ball Joints" article is described as time-consuming
      but not technically demanding — within independent-specialist
      shop scope at typical 928-specialist labour rates (Precision
      Motorwerks, 928 International). The $800–$1,800 band reflects
      shop labour plus parts at independent-specialist rates and is
      consistent with general Tier-B specialist framing of the job
      as a half-day procedure per side.
  routine_ball_joint_replacement_post_cutoff_cars_specialist_shop:
    low: 600
    high: 1500
    _source_anchor: >
      For post-September-1983 cars where the steel support is already
      fitted from factory, replacement is limited to the ball-joint
      element itself plus the rubber boot. Per Rennlist editorial
      framing the parts cost is in the $100–$300 per side band; the
      labour scope is similar to the retrofit case minus the
      bracket/eccentric replacement step. RepairPal cross-references
      a higher-band Porsche 928 control-arm-replacement figure
      ($2,379–$2,567 average; Tier-C aggregator) but this figure is
      for full-arm replacement scope rather than ball-joint-only and
      sits outside the published-specialist band used here.

prevalence_rate:
  qualitative: aluminum_support_failure_PCNA_TSB_acknowledged_pre_cutoff_routine_wear_universal_with_age_on_all_928s
  _source_anchor: >
    Porsche issued Technical Bulletin 84-01 directing replacement of
    aluminium lower ball-joint supports on MY78–83 cars (PCNA TSB,
    referenced via Rennlist 928 forum thread on TSB 84-01 and via
    928 Classics' resources page; the bulletin's existence and
    substantive direction are confirmed by both specialist sources).
    Rennlist's 928 Suspension FAQ (authored by Wally Plumley with
    contributions from the named 928 community specialists)
    reproduces the bulletin's substance and adds owner-reported
    cases of aluminium-support failure while driving, framed as an
    explicit safety concern. Routine ball-joint wear on all 928s is
    treated as expected service-life progression in Rennlist
    editorial how-to material and Pelican Parts technical articles.
    Numeric prevalence rate not asserted.

failure_correlation:
  - age (rubber boots and ball-joint grease degrade with calendar time)
  - mileage (ball-joint wear progresses with cycle count)
  - storage condition (long-stored cars accelerate boot degradation; salt-belt cars accelerate carrier corrosion)
  - aluminium-support specific: corrosion progression on pre-cutoff cars accelerates support failure regardless of mileage

typical_failure_mileage_or_age:
  qualitative: aluminum_support_failure_age_driven_on_pre_cutoff_cars_routine_wear_at_60k_to_100k_mile_intervals
  _source_anchor: >
    Aluminium-support failure is treated by Rennlist's 928 Suspension
    FAQ as age-driven with no specific mileage threshold — the
    aluminium fatigues in service and the failure mode does not
    correlate primarily with miles. Routine ball-joint replacement
    is recommended in the 60,000–100,000-mile band per Rennlist
    editorial how-to framing, consistent with general luxury-coupe
    suspension service intervals.

retrofit_available: yes
retrofit_kit_names:
  - Porsche steel ball-joint support (P/N 928.341.049.12) and adjusting eccentric (P/N 928.341.466.00) and left/right brackets (P/N 928.341.091.05 and 928.341.092.05) — the original-equipment retrofit path documented in Rennlist's 928 Suspension FAQ
  - URO replacement ball joints for steel carriers (multiple specialist suppliers including AASE Sales and similar)

regional_amplification:
  salt_belt: high
  coastal_humid: moderate
  # Salt-belt amplifies aluminium-support corrosion and accelerates
  # the failure window on pre-cutoff cars; coastal humid climates
  # show moderate amplification.

keywords:
  addressed:
    - "ball joints replaced"
    - "lower ball joints replaced"
    - "steel ball joint supports"
    - "steel carriers installed"
    - "aluminum ball joint retrofit"
    - "ball joint upgrade to steel"
    - "front suspension refresh"
    - "lower control arms rebuilt"
  concerning:
    - "aluminum ball joints"
    - "aluminum supports"
    - "original ball joints"
    - "ball joints unknown"
    - "front suspension original"
    - "pre-1984 928 suspension"
  active_problem:
    - "ball joint failure"
    - "ball joint separated"
    - "wheel loose"
    - "clunk over bumps"
    - "tramlining"
    - "wandering on highway"
    - "creaking turning steering wheel"
  documented:
    - "ball joint replacement invoice"
    - "928 Specialists invoice"
    - "928 International invoice"
    - "Precision Motorwerks invoice"
    - "front suspension overhaul records"
    - "magnet test confirmed steel supports"

evidence_basis:
  tier_a:
    - Porsche Technical Bulletin 84-01 — Aluminum lower-ball-joint replacement, MY78–83 (PCNA TSB referenced via Rennlist 928 forum and 928 Classics specialist resource page; primary PCNA-hosted document not directly retrieved at the time of writing — see schema-extension queue note on tier_a_doc_retrieved status)
  tier_b:
    - Rennlist — 928 Suspension FAQ (Wally Plumley, with named 928 specialist contributors; canonical Tier-B reproduction of TSB 84-01's substantive content — VIN cutoff, part numbers, identification methods, safety framing)
    - 928 Classics — resources page citing TB 84-01 directly (Tier-B specialist resource confirming the bulletin's existence and number)
    - Rennlist editorial how-to — Porsche 928 How to Replace Front Suspension Ball Joints (procedure framing, aluminum-vs-steel context)
    - 928 International — repair documentation (parts and procedure framing for ball-joint and steering work)
    - Precision Motorwerks — 928 specialist services (specialist independent labour anchor)
    - AASE Sales — URO ball joint product page for 928 steel-type carriers (parts pricing anchor)
  tier_c:
    - Rennlist 928 forum — "ALUMINUM BALL JOINT FAILURE" thread (owner-captured failure with photos, retrofit shopping list discussion)

sources:
  - name: Porsche Technical Bulletin 84-01 — Aluminum lower-ball-joint replacement, MY78-83 (referenced via Rennlist 928 forum thread on TSB 84-01 and via 928 Classics resources page; primary PCNA-hosted document not directly retrieved)
    tier: A
    url_or_reference: rennlist.com/forums/928-forum/838473-aluminum-ball-joint-replacement-my78-83-technical-bulletin-tsb-84-01-a.html (specialist secondary; primary TSB document not located online)
  - name: 928 Classics — Resources page citing TB 84-01 (Tier-B specialist confirming the bulletin's existence and substance)
    tier: B
    url_or_reference: 928classics.com/resources/
  - name: Rennlist — Porsche 928 Suspension FAQ (Wally Plumley)
    tier: B
    url_or_reference: rennlist.com/porsche-928-faq/porsche-928-suspension-faq/
  - name: Rennlist — Porsche 928 How to Replace Front Suspension Ball Joints (editorial how-to)
    tier: B
    url_or_reference: rennlist.com/how-tos/a/porsche-928-how-to-replace-front-suspension-ball-joints-384025
  - name: 928 International — repair documentation index
    tier: B
    url_or_reference: 928intl.com/repair.htm
  - name: Precision Motorwerks — 928 services (suspension and chassis specialist)
    tier: B
    url_or_reference: precisionmtrwerks.com/services/services.htm
  - name: AASE Sales — 928 Ball Joint for Control Arm 1978-86 (URO P/N 928.341.049.14, steel-carrier-only)
    tier: B
    url_or_reference: aasesales.com/products/noloc-s54-118763
  - name: Rennlist 928 forum — ALUMINUM BALL JOINT FAILURE thread (owner-captured failure)
    tier: C
    url_or_reference: rennlist.com/forums/928-forum/550378-aluminum-ball-joint-failure.html
  - name: RepairPal — Porsche 928 Control Arm Replacement Cost (Tier-C aggregator, cross-reference only)
    tier: C
    url_or_reference: repairpal.com/estimator/porsche/928/control-arm-replacement-cost

editorial_note: >
  This record covers two separable concerns on the same hardware. The
  first applies only to 928s built before September 1983 (chassis
  number 92ES860404; the cutoff and the retrofit direction are
  documented in Porsche Technical Bulletin 84-01, referenced via
  Rennlist's 928 Suspension FAQ and 928 Classics' specialist
  resource page): the original aluminium lower-ball-joint support
  is documented as having failed in service on multiple cars, with
  Porsche itself directing the retrofit and the specialist community
  describing the situation in unambiguously safety-critical language.
  The identification test is straightforward — a magnet sticks to
  steel but not to aluminium, and the visual outline is figure-eight
  on steel and oval on aluminium. The retrofit to steel is well-
  documented at the parts level and is within independent-specialist
  shop scope. A pre-cutoff 928 with documented aluminium-to-steel
  retrofit is in good shape on this dimension; a pre-cutoff car still
  on original aluminium supports has a real and disqualifying liability
  pending until that work is performed, full stop.

  The second concern is routine ball-joint wear on all 928s — pre- and
  post-cutoff — at the standard 60,000-to-100,000-mile interval, with
  age-driven boot and grease degradation that progresses independently
  of mileage on long-stored cars. This is buyer-due-diligence in the
  ordinary sense: ask whether the lower ball joints have been replaced
  in the recent service history, and request invoices.

  Specialist channel is concentrated. 928 International, Precision
  Motorwerks, and the cluster of Rennlist-channel 928 specialists
  (Wally Plumley's documentation, the contributor list on the 928
  Suspension FAQ) are the canonical sources of parts, procedure, and
  shop labour. A 928 with documented suspension service through one
  of these channels carries a different reliability profile than one
  serviced by general European-car shops without 928-specific
  experience.

  Note: the 928's front upper ball joint is also subject to wear and
  is typically inspected and serviced alongside the lower; the
  Rennlist 928 forum aluminum-ball-joint-failure thread captures the
  observation that the upper ball joint takes high stress as the
  lower fails, supporting the do-it-all-at-once approach described in
  the FAQ.

buyer_questions:
  - What is the chassis number? (For pre-92ES860404 cars: have the lower ball-joint supports been retrofitted from aluminium to steel? At what shop and with which parts?)
  - For pre-cutoff cars: has a magnet test or visual inspection confirmed steel supports are now fitted?
  - For all 928s: when were the front lower ball joints last replaced? At what mileage and by which shop?
  - Have the rubber boots on the lower and upper ball joints been inspected recently? Are they intact, cracked, or torn?
  - Is there any clunking on bumps, tramlining, or steering judder under normal driving?
  - Can you provide invoices and the shop name for all suspension work?
```

---

## Record 5 — 928 power steering rack: outer-seal leak and pump cascade

```yaml
id: 928_power_steering_rack_leak
flag_title: 928 power-steering rack — outer-seal leak with cascading pump damage if ignored

description: >
  The 928 is fitted with a ZF rack-and-pinion power-steering rack that
  Rennlist's editorial how-to article (Joseph Coelho, with named 928
  community specialist contributors) treats as one of the car's
  most predictable weak points. The canonical failure mode is wear of the
  outer rack seals: fluid leaks past the seals into the protective
  rubber boots at each tie-rod end, and the boots and the car's belly
  pans together hide the leak from casual inspection. The first
  external symptom is often the power-steering pump moaning when fluid
  level drops, by which point the leak has progressed considerably and
  the pump itself may have been damaged by running on low or air-
  contaminated fluid. Specialists distinguish three discrete failure
  points in the system, each with its own repair scope and cost:
  outer rack seals (the canonical leak site, repairable by rack
  rebuild), the rack's internal valving (typically requiring full rack
  replacement on later cars), and the pump itself (replaceable
  separately).

  Two specialist solution paths are well-documented. First, full rack
  rebuild — either send-out to a 928 specialist (928 International,
  Precision Motorwerks, and the named "Roger" rebuild service that
  installs Delrin steering-rack bushings as part of the rebuild) or
  in-house using a Porsche steering-rack repair kit with the
  procedure documented on member.rennlist.com (Pirtle archive) and
  928 International's repair index. Second, exchange replacement
  with a remanufactured rack, typically from 928 International. A
  specialist-significant detail: from approximately the 1990 model
  year onward, 928 racks carry an increased-power-assist
  feature that lower-cost generic exchange-rack vendors do not always
  preserve, so a rebuild service that returns the owner's original
  rack is the recommended path on S4 (1990+), GT, and GTS cars.

applicability:
  generation: [928, 928_S, 928_S2, 928_S4, 928_GT, 928_GTS]
  engine_family: [M28_V8]
  year_range: [1977, 1995]
  trim_category: [928_4_5, 928_S_4_7, 928_S2_4_7, 928_S4_5_0, 928_GT_5_0, 928_GTS_5_4]
  body: [coupe]
  excludes: >
    The 924/944/968 transaxle four-cylinder family uses a different
    power-steering rack layout (and on early 924s, no power assist
    at all on certain trims); those cars are out of scope of this
    record. Air-cooled 911s and water-cooled flat-six cars use
    different rack designs. The 928's increased-power-assist feature
    on 1990+ cars is a sub-population concern within this record's
    applicability rather than an exclusion: all 928s are in scope,
    but the editorial framing distinguishes the 1990+ S4/GT/GTS
    sub-population as having a specific reason to prefer the
    rebuild-your-own-rack path over generic exchange.

severity: high
  # Repair-cost scope is moderate ($400-$1500 rack rebuild or exchange,
  # plus pump if cascade has occurred). Severity ranked at high rather
  # than moderate because the cascade-to-pump pattern means delayed
  # repair compounds cost meaningfully — the pump can be damaged by
  # running on low fluid before the leak is even visible from above
  # the car.

cost_range_usd:
  rack_rebuild_diy_parts:
    low: 80
    high: 200
    _source_anchor: >
      Member.rennlist.com (Pirtle archive) and 928 International's
      repair index document the Porsche steering-rack repair kit
      (rings and seals) as the parts requirement for a DIY rebuild;
      historical specialist parts retailer pricing for the kit sits
      in the $80–$200 band. Roger's in-house rebuild service (per
      the Rennlist 928 Steering Rack Rebuild thread) includes Delrin
      bushings as an upgrade and is priced at the labour-plus-
      premium-parts band, not in this kit-only band.
  specialist_rack_rebuild_send_out_with_warranty:
    low: 600
    high: 1500
    _source_anchor: >
      Rennlist's 928 Steering Rack Rebuild thread captures owner-
      reported pricing on specialist rebuild services. Member.rennlist
      (Pirtle archive) cites approximately $400 for a remanufactured
      928 International rack as a historical figure; the Rennlist
      thread reproduces a current-era ZF rebuild quote of "over $1000"
      on later S4/GT/GTS racks where the increased-power-assist
      feature must be preserved. The $600–$1,500 range brackets
      currently active specialist rebuild pricing across pre- and
      post-1990 racks; the high end applies particularly to S4/GT/GTS.
  remanufactured_exchange_rack_specialist:
    low: 400
    high: 1000
    _source_anchor: >
      928 International is the canonical exchange-rack source per
      Rennlist's 928 Steering Rack Rebuild thread and the 928
      International repair index. Historical pricing of approximately
      $400 (per Pirtle archive) and current-era pricing closer to
      $1,000 (per Rennlist thread) span the band; the lower end
      applies to early 928 racks without the increased-assist feature
      and the upper end to later S4/GT/GTS racks.
  power_steering_pump_replacement_remanufactured_unit:
    low: 200
    high: 600
    _source_anchor: >
      Rennlist editorial how-to (Coelho with named contributors) frames
      the pump as a downstream-cascade replacement when the rack leak
      runs the system low; the pump is replaced as a separate part
      with the rack rebuild. The Pirtle archive on members.rennlist
      treats pump replacement as a discrete specialist service line.
      Specialist remanufactured OE-pattern pumps run in the $200–$600
      band at independent-specialist rates; bundled with rack work
      the marginal labour cost is small. General-retailer aftermarket
      remanufactured units (Endurance and similar) are catalogued at
      lower per-part figures but are not Porsche-specialist sources
      and are not the primary anchor for this band.
  power_steering_hose_replacement:
    qualitative: scope_dependent_typically_bundled_with_rack_or_pump_service
    _source_anchor: >
      Rennlist 928 forum captures owner cases of single-hose
      replacement at well under $200 in parts plus DIY labour; the
      pump-feed and pump-return hoses are the canonical leak points
      identified in those threads. RepairPal (Tier-C aggregator)
      cites a $1,248–$1,308 average for Porsche 928 power-steering
      hose replacement at typical labour rates. No Tier-B specialist
      publication carries a hose-specific figure on file. Per the
      catalogue's principle that Tier C is never sole source for
      cost, this band is presented qualitatively: hose work is
      typically bundled with rack or pump service rather than
      performed standalone, and the buyer-due-diligence question
      is service history rather than dollar figures.

prevalence_rate:
  qualitative: common_age_driven_recurring_28_specialist_documented
  _source_anchor: >
    Rennlist's editorial how-to framing characterises the steering-
    rack leak as a known 928 weak-point and routinely-encountered
    repair item; specialist shops (928 International, Precision
    Motorwerks) treat rack rebuild as a stocked-service line. The
    age band of cars currently in service (every 928 is at least
    30 years old at the time of writing) means original-fluid-
    original-rack cars are uncommon and the buyer's posture should
    be that some history of rack work is expected on a well-cared-
    for car. Numeric prevalence rate not asserted; no Tier-A figure
    or Porsche AG TSB on the rack is on file.

failure_correlation:
  - age (rubber seals dry out and crack with calendar time, accelerating in long-stored cars)
  - mileage (seal-cycle count drives outer-seal wear)
  - storage condition (long-stored cars accelerate seal failure as fluid sits and accumulates moisture)
  - fluid maintenance (skipped fluid changes accelerate seal failure; specialists recommend ATF — Dexron III — per Pirtle archive)

typical_failure_mileage_or_age:
  qualitative: rebuild_window_60k_to_120k_miles_or_15_to_25_years_age_dominant_on_long_stored_cars
  _source_anchor: >
    Rennlist editorial how-to material treats rack rebuild as a
    routine-with-age item rather than a mileage-threshold event.
    Captured Rennlist 928-forum cases span 50,000-mile cars with
    early leak presentations and 150,000-mile cars with original
    racks still serviceable — age and storage condition are the
    dominant correlates, not mileage in any narrow sense. The
    15–25-year age band brackets cars that have aged out of their
    original seal life regardless of miles; every current-market
    928 falls within or beyond this band.

retrofit_available: yes
retrofit_kit_names:
  - Porsche steering-rack repair kit (rings, seals, O-rings) — the OEM rebuild path documented in Pirtle archive and 928 International repair index
  - 928 International remanufactured exchange rack (canonical specialist exchange path)
  - Specialist rack rebuild service preserving original housing and increased-power-assist feature on 1990+ S4/GT/GTS cars (the "send-it-to-Roger" path captured in Rennlist 928 Steering Rack Rebuild thread; Delrin steering-rack bushings included as an upgrade)
  - Endurance and similar remanufactured 928 power-steering pumps (separate from rack work)

regional_amplification:
  cold_climate: moderate
  coastal_humid: moderate
  # Cold climate amplifies seal stiffening and leak presentation;
  # coastal humid environments amplify fluid-side moisture
  # accumulation in long-stored cars.

keywords:
  addressed:
    - "steering rack rebuilt"
    - "steering rack replaced"
    - "928 International rack"
    - "remanufactured rack installed"
    - "rack seals replaced"
    - "power steering pump replaced"
    - "power steering hoses replaced"
    - "power steering serviced"
    - "ATF flushed"
    - "Delrin rack bushings installed"
  concerning:
    - "power steering rack original"
    - "rack history unknown"
    - "power steering fluid topped up frequently"
    - "leak under car"
    - "stain under car"
    - "ATF stains"
  active_problem:
    - "power steering pump moaning"
    - "power steering pump whining"
    - "power steering fluid leak"
    - "puddle under car"
    - "leak from steering rack"
    - "steering hard at low speed"
    - "power steering fluid low"
  documented:
    - "steering rack rebuild invoice"
    - "928 International rack invoice"
    - "Precision Motorwerks invoice"
    - "Roger steering rack rebuild"
    - "power steering service records"

evidence_basis:
  tier_a: []
  tier_b:
    - Rennlist editorial how-to — Porsche 928 How to Rebuild Steering Rack (Joseph Coelho with named specialist contributors Doc Wilen, Mike Frye, Dwayne, Jon928se; canonical Tier-B)
    - Member.rennlist.com — Pirtle 928 Steering Rack archive (DIY procedure, historical pricing)
    - 928 International — repair index and rack rebuild service (canonical specialist exchange and rebuild source)
    - Precision Motorwerks — Porsche Racing Products steering-rack rebuilding service (specialist rebuild path preserving original housing on late cars)
  tier_c:
    - Rennlist 928 forum — 928 Steering Rack Rebuild thread (owner-reported pricing capture, increased-power-assist warning)
    - Rennlist 928 forum — Power Steering Fluid Leak thread (failure-cascade owner cases, hose-leak discussion)

sources:
  - name: Rennlist editorial how-to — Porsche 928 How to Rebuild Steering Rack
    tier: B
    url_or_reference: rennlist.com/how-tos/a/porsche-928-how-to-rebuild-steering-rack-383853
  - name: Member.rennlist.com (Pirtle) — 928 S4 Service - Steering Rack archive
    tier: B
    url_or_reference: members.rennlist.com/pirtle/svc_sr.html
  - name: 928 International — repair index (steering rack and related procedures)
    tier: B
    url_or_reference: 928intl.com/repair.htm
  - name: Precision Motorwerks — Porsche Racing Products (steering-rack rebuilding service)
    tier: B
    url_or_reference: precisionmtrwerks.com/products/products.htm
  - name: Rennlist 928 forum — 928 Steering Rack Rebuild thread
    tier: C
    url_or_reference: rennlist.com/forums/928-forum/1200168-928-steering-rack-rebuild.html
  - name: Rennlist 928 forum — Power Steering Fluid Leak thread (failure-cascade owner cases)
    tier: C
    url_or_reference: rennlist.com/forums/928-forum/515421-power-steering-fluid-leak.html
  - name: RepairPal — Porsche 928 Power Steering Hose Replacement Cost (Tier-C aggregator, cross-reference only)
    tier: C
    url_or_reference: repairpal.com/estimator/porsche/928/power-steering-hose-replacement-cost

editorial_note: >
  The 928 power-steering rack leak is documented in Rennlist's editorial
  how-to material as one of the car's most predictable repairs and is
  treated by specialists as a stocked-service line rather than as
  exceptional work. The diagnostic challenge is that the leak hides:
  the rubber boots at the rack's tie-rod ends fill with fluid,
  obscuring drips, and the car's belly pans catch the overflow before
  it reaches the ground in many cases. The first symptom many owners
  notice is the pump moaning or whining, which is downstream of the
  leak by enough time that pump damage is often already underway.
  A buyer should pull the boot back at each tie-rod end and look for
  ATF accumulation, in addition to checking the engine bay for fluid
  staining around the pump and reservoir.

  The repair-path question is shaped by model year. On pre-1990 cars
  (4.5L base, 4.7L S, S2), exchange of the rack with a 928 International
  remanufactured unit is straightforward and the increased-power-assist
  feature is not at stake. On 1990+ S4, GT, and GTS cars, the
  increased-power-assist feature is a meaningful driving-experience
  factor that not every generic exchange-rack vendor preserves, and
  the recommended path is rebuild of the owner's original rack —
  either through 928 International's rebuild service, Precision
  Motorwerks' rebuilding service, or the named "Roger" specialist
  rebuild captured in Rennlist's 928 Steering Rack Rebuild thread,
  which includes Delrin steering-rack bushings as an upgrade. A
  buyer of a late S4, GT, or GTS should specifically ask whether
  any past rack work preserved the original-housing-with-increased-
  assist configuration or whether it was replaced with a generic
  rebuilt unit.

  Cross-reference. Because the rack and pump operate as a closed
  hydraulic loop, leak-cascade failures often involve both ends of
  the system. A buyer pricing a rack rebuild on a high-mileage car
  should budget for pump inspection at the same service event;
  power-steering hose replacement can typically be deferred unless
  visible degradation is present, but should be inspected at the
  same time. The 928 power-steering system uses ATF (Dexron III) per
  Pirtle's archive — not a dedicated power-steering fluid — and a
  fluid flush at the time of rack work is recommended specialist
  practice.

buyer_questions:
  - Has the steering rack ever been rebuilt or replaced? At what mileage and by which shop? With original housing preserved or with an exchange unit?
  - For 1990+ S4, GT, or GTS cars: does the current rack have the increased-power-assist feature? Was this preserved through any past rack work?
  - Are there visible fluid stains under the car or in the engine bay near the power-steering reservoir? Pull back the rack boots — is ATF pooled inside?
  - Has the power-steering fluid been flushed in recent service history? At what interval?
  - Does the pump moan or whine, particularly when turning at low speed or when fluid is cold?
  - Have any power-steering hoses been replaced? When and by which shop?
  - Can you provide invoices for all power-steering and steering-rack work?
```

---

## Cross-references

**Within file 10:**
- **Records 4 and 5** both apply to the 928 platform and share specialist channels (928 International, Precision Motorwerks, the Rennlist editorial how-to library and FAQ archive). A buyer of any 928 should evaluate both records together, since lower-suspension and steering-rack work can be bundled efficiently and the same shops perform both. The shared specialist channel is also a quality signal in its own right: a 928 with a paper trail through 928 International or Precision Motorwerks carries a different reliability profile than one serviced by general European-car shops without 928-specific experience.
- **Records 1 and 3** both apply to water-cooled 911s, Boxsters, and Caymans of overlapping generations (Record 1 covers 996/997/986/987 chassis suspension; Record 3 covers PCCB-equipped cars including those generations and all later ones). On a PCCB-equipped 996/997 GT3 or Turbo, both records apply: the GT3 chassis carries stiffer-bushed control arms (Record 1's editorial qualifier) and PCCB was an option (Record 3 fully applies).

**To other files:**
- **File 09 (drivetrain & transmissions) cross-references.** The Cayenne 958 transfer-gear record (`cayenne_958_transfer_gear`, file 09 record 4) and this file's Cayenne air-suspension record (Record 2) cover overlapping VIN ranges. A 2011–2018 Cayenne (92A) carries documented Tier-A transfer-gear risk *and* the Tier-B air-suspension risk this file flags. Both should be evaluated for any 92A purchase. Note that Porsche has formally extended warranty on the transfer gear (TSB 83/20) but has *not* issued any analogous action on air suspension; the regulatory and warranty postures of the two issues are different.
- **File 11 record 1 — wheel-speed-sensor extended warranty (TSB 122-19).** Now authored as `cayenne_macan_wheel_speed_sensor_warranty_extension` in File 11 (originally cited in File 09's deferred-items list as a File 11 candidate; that authoring was completed). Worth noting here as an additional Cayenne 92A extended-warranty action a buyer should ask about. The combination of three Porsche-acknowledged or specialist-documented Cayenne 92A risks (transfer gear, wheel-speed sensors, air suspension) means a 2011–2018 Cayenne carries a constellation of pre-purchase questions that should be addressed together.
- **File 05 (928 V8 engine) cross-references.** File 05's "Considered and Not Included" section explicitly defers ball-joint, engine-mount, and power-steering-rack records to "a future suspension-and-chassis file" — that future file is this one. Records 4 and 5 fulfil that deferral. Engine mounts on the 928 are not authored as a record at this stage (below the buyer-due-diligence bar per file 05's existing classification); they remain a service item rather than a flagged defect. Cooling system / radiator corrosion on the 928 is also deferred (see file 05's "Considered and Not Included" item) and remains a candidate for a future cooling-systems file.
- **File 01 (M96/M97) and file 02 (Mezger) cross-references.** Record 1 in this file covers 996/997 chassis lower control arms across all engine families (M96, M97, Mezger, 9A1) — the chassis defect is engine-agnostic. A 996/997 GT3 or Turbo (file 02 Mezger applicability) and a 996/997 Carrera (file 01 M96/M97 applicability) share Record 1's control-arm wear pattern, although the GT3's stiffer factory bushings put it at a different point in the wear curve. The matcher should route any 996/997 chassis listing to Record 1 regardless of engine family, with the editorial qualifier handling the GT-trim distinction.
- **File 06 (Cayenne V8 engine) cross-references.** Record 2 (Cayenne air suspension) covers all Cayenne V8 trims (and V6, diesel, hybrid) of 955/957/958 generations. File 06's engine-side records and this file's chassis-side record together cover the major Cayenne pre-purchase questions on the 9PA and 92A platforms.
- **Future file (chassis 991+ / 981 / 718).** The aftermarket evidence base shows the 996/997-family thrust-arm-bushing pattern continues mechanically into 991/992/981/718. A v2 record extending Record 1's applicability to 991/992 chassis 911s and 981/718 Boxster/Caymans is the natural extension when specialist failure-prevalence documentation on those generations is more developed. The Tarett Engineering and Elephant Racing product ranges already span 991/992 and 981/718 alongside 996/997/986/987.

---

## Items deferred from this file

- **991, 992, 981, and 718 lower control arms.** The aftermarket bushing and arm catalogue (Tarett, Elephant Racing) extends fitment compatibility from 996/997/986/987 through 991/992/981/718, indicating shared architecture. However, specialist Tier-B failure-prevalence and presentation documentation on the 991+ generations is currently thinner than on 996/997 — a function of those cars being newer and not yet at the 80,000-to-100,000-mile refresh window in volume. A v2 record extending Record 1's applicability is the right approach when more specialist material accumulates. Until then, the 991/992/981/718 are out of scope of this v1 record.

- **Cayenne 9YA (third-generation, 2019+) air suspension.** The 9YA introduces a redesigned three-chamber air-suspension architecture on the MLB-Evo platform and Porsche has issued TSBs addressing 9YA air-suspension symptoms (visible on CarComplaints' 2020 Cayenne TSB index). Specialist Tier-B published material on 9YA failure prevalence is currently thin and the 9YA fleet has not aged into a documented failure window in volume. Deferred to a future v2 record.

- **PDCC (Porsche Dynamic Chassis Control) hydraulic anti-roll-bar leaks.** A 2013 Cayenne TSB on CarComplaints describes anti-roll-bar leaks on PDCC-equipped cars, attributed to a sealing-ring assembly defect. PDCC is offered on Cayenne, Panamera, and Macan applications and has its own discrete failure-mode profile. Deferred pending more comprehensive sourcing across all PDCC-equipped applications; potential v2 record for this file or a dedicated chassis-electronics file.

- **Cayenne wheel-speed-sensor extended warranty (TSB 122-19).** Authored as `cayenne_macan_wheel_speed_sensor_warranty_extension` in File 11 (a parallel Porsche extended-warranty action on Cayenne 2011-2018, alongside the transfer-gear extension). Out of scope of suspension/chassis defect framing but flagged in the cross-references above as part of the constellation of 92A pre-purchase questions a buyer should evaluate together.

- **928 engine mounts.** File 05's "Considered and Not Included" section flags worn engine mounts as a common idle-vibration cause on the 928, citing Classics World and Rennlist Buyer's Guide. Below the buyer-due-diligence bar at v1 — captured by general "service history" signals rather than a flagged defect record. Candidate for a v2 record if specialist quantification develops.

- **928 cooling system / radiator corrosion.** File 05's "Considered and Not Included" flags this as a real and noteworthy concern on the all-aluminium 928 cooling system. Below the v1 bar at this stage; candidate for a future cooling-systems file or a v2 expansion of the 928 chassis records.

- **Wheel bearings, sway-bar drop links, tie-rod ends.** Mentioned in Pelican Parts' 996/997 suspension overhaul article as routine wear items in the same 80,000-to-100,000-mile refresh window as control arms. Below the buyer-due-diligence flag bar — captured by general suspension-refresh service history rather than per-item flags.

- **Coil-spring conversion on Cayenne air-suspension cars as a pre-existing modification.** Aftermarket coil-spring conversion kits (Strutmasters and similar) are a documented response to air-suspension failure on 955/957/958 Cayennes. A car presented for sale with the conversion already performed represents a different value proposition than a car with the original air suspension functioning correctly: lower repair-cost exposure but loss of self-levelling, off-road ride-height adjustment, and load-compensation. Captured in Record 2's keywords and editorial framing rather than as a separate record.

If field experience surfaces clear specialist consensus on any of these, they can be added in a v2 pass.

---

## Schema-extension queue (carry to `00_schema.md` v2 candidates)

Authoring this file surfaced the following structural issues that the locked v1 schema does not cleanly accommodate. They are documented here for the v2 schema pass.

- **Factory option-code scoping (`option_code`, `requires_positive_keyword_match`).** Record 3 (PCCB) is the canonical case. PCCB is a factory option (option code 450) offered across many trims and generations, but the record's applicability cannot use the existing `generation`/`trim_category`/`engine_family` axes to scope correctly — a 991.2 Carrera S could have steel brakes (option not selected) or PCCB (option selected), and the record applies only to the latter. The current workaround relies on detection keywords ("PCCB," "ceramic brakes," "yellow calipers," option code 450) to identify in-scope listings, but the schema lacks a `requires_positive_keyword_match: true` flag that would suppress the `not_mentioned` matcher penalty on listings that don't carry any PCCB-identifying terms. A v2 schema extension introducing this flag (and a `factory_option_code` field for explicit option-level scoping) would let option-scoped records like PCCB apply correctly without false-positive penalties on steel-brake cars of the same trim.

- **VIN-range scoping (extends the v2 candidate already present in `00_schema.md`).** Record 4 (928 lower ball joint) requires VIN-level scoping at chassis number 92ES860404 to distinguish the aluminium-support sub-population from the steel-support sub-population. The schema's existing v2 candidate for production-date and engine-number scoping (motivated by the Cayenne V8 bore-scoring record per `00_schema.md`) covers this case in shape. The `applicability.excludes` v2 form should accommodate `chassis_number_before` and `chassis_number_after` predicates alongside `production_date_before` / `production_date_after` and `engine_numbers`. The 928 case is a clean precedent for the chassis-number variant.

- **Sub-population severity ranking on multi-cohort records.** Record 4 spans the aluminium-failure case (catastrophic safety) and the routine wear case (moderate). The current schema picks the highest applicable severity (catalogue convention), which is correct for matcher routing but reduces granularity for the buyer-facing display. A v2 extension allowing per-sub-population severity (paired with the production-date / chassis-number scoping above) would let the matcher render a different severity on a 1990 928 GTS (routine moderate) than on a 1980 928 (catastrophic, aluminium-supports-pending). This ties to the existing `prevalence_by_subpopulation` v2 candidate in `00_schema.md` for the IMS record.

- **Architectural sub-variant within a single record (`platform_variant` enum).** Record 2 (Cayenne air suspension) covers two genuinely distinct architectures (open system on 955/957; closed nitrogen system on 958) that share the buyer-due-diligence frame but differ in failure prevalence and presentation. Currently the editorial carries the architectural distinction in prose. A v2 `platform_variant` enum would let a single record carry differential prevalence across the variants without splitting into two records. This is the same shape of problem documented in file 09's schema-extension queue under "transmission_supplier_variant" — a transmission-side analogue of the same chassis-side need.

- **Cross-file constellation flagging.** Records 2 and 4 of file 09, plus this file's Records 2 and the cross-referenced wheel-speed-sensor warranty extension (now File 11 record 1), together describe a Cayenne 2011–2018 (92A) constellation of three to four discrete-but-related pre-purchase risks. The current schema treats each as an independent record. A v2 extension introducing a `cross_file_constellation_id` would let the matcher surface the three-or-four-record group as a single VIN-level pre-purchase question — useful particularly on cars where multiple Porsche-acknowledged or specialist-documented risks cluster on the same model years.

- **`evidence_basis` granularity and Tier-A retrieval status.** File 10 records 1, 2, and 3 use `evidence_basis` with empty `tier_a` lists since none of those defects has a Porsche AG TSB or warranty extension. Record 4 (928 lower ball joint) populates `tier_a` with Porsche TSB 84-01 — but the catalogue does not directly possess the primary PCNA TSB document; the bulletin's existence and substantive content are confirmed via specialist secondary sources (Rennlist 928 forum thread on TSB 84-01, 928 Classics resources page) rather than via direct retrieval from a PCNA-hosted or NHTSA-mirrored document. This is exactly the case that file 09's existing schema-extension candidate `tier_a_doc_retrieved: true | referenced_only` is designed to capture. The Record 4 case strengthens the v2 case for that field. Separately, the current `evidence_basis` enum in `00_schema.md` (`manufacturer_acknowledged | specialist_consensus | specialist_single_source | community_reported | disputed`) is being read as a single tier-style classification, but file 09's evolved form (and this file's form) treats it as a sub-listed structure (`tier_a / tier_b / tier_c` lists). The v2 pass should formalise the sub-listed form as canonical rather than the single-keyword form, since the sub-listed form is more informative and cleanly distinguishes records that span tiers from records that sit at one tier.

