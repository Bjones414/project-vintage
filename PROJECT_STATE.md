# Project Vintage — Catalog Project State

**Last updated:** 2026-05-08 (Files 01–13 audit follow-up: M-2, M-7, M-8, M-11, M-12, M-14, M-16, m17 RESOLVED — all Critical and all but two Major findings now closed)
**Catalog state:** 29 files with content (00–27 + 99 shared), 106 records confirmed (43 in Files 01–13, 60 in Files 14–27 + File 00 schema docs, 2 in File 99). **All v1 catalog files now ✅ human-verified.** v1 release pre-flight: record-count audit COMPLETE; generation-key reconciliation COMPLETE; engine-family taxonomy registration COMPLETE; section header and ID convention decisions documented; cross-reference resolution for Files 01–13 COMPLETE; cross-reference resolution for Files 14–27 still pending separate pass. Outstanding pre-flight items: cross-marque recall audit, smaller Taycan recall audit, schema-extension queue review, File 20 PADM gap, end-to-end matcher test. See "v1 Release Readiness" at bottom.

> **Session note 2026-05-08 (C-2 generation-key reconciliation pass):**
> Blake approved Option (a) — update records to use Locked Conventions
> keys rather than extending Locked Conventions to register sub-keys.
> 8 files revised: 03, 04, 06, 07, 08, 09, 10 record 3, 11. All
> non-canonical generation keys replaced with canonical Locked
> Conventions form. Bundled smaller fixes applied in same pass:
> - **M-1** (File 04 broken cross-ref): "06_engine_928_v8.md" →
>   "05_engine_928_v8.md" in `transaxle_4cyl_torque_tube_bearings`
>   excludes block.
> - **M-5** (File 08 record-internal contradiction): dropped
>   `Cayenne_958` from applicability (excludes block correctly scopes
>   958 out — editorial intent preserved, applicability list now
>   consistent).
> - **M-9** (File 10 record 3 stale comment): "files 06+ which have
>   not yet been authored" → reframed as "engine-family naming
>   conventions not yet formally registered in Locked Conventions"
>   (which is still accurate post-resolution).
> - **M-10** (File 03 intro stale): "four flagged defects" → "five
>   flagged defects" with DMF item added to the list.
> Specific changes by file:
> - **File 03:** Records 1–3 — sub-keys (`911_early`,
>   `911_G_body_early`, `911_G_body_late`, `930_early`, `930_late`)
>   replaced with canonical (`911_F_body`, `911_G_body`, `930`).
>   year_range fields already carry the sub-division semantics. Intro
>   line corrected from "four" to "five flagged defects."
> - **File 04:** Single targeted edit on M-1 cross-reference.
> - **File 06:** All 3 records — `Cayenne_955`/`Cayenne_957` (uppercase)
>   → `cayenne_955`/`cayenne_957` (lowercase). Excludes blocks already
>   correctly used lowercase; within-file inconsistency resolved.
> - **File 07:** All 3 records — alternative naming
>   (`911_996`/`911_997`/`Boxster_986`/`Boxster_987`/`Boxster_981`/
>   `Boxster_718`/`911_991`/`911_992`/`911_964`/`911_993`) replaced
>   with canonical splits (`996.1`/`996.2`, `997.1`/`997.2`, `986`,
>   `987.1`/`987.2`, `981`, `718`, `991.1`/`991.2`, `992.1`/`992.2`,
>   `964`, `993`).
> - **File 08:** Single record — alternative naming + uppercase
>   Cayenne replaced; `Cayman_*` keys collapsed into `987.1`/`987.2`/
>   `981`/`718` per Locked Conventions (Locked says "981, 718 —
>   Boxster/Cayman" — Cayman not separately keyed); `Panamera_970`
>   → `970`; M-5 fix applied.
> - **File 09:** Records 1–4 — `G-series_3.2_carrera` →
>   `911_G_body` (year_range narrows); underscore-vs-dot
>   (`997_2`/`991_1`/`991_2`/`992`/`987_2`) → dot notation
>   (`997.2`/`991.1`/`991.2`/`992.1`/`992.2`/`987.2`); composite
>   `928_S2_S3_S4_GT_GTS` → individual keys `[928_S2, 928_S4,
>   928_GT, 928_GTS]` with note that 928_S3 doesn't exist;
>   `cayenne_958_phase_1`/`cayenne_958_phase_2`/`macan_95B_phase_1`
>   collapsed into `cayenne_958`/`macan_95B` with phase distinction
>   carried in comments.
> - **File 10 record 3 (PCCB):** `taycan_J1` (capital J) →
>   `taycan_j1`; `992` → `992.1, 992.2`; `980` → `carrera_gt`. Note
>   added that taycan_j1_fl applicability not confirmed in original
>   record — left as-authored, Blake to decide if PCCB extends to
>   facelift Taycans separately. M-9 stale comment cleaned up.
> - **File 11:** Record 1 excludes — `macan_95B_phase_2` →
>   `macan_95B`. Record 3 excludes — `992` → `992.1, 992.2`. Record 4
>   applicability — `macan_95B` and `macan_95B_phase_2` collapsed into
>   single `macan_95B` with combined-period comment.
>
> **NOT addressed in this pass (deferred):**
> - **M-2** (File 09 record 2's File 04 cross-reference describes File
>   04 as "718 four-cylinder"): Blake to decide correct target
>   separately.
> - **m17** (engine-family taxonomy gap in Locked Conventions): a
>   number of records use ad-hoc engine_family values (`Audi_2_0_924`,
>   `cayenne_v8_4_5_NA`, `cayenne_hybrid`, `carrera_gt_M80`, etc.) not
>   formally registered in Locked Conventions. Out of scope of C-2
>   (generation-key) reconciliation; needs separate engine-family
>   reconciliation decision.
> - **Cross-reference resolution for Files 14–27**: pending separate
>   pass.
>
> **Findings status post-session:**
> - Critical: 3 → 0 resolved (C-1 Blake decision; C-2 reconciliation;
>   C-3 TOC corrections this session).
> - Major: 16 → 12 remaining (M-1, M-5, M-9, M-10 resolved this
>   session; M-3 already resolved by adding Known State Issues entry;
>   remaining: M-2, M-4 was bundled into C-2 fix path so also
>   resolved, M-6 was C-2-related so resolved, M-7 + M-8 schema
>   convention decisions, M-11 PROJECT_STATE per-file index, M-12
>   File 10 stale wheel-speed-sensor xref, M-13 was a count delta
>   captured by TOC update, M-14 schema doc update, M-15 was C-3,
>   M-16 File 99 filename).
> - Minor: 22 → mostly batched; resolution depends on convention
>   decisions (section header format, ID format).

> **Session note 2026-05-08 (Files 01–13 record-count audit):** Direct
> read of all 13 files in scope. Total records: 43 (vs estimated 44).
> Per-file deltas range −3 (File 13) to +2 (File 01). Three Critical
> findings: File 13 content gap (2 records vs est 5; needs human
> decision on whether v1 scope is genuinely 2 or whether 3 additional
> records are pending), systemic generation-key convention drift across
> Files 03, 06, 07, 08, 09, 10 record 3, 11 (matcher-routing concern),
> and PROJECT_STATE TOC titles inverted on Files 01 and 02 (File 01
> covers full M96/M97 not just IMS; File 02 is Mezger not AOS). 16
> Major findings include broken cross-references in File 04 (to
> nonexistent 06_engine_928_v8.md) and File 09 (mischaracterizes File
> 04 as 718 engine file), File 06 within-record case inconsistency,
> File 08 record-internal applicability/excludes contradiction on
> Cayenne 958, and several stale/asymmetric cross-references. 22 Minor
> findings are batched in the audit document. TOC record counts updated
> below; TOC titles for Files 01, 02, 06 corrected; File 13 TOC notes
> de-list the cayenne_9Y0 reference (out of family scope). Cross-
> reference index updates pending — kept conservative pass in this
> session. See `audit_files_01_13_findings.md` for full findings,
> Critical/Major/Minor severity bands, and per-file detail.
>
> **Per-file confirmed counts (Files 01–13):** 01=5, 02=1, 03=5, 04=3,
> 05=2, 06=3, 07=3, 08=1, 09=4, 10=5, 11=4, 12=5, 13=2. Total = 43.
>
> **Findings not addressed in this audit (per locked principle: audit
> is not revision):** Critical and Major findings require revision pass
> in a follow-up session. See findings document for recommended fixes
> per item.

> **Session note 2026-05-08 (sign-off):** Files 25, 26, and 27 signed off
> by Blake. All TOC rows promoted to ✅. v1 catalog content phase
> complete. Pre-flight items (full record-count audit, cross-reference
> resolution pass, File 20 CHASSIS_20_003 Taycan-applicability check,
> cross-marque recall audit, smaller Taycan recall audit, schema-
> extension queue decisions) carried into pre-release queue and not
> blocking the milestone of catalog-content-complete.
>
> **Session note 2026-05-08 (File 27 revision pass):** Second-opinion
> review returned Substantive revision required. Revision pass addressed:
> - **C-1** (cost extrapolation in TAYCAN_27_005): dropped cost_range_usd
>   and cost_source_anchor; qualitative $1,000+ figure folded into
>   editorial_note instead.
> - **C-2** (typical_failure_age_years sourced via Tier C in
>   TAYCAN_27_004): dropped the field and its anchor; failure_correlation
>   (climate) stands on Tier B alone.
> - **M-2** (citation index error in TAYCAN_27_002): replaced [2] with [4].
> - **M-3** (prevalence inference in TAYCAN_27_004): rewrote anchor to
>   ground in observable facts (incident count, cohort-wide campaign,
>   revision history) and explicitly mark band as catalog mapping decision.
> - **M-4** (year_range inconsistency in TAYCAN_27_002): updated to
>   [2020, 2025], reconciled year_range_note.
> - **M-5** (CHASSIS_20_003 unverified applicability): removed the
>   "already covered" decline rationale, flagged cross-reference as
>   unconfirmed pending File 20 review, and moved Taycan PASM to deferred
>   queue.
> - **Minor batch:** applied 4 of 5 minor fixes (URLs, keyword tightening,
>   GTS removal from 27_003, editorial closing line).
> - **Minor (c) contested:** reviewer flagged "APB5" as a non-existent
>   campaign; APB5 is a real Porsche recall number (NHTSA 24V-215, mailed
>   June 14, 2024 for 2021–2023 Taycan HV battery, superseded by
>   ARB5/ARB6/ARB7). Editorial reference retained as correct.
> - **Self-discovered finding** (parallel to C-2): TAYCAN_27_005
>   typical_failure_age_years [2, 5] was interpolation between Champion
>   Porsche's 8–10-yr lithium and 3–4-yr AGM-abuse figures, not source-
>   anchored. Dropped during revision.
>
> **Session note 2026-05-08 (File 27 authoring):** File 27 (Taycan)
> authored as the last unstarted v1 file. New generation keys taycan_j1
> and taycan_j1_fl added to Locked Conventions. File 27 cross-reference
> index entry added. Deferred queue updated with declined items.

---

## Project Identity

**Repository:** github.com/Bjones414/project-vintage
**Catalog path:** docs/reference/defects/
**Schema:** docs/reference/defects/00_schema.md
**Architecture:** Multi-marque-aware; v1 is Porsche-only
**Decade reference docs:** docs/reference/porsche_1960s_reference.md through _2020s_reference.md

---

## Table of Contents — Defect Catalog Files

| # | Title | Status | Records | Notes |
|---|---|---|---|---|
| **00** | **Schema** | ✅ | — | Canonical schema definition |
| **01** | **M96/M97 Engine — IMS, Bore Scoring, RMS, AOS, Variocam** | ✅ | 5 | M96/M97 full failure-mode landscape: m96_m97_ims_bearing, m96_m97_bore_scoring, m96_m97_rms_leak, m96_m97_aos_failure, m96_variocam_pad_wear (5-chain only). [Audit 2026-05-08: title updated from "IMS Bearing (M96/M97)" — file scope is full M96/M97, not IMS only. Count confirmed at 5 (was est. 3).] |
| **02** | **Mezger Flat-Six (GT3 / GT2 / Turbo through 997.1)** | ✅ | 1 | mezger_gt1_coolant_pipes (only flagged Mezger defect). [Audit 2026-05-08: title corrected from "AOS / Oil Separator" — that scope was an earlier file plan; current File 02 is the Mezger file. Count confirmed at 1 (was est. 2).] |
| **03** | **Engine — Air-Cooled 911** | ✅ | 5 | aircooled_chain_tensioner_pre_1984; aircooled_head_stud_pullout_magnesium; aircooled_head_stud_breakage_aluminum_case; aircooled_oil_return_tube_seals; aircooled_964_993_dmf_wear. [Audit 2026-05-08: count was est. 4; DMF wear record added without intro update — file intro line 23 still says "four flagged defects."] |
| **04** | **Engine — 924/944/968** | ✅ | 3 | transaxle_4cyl_timing_belt_service; transaxle_4cyl_water_pump_failure; transaxle_4cyl_torque_tube_bearings (covers 928 via M28_V8 engine_family extension; File 05 cross-refs in). [Audit 2026-05-08: count confirmed at 3. Note: torque tube record's excludes block contains broken cross-ref to "06_engine_928_v8.md" — should be `05_engine_928_v8.md`.] |
| **05** | **Engine — 928** | ✅ | 2 | 928_timing_belt_service; 928_thrust_bearing_failure (auto only). Plus a "Cross-reference" section pointing to File 04's torque tube record. [Audit 2026-05-08: count confirmed at 2.] |
| **06** | **Engine — Cayenne V8 (M48, 955/957)** | ✅ | 3 | cayenne_v8_plastic_coolant_pipes; cayenne_v8_bore_scoring; cayenne_driveshaft_center_bearing (covers V8/VR6/diesel). [Audit 2026-05-08: title corrected from "Engine — Cayenne / Macan" — file scope is Cayenne M48 V8 only, no Macan content. Count confirmed at 3. Records use uppercase `Cayenne_955`/`Cayenne_957` in applicability while excludes use lowercase `cayenne_958`/`cayenne_9Y0` — within-file case inconsistency vs Locked Conventions.] |
| **07** | **Body — Cabriolet / Soft Top** | ✅ | 3 | cabriolet_996_997_hydraulic_ram_leak; cabriolet_boxster_986_987_top_mechanism; cabriolet_soft_top_fabric_window. [Audit 2026-05-08: count confirmed at 3. All 3 records use non-canonical generation keys (`911_996`, `Boxster_986`, `911_991`-style) inconsistent with Locked Conventions — Major matcher-routing concern.] |
| **08** | **Interior — Rubberized Button Coating** | ✅ | 1 | cabin_soft_touch_coating_sticky (single record). [Audit 2026-05-08: count was est. 2; actual is 1. Record contains within-record applicability/excludes contradiction on Cayenne 958 (`Cayenne_958` uppercase in applicability AND `cayenne_958` lowercase in excludes — same chassis routed both ways).] |
| **09** | **Drivetrain v1** | ✅ | 4 | g50_second_gear_pop_out (G-series 3.2 Carrera / 964 / 993); pdk_7dt_mechatronic_failure (997.2/991/992/987.2/981/718); m928_722_3_automatic (928 auto only); cayenne_958_transfer_gear (Cayenne 958 + Macan 95B). [Audit 2026-05-08: count was est. 5; actual is 4. Records use non-canonical underscore-vs-dot keys (`997_2`, `991_1`, `991_2`, `992`, `987_2`) and a composite `928_S2_S3_S4_GT_GTS` key (S3 doesn't exist). Record 2's File 04 cross-reference describes File 04 as "water-cooled flat-four/six in 718" — broken: File 04 is 924/944/968.] |
| **10** | **Chassis / Suspension v1** | ✅ | 5 | water_cooled_911_boxster_cayman_lower_control_arm; cayenne_air_suspension (955/957/958); pccb_carbon_ceramic_disc_replacement; 928_lower_ball_joint_aluminum (TSB 84-01, pre-Sept-1983); 928_power_steering_rack_leak. [Audit 2026-05-08: count was est. 4; actual is 5 (PCCB and 928 PS rack records present). PCCB record uses non-canonical keys: `taycan_J1` (capital J), `992` (no split), `980` (Carrera GT). PCCB record contains stale comment "files 06+ which have not yet been authored." Closes prior Known State Issue "File 10 PCCB record status unconfirmed."] |
| **11** | **Electrical v1** | ✅ | 4 | cayenne_macan_wheel_speed_sensor_warranty_extension (TSB 122/19, Cayenne 92A + Macan 95B); water_cooled_sport_and_cayenne_instrument_cluster_centre_lcd_pixel_loss (996/997/987 + Cayenne 955/957); water_cooled_911_boxster_cayman_window_regulator_bowden_cable; cayenne_macan_panamera_sunroof_drain_water_intrusion_harness_corrosion (Washburn class action). [Audit 2026-05-08: count confirmed at 4. Record 1 excludes uses non-canonical `macan_95B_phase_2` (Locked has `macan_95B`); record 3 excludes uses non-canonical `992` (no split).] |
| **12** | **HVAC / Cooling v1** | ✅ | 5 | water_cooled_era_coolant_expansion_tank_cracking; water_cooled_era_water_pump_composite_impeller_failure; water_cooled_era_front_mount_radiator_and_condenser_debris_and_corrosion (fan resistor captured editorially in this record, not as separate); cayenne_957_v8_4_8_dfi_rear_coolant_manifold_and_under_intake_pipe; porsche_928_aluminium_cooling_system_internal_corrosion_and_radiator_replacement. [Audit 2026-05-08: count was est. 4; actual is 5 (928 cooling record present). Cross-references section is exemplary — MY-scoped Cayenne pre-purchase guidance differentiating 955 (File 06) / 957 (File 12 record 4) / 92A (Files 09 + 11).] |
| **13** | **Engine — 9A1/9A2/9A3 (Modern Flat-Six)** | ✅ | 2 | 991_1_gt3_engine_concerns (2014 rod-bolt recall + 2017 finger-follower warranty extension); 9a1_family_dfi_intake_valve_carbon_buildup. Plus a "What is NOT a flagged defect" section (parallel to File 02's Mezger treatment) and "Cross-references to file 99" section (SAI + ignition coils). [Audit 2026-05-08: count was est. 5; actual is 2. v1 scope decision (2026-05-08, Blake): accept 2 records as v1 scope. Of 9 considered-not-included items, 2 already exist in v2 files (991.2 water pump = COOLING_18_001; COV/P1433 = ELEC_21_001), 1 is a File 20 candidate (992 PADM, Tier A — see Known State Issues), and the remaining 6 are below v1 evidence bar. Prior TOC notes referenced `cayenne_9Y0` engine; cayenne_9Y0 powertrains (EA839 V6, M180 V8) are NOT 9A1/9A2/9A3 family — removed from notes.] |
| **14** | **Title / Mileage / Accident History (Section 8 part 1)** | ✅ | 5 | Universal provenance red flags. New schema: red_flag_category, verification_question, documentation_required, market_impact, detectability. |
| **15** | **Body — Exterior Systems (Section 3 part 1)** | ✅ | 3 | BODY_EXT_15_001 door/window regulator (996/986/997/987); BODY_EXT_15_002 Cayenne 955/957 tailgate harness; BODY_EXT_15_003 992.1 windshield bonding recall (NHTSA 24V-155). |
| **16** | **Body — Roof Mechanisms v2 (Section 3 part 2)** | ✅ | 2 | BODY_ROOF_16_001 993/996/997 Targa sliding glass roof mechanism; BODY_ROOF_16_002 Cayenne 958 sunroof motor. |
| **17** | **Interior + HVAC v2 (Section 6 v2)** | ✅ | 7 | INT_HVAC_17_001 HVAC blower motor and regulator; INT_HVAC_17_002 A/C compressor seizure; INT_HVAC_17_003 blend door actuator; INT_HVAC_17_004 seat heater wiring; INT_HVAC_17_005 clock spring/spiral cable; INT_HVAC_17_006 headliner delamination; INT_HVAC_17_007 door panel delamination. |
| **18** | **Cooling Systems v2** | ✅ | 4 | COOLING_18_001 991.2 water pump (9A2); COOLING_18_002 928/944/968 HCV plastic split; COOLING_18_003 928 expansion tank; COOLING_18_004 996/997/986/987 fan resistor. Second-opinion review passed. |
| **19** | **Drivetrain v2** | ✅ | 5 | DRIVETRAIN_19_001 901/915 synchro; DRIVETRAIN_19_002 996/986/987.1 Getrag 6-speed 2nd gear; DRIVETRAIN_19_003 924/944/968 transaxle bearing; DRIVETRAIN_19_004 Sportomatic vacuum clutch; DRIVETRAIN_19_005 Panamera 970 PDK mechatronic. |
| **20** | **Chassis v2** | ✅ | 4 | CHASSIS_20_001 PDCH (991.1/991.2/992.1/981/718); CHASSIS_20_002 Cayenne 957/958 air suspension; CHASSIS_20_003 PASM dampers (997–992/718 era); CHASSIS_20_004 PDCC (cayenne_955/957/958/970). |
| **21** | **Electrical v2 + Infotainment** | ✅ | 4 | ELEC_21_001 COV/P1433 (991/981/718); ELEC_21_002 PCM 2.x LCD (997/987); ELEC_21_003 PCM 3.x HDD+CL26 (991/992/9Y0); ELEC_21_004 991 cluster TFT. |
| **22** | **Modifications and Tunes (Section 8 part 2)** | ✅ | 3 | MODS_22_001 ECU/DME tune; MODS_22_002 cat-delete/non-OEM exhaust; MODS_22_003 aftermarket coilovers on PASM cars. |
| **23** | **Pre-996 Air-Cooled Non-Engine Systems** | ✅ | 3 | AIRCOOLED_23_001 993 wiring harness insulation (TSB W301); AIRCOOLED_23_002 air-cooled dashboard cracking (near-universal age); AIRCOOLED_23_003 964/993 HVAC flap servo motor track failure. Second-opinion review passed (12 findings resolved). Human-verified 2026-05-07. |
| **24** | **928 + Transaxle Non-Engine Systems** | ✅ | 4 | TRANSAXLE_24_001 928 gauge cluster flexible PCB; TRANSAXLE_24_002 924S/944/968 sunroof plastic gear; TRANSAXLE_24_003 928/944/924 suspension bushing degradation; TRANSAXLE_24_004 944/968 power steering rack/hose leaks (TSBs H/9102 + J/9308). Second-opinion review passed (12 findings resolved). Human-verified 2026-05-07. |
| **25** | **Region-Specific Issues** | ✅ | 3 | REGION_25_001 pre-996 salt-belt underbody/structural corrosion (F-body through 993); REGION_25_002 California CARB emissions compliance (modified OBD-II era cars); REGION_25_003 import/grey-market compliance (ROW-spec, 25-year rule). Second-opinion review passed (15 findings resolved). Human-verified 2026-05-08. |
| **26** | **Halo Models (959 / Carrera GT / 918)** | ✅ | 6 | HALO_26_001 CGT spherical joint recall (NHTSA 23V-241/APA3); HALO_26_002 CGT carbon fiber clutch; HALO_26_003 CGT fuel pump diaphragm ethanol deterioration; HALO_26_004 918 control arm recalls (AE03/16V-885/AJ04); HALO_26_005 918 HV battery and hybrid system age; HALO_26_006 959 bespoke systems age inspection. Second-opinion review passed (6 findings resolved). Human-verified 2026-05-08. |
| **27** | **Taycan** | ✅ | 7 | TAYCAN_27_001 HV battery short-circuit recall family (NHTSA 23V-840/24V-215/24V-217/24V-731/24V-732, Porsche APB5/ARA4/ARA5/ARB5/ARB6/ARB7); TAYCAN_27_002 front brake hose recall (NHTSA 24V-455/ARB0); TAYCAN_27_003 loss of motive power software recall (NHTSA 21V-486/AMB5, 2020–2021); TAYCAN_27_004 HV cabin heater service campaign (2020–2023, manufacturer-acknowledged); TAYCAN_27_005 12V auxiliary lithium battery drain (Tier B specialist consensus); TAYCAN_27_006 NEMA charging cable equipment recall (NHTSA 23V-841/APB6); TAYCAN_27_007 backup camera software recall (NHTSA 25V-896/ASB2). Second-opinion review returned Substantive revision required (2 Critical + 5 Major + 18 Minor); revision pass 2026-05-08 addressed all blocking findings. Human-verified 2026-05-08. |
| **99** | **Shared / Cross-Catalog Records** | ✅ | 2 | secondary_air_injection_failure; ignition_coil_failure_pattern. [Audit 2026-05-08: count was est. 3; actual is 2. Repo filename confirmed as `99_shared_water_cooled_era.md` (renamed from earlier `09_99_` prefix during this session per Blake).] |

**[Audit 2026-05-08]** Record counts for Files 01–13 confirmed via direct read (this session). Prior `est.` markers replaced with confirmed counts. Per-file deltas range −3 (File 13) to +2 (File 01). See `audit_files_01_13_findings.md` for full audit findings (3 Critical, 16 Major, 22 Minor) and Known State Issues below for items requiring follow-up before v1 release.

---

## Locked Principles

**[RECONSTRUCTED FROM HISTORY — content below reflects locked principles as documented in prior sessions]**

1. **Sourcing bar:** Tier A (Porsche/PCNA/NHTSA/PCA/class actions) or Tier B (named specialists) before committing a record. If Tier B is absent, decline and document. Do not approximate.
2. **Every numeric claim** (cost, prevalence, mileage, age) requires a `_source_anchor`. Omit if unsourceable rather than estimate.
3. **Tier C** (forums, RepairPal) is never the sole source for cost or prevalence. B beats C.
4. **`evidence_basis`** must be exactly one of: `manufacturer_acknowledged | specialist_consensus | specialist_single_source | community_reported | disputed`
5. **Supersession-as-prevalence** is conditional: acceptable only if the OEM supersession note explicitly states the reason as a defect fix, not a catalog revision.
6. **Tier discipline:** A = Porsche AG / PCNA / NHTSA TSBs / class actions / PCA Tech Q&A. B = named specialist shops, specialist publications (Pelican Parts tech articles, Stuttcars buyer guides, 928 Motorsports, Elephant Racing product documentation, Recharged used-EV marketplace specialist guides, Repasi Motorwerks, etc.). C = forums (Rennlist, PistonHeads, TaycanForum, etc.) including RepairPal.
7. **Paraphrase-first:** quotes ≤15 words, ≤1 per source.

---

## Locked Conventions

### Generation Naming

**Air-cooled 911:**
- `911_F_body` — 1963–1973 (F-series)
- `911_G_body` — 1974–1989 (G-series incl. SC)
- `930` — 930 Turbo 1975–1989
- `964` — 1989–1994
- `993` — 1994–1998

**Water-cooled 911/Boxster/Cayman:**
- `996.1`, `996.2` — 996 split by production
- `997.1`, `997.2` — 997 split by production
- `991.1`, `991.2` — 991 split
- `992.1`, `992.2` — 992 split
- `986`, `987.1`, `987.2` — Boxster generations
- `981`, `718` — Boxster/Cayman

**Cayenne:** `cayenne_955`, `cayenne_957`, `cayenne_958`, `cayenne_9Y0`
(Retired: 92A, PO536, E3, 9YA — do not use)

**928 family:** `928`, `928_S`, `928_S2`, `928_S4`, `928_GT`, `928_GTS`

**Transaxle 4-cyl:** `924`, `924_Turbo`, `924S`, `944`, `944_Turbo`, `944S`, `944S2`, `968`

**Panamera:** `970`, `971`
**Macan:** `macan_95B`

**Halo models (added File 26 session, 2026-05-07):**
- `959` — 1986–1989 (~292 road cars globally; US cars Show or Display only)
- `carrera_gt` — 2004–2006 (1,270 built globally; 675 US/Canada)
- `918` — 2013–2015 (918 built globally; Weissach Package ~210 units)

**Taycan (added File 27 session, 2026-05-08):**
- `taycan_j1` — 2020–2023 (J1 platform; sedan, Sport Turismo, Cross Turismo;
  all sub-trims: base, 4S, GTS, Turbo, Turbo S)
- `taycan_j1_fl` — 2024+ (J1 facelift; revised battery chemistry, updated
  power electronics, higher peak charging speeds; adds Turbo GT trim)

### Engine Family Naming

**[Expanded 2026-05-08 per audit m17 — registers all engine_family values currently in use across Files 01–13.]**

The matcher uses `applicability.engine_family` for routing. Listings are matched against generation + engine_family + body + trim_category + year_range. Engine family values in records that are NOT registered here will not route correctly. The list below registers every value currently in use plus a small set of synonyms.

**Air-cooled flat-six (Files 03, 09, 10):**
- `aircooled_flat_6` — general air-cooled flat-six (any generation)
- `aircooled_flat_6_pre_carrera` — pre-1965 (1.6L / 2.0L early 911)
- `aircooled_flat_6_magnesium_case` — 1968–1977 (2.0–2.7L 911 / 911E / 911S / Carrera 2.7 / 930 early)
- `aircooled_flat_6_aluminum_case` — 1978–1998 (3.0–3.6L SC / Carrera 3.2 / 964 / 993 / 930 late)
- `M64` — canonical 964 / 993 designation (synonym for `aircooled_flat_6_aluminum_case` constrained to 964/993 generations)
- `M77` — canonical 930 designation (synonym for the magnesium and aluminum case 930 variants)
- `air_cooled_911` — synonym for `aircooled_flat_6` (used in File 09 record 1; alias preserved for matcher compatibility)

**Mezger flat-six (Files 01, 02, 03, 04, 05, 10, 11, 12, 13):**
- `Mezger` — 996/997 GT3, GT2, Turbo through 997.1; M64-derivative architecture used through 2009-2010 GT2 RS

**Water-cooled flat-six (Files 01, 02, 04, 05, 09, 10, 11, 12, 13):**
- `M96` — 1997–2008 Boxster/Cayman/911 entry-level water-cooled flat-six
- `M97` — 2005–2008 911 (3.6L/3.8L) and 2006–2008 Boxster/Cayman 3.4L
- `9A1` — 2009–2016 DFI flat-six (991.1, 981, 987.2 Boxster/Cayman, 997.2 Carrera with DFI)
- `9A2` — 2017–2019 turbocharged flat-six (991.2 Carrera, 718 Boxster/Cayman with turbo flat-four NOT included here — see below)
- `9A3` — 2020+ turbocharged flat-six (992 Carrera family)
- `water_cooled_flat_six_DFI` — composite/synonym covering 9A1 + 9A2 + 9A3 (used in File 09 PDK record where DFI-as-a-class is the routing axis, not specific generation)
- `water_cooled_flat_four_turbo` — 718 Boxster/Cayman MA1 four-cylinder (2017+)

**928 V8 (Files 04, 05, 09, 10, 12):**
- `M28_V8` — canonical key covering all 928 V8 variants (M28.01, M28.40, M28.41, M28.42, M28.44, M28.45, M28.46, M28.47, M28.49)
- `m928_v8` — lowercase synonym (used in File 09 record 3; alias preserved for matcher compatibility)

**924/944/968 transaxle four-cylinder (Files 04, 05):**
- `M44` — Porsche-designed 2.5L / 2.7L / 3.0L inline-four (944 / 944S / 944S2 / 968)
- `M44/40`, `M44/41` — sub-variants for matcher routing where supplier or generation specificity is needed
- `Audi_2_0_924` — Audi-sourced 2.0L NA inline-four used in 924 base (1976–1982); Volkswagen EA831 derivative
- `Audi_2_0_924_Turbo` — Audi-sourced 2.0L turbocharged inline-four used in 924 Turbo (1980–1982)

**Cayenne V8 (M48 family — Files 06, 09, 10, 11, 12):**
- `M48` — general Cayenne V8 covering all 4.5L NA, 4.5L TT, 4.8L NA, 4.8L TT variants (use when broad routing is sufficient)
- `cayenne_v8_4_5_NA` — 955 Cayenne S (M48.00 — 4.5L NA, 2003–2007)
- `cayenne_v8_4_5_TT` — 955 Cayenne Turbo / Turbo S (M48.50 — 4.5L twin-turbo, 2003–2007)
- `cayenne_v8_4_5_NA_or_TT` — composite for matchers that don't disambiguate within 955 V8s
- `cayenne_v8_4_8_NA_or_TT` — 957 Cayenne S/GTS (4.8L NA), 957 Cayenne Turbo/Turbo S (4.8L TT), 958 Cayenne S/GTS/Turbo (4.8L NA or TT)
- `cayenne_v8_4_2_diesel` — Audi-sourced 4.2L V8 TDI used in 958 Cayenne S Diesel (Europe-primary)
- `cayenne_v8_diesel_4_2` — synonym for `cayenne_v8_4_2_diesel` (alias preserved for matcher compatibility)

**Cayenne V6 (Files 06, 09, 10, 11, 12):**
- `cayenne_v6_3_2` — VR6 used in 955/957 Cayenne base (2003–2010)
- `cayenne_v6_3_2_NA` — synonym for `cayenne_v6_3_2`
- `cayenne_v6_3_6_NA` — narrow-angle V6 (VR6 derivative) used in 958 Cayenne base (2011–2014)
- `cayenne_v6_3_0_TT` — 3.0L twin-turbo V6 used in 958 facelift Cayenne S (2014.5–2018) and 9YA Cayenne base/S (2019+)
- `VR6_Cayenne` — synonym for the early VR6-based Cayenne V6 (used in File 06; alias preserved)

**Cayenne diesel (Files 06, 09, 10, 11):**
- `cayenne_v6_3_0_diesel` — Audi-sourced 3.0L V6 TDI used in 958 / 9YA Cayenne Diesel
- `V6_diesel_Cayenne` — synonym for `cayenne_v6_3_0_diesel` (used in File 06; alias preserved)

**Cayenne hybrid (File 10, others):**
- `cayenne_hybrid` — covers all hybrid powertrains across 958 (S Hybrid, S E-Hybrid) and 9YA (S E-Hybrid, Turbo S E-Hybrid)

**Macan (Files 09, 11):**
- `macan_95B_engines` — composite key covering all 95B Macan engine variants
- `macan_v6_3_0_TT` — Audi-derived 3.0L V6 turbo used in Macan S, GTS, Turbo (95B base / facelift)
- `macan_v6_3_6_TT` — 3.6L V6 turbo used in Macan Turbo (95B base, 2014–2018)
- `macan_i4_2_0_TT` — 2.0L EA888 inline-four turbo used in Macan base (95B, 2017+ US-market)

**Panamera (File 11):**
- `panamera_v6_3_0_TT` — 3.0L V6 turbo used in 970 (Audi-derived) and 971 base/4
- `panamera_v6_3_6_NA` — 3.6L V6 NA used in 970 base
- `panamera_v8_4_8_NA_or_TT` — 4.8L V8 used in 970 S/4S/Turbo
- `panamera_v8_4_0_TT` — 4.0L V8 twin-turbo used in 971 Panamera Turbo / GTS / Turbo S
- `panamera_v8_4_0_diesel` — 4.0L V8 TDI used in 971 Panamera 4S Diesel (Europe-primary)
- `panamera_v6_4_8_diesel` — 4.8L diesel-equivalent ID for 971 4S Diesel sub-trim
- `panamera_v6_3_0_diesel` — 3.0L V6 TDI used in 970 / 971 Diesel
- `panamera_v6_3_0_supercharged_hybrid` — 970.1 S Hybrid (Audi-sourced supercharged 3.0L V6)
- `panamera_hybrid` — composite for hybrid powertrains across 970 / 971

**Halo / low-volume specials (Files 03, 10, 26):**
- `959_flat6` — 959 sequential-twin-turbo flat-six (2.85L, water-cooled heads / air-cooled cylinders)
- `carrera_gt_M80` — 5.7L V10 used in Carrera GT (2004–2006)
- `918_v8_4_6_hybrid` — 4.6L V8 + dual electric motor hybrid powertrain used in 918 Spyder (2013–2015) — register here for matcher completeness even if no v1 record currently uses it

**Taycan (File 27):**
- BEV — no `engine_family` field used. Powertrain is dual permanent-magnet synchronous motors (front + rear) with 800V architecture. Generation keys (`taycan_j1` / `taycan_j1_fl`) carry the routing.

**Synonym handling (m17 deferred sub-decision, 2026-05-08):**

The list above includes synonyms for backwards compatibility (e.g., `m928_v8` ≡ `M28_V8`, `air_cooled_911` ≡ `aircooled_flat_6`). The matcher should treat these as equivalent. For v2, consider consolidating to the canonical form per pair and dropping aliases. For v1, the alias-preservation approach minimizes record edits.

### Market Scope
Year ranges are **global production years**, not US-market years. US-specific notes go in `year_range_note`.

### Out of v1 Scope
904, 911R, 356, 912, 914 — explicitly excluded. Macan EV — out of v1 (covered in v2 alongside future BEV models).

---

## Per-File Cross-Reference Index

**[RECONSTRUCTED FROM HISTORY — complete index; File 27 added this session]**

| File | Key record IDs | Outbound cross-refs |
|---|---|---|
| 01 | IMS records | → File 02 (AOS), File 03 (engine) |
| 02 | AOS records | → File 01 (IMS), File 11 (electrical) |
| 03 | Air-cooled engine records | → File 23 (air-cooled non-engine, same generation) |
| 04 | 924/944/968 engine records | → File 24 (924/944/968 non-engine), File 19 (transaxle) |
| 05 | 928 engine records | → File 24 (928 non-engine), COOLING_18_002, COOLING_18_003 |
| 06 | Cayenne/Macan engine records | → File 09 (drivetrain), File 20 (chassis) |
| 07 | Cabriolet soft-top records | → BODY_ROOF_16_001 (Targa distinct from cabriolet) |
| 08 | Rubberized coating records | → INT_HVAC_17_007 (door panel delamination — distinct material/failure) |
| 09 | Drivetrain v1 records | → File 19 (drivetrain v2), File 20 (chassis) |
| 10 | Chassis v1 records | → File 20 (chassis v2) |
| 11 | Electrical v1 records | → File 21 (electrical v2), INT_HVAC_17_004 (seat heater wiring) |
| 12 | HVAC/Cooling v1 records | → File 18 (cooling v2), File 17 (HVAC v2) |
| 13 | 9A1/9A2/9A3 engine records | → File 99 (`secondary_air_injection_failure`, `ignition_coil_failure_pattern`). Note: PROJECT_STATE prior listed COOLING_18_001 + DRIVETRAIN_19_005 as outbound — corrected 2026-05-08; File 13 does not reference those records. |
| 14 | Title/mileage/accident records | → all files (universal applicability) |
| 15 | Body exterior records | → BODY_ROOF_16_001, INT_HVAC_17_006 |
| 16 | Roof mechanism records | → File 07 (cabriolet — distinct), AIRCOOLED_23_003 (964/993 HVAC) |
| 17 | INT_HVAC_17_001–007 | → File 08 (INT_HVAC_17_007), File 11/21 (INT_HVAC_17_004/005), File 12 (INT_HVAC_17_002); → File 23 (air-cooled HVAC distinct) |
| 18 | COOLING_18_001–004 | → Files 04/05 (HCV/expansion tank platform), TRANSAXLE_24_003 (PS rack leak → bushing contamination). Note: PROJECT_STATE prior listed File 13 (water pump) as outbound — corrected 2026-05-08; the relationship is one-way (File 13's "considered and not included" notes that COOLING_18_001 is the canonical entry for the 991.2 water pump pattern). |
| 19 | DRIVETRAIN_19_001–005 | → File 09 (v1), File 23 (air-cooled 901/915 context) |
| 20 | CHASSIS_20_001–004 | → File 22 (MODS_22_003 coilovers ↔ CHASSIS_20_003 PASM dampers); → File 27 (no Taycan-specific PASM record warranted; CHASSIS_20_003 covers Taycan PASM context) |
| 21 | ELEC_21_001–004 | → File 22 (MODS_22_001 tune → ELEC_21_001 COV masking) |
| 22 | MODS_22_001–003 | → ELEC_21_001, CHASSIS_20_003 |
| 23 | AIRCOOLED_23_001–003 | → File 03 (engine-adjacent: wiring harness); → File 17 (water-cooled HVAC distinct from AIRCOOLED_23_003) |
| 24 | TRANSAXLE_24_001–004 | → Files 04/05 (engine-adjacent); → COOLING_18_002/003 (no duplication confirmed); → TRANSAXLE_24_003 ↔ TRANSAXLE_24_004 (PS leak → bushing contamination) |
| 25 | REGION_25_001–003 | → AIRCOOLED_23_001 (salt-belt corrosion amplification); → MODS_22_002 (CARB emissions); → File 14 (import/grey-market provenance) |
| 26 | HALO_26_001–006 | → File 10 (no PCCB record confirmed; CGT brake declined as standalone); → File 27 (918 HV architecture confirmed distinct from Taycan 800V system — no duplication); → File 22 (no overlap: Canepa 959 SC upgrades are disclosed pre-purchase, not covert mods) |
| **27** | **TAYCAN_27_001–007** | **→ File 26 (HALO_26_005 architectural distinction: 918 400V vs Taycan 800V — confirmed in TAYCAN_27_001 editorial); → File 20 (CHASSIS_20_003 PASM applicability for Taycan keys is UNCONFIRMED pending File 20 review — see Known State Issues; no Taycan-specific PASM record warranted in File 27 regardless of outcome); → File 14 (universal provenance applies to Taycan including odometer in km vs mi for grey-market cars)** |

---

## Deferred Queue

**[RECONSTRUCTED FROM HISTORY — new deferred items from File 27 added; prior items carried forward]**

### Carried from prior sessions

- **Targa seal/latch (pre-996 air-cooled)** — Deferred from File 16. Re-researched in File 23 session. Tier B still absent. Carry to v1 revision or v2. *[Deferred twice — low priority unless Tier B surfaces]*
- **964 hydraulic self-leveling rear suspension** — Researched in File 23 session. Tier B absent. Defer.
- **G-body/930 vacuum door locks and heater controls** — Researched in File 23 session. Tier B absent for bounded defect pattern. Defer.
- **993/964/G-body electric sunroof** — Not researched in detail this session. Carry to future.
- **Air-cooled fuel tank and sending unit corrosion** — Not researched. Carry to future.
- **9Y0 Cayenne water pump** — High-priority Tier B deferred item from File 18; awaiting Tier B confirmation from 9Y0-specific source.
- **Cayenne 9Y0 / Panamera 971 PDCC pump** — Noted in File 20 session as pending Tier B.
- **Panamera 970 PDCC** — Declined in File 20 (Tier B absent). Carry.
- **930 Turbo boost system age items** — Additional candidate from File 23 prompt. Not researched for Tier B. Defer to File 23 v2 or File 03 supplement.
- **Air-cooled 993/964 electric sunroof mechanism** — Evaluated as candidate; Tier B not researched in depth. Defer.
- **928 / 924 / 944 / 968 torque tube bearing failure — already authored, removed from queue 2026-05-08.** File 04's `transaxle_4cyl_torque_tube_bearings` covers 924/944/968 with applicability extended to include 928 via `engine_family: [M28_V8]`. File 05 contains a "Cross-reference" section pointing to File 04's record as the canonical entry. No further authoring needed.
- **924 / 944 / 968 dashboard and switchgear interior age** — Declined from File 24 (generic age condition). Not a priority for v1.
- **928 cooling radiator and non-engine hose age** — Declined from File 24. Carry to File 18 v2 if needed.
- **CGT shock absorber leaks** — Declined from File 26. Recommend revisiting if a chassis supplement file is authored covering halo model non-recall items.
- **CGT PCCB brake inspection (standalone record)** — Declined from File 26. If File 10 lacks a PCCB record, consider adding one in a chassis supplement.
- **918 Weissach Package CF panels and magnesium wheels** — Tier B absent for bounded defect pattern. Carry as buyer-inspection note within HALO_26_005 editorial.
- **959 electrical/wiring age** — Declined from File 26. Real concern but no Tier B bounded pattern. Carry to future 959 supplement if Tier B surfaces.

### New deferred items from File 27 session

- **Taycan 800V charging system thermal-management faults (general car-side)** — Per SD-3, the test is whether faults manifest independent of charging infrastructure. Tier B sources (Recharged, Repasi Motorwerks) characterize charging issues as a mix of station-side and software-resolved car-side behavior, but no Tier B establishes a bounded car-side defect distinct from the recalls already captured (HV battery short-circuit family, NEMA cable). Defer until Tier B isolates a specific bounded car-side failure mode (e.g., onboard charger module specific failure pattern).
- **Taycan charge port mechanism / charge flap faults** — Forum reports of charge cable lock-in and charge flap mechanism failures (Tier C only). No Tier B specialist establishes a bounded defect pattern. Defer for v2 if Tier B surfaces.
- **Taycan HV battery degradation and capacity loss (warranty-relevant threshold)** — Tier B has not yet established a Taycan-specific degradation rate, warranty-relevant threshold, or pre-purchase inspection protocol distinct from Porsche's 8-year / 100,000-mile HV battery warranty. Defer to v2 when more service-life data exists. Recharged offers a "Recharged Score" battery diagnostic but treats it as a generic used-EV product rather than calibrating to a specific Taycan curve.
- **Taycan frunk water intrusion (general beyond APB2 sealant)** — Frunk-well water is design-as-intended per multiple owner accounts. The narrower underbody battery sealant issue is partially captured by NHTSA APB2 (2023 Taycan only) and folded into TAYCAN_27_001 editorial. Community reports of similar issues on 2020 cars exist but lack Tier B characterization. Defer broader pattern.
- **Taycan brake feel and regenerative braking integration** — No Tier B source characterizes this as a bounded defect. The actual braking-system safety recall is captured under TAYCAN_27_002 (front brake hose). Decline standalone; revisit if Tier B characterizes a specific bounded brake calibration defect.
- **Taycan electronic door handle pop-out failures** — Forum reports exist (Tier C only). No Tier B specialist characterizes a bounded defect pattern. Defer if Tier B surfaces.
- **Taycan PASM suspension wear (added 2026-05-08 revision pass)** — No Tier B establishes a Taycan-specific PASM defect pattern distinct from generic age-related damper wear. The original File 27 decline cited CHASSIS_20_003 (File 20) as covering Taycan PASM, but second-opinion review noted that File 20's record description in PROJECT_STATE describes the "997–992/718 era" and Taycan applicability is unconfirmed. Pending File 20 review (see Known State Issues). If File 20 lacks Taycan applicability, the candidate stays deferred unless Tier B surfaces; if File 20 does cover Taycan, no File 27 record is needed regardless.
- **Smaller Taycan NHTSA recalls not captured as standalone records (APA2 seat belt chime, APA5 brake pad warning color, ANA6 hazard lights, ANB7 dashboard, ARB4 headlight software, APB2 HV battery sealant, ASA2 occupant classification, ASA6 air strut retaining ring)** — Each declined as too-small population, low buyer impact, or non-Taycan-architecture-specific. All are captured implicitly via the editorial guidance in TAYCAN_27_001 (run NHTSA VIN check for all open recalls). **Recommend an audit of these individual recalls during the v1 release pre-flight to confirm no buyer-meaningful items were missed.**
- **Macan EV (out of v1 scope)** — Out of v1 by explicit prompt scope. When v2 is initiated and the Macan EV is in scope, much of the framework from File 27 will apply (recall-completion editorial pattern, generation-key conventions for BEVs).

---

## Known State Issues

**[RECONSTRUCTED FROM HISTORY + new items this session]**

- **File 17 cross-reference TODOs:** Research notes from File 17 session documented TODO cross-references:
  - INT_HVAC_17_002 → File 12 record 4 (fan resistor; now confirmed as COOLING_18_004)
  - INT_HVAC_17_004 → File 11 or 21 (underseat wiring / SRS)
  - INT_HVAC_17_005 → File 11 (SRS record)
  - INT_HVAC_17_007 → File 08 (sticky button record)
  These TODO comments exist in 17_interior_hvac.md as inline notes. Resolve at next File 17 review.

- **File 07 forward cross-reference pending:** File 07 (Cabriolet) should note that BODY_ROOF_16_001 (993/996/997 Targa sliding glass roof) is distinct from the 996/997 Cabriolet hydraulic soft top. Flag for next File 07 touch.

- **Full record count audit (Files 01–13) — COMPLETED 2026-05-08.** Direct read of all 13 in-scope files. Total: 43 records (vs estimated 44; net delta −1). Per-file deltas range from −3 (File 13) to +2 (File 01). Findings: 3 Critical, 16 Major, 22 Minor. See `audit_files_01_13_findings.md` for full per-file detail. New audit-derived items added below.

- **All v1 catalog content files verified as of 2026-05-08.** Files 23 and 24 verified 2026-05-07. Files 25, 26, and 27 verified 2026-05-08. All 28 v1 content files (00 schema + 01–27 + 99 shared) now ✅. v1 release pre-flight items remain (record-count audit, cross-reference resolution, schema-extension decisions); see "v1 Release Readiness" at bottom.

- **File 10 PCCB record status — CONFIRMED 2026-05-08.** File 10 record 3 (`pccb_carbon_ceramic_disc_replacement`, line 668) IS the PCCB record. Item closed. Note: the record uses non-canonical generation keys (`taycan_J1` capital J vs Locked `taycan_j1`; `992` no split vs Locked `992.1`/`992.2`; `980` vs Locked `carrera_gt`) — bundled into the broader generation-key reconciliation item below.

- **File 20 CHASSIS_20_003 Taycan applicability unconfirmed (added 2026-05-08 revision pass):** File 27 second-opinion review flagged that File 27's original decline of "Taycan PASM suspension wear" cited CHASSIS_20_003 as already covering Taycan, but PROJECT_STATE describes the record as covering the "997–992/718 era." Whether the actual applicability block in File 20 includes `taycan_j1` / `taycan_j1_fl` is not confirmed by direct read. **Action:** read File 20's CHASSIS_20_003 record at next File 20 touch and either (a) confirm Taycan applicability and update PROJECT_STATE description, (b) extend File 20's applicability if Tier B supports it, or (c) confirm Taycan is out of scope and File 27's deferral stands.

- **File 27 revision pass closed 2026-05-08 (verified without separate re-review):** Second-opinion review returned Substantive revision required. Revision pass addressed all blocking findings (2 Critical + 5 Major + most Minor). One Minor finding contested with documented rationale (APB5 is a real Porsche campaign number, not a typo). One self-discovered finding addressed during revision (parallel to C-2). Human verification proceeded directly without a separate re-review pass on the changed sections. See `27_taycan_revision_response.md` (session deliverable) for full finding-by-finding response. **Implication for v1 release pre-flight:** the changed sections of File 27 (TAYCAN_27_002 year_range, TAYCAN_27_004 prevalence anchor, TAYCAN_27_005 dropped numerics, M-5 cross-reference flag) should be spot-checked during the cross-reference resolution pass.

- **Halo model generation keys added 2026-05-07:** `carrera_gt`, `918`, `959` added to Locked Conventions. Any existing records that may reference these cars by other key names (none known for v1) should be audited in the full record count audit.

- **Taycan generation keys added 2026-05-08:** `taycan_j1` and `taycan_j1_fl` added to Locked Conventions. No existing records reference Taycan under other key names; confirm in full audit.

- **File 27 editorial-length minor finding:** Editorial notes on TAYCAN_27_001, TAYCAN_27_004, and TAYCAN_27_005 run slightly longer than the 2-4 sentence schema target. Accepted given the multi-step recall verification framework and buyer-stakes complexity. Consider tightening if file is touched in v1 revision.

- **Cross-marque recall index needed for v1 release:** File 27 captures Taycan-specific records, but several Taycan recalls also touch other models (NHTSA 25V-896 / ASB2 covers Cayenne, 911, Panamera, and Taycan; NHTSA 23V-841 / APB6 covers Cayenne E-Hybrid, Panamera, and Taycan). Per-file records are correct, but a cross-marque index is recommended to prevent duplication or omission when other marque records are authored.

### Audit-derived items (added 2026-05-08, Files 01–13 audit)

- **(Critical, audit C-1) File 13 record count gap — RESOLVED 2026-05-08 (Blake decision: v1 scope = 2 records).** File 13 stays at 2 records: `991_1_gt3_engine_concerns` and `9a1_family_dfi_intake_valve_carbon_buildup`. Of 9 candidates surfaced in re-read of File 13's "Considered and not included" section: 2 already exist in v2 files (991.2 early-build coolant pump = `COOLING_18_001`; 991/992 COV/P1433 vacuum solenoid = `ELEC_21_001`), 1 is a File 20 gap not a File 13 gap (992 PADM — see new item below), and 6 are genuinely below v1 evidence bar (9A1 timing chain tensioner wear, 9A1 AOS, 991.2 intercooler water, DKKA injector, 9A2/9A3 turbocharger, 9A1 oil pump — the last is explicitly NOT a defect per Go-Parts technical reference). PROJECT_STATE TOC and v1 Release Readiness updated accordingly.

- **(NEW, surfaced from C-1 resolution) File 20 gap: 992 PADM (active engine mount) sensor failure / water ingress.** File 13's "Considered and not included" item documents this as Porsche TSB + recall (Tier A manufacturer-acknowledged), with engine-out repair required. File 13 explicitly scopes it to File 20 (Chassis v2) per the project's organizational plan: "engine mounts are physically attached to the engine but functionally a chassis / vibration-control component." File 20 currently has 4 records (CHASSIS_20_001 PDCH, _002 Cayenne air suspension, _003 PASM, _004 PDCC) — no PADM record. Outside Files 01–13 audit scope but worth flagging as a v1 release gap. **Action:** add to File 20 cross-reference resolution / revision pass agenda. Tier A sourcing path is clear (Porsche TSB + recall identifiers); Tier C secondary discussion at PorscheMania [PMANIA-992] and what-breaks.com [WB-DKKA] is consistent with the Tier A acknowledgment.

- **(Critical, audit C-2) Generation-key convention drift across Files 01–13 — RESOLVED 2026-05-08 (Blake: option (a) — update records to Locked Conventions form).** All non-canonical generation keys across Files 03, 06, 07, 08, 09, 10 record 3, 11 replaced with canonical Locked Conventions form. 8 files revised total (the 7 above plus File 04 for bundled M-1 fix). Sub-divisions of canonical keys (e.g., `911_G_body_early` vs `_late`) collapsed into canonical key + year_range narrowing — semantics preserved via existing year_range fields. Composite key `928_S2_S3_S4_GT_GTS` expanded to individual keys (also resolves the documented `928_S3` non-existence). Phase sub-keys (`cayenne_958_phase_1`/`_phase_2`/`macan_95B_phase_2`) collapsed into single canonical generation keys with phase distinction carried in comments. Engine-family taxonomy gap (m17) deferred — this pass was generation-key reconciliation only.

- **(Critical, audit C-3) PROJECT_STATE TOC titles for Files 01 and 02 — corrected this session.** Prior TOC labeled File 01 as "IMS Bearing (M96/M97)" est. 3; actual file covers full M96/M97 (5 records). Prior TOC labeled File 02 as "AOS / Oil Separator" est. 2; actual file is Mezger (1 record). Both TOC entries updated above.

- **(Major, audit M-1) File 04 broken cross-reference — RESOLVED 2026-05-08.** Excludes block in `transaxle_4cyl_torque_tube_bearings` (line 338) updated from "06_engine_928_v8.md" to "05_engine_928_v8.md". Bundled into C-2 reconciliation pass.

- **(Major, audit M-2) File 09 broken cross-reference — RESOLVED 2026-05-08 (Blake decision: option (a) — drop the cross-reference).** Record 2 (PDK) is self-contained; PDK is a transmission concern not requiring engine-side companion records. Cross-reference text rewritten to reflect this. The 718 MA1 four-cylinder engine remains uncovered in the catalog as a dedicated record — captured separately in PROJECT_STATE Schema-Extension Queue if/when 718 engine warrants its own file.

- **(Major, audit M-3) Deferred Queue stale: torque tube bearings — RESOLVED 2026-05-08.** Deferred Queue entry on line 220 of original PROJECT_STATE removed (or marked stale here pending cleanup of the Deferred Queue section itself). File 04 already contains `transaxle_4cyl_torque_tube_bearings` covering 924/944/968 (with 928 via M28_V8 engine_family extension; File 05 cross-refs into it). No future-file authoring is needed.

- **(Major, audit M-4) File 06 within-record case inconsistency — RESOLVED 2026-05-08.** All 3 records' applicability blocks updated from `Cayenne_955`/`Cayenne_957` to lowercase `cayenne_955`/`cayenne_957`. Bundled into C-2 reconciliation pass.

- **(Major, audit M-5) File 08 record-internal contradiction on Cayenne 958 — RESOLVED 2026-05-08.** `Cayenne_958` removed from applicability list. Record's editorial intent (excludes 958 from scope) is now consistent with applicability. Bundled into C-2 reconciliation pass.

- **(Major, audit M-6) File 03 introduces 5 generation keys not in Locked Conventions — RESOLVED 2026-05-08.** Records 1, 2, 3 updated to use canonical keys (`911_F_body`, `911_G_body`, `930`) with year_range narrowing carrying the early/late sub-division semantics. Bundled into C-2 reconciliation pass.

- **(Major, audit M-9) File 10 record 3 (PCCB) stale comment — RESOLVED 2026-05-08.** Comment about Files 06+ "not yet authored" reframed to reflect current state (engine-family naming conventions not yet formally registered in Locked Conventions). Bundled into C-2 reconciliation pass.

- **(Major, audit M-10) File 03 file intro count out of date — RESOLVED 2026-05-08.** Intro updated from "four flagged defects" to "five flagged defects" with DMF item added to the description. Bundled into C-2 reconciliation pass.

- **(Major, audit M-11) File 13 cross-reference index in PROJECT_STATE — RESOLVED 2026-05-08.** Per-file cross-reference index updated: File 13 outbound now correctly lists File 99 records (`secondary_air_injection_failure`, `ignition_coil_failure_pattern`) and notes prior COOLING_18_001 + DRIVETRAIN_19_005 entries as corrections. File 18 outbound updated to drop the spurious File 13 reference and note the one-way relationship.

- **(Major, audit M-14) `00_schema.md` File organization section out of date — RESOLVED 2026-05-08.** Schema's File organization section updated to reflect actual repo file numbering (04=transaxle, 05=928, 06=Cayenne) and to include Files 09–13 with descriptions. Files 14–27 referenced as a group with redirect to PROJECT_STATE.md TOC for the canonical, up-to-date file list. File 99 listed with its canonical filename `99_shared_water_cooled_era.md`.

- **(Major, audit M-16) File 99 filename — RESOLVED 2026-05-08.** Repo file renamed from `09_99_shared_water_cooled_era.md` to `99_shared_water_cooled_era.md` (Blake confirmed). Filename now matches PROJECT_STATE TOC, `00_schema.md` File organization, and all cross-references in Files 01, 02, 03, 06, 11, 13.

- **(Minor batch, audit) Asymmetric cross-references and stale TODO comments.** Several of the v2 files (14–27) reference back to Files 01–13 but the older v1 files don't reference forward to the v2 records. Defensible (older files don't know about newer files) but should be addressed in cross-reference resolution pass for v1 release. Examples: File 03 ↔ 23, File 05 ↔ 18 / 24, File 06 ↔ 09 / 11 / 18 / 20, File 08 ↔ INT_HVAC_17_007. Plus stale comment in File 10 record 3 ("files 06+ which have not yet been authored" — they have been). See `audit_files_01_13_findings.md` Minor section for full list.

- **(Minor, audit) Schema convention drift on section headers — RESOLVED 2026-05-08 (Blake decision: ship mixed, document in schema).** `00_schema.md` updated with explicit "Section header conventions" subsection documenting the three styles in use (Files 01–08 + 13: `## Defect:`, Files 09–12: `## Record N —`, File 99: `## Records`) and noting that section headers are presentational and don't affect matcher routing. The parser keys on the YAML block delimited by code fences within each record. Mixed convention preserved for v1; v2 may consolidate.

- **(Minor, audit) ID format split — RESOLVED 2026-05-08 (Blake decision: ship mixed, document in schema).** `00_schema.md` updated with explicit "Record ID conventions" subsection documenting the two styles in use (Files 01–13: defect-name-based snake_case; Files 14–27 + 99: file-numbered uppercase prefix + NN_NNN). The two formats are structurally orthogonal (no collisions mechanically possible). Both are valid identifiers under the schema. Cross-references between records use the same heterogeneous form. Mixed convention preserved for v1; v2 may consolidate.

- **(Minor, audit m17) Engine-family taxonomy gap — RESOLVED 2026-05-08 (Blake decision: option (a) — extend Locked Conventions).** Engine Family Naming section in PROJECT_STATE Locked Conventions expanded to register every engine_family value currently in use across Files 01–13 (and a few from Files 14–27). Comprehensive coverage now includes: air-cooled flat-six (4 sub-types + M64/M77/synonyms), Mezger, water-cooled flat-six (M96/M97/9A1/9A2/9A3 + DFI composites + 718 four-cylinder), 928 V8 (M28_V8 + lowercase synonym), 924/944/968 (M44 family + Audi-sourced 2.0L), Cayenne V8 (M48 + 6 sub-variants), Cayenne V6 (5 entries + synonyms), Cayenne diesel (2 entries + synonyms), Cayenne hybrid, Macan (4 entries), Panamera (8 entries), halo (959/Carrera GT/918), and Taycan (BEV — no engine_family). Synonyms preserved for matcher backwards compatibility (e.g., `m928_v8` ≡ `M28_V8`, `air_cooled_911` ≡ `aircooled_flat_6`); v2 may consolidate to canonical form per pair.

---

## Schema-Extension Queue

**[RECONSTRUCTED FROM HISTORY]**

- **`tier_a_doc_retrieved: true | referenced_only`** — strengthened by File 10 TSB 84-01 case; also applies to AIRCOOLED_23_001 (TSB W301 text confirmed in secondary sources but primary PCNA document not directly retrieved) and TRANSAXLE_24_004 (TSBs H/9102 and J/9308 referenced via forum and Rennlist but primary TSB documents not directly retrieved). **File 27 NHTSA Part 573 reports were retrieved at URL level (links cited in the file's source URL block) but primary text was accessed via NHTSA mirror sources (StuttgartDNA, Cars.com) rather than direct PDF retrieval; same shape of the issue applies.**
- **`evidence_basis` sub-listed form** — current canonical form is sub-listed `tier_a / tier_b / tier_c` blocks rather than single-keyword; confirm in 00_schema.md v2. **File 27 records use both: a single-keyword `evidence_basis` plus the sub-listed `sources` block. File 26 and earlier files use the same dual form.**
- **NEW (from File 27): `service_campaign` vs `safety_recall` distinction** — TAYCAN_27_004 (HV heater) is a Porsche customer service campaign in the US, not a NHTSA safety recall. Schema does not currently distinguish these for matcher routing or for `keywords_addressed` patterns. Consider a v2 field `regulatory_classification: nhtsa_safety_recall | manufacturer_service_campaign | tsb` for cases where the buyer-verification path differs (NHTSA VIN check vs dealer-only campaign-history pull).
- **NEW (from File 27): cross-marque recall handling** — When a recall covers multiple Porsche models (e.g., NHTSA 25V-896 / ASB2 covers Cayenne, 911, Panamera, Taycan), the catalog currently authors per-marque records. Consider whether a `cross_marque_campaign` field or a shared-record pattern would reduce duplication. Defer to v2.

---

## Workflow Conventions

**[RECONSTRUCTED FROM HISTORY]**

- **Session end:** Always produce updated PROJECT_STATE.md as a file (not inline). Save with exact filename.
- **Uploaded files:** Must be verified accessible before session begins. If uploads don't persist, reconstruct from conversation history and note clearly in file header.
- **Self-review:** 8-point checklist per file before moving to next file. Fix all findings.
- **Verifying vs. ⬜:** ⬜ = unstarted, 🟡 = draft, ✅ = human-verified.
- **Same-filename deliverables:** Catalog files and PROJECT_STATE.md use exact filenames; no date suffixes.

---

## Source-of-Truth Pointers

- **Canonical state:** `PROJECT_STATE.md` (this file)
- **Schema:** `docs/reference/defects/00_schema.md`
- **Decade scoping:** `docs/reference/porsche_19XXs_reference.md`
- **Repository:** github.com/Bjones414/project-vintage
- **Defect catalog:** `docs/reference/defects/`

---

## v1 Release Readiness

**Catalog content phase: complete.** All 28 v1 content files (00 schema +
01–27 + 99 shared) authored, reviewed, and ✅ human-verified as of
2026-05-08.

**Pre-release pre-flight queue (not blocking the catalog-content milestone
but required before v1 release):**

- [x] **All v1 catalog files signed off** — completed 2026-05-08.
- [x] **Full record-count audit (Files 01–13)** — completed 2026-05-08.
  Direct read of all 13 files. 43 records confirmed. Per-file deltas
  range from −3 (File 13) to +2 (File 01). 41 findings (3 Critical, 16
  Major, 22 Minor) documented in `audit_files_01_13_findings.md`. TOC
  counts and titles updated in this PROJECT_STATE. Cross-reference
  resolution for Files 01–13 partially completed as part of count
  audit; full cross-reference pass still needed for Files 14–27 and
  for resolving the 41 findings (per locked principle: audit is not
  revision; revision pass is a separate session).
- [ ] **Cross-reference resolution pass (Files 14–27 + audit-finding
  resolution).** Files 01–13 cross-references audited 2026-05-08;
  Files 14–27 still pending. Should also (a) spot-check File 27's
  revision-pass changes (TAYCAN_27_002 year_range, TAYCAN_27_004
  prevalence anchor, TAYCAN_27_005 dropped numerics), (b) resolve the
  16 Major and applicable Minor findings from the Files 01–13 audit
  (broken cross-refs in Files 04 and 09; asymmetric refs across File
  03↔23, File 05↔18/24, File 06↔09/11/18/20, File 08↔INT_HVAC_17_007;
  stale TODO comments in File 10 record 3; PROJECT_STATE per-file
  cross-reference index corrections for File 13, File 18, File 03↔23).
- [x] **Generation-key reconciliation pass — completed 2026-05-08.**
  Audit C-2 finding resolved. Blake selected Option (a) — update
  records to Locked Conventions form. 8 files revised (03, 04, 06, 07,
  08, 09, 10 record 3, 11). All non-canonical generation keys replaced
  with canonical Locked Conventions form. Bundled fixes: M-1 (File 04
  broken cross-ref), M-5 (File 08 record-internal contradiction), M-9
  (File 10 record 3 stale comment), M-10 (File 03 intro count). Engine-
  family taxonomy (m17) deferred — separate decision needed. Records
  in Files 01, 02, 05, 13 already used canonical generation keys; no
  changes needed there.
- [x] **File 13 v1 scope decision — completed 2026-05-08 (Blake: v1 scope = 2 records).** Re-read of File 13's "Considered and not included" section showed 2 candidates already exist in v2 files, 1 is a File 20 gap (992 PADM — added to Known State Issues), and 6 are genuinely below v1 bar. No additional File 13 records needed for v1.
- [ ] **File 20 CHASSIS_20_003 Taycan applicability check** — surfaced
  during File 27 review. Read File 20's actual applicability block and
  reconcile with PROJECT_STATE description ("997–992/718 era") and
  File 27's Taycan PASM deferral.
- [ ] **Cross-marque recall audit** — for File 27 cross-marque recalls
  (ASB2, APB6) and any others, confirm marque-specific files handle
  their share without duplication or omission.
- [ ] **Smaller Taycan recall audit** — verify the eight recalls
  declined as standalone records (APA2, APA5, ANA6, ANB7, ARB4, APB2,
  ASA2, ASA6) don't have buyer-meaningful items missed.
- [ ] **Schema-extension queue review** — decide which extensions ship
  with v1 vs defer to v2. Candidates: `tier_a_doc_retrieved`,
  `evidence_basis` sub-listed form, `regulatory_classification`
  (safety_recall vs service_campaign), cross-marque recall handling,
  and audit-surfaced candidates (option-code scoping for PCCB, VIN-range
  scoping, service-cluster grouping, supplier-variant enums — see
  schema-extension queues in Files 09, 10, 11, 12).
- [x] **`00_schema.md` File organization section update — completed
  2026-05-08.** Audit M-14 resolved: schema doc updated with correct
  Files 04/05/06 ordering and full Files 09–27 + 99 listing. Reader
  redirected to PROJECT_STATE.md TOC for canonical, up-to-date file
  list.
- [x] **Section header and ID convention decision — completed
  2026-05-08 (Blake: ship mixed, document).** Audit M-7 and M-8
  resolved: `00_schema.md` updated with explicit "Section header
  conventions" and "Record ID conventions" subsections documenting the
  mixed conventions in use. Section headers are presentational and
  don't affect matcher routing; record ID formats are structurally
  orthogonal (no collisions). Both conventions remain valid for v1; v2
  may consolidate.
- [x] **Engine-family taxonomy registration — completed 2026-05-08
  (Blake: extend Locked Conventions).** Audit m17 resolved: Engine
  Family Naming section in Locked Conventions expanded to register
  every engine_family value currently in use across the catalog
  (~50 entries covering air-cooled, water-cooled, Mezger, 928, 924/944/
  968, Cayenne V8/V6/diesel/hybrid, Macan, Panamera, halo, and Taycan).
  Synonyms preserved for matcher backwards compatibility.
- [ ] **End-to-end matcher test** — once the above are clean, exercise
  the matcher against representative auction listings to confirm
  records fire correctly and cross-references resolve. With C-1, C-2,
  C-3, M-1 through M-16, m17 all resolved as of 2026-05-08, this is
  the recommended next pre-flight gate.

---

*End of PROJECT_STATE.md*
