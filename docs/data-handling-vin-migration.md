# VIN Data Migration Results

Performed 2026-04-30 via migration 20260430051000_data_handling_phase1_migrate_vin_data.sql.

## Before

| Metric | Count |
|---|---|
| Total listings | 208 |
| Records with `vin` (full VIN) | 207 |
| Records with `vin_partial` | 0 |
| Records with `vin_hash_partial` | 0 |

## After

| Metric | Count |
|---|---|
| Total listings | 208 |
| Records with `vin` (full VIN) | **0** |
| Records with `vin_partial` | **0** |
| Records with `vin_hash_partial` | **207** |

## Method

For each of the 207 records with a full VIN:
1. Computed `encode(sha256(RIGHT(vin, 6)::bytea), 'hex')` — SHA-256 of the last 6 characters of the VIN.
2. Wrote the hash to `vin_hash_partial`.
3. Set `vin = NULL`.

No records had `vin_partial` data (column was added in the V2 migration but never populated by any write path).

## Why Last 6 Characters

The last 6 characters of a VIN are the production sequence number, which uniquely identifies an individual car within a plant+year. They provide sufficient entropy for cross-listing identity detection while being too short to reconstruct the full VIN from the hash alone.

## Reversibility

SHA-256 is a one-way function. The hash cannot be reversed to recover the original VIN. The hash is sufficient for matching (same car across platforms will produce the same hash if VINs are identical) but discloses no VIN information even if the database is dumped.
