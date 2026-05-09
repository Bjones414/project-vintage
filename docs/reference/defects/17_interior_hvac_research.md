# File 17 Research Notes — Interior + HVAC Systems
## Project Vintage / Porsche Defect Catalog

**Session date:** 2026-05-07
**Version:** Final — post-independent-review adjudication (7 findings reviewed; 6 accepted, 1 reversed)
**Status:** Research complete — ready to author
**Confirmed records:** 7
**Declined candidates:** 6

---

## State Confirmation

FILE 16 is last completed. File 17 is unstarted. ✅

---

## Confirmed Records

| Draft ID | Title | Generations | Evidence Basis |
|---|---|---|---|
| INT_HVAC_17_001 | HVAC blower motor and regulator failure | 996.1/996.2/997.1/997.2/986/987.1/987.2/cayenne_955/957 | specialist_consensus |
| INT_HVAC_17_002 | A/C compressor seizure with system contamination | 996.1/996.2/997.1/997.2/986/987.1/987.2/cayenne_955/957 | specialist_consensus |
| INT_HVAC_17_003 | Blend door actuator failure | cayenne_955/957 (primary); 996.1/996.2/997.1/997.2/986/987.1/987.2 | community_reported |
| INT_HVAC_17_004 | Seat heater element and wiring failure | 996.1/996.2/986/997.1/997.2/987.1/987.2; cayenne_955/957/958 | community_reported |
| INT_HVAC_17_005 | Clock spring / spiral cable failure | 996.1/996.2/986/997.1/997.2/987.1/987.2/991.1/991.2/981; cayenne_955/957 | specialist_single_source |
| INT_HVAC_17_006 | Headliner delamination and sag | 987.1/987.2/981/718; cayenne_955/957 (secondary) | community_reported |
| INT_HVAC_17_007 | Door panel delamination (adhesive failure) | 991.1/991.2/992.1/992.2/981/718 | specialist_single_source |

---

## Candidate Assessments

---

### 1 — HVAC Blower Motor + Regulator Failure ✅ CONFIRM

**Tier B sourcing confirmed:**
- Pelican Parts tech article: Porsche Cayenne HVAC Blower Fan and Regulator Replacement (2003–2008) — states blower motor/regulator is "usually to blame when the fan works intermittently or only at one speed." [B1]
- Pelican Parts tech article: Porsche 996/997 HVAC Motor Replacement — confirms glovebox removal required on 997.1+. [B2]
- Rennlist Cayenne 955/957 thread documents regulator (P/N 95557234102) as high-frequency replacement item; parts sourced through Pelican. [C8]
- RepairPal Cayenne blower motor replacement: **$1,194–$1,291** all-in. [C1]

**Scope decisions:**
- Combine blower motor and regulator into one record. Pelican treats them as unified; regulator failure (fan works only at highest speed) is the cheaper sub-mode, full motor failure is more expensive. Distinguish in description.
- Combine Cayenne and sport-car platforms in one record with generation list. Part number 996.573.923.00 spans 911/Boxster/Cayman 1997–2012. Cayenne 955/957 is highest reported frequency.
- Cost range: ~$300–$1,300 depending on platform and failure mode (regulator only vs. full motor replacement).

**Cross-references for authoring:**
- File 16 → BODY_ROOF_16_002 (cayenne_958 sunroof motor): cross-reference only if authored description explicitly addresses the sunroof drain water intrusion → HVAC box damage pathway. Do not add speculatively.

---

### 2 — A/C Compressor Seizure with System Contamination ✅ CONFIRM

**Tier B sourcing confirmed:**
- Pelican Parts 996/997 A/C maintenance article discusses seized compressors as a known failure mode. [B5]
- Griffiths Technical (Kuehl brand) — specialist A/C supplier for 986/987/996/997; documents the compressor failure and system-contamination mechanism in their AC System Troubleshooting Guide. Primary specialist Tier B source for this record. [B6]
- RepairPal Porsche 911 compressor: **$1,306–$1,496** (compressor-only; not to be used as cost anchor). [C3]
- RepairPal Porsche Cayenne compressor: **$1,331–$2,473** (compressor-only; not to be used as cost anchor). [C4]

**Key defect detail:** Catastrophic internal failure disperses metal debris throughout the A/C system. Replacement requires simultaneous receiver/dryer and orifice-tube replacement; failure to do so destroys the new compressor. Confirmed across Griffiths and Pelican sources.

**Cost authoring direction (Finding 7 resolution):**
- Set `severity: moderate`. Full contamination scenario (compressor + receiver/dryer + orifice tube + system flush + recharge) at independent specialist rates: **$1,500–$3,500** for 911/Boxster/Cayman; Cayenne may push toward the upper bound but remains within the moderate tier.
- `cost_range_usd` must reflect the **full contamination scenario**, not compressor-only. Use Griffiths [B6] for parts order-of-magnitude. Do not anchor to RepairPal compressor-only figures.
- Description must explicitly state: compressor replacement alone is insufficient if debris has propagated; receiver/dryer and orifice tube replacement are required simultaneously.

**Note:** "Black Death" as a named term applies to the 964-era version of this failure per Go-Parts. Water-cooled era compressors share the same mechanism but the term is not established in water-cooled specialist sources — use descriptive language only.

**Cross-references for authoring:**
- File 12: fan resistor pack record (File 12 record 4 per PROJECT_STATE). # TODO: confirm record ID from File 12 before finalizing.

---

### 3 — Blend Door / HVAC Actuator Failure ✅ CONFIRM (community_reported)

**Sourcing:**
- Rennlist Cayenne 955/957 thread documents passenger-side temperature control servo failure in 2006 Cayenne S — no heat on passenger side with blower and A/C working normally. Access via glovebox removal.
- Cayenne Forums: dealer diagnosis of temperature control servo failure in 2004 Cayenne Turbo; both driver and passenger servos replaced for $809 total ($201/unit + $407 labor).
- RepairPal Cayenne blend door actuator: **$335–$375** (standard) or **$615–$671** (air door actuator variant). [C2]

**Cost authoring direction (Finding 3 resolution):**
- `cost_range_usd` and `cost_source_anchor` must be **omitted entirely**. All cost figures are Tier C sole-sourced (RepairPal [C2] only); the locked principle prohibits Tier C sole-source for cost fields.
- The Cayenne Forum $809 figure may appear in description as a community-reported order-of-magnitude reference only — not as a sourced cost field value.
- If a Tier B source is located during authoring, cost fields may be revisited.

**Scope:** Cayenne 955/957 has the strongest evidence. Include 996.x/997.x/986/987.x in applicability but note Cayenne as highest-frequency generation. Repair on some variants requires airbag and dashboard disassembly — note labor intensity in editorial_note.

---

### 4 — Seat Heater Element and Wiring Failure ✅ CONFIRM (community_reported)

**Sourcing:**
- 6SpeedOnline 996 forum: actual dealer warranty repair with part numbers — backrest element P/N 996-521-531-01 ($106), labor 1.3 hr. [C9]
- Rennlist 996 forum: element and foam replacement documented; Cayenne element noted as sewn into leather at higher dealer cost (~$2,200).
- PistonHeads: specialist commenter mentions **a Porsche TSB for the 996 covering a wiring chafing remedy** — harness passes under the seat rail and chafes as the seat moves fore/aft. [C10]

**TSB note (unverified — must be flagged in record):** The PistonHeads reference is Tier C and the TSB itself was not located during research. The authored record must not cite this as confirmed sourcing. Check NHTSA/PCNA TSB database during authoring. If found, record upgrades from `community_reported` to `specialist_single_source` or `manufacturer_acknowledged`.

**Failure modes to distinguish in description:**
- Heating element failure (no heat, intermittent) — most common
- Wiring harness chafing under seat rail (996-specific pattern per unverified TSB)
- Module/system lockout after power interruption (997-specific reset requirement) — not a failure; exclude from record scope

**Cross-references for authoring:**
- File 11 or File 21: electrical record covering underseat wiring or fuse failures. # TODO: confirm record ID from File 11 or 21 before finalizing.

---

### 5 — Airbag Clock Spring / Spiral Cable Failure ✅ CONFIRM

**Applicability (Finding 1 resolution):** 996/986 are in scope. The initial summary table had these missing; corrected throughout. Record 5 covers **996.1/996.2/986/997.1/997.2/987.1/987.2/991.1/991.2/981; cayenne_955/957**.

**Tier B sourcing confirmed:**
- Pelican Parts tech article: Porsche 997.2 Clock Spring Steering Sensor Replacement — covers procedure; confirms PIWIS recalibration required after replacement. [B3]
- Pelican Parts tech article: Porsche 991.1 Clock Spring Steering Sensor Replacement. [B4]
- RepairPal Porsche 911 air bag clockspring replacement — confirms failure mode (wire fatigue, SRS light, horn loss, steering wheel control loss). [C5]

**Safety significance:** Active SRS fault disables airbag deployment. This is a safety item.

**Critical authoring requirement — 996/986 SRS distinction:** On 996/986, the most common SRS warning light cause is **seat belt buckle failure and under-seat connector corrosion** — not the clock spring. A Porsche repair kit exists for the connector issue (documented in Rennlist 986/996 Official Airbag Light FAQ). The authored description, editorial_note, and buyer_questions must make this distinction explicit to avoid miscalibrating the `not_mentioned` penalty on 996/986 listings.

**Additional authoring requirement:** Record must note that PIWIS recalibration is required after clock spring replacement on 997.2 and 991.x.

**Cross-references for authoring:**
- File 11 (Electrical): SRS-related electrical record. # TODO: confirm record ID from File 11 before finalizing.

---

### 6 — Headliner Delamination and Sag ✅ CONFIRM (community_reported)

**Sourcing:**
- Planet-9: extensive threads across 987/981/718 and Cayenne 955/957. Independent upholstery shop: **$300–$1,250**. Dealer: **$1,750–$3,900** (alcantara). [C6]
- Grassroots Motorsports: Cayman headliner sag documented after 10 years. [C11]
- Rennlist Cayenne 955/957: rear headliner section sagging in 06 Turbo Cayenne.
- Planet-9: LA garage-kept 2007 987 experienced sag — not limited to hot climates.

**986 cabriolet scope — hard rule (Finding 6 resolution):**
The 986 cabriolet fabric-clip headliner separation is **explicitly out of scope for Record 6** and belongs exclusively in File 07. Record 6 description must not use language broad enough to encompass cabriolet headliner behavior.

**Generation scope:** 987.1/987.2/981/718 for coupe/Targa headliner backing-board delamination. Cayenne 955/957 as secondary. 986 explicitly excluded.

**Climate note:** Desert/UV amplification is plausible but not sourced to Tier B. Do not populate `regional_amplification` without a Tier B source discussing this specifically.

---

### 7 — Door Panel Delamination (Adhesive Failure) ✅ CONFIRM

**Evidence basis (Finding 5 resolution):** `specialist_single_source`. The PCA Tech Q&A is Tier A but `manufacturer_acknowledged` implies Porsche AG/PCNA formal acknowledgment (recall, TSB, or official statement) — which does not exist here. The root cause is a German Environmental Agency regulatory mandate external to Porsche. Correct `evidence_basis` is `specialist_single_source`.

**Sourcing:**
- PCA Tech Q&A — 2014 981 Door Delamination (pca.org/tech/2014-981-door-delamination): states this is a common issue for 991, 992, 981 and 718 owners caused by the German Environmental Agency mandating a switch from solvent-based to water-based adhesive for enclosed-environment applications. [A1]
- PCarwise — Cayenne common problems documentation. [B7]
- Planet-9: multiple threads confirm 981, 718, 991.2 all affected. Pedro's Garage (Tampa, FL) is the named specialist repair vendor. [C7]

**File 08 boundary — must be explicit in record:** File 08 covers rubberized button coating turning sticky. Record 7 covers door panel outer skin delaminating and warping away from the backing panel — different material, different failure mechanism, different repair. Explicitly distinguish with a cross-reference to File 08.

**Cost:** Community-reported Tier C only — dealer ~$3,000–$8,000 for both panels; specialist repair ~$350–$600/pair. Do not use as `cost_range_usd` anchor without Tier B backing.

**Cross-references for authoring:**
- File 08: sticky button coating record. # TODO: confirm record ID from File 08 before finalizing.

---

## Declined Candidates

| Candidate | Reason |
|---|---|
| Dashboard cracking, water-cooled era | No Tier B or Tier C pattern specific to 996/986. Air-cooled era → File 23. |
| 981/718 sticky soft-touch coating | The documented defect is door panel delamination (Record 7). Sticky buttons → File 08. |
| 991/992 leather stitching wear | No Tier B defect framing. Normal wear. Decline. |
| Steering wheel leather wear | Normal wear. No catalogued failure mode. Decline. |
| Cup holder mechanism failure | No population-level Tier B or Tier C evidence. Decline. |
| Trunk liner / seat belt latches | No population-level evidence. 996/986 buckle failures belong in File 11 scope. |

---

## Scope Boundary Decisions (All Resolved)

| Question | Decision |
|---|---|
| Blower motor vs. resistor/regulator | Single record; resistor failure called out as cheaper sub-mode in description |
| Cayenne HVAC vs. 911/Boxster HVAC | Single record per system; Cayenne 955/957 noted as highest frequency |
| Dashboard cracking, water-cooled | Declined. Air-cooled era → File 23 |
| 981/718 soft-touch vs. delamination | Reframed as door panel delamination (Record 7); File 08 boundary maintained |
| 986 cabriolet headliner | Hard rule: out of scope for Record 6; belongs exclusively in File 07 |
| Headliner scope | 987.1/987.2/981/718 coupe/Targa; 986 excluded |
| Clock spring 996/986 inclusion | In scope; editorial note required distinguishing dominant 996/986 SRS cause |
| Record 7 evidence_basis | `specialist_single_source`; not `manufacturer_acknowledged` |
| Record 3 cost fields | Omitted entirely (Tier C sole-source violation) |
| Record 2 cost anchor | Full contamination scenario via Griffiths [B6]; severity `moderate` |

---

## Cross-Reference Resolution Status

| Record | Target File | Target Record ID | Status |
|---|---|---|---|
| INT_HVAC_17_001 | File 16 | BODY_ROOF_16_002 | Conditional — only if sunroof drain → HVAC pathway is explicitly authored |
| INT_HVAC_17_002 | File 12 | File 12 record 4 (fan resistor pack) | # TODO: confirm ID from File 12 |
| INT_HVAC_17_004 | File 11 or 21 | Underseat wiring / fuse record | # TODO: confirm ID from File 11 or 21 |
| INT_HVAC_17_005 | File 11 | SRS-related electrical record | # TODO: confirm ID from File 11 |
| INT_HVAC_17_007 | File 08 | Sticky button coating record | # TODO: confirm ID from File 08 |

All unresolved cross-references must be written as inline `# TODO: resolve record ID — see File XX` comments in the authored file. Do not use placeholder or invented IDs.

---

## Source Inventory

| # | Source | Tier |
|---|---|---|
| [A1] | PCA Tech Q&A — 2014 981 Door Delamination. pca.org/tech/2014-981-door-delamination | Tier A |
| [B1] | Pelican Parts — Porsche Cayenne HVAC Blower Fan and Regulator Replacement (2003–2008). pelicanparts.com | Tier B |
| [B2] | Pelican Parts — Porsche 996 Carrera HVAC Motor Replacement. pelicanparts.com | Tier B |
| [B3] | Pelican Parts — Porsche 997.2 Carrera Clock Spring Steering Sensor Replacement. pelicanparts.com | Tier B |
| [B4] | Pelican Parts — Porsche 991.1 Clock Spring Steering Sensor Replacement. pelicanparts.com | Tier B |
| [B5] | Pelican Parts — Porsche 996/997 Air Conditioning Maintenance and Recharge. pelicanparts.com | Tier B |
| [B6] | Griffiths Technical (Kuehl) — 986/987/996/997 AC Compressor product page + AC System Troubleshooting Guide. griffiths.com | Tier B |
| [B7] | PCarwise — Common Problems: Porsche Cayenne 955/957/958/9Y0. pcarwise.com | Tier B |
| [C1] | RepairPal — Porsche Cayenne Blower Motor Replacement Cost. repairpal.com | Tier C (cost consistency) |
| [C2] | RepairPal — Porsche Cayenne HVAC Blend Door Actuator Replacement Cost. repairpal.com | Tier C (cost consistency) |
| [C3] | RepairPal — Porsche 911 AC Compressor Replacement Cost. repairpal.com | Tier C (cost consistency — not cost anchor) |
| [C4] | RepairPal — Porsche Cayenne AC Compressor Replacement Cost. repairpal.com | Tier C (cost consistency — not cost anchor) |
| [C5] | RepairPal — Porsche 911 Air Bag Clockspring Replacement Cost. repairpal.com | Tier C (cost consistency) |
| [C6] | Planet-9 — Headliner Issue; Drooping Headliner Fix threads. planet-9.com | Tier C (prevalence/cost consistency) |
| [C7] | Planet-9 — Door Panels Delaminating; Door Panel Issue; Door Panel Warping threads. planet-9.com | Tier C (prevalence consistency) |
| [C8] | Rennlist — Cayenne 955/957 blower motor replacement thread. rennlist.com | Tier C (cost/part number consistency) |
| [C9] | 6SpeedOnline — Driver Side Heated Seat Not Working (996, warranty repair details + part numbers). 6speedonline.com | Tier C (part numbers, labor) |
| [C10] | PistonHeads — Heated Seats Have Stopped Working (specialist mention of unverified Porsche TSB for 996 wiring chafe). pistonheads.com | Tier C (unverified TSB reference only) |
| [C11] | Grassroots Motorsports — Porsche Cayman headliner sag fix. grassrootsmotorsports.com | Tier C (prevalence/cost) |

---

## Open Research Gap

**996 seat heater wiring chafing TSB:** A Porsche TSB covering a wiring chafing remedy (harness under seat rail on 996) was mentioned by a Tier C specialist but not located during research. During authoring, check NHTSA/PCNA TSB database. If found, Record 4 upgrades from `community_reported` to `specialist_single_source` or `manufacturer_acknowledged`, and cost/prevalence fields become revisitable. Until confirmed, the TSB must not appear as sourced fact in any field of Record 4.

---

## Review History

| Version | Date | Action |
|---|---|---|
| v1 | 2026-05-07 | Initial research document |
| Final | 2026-05-07 | Independent pre-authoring review (7 findings). F1 accepted: added 996/986 to Record 5 applicability. **F2 reversed: reviewer flagged PCarwise as untiered, but PCarwise is explicitly listed as Tier B in PROJECT_STATE locked principles (Tier B enumeration); [B7] remains Tier B.** F3 accepted: Record 3 cost fields omitted (Tier C sole-source). F4 accepted: all cross-reference IDs flagged as TODO. F5 accepted: Record 7 evidence_basis corrected to specialist_single_source. F6 accepted: 986 cabriolet headliner hard-ruled out of Record 6 scope. F7 accepted with narrowing: Record 2 cost reflects full contamination scenario; severity stays moderate. |
