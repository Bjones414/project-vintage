# Schema Expansion Step 4 — Documentation & Provenance Signals

**Status:** Complete  
**Date:** 2026-04-29

## Migration

`supabase/migrations/20260429090000_add_documentation_signals.sql`

## Columns added to `listings`

| Column | Type | Notes |
|--------|------|-------|
| `has_porsche_coa` | `BOOLEAN` | Certificate of Authenticity from Porsche AG |
| `has_kardex` | `BOOLEAN` | Factory build record from Porsche Archives |
| `has_service_records` | `BOOLEAN` | Phase 2 signal (related to existing `service_history_present`) |
| `has_window_sticker` | `BOOLEAN` | Monroney / delivery sticker present |
| `has_owners_manual` | `BOOLEAN` | Original owners manual present |
| `owner_count` | `INTEGER` | Normalized count (related to existing `ownership_count SMALLINT`) |
| `documentation_score` | `INTEGER` | Derived 0–6 sum of documentation flags |

## Overlap notes

- `has_service_records` is distinct from existing `service_history_present` (base schema BOOLEAN). Phase 2 enrichment populates the new column; scraper-level detection keeps the old one. May consolidate in future.
- `owner_count` is distinct from existing `ownership_count SMALLINT`. Phase 2 provides normalized integer; may consolidate in future.

## Verification

All seven columns returned `null` — exist, no data yet.
