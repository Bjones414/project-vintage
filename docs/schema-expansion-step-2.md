# Schema Expansion Step 2 — Vehicle Attributes

**Status:** Complete  
**Date:** 2026-04-29

## Migration

`supabase/migrations/20260429070000_add_vehicle_attributes.sql`

## Columns added to `listings`

| Column | Type | Notes |
|--------|------|-------|
| `trim_category` | `TEXT` | Normalized trim grouping (distinct from raw `trim`); used by comp engine |
| `country_of_sale` | `TEXT` | ISO 3166-1 alpha-2 sale country; affects comp weighting |

## Verification

`SELECT trim_category, country_of_sale FROM listings LIMIT 1;`

Returned both columns as `null` — columns exist, no data yet.
