# Comp Engine Changes — 2026-05-14

## Fix 1a — Expanded ALWAYS_SEPARATE_MARKET

**File:** `lib/comp-engine-v2/hard-filter.ts`

**Change:** Expanded `ALWAYS_SEPARATE_MARKET` from `['coachbuilt', 'limited']` to include all
halo/performance/GT trim categories across all generations:

- Turbo variants: `turbo_base`, `turbo_s`, `turbo_x50`, `turbo_look_m491`
- GT programme: `gt2`, `gt2_rs`, `gt2_evo`, `gt3`, `gt3_rs`
- Anniversary/limited halo: `anniversary`, `r`, `st`, `sport_classic`, `speedster`
- RS variants: `rs_lightweight`, `rs_america`, `rs_touring`, `rs_clubsport`, `rs_club`
- Race-homologation: `supercup`, `cup`
- Boxster/718 halo: `boxster_spyder`, `boxster_gt4`, `boxster_gt4_rs`
- Cayman halo: `cayman_r`, `cayman_gt4`, `cayman_gt4_rs`

**Why:** The bilateral gate (`if comp.trim_category in ALWAYS_SEPARATE_MARKET, block from
non-matching subjects`) is belt-and-suspenders. When a listing's `trim_category` is null
in the DB (D6 fires), the trim_category equality check skips. ALWAYS_SEPARATE_MARKET is
the last line of defense. Expanding it to all halo categories ensures Turbo comps never
bleed into Carrera pools regardless of DB categorization coverage.

**Impact:** Turbo, GT3, GT2, RS, Cayman GT4, Boxster Spyder comps are now bilaterally
isolated. A Carrera subject with null trim_category no longer receives Turbo comps.

---

## Fix 1b — trim_category exclusions in defect catalog

**File:** `lib/originality.ts`

**Changes:**
1. Added `trim_category?: string | null` to `ListingContext` interface
2. Added `trim_category` check to `matchesExclude()` — if `exclude.trim_category` is set
   and `context.trim_category` is known, the exclusion fires when the context trim_category
   is in the exclude list
3. Linter also added `body_style?: string | null` to `ListingContext` and a `body` check
   in `matchesExclude()` (extending the fix to body-based excludes as well)

**File:** `app/(app)/analyze/[id]/page.tsx`

**Changes:**
- Added `trim_category: listing.trim_category ?? null` to `matchDefects()` call
- Linter also added `body_style: listing.body_style ?? null`

**Why:** `matchesExclude()` handled `generation`, `year_range`, and `engine_family` but
never checked `exclude.trim_category`. The DMF wear defect (`aircooled_964_993_dmf_wear`)
excludes Turbo variants via `trim_category: [964_Turbo, 993_Turbo, 993_Turbo_S, 993_GT2]`
— this exclusion was silently no-op. 964/993 Turbo listings were incorrectly flagged.

**Conservative behavior retained:** When `context.trim_category` is null (listing not yet
categorized in DB), the trim_category exclude criterion is skipped — the defect is
conservatively included (avoids false negatives). This is consistent with how
`engine_family` exclusions are handled.

---

## Fix 2 — Cascade pool selection

**New file:** `lib/comp-engine-v2/cascade.ts`

**What it does:**
- Defines `CARRERA_FAMILY` set of trim categories that can be pooled together at cascade
  levels 5-6 (all naturally-aspirated Carrera variants + GTS)
- `buildCascadePool(subject, hardFiltered, fullPool, level)` — builds the comp pool for
  a given cascade level
- `selectCascadePool(subject, hardFiltered, fullPool)` — tries levels 1-6 until ≥ 5 comps
  found; returns `{ pool, level }`
- `getCascadeCaveat(level, generationId)` — returns a human-readable transparency note
  for cascade levels > 2
- `isCarreraFamily(trimCategory)` — exported for tests
- `CASCADE_MIN_COMPS = 5` (configurable constant)

**Cascade level logic:**
| Level | Filter |
|---|---|
| 1 | Same trim + same year + same body + same transmission |
| 2 | Same trim + same body + adjacent years (±2) |
| 3 | Same trim + same body + full generation |
| 4 | Same trim + any body + full generation |
| 5 | Carrera family trims + full generation |
| 6 | All Carrera variants (broadest) |

Non-Carrera subjects (Turbo, GT3, GT2, RS, etc.) cap out at level 4 — they NEVER expand
to the Carrera family pool.

**File:** `lib/comp-engine-v2/types.ts`

**Changes:**
- Added `CascadeLevel = 1 | 2 | 3 | 4 | 5 | 6` type
- Added `cascade_level: CascadeLevel | null` and `cascade_caveat: string | null` to
  `V2CompsResult`

**File:** `lib/comp-engine-v2/engine.ts`

**Changes:**
- Imports `selectCascadePool` and `getCascadeCaveat` from `./cascade`
- After `applyHardFilters`, calls `selectCascadePool` instead of checking count < 3
- Passes `cascadeLevel` and `cascade_caveat` through all early-return paths
- Attaches `cascade_level` and `cascade_caveat` to the final result

**File:** `lib/comp-engine-v2/index.ts`

**Changes:** Exports `CascadeLevel` type

**File:** `lib/comp-engine-v2/logger.ts`

**Changes:** Logs `cascade_level` to `comp_engine_runs` table

**File:** `components/analyze/ComparableSalesCard.tsx`

**Changes:**
- Added `cascadeCaveat?: string | null` to Props
- Renders `<p>{cascadeCaveat}</p>` in the comp engine data path when caveat is set

**File:** `app/(app)/analyze/[id]/page.tsx`

**Changes:**
- Extracts `cascadeCaveat` from `v2CompsResult?.cascade_caveat`
- Passes `cascadeCaveat` prop to `ComparableSalesCard`

---

## Tests added

### `tests/lib/comp-engine-v2/cascade.test.ts` (NEW)
- `isCarreraFamily` — verifies Carrera/GTS pass, Turbo/GT/limited/coachbuilt fail
- `buildCascadePool` level 1-6 — each level tested individually
- `selectCascadePool` — cascade progression, Turbo isolation, GT2 isolation, null pool
- `getCascadeCaveat` — null for levels 1-2, string for 3-6, generation id in text

### `tests/lib/comp-engine-v2/hard-filter.test.ts` (MODIFIED)
- Updated existing D6 test: now uses non-ALWAYS_SEPARATE_MARKET categories (correct behavior)
- Added new D6 clarification test: ALWAYS_SEPARATE_MARKET blocks turbo_base even under D6
- Added 10 new tests for expanded ALWAYS_SEPARATE_MARKET: turbo_s, gt3, gt3_rs, gt2, gt2_rs,
  cayman_gt4, boxster_spyder, rs_touring, turbo-subject-isolation, null-trim-D6 explanation

### `tests/originality/matchDefects.test.ts` (NEW)
- `trim_category exclude` — DMF on 993 Carrera (flags), 993 Turbo (excluded), 993 Turbo S
  (excluded), 993 GT2 (excluded), 964 Turbo (excluded), null trim_category (conservatively flags)
- `engine_family exclude` — regression check: bore scoring still excluded for Mezger engine
- `combined year_range + trim_category exclude` — Variocam pad flagged on MY1999, not on MY2003+

### Pre-existing type errors NOT introduced by this session:
- `tests/components/analyze/components.test.tsx` — 3 errors about `source_publication`
  missing in test fixtures; pre-dates this session, left as-is
