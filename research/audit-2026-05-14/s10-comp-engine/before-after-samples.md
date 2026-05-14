# Before / After Samples

These samples show the comp engine behavior for the 5 test VINs before and after the fix.
Since the engine runs against live DB data, these are logical samples based on the code path,
not actual DB query results. Actual results depend on which sold listings are in the database.

---

## VIN 1 — 2002 996.2 Carrera Cabriolet 6-Speed (WP0CA299X2S650260)

**Generation:** 996.2  
**Trim category:** `carrera_base` (when categorized) or `null` (if not yet run through deriveTrimCategory)

### BEFORE

**With subject trim_category = null (D6 fires):**
- Hard filter: ALL 996.2 sold listings pass through (no trim_category check)
- Pool includes: Carrera Coupes, Carrera Cabriolets, Turbo Coupes, Turbo Cabriolets, GT3
- Strict tier: same body (Cabriolet) within 24mo → might include Turbo Cabriolet if sold same period
- Result: Fair value inflated by Turbo prices. A $80K Carrera Cab might show median $110K+ if
  Turbo Cabs are in the pool.

**With subject trim_category = 'carrera_base':**
- Hard filter: only `carrera_base` comps pass
- Turbo is correctly isolated — but ONLY if trim_category is set in DB

### AFTER

**With subject trim_category = null (D6 fires):**
- Hard filter bilateral gate: `turbo_base`, `turbo_s`, `gt3`, `gt3_rs`, `gt2` comps blocked
  by ALWAYS_SEPARATE_MARKET even though D6 fires
- Carrera variants (`carrera_base`, `carrera_4`, `carrera_s`) pass through
- Cascade level 1: same year (2002) + Cabriolet + manual → if ≥ 5: use
- Cascade level 2: adjacent years ± 2 + Cabriolet → if ≥ 5: use
- Cascade levels 3-6: progressively broader Carrera pool
- Result: Fair value reflects Carrera Cabriolet market only. $75K–$95K realistic range.

**With subject trim_category = 'carrera_base':**
- Behavior unchanged — still correctly isolated. Cascade refines the pool further.

---

## VIN 2 — 996/997 Turbo listing (example: 2003 996 Turbo Coupe)

**Generation:** 996.2  
**Trim category:** `turbo_base`

### BEFORE

**With subject trim_category = 'turbo_base':**
- Hard filter correctly blocks Carrera comps ✓ (trim_category equality check works)
- But: sparse-comp scenario with only 2 Turbo comps → falls back to `wide` tier
- Wide tier: entire 996 generation pool including Carrera comps
- Result: Carrera prices dilute the Turbo fair value downward

**With subject trim_category = null:**
- Hard filter: ALL 996 comps pass (D6)
- Carrera comps mix with Turbo comps
- Result: Completely incorrect fair value

### AFTER

**With subject trim_category = 'turbo_base':**
- Hard filter: Carrera comps blocked by trim_category equality ✓
- Cascade: `turbo_base` is NOT Carrera-family → maxes at level 4
- Level 4 (any body): all Turbo coupes and cabriolets in pool → more comps
- No fallback to Carrera at any level
- Result: Correct Turbo-only fair value

**With subject trim_category = null:**
- Bilateral ALWAYS_SEPARATE_MARKET gate: `carrera_base`, `carrera_4`, `carrera_s` have
  their own trim_categories set → they do NOT have `turbo_base` trim_category
- Wait — the bilateral gate only blocks ALWAYS_SEPARATE_MARKET COMPS from non-matching
  SUBJECTS. A Carrera comp with trim_category='carrera_base' is NOT in ALWAYS_SEPARATE_MARKET,
  so it would pass through to a null-trim-category Turbo subject.
- **Note:** This is a known limitation when BOTH subject and comps have null trim_category
  (D6 fires on both ends). The fix is effective when either side has a trim_category set.
- Best outcome: DB must have trim_category populated on listings via deriveTrimCategory backfill.

---

## VIN 3 — GT3 listing (example: 2006 997.1 GT3 Coupe)

**Generation:** 997.1  
**Trim category:** `gt3`

### BEFORE

**With subject trim_category = 'gt3':**
- Hard filter: only `gt3` comps pass ✓
- ALWAYS_SEPARATE_MARKET bilateral: `gt3` comps blocked from non-GT3 subjects ✓
- But ALWAYS_SEPARATE_MARKET set was: `['coachbuilt', 'limited']` — `gt3` NOT in set
- Bilateral gate: `gt3` comps with `gt3` trim_category NOT blocked from null-subject
- A Carrera with null trim_category could receive GT3 comps

### AFTER

**With subject trim_category = 'gt3':**
- Hard filter: only `gt3` comps pass ✓
- Cascade: `gt3` is NOT Carrera-family → maxes at level 4 (all GT3 body styles)
- No expansion to Carrera

**With subject trim_category = null:**
- If comp has trim_category `gt3`: ALWAYS_SEPARATE_MARKET blocks it from null-subject ✓
- GT3 comps no longer leak into uncategorized subjects

---

## VIN 4 — Sparse comp variant (991.1 Carrera GTS Cabriolet manual)

**Generation:** 991.1  
**Trim category:** `gts`

### BEFORE

- Hard filter: only `gts` comps pass
- If < 3 gts comps → `insufficient_comps` immediately
- No fallback to Carrera S or broader Carrera family
- User sees no fair value for a well-specified but uncommon variant

### AFTER

- Hard filter: only `gts` comps pass
- Cascade level 1: GTS Cab manual same year → likely < 5 comps
- Cascade level 2: GTS Cab adjacent years → likely < 5
- Cascade level 3: all GTS Cabs → possibly < 5
- Cascade level 4: all GTS body styles → possibly ≥ 5 (if PDK comps included)
- Cascade level 5: all Carrera family (incl. `carrera_s`, `carrera_4s`, `carrera_base`) → likely ≥ 5
- Result: Fair value returned with caveat: "Comps include broader 991.1 Carrera variants due
  to limited data for this specific configuration."
- User gets indicative value with transparency rather than blank screen

---

## VIN 5 — Carrera variant (example: 2009 997.1 Carrera 4S Coupe)

**Generation:** 997.1  
**Trim category:** `carrera_4s`

### BEFORE

- Hard filter: only `carrera_4s` comps pass ✓
- Strict/wide tiers based on body + mileage only (no cascade)
- Wide tier used entire 997.1 carrera_4s pool regardless of year spread
- No Turbo bleeding (trim_category equality check works when both are set)

### AFTER

- Hard filter: only `carrera_4s` comps pass ✓
- Cascade level 1: C4S Coupe same year + PDK/manual separated → if ≥ 5: use
- Cascade levels 2-4: progressively widen within C4S
- Cascade level 5: `carrera_4s` is Carrera-family → if sparse, widens to include
  `carrera_s`, `carrera_4`, `carrera_base`, `gts`
- Caveat at level 5+: "Comps include broader 997.1 Carrera variants..."
- Turbo, GT3, GT2 NEVER appear regardless of cascade level

---

## Summary of behavioral changes

| Scenario | Before | After |
|---|---|---|
| Carrera w/ null trim_category | Turbo comps leak in | Turbo blocked by bilateral gate |
| Turbo w/ null trim_category | Carrera comps leak in | Partial fix (Turbo comps with set trim_category blocked; null-null leakage remains) |
| GT3 comps into null-subject | GT3 leaks into Carrera | GT3 blocked by bilateral gate |
| Sparse GTS Cabriolet | `insufficient_comps` | Cascade to Carrera family with caveat |
| DMF wear on 964 Turbo | Incorrectly flagged | Correctly excluded |
| DMF wear on 993 Turbo S | Incorrectly flagged | Correctly excluded |
| DMF wear on 993 Carrera | Correctly flagged ✓ | Still correctly flagged ✓ |
