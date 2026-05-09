# FILE 18 — Cooling Systems v2
# Porsche Defect Catalog v1
# content_status: draft
# session: 2026-05-07 (single-chat self-review)
# records: 4 (18-001 through 18-004)
# clears: File-13 water-pump deferral + partial File-12 deferred cooling queue
# deferred this session: 9Y0 Cayenne vacuum-actuated water pump (see notes)

---

## RECORD 18-001
### 991.2 Early-Build Coolant Pump Seal / Bearing Failure

```yaml
defect_id: COOLING_18_001
schema_version: "1.0"
content_status: draft

title: "991.2 early-build coolant pump failure — MY2017–early MY2018"
category: cooling

description: >
  A documented production-batch defect affects the coolant pump on 9A2-engined 911 Carrera
  and Targa models built in model years 2017 and early 2018. Two primary failure modes
  exist: impeller seal degradation allowing coolant to leak externally or internally into
  the vacuum and valve-block circuit, and bearing failure producing noise with weeping.
  Both modes result in progressive coolant loss. Internal leaks contaminate the vacuum
  harness and valve block assembly and do not always produce a visible external puddle.
  Porsche Cars North America issued a formal warranty extension covering affected vehicles
  to 10 years or 120,000 miles from initial delivery. A revised pump superseded the
  original part; vehicles receiving the replacement are considered resolved.

applicability:
  platforms:
    - "991.2"
  engine_family:
    - "9A2"
  year_range: "2016–2019"
  specific_model_years:
    - "2017"
    - "2018"
  excludes: >
    Late MY2018 and MY2019 builds that received the revised pump from the factory. PCNA TI
    14/21 scope is 911 Carrera and Targa only; GT-variant and Turbo applicability not
    confirmed by Tier A/B sources and should not be inferred.

failure_mode: >
  Coolant pump seal degradation or bearing failure leading to progressive coolant loss.
  Seal failure permits coolant to migrate externally (visible weeping below pump onto
  muffler) or internally into the vacuum system and valve-block assembly.

failure_mechanism: >
  OEM pump (part prefix 0PB-121-005-A) uses a vacuum-interface seal that degrades under
  thermal cycling. Once the impeller-side seal fails, coolant enters the brake and engine
  vacuum circuit, contaminating the valve block and associated vacuum harness. Bearing
  failure is an independent mode producing noise and weeping without vacuum contamination.

symptoms:
  - "White coolant residue or dried pink staining on muffler directly below coolant pump"
  - "Coolant warning lamp or low-coolant alert with no visible external puddle (internal vacuum-leak mode)"
  - "Gradual coolant loss confirmed on reservoir with no pool under car"
  - "Engine overheating or elevated coolant temperature gauge"
  - "Audible bearing whine or grinding from pump area (bearing-failure mode only)"

severity: 3

prevalence: >
  PCNA issued a formal warranty extension (TI 14/21, 2021; extended December 2022) covering
  2017–2018 Carrera/Targa in the USA, Canada, and Puerto Rico. The extension scope implies
  Porsche acknowledged a non-trivial affected population. Community reporting is extensive
  across the 991.2 owner population on Rennlist, PCGB, and 6SpeedOnline.

mileage_at_failure:
  low: null
  high: null
  note: >
    Forum data includes warranty work orders at very low mileage; no Tier B mileage range
    available. PCNA warranty extension is not mileage-triggered and covers repair regardless
    of mileage within the 10-year/120,000-mile window.
  _low_mileage_example: "Rennlist tier_c WO: 2018 C4S MFG 9/17 at 5,813 miles (Rennlist thread 1187788)"

inspection_checklist:
  - "Inspect underside of pump housing and muffler for white or pink coolant residue"
  - "Check coolant reservoir level and inspect for dried coolant at valve block and vacuum solenoid cluster"
  - "Request service records confirming coolant pump replacement with revised part number (suffix -C or later)"
  - "Confirm via VIN check at Porsche dealer whether vehicle is covered under the PCNA warranty extension"

buyer_questions:
  - "Has the coolant pump been replaced? If so, what was the replacement part number?"
  - "Has the vehicle received dealer service under the PCNA coolant pump and valve block warranty extension?"
  - "Are there work orders on file showing coolant system repair at a Porsche dealer?"

known_fixes:
  - >
    Replacement of coolant pump with revised part (superseded suffix -C); simultaneous
    inspection and replacement of valve block and vacuum lines where contaminated by
    coolant ingress.

cost_range:
  parts_low_usd: null
  parts_high_usd: null
  labor_low_usd: null
  labor_high_usd: null
  notes: >
    Cost data omitted — all available figures are Tier C forum reports. Repair is covered
    under PCNA 10-year/120,000-mile warranty extension for qualifying 2017–2018
    Carrera/Targa; out-of-warranty scope and cost vary depending on whether valve block
    and vacuum harness require replacement alongside the pump.

sources:
  tier_a:
    - >
        Porsche Cars North America, Technical Information No. 14/21 (issued 2021; customer
        letter December 7, 2022). Extended warranty for coolant pump and valve block —
        911 Carrera (991) 3.0-litre flat-six twin-turbo, MY2017–2018, USA/Canada/Puerto
        Rico. Extended to 10 years/120,000 miles from initial vehicle delivery.
        NHTSA filing reference: MC-10191769-0001.
  tier_b:
    - >
        Pelican Parts, 991 Coolant Pump Replacement technical article. Confirms two primary
        failure modes for the 991 coolant pump: impeller seal failure and bearing failure.
        URL: https://www.pelicanparts.com/techarticles/Porsche_991/Coolant_Pump_Replacement/Coolant_Pump_Replacement.htm
  tier_c:
    - >
        Rennlist 991.2 forum, "991.2 Water Pump Failures" thread (multiple pages, 359+
        poll respondents). Confirms failure pattern, approximate build-date range, dual
        failure modes, and warranty work order details including revised part numbers.
        URL: https://rennlist.com/forums/991/1187788-991-2-water-pump-failures.html
    - >
        Rennlist 991.2 forum, "2018 991.2 Water Pump Failure" thread. Additional owner
        accounts with dealer work orders.
    - >
        6SpeedOnline 991 forum, "Water Pump Reliability" thread. Corroborating owner
        reports for 2017–2018 builds.
        URL: https://www.6speedonline.com/forums/991/428906-water-pump-reliability.html
    - >
        Carpokes forum, "Early Build 991.2 Water Pump Issues." Confirms Porsche dealer
        goodwill replacement policy and residue-only presentation (no overheating required).
        URL: https://www.carpokes.com/viewtopic.php?t=1570
    - >
        PCGB Forum, "Water Pumps on 991.2s." UK owner accounts including 2017 and early
        2018 builds.
        URL: https://www.porscheclubgb.com/forum/threads/water-pumps-on-991-2s.131229/

tier_a_absence_rationale: ""  # Tier A present — PCNA TI 14/21

cross_references:
  - >
    **File 13 — Engine: 9A1/9A2/9A3 modern flat-6.** Source of this deferral; File 13
    holds DFI carbon buildup (record 2) and 991.1 GT3 rod-bolt/FF records (record 1).
  - >
    **File 12 — Cooling Systems.** Prior cooling records for 996.1 platform, 957 Cayenne,
    and 928 family.

_source_anchor:
  "10 years/120,000 miles warranty extension":
    source: "PCNA TI 14/21 / NHTSA MC-10191769-0001; customer letter December 7, 2022"
  "two primary failure modes — impeller seal and bearing":
    source: "Pelican Parts 991 Coolant Pump Replacement article"

notes: >
  Build-date window: PCNA formal coverage is described as MY2017–2018; community data
  suggests builds through approximately late 2017 (build date ~October 2017) account for
  the highest concentration of reported failures. Some MY2019 vehicles (built 09/2018)
  have also reported failure but are not included in the formal PCNA warranty extension as
  of December 2022. The valve block is frequently replaced simultaneously when internal
  vacuum contamination is confirmed by the dealer; coolant in the vacuum harness can cause
  secondary faults unrelated to the pump.
```

---

## RECORD 18-002
### 928 / 944 / 968 Heater Control Valve (HCV) Plastic Body Splitting

```yaml
defect_id: COOLING_18_002
schema_version: "1.0"
content_status: draft

title: "928 / 944 / 968 heater control valve plastic body failure"
category: cooling

description: >
  The factory heater control valve on 928, 944, and 968 models uses a two-piece plastic
  housing bonded at a central seam, with an exposed external lever arm. With age and
  repeated thermal cycling, the adhesive joint degrades and the plastic becomes brittle,
  leading to body splitting or cracking. Failure releases coolant from the valve body
  suddenly, potentially producing a significant coolant loss event. The design is documented
  by 928 Motorsports — a specialist supplier for the 928 platform — as having a known
  reputation for this failure mode. The same valve design is used on 944 and 968 models,
  making all three platforms susceptible. All factory-installed valves date from the
  1978–1995 production run and should be treated as at-risk.

applicability:
  platforms:
    - "928"
    - "928_S"
    - "928_S2"
    - "928_S4"
    - "928_GT"
    - "928_GTS"
    - "944"
    - "944_Turbo"
    - "944S"
    - "944S2"
    - "968"
  engine_family:
    - "M28_V8"
    - "M44"
  year_range: "1978–1995"
  specific_model_years: null
  excludes: >
    924 applicability not confirmed at Tier B; excluded pending verification.

failure_mode: >
  Heater control valve plastic body splits at the glue seam or cracks through the body
  wall, releasing coolant into the engine bay.

failure_mechanism: >
  OEM HCV consists of two thin-walled plastic halves bonded at a central seam. Decades of
  thermal cycling embrittle the plastic and degrade the adhesive bond. Failure is often
  sudden rather than gradual. Supercharged 928 variants carry additional risk from
  pressure spikes on rapid pump spin-up, per 928 Motorsports' product documentation.

symptoms:
  - "Sudden coolant loss in engine bay without identifiable hose rupture"
  - "Visible crack or split at central seam of valve body, typically near firewall"
  - "Coolant dripping from HCV onto adjacent metal cooling pipes, obscuring the true source"
  - "Heater output changes — stuck-open or stuck-closed depending on split position and lever jam"

severity: 3

prevalence: >
  Documented characteristic failure of the OEM plastic HCV on 928 and shared 944/968
  platforms. 928 Motorsports describes this failure mode explicitly. All factory-installed
  valves date from the 1978–1995 production run and should be treated as at-risk.

mileage_at_failure:
  low: null
  high: null
  note: "Age-driven failure; no Tier B mileage range available."

inspection_checklist:
  - "Locate HCV near firewall; inspect body for cracks, crazing, or coolant staining at seam"
  - "Check coolant residue on adjacent pipes and wiring — drip pattern often originates at valve seam"
  - "Confirm whether a steel aftermarket replacement (928 Motorsports or equivalent) has already been fitted"
  - "Gently inspect seam joint under inspection light — stress crazing is often visible before full split"

buyer_questions:
  - "Has the heater control valve been replaced with the steel aftermarket unit?"
  - "Any history of sudden coolant loss events or unexplained coolant consumption?"

known_fixes:
  - >
    Replacement with 928 Motorsports all-steel heater control valve (Pelican Parts part
    928M-HEATRVLV); stated to fit 928 and many 944/968 applications. Eliminates the
    failure mode permanently.
  - >
    OEM plastic replacement is available but carries the same long-term failure risk;
    steel upgrade recommended given platform age.

cost_range:
  parts_low_usd: null
  parts_high_usd: null
  labor_low_usd: null
  labor_high_usd: null
  notes: "No Tier B cost data available."

sources:
  tier_a: []
  tier_b:
    - >
        928 Motorsports, steel heater control valve product listing (sold via Pelican
        Parts, part 928M-HEATRVLV). Explicitly documents the OEM two-piece plastic HCV
        as a known failure-prone design prone to splitting and coolant loss; notes
        applicability to many 944/968 models and elevated risk on supercharged 928 variants.
        URL: https://www.pelicanparts.com/More_Info/928MHEATRVLV.htm?pn=928M-HEATRVLV
  tier_c:
    - >
        Rennlist 928 forum, "Coolant Leakage" thread (April 2025). Community experience
        identifies HCV and its short hose as among the most common 928 cooling failure
        points; drip-pattern masking of source discussed.
        URL: https://rennlist.com/forums/928-forum/1467408-coolant-leakage.html

tier_a_absence_rationale: >
  No PCNA/Porsche TSB identified for HCV failure on 928/944/968. Failure is age-driven
  plastic degradation on a production line discontinued in 1995; formal TSB/recall not
  applicable at this fleet age. Tier B specialist documentation (928 Motorsports) is the
  primary evidence anchor.

cross_references:
  - >
    **File 04 — Engine: Transaxle 4-cylinder.** Covers 944/968 engine family (M44) and
    timing-related defects for the transaxle platforms sharing this HCV.
  - >
    **File 05 — Engine: 928 V8 (M28).** Covers engine defects for the 928 platform.
  - >
    **File 12 — Cooling Systems.** 928 radiator and primary cooling records.
  - >
    **Record 18-003 (this file) — 928 expansion tank cracking.** Related plastic cooling
    component failure on the same 928 platform.

_source_anchor:
  "reputation for splitting and dropping your coolant":
    source: "928 Motorsports, steel HCV product listing, part 928M-HEATRVLV via Pelican Parts"

notes: >
  The HCV drip pattern commonly masks its own source: coolant runs down onto adjacent
  metal cooling pipes and then drips, presenting as a hose or fitting leak. Inspection
  must trace the flow back to the valve body seam. Recommend treating HCV replacement as
  a proactive service item on any 928/944/968 undergoing cooling system work with original
  valve still installed.
```

---

## RECORD 18-003
### 928 Plastic Coolant Expansion Tank Cracking

```yaml
defect_id: COOLING_18_003
schema_version: "1.0"
content_status: draft

title: "928 plastic coolant expansion tank cracking"
category: cooling

description: >
  The factory coolant expansion tank (coolant reservoir) on all 928 models is a plastic
  component vulnerable to age-related embrittlement and thermal stress cracking. Long-term
  heat cycling in the V8 engine bay, combined with chemical action from coolant, causes the
  plastic to become opaque and brittle. Hairline cracks then develop, with subsequent
  coolant seepage or weeping. If undetected, a crack can propagate to a full loss event
  causing overheating and potential head gasket damage. All factory-installed expansion
  tanks date from the 1978–1995 production run. 928 Motorsports documents this failure
  pattern and offers an all-aluminum replacement as a permanent solution. Note: this record
  covers the expansion tank/reservoir only; the 928 radiator is covered separately in File 12.

applicability:
  platforms:
    - "928"
    - "928_S"
    - "928_S2"
    - "928_S4"
    - "928_GT"
    - "928_GTS"
  engine_family:
    - "M28_V8"
  year_range: "1978–1995"
  specific_model_years: null
  excludes: ""

failure_mode: >
  Plastic expansion tank develops hairline cracks at seams, molding joints, or around
  hose and sensor connections, leading to coolant seepage or structural failure.

failure_mechanism: >
  Engine compartment heat and coolant chemistry degrade the OEM plastic over decades,
  causing it to become opaque and brittle. Thermal pressure cycles stress material at
  thinner sections and joints. Cracks often initiate on the underside of the tank, hidden
  from casual underhood inspection.

symptoms:
  - "White or pink coolant residue on exterior of tank or on components directly below it"
  - "Gradual unexplained coolant loss without visible puddle under the car"
  - "Tank has become opaque or yellowed — visual indicator of embrittlement"
  - "Visible crack lines or stress-crazing on tank body, particularly on underside"

severity: 3

prevalence: >
  Universal age-related failure tendency across all surviving 928 platforms. 928 Motorsports
  treats expansion tank replacement as a near-inevitable service item and documents the
  failure mechanism explicitly on their product page, noting that removing a tank for
  inspection often reveals additional cracks not visible from outside.

mileage_at_failure:
  low: null
  high: null
  note: "Age-driven, not mileage-driven. No Tier B mileage range available."

inspection_checklist:
  - "Inspect tank from above and below (belly pan off) using raking light for cracks, crazing, or seepage"
  - "Check opacity and color — opaque or yellowed plastic indicates embrittlement and elevated failure risk"
  - "Inspect all hose connections and sensor grommet seals for seepage staining"
  - "Pressure-test the cooling system and observe tank specifically under pressure"
  - "Confirm whether an aluminum replacement has already been fitted"

buyer_questions:
  - "Has the coolant expansion tank been replaced? If so, OEM plastic or aluminum upgrade?"
  - "Any history of coolant loss events or overheating?"

known_fixes:
  - >
    Replacement with 928 Motorsports all-aluminum coolant reservoir (drop-in fit;
    accommodates original hoses and water-level sensor). Eliminates the failure mode
    permanently.
  - >
    OEM plastic replacement is available but will eventually reach the same failure
    condition; aluminum upgrade recommended given fleet age.

cost_range:
  parts_low_usd: null
  parts_high_usd: null
  labor_low_usd: null
  labor_high_usd: null
  notes: "No Tier B labor-cost data available."

sources:
  tier_a: []
  tier_b:
    - >
        928 Motorsports, aluminum coolant reservoir product page. Documents OEM plastic
        failure mechanism: heat and coolant chemistry cause opacity, brittleness, and
        cracking. Notes that removed tanks frequently show additional cracks not externally
        visible. Offers aluminum drop-in replacement.
        URL: https://928motorsports.com/parts/coolant_reservoir.php
  tier_c:
    - >
        Rennlist 928 forum, "Coolant Leakage" thread (April 2025). Community guidance on
        pressure-testing technique for 928 expansion tank using Stant adapter; confirms
        seepage presentation.
        URL: https://rennlist.com/forums/928-forum/1467408-coolant-leakage.html

tier_a_absence_rationale: >
  No PCNA/Porsche TSB for expansion tank failure. Age-driven plastic failure on a
  production line discontinued in 1995; formal recall/TSB not applicable.

cross_references:
  - >
    **File 12 — Cooling Systems.** 928 radiator and primary cooling records; this record
    covers the expansion tank separately per the File-12 deferral note.
  - >
    **File 05 — Engine: 928 V8 (M28).** 928 V8 engine family records.
  - >
    **Record 18-002 (this file) — 928/944/968 HCV failure.** Related plastic cooling
    component failure on the same 928 platform.

_source_anchor:
  "opaque and brittle, cracks develop":
    source: "928 Motorsports, aluminum coolant reservoir product page, 928motorsports.com"
  "additional cracks not previously visible":
    source: "928 Motorsports, aluminum coolant reservoir product page, 928motorsports.com"

notes: >
  Underside-crack behaviour means standard underhood inspection routinely misses early
  cracking. Recommend belly-pan-off inspection with raking or UV light. Given platform
  age, treating expansion tank replacement as a proactive item at purchase is reasonable
  rather than waiting for external failure evidence. Distinct from the 928 radiator
  (File 12) and the 928 HCV (Record 18-002 this file).
```

---

## RECORD 18-004
### 996 / 997 / 986 / 987 Radiator Fan Resistor Pack Failure

```yaml
defect_id: COOLING_18_004
schema_version: "1.0"
content_status: draft

title: "996 / 997 / 986 / 987 radiator fan resistor pack failure"
category: cooling

description: >
  The front radiator fans on 996, 997, 986, and 987 platforms use resistor packs to
  govern low-speed and high-speed fan operation. Pelican Parts, across both their 996/997
  and 986/987 radiator technical articles, specifically notes that these resistor packs
  tend to fail. Failure disables low-speed fan operation or renders one or both fans
  inoperative, degrading thermal management during low-speed urban driving and at idle.
  Because high-speed fan mode can remain functional (bypassing the resistor), the fault
  is often intermittent and may not register as a code or visible overheating event under
  typical driving conditions. However, the degraded safety margin is relevant to platform
  populations — particularly M96 engines — that are already sensitive to elevated coolant
  temperatures.

applicability:
  platforms:
    - "996.1"
    - "996.2"
    - "997.1"
    - "997.2"
    - "986"
    - "987.1"
    - "987.2"
  engine_family:
    - "M96"
    - "M97"
    - "Mezger"
  year_range: "1996–2012"
  specific_model_years: null
  excludes: ""

failure_mode: >
  Resistor pack fails electrically, disabling low-speed fan operation or causing complete
  fan inoperability on one or both left/right fan circuits.

failure_mechanism: >
  Resistor packs are mounted in the front bumper airstream and remain exposed to water
  ingress and thermal cycling. Moisture and age degrade resistor components over time.
  Failure mode is typically open-circuit — fan inoperative — rather than short-circuit.
  Left and right packs fail independently.

symptoms:
  - "Radiator fan not operating at low speed during normal warm-up or with AC engaged"
  - "Fan operates only at high speed (bypasses resistor) or is completely inoperative"
  - "Slightly elevated coolant temperature at idle or in slow traffic, no code logged"
  - "AC cooling performance degraded at idle conditions"

severity: 2

prevalence: >
  Described by Pelican Parts across two separate platform-specific technical articles
  (996/997 and 986/987) as a known failure tendency for the fan resistor circuit.

mileage_at_failure:
  low: null
  high: null
  note: "No Tier B mileage range available; appears to be age and exposure driven."

inspection_checklist:
  - "With ignition on, activate AC — both front fans should spin at low speed; confirm each side independently"
  - "Allow coolant temp to reach the high-speed fan trigger threshold (Pelican 986/987 article cites ~90 °C) — both fans should advance to high speed"
  - "Remove front bumper and inspect resistor pack connectors for corrosion or heat damage"
  - "Use PST-2/PIWIS or equivalent scan tool to command individual fan speed test if available"

buyer_questions:
  - "Have both front radiator fan resistor packs been inspected or replaced?"
  - "Do both fans operate at low speed when AC is switched on at idle?"

known_fixes:
  - >
    Replacement of failed resistor pack(s). OEM replacement available through Porsche or
    specialist suppliers; pack mounts on fan shroud and is accessible after front bumper
    removal.

cost_range:
  parts_low_usd: null
  parts_high_usd: null
  labor_low_usd: null
  labor_high_usd: null
  notes: >
    No Tier B cost data. Parts cost is modest; primary cost is labor for bumper removal.
    Some owners report DIY resistor substitution using generic components.

sources:
  tier_a: []
  tier_b:
    - >
        Pelican Parts, 996/997 Radiator and Fan Replacement technical article (Wayne R.
        Dempsey, Co-Founder). States that resistor packs on 996/997 radiator fans tend to
        fail; recommends checking fan operation whenever front radiators are accessed.
        URL: https://www.pelicanparts.com/techarticles/Porsche-996-997-Carrera/32-WATER-Radiator_and_Fan_Replacement/32-WATER-Radiator_and_Fan_Replacement.htm
    - >
        Pelican Parts, Boxster Radiator Replacement and Cleaning — 986/987 technical
        article (Wayne R. Dempsey, Co-Founder). Repeats the same guidance on resistor pack
        failure tendency for the Boxster platform.
        URL: https://www.pelicanparts.com/techarticles/Boxster_Tech/32-WATER-Main_Radiator/32-WATER-Main_Radiator.htm
  tier_c:
    - >
        Rennlist 996 forum, "Cooling Fan Resistor" thread. Owner accounts of resistor
        failure symptoms, DIY and OEM replacement approaches.
        URL: https://rennlist.com/forums/996-forum/857242-cooling-fan-resistor.html
    - >
        986forum.com, "Rad Fan Resistor Fix" thread. DIY resistor repair guidance for
        986 Boxster; confirms failure presentation.
        URL: http://986forum.com/forums/performance-technical-chat/60165-rad-fan-resistor-fix.html

tier_a_absence_rationale: >
  No PCNA/Porsche TSB identified for resistor pack failure. Age and thermal-exposure-driven
  component degradation documented by Pelican Parts (Tier B) as a known tendency; does not
  meet the threshold for a formal recall or TSB.

cross_references:
  - >
    **File 12 — Cooling Systems.** Prior cooling records for the 996.1 platform, including
    water pump and coolant system context.
  - >
    **File 11 — Electrical.** Electrical records for overlapping 996/997/986/987 platforms.
  - >
    **File 01 — Engine: M96/M97 flat-6.** M96 bore-scoring record; degraded fan cooling
    at idle reduces the thermal safety margin relevant to that defect population.

_source_anchor:
  "resistor packs that help to power them tend to fail":
    source: "Pelican Parts, 996/997 Radiator and Fan Replacement article (Wayne R. Dempsey); mirrored in 986/987 article"
  "~90 °C high-speed fan trigger":
    source: "Pelican Parts, Boxster Radiator Replacement and Cleaning — 986/987 article (Wayne R. Dempsey)"

notes: >
  Left and right fans have independent resistor packs; one side may fail while the other
  operates normally. Testing must confirm each side independently. The symptom can be
  subtle: the vehicle rarely overheats under most conditions because high-speed mode still
  functions, but the cooling system runs slightly above optimal at idle. This thermal margin
  reduction is particularly relevant to the M96 engine population given bore-scoring
  sensitivity to elevated coolant temperatures (cross-reference File 01, bore scoring
  record). Recommend including fan functional test in any pre-purchase inspection on these
  platforms.
```

---

## Session Deferred Items

### 9Y0 Cayenne Vacuum-Actuated Water Pump Seal Failure — HIGH PRIORITY

Not authored this session due to absence of confirmed Tier B source. Evidence summary:

- **Failure mechanism identified**: The EA839-engined 9Y0 Cayenne (2019+, V6 and V8 turbocharged variants) uses a vacuum-actuated water pump incorporating a shroud cylinder and diaphragm seal. When the seal between the cylinder and diaphragm degrades, coolant enters the vacuum system, contaminating the valve block and vacuum harness. Failure modes parallel Record 18-001 (991.2 pump) — same internal-leak-into-vacuum pattern.
- **Tier C evidence**: Rennlist "Infamous Coolant / Water Pump Failure w/ Coolant Leak into Vacuum System" megathread (51+ pages, hundreds of data points). Multiple distinct threads confirming pattern across 2019–2024 builds. Repair costs referenced at $6,500–$9,000+ out of warranty (Tier C only).
- **Tier A candidates**: Forum posts reference "WRG8 campaign" (thermostat-related) and a separate Porsche coolant-pump/changeover-valve campaign, but neither has been confirmed via a publicly accessible NHTSA filing as of this session. A formal search of NHTSA for 9Y0-specific filings is required before authoring.
- **Tier B gap**: No named Porsche/Cayenne specialist (Suncoast, Motronix, or equivalent) has been confirmed with a technical page specifically addressing this failure mode.
- **Multi-marque note**: EA839 engine is shared across VW Group (Audi RS5, Q5, SQ5, Macan ICE variants). A VW of America water pump class-action settlement (NHTSA MC-10214802) exists for VW vehicles; Porsche is not named in that action. The shared engine architecture is relevant to the multi-marque catalog design.
- **Action required**: Dedicated session to confirm Tier A (PCNA NHTSA filings for 9Y0) and Tier B (Suncoast or similar Cayenne specialist). If Tier A confirmed, record should be authored promptly — this is a high-frequency auction listing population (2019–2024 Cayenne).

### 996/997 Thermostat Housing Leaks — BELOW BAR, CLOSE

No Tier B source found explicitly framing the 996/997/986/987 thermostat housing itself (not the expansion tank, not the hose) as a defect-prone component. Pelican articles treat thermostat and housing as a maintenance service item replaced with the water pump, not as an independent failure-prone part. Remains deferred; revisit if FCP Euro or equivalent publishes specific thermostat-housing-as-defect coverage for M96/M97.

---

## Self-Review + Second-Opinion Review Findings — All Resolved

| # | Record | Issue | Resolution |
|---|--------|--------|-----------|
| 1 | 18-001 | `"under 15,000 miles"` lacked `_source_anchor` | Removed numeric; added anchored Rennlist WO reference in note |
| 2 | 18-002 | `"30–45 years"` fleet age arithmetically wrong + no anchor | Replaced with `"1978–1995 production run"` in description and prevalence |
| 3 | 18-002 | Same 928 Motorsports phrase quoted in tier_b description and anchor key | Converted tier_b description to paraphrase; direct quote retained only in anchor key |
| 4 | 18-003 | `"30–45 years"` same error in description | Replaced with `"1978–1995 production run"` |
| 5 | 18-004 | `year_range: "1997–2012"` — 986 production started 1996 | Corrected to `"1996–2012"` |
| 6 | 18-004 | `"approximately 90 °C"` in inspection checklist lacked anchor | Anchored to Pelican 986/987 radiator article in checklist text and added anchor key |
| 7 | 18-004 | File 01 referenced only in `notes:` prose, absent from `cross_references:` YAML | Added `**File 01 — Engine: M96/M97 flat-6.**` to `cross_references:` array |

All three blockers (#2, #4, #5) and four minors (#1, #3, #6, #7) resolved. File ready for `content_status: draft → verified`.
