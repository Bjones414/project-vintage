# Schema Expansion Step 6 — Create market_snapshots

**Status:** Complete  
**Date:** 2026-04-29

## Migration

`supabase/migrations/20260429110000_create_market_snapshots.sql`

## New table: `market_snapshots`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` PK | gen_random_uuid() |
| `generation_id` | `TEXT` | Nullable; matches porsche_generations |
| `trim_category` | `TEXT` | Nullable; matches listings.trim_category |
| `snapshot_date` | `DATE NOT NULL` | Date of aggregation |
| `active_listing_count` | `INTEGER` | Unsold listings as of snapshot_date |
| `sold_count_30d` | `INTEGER` | Sold in 30-day window |
| `median_price_30d` | `BIGINT` | Cents |
| `median_dom_30d` | `INTEGER` | Days on market median |
| `sell_through_rate_30d` | `NUMERIC(5,4)` | 0.0000–1.0000; CHECK constraint |

## Index

`market_snapshots_gen_trim_date_idx` on `(generation_id, trim_category, snapshot_date DESC)`

## RLS

- Enabled
- `market_snapshots_public_read` policy: anon + authenticated SELECT
- `GRANT SELECT TO anon, authenticated`
- `GRANT ALL TO service_role`

## Verification

`SELECT ... FROM market_snapshots LIMIT 1;` returned 0 rows — table exists, schema correct, no data yet.
