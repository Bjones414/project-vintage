# Comp Engine Step 1 — Market-Signal Columns

**Status:** Complete  
**Date:** 2026-04-29

## What changed

Migration `20260429040000_add_market_signal_columns.sql` applied to remote DB.

### Reused existing columns (no migration needed)
- `auction_ends_at TIMESTAMPTZ` — serves as `sold_at` in comp engine logic
- `decoded_body_class TEXT` — serves as `body_class` for filtering

### New columns added to `listings`
- `listed_at TIMESTAMPTZ` — when auction opened; populated by scraper
- `days_on_market INTEGER` — computed in scraper: (auction_ends_at - listed_at) in days
- Index: `listings_listed_at_idx` on `listed_at`

## Verification

```sql
SELECT listed_at, days_on_market, auction_ends_at, decoded_body_class 
FROM listings LIMIT 1;
-- Returns: columns present, values null (no data yet — expected)
```

## Next step

Step 2: Create `comp_results` table.
