# Schema Expansion Step 1 — Auction Dynamics

**Status:** Complete  
**Date:** 2026-04-29

## Migration

`supabase/migrations/20260429060000_add_auction_dynamics.sql`

## Columns added to `listings`

| Column | Type | Notes |
|--------|------|-------|
| `bid_count` | `INTEGER` | Bids placed at auction close |
| `comment_count` | `INTEGER` | Page comment count (BaT signal) |
| `bid_to_buy_ratio` | `NUMERIC(10,4)` | high_bid / asking_price |
| `final_to_reserve_ratio` | `NUMERIC(10,4)` | final_price / reserve estimate |

## Skipped (already exist)

- `listed_at` — added in `20260429040000`
- `days_on_market` — added in `20260429040000`
- `sold_at` — reuse `auction_ends_at` (added in `20260428040000`)

## Verification

`SELECT bid_count, comment_count, bid_to_buy_ratio, final_to_reserve_ratio FROM listings LIMIT 1;`

Returned one row with all four columns `null` — columns exist, no data yet.
