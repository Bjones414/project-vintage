# Color Rarity Field — Fix Status

**Date:** 2026-04-29
**Commit:** feat: seed porsche_color_codes from public sources, add name-based fallback lookup

---

## What was broken

The Color Rarity field in ChassisIdentityCard never rendered for any listing because:

1. `porsche_color_codes` had zero rows — no seed data existed.
2. The page fetch short-circuited immediately when `exterior_color_code` was null, which it is on every scraped listing (scrapers populate the text name, not the paint code).

Full root-cause analysis: `docs/color-rarity-missing-diagnostic.md`.

---

## What was fixed

### 1. Schema change (`20260429030000_color_codes_schema_and_seed.sql`)

- `paint_code` demoted from PRIMARY KEY to nullable column with a partial unique index (`WHERE paint_code IS NOT NULL`). This allows rows for colors with no known code (e.g., Paint to Sample assignments that vary by order).
- New `id UUID` column promoted to PRIMARY KEY.
- New `source_note TEXT` column captures the public source used to verify each record.

### 2. Seed data (same migration)

**993 colors (7 rows):** Arctic Silver Metallic (92U), Polar Silver Metallic (92A), Midnight Blue Metallic (39J), Speed Yellow (10U), Riviera Blue (38G), Guards Red (80K — multi-generation), Black (700 — multi-generation).

**992 colors (4 rows):** GT Silver Metallic (M7Z), Carrara White Metallic (D9A), Chalk (E3), Python Green (null — PTS, no universal code).

Source: Porsche AG press data / Stuttcars palette reference. Rennbow was NOT used (prohibited per product policy).

### 3. Name-based fallback lookup (`lib/utils/color-lookup.ts`)

New `resolveColorData` utility: tries exact `paint_code` match first; falls back to case-insensitive `color_name` ILIKE match scoped to `generation_applicability` when `exterior_color_code` is null. This is what makes the 993 Turbo (Arctic Silver Metallic, no paint code on listing) resolve correctly.

### 4. Page wiring (`app/(app)/analyze/[id]/page.tsx`)

Replaced the inline `exterior_color_code`-only guard with `resolveColorData` running in the existing `Promise.all`. `colorData` is now resolved directly (no `{ data, error }` unwrap needed).

---

## Verification

- `npm run lint` — clean
- `npm run build` — clean
- `npm test` — 255 pass (8 new tests in `tests/lib/color-lookup.test.ts`)
- The 993 Turbo listing (Arctic Silver Metallic, `exterior_color_code = null`) will now resolve via the ILIKE fallback against the seeded `'Arctic Silver Metallic'` row and render "Common factory color" with a green severity dot.
