# Schema Expansion Step 3 — Condition & Originality Signals

**Status:** Complete  
**Date:** 2026-04-29

## Migration

`supabase/migrations/20260429080000_add_condition_signals.sql`

## Columns added to `listings`

| Column | Type | CHECK values |
|--------|------|-------------|
| `condition_signal` | `TEXT` | concours / excellent / good / driver / project |
| `paint_signal` | `TEXT` | original / repaint_partial / repaint_full / unknown |
| `interior_signal` | `TEXT` | original / refurbished / replaced |
| `numbers_matching` | `BOOLEAN` | — |
| `mod_status` | `TEXT` | stock / light_reversible / heavy / unknown |

All nullable; populated by Phase 2 extraction work.

## Verification

`SELECT condition_signal, paint_signal, interior_signal, numbers_matching, mod_status FROM listings LIMIT 1;`

All five columns returned `null` — exist, no data yet.
