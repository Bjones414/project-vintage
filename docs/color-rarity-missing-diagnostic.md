# Color Rarity Field Missing — Diagnostic Report

**Listing:** 86c5d062-e121-4173-bcfa-1983c058c95c (1997 Porsche 993 Turbo, Arctic Silver Metallic)
**Expected:** 10th field in Chassis Identity — severity dot + "Common factory color"
**Actual:** Field absent entirely

---

## Findings

### 1. Prop wiring — correct, not the cause

`page.tsx` line 92 passes `colorData={colorData}` to `ChassisIdentityCard`. The prop boundary is wired correctly. This is not the issue.

### 2. Component rendering logic — correct, not the cause

`ChassisIdentityCard` computes `rarityLabel` as:
```ts
const rarityLabel = colorData != null
  ? colorData.rarity !== 'common' || colorData.is_special_order
    ? 'Rare or special-order'
    : 'Common factory color'
  : null
```
When `colorData` is null, `rarityLabel` is null and the field is suppressed. The logic is correct — it's doing exactly what it should. The absence of the field is not a rendering bug.

### 3. Data fetch — fails at two independent layers

**Layer A — listing has no `exterior_color_code`**

The page fetches color data with this guard:
```ts
listing.exterior_color_code
  ? supabase.from('porsche_color_codes').select('*').eq('paint_code', listing.exterior_color_code).maybeSingle()
  : Promise.resolve({ data: null, error: null })
```

For this listing:
```
exterior_color:      "Arctic Silver Metallic"
exterior_color_code: null
```
The guard short-circuits immediately. The Supabase query is never issued. `colorData` is `null` before the table is even touched.

**Layer B — `porsche_color_codes` table is empty**

Even if `exterior_color_code` were populated, it would find nothing:
```sql
SELECT * FROM porsche_color_codes; -- returns 0 rows
```
The table was defined (and had `content_status` added in the Phase 5 migration) but was never seeded with any color records. No listings in the database have `exterior_color_code` populated either — the column is null across the entire `listings` table.

---

## Root cause

Two independent gaps compound each other:

1. **Scraper does not extract paint codes.** `exterior_color_code` is null on every scraped listing. The scraper populates `exterior_color` (the text name from the listing description) but not the Porsche paint code (e.g., "92U" for Arctic Silver Metallic). Paint codes require a separate lookup against a reference like Rennbow or the Porsche paint database — they are not present in auction listing copy.

2. **`porsche_color_codes` has no seed data.** The table schema exists but the reference rows were never inserted. The `COLOR_SHARK_BLUE` and `COLOR_GUARDS_RED` test fixtures exist only in `tests/components/analyze/fixtures.ts` — they are test data, not production data.

Either gap alone is sufficient to make `colorData` null and suppress the field. Together they make the field structurally impossible to render for any listing in the current database.

---

## What would be required to fix

(Not a fix — recorded for planning only.)

- Seed `porsche_color_codes` with at minimum the 993-generation palette from Rennbow (approved source per CLAUDE.md). Arctic Silver Metallic is paint code `92U` on the 993.
- Change the color lookup to fall back to matching by `color_name` when `exterior_color_code` is null — or backfill `exterior_color_code` on existing listings by joining against a name-to-code lookup table after seeding.
- The page fetch guard would need adjustment to support name-based lookup as a fallback.
