# Comp Engine Investigation — 2026-05-14

## Session scope

Two bugs to fix:
1. Turbo listings being comped against regular Carreras (launch-killing valuation error)
2. `trim_category` exclusions in defect-catalog `exclude` blocks never firing (DMF wear incorrectly flagged for 964/993 Turbo)

---

## Bug 1 — Turbo / Carrera mixing in comp engine

### Where the engine lives

Two comp engines exist in the codebase:

| Engine | Path | Used by |
|---|---|---|
| V1 (simple) | `lib/comp-engine/` | Legacy; not currently called from analyze page |
| V2 (production) | `lib/comp-engine-v2/` | `app/(app)/analyze/[id]/page.tsx` via `computeCompsV2` |

V2 is production. All fixes go there.

### Root cause

**`lib/comp-engine-v2/hard-filter.ts`, line 26:**

```typescript
const ALWAYS_SEPARATE_MARKET = new Set(['coachbuilt', 'limited'])
```

This set is used bilaterally — any comp whose `trim_category` is in this set is blocked from reaching a subject outside the same category. But it only contains `coachbuilt` and `limited`. Turbo, GT2, GT3, anniversary editions, RS variants, Cayman GT4, Boxster Spyder — none of these are in the set.

**The bilateral gate in `applyHardFilters` (line 72):**
```typescript
if (comp.trim_category && ALWAYS_SEPARATE_MARKET.has(comp.trim_category)) {
  if (comp.trim_category !== subject.trim_category) return false
}
```

This correctly blocks ALWAYS_SEPARATE_MARKET comps from reaching non-matching subjects — but only for `coachbuilt` and `limited`.

**The D6 rule (subject has null trim_category):**
```typescript
if (subject.trim_category !== null) {
  if (comp.trim_category !== subject.trim_category) return false
}
```

When subject's `trim_category` is null in the database (because `deriveTrimCategory` hasn't been run on the listing, or the trim string couldn't be matched), this check doesn't fire. All comps pass through, including Turbo and GT3 comps.

**Primary attack vector:** Subject (e.g., 2002 996.2 Carrera) has `trim_category = null` in the DB. Hard filter skips trim_category check (D6). Pool includes all sold listings in the 996 generation — including Turbo listings. Result: Turbo prices inflate the fair value range for the Carrera subject.

The bilateral gate in the current code would also NOT protect against this because `ALWAYS_SEPARATE_MARKET` doesn't include `turbo_base` / `turbo_s` — so Turbo comps with proper `trim_category` values also bleed through when subject has null trim_category.

**Secondary attack vector (when both have proper trim_categories):** The existing trim_category hard filter would correctly block Turbo comps from Carrera subjects. But since ALWAYS_SEPARATE_MARKET doesn't include Turbo categories, a Turbo subject with null trim_category would receive Carrera comps. Fix: expand ALWAYS_SEPARATE_MARKET to include all halo/performance categories.

### What ALWAYS_SEPARATE_MARKET should contain

Categories that must NEVER comp with anything outside their own category:

| Category | Reason |
|---|---|
| `coachbuilt` | Singer/RUF — already in set |
| `limited` | Sport Classic/R/Speedster — already in set |
| `turbo_base` | Turbo; totally different market from Carrera |
| `turbo_s` | Turbo S; above Turbo market |
| `gt2` | GT2 / 993 GT2 — own market |
| `gt2_rs` | GT2 RS — own market |
| `gt3` | GT3 — own market |
| `gt3_rs` | GT3 RS — own market |
| `sport_classic` | Sport Classic — limited, own market |
| `speedster` | Speedster — limited, own market |
| `r` | 991/997 R — limited production, own market |
| `rs_lightweight` | 964 RS / Leichtbau — own market |
| `rs_touring` | 993 RS — own market |
| `rs_clubsport` | 993 RS Clubsport — own market |
| `rs_america` | 964 RS America — own market |
| `turbo_x50` | 993 Turbo X50 — own market |
| `gt2_evo` | 993 GT2 Evo — own market |
| `supercup` | 993 Supercup — own market |
| `cup` | 993 Cup — own market |
| `turbo_look_m491` | 993 Turbo Look — own market |
| `cayman_r` | Cayman R — own market |
| `cayman_gt4` | Cayman GT4 — never comp with base Cayman |
| `cayman_gt4_rs` | Cayman GT4 RS — own market |
| `boxster_spyder` | Boxster Spyder — own market |
| `boxster_gt4` | 718 Boxster GT4 — own market |
| `boxster_gt4_rs` | 718 Boxster GT4 RS — own market |
| `anniversary` | Anniversary editions — own market |

### GTS decision

**Question:** Should Carrera GTS be its own market or comp with Carrera S?

**Finding:** GTS is priced 15–25% above Carrera S and has meaningfully different buyer profiles (sport-focused, higher specification, PDK-less 997.1 GTS particularly desirable). However, GTS is NOT as isolated from the broader Carrera market as Turbo or GT3 — GTS buyer and Carrera S buyer overlap considerably.

**Decision: GTS stays as a soft-separate category but is included in the Carrera family for cascade purposes (levels e-f).** GTS should NOT be in ALWAYS_SEPARATE_MARKET. When a GTS listing is comped:
- Levels 1-4: only GTS comps (existing hard filter behavior)
- Levels 5-6 (cascade fallback): Carrera family including GTS is pooled

**Rationale:** GTS has enough market depth (especially 997 GTS) that it shouldn't fall back to Carrera S for primary comping. But in sparse markets (991.1 GTS Cabriolet manual), falling back to the broader Carrera family is better than `insufficient`.

---

## Bug 2 — trim_category exclusions in defect catalog never fire

### Affected defect

`aircooled_964_993_dmf_wear` in `docs/reference/defects/03_engine_aircooled_911.md`:

```yaml
id: aircooled_964_993_dmf_wear
applicability:
  generation: [964, 993]
  excludes:
    description: "911 Turbo (930, 964 Turbo, 993 Turbo) uses different flywheel architecture..."
    trim_category: [911_Turbo_3_3, 964_Turbo, 993_Turbo, 993_Turbo_S, 993_GT2]
```

The intent is clear: exclude this defect from Turbo listings.

### Root cause — two-part failure

**Part 1: `ListingContext` in `lib/originality.ts` has no `trim_category` field.**

```typescript
export interface ListingContext {
  generation_id: string | null
  engine_family: string | null
  year: number | null
  mileage: number | null
  trim?: string | null
}
```

`trim_category` is not in the context. Even if the exclude logic tried to check it, there's no value to check against.

**Part 2: `matchesExclude` in `lib/originality.ts` never handles `exclude.trim_category`.**

```typescript
function matchesExclude(exclude: DefectExclude, context: ListingContext): boolean {
  let hasActionableCriteria = false

  if (exclude.generation && exclude.generation.length > 0) { ... }
  if (exclude.year_range && exclude.year_range.length === 2) { ... }
  if (exclude.engine_family && exclude.engine_family.length > 0) { ... }

  // ← trim_category is never checked here
  return hasActionableCriteria
}
```

The `DefectExclude` type defines `trim_category?: string[]` and the YAML parser correctly loads it (confirmed in `normalizeExclude()`), but `matchesExclude` simply never reads it.

**Result:** A 964 Turbo listing hits generation match `[964, 993]`, passes the non-existent trim_category exclude, and incorrectly receives the DMF wear finding. The same applies to 993 Turbo, 993 Turbo S, and 993 GT2.

### Other defects with trim_category in excludes

Searching `docs/reference/defects/` reveals the same trim_category exclude pattern is also used in:
- `01_engine_m96_m97.md` — bore scoring exemptions for specific Boxster variants
- Other files where engine/trim specificity requires fine-grained exclusion

The fix affects all of these correctly.

### Call sites for matchDefects

Only one call site: `app/(app)/analyze/[id]/page.tsx`:

```typescript
const catalogItems = matchDefects({
  generation_id: listing.generation_id ?? null,
  engine_family: generation?.engine_family ?? null,
  year: listing.year ?? null,
  mileage: listing.mileage ?? null,
  trim: listing.trim ?? null,
})
```

`listing.trim_category` is available on the listing row (it's a DB column). The call site needs to pass it.

---

## Cascade behavior audit

### Current v2 cascade behavior

None. The v2 engine has two outcomes:
1. Post-hard-filter count ≥ 3: runs full pipeline on the hard-filtered pool
2. Post-hard-filter count < 3: returns `insufficient_comps`

There is no progressive fallback. A 991.1 Carrera GTS Cabriolet manual with only 2 comps returns insufficient, even though 991.1 Carrera GTS Cabriolet PDK comps might exist that would be informative.

### Cascade design

**Cascade levels (in order, use first with ≥ N comps):**

| Level | Filter | Note |
|---|---|---|
| 1 | Same trim + same year + same body + same transmission | Most precise |
| 2 | Same trim + same body + adjacent years (±2) | Widen time only |
| 3 | Same trim + same body + full generation | Current hard filter behavior |
| 4 | Same trim + any body + full generation | Relax body style |
| 5 | Carrera family trims + full generation | Widen trim (Carrera only) |
| 6 | All Carrera variants in generation | Broadest; display caveat |

**N (minimum comps threshold):** 5 (configurable; reuses existing STRICT_MIN_COUNT spirit)

**Carrera family definition:**  
Trims that can be pooled at levels 5-6. Derived from `deriveTrimCategory` output values. Includes all naturally-aspirated Carrera variants and GTS; excludes Turbo, GT2, GT3, RS, limited, coachbuilt, Targa (Targa is a body style not a trim in modern generations).

For non-Carrera trims (Turbo, GT3, GT2, RS, Speedster, etc.): cascade maxes out at level 4. These trims must never fall back to Carrera. If there aren't ≥5 comps at level 4, the engine still tries level 4 then returns insufficient (not a Carrera fallback).

**Caveat display:** When cascade_level > 2, the analyze page should display a transparency note. Level 3+ should show a caveat. Level 5-6 specifically indicate widening to Carrera family.

---

## Files to change

| File | Change |
|---|---|
| `lib/comp-engine-v2/hard-filter.ts` | Expand ALWAYS_SEPARATE_MARKET |
| `lib/comp-engine-v2/cascade.ts` | NEW: cascade pool builder |
| `lib/comp-engine-v2/types.ts` | Add cascade_level, cascade_caveat to V2CompsResult |
| `lib/comp-engine-v2/engine.ts` | Integrate cascade; attach cascade_level/caveat to result |
| `lib/originality.ts` | Add trim_category to ListingContext; fix matchesExclude |
| `app/(app)/analyze/[id]/page.tsx` | Pass trim_category to matchDefects; pass cascade_caveat to ComparableSalesCard |
| `components/analyze/ComparableSalesCard.tsx` | Accept and display cascade_caveat prop |

---

## Investigation conclusion

**Bug 1 root cause:** ALWAYS_SEPARATE_MARKET in hard-filter.ts contains only `coachbuilt` and `limited`. Combined with D6 (subject trim_category null in DB), Turbo listings reach Carrera comp pools. Fix: expand ALWAYS_SEPARATE_MARKET to all halo/performance categories + add cascade with Carrera-family grouping.

**Bug 2 root cause:** `matchesExclude()` in `lib/originality.ts` has no `trim_category` branch. `ListingContext` doesn't carry `trim_category`. Both must be fixed simultaneously. Fix: add `trim_category` to `ListingContext`; add `trim_category` branch to `matchesExclude()`; pass `listing.trim_category` at call site.
