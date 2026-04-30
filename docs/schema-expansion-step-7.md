# Schema Expansion Step 7 — SCHEMA.md Documentation

**Status:** Complete  
**Date:** 2026-04-29

## What changed

Appended a new section **"Schema Expansion — Comp Engine V2 (2026-04-29)"** to `SCHEMA.md` immediately before the existing `## Notes` section.

## Section covers

- Step 1: `bid_count`, `comment_count`, `bid_to_buy_ratio`, `final_to_reserve_ratio`
- Step 2: `trim_category`, `country_of_sale`
- Step 3: `condition_signal`, `paint_signal`, `interior_signal`, `numbers_matching`, `mod_status`
- Step 4: `has_porsche_coa`, `has_kardex`, `has_service_records`, `has_window_sticker`, `has_owners_manual`, `owner_count`, `documentation_score` (with overlap notes on `service_history_present` and `ownership_count`)
- Step 5: `factory_options`, `has_x50_powerkit`, `has_aero_kit`, `has_sport_seats`, `is_paint_to_sample` (with architecture note on marque-agnostic design)
- Step 6: `market_snapshots` full table definition, index, RLS

## Format

Each step uses a SQL block with inline comments per SCHEMA.md conventions. Populated-by / reads-from / current-state documented in comments.
