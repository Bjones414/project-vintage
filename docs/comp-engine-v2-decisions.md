# Comp Engine V2 — Build Decisions Log

Decisions made during the overnight build where the spec was ambiguous or a conflict existed with prior work. Each entry: decision, rationale.

---

## D1: `comments_count` (spec) vs `comment_count` (existing column)

**Decision:** Keep `comment_count`. Do NOT add `comments_count`.

**Rationale:** Last night's schema expansion added `comment_count INTEGER` to listings. The spec's auction signal section names the same concept `comments_count`. They are identical in purpose. Adding `comments_count` would be a duplicate column. All code in V2 engine and backtest uses `comment_count`.

---

## D2: `documentation_score` — spec says "derived, not stored" but column already exists

**Decision:** Keep the existing `documentation_score INTEGER` column. Leave nullable/unpopulated. Do not compute or store it in V1.

**Rationale:** The column was added in last night's schema run (migration 20260429090000). Dropping it would be a destructive operation and the spec only says "derived, not stored" — meaning we shouldn't compute it on insert, not that the column must not exist. Future work can implement the derivation and populate it.

---

## D3: `market_region` added alongside `country_of_sale`

**Decision:** Add `market_region TEXT` (us/euro/row/japan) as a new column. Keep existing `country_of_sale TEXT` (ISO alpha-2, e.g., US, UK, DE).

**Rationale:** They serve different granularity levels. `country_of_sale` is the precise source (DE vs UK are both euro but may have different price characteristics for German-delivery cars). `market_region` is the coarser grouping used by the V2 comp engine's market_region_match factor. Both are useful long-term.

---

## D4: No new CHECK constraints on `body_style` and `drivetrain`

**Decision:** Skip adding CHECK constraints to the existing `body_style` and `drivetrain` columns even though the spec specifies enum values for each.

**Rationale:** The existing BaT corpus may have variant text values in these columns (e.g., `decoded_body_class` values vary). Adding CHECK constraints risks blocking future INSERT of rows with non-canonical values. The V2 engine normalizes body style internally using the same logic as V1 (`normalizeBodyClass`). Log spec values as documentation, not as database enforcement.

---

## D5: V2 engine uses `decoded_body_class` for body style matching

**Decision:** V2 engine reads `decoded_body_class` (NHTSA-decoded, consistently populated) rather than `body_style` (raw text, often null) for hard filter and similarity.

**Rationale:** The 199-record BaT corpus has `decoded_body_class` populated from NHTSA VIN decode. `body_style` is often null. Using the populated column gives useful backtest results. Body style normalization applies the same logic as V1 (coupe/cabriolet/targa).

---

## D6: NULL handling in Stage 1 hard filters

**Decision:** If the subject OR the comp has NULL for a required hard-filter field (trim_category, body_style, drivetrain), skip that filter for that pairing — treat as "compatible, unknown."

**Rationale:** The entire current corpus has NULL for trim_category (not yet populated by extraction pipeline). If we required match on NULL, every comp would be dropped and no prediction would be possible. "Compatible, unknown" gives meaningful backtest results on the current corpus and switches to real filtering automatically once extraction populates the fields.

---

## D7: `turbo_s` in trim_taxonomy — `is_separate_market = false`

**Decision:** 993 Turbo S is marked `is_separate_market = false`.

**Rationale:** The spec says "RS, GT2, GT3, Speedster, Cup are TRUE." Turbo S was a factory special order option (not a motorsport homologation). While extremely rare and high-value, it did sell alongside regular Turbos at auction and comps reasonably to Turbo X50. Marking it `false` means it comps within the turbo_* family, which is more defensible than isolating it entirely. If backtest shows it needs its own pool, set to true at that time.

---

## D8: `owner_count` (existing) vs `owner_count_stated` (spec)

**Decision:** Keep both. `owner_count` (added last night as INTEGER) remains as a general-purpose field. `owner_count_stated` (new V2 column) is specifically the V1 regex-extracted value from listing text.

**Rationale:** They serve different semantic purposes. `owner_count_stated` is an observable BaT signal ("3 owners" mentioned in listing text) used as a V1 condition stub input. `owner_count` is a normalized count from Phase 2 enrichment. Not duplicates.

---

## D9: Generation config table uses `generation_id` string values matching `porsche_generations.generation_id`

**Decision:** Config tables (`generation_weight_config`, `generation_mileage_bands`) use `generation_id TEXT` keyed on the same string values used in `porsche_generations.generation_id` (e.g., '993', '996.1', 'default'). Note: spec uses '996_1' (underscore) while porsche_generations uses '996.1' (dot). Log: using dot notation ('996.1') to match the FK reference table. Seeding spec's '996_1' rows as '996.1'.

**Rationale:** Consistency with the existing `porsche_generations` table's primary key values. The V2 engine joins on `listings.generation_id` which is a FK to `porsche_generations.generation_id`, so using the same notation avoids mismatches.

---

## D10: `comp_engine_runs` stores subject_data JSONB for non-listing subjects

**Decision:** Add `subject_data JSONB` column to `comp_engine_runs` alongside `subject_listing_id`. Both nullable. Backtest runs populate `subject_listing_id` (real listing) and `was_backtest=true`. Future hypothetical-subject queries populate `subject_data` instead.

**Rationale:** Spec says "subject_listing_id (or full subject jsonb if hypothetical)." Storing the JSONB subject allows replaying the prediction with different weights without needing to preserve the original listing.

---

## D11: Backtest uses all 199 records (no generation filter guard)

**Decision:** Backtest script fetches generation_id='993' records and expects all to have non-null `final_price`. If some records lack `final_price` or `auction_ends_at`, they are silently skipped (logged in summary).

**Rationale:** The 199-record corpus was seeded specifically for this purpose. Any records without final prices are invalid comp candidates anyway.

---

## D12: `generation` TEXT column on listings not constrained to enum values

**Decision:** The spec lists specific enum values for `generation` (pre_a, 356_a, 911_g, 930, 964, 993, etc.) but no CHECK constraint is added to the existing `generation TEXT` column.

**Rationale:** Same reasoning as D4 — the existing column is populated by scrapers with values like "G-Series" or free-form text. Adding a CHECK constraint would break future inserts with non-canonical values. The normalized reference is `generation_id` (FK to porsche_generations). The raw `generation` field is a scraper artifact.
