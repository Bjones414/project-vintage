# Test Cases — Comp Engine Fixes

## Scenario 1 — 2002 996.2 Carrera Cabriolet 6-Speed

**What we expect:** Comps should be 996.2 Carrera Cabriolet manual listings only.
Turbo and GT3 comps must NOT appear.

**Test:** `tests/lib/comp-engine-v2/hard-filter.test.ts`
- "Turbo comp does not bleed into Carrera subject with null trim_category (D6 guard)"
- "GT3 comp blocked from Carrera subject"

**Logic path:**
1. Subject: `trim_category = 'carrera_base'` (or null if not yet categorized)
2. Hard filter: Turbo comps with `trim_category = 'turbo_base'` blocked by ALWAYS_SEPARATE_MARKET
3. Cascade level 1 tries: same year (2002) + same body (Cabriolet) + same transmission (manual)
4. If ≥ 5 comps at level 1: use these (most precise)
5. If < 5: cascade to level 2 (adjacent years), then 3, 4, 5 (Carrera family), 6
6. At levels 5-6: `carrera_4` Cabriolets may appear alongside `carrera_base` — caveat displayed

**Pass criteria:** No `turbo_base` or `turbo_s` listing IDs in `comps_used`

---

## Scenario 2 — 996/997 Turbo listing

**What we expect:** Comps should be Turbo-only. Carrera comps must NOT appear.

**Test:** `tests/lib/comp-engine-v2/hard-filter.test.ts`
- "Turbo subject does not receive Carrera comps when its own trim_category is known"
- "Turbo comp does not bleed into Carrera subject with null trim_category (D6 guard)"
- `tests/lib/comp-engine-v2/cascade.test.ts`
- "Turbo subject does not cascade past level 4"

**Logic path:**
1. Subject: `trim_category = 'turbo_base'` (or `turbo_s`)
2. Hard filter blocks all non-turbo comps (trim_category equality check)
3. Cascade: maxes at level 4 (Turbo is not Carrera-family; levels 5-6 are not tried)
4. If < 5 comps at level 4: returns `insufficient_comps` — never falls back to Carrera

**Pass criteria:** No `carrera_*` listing IDs in `comps_used`

---

## Scenario 3 — GT3 listing

**What we expect:** Own-market comping. No Carrera, no Turbo.

**Test:** `tests/lib/comp-engine-v2/cascade.test.ts`
- "GT2 never comps with Carrera" (same pattern applies to GT3)
- `tests/lib/comp-engine-v2/hard-filter.test.ts`
- "GT3 comp blocked from Carrera subject"
- "GT3 RS comp blocked from Carrera subject"

**Logic path:**
1. Subject: `trim_category = 'gt3'`
2. Hard filter: only `gt3` comps pass (trim_category equality)
3. ALWAYS_SEPARATE_MARKET bilateral: `gt3` comps blocked from all non-GT3 subjects
4. Cascade: `gt3` is not Carrera-family; caps at level 4

**Pass criteria:** Only `gt3` listing IDs in `comps_used`; `gt3_rs` and `carrera_*` absent

---

## Scenario 4 — Sparse comp variant (991.1 Carrera GTS Cabriolet manual)

**What we expect:** Cascade falls back to Carrera family; caveat displayed.

**Test:** `tests/lib/comp-engine-v2/cascade.test.ts`
- "cascades to level 5 for Carrera subject when levels 1-4 are sparse"
- "getCascadeCaveat returns a string for levels 3-6"

**Logic path:**
1. Subject: `trim_category = 'gts'`, `body_style = 'Cabriolet'`, `transmission_variant = 'manual'`
2. Hard filter: only `gts` comps pass
3. Cascade level 1: GTS Cabriolet manual same year — likely < 5
4. Cascade level 2: GTS Cabriolet adjacent years — likely < 5
5. Cascade level 3: GTS Cabriolet full generation — possibly < 5
6. Cascade level 4: all GTS body styles — possibly < 5
7. Cascade level 5: `isCarreraFamily('gts') = true` → expand to all Carrera family
8. `cascade_caveat` is set; displayed in ComparableSalesCard

**Pass criteria:**
- `cascade_level >= 5` in result
- `cascade_caveat != null` in result
- Comps include `carrera_base`, `carrera_s`, etc. alongside `gts`
- No `turbo_*`, `gt3*`, `gt2*` in comps

---

## Scenario 5 — Carrera variant (widening to Carrera family but never Turbo)

**What we expect:** Cascade widens to `carrera_4`, `carrera_s`, etc. but never to Turbo.

**Test:** `tests/lib/comp-engine-v2/cascade.test.ts`
- "expands to Carrera family trims when subject is Carrera-family"
- "does NOT expand beyond hard-filtered pool for non-Carrera subjects"

**Logic path:**
1. Subject: `trim_category = 'carrera_base'`
2. If enough same-trim comps: use them (levels 1-4)
3. If sparse: cascade level 5 adds `carrera_4`, `carrera_s`, `carrera_4s`, `gts`
4. Turbo, GT3, GT2 are NOT in CARRERA_FAMILY — never added

**Pass criteria:**
- No `turbo_*`, `gt3*`, `gt2*`, `rs_*`, `limited`, `coachbuilt` in comps
- At levels 5-6: `carrera_4`, `carrera_s` may appear in comps

---

## Scenario 6 — DMF wear (964/993 Turbo) NOT flagged

**What we expect:** `aircooled_964_993_dmf_wear` should NOT appear for Turbo listings.

**Test:** `tests/originality/matchDefects.test.ts`
- "does NOT flag DMF wear on a 993 Turbo (trim_category exclude fires)"
- "does NOT flag DMF wear on a 993 Turbo S"
- "does NOT flag DMF wear on a 993 GT2"
- "does NOT flag DMF wear on a 964 Turbo"

**Logic path:**
1. `matchDefects({ generation_id: '993', trim_category: '993_Turbo', ... })`
2. `aircooled_964_993_dmf_wear` applicability matches generation 993
3. exclude block fires: `trim_category: ['993_Turbo', ...]` — matches context trim_category
4. `isExcluded()` returns true → defect is skipped

**Pass criteria:** `items.some(i => i.source_id === 'aircooled_964_993_dmf_wear')` is `false`

---

## Scenario 7 — DMF wear (993 Carrera) IS flagged

**What we expect:** `aircooled_964_993_dmf_wear` should appear for Carrera listings.

**Test:** `tests/originality/matchDefects.test.ts`
- "flags DMF wear on a 993 Carrera (no exclusion applies)"

**Logic path:**
1. `matchDefects({ generation_id: '993', trim_category: '993_C2', ... })`
2. `aircooled_964_993_dmf_wear` applicability matches generation 993
3. exclude block: `trim_category: ['964_Turbo', '993_Turbo', ...]` — '993_C2' NOT in list
4. `matchesExclude()` returns false → `isExcluded()` returns false → defect is included

**Pass criteria:** `items.some(i => i.source_id === 'aircooled_964_993_dmf_wear')` is `true`
