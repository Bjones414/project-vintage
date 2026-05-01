# Porsche Defect Catalog — Schema (v1)

This document defines the structure of every defect record in the Porsche
defect catalog. Each defect lives in a section file (e.g.,
`01_engine_m96_m97.md`). The schema is designed for two purposes:

1. **Runtime detection** — keyword arrays are matched against listing text
   to flag whether a known issue has been addressed, acknowledged, or is
   active for the car being analyzed.
2. **Buyer-facing rendering** — `flag_title`, `description`, and
   `editorial_note` are rendered to the buyer alongside the auction listing
   to prompt informed questions.

## Authoring philosophy

Every defect entry is authored ONCE in the section file most natural to it
(by engine family, body type, or category). The JSON serialization pipeline
builds runtime indexes per generation, body, engine family, etc., from the
`applicability` block.

### Sourcing standard

Every numeric claim — cost, prevalence, mileage range, age range — must be
accompanied by a `_source_anchor` field that points the reader to a
specific, verifiable passage on the cited source URL. The anchor describes
in the catalog's own words what the source establishes; the source citation
provides the verification path.

**Anchor contract.** A reviewer reading the anchor and clicking the cited
URL must be able to locate the supporting passage on that page. If the
supporting passage cannot be located on the cited page, the anchor is
broken and must be corrected — either by retargeting the URL or by
rephrasing to match what the source actually establishes.

**Paraphrase-first policy.** Direct verbatim quotation from web sources is
avoided across the catalog. The catalog is a commercial product
synthesizing information from many independent sources; the cumulative-use
posture of an aggregated defect catalog is most defensible when content is
paraphrased with attribution rather than republished verbatim, even in
short excerpts. Each defect record contains zero direct quotes from forum
sources and minimal direct quotes from specialist sources. Where a direct
quote is genuinely necessary (e.g., to attribute an upstream claim from
Porsche AG via a specialist source), it must be under 15 words and
attributed inline.

If a defect is real but lacks specialist-source quantification, it can
still appear in the catalog with `evidence_basis: community_reported` and
the qualitative-only fields populated. Empty quantitative fields are
correct, not a bug.

## Tier convention (matches decade reference docs)

- **Tier A** — Porsche AG official records, Porsche Newsroom, PCA Tech
  Tips, PCA regional newsletters, Porsche Certificate of Authenticity
  citations.
- **Tier B** — Specialist publications and shops with documented expertise
  (LN Engineering, Flat 6 Innovations, Hartech, Pelican Parts, Shark Werks,
  RPM Specialist Cars, Excellence Magazine, Total 911, GT Porsche, Weissach
  UK, BBI Autosport, Lang Racing Development, Atlantic Motorcar Center).
- **Tier C** — Forums (Rennlist, Pelican forums, 6SpeedOnline, PistonHeads,
  PCGB Forum, Planet-9), aggregator sites without primary sourcing.

Tier C is used as supporting evidence only when consistent with Tier B
sources, never as a sole source for prevalence or cost claims. When a Tier
C source provides the cleanest dollar figure but the cost reasoning is
supported by Tier B sources qualitatively, the cost claim is paraphrased
from the Tier B reasoning and the Tier C reference is demoted to a
"consistency footnote" indicating that owner-reported figures fall within
the same range.

## Per-defect record structure

Every defect uses this exact YAML-style block layout. Headings are parsed
literally; do not rename them.

```yaml
id: snake_case_id
flag_title: "Short title rendered as a bullet (3-6 words)"
description: |
  One to two sentences in plain English. Describes what fails and what to
  do about it. Includes a sourced cost figure only when cost_source_anchor
  can support it.

# === Applicability (always required) ===
# All present sub-fields must match. Omitted sub-fields are "any value."
applicability:
  generation: [list]              # e.g., [996.1, 996.2, 986, 987.1, 997.1]
  engine_family: [list]           # e.g., [M96, M97]
  transmission_family: [list]     # optional
  body: [list]                    # e.g., [Coupe, Cabriolet, Targa]
  trim_category: [list]           # e.g., [Carrera, Carrera_S, Boxster]
  year_range: [low, high]         # e.g., [1999, 2008]
  specific_model_years: [list]    # only when narrower than year_range
  excludes:                       # narrow exceptions to broader rule
    description: "Mezger-engined cars use a different IMS architecture"
    engine_family: [Mezger]
  # Multiple excludes blocks are permitted as a defense-in-depth
  # mechanism, especially where matcher routing might misroute a car
  # because a sub-trim within an in-scope generation actually carries a
  # different engine family.

# === Quantitative fields (include ONLY when source-anchored) ===

severity: low | moderate | high | catastrophic
# Only populate when sourcing supports a clear cost or impact tier.
# Tiers (anchored to current Porsche service market):
#   low — annoyance, <$1,000 to fix
#   moderate — meaningful repair, $1,000–$5,000
#   high — significant cost or threatens drivability, $5,000–$20,000
#   catastrophic — >$20,000 OR requires engine/transmission replacement
#                  OR cost exceeds 30% of typical car value at current market

cost_range_usd: [low, high]
cost_source_anchor: |
  Paraphrased description of the supporting passage on the cited source
  page. A reviewer should be able to locate the supporting passage by
  opening the cited URL. Citation appears as [n] referencing the sources
  block.
# Both fields populated together or both omitted. Cost is parts + labor
# at independent specialist rates unless source specifies otherwise.

prevalence_rate: "percentage range" | "rare" | "uncommon" | "common" | "near-universal"
prevalence_source_anchor: |
  Paraphrased description of the supporting passage on the cited source
  page, with citation.
# Map percentages to qualitative (used by not_mentioned logic):
#   <1%        → rare
#   1–10%      → uncommon
#   10–50%     → common
#   ≥50%       → near-universal

failure_correlation: mileage | age | climate | usage_pattern | mixed
# What drives this failure. Used by the matcher to weight signals.

typical_failure_mileage: [low, high]
typical_failure_mileage_source_anchor: |
  Paraphrased description of where the source establishes this range.
# Only when failure_correlation includes 'mileage' AND a source supports it.

typical_failure_age_years: [low, high]
typical_failure_age_source_anchor: |
  Paraphrased description of where the source establishes this range.
# Only when failure_correlation includes 'age' AND a source supports it.

retrofit_available: yes | no | partial | preventive_only
retrofit_kit_names: [list of named kits with vendor]
# Only kits with a named vendor that can be cited (e.g., "LN Engineering
# IMS Solution"). No generic "aftermarket aluminum pipe."

regional_amplification:
  salt_belt: high | moderate | low
  desert_southwest: high | moderate | low
  coastal_humid: high | moderate | low
  cold_climate: high | moderate | low
# Include ONLY climates a source actually discusses. Omit "none" entries —
# absence indicates "no source-discussed amplification."

# === Detection (always required) ===

keywords_addressed: [list]
# Phrases indicating the issue has been resolved. Each phrase should be
# specific enough that it would not fire on a listing for a different car.

keywords_concerning: [list]
# Phrases indicating the issue is acknowledged but NOT addressed.

keywords_active_problem: [list]
# Phrases indicating an in-progress or recently-occurred failure.

keywords_documented: [list]
# Phrases indicating the addressed work is documented (invoices, photos,
# specific kit names with serial/cert numbers). Used by the matcher to
# distinguish documented_addressed from claimed_addressed.

# Note: a global documentation-keyword list (e.g., "with invoices",
# "service records included", "PCA documentation") is maintained outside
# individual records. Per-record keywords_documented covers defect-specific
# phrases like "IMS Solution certificate" that wouldn't apply elsewhere.

# === Provenance (always required) ===

evidence_basis: manufacturer_acknowledged | specialist_consensus | specialist_single_source | community_reported | disputed
# manufacturer_acknowledged — TSB, recall, or formal Porsche statement
# specialist_consensus — multiple Tier B sources agree
# specialist_single_source — one Tier B source, not contradicted
# community_reported — forum/owner reports only, no specialist write-up
# disputed — sources disagree on existence, prevalence, or applicability

sources:
  - "[1] LN Engineering — IMS Bearing Definitive Guide and FAQ. Tier B"
  - "[2] PCA — Bore Scoring and How to Prevent It. Tier A"
# Numbered list with title, vendor, and tier. URL goes in the section file's
# Sources block at the end, not duplicated per defect.

# === Buyer-facing prose (always required) ===

editorial_note: |
  2-4 sentences in display-ready prose. What the buyer should understand
  and why it matters. Avoid hedging. Avoid alarmist language. Tone:
  knowledgeable friend prompting a question, not a service manual.

buyer_questions:
  - "Has the IMS bearing been replaced? With which kit and at what mileage?"
  - "Can you provide invoices for the IMS work?"
# 2-4 ready-to-send questions the buyer can ask the seller. Phrased
# directly. The matcher's negative result (issue not detected as addressed
# in listing) renders these to the buyer.
```

## Valuation impact mapping

The current UI surfaces a traffic-light status (green / yellow / red) per
flag, not dollar amounts. Schema captures the data needed to derive both:

| Detection state | Traffic light | Future valuation_impact |
|---|---|---|
| `keywords_addressed` matches AND `keywords_documented` matches | green | documented_addressed |
| `keywords_addressed` matches, no documentation phrases | green | claimed_addressed |
| `keywords_concerning` matches | red | acknowledged_unaddressed |
| `keywords_active_problem` matches | red | active_failure |
| Nothing matches AND prevalence ≥ common | yellow | not_mentioned (penalize per prevalence) |
| Nothing matches AND prevalence < uncommon | yellow | not_mentioned (neutral) |

### `not_mentioned` calibration (v1)

The `not_mentioned` valuation effect is graded by prevalence:

- `near-universal` → `not_mentioned: moderate_discount`
- `common` (10–50%) → `not_mentioned: small_discount`
- `uncommon` (1–10%) → `not_mentioned: neutral`
- `rare` (<1%) → `not_mentioned: neutral`

Numerical calibration of `small_discount` for v1: a 2–4% reduction off
the comparable-sales-derived fair-value midpoint, scaled to the defect's
severity tier. A `common` × `high` defect at `not_mentioned` discounts the
midpoint by approximately 4%; a `common` × `low` defect by approximately
2%. `moderate_discount` (for `near-universal` defects) is approximately
5–7% under the same scaling. The exact percentages are tuned in the comp
engine, not in this schema; this calibration is documentation of intent
for the v1 ship.

### Matcher tokenization requirement

The matcher consuming these arrays MUST tokenize and apply word-boundary
matching, NOT raw substring matching. Naive `text.includes("IMS")` will
false-positive on "Simsbury" and "dimsum." Multi-word phrases match as a
sequence of tokens, not as a substring.

## Schema Extensions

If during research a defect's properties don't fit the schema above, add a
new field with a clear name and document it here. The format:

### Extension: `field_name`

- **Type**: string | array | enum | object
- **Allowed values** (if enum): list
- **Used by**: list of defect IDs that use this field
- **Rationale**: why the existing schema didn't cover this case

### Extension candidate: per-record sub-population prevalence (v2)

- **Status**: candidate, not implemented in v1
- **Rationale**: The IMS bearing record (`m96_m97_ims_bearing`) currently
  spans three sub-populations with materially different prevalence rates:
  dual-row factory bearing (1997–early 2000) at under 1%, single-row
  factory bearing (2000–2005) at approximately 8%, and larger
  non-serviceable bearing (late 2005–2008) at approximately 1%. Treated as
  a single record, the matcher applies one `not_mentioned` rule across all
  three sub-populations. A v2 schema extension could permit a per-record
  sub-population prevalence map keyed on `year_range` or
  `specific_model_years`, allowing a single record to carry differential
  prevalence and differential `not_mentioned` behavior.
- **Workaround for v1**: The IMS record uses prevalence "1–8% depending on
  bearing variant" and the editorial_note describes the variant
  distinction so the buyer understands the spread. Splitting into three
  records (one per sub-population) is also possible without a schema
  change but increases catalog cardinality.
- **Proposed field shape**:
  ```yaml
  prevalence_by_subpopulation:
    - year_range: [1997, 2000]
      prevalence_rate: "rare (<1%)"
      prevalence_source_anchor: |
        Anchor for dual-row prevalence.
    - year_range: [2000, 2005]
      prevalence_rate: "uncommon (~8%)"
      prevalence_source_anchor: |
        Anchor for single-row prevalence.
  ```

## File organization

Section files in this catalog:

- `01_engine_m96_m97.md` — Boxster/Cayman/911 water-cooled (1997–2008)
- `02_engine_mezger.md` — 996/997 GT3, Turbo, GT2 (Mezger flat-six)
- `03_engine_aircooled_911.md` — air-cooled 911 flat-six (1965–1998)
- `04_engine_cayenne_v8.md` — Cayenne 4.5L M48 / 4.8L M48.51
- `05_engine_transaxle_4cyl.md` — 924 / 944 / 968 inline-four family
- `06_engine_928_v8.md` — 928 V8 family
- `07_body_cabriolet.md` — convertible top mechanisms across generations
- `08_interior_sticky_buttons.md` — rubberized-coating-era interior issues
- `99_shared_water_cooled_era.md` — issues spanning multiple engine
  families in the water-cooled era (e.g., secondary air injection,
  coil packs)

Each file follows the same per-defect record structure defined here.
