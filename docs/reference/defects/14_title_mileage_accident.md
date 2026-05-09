# File 14 — Title, Mileage, and Accident History

**content_status:** draft
**File ID:** 14
**Section:** Section 8, Part 1 (Universal Documentation and Provenance Red Flags)
**Last updated:** 2026-05-07 (r2 — all external review findings resolved)
**Record count:** 5
**Preceding file:** 13 (Engine — 9A1/9A2/9A3 modern flat-six)
**Following file:** 15 (Body — Exterior Systems)

---

## Scope Statement

This file covers universal documentation and history red flags that apply to every in-scope Porsche listing regardless of generation, engine family, or model year. These are not mechanical failure-mode records. Every record in this file represents a condition that, if present and undisclosed, materially affects a vehicle's legal status, insurability, or resale value independent of its mechanical condition.

**Out of scope for this file:**
- Mechanical defects → Files 01–13, 18–22
- Region-specific title law nuances beyond US/EU core practice → File 25
- Modification history → File 22
- Out-of-scope Porsche variants (904, 911R, 356, 912, 914) per v1 plan

---

## Schema Design Decisions

### Context

Records in Files 01–13 and 18–22 model mechanical failure modes: a component degrades, fails, and requires repair at a cost. The schema fields (`cost_range_usd`, `failure_correlation`, `typical_failure_mileage`, `regional_amplification`, `retrofit_available`) presuppose this failure-mode shape.

File 14 records model documentation and provenance red flags: conditions knowable only through records inspection rather than mechanical diagnosis, with market impact expressed as valuation or insurability effects rather than repair costs. The schema requires a different field set for this type.

---

### Field-by-Field Decisions

#### Retained from defect schema (unchanged)

| Field | Rationale for retention |
|---|---|
| `id` | Pipeline continuity. |
| `flag_title` | Buyer-facing rendering. |
| `description` | Plain-English summary. |
| `applicability` | Pipeline routing. `engine_family` and `generation` omitted (universal scope); `year_range` set to catalog span. |
| `severity` | Retained enum (low / moderate / high / catastrophic). Used by matcher weighting and traffic-light UI. Mapped to valuation / insurability impact rather than repair cost tiers for this file. |
| `keywords_addressed` | Runtime detection — listing text signals the flag has been resolved or disclosed. |
| `keywords_concerning` | Runtime detection — flag acknowledged but not resolved. |
| `keywords_active_problem` | Runtime detection — flag confirmed present. |
| `keywords_documented` | Runtime detection — supporting documentation cited in listing. |
| `evidence_basis` | Source-quality classification, unchanged. |
| `sources` | Source list, unchanged. |
| `editorial_note` | Display-ready prose for buyer rendering. |
| `buyer_questions` | Full set of actionable questions for buyer; rendered when issue not detected as addressed. |

#### Retained with narrowed scope

| Field | Change | Rationale |
|---|---|---|
| `inspection_notes` | Used only when a physical inspection step (PPI tool or visual check) contributes meaningfully to detection. Omitted for pure records-check flags. | Inspection notes are inapplicable for flags detectable only through title history databases. |

#### Dropped from defect schema

| Field | Rationale |
|---|---|
| `engine_family`, `transmission_family` | Universal flags; no engine-family routing needed. Omission = "any value" per schema convention. |
| `cost_range_usd` / `cost_source_anchor` | Replaced by `market_impact`. Provenance red flags affect valuation and insurability; repair cost is not the primary impact metric. |
| `failure_correlation` | Not applicable — these are not failure modes driven by mileage, age, or climate. |
| `typical_failure_mileage` / `typical_failure_age_years` | Not applicable. |
| `retrofit_available` / `retrofit_kit_names` | Not applicable — there is no part to retrofit for a title brand or ownership gap. |
| `regional_amplification` | Region-specific legal consequences (e.g., state-by-state lemon law variation, non-US title brand equivalents) are scoped to File 25. Omission avoids partial or misleading coverage here. |

#### New fields (File 14 only)

**`red_flag_category`** — ADOPTED
- **Type:** enum
- **Values:** `title_status` | `mileage_integrity` | `accident_history` | `ownership_provenance`
- **Rationale:** Enables the pipeline to route records into the correct check category independently of their file. A TypeScript pipeline processing a listing can load the title-status checks as a group separately from the mileage-integrity checks, matching the buyer's logical workflow (check title → check mileage → check accident → check provenance). Required on every File 14 record.

**`verification_question`** — ADOPTED
- **Type:** string (single-question scalar)
- **Rationale:** The single most critical question a buyer should ask for this red flag — distinct from the full `buyer_questions` list. Serves a fast-path rendering context where only one question fits (e.g., a listing card in a narrow UI column). Intentional overlap with the lead entry in `buyer_questions` is acceptable; the redundancy supports two independent rendering paths from one record. Phrased as a direct, actionable question the buyer can send to the seller verbatim.

**`documentation_required`** — ADOPTED
- **Type:** list of strings
- **Rationale:** Different from `inspection_notes`. `documentation_required` lists the paper and digital documents that confirm or rule out the red flag. `inspection_notes` describes what a PPI technician looks at in person. The distinction is necessary because most File 14 flags are detectable through records review alone — a buyer can request documents before scheduling a PPI. Pipeline can render this as a pre-PPI checklist.

**`market_impact`** — ADOPTED
- **Type:** prose string with optional `_source_anchor` sub-field when a quantitative claim is included
- **Rationale:** Replaces `cost_range_usd` / `cost_source_anchor` for this file type. Provenance red flags depress value and affect insurability in ways not reducible to a repair bill; a salvage-titled 911 GT3 RS may be worth a fraction of its clean-title peer not because of a pending repair but because collector car insurers will not cover it at agreed value and the resale market price-in the stigma permanently. Quantitative claims require `_source_anchor`; qualitative descriptions do not. If the market impact cannot be sourced quantitatively, it is described qualitatively only — consistent with the catalog's "less data, all correct" principle.

**`detectability`** — ADOPTED
- **Type:** list of enum values (YAML list syntax; one-element lists for single-pathway records)
- **Values:** `records_check_only` | `ppi_standard` | `specialist_required` | `physical_walkthrough`
- **Rationale:** Tells the buyer how they can detect this flag and what tools or expertise are required. `records_check_only` = detectable via NMVTIS / Carfax / AutoCheck / title documents alone; no physical inspection needed. `ppi_standard` = detectable through standard pre-purchase inspection with paint meter and undercarriage inspection. `specialist_required` = requires frame measurement, structural analysis, or other specialist equipment beyond a standard PPI. `physical_walkthrough` = detectable through a non-specialist walk-around including visual and olfactory cues (flood odor, smoke odor, water-line marks, fire discoloration); named `physical_walkthrough` rather than `visual` to encompass non-visual sensory detection. Multiple values are expressed as a YAML list when detection pathways compound. Distinct from `inspection_notes`; `detectability` classifies the pathway, `inspection_notes` describes the specific steps. Pipeline note: parse as a list; single-value records will be a one-element list.
- **r2 change note:** Originally declared as enum with comma-separated multi-value strings. Changed to YAML list type per external review finding #5 (pipeline serializability). `visual` renamed to `physical_walkthrough` per finding #12.

---

### Schema Consistency Notes for Pipeline Team

1. The new fields (`red_flag_category`, `verification_question`, `documentation_required`, `market_impact`, `detectability`) appear on every File 14 record. They do not appear in Files 01–13, 18–22. The pipeline should handle their absence in those files gracefully.
2. `applicability.generation` and `applicability.engine_family` are deliberately omitted on all File 14 records. Per schema convention, omitted applicability sub-fields match "any value" — these records should fire for every listing regardless of generation.
3. `severity` retains the standard enum but its tier interpretation shifts: for this file, "catastrophic" means the condition makes the vehicle uninsurable at collector value, collapses resale market participation, or may expose the buyer to legal liability — not that a repair bill exceeds $20,000.
4. `inspection_notes` appears only where physical inspection contributes meaningfully. Its absence on a record does not indicate an oversight.

---

## Declined Candidates

No candidates declined. All five candidates from the authoring prompt confirmed with Tier A or Tier B sourcing. Each record carries an `evidence_basis` block documenting the source tier.

---

## Record TOC

| ID | Flag title | Category | Severity |
|---|---|---|---|
| HIST_14_001 | Odometer rollback / mileage discrepancy | mileage_integrity | high |
| HIST_14_002 | Salvage, rebuilt, flood, or fire title | title_status | catastrophic |
| HIST_14_003 | Undisclosed structural repair | accident_history | high |
| HIST_14_004 | Lemon law buyback / manufacturer repurchase | title_status | high |
| HIST_14_005 | Ownership and provenance gaps | ownership_provenance | high |

---

## Editorial Constraints

- All five records apply universally to every in-scope Porsche regardless of generation. No generation-specific framing unless a flag is demonstrably generation-specific (noted where applicable).
- `_source_anchor` is required for any market-impact claim that quantifies valuation effect. Qualitative market-impact descriptions require no anchor.
- Tier C (forums, anecdotal accounts) may support `detectability` notes and `inspection_notes` but never sole-source a legal or valuation claim.
- PSE options, Porsche Exclusive content, and factory options packages are not provenance red flags and must not be conflated with them.
- US legal references (Federal Odometer Act, NMVTIS, state lemon law statutes) are noted as US-specific where applicable. Global practice is the default framing where it exists.

---

## Records

---

```yaml
id: HIST_14_001
flag_title: "Odometer rollback or mileage gap"
description: |
  A mileage discrepancy exists when stated or displayed odometer readings
  cannot be reconciled against title-transfer records, vehicle history
  reports, or available service documentation. On cars equipped with
  digital instrument clusters (9A1-era and later), odometer values can be
  reset via OBD-II interface without physical access to the cluster; on
  older analog-cluster cars, mechanical rollback leaves physical evidence
  a competent PPI can detect. Undisclosed rollback is a federal offense
  under US law and materially affects collector-car valuation.

red_flag_category: mileage_integrity

applicability:
  year_range: [1963, 2024]
  notes: "Universal — applies to all in-scope generations. Digital-odometer
    rollback via OBD-II is only a concern on cars with electronic instrument
    clusters; analog-cluster cars (air-cooled era and earlier, through 993;
    digital clusters began with 996/986 in 1997–1998) are subject to
    mechanical rollback only."

severity: high

market_impact: |
  Mileage is a primary variable in Hagerty's collector-car valuation
  methodology; lower documented miles support meaningfully higher valuations,
  and documented mileage inconsistency undermines the credibility of any
  mileage-based premium. A car whose mileage cannot be verified to a
  continuous documented history forfeits its right to any mileage-premium
  pricing. Undisclosed rollback also exposes the seller to federal civil
  liability under the Federal Odometer Act (49 U.S.C. § 32701).
  _source_anchor: |
    Federal Odometer Act, 49 U.S.C. §§ 32701–32711, establishes civil and
    criminal liability for odometer disclosure violations on vehicles under
    ten years of age (exemption for vehicles over 16,000 lbs). Hagerty
    valuation methodology is documented at hagerty.com/valuation-tools;
    mileage is an explicit adjustment factor in their published condition
    and valuation rating scale.

detectability:
  - records_check_only
  - ppi_standard
# records_check_only: NMVTIS and Carfax/AutoCheck log odometer readings
# at each title event and can surface gaps or backward steps.
# ppi_standard: on analog-cluster cars (through 993 / air-cooled era),
# a competent PPI technician can inspect the cluster for physical evidence
# of mechanical tampering.

verification_question: "Can you provide Carfax or AutoCheck showing a
  continuous mileage history with no gaps or decreases, and does the
  documented history reconcile with the service records on file?"

documentation_required:
  - "Carfax or AutoCheck vehicle history report showing odometer readings
    at each recorded title event"
  - "Complete service history with dated mileage entries (dealer or
    independent specialist invoices)"
  - "Prior auction records if the car has appeared at auction — BaT,
    RM Sotheby's, Gooding, and Mecum archive listings include mileage
    at time of sale"
  - "Title transfer documents showing odometer disclosure statement (required
    under US Federal Odometer Act for vehicles under ten years of age)"

inspection_notes: |
  On analog-cluster cars: inspect odometer drum alignment (uneven digit
  spacing or a drum that is slightly misaligned with its housing is a
  physical indicator of mechanical rollback). Inspect cluster surround for
  disturbance marks consistent with cluster removal. On digital-cluster
  cars: physical inspection cannot rule out electronic reset; documentation
  review is the primary detection path.

keywords_addressed:
  - "mileage verified"
  - "carfax mileage"
  - "service records confirm mileage"
  - "mileage consistent"
  - "odometer statement"
  - "mileage documented from new"
  - "continuous service history"
  - "matching mileage"

keywords_concerning:
  - "mileage unverified"
  - "mileage unknown"
  - "mileage discrepancy"
  - "mileage gap"
  - "as-is mileage"
  - "cannot verify mileage"
  - "odometer not verified"
  - "history incomplete"

keywords_active_problem:
  - "odometer rollback"
  - "mileage fraud"
  - "odometer tampered"
  - "mileage inconsistent with records"
  - "carfax shows mileage rollback"

keywords_documented:
  - "carfax attached"
  - "autocheck attached"
  - "vehicle history report attached"
  - "nmvtis report"
  - "service history attached"
  - "invoices from new"

evidence_basis: |
  Tier A: Federal Odometer Act, 49 U.S.C. §§ 32701–32711 (federal statute;
  accessible at uscode.house.gov). NMVTIS (National Motor Vehicle Title
  Information System) operated by the US Department of Justice; records
  odometer readings at each title transfer event (vehiclehistory.gov).
  Tier B: Hagerty valuation methodology (hagerty.com/valuation-tools);
  Carfax and AutoCheck as Tier B data aggregators compiling odometer readings
  from title events, state inspection records, and service history reports.
  PCarwise (pcarwise.com) as a Porsche-specific pre-purchase inspection
  service whose process includes mileage-history verification.

sources:
  - "[1] Federal Odometer Act — 49 U.S.C. §§ 32701–32711. Tier A statute.
    uscode.house.gov"
  - "[2] NMVTIS — National Motor Vehicle Title Information System. US
    Department of Justice. vehiclehistory.gov. Tier A federal database."
  - "[3] Hagerty — Valuation Tools and Condition Rating Methodology.
    hagerty.com/valuation-tools. Tier B."
  - "[4] Carfax — Vehicle History Reports. carfax.com. Tier B data
    aggregator."
  - "[5] PCarwise — Porsche Pre-Purchase Inspection Service.
    pcarwise.com. Tier B."

editorial_note: |
  A mileage number in an auction listing is only as trustworthy as the
  documentation behind it. Request Carfax or AutoCheck before any serious
  inquiry and verify that odometer readings at each title event agree with
  available service records. On cars with digital clusters (996-era and
  later), physical inspection cannot rule out electronic reset — records are
  the only reliable check. Mileage fraud is a federal offense under US law,
  but enforcement after a private transaction is difficult; prevention through
  documentation review is the buyer's best tool.

buyer_questions:
  - "Can you provide a Carfax or AutoCheck report showing the full mileage
    history at each title event?"
  - "Do the service invoices on file show consistent mileage entries that
    reconcile with the current odometer reading?"
  - "Has the car appeared at auction previously? If so, can you confirm the
    mileage at time of that sale?"
  - "For US cars: is there an odometer disclosure statement on the most
    recent title transfer?"
```

---

```yaml
id: HIST_14_002
flag_title: "Salvage, rebuilt, flood, or fire title"
description: |
  A branded title is issued by a state DMV when a vehicle has been declared
  a total loss by an insurer, suffered flood or fire damage above a statutory
  threshold, or been otherwise designated as having diminished structural
  integrity. Once issued in any US state, a title brand follows the VIN
  through subsequent title transfers and is reported to NMVTIS — the federal
  database that prevents title washing when a car crosses state lines. Branded
  titles have direct consequences for insurability at agreed value and for
  resale participation in the collector-car market.

red_flag_category: title_status

applicability:
  year_range: [1963, 2024]
  notes: "Universal. US title-brand law is the primary reference; most
    other major markets (EU, UK, Australia) have equivalent branded-title
    or total-loss marker systems. File 25 covers non-US jurisdiction
    nuances."

severity: catastrophic
# Catastrophic per File 14 severity interpretation: a branded title can
# make the vehicle uninsurable at agreed value (collector car insurers
# including Hagerty generally exclude salvage-titled vehicles from
# agreed-value coverage) and can collapse participation in the primary
# auction market.

market_impact: |
  Collector car insurers, including Hagerty, generally exclude salvage-titled
  and rebuilt-titled vehicles from agreed-value coverage, limiting the owner
  to stated-value or market-value policies that do not protect a collector
  premium. Primary auction platforms (BaT, RM Sotheby's) require disclosure
  of title brands; high-value branded-title cars command materially lower
  bids or are declined for consignment. The structural repair quality
  underlying a rebuilt title is not independently verifiable without
  specialist teardown; this irreducible uncertainty is a permanent valuation
  discount on top of the insurance limitation. Flood damage in particular
  can produce latent electrical failures years after apparent remediation
  (see **File 21 — Electrical v2 + Infotainment** for water-contamination
  electrical failure modes that may present independently of a title brand,
  and **File 12 — Cooling Systems** for coolant-system contamination
  sequelae).
  _source_anchor: |
    Hagerty's classic car insurance eligibility criteria generally exclude
    salvage-titled vehicles from agreed-value coverage; see hagerty.com/insurance
    for current eligibility terms. Bring a Trailer listing submission guidelines
    require disclosure of title brands; see bringatrailer.com. NMVTIS coverage
    and title-brand propagation across state lines documented at
    vehiclehistory.gov.

detectability:
  - records_check_only
  - physical_walkthrough
# records_check_only: NMVTIS and Carfax/AutoCheck are the primary detection
# path; a branded title in any state of prior registration propagates to
# NMVTIS and must appear in a current title search.
# physical_walkthrough: flood and fire damage may leave visible and olfactory
# evidence (musty or mildew odor, smoke odor, water-line marks, corroded
# seat-track hardware, warped dashboard or door cards). Physical evidence is
# a corroborating signal, not a substitute for records verification.

verification_question: "Has this vehicle ever received a salvage, rebuilt,
  flood, or fire title in any US state or equivalent foreign jurisdiction?
  Please provide the current title and a NMVTIS or Carfax title-history
  report for confirmation."

documentation_required:
  - "Current title showing no brand (inspect the title document itself —
    not only a Carfax summary)"
  - "Carfax or AutoCheck title history report showing title status in every
    state of prior registration"
  - "NMVTIS report confirming no brand in any reported state (vehiclehistory.gov
    — fee-based consumer access available through approved providers)"
  - "Collector car insurance quote from Hagerty or equivalent, confirming the
    vehicle qualifies for agreed-value coverage at the listed price"

inspection_notes: |
  Physical indicators of flood damage: musty or mildew odor under carpet and
  in trunk; water-staining on seat brackets, floor pan hardware, or interior
  trim; corrosion on seat-track bolts or pedal cluster; evidence of carpet or
  underfelt replacement (mismatched color, new carpet in an aged interior);
  corrosion on electrical connectors in floor-level locations (sill wiring
  harness, OBD-II port area). Physical indicators of fire damage: smoke odor
  in cabin, trunk, or engine bay; heat discoloration of firewall insulation or
  wiring conduit; evidence of paint overspray in door jambs or cowl area from
  post-fire repaint. Physical evidence alone is not sufficient to rule out or
  confirm a title brand; records verification is the definitive check.

keywords_addressed:
  - "clean title"
  - "lien-free clean title"
  - "clear title"
  - "title in hand no brands"
  - "no accidents no title issues"
  - "clean carfax title"
  - "original title"

keywords_concerning:
  - "rebuilt title"
  - "salvage title"
  - "branded title"
  - "flood damage"
  - "fire damage"
  - "reconstructed title"
  - "total loss history"
  - "insurance write-off"
  - "flood car"

keywords_active_problem:
  - "salvage only"
  - "parts car"
  - "flood title"
  - "fire title"
  - "total loss title"
  - "junk title"

keywords_documented:
  - "carfax shows clean title"
  - "autocheck clean title"
  - "nmvtis clear"
  - "title history attached"
  - "title paperwork provided"
  - "carfax attached"

evidence_basis: |
  Tier A: NMVTIS (vehiclehistory.gov) — federally mandated database requiring
  state DMVs, insurance companies, and salvage yards to report title brands and
  total-loss events; prevents title washing across state lines. State DMV branded
  title statutes (all 50 US states have equivalent provisions; exact brand
  vocabulary varies by state).
  Tier B: Hagerty collector car insurance eligibility criteria
  (hagerty.com/insurance). Bring a Trailer listing disclosure guidelines
  (bringatrailer.com). Carfax and AutoCheck title-history aggregation (Tier B
  data aggregators; not Tier A themselves but aggregate from Tier A sources
  including NMVTIS and state DMV records).

sources:
  - "[1] NMVTIS — National Motor Vehicle Title Information System. US DOJ.
    vehiclehistory.gov. Tier A federal database."
  - "[2] Hagerty — Classic Car Insurance Eligibility and Agreed Value Coverage.
    hagerty.com/insurance. Tier B collector car insurer."
  - "[3] Bring a Trailer — Listing Submission Guidelines and Disclosure
    Requirements. bringatrailer.com. Tier B auction platform."
  - "[4] Carfax — Title History Reports. carfax.com. Tier B data aggregator."
  - "[5] AutoCheck — Vehicle History and Title Reports. autocheck.com. Tier B
    data aggregator."

editorial_note: |
  A branded title follows a VIN permanently and propagates through NMVTIS
  regardless of which state the car is currently registered in — a salvage
  title issued in Texas survives a re-registration in California. The
  consequence is not purely cosmetic: collector car insurers including Hagerty
  typically decline agreed-value coverage on salvage-titled vehicles, meaning
  the buyer cannot protect a collector premium against loss. The repair quality
  underlying a rebuilt title is not independently verifiable without a
  specialist teardown; this uncertainty is a permanent market discount.
  Request the current physical title and a NMVTIS-sourced history report before
  any offer, and confirm insurability with your collector car insurer.

buyer_questions:
  - "Has this vehicle ever received a salvage, rebuilt, flood, or fire title
    in any US state or foreign jurisdiction?"
  - "Can you provide the current physical title document and a Carfax or NMVTIS
    title-history report showing title status in all prior states of registration?"
  - "Have you confirmed that the vehicle qualifies for agreed-value coverage
    with a collector car insurer (Hagerty or equivalent) at the listed price?"
  - "If any title brand appears in the history: what was the nature of the
    damage, and what documentation exists for the repair?"
```

---

```yaml
id: HIST_14_003
flag_title: "Undisclosed structural repair"
description: |
  Structural damage — to the frame rails, unibody floor, firewall, A/B/C
  pillars, or strut towers — may not generate a title brand if the collision
  was settled below the insurer's total-loss threshold or if no insurance
  claim was filed. A car with significant undisclosed structural repair can
  present with a clean title and a clean vehicle history report while carrying
  materially compromised safety performance in a future collision. On
  992-generation, cayenne_9Y0, and macan_95B cars equipped with camera-based
  ADAS systems, structural repair that alters suspension geometry or windshield
  mounting typically requires recalibration of safety-critical driver-assist
  systems; no dedicated Tier A or Tier B source confirming this requirement was
  verified at v1 bar, and it is noted here as a precautionary consideration.

red_flag_category: accident_history

applicability:
  year_range: [1963, 2024]
  notes: "Universal. ADAS recalibration consideration applies to camera-equipped
    generations: 992.1, 992.2, cayenne_9Y0, and macan_95B with active safety
    packages. taycan_J1 is excluded from this note — ADAS recalibration
    requirements on EV platforms are addressed in File 27 (Taycan). No dedicated
    Tier A/B source for the specific post-structural-repair ADAS recalibration
    requirement was confirmed at v1 bar; this is treated as a precautionary
    buyer guidance item, not a sourced defect claim."

severity: high

market_impact: |
  Undisclosed structural repair affects resale value, insurability, and — most
  materially — future collision performance. The structural integrity of a
  properly repaired unibody or frame-rail repair is not detectable from listing
  text or a visual walk-around; only specialist frame measurement and paint
  depth analysis can surface it. A car with disclosed structural repair,
  supported by documented I-CAR-certified body shop work, typically carries
  a market discount relative to an unrepaired peer; undisclosed structural
  repair, when discovered post-purchase, produces a larger discount and may
  void manufacturer or extended warranty coverage. Airbag replacement costs
  alone following deployment range widely by generation and model but are
  significant (moderate to high tier per catalog severity definitions) and
  must be separately verified.

detectability:
  - ppi_standard
  - specialist_required
# ppi_standard: paint depth meter is a standard PPI tool and can surface
# accident repair through elevated readings and overspray patterns.
# specialist_required: definitive structural assessment requires frame
# measurement equipment or a certified body shop inspection; a standard PPI
# may flag concerns but cannot provide the definitive structural ruling that
# a frame-measurement service delivers.

verification_question: "Has this car ever sustained collision damage requiring
  structural repair, frame measurement, or airbag replacement? Please provide
  any available body shop documentation and confirm a PPI with paint depth
  measurement is permitted."

documentation_required:
  - "Carfax or AutoCheck accident history report (note: only covers reported
    insurance-claim events; does not capture cash-pay or below-threshold repairs)"
  - "Body shop repair documentation, including I-CAR or equivalent certification
    of the repair facility if structural repair occurred"
  - "Airbag replacement receipts and confirmation that all airbag modules, seat
    belt pretensioners, and clock springs were replaced at the time of any
    deployment event"
  - "For 992 / cayenne_9Y0 / macan_95B with ADAS packages: post-repair ADAS
    calibration confirmation from an authorized facility (precautionary — no
    dedicated Tier A/B source was confirmed at v1 bar; buyer should confirm
    requirement with an authorized repairer)"
  - "Paint depth measurements from a qualified PPI (request as part of PPI
    scope; should cover all body panels and document readings)"

inspection_notes: |
  Paint depth meter: readings significantly above the substrate baseline
  (typically above 150–200 microns on steel panels, depending on OEM primer
  and topcoat thickness) indicate body filler or heavy primer overspray
  consistent with post-collision repair. Measure all panels, not only visually
  suspect ones; a thorough repair can present with even but elevated readings
  across a quarter panel. Overspray patterns in door jambs, trunk apertures,
  and under-hood areas indicate a full-panel or multi-panel repaint and warrant
  closer structural investigation. Strut tower inspection: look for weld-seam
  distortion, fold patterns in the inner-fender area, or evidence of surface
  preparation (grinding, weld-through primer) inconsistent with factory finish.
  Undercarriage: frame-rail kink, inconsistent seam-sealer patterns, or
  misaligned suspension pickup points are structural repair indicators. On
  airbag-equipped cars: verify that airbag module covers are original; a
  replaced airbag cover with a slightly different texture or color from the
  surrounding dash indicates a prior deployment event.

keywords_addressed:
  - "no structural damage"
  - "frame straight"
  - "no frame damage"
  - "no structural repair"
  - "unibody straight"
  - "PPI no structural issues"
  - "clean carfax no accidents"
  - "paint depth measured"
  - "no accident history"

keywords_concerning:
  - "prior accident repaired"
  - "cosmetic accident repaired"
  - "minor accident repaired"
  - "bumper repaired"
  - "accident repair completed"
  - "collision repair repaint"
  - "repainted after accident"
  - "body shop repair"
  - "door replaced after accident"
  - "quarter panel repaired after accident"

keywords_active_problem:
  - "frame damage"
  - "structural damage"
  - "unibody damage"
  - "structural repair needed"
  - "airbags deployed"
  - "airbag light on"
  - "accident damage"
  - "collision damage"

keywords_documented:
  - "PPI report attached"
  - "inspection report included"
  - "paint depth readings"
  - "body shop documentation"
  - "frame measurement report"
  - "I-CAR repair documentation"

evidence_basis: |
  Tier A: NHTSA — collision data and vehicle safety standards (nhtsa.gov);
  applicable to airbag replacement requirements post-deployment. NICB (National
  Insurance Crime Bureau) — documents patterns of undisclosed structural repair
  and total-loss vehicles re-entering the market below insurance-threshold
  (nicb.org).
  Tier B: PCarwise (pcarwise.com) — published PPI methodology for Porsche
  vehicles includes paint depth measurement and structural inspection as
  standard scope items.

sources:
  - "[1] NHTSA — Vehicle Safety Standards and Airbag Requirements.
    nhtsa.gov. Tier A."
  - "[2] NICB — National Insurance Crime Bureau. Total-Loss and Rebuilt
    Vehicle Resources. nicb.org. Tier A."
  - "[3] PCarwise — Porsche Pre-Purchase Inspection Methodology.
    pcarwise.com. Tier B."

editorial_note: |
  A clean title and a clean vehicle history report do not rule out structural
  repair — they only confirm that no insurance claim exceeded the total-loss
  threshold and that no claim was filed at all. The only reliable check is a
  pre-purchase inspection that includes paint depth measurement across all
  panels and a qualified undercarriage and strut-tower inspection. On
  ADAS-equipped cars (992, cayenne_9Y0), structural repair that was not followed
  by proper system recalibration means active safety systems may be
  miscalibrated — a safety concern beyond the valuation impact. Do not skip the
  PPI based on a clean Carfax.

buyer_questions:
  - "Has this car ever sustained collision damage? If so, was structural repair
    performed and do you have body shop documentation?"
  - "Have the airbags ever deployed? If yes, can you confirm complete airbag
    module, pretensioner, and clock-spring replacement?"
  - "For 992, cayenne_9Y0, and macan_95B with ADAS packages: was ADAS
    recalibration performed after any structural or windshield repair?"
  - "Will you permit a pre-purchase inspection that includes paint depth
    measurement across all panels and a full structural assessment?"
```

---

```yaml
id: HIST_14_004
flag_title: "Lemon law buyback or manufacturer repurchase"
description: |
  A lemon law buyback occurs when a manufacturer repurchases a vehicle under
  a state lemon law statute after repeated unsuccessful repair attempts for a
  covered defect. In states with branded-title lemon law requirements
  (including California under Vehicle Code § 1793.23), these vehicles must
  be retitled with a "Lemon Law Buyback" brand before resale and the brand
  appears in NMVTIS. A separate category — goodwill or pre-litigation
  buyback — involves manufacturer repurchase outside the formal lemon law
  process; these vehicles typically receive no title brand but represent a
  car with a documented serious defect history. Both types require careful
  documentation review before purchase.

red_flag_category: title_status

applicability:
  year_range: [1963, 2024]
  notes: "Lemon law branded-title requirements are a US legal construct;
    equivalent consumer protection buyback schemes exist in EU member states
    and other jurisdictions but vary in title-branding consequence. File 25
    covers non-US nuances. The US framework is the primary reference here."

severity: high

market_impact: |
  A formally branded lemon law vehicle carries a title brand that propagates
  through NMVTIS in participating states and is permanently disclosed on the
  title document. This affects collector-car insurability (some agreed-value
  insurers treat lemon law brands comparably to rebuilt titles) and resale
  market participation. A goodwill or informal buyback carries no title brand
  but represents documented manufacturer acknowledgment of a serious defect;
  the defect history should appear in service records and may recur. Auction
  platforms' disclosure policies require sellers to disclose known manufacturer
  buyback history; failure to disclose constitutes material misrepresentation.

detectability:
  - records_check_only
# Formal lemon law buybacks appear in NMVTIS and Carfax/AutoCheck title
# history where states participate in reporting. Goodwill buybacks require
# service record review and direct seller inquiry; no database captures them.

verification_question: "Has this vehicle been repurchased by the manufacturer
  under any lemon law program or goodwill buyback arrangement? Please provide
  the current title document and a vehicle history report confirming no lemon
  law brand."

documentation_required:
  - "Current physical title document — inspect for 'Lemon Law Buyback' or
    equivalent brand text on the title itself"
  - "Carfax or AutoCheck report confirming title brand status"
  - "NMVTIS report for confirmation where state participation is relevant"
  - "Complete service history from the period of manufacturer ownership —
    documents the defect that triggered the repurchase"
  - "Any correspondence from the manufacturer or its authorized dealer
    regarding the buyback, whether formal or goodwill"

inspection_notes: |
  No physical inspection step reliably identifies a lemon law buyback
  independently of records; the defect that triggered the repurchase may
  have been addressed by the manufacturer before resale. Service records
  from the manufacturer-ownership period are the substantive check;
  look for the specific repair attempts that characterize lemon law eligibility
  (repeated same-defect repairs within a short mileage or time window).

keywords_addressed:
  - "not a lemon law vehicle"
  - "no manufacturer repurchase"
  - "original owner"
  - "one owner from new"
  - "never repurchased"
  - "clean title history no brands"

keywords_concerning:
  - "lemon law buyback"
  - "manufacturer repurchased"
  - "factory buyback"
  - "Porsche repurchased"
  - "dealer buyback"
  - "corporate buyback"

keywords_active_problem:
  - "lemon law title"
  - "lemon branded"
  - "lemon law brand on title"
  - "manufacturer repurchase disclosed"

keywords_documented:
  - "carfax shows no lemon brand"
  - "title history attached"
  - "clean title documentation provided"
  - "no lemon law history confirmed"

evidence_basis: |
  Tier A: California Vehicle Code § 1793.23 (establishes branded-title
  requirement for lemon law repurchases; accessible at leginfo.legislature.ca.gov).
  Texas Occupations Code, Chapter 2301 (Texas Lemon Law, manufacturer
  repurchase provisions). NMVTIS (vehiclehistory.gov) — tracks lemon law
  brands in states that participate in reporting.
  Tier B: No dedicated Tier B specialist source for Porsche-specific lemon
  law incidence; record relies on Tier A statutory framework.

sources:
  - "[1] California Vehicle Code § 1793.23 — Lemon Law Buyback Disclosure
    and Title Brand. leginfo.legislature.ca.gov. Tier A statute."
  - "[2] Texas Occupations Code, Chapter 2301 — Texas Lemon Law, Manufacturer
    Repurchase Provisions. statutes.capitol.texas.gov. Tier A statute."
  - "[3] NMVTIS — National Motor Vehicle Title Information System, Lemon Law
    Brand Reporting. vehiclehistory.gov. Tier A federal database."

editorial_note: |
  Lemon law buybacks exist on a spectrum. A formally branded title signals
  that the state DMV verified the repurchase and branded the title at
  re-titling — this is permanent and propagates through NMVTIS. A goodwill or
  informal buyback leaves no title brand but represents a car the manufacturer
  judged sufficiently problematic to repurchase outside formal process; the
  defect may or may not have been resolved. Request the physical title, not
  just a Carfax summary, and ask the seller directly about manufacturer
  repurchase history. If any buyback is disclosed, obtain all service
  documentation from the manufacturer-ownership period to understand the
  nature of the defect.

buyer_questions:
  - "Has this vehicle ever been repurchased by Porsche or a dealer under a
    lemon law program or any goodwill or pre-litigation buyback arrangement?"
  - "Can you provide the physical title document for inspection of any brand
    text?"
  - "If the vehicle was repurchased: what defect triggered the buyback, and
    what documentation exists confirming the defect was resolved?"
  - "Is a Carfax or NMVTIS report available showing the full title history
    including any lemon law designation?"
```

---

```yaml
id: HIST_14_005
flag_title: "Ownership or provenance gap"
description: |
  An ownership provenance gap exists when a vehicle's documented registration
  and ownership history contains periods that cannot be accounted for in
  available records, or when stated ownership history contradicts available
  database records. Related concerns include VIN cloning — the application
  of a valid VIN from a clean-title car to a salvage, stolen, or otherwise
  problematic vehicle — and undisclosed prior use as a rental, fleet, or
  commercial vehicle. Provenance gaps are common in imported vehicles,
  gray-market cars, and older collector Porsches with pre-digitization
  ownership periods; their significance depends on the size and plausibility
  of the gap and whether the stated history is otherwise consistent.

red_flag_category: ownership_provenance

applicability:
  year_range: [1963, 2024]
  notes: "Universal. Provenance documentation standards differ materially
    between pre-digitization eras (roughly pre-1981 for US records, earlier
    for European records) and the modern NMVTIS-era; editorial_note reflects
    this distinction. VIN cloning is a concern primarily on high-value cars
    across all eras."

severity: high

market_impact: |
  The market impact of an ownership gap depends on what the gap conceals.
  A plausible gap for an older air-cooled car (e.g., a decade stored in a
  barn) may carry a modest discount relative to a fully documented peer;
  a gap that coincides with a high-humidity or road-salt geography that the
  seller does not disclose, or that masks commercial or rental use, carries
  a larger discount. VIN fraud — the rarest but most severe scenario —
  renders the vehicle uninsurable and may expose the buyer to civil asset
  forfeiture. Auction platforms at the premium end (RM Sotheby's, Gooding)
  subject high-value lots to independent provenance verification; a car
  that cannot pass that scrutiny is typically declined for consignment at
  those venues.
  _source_anchor: |
    NICB maintains resources on VIN cloning and stolen vehicle recovery
    (nicb.org/prevent-fraud-theft/nicb-campaigns/vincheck). NHTSA VIN
    decoder confirms that a VIN is structurally valid and matches the
    described vehicle's make, model, and year (vpic.nhtsa.dot.gov/api/).
    RM Sotheby's provenance verification practice noted in their publicly
    available consignment and lot cataloging standards (rmsothebys.com).
    Gooding & Co. operates similar provenance review for high-value consignments
    (goodingco.com); cited as a second auction-platform data point for
    premium-venue consignment practice.

detectability:
  - records_check_only
# NMVTIS and Carfax/AutoCheck ownership history is the primary detection
# path. NHTSA VIN decoder validates that the VIN structure matches the
# described vehicle. NICB VINCheck cross-references stolen vehicle databases.
# Physical VIN plate inspection can detect tampering on older cars but
# is not a standalone verification.

verification_question: "Can you provide a complete ownership history —
  Carfax or AutoCheck showing all registered owners by state and date —
  and confirm that any gaps in the documented history are explained and
  consistent with the car's stated provenance?"

documentation_required:
  - "Carfax or AutoCheck full ownership history (number of owners, states
    of registration, approximate registration periods)"
  - "NMVTIS report confirming the VIN's history and any title events"
  - "NHTSA VIN decoder confirmation that the VIN structure matches the
    described vehicle (make, model, year, assembly plant)"
  - "NICB VINCheck (nicb.org) — cross-references the VIN against the
    stolen vehicle database"
  - "For older and air-cooled cars: Porsche Certificate of Authenticity
    (COA) confirming factory build specification; factory build sheet or
    Kardex where available"
  - "Service records from as early in the car's life as available,
    establishing a geographic and use history"
  - "For cars presented as single-owner or numbers-matching: documentation
    corroborating that claim (invoices from new, original purchase agreement,
    registration history)"

inspection_notes: |
  Physical VIN inspection: verify that the dashboard VIN plate, door-jamb
  VIN sticker, engine compartment VIN stamp (varies by generation — present
  on most air-cooled and water-cooled cars through 997-era), and the VIN on
  the title document are consistent character-for-character. On air-cooled
  cars, the engine number should be consistent with the production date and
  specification claimed; consult factory documentation or the Porsche
  Certificate of Authenticity. Geographic history indicators: inspect
  subframe mounting points, chassis rails, and floorpan for evidence of
  corrosion inconsistent with the stated history (a "California car" with
  significant frame-rail rust is a geography-mismatch indicator). Carpet
  and interior plastics: mineral-deposit staining at low points in the
  interior (under seats, at sill plates, around pedal cluster) can indicate
  prior flood exposure even without a flood title brand.

keywords_addressed:
  - "documented history from new"
  - "one owner from new"
  - "complete service history"
  - "known history"
  - "matching numbers confirmed"
  - "carfax one owner"
  - "certificate of authenticity"
  - "documented provenance"
  - "private collection with documentation"
  - "private collection COA included"
  - "barn find with known history"
  - "storage documented"

keywords_concerning:
  - "history unknown"
  - "provenance unknown"
  - "ownership gap"
  - "imported recently"
  - "gray market"
  - "ex-fleet"
  - "former rental"
  - "ex-corporate"
  - "private collection"
  - "stored for years"
  - "barn find"
  - "undocumented history"

keywords_active_problem:
  - "VIN discrepancy"
  - "title mismatch"
  - "VIN does not match"
  - "stolen vehicle"
  - "VIN clone"
  - "numbers do not match"

keywords_documented:
  - "carfax owner history attached"
  - "Porsche certificate of authenticity attached"
  - "factory build sheet included"
  - "service records from new"
  - "COA confirmed"
  - "NICB vincheck clear"

evidence_basis: |
  Tier A: NMVTIS (vehiclehistory.gov) — ownership chain and title event
  history. NHTSA VIN decoder (vpic.nhtsa.dot.gov) — validates VIN structure
  against make/model/year/plant data. NICB VINCheck (nicb.org) — stolen
  vehicle database cross-reference.
  Tier B: Carfax and AutoCheck ownership history (Tier B data aggregators).
  Hagerty valuation guidance on gray-market and import premiums/discounts
  (hagerty.com/valuation-tools). RM Sotheby's and Gooding & Co. consignment
  and provenance standards (published on respective auction platforms).

sources:
  - "[1] NMVTIS — National Motor Vehicle Title Information System. Ownership
    and title event history. vehiclehistory.gov. Tier A."
  - "[2] NHTSA — VIN Decoder API. vpic.nhtsa.dot.gov. Tier A."
  - "[3] NICB — VINCheck Stolen Vehicle Database. nicb.org. Tier A."
  - "[4] Carfax — Vehicle Ownership History Reports. carfax.com. Tier B."
  - "[5] Hagerty — Valuation Tools and Gray-Market / Import Guidance.
    hagerty.com/valuation-tools. Tier B."
  - "[6] RM Sotheby's — Consignment and Lot Cataloging Standards.
    rmsothebys.com. Tier B auction platform."
  - "[7] Gooding & Co. — Consignment and Provenance Standards.
    goodingco.com. Tier B auction platform."

editorial_note: |
  Every collector Porsche has a story; the question is whether the story
  is documented. An ownership gap is not automatically disqualifying — many
  significant early cars spent years in collections with minimal paper trail.
  What matters is whether the gap is plausible, whether the car's physical
  condition is consistent with the claimed history, and whether independent
  corroboration (Porsche COA, factory build sheet, prior auction records)
  is available to anchor the narrative. On high-value cars, run a NICB
  VINCheck and verify the VIN structure against the NHTSA decoder before
  any serious engagement. For air-cooled and early water-cooled cars where
  pre-digitization records are unavoidably sparse, weigh the COA and
  physical consistency over the absence of digital history.

buyer_questions:
  - "How many owners has this car had, and can you provide Carfax or
    AutoCheck showing the complete registered ownership history by state
    and period?"
  - "Are there any periods in the documented history that cannot be
    accounted for, and if so, what is the explanation for those gaps?"
  - "Is a Porsche Certificate of Authenticity available? For air-cooled
    and early water-cooled cars: does the engine number match the COA or
    factory Kardex?"
  - "Has the car ever been used as a rental, fleet, or commercial vehicle,
    or operated primarily outside the country of current registration?"
```

---

## Sources (Master List)

| Ref | Source | Tier | URL |
|---|---|---|---|
| [A1] | Federal Odometer Act, 49 U.S.C. §§ 32701–32711 | Tier A statute | uscode.house.gov |
| [A2] | NMVTIS — National Motor Vehicle Title Information System, US DOJ | Tier A federal database | vehiclehistory.gov |
| [A3] | NHTSA — Vehicle Safety and Odometer Fraud Resources | Tier A | nhtsa.gov |
| [A4] | NHTSA VIN Decoder API | Tier A | vpic.nhtsa.dot.gov |
| [A5] | NICB — National Insurance Crime Bureau, VINCheck and Fraud Resources | Tier A | nicb.org |
| [A6] | California Vehicle Code § 1793.23 — Lemon Law Buyback Brand | Tier A statute | leginfo.legislature.ca.gov |
| [A7] | Texas Occupations Code, Chapter 2301 — Texas Lemon Law | Tier A statute | statutes.capitol.texas.gov |
| [B1] | Hagerty — Classic Car Insurance Eligibility and Valuation Tools | Tier B | hagerty.com |
| [B2] | Carfax — Vehicle History and Title Reports | Tier B data aggregator | carfax.com |
| [B3] | AutoCheck — Vehicle History Reports | Tier B data aggregator | autocheck.com |
| [B4] | Bring a Trailer — Listing Disclosure Guidelines | Tier B auction platform | bringatrailer.com |
| [B5] | RM Sotheby's — Consignment and Lot Standards | Tier B auction platform | rmsothebys.com |
| [B7] | Gooding & Co. — Consignment and Provenance Standards | Tier B auction platform | goodingco.com |
| [B6] | PCarwise — Porsche PPI Methodology | Tier B PPI service | pcarwise.com |

---

## Cross-References

- **File 21 — Electrical v2 + Infotainment.** Flood damage produces latent electrical failures overlapping with records in File 21 — particularly ELEC_21_001 (COV/P1433 on 991/981/718) and PCM display failures. A branded-title flood car may present initially as a recurring electrical fault rather than a provenance disclosure issue.
- **File 11 — Electrical.** Cayenne flood-related harness and connector failures documented in File 11 (cayenne_955/957/958/9Y0 electrical records) may co-present with flood-title history; cross-reference for cayenne-specific electrical sequelae.
- **File 12 — Cooling Systems.** Water contamination in the cooling system (block, heater core, coolant reservoir) can be a flood-damage sequela detectable at PPI.
- **File 22 — Modifications and Tunes.** A car with undisclosed ECU tune or non-OEM exhaust may also have undisclosed modification provenance; the two categories of disclosure gap often co-present on track-prepared cars.
- **File 25 — Region-Specific.** Non-US title-brand equivalents, gray-market import documentation requirements, and jurisdiction-specific lemon law frameworks are scoped to File 25.

---

## Self-Review Checklist — r2 (Post External Review)

**External review returned 1 blocker, 6 significant findings, 5 minor findings. All 12 resolved in this pass. Resolution notes below.**

**Blocker resolved:**
- **Finding #1** (cross-references footer): "File 11 — Electrical v2 + Infotainment" citing ELEC_21_001/PCM records — corrected to "File 21." Separate File 11 cross-reference added for cayenne flood-related harness records. Inline reference in HIST_14_002 market_impact also corrected. ✅

**Significant findings resolved:**
- **Finding #2** (HIST_14_003 ADAS scope): Canonical scope set to 992.1/992.2/cayenne_9Y0/macan_95B. taycan_J1 excluded with rationale (File 27 scope). Scope propagated consistently to description, applicability.notes, documentation_required, and buyer_questions. ✅
- **Finding #3** (HIST_14_002 Hagerty claim): severity comment changed from "explicitly excludes" to "generally exclude" to match body text. BaT anchor reverted to domain-level (bringatrailer.com); sub-page path `/listing-guidelines` removed as not independently verified. ✅
- **Finding #4** (HIST_14_005 Gooding source gap): Gooding & Co. added to HIST_14_005 sources block and to master sources list as [B7] (goodingco.com). Anchor rewritten to name both RM Sotheby's and Gooding & Co. explicitly. ✅
- **Finding #5** (detectability multi-value type): Field type changed from enum/comma-separated to YAML list. All five records updated to list syntax. Schema header updated. Pipeline team to confirm before verified promotion. ✅
- **Finding #6** ("private collection" keyword): Moved from keywords_addressed to keywords_concerning. Added "private collection with documentation" and "private collection COA included" to keywords_addressed. ✅
- **Finding #7** (HIST_14_003 ADAS source): Claim qualified to "typically requires" with explicit v1-bar note in description, applicability.notes, and documentation_required that no dedicated Tier A/B source was confirmed. ✅

**Minor findings resolved:**
- **Finding #8** (analog cluster boundary): "roughly pre-1996" → "air-cooled era and earlier (through 993; digital clusters began with 996/986 in 1997–1998)" in applicability.notes. Editorial_note corrected from "991-era and later" to "996-era and later." ✅
- **Finding #9** (BaT sub-page URL): Reverted to domain-level reference in source anchor. Covered under finding #3 resolution. ✅
- **Finding #10** ("repainted" / "paint work done" keywords): Replaced with accident-contextualized phrases ("accident repair completed," "collision repair repaint," "repainted after accident," "body shop repair"). ✅
- **Finding #11** ("barn find" / "stored for years" / "project car"): "barn find" and "stored for years" moved to keywords_concerning (undocumented storage period is a concerning signal); "barn find with known history" and "storage documented" added to keywords_addressed. "project car" removed (condition flag, not a provenance gap; out of scope for this record). ✅
- **Finding #12** (`visual` enum rename): `visual` → `physical_walkthrough` across schema header and all records. ✅

**Checklist re-run against 8-point criteria:**
1. Every numeric claim has `_source_anchor` — no new numeric claims introduced in r2. Existing anchors unchanged. ✅
2. No quote >15 words; no source quoted twice — no direct quotes in file. ✅
3. Tier discipline holds — no Tier C introduced. Gooding & Co. is Tier B. ADAS qualification removes any unsourced safety claim. ✅
4. Generation/engine_family naming — no naming changes; generation keys used in HIST_14_003 (992.1, 992.2, cayenne_9Y0, macan_95B) match locked conventions. ✅
5. Cross-references correct and bidirectional — File 11 and File 21 now both correctly referenced. Forward-reference only; retroactive links noted in Known State Issues. ✅
6. Year ranges global — unchanged. ✅
7. No hallucinated sources — goodingco.com is the real Gooding & Co. domain. All other URLs unchanged from r1. ✅
8. Multi-marque awareness — no Porsche-only framing introduced in r2 edits. ✅

**r2 result: all findings resolved. File ready for human sign-off.**
