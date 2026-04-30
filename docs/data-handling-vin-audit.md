# VIN Audit — listings table text columns

Audit performed 2026-04-30 as part of data handling compliance pass.
Covers all text/varchar columns on the `listings` table that could plausibly hold a VIN string.

---

## Method

1. Reviewed all migration files (20260428021950 through 20260430040000) to enumerate every TEXT column on `listings`.
2. Evaluated each column's semantic purpose against "could this hold a full VIN (17-char alphanumeric)?"
3. Reviewed write paths: `app/api/analyze/route.ts` and `scripts/seed-corpus-bat.ts`.

---

## Columns Reviewed

| Column | Type | Could hold VIN? | Disposition |
|---|---|---|---|
| `source_platform` | text | No — platform slug like "bring-a-trailer" | Safe |
| `source_url` | text | No — URL format | Safe |
| `source_listing_id` | text | No — platform lot number/slug | Safe |
| `make` | text | No — car make ("Porsche") | Safe |
| `model` | text | No — model name | Safe |
| `generation` | text | No — generation code ("993") | Safe |
| `trim` | text | No — trim description | Safe |
| `body_style` | text | No — body style | Safe |
| `exterior_color` | text | No — color name | Safe |
| `exterior_color_code` | text | No — paint code (max ~6 chars) | Safe |
| `interior_color` | text | No — color name | Safe |
| `interior_material` | text | No — material type | Safe |
| `transmission` | text | No — transmission type | Safe |
| `drivetrain` | text | No — drivetrain type | Safe |
| `raw_description` | text | **YES** — could contain VIN in seller description | **CONTAINS VIN RISK** — being dropped in Phase 5 |
| `raw_html_snapshot_key` | text | No — R2 storage key (short string) | Safe |
| `mileage_unit` | text | No — "mi" or "km" | Safe |
| `currency` | text | No — 3-char ISO currency code | Safe |
| `status` | text | No — status enum value | Safe |
| `listing_status` | text | No — status enum value | Safe |
| `notable_provenance` | text | No — free-form but editorial, short | Low risk |
| `ppi_completed_by` | text | No — shop name, short | Safe |
| `vin` | text | **YES — PRIMARY VIN COLUMN** | **Nulled in data migration; guard blocks future writes** |
| `vin_partial` | text | **YES — partial VIN** | **Nulled in data migration; column DROPPED in step 3** |
| `generation_id` | text (FK) | No — generation reference ("993") | Safe |
| `trim_category` | text | No — taxonomy enum value | Safe |
| `trim_variant` | text | No — short variant code | Safe |
| `body_style_normalized` | text | No — normalized value | Safe |
| `drivetrain_normalized` | text | No — normalized value | Safe |
| `transmission_variant` | text | No — gearbox variant code | Safe |
| `country_of_sale` | text | No — ISO country code | Safe |
| `market_region` | text | No — market region code | Safe |
| `steering_side` | text | No — "lhd"/"rhd" | Safe |
| `consignor_type` | text | No — type enum | Safe |
| `auction_outcome` | text | No — outcome enum | Safe |
| `condition_signal` | text | No — signal enum | Safe |
| `paint_signal` | text | No — signal enum | Safe |
| `interior_signal` | text | No — signal enum | Safe |
| `mod_status` | text | No — mod enum | Safe |
| `accident_history_stated` | text | No — enum value | Safe |
| `interior_color_rarity` | text | No — rarity enum | Safe |
| `seats_type` | text | No — type enum | Safe |
| `mechanical_remediation_status` | text | No — status enum | Safe |
| `decoded_make` | text | No — decoded make from NHTSA | Safe |
| `decoded_model` | text | No — decoded model from NHTSA | Safe |
| `decoded_body_class` | text | No — decoded body class | Safe |
| `decoded_engine` | text | No — engine description, not serial | Safe |
| `decoded_plant` | text | No — assembly plant code/city | Safe |
| `decoded_transmission` | text | No — transmission description | Safe |

---

## VIN-Bearing Columns Identified

1. **`vin`** — Full VIN column. Written by `app/api/analyze/route.ts:111` and `scripts/seed-corpus-bat.ts:339`. Contains full 17-character VINs for most of the 199-record dev corpus.

2. **`vin_partial`** — Added in 20260430000000. Currently NULL for all records (never written to by any existing write path). Will be dropped in step 3.

3. **`raw_description`** — Contains verbatim listing text from BaT's JSON-LD `description` field. VINs frequently appear in seller descriptions ("Chassis: WP0ZZZ93ZJS000XXX..."). Being dropped in Phase 5.

---

## Disposition

- `vin`: Data migration script nulls this column for all existing records. NEVER_PERSIST_FIELDS guard blocks future writes. Column kept as dead column (see Decision D1).
- `vin_partial`: Data migration script handles any non-null values (none expected). Column dropped in migration step 3.
- `raw_description`: Contains VIN risk. Being nulled + dropped in Phase 5 data migration. All existing text discarded.

---

## Write Path Audit

**`app/api/analyze/route.ts`:**
- Line 111: `vin: listing.vin` — REMOVED in this pass. Hash computed as `vin_hash_partial` instead.
- Line 124: `raw_description: listing.description` — REMOVED in this pass. Raw text no longer persisted.

**`scripts/seed-corpus-bat.ts`:**
- Line 339: `vin: listing.vin` — REMOVED in this pass.
- Line 352: `raw_description: listing.description` — REMOVED in this pass.

---

## Conclusion

After data migration + column drop + code changes:
- No column on `listings` will contain a full VIN.
- `vin_hash_partial` stores a one-way SHA-256 hash of the last 6 chars of the VIN — not reversible.
- NEVER_PERSIST_FIELDS guard prevents future accidental VIN writes.
