# S11 Watch-For Catalog — Before / After Samples

**Session:** 2026-05-14  
**Method:** Simulated via matchDefects() inline catalog mocks in vitest

---

## BUG 1 — Body filter

### 1a. 993 Targa — Targa roof seal record

| | Before fix | After fix |
|---|---|---|
| Context | generation_id: '993', body_style: 'Targa' | same |
| Catalog entry | `applicability.body: ['Targa']` (parsed but never evaluated) | same (now evaluated) |
| Result | `test_targa_roof` **incorrectly fires** on all 993 listings | `test_targa_roof` fires **only on Targa** |

### 1b. 993 Coupe — Targa roof seal record should not fire

| | Before fix | After fix |
|---|---|---|
| Context | generation_id: '993', body_style: 'Coupe' | same |
| Result | `test_targa_roof` **incorrectly appears** in results | `test_targa_roof` **absent** from results |

### 1c. 993 Cabriolet — convertible-top record

| | Before fix | After fix |
|---|---|---|
| Context | generation_id: '993', body_style: 'Cabriolet' | same |
| Catalog entry | `excludes.body: ['Coupe', 'Targa']` (parsed but never evaluated) | same (now evaluated) |
| Result | Record fires on Cabriolet (correct — no exclusion) | same ✓ |

### 1d. 993 Coupe — convertible-top record should be excluded

| | Before fix | After fix |
|---|---|---|
| Context | generation_id: '993', body_style: 'Coupe' | same |
| Result | `test_cabriolet_top` **incorrectly fires** on Coupe | `test_cabriolet_top` **absent** from results |

**Real-world affected entries:** `BODY_ROOF_16_001` (Targa-specific roof mechanism record was firing on all 993/996/997 listings), three records in `07_body_cabriolet.md`, multiple in `09_drivetrain_transmissions.md` and `08_interior_sticky_buttons.md`.

---

## BUG 2 — trim_category exclusion (DMF wear on 964/993 Turbo)

### 2a. 993 Turbo — DMF wear should be excluded

| | Before fix | After fix |
|---|---|---|
| Context | generation_id: '993', trim_category: '993_Turbo' | same |
| Catalog entry | `excludes.trim_category: ['993_Turbo', ...]` | same |
| Result | `aircooled_964_993_dmf_wear` **incorrectly fires** | `aircooled_964_993_dmf_wear` **absent** |

### 2b. 993 Carrera 2 — DMF wear should fire

| | Before fix | After fix |
|---|---|---|
| Context | generation_id: '993', trim_category: '993_C2' | same |
| Result | Record fires (no exclusion applies) ✓ | same ✓ |

### 2c. Positive trim_category filter (applicability.trim_category)

| | Before fix | After fix |
|---|---|---|
| Catalog entry | `applicability.trim_category: ['964_C2', '993_C2', ...]` | same |
| Context | generation_id: '993', trim_category: '993_Turbo' | same |
| Result | Record fires even though Turbo is not in positive list | Record skipped (not in positive list) |

Note: BUG 2 had two sub-issues. The exclude path was already implemented in a prior session; this session added the missing positive filter.

---

## BUG 3 — Salt-belt corrosion record (REGION_25_001)

### Before fix
```
matchDefects({ generation_id: '993', year: 1996, ... })
→ REGION_25_001 not in results (record invisible to parser)
→ REGION_25_002 not in results (record invisible to parser)
→ REGION_25_003 not in results (record invisible to parser)
```

All three records were invisible because both YAML blocks for each record failed the parser's validation:
- Block 1: had `record_id`/`title` (wrong keys) but no `applicability` → rejected
- Block 2: had `applicability` but no `id`/`flag_title` → rejected

### After fix
```
matchDefects({ generation_id: '993', year: 1996, ... })
→ REGION_25_001 (high) — "Pre-996 Air-Cooled 911 Salt-Belt Underbody and Structural Corrosion"
  appears in results for 911-f-body, g-series-2.7, 911-sc, 911-3.2-carrera, 930, 964, 993
  with year_range [1963, 1998]

matchDefects({ generation_id: '996.1', year: 2000, ... })
→ REGION_25_002 (moderate) — "California CARB Emissions Compliance"
  appears in results for 996.1, 996.2, 997.x, 991.x, 992.x, 987.x, 981, 718
  with year_range [1996, 2030]

matchDefects({ generation_id: '993', year: 1996, ... })
→ REGION_25_003 (moderate) — "Import and Grey-Market Compliance"
  appears in results for all covered generations
  with year_range [1963, 2030]
```

---

## BUG 4 — Stale generation keys (G50 on 993 Carrera)

### Before fix — 09_drivetrain_transmissions.md G50 record

```
# Catalog entry (before)
applicability:
  generation: [911_G_body, 964, 993]
  year_range: [1987, 1998]

matchDefects({ generation_id: 'g-series-2.7', year: 1976, ... })
→ G50 record fires incorrectly on a 1976 car (year_range passes; generation key has no alias so 
  generationMatchesList always returns false for correct IDs → never fired at all)

matchDefects({ generation_id: '911-3.2-carrera', year: 1988, ... })
→ G50 record does NOT fire (because '911_G_body' ≠ '911-3.2-carrera' and no alias in map)
```

### After fix — 09_drivetrain_transmissions.md G50 record

```
# Catalog entry (after)
applicability:
  generation: [911-3.2-carrera, 964, 993]
  year_range: [1987, 1998]

matchDefects({ generation_id: '911-3.2-carrera', year: 1988, ... })
→ G50 record CORRECTLY fires (3.2 Carrera with G50 in 1987–1989)

matchDefects({ generation_id: 'g-series-2.7', year: 1976, ... })
→ G50 record correctly absent (g-series-2.7 predates G50; not in generation list)
```

### Before fix — 03_engine_aircooled_911.md chain tensioner

```
matchDefects({ generation_id: '911-sc', year: 1980, ... })
→ Chain tensioner record does NOT fire 
  ('911_G_body' in catalog does not match '911-sc' DB ID; no alias in DB_GENERATION_TO_CATALOG)
```

### After fix

```
matchDefects({ generation_id: '911-sc', year: 1980, ... })
→ Chain tensioner record CORRECTLY fires (911-sc is in expanded generation list)

matchDefects({ generation_id: 'g-series-2.7', year: 1976, ... })
→ Chain tensioner record CORRECTLY fires (g-series-2.7 is in list, year_range passes)

matchDefects({ generation_id: '911-f-body', year: 1971, ... })
→ Chain tensioner record CORRECTLY fires (911-f-body in list, year_range passes)
```

---

## Test results

```
VITEST v4.1.5

 ✓ tests/originality/matchDefects.test.ts (23 tests)
   ✓ matchDefects — trim_category exclude (6)
   ✓ matchDefects — engine_family exclude (regression) (2)
   ✓ matchDefects — combined year_range + trim_category exclude (2)
   ✓ matchDefects — BUG 1: body positive filter (3)
   ✓ matchDefects — BUG 1: body exclude (4)
   ✓ matchDefects — BUG 3/4: post-split generation key matching (6)

 Test Files  42 passed | 4 skipped (46)
      Tests  737 passed (737)
```

No regressions across the full suite.
