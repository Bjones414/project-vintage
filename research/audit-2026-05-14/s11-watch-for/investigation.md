# S11 Watch-For Catalog — Bug Investigation

**Session:** 2026-05-14  
**Scope:** 4 structural bugs in the watch-for catalog engine

---

## BUG 1 — Body filter silently ignored

### Where it lives
- **Type definitions:** `lib/defect-catalog/types.ts` — `DefectApplicability` and `DefectExclude` interfaces have no `body` field (lines 12-18 and 4-10).
- **Engine:** `lib/originality.ts` — `matchDefects()` (lines 123-181) and `matchesExclude()` (lines 80-113) neither declare nor evaluate `body` against listing body style.
- **Parser:** `lib/defect-catalog/parser.ts` — `normalizeExclude()` (lines 25-32) doesn't include `body` in its normalization pass.
- **Listing context:** `ListingContext` interface (lines 42-48) has no `body_style` field; the analyze page call (lines 110-117) also doesn't pass it.

### Root cause
`body: [Targa]` in catalog YAML entries is parsed by js-yaml and placed on the deserialized object, but TypeScript ignores unknown fields — it never flows into `DefectApplicability.body` because that field doesn't exist on the type. Neither the positive applicability filter in `matchDefects()` nor the exclude filter in `matchesExclude()` check it. Effectively the field is a no-op.

### Affected catalog entries
- `16_body_roof_mechanisms.md` — `BODY_ROOF_16_001`: `applicability.body: [Targa]` fires on ALL 993/996/997 listings, not just Targa
- `07_body_cabriolet.md` — three records with `body:` in both applicability and excludes
- `09_drivetrain_transmissions.md` — multiple records with `body:` on applicability
- `08_interior_sticky_buttons.md` — `body:` on applicability

### Proposed fix
1. Add `body?: string[]` to `DefectApplicability` and `DefectExclude` in `types.ts`
2. Add `body_style?: string | null` to `ListingContext`
3. Add body positive filter to `matchDefects()`: skip record if `applicability.body` and `context.body_style` both present and body_style not in list
4. Add body exclude to `matchesExclude()`: trigger exclusion if `exclude.body` lists the listing's body_style
5. Update `normalizeExclude()` in parser to normalize `body` field
6. Update analyze page to pass `body_style: listing.body_style ?? null`

### Tradeoffs
- Conservative approach: when `context.body_style` is null, skip the body filter (include the record). This avoids false negatives on listings with unknown body.
- No catalog entry changes needed — the YAML `body:` fields are already correct.

---

## BUG 2 — trim_category exclusions in `exclude` blocks never execute

### Where it lives
- **Engine:** `lib/originality.ts` — `matchesExclude()` (lines 80-113) checks `exclude.generation`, `exclude.year_range`, `exclude.engine_family` but has NO handler for `exclude.trim_category`.
- Also: `matchDefects()` (lines 123-181) checks positive `applicability.engine_family` but has NO positive filter for `applicability.trim_category` (though relevance_score does count it at line 162).
- **ListingContext** (lines 42-48): has no `trim_category` field; analyze page at line 116 already passes `trim_category: listing.trim_category ?? null` but TypeScript ignores the extra field.

### Root cause
`matchesExclude()` was implemented with three criteria (generation, year_range, engine_family) but `trim_category` was added to `DefectExclude` without a corresponding evaluation block. The analyze page was updated to pass `trim_category` but `ListingContext` was never updated to receive it.

### Key DMF entry
`docs/reference/defects/03_engine_aircooled_911.md`, id `aircooled_964_993_dmf_wear` (lines 533-628):
```yaml
applicability:
  generation: [964, 993]
  trim_category: [964_C2, 964_C4, 964_RS, 993_C2, 993_C4, 993_C4S, 993_RS, 993_Targa]
  excludes:
    description: "..."
    trim_category: [911_Turbo_3_3, 964_Turbo, 993_Turbo, 993_Turbo_S, 993_GT2]
```
The `excludes.trim_category` never fires → 993 Turbo listings see the DMF warning incorrectly.

Also: the positive `applicability.trim_category` is also not evaluated, so even without the exclude, the Turbo would be caught if the trim_category filter ran (Turbo is NOT in the positive list).

### Proposed fix
1. Add `trim_category?: string | null` to `ListingContext`
2. Add `trim_category` positive filter to `matchDefects()`: skip record if `applicability.trim_category` and `context.trim_category` both present and trim_category not in list (conservative: include when unknown)
3. Add `trim_category` exclude to `matchesExclude()`: trigger exclusion if `exclude.trim_category` lists the listing's trim_category
4. No catalog changes needed — YAML is correct

### Overlap with Session 10
Session 10 investigation file not found at `/research/audit-2026-05-14/s10-comp-engine/investigation.md`. Running independently. The trim_category derivation for comp engine is a separate concern; this fix consumes the already-present `listing.trim_category` value from the DB.

---

## BUG 3 — Salt-belt corrosion HIGH severity entirely invisible

### Where it lives
- **Catalog file:** `docs/reference/defects/25_region_specific.md`
- **Parser:** `lib/defect-catalog/parser.ts` lines 77-91 — validation requires `id`, `flag_title`, and `applicability` in the SAME YAML block.

### Root cause
REGION_25_001 (and 25_002, 25_003) use non-standard YAML field names and a SPLIT block structure:

**Block 1** (each record):
```yaml
record_id: REGION_25_001   # wrong: parser expects `id`
title: "..."               # wrong: parser expects `flag_title`
severity: high
...
```

**Block 2** (separate block):
```yaml
applicability:
  generations:             # wrong: parser expects `generation`
    - "911_G_body"
  year_range: "1963–1998"  # wrong: must be [low, high] number array
```

The parser validates: `typeof parsed.id === 'string' && typeof parsed.flag_title === 'string' && parsed.applicability`. Block 1 has no `id` or `flag_title` (only `record_id`/`title`) and no `applicability` → fails. Block 2 has no `id` or `flag_title` → fails. Both silently skipped. **All three records in file 25 are invisible to the engine.**

### Proposed fix
Restructure each REGION record into a single compact YAML block following the standard schema:
- `id` instead of `record_id`
- `flag_title` instead of `title`
- Merge `applicability` into the same block
- Use `generation:` (singular, array)
- Use `year_range: [low, high]` (numeric)
- Use structured `excludes:` objects or remove prose-only excludes
- This is less invasive than updating the parser to handle both formats (parser is correct; entries are wrong)

Secondary issues in the restructured blocks:
- `"911_G_body"` → fan out to `["g-series-2.7", "911-sc", "911-3.2-carrera"]` (BUG 4 overlap)
- `"911_F_body"` → `"911-f-body"` (BUG 4 overlap)

---

## BUG 4 — 911_G_body generation key stale after G-series split

### Where it lives
- **Migration:** `supabase/migrations/20260428060000_refine_g_series_add_930.sql` — split `'911-g'` into `'g-series-2.7'` (1974-1977), `'911-sc'` (1978-1983), `'911-3.2-carrera'` (1984-1989).
- **Migration:** `supabase/migrations/20260510010000_rename_early_911_generation_ids.sql` — renamed `'911-f'` → `'911-f-body'`.
- **Catalog files** still reference `911_G_body` and `911_F_body`.

### Root cause
Catalog YAML entries were never updated after the G-series DB split. The old monolithic key `'911-g'` is gone from the DB; its replacement keys use lowercase-hyphen format. Catalog entries use `911_G_body` (mixed case, underscore) which does not match any DB generation_id. `DB_GENERATION_TO_CATALOG` in `lib/originality.ts` has no entry for `'911-g-body'` or `'911_G_body'`, so the fallback `[dbId]` is used and `generationMatchesList()` returns false — all G-body-era watch-for items fail to fire.

There is NO `'911-g-body'` row in the DB (only in `generation-display.ts` as a display override). Current valid DB keys are: `'g-series-2.7'`, `'911-sc'`, `'911-3.2-carrera'`, `'930'`.

### Files and occurrences
- `docs/reference/defects/03_engine_aircooled_911.md`:
  - Line 48: `generation: [911_F_body, 911_G_body, 930]` → replace F_body and fan-out G_body
  - Line 172: `generation: [911_F_body, 911_G_body, 930]` → same
  - Line 294: `generation: [911_G_body, 964, 993, 930]` → fan-out G_body
  - Line 420: `generation: [911_F_body, 911_G_body, 964, 993, 930]` → replace both
- `docs/reference/defects/09_drivetrain_transmissions.md`:
  - Line 47: `generation: [911_G_body, 964, 993]` — G50 applies year_range [1987,1998], only `911-3.2-carrera` is relevant from the split
- `docs/reference/defects/23_pre996_aircooled_nonengine.md`:
  - Line 189: `"911_G_body"` in compact block — fix to fan-out (note: compact block is the one the parser uses)
  - Line 221: `"911_G_body"` in verbose block — also fix (belt-and-suspenders)
- `docs/reference/defects/25_region_specific.md`:
  - `"911_G_body"` and `"911_F_body"` in applicability blocks — fixed as part of BUG 3 restructuring

### Fan-out strategy
`911_G_body` → `[g-series-2.7, 911-sc, 911-3.2-carrera]` for entries spanning the full G-body era.
`911_G_body` → `[911-3.2-carrera]` only for G50 entries (year_range [1987,1998]) — though including all three plus year_range filtering also works.
`911_F_body` → `[911-f-body]` (direct rename).

### No `DB_GENERATION_TO_CATALOG` changes needed
Air-cooled generation IDs in the DB match catalog names 1:1 (no alias aliasing needed). The existing fallback `[dbId]` works correctly once catalog entries use the correct DB keys.

---

## Cross-cutting observations
- BUG 3 and BUG 4 overlap in `25_region_specific.md`: fixing BUG 3 (schema structure) requires updating the YAML blocks which also need BUG 4 key fixes.
- The DMF entry (`aircooled_964_993_dmf_wear`) generation list `[964, 993]` is already correct — no BUG 4 touch needed there. Only its exclude block is broken (BUG 2).
- `23_pre996_aircooled_nonengine.md` has DUAL YAML blocks per record (compact + verbose). The compact blocks are what the parser picks up. For BUG 4, fixing only the compact blocks is sufficient for engine behavior; the verbose blocks should also be fixed for consistency.
