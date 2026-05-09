# File 12 — Cooling Systems

This file covers cooling-system defects and high-prevalence service-cluster items across the water-cooled Porsche fleet (986 / 987 / 996 / 997 sport-car platforms, Cayenne 957 V8 4.8L DFI, and the 928 V8). Items here are either body-of-cooling-system components (radiators, expansion tanks, water pumps, coolant pipes external to the engine architecture) or cross-engine-family service clusters that prior files left below their respective bars.

Three explicit deferrals from prior files resolve here:
- File 01 (M96/M97 sport-car flat-six) deferred coolant expansion tank cracking and water pump composite-impeller failure as "service items rather than defects"; this file reframes both because the expansion tank's cracking-driven coolant loss and the water pump's downstream cylinder-head-cracking risk both clear the buyer-due-diligence bar even where regular-service framing applies.
- File 05 (928 V8) deferred 928 aluminium cooling system / radiator corrosion to "a future cooling-systems file."
- File 06 (Cayenne V8) held the Cayenne 957 4.8L DFI "rear coolant hose connector failure" item "pending direction"; that item is in scope here as the headline failure pathway (rear coolant manifold with epoxy-glued barb fitting), with the under-intake plastic Y-pipe with Porsche-released aluminium upgrade as a secondary bundled item — the editorial framing on the under-intake pipe is materially different from the 955 valley-pipe failure file 06 already covers.

Items contained in this file:

1. `water_cooled_era_coolant_expansion_tank_cracking` — 986 / 987 / 996 / 997 plastic coolant expansion tank seam cracking and slow coolant loss
2. `water_cooled_era_water_pump_composite_impeller_failure` — 986 / 987 / 996 / 997 water pump composite-impeller fragmentation, downstream cooling-passage clogging, and consequent cylinder-head-cracking risk
3. `water_cooled_era_front_mount_radiator_and_condenser_debris_and_corrosion` — 986 / 987 / 996 / 997 front-mount triple-radiator-plus-condenser corrosion driven by debris accumulation between the cores, road-debris fin damage, and salt-belt amplification
4. `cayenne_957_v8_4_8_dfi_rear_coolant_manifold_and_under_intake_pipe` — Cayenne 957 4.8L DFI rear coolant manifold with epoxy-glued barb fitting (HEADLINE catastrophic-coolant-loss failure) plus secondary under-intake plastic Y-pipe with Porsche-released aluminium upgrade; affects all 957 V8 variants MY 2008–2010
5. `porsche_928_aluminium_cooling_system_internal_corrosion_and_radiator_replacement` — 928 V8 all-aluminium cooling system internal corrosion driven by neglected coolant changes; OEM-radiator-replacement economics with three Tier-B aftermarket alternatives (CSF / 928 Motorsports / AlliSport)

Conventions applied in this file:
- Tier A = Porsche AG / PCNA / NHTSA-mirrored TSBs / PCA editorial / court-approved class actions
- Tier B = established specialists with named technical pages (Pelican Parts canonical how-tos, LN Engineering, Flat 6 Innovations, FCP Euro, Shark Werks, Lufteknic, Suncoast Porsche Parts, Europa Parts, Design 911, Go-Parts, 928 International, 928 Motorsports, AlliSport, CSF Race)
- Tier C = forums, named-individual community contributions, and aggregator sites without primary Porsche-specialist sourcing (consistency footnote only; never sole source for cost or prevalence)
- Numeric ranges with `_source_anchor` — never point estimates
- Cayenne generation naming uses file-10 specialist-canonical form (`cayenne_955` / `cayenne_957` / `cayenne_958` / `cayenne_9Y0`)
- Inline-four engines use `i4_` prefix (per file 11 review feedback)

---

## Record 1 — 986 / 987 / 996 / 997 coolant expansion tank cracking

```yaml
id: water_cooled_era_coolant_expansion_tank_cracking
flag_title: 986/987/996/997 coolant expansion tank — bottom-seam cracking, slow coolant loss, plastic ageing visible as yellowing/discolouration

description: >
  All water-cooled-era 911s (996, 997), Boxsters (986, 987), and
  Caymans (987) use a plastic coolant expansion tank mounted at the
  rear of the engine bay against the firewall. The tank is under
  approximately two bar of operating pressure and holds hot coolant
  through every drive cycle. Over years of thermal cycling the
  plastic ages, hardens, and develops cracks — most commonly along
  the bottom seam where the upper and lower halves join. The
  failure pattern is consistent across all four sport-car
  generations and across all engine variants from M96 through M97
  to Mezger and 9A1 (the tank architecture is shared across these
  platforms).

  Failure presents in three stages. Early stage: coolant odour
  after a drive without visible exterior leakage; the tank weeps
  microscopically through hairline cracks that close at room
  temperature and open under operating pressure. Middle stage:
  visible wet residue on the bulkhead below the tank; a low-coolant
  warning that returns within a few weeks of topping off. Late
  stage: a visible coolant puddle on the rear floor of the engine
  bay or on the ground beneath the rear of the car after a drive,
  often accompanied by a check-engine light if coolant has
  contaminated downstream sensors. The tank rarely fails
  catastrophically — the progression is slow enough that most
  owners catch it in the middle stage.

  A separate ageing signal independent of the leakage state:
  Porsche's plastic discolours from the original semi-clear/white
  to a yellow or amber tone with sustained heat exposure. A
  visibly-yellowed expansion tank is a reliable marker that the
  tank is well into its service-life decay even before any
  cracking is detectable. Multiple Tier-B specialists (Shark
  Werks, Lufteknic, Pelican Parts) treat the colour as a primary
  pre-purchase indicator: if the tank under the rear deck is
  yellow rather than clear, plan to replace it before the next
  long drive regardless of whether the car is currently leaking.

  Replacement is mechanically intricate but not labour-intensive.
  The Pelican Parts canonical how-to article documents the 996/997
  procedure as approximately three hours specialist labour plus
  parts; the engine must be lowered approximately one and a half
  to two inches to extract the tank cleanly, and on 997
  applications a fuel line, the carbon-canister evaporative line,
  and the pump feed hose must be detached. The Boxster 986/987
  procedure is structurally similar but accessed from a different
  side of the engine bay. The OEM Genuine Porsche tank is the
  specialist-recommended replacement (Shark Werks editorial
  characterises the OEM tank as the long-life replacement
  preferred over cheaper aftermarket alternatives, citing instances
  of aftermarket tanks cracking within the first year — the
  Rennlist 996 forum thread documents one such owner case where an
  aftermarket tank from a major specialist parts vendor cracked
  approximately eleven months after fitment, prompting a return to
  Genuine Porsche).

  This record is below the catalogue's catastrophic-defect bar
  (the tank rarely causes engine damage; coolant loss is gradual
  enough to be detected) but sits squarely on the buyer-due-
  diligence bar for any 996/997/986/987 at ten years or more from
  manufacture. Pre-purchase visual inspection of the tank — colour,
  presence of any wet residue on the bulkhead below, and the cap's
  integrity — is a five-minute check that surfaces a $300–$900
  question.

applicability:
  generation:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 986.1   # Boxster, 1997–2002
    - 986.2   # Boxster, 2003–2004
    - 987.1   # Boxster 2005–2008, Cayman 2006–2008
    - 987.2   # Boxster and Cayman, 2009–2012
  engine_family:
    # The tank is body-side / engine-bay-mounted; engine family does
    # not determine fitment within the sport-car water-cooled-era
    # population. Listed for matcher exhaustiveness.
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
    # All trims — Carrera through GT3 / GT2 RS — share the same tank
    # architecture (Shark Werks editorial confirms the failure mode
    # applies across the full water-cooled 996 / 997 lineup
    # including 996 TT, 997 TT, GT2, GT3, GT3 RS, GT2 RS).
    - Carrera
    - Carrera_4
    - Carrera_S
    - Carrera_4S
    - Carrera_GTS
    - Targa_4
    - Targa_4S
    - GT3
    - GT3_RS
    - GT2
    - GT2_RS
    - Turbo
    - Turbo_S
    - Boxster
    - Boxster_S
    - Boxster_Spyder
    - Cayman
    - Cayman_S
    - Cayman_R
  year_range: [1997, 2012]

severity: low
# Severity is low because failure presentation is gradual (slow
# coolant loss with cracking-progression timeline measured in
# months), repair cost is contained ($200–$900 specialist), and
# downstream consequences are recoverable so long as the leak is
# caught before complete coolant loss. Catastrophic outcomes
# (engine overheat from sudden tank rupture) are rare in the
# Tier-B record. The reason this is on the catalogue at all is
# prevalence — the tank is one of the highest-frequency single-
# component pre-purchase questions on a 996/997/986/987 at age
# ten-plus years.

cost_range_usd:
  diy_oem_genuine_porsche_tank_with_cap:
    low: 200
    high: 400
    _source_anchor: >
      Pelican Parts catalogue and Suncoast Porsche Parts list the
      Genuine Porsche coolant expansion tank for 996/997
      applications in the $200–$400 range depending on specific
      part-number variant (the tank changed mid-996 production —
      the 996.1 (1998–2001) tank and the 996.2 (2002+) tank are
      different SKUs at different price points; the 996.2 tank is
      typically more expensive). Boxster 986/987 tanks fall in the
      same range. The cap is sold separately or as a kit; Shark
      Werks bundles tank-and-cap as a refresh kit. The $200–$400
      band brackets specialist-vendor Genuine Porsche tank pricing
      with cap across the full 1997–2012 sport-car application
      span.
  diy_aftermarket_tank:
    low: 100
    high: 200
    _source_anchor: >
      Pelican Parts catalogue lists aftermarket coolant expansion
      tanks for 996/997 applications at approximately one-third to
      one-half the Genuine Porsche price point (Pelican-internal
      lowest-cost SKU 996-106-147-56-Y-INT documented on the
      Rennlist 996-forum thread at the lower end of this band).
      The Shark Werks editorial and Rennlist owner reports
      consistently advise against the aftermarket route — multiple
      cases of aftermarket tanks cracking within the first year
      are documented. The catalogue lists this band for
      completeness but does not recommend it; a buyer who replaces
      with aftermarket should expect to replace again sooner.
  diy_total_parts_with_hoses_and_clamps:
    low: 250
    high: 500
    _source_anchor: >
      Pelican Parts coolant-flush technical article documents the
      complete clamp-replacement set for 996/997 cooling system
      service (49mm clamp 999-512-348-02-OEM ×8, 25mm/28mm clamp
      999-512-552-00 ×10, 53mm clamp 999-512-669-09-OEM ×2, 20mm
      clamp 999-512-554-00 ×3) at approximately $50–$100 total
      depending on quantity needed. Owner consensus across
      Rennlist and Pelican forum threads is to refresh hoses and
      cap when the tank is out (the hoses are exposed during the
      job and the labour cost of a future hose-replacement job is
      significant). The $250–$500 band brackets total parts cost
      for a Genuine-Porsche tank refresh including cap, hoses
      adjacent to the tank, and clamps; pure tank-only DIY at the
      lower end.
  specialist_labour_total:
    low: 500
    high: 900
    _source_anchor: >
      Pelican Parts forum-thread owner experience and Lufteknic
      product pages document specialist labour at three-to-four
      hours for the tank-replacement procedure including hose and
      clamp refresh, with Pelican-thread commenter notes confirming
      the engine-lower step adds time relative to a simple
      bolt-out replacement. At specialist hourly rates of
      approximately $150–$200, the all-in specialist cost
      (Genuine Porsche parts + labour) lands in the $500–$900
      range. The lower band represents a clean three-hour job at
      a regional independent specialist; the upper band covers a
      job where additional cooling-system items (cap, level
      sensor, adjacent hoses) are bundled in the same visit. A
      buyer should treat this as the realistic specialist
      pre-purchase cost, with $700 as a typical mid-band figure.

prevalence_rate:
  qualitative: common_to_near_universal_with_age_on_water_cooled_sport_car_platforms
  _source_anchor: >
    Tier-B specialist consensus: Pelican Parts' canonical how-to
    article (separate articles for 996/997 and 986/987) frames
    the expansion tank as a routine high-frequency replacement
    item across the water-cooled sport-car population. Shark
    Werks editorial characterises the tank as a leading single-
    component coolant-leak source on the 996 and 997 lineup, with
    the failure pattern observed across all variants from base
    Carrera through GT2 RS. Lufteknic and Lang Racing list the
    tank as a fairly common replacement item correlated with age
    and mileage. The Pelican 997.2 article opens with a flat
    framing that the tank "will eventually wear out and need to
    be replaced." Numeric prevalence rate not asserted (no
    Tier-A or Tier-B published owner-survey data); the
    qualitative framing is anchored in the sustained Tier-B
    specialist-market presence of OEM-tank-replacement product
    lines and the canonical-how-to coverage across multiple
    specialists.

failure_correlation:
  - age (failure rate increases markedly past approximately ten years of vehicle life; thermal-cycling-driven plastic embrittlement is the primary mechanism)
  - heat_exposure (cars stored or operated in hot climates fail earlier than mild-climate cars)
  - mileage (correlated weakly; age and operating-temperature cycles dominate)
  - ownership_pattern (cars driven year-round on short trips that involve repeated full warm-up/cool-down cycles fail earlier than highway-cruising cars)

retrofit_available: yes
retrofit_kit_names:
  - "Genuine Porsche coolant expansion tank with cap (Shark Werks, Pelican Parts, Suncoast Porsche Parts, Lufteknic) — like-for-like factory part; specialist consensus is Genuine over aftermarket given documented aftermarket-tank early-failure cases. Two-year unlimited-mileage parts-only warranty on Genuine Porsche parts when not installed by a Porsche Service Centre."
  - "Aftermarket coolant expansion tank (Pelican Parts catalogue lowest-cost SKUs) — listed for completeness; specialist sources advise against given documented early-failure cases."

regional_amplification:
  hot_climate: high
  desert_southwest: high
  salt_belt: low
  coastal_humid: moderate
  cold_climate: low
  # Source-supported qualitatively: thermal cycling drives plastic
  # ageing, so hot-climate and desert-southwest cars accumulate
  # damaging cycles faster. Salt-belt and coastal-humid amplification
  # are lower because the failure mechanism is internal (plastic
  # embrittlement) rather than external (corrosion). Cold-climate
  # cars are not particularly affected; if anything, they experience
  # the failure later.

evidence_basis:
  tier_a:
    # No Porsche AG TSB or warranty-extension action covers the
    # expansion tank — Porsche treats this as a wear part outside
    # warranty extensions, and remedy is at owner expense.
  tier_b:
    - name: "Pelican Parts — Porsche 911 Carrera Coolant Tank Replacement, 996 (1998-2005) and 997 (2005-2012) — canonical Tier-B how-to with step-by-step procedure, parts-list, and seam-cracking failure-mode discussion"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/33-WATER-Coolant_Tank_Replacement/33-WATER-Coolant_Tank_Replacement.htm"
    - name: "Pelican Parts — Porsche Boxster Coolant Tank Replacement, 986 / 987 (1997–08) — canonical Tier-B how-to for Boxster and Cayman variants with parallel failure-mode framing"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Boxster_Tech/33-WATER-Coolant_Tank/33-WATER-Coolant_Tank.htm"
    - name: "Pelican Parts — Porsche 997.2 Coolant Reservoir Tank Replacement — Tier-B how-to specific to the 997.2 application; opens with flat framing that the tank wears out and requires replacement"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche_997/Coolant_Reservoir_Tank_Replacement/Coolant_Reservoir_Tank_Replacement.htm"
    - name: "Shark Werks — Is your 996 Coolant leaking? Could be your coolant expansion tank — Tier-B specialist editorial framing the tank as a leading coolant-leak source on the entire water-cooled 996/997 lineup including all turbo and GT variants"
      tier: B
      url_or_reference: "sharkwerks.com/tech-articles/is-your-996-coolant-leaking-could-be-your-coolant-expansion-tank"
    - name: "Shark Werks — Porsche Genuine Coolant Expansion Tank and Cap product page — Tier-B specialist parts vendor with editorial framing of yellowing/discolouration as ageing signal and Genuine-over-aftermarket recommendation"
      tier: B
      url_or_reference: "sharkwerks.com/maintenance/p288397-porsche-genuine-coolant-expansion-tank-and-cap-coolexp"
    - name: "Lufteknic — Coolant expansion tank Porsche 911 996 / 997 product page — Tier-B specialist parts vendor with failure-mechanism description (heat, age, exposure) and yellowing-as-ageing-signal framing across 986/996/997/987 applications"
      tier: B
      url_or_reference: "lufteknic.myshopify.com/products/coolant-expansion-tank-porsche-911-996-997-99610615704"
    - name: "Suncoast Porsche Parts — Coolant Reservoir Tank product page (Genuine Porsche replacement, fits 2001–2012 Carrera, 2001–2012 Turbo/GT2, 2006–2012 GT3/RS/RS 4.0) — Tier-B parts vendor reference for OEM tank pricing on the 996.2/997 sport-car population; Suncoast's own framing positions this as the latest-version factory replacement"
      tier: B
      url_or_reference: "suncoastparts.com/product/99610615703.html"
    - name: "Suncoast Porsche Parts — Coolant Reservoir 1998-2000 Carrera product page (early 996.1 Carrera-only application) — Tier-B parts vendor reference confirming the early-996 SKU split from the 2001+ shared SKU"
      tier: B
      url_or_reference: "suncoastparts.com/product/SKU996RSRVR.html"
  tier_c:
    - name: "Rennlist 996 forum — Coolant Expansion Tank thread — Tier-C consistency: owner-purchased aftermarket tank failure within eleven months, return to Genuine Porsche, specialist-tank pricing capture; Pelican-Parts representative confirms the cheapest-SKU return rate for cross-reference"
      tier: C
      url_or_reference: "rennlist.com/forums/996-forum/963432-coolant-expansion-tank.html"
    - name: "Pelican Parts forum — Coolant System thread (cap-tightening / overflow case captures) — Tier-C consistency on owner-experience cap and tank failure modes adjacent to the seam-cracking primary"
      tier: C
      url_or_reference: "forums.pelicanparts.com/porsche-996-997-991-forum/498457-coolant-system.html"

editorial_note: >
  This is a service-cluster item rather than a discrete defect,
  but it is the single highest-frequency cooling-system question
  on a water-cooled-era sport-car platform at age ten-plus years.
  The pre-purchase signal is binary and visual: pop the rear deck,
  inspect the tank colour and the bulkhead below, and look for any
  damp residue. A clear/white tank with a dry bulkhead is fine. A
  yellowed tank with no wet residue is a budgetary item — plan to
  replace before the next long drive. A yellowed or discoloured
  tank with any damp residue on the bulkhead below is currently
  leaking and the buyer should price-in the $500–$900 specialist
  job before purchase.

  The cap is a separate failure point that bundles into the same
  service event. The Pelican coolant-flush article documents the
  redesigned coolant cap part number 996-106-447-04-M100 (the
  original cap was superseded mid-production); a buyer should
  confirm the current cap is the redesigned part. Replacing the
  cap independently of the tank is a sub-$50 part with five-minute
  labour; replacing the tank without also replacing the cap is
  false economy.

  The catalogue notes specialist consensus against aftermarket
  tanks: multiple Tier-B specialists (Shark Werks, Lufteknic) and
  Tier-C owner reports converge on the OEM Genuine Porsche tank
  as the long-service-life choice. Aftermarket tanks at the
  $100–$200 price point are documented to fail within the first
  year in some cases (Rennlist 996 thread case capture, Shark
  Werks editorial). On a pre-purchase basis, a car presented for
  sale with a recently-replaced expansion tank should have the
  invoice available — the buyer wants to confirm Genuine Porsche
  was used.

  This record sits in the broader "996/997/986/987 cooling-system
  service cluster" alongside Record 2 (water pump), Record 3
  (front-mount radiator and condenser), and the coolant-hose-
  refresh service item documented at Pelican (the engine-bay
  rubber hoses age in parallel with the tank and are accessible
  during the same service event). Specialist consensus is that a
  car arriving at the ten-year mark should have all of these
  evaluated together, with the tank-plus-cap-plus-adjacent-hoses
  bundle treated as the most cost-efficient single service event.

buyer_questions:
  - At inspection, lift the rear deck and inspect the coolant expansion tank visually. Is the tank clear/white, or has it yellowed or discoloured? A yellowed tank is a deferred maintenance signal regardless of current leakage state.
  - Below the tank, on the bulkhead and floor of the engine bay, is there any visible coolant residue, baked-on coolant staining, or damp area? Even the absence of an active drip does not rule out hairline-crack weeping under operating pressure.
  - Has the expansion tank been replaced in the car's service history? If yes — when, with what part (Genuine Porsche or aftermarket), and was the cap replaced at the same service?
  - Does the car experience low-coolant-warning resets between coolant-system services? A car that needs occasional top-offs without any visible exterior leak is a candidate for early-stage tank weeping.
  - For 1998–2001 (996.1) cars specifically — Tier-C owner reports document that Porsche revised the tank design mid-996 production with different SKUs for 1998–2001 versus 2002+ applications, with the later part typically priced higher. A buyer should confirm any replacement tank was the correct SKU for the specific model year rather than mismatched.
```

---

## Record 2 — 986 / 987 / 996 / 997 water pump composite-impeller failure

```yaml
id: water_cooled_era_water_pump_composite_impeller_failure
flag_title: 986/987/996/997 water pump — composite-impeller fragmentation, downstream cooling-passage clogging, cylinder-head-cracking risk on neglected service interval

description: >
  All M96 and M97 sport-car flat-six water pumps use a polymer
  impeller from the factory (the catalogue uses "composite" and
  "plastic" largely interchangeably below following common
  Porsche-specialist parlance, but a buyer encountering both
  terms in service records should note that LN Engineering's
  marketing distinguishes the early-failure-prone "plastic"
  impellers from the later "composite" formulation that LN
  treats as the improved material — both are polymer rather
  than metal). The architecture continues on Mezger and 9A1
  platforms in the same general design family through the
  entire water-cooled sport-car era. The composite-impeller
  choice is deliberate (LN Engineering, Flat 6 Innovations, and
  Pelican Parts converge on the framing that the composite
  impeller is the correct choice for these engines, not a
  cost-saving compromise) — but the impeller does have a finite
  service life that is materially shorter than typical engine-
  component lifespans. Specialist consensus on preventive-
  replacement interval is four-to-six years or 50,000-to-75,000
  miles regardless of mileage-only or time-only metrics; LN
  Engineering's published guidance and Flat 6 Innovations'
  service editorial both anchor on this window.

  The failure mechanism has two parallel pathways. The primary
  pathway is composite-impeller fragmentation: thermal cycling and
  age weaken the plastic impeller blades, which break off in
  pieces and circulate through the cooling system. Fragments lodge
  in narrow cooling passages within the cylinder heads and engine
  block, creating localised hot spots that — in worst cases — lead
  to cracked cylinder heads. The thermostat is the most common
  catch-point for impeller debris (a thermostat full of plastic
  fragments is a diagnostic signature of impeller failure even
  when the pump is otherwise still functioning). The secondary
  pathway is shaft-bearing failure: the pump shaft bearing wears
  with age, allowing radial play that lets the impeller contact
  the housing or block, shattering blades and accelerating the
  primary fragmentation path. Bearing seal failure can also leak
  coolant externally even when the impeller is intact.

  The downstream-damage risk is the central reason this record
  exists rather than being treated purely as a service item. A
  water pump that fails because the impeller fragmented can clog
  cooling passages in the cylinder heads on the way out; the
  remedy then is not just water-pump replacement but cylinder-
  head replacement on one or both sides. Multiple Tier-B sources
  (Flat 6 Innovations editorial, FCP Euro guides) document this
  pathway directly. The economic consequence of skipping the
  preventive-replacement interval is a $1,000 service bill
  becoming a $5,000+ engine-out repair.

  Specialist consensus opposes the metal-impeller aftermarket
  upgrade, despite metal impellers being marketed as a more
  durable alternative. The Flat 6 Innovations editorial,
  LN Engineering's service guidance, and the Pelican Parts how-to
  article converge on the same reasoning: the metal impeller's
  higher mass increases bearing loads, accelerating shaft-bearing
  wear; when a metal-impeller pump's bearing fails, the impeller
  contacts the aluminium engine block and scores the casting,
  potentially requiring complete engine replacement. The
  composite impeller's failure mode (fragments that clog
  passages) is recoverable in most cases; the metal impeller's
  failure mode (block scoring) is often not. LN Engineering's
  product page is explicit: their water pump kits use OEM or
  Genuine Porsche pumps with composite impellers where available,
  and they specifically advise against metal impellers. FCP Euro
  similarly notes that even metal-impeller-equipped pumps will
  fail eventually, and the lifetime-warranty-on-FCP-parts framing
  acknowledges this — replacement on a service interval is the
  only correct mitigation.

  Cost on the service event itself is contained relative to the
  engine-out alternative if neglected. The Pierburg-supplied OEM
  pump (Pierburg is the OEM supplier on most M96/M97 applications)
  is approximately $282 at Pelican Parts; a Wahler low-temperature
  thermostat (specialist-recommended bundled replacement) is
  approximately $50; assorted gaskets and the serpentine-drive
  belt typically replaced concurrently bring parts to $300–$450.
  Specialist labour is documented at three hours engine-in on
  Pelican's how-to (Pelican-thread case capture: water pump and
  thermostat replaced in three hours during an engine-out IMS
  service); engine-in DIY is a four-to-six-hour job for a
  competent home mechanic. Total specialist all-in cost is
  $700–$1,500 in most cases; the upper end is reached on
  applications where additional cooling-system items (hoses,
  clamps, low-temperature thermostat upgrade, serpentine belt,
  drive pulleys) are bundled into the same service.

applicability:
  generation:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 986.1
    - 986.2
    - 987.1
    - 987.2
  engine_family:
    # Failure mode is engine-architecture-specific. M96 and M97
    # share the composite-impeller water pump as canonical;
    # Mezger applications use a closely-related pump architecture
    # with the same composite-impeller failure pattern (the GT3
    # and Turbo applications are documented at the same service
    # interval). 9A1 (997.2 Carrera) uses an updated pump but
    # specialist consensus on service interval remains in the
    # 4–6 years / 50–75k miles range.
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
    - Targa_4
    - Targa_4S
    - GT3
    - GT3_RS
    - GT2
    - GT2_RS
    - Turbo
    - Turbo_S
    - Boxster
    - Boxster_S
    - Boxster_Spyder
    - Cayman
    - Cayman_S
    - Cayman_R
  year_range: [1997, 2012]

severity: moderate
# Severity is moderate because the immediate failure (water pump
# stops circulating coolant) is recoverable with prompt response —
# the warning sequence is engine temperature climb and coolant
# warning before catastrophic damage in most cases. The reason
# this is moderate rather than low is the downstream pathway:
# composite-impeller fragments lodging in cylinder-head cooling
# passages can cause head cracking that requires engine teardown.
# A car presented for sale with no documented water-pump service
# in the recent four-to-six-year window is at meaningful risk of
# the catastrophic-pathway outcome; a car with current preventive
# service is at low risk.

cost_range_usd:
  diy_oem_pump_only:
    low: 250
    high: 350
    _source_anchor: >
      Pelican Parts catalogue lists the Pierburg-supplied OEM water
      pump for 996/997 applications (part 997-106-011-06 and family
      variants) at approximately $282; Planet-9 owner-purchase
      capture confirms $282 for the Pierburg composite-impeller
      OEM pump on the 996/997 application. Genuine Porsche pump
      direct from the dealer is approximately $353 per the same
      Rennlist 997.1 thread capture (factory-vs-supplier markup).
      The $250–$350 band brackets specialist-vendor OEM
      composite-impeller pump pricing across the sport-car
      water-cooled population; Genuine Porsche pricing sits at the
      upper end.
  diy_total_parts_with_thermostat_and_gaskets:
    low: 350
    high: 550
    _source_anchor: >
      Pelican Parts how-to article and Rennlist 997 forum thread
      part-number capture document the bundled-service parts list:
      water pump (~$282), thermostat housing gasket
      (996-106-326-51), water pump gasket (997-106-340-00), Wahler
      or LN Engineering low-temperature thermostat (~$50–$80), and
      adjacent coolant hoses (engine coolant hose 997-106-832-04
      ~$43, engine coolant hose 997-106-850-01 ~$89, radiator
      coolant hose O-ring 996-106-801-03 ~$5). The $350–$550 band
      brackets total parts cost for a bundled DIY service event
      including pump, thermostat, gaskets, and the most commonly-
      replaced adjacent hoses. Specialist-recommended bundling.
  specialist_labour_total:
    low: 700
    high: 1500
    _source_anchor: >
      Pelican Parts how-to commentary documents three hours
      specialist labour for water-pump-and-thermostat replacement
      on engine-out service; engine-in service is documented at
      three-to-five hours depending on application and concurrent
      work. Rennlist 997 forum case capture documents an owner-paid
      $1,250 total for water pump and serpentine belt replacement
      on a 2009 C4S after a roadside seizure — a case representing
      the upper end of the specialist-labour band. The $700–$1,500
      band brackets specialist all-in pricing for OEM-parts-and-
      labour service across US specialist shops; the lower end
      represents straight-pump-replacement at a regional
      specialist; the upper end represents bundled-service events
      including thermostat, hoses, belts, and pulleys at higher
      labour rates.

prevalence_rate:
  qualitative: predictable_with_age_and_mileage_failure_inevitable_without_preventive_replacement
  _source_anchor: >
    Tier-B specialist consensus: LN Engineering's published
    service-interval guidance (4–6 years or 50,000–75,000 miles
    preventive replacement) and Flat 6 Innovations' editorial both
    anchor on the same window. FCP Euro's product editorial
    documents the failure mode as "more common than you would
    expect" given the plastic-impeller architecture, with the
    bearing-failure pathway as a parallel risk. Pelican Parts
    how-to commentary captures consistent owner reports of pump
    failures clustering in the 60–80k-mile range without preventive
    service. Numeric prevalence rate not asserted by Tier-B
    sources, but the framing across all four major specialists
    (LN, Flat 6, FCP Euro, Pelican) converges: failure is a matter
    of when, not if, on a car beyond the recommended service
    interval. Cars within the service-interval window are at low
    risk; cars beyond it are at near-certain failure on a
    multi-year horizon.

failure_correlation:
  - age (composite-impeller plastic embrittlement is age-driven; the 4-year lower bound on the service interval reflects age-only failures)
  - mileage (running cycles compound thermal cycling damage; the 50,000-mile lower bound on the service interval reflects mileage-only failures)
  - operating_temperature (cars run on track or in hot climates accumulate damage faster; the recommended low-temperature thermostat is partial mitigation)
  - service_history (cars with documented preventive water-pump replacement within the 4-6 year window are at low risk; cars without documented service are the population this record targets)

retrofit_available: yes
retrofit_kit_names:
  - "Pierburg OEM water pump (composite impeller) — Pelican Parts, FCP Euro, Suncoast Porsche Parts; the OEM-supplier pump is the specialist-recommended replacement and is materially less expensive than dealer Genuine Porsche."
  - "Genuine Porsche water pump (composite impeller) — direct from Porsche dealer; functionally equivalent to Pierburg OEM with two-year unlimited-mileage parts-only warranty when not installed by a Porsche Service Centre."
  - "LN Engineering Porsche water pump kit — bundled OEM-or-Genuine pump with composite impeller, low-temperature thermostat (160°F open / 180°F fully open), serpentine drive belt, and Driven CSP cooling-system protector. Specialist-recommended for bundled service-interval replacement."
  - "Wahler low-temperature thermostat — Pelican Parts; opens at 71°C / fully open at 82°C versus factory thermostat (87°C open / 99°C fully open). Specialist-recommended bundled replacement; lower coolant temperature reduces thermal-cycling damage on the impeller and adjacent components."
  # Note: aftermarket metal-impeller water pumps (URO Parts and
  # similar) exist but are NOT recommended by LN Engineering, Flat
  # 6 Innovations, or Pelican Parts due to higher mass increasing
  # bearing loads and the catastrophic block-scoring failure mode
  # if the bearing fails. Listed here as anti-pattern.

regional_amplification:
  hot_climate: high
  desert_southwest: high
  track_use: high
  salt_belt: low
  coastal_humid: low
  cold_climate: low
  # Source-supported qualitatively: thermal-cycling damage drives
  # the impeller-fragmentation failure path. Hot climates and
  # track-use applications accumulate thermal damage faster.
  # Salt-belt and coastal-humid amplification are minimal because
  # the failure mode is internal to the pump (impeller + bearing)
  # rather than external corrosion. Cold-climate cars are at lower
  # risk per mile but normalize on age.

evidence_basis:
  tier_a:
    # No Porsche AG TSB or warranty-extension action covers the
    # water pump — Porsche's framing has historically treated this
    # as a regular service item; remedy is at owner expense and
    # outside warranty extensions.
  tier_b:
    - name: "LN Engineering — Water Pump Kits for Porsche Boxster, Cayman, and 911 Models — Tier-B canonical service-interval guidance (4–6 years / 50–75k miles); composite-over-metal impeller recommendation with explicit catastrophic-block-scoring framing on metal-impeller failures; bundled service-kit pricing"
      tier: B
      url_or_reference: "lnengineering.com/products/diy-bundles-kits/porsche-water-pump-kits.html"
    - name: "Flat 6 Innovations — What happens when your water pump fails? — Tier-B specialist editorial (Jake Raby) on the impeller-fragmentation downstream pathway with explicit cylinder-head-cracking framing; bearing-failure secondary pathway; composite-vs-metal impeller analysis"
      tier: B
      url_or_reference: "flat6innovations.com/what-happens-when-your-water-pump-fails/"
    - name: "FCP Euro — Porsche 996 911 Metal Impeller Water Pump Kit Symptoms And Product Review — Tier-B failure-mode discussion and product-line review; documents impeller-fragmentation-clogging-cooling-passages mechanism; recommends every 3-year preventive replacement"
      tier: B
      url_or_reference: "fcpeuro.com/blog/porsche-996-911-metal-impeller-water-pump-kit-symptoms-review"
    - name: "FCP Euro — How To Replace A Porsche 996 911 Water Pump & Thermostat — Tier-B procedural reference with M96-engine-cooling-system architecture framing; thermal-cycling-driven impeller-blade-failure mechanism"
      tier: B
      url_or_reference: "fcpeuro.com/blog/how-to-replace-a-porsche-996-911-water-pump-thermostat"
    - name: "Pelican Parts — Porsche 911 Carrera Water Pump and Thermostat Replacement, 996 (1998-2005) and 997 (2005-2012) — canonical Tier-B how-to with step-by-step procedure, parts-list, low-temperature thermostat recommendation (LN Engineering 160°F unit), and metal-impeller-failure-mode commenter discussion"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/34-WATER-Water_Pump_and_Thermostat_Replacement/34-WATER-Water_Pump_and_Thermostat_Replacement.htm"
    - name: "FCP Euro — Porsche 911 Water Pump Parts catalogue — Tier-B parts-vendor product matrix differentiating composite-impeller-with-low-temp-thermostat, composite-impeller-with-original-temp-thermostat, metal-impeller-with-low-temp-thermostat, metal-impeller-with-original-temp-thermostat configurations across 996/997 applications"
      tier: B
      url_or_reference: "fcpeuro.com/Porsche-parts/911/Water-Pump/"
    - name: "FCP Euro — Porsche 996 911 buyer guide editorial — Tier-B platform-overview discussion that places water-pump-impeller-failure alongside IMS bearing and bore scoring as core M96 maintenance items requiring schedule-driven replacement"
      tier: B
      url_or_reference: "fcpeuro.com/Porsche-parts/996-911/"
  tier_c:
    - name: "Rennlist 997 forum — Water Pump Replacement thread — Tier-C consistency: owner roadside-seizure case capture ($1,250 specialist replacement on 2009 C4S in Florida Keys), part-number list with Pierburg-OEM pricing capture, composite-vs-metal impeller debate"
      tier: C
      url_or_reference: "rennlist.com/forums/997-forum/1265158-water-pump-replacement.html"
    - name: "Planet-9 — Probable water pump failure, sanity check and parts advice — Tier-C consistency: DIY parts-list capture (Pierburg pump $282, Wahler thermostat $50), preventive-replacement-with-pulleys discussion, bearing-failure case capture documenting hose-and-line splitting at the same service event"
      tier: C
      url_or_reference: "planet-9.com/threads/probable-water-pump-failure-sanity-check-and-parts-advice.229177/"

editorial_note: >
  This is the highest-stakes single cooling-system service item
  on a 996/997/986/987 because of the downstream cylinder-head-
  cracking pathway. Unlike the expansion tank (Record 1) where
  failure is gradual and recoverable, water-pump impeller
  fragmentation can damage the engine in ways that aren't
  obviously diagnostic until a teardown reveals plastic
  fragments lodged in cooling passages. The catalogue treats this
  as a defect rather than a service item — file 01's framing of
  the water pump as "routine scheduled maintenance" understated
  the buyer-due-diligence dimension because the consequence of
  missing the schedule is engine damage, not just an overheat.

  The pre-purchase question is documented service history. A car
  with a recent (within 4 years / 50k miles) water pump
  replacement that includes the bundled-service-recommended items
  (low-temperature thermostat, replacement gaskets, possibly
  serpentine belt and pulleys) is a low-risk car. A car with no
  documented water-pump service and over 60,000 miles or 8+ years
  is the population this record targets — the buyer should plan
  for preventive replacement before any extended driving.

  Specialist consensus against metal-impeller upgrades is the
  catalogue's most useful editorial position for this record.
  Owners and shops sometimes interpret the composite-impeller
  failure mode as evidence that a "stronger" metal impeller would
  be more reliable. The opposite is the specialist consensus:
  metal-impeller failures are catastrophic at the engine-block
  level; composite-impeller failures are recoverable with a head
  service in the worst case. A car presented for sale with
  documentation of a metal-impeller water-pump retrofit is a
  yellow flag — the buyer should ask which kit, who installed
  it, and whether the bearing on the metal-impeller pump has been
  inspected since installation.

  This record sits in the broader 996/997/986/987 cooling-system
  service cluster alongside Record 1 (expansion tank), Record 3
  (front-mount radiator and condenser), and the coolant-hose
  refresh service item. Specialist consensus is to bundle these
  as a single service event at the 8-10 year mark — the labour
  overlap is significant (engine-bay access, cooling-system drain,
  refill-and-bleed) and a buyer should expect a comprehensive
  cooling-system service to land at $1,500–$3,000 for the bundle
  at a regional specialist with Genuine Porsche or OEM-supplier
  parts.

  Note also: the LN Engineering low-temperature thermostat is a
  modest performance upgrade in addition to its preventive role —
  Pelican's canonical how-to attributes a typical ~5 horsepower
  dyno gain to the chain "lower coolant temperatures translate
  into lower oil temperatures" via the engine's water-to-oil
  heat exchanger, with the dyno measurements performed by LN
  Engineering. Pelican's parallel LN-product-page editorial
  notes the same thermostat's track-use rationale (full coolant-
  flow availability earlier in the warm-up curve, useful on
  high-water-and-oil-temperature operation). The catalogue is
  agnostic on whether the modest dyno figure is a buying
  signal, but the low-temperature thermostat is a zero-downside
  specialist-recommended bundled replacement.

buyer_questions:
  - When was the water pump last replaced? Specifically — what calendar year, what mileage, with what parts (Pierburg OEM composite-impeller, Genuine Porsche composite-impeller, LN Engineering kit, or aftermarket metal-impeller), and at what shop?
  - Was the thermostat replaced at the same service event? Was a low-temperature thermostat (LN Engineering 160°F or Wahler equivalent) fitted, or was the factory 87°C original-temperature unit reused?
  - Was the serpentine drive belt replaced at the same service event? Were the drive pulleys inspected for bearing wear?
  - For cars where no water-pump service is documented in the last 4 years / 50,000 miles — has the car shown any of the diagnostic signals (coolant temperature climbing on long highway drives, plastic debris visible in the expansion tank, audible whine from the pump area)? A "no" to each is reassuring; a "yes" to any single signal is grounds for immediate inspection.
  - For cars with a documented metal-impeller water-pump retrofit — when was the retrofit performed, by which shop, and has the bearing been inspected since? Specialist consensus is against metal-impeller pumps; a buyer should understand the implications and have the retrofit history.
  - At inspection, with the engine cold, remove the expansion-tank cap and look inside the tank with a flashlight. Are there any plastic fragments visible floating in the coolant or accumulated at the bottom? Visible plastic debris is diagnostic of late-stage impeller fragmentation — the buyer should treat this as evidence of imminent water-pump failure.
```

---

## Record 3 — 986 / 987 / 996 / 997 front-mount radiator and condenser debris accumulation and corrosion

```yaml
id: water_cooled_era_front_mount_radiator_and_condenser_debris_and_corrosion
flag_title: 986/987/996/997 front-mount radiators and air-conditioning condensers — debris accumulation between cores driving moisture-trapping corrosion; road-debris fin-impact damage; salt-belt amplification

description: >
  All water-cooled-era 911s, Boxsters, and Caymans have their main
  cooling radiators mounted in the front bumper, in left and right
  pairs (with an optional centre radiator on some applications).
  The air-conditioning condensers are mounted directly in front of
  the main radiators in the same airflow path, sandwiched against
  the radiator cores with rubber clips and a single retaining
  bolt. The architecture places both heat exchangers low in the
  front bumper, behind ductwork that channels road air through the
  cores, exposed to road debris from the front of the car.

  Two parallel failure mechanisms operate on this architecture.
  The primary mechanism is debris accumulation between the
  condenser and the radiator: leaves, dirt, sand, salt, and road
  residue collect in the gap between the two heat exchangers,
  packed several inches deep at the bottom of the cores on
  long-neglected cars (Tier-C inspection captures from the
  Grassroots Motorsports forum corroborate the pattern across
  996 and 987 examples, with owners reporting trash and
  small-animal remains alongside the more typical organic
  sediment). The trapped material holds moisture against the
  aluminium surfaces
  of both the condenser and the radiator, accelerating corrosion
  on what would otherwise be exposed-to-airflow aluminium that
  dries out between drives. The Pelican Parts canonical how-to
  for both 996/997 and 986/987 applications documents this
  mechanism explicitly and recommends annual cleaning to prevent
  it. The Go-Parts long-form buyer guide characterises the
  condensers' position-driven failure as predictable enough that
  the question is not whether the condenser will fail but when —
  with some failures occurring as early as four-to-five years of
  exposure on cars in adverse climates.

  The secondary mechanism is direct road-debris impact: rocks,
  road litter, and other physical impacts puncture the
  condenser's aluminium fins and tubes, causing immediate
  refrigerant leaks. This mechanism is not climate-specific and
  affects all cars exposed to highway driving. The condensers are
  the more vulnerable of the two heat exchangers because they sit
  forward of the radiators and absorb impacts directly; the
  radiators behind them are partially shielded. On any given
  failure event, the condenser is the more likely failure point.

  The two failure mechanisms compound. A car driven on US Atlantic-
  coast or Midwest salt-belt roads accumulates road salt in the
  condenser-to-radiator gap; the salt dissolves in moisture and
  drives accelerated aluminium corrosion that thins the condenser
  walls; a road-debris impact then punctures a wall already
  weakened by corrosion at a strike intensity that would not have
  punctured a healthy condenser. Salt-belt cars therefore
  experience earlier and more frequent failures than cars from
  desert-southwest climates. Coastal-humid climates (Florida,
  California coastal) sit in the middle: high atmospheric humidity
  promotes corrosion but the absence of road salt limits the
  amplification.

  Failure presents in three patterns. The most common is loss of
  air-conditioning performance: the condenser leaks refrigerant,
  the system loses charge, the A/C blows warm. This is recoverable
  with condenser replacement and refrigerant recharge. The second
  pattern is coolant loss: the radiator core itself develops a
  pinhole leak (often at the bottom where corrosion concentrates)
  that gradually loses coolant. The third pattern is reduced
  cooling efficiency without leakage: debris-clogged cores
  decrease airflow through the radiator, raising operating
  temperatures and stressing other cooling-system components
  (water pump bearing, expansion tank, hoses). Pattern three is
  the least dramatic but the most insidious — it doesn't trigger
  warning lights, but it shortens the service life of every
  upstream cooling component.

  Replacement mechanics are straightforward but labour-intensive.
  The front bumper cover comes off (Pelican-documented procedure;
  approximately 30–60 minutes), the wheel-well liners come off
  (or just loosen on the inner edge), and the radiator-and-
  condenser pair on each side is accessible. Specialist consensus
  is that condensers should be replaced in pairs even when only
  one has failed (Go-Parts editorial; the cost-of-second-job
  argument: opening the system once for refrigerant recharge,
  pulling the bumper cover once for access, etc.) and that the
  receiver/drier (desiccator) must be replaced any time the A/C
  system is opened. Many specialists also recommend bundling the
  radiator replacement on the same side at the same time —
  particularly if the car is salt-belt or coastal-humid origin —
  given the shared failure pathway and shared labour access.

  A separate sub-component note: the radiator fans are powered
  through resistor packs that are documented as a parallel
  failure point. Pelican's how-to flags resistor-pack failure as
  a common ancillary item to check during radiator service —
  while the front bumper is off, fan operation across all speeds
  should be verified (PIWIS or PST-2 tool can drive each speed
  independently; alternatively, A/C activation triggers high-
  speed fan operation and provides a functional test).

applicability:
  generation:
    - 996.1
    - 996.2
    - 997.1
    - 997.2
    - 986.1
    - 986.2
    - 987.1
    - 987.2
  engine_family:
    # The radiator/condenser architecture is body-side and shared
    # across all engine variants on each generation. Listed for
    # matcher exhaustiveness.
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
    - Targa_4
    - Targa_4S
    - GT3
    - GT3_RS
    - GT2
    - GT2_RS
    - Turbo
    - Turbo_S
    - Boxster
    - Boxster_S
    - Boxster_Spyder
    - Cayman
    - Cayman_S
    - Cayman_R
  year_range: [1997, 2012]

severity: moderate
# Severity is moderate because failure presentation is gradual
# (debris-driven corrosion accumulates over years) and individual
# failures are recoverable with single-component replacement.
# However, the cost band crosses the moderate/high boundary on
# bundled-replacement scenarios — replacing both condensers and
# both main radiators on a salt-belt car can reach $3,500+ at a
# specialist or higher at a Porsche dealer. The catalogue ranks
# this moderate because most pre-purchase encounters involve at
# most one or two of the four cores; full-replacement scenarios
# are rare in pre-purchase context.

cost_range_usd:
  diy_oem_or_aftermarket_condenser_per_side:
    low: 200
    high: 700
    _source_anchor: >
      Go-Parts Tier-B vendor catalogue lists OEM-equivalent
      condenser assemblies for 996/997/987 applications with
      same-part-number-fits-both-sides note (Go-Parts buyer's
      guide explicitly documents the part-number-shared-across-
      sides architecture). Aftermarket condensers from major
      heat-exchanger manufacturers (Nissens, Behr, etc.) list at
      $200–$400 per unit; OEM-supplier and Genuine Porsche
      condensers at $400–$700. The $200–$700 band brackets per-
      side condenser part cost across the specialist parts
      market; the upper end is Genuine Porsche, the lower is
      aftermarket-equivalent.
  diy_oem_or_aftermarket_radiator_per_side:
    low: 250
    high: 500
    _source_anchor: >
      Pelican Parts catalogue lists OEM-equivalent and Genuine
      Porsche front main-radiator assemblies for 996/997
      applications in the $250–$500 band per side; Boxster
      986/987 main-radiator assemblies fall in a similar band.
      The $250–$500 band brackets per-side radiator part cost
      across the specialist parts market.
  diy_total_parts_full_front_replacement:
    low: 1200
    high: 2500
    _source_anchor: >
      Bundled-service parts list: two condensers ($400–$1,400),
      two main radiators ($500–$1,000), receiver/drier desiccator
      ($30–$80; Go-Parts editorial documents that this MUST be
      replaced any time the A/C system is opened), refrigerant
      recharge supplies ($30–$50), assorted clamps and air-duct
      seals ($50–$100). The $1,200–$2,500 band brackets total
      parts cost for a full replacement of all four front cores
      plus the desiccator on a salt-belt car; cars with only one
      or two cores affected will be proportionally lower.
  specialist_labour_total_full_front_replacement:
    low: 2000
    high: 3500
    _source_anchor: >
      Pelican Parts how-to documents the front bumper removal
      procedure plus radiator and condenser replacement procedure
      at four-to-six hours specialist labour. At specialist hourly
      rates of $150–$200, total labour for a full-front replacement
      lands at $600–$1,200; combined with parts ($1,200–$2,500)
      the all-in specialist cost is $2,000–$3,500 in most cases.
      Dealer pricing typically runs higher; the catalogue does not
      have a Tier-B dealer-pricing anchor and treats dealer pricing
      as falling above the upper end of the band. A buyer should
      treat $2,500 as a typical mid-band figure for a comprehensive
      cooling-system front-end refresh at a regional independent
      Porsche specialist; single-component replacements (one
      condenser only, with refrigerant recharge) typically land
      at $700–$1,200.
  single_component_specialist_replacement:
    low: 700
    high: 1500
    _source_anchor: >
      For cars where only one condenser or one radiator has
      failed, the specialist labour is approximately three-to-
      four hours (bumper-off access plus single-component
      replacement plus refrigerant recharge if condenser).
      Single-component parts at $200–$700 plus three-to-four hours
      labour at $150–$200/hour plus refrigerant recharge ($100)
      lands at $700–$1,500 for a single-condenser job. The
      $700–$1,500 band brackets specialist-shop pricing for
      single-component replacement; the upper end represents
      Genuine Porsche parts at higher-rate shops, the lower end
      represents aftermarket-equivalent at a regional specialist.

prevalence_rate:
  qualitative: predictable_with_age_and_climate_with_salt_belt_amplification
  _source_anchor: >
    Tier-B specialist consensus: Pelican Parts how-to articles
    (separate articles for 996/997 and 986/987) document
    debris-accumulation as a known service item recurring through
    vehicle life with annual-cleaning prevention recommended.
    Go-Parts long-form buyer guide characterises A/C condenser
    failure on this architecture as a near-inevitability,
    framing it as a question of timing rather than occurrence.
    Tier-C grassroots reporting (Grassroots Motorsports forum
    case capture documenting debris findings on a 996, with
    follow-up confirming the same pattern on a 987 Cayman)
    confirms the pattern across the platform population. Numeric
    prevalence rate not asserted by Tier-B sources, but the
    framing converges across all major specialists: salt-belt and
    coastal-humid cars at age 7-plus years present condenser-
    and-radiator service as a high-probability pre-purchase item.
    Desert-southwest cars are at lower risk per year but normalise
    on cumulative-debris-accumulation timescale.

failure_correlation:
  - climate (salt-belt and coastal-humid amplification is the dominant correlate; desert-southwest cars at lower risk)
  - age (condenser and radiator core ageing accumulates over years; cars at 7-plus years from manufacture are the population this record targets)
  - mileage (highway-driven cars accumulate road-debris fin damage; garage-queens accumulate trapped-debris corrosion only)
  - service_history (cars where the bumper has been off for any reason, with documented core cleaning, are at lower risk; cars with no documented core cleaning at 7-plus years are at higher risk)
  - geographic_origin (cars originally sold in the salt-belt US northeast or Midwest carry climate-amplification history regardless of current owner location)

retrofit_available: yes
retrofit_kit_names:
  - "Genuine Porsche A/C condenser assembly (Pelican Parts, Suncoast Porsche Parts) — like-for-like factory part; same part number fits both left and right sides per Go-Parts editorial; two-year unlimited-mileage parts warranty"
  - "OEM-supplier A/C condenser assembly (Behr, Nissens, parallel-flow aluminium core with multi-louvered fins) — Tier-B aftermarket-equivalent at meaningfully lower price point; specialist-recommended budget alternative"
  - "Genuine Porsche front main radiator (Pelican Parts, Suncoast) — like-for-like factory part"
  - "OEM-supplier front main radiator (Nissens, Behr) — Tier-B aftermarket-equivalent"
  - "Receiver/drier (desiccator) — Tier-B specialist consensus that this MUST be replaced any time the A/C system is opened; failing to replace leaves moisture in the system and accelerates corrosion of new components per Go-Parts editorial"
  - "Centre radiator retrofit kit (Pelican Parts how-to article) — for cars without the optional centre radiator from the factory, this third radiator can be added during a front-cooling-system service event for additional cooling capacity; Pelican-documented procedure with feed-hose part numbers"

regional_amplification:
  salt_belt: high
  coastal_humid: moderate
  desert_southwest: low
  cold_climate: moderate
  hot_climate: moderate
  # Source-supported qualitatively: the debris-and-moisture-driven
  # corrosion pathway is amplified in salt-belt regions where road
  # salt is applied annually and accumulates in the condenser-to-
  # radiator gap. Coastal-humid regions experience moderate
  # amplification driven by atmospheric humidity. Desert-southwest
  # regions experience the lowest corrosion rate; debris
  # accumulation still occurs but holds less moisture.

evidence_basis:
  tier_a:
    # No Porsche AG TSB or warranty-extension action covers
    # radiator/condenser corrosion or debris-driven failure —
    # remedy is at owner expense.
  tier_b:
    - name: "Pelican Parts — Porsche 911 Carrera Radiator and Fan Replacement, 996 (1998-2005) and 997 (2005-2012) — canonical Tier-B how-to with explicit debris-accumulation-causes-corrosion editorial framing, annual-cleaning recommendation, and resistor-pack ancillary failure note"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/32-WATER-Radiator_and_Fan_Replacement/32-WATER-Radiator_and_Fan_Replacement.htm"
    - name: "Pelican Parts — Porsche Boxster Radiator Replacement and Cleaning, 986 / 987 (1997–08) — canonical Tier-B how-to for Boxster and Cayman variants with parallel debris-and-corrosion framing and resistor-pack note"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Boxster_Tech/32-WATER-Main_Radiator/32-WATER-Main_Radiator.htm"
    - name: "Pelican Parts — Porsche 911 Carrera Coolant Hose Replacement, 996 (1998-2005) and 997 (2005-2012) — canonical Tier-B parallel reference for cooling-system-hose service co-occurring with radiator/condenser replacement"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/30-WATER-Coolant_Hose_Replacement/30-WATER-Coolant_Hose_Replacement.htm"
    - name: "Pelican Parts — Porsche 911 Carrera Center Radiator Installation, 996/997 — Tier-B procedural reference for the centre-radiator retrofit option that can be bundled with front-cooling-system service"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/31-WATER-Installing_a_Center_Radiator/31-WATER-Installing_a_Center_Radiator.htm"
    - name: "Go-Parts — Porsche 911, Boxster & Cayman A/C Condenser Failures (2001-2013) — Tier-B specialist parts vendor long-form buyer guide with explicit failure-mechanism description (leaves/dirt/salt accumulation between condensers and main radiators causing moisture-trapping corrosion, road-debris-impact secondary mechanism), four-to-five-year early-failure framing, pair-replacement and receiver/drier-replacement recommendations"
      tier: B
      url_or_reference: "go-parts.com/garage/a-c-condenser-porsche-911-porsche-boxster-porsche-cayman-2001-2013"
    - name: "Pelican Parts — Porsche 911 Carrera Coolant Flush, 996/997 — Tier-B reference with cooling-system-additive discussion, pH chemistry framing, and clamp part-number list bundled with full cooling-system service events"
      tier: B
      url_or_reference: "pelicanparts.com/techarticles/Porsche-996-997-Carrera/29-WATER-Coolant_Flush/29-WATER-Coolant_Flush.htm"
  tier_c:
    - name: "Grassroots Motorsports Forum — Porsche PSA: Clean your radiators thread — Tier-C consistency: 996 owner case capture documenting bottom-of-radiator debris findings (multiple inches of packed sediment plus trash and animal remains) on a single-owner inspection event; corroborating 987 Cayman case capture from second contributor"
      tier: C
      url_or_reference: "grassrootsmotorsports.com/forum/grm/porsche-psa-clean-your-radiators/141095/"

editorial_note: >
  This is the cooling-system service item with the strongest
  geographic-amplification signal in the catalogue. A 996 or 997
  originally sold and serviced in Phoenix or San Diego is at
  meaningfully lower risk than the same vintage car originally
  sold in Boston or Chicago. The pre-purchase question therefore
  splits into two sub-questions: where has the car spent its
  service life (PCA service-history records, Carfax climate
  history), and what does inspection of the front-bumper cooling
  cluster reveal at this moment.

  Inspection access requires bumper-cover removal, which is more
  than the average pre-purchase inspector will undertake. A
  reasonable proxy is to evaluate from underneath the car: with
  the front lifted on a hoist or jack stands, the lower edge of
  the radiator-and-condenser stack is visible from below, and any
  significant lower-edge corrosion staining is visible without
  bumper removal. A buyer who can arrange a Porsche-specialist
  pre-purchase inspection should request the front-bumper removal
  as part of the inspection scope on any salt-belt-origin car
  over 7 years old; the inspection cost ($200–$400) is small
  relative to the $2,000–$3,500 service-cost reveal on a corroded
  cooling cluster.

  Service-cost framing: a buyer should be prepared for the worst-
  case full-replacement scenario on a salt-belt car at 12-plus
  years from manufacture. The realistic mid-case on a typical
  pre-purchase encounter is one condenser and possibly one
  radiator failed, with the other side showing measurable
  corrosion but not yet leaking — a scenario where pair-
  replacement is the specialist-recommended approach but
  single-component replacement is the budget-minimum approach.
  The catalogue's $700–$1,500 single-component band and
  $2,000–$3,500 full-front band together cover the range of
  realistic pre-purchase outcomes.

  The radiator fan resistor pack is documented in the same
  Pelican how-to as an ancillary failure point that warrants
  inspection during any service event with bumper-off access.
  Resistor-pack failure presents as a stuck-on or stuck-off
  fan-speed setting; it does not directly cause radiator
  failure but does affect cooling-system performance. The
  catalogue notes this as a sub-component without a separate
  record because it is consistently bundled into the parent
  service event.

  This record sits in the broader 996/997/986/987 cooling-system
  service cluster alongside Record 1 (expansion tank) and Record
  2 (water pump). Specialist consensus is to bundle these as a
  single comprehensive service event at the 8-12 year mark; a
  buyer evaluating a salt-belt-origin car at this age should
  treat the cluster as a $2,500–$5,000 budget item if no service
  is documented.

buyer_questions:
  - What is the car's geographic service history? Was it originally sold in a salt-belt state, a coastal-humid state, or a desert-southwest state? Has it changed climates during ownership?
  - Has the front bumper cover been off the car for any reason in the recorded service history? If so — were the radiators and condensers cleaned or replaced during that work?
  - At inspection, with the car on a hoist or jack stands, examine the lower edge of the front-bumper cooling cluster from beneath. Is there visible corrosion staining at the bottom of the radiator-and-condenser stack? Is there any green or pink coolant residue, or any oily refrigerant residue?
  - Does the air conditioning blow cold quickly when activated, or does it take an unusually long time to reach full cooling? A condenser with a slow refrigerant leak progressively loses cooling performance before reaching the warm-air-from-vents stage.
  - For the radiator fan operation: with the engine warm and the A/C activated, can both fans be heard cycling through their speed levels? A stuck fan or a fan that does not change speed under load is consistent with resistor-pack failure (a sub-component documented as bundled-replacement during cooling-system service).
  - For salt-belt origin cars at 10-plus years from manufacture without documented cooling-system front-end service: is the seller willing to negotiate price-down to reflect the $2,500–$3,500 budget item the buyer should expect to undertake within the first year of ownership?
```

---

## Record 4 — Cayenne 957 V8 4.8L DFI rear coolant manifold glued-barb-fitting failure (with under-intake plastic-pipe aluminium-upgrade as secondary bundled item)

```yaml
id: cayenne_957_v8_4_8_dfi_rear_coolant_manifold_and_under_intake_pipe
flag_title: Cayenne 957 4.8L DFI (MY 2008–2010) rear coolant manifold with epoxy-glued barb fitting — catastrophic coolant loss when fitting separates; engine-out repair to fit Porsche-superseded threaded-fitting manifold; under-intake plastic Y-pipe aluminium upgrade is a secondary bundled item with weaker prevalence support

description: >
  The Cayenne 957 (MY 2008–2010) 4.8L direct-injection V8
  has two structurally distinct cooling-system items under
  the catalogue's coverage of this generation, with materially
  different failure-prevalence profiles. This record covers
  both because they are typically addressed in the same
  engine-disassembly service event, but the editorial weight
  is on the first.

  HEADLINE FAILURE — rear coolant manifold with epoxy-glued
  barb fitting. The 957 4.8L DFI engine has a coolant
  distribution manifold (variously described in the field as
  the water distributor, water bridge, or rear coolant
  crossover) that connects the two cylinder-head coolant
  circuits at the rear of the engine. On the original 2008–
  early-2014 production tooling, the hose-connection fitting
  on this manifold is a separate machined barb that Porsche
  bonded into the cast manifold with an industrial epoxy.
  When the epoxy bond fatigues, the barb separates from the
  manifold under coolant pressure and ejects with the
  attached hose; coolant is lost catastrophically within
  seconds. The same failure pattern is documented by Tier-C
  community specialists across multiple Porsche generations
  using the same manufacturing approach (early 996 Turbo and
  GT3 with epoxied coolant fittings; a parallel class-action
  filing on the Cayenne 958 generation for the same family of
  glued-fitting failure). Porsche superseded the manifold to
  a threaded-fitting design "sometime in 2014" per a Rennlist
  Cayenne 958 forum capture, but the 957 V8 production cars
  retain the original glued-fitting design unless a previous
  owner has performed the supersession retrofit. Three
  remediation paths exist:

    (a) Engine-out replacement of the rear coolant manifold
    with the Porsche-superseded threaded-fitting design (the
    "permanent fix" per Tier-C specialist consensus across
    multiple Rennlist threads); ~$4,000 indy-quoted total per
    a Rennlist 958 owner case capture for the parallel
    failure mode; ~$2,000–$4,000 specialist all-in is the
    band the catalogue carries for the 957 application.

    (b) Field repair of the existing manifold by re-bonding
    the barb fitting with JB Weld or by drilling the manifold
    and pinning the barb — documented in multiple Rennlist
    threads as a not-uncommon owner choice; treated by Tier-C
    specialist consensus as a temporary remedy that buys
    time but does not eliminate the failure pathway. The
    catalogue notes this option for completeness but does not
    treat it as a remediation a buyer should accept on a
    purchase-condition car.

    (c) Replacement of the manifold without engine removal —
    documented in some Rennlist DIY threads as possible
    ("quite the trick" per one indy capture; high-pressure
    fuel pump removal may provide enough access on some
    variants per a 6SpeedOnline thread); the catalogue
    acknowledges this as a specialist-with-experience option
    but does not assume it is available as a routine
    alternative.

  SECONDARY ITEM — under-intake plastic coolant Y-pipe with
  Porsche-released aluminium upgrade (SKU 94810606910). The
  957 4.8L DFI engine has a single plastic coolant Y-pipe
  routed under the intake manifold (different design from
  the 955's V-valley triple-pipe assembly covered in file 06
  record 1, despite the rough functional parallel). Porsche
  released an aluminium-superseded version of this pipe
  (Genuine Porsche SKU 94810606910, available from Suncoast
  Porsche Parts, Europa Parts, Design 911, and Porsche
  dealers) which Suncoast's product page characterises as a
  commonly-replaced part. However, Tier-C specialist consensus
  on the Rennlist Cayenne 955-957 forum (multiple captures
  including the cited slavie 2022 commentary) explicitly
  contradicts the supersession-as-prevalence reading: 957
  specialists characterise the original plastic pipe as
  "nowhere near as failure prone as the 955 one, to the
  point of not really being an issue" with the aluminium
  supersession framed as Porsche's precautionary release in
  anticipation of a failure pattern that did not materialise
  in the field at 955-comparable rates. A separate Rennlist
  Cayenne 957 forum thread on under-manifold coolant leaks
  (2017 onward, with 2026 comment captures) attributes most
  field-reported under-manifold coolant losses on 957 V8 cars
  to single O-ring or thermostat-housing-seal leaks rather
  than plastic-pipe failure. The catalogue's editorial
  position is that the SKU 94810606910 aluminium upgrade is
  a defensible bundled-when-engine-is-out item but is NOT a
  standalone failure pattern that would justify pulling the
  engine on a 957 V8 still running the original plastic pipe
  with no diagnostic signal.

  Distinction from file 06 record 1 (955 valley pipes):
  The 955 V8 (4.5L, MY 2003–2007) uses a three-pipe valley
  assembly between the cylinder banks, on a routing path
  fundamentally different from the 957 4.8L DFI's single
  under-intake Y-pipe. The 955 valley-pipe failure is the
  subject of a $45M class-action settlement (file 06 record
  1) reflecting documented widespread failure; the 957
  under-intake pipe is a different component with materially
  lower prevalence per specialist consensus. The two records
  should NOT be conflated; a buyer evaluating a Cayenne
  should identify the generation and engine and apply the
  appropriate record:
    - 955 (MY 2003–2007) 4.5L V8 → file 06 record 1 (valley pipes; class-action remediation pathway)
    - 957 (MY 2008–2010) 4.8L DFI V8 → this record (rear coolant manifold headline; under-intake pipe secondary)
    - 958 (MY 2011–early-2014) → not in scope of this record (different generation; same epoxied-fitting family pattern with parallel class-action filing as referenced in Tier-C)
    - 958 (mid-2014–2018) → not in scope (Porsche-superseded threaded-fitting manifold from factory)

  Failure presentation of the rear coolant manifold barb
  separation ranges from sudden catastrophic loss (the
  "cutting the aorta" framing used by a Tier-C specialist
  describing a parallel 996 Turbo / GT3 failure on the same
  epoxied-fitting family) to gradual seepage where the barb
  is loosening but has not yet ejected. Owners typically
  report: low-coolant warnings escalating in frequency
  without a visible front-of-engine leak; coolant odour
  after a drive without external dampness on the bumper or
  the front radiators; eventually, either a sudden
  no-coolant overheating event (catastrophic ejection) or
  visible coolant residue on the rear of the block, the
  starter, or the upper torque-converter bell-housing area.
  The leak path runs down the back of the block past the
  starter and the torque-converter bell housing area; the
  same secondary-damage concerns documented for the 955
  valley-pipe failure (per file 06: starter damage from
  coolant exposure, torque-converter seal failure from
  coolant contamination) apply on the 957 rear-manifold
  failure path with the same mechanism.

  Specialist consensus on the bundled service event is to
  address multiple cooling-system items at the same engine-
  disassembly access. The 6SpeedOnline thread documents an
  owner planning to replace the thermostat (94810612501 with
  O-ring), water pump (94810603301 with O-ring), and
  associated gaskets alongside the rear coolant manifold and
  the under-intake aluminium pipe upgrade in a single
  service. The Rennlist Cayenne 955-957 forum DIY thread
  documents a parallel attempt where the under-intake pipe
  was reached without full engine removal — the procedure
  is documented as difficult but possible, with intake-
  manifold removal and rear-of-engine wiring-harness-bracket
  removal as the primary access steps; the rear coolant
  manifold itself is a separate access path that some
  specialists report can be replaced without engine-out work
  on certain variants, though this is the exception rather
  than the rule.

  Replacement-part part numbers documented across Tier-B
  sources, organised by which failure each addresses:

  Rear coolant manifold (HEADLINE — Porsche-superseded
  threaded-fitting design):
    - 94810606106 — water distributor (without screw plug,
      Turbo only)
    - 94810606104 — water distributor (with screw plug,
      naturally-aspirated 4.8L variants — S, GTS)
    - 94810615401 — water distributor gaskets (×2; required
      with manifold replacement)

  Under-intake plastic Y-pipe (SECONDARY — Porsche-released
  aluminium upgrade, precautionary):
    - 94810606910 — updated coolant pipe (Porsche-released
      aluminium supersession; Tier-C specialist consensus
      treats as bundled-when-engine-is-out, not standalone
      replacement-driving failure)
    - 94810602604 — coolant vent line (optional bundled
      replacement)

  Bundled cooling-system items typically addressed in same
  service event:
    - 94810612501 — thermostat with O-ring
    - 94810603301 — water pump with O-ring
    - 94810610103 — thermostat intake socket
    - 00004320593 — special-grease intake-socket lubricant

  Applicability spans all 957 V8 4.8L DFI variants. The
  6SpeedOnline thread originator initially documented the
  under-intake-pipe SKU on Cayenne Turbo and Turbo S
  applications, then cross-referenced to confirm fitment
  across the naturally-aspirated DFI variants (Cayenne S
  and Cayenne GTS) as well. The rear coolant manifold's
  glued-barb-fitting issue applies generation-wide on all
  957 V8 4.8L DFI variants (the manifold variant differs
  by Turbo vs naturally-aspirated as captured in the
  part-number list above). The catalogue treats this as a
  generation-wide pre-purchase question across all 957 V8
  trims rather than a Turbo-specific issue.

applicability:
  generation:
    - cayenne_957
  engine_family:
    # The 957 generation includes both the 4.8L V8 DFI and (for
    # some markets) a 3.0L V6 diesel and the 3.6L V6 base.
    # This record applies only to the 4.8L DFI V8.
    - cayenne_v8_4_8_NA_or_TT
    # Excludes: cayenne_v6_3_6_NA (base 957 with VR6 architecture
    # — different cooling routing); cayenne_v6_3_0_diesel (Audi-
    # sourced diesel — different engine architecture).
  body:
    - SUV
  trim_category:
    - cayenne_S    # 957 Cayenne S with 4.8L DFI (MY 2008–2010)
    - cayenne_GTS  # 957 Cayenne GTS with 4.8L DFI (MY 2008–2010)
    - cayenne_turbo
    - cayenne_turbo_S
  year_range: [2008, 2010]
  specific_model_years:
    cayenne_957: [2008, 2009, 2010]

severity: high
# Severity is high because the headline failure (rear coolant
# manifold barb-fitting separation) is catastrophic-coolant-loss
# in nature: a Tier-C specialist captures the parallel mechanism
# on the same epoxied-fitting family across early 996 Turbo and
# GT3 with the framing "like cutting the aorta, coolant gushes
# out in a matter of seconds." On a 957 V8 Cayenne the same
# mechanism applies. Even where the failure presents progressively
# (slow seepage rather than sudden ejection), the location at the
# rear of the engine drives a $2,000–$4,000 specialist service
# event for the Porsche-superseded threaded-fitting manifold
# replacement, with downstream-damage exposure (starter, torque-
# converter seal) on the same pathway as the 955 valley-pipe
# failure documented in file 06 record 1. The under-intake
# plastic-pipe aluminium upgrade (SKU 94810606910) is editorially
# secondary at moderate severity if considered in isolation —
# Tier-C specialist consensus characterises the 957 plastic
# Y-pipe as not-really-failure-prone in the field — but the
# bundled-when-engine-is-out framing folds it into the same
# high-severity service event.

cost_range_usd:
  diy_oem_under_intake_pipe_aluminium_upgrade_only:
    low: 150
    high: 300
    qualitative: secondary_bundled_when_engine_is_out_not_standalone_failure_driver
    _source_anchor: >
      Suncoast Porsche Parts catalogue lists the Updated Coolant
      Pipe SKU 94810606910 as a single Genuine Porsche part fitting
      the 2008–2010 Cayenne S and Turbo applications (Cayenne GTS
      cross-references confirmed via 6SpeedOnline thread). Europa
      Parts and Design 911 carry the same part with similar pricing.
      The $150–$300 band brackets the part-only cost for the under-
      intake aluminium pipe upgrade; lower end is OE-supplier-
      equivalent, upper end is Genuine Porsche dealer pricing.
      Note: this is the SECONDARY item; Tier-C specialist consensus
      treats it as bundled-when-engine-is-out rather than a
      standalone failure-driver. A buyer should not encounter this
      band as the all-in service cost — the headline rear-manifold
      replacement (see specialist_labour_total_bundled_service
      band below) is the primary cost the buyer should plan for.
  diy_total_parts_with_rear_manifold_water_pump_thermostat:
    low: 800
    high: 1500
    _source_anchor: >
      6SpeedOnline thread part-list capture documents the bundled-
      service parts list for the engine-out service event addressing
      both the headline rear coolant manifold replacement and the
      secondary under-intake pipe upgrade: water distributor (rear
      coolant manifold) $200–$400 depending on with-or-without-
      screw-plug variant (the Turbo-only without-plug version is
      more expensive), water distributor gaskets ($30–$60 for two),
      under-intake aluminium pipe upgrade ($150–$300), thermostat
      with O-ring 94810612501 ($80–$150), water pump with O-ring
      94810603301 ($200–$350), thermostat intake socket 94810610103
      ($30–$60), and the special-grease intake-socket lubricant
      00004320593 ($15–$30). The $800–$1,500 band brackets total
      Genuine Porsche parts cost for a comprehensive bundled-
      service event encompassing the cooling system rear of the
      engine plus the bundled-when-engine-is-out under-intake
      pipe upgrade; cars where only the rear manifold and gaskets
      are replaced (with no thermostat/water-pump bundling) will
      be at the lower end.
  specialist_labour_total_bundled_service:
    low: 2000
    high: 4000
    _source_anchor: >
      Specialist labour for the rear-of-engine cooling-system
      service centred on the rear coolant manifold replacement
      is documented as a major event: most specialist consensus
      captures across multiple Rennlist threads characterise
      the rear-manifold replacement as "basically an engine-out
      job," with one Rennlist 958 owner case capture
      documenting an indy-quoted $4,000 estimate for the parallel
      failure mode on the next-generation chassis. On the 957,
      intake-manifold removal is required for access to the
      under-intake pipe, the rear-of-engine wiring-harness
      bracket must be removed, and the procedure typically
      runs eight-to-fifteen hours specialist labour with full
      engine-out work; on cases where the rear-manifold
      replacement is attempted without engine removal the
      labour-hours figure is more variable. At specialist
      hourly rates of $150–$200, total labour lands at $1,200–
      $3,000; combined with bundled parts ($800–$1,500) the
      all-in specialist cost is $2,000–$4,000 in most cases.
      Dealer pricing typically runs higher; the catalogue does
      not have a Tier-B dealer-pricing anchor and treats dealer
      pricing as falling above the upper end of the band. A
      buyer should treat $3,000 as a typical mid-band figure
      for a bundled rear-of-engine cooling-system service at a
      regional independent Porsche specialist with the engine
      out for the rear-manifold replacement.
  field_repair_jb_weld_or_pinned_barb:
    low: 50
    high: 200
    qualitative: temporary_remedy_not_recommended_for_purchase_condition_buyer
    _source_anchor: >
      Multiple Rennlist threads document owners performing field
      repair of the rear coolant manifold by re-bonding the
      separated barb fitting with JB Weld or by drilling the
      manifold and pinning the barb mechanically. One Rennlist
      957 owner case capture from a 2008 S documents a barb-pop
      event followed by a JB Weld repair that subsequently
      re-leaked at three months, prompting the eventual rear-
      manifold replacement. The catalogue carries this band for
      completeness as a remediation owners use in the field but
      treats it as a temporary remedy that does not eliminate
      the failure pathway. A buyer encountering a 957 V8 with
      documented JB-Weld field repair on the rear manifold
      should treat the car as having unresolved deferred
      maintenance and price-in the $2,000–$4,000 specialist
      replacement as a near-term ownership cost.

prevalence_rate:
  qualitative: rear_manifold_documented_field_failure_pattern_with_class_action_attempts_under_intake_pipe_specialist_precautionary_only
  _source_anchor: >
    Two prevalence assessments apply, one per failure mode.

    Rear coolant manifold (HEADLINE — moderate-to-high
    documented field-failure pattern). Tier-C specialist
    consensus across multiple Rennlist threads characterises
    the rear-manifold glued-barb-fitting failure as a documented
    pattern on 957 V8 cars: a Rennlist Cayenne 955-957 thread
    sticky on this issue exists ("made a sticky because it
    happens often enough to warrant sticking it where people
    can easily find it" per a Tier-C specialist contributor);
    a Rennlist class-action lawsuit thread for the parallel
    Cayenne 958 generation references the same family of glued-
    fitting failures across Cayenne, GT3, and 996 Turbo
    populations; a 6SpeedOnline 957 thread captures a 2008 S
    barb-separation event with explicit NHTSA-complaint
    cross-references. The same field-evidence pattern across
    multiple Porsche generations on the same epoxied-fitting
    manufacturing approach reinforces the prevalence reading.
    Numeric prevalence rate not asserted; the population-level
    framing is that 957 V8 cars at age 12-plus years have
    entered the rear-manifold-failure window, with mileage-
    correlated earlier failures common on high-mileage cars.

    Under-intake plastic Y-pipe (SECONDARY — Tier-C specialist
    consensus characterises as low-prevalence, precautionary-
    upgrade only). The Suncoast product description for the
    SKU 94810606910 aluminium upgrade characterises the
    original part as commonly-replaced, but Tier-C specialist
    counter-position on Rennlist (slavie commentary, September
    2022) is unequivocal: 957 plastic Y-pipe failures are
    "nowhere near as failure prone as the 955 one, to the
    point of not really being an issue" with the aluminium
    supersession framed as Porsche's precautionary release in
    anticipation of a failure pattern that did not materialise
    in the field at 955-comparable rates. A separate Rennlist
    "Coolant pipe leaks on 957 under manifolds" thread (multiple
    captures including 2026 commenter discussion) attributes
    most field-reported under-manifold coolant losses on 957
    V8 cars to single O-ring or thermostat-housing-seal leaks
    rather than plastic-pipe failure. The catalogue's editorial
    position is that supersession-as-prevalence reasoning does
    NOT apply here: the existence of an aluminium part-revision
    is not by itself evidence of widespread plastic-pipe
    failure when specialist consensus directly contradicts
    that reading. The under-intake pipe is treated as a
    bundled-when-engine-is-out item rather than a standalone
    failure pattern justifying engine-out work in isolation.

    Distinction from the supersession-as-prevalence framing
    that DOES apply on file 06 record 1 (955 valley pipes):
    the 955 case is anchored on a $45M class-action settlement
    documenting widespread failure independent of the part
    supersession; the 957 case has no class-action coverage
    and the specialist consensus on the under-intake pipe is
    explicitly counter-prevalence. The Fifth Gear blog
    editorial covers the broader Cayenne V8 cooling-pipe
    pattern but is positioned primarily for the 955 valley
    pipes; the catalogue treats Fifth Gear as supporting the
    955-side prevalence reading rather than the 957
    under-intake-pipe-side reading.

failure_correlation:
  - age (rear coolant manifold: epoxy bond on the glued barb fitting fatigues with thermal cycling and time; cars at 12+ years from manufacture are in the failure window. Under-intake pipe: plastic embrittlement age-correlated, but field-failure rate per Tier-C specialist consensus is low)
  - mileage (thermal-cycling damage accumulates with running cycles; cars at 80,000+ miles are at higher risk on the rear-manifold pathway; mileage-driven failure on the under-intake pipe is rare per specialist consensus)
  - climate (hot-climate operation accelerates epoxy fatigue on the rear manifold and plastic embrittlement on the under-intake pipe; desert-southwest cars at higher per-mile risk)
  - service_history (cars with the Porsche-superseded threaded-fitting rear manifold already fitted, OR with documented field-pinned/welded barb fitting on the original manifold, are out of this record's primary risk population for the headline failure; cars still running the original glued-barb-fitting manifold are the population this record targets. The under-intake pipe upgrade status is editorially secondary)
  - supersession_status (the Porsche-superseded threaded-fitting manifold appeared in production "sometime in 2014" per a Rennlist 958 forum capture and is available as a service-replacement part for 957 retrofit; cars with the Porsche-superseded manifold installed by previous service work are remediated)

retrofit_available: yes
retrofit_kit_names:
  # Listed in editorial-priority order: HEADLINE rear coolant
  # manifold replacement first; under-intake pipe upgrade demoted
  # to secondary bundled-when-engine-is-out item per Tier-C
  # specialist consensus.
  - "HEADLINE — Genuine Porsche Water Distributor (rear coolant manifold) SKU 94810606106 (without screw plug, Turbo and Turbo S only) or SKU 94810606104 (with screw plug, naturally-aspirated 4.8L variants — Cayenne S and Cayenne GTS) — the Porsche-superseded threaded-fitting design that replaces the original epoxy-glued-barb-fitting manifold. Two-year unlimited-mileage Genuine Porsche parts-only warranty when not installed by a Porsche Service Centre. This is the primary replacement targeting the headline failure pathway."
  - "HEADLINE — Genuine Porsche Water Distributor Gaskets SKU 94810615401 (×2) — required bundled replacement when the rear coolant manifold is removed; specialist consensus does not reuse OEM gaskets at this access event."
  - "SECONDARY — Genuine Porsche Updated Coolant Pipe SKU 94810606910 — Porsche-released aluminium upgrade for the under-intake plastic Y-pipe; available from Suncoast Porsche Parts, Europa Parts, Design 911, and Porsche dealers; two-year unlimited-mileage parts-only warranty. Tier-C specialist consensus treats this as bundled-when-engine-is-out rather than a standalone failure-driving replacement; a buyer should NOT pay for engine-out work on a 957 V8 solely to fit this part absent a documented under-intake leak."
  - "SECONDARY — Genuine Porsche Coolant Vent Line SKU 94810602604 — optional bundled replacement during the same engine-disassembly event."
  - "BUNDLED — Genuine Porsche Thermostat SKU 94810612501 with O-ring and Water Pump SKU 94810603301 with O-ring — specialist-recommended bundled replacement during the same engine-disassembly event given shared access labour. The water pump on the 4.8L DFI follows the same composite-impeller-with-finite-service-life framing covered in Record 2 of this file (cross-platform pattern); preventive replacement at this access opportunity is the cost-efficient path."
  - "FIELD-REPAIR ALTERNATIVE (not catalogue-recommended for purchase-condition buyers) — JB Weld re-bonding of separated barb fitting OR drill-and-pin mechanical retention of the barb fitting on the original glued-barb-fitting manifold. Multiple Rennlist threads document this as an owner-performed temporary remedy; treated as deferred-maintenance rather than remediation."

regional_amplification:
  hot_climate: high
  desert_southwest: high
  salt_belt: low
  coastal_humid: low
  cold_climate: low
  # Source-supported qualitatively: thermal cycling drives plastic
  # embrittlement on the original plastic pipe. Hot-climate and
  # desert-southwest cars accumulate damaging cycles faster.
  # Salt-belt and coastal-humid amplification are minimal because
  # the failure mechanism is internal plastic ageing rather than
  # external corrosion. The pipe's location at the rear of the
  # engine, behind heat-shielding, limits external climate
  # exposure regardless.

evidence_basis:
  tier_a:
    # No Porsche AG TSB or warranty-extension action covers either
    # the rear coolant manifold glued-barb-fitting failure or the
    # under-intake plastic-pipe replacement on the 957 generation
    # at the consumer level. The Porsche-superseded threaded-fitting
    # rear manifold is an internal Porsche Parts revision (visible
    # via the SKU's screw-plug variant) rather than a consumer-
    # facing warranty action; the under-intake aluminium pipe is
    # similarly a parts-revision-only supersession. Owners in the
    # 957 4.8L DFI population pay out-of-pocket on both items.
    # The 955 valley-pipe class-action settlement (file 06 record
    # 1, $45M settlement on MY 2003–2006 V8 Cayennes) does NOT
    # extend to the 957 generation; a parallel class-action filing
    # for the 958 generation glued-fitting failure is referenced
    # in the Tier-C Rennlist class-action thread but is editorially
    # out of scope for this record (different generation).
  tier_b:
    - name: "Suncoast Porsche Parts — Updated Coolant Pipe (Genuine Porsche SKU 94810606910) catalogue listing — Tier-B parts vendor reference confirming the Porsche-released aluminium supersession part for the under-intake plastic Y-pipe on 2008–2010 Cayenne S and Turbo applications (catalogue's editorial position: this is the SECONDARY item; Suncoast's product-description characterisation as a commonly-replaced part is editorially flagged because Tier-C specialist consensus on Rennlist directly contradicts the supersession-as-prevalence reading on this specific application — see tier_c sources below for the slavie counter-position)"
      tier: B
      url_or_reference: "suncoastparts.com/product/94810606910.html"
    - name: "Suncoast Porsche Parts — Cayenne V8 Coolant Pipe Upgrade/Repair Kit SKU PKCAYPIPE catalogue listing — Tier-B parts vendor reference for the parallel 955 valley-pipe kit; included here for cross-reference clarity (this kit is for the 955 generation covered in file 06 record 1, NOT the 957 covered in this record)"
      tier: B
      url_or_reference: "suncoastparts.com/product/PKCAYPIPE.html"
    - name: "Europa Parts — Porsche Coolant Pipe (Cayenne 957 V8) 94810606910 by OE Supplier — Tier-B specialist parts vendor confirming 2008–2010 Cayenne 4.8L V8 fitment for the updated-pipe SKU"
      tier: B
      url_or_reference: "europaparts.com/coolant-pipe-94810606910.html"
    - name: "Design 911 — Porsche Cayenne MkII (957) 4x4 Water/Coolant Hoses catalogue — Tier-B specialist parts vendor with Cayenne 957 application matrix covering Cayenne S/GTS 4.8L and Cayenne Turbo/Turbo S 4.8L (2007–10) cooling-system parts; framing of cooling-system pipe and hose ageing on older Porsche models"
      tier: B
      url_or_reference: "design911.com/porsche/cayenne-mkii--957--4x4/water---coolant-hoses/"
    - name: "Fifth Gear Automotive — Porsche Cayenne V8 Coolant Pipe Update — Tier-B specialist editorial on the Cayenne V8 plastic-coolant-pipe pattern; primary scope is 955 (referenced in file 06 record 1) but framing of plastic-to-aluminium supersession as canonical remedy applies across the V8 Cayenne population"
      tier: B
      url_or_reference: "fifthgear.biz/fifthgear-blog/porsche-cayenne-v8-coolant-pipe-update/"
    - name: "LN Engineering — Porsche water pump kits cross-reference (catalogue includes Cayenne, Panamera, Macan applications) — Tier-B reference for bundled-service kit availability across the broader Cayenne V8 population, with explicit framing of the original plastic Cayenne coolant pipes as deteriorating-and-cracking-with-time"
      tier: B
      url_or_reference: "lnengineering.com/products/diy-bundles-kits/porsche-water-pump-kits.html"
  tier_c:
    - name: "6SpeedOnline Cayenne 955-957 forum — Cayenne 957 - Coolant Pipe Issue - Water Distributor thread — Tier-C originating community thread that surfaced the under-intake-pipe-replacement-with-aluminium-upgrade pattern with NHTSA-complaint cross-references, full part-number breakdown for the affected components (rear coolant manifold and under-intake pipe), and applicability confirmation across all 957 V8 4.8L DFI variants (S, GTS, Turbo, Turbo S). Page 5 of the same thread captures a 2008 S barb-separation event with NHTSA-and-class-action contact-attempt commentary and an owner case capture documenting JB-Weld field repair followed by re-leak at three months prompting eventual rear-manifold replacement"
      tier: C
      url_or_reference: "6speedonline.com/forums/cayenne-955-957/345323-cayenne-957-coolant-pipe-issue-water-distributor.html"
    - name: "Rennlist Cayenne 955-957 forum — Coolant pipe kit for 2009 GTS thread — Tier-C specialist counter-position commentary (slavie, September 2022) explicitly characterising the 957 plastic Y-pipe as not-really-failure-prone in the field with the aluminium supersession framed as Porsche's precautionary release; same thread identifies the rear coolant manifold with glued-in barb fitting as the actual 957 cooling-system failure point, with the threaded-fitting design as the permanent-fix supersession requiring engine-out work"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-955-957-2003-2010/1318618-coolant-pipe-kit-for-2009-gts.html"
    - name: "Rennlist Cayenne 955-957 forum — Coolant pipe leaks on 957 under manifolds latest parts, status, etc? thread — Tier-C contributor case capture (2009 Turbo S, six years of intermittent coolant smell with no findings on five-year service tracking) attributing most field-reported under-manifold coolant losses on 957 V8 cars to single O-ring or thermostat-housing-seal leaks rather than plastic-pipe failure; reinforces specialist counter-position that the under-intake plastic Y-pipe is rarely the actual leak source"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-955-957-2003-2010/1133314-coolant-pipe-leaks-on-957-under-manifolds-latest-parts-status-etc.html"
    - name: "Rennlist Cayenne 955-957 forum — Class Action lawsuit over glued coolant pipes thread — Tier-C cross-generation class-action-attempt context, capturing the parallel filing for Cayenne 958 generation glued-fitting failure with explicit reference to the same family of failures across early 996 Turbo and GT3 epoxied-fitting cars (\"like cutting the aorta, coolant gushes out in a matter of seconds\" specialist framing on the parallel mechanism); thread documents the 957's specific glued-fitting situation and the absence of Tier-A coverage as a recurring buyer-due-diligence concern"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-955-957-2003-2010/1182425-class-action-lawsuit-over-glued-coolant-pipes.html"
    - name: "Rennlist Cayenne 955-957 forum — Cayenne Coolant Leak at rear of engine thread — Tier-C 2006 CS-Ti owner case capture documenting two-year coolant-smell diagnosis ending with rear-manifold blind-plug leak, with the manifold replaced without engine removal as a specialist-with-experience exception case; useful editorial counterpoint to the typical engine-out framing"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-955-957-2003-2010/759282-cayenne-coolant-leak-at-rear-of-engine.html"
    - name: "Rennlist Cayenne 955-957 forum — Coolant temperature sensor replacement and other goodies thread — Tier-C DIY case capture documenting the rear-of-engine access procedure (intake manifold removal, rear-wiring-harness-bracket removal, E10-bolt access points) on a 957 GTS 4.8L; useful for buyers evaluating DIY-vs-specialist economics on the bundled service event"
      tier: C
      url_or_reference: "rennlist.com/forums/cayenne-955-957-2003-2010/1229929-coolant-temperature-sensor-replacement-and-other-goodies.html"

editorial_note: >
  This record fulfills file 06's deferred item ("Rear coolant
  hose connector failure (957 specifically) — held here pending
  direction"). The deferred-item language pointed at the
  rear-of-engine connector failure pathway; the record now
  centres that failure pathway editorially, with the rear coolant
  manifold's epoxy-glued barb fitting identified as the headline
  failure across multiple Tier-C Rennlist threads (sticky-thread
  status on the issue, parallel class-action filing on the 958
  generation, multi-Porsche-generation pattern across early 996
  Turbo and GT3 epoxied-fitting cars). The under-intake plastic
  Y-pipe with Porsche-released aluminium upgrade (SKU 94810606910)
  is editorially demoted to a secondary bundled-when-engine-is-
  out item per Tier-C specialist consensus that 957 plastic Y-pipe
  failures are not the predominant field-failure pattern despite
  the part-revision-driven supersession. Authoring v1 of this
  record initially conflated the two components under a single
  "rear coolant pipe and water distributor" framing; review
  feedback identified the conflation and the specialist counter-
  position on the under-intake pipe, prompting this v1 revision
  to separate the headline (rear manifold) from the secondary
  (under-intake pipe) failure-pathway editorially.

  This is the single most expensive cooling-system pre-purchase
  question on a 957 Cayenne V8. The labour-cost component is
  larger than the parts-cost component (rear-of-engine access
  for the rear-manifold replacement drives an eight-to-fifteen-
  hour specialist event with engine-out work in most cases);
  buyers of 957 V8 cars should treat any coolant loss at the
  rear of the engine as a $2,000–$4,000 service item until proven
  otherwise. Cars presented for sale with documented Porsche-
  superseded threaded-fitting rear manifold (Genuine Porsche
  Water Distributor SKU 94810606106 for Turbo/Turbo S OR SKU
  94810606104 for naturally-aspirated S/GTS variants) are out
  of this record's primary risk population — the buyer should
  ask for the specific Genuine Porsche SKU on the invoice and
  confirm the variant matches the car. Cars with field-pinned
  or JB-Weld field-repaired barb fittings on the original glued-
  fitting manifold should be treated as having unresolved
  deferred maintenance.

  Cross-record interaction: this record's engine-out service
  event is the natural opportunity to also address Cayenne 957
  cooling-system items that aren't critical on their own — water
  pump preventive replacement (composite-impeller pattern parallel
  to file's Record 2 on the M96/M97 sport-car platform; the 4.8L
  DFI water pump follows the same finite-service-life framing),
  thermostat replacement, the under-intake pipe aluminium upgrade
  (SECONDARY per the editorial framing above), and cooling-system
  flush. A buyer evaluating a 957 V8 should ask whether any of
  these have been done in recent service history; if not, the
  bundled service at $3,000–$4,000 covers all of them efficiently
  given the shared engine-out access labour.

  Cayenne pre-purchase constellation: this record sits alongside
  file 09 record 4 (transfer gear extended warranty, MY 2011–2018
  92A — does NOT extend back to the 957), file 10 record 2 (air
  suspension on equipped 955/957/958 cars), file 10 record 3
  (PCCB carbon-ceramic disc replacement economics on Turbo and
  Turbo S applications), and file 11 records 1 and 4 (wheel-speed
  sensor TSB and sunroof-drain class action — both 92A onward, do
  NOT extend back to the 957). For a 957 V8 buyer, this record
  and file 06 record 1 together form the cooling-system spine of
  the pre-purchase question (file 06 record 1 applies on 955
  cars, this record on 957 cars; they are NOT cumulative — a
  buyer of either generation evaluates the appropriate single
  cooling-system record); with file 10 record 2 (air suspension
  on equipped cars) and file 10 record 3 (PCCB on Turbo S only),
  the constellation completes for a 957 Turbo S.

  Note on the Cayenne Hybrid: the production Cayenne Hybrid
  launched as MY 2011 on the 92A platform; there was no production
  Cayenne hybrid in the 957 generation despite development being
  active during the 957 cycle. Therefore the cayenne_hybrid
  trim is not in scope of this record (per file 11 review
  feedback on the parallel 955/957 hybrid scoping question).

buyer_questions:
  - At inspection, examine the rear of the engine bay (with the engine cool) for coolant residue, dampness, or staining on the rear of the block, the area around the starter, and the upper transmission/torque-converter bell-housing area. Any of these is a signal the rear coolant manifold's glued barb fitting may be loosening or the manifold itself may be seeping. The headline failure is rear-manifold-driven; under-intake pipe leaks are rare per Tier-C specialist consensus.
  - Has the Porsche-superseded threaded-fitting rear coolant manifold been fitted? Genuine Porsche Water Distributor SKU 94810606106 (Turbo/Turbo S, without screw plug) or SKU 94810606104 (naturally-aspirated S/GTS, with screw plug). If yes — when, by which shop, and is the invoice available specifying the SKU? This is the headline remediation; documented retrofit removes the car from this record's primary risk population.
  - Has any rear-of-engine cooling-system service been performed on the car? Was the work limited to a JB-Weld or field-pin repair on the original glued-barb-fitting manifold (treated as deferred maintenance), or did it include the Porsche-superseded threaded-fitting manifold replacement (treated as remediation)?
  - Has the under-intake plastic Y-pipe been replaced with the Genuine Porsche Updated Coolant Pipe SKU 94810606910 aluminium upgrade? Editorially this is a SECONDARY item per Tier-C specialist consensus; documentation that it was replaced is positive but does NOT remediate the headline rear-manifold failure pathway.
  - Does the car experience low-coolant-warning resets between scheduled coolant-system services? Periodic top-off without a visible exterior leak on the front of the engine is consistent with either a rear-manifold seepage path OR a thermostat-housing-seal/O-ring leak (Tier-C captures attribute most under-manifold field leaks on 957 cars to the seal-and-O-ring path rather than plastic-pipe failure). A buyer encountering this signal should specify rear-of-engine inspection rather than assume plastic-pipe replacement.
  - For cars with documented service history showing only the front-of-engine cooling items (water pump, thermostat, expansion tank) addressed but no rear-manifold service: the buyer should price-in the $2,000–$4,000 bundled rear-of-engine service as a budget item likely to come due within the ownership window.
  - For 957 Turbo and Turbo S cars specifically — the water distributor variant (without screw plug, SKU 94810606106) is more expensive than the with-screw-plug variant on other trims. A buyer should confirm any prior service used the correct SKU for the specific Turbo / Turbo S application.
```

---

## Record 5 — Porsche 928 aluminium cooling system internal corrosion and radiator replacement

```yaml
id: porsche_928_aluminium_cooling_system_internal_corrosion_and_radiator_replacement
flag_title: Porsche 928 — all-aluminium cooling system internal corrosion driven by neglected coolant changes; OEM radiator plastic end-tank cracking; high OEM-replacement cost with three Tier-B aftermarket alternatives

description: >
  The Porsche 928 (1978–1995) has an all-aluminium engine and an
  aluminium-cored cooling system, both of which are unusual for
  the era and demand specific maintenance practice. The engine
  block, cylinder heads, water passages, and water bridge are all
  aluminium; the radiator core is aluminium with plastic end-tanks
  on the OEM unit. This architecture has two parallel maintenance
  concerns that compound over multi-decade ownership, both of
  which the catalogue treats jointly because they are addressed
  in the same service event.

  The first concern is internal corrosion of the aluminium cooling
  system. Aluminium is more corrosion-sensitive than the cast-iron
  engines of the era; coolant chemistry, water purity, and
  service interval all matter more on a 928 than on most
  contemporary vehicles. Specialist consensus among 928 specialists
  (928 International, John Pirtle's service guide hosted on
  Rennlist, 928 Specialists' published guidance) converges on
  yearly coolant changes regardless of mileage, with aluminium-
  friendly coolant (specialist consensus prefers G-05 specification
  or the equivalent Porsche-approved coolant) and distilled water
  for the mix. The reasoning is that the additive package in
  off-the-shelf coolants degrades faster than the manufacturer-
  rated lifetime when used on aluminium-block engines, and
  mineral content in tap water deposits inside the cooling
  passages over time, creating localised corrosion sites and
  reducing heat-transfer efficiency. Cars maintained on this
  yearly-service schedule are at low risk of internal-corrosion-
  driven cooling-system damage; cars where the coolant change
  history is unknown or extends beyond five-to-ten years between
  services are at meaningful risk of corrosion damage that may
  not be visible from external inspection.

  The second concern is the OEM radiator's plastic end-tanks. The
  factory radiator pairs an aluminium core with plastic end-tanks
  (a common European-luxury-car design of the era) that crack
  with age and thermal cycling. The Rennlist 928-how-to article
  characterises radiator replacement as one of the most-commonly-
  replaced parts on the 928, with rusting, internal corrosion,
  and end-tank cracking documented as parallel failure pathways.
  928 Motorsports' product description for their American-made
  aluminium radiator explicitly cites elimination of the cracked,
  leak-prone plastic end-tanks as the primary OEM-supersession
  benefit. Owners typically discover the failure as a slow
  coolant leak, sometimes at the lower end-tank where coolant
  pools after a drive, sometimes at the upper end-tank where
  pressure during operation forces coolant past a hairline
  crack. Late-stage failure is sudden coolant loss when a crack
  propagates through the end-tank wall.

  OEM-replacement-radiator economics drive a significant share
  of buyer-due-diligence cost on a 928. The CSF Race press
  release (announcing the 928 International world-exclusive
  CSF aluminium radiator in 2014) cites OEM-radiator pricing
  above $2,000 with the editorial framing that few collectors
  are willing to pay that price when an aftermarket alternative
  exists. Three Tier-B aftermarket aluminium radiators are
  available, all with aluminium end-tanks (eliminating the
  plastic-crack pathway): the CSF Race × 928 International
  exclusive radiator (sold only through 928 International),
  the 928 Motorsports custom-built radiator (nine fitments by
  year and transmission and oil-cooler configuration), and the
  AlliSport UK alloy radiator (single-fan and dual-fan
  variants, with one or two integral oil cooler options). All
  three are TIG-welded all-aluminium construction with measured
  cooling-performance improvements over the OEM unit; pricing
  is in the $700–$1,500 range across the three vendors,
  materially below OEM but with comparable or better cooling
  performance.

  Application-fitment complexity is meaningfully higher on a
  928 than on most cars. The cooling system was revised
  multiple times across the 928's seventeen-year production
  run; integral oil coolers in the radiator end tanks vary by
  model year and trim; manual versus automatic transmission
  variants use different transmission-cooler configurations;
  and the fan shroud changed between single-fan and dual-fan
  applications during production. 928 Motorsports' nine-fitment
  matrix and AlliSport's single-fan-versus-dual-fan distinction
  reflect this complexity. A buyer purchasing an aftermarket
  radiator must identify the specific configuration of their
  car (year, transmission type, oil-cooler presence and
  configuration) and order the matching SKU; a generic-fit
  aftermarket radiator is not an option.

  The 928 coolant expansion tank is a separate sub-component
  that deserves note. Pelican's 928 catalogue lists multiple
  coolant-expansion-tank SKUs across the production years,
  with the editorial framing that the tank should be replaced
  if cracked or if internal corrosion is visible on inspection.
  Tank failure is less common on the 928 than on the
  water-cooled-era sport-car platforms covered in Record 1
  (the 928's plastic tank is differently designed and not in
  the same population) but is documented as a periodic
  service item.

  Cooling-system service on a 928 includes accessories that
  warrant noting. The 928 has dual electric radiator fans on
  most variants; on S4 (1987+) applications, the fans cycle
  on/off and should activate any time the A/C is engaged
  (Pirtle's service guide is explicit on this functional test).
  Cars with stuck-on, stuck-off, or non-cycling fans are at
  risk of overheating in slow traffic. The 928 also has cooling
  flaps on S4 applications that should fully open when the
  engine is turned off — non-functional cooling flaps are a
  documented overheating cause that does not present
  externally as a coolant leak.

applicability:
  generation:
    # Aligned to file 10's 928 generation convention. The base
    # car is `928` (not `928_pre_S`); the European-only 928 S2
    # (1984–1986, 32-valve, never US-imported) is included as
    # a distinct generation for global completeness. A v2
    # schema candidate (see `schema-extension queue`) revisits
    # the broader question of catalogue market scope (US-centric
    # vs global) — for v1 the catalogue follows file 10's
    # global convention.
    - 928
    - 928_S
    - 928_S2
    - 928_S4
    - 928_GT
    - 928_GTS
  engine_family:
    # All 928 generations use variations of the M28 V8 with
    # progressively increasing displacement (4.5L → 4.7L → 5.0L
    # → 5.4L) and revised cylinder-head architectures (16-valve
    # SOHC, 32-valve DOHC). The aluminium-cooling-system
    # architecture is consistent across all variants. Naming
    # aligned to file 10's `M28_V8` convention.
    - M28_V8
  body:
    - Coupe
  trim_category:
    # Aligned to file 10's displacement-suffixed trim format
    # to avoid the structural collision where the same string
    # (e.g. `928_S`) appears in both the generation and
    # trim_category lists.
    - 928_4_5
    - 928_S_4_7
    - 928_S2_4_7
    - 928_S4_5_0
    - 928_GT_5_0
    - 928_GTS_5_4
  year_range: [1977, 1995]
  specific_model_years:
    # Year ranges below reflect global production years rather
    # than US model-year availability. The 928 entered European
    # production in 1977; 1978 was the first US model year. The
    # 928 GTS launched in Europe in 1992; US sales began 1993.
    # The S2 was Europe-only.
    928: [1977, 1978, 1979, 1980, 1981, 1982]
    928_S: [1980, 1981, 1982, 1983, 1984, 1985, 1986]
    928_S2: [1984, 1985, 1986]
    928_S4: [1987, 1988, 1989, 1990, 1991]
    928_GT: [1989, 1990, 1991]
    928_GTS: [1992, 1993, 1994, 1995]

severity: moderate
# Severity is moderate because the failure pathway is gradual
# (corrosion accumulates over years; end-tank cracks present as
# slow leaks before catastrophic loss) and recoverable with
# straightforward radiator replacement. The cost band sits at
# the moderate-to-high boundary: aftermarket aluminium replacement
# at $700–$1,500 plus specialist labour at $500–$1,000 lands
# total at $1,500–$3,000 in most cases, with OEM-replacement
# scenarios reaching $2,500+ for the part alone. The catalogue
# ranks this moderate because most pre-purchase encounters
# allow for budget-planning rather than emergency repair, and
# the aftermarket-alternative market is well-developed and
# accessible.

cost_range_usd:
  diy_oem_genuine_porsche_radiator:
    low: 2000
    high: 2500
    qualitative: rare_and_typically_avoided_with_aftermarket_aluminium_alternative
    _source_anchor: >
      CSF Race press release announcing the 928 International
      world-exclusive CSF aluminium radiator characterises
      OEM-radiator pricing as above $2,000 with editorial framing
      that few collectors are willing to pay this price when
      aftermarket alternatives exist. Pelican Parts 928 catalogue
      lists Genuine Porsche radiator SKUs at the upper end of
      this band. The $2,000–$2,500 band brackets specialist-
      vendor Genuine Porsche radiator pricing; OEM purchase via
      Porsche Classic dealer channel may be higher. The
      catalogue notes this band for completeness but specialist
      consensus across 928 International, 928 Motorsports, and
      AlliSport is that the aftermarket aluminium alternative is
      the practical path.
  diy_aftermarket_aluminium_radiator:
    low: 700
    high: 1500
    _source_anchor: >
      CSF × 928 International world-exclusive radiator pricing
      (private-label exclusive; contact 928 International for
      ordering) sits in the lower-middle of this band per
      product-positioning editorial; CSF press release
      characterises the radiator as a fraction of OEM cost. 928
      Motorsports custom-built aluminium radiator pricing across
      the nine-fitment SKU matrix sits across the band depending
      on integral oil-cooler configuration; AlliSport UK pricing
      similar. C/G/J POR 0928 aluminium radiator and 928sRus
      CSF distribution provide additional price points. The
      $700–$1,500 band brackets aftermarket aluminium-radiator
      pricing across the three primary Tier-B specialist vendors;
      configuration complexity (transmission type, oil-cooler
      configuration, fan shroud) drives pricing within the band.
  diy_total_parts_with_hoses_clamps_thermostat:
    low: 850
    high: 1800
    _source_anchor: >
      Pirtle's 928 coolant-flush service guide documents
      bundled-service parts: aftermarket aluminium radiator
      ($700–$1,500), upper and lower radiator hoses ($60–$120),
      heater hoses ($30–$60), coolant reservoir hose ($20–$40),
      heater valve ($40–$80), radiator cap ($15–$30), radiator
      drain plugs (specialist-recommended replacement ~$10–$20
      with order of spares per Rennlist DIY thread), and approximately
      $50–$100 in miscellaneous clamps and seals. Coolant
      itself (5–6 gallons mix at $35/gallon Genuine Porsche or
      lower for G-05 aftermarket) adds $50–$200. The $850–$1,800
      band brackets total parts cost for a comprehensive
      cooling-system refresh including aftermarket aluminium
      radiator, all rubber hoses, and coolant.
  specialist_labour_total_radiator_replacement:
    low: 1500
    high: 3000
    _source_anchor: >
      Rennlist 928 how-to article documents radiator replacement
      as a multi-hour specialist event including front-of-engine
      access, oil-cooler-line disconnection (where present in
      end-tanks), radiator hold-down clamp and vent-hose removal,
      and refill-and-bleed of the all-aluminium system. Specialist
      labour is documented at four-to-eight hours depending on
      transmission type and oil-cooler configuration. At
      specialist hourly rates of $150–$200, total labour lands
      at $600–$1,600; combined with parts ($850–$1,800) the
      all-in specialist cost is $1,500–$3,000 in most cases.
      Dealer or Porsche Classic Centre pricing typically runs
      higher; the catalogue does not have a Tier-B dealer-
      pricing anchor and treats dealer pricing as falling above
      the upper end of the band. A buyer should treat $2,200 as
      a typical mid-band figure for aftermarket-aluminium-
      radiator replacement at a 928 specialist with bundled
      hose-and-coolant-refresh service.

prevalence_rate:
  qualitative: high_on_neglected_service_history_low_on_documented_yearly_service_population_aging_through_failure_window
  _source_anchor: >
    Tier-B specialist consensus: Rennlist 928 how-to article
    characterises the radiator as one of the most-commonly-
    replaced parts on the 928 production run. 928 Motorsports
    product description characterises OEM plastic end-tanks as
    cracked-and-leak-prone. The CSF press release frames the
    failure-driven-replacement market as large enough to
    support a private-label exclusive product line. The three
    Tier-B aftermarket-radiator vendors (CSF/928 International,
    928 Motorsports, AlliSport) maintaining current product
    inventory across the full 1978–1995 application range is
    itself evidence of sustained demand. Numeric prevalence rate
    not asserted; the qualitative framing is anchored in the
    sustained Tier-B specialist-market presence of three parallel
    radiator-replacement product lines and the canonical-how-to
    coverage on Rennlist treating the procedure as routine.
    Cars with documented yearly coolant-change service history
    are at low internal-corrosion risk and below-average end-
    tank-crack risk; cars with unknown or extended-service-
    interval history are the population this record targets.

failure_correlation:
  - service_history (cars maintained on yearly coolant-change schedule with aluminium-friendly coolant are at materially lower risk than cars with extended-interval or unknown service history)
  - age (the 928 production run ended in 1995; the youngest 928 is now thirty-plus years old, with all production cars in the late-failure window for original-OEM radiators)
  - mileage (running cycles compound thermal-cycling damage on plastic end-tanks; high-mileage cars are at higher risk)
  - climate (hot-climate operation accelerates plastic end-tank embrittlement; salt-belt operation accelerates external aluminium corrosion on radiator core)
  - water_chemistry (cars where tap water rather than distilled water has been used in coolant mix accumulate mineral deposits in cooling passages over time; cars where non-aluminium-friendly coolant has been used at any point in service history are at elevated internal-corrosion risk)

retrofit_available: yes
retrofit_kit_names:
  - "CSF Race × 928 International world-exclusive aluminium radiator (CSF Race Part 8013 family) — Tier-B aftermarket all-aluminium radiator with B-Tube technology and multi-louvered fins; private-label exclusive sold only through 928 International (mr928@928intl.com); fits all 928 model years and transmissions with integral engine and transmission oil coolers"
  - "928 Motorsports American-made aluminium radiator (nine fitment SKUs by year, transmission, and oil-cooler configuration) — Tier-B aftermarket all-aluminium radiator with integral oil coolers (where applicable); TIG-welded epoxy-free construction; 1/4 inch thicker core than OEM for additional cooling capacity; two-year warranty"
  - "AlliSport UK Porsche 928 alloy radiator (single-fan AS95 and dual-fan variants) — Tier-B aftermarket all-aluminium radiator with optional one or two integral oil coolers; 19-FPI core; tested to 30 psi (approximately twice operating pressure); designed to accept original plastic fan cowl and pipe connections"
  - "C/G/J POR 0928 aluminium radiator (1979–1985 application) — Tier-B aftermarket all-aluminium radiator with TIG-welded core-to-tank construction"
  - "928sRus CSF Two Cooler Universal aluminium radiator (CSF 928-106-043) — Tier-B aftermarket all-aluminium radiator distributed by 928sRus; fits all 928 1978–1995 with or without oil and transmission coolers; OEM-equivalent dimensions"
  - "Genuine Porsche replacement radiator (Porsche Classic Centre or specialist parts vendor) — like-for-like factory part; specialist consensus advises against given $2,000+ pricing and the documented plastic-end-tank failure pathway on the OEM design"
  - "Aluminium-friendly G-05 specification coolant (Zerex G-05 or Porsche-approved equivalent) — specialist-consensus-required for the all-aluminium 928 cooling system; non-G-05 coolants accelerate aluminium corrosion"

regional_amplification:
  hot_climate: high
  desert_southwest: high
  salt_belt: moderate
  coastal_humid: moderate
  cold_climate: low
  # Source-supported qualitatively: thermal-cycling damage on
  # plastic end-tanks is hot-climate-amplified; internal aluminium
  # corrosion is humidity-sensitive (atmospheric humidity drives
  # condensation cycles on stored cars). Salt-belt cars
  # experience accelerated external core corrosion. Cold-climate
  # cars are at lowest cumulative risk per year but normalize on
  # the multi-decade service-life timescale all 928s are now in.

evidence_basis:
  tier_a:
    # No Porsche AG TSB or warranty-extension action covers the
    # 928 cooling system at this stage of the car's service life;
    # remedy is at owner expense via specialist channels. Porsche
    # Classic Centre support exists for parts ordering on Genuine
    # Porsche replacement components.
  tier_b:
    - name: "CSF Race × 928 International — World Exclusive High-Performance Cooling for All Porsche 928 Models press release — Tier-B specialist editorial (CSF Race) on the world-exclusive aluminium radiator with engineering-positioning framing (B-Tube technology, multi-louvered fins, two integral oil coolers); confirms OEM radiator pricing above $2,000 and frames the aftermarket alternative as a fraction of OEM cost"
      tier: B
      url_or_reference: "news.csfrace.com/world-exclusive-high-performance-cooling-for-all-porsche-928-models/"
    - name: "928 Motorsports — All-Aluminum Replacement Radiator for the Porsche 928 product page — Tier-B specialist editorial with engineering-positioning framing (nine fitment SKUs, 7% cooler than other flux-bonded aluminium cores, 15% cooler than copper or brass, TIG-welded all-aluminium construction, 20-psi rated); explicit framing of OEM plastic end-tank failure pathway as the primary OEM-supersession benefit"
      tier: B
      url_or_reference: "928motorsports.com/parts/alumradiator.php"
    - name: "AlliSport UK — AS95 Porsche 928 alloy radiator for cars with single fan product page — Tier-B specialist editorial with engineering-positioning framing (controlled atmosphere brazed cores, 19 FPI optimum cooling, hand-built TIG-welded construction, 30-psi tested, optional integral oil coolers via CNC-machined threaded connections); compatible with original plastic fan cowl"
      tier: B
      url_or_reference: "allisport.com/shop/performance-products/alloy-radiators/porsche-928-alloy-radiator-for-cars-with-single-fan/"
    - name: "928sRus — CSF Two Cooler Universal Aluminum Radiator product page — Tier-B specialist parts vendor distributing the CSF 928 radiator alongside the 928 International exclusive distribution channel; fitment confirmation across all 928 production years"
      tier: B
      url_or_reference: "928srus.com/products/928-106-043-csf-two-cooler-universal-aluminum-radiator-csf"
    - name: "Pelican Parts — Porsche 928 (1978-1995) Water Cooling System Radiators catalogue — Tier-B parts vendor application matrix across all 928 production years, trims (Coupe, GT, GTS, S, S4), and integral-oil-cooler configurations; coolant-and-additive product range; cooling-system component cross-reference"
      tier: B
      url_or_reference: "pelicanparts.com/catalog/SuperCat/928M/POR_928M_WATRAD_pg1.htm"
    - name: "Pelican Parts — Porsche 928 Coolant Expansion Tanks and Parts catalogue — Tier-B parts vendor application matrix for coolant-expansion-tank replacement; editorial framing of replacement-when-cracked or replacement-when-internal-corrosion-visible"
      tier: B
      url_or_reference: "pelicanparts.com/cat/r_928m/watrad_coolant-expansion-tanks-and-parts"
    - name: "Rennlist 928 How-To — Porsche 928: How to Replace Radiator article — Tier-B canonical procedural reference (note: hosted on Rennlist forum domain but authored as a structured how-to article rather than a forum thread; the catalogue treats Rennlist how-to articles as Tier-B procedural references parallel to Pelican Parts how-to articles per the catalogue's locked tier convention); explicit framing of the radiator as one of the most-commonly-replaced parts on the 928"
      tier: B
      url_or_reference: "rennlist.com/how-tos/a/porsche-928-how-to-replace-radiator-377472"
    - name: "C/G/J Inc — POR 0928 Aluminum Porsche 928 Radiator product page — Tier-B specialist parts vendor with American-made aluminium radiator (1979–1985 application); controlled-atmosphere-brazed epoxy-free core construction; specific dimensional fitment data"
      tier: B
      url_or_reference: "cgj.com/product/por-0928-aluminum-porsche-928-radiator"
    - name: "928-944parts — Porsche 928 aluminum radiator from 1987 (S4) product page — Tier-B European specialist parts vendor with aluminium radiator for S4 application (1987 onward) including integral oil cooler for engine and automatic gearbox"
      tier: B
      url_or_reference: "928-944parts.com/en/products/porsche-928-aluminum-radiator-from1987-s4"
    - name: "John Pirtle's 928 Service guide hosted on Rennlist members domain — Coolant Flush procedure — Tier-B canonical specialist-authored procedural reference with explicit yearly-coolant-change-interval recommendation, aluminium-friendly-coolant requirement, distilled-water requirement, parallel-replacement bundling guidance for hoses / heater valve / radiator cap, and S4-specific cooling-flap operational test (note: the catalogue treats Pirtle's named-specialist 928 service guide as Tier-B parallel to Pelican Parts how-to status, distinct from Rennlist forum threads which are Tier-C)"
      tier: B
      url_or_reference: "members.rennlist.com/pirtle/svc_coolant.html"
  tier_c:
    - name: "Rennlist 928 forum — Coolant Drain/Change Procedure with photos thread — Tier-C consistency: DIY photo-walkthrough of the drain procedure on an S4 application; G-05 coolant recommendation in commenter discussion; framing of the 928 cooling system as a self-bleeding system without manual burping required"
      tier: C
      url_or_reference: "rennlist.com/forums/928-forum/505835-coolant-drain-change-procedure-w-pics.html"

editorial_note: >
  This record fulfills file 05's deferred item ("Cooling system /
  radiator corrosion. All-aluminum engine and cooling system means
  coolant changes are critical to prevent internal corrosion, and
  radiator replacement is reportedly very expensive. Real and
  noteworthy. Could be a v2 record in this file or in a shared
  cooling-systems file"). The catalogue places the record here in
  the cooling-systems file rather than expanding file 05 because
  the 928's cooling-system architecture has parallels to the
  water-cooled-era sport-car cooling-system service-cluster
  framing (Records 1, 2, 3 of this file) and benefits from
  shared editorial framing on cooling-system-bundle service
  events. The 928 is mechanically distinct from the water-cooled-
  era sport-car platforms but the cooling-system-as-service-
  cluster pattern is consistent.

  This is the canonical pre-purchase question on a 928 after
  the timing belt and water pump (file 05 record 1). Specialists
  routinely advise that a 928 inspection should include a
  cooling-system review covering coolant condition (a clear
  green or pink coolant in good chemistry is reassuring; a
  rust-coloured, brown, or oily coolant is grounds for immediate
  concern), radiator visual inspection (end-tank crack inspection
  on OEM units; aftermarket-aluminium installations are
  identifiable by appearance and provenance documentation),
  hose condition (rubber hardening with age is universal; cars
  with original 1980s rubber are due for refresh regardless of
  visible condition), and fan operation (functional test with
  A/C activation should cycle both fans through their speed
  ranges).

  The pre-purchase economic framing: cars presented for sale
  with documented aftermarket aluminium radiator installation
  (specifically CSF, 928 Motorsports, or AlliSport with
  installation invoice from a 928 specialist) are out of this
  record's risk population; a buyer should ask for the specific
  manufacturer and installation documentation. Cars presented
  with original OEM radiator and unknown coolant-change history
  are the population this record targets — the buyer should
  budget $2,000–$3,000 for a specialist-installed aftermarket
  aluminium radiator and bundled cooling-system refresh as a
  near-term ownership cost regardless of current leak presence.

  Coolant-chemistry-driven internal corrosion is harder to
  diagnose than external leakage. A buyer's best signal is
  service-history documentation: cars maintained by a recognized
  928 specialist (928 International, 928 Specialists / Mark
  Anderson, Devek, similar) on a yearly-coolant-change schedule
  with aluminium-friendly coolant are at low internal-corrosion
  risk. Cars with no documented service history, owner-claimed-
  but-unverified service, or service by general-purpose shops
  unfamiliar with aluminium-cooling-system chemistry should be
  evaluated with elevated caution; in worst-case scenarios,
  internal corrosion damage may not be detectable until a
  cylinder-head removal exposes corroded water passages.

  Cooling-flap operational test on S4 (1987+) applications:
  with the engine warm and then turned off, observe the front
  bumper / radiator-area cooling flaps. Per Pirtle's service
  guide, the cooling flaps should fully open when the engine is
  turned off; non-functional cooling flaps are a documented
  overheating cause that does not present as a coolant leak. A
  buyer evaluating an S4, GT, or GTS variant should include this
  test in the inspection.

  Cross-record interaction: this record's cooling-system service
  event is a natural pairing with file 05 record 1 (timing belt
  and water pump) — both are major service events with overlapping
  parts (water pump for the cooling system + timing belt service)
  and shared specialist labour access. A buyer evaluating a 928
  with both timing belt service and cooling-system service
  upcoming should expect the bundled $4,000–$6,000 specialist-
  total figure rather than two separate $2,000–$3,000 service
  events.

buyer_questions:
  - What is the documented coolant-change history? Specifically — has coolant been changed yearly, has it been changed at least every 2–3 years, or is the change history unknown / extends beyond five years between services?
  - What coolant has been used? Specifically aluminium-friendly G-05 specification coolant (Zerex G-05 or Porsche-approved equivalent), or has off-the-shelf coolant of unknown specification been used at any point?
  - Has tap water rather than distilled water been used in any coolant mix? Tap water introduces minerals into the all-aluminium system and accelerates internal-passage corrosion over time.
  - Is the radiator the original OEM unit with plastic end-tanks, or has it been replaced with an aftermarket aluminium radiator? If aftermarket — which manufacturer (CSF, 928 Motorsports, AlliSport, or other), when, by which shop, and is the installation invoice available?
  - At inspection, examine the radiator visually for end-tank cracks (OEM units with plastic end-tanks), corrosion staining at lower-edge weep points, and any wet residue around the upper or lower hoses. Examine the coolant in the expansion tank — clear bright coolant of correct colour is reassuring; rust-coloured, brown, oily, or visibly-contaminated coolant is grounds for immediate concern.
  - For S4, GT, and GTS applications (1987+) — with the engine warm and then turned off, do the cooling flaps fully open as designed? Non-functional cooling flaps are a documented overheating cause that does not present as a leak.
  - For all variants — with the engine warm and the A/C activated, do both radiator fans operate and cycle through their speed levels? A stuck or non-cycling fan is grounds for diagnostic inspection of the fan motor, fan relay, or fan shroud assembly.
  - Has the coolant expansion tank been replaced? Is it currently free of cracks and visible internal corrosion on inspection?
  - For cars with documented timing-belt service upcoming or recently completed — was the water pump replaced at the same service event, and was the cooling system flushed and refilled with aluminium-friendly coolant? The water-pump-and-cooling-system bundle on a 928 is the cost-efficient single service event.
```

---

## Cross-references

- **File 01 — M96 / M97 sport-car flat-six engine.** File 01's "Considered and Not Included" section deferred two items now resolved here: (a) coolant expansion tank cracking, deferred as "service item rather than flag-worthy defect" but recharacterised here as a buyer-due-diligence item given the prevalence and the visual pre-purchase signal — Record 1; (b) water pump replacement, deferred as "routine scheduled maintenance item rather than a defect" but recharacterised here as a defect because the failure mode (composite-impeller fragmentation) drives downstream cylinder-head-cracking risk that scheduled-service framing alone does not communicate to a buyer — Record 2. The catalogue's editorial framing on both is that the file 01 "service item" classification was technically correct but understated the buyer-relevance dimension.

- **File 02 — Mezger flat-six engine.** File 02 record 1 (GT1-block coolant pipe failure on 996 Turbo / GT2 / GT3, 997 Turbo / GT2 / GT3) covers a different cooling-system failure mode on a different population than this file's records. Mezger-engined cars are subject to file 02's GT1-coolant-pipe record AND to this file's Records 1 (expansion tank — same architecture as M96/M97), 2 (water pump — same composite-impeller architecture), and 3 (front-mount radiator/condenser — same architecture). A buyer evaluating a 996 Turbo or GT3 should treat file 02 record 1 and this file's Records 1-3 as joint pre-purchase questions; the cooling-system-bundle service event on a Mezger car typically also addresses the GT1-coolant-pipe pinning or welding upgrade in the same shop visit.

- **File 04 — 924 / 944 / 968 transaxle four-cylinder engine.** File 04 record (water pump replacement bundled with timing-belt service) covers water-pump replacement on the 924/944/968 four-cylinder population. The 944/968 water pump is timing-belt-driven, so the canonical service event bundles water-pump replacement with timing-belt and balance-shaft-belt replacement at the same access. This file does not duplicate that record; the transaxle-four-cylinder water pump is mechanically distinct from the M96/M97 water pump architecture covered in this file's Record 2. A buyer evaluating a 924/944/968 should follow file 04's framing for the bundled service event.

- **File 05 — 928 V8 engine.** File 05 record 1 (timing belt with water pump bundled service) covers 928 water pump replacement on the timing-belt-service framing. This file's Record 5 covers the broader 928 cooling-system service cluster (radiator, expansion tank, hoses, coolant chemistry) which is a separate service event from the timing-belt bundle. A buyer evaluating a 928 should plan for both: the timing-belt-and-water-pump bundle (file 05 record 1) at one service event, and the cooling-system-and-radiator bundle (this file's Record 5) at another. Specialists routinely co-schedule them when both are due to share specialist labour-access; the catalogue acknowledges this efficiency in Record 5's editorial note.

- **File 06 — Cayenne V8 engine.** File 06 record 1 (Cayenne 955 V8 plastic valley coolant pipes, MY 2003–2007, $45M class-action settlement on MY 2003–2006) covers the V-valley plastic coolant pipe failure on the 4.5L V8 architecture used in the 955 generation. This file's Record 4 covers the parallel-but-mechanically-distinct rear coolant pipe and water-distributor failure on the 4.8L DFI V8 architecture used in the 957 generation (MY 2008–2010). The two records together cover the Cayenne V8 cooling-pipe pre-purchase question across both pre-958 generations; they are NOT duplicative because the failure mechanism location and the affected component part-numbers do not overlap. File 06's class-action settlement on the 955 does not extend to the 957; remedy on the 957 rear pipe is at owner expense via the Porsche-superseded aluminium pipe (SKU 94810606910).

- **File 09 — drivetrain and transmissions.** File 09 record 4 (Cayenne 92A transfer-gear extended warranty, MY 2011–2018, Porsche TSB 83/20) covers a different system on the next-generation Cayenne after this file's Record 4. The two records together form part of the Cayenne pre-purchase constellation — a buyer of an MY 2011+ Cayenne should evaluate file 09 record 4 and file 11 records 1 and 4; a buyer of an MY 2003–2007 Cayenne should evaluate file 06 record 1; a buyer of an MY 2008–2010 Cayenne (this file's Record 4 scope) sits between the two warranty regimes with no Porsche AG warranty-extension coverage on the rear coolant pipe failure.

- **File 10 — chassis and suspension.** File 10 record 2 (Cayenne 955/957/958 air suspension) and this file's Record 4 overlap in their 957 applicability. The air-suspension record applies only to cars factory-equipped with air suspension (standard on Turbo and Turbo S; option on other trims); the rear coolant pipe record applies to all 957 V8 4.8L DFI variants regardless of suspension specification.

- **File 11 — electrical.** File 11 records 1 and 4 (wheel-speed sensor TSB 122/19 and sunroof-drain class-action settlement) apply to the 92A Cayenne (MY 2011–2018) and do not extend back to the 957. The 957 V8 pre-purchase constellation is comparatively narrower at the Tier-A level — the rear coolant pipe (this file's Record 4) is the principal pre-purchase question, with file 06 record 1 (valley pipes, 955-only) and file 11 records 1 and 4 (92A-only) explicitly out of scope for a 957 buyer.

- **File 99 — shared water-cooled-era cross-engine-family records.** File 99 covers cooling-system items that span engine families (secondary air injection, ignition coils — both of which have downstream cooling-system implications). This file does not duplicate file 99's records; the shared-cross-engine items are handled at the file 99 level rather than within the cooling-system-specific records here.

---

## Items deferred from this file

The following cooling-system items were considered for inclusion but did not meet the catalogue's bar for a flagged defect record at v1. Documented here for transparency and as candidates for v2 expansion:

- **996 / 997 thermostat housing leaks.** Plastic thermostat housings on M96 and M97 applications develop seal leaks with age, presenting as slow coolant loss similar to the expansion tank pattern (Record 1). Considered for inclusion as a separate record; deferred because the failure mode is sufficiently bundled with water-pump service (Record 2) — the thermostat is replaced concurrently with the water pump per specialist consensus, and a separate thermostat-only service event is rare in practice. Captured by Record 2's editorial note on bundled service. May warrant its own v2 record if specialist consensus diverges from the bundled-service framing.

- **944 / 968 plastic coolant Y-pipe / heater control valve failures.** Real and well-documented on the 924/944/968 transaxle four-cylinder population. Considered for inclusion in this file; deferred because the failure mode is generation-specific to the transaxle four-cylinder platform and has not yet reached the catalogue's Tier-B specialist-coverage threshold for a separate record. May warrant its own v2 record alongside file 04's water-pump record on a future authoring pass.

- **Cayenne 9YA (MY 2019+) cooling-system items.** The third-generation Cayenne (9YA) and Macan / Panamera 971 cooling systems are documented at Tier-B specialists (Motronix and similar) as having parallel issues on the next-generation platforms. Deferred from this file because (a) the cars are still under or recently out of factory warranty, (b) Tier-B specialist coverage is still developing, and (c) the failure-pattern population data is not yet at the v1 threshold. Strong candidates for the catalogue's first v1.1 / v2 expansion pass.

- **991-generation cooling-system items (911, 2012–2019).** Motronix's published guidance on 991 cooling weak points documents tank-and-cap failures, plastic-housing fatigue, and seal-and-O-ring seepage as common items on the 991 platform; these are mechanically distinct from the 996/997 expansion-tank-and-water-pump items covered in Records 1 and 2 of this file because the 991 uses a different cooling-system architecture (long pressure-managed circuit with multiple plastic housings). Deferred from this file because the 991 is a generation-distinct-from-water-cooled-era population that warrants its own treatment alongside any 992-specific items in a future records pass. Strong v2 candidate.

- **928 expansion tank cracking (separate from radiator).** The 928's plastic coolant expansion tank is a separate component from the radiator covered in Record 5; it is documented as a periodic service item by Pelican Parts' 928 catalogue but at lower frequency than the radiator-replacement service event. Captured editorially in Record 5 rather than as a separate record. May warrant a separate v2 record if specialist field experience indicates the tank-replacement service is more common than the bundled framing implies.

- **996 / 997 / 986 / 987 radiator fan resistor pack failure.** Documented in Pelican's how-to as a parallel sub-component failure on the same parts cluster as Record 3 (front-mount radiators and condensers). Captured editorially in Record 3 rather than as a separate record because the resistor-pack replacement is bundled into the same service event as radiator/condenser replacement on most service occasions. May warrant promotion to a separate record if buyer-experience indicates the resistor-pack failure is sufficiently common in isolation from the broader cooling-cluster service.

- **996 / 997 / 986 / 987 coolant hose service.** The Pelican coolant-hose-replacement how-to documents a comprehensive matrix of cooling-system rubber hoses across the water-cooled-era sport-car platform. Considered for inclusion as a separate record; deferred because the hose-replacement service is consistently bundled with one of Records 1, 2, or 3 in actual practice (a tank-replacement, water-pump-replacement, or radiator-replacement service event opens the cooling system, and adjacent hoses are refreshed at the same time). Captured editorially in each of the three primary records. May warrant promotion to a separate record if buyer-experience indicates the hose service occurs in isolation from the larger service events.

- **928 thermostat replacement.** Documented at Pirtle's 928 service guide as bundled with cooling-system service when the water bridge is accessed for hose replacement. Captured editorially in Record 5 rather than as a separate record.

If field experience surfaces clear specialist consensus that any of these warrants its own record, they can be added in a v2 pass.

---

## Schema-extension queue (carry to `00_schema.md` v2 candidates)

Authoring this file surfaced the following structural issues that the locked v1 schema does not cleanly accommodate. They are documented here for the v2 schema pass.

- **Service-cluster grouping for cooling-system records.** Records 1, 2, and 3 of this file all apply jointly to the same 996/997/986/987 population, with editorial notes in each record acknowledging the bundled-service-event framing (specialist-consensus is to address all three at the same 8-12 year service event for labour-overlap efficiency). The matcher routes each record independently, but a buyer evaluating a single car would benefit from a unified "996/997/986/987 cooling-system cluster" rendering that surfaces the three records together with the bundled service-cost figure ($2,500–$5,000) as a single budget item rather than three separate items. This pattern parallels file 11's Cayenne 92A pre-purchase constellation candidate (file 09 record 4 + file 10 record 2 + file 11 records 1 and 4) but at the cooling-system rather than VIN-level constellation. A v2 schema extension permitting `service_cluster_id` annotation on records that share a bundled-service-event framing — distinct from `cross_file_constellation_id` which is VIN-level — would let the matcher render service clusters as unified buyer-questions rather than separate records.

- **Tier-classification ambiguity for named-specialist-authored guides hosted on forum-platform domains.** Record 5 of this file relies on John Pirtle's 928 cooling-flush service guide hosted on the Rennlist members domain (members.rennlist.com/pirtle/svc_coolant.html). The guide is structurally a Tier-B procedural reference (named specialist, structured procedural document, parallel to Pelican Parts how-to format) but is hosted on a forum-platform domain that the locked tier convention treats as Tier C for forum threads. The catalogue's v1 treatment classifies the guide as Tier B with explicit framing of the named-specialist-authorship distinction; a v2 schema decision should formalise whether named-specialist-authored structured guides on forum-platform domains are Tier B (catalogue's current position) or Tier C (strict-domain-based classification). The same question applies to Rennlist's how-to vertical (rennlist.com/how-tos/) which is editorial-team-authored content distinct from forum threads. The catalogue's v1 treatment of the Rennlist how-to article in Record 5's evidence_basis takes the conservative-cautious-position framing as Tier B with the same named-specialist-equivalent rationale; a v2 schema decision should adjudicate.

- **Cost-band aggregation across multiple tier-B aftermarket vendors with significant price-band variation.** Record 5's `diy_aftermarket_aluminium_radiator` band ($700–$1,500) aggregates across three primary Tier-B vendors (CSF Race × 928 International, 928 Motorsports, AlliSport) with sub-band differentiation driven by configuration complexity (transmission type, oil-cooler configuration, fan shroud) rather than vendor-pricing variation. The current schema's flat low/high band format does not capture the configuration-driven sub-bands; a buyer evaluating a specific 928 cannot determine from the band alone whether their configuration is at the low, middle, or high end of the band. A v2 schema extension permitting `cost_sub_bands_by_configuration` with named configuration-keys and per-key low/high values would let the matcher render configuration-specific cost figures rather than the flat band. This pattern is also relevant to file 10 record 2 (air suspension components priced by trim) and file 06 record 1 (valley pipe kits priced by single-side / both-side / kit-bundle scope).

- **Service-interval-driven preventive-replacement framing.** Record 2 of this file (water pump composite impeller) is editorially anchored on a 4-6 years / 50-75k miles preventive-replacement interval per LN Engineering and Flat 6 Innovations consensus. The current schema does not have a formal field for preventive-service-interval recommendations distinct from the failure-correlation field; a buyer evaluating a car wants to know both "how does this fail" (failure_correlation) and "when should it be preventively replaced" (service_interval_recommendation). A v2 schema extension permitting `preventive_service_interval` with sub-keys for time-based, mileage-based, and combined recommendations would let the matcher render preventive-service framing distinct from failure-prediction framing. This applies cleanly to Record 2 (water pump 4-6 years / 50-75k miles), Record 5 (928 coolant change yearly), file 04's water pump record (tied to the 60-80k mile timing-belt service interval that bundles water-pump and balance-shaft-belt replacement), and file 05 record 1 (timing belt 4-6 year specialist-consensus interval).

- **Generation-naming convention by platform.** Record 5 covers the 928 V8 (1977–1995); the catalogue follows file 10's 928-platform convention with generation keys `928`, `928_S`, `928_S2`, `928_S4`, `928_GT`, `928_GTS` and trim_category keys in displacement-suffixed form (`928_4_5`, `928_S_4_7`, `928_S2_4_7`, `928_S4_5_0`, `928_GT_5_0`, `928_GTS_5_4`) to avoid the structural collision where the same string would appear in both the generation and trim_category lists. The v2 schema pass should formalise per-platform generation-naming conventions: chassis-code-based for Cayenne (file-10 form: `cayenne_955`, `cayenne_957`, etc.), trim-and-platform-based with displacement-suffixed trim format for 928 (file-10 form, applied here in Record 5), and production-revision-based for 911 sport-car (996.1/996.2/997.1/997.2 form). The catalogue currently follows these conventions without an explicit per-platform convention statement in 00_schema.md; documenting them would resolve the recurring naming-convention questions surfaced in file 10, file 11, and file 12 reviews.

- **Catalogue market-scope convention (US-centric vs global).** Record 5's applicability handles a recurring question across the catalogue: should `year_range` and `specific_model_years` reflect global production years or US model-year availability? The 928 entered European production in 1977 with the first US model year being 1978; the 928 GTS launched in Europe in 1992 with US sales beginning 1993; the 928 S2 (1984–1986) was Europe-only and never US-imported. Record 5 follows the global convention (year_range starts 1977, GTS starts 1992, S2 included as a distinct generation) consistent with file 10's 928 record. This convention is applied without an explicit catalogue-wide statement and surfaces parallel questions for Cayenne 957 model-year-vs-production-year, 991 model-year-vs-calendar-year, and Macan i4 first-US-availability-vs-global-availability. A v2 schema extension permitting `market_scope: global | us_only | eu_only | other_market_scope_with_qualifier` per record — or a catalogue-wide convention statement in 00_schema.md — would resolve the recurring ambiguity.

- **Editorial-classification distinction between "service cluster" and "defect" for buyer-presentation purposes.** Records 1 and 2 of this file recharacterise items that file 01 originally classified as "service items rather than defects." The recharacterisation was deliberate (downstream-damage risk on Record 2; high prevalence and visual pre-purchase signal on Record 1) but the v1 schema does not have a formal field for this editorial classification — both are simply records with severity ratings. A v2 schema extension permitting `editorial_classification: defect | service_cluster | maintenance_item` distinct from severity would let the matcher render service-cluster items in a different visual format from discrete-defect items. The buyer-relevance is similar but the framing differs: a defect is something the car "has" that needs fixing; a service-cluster item is something the car will "need" within an ownership window regardless of current condition.

- **`tier_a_absence_rationale` field promotion (continued from file 11 schema-extension queue).** Records 1, 2, 3, 4, and 5 of this file all use YAML-comment-style `tier_a: # No Porsche AG TSB or warranty-extension action covers...` framing under `tier_a: []`. The pattern is now consistent across files 11 and 12; the v2 promotion to a structured `tier_a_absence_rationale` field would let the matcher render the absence framing in buyer-facing output. Reinforces the file 11 candidate.

---

## Sources

Full source URLs for the citations used above. Tier indicators match the convention established in files 10 and 11.

### Tier A — Porsche AG, PCNA, NHTSA-mirrored TSBs, PCA editorial, court-approved class actions

No Tier-A sources are cited in this file. Each record's `tier_a:` block documents the explicit absence of Porsche AG TSBs, warranty extensions, or court-approved class-action coverage on the relevant cooling-system failure mode. The catalogue's editorial position is that the absence is itself a notable observation: cooling-system items in this file's scope are uniformly remedied at owner expense without the regulatory or warranty-extension structures documented in files 06 (Cayenne 955 valley-pipe class action), 09 (Cayenne 92A transfer-gear extended warranty), and 11 (Cayenne / Macan wheel-speed-sensor TSB and sunroof-drain class action). The file 11 schema-extension queue's `tier_a_absence_rationale` candidate is reinforced here.

### Tier B — established specialists with documented expertise

[1] Pelican Parts — Porsche 911 Carrera Coolant Tank Replacement, 996 (1998-2005) and 997 (2005-2012). Canonical Tier-B how-to with step-by-step procedure, parts-list, and seam-cracking failure-mode discussion. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/33-WATER-Coolant_Tank_Replacement/33-WATER-Coolant_Tank_Replacement.htm

[2] Pelican Parts — Porsche Boxster Coolant Tank Replacement, 986 / 987 (1997-08). Canonical Tier-B how-to for Boxster and Cayman variants with parallel failure-mode framing including coolant-tank-design critique and pre-purchase yellowing-and-cracking signal description. Tier B.
https://www.pelicanparts.com/techarticles/Boxster_Tech/33-WATER-Coolant_Tank/33-WATER-Coolant_Tank.htm

[3] Pelican Parts — Porsche 997.2 Coolant Reservoir Tank Replacement. Tier-B how-to specific to the 997.2 application; opens with framing that the tank wears out and requires replacement. Tier B.
https://www.pelicanparts.com/techarticles/Porsche_997/Coolant_Reservoir_Tank_Replacement/Coolant_Reservoir_Tank_Replacement.htm

[4] Shark Werks — Is your 996 Coolant leaking? Could be your coolant expansion tank. Tier-B specialist editorial framing the tank as a leading coolant-leak source on the entire water-cooled 996/997 lineup including 996 TT, 997 TT, GT2, GT3, GT3 RS, GT2 RS variants. Tier B.
https://www.sharkwerks.com/tech-articles/is-your-996-coolant-leaking-could-be-your-coolant-expansion-tank

[5] Shark Werks — Porsche Genuine Coolant Expansion Tank and Cap product page. Tier-B specialist parts vendor with editorial framing of yellowing/discolouration as ageing signal and Genuine-over-aftermarket recommendation. Tier B.
https://www.sharkwerks.com/maintenance/p288397-porsche-genuine-coolant-expansion-tank-and-cap-coolexp

[6] Lufteknic — Coolant expansion tank Porsche 911 996 / 997 product page. Tier-B specialist parts vendor with failure-mechanism description (heat, age, exposure) and yellowing-as-ageing-signal framing across 986/996/997/987 applications. Tier B.
https://lufteknic.myshopify.com/products/coolant-expansion-tank-porsche-911-996-997-99610615704

[7] Suncoast Porsche Parts — Coolant Reservoir Tank product page (Genuine Porsche, fits 2001–2012 Carrera, 2001–2012 Turbo/GT2, 2006–2012 GT3/RS/RS 4.0). Tier-B parts vendor reference for OEM tank pricing on the 996.2/997 sport-car population; framed as the latest-version factory replacement. Tier B.
https://www.suncoastparts.com/product/99610615703.html

[7a] Suncoast Porsche Parts — Coolant Reservoir 1998-2000 Carrera product page (early 996.1 Carrera-only SKU). Tier-B parts vendor reference confirming the early-996 SKU split from the 2001+ shared SKU; supports the band's upper edge for the early-996 application. Tier B.
https://www.suncoastparts.com/product/SKU996RSRVR.html

[8] LN Engineering — Water Pump Kits for Porsche Boxster, Cayman, and 911 Models. Canonical Tier-B service-interval guidance (4–6 years / 50–75k miles); composite-over-metal impeller recommendation with explicit catastrophic-block-scoring framing on metal-impeller failures; bundled service-kit pricing. Tier B.
https://lnengineering.com/products/diy-bundles-kits/porsche-water-pump-kits.html

[9] Flat 6 Innovations — What happens when your water pump fails? Tier-B specialist editorial on the impeller-fragmentation downstream pathway with explicit cylinder-head-cracking framing; bearing-failure secondary pathway; composite-vs-metal impeller analysis. Tier B.
https://flat6innovations.com/what-happens-when-your-water-pump-fails/

[10] FCP Euro — Porsche 996 911 Metal Impeller Water Pump Kit Symptoms And Product Review. Tier-B failure-mode discussion and product-line review; documents impeller-fragmentation-clogging-cooling-passages mechanism; recommends every 3-year preventive replacement. Tier B.
https://www.fcpeuro.com/blog/porsche-996-911-metal-impeller-water-pump-kit-symptoms-review

[11] FCP Euro — How To Replace A Porsche 996 911 Water Pump & Thermostat. Tier-B procedural reference with M96-engine-cooling-system architecture framing; thermal-cycling-driven impeller-blade-failure mechanism. Tier B.
https://www.fcpeuro.com/blog/how-to-replace-a-porsche-996-911-water-pump-thermostat

[12] Pelican Parts — Porsche 911 Carrera Water Pump and Thermostat Replacement, 996 (1998-2005) and 997 (2005-2012). Canonical Tier-B how-to with step-by-step procedure, parts-list, low-temperature-thermostat recommendation (LN Engineering 160°F unit), and metal-impeller-failure-mode commenter discussion. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/34-WATER-Water_Pump_and_Thermostat_Replacement/34-WATER-Water_Pump_and_Thermostat_Replacement.htm

[13] FCP Euro — Porsche 911 Water Pump Parts catalogue. Tier-B parts-vendor product matrix differentiating composite-impeller and metal-impeller water pumps across 996/997 applications. Tier B.
https://www.fcpeuro.com/Porsche-parts/911/Water-Pump/

[14] FCP Euro — Porsche 996 911 buyer-guide editorial. Tier-B platform-overview discussion that places water-pump-impeller-failure alongside IMS bearing and bore scoring as core M96 maintenance items requiring schedule-driven replacement. Tier B.
https://www.fcpeuro.com/Porsche-parts/996-911/

[15] Pelican Parts — Porsche 911 Carrera Radiator and Fan Replacement, 996 (1998-2005) and 997 (2005-2012). Canonical Tier-B how-to with explicit debris-accumulation-causes-corrosion editorial framing, annual-cleaning recommendation, and resistor-pack ancillary failure note. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/32-WATER-Radiator_and_Fan_Replacement/32-WATER-Radiator_and_Fan_Replacement.htm

[16] Pelican Parts — Porsche Boxster Radiator Replacement and Cleaning, 986 / 987 (1997-08). Canonical Tier-B how-to for Boxster and Cayman variants with parallel debris-and-corrosion framing and resistor-pack note. Tier B.
https://www.pelicanparts.com/techarticles/Boxster_Tech/32-WATER-Main_Radiator/32-WATER-Main_Radiator.htm

[17] Pelican Parts — Porsche 911 Carrera Coolant Hose Replacement, 996 (1998-2005) and 997 (2005-2012). Canonical Tier-B parallel reference for cooling-system-hose service co-occurring with radiator/condenser replacement; comprehensive hose-location matrix. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/30-WATER-Coolant_Hose_Replacement/30-WATER-Coolant_Hose_Replacement.htm

[18] Pelican Parts — Porsche 911 Carrera Center Radiator Installation, 996/997. Tier-B procedural reference for the centre-radiator retrofit option that can be bundled with front-cooling-system service. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/31-WATER-Installing_a_Center_Radiator/31-WATER-Installing_a_Center_Radiator.htm

[19] Go-Parts — Porsche 911, Boxster & Cayman A/C Condenser Failures (2001-2013): A Buyer's Guide. Tier-B specialist parts vendor long-form buyer guide with explicit failure-mechanism description (leaves/dirt/salt accumulation between condensers and main radiators causing moisture-trapping corrosion, road-debris-impact secondary mechanism), four-to-five-year early-failure framing, pair-replacement and receiver/drier-replacement recommendations. Tier B.
https://www.go-parts.com/garage/a-c-condenser-porsche-911-porsche-boxster-porsche-cayman-2001-2013

[20] Pelican Parts — Porsche 911 Carrera Coolant Flush, 996/997. Tier-B reference with cooling-system-additive discussion, pH chemistry framing, and clamp part-number list bundled with full cooling-system service events; coolant-cap supersession part number. Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/29-WATER-Coolant_Flush/29-WATER-Coolant_Flush.htm

[21] Suncoast Porsche Parts — Updated Coolant Pipe (Genuine Porsche SKU 94810606910) catalogue listing. Tier-B parts vendor reference confirming the Porsche-superseded aluminium replacement part for 2008–2010 Cayenne S and Turbo applications; product description confirms the failure-mode characterisation as a commonly-replaced part. Tier B.
https://www.suncoastparts.com/product/94810606910.html

[22] Suncoast Porsche Parts — Cayenne V8 Coolant Pipe Upgrade/Repair Kit SKU PKCAYPIPE catalogue listing. Tier-B parts vendor reference for the parallel 955-generation valley-pipe kit; included for cross-reference clarity (this kit is for the 955 generation covered in file 06 record 1, NOT the 957 covered in this file's Record 4). Tier B.
https://www.suncoastparts.com/product/PKCAYPIPE.html

[23] Europa Parts — Porsche Coolant Pipe (Cayenne 957 V8) 94810606910 by OE Supplier. Tier-B specialist parts vendor confirming 2008–2010 Cayenne 4.8L V8 fitment for the updated-pipe SKU. Tier B.
https://www.europaparts.com/coolant-pipe-94810606910.html

[24] Design 911 — Porsche Cayenne MkII (957) 4x4 Water / Coolant Hoses catalogue. Tier-B specialist parts vendor with Cayenne 957 application matrix covering Cayenne S/GTS 4.8L and Cayenne Turbo/Turbo S 4.8L (2007–10) cooling-system parts; framing of cooling-system pipe and hose ageing on older Porsche models. Tier B.
https://www.design911.com/porsche/cayenne-mkii--957--4x4/water---coolant-hoses/

[25] Fifth Gear Automotive — Porsche Cayenne V8 Coolant Pipe Update. Tier-B specialist editorial on the Cayenne V8 plastic-coolant-pipe pattern; primary scope is the 955 generation (referenced in file 06 record 1) but framing of plastic-to-aluminium supersession as canonical remedy applies across the V8 Cayenne population. Tier B.
https://fifthgear.biz/fifthgear-blog/porsche-cayenne-v8-coolant-pipe-update/

[26] CSF Race × 928 International — World Exclusive High-Performance Cooling for All Porsche 928 Models press release. Tier-B specialist editorial (CSF Race) on the world-exclusive aluminium radiator with engineering-positioning framing (B-Tube technology, multi-louvered fins, two integral oil coolers); confirms OEM radiator pricing above $2,000 and frames the aftermarket alternative as a fraction of OEM cost. Tier B.
https://news.csfrace.com/world-exclusive-high-performance-cooling-for-all-porsche-928-models/

[27] 928 Motorsports — All-Aluminum Replacement Radiator for the Porsche 928 product page. Tier-B specialist editorial with engineering-positioning framing (nine fitment SKUs by year/transmission/oil-cooler configuration, 7% cooler than other flux-bonded aluminium cores, 15% cooler than copper or brass, TIG-welded all-aluminium construction, 20-psi rated); explicit framing of OEM plastic end-tank failure pathway as the primary OEM-supersession benefit. Tier B.
https://928motorsports.com/parts/alumradiator.php

[28] AlliSport UK — AS95 Porsche 928 alloy radiator for cars with single fan product page. Tier-B specialist editorial with engineering-positioning framing (controlled atmosphere brazed cores, 19 FPI optimum cooling, hand-built TIG-welded construction, 30-psi tested, optional integral oil coolers via CNC-machined threaded connections); compatible with original plastic fan cowl. Tier B.
https://www.allisport.com/shop/performance-products/alloy-radiators/porsche-928-alloy-radiator-for-cars-with-single-fan/

[29] 928sRus — CSF Two Cooler Universal Aluminum Radiator product page. Tier-B specialist parts vendor distributing the CSF 928 radiator alongside the 928 International exclusive distribution channel; fitment confirmation across all 928 production years. Tier B.
https://928srus.com/products/928-106-043-csf-two-cooler-universal-aluminum-radiator-csf

[30] Pelican Parts — Porsche 928 (1978-1995) Water Cooling System Radiators catalogue. Tier-B parts vendor application matrix across all 928 production years, trims (Coupe, GT, GTS, S, S4), and integral-oil-cooler configurations; coolant-and-additive product range; cooling-system component cross-reference. Tier B.
https://www.pelicanparts.com/catalog/SuperCat/928M/POR_928M_WATRAD_pg1.htm

[31] Pelican Parts — Porsche 928 Coolant Expansion Tanks and Parts catalogue. Tier-B parts vendor application matrix for coolant-expansion-tank replacement; editorial framing of replacement-when-cracked or replacement-when-internal-corrosion-visible. Tier B.
https://www.pelicanparts.com/cat/r_928m/watrad_coolant-expansion-tanks-and-parts

[32] Rennlist 928 How-To — Porsche 928: How to Replace Radiator. Tier-B canonical procedural reference (note: hosted on Rennlist forum domain but authored as a structured how-to article rather than a forum thread; the catalogue treats Rennlist's how-to vertical as Tier-B procedural reference parallel to Pelican Parts how-to status — flagged for v2 schema-extension adjudication on tier classification of named-specialist or editorial-team-authored guides hosted on forum-platform domains); explicit framing of the radiator as one of the most-commonly-replaced parts on the 928. Tier B (caveated).
https://rennlist.com/how-tos/a/porsche-928-how-to-replace-radiator-377472

[33] C/G/J Inc — POR 0928 Aluminum Porsche 928 Radiator product page. Tier-B specialist parts vendor with American-made aluminium radiator (1979–1985 application); controlled-atmosphere-brazed epoxy-free core construction; specific dimensional fitment data. Tier B.
https://cgj.com/product/por-0928-aluminum-porsche-928-radiator

[34] 928-944parts — Porsche 928 aluminum radiator from 1987 (S4) product page. Tier-B European specialist parts vendor with aluminium radiator for S4 application (1987 onward) including integral oil cooler for engine and automatic gearbox. Tier B.
https://928-944parts.com/en/products/porsche-928-aluminum-radiator-from1987-s4

[35] John Pirtle's 928 Service guide hosted on Rennlist members domain — Coolant Flush procedure. Tier-B canonical specialist-authored procedural reference with explicit yearly-coolant-change-interval recommendation, aluminium-friendly-coolant requirement, distilled-water requirement, parallel-replacement bundling guidance for hoses / heater valve / radiator cap, and S4-specific cooling-flap operational test (note: hosted on members.rennlist.com forum-platform domain but authored as a structured named-specialist procedural reference — flagged for v2 schema-extension adjudication on tier classification of named-specialist-authored guides on forum-platform domains, parallel to source [32]). Tier B (caveated).
https://members.rennlist.com/pirtle/svc_coolant.html

### Tier C — Forums, named-individual community contributions, and aggregator sites without primary Porsche-specialist sourcing (consistency footnote only; never sole source for cost or prevalence)

[36] Rennlist 996 forum — Coolant Expansion Tank thread. Tier-C consistency: owner-purchased aftermarket tank failure within eleven months, return to Genuine Porsche, specialist-tank pricing capture; Pelican-Parts representative confirms the cheapest-SKU return rate for cross-reference. Tier C.
https://rennlist.com/forums/996-forum/963432-coolant-expansion-tank.html

[37] Pelican Parts forum — Coolant System thread (cap-tightening / overflow case captures). Tier-C consistency on owner-experience cap and tank failure modes adjacent to the seam-cracking primary. Tier C.
https://forums.pelicanparts.com/porsche-996-997-991-forum/498457-coolant-system.html

[38] Rennlist 997 forum — Water Pump Replacement thread. Tier-C consistency: owner roadside-seizure case capture ($1,250 specialist replacement on a 2009 C4S in the Florida Keys), part-number list with Pierburg-OEM pricing capture, composite-vs-metal impeller debate. Tier C.
https://rennlist.com/forums/997-forum/1265158-water-pump-replacement.html

[39] Planet-9 — Probable water pump failure, sanity check and parts advice. Tier-C consistency: DIY parts-list capture (Pierburg pump $282, Wahler thermostat $50), preventive-replacement-with-pulleys discussion, bearing-failure case capture documenting hose-and-line splitting at the same service event. Tier C.
https://www.planet-9.com/threads/probable-water-pump-failure-sanity-check-and-parts-advice.229177/

[40] Grassroots Motorsports Forum — Porsche PSA: Clean your radiators thread. Tier-C consistency: 996 owner case capture documenting bottom-of-radiator debris findings on a single-owner inspection event; corroborating 987 Cayman case capture from second contributor. Tier C.
https://grassrootsmotorsports.com/forum/grm/porsche-psa-clean-your-radiators/141095/

[41] 6SpeedOnline Cayenne 955-957 forum — Cayenne 957 - Coolant Pipe Issue - Water Distributor thread. Tier-C originating community thread that surfaced the under-intake-pipe aluminium-upgrade pattern with NHTSA-complaint cross-references and full part-number breakdown for both the rear coolant manifold (water distributor SKU 94810606106 / 94810606104, gaskets 94810615401) and the under-intake pipe (94810606910 with vent line 94810602604); page 5 of the same thread captures a 2008 S barb-separation event with NHTSA contact-attempt and JB-Weld-then-re-leak case sequence. Applicability confirmation across all 957 V8 4.8L DFI variants (S, GTS, Turbo, Turbo S). Tier C.
https://www.6speedonline.com/forums/cayenne-955-957/345323-cayenne-957-coolant-pipe-issue-water-distributor.html

[42] Rennlist Cayenne 955-957 forum — Coolant temperature sensor replacement and other goodies thread. Tier-C DIY case capture documenting the rear-of-engine access procedure (intake manifold removal, rear-wiring-harness-bracket removal, E10-bolt access points) on a 957 GTS 4.8L; useful for buyers evaluating DIY-vs-specialist economics on the bundled service event. Tier C.
https://rennlist.com/forums/cayenne-955-957-2003-2010/1229929-coolant-temperature-sensor-replacement-and-other-goodies.html

[42a] Rennlist Cayenne 955-957 forum — Coolant pipe kit for 2009 GTS thread. Tier-C specialist counter-position commentary (slavie, September 2022) explicitly characterising the 957 plastic Y-pipe as not-really-failure-prone in the field with the aluminium supersession framed as Porsche's precautionary release; same thread identifies the rear coolant manifold with glued-in barb fitting as the actual 957 cooling-system failure point ("the only issue with the coolant system can be the coolant manifold on the back of the engine. The pipe is glued in"), with the threaded-fitting design as the permanent-fix supersession requiring engine-out work. Tier C.
https://rennlist.com/forums/cayenne-955-957-2003-2010/1318618-coolant-pipe-kit-for-2009-gts.html

[42b] Rennlist Cayenne 955-957 forum — Coolant pipe leaks on 957 under manifolds latest parts, status, etc? thread. Tier-C contributor case capture (2009 Turbo S, six years of intermittent coolant smell) attributing most field-reported under-manifold coolant losses on 957 V8 cars to single O-ring or thermostat-housing-seal leaks rather than plastic-pipe failure; reinforces specialist counter-position that the under-intake plastic Y-pipe is rarely the actual leak source. Tier C.
https://rennlist.com/forums/cayenne-955-957-2003-2010/1133314-coolant-pipe-leaks-on-957-under-manifolds-latest-parts-status-etc.html

[42c] Rennlist Cayenne 955-957 forum — Class Action lawsuit over glued coolant pipes thread. Tier-C cross-generation context capturing the parallel class-action filing for the Cayenne 958 generation glued-fitting failure with explicit reference to the same family of failures across early 996 Turbo and GT3 epoxied-fitting cars; Tier-C specialist framing of the parallel mechanism as catastrophic-when-it-occurs; thread documents the 957's specific glued-fitting situation and the absence of Tier-A coverage as a recurring buyer-due-diligence concern. Tier C.
https://rennlist.com/forums/cayenne-955-957-2003-2010/1182425-class-action-lawsuit-over-glued-coolant-pipes.html

[42d] Rennlist Cayenne 955-957 forum — Cayenne Coolant Leak at rear of engine thread. Tier-C 2006 CS-Ti owner case capture documenting two-year coolant-smell diagnosis ending with rear-manifold blind-plug leak, with the manifold replaced without engine removal as a specialist-with-experience exception case; useful editorial counterpoint to the typical engine-out framing. Tier C.
https://rennlist.com/forums/cayenne-955-957-2003-2010/759282-cayenne-coolant-leak-at-rear-of-engine.html

[43] Rennlist 928 forum — Coolant Drain/Change Procedure with photos thread. Tier-C consistency: DIY photo-walkthrough of the drain procedure on an S4 application; G-05 coolant recommendation in commenter discussion; framing of the 928 cooling system as a self-bleeding system without manual burping required. Tier C.
https://rennlist.com/forums/928-forum/505835-coolant-drain-change-procedure-w-pics.html
