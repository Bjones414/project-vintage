# 08 — Interior: Rubberized-Coating Switchgear Degradation

This file scopes a single defect spanning the era of Porsche cabin
switchgear that used a soft-touch rubberized coating: the late-1990s
through approximately 2012 production window. The coating's
plasticizer additives break down with heat and age, leaving the
treated surfaces sticky/tacky to the touch. The issue is cosmetic
rather than functional in most cases — switches and knobs continue
to operate — but the tactile degradation is universally reported
across owner communities and is one of the canonical "this car is
showing its age" pre-purchase signals on the affected generations.

The handoff scope for this file is "996/Boxster/early Cayenne." On
review of community sourcing and Tier B specialist parts coverage,
the affected platforms are broader than that framing in two
directions: the 997 (especially 997.1, 2005–2008) and the 987
Boxster/Cayman are clearly in scope per Tier B specialist-shop and
Tier C reporting; and the 958 Cayenne (2011–2018) is in scope per
Go-Parts' 2010–2018 Panamera/Cayenne/Touareg HVAC guide
[GP-958-HVAC], which states that the soft-touch coating on
buttons of that era is known to degrade over time and become
sticky or peel off. The 981 Boxster/Cayman shows the issue on
some surfaces per Planet-9 [P9-981-HVAC] but is deferred at this
stage pending dedicated v2 sourcing. The 991/992 use updated
switchgear materials and have not aged into a comparable failure
pattern at this stage; out of scope for this record.

A nuance worth surfacing up front: G2 cars (the 997.2 and 987.2,
2009–2012) reportedly received an updated AC/HVAC switchgear
material that materially reduces the peeling failure on those
specific switches. However, the PCM/radio rotary knobs on G2
cars continue to use the older soft-touch material and continue
to develop the sticky-coating failure with age — vendor evidence
is the Suncoast PCM 3.0 (987.2/997.2) Radio Knob Set product
page [SUN-PCM3], which exists specifically as a remedy for
sticky G2 PCM knobs. The improvement is partial, not complete.

This file contains one flagged defect: soft-touch rubberized
coating degradation across the affected generations. A "considered
and not included" section at the end notes the 981 deferral and
related items.

---

## Defect: Soft-touch rubberized coating degradation

```yaml
id: cabin_soft_touch_coating_sticky
flag_title: "Sticky cabin switchgear (soft-touch coating)"
description: |
  Many cabin switches, knobs, and trim pieces on Porsche cars
  produced from approximately 1997 through approximately 2012 use a
  rubberized soft-touch coating that breaks down with calendar age
  and heat. The plasticizer additives in the coating leach out and
  degrade, leaving the treated surfaces sticky/tacky to the touch
  and, in advanced cases, peeling and flaking off. Sourcing supports
  splitting this record into two related failure presentations on
  the same root cause:

  (1) **AC/HVAC switches and rocker buttons**: develop coating that
  peels, flakes, and exposes the white icons underneath. Cleaning
  is typically not effective at this stage; replacement of
  individual rocker switches or the full HVAC control unit is the
  standard fix. G2 cars (997.2 and 987.2, 2009–2012) reportedly
  use an updated AC/HVAC switchgear material that exhibits this
  failure substantially less.

  (2) **PCM radio rotary knobs and similar controls**: develop a
  sticky/tacky surface that often cleans up with isopropyl alcohol,
  hand sanitizer, or similar solvents (the coating rubs off,
  leaving hard plastic underneath; tactile feel changes but
  function is preserved). Replacement is for owners who want a
  permanent solution with the original tactile feel. G2 cars
  continue to use the older PCM-knob material per Suncoast's
  G2-specific replacement product page [SUN-PCM3] and PCGB Forum
  owner reports [PCGB-997.2], and still develop this failure with
  age.

  Beyond these two canonical presentations, the same coating
  appears on dashboard switches (PSM, traction control, hazard,
  sport), power-window switches, headlight rotary, and various
  trim bezels — these typically follow the PCM-knob presentation
  pattern (sticky, cleanable). Functionality is preserved across
  both presentations — switches and knobs continue to operate
  normally — so the issue is cosmetic and tactile rather than
  mechanical.

applicability:
  generation: [996.1, 996.2, 997.1, 997.2, 986, 987.1, 987.2, cayenne_955, cayenne_957, 970]
  body: [Coupe, Cabriolet, Targa, Roadster, SUV, Sedan]
  trim_category: [Carrera, Carrera_S, Carrera_4, Carrera_4S, Turbo, Turbo_S, GT2, GT3, Boxster, Boxster_S, Boxster_GTS, Cayman, Cayman_S, Cayenne_S, Cayenne_GTS, Cayenne_Turbo, Cayenne_Turbo_S, Panamera, Panamera_S, Panamera_4S, Panamera_Turbo]
  year_range: [1997, 2018]
  excludes:
    - description: "991 and 992 (2012+) use updated switchgear materials and have not surfaced an aged failure pattern at this stage; out of scope of this record."
      generation: [991.1, 991.2, 992.1, 992.2]
    - description: "981 and 718 Boxster/Cayman (2013+) have isolated reports of soft-touch coating issues but are deferred to v2 pending dedicated sourcing (see considered-and-not-included)."
      generation: [981, 718]
    - description: "Macan and other newer platforms have not surfaced an aged failure pattern in the catalog's sourcing review; out of scope at this stage."
      generation: [macan_95B, cayenne_958, cayenne_9Y0]

severity: low
# Cosmetic and tactile defect; switches and knobs continue to
# function. Repair scope is well under the $1,000 low-tier ceiling
# for almost all owners. Specifically: $8 per replacement OEM knob
# at consumer parts pricing; $50-$300 for full HVAC control unit
# replacement; full interior switchgear refresh typically lands
# under $500 even when multiple components are replaced. DIY
# alcohol-and-soda cleaning costs only the consumer's time.

cost_range_usd: [10, 500]
cost_source_anchor: |
  Multiple owner reports on Rennlist [REN-997-STICKY] and 6speedonline
  [6SO-997-STICKY] reference Suncoast Porsche Parts as a primary
  source for individual replacement OEM knobs. Historical
  forum-reported pricing was as low as approximately $8 per knob
  (per [REN-997-STICKY]); current Suncoast and Pelican pricing for
  individual OEM knobs typically runs $20–$60 per knob depending on
  model and pair-vs-individual configuration (Suncoast PCM 3.0 Radio
  Knob Set [SUN-PCM3] at $60 per pair; Pelican Parts 996 Radio Knob
  at $24.25 single per [PEL-996-SW]). The Pelican Parts 996 interior
  switches catalog [PEL-996-SW] and Delaware Porsche Parts 996
  switches catalog [DPP-996-SW] both list the full range of OEM
  replacement switches at consumer parts pricing in the $20–$150
  per-switch range depending on item. The Go-Parts guide for
  2003–2006 Cayenne HVAC control [GP-CAY-HVAC] documents full HVAC
  control unit replacement as a DIY job under an hour with basic
  trim tools and notes that used OEM units typically save more than
  $1,000 relative to new dealer pricing; absolute used-market pricing
  varies and is not consistently published. The Go-Parts 996/986
  HVAC guide [GP-996-HVAC] characterizes the HVAC control unit
  replacement as a 1-out-of-5 difficulty DIY job, with the same
  used-market savings framing. The catalog cost range brackets
  the typical owner repair scope: lower bound reflects single-knob
  DIY replacement ($10–$30 parts); upper bound reflects multi-
  component replacement (HVAC unit plus several individual knobs)
  on a car where the coating has degraded across multiple surfaces.
  Specialist refinishing services (StickyNoMore, ClimaRepair,
  Macarbon) are an alternative path; pricing varies by scope and is
  not consistently published.

prevalence_rate: "near-universal on aging affected cars — the
coating degrades on essentially every example given enough calendar
age and heat exposure; condition at any specific moment depends
heavily on storage, climate, and how heavily the affected switches
are used"

prevalence_source_anchor: |
  Multi-thread owner reporting across Rennlist [REN-997-STICKY,
  REN-955-957], 6speedonline [6SO-997-STICKY, 6SO-997-VIDEO],
  Pelican Parts forums [PEL-996-FORUM], Planet-9 [P9-RADIO-KNOBS],
  PistonHeads [PH-987-CLIMATE], and 911uk [911UK-STICKY] uniformly
  describes the soft-touch coating failure as expected on
  15-plus-year-old cars rather than exceptional. The Go-Parts
  HVAC control guide [GP-CAY-HVAC] explicitly identifies the
  rubberized soft-touch coating breakdown as a documented Cayenne
  955/957 failure pattern. The PistonHeads commenter on
  [PH-987-CLIMATE] notes that "G2 cars" — second-generation cars
  in the relevant model lines, generally meaning 997.2 (2009–2012)
  and later — use hard-coat switches that do not exhibit this
  failure, which is consistent with reduced (though not
  eliminated) reporting on those cars. No specialist-published
  percentage figure is available; the "near-universal on aging
  affected cars" framing reflects the uniformity of community
  reporting that the coating degrades predictably with time and
  heat rather than failing as exceptions.

failure_correlation: age
# Calendar age is the dominant factor. Heat exposure (cars stored in
# desert/hot climates, garage attics with high summer temperatures,
# direct sun on the dashboard) markedly accelerates the breakdown.
# Cycles of switch use are secondary; even rarely-used switches
# develop the sticky coating over enough calendar time.

typical_failure_age_years: [10, 25]
typical_failure_age_source_anchor: |
  Owner reporting in [REN-997-STICKY], [PH-987-CLIMATE],
  [911UK-STICKY], and [PEL-996-FORUM] consistently describes the
  failure becoming pronounced as cars cross the 10-year mark; the
  PistonHeads commenter on [PH-987-CLIMATE] explicitly notes "these
  cars are now over 10 years old" as the relevant context. The
  10–25 year range used here brackets the observed-failure window:
  meaningful stickiness begins appearing as cars approach 10 years
  old and is essentially universal on cars 15+ years old with
  original switchgear. Cars stored in hot/high-UV climates fail
  earlier within this window; cars stored in cool, low-light
  garages may last longer but still develop the issue.

retrofit_available: yes
retrofit_kit_names:
  - "OEM individual knob replacement (Suncoast Porsche Parts, Pelican Parts, Delaware Porsche Parts; current pricing approximately $20-$60 per knob; historical lows ~$8 per knob in older forum reports)"
  - "Suncoast PCM 3.0 (987.2/997.2) Radio Knob Set [SUN-PCM3] (G2-specific replacement set at $60/pair; vendor-side acknowledgment that G2 PCM knobs continue to develop the sticky-coating failure)"
  - "OEM HVAC control unit replacement (used OEM units save more than $1,000 relative to new dealer pricing per Go-Parts guides; absolute used-market pricing varies)"
  - "DIY alcohol-and-baking-soda coating removal (free; removes the soft-touch layer leaving hard plastic underneath; tactile feel is different but functional; works well on PCM/radio knobs, less effective on AC/HVAC switches that have peeled past the sticky stage)"
  - "DIY refinish with Plasti Dip or matte hobby paint (per owner discussion in [REN-997-STICKY] and similar sticky-knob threads; visual result varies)"
  - "StickyNoMore specialist refinishing service (referenced in Rennlist [REN-997-STICKY]; pricing not consistently published)"
  - "ClimaRepair specialist refinishing service (referenced in [PH-987-CLIMATE] PistonHeads thread with positive owner reviews)"
  - "Macarbon 997/987 Gen1 climate control switch refinishing service [MAC-RFB] (dedicated 997/987 switch refinishing product page)"

regional_amplification:
  desert_southwest: high
  coastal_humid: moderate
  cold_climate: low
# Heat is the dominant accelerator. Desert-southwest cars commonly
# show pronounced stickiness within 8–10 years; cold-climate
# garage-stored cars can stretch the timeline considerably though
# the issue still appears eventually. Coastal humidity is moderate
# (general plasticizer degradation is humidity-sensitive but heat
# is the primary driver).

keywords_addressed:
  - "switches replaced OEM"
  - "HVAC control unit replaced"
  - "climate control buttons replaced"
  - "radio knobs replaced"
  - "PCM knobs replaced"
  - "sticky buttons cleaned"
  - "soft-touch coating removed"
  - "switchgear refurbished"
  - "StickyNoMore service"
  - "ClimaRepair service"
  - "Macarbon refinish"
  - "Plasti Dip refinish"

keywords_concerning:
  - "sticky buttons"
  - "tacky knobs"
  - "soft-touch coating peeling"
  - "rubber coating coming off"
  - "gummy radio buttons"
  - "sticky HVAC controls"
  - "sticky climate control"
  - "buttons feel rubbery"

keywords_active_problem:
  - "buttons stuck"
  - "knobs falling apart"
  - "coating flaking off"
  - "switchgear coating disintegrating"

keywords_documented:
  - "switch replacement invoice"
  - "HVAC control unit receipt"
  - "Suncoast knob order"
  - "interior refurbishment records"
  - "StickyNoMore receipt"

evidence_basis: community_pattern
sources:
  - "[GP-CAY-HVAC] Go-Parts — 2003-2006 Porsche Cayenne HVAC Control: A Guide to Failures & Compatibility (specialist parts vendor with documented soft-touch-coating failure framing). Tier B"
  - "[GP-996-HVAC] Go-Parts — Porsche 911 (996) & Boxster (986) HVAC Control Guide: Fixing Dim Displays & Peeling Buttons (2003-2005) (Tier B anchor for the 996/986 population; explicitly identifies 'soft-touch rubberized paint failing' as the peeling failure mechanism). Tier B"
  - "[GP-958-HVAC] Go-Parts — 2010-2018 Panamera/Cayenne/Touareg HVAC Control Guide (Tier B anchor establishing soft-touch coating degradation on the 958 Cayenne and 970 Panamera; supersedes the earlier Tier-C-only 958-exemption framing). Tier B"
  - "[PEL-996-SW] Pelican Parts — Porsche 996 (1999-2005) Interior Switches catalog (parts catalog with full switch range; current 996 Radio Knob single price ~$24.25). Tier B"
  - "[DPP-996-SW] Delaware Porsche Parts — Porsche 996 Switches and Sensors (OEM parts catalog with cross-platform applicability notes). Tier B"
  - "[SUN-PCM3] Suncoast Porsche Parts — PCM 3.0 (987.2/997.2) Radio Knob Set (G2-specific replacement set marketed as a remedy for sticky G2 PCM knobs; vendor-side anchor for G2 PCM-knob failure persistence). Tier B"
  - "[REN-997-HOWTO] Rennlist How-Tos — Porsche 997: How to Repair Worn Climate Control Buttons (DIY guide for typeface wear and button refurb on 997 climate controls). Tier B"
  - "[MAC-RFB] Macarbon — 997/987 Gen1 Climate Control Switch Refinishing service (specialist refinisher with dedicated 997/987 product page). Tier B"
  - "[REN-997-STICKY] Rennlist Forum — Simple solution to the sticky / gummy radio button problem (multi-owner thread with historical Suncoast price reference, StickyNoMore reference, and the post-08 AC-control improvement commentary). Tier C"
  - "[REN-955-957] Rennlist Forum — Sticky buttons (cross-generation thread with one Tier-C-qualified comment about 958 hard-plastic buttons; treated as supporting context only since contradicted by [GP-958-HVAC] Tier B). Tier C"
  - "[6SO-997-STICKY] 6SpeedOnline Forum — sticky pcm radio knobs (997 owner thread). Tier C"
  - "[6SO-997-VIDEO] 6SpeedOnline Forum — Sticky Climate Control Buttons (Video) (997 DIY video reference). Tier C"
  - "[PEL-996-FORUM] Pelican Parts Forums — Gooey volume knob and other bits?? (996 owner thread). Tier C"
  - "[P9-RADIO-KNOBS] Planet-9 Forum — Removing sticky radio knobs (Boxster owner thread). Tier C"
  - "[P9-981-HVAC] Planet-9 Forum — Sticky Temperature Control Unit Buttons Cleaning DIY for 981 Boxster and Cayman (referenced for 981 deferral, not as in-scope source). Tier C"
  - "[PH-987-CLIMATE] PistonHeads — 987 / 987C / 997 climate button refurb (multi-owner thread with G2 distinction commentary and ClimaRepair references). Tier C"
  - "[PCGB-997.2] PCGB Forum — Sticky rotary switches on PCCM unit (997.2 owner thread documenting that G2 PCM knobs continue to develop the sticky-coating failure). Tier C"
  - "[911UK-STICKY] 911uk Forum — Sticky button cure (multi-owner thread). Tier C"

editorial_note: |
  Sticky cabin switchgear is a near-universal cosmetic-and-tactile
  pre-purchase finding on any in-scope Porsche from the affected
  generations and should be expected rather than treated as
  exceptional. The issue is essentially always present to some
  degree on a 15-plus-year-old original-switchgear example; the
  pre-purchase question is the extent of degradation, not whether
  the issue is present.

  The failure splits into two presentations on the same root
  cause, and the G2 (997.2 / 987.2) improvement applies to one but
  not the other. (1) AC/HVAC switches and rocker buttons peel and
  flake — Porsche updated this switchgear material on G2 cars
  (2009–2012), and those cars exhibit this presentation
  substantially less per Tier C reporting on PistonHeads
  [PH-987-CLIMATE] and elsewhere. (2) PCM radio rotary knobs go
  sticky/tacky — Porsche did NOT update the PCM-knob coating on
  G2 cars, and the failure continues to develop on 997.2 / 987.2
  examples per PCGB Forum owner reports [PCGB-997.2] and per
  Suncoast's continued sale of a G2-specific replacement knob set
  [SUN-PCM3] marketed explicitly as a sticky-knob remedy. The
  improvement is partial, not complete.

  Replacement procedures differ between platforms and generations
  in ways that affect DIY scope: 997.1 PCM knobs pull off without
  tools, while 997.2 PCM knobs require T6 torx removal under a
  pried-off center cap (per Tier C owner discussion). The Cayenne
  HVAC control unit is one of the more straightforward DIY items —
  the Go-Parts guides [GP-CAY-HVAC, GP-996-HVAC] characterize it
  as 1-out-of-5 difficulty.

  This is a shared VAG-group issue, not a Porsche-specific defect:
  the same soft-touch coating appears on contemporaneous
  Volkswagen Touareg, Audi, and Bentley vehicles, and the failure
  pattern is consistent across the platform. Per Go-Parts'
  2010–2018 Panamera/Cayenne/Touareg HVAC guide [GP-958-HVAC]
  this also includes the 958-generation Cayenne (and the
  970-generation Panamera, which the catalog includes in scope on
  the same Tier B anchor).

  The valuation impact of unmodified original sticky switchgear
  is small. Current OEM individual-knob pricing runs approximately
  $20–$60 each across Suncoast, Pelican Parts, and similar
  vendors; full HVAC control unit replacement is a 1-hour DIY job
  with used OEM units saving over $1,000 relative to new dealer
  pricing per Go-Parts; alcohol-and-soda cleaning costs nothing.
  Even a full interior switchgear refresh typically lands in the
  low hundreds of dollars. Most buyers should treat this as an
  expected condition item rather than a meaningful negotiation
  lever.

buyer_questions:
  - "Have any of the cabin switches, knobs, or HVAC controls been replaced or refurbished? Which items?"
  - "Are any of the switches, knobs, or trim surfaces currently sticky or tacky to the touch?"
  - "Has the HVAC control unit been replaced or repaired?"
  - "Are there any visible signs of soft-touch coating peeling, flaking, or disintegrating on the dashboard, switches, or trim?"
  - "Has the car been stored in a hot or high-UV climate that may have accelerated coating breakdown?"
```

---

## Considered and Not Included

The following items came up in the sourcing review and were considered
for inclusion but did not meet the bar for a flagged defect record at
this stage:

- **981 and 718 Boxster/Cayman (2013+) soft-touch coating issues.**
  Planet-9 [P9-981-HVAC] documents owner reports of sticky
  temperature control unit buttons on the 981 generation, which
  suggests the soft-touch coating issue may extend further than the
  996/Boxster/early Cayenne handoff scope. Deferred at this stage
  because: (a) the 981 fleet has only recently begun crossing the
  10-year-old threshold where the failure becomes pronounced; (b)
  Tier B specialist coverage has not yet developed; and (c) the
  catalog principle of conservative scoping in the absence of
  established prevalence patterns favors deferral. Worth revisit
  in a v2 pass as 981 cars age into the failure window.

- **991 and 992 sticky-coating issues.** No clear community pattern
  has surfaced in the sourcing review. The 991 (2012–2019) uses
  updated switchgear materials, and the 992 (2019+) is too new for
  age-driven coating degradation to have manifested. Out of scope
  of this record.

- **Soft-touch coating on dashboard trim, console trim, and other
  non-switch surfaces.** Owner reports reference stickiness on
  dashboard trim panels, center console bezels, and other large
  trim surfaces in addition to the switches and knobs covered
  here. The remediation path is similar (alcohol/soda cleaning;
  professional refinish; replacement panels for the worst cases)
  but the parts cost can be materially higher for large trim
  pieces. The current record's editorial note flags this as
  buyer-watch context but does not separately quantify; may
  warrant expansion if future research surfaces consistent cost
  data.

- **Steering wheel coating degradation.** A subset of cars in the
  affected generations have rubberized coating on the steering
  wheel grip area or on the steering wheel control buttons (cruise,
  audio). This is a closely related failure mode but the
  remediation path differs (steering wheel recore vs simple knob
  swap). Captured in the existing record's `keywords_concerning`
  array indirectly via "buttons feel rubbery" but may warrant a
  separate v2 record if specialist refinishing pricing data
  develops.

- **Shifter knob coating degradation.** Some affected cars use a
  rubberized shifter knob that exhibits the same failure mode.
  Replacement OEM shifter knobs are inexpensive and the issue is
  captured by the existing record's general framing; not flagged
  separately.

- **958 Cayenne (2011–2018) — moved into scope this revision.**
  Originally deferred at file-creation based on a single Tier C
  comment on Rennlist [REN-955-957] characterizing the 958 as
  using hard-plastic buttons. Review surfaced Tier B contradiction:
  Go-Parts' 2010–2018 Panamera/Cayenne/Touareg HVAC guide
  [GP-958-HVAC] explicitly states that the soft-touch coating on
  buttons of that era is known to degrade and become sticky or
  peel off. The 958 is now in the `applicability` block; the
  Rennlist commenter's "hard plastic" framing may apply to the
  gear-selector/center-console area but does not extend to the
  HVAC and PCM controls per the Tier B anchor. Retained here as a
  scoping-history note for future reviewers.

- **Volkswagen Touareg, Audi, Bentley cross-platform sticky
  buttons.** The same soft-touch coating appears on contemporaneous
  VAG-group vehicles (per Go-Parts' shared 2010–2018
  Panamera/Cayenne/Touareg guide [GP-958-HVAC] and per cross-
  platform owner reports). Out of scope of a Porsche-specific
  catalog but worth surfacing in editorial as context for buyers
  who may have seen the same issue on related vehicles.

If field experience or further sourcing surfaces clear specialist
consensus on any of these, they can be added in a v2 pass.

---

## Sources

[GP-CAY-HVAC] Go-Parts — 2003-2006 Porsche Cayenne HVAC Control: A Guide to Failures & Compatibility. Tier B.
https://www.go-parts.com/garage/hvac-control-porsche-cayenne-2003-2006

[GP-996-HVAC] Go-Parts — Porsche 911 (996) & Boxster (986) HVAC Control Guide: Fixing Dim Displays & Peeling Buttons (2003-2005). Tier B.
https://www.go-parts.com/garage/hvac-control-porsche-911-porsche-boxster-2003-2005

[GP-958-HVAC] Go-Parts — Panamera, Cayenne & Touareg HVAC Control Guide (2010-2018): Decoding Failures and Part Numbers. Tier B.
https://www.go-parts.com/garage/hvac-control-porsche-panamera-porsche-cayenne-volkswagen-touareg-2010-2018

[PEL-996-SW] Pelican Parts — Porsche 996 (1999-2005) Interior Switches catalog. Tier B.
https://www.pelicanparts.com/cat/r_996j/intdsh_interior-switches

[DPP-996-SW] Delaware Porsche Parts — Porsche 996 Switches and Sensors. Tier B.
https://www.delawareporscheparts.com/c-switches-and-sensors-996-179

[SUN-PCM3] Suncoast Porsche Parts — PCM 3.0 (987.2/997.2) Radio Knob Set. Tier B.
https://www.suncoastparts.com/product/SKUPCM3KNOB.html

[REN-997-HOWTO] Rennlist How-Tos — Porsche 997: How to Repair Worn Climate Control Buttons. Tier B.
https://rennlist.com/how-tos/a/porsche-997-how-to-repair-worn-climate-control-buttons-387181

[MAC-RFB] Macarbon — 997/987 Gen1 Climate Control Switch Refinishing service. Tier B.
https://www.macarbon.com/component/virtuemart/997-987-gen1-climate-control-swtich-refinishing-detail

[REN-997-STICKY] Rennlist Forum — Simple solution to the sticky / gummy radio button problem. Tier C.
https://rennlist.com/forums/997-forum/900020-simple-solution-to-the-sticky-gummy-radio-button-problem.html

[REN-955-957] Rennlist Forum — Sticky buttons (Cayenne 958 thread referencing 955/957 distinction). Tier C.
https://rennlist.com/forums/cayenne-958-2011-2018/1060680-sticky-buttons.html

[6SO-997-STICKY] 6SpeedOnline Forum — sticky pcm radio knobs (997). Tier C.
https://www.6speedonline.com/forums/997/217179-sticky-pcm-radio-knobs-997-a.html

[6SO-997-VIDEO] 6SpeedOnline Forum — Sticky Climate Control Buttons (Video). Tier C.
https://www.6speedonline.com/forums/997/443520-sticky-climate-control-buttons-video.html

[PEL-996-FORUM] Pelican Parts Forums — Gooey volume knob and other bits?? Tier C.
https://forums.pelicanparts.com/porsche-996-997-991-forum/680186-gooey-volume-knob-other-bits.html

[P9-RADIO-KNOBS] Planet-9 Forum — Removing sticky radio knobs (Boxster). Tier C.
https://www.planet-9.com/threads/removing-sticky-radio-knobs.239431/

[P9-981-HVAC] Planet-9 Forum — Sticky Temperature Control Unit Buttons Cleaning DIY for 981 Boxster and Cayman. Tier C.
https://www.planet-9.com/threads/sticky-temperature-control-unit-buttons-cleaning-diy-for-981-boxster-and-cayman.115243/

[PH-987-CLIMATE] PistonHeads — 987 / 987C / 997 climate button refurb. Tier C.
https://www.pistonheads.com/gassing/topic.asp?t=1531553

[PCGB-997.2] PCGB Forum — Sticky rotary switches on PCCM unit (997.2 owner thread documenting G2 PCM-knob failure persistence). Tier C.
https://www.porscheclubgb.com/forum/threads/sticky-rotary-switches-on-pccm-unit.217040/

[911UK-STICKY] 911uk Forum — Sticky button cure. Tier C.
http://www.911uk.com/viewtopic.php?p=1562643
