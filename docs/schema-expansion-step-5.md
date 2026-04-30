# Schema Expansion Step 5 — Factory Options

**Status:** Complete  
**Date:** 2026-04-29

## Migration

`supabase/migrations/20260429100000_add_factory_options.sql`

## Columns added to `listings`

| Column | Type | Notes |
|--------|------|-------|
| `factory_options` | `TEXT[]` | Normalized option codes; marque-agnostic |
| `has_x50_powerkit` | `BOOLEAN` | Porsche M637 / X50 GT powerkit (convenience flag) |
| `has_aero_kit` | `BOOLEAN` | Porsche factory aero package (convenience flag) |
| `has_sport_seats` | `BOOLEAN` | Porsche factory sport seats (convenience flag) |
| `is_paint_to_sample` | `BOOLEAN` | Paint-to-Sample special color (convenience flag) |

## Architecture note

`factory_options TEXT[]` is marque-agnostic. The four BOOLEAN convenience flags are Porsche-specific denormalizations stored alongside the generic array per the core architectural rule. Adding Ferrari convenience flags later requires only new columns, no migration on the shared array.

## Verification

All five columns returned `null` — exist, no data yet.
