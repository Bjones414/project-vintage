# Schema Expansion — Overnight Build Summary

**Date:** 2026-04-29  
**Session:** Steps 1–8 of the comp engine V2 + market signals schema expansion  
**Working tree:** Clean  
**Pushed:** No — all commits are local on `main`

---

## Commits (this session)

| Commit | Description |
|--------|-------------|
| `3c1871e` | feat: schema expansion step 1 — auction dynamics on listings |
| `d26ea30` | feat: schema expansion step 2 — vehicle attributes on listings |
| `38226fd` | feat: schema expansion step 3 — condition & originality signals on listings |
| `bcd7549` | feat: schema expansion step 4 — documentation & provenance signals on listings |
| `5d13ebb` | feat: schema expansion step 5 — factory options on listings |
| `d5d00cd` | feat: schema expansion step 6 — create market_snapshots table |
| `61402b4` | docs: schema expansion step 7 — document all new columns in SCHEMA.md |
| `a1e7b9f` | test: schema expansion step 8 — migration smoke tests |

---

## Column inventory

### New columns on `listings` (all nullable)

| Column | Type | Step | Populated by |
|--------|------|------|-------------|
| `bid_count` | `INTEGER` | 1 | Scrapers |
| `comment_count` | `INTEGER` | 1 | Scrapers (BaT) |
| `bid_to_buy_ratio` | `NUMERIC(10,4)` | 1 | Scrapers / enrichment |
| `final_to_reserve_ratio` | `NUMERIC(10,4)` | 1 | Enrichment |
| `trim_category` | `TEXT` | 2 | Comp engine / enrichment |
| `country_of_sale` | `TEXT` | 2 | Scrapers |
| `condition_signal` | `TEXT` (CHECK) | 3 | Phase 2 extraction |
| `paint_signal` | `TEXT` (CHECK) | 3 | Phase 2 extraction |
| `interior_signal` | `TEXT` (CHECK) | 3 | Phase 2 extraction |
| `numbers_matching` | `BOOLEAN` | 3 | Phase 2 extraction |
| `mod_status` | `TEXT` (CHECK) | 3 | Phase 2 extraction |
| `has_porsche_coa` | `BOOLEAN` | 4 | Phase 2 extraction |
| `has_kardex` | `BOOLEAN` | 4 | Phase 2 extraction |
| `has_service_records` | `BOOLEAN` | 4 | Phase 2 extraction |
| `has_window_sticker` | `BOOLEAN` | 4 | Phase 2 extraction |
| `has_owners_manual` | `BOOLEAN` | 4 | Phase 2 extraction |
| `owner_count` | `INTEGER` | 4 | Phase 2 extraction |
| `documentation_score` | `INTEGER` | 4 | Future scoring job |
| `factory_options` | `TEXT[]` | 5 | Phase 2 extraction |
| `has_x50_powerkit` | `BOOLEAN` | 5 | Phase 2 extraction |
| `has_aero_kit` | `BOOLEAN` | 5 | Phase 2 extraction |
| `has_sport_seats` | `BOOLEAN` | 5 | Phase 2 extraction |
| `is_paint_to_sample` | `BOOLEAN` | 5 | Phase 2 extraction |

**listings column count:** 51 (before) → 74 (after)

### New table: `market_snapshots`

9 columns (id, generation_id, trim_category, snapshot_date, active_listing_count, sold_count_30d, median_price_30d, median_dom_30d, sell_through_rate_30d). RLS enabled. Index on (generation_id, trim_category, snapshot_date DESC).

---

## Test results

| Metric | Before | After |
|--------|--------|-------|
| Test files | 25 passed, 4 skipped | 26 passed, 4 skipped |
| Tests passing | 308 | 346 |
| New tests | — | +38 (migration smoke) |
| Regressions | — | 0 |

---

## Migration verification

Each migration was pushed via `npx supabase db push` and verified with a SELECT against the linked remote database before committing. All verifications returned the expected columns as null (no data yet, no errors).

---

## What this enables (future sessions)

- **Comp engine V2:** `trim_category` and `condition_signal` enable trim-filtered and condition-weighted similarity scoring
- **Similarity scoring:** `numbers_matching`, `mod_status`, `paint_signal` support the originality dimension of comp matching
- **Documentation premium:** `documentation_score` (0–6) allows documentation quality to influence fair value adjustment
- **Factory options weighting:** `factory_options TEXT[]` + convenience BOOLEANs enable option-code-aware comp scoring
- **Market trends UI:** `market_snapshots` provides the aggregation surface for rolling 30-day trend charts
- **International comps:** `country_of_sale` enables market-specific comp weighting (US vs. UK vs. DE price differentials)

---

## Not done (by design)

- No comp engine logic modified
- No UI components modified
- No extraction logic modified
- No data populated (all new columns are null)
- Not pushed to remote

---

## Files added/changed

**DB migrations:**
- `supabase/migrations/20260429060000_add_auction_dynamics.sql`
- `supabase/migrations/20260429070000_add_vehicle_attributes.sql`
- `supabase/migrations/20260429080000_add_condition_signals.sql`
- `supabase/migrations/20260429090000_add_documentation_signals.sql`
- `supabase/migrations/20260429100000_add_factory_options.sql`
- `supabase/migrations/20260429110000_create_market_snapshots.sql`

**Documentation:**
- `SCHEMA.md` (updated)
- `docs/schema-expansion-step-1.md` through `docs/schema-expansion-step-8.md`
- `docs/schema-expansion-overnight-summary.md` (this file)

**Tests:**
- `tests/schema/migration-smoke.test.ts`
