# Comp Engine Step 2 — comp_results Table

**Status:** Complete  
**Date:** 2026-04-29

## What changed

Migrations applied to remote DB:
- `20260429050000_create_comp_results.sql` — table + indexes + RLS policies
- `20260429051000_grant_comp_results_service_role.sql` — GRANT ALL to service_role (required for admin client writes in Supabase)

## Table schema

```sql
comp_results (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id               UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tier                     TEXT NOT NULL CHECK (tier IN ('strict', 'wide', 'insufficient')),
  comp_count               INTEGER NOT NULL,
  fair_value_low_cents     BIGINT,
  fair_value_median_cents  BIGINT,
  fair_value_high_cents    BIGINT,
  most_recent_comp_sold_at TIMESTAMPTZ,
  oldest_comp_sold_at      TIMESTAMPTZ,
  comp_listing_ids         UUID[] NOT NULL DEFAULT '{}',
  computed_at              TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

## RLS
- anon + authenticated: SELECT only (public auction-derived data)
- service_role: ALL

## Verification

```
anon SELECT: OK - 0 rows (table empty, expected)
service_role INSERT: OK - FK constraint blocks fake listing_id (table writable)
```

## Note on service_role grant

In Supabase, newly-created tables need `GRANT ALL ON table TO service_role` for the PostgREST admin client to write. This was applied as a supplemental migration (20260429051000).

## Next step

Step 3: Comp engine core logic in lib/comp-engine/.
