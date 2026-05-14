# S11 Watch-For Catalog — Change Log

**Session:** 2026-05-14  
**Branch:** main  
**Tests:** 737/737 pass (no regressions)

---

## BUG 1 — Body filter now enforced

### Files changed
- `lib/defect-catalog/types.ts` — Added `body?: string[]` to `DefectExclude` and `DefectApplicability`
- `lib/defect-catalog/parser.ts` — Added `body: toStrings(...)` to `normalizeExclude()` and `normalizeRecord()`
- `lib/originality.ts` — Added `body_style?: string | null` to `ListingContext`; added positive body filter to `matchDefects()`; added body exclude handler to `matchesExclude()`; updated `relevance_score` to count body applicability
- `app/(app)/analyze/[id]/page.tsx` — Added `body_style: listing.body_style ?? null` to `matchDefects()` call

### Behavior change
- A catalog entry with `applicability.body: [Targa]` now fires only on listings where `body_style === 'Targa'`
- An exclude block with `body: [Coupe]` now suppresses the record when `body_style === 'Coupe'`
- Conservative: when `body_style` is null, body filter is skipped (include, not exclude)

---

## BUG 2 — trim_category exclude now fires

### Files changed
- `lib/originality.ts` — Added positive `trim_category` filter to `matchDefects()` (skip record if `applicability.trim_category` present and listing's `trim_category` not in list); `matchesExclude()` trim_category handler was already present from a prior session

### Notes
- The `ListingContext.trim_category` field and the `matchesExclude()` trim_category block were already implemented in a prior session. The missing piece was the positive applicability filter in `matchDefects()` — entries with `applicability.trim_category` were not filtering positively, only the exclude path was checked.
- The analyze page was already passing `trim_category: listing.trim_category ?? null`.
- No catalog changes needed — YAML `trim_category` fields were already correct.

---

## BUG 3 — Salt-belt and regional records now visible to the parser

### Files changed
- `docs/reference/defects/25_region_specific.md`

### Change detail
Each of the three records (REGION_25_001, REGION_25_002, REGION_25_003) had two broken YAML blocks:
1. A `record_id:` / `title:` block (wrong field names, no `applicability`) — parser skips it
2. A separate `applicability:` block (no `id`/`flag_title`) — parser skips it

**Fix:** Replaced each `record_id:` block with a complete valid block containing `id`, `flag_title`, `severity`, `description`, `applicability` (with correct generation keys, numeric `year_range`), and `buyer_questions`. The original verbose `applicability:` blocks are retained as documentation but are no longer needed for parsing.

**Also fixed as part of BUG 3 restructuring (BUG 4 overlap):**
- REGION_25_001 and REGION_25_003 generation lists updated from stale keys to correct DB keys (see BUG 4)

### Records now visible
| Record | Severity | Generations |
|---|---|---|
| REGION_25_001 | high | 911-f-body, g-series-2.7, 911-sc, 911-3.2-carrera, 930, 964, 993 |
| REGION_25_002 | moderate | 996.1, 996.2, 997.x, 991.x, 992.x, 987.x, 981, 718 |
| REGION_25_003 | moderate | 911-f-body through 911-3.2-carrera, 930, 964, 993, 996.x–992.x, 987.x, 981, 718 |

---

## BUG 4 — Stale 911_G_body / 911_F_body generation keys replaced

### Files changed
- `docs/reference/defects/03_engine_aircooled_911.md` — 4 applicability blocks
- `docs/reference/defects/09_drivetrain_transmissions.md` — 1 applicability block (G50 record)
- `docs/reference/defects/23_pre996_aircooled_nonengine.md` — 1 applicability block (compact) + 1 verbose block
- `docs/reference/defects/25_region_specific.md` — handled as part of BUG 3

### Key substitutions

| Old key | New key(s) | Rationale |
|---|---|---|
| `911_G_body` | `g-series-2.7`, `911-sc`, `911-3.2-carrera` | G-body split into 3 DB generation IDs per migration 20260428060000 |
| `911_F_body` | `911-f-body` | F-body renamed per migration 20260510010000 |

**G50 exception:** `09_drivetrain_transmissions.md` G50 record has `year_range: [1987, 1998]`. Only `911-3.2-carrera` (1984–1989) overlaps; `g-series-2.7` (1974–1977) and `911-sc` (1978–1983) predate the G50. Used `911-3.2-carrera` only for precision.

### Unresolved follow-up
`docs/reference/defects/19_drivetrain_v2.md` also uses `record_id:`/`title:` schema (BUG 3 equivalent) and references `911_G_body`/`911_F_body` in its broken applicability blocks. These records are entirely invisible to the parser. Fixing them requires the same BUG 3 restructuring applied to file 25, and is out of scope for this session. Flagged for a follow-up session.

---

## Tests added

`tests/originality/matchDefects.test.ts` — 16 new test cases added (23 total, all pass):
- BUG 1: body positive filter — 3 cases (Targa, Coupe, null body_style)
- BUG 1: body exclude — 4 cases (Cabriolet, Coupe, Targa, null body_style)
- BUG 3/4: generation key matching — 6 cases (g-series-2.7, 911-sc, 911-f-body, 964 negative, 911-3.2-carrera outside year_range, 930 outside year_range)
- Existing 7 BUG 2 tests retained and passing

---

## No changes to

- `lib/era-content/` (per task constraint — other sessions own this)
- `lib/comp-engine*` (per task constraint — Session 10)
- Any other catalog files not listed above
