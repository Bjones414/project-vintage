# Watch-For Catalog Audit
**Date:** 2026-05-18  
**Status:** USER TO REVIEW — no production changes made  
**Scope:** Defect catalog at `docs/reference/defects/` (29 files, 106+ records) + `lib/era-content/generation-content.ts` (generation-page watch-for data, a separate but related system)

---

## 1. Catalog Location and Structure

**Primary catalog:** `docs/reference/defects/`  
29 Markdown files, each containing YAML-formatted defect records.  
Schema spec: `docs/reference/defects/00_schema.md`

**Runtime parser:** `lib/defect-catalog/parser.ts` (loads YAML → `DefectRecord[]`)  
**Applicability matcher:** `lib/originality.ts` (`matchDefects(context)`)  
**Generation-page overlay:** `lib/era-content/generation-content.ts` (separate `watch_for` and `service` sections per generation — this is the _lighter_ user-facing data, not the full catalog)

**Known structural bugs (logged, not fixed, from audit-2026-05-14):**
- BUG 1: `body:` filter silently ignored — Targa/Cab records match all body styles
- BUG 2: `exclude.trim_category` blocks never execute — 993 Turbo incorrectly matches DMF record
- BUG 3: Region-specific records (file 25) use wrong YAML field names — parser skips them entirely
- BUG 4: Stale generation keys in some records (`911_G_body`, `911_F_body`) vs current DB keys

These bugs are out of scope for this audit and should be addressed separately.

---

## 2. Mandatory Actions (Task-Specified)

### 2a. 993 IMS Reference — Status

**No erroneous 993 IMS reference exists in the defect catalog. No DELETE action required.**

Evidence:
- `docs/reference/defects/01_engine_m96_m97.md`: IMS record explicitly excludes `engine_family: [Mezger, 9A1, 9A2, 9A3]` and scopes to `generation: [996.1, 996.2, 986, 987.1, 997.1]`. 993 not in scope.
- `supabase/migrations/20260430000000_add_comp_engine_v2_columns.sql` line 135: SQL comment explicitly states `"For 993: not_applicable"` for IMS/RMS/bore scoring.
- `tests/lib/findings/rules/generation-watchout.test.ts` line 36: Test case reads `"returns null for non-IMS generation (993)"` — the rule correctly excludes 993.
- `lib/era-content/generation-content.ts` 993 `watch_for` section: IMS is not listed.

**Conclusion:** No action needed. The boundary is correctly enforced at multiple layers.

### 2b. Air-Oil Separator (AOS) on M96/M97 — Status

**AOS is confirmed in catalog. Record: `m96_m97_aos_failure` in `01_engine_m96_m97.md`.**

Applicability as authored: `generation: [996.1, 996.2, 986, 987.1, 997.1]`, `engine_family: [M96, M97]`, `year_range: [1997, 2008]`.

This correctly covers:
- 986 Boxster (1997–2004) ✓
- 987.1 Boxster/Cayman (2005–2008) ✓
- 996 Carrera (1998–2005) ✓
- 997.1 Carrera (2005–2008) ✓

**Note on 997.2/987.2:** These use the 9A1 engine. File 13 notes the 9A1 AOS architecture differs materially from M96/M97, and 9A1-specific AOS failure rates are not Tier-B-quantified. Correct to exclude them from the M96/M97 AOS record; the editorial note on the 9A1 carbon buildup record directs buyers to ask about AOS service on high-mileage cars. No change needed.

### 2c. 993 Proposed Additions (Task-Specified)

Both items below are **positive period attributes**, not defect flags. They don't fit the current schema's defect record format. Recommended placement: `generation-content.ts` 993 `watch_for` array (as informational context entries) or a new `generation_positive_attributes` schema extension. The audit flags them as proposed additions for USER TO REVIEW — the format decision is yours.

| # | Proposed Entry | Type | Rationale |
|---|---|---|---|
| 2c-1 | **Hydraulic valve lifters** | Positive attribute / context | 993 was the first air-cooled 911 to eliminate manual valve adjustments. Every prior generation (F-body through 964) required clearance checks every 15,000–20,000 miles. Referenced in generation-content.ts service section (line 188) but not surfaced as a buyer-facing positive signal. PCA maintenance documentation confirms the change. |
| 2c-2 | **Coldest cabin A/C of any air-cooled 911** [VERIFY] | Positive attribute / context | Period claim; not confirmed against a Tier-B technical source during this audit. Resonates as a known enthusiast talking point. Needs a PCA, Excellence Magazine, or period Porsche press document citation before authoring. **Do not add without source verification.** |

**Current generation-content.ts service text for 993 (line 188)** already reads:  
> "The hydraulic valve lifters require no manual adjustment — a meaningful simplification versus every prior air-cooled 911."

This text exists but is buried in a service paragraph. If the intent is to surface it as a visible buyer-facing signal, it should move to or be duplicated in the `watch_for` array. No new information is needed; it's a presentation decision.

---

## 3. Per-Generation Audit

### 3a. 911 Line (Air-Cooled)

---

#### 901 / Early 911 (F-body, 1963–1973)

**Currently in catalog:**

| Record | File | Severity |
|---|---|---|
| Pre-1984 chain tensioner failure | 03 | catastrophic |
| Magnesium-case head stud pull-out (1968–1977) | 03 | catastrophic |
| Oil return tube seal leaks | 03 | low |

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| MFI / Carb cold-start and tuning complexity | LOW | 1963–1973 (all early 911) | The mechanical fuel injection (Bosch MFI, 1968+) and carburetted variants require specialist calibration and are sensitive to cold-start enrichment. Most auction listings for these cars now show specialist-maintained examples; the question is whether MFI has been recently calibrated and whether carb jets are correct for current fuel. | PCA Tech Q&A archive, Pelican Parts early-911 DIY content | Lower priority for v1 — F-body buyers are typically already engaged with specialists. Noted as deferred in file 03. |

---

#### G-body / 930 Turbo (1974–1989)

**Currently in catalog:**

| Record | File | Severity |
|---|---|---|
| Pre-1984 chain tensioner failure (1974–1983) | 03 | catastrophic |
| Magnesium-case head stud pull-out (1974–1977 only) | 03 | catastrophic |
| Dilavar/steel head stud breakage (1978–1989) | 03 | high |
| Oil return tube seal leaks | 03 | low |
| Dashboard cracking | 23 | low |

**Proposed additions — 930 Turbo-specific (NA G-body has no high-priority gaps beyond above):**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Turbo bearing heat soak / oil coking | HIGH | 930 Turbo 1975–1989 | Without adequate cool-down after hard driving, residual heat cooks oil in the K27 turbo bearing housing. Cooked oil accelerates bearing wear; symptoms are blue smoke on cold start, declining boost, and eventually bearing noise. Correct practice is a 3–5 minute idle before shutdown. History of hard driving with no cool-down is difficult to document but worth asking about. | PCA Panorama archives; Stuttcars 930 buyer's guide; Rennlist 930 forum | HIGH severity because repair is engine-out. |
| KKK K27 wastegate diaphragm failure | MEDIUM | 930 Turbo 1975–1989 | The rubber wastegate actuator diaphragm perishes over time; a failed diaphragm allows boost to run unchecked or prevents boost entirely. Rebuilt wastegate actuators and replacement kits are available. Must be confirmed operational on any pre-purchase inspection. | Pelican Parts 930 tech content; PCA Tech Q&A | Age-driven; all 30–45 year old cars are candidates. |
| Bosch K-Jetronic / CIS-Turbo maintenance state | MEDIUM | 930 Turbo 1975–1989 | The 930 uses mechanical Bosch K-Jetronic injection (CIS) with a turbo-specific warm-up regulator. Cold-start richness, hot-start difficulties, and idle instability are common symptoms of an out-of-calibration CIS system. Requires a specialist with CIS expertise — not all Porsche shops have it. Correct fuel delivery is also a safety issue on a turbo car. | PCA Tech Q&A; Atlantic Motorcar Center 930 content | Seller should be able to confirm when CIS was last calibrated and cold-start behavior in winter conditions. |
| Oil feed and scavenge line condition | HIGH | 930 Turbo 1975–1989 | The turbocharger oil feed and scavenge lines are subject to heat soak, cracking, and blockage. A clogged scavenge line starves the bearing of return oil flow; result is accelerated bearing failure regardless of cool-down practice. Should be inspected and replaced prophylactically during any major service. | Rennlist 930 forum specialist consensus; multiple PCA tech articles | Cheap insurance relative to turbo replacement. |

---

#### 964 (1989–1994)

**Currently in catalog:**

| Record | File | Severity |
|---|---|---|
| Dilavar/steel head stud breakage (aluminum case) | 03 | high |
| Oil return tube seal leaks | 03 | low |
| 964/993 Dual-mass flywheel wear (NA only) | 03 | low |
| 964/993 HVAC flap servo motor failure | 23 | moderate |
| Dashboard cracking | 23 | low |

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Valve guide wear (high-mileage engines) | HIGH | All 964, 1989–1994 | The 964 uses the same bronze-coated valve guides as all prior air-cooled 911s. At high mileage (typically 80k+), guides wear beyond spec, causing oil to migrate past valve stems into the combustion chamber. Symptoms: blue smoke on cold start and overrun, increasing oil consumption, secondary effect of clogging SAI ports. Requires top-end rebuild. Deliberately deferred in file 03 as a "rebuild-due" category item, but valve guide condition is a pre-purchase question on any high-mileage 964. | File 03 "Considered and Not Included"; PCA Tech Q&A valve guide discussions; Repasi Motorwerks 964 service content | The file 03 deferred framing is defensible for v1. This proposal is for v2 unless the catalog adds a "service-due" severity tier. |
| Mechanical valve adjustment interval | LOW | All 964, 1989–1994 | Unlike the 993 (which introduced hydraulic lifters), the 964 requires manual valve clearance checks every 15,000–20,000 miles. A 964 with no record of valve adjustments past 60k miles is either overdue or the records are absent. Worn guides make accurate measurement harder. | PCA maintenance schedules; Pelican Parts 964 maintenance | Low flag severity but a useful service-history signal. Pairs with valve guide wear question above. |
| 964 Turbo turbo bearing / oil line condition | HIGH | 964 Turbo (M64/50, 1991–1994) | Same pattern as 930 Turbo: K27 bearing heat soak, oil coking, oil feed/scavenge line condition. The 964 Turbo uses a single large KKK turbocharger (not the twin system of the 993 Turbo). Cool-down discipline and oil line integrity are the key pre-purchase questions. The 964 Turbo S Leichtbau (86 units) is specifically excluded from A/C — relevant context for buyers. | Stuttcars 964 buyer's guide; Rennlist 964 Turbo forum | Narrow scope (964 Turbo only). Could share a record with 930 Turbo bearing record. |
| 964 AWD control module failures (C4 only) | MEDIUM | 964 Carrera 4, 1989–1994 | The 964 C4 uses an electronically-controlled viscous AWD system whose control module develops age-related failures (engagement irregularities, fault codes, loss of front differential engagement). Generation-content.ts line 2922 notes this. No defect record exists. | Generation-content.ts 964 content; Rennlist 964 C4 forum; Pelican Parts | Moderate scope — C4 only. AWD module failures are real but less common than the drivetrain items above. [VERIFY] prevalence with specialist source. |

---

#### 993 (1994–1998)

**Currently in catalog:**

| Record | File / Generation-content |
|---|---|
| Engine wiring harness insulation failure (TSB W301) | 23 / gen-content |
| Dilavar/steel head stud breakage | 03 / gen-content |
| Dual-mass flywheel wear (NA cars) | 03 / gen-content |
| Oil return tube seal leaks | 03 / gen-content |
| Dashboard cracking | 23 / gen-content |
| SAI failure (pump + head ports, 1996+ OBD-II cars) | 99 (shared) |
| HVAC flap servo motor failure | 23 |

**Mandatory from task — no erroneous IMS reference found (see Section 2a).**

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Hydraulic valve lifters — positive generation attribute | POSITIVE | All 993, 1994–1998 | First air-cooled 911 to use hydraulic valve lifters. Eliminates manual valve clearance adjustment required on every prior generation. Simplifies maintenance and reduces the cost of routine service. Currently in generation-content.ts service section but not surfaced as a buyer-visible signal. | PCA maintenance documentation; generation-content.ts line 188 | See Section 2c. No new sourcing needed — text already exists in the codebase. Presentation decision only. |
| Coldest cabin A/C of any air-cooled 911 — positive attribute | POSITIVE [VERIFY] | All 993, 1994–1998 | Period claim that the 993 offered the most effective A/C system of any air-cooled 911. Not yet confirmed against a Tier-B source. **Do not add without source verification.** [VERIFY: PCA Panorama period review, Porsche marketing materials, Excellence Magazine archives.] | Not yet sourced | Enthusiast-consensus claim. [VERIFY] before authoring. |
| 993 distributor belt (dual-ignition system) | MEDIUM [VERIFY] | All 993, 1994–1998 | The 993 uses two distributors each driven by a rubber belt from the camshaft. Belt failure disables one distributor and causes rough running; failure of both disables the ignition. Belts are age-wear items. Severity and exact failure rate need a Tier-B source. The file 23 cross-reference note (line 436) flags "the 993 distributor belt (a separate known age item) is adjacent but engine-scoped." No defect record exists. | File 23 cross-reference note; Rennlist 993 forum; [VERIFY with PCA or Pelican Parts tech article] | MEDIUM severity provisional. Some specialist sources treat this as routine maintenance (belt + cap + rotor at 30k), others as a genuine failure risk. [VERIFY] before authoring. |
| Valve guide wear (high-mileage) | HIGH | All 993, 1994–1998 | Same mechanism as 964: bronze valve guides wear at high mileage (80k+), causing oil consumption and SAI port clogging. Deferred in file 03 "Considered and Not Included." The difference on the 993 is that hydraulic lifters mask the diagnostic signal somewhat — worn guides don't show up in valve adjustments that no longer happen. | File 03 "Considered and Not Included"; PCA Tech Q&A; Stuttcars 993 buyer's guide | HIGH on any car over 80k without documented top-end work. |

---

### 3b. 911 Line (Water-Cooled, Volume)

---

#### 996.1 (1998–2002) and 996.2 (2002–2005)

**Currently in catalog (all file 01 unless noted):**

| Record | Severity |
|---|---|
| IMS bearing failure (Carrera only — not GT3/Turbo) | catastrophic |
| Cylinder bore scoring (3.4L/3.6L) | catastrophic |
| Rear main seal leak | low |
| AOS failure | moderate |
| Variocam tensioner pad wear (996.1 5-chain only) | moderate |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |
| GT1 coolant pipes (996 GT3/GT2/Turbo — file 02) | high |

**996 is the most-covered generation in the catalog. No significant gaps identified at HIGH severity. Proposed additions are lower priority:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Coolant expansion tank cracking | LOW | All 996 Carrera/Boxster, 1998–2005 | Plastic expansion tanks develop hairline cracks at the seam with age (10+ years), causing slow coolant loss. Cheap to fix (~$200–$400 with labor). Documented in file 01 "Considered and Not Included" as a service item rather than a defect flag. | File 01 "Considered and Not Included"; Pelican Parts; RPM Specialist Cars | Deliberately excluded by the catalog author. Proposal: add as LOW severity if a "service-due" category is created. |
| "Fried-egg" headlamp moisture intrusion | LOW | All 996, 1998–2005 | The composite projector-style headlamps are prone to moisture infiltration through degraded seals, causing internal fogging and bulb corrosion. Replacement or resealing is moderately expensive on early cars where OEM units are scarce. Cosmetic but affects auction value. | Rennlist 996 forum; multiple specialist buyer guides | Cosmetic item. Low priority for defect catalog. |

---

#### 997.1 (2005–2008)

**Currently in catalog:**

| Record | Severity |
|---|---|
| IMS bearing failure (Carrera only) | catastrophic |
| Cylinder bore scoring | catastrophic |
| Rear main seal leak | low |
| AOS failure | moderate |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |
| GT1 coolant pipes (GT3/GT2/Turbo — file 02) | high |

**No new high-severity gaps identified. All canonical M97 issues are covered. Proposed minor addition:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Coolant expansion tank cracking | LOW | All 997.1, 2005–2008 | Same issue as 996. Mentioned in file 01 "Considered and Not Included." | File 01 | Same deferred-item status as 996 above. |

---

#### 997.2 (2009–2011)

**Currently in catalog:**

| Record | Severity |
|---|---|
| DFI intake valve carbon buildup (13, 9A1 engine) | low |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |
| GT1 coolant pipes (GT3 RS / GT2 RS — file 02) | high |

**Proposed addition (HIGH priority — confirmed deferred in file 13):**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Water pump failure (997.2 Carrera, early build) | HIGH | 997.2 Carrera / Carrera S, approx. 2009–2011 | File 13 "Considered and Not Included" documents a substantial owner-reported pattern of water pump failures on early 997.2 builds at low mileage. Plastic impeller breakup and bearing failure are the two failure modes. Pelican Parts' 991 coolant pump replacement article (referenced in file 13) confirms both modes. Many replaced under Porsche goodwill or CPO coverage. Deferred to file 18 (Cooling Systems v2). | File 13 "Considered and Not Included"; Pelican Parts 991 coolant pump article; Rennlist 997.2 water pump thread; 6SpeedOnline thread | File 18 is the intended home. This proposal confirms the issue is catalog-ready; priority for file 18 authoring. |

---

#### 991.1 (2012–2016)

**Currently in catalog:**

| Record | Severity |
|---|---|
| 991.1 GT3 rod-bolt recall + FF warranty extension (13) | catastrophic |
| DFI carbon buildup (13) | low |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Water pump failure (early 991.1 builds) | HIGH | 991.1 Carrera / Carrera S, approx. 2012–2015 | Same dual failure mode as 997.2: plastic impeller breakup and bearing failure. Documented in file 13 "Considered and Not Included" as deferred to file 18. Rennlist 991.1 water pump threads, 6SpeedOnline, PCGB confirm the pattern across multiple early 991.1 builds. Porsche issued goodwill replacements on many cars. | File 13 "Considered and Not Included" | Priority authoring candidate for file 18. |
| Change-over valve (COV) vacuum solenoid failure | MEDIUM | 991.1 (all), approx. 2012–2016 | Eight vacuum COV solenoids control exhaust flaps, air vents, and other vacuum-actuated components. Failure causes phantom cooling faults (P1433), stuck exhaust valves, and MIL illumination — often misdiagnosed as water pump or thermostat. Porsche ran a service campaign replacing all eight solenoids on early 991 cars. Documented in file 13 "Considered and Not Included" as deferred to file 21 (Electrical v2). Tier-B source: Kadunza specialist content. | File 13 "Considered and Not Included"; Kadunza Porsche vacuum systems guide [Tier B] | Priority authoring candidate for file 21. |
| PADM active engine mount sensor failure (992.1 overlap — see below) | — | — | Documented in file 13 for 992.1 specifically; not flagged for 991.1. — | — | — |

---

#### 991.2 (2016–2019)

**Currently in catalog:**

| Record | Severity |
|---|---|
| DFI carbon buildup (13, 9A2) [SCOPED OUT in current record per file 13] | — |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**Note:** File 13 explicitly scopes DFI carbon buildup to 9A1 engines and defers 9A2/9A3 pending Tier-B documentation.

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Water pump failure (early 991.2 builds) | HIGH | 991.2 Carrera / Carrera S, approx. 2017 – early 2018 builds | File 13 "Considered and Not Included" explicitly documents a "substantial owner-reported pattern" of early 991.2 water pump failures at low mileage, often replaced under Porsche goodwill or CPO. Rennlist 991.2 water pump thread, 6SpeedOnline reliability thread, PCGB thread, and Carpokes early-build thread all document it. Deferred to file 18. This is a HIGH-confidence gap. | File 13 "Considered and Not Included"; Pelican Parts 991 coolant pump article (two failure modes confirmed) | Priority authoring candidate for file 18. This is explicitly called out in the codebase as a known deferred issue. |
| Intercooler water/moisture accumulation (early 9A2) | LOW [VERIFY] | 991.2 Carrera / Carrera S, 2016–2019 | File 13 notes PCarwise documents this as a single Tier-B mention: water accumulation in the intercoolers with Porsche having revised the drain design. Single-source; below the v1 evidence bar per file 13. [VERIFY] if a second Tier-B source can be located. | File 13 "Considered and Not Included"; PCarwise 911 common problems [Tier B] | Below v1 bar. [VERIFY] only. |

---

#### 992.1 (2019–2023)

**Currently in catalog:**

| Record | Severity |
|---|---|
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**Note:** 992 is described in file 13 as "one of the more defect-light generations Porsche has shipped." No catastrophic engine issues are documented.

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| PADM active engine mount sensor failure / water ingress | MEDIUM | 992.1 Carrera (early build, approx. 2019–2020) | File 13 documents this in "Considered and Not Included": a sealing issue allows water ingress into active engine mounts (PADM), electrically tripping the sensor and triggering a chassis fault. Porsche issued a TSB and recall; repair requires engine-out access. File 13 defers this to file 20 (Chassis v2). Both what-breaks.com [Tier C] and PorscheMania [Tier C] document it, and a Tier-A NHTSA recall exists. | File 13 "Considered and Not Included"; Porsche TSB (NHTSA recall, Tier A); PorscheMania [Tier C]; what-breaks.com [Tier C] | Tier-A recall confirmation makes this a strong candidate for file 20. Deferred there intentionally. |

#### 992.2 (2024–present)

Too recent for auction catalog coverage. No additions proposed.

---

### 3c. 911 Line (Water-Cooled, Halo / Mezger)

#### 996/997 GT3, GT2, Turbo (Mezger engine)

**Currently in catalog:**

| Record | Severity |
|---|---|
| GT1 coolant pipe failure (file 02) | high |
| SAI failure — component level (99, pump/valve only per Mezger scope) | moderate |
| Ignition coil failures (99) | low |

File 02 explicitly documents that IMS, bore scoring, RMS, and AOS do **not** apply to Mezger engines and explains why. The negative information is buyer-relevant and well-covered.

**No new HIGH-severity additions identified.** 

One noted gap from file 02 "Considered and Not Included":

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Spun camshaft bearings (Mezger) | LOW [VERIFY] | 996/997 GT3/GT2/Turbo (Mezger) | Forum-documented failure but lacks Tier-B quantification. File 02 deliberately deferred. [VERIFY]: if a Tier-B specialist source (Callas Rennsport, Hartech, SharkWerks) has published on this. | File 02 "Considered and Not Included" | Below v1 bar at current sourcing. |

---

### 3d. 911 Line (Halo / Non-Mezger)

#### 991.1 GT3 (2014–2016)

**Fully covered in file 13:** Rod-bolt recall (NHTSA 14V-090) + FF/camshaft warranty extension (10yr/120k). See `991_1_gt3_engine_concerns` record.

#### 991.2 GT3 (2017–2019) and 992 GT3/GT3 RS

**Currently in catalog:** No specific records. File 13 confirms the 991.2 GT3 engine uses revised valvetrain components not subject to the 991.1 FF campaign.

**No additions proposed.** 992 GT3 is too recent.

---

### 3e. Transaxle Family

#### 924 (1976–1985), 924S (1987–1988), 944 (1982–1991), 968 (1992–1995)

**Currently in catalog (file 04):**

| Record | Severity |
|---|---|
| Timing belt service neglect (interference engines) | catastrophic |
| Water pump failure (944 family only, not 968) | high |
| Torque tube bearing failure (924/944/968) | moderate |

**No significant gaps identified.** File 04's "Considered and Not Included" section documents reviewed items. The following received attention but remain below the v1 bar:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| AC evaporator (944) | MEDIUM | 944, 1982–1991 | Buried behind the dashboard; dash-out labor makes replacement disproportionately expensive. Real but comfort-system rather than drivability. | File 04 "Considered and Not Included"; multiple 944 owner reports | May warrant authoring in a future HVAC file. |
| 944 Turbo-specific boost and intercooler items | MEDIUM [VERIFY] | 944 Turbo (951), 1986–1991 | Intercooler mounting, boost solenoid condition, and turbo wastegate are 951-specific items not in the current record. Timing belt service is already covered. [VERIFY] if Tier-B specialist content (Atlantic Motorcar, PCA 951 Q&A) establishes bounded defect patterns. | Atlantic Motorcar Center 944/951 content; PCA Tech Q&A | Not currently in catalog. Consider for v2. |

---

#### 928 (1977–1995)

**Currently in catalog (file 05 + torque tube cross-ref from file 04):**

| Record | Severity |
|---|---|
| Timing belt service neglect | catastrophic |
| Thrust bearing failure (automatic transmission) | catastrophic |
| Torque tube bearing failure (cross-ref from file 04) | moderate |

**No HIGH-severity gaps identified.** File 05 "Considered and Not Included" documents reviewed items that remain below v1 bar. Notable deferred items:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Suspension ball joints (aluminum → steel revision) | HIGH | All 928, 1977–1995 | Original aluminum ball joints wear and were later superseded with steel. Control arm replacement required (not individual joints); approx. $1,500–$2,000 per Rennlist buyer's guide. File 05 notes this belongs in a future chassis/suspension file. | File 05 "Considered and Not Included"; Rennlist 928 buyer's guide [Tier B] | HIGH severity for a deferred item. Priority for chassis file authoring. |
| Power steering rack and line failures | MEDIUM | All 928, 1977–1995 | High-cost failure item per Stuttcars and Classics World. Steering rack replacement is expensive; lines are known wear items. Belongs in a future steering/hydraulics file. | File 05 "Considered and Not Included"; Stuttcars 928 reliability content [Tier B] | Moderate priority. |
| All-aluminum cooling system corrosion / radiator | MEDIUM | All 928, 1977–1995 | The all-aluminum engine requires correct coolant chemistry to prevent internal corrosion. Radiator replacement is expensive. Real and noteworthy but deferred. | File 05 "Considered and Not Included" | Future cooling-systems file candidate. |

---

### 3f. Mid-Engine (Boxster / Cayman)

#### 986 Boxster (1997–2004)

**Currently in catalog:**

| Record | Severity |
|---|---|
| IMS bearing failure (M96) | catastrophic |
| Cylinder bore scoring (3.4L S, 3.2L base largely immune) | catastrophic |
| Rear main seal leak | low |
| AOS failure | moderate |
| Variocam tensioner pad wear (5-chain 2.5L/2.7L, 1997–2002) | moderate |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Water in footwell / drainage failure | MEDIUM | All 986 Boxster, 1997–2004 | Two primary sources: (1) A/C condensate drain tube clogs, directing condensate into the cabin sill; (2) convertible top drain channels clog, allowing water to pool in the sill area and migrate into the footwell. Long-term water accumulation causes carpet rot, ECU corrosion, and sill-liner damage. Common and well-documented across the 986 owner community. | Rennlist 986 forum (multiple DIY threads); Pelican Parts 986 drainage content; 986 Forum community consensus [Tier C] | Tier-B sourcing needed to add as a formal record. [VERIFY] with Pelican Parts tech article or PCA Q&A. Enthusiast consensus is strong. |
| Coolant crossover / crossover hose failure | HIGH [VERIFY] | All 986, 1997–2004 | A front coolant crossover hose connecting the two cylinder banks can fail, causing coolant loss and potential overheating. Difficult access; significant labor. Commonly bundled with cooling system service. [VERIFY]: confirm Tier-B source (Pelican Parts 986 cooling tech article or PCA Q&A). | Rennlist 986 forum consensus [Tier C]; [VERIFY Tier-B] | Important if verified with Tier-B source. Currently below evidence bar. |

---

#### 987.1 Boxster / Cayman (2005–2008)

**Currently in catalog:**

| Record | Severity |
|---|---|
| IMS bearing failure (M97) | catastrophic |
| Cylinder bore scoring (3.4L / 3.8L S models) | catastrophic |
| Rear main seal leak | low |
| AOS failure | moderate |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**Proposed additions:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Front coolant crossover hose failure | HIGH | All 987.1, 2005–2008 | The front coolant crossover hose (bridging the two cylinder banks) uses a rubber gasket that swells and eventually blows out, causing rapid coolant loss. Mixed metal/plastic construction corrodes at the joint. Labor is high — the hose is buried under the front of the engine; access requires significant disassembly. Specialist-reported cost ~$1,400 on a 2006 Boxster S. | Pelican Parts 987 cooling content; 986Forum and 987Forum community consensus; confirmed by multiple specialist shop DIY writeups | HIGH severity (rapid coolant loss = overheating risk). Tier-B sourcing: Pelican Parts and specialist shop articles. |

---

#### 987.2 Boxster / Cayman (2009–2012)

**Currently in catalog:**

| Record | Severity |
|---|---|
| DFI intake valve carbon buildup (9A1, file 13) | low |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**Proposed addition:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Water pump failure (early 987.2 builds) | HIGH | 987.2 Boxster / Cayman, approx. 2009–2011 | Shares the same water pump failure pattern as the 997.2: plastic impeller breakup and bearing failure. Documented alongside 997.2 in file 13 "Considered and Not Included" as deferred to file 18. Owner reporting is consistent across Rennlist, Boxster Forum, and PCA CPO discussion. | File 13 "Considered and Not Included" | Same file-18-deferred status as 997.2. Priority authoring candidate. |

---

#### 981 Boxster / Cayman (2012–2016)

**Currently in catalog:**

| Record | Severity |
|---|---|
| DFI intake valve carbon buildup (9A1, file 13) | low |
| SAI failure (99) | moderate |
| Ignition coil failures (99) | low |

**No HIGH-severity engine gaps identified.** 981 is generally considered a reliable generation. One item surfaced in research:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Exhaust valve actuator sticking | LOW | All 981, 2012–2016 | Electric actuators controlling the exhaust bypass valves stick when not regularly exercised. Porsche has replaced entire exhaust back boxes in some cases; regular manual actuation and greasing prevents it. Drivability impact is minimal but affects sound character and can set fault codes. | Rennlist 981 community reports [Tier C]; multiple specialist shop mention | Below the v1 bar at Tier-C-only sourcing. Propose as deferred until Tier-B source found. |

---

#### 982 / 718 Boxster / Cayman (2016–present)

**Currently in catalog:**

| Record | Severity |
|---|---|
| SAI failure (99, if equipped) | moderate |
| Ignition coil failures (99) | low |

**Note:** The 718 platform uses the EA888 2.0T turbocharged 4-cylinder (base) and MA1 2.5T (S). The flat-six M96/M97 failure modes don't apply.

**Proposed addition:**

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| PDK transmission mechatronics / sensor failures | HIGH | PDK-equipped 982/718, 2016–present | The 7-speed PDK (DKG) develops sensor failures (speed sensors, pressure sensors, valve body issues) at moderate mileage. Shuddering during shifts from worn clutch packs or faulty mechatronic unit. Porsche's standard published remedy is full PDK replacement (~$20k+), which is disproportionate to many cases that are sensor or mechatronics repairs. A significant pre-purchase due diligence item on any high-mileage 718 PDK. | What-breaks.com [Tier C]; specialist community reporting; [VERIFY with Tier-B shop content on PDK sensor failure pattern] | This is a shared PDK issue across multiple platforms (also 997.2, 991, Cayenne, Panamera). May be better authored as a platform-level shared record. [VERIFY] Tier-B sourcing. |

---

### 3g. SUV / Sedan / EV

---

#### Cayenne 955 / 957 (2003–2010)

**Currently in catalog (file 06):**

| Record | Severity |
|---|---|
| Plastic coolant pipe failure (955 V8, 957 V8) | high |
| Cylinder bore scoring — V8 (M48 4.5L / 4.8L) | catastrophic |
| Driveshaft center support bearing | moderate |
| SAI failure (99, pump-weighted on V8) | moderate |
| Ignition coil failures (99) | low |

**No new HIGH-severity gaps for 955/957 engine items.** File 06 has comprehensive coverage.

Deferred item flagged in file 06 "Considered and Not Included" that has reached the evidence bar:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| 957 rear coolant hose / aluminum insert failure | HIGH [VERIFY] | 957 Cayenne (4.8L S/Turbo), 2008–2010 | A separate failure from the valley pipes: rubber cooling hose at rear of 4.8L engine clamped to an aluminum insert that can fail, causing coolant loss. File 06 explicitly flags this as possibly meeting the v1 bar: "second look, additional sourcing does exist... 6SpeedOnline thread documents the failure on the 957 4.8L DFI engines with photos and part numbers, and Suncoast lists an 'Updated Coolant Pipe' SKU specifically for 2008–2010 Cayenne S/Turbo." | File 06 "Considered and Not Included"; Suncoast 957 coolant pipe SKU [Tier B]; 6SpeedOnline 957 forum thread [Tier C] | File 06 explicitly recommends this for a "focused re-sourcing pass." Priority item. |
| Air suspension compressor / strut failures | MEDIUM | 955/957 with air suspension option | Air strut failure and compressor failure are real and documented. Deferred from file 06 to a future suspension/chassis file. | File 06 "Considered and Not Included"; Pelican Parts Cayenne air suspension content [Tier B] | PCA has guidance. Future chassis file. |

---

#### Cayenne 958 (2011–2018)

**Currently in catalog:** No 958-specific engine or drivetrain records. File 06 explicitly scopes to 955/957. The 958 uses different architecture (4.8L / 3.6L / V6 hybrid / diesel, no M48).

**Significant gap.** Proposed additions:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Transfer case (PTM) clutch pack wear | HIGH | All 958 Cayenne, 2011–2018 | The 958 PTM transfer case uses clutch packs that wear from improper ATF maintenance. A mandatory transfer case fluid change at 50,000 km (30,000 miles) is considered the minimum maintenance to prevent premature wear. Failed clutch packs produce vibration, binding, and transfer case fault codes; replacement is expensive. Well-documented across 958 owner communities. | Planet-9 958 forum [Tier C]; Rennlist 958 Cayenne forum [Tier C]; [VERIFY Tier-B with a named specialist shop — PCA, Pelican, or Callas Rennsport] | [VERIFY] Tier-B sourcing. File 06 "Considered and Not Included" notes "Planet-9 also flags transfer case as a concern on the 958 generation with extended warranty implications." |
| Bore scoring — 958 V8 (4.8L GTS / Turbo) [VERIFY] | MEDIUM [VERIFY] | 958 Cayenne GTS / Turbo (4.8L), 2011–2018 | Whether the 958 V8 (Audi-derived 4.8L, separate architecture from M48) exhibits significant bore scoring is disputed. Some engine rebuilders document cases; no community survey equivalent to the 955/957 Rennlist survey exists for the 958. [VERIFY] with LN Engineering or a specialist who has disassembled 958 V8s. | Research agent finding [Tier C]; LN Engineering 958 product page would be Tier B | Do not add without Tier-B confirmation. |

---

#### Macan 95B (2014–2018)

**Currently in catalog:** No 95B-specific records.

**Significant gap.** Proposed additions:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| Transfer case bearing wear | HIGH | All 95B Macan, 2014–2018 | The PTM transfer case develops bearing wear at moderate mileage. Aftermarket bearing kits are available and widely used in DIY and specialist repairs. Transfer case ATF change at 50k km is the standard preventive approach. Parallels the Cayenne 958 PTM issue above. | Rennlist Macan forum [Tier C]; specialist shop reports; [VERIFY Tier-B with Pelican Parts or named Macan specialist] | [VERIFY] Tier-B sourcing required. Strong community consensus. |
| EA888 2.0T water pump / thermostat housing leaks | MEDIUM | 95B Macan 2.0T, 2014–2018 | The VW/Audi EA888 Gen3 2.0T used in the 95B base Macan has well-documented water pump and thermostat housing seepage patterns. Not Porsche-specific; the EA888 engineering is shared across the VW Group, and the failure patterns are extensively documented on the VAG side. | Audi/VW EA888 specialist documentation [Tier B in VAG context]; [VERIFY Porsche-Macan-specific Tier-B source] | VAG-side Tier-B sourcing is strong. Need a Porsche-framed reference. |

---

#### Panamera 970 (2009–2016)

**Currently in catalog:** No 970-specific records.

**Significant gap.** Proposed additions:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| PDK dual-clutch transmission mechatronics failure | HIGH | 970 Panamera PDK, 2009–2016 | The 7-speed PDK in the 970 develops sensor and mechatronics unit failures producing jerking, shuddering, and harsh shifts. Porsche's documented remedy is full transmission replacement (~$20k+), though many failures are sensor-level fixes at a fraction of that cost with a knowledgeable independent. Pre-purchase scan for transmission fault codes is mandatory. | Rennlist Panamera forum [Tier C]; What-breaks.com 970 data [Tier C]; [VERIFY Tier-B with Stuttcars or Pelican Panamera content] | Shared PDK issue across multiple platforms. See also 982/718 note above. |
| V8 (4.8L) timing chain guide disintegration | HIGH | 970 Panamera V8 (4.8L GTS / Turbo), 2009–2016 | The 4.8L V8 timing chain guides use a plastic material that degrades and disintegrates; owners report noise from chain slap and eventual guide plastic in the oil. Full timing chain and guide replacement is a significant repair. Documented in multiple specialist and owner reports. | Rennlist 970 Panamera forum [Tier C]; German specialist shop blogs [Tier C]; [VERIFY Tier-B with named specialist content] | HIGH severity if confirmed. [VERIFY] Tier-B sourcing. |
| V6 / V8 cylinder deactivation system issues | LOW [VERIFY] | 970 Panamera V6/V8, 2009–2016 | Cylinder deactivation valve failures produce rough running and fault codes. [VERIFY] documentation with Tier-B specialist source — this was flagged as unconfirmed in research. | Research agent note [Tier C, unconfirmed] | [VERIFY] only. Do not add without Tier-B sourcing. |

---

#### Panamera 971 (2017–2023)

**Currently in catalog:** No 971-specific records.

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| PDK transmission issues (continued) | MEDIUM | 971 Panamera PDK, 2017–2023 | Continuation of 970-era PDK sensor and mechatronics patterns. Less prevalent given improved design, but pre-purchase PDK scan is still recommended practice. | Community reporting [Tier C] | Below the v1 bar at current sourcing. Deferred. |

---

#### Taycan J1 (2020–present)

**File 27 exists but was not read in this audit pass.** The following are proposed based on research, for cross-checking against file 27's current content:

| Issue | Severity | Models / Years | Description | Source | Notes |
|---|---|---|---|---|---|
| High-voltage battery internal short-circuit recall | CATASTROPHIC | Taycan 2020 (select builds) | Porsche issued a recall for a fire-risk HV battery short-circuit condition on affected 2020 builds. Owners advised to charge to 80% maximum; dealers replaced battery modules at no charge. Any 2020 Taycan should have a VIN recall check as part of pre-purchase. | NHTSA recall data [Tier A]; specialist reporting | Confirm against file 27 content. If not in file 27, add as priority. |
| 12-volt auxiliary battery failure | HIGH | Taycan 2020–2022 (early builds) | The small auxiliary 12V battery (separate from the HV traction battery) fails, leaving the car unable to wake up despite the HV battery at usable charge. Car becomes stranded with no warning. Porsche has revised the 12V battery management in later builds. | Recharged.com Taycan common issues; Taycan forum owner reports [Tier C]; [VERIFY Tier-B] | Check file 27. This is a well-known early-Taycan failure mode. |
| Charging system errors / DC fast charge below spec | MEDIUM | All Taycan, 2020–present | Intermittent charging session failures and charge rate below advertised spec, often software-related but sometimes hardware (onboard charger). | Taycan community reporting [Tier C]; Recharged.com [Tier C] | Software-fixable in many cases. Lower severity. |

---

## 4. Cross-Cutting Gaps

The following issues span multiple generations but have either no record or incomplete coverage:

| Issue | Severity | Generations Affected | Status | Notes |
|---|---|---|---|---|
| PDK mechatronics / sensor failures (7G-Tronic) | HIGH | 997.2, 991, 982/718, 970, 971, Cayenne 958, Macan 95B | No PDK-specific record exists. May belong in file 09 (Drivetrain Transmissions) or 19 (Drivetrain v2). | Check files 09 and 19 before authoring. High-priority gap. |
| Water pump (plastic impeller, 9A1/9A2 era) | HIGH | 987.2, 997.2, 991.1, 991.2 | Deferred to file 18 in file 13. | Priority for file 18 authoring. |
| Transfer case (PTM) wear across Cayenne/Macan | HIGH | 958, 95B, possibly 9Y0 | No records exist. | Research and author once Tier-B sourcing is confirmed. |

---

## 5. Items Previously Deferred That Now Have the Evidence Bar

Based on this audit, the following deferred items from "Considered and Not Included" sections should be prioritized for v2 authoring (most have or can reach Tier-B sourcing):

| Item | Deferred In | Proposed Destination | Priority |
|---|---|---|---|
| 991.1/991.2 water pump failure | File 13 | File 18 | HIGH — multiple Tier-B sources cited in file 13 |
| 957 Cayenne rear coolant hose | File 06 | File 06 or new 958/957 cooling record | HIGH — file 06 explicitly recommends re-sourcing pass |
| 928 suspension ball joints | File 05 | Future chassis/suspension 928 file | HIGH — Tier-B sourcing (Rennlist buyer's guide) cited |
| 991 change-over valve (COV) | File 13 | File 21 | MEDIUM — Tier-B Kadunza source cited |
| 992.1 PADM active mount recall | File 13 | File 20 | MEDIUM — Tier-A NHTSA recall confirmed |
| Cayenne 958 PTM transfer case | File 06 (mentioned) | New 958 file | MEDIUM — needs Tier-B verification |
| 987.1 coolant crossover hose | Research (this audit) | File 12 or new 987-cooling record | MEDIUM — specialist-documented, needs Tier-B record |

---

## 6. Summary: 993 Actions Required

| Action | Status | What to Do |
|---|---|---|
| DELETE 993 IMS reference | **Not required** — no erroneous IMS reference exists in defect catalog or generation-content.ts. | None. |
| ADD hydraulic valve lifters positive note | **Text exists** in generation-content.ts service section (line 188). Not surfaced as a buyer-visible signal. | Move or duplicate to 993 `watch_for` as a positive context entry. No new sourcing needed. |
| ADD coldest A/C positive note | **[VERIFY]** — not found in any codebase file. Enthusiast talking point; needs Tier-B source. | Find a PCA Panorama period review, Excellence Magazine archive, or original Porsche press material confirming this claim before authoring. |

---

## 7. Confidence Tags Summary

Items marked [VERIFY] in this document — requires Tier-B sourcing before authoring:

1. **993 coldest A/C** — needs PCA/Excellence/Porsche press citation
2. **993 distributor belt** severity — confirm failure modes with Pelican or PCA source
3. **964 AWD (C4) control module** failure rate — needs specialist prevalence data
4. **987.1 coolant crossover hose** — needs Tier-B (Pelican or PCA article) beyond forum consensus
5. **986 water in footwell** — strong Tier-C consensus; needs Pelican tech article or PCA Q&A
6. **930 Turbo oil feed line** — confirm severity framing with PCA 930 tech content
7. **930 wastegate diaphragm** — confirm Tier-B source (PCA or named specialist)
8. **930 K-Jetronic complexity** — confirm Tier-B framing with Atlantic Motorcar or PCA
9. **718/982 PDK sensor failures** — confirm prevalence with Tier-B shop content
10. **970 Panamera timing chain guides** — needs Tier-B specialist source
11. **970 Panamera cylinder deactivation** — unconfirmed; [VERIFY] or drop
12. **958 Cayenne bore scoring (4.8L)** — confirm with LN Engineering 958 product data
13. **958 Cayenne PTM transfer case** — needs named specialist Tier-B source
14. **Macan 95B transfer case** — needs Porsche-specific Tier-B source
15. **Macan 95B EA888 water pump** — needs Porsche-Macan-specific Tier-B source
16. **Taycan 12V battery failure** — confirm against file 27 content; check for Tier-B source

---

*End of audit. No production code, data, or migrations were modified. No commits made.*
