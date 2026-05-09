# 99 — Shared Water-Cooled Era

Defects spanning multiple engine families across the water-cooled era.
Records here apply to issues that affect M96, M97, M48 (Cayenne V8),
Mezger (M96.76/M96.79 in 996/997 Turbo and GT3 variants), and in some
cases the 9A1 family. Where a record applies asymmetrically across
engine families, scope is called out in `applicability` and editorial.

Cross-references back to engine-specific files (01, 02, 06) appear in
editorial where the shared issue interacts with engine-specific failure
modes.

---

## Records

### 1. Secondary Air Injection (SAI) failure

```yaml
id: secondary_air_injection_failure
flag_title: "Secondary air injection (SAI) failure — pump, valve, or plugged head ports"
description: |
  The secondary air injection system pumps fresh air into the exhaust
  stream during cold start to accelerate catalyst warm-up and reduce
  cold-start hydrocarbon emissions. On Porsche water-cooled engines
  the system is monitored by the DME via the upstream O2 sensors;
  insufficient detected airflow on the cold-start active test sets
  P0410, P0411, P1411, P1413 (Carrera/Boxster/Cayman family) or
  P0491/P0492 (Cayenne V8 / Panamera).

  Failures fall on a spectrum, and the cost differs by an order of
  magnitude across the spectrum:

  1. **Component failures** (pump, change-over valve, vacuum-operated
     air valve, check valve, electric pneumatic valve, fuse/relay,
     hose). The pump itself is the most common component failure and
     is often caused by exhaust gas back-flow eating the foam filter
     and damaging the impeller, eventually drawing too much current
     and blowing the fuse. Repair is replace-the-failed-component.

  2. **Plugged SAI ports in the cylinder head / cam carrier passages**.
     Carbon and burnt oil residue accumulates in the small air
     passages cast into the heads. On M96/M97 engines the design has
     a strange joint between the head and the passageway in the cam
     box where soot collects. Cleaning can sometimes be done in-situ
     via the check-valve location with carb cleaner, compressed air,
     and a flexible cable on a drill (the Pelican / PCA Tech Q&A
     procedure). When ports are too far gone to clean in place,
     remediation requires removing the cylinder heads and reaming
     the passages — this is the "top end" job and the cost driver.

  Common code combinations include P0410+P1411 (bank 1) or
  P0411+P1413 (bank 2) on flat-six engines; P0491/P0492 on V8s.

  Component-failure repairs are often DIY-feasible. Port-clogging
  remediation done at a Porsche specialist runs from a few hours of
  shop time (in-situ cleaning, if reachable) up to a heads-off
  rebuild on the worst cases.

applicability:
  generation: ['993', '996', '997', '986', '987', '981', '955', '957', '958', '970']
  engine_family: ['M96', 'M97', 'M48 (Cayenne V8)', 'Mezger (996/997 Turbo, 996/997 GT3, 996/997 GT2)', '9A1 (port-side hardware only)']
  year_range: [1996, 2016]
  trim_category: ['all US-spec gasoline models with SAI fitted']
  body: ['coupe', 'cabriolet', 'targa', 'suv', 'sedan']
  excludes:
    - description: |
        Pre-OBDII 993s (1995 model year US-spec) have SAI hardware but
        no CEL trigger, so the failure manifests as a slow loss of
        cold-start emissions performance rather than as a code/MIL.
        Effectively no buyer-visible flag for these cars.
      year_range: [1995, 1995]
      generation: ['993']
    - description: |
        ROW (rest-of-world, non-US) cars built without SAI hardware
        are not affected. Some non-US 996.1s (e.g. early ROW 3.4
        without e-gas) shipped without the pump entirely.
      trim_category: ['ROW non-SAI variants']
    - description: |
        Mezger port-clogging scope is limited. The Mezger uses a
        dry-sump dual-head architecture with different cam-carrier
        passage geometry than M96/M97 and is not documented as
        suffering the same head-port carbon accumulation; SAI
        component failures (pump, valves, vacuum control) are still
        in scope on Mezger cars.
      engine_family: ['Mezger (port-clogging mode only — pump/valve mode still applies)']

severity: moderate
# Bimodal: component-only repairs are low-to-moderate; heads-off port
# remediation is high. Severity is set by the worst common case (port
# remediation) per the catalog convention; cost_range_usd captures the
# spread.

cost_range_usd: [200, 6000]
cost_source_anchor: |
  Low end: DIY component replacement (pump, check valve, change-over
  valve) in the $200–$500 parts range, per Pelican Parts DIY tech
  article on the Cayenne secondary air pump replacement and the
  p-car.com 996 SAI valve DIY (DIY-feasible job, parts-only cost in
  this range).
  https://www.pelicanparts.com/techarticles/Porsche-Cayenne/66-FUEL-Secondary_Air_Pump_Replacement/66-FUEL-Secondary_Air_Pump_Replacement.htm
  http://p-car.com/996/diy/sai/mainpage.html

  Mid range: specialist port cleaning labor on a flat-six runs to
  several shop hours; the PCA Tech Q&A on 1998 993 SAI port cleaning
  notes the dealer's alternative is "a top end rebuild and you will
  pay no less than $6,000."
  https://www.pca.org/tech/1998-993-secondary-air-injection-system-cleaning

  High end: PCA's $6,000 top-end-rebuild figure (above) is the Tier-A
  anchor for the high end of the cost range on flat-six cars where
  port-clogging is severe enough to require heads-off remediation.
  Cayenne V8 SAI failures are pump-weighted rather than port-weighted
  in available specialist sources, so the high end of the range
  applies primarily to the M96/M97 population.

prevalence_rate: |
  Common across the affected scope, particularly on higher-mileage
  M96/M97 cars and on US-market Cayenne V8s. Component-level failures
  (pump, valve) are routine wear items and very widely reported
  across all the affected platforms. Severe port-clogging requiring
  heads-off remediation is the less-common tail of the distribution.

prevalence_source_anchor: |
  PCA Tech Q&A frames SAI port maintenance as a 20-to-30k-mile
  service interval for the 993 population, applying across driving
  styles, and notes that dealers commonly defer until the CEL is on
  and ports are blocked. Establishes the pattern as routine across
  the population rather than rare.
  https://www.pca.org/tech/1998-993-secondary-air-injection-system-cleaning

  systemsc.com (specialist write-up) describes the small SAI
  passages as "prone to fairly easy carbon buildup restricting air
  injection flow" on the 993. The 993 source establishes the
  mechanism on the air-cooled platform; the M96/M97 head-port
  pattern is independently anchored to PCA Tech Q&A's discussion
  of the head-to-cambox passage joint where soot collects (same
  PCA URL above).
  https://www.systemsc.com/pictures.htm

failure_correlation: mixed
# Both age (rubber hoses, vacuum diaphragms perish) and mileage
# (carbon accumulation, pump filter degradation) drive failure. Climate
# also contributes — see regional_amplification.

typical_failure_mileage: [50000, 150000]
typical_failure_mileage_source_anchor: |
  PCA Tech Q&A frames port-cleaning as needed every 20k-30k miles,
  implying first onset commonly observable in the 50k+ range and
  frequent by 100k+. The specific mileage range is conservatively
  bounded based on this PCA framing.
  https://www.pca.org/tech/1998-993-secondary-air-injection-system-cleaning

retrofit_available: no
# No improved replacement for the OEM SAI architecture is offered.
# "SAI delete" tunes exist (ECU coding-out) but are emissions-illegal
# in regulated states and not a retrofit in the catalog sense.

regional_amplification:
  desert_southwest: low
  cold_climate: moderate
  salt_belt: moderate
  emissions_inspection_states: high
# Cold-climate amplification: water in the air-injection plumbing can
# freeze and cause the pump fuse to blow on activation. Salt-belt is
# a secondary amplification via corrosion. The dominant amplifier is
# regulatory: stored P04xx codes fail OBDII inspection in California
# and the CARB-aligned states (NY, NJ, MA, CT, etc.), forcing repair.
# In states without OBDII smog inspection the same fault often goes
# ignored — the engine drives normally with the CEL on. Note: this
# is NOT a "California-spec car" issue; modern Porsches have been
# 50-state emissions compliant since at least the 997.2 era. The
# amplification is the inspection regime, not the hardware spec.

keywords_addressed:
  - "secondary air pump replaced"
  - "SAI pump replaced"
  - "SAI valve replaced"
  - "change-over valve replaced"
  - "check valve replaced"
  - "SAI ports cleaned"
  - "secondary air injection serviced"
  - "P0410 fixed"
  - "P0411 fixed"
  - "P1411 cleared"
  - "P0492 resolved"
  - "carbon cleaning performed"
  - "SAI delete"

keywords_concerning:
  - "P0410"
  - "P0411"
  - "P1411"
  - "P1413"
  - "P0491"
  - "P0492"
  - "secondary air"
  - "SAI"
  - "air pump"
  - "smog pump"
  - "cold-start CEL"
  - "fails emissions"
  - "won't pass smog"

keywords_active_problem:
  - "CEL on"
  - "check engine light on"
  - "fails smog"
  - "SAI fault"
  - "secondary air fault"
  - "rough cold start"
  - "cold start stumble"
  - "blown SAI fuse"

keywords_documented:
  - "SAI service records"
  - "SAI cleaning receipt"
  - "secondary air pump invoice"
  - "port cleaning invoice"

evidence_basis: specialist_consensus
sources:
  - "[REF1] PCA Tech Q&A — 1998 993 Secondary Air Injection System Cleaning. https://www.pca.org/tech/1998-993-secondary-air-injection-system-cleaning . Tier A."
  - "[REF2] PCA Tech Q&A — Cleaning Secondary Air Injection Ports — Success! https://www.pca.org/tech/cleaning-secondary-air-injection-ports-success . Tier A."
  - "[REF3] Pelican Parts — Porsche 993 Secondary Air Injection Port Cleaning. https://www.pelicanparts.com/techarticles/pcar_com/993_secondary_air_injection_ports.htm . Tier B."
  - "[REF4] Pelican Parts — Porsche Cayenne Secondary Air Pump Replacement. https://www.pelicanparts.com/techarticles/Porsche-Cayenne/66-FUEL-Secondary_Air_Pump_Replacement/66-FUEL-Secondary_Air_Pump_Replacement.htm . Tier B."
  - "[REF5] systemsc.com — Porsche 993 Secondary Air Injection System (specialist analysis, 993-scoped). https://www.systemsc.com/pictures.htm . Tier B."
  - "[REF6] p-car.com — 996 Secondary Air Injection Valve Replacement DIY. http://p-car.com/996/diy/sai/mainpage.html . Tier B."
  - "[REF7] Rennlist — 996 Turbo Secondary Air Injection P0410/P1411 (confirms Mezger 996TT shares SAI architecture with M96 NA cars). https://rennlist.com/forums/996-turbo-forum/580839-secondary-air-injection-errors-p1411-and-p0410.html . Tier C."

editorial_note: |
  SAI failures are among the most common CEL-triggering issues in the
  water-cooled Porsche population. The phrase "the SAI is acting up"
  spans an enormous repair-cost range — from a $200 DIY pump swap to
  a heads-off rebuild north of $5,000 — so the language a seller uses
  matters more than usual when interpreting a listing.

  When a listing mentions an SAI repair, look for what specifically
  was done. "Replaced the pump" is a different category of work than
  "cleaned the ports" or "had the heads off." Ports that were cleaned
  in-situ tend to re-foul over time (PCA's 20k–30k mile service
  interval framing), so a port cleaning isn't permanent. A heads-off
  reaming is much more durable but is rarely documented on a sub-$30k
  car because the economics don't justify it.

  Conversely, a stored P0410/P0411/P1411 fault on the listing's most
  recent scan should be treated as live work pending. In states with
  OBDII smog inspection (California and the CARB-aligned states), the
  car cannot be registered until cleared. In states without
  inspection, the seller may have simply ignored it for years; the
  underlying cause (pump dying, ports clogging, valve perishing) is
  still progressing.

  On Cayenne V8s the failure mode is heavily weighted toward pump
  failure rather than head ports — the V8 architecture exposes the
  pumps to engine-bay heat and exhaust back-flow more than the
  flat-six layout, and pump foam ingestion / impeller damage is a
  recurring pattern. On flat-six M96/M97 cars, the head-port mode is
  the more expensive failure path and worth asking about specifically
  on cars with documented oil consumption history (since oil burning
  accelerates the carbon accumulation in the SAI passages).

  Mezger 996/997 Turbo and GT3 cars share the SAI hardware and the
  same fault codes, but the dual-head dry-sump architecture does not
  appear in available specialist sources to suffer the same head-port
  carbon accumulation. Treat Mezger SAI faults as component-level
  (pump, valve, vacuum control) by default and as port-clogging only
  with strong evidence.

  Cayenne Hybrid (958 Hybrid, model years roughly 2011–2018) and
  Panamera Hybrid models use an Audi-derived EA837 supercharged
  3.0L V6 rather than the M48 Cayenne V8, and that engine has its
  own well-documented SAI head-port-clogging mode shared across the
  VAG group (Audi S4/A6/Q5 with the same engine). This record does
  NOT cover the Cayenne Hybrid SAI failure path — the engine family
  is out of scope. Flag Cayenne Hybrid SAI faults as a separate
  issue with potentially different remediation paths and cost; an
  Audi-aware specialist may be the right repair channel.

  "SAI delete" via ECU coding is occasionally referenced in listings,
  particularly on tuned cars. This is emissions-illegal in regulated
  US states and may complicate registration or resale; flag any
  mention of SAI delete or block-off plates on a US-market car as
  pending regulatory exposure.

buyer_questions:
  - "Has the SAI system ever triggered a check engine light? When and what was done?"
  - "Were the repairs at the pump/valve level, or did they involve cleaning the head ports?"
  - "Is there any current stored fault code (P0410, P0411, P1411, P0491, P0492)?"
  - "If the car is in California or another OBDII-inspection state, when does the next smog test fall?"
  - "Has anyone proposed a 'top-end' or heads-off remediation, and if so, what was the quote?"
  - "If the car has been tuned, has the SAI been deleted or coded out of the ECU?"
```

---

### 2. Ignition coil failures (cross-engine pattern)

```yaml
id: ignition_coil_failure_pattern
flag_title: "Ignition coil pack failures — cross-engine wear pattern with secondary risks"
description: |
  Ignition coils on the water-cooled Porsche flat-six and V8 engines
  are mounted directly on the spark plugs (coil-on-plug design). They
  are subject to engine-bay heat, road spray, and on cabriolet/targa
  models occasional water ingress; cracked coil bodies and carbon
  tracing on the secondary insulator are the typical failure modes.
  Failure presents as a misfire code on the affected cylinder
  (P0301–P0306 on the flat-six, P0301–P0308 on the Cayenne V8) and
  rough running, often more pronounced under load than at idle.

  The OEM Beru coils have been revised multiple times across the
  M96/M97 production run, with separate part-number families for
  the early 5-chain M96 (107-series, latest revision 997 602 107 04)
  and the later M96/M97 Carrera/Boxster/Cayman applications
  (104-series, latest revision 997 602 104 06). Mezger applications
  use a different family entirely. See `retrofit_kit_names` below
  for the full matrix. The pattern across all these families is the
  same: a single coil failure typically signals that the rest of the
  set is approaching end-of-life, and bulk replacement with the
  latest applicable revision is the recommended path.

  The failure is a normal-wear / service item rather than a true
  defect, but it carries two secondary risks worth flagging:

  1. **Catalyst poisoning** — sustained driving with a misfire dumps
     unburned fuel into the catalytic converter and can damage the
     substrate, turning a routine coil swap into a much more
     involved cat-replacement job.

  2. **Cylinder wall fuel-washing** — on M96/M97 (Boxster/Cayman/911
     Carrera, 1997–2008) and to a lesser extent on M48 Cayenne V8s,
     unburned fuel from a misfiring cylinder washes the oil film off
     the cylinder wall. This is one of several contributing factors
     to bore scoring on the affected engines (cross-reference file
     01 for M96/M97 bore scoring; file 06 for Cayenne V8 bore
     scoring).

  A misfire on a high-mileage M96/M97 or M48 should not be ignored
  while the coil is sourced. The cost of waiting two weeks to fix a
  $40 coil can be a five-figure engine rebuild if it accelerates an
  already-progressing bore-scoring condition.

applicability:
  generation: ['996', '997', '986', '987', '981', '955', '957', '958', '970', '991', '718']
  engine_family: ['M96', 'M97', 'M48 (Cayenne V8)', 'Mezger (996/997 Turbo, GT3, GT2)', '9A1', 'MA1 (Cayenne 3.6 V6)', 'MA2 (982 718 4-cyl turbo)']
  year_range: [1997, 2020]
  trim_category: ['all gasoline-powered water-cooled Porsche models']
  body: ['coupe', 'cabriolet', 'targa', 'suv', 'sedan']
  excludes:
    - description: |
        Air-cooled 911 and 944/968/928 era distributor-and-coil
        ignition systems are excluded. This record covers
        coil-on-plug designs only.
      engine_family: ['air-cooled flat-six', '928 V8 (distributor era)', '944/968 4-cylinder']

severity: low
# Replacement of all six (or eight) coils plus plugs on a Porsche
# specialist's bench falls comfortably under the $1k threshold even
# on Cayenne V8s. Severity rises only via the secondary risks
# (catalyst, bore scoring) and those are captured cross-reference
# rather than re-counted here.

cost_range_usd: [300, 1200]
cost_source_anchor: |
  Beru OEM coil-pack kits of 6 from FCP Euro list in the
  $348–$429 band depending on application (Beru ZSE163KT $348.57;
  Beru ZSE052KT $428.90; pricing checked May 2026, subject to
  drift). Single Beru coils approx. $36 each retail.
  https://www.fcpeuro.com/products/porsche-ignition-coil-kit-beru-bosch-95bignclkt
  https://www.fcpeuro.com/products/porsche-ignition-coil-kit-beru-bosch-zse052kt
  https://www.fcpeuro.com/products/porsche-direct-ignition-coil-beru-94660210400

  Cayenne shop-labor figure for a combined coils-and-plugs job:
  Pelican Parts DIY article on the procedure has a commenter
  reporting roughly $500 in parts (six coils, V6 base Cayenne) vs.
  a ~$1,500 dealer labor quote on a 2009 base Cayenne. Note the
  2009 base Cayenne uses the 3.6L MA1 V6 (six coils), so this
  anchor is V6-scoped; Cayenne V8 jobs (eight coils) trend toward
  the upper end of the cost range due to the additional two coils
  and engine-bay packaging.
  https://www.pelicanparts.com/techarticles/Porsche-Cayenne/21-ENGINE-Coil_Pack_and_Spark_Plug_Replacement/21-ENGINE-Coil_Pack_and_Spark_Plug_Replacement.htm

prevalence_rate: |
  Common high-mileage wear pattern across the affected scope.
  Specialists treat coil replacement as routine service after
  approximately 50,000 miles, with full-set replacement
  recommended on first individual failure. Older cars with
  original coil packs are particularly likely candidates for
  preventive replacement at the next plug service.

prevalence_source_anchor: |
  PCarwise (specialist content) describes the M96/M97 ignition coil
  pattern as having been revised multiple times by Porsche, with
  the original coils prone to cracking, and recommends replacing
  the full set after any single failure on cars still running
  older-revision coils.
  https://www.pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/

  PCarwise on the Cayenne V8 frames an individual coil failure as
  a leading indicator that the rest of the set is approaching
  end-of-life, and recommends bulk replacement when the trigger is
  age or mileage rather than a one-off fault.
  https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/

  LN Engineering's product pages for M96/M97 OEM ignition coil sets
  recommend inspecting and replacing coil packs whenever spark
  plugs are changed, and recommend the spark-plug interval at
  4 years / 40,000 miles. (Note: LN's separate failures-explained
  page references Porsche's longer 4-year / 48,000-mile interval;
  the 40k figure is LN's own conservative recommendation.)
  https://lnengineering.com/m96-oem-aftermarket-ignition-coils-99760210704-set-of-6/
  https://lnengineering.com/m96-m97-oem-aftermarket-ignition-coils-99760210406-set-of-6/

failure_correlation: mileage
# Coil failure is overwhelmingly mileage-driven (heat cycling and
# insulator degradation), with secondary age component on cars that
# sit (rubber boot perishing). Climate adds a salt-belt amplifier.

typical_failure_mileage: [50000, 100000]
typical_failure_mileage_source_anchor: |
  LN Engineering's product pages tie coil inspection to the
  spark-plug interval of 4 years / 40,000 miles, establishing the
  ~40-50k range as the lower edge of the failure window.
  6SpeedOnline forum reports of coil cracking in the mid-30k mile
  range under salt-belt conditions set the early tail; the bulk of
  population failures cluster in the 50k–100k range.
  https://lnengineering.com/m96-oem-aftermarket-ignition-coils-99760210704-set-of-6/
  https://www.6speedonline.com/forums/997/216722-ignition-coil-problem.html

retrofit_available: yes
retrofit_kit_names:
  - "Beru OEM revised coil packs — Porsche P/N 997 602 107 04 (latest 107-series revision; fits 1997–2002 Boxster and 1999–2001 911 with 5-chain M96)"
  - "Beru OEM revised coil packs — Porsche P/N 997 602 104 06 (latest 104-series revision; fits 2002–2008 911, 2005–2008 Boxster, 2006–2008 Cayman)"
  - "Mezger applications (996/997 Turbo, GT2, GT3) use a different coil family — Beru ZS178 / 99760210404"
  - "FCP Euro / Pelican Parts complete-set kits (Beru / Bremi OEM, with lifetime warranty replacement on FCP Euro)"

regional_amplification:
  desert_southwest: moderate
  cold_climate: low
  salt_belt: high
# Salt-belt amplification is well-documented — coil location is
# subject to road spray and the salt accelerates insulator
# degradation. Desert heat is a moderate amplifier via heat-soak
# cycling. Cold climate is largely neutral.

keywords_addressed:
  - "coils replaced"
  - "ignition coils replaced"
  - "coil packs replaced"
  - "all six coils"
  - "all eight coils"
  - "Beru coils installed"
  - "coil pack set"
  - "spark plugs and coils"
  - "tune-up done"

keywords_concerning:
  - "P0301"
  - "P0302"
  - "P0303"
  - "P0304"
  - "P0305"
  - "P0306"
  - "P0307"
  - "P0308"
  - "P0300"
  - "misfire code"
  - "ignition coil"
  - "coil pack"
  - "secondary ignition"

keywords_active_problem:
  - "misfiring"
  - "rough idle"
  - "stumbles under load"
  - "rough cold start"
  - "CEL on"
  - "running rough"
  - "dead cylinder"

keywords_documented:
  - "coil pack receipt"
  - "ignition coil invoice"
  - "Beru coil purchase"
  - "tune-up records"

evidence_basis: specialist_consensus
sources:
  - "[REF1] PCarwise — Porsche 911 Common Problems. https://www.pcarwise.com/local-help/porsche-common-problems/porsche-911-common-problems/ . Tier B."
  - "[REF2] PCarwise — Porsche Cayenne / Panamera Common Problems. https://www.pcarwise.com/local-help/porsche-common-problems/porsche-cayenne-panamera-common-problems/ . Tier B."
  - "[REF3a] LN Engineering — M96 OEM/Aftermarket Ignition Coils 99760210704 product page (5-chain M96 family, current latest revision, 4yr/40k plug interval). https://lnengineering.com/m96-oem-aftermarket-ignition-coils-99760210704-set-of-6/ . Tier B."
  - "[REF3b] LN Engineering — M96/M97 OEM/Aftermarket Ignition Coils 99760210406 product page (later 996/997/Boxster/Cayman family). https://lnengineering.com/m96-m97-oem-aftermarket-ignition-coils-99760210406-set-of-6/ . Tier B."
  - "[REF4] Pelican Parts — Porsche Cayenne Coil Pack and Spark Plug Replacement. https://www.pelicanparts.com/techarticles/Porsche-Cayenne/21-ENGINE-Coil_Pack_and_Spark_Plug_Replacement/21-ENGINE-Coil_Pack_and_Spark_Plug_Replacement.htm . Tier B."
  - "[REF5] FCP Euro — Beru ignition coil kit listings (current parts pricing). https://www.fcpeuro.com/products/porsche-ignition-coil-kit-beru-bosch-95bignclkt . Tier B."
  - "[REF6] Fluid MotorUnion — Porsche Cayenne S Rough Idle Stumble (specialist diagnostic write-up confirming coil-replacement-as-fix pattern). https://fluidmotorunion.com/porsche-cayenne-s-rough-idle-stumble/ . Tier B."
  - "[REF7] 6SpeedOnline — Ignition Coil problem (community reporting of salt-belt amplification and multi-coil failure clustering). https://www.6speedonline.com/forums/997/216722-ignition-coil-problem.html . Tier C."

editorial_note: |
  Coil replacement on a Porsche is service, not repair. A listing
  showing a recent full-set coil-and-plug job is a positive signal
  rather than a flag — it's a maintenance line item the next owner
  doesn't have to do. Conversely, a misfire on the most recent scan
  with no coil work documented in the records means the next owner
  is buying the work.

  The reason this pattern earns a defect-catalog entry rather than
  living quietly in the maintenance schedule is the secondary-risk
  link to bore scoring on M96/M97 and M48 engines. A single misfiring
  cylinder will dump unburned fuel onto the cylinder wall and wash
  away the protective oil film. On a 1997–2008 Boxster/Cayman/911
  Carrera (M96/M97) or a 2003–2010 Cayenne V8 (M48), where bore
  scoring is the dominant catastrophic failure mode and is
  contributed-to by exactly this fuel-washing mechanism, an ignored
  coil-driven misfire is a real risk multiplier. See file 01 for
  M96/M97 bore scoring scope and remediation; file 06 for Cayenne
  V8 bore scoring.

  On Mezger 996/997 Turbo, GT3, and GT2 engines this secondary risk
  is materially lower — the Mezger architecture is not subject to
  bore scoring in the same way and the cross-link to a coil-driven
  failure path is weak. Coil failure on a Mezger is purely service.

  When evaluating a listing, the question to ask is not just "have
  the coils been done" but "when, with what brand, and was it the
  full set." Mixing one new coil with five 12-year-old units is a
  common short-cut that pushes the next failure 6–18 months out.

  On the Cayenne V8, expect total coils-and-plugs cost to land
  toward the upper end of the catalog range simply because there are
  eight of each rather than six and the engine bay packaging adds
  shop labor.

buyer_questions:
  - "When were the ignition coils last replaced, and were all of them done at the same time?"
  - "Were OEM Beru coils used, and if M96/M97 application, was the latest revision part number?"
  - "Are there any current or recent misfire codes (P0300–P0308)?"
  - "Was the most recent coil work done at the same time as spark plugs?"
  - "On a high-mileage M96/M97 or M48 car, has any misfire ever been left unaddressed for an extended period?"
```

---

## Cross-references

- **File 01 (M96/M97 engines)**: bore scoring contribution from
  unburned-fuel cylinder washing. The ignition coil record above
  flags the secondary risk; file 01 carries the primary bore-scoring
  applicability and remediation cost.
- **File 02 (Mezger engine)**: SAI hardware applies; port-clogging
  mechanism does not transfer cleanly; coil failure is service-only
  with no bore-scoring linkage.
- **File 06 (Cayenne V8)**: bore scoring on M48 with the same
  unburned-fuel contribution; SAI failures on Cayenne are
  pump-weighted rather than port-weighted. File 06's bore-scoring
  record carries the M48-specific content.
