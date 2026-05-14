# File 25 — Region-Specific Issues

**content_status:** draft
**File ID:** 25
**Section:** Section 10, Part 1 — Regional and Market-Specific Inspection Overlays
**Last updated:** 2026-05-07
**Record count:** 3
**Preceding file:** 24 (928 + Transaxle Non-Engine Systems)
**Following file:** 26 (Halo Models — 959 / Carrera GT / 918)

---

## Scope

Inspection priorities and failure modes that are materially elevated or altered by the vehicle's operating region, storage climate, or registration market. Records here are buyer-inspection overlays on top of the universal defect catalog — they answer "what additional checks does this car's history require?" based on where it has lived or how it is registered.

Records in this file are framed as inspection priorities, not universal defect rates. The same car in Arizona presents a different inspection profile than the same car in Ohio or Norway.

**Out of scope:** Defects universal regardless of region (already in Files 01–24). Modification risk from aftermarket parts — File 22 covers cat-delete and ECU tune consequences; this file covers the regional compliance layer those modifications interact with.

**Schema note:** Standard defect schema with an additional `region` field in `applicability` identifying the geographic or market scope. `applicability.generations` set to `all` where the regional factor is platform-agnostic; generation-specific notes appear in `year_range_note`.

---

## Declined Candidates

| # | Candidate | Verdict | Reason |
|---|---|---|---|
| D | Coastal / salt-air corrosion | **Declined** | Searched 9WERKS specialist article, 911uk.com sill corrosion thread, and Classic & Sports Car G-body buyer guide for failure modes or inspection methodology specific to coastal salt-air exposure. The 9WERKS article references coastal residence without identifying failure locations distinct from road-salt cases; one 911uk.com contributor explicitly notes "grimsby is by the sea but I don't think salt air is the main cause" while describing the same sill locations. No Tier B found establishing a distinct coastal inspection pattern separate from REGION_25_001. |
| E | Hot-climate / desert UV and heat cycling | **Declined** | Searched 9WERKS, Hagerty G-series guide, Stuttcars buyer guides, and PCA Tech for distinct hot-climate Porsche defect patterns. No Tier B found establishing a regional defect category beyond general age acceleration. Dashboard UV cracking is already covered as a near-universal condition in AIRCOOLED_23_002; rubber seal and hose degradation in heat climates is an age-rate modifier, not a distinct defect. |
| F | Additional candidates — sunroof drain rust; track/motorsport-registered cars | **Declined** | Sunroof drain rust: addressed as an inspection sub-point within REGION_25_001 (specifically called out in Classic & Sports Car buyer guide as a known failure location). No Tier B establishes a separate record-worthy defect pattern distinct from the broader salt-belt underbody record. Track/motorsport cars: no Tier B regional defect pattern found; documentation and modification history flags for track-prepared cars belong to File 14 (documentation red flags) scope. |

---

## Record TOC

| Record ID | Title | Severity | Region |
|---|---|---|---|
| REGION_25_001 | Pre-996 Air-Cooled 911 Salt-Belt Underbody and Structural Corrosion | high | Salt-belt: US Midwest/Northeast, Canada, Northern Europe |
| REGION_25_002 | California CARB Emissions Compliance — Modified Water-Cooled Porsches | moderate | California (and CARB-mandate states) |
| REGION_25_003 | Import and Grey-Market Compliance — European and ROW-Spec Porsches | moderate | All US markets (import from non-US-spec markets) |

---

## Editorial Constraints

- Regional framing throughout: "buyers evaluating a car from X region should prioritize Y" — not "all cars from X region have failed"
- Cross-reference existing records rather than duplicating: File 22 covers ECU tune and cat-delete consequences; File 14 covers documentation red flags; AIRCOOLED_23_002 covers dashboard UV cracking
- `evidence_basis` per locked conventions
- Every numeric claim requires `_source_anchor`
- Generation keys per locked conventions

---

## Records

---

```yaml
id: REGION_25_001
flag_title: "Pre-996 Air-Cooled 911 Salt-Belt Underbody and Structural Corrosion"
severity: high
description: >
  Pre-996 air-cooled 911s built before Porsche's full hot-dip galvanization program
  (introduced 1975–1977) are structurally vulnerable to salt-accelerated corrosion
  that can reach load-bearing structural elements including sills, floor pans, and
  torsion tube housings. Even post-1976 cars are now 50+ years old; zinc is sacrificial
  and depletes over decades of salt exposure. Visible rust is a late-stage indicator —
  by the time blistering appears, underlying damage is typically significant. A
  specialist pre-purchase inspection on a lift is required for any salt-belt car.
applicability:
  generation:
    - "911-f-body"
    - "g-series-2.7"
    - "911-sc"
    - "911-3.2-carrera"
    - "930"
    - "964"
    - "993"
  year_range: [1963, 1998]
buyer_questions:
  - "Where has this car spent its life? Has it been used in winter conditions or in a salt-belt region?"
  - "Is there documentation of an underbody restoration or rust prevention treatment?"
  - "Has the car had a full underbody inspection on a lift as part of its recent service history?"
  - "Is there documented metalwork in the car's history — and if so, by whom and when?"
```

**Applicability**

```yaml
applicability:
  generations:
    - "911-f-body"
    - "g-series-2.7"
    - "911-sc"
    - "911-3.2-carrera"
    - "930"
    - "964"
    - "993"
  region: "Salt-belt regions: US Midwest and Northeast (Ohio, Michigan, Illinois, Pennsylvania,
    New York, New England states), Canada, UK, Northern Europe (Germany, Scandinavia,
    Netherlands, Belgium). Elevated risk on any car with undocumented winter-use history
    in these regions."
  year_range: "1963–1998"
  year_range_note: >
    Corrosion risk varies significantly by production year and relates directly to Porsche's
    galvanization history:

    - F-body (1963–1973): No meaningful galvanization. Porsche Newsroom confirms cavity
      preservation measures began in 1969; no hot-dip galvanization until 1975. These cars
      are the highest corrosion risk. Even limited salt exposure over 50+ years can produce
      structural damage.
    - G-body early (1974–1975): Partial galvanization — floorpan and underbody galvanized
      from 1975 (Porsche Newsroom), but full-body hot-dip galvanization was not yet applied
      to the complete shell. Higher corrosion risk than post-1976 cars.
    - G-body mid (1976–1977 and forward): Full-body galvanization introduced. MY1976
      production (beginning fall 1975) applied galvanization to the full shell excluding
      the roof; MY1977 production added the roof. Six-year corrosion warranty introduced
      MY1976; extended to seven years (1981) and ten years (1986) per Porsche AG.
      Significantly better than pre-1976 but not immune — zinc is sacrificial and depletes
      over time.
    - 964 (1989–1994): Plastic fender liners added. Pre-1992 upper body corrosion remains
      a known concern per specialist inspectors.
    - 993 (1994–1998): Corrosion protection broadly sorted. Body rust on 993s is
      typically secondary to accident repair rather than age.
  excludes:
    - "996 and later water-cooled era — water-cooled 911s broadly do not suffer structural
      body corrosion from age; mechanical corrosion (brake lines, coolant pipes, rotors)
      is the concern on stored or lightly-used water-cooled cars"
    - "Desert/Sun Belt cars with documented single-owner provenance and no salt exposure —
      this record is a regional inspection overlay, not a universal claim"
```

**Description**

Pre-996 air-cooled 911s built before Porsche's full hot-dip galvanization program (introduced 1975–1977) are structurally vulnerable to salt-accelerated corrosion that can reach load-bearing structural elements. Even post-1976 cars — which carry the zinc coating — are now 50+ years old, and zinc is a sacrificial element that depletes over decades of salt exposure, wet storage, and crevice moisture accumulation.

The failure mechanism: road salt deposits accumulate in body seams, crevices, and hollow sections. The salt draws moisture and holds it, creating a corrosion-accelerating sponge effect. Water under driving pressure is forced into wheel arch joints and underbody seams, reaching areas not visible during casual inspection. The result is corrosion that can be extensive by the time any surface evidence appears. Specialists consistently warn that visible rust is a late-stage indicator — by the time blistering is visible, underlying damage is typically already significant.

**Primary failure locations on pre-996 911s** (per Classic & Sports Car buyer guide and 9WERKS specialist):
- Sills and inner sill structure (the "kidney bowl" panels running from the rear of the sills into the rear wheel arches)
- Floor pans (front and rear)
- Rear seat pans
- Screen corners (windshield surround and rear window surround)
- Battery tray and surrounding area in the front luggage compartment
- A-posts, B-posts
- Front wing/fender attachment points
- Torsion tube where it passes through the chassis legs
- Sunroof drain channels and screen pillars on sunroof cars
- Fuel tank (on early F-body cars especially)
- Heat exchangers and exhaust-adjacent areas

Because many G-body and F-body 911s in circulation have had at least one restoration, the risk extends to failed or patched prior repairs where secondary rust is now appearing at weld joins. A properly restored car with documented metalwork is significantly lower risk than a "cosmetically clean" car of unknown history.

**Evidence Basis**

```yaml
evidence_basis: specialist_single_source
tier_a:
  - source: "Porsche Newsroom — '50 Years of the Porsche 911 G-Series' official press kit
      (newsroom.porsche.com)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Porsche AG confirms: from 1975, body and floorpan made of hot-dip galvanised
      sheet metal (corresponding to MY1976 production, which began fall 1975); six-year
      corrosion warranty introduced MY1976; extended to seven years (1981 models) and
      ten years (1986 models). Note: Newsroom states 'body and floorpan' for 1975
      production — this corresponds to the full body (excluding roof) galvanization that
      9WERKS documents for the 1976 production year, reflecting the MY vs. calendar-year
      offset. The roof was added in 1977 production."
  - source: "PCA Tech Q&A — 'Air-Cooled 911s on a Budget 1974–1977' (pca.org)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "PCA confirms: 1976 saw complete galvanization for superior rust protection.
      'Complete' in PCA context refers to main body panels (per Porsche's own six-year
      warranty introduction at this point); the roof panel was added in 1977 per 9WERKS
      specialist source. Consistent with Newsroom dating once MY/calendar-year offset
      is applied."
tier_b:
  - source: "9WERKS — 'How to Check a Porsche 911 for Corrosion' (9werks.co.uk)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Specialist article with named Wrightune specialist Chris. Documents the
      full failure mechanism (road salt → crevice sponge → sustained moisture → corrosion),
      specific failure locations, and the specialist view that pre-996 body corrosion
      and post-996 mechanical corrosion represent distinct risk profiles. States that
      once rust is visible, the visible surface is only the beginning and that proper
      repair of one corner typically requires whole panel replacement. Documents the
      1976 full-body (minus roof) and 1977 full-body galvanization transition specifically."
tier_c:
  - source: "Classic & Sports Car — Porsche 911 (1974–89) Buyer's Guide
      (classicandsportscar.com) [reclassified from Tier B: general classic car magazine,
      not a Porsche-dedicated specialist publication]"
    notes: "Describes rust as the buyer's biggest challenge on all 911s through to 1989
      despite galvanization. Lists specific failure locations in detail: sills, kidney
      bowls, A-posts, B-posts, front boot floor, battery tray, floor pans, rear seat
      pans, torsion tube. Notes most UK 911s of this era have had at least one
      restoration already. Confirms sunroof drain → screen pillar rot on sunroof cars."
  - source: "Hagerty G-Series 911 Buyer's Guide (hagerty.com) [reclassified from Tier B:
      insurance/valuation company editorial, not a specialist shop or dedicated
      Porsche publication]"
    notes: "Advises looking carefully for rust, especially on earlier models that lacked
      the extensive galvanizing treatment of later cars. Lists battery tray, luggage
      compartment corners, sunroof drains, and windshield areas as specific inspection
      points."
  - source: "PorscheInspections.com — model-specific inspection notes (porscheinspections.com)"
    notes: "Notes pre-1992 964 upper body corrosion as a specific concern. Confirms
      early G-body (915 gearbox cars) are more prone to corrosion than later examples."
  - source: "Rennlist — galvanization thread, multiple contributors citing Paul Frere's
      Porsche 911 Story"
    notes: "Paul Frere (Porsche 911 Story, pg. 201) states that from 1976 the entire body
      was assembled from zinc-coated sheet, and that Porsche was the first manufacturer
      worldwide to offer such comprehensive rust protection. Corroborates the Newsroom
      and 9WERKS timeline."
```

**Cost Estimate**

```yaml
cost_estimate:
  cost_note: >
    Structural corrosion repair on air-cooled 911s is among the most variable and
    potentially extreme repair costs in the catalog. Specialists describe repair as
    escalating significantly once metalwork is stripped — a single corroded corner can
    require replacement of adjacent panels, sill, and window surround integration, not
    just the visible surface. On heavily corroded project-grade G-body cars, full
    restoration can exceed the pre-repair market value of the vehicle.
    No specific numeric cost range is confirmed to a verifiable Tier B source anchor
    at time of authoring. Omitting numeric fields. Buyers should request specialist
    estimates on any car showing rust evidence before committing to purchase.
  currency: "usd_gbp_variable"
```

**Buyer Questions**

- Where has this car spent its life? Has it been used in winter conditions or in a salt-belt region?
- Is there documentation of an underbody restoration or rust prevention treatment?
- Has the car had a full underbody inspection on a lift as part of its recent service history?
- On sunroof cars: have the roof drains been inspected and cleared recently?
- Is there documented metalwork in the car's history — and if so, by whom and when?
- For G-body cars: was this car a US-spec or European-spec example? (Euro cars with documented provenance may have spent less time in salt conditions.)

**Inspection Notes**

A pre-purchase inspection for any pre-996 air-cooled 911 from a salt-belt region should be conducted on a lift by a specialist with air-cooled 911 body expertise — not a general mechanic and not a visual-only inspection from below.

**Specific locations to probe:** Insert a screwdriver or pick tool into the rear sill seams and kidney bowl area — solid metal should feel hard; rust-softened metal will yield or puncture. Pull back trunk carpet in the front luggage compartment and press the floor around the battery tray and lower corners. Check the torsion tube access points for corrosion on the chassis legs. Inspect the inner lower corners of the windshield surround and rear window surround for rust blistering under trim or rubber. On sunroof cars, check the screen pillars carefully — blocked drains cause rot there specifically.

**Signs of past repair to scrutinize:** Fresh underseal sprayed over the underbody (a classic concealment technique), mismatched panel gaps, paint overspray in the wheel arches or under the front trunk lid, panel texture differences between sections of the sill.

A car with no visible rust from a salt-belt region without documented restoration should be treated as a higher-risk purchase than the same car from a dry-climate state with no salt exposure. Provenance matters enormously on these platforms.

**Cross-References**

- **File 03 — Engine (Air-Cooled 911).** Engine-adjacent: on F-body and early G-body cars, the magnesium crankcase and Nikasil-lined cylinders are distinct high-risk items. Corrosion risk on the body does not indicate corrosion-free mechanicals — inspect both tracks independently.
- **AIRCOOLED_23_002 — Air-Cooled 911 Dashboard Cracking.** UV/heat cracking on the dashboard is the other primary condition-indicator on these cars; assess both underbody and interior condition together.
- **File 14 — Title / Mileage / Accident History.** A salt-belt car with a clean underbody but gap inconsistencies or paint overspray may indicate a cosmetic restoration that concealed prior structural rust repair.

---

```yaml
id: REGION_25_002
flag_title: "California CARB Emissions Compliance — Modified Water-Cooled Porsches"
severity: moderate
description: >
  California-registered water-cooled Porsches with aftermarket emissions modifications face
  three compliance risks: non-CARB-EO catalytic converters fail smog visual inspection;
  ECU/DME tunes without a CARB Executive Order number trigger CVN checksum failure (enforced
  since July 2021); OBD-II readiness monitors not set after battery work or ECU reflash
  require a specific drive cycle before the smog check can pass. Applies equally in
  CARB-mandate states that follow California standards. Fully stock cars are not
  materially affected.
applicability:
  generation:
    - "996.1"
    - "996.2"
    - "997.1"
    - "997.2"
    - "991.1"
    - "991.2"
    - "992.1"
    - "992.2"
    - "987.1"
    - "987.2"
    - "981"
    - "718"
  year_range: [1996, 2030]
buyer_questions:
  - "Is the car registered in California or a CARB-mandate state?"
  - "Has the car had any aftermarket emissions modifications: catalytic converters, exhaust, or ECU/DME tune?"
  - "Are aftermarket cats CARB EO-numbered (look for the EO label on the cat heat shield)?"
  - "Has the car passed its most recent smog check? When, and at what type of station (standard or STAR)?"
  - "If tuned: does the tune have a CARB Executive Order number?"
  - "Has the car had a battery disconnect, ECU reflash, or extended storage period recently?"
```

**Applicability**

```yaml
applicability:
  generations:
    - "996.1"
    - "996.2"
    - "997.1"
    - "997.2"
    - "991.1"
    - "991.2"
    - "992.1"
    - "992.2"
    - "986"
    - "987.1"
    - "987.2"
    - "981"
    - "718"
    - "cayenne_955"
    - "cayenne_957"
    - "cayenne_958"
    - "cayenne_9Y0"
    - "970"
    - "971"
    - "macan_95B"
  region: "California, and CARB-mandate states that follow California emissions standards
    (currently: Colorado, Connecticut, Delaware, Maine, Maryland, Massachusetts, Minnesota,
    New Jersey, New Mexico, New York, Oregon, Pennsylvania, Rhode Island, Vermont,
    Virginia, Washington). Also applies to out-of-state buyers registering a California-titled
    modified car in a CARB-mandate state."
  year_range: "1996–present"
  year_range_note: >
    OBD-II applies to all gasoline vehicles MY1996 and later. California smog check
    biennial requirement applies to 1998-and-newer gasoline vehicles. The July 2021
    CVN checksum ECU verification applies to all OBD-II vehicles (1996+). Pre-OBD-II
    cars (1995 and earlier) are subject to different smog testing protocols and are
    not covered by this record.
  excludes:
    - "Pre-OBD-II cars (1995 and earlier) — different test protocols apply"
    - "Cars registered in non-CARB states with no California history — this record is
      a regional inspection overlay for California-registered or California-history cars"
    - "Fully stock cars with no aftermarket emissions modifications — standard smog check
      is routine and not an elevated inspection concern"
```

**Description**

California operates the most stringent vehicle emissions compliance program in the US under the California Air Resources Board (CARB). For water-cooled Porsche buyers, three distinct compliance risks apply:

**1 — Non-CARB aftermarket catalytic converters.** Aftermarket catalysts require a CARB Executive Order (EO) number to be legal in California. Non-EO cats will fail the visual inspection component of a smog check, particularly at STAR stations (which conduct full visual inspections in addition to the OBD-II readiness check). Sourcing OEM-spec or CARB-EO replacement cats for older water-cooled Porsches can be difficult and expensive.

**2 — ECU/DME tuning detected by CVN checksum.** Since July 2021, California smog checks include verification of the engine control module's calibration verification number (CVN) — effectively a checksum of the ECU software. Any deviation from the OEM calibration signature causes a "MODIFIED SOFTWARE" failure. CARB has been collecting CVN data since 2015; the enforcement change in 2021 made this an automatic test failure. Any tune without a CARB EO number is non-compliant. Reverting to stock tune before testing is the common workaround, but the tune-reflash-retune cycle requires 200–300 miles of specific driving to reset OBD-II readiness monitors before the smog check can be passed. Porsche PIWIS can set readiness monitors directly, reducing the drive-cycle requirement.

**3 — OBD-II readiness monitors not set.** After a battery disconnect, ECU reflash, or extended period of inactivity, OBD-II readiness monitors (catalyst, EGR, evap, oxygen sensor) may read "NOT READY." A California smog check requires all monitors to be complete. Previously, one "not ready" monitor was acceptable; this has since been tightened. A car that has been sitting, recently had battery work, or had any ECU work may require a specific drive cycle before it will pass. This is not a modification issue — it affects fully stock cars after certain service events.

**Evidence Basis**

```yaml
evidence_basis: specialist_single_source
tier_a:
  - source: "California Air Resources Board (CARB) — emissions regulations; July 2021
      smog check ECU calibration verification (CVN) rule effective date"
    retrieval_status: not_retrieved_this_session
    notes: "CARB is the Tier A regulatory authority for this record. The July 19, 2021
      rule change was not directly retrieved from CARB's own publications; it is confirmed
      via BRR Performance specialist article citing the Bureau of Automotive Repair's
      official explanation and CARB's ruling text. Classified as Tier A (referenced_only)
      per the schema-extension queue's `tier_a_doc_retrieved: referenced_only` candidate."
tier_b:
  - source: "BRR Performance — 'California Smog Law Change — Legal Options' specialist
      article (brrperformance.com)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Porsche specialist shop (20+ years direct car development and preparation
      experience, focused on Audi, BMW, Porsche). Documents the July 19, 2021 CARB rule
      change in detail, confirms ECM is an emissions control device requiring CARB EO
      number for any modifications, and explains the CVN checksum enforcement mechanism.
      Active specialist resource for California Porsche owners."
tier_c:
  - source: "PCA San Diego Region (SDR) Tech Advisor — forum post on CVN smog check
      (forum.pcasdr.org) [reclassified from Tier B: forum post; PCA regional newsletters
      are Tier A but forum posts by PCA members/officers are Tier C per schema]"
    notes: "PCA Tech Advisor Steve Grosekemper (SDR Tech Advisor/Scrutineer) documents
      California has been collecting CVN data since 2015 and the July 2021 change
      formalized enforcement. Confirms OBD-II scope from January 1, 1996. Advises
      pre-checking CVN at shops with Durametric, Autologic, PST-2, or PIWIS. Tier C
      only; the 'since 2015' data-collection claim is Tier C–sourced pending Tier B
      confirmation."
  - source: "Rennlist 997 forum and 718 Forum — multiple owner accounts of STAR station
      inspections and CA smog experiences"
    notes: "Community corroboration of visual inspection requirements for non-CARB cats,
      OBD-II readiness monitor issues, and the STAR station full visual inspection
      process. Confirms aftermarket intake and cat failures at visual inspection stage."
  - source: "6SpeedOnline 997.2 forum — OBD-II readiness monitor / drive cycle thread"
    notes: "Documents OBD-II 'NOT READY' catalyst status issue on a stock 997.2 after
      extended inactivity; confirms PIWIS as the fastest path to readiness reset."
```

**Cost Estimate**

```yaml
cost_estimate:
  cost_note: >
    Compliance remediation cost depends on the specific violation:
    - Non-CARB cats: OEM or CARB-EO replacement cats are the fix; specialist installation
      required. Specific pricing not confirmed to a Tier B source at authoring time.
    - ECU tune reversal + readiness drive cycle: tune reversion at a specialist shop,
      plus a specific drive cycle (200–300 miles) or PIWIS readiness set at a dealer.
      Specific pricing not confirmed to a Tier B source at authoring time.
    - OBD-II readiness monitors only: drive cycle is typically a no-cost owner activity
      or low-cost dealer PIWIS intervention.
    Numeric cost estimates have been omitted pending confirmed Tier B price anchors.
    Overall remediation cost for a fully modified car (tune + non-CARB cats) is meaningful
    and should be factored into the purchase price negotiation.
  currency: "usd"
```

**Buyer Questions**

- Is the car registered in California or a CARB-mandate state?
- Has the car had any aftermarket emissions modifications: catalytic converters, exhaust, or ECU/DME tune?
- Are aftermarket cats CARB EO-numbered (look for the EO label on the cat heat shield)?
- Has the car passed its most recent smog check? When, and at what type of station (standard or STAR)?
- If tuned: does the tune have a CARB Executive Order number? (Cobb and a small number of other tuners have pursued EO certification for some applications.)
- Has the car had a battery disconnect, ECU reflash, or extended storage period recently? (OBD-II readiness monitors may need reset before smog.)

**Inspection Notes**

For any California-registered water-cooled Porsche, request the most recent smog certificate and check the station type (standard vs. STAR). A STAR station inspection means the car was selected for full visual inspection — confirm it passed clean.

Visually inspect the catalytic converter heat shield for a CARB EO label. If the label is absent and the cat is clearly aftermarket, assume it is non-CARB-compliant until verified otherwise.

For tuned cars: the most reliable pre-purchase check is to plug in a Durametric or similar OBD-II reader and check whether any fault codes are related to emissions monitors, and to ask directly whether the DME has been reflashed. A CVN check by a shop with PIWIS before purchase is the definitive test.

**Cross-References**

- **File 22 — Modifications and Tunes (MODS_22_001, MODS_22_002).** MODS_22_001 covers ECU/DME tune consequences for warranty and PIWIS visibility; this record covers the California CARB compliance layer specific to smog check enforcement. MODS_22_002 covers cat-delete and non-OEM exhaust CEL consequences; this record covers the CARB visual inspection and EO compliance requirement. These records complement rather than duplicate: File 22 covers the mechanical/warranty consequences; File 25 covers the registration compliance consequence.

---

```yaml
id: REGION_25_003
flag_title: "Import and Grey-Market Compliance — European and ROW-Spec Porsches in the US"
severity: moderate
description: >
  European and ROW-spec Porsches differ from US-spec in lighting, bumpers, speedometer
  calibration, emissions equipment, and sometimes engine tune. Cars 25+ years old are
  fully exempt from NHTSA and EPA federal compliance requirements (Box 1 import, no
  Registered Importer required). Under-25-year non-US-spec cars require a NHTSA Registered
  Importer conversion ($9,500–$28,500); if no RI holds an approved procedure, the car
  cannot enter for road use. California buyers face additional CARB requirements even on
  25-year-eligible imports. Confirm the NHTSA compliance label on the door jamb to
  identify market specification.
applicability:
  generation:
    - "911-f-body"
    - "g-series-2.7"
    - "911-sc"
    - "911-3.2-carrera"
    - "930"
    - "964"
    - "993"
    - "996.1"
    - "996.2"
    - "997.1"
    - "997.2"
    - "991.1"
    - "991.2"
    - "992.1"
    - "992.2"
    - "987.1"
    - "987.2"
    - "981"
    - "718"
  year_range: [1963, 2030]
buyer_questions:
  - "Is this car US-spec or ROW-spec? Is the NHTSA compliance label present on the door jamb?"
  - "What is the car's original market of sale? (Check the Porsche CoA or Kardex record.)"
  - "Has the car already cleared US Customs and been titled in a US state?"
  - "If under 25 years old and ROW-spec: has an RI conversion been completed? What is the RI documentation?"
  - "Are the headlights DOT/SAE marked? Does the speedometer show mph as primary?"
  - "What additional steps are required for registration in the buyer's state?"
```

**Applicability**

```yaml
applicability:
  generations:
    - "911-f-body"
    - "g-series-2.7"
    - "911-sc"
    - "911-3.2-carrera"
    - "930"
    - "964"
    - "993"
    - "996.1"
    - "996.2"
    - "997.1"
    - "997.2"
    - "991.1"
    - "991.2"
    - "992.1"
    - "992.2"
    - "986"
    - "987.1"
    - "987.2"
    - "981"
    - "718"
    - "cayenne_955"
    - "cayenne_957"
    - "cayenne_958"
    - "cayenne_9Y0"
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
    - "970"
    - "971"
    - "macan_95B"
  region: "United States — applies to any car imported from a non-US-spec market
    (Europe, Japan, Australia, Middle East, etc.) or to a US buyer considering
    purchasing a non-US-spec car."
  year_range: "1965–present"
  year_range_note: >
    Two distinct compliance pathways based on vehicle age:

    **25-year-eligible (built 25+ years before current month and year):**
    Complete exemption from NHTSA FMVSS safety standards and EPA emissions requirements
    under the Imported Vehicle Safety Compliance Act of 1988. Federal import is
    straightforward: DOT Form HS-7 (Box 1), EPA Form 3520-1 (Code E), standard customs
    clearance. No Registered Importer required. Base import duty: 2.5% of declared value.
    Note: EPA has a separate 21-year exemption for emissions. State registration may
    add requirements — California CARB certification is an additional step even for
    25-year-eligible imports.

    **Under-25-years (non-US-spec):**
    Requires a NHTSA-approved Registered Importer (RI) to bring the car into FMVSS
    compliance. RI conversion cost: $9,500–$28,500 depending on vehicle. A 150% of
    dutiable value compliance bond is required during the 120-day conversion window.
    If no RI holds an approved compliance procedure for the specific make/model/year,
    the car cannot enter for permanent road use through any legal route. This pathway
    is expensive and not available for every vehicle.
  excludes:
    - "US-spec cars that have been exported and re-imported — the NHTSA DOT compliance
      label on the door jamb will be present on these cars; confirm the label"
    - "Cars that have already cleared customs and are titled in a US state — if a US
      title exists, federal compliance has already been addressed (though state-level
      issues may remain)"
```

**Description**

Porsche sold different specifications of the same model in different markets. US-spec cars were built to meet NHTSA safety standards and EPA emissions requirements. European and Rest-of-World (ROW) spec cars differ in meaningful ways that affect registration compliance and buyer safety. As 993s, 996s, and other desirable generations hit the 25-year eligibility window, the volume of ROW-spec cars entering the US market is increasing.

**Key spec differences on common ROW vs. US-spec Porsches:**
- *Speedometer calibration:* European cars display km/h as primary; US-spec shows mph primary. On pre-digital instrument clusters, swapping is not trivial.
- *Lighting:* European cars use different headlight assemblies (frequently superior beam patterns for high-beam use, but not DOT-certified). SAE/DOT-marked headlights are required for street registration in most states.
- *Bumper systems:* Pre-1974 F-body US-spec cars have the energy-absorbing impact bumpers required for US market. European cars of the same era may have slim or chrome bumpers — visually distinctive but not DOT-compliant for street use if the car is under 25 years old.
- *Emissions equipment:* European-spec cars may lack the air pump, secondary air injection (SAI) components, or catalyst configuration required for US market. On post-OBD-II cars, the ECU may be calibrated differently with different oxygen sensor and catalyst monitoring parameters.
- *Engine differences:* Some ROW markets received different engine variants (higher compression, different power output) that may not be reflected in a US title or VIN decode.

**The 25-year rule and its limits.** Under the Imported Vehicle Safety Compliance Act of 1988, vehicles manufactured 25 or more years ago are fully exempt from NHTSA and EPA federal compliance requirements. (The EPA has a separate 21-year emissions exemption.) This makes import administratively straightforward and eliminates the Registered Importer cost. However, the 25-year exemption is federal only — individual states may impose their own registration requirements. California specifically requires CARB emissions certification even on 25-year-eligible imported cars, which can add cost and complexity.

**How to identify a ROW-spec car:** The NHTSA compliance label (permanently affixed by the manufacturer) should be present on the door jamb of any US-spec car. On a ROW-spec car, this label will be absent or will show non-US certification. The speedometer face (km/h vs. mph primary), headlight assembly markings (SAE/DOT vs. ECE), and VIN structure can also indicate market origin. The Porsche Certificate of Authenticity (CoA) or factory Kardex record will show the original market of sale.

**Evidence Basis**

```yaml
evidence_basis: specialist_single_source
tier_a:
  - source: "NHTSA — 'Importation and Certification FAQs' (nhtsa.gov/importing-vehicle)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "Tier A regulatory source. Confirms: vehicles 25+ years old can be imported
      without FMVSS compliance under Box 1 of Form HS-7. Confirms: vehicles under 25
      years old that were not manufactured to FMVSS compliance cannot be lawfully
      imported unless modified by a Registered Importer. Confirms HS-7 form documentation
      requirements and 25-year age determination from date of manufacture."
tier_b:
  - source: "West Coast Shipping — '25-Year Rule for US Car Imports 2025' and 'Grey Market
      Car Import Restrictions: What Can't Enter the USA' (wcshipping.com)"
    retrieval_status: confirmed_search_snippet_this_session
    notes: "West Coast Shipping is a licensed international auto transport and import
      compliance specialist with documented expertise in US vehicle importation regulations.
      Classified as Tier B under 'specialist shops with documented expertise' — this is
      a regulated, licensed domain (US Customs broker / NHTSA Registered Importer
      coordination) where West Coast Shipping's operational expertise is directly relevant.
      Note: both cited articles are from the same organization; two articles from one
      organization do not satisfy the independence requirement for specialist_consensus,
      hence evidence_basis is specialist_single_source. Documents: 25-year NHTSA/DOT
      exemption, 21-year EPA exemption, RI conversion cost range $9,500–$28,500, 120-day
      compliance bond window, customs documentation requirements."
tier_c:
  - source: "CarBuzz — '25-Year Import Rule: Everything You Need To Know'"
    notes: "Documents both NHTSA (25-year) and EPA (21-year) exemption thresholds,
      the Show or Display rule, and the RI route. Confirms California adds CARB
      certification requirement for imports. General automotive journalism; Tier C."
  - source: "NHTSA Show or Display — Wikipedia article"
    notes: "Documents that the Show or Display amendment became law August 1999, was
      motivated by the Porsche 959 / Bill Gates case, allows 2,500 miles/year for
      approved historically significant vehicles. Wikipedia is Tier C."
```

**Cost Estimate**

```yaml
cost_estimate:
  parts_usd: "$0–$28,500"
  parts_source_anchor: "West Coast Shipping specialist (Tier B): RI conversion cost
    $9,500–$28,500 for under-25-year non-US-spec vehicles. 25-year-eligible vehicles:
    $0 federal compliance cost (NHTSA/EPA exemption applies). Base import duty: 2.5%
    of declared value applies to all imported vehicles."
  cost_note: >
    Additional costs apply in all cases: customs broker fees, port handling, domestic
    transport, and state registration costs. California CARB certification for
    25-year-eligible imports adds incremental cost (amount not confirmed to a specific
    Tier B source at authoring time). No Tier B source confirmed for broker/handling
    fees — omitting numeric labor/handling field pending confirmed anchor.
    The compliance cost step-function is the key buyer insight: 25-year-eligible cars
    have near-zero federal compliance cost; under-25 non-US-spec cars may have
    $10,000–$30,000 RI conversion cost or may be legally unimportable.
  currency: "usd"
```

**Buyer Questions**

- Is this car US-spec or ROW-spec? Is the NHTSA compliance label present on the door jamb?
- What is the car's original market of sale? (Check the Porsche CoA or Kardex record.)
- Has the car already cleared US Customs and been titled in a US state? (If yes, federal compliance is already addressed.)
- If under 25 years old and ROW-spec: has an RI conversion been completed? What is the RI's documentation?
- Are the headlights DOT/SAE marked? Does the speedometer show mph as primary?
- What additional steps are required for registration in the buyer's state (especially California)?

**Inspection Notes**

For any car without a clear US ownership chain and US title history, inspect the door jamb for the NHTSA compliance label (white or silver rectangular label, typically near the VIN plate). Its absence strongly suggests a non-US-spec vehicle.

Check the speedometer: a primary km/h display on a car offered as a "US-market" car is an immediate flag. Check headlight lenses for SAE/DOT markings (required for US street use on post-1968 cars). On pre-1974 cars, bumper style (slim European vs. US impact bumper) indicates market specification.

Request the factory CoA or Kardex from the seller. These documents will confirm the original market and equipment code at build. A legitimate US import with documentation will have these; a grey-market car without documentation provenance is higher risk.

For cars in the 24–26-year range, verify the exact build date from the manufacturer label (not just model year) — the 25-year NHTSA exemption runs from the month and year of manufacture.

**Cross-References**

- **File 14 — Title / Mileage / Accident History.** Missing US title history, foreign title documents, and incomplete ownership chains are the documentation red flags that often accompany non-US-spec imports. Cross-reference File 14 buyer questions for documentation verification.
- **REGION_25_002 — California CARB Emissions Compliance.** California buyers importing a 25-year-eligible ROW-spec Porsche should note that the federal 25-year exemption does not waive California's CARB emissions certification requirement. File 25 REGION_25_002 applies as an additional overlay.
