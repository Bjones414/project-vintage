# 01 — Engine Defects: M96 / M97 Water-Cooled Flat-Six (1997–2008)

The M96 and M97 are the water-cooled flat-six engines that powered the
volume Porsches of the late 1990s and 2000s: the 996 (1998–2005), 997.1
(2005–2008), Boxster 986 (1997–2004), Boxster 987.1 (2005–2008), Cayman
987.1 (2006–2008), and their respective S variants. Carrera, C4, C4S,
Targa, and base/S Boxster/Cayman trims all use M96/M97. **Mezger-engined
cars are NOT in scope here** — the GT3, GT2, and Turbo of this era use a
fundamentally different engine and are covered in `02_engine_mezger.md`.

The 9A1 direct-injection engine that replaced M96/M97 for the 2009 model
year (997.2 / Boxster 987.2 / Cayman 987.2) eliminates most of the
catastrophic failure modes documented below.

This file contains five flagged defects: IMS bearing, cylinder bore
scoring, rear main seal (RMS) leak, air-oil separator (AOS) failure, and
Variocam tensioner pad wear (5-chain engines only). A "considered and not
included" section at the end documents items deliberately omitted with
their rationale.

---

## Defect: IMS bearing failure

```yaml
id: m96_m97_ims_bearing
flag_title: "IMS bearing"
description: |
  The intermediate shaft (IMS) bearing supports a shaft that drives the
  camshafts. Factory bearings can fail catastrophically on M96/M97 engines.
  An LN Engineering retrofit eliminates or substantially reduces the risk
  and is widely considered standard preventative maintenance.

applicability:
  generation: [996.1, 996.2, 986, 987.1, 997.1]
  engine_family: [M96, M97]
  year_range: [1997, 2008]
  excludes:
    description: "Mezger-engined cars (GT3/GT2/Turbo) and 9A1+ engines have a different IMS architecture and are not subject to this failure mode. Mezger engines use oil-pressure-fed plain bearings on both ends of the intermediate shaft; the 9A1 has no intermediate shaft at all."
    engine_family: [Mezger, 9A1, 9A2, 9A3]

severity: catastrophic
# Failure typically destroys the engine; replacement engines often exceed
# the value of the car itself on volume Carrera/Boxster/Cayman trims.

cost_range_usd: [2000, 5000]
cost_source_anchor: |
  PCA Tech Q&A [5] reports a representative independent shop charging
  approximately $3,000 for a bundled service that combines IMS retrofit,
  rear main seal replacement, clutch replacement, and oil/filter change
  (the four jobs share the same transmission-out labor and are typically
  performed together). The $2,000–$5,000 range reflects the spread from
  labor-only IMS jobs at the low end to bundled IMS+RMS+clutch service
  at the upper end, and is higher on Tiptronic cars where engine removal
  is required. The $3,000 figure should not be read as an IMS-only cost.
# IMPORTANT: the $3,000 figure is for the bundled job, not for IMS alone.
# Buyers comparing quotes should confirm which line items are included.

prevalence_rate: "1–8% depending on bearing variant"
prevalence_source_anchor: |
  LN Engineering's IMS Bearing Problem Years page [1] establishes the
  variant-specific failure rates that have become the canonical figures
  in the specialist community: dual-row factory bearings (1997–early 2000)
  at under 1%, single-row factory bearings (2000–2005) at approximately
  8% under warranty (and higher out of warranty), and the larger
  non-serviceable bearing (late 2005–2008) at approximately 1%. The
  single-row 8% figure is also cited by Oregon Region PCA [3] as the
  finding from the Eisen class-action settlement documents.
# Dual-row bearings (1997–early 2000): under 1% failure rate.
# Single-row bearings (2000–2005): approximately 8% failure rate.
# Larger non-serviceable bearing (late 2005–2008): approximately 1%.
# See Schema Extensions in 00_schema.md for the v2 extension candidate
# that would split these into separate sub-population records.

failure_correlation: mixed
# Documented failures range from under 20,000 miles to over 200,000 miles.
# Garage-queen low-mileage cars have higher failure rates than
# regularly-driven cars (lubrication-related). Both age and use matter.

retrofit_available: yes
retrofit_kit_names:
  - "LN Engineering IMS Retrofit (ceramic hybrid bearing)"
  - "LN Engineering IMS Solution (oil-fed plain bearing, permanent fix)"
  - "RND RS Roller IMS Retrofit"

keywords_addressed:
  - "IMS Solution installed"
  - "IMS retrofit completed"
  - "IMS bearing replaced"
  - "IMS bearing upgraded"
  - "LN Engineering IMS"
  - "intermediate shaft bearing replaced"
  - "intermediate shaft bearing upgraded"
  - "ceramic hybrid IMS"
  - "IMS upgrade with clutch"

keywords_concerning:
  - "IMS not addressed"
  - "IMS bearing not done"
  - "original IMS bearing"
  - "IMS bearing concern"
  - "intermediate shaft has not been"
  - "no IMS work"

keywords_active_problem:
  - "metal in oil filter"
  - "metal shavings in oil"
  - "IMS failure"
  - "intermediate shaft failure"
  - "engine seizure"
  - "catastrophic engine failure"

keywords_documented:
  - "IMS Solution certificate"
  - "LN Engineering invoice"
  - "IMS retrofit invoice"
  - "with IMS service records"

evidence_basis: specialist_consensus
sources:
  - "[1] LN Engineering — IMS Bearing Problem Years. Tier B"
  - "[2] LN Engineering — Identifying and Fixing the Porsche IMS Bearing Problem. Tier B"
  - "[3] Oregon Region PCA — The Infamous IMS Saga. Tier A"
  - "[4] LN Engineering — IMS Bearing Replacement Costs. Tier B"
  - "[5] PCA Tech Q&A — How Much Should IMS/RMS/Clutch Service Cost? Tier A"
  - "[6] Rennlist Forum — Current IMS Bearing Replacement Cost (multiple shop quotes). Tier C"

editorial_note: |
  IMS is the single most-discussed pre-purchase question on M96/M97 cars.
  A documented IMS retrofit (especially the LN Engineering IMS Solution,
  which is a permanent fix) removes the largest catastrophic-failure risk
  on the engine. If the listing doesn't mention IMS work, ask. If the
  retrofit was done, ask which kit, when, at what mileage, and whether
  invoices are included. A car with an undocumented original IMS bearing
  isn't disqualifying — most cars are still fine — but it's a real risk
  the buyer should price in.

buyer_questions:
  - "Has the IMS bearing been replaced or upgraded? If so, with which kit, at what mileage, and when?"
  - "Can you provide invoices or service records for the IMS work?"
  - "If the original bearing is still in place, has the oil filter been inspected for bearing material at recent service?"
  - "If the car is from MY2000–2005, do you know whether it has the single-row or dual-row factory bearing?"
```

---

## Defect: Cylinder bore scoring

```yaml
id: m96_m97_bore_scoring
flag_title: "Cylinder bore scoring"
description: |
  The Lokasil cylinder lining can wear through, leading to scarring of the
  cylinder wall. Once started, the damage is not reversible. Repair
  requires full engine teardown and cylinder sleeving. Most common on
  3.4L, 3.6L, and 3.8L engines; the 2.5/2.7/3.2L engines rarely show it.

applicability:
  generation: [996.1, 996.2, 986, 987.1, 997.1]
  engine_family: [M96, M97]
  year_range: [1997, 2008]
  trim_category: [Carrera, Carrera_S, Carrera_4, Carrera_4S, Targa, Boxster_S, Cayman_S]
  excludes:
    - description: "2.5L and 2.7L base Boxster engines are largely immune to bore scoring per LN Engineering [2] and Flat 6 Innovations [F6I]."
      trim_category: [Boxster_base_2_5, Boxster_base_2_7]
    - description: "986 Boxster S 3.2L (MY2000–2004, M96/21) shares the smaller-displacement immunity. The Boxster S only becomes susceptible with the 987.1 3.4L (M97/21) introduced for MY2007 and the late-987.1 3.4L (M97/22). Distinguish by year_range and engine code, not by trim name alone."
      trim_category: [Boxster_S]
      year_range: [2000, 2004]

severity: catastrophic
# Repair requires engine removal, full disassembly, and cylinder sleeving.
# Cost typically exceeds the market value of a base Carrera or Boxster.

# cost_range_usd: omitted — see editorial. Specialist rebuilds with
# Nickies sleeves are quoted in the high-five-figure range, but ranges
# vary widely by builder and by extent of collateral damage.

prevalence_rate: "5–10% (sources disagree — see Conflicts Log; treated as 'common' for matcher logic)"
prevalence_source_anchor: |
  Two specialist-published prevalence figures bracket the catalog's
  range. Weissach UK's 997 bore scoring page [13] attributes a roughly
  10% figure to Porsche themselves, characterizing it as Porsche's own
  estimate of how often M96/M97 3.6L and 3.8L engines are affected.
  Atlantic Motorcar Center [7], citing GT Porsche Magazine (March 2015,
  Peter Morgan), derives an approximately 5% figure by comparing
  estimated specialist-rebuild and OPC-warranty replacement counts
  (~500 engines) against UK Porsche GB 996/997 sales 2004–2006 (~9,710
  cars). LN Engineering [2] and other specialists describe the
  prevalence as "relatively low" without quantifying. The 5–10% range
  reflects this spread.
# v1 matcher logic: treat as 'common' for not_mentioned purposes,
# triggering a small_discount on cars where the listing is silent. This
# resolves the boundary case at the edge of uncommon (1–10%) and common
# (10–50%) in favor of buyer protection — under-flagging a defect this
# prominent is a worse error than a small false-positive penalty.

failure_correlation: mixed
# Documented at all mileages, from under 20,000 to over 260,000. Cylinder
# 6 is most often affected (open-deck thermal stress). Short-trip driving
# patterns and extended oil change intervals worsen risk.

retrofit_available: preventive_only
# No bolt-in retrofit. Risk is reduced by frequent oil changes
# (5,000-mile / 6-month intervals), avoiding short trips, full warm-up
# before high-load driving, and used oil analysis to catch early signs.

keywords_addressed:
  - "engine rebuilt with Nickies"
  - "Nickies cylinders installed"
  - "Flat 6 Innovations rebuild"
  - "LN Engineering cylinders"
  - "cylinders sleeved"
  - "engine sleeved"

keywords_concerning:
  - "ticking on cold start"
  - "piston slap"
  - "uneven exhaust soot"
  - "one tail pipe sooty"
  - "elevated oil consumption"

keywords_active_problem:
  - "bore scoring confirmed"
  - "bore score detected"
  - "scored cylinder"
  - "aluminum in oil filter"
  - "cylinder cracking"
  - "d-chunk failure"
  - "coolant in oil"
  - "oil and coolant intermix"

keywords_documented:
  - "engine rebuild invoices"
  - "Nickies certificate"
  - "Flat 6 Innovations build sheet"
  - "borescope inspection report"

evidence_basis: specialist_consensus
sources:
  - "[F6I] Flat 6 Innovations — Cylinder Bore (Scoring). Tier B"
  - "[2] LN Engineering — M96/M97 Engine Failures. Tier B"
  - "[3RPM] RPM Specialist Cars — Porsche Bore Scoring Issues Explained. Tier B"
  - "[4PCA] PCA — Bore Scoring and How to Prevent It. Tier A"
  - "[7] Atlantic Motorcar Center — Porsche Cylinder Bore Scoring (citing GT Porsche Magazine). Tier B"
  - "[13] Weissach UK — Porsche 997 Bore Scoring: Causes, Symptoms, and Solutions. Tier B"

editorial_note: |
  Bore scoring is rarer than IMS but more often catastrophic when it
  appears, because there's no bolt-in fix — the engine must come out and
  the cylinders must be sleeved. Specialist sources estimate prevalence
  between roughly 5% and 10% of affected M96/M97 cars (sources disagree
  — see Conflicts Log), and the smaller-displacement engines (2.5L, 2.7L,
  3.2L) are largely unaffected. The diagnostic signs are subtle (uneven
  tailpipe soot, occasional cold-start ticking, gradual oil consumption
  increase) and often misdiagnosed as bad lifters. A pre-purchase oil
  analysis and a borescope of the cylinder bottoms (not just the top) is
  worth the inspection cost on any 3.4/3.6/3.8L M96/M97 car.

buyer_questions:
  - "Has the engine had a borescope inspection of the cylinder walls? At what mileage?"
  - "Has used oil analysis been performed recently? Can you share the report?"
  - "Has there ever been a tapping or ticking noise on cold start, or visibly sooty exhaust on one side?"
  - "What is the recent oil consumption rate (quarts per 1,000 miles)?"
```

---

## Defect: Rear main seal (RMS) leak

```yaml
id: m96_m97_rms_leak
flag_title: "Rear main seal leak"
description: |
  The seal where the crankshaft exits the engine commonly weeps oil on
  M96/M97 engines. Most cases are minor drips that don't threaten the
  engine. Repair requires transmission removal — almost always done at
  the same time as a clutch replacement to share labor.

applicability:
  generation: [996.1, 996.2, 986, 987.1, 997.1]
  engine_family: [M96, M97]
  year_range: [1997, 2008]

severity: low
# A persistent weep on the garage floor. Severe cases can contaminate the
# clutch friction plate, but the failure mode is gradual, not sudden.

# cost_range_usd: omitted — almost always combined with IMS retrofit
# and/or clutch replacement (see m96_m97_ims_bearing entry for the
# bundled-job cost range).

prevalence_rate: "common"
prevalence_source_anchor: |
  RPM Specialist Cars characterizes RMS leaks as common across the M96
  and M97 family on its dedicated RMS replacement service page [8]. The
  specialist consensus across LN Engineering [LN-RMS], Stuttgart Autohaus
  [SA], and forum-aggregated owner reports is consistent: RMS weeping is
  routine on these engines, Porsche revised the seal multiple times
  across production, and the current PTFE design is more reliable when
  correctly installed.
# Multiple Tier B specialists (LN Engineering, RPM Specialist Cars,
# Stuttgart Autohaus) describe it as common. Porsche revised the seal
# multiple times across production; the current PTFE design is more
# reliable when correctly installed.

failure_correlation: mileage
# Most common past 60,000 miles, but documented on lower-mileage cars too.
# Some early 996/Boxster engines had crankcase machining issues that
# caused repeated leaks even after seal replacement.

retrofit_available: yes
retrofit_kit_names:
  - "Genuine Porsche updated PTFE rear main seal"

keywords_addressed:
  - "RMS replaced"
  - "rear main seal replaced"
  - "PTFE seal installed"
  - "updated rear main seal"

keywords_concerning:
  - "small RMS leak"
  - "minor oil weep"
  - "rear main seal weeping"
  - "drip from bell housing"
  - "RMS leak not addressed"

keywords_active_problem:
  - "clutch slipping due to oil"
  - "oiled clutch friction plate"
  - "significant RMS leak"

keywords_documented:
  - "RMS replacement invoice"
  - "clutch and RMS service records"

evidence_basis: specialist_consensus
sources:
  - "[LN-RMS] LN Engineering — How Common is a Porsche RMS Failure? Tier B"
  - "[8] RPM Specialist Cars — Porsche RMS Replacement Service. Tier B"
  - "[SA] Stuttgart Autohaus — Porsche Rear Main Seal Leak Causes and Symptoms. Tier B"
  - "[6] Rennlist Forum — Small RMS leak (multiple owner reports). Tier C"

editorial_note: |
  RMS is the most common oil leak on M96/M97 engines and rarely a serious
  problem on its own — it's typically a slow weep, not a flood. The
  practical question is whether it's been addressed alongside an IMS
  retrofit or clutch replacement, since the labor to access it is
  significant and bundling makes economic sense. A small RMS leak on a
  car with documented clutch and IMS work is a low-priority item; a small
  RMS leak on a car with no IMS work done is a missed opportunity. Note
  that what appears to be an RMS leak can actually be the IMS flange seal
  leaking, which is a more concerning signal.

buyer_questions:
  - "Has the rear main seal been replaced? At what mileage and during what other service?"
  - "Was the leak source confirmed as the RMS specifically, or could it be the IMS flange seal?"
  - "If the clutch has been replaced, was the RMS done at the same time?"
```

---

## Defect: Air-oil separator (AOS) failure

```yaml
id: m96_m97_aos_failure
flag_title: "Air-oil separator failure"
description: |
  The AOS separates oil mist from crankcase vapors before they re-enter
  the intake. When its internal diaphragm tears, crankcase vacuum rises
  and oil gets pulled into the intake, causing white smoke and rough idle.
  In severe cases, enough oil enters a cylinder to cause hydrolock.

applicability:
  generation: [996.1, 996.2, 986, 987.1, 997.1]
  engine_family: [M96, M97]
  year_range: [1997, 2008]

severity: moderate
# Replacement parts are inexpensive but labor is significant — the AOS
# sits behind the intake plenum on most M96/M97 cars and access is
# constrained.

cost_range_usd: [800, 1500]
cost_source_anchor: |
  Pelican Parts' AOS replacement technical article [10] documents the
  procedure and notes typical labor in the 4–8 hour range; OEM AOS parts
  are well under $200 at most parts retailers (Pelican, FCP Euro). At
  independent specialist labor rates of $120–$180 per hour, this brackets
  professional installation between approximately $800 (4 hours at the
  low rate) and approximately $1,500 (8 hours at the high rate plus
  parts). Tiptronic-equipped cars sit at the upper end due to additional
  access constraints. Owner-reported figures on 6SpeedOnline [9] (an
  approximate $900 quote for an 8-hour job) fall within this Tier B
  reasoning and are noted as a consistency footnote.
# Tier B reasoning is the load-bearing source for this cost range; the
# Tier C forum quote is consistent, not load-bearing.

prevalence_rate: "common"
prevalence_source_anchor: |
  Multiple specialist and DIY sources describe AOS failure as routine on
  M96/M97 engines. Pelican Parts [10], Carpokes [11], and 911uk [12] all
  maintain replacement walkthroughs, and LN Engineering's M96/M97 failure
  modes summary [2] discusses AOS-induced hydrolock as one of the engine
  family's recognized failure pathways. The pattern across these sources
  is that most M96/M97 cars need at least one AOS replacement in their
  lifetime, with track-driven cars failing earlier.
# No single Tier B source quantifies a percentage; multiple sources
# describe the issue as routine maintenance rather than a statistical
# outlier. "Common" reflects this consensus without overclaiming a
# specific rate.

failure_correlation: age
# Diaphragm material fatigues over time more than with mileage. Track use
# accelerates failure significantly because the stock AOS cannot handle
# the additional crankcase pressure load.

retrofit_available: preventive_only
retrofit_kit_names:
  - "Genuine Porsche updated AOS (multiple revisions through production)"
  - "Motorsports AOS by LN Engineering (track use)"

keywords_addressed:
  - "AOS replaced"
  - "air oil separator replaced"
  - "new AOS installed"
  - "oil separator replaced"

keywords_concerning:
  - "occasional white smoke"
  - "smoke on cold start"
  - "rough idle"
  - "AOS not addressed"

keywords_active_problem:
  - "AOS failure"
  - "massive smoke cloud"
  - "smoke after hard cornering"
  - "engine smoking heavily"
  - "hydrolock"

keywords_documented:
  - "AOS replacement invoice"
  - "with AOS service records"

evidence_basis: specialist_consensus
sources:
  - "[10] Pelican Parts — Porsche 911 Air Oil Separator Replacement (technical article). Tier B"
  - "[11] Carpokes — 996 Air Oil Separator replacement. Tier B"
  - "[12] 911uk.com — 996 Air Oil Separator (DIY documentation). Tier B"
  - "[2] LN Engineering — M96/M97 Engine Failures (hydrolock discussion). Tier B"
  - "[9] 6SpeedOnline Forum — How to change the oil separator (owner-reported figures, consistency footnote). Tier C"

editorial_note: |
  AOS replacement is closer to scheduled maintenance than failure on these
  cars — most M96/M97 engines need at least one AOS in their lifetime,
  and many have had multiple. A car with no AOS history at high mileage
  is overdue rather than broken. The signal that matters is whether a
  recent AOS replacement is documented (no immediate concern) or whether
  the listing mentions occasional cold-start smoke without acknowledging
  the AOS (likely an active or imminent failure).

buyer_questions:
  - "Has the AOS been replaced? At what mileage and how long ago?"
  - "Does the car ever smoke on cold start or after hard cornering?"
  - "What is the current oil consumption rate?"
```

---

## Defect: Variocam tensioner pad wear (5-chain engines only)

```yaml
id: m96_variocam_pad_wear
flag_title: "Variocam pad wear (5-chain)"
description: |
  Early M96 engines (the "5-chain" variant) use plastic Variocam tensioner
  pads that wear over time. Severely worn pads can shed plastic debris
  into the oil and disrupt cam timing. The fix requires accessing the
  cam covers — typically performed alongside other engine-out work to
  share labor.

applicability:
  generation: [996.1, 986]
  engine_family: [M96]
  year_range: [1997, 2002]
  excludes:
    description: "MY2002 onward 996 (the 996.2 with the 3.6L M96/03) and MY2003 onward Boxster transitioned to the 3-chain Variocam architecture and do not have this specific pad-wear issue. The 5-chain engines are: 1997–2002 Boxster (2.5L, 2.7L) and 1999–2001 911 (3.4L M96/01, M96/02, M96/04)."
    year_range: [2002, 2008]
    trim_category: [Carrera_3_6, Boxster_2_7_post_2003]

severity: moderate
# Cam timing deviation greater than ~4 degrees is the typical threshold
# at which replacement is recommended. The pads themselves are
# inexpensive but access is involved.

# cost_range_usd: omitted — typically performed alongside IMS, AOS, or
# clutch service rather than as a standalone job. Standalone replacement
# can technically be done with the engine in the car but most shops
# bundle it with engine-out service.

prevalence_rate: "common on high-mileage 5-chain engines"
prevalence_source_anchor: |
  LN Engineering's M96/M97 engine failures summary [2] documents the
  Variocam tensioner pad wear pattern on 5-chain engines, identifying
  cam timing deviation greater than 4 degrees as the threshold at which
  pad replacement is recommended, and noting that Porsche issued a
  revised pad part (996 105 253 00) for the affected engines. Carpokes'
  AOS technical article [11] also references the 5-chain vs 3-chain
  distinction in passing as a known sub-generation issue.
# Specialists describe pad wear as expected at high mileage on 5-chain
# engines rather than as a defect — the part wears as designed, but the
# wear rate is faster than the engine's service life and replacement is
# part of the engine's long-term maintenance arc.

failure_correlation: mileage
# Wear progresses with miles and engine cycles rather than with calendar
# age. Cars driven hard accumulate wear faster.

retrofit_available: yes
retrofit_kit_names:
  - "Porsche revised timing chain rail set, part 996 105 253 00 (two sets required per engine)"

keywords_addressed:
  - "Variocam pads replaced"
  - "timing chain rails replaced"
  - "Variocam service done"
  - "chain guide rails replaced"

keywords_concerning:
  - "Variocam wear"
  - "cam timing deviation"
  - "chain rattle"

keywords_active_problem:
  - "Variocam fault"
  - "cam timing code"
  - "P0341"
  - "P0344"
  - "plastic debris in oil"

keywords_documented:
  - "Variocam replacement invoice"
  - "timing chain rail invoice"

evidence_basis: specialist_consensus
sources:
  - "[2] LN Engineering — M96/M97 Engine Failures. Tier B"
  - "[11] Carpokes — 996 Air Oil Separator replacement (5-chain reference). Tier B"

editorial_note: |
  This flag applies only to the 5-chain M96 engines: 1997–2002 Boxster
  (2.5L, 2.7L) and 1999–2001 911 (3.4L). Later 3-chain engines do not
  have this specific issue. On a high-mileage 5-chain car, ask whether
  the Variocam tensioner pads have been replaced — particularly if the
  car is approaching or past 100,000 miles or has had any cam timing
  diagnostic codes. The job is most economically performed alongside
  IMS, AOS, or clutch service, since access to the cam covers shares
  labor with those procedures.

buyer_questions:
  - "Have the Variocam tensioner pads (timing chain rails) been replaced?"
  - "Has the engine ever shown cam timing deviation codes (P0341, P0344, similar)?"
  - "Was the Variocam service performed alongside other engine-out work?"
```

---

## Conflicts Log

Defects in this file with source disagreement worth tracking forward:

### Bore scoring prevalence (5–10%)

- **Weissach UK [13]** attributes a roughly 10% figure to Porsche
  themselves. Weissach UK does not cite the Porsche AG source document
  directly, so the upstream attribution chain is one step removed.
- **Atlantic Motorcar [7]**, citing GT Porsche Magazine (March 2015,
  Peter Morgan), estimates approximately 5%, derived from comparing
  estimated specialist rebuild and OPC warranty replacement counts (~500)
  against UK Porsche GB 996/997 sales 2004–2006 (~9,710 cars). RPM
  Specialist Cars [3RPM] reproduces the same GT Porsche figure.
- **LN Engineering [2]**, **Hartech** (referenced by RPM Specialist Cars),
  and **Flat 6 Innovations [F6I]** describe the failure as "relatively
  low" prevalence without quantifying.

Recorded as `5–10%` range. The lower figure is better-sourced
methodologically (a stated calculation); the higher figure has more
authority (attributed to Porsche AG). Neither is definitively verifiable
to a primary Porsche AG document.

**v1 matcher decision:** Treat as `common` (not `uncommon`) for
`not_mentioned` purposes, applying a `small_discount` on cars where the
listing is silent. The decision favors buyer protection — under-flagging
a defect this prominent on M96/M97 cars is a worse error than a small
false-positive penalty on cars that don't actually have the issue.

---

## Considered and Not Included

The following items came up in the sourcing review and were considered
for inclusion but did not meet the bar for a flagged defect record at
this stage. Documented here for transparency:

- **Coolant expansion tank cracking.** Plastic expansion tanks develop
  hairline cracks at the seam with age (typically 10+ years), causing
  slow coolant loss. Routinely discussed by Pelican Parts, RPM
  Specialist Cars, and PCA. Cheap to fix (~$200–$400 parts + labor) and
  on the standard pre-purchase checklist for any 996/Boxster. Considered
  closer to a service item than a flag-worthy defect at this stage. May
  be added in a v2 pass if the catalog adopts a "service item due"
  category.

- **Water pump (60–80k mile service interval).** Routine scheduled
  maintenance item rather than a defect. Failure to perform on schedule
  can lead to overheating, but this is captured by general service
  history signals rather than a per-item flag. Not a candidate for v1.

- **Coil pack failures.** Common across the M96/M97 family but also
  across most modern Porsche engines. Cross-applicable rather than
  M96/M97-specific; will be authored once at the shared-water-cooled-era
  level (`99_shared_water_cooled_era.md`) rather than duplicated here.

- **Secondary air injection (SAI) failure (P0410, P1411 codes).** Real
  and well-documented, but not M96/M97-specific — applies similarly to
  993, M96, M97, and Mezger cars. Will be authored once at the
  shared-water-cooled-era level rather than duplicated per engine
  family.

- **MAF sensor failure.** Common but generic to many engines and
  inexpensive to replace. Below the "knowledgeable buyer would want to
  ask" bar.

- **Cylinder head cracking / D-chunk failure.** Real and catastrophic
  but typically a downstream consequence of unaddressed bore scoring or
  cooling-system neglect, not an independent failure mode. Captured by
  the bore scoring record's `keywords_active_problem` array (which
  includes "cylinder cracking", "d-chunk failure", "coolant in oil",
  "oil and coolant intermix"). Splitting into a separate record was
  considered and rejected because the failure pathway and mitigation
  overlap substantially with bore scoring.

If field experience surfaces a clear specialist consensus that any of
these warrants its own record, they can be added in a v2 pass.

---

## Sources

Full source URLs for the citations used above. Tier indicators match the
convention in the decade reference docs.

[1] LN Engineering — IMS Bearing Problem Years. Tier B.
https://lnengineering.com/products/the-definitive-guide-and-faq-for-porsche-ims-bearings/porsche-ims-bearing-problem-years/

[2] LN Engineering — M96/M97 Engine Failures and Solutions. Tier B.
https://lnengineering.com/products/watercooled-porsche-cylinders-sleeves-and-pistons/porsche-boxster-cayman-and-911-model-years-1997-2008/porsche-m96-m97-engine-failures-and-solutions/

[3] Oregon Region PCA — The Infamous IMS Saga. Tier A.
https://www.oregonpca.org/ims-saga/

[4] LN Engineering — IMS Bearing Replacement Costs. Tier B.
https://lnengineering.com/products/the-definitive-guide-and-faq-for-porsche-ims-bearings/porsche-ims-bearing-replacement-costs/

[5] PCA Tech Q&A — How Much Should IMS/RMS/Clutch Service Cost? Tier A.
https://www.pca.org/tech/how-much-should-ims-rms-clutch-service-cost-1582143251

[6] Rennlist Forum — Current IMS Bearing Replacement Cost. Tier C.
https://rennlist.com/forums/boxster-and-boxster-s-986-forum/1312753-current-ims-bearing-replacement-cost.html

[7] Atlantic Motorcar Center — Porsche Cylinder Bore Scoring (citing GT Porsche Magazine). Tier B.
https://atlanticmotorcar.com/casestudies/porsche-cylinder-bore-scoring-our-thoughts-on-this-the-simple-truth/

[8] RPM Specialist Cars — Porsche RMS Replacement Service. Tier B.
https://www.rpmspecialistcars.co.uk/service/rms-replacement/

[9] 6SpeedOnline Forum — How to change the oil separator. Tier C.
https://www.6speedonline.com/forums/996/110424-how-change-oil-seperator.html

[10] Pelican Parts — Porsche 911 Air Oil Separator Replacement (996/997). Tier B.
https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/09-ENGINE-Air_Oil_Separator/09-ENGINE-Air_Oil_Separator.htm

[11] Carpokes — 996 Air Oil Separator replacement. Tier B.
https://carpokes.com/viewtopic.php?t=2817

[12] 911uk.com — 996 Air Oil Separator. Tier B.
https://911uk.com/porsche/996-air-oil-separator.127632/

[13] Weissach UK — Porsche 997 Bore Scoring: Causes, Symptoms, and Solutions. Tier B.
https://www.weissachuk.com/porsche-997-bore-scoring-causes-symptoms-and-solutions/

[F6I] Flat 6 Innovations — Cylinder Bore (Scoring). Tier B.
https://flat6innovations.com/cylinder-bore-scoring/

[3RPM] RPM Specialist Cars — Porsche Bore Scoring Issues Explained. Tier B.
https://www.rpmspecialistcars.co.uk/porsche-bore-scoring/

[4PCA] PCA — Bore Scoring and How to Prevent It. Tier A.
https://www.pca.org/news/bore-scoring-how-to-prevent-it

[LN-RMS] LN Engineering — How Common is a Porsche RMS Failure? Tier B.
https://docs.lnengineering.com/article/107-how-common-is-a-porsche-rms-failure-and-how-do-i-prevent-one

[SA] Stuttgart Autohaus — Porsche Rear Main Seal Leak Causes and Symptoms. Tier B.
https://www.stuttgart-autohaus.com/post/porsche-rear-main-seal-leak-causes-symptoms-and-affected-models
