# Verbatim Text Audit — listings table

Audit performed 2026-04-30 as part of data handling compliance pass.
Identifies columns that hold verbatim source content (seller descriptions, headlines, editorial copy).

---

## Text Columns Audited

| Column | Purpose | Contains Verbatim? | Disposition |
|---|---|---|---|
| `raw_description` | Verbatim listing text from JSON-LD `description` field | **YES** | **NULL + DROP** |
| `raw_html_snapshot_key` | R2 storage key (short pointer string) | No — key only, not content | Retain (see Decision D3) |
| `notable_provenance` | Editorial free-form provenance note | Low risk — editorially authored | Retain |
| `source_url` | Listing URL | No — a URL, not content | Retain |
| `vin_decode_raw` | JSONB of NHTSA vPIC API response | No — structured API data | Retain |

---

## raw_description

**Source:** Written from `listing.description` in `app/api/analyze/route.ts` (line 124) and `scripts/seed-corpus-bat.ts` (line 352). The description comes from the JSON-LD `Product.description` field on BaT pages, which is verbatim seller copy.

**Action:**
1. Data migration: `UPDATE listings SET raw_description = NULL;` (all 208 records)
2. Follow-up migration: `ALTER TABLE listings DROP COLUMN raw_description;`
3. Code: remove `raw_description` from all write paths (done in this pass)

**Note:** The V2 comp engine migrations reference `raw_description` in comments:
- "V1 populates accident_history_stated and owner_count_stated via regex over raw_description."
This extraction path is replaced by the source-mentions extractor in Phase 2, which operates on `listing.description` in memory at fetch time and discards the text after extraction. See Decision D6.

---

## raw_html_snapshot_key

**Source:** Not written by any current write path (no code sets this field). Present in the original schema for future R2 snapshot storage.

**Action:** Retain. The column holds a storage key (short string), not verbatim content. The actual HTML is in R2, which is outside the scope of this compliance pass.

---

## No Other Verbatim Columns Found

All other text columns on `listings` hold structured editorial or factual data (enums, codes, names, identifiers) rather than verbatim source content.
