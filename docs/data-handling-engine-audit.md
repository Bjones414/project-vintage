# Engine Field Audit — listings table

Audit performed 2026-04-30 as part of data handling compliance pass (Phase 3).
Confirms no engine serial numbers are stored.

---

## Columns Reviewed

| Column | Type | Contents | Serial Number Risk? |
|---|---|---|---|
| `decoded_engine` | text | Engine description from NHTSA vPIC API decode. Values like "4.0L H-6", "3.3L H-6 Turbo", "3.6L H-6". This is an editorial engine description, not a serial number. | No — editorial/descriptive only |
| `decoded_plant` | text | Assembly plant location from NHTSA decode. Values like "Zuffenhausen", "Leipzig". | No |
| `engine_displacement_cc` | integer | Displacement in cubic centimeters. | No |
| `decoded_transmission` | text | Transmission description from NHTSA decode. | No |

---

## Write Path Audit

**`app/api/analyze/route.ts`:**
- `decoded_engine: decoded.engine` — writes engine DESCRIPTION from NHTSA decode. NHTSA does not return engine serial numbers in its vPIC API responses. Safe.

**`scripts/seed-corpus-bat.ts`:**
- No engine fields written by this script.

---

## CanonicalListing type

`engine: string | null` — this field holds a human-readable engine description (e.g., "3.6-litre flat-six") extracted from listing text. It is NOT written to the DB in the current write path (intentionally omitted from the row object as noted in route.ts comments).

---

## NEVER_PERSIST_FIELDS Guard

`engine_serial` is included in `NEVER_PERSIST_FIELDS = ['vin', 'engine_serial']` in `lib/db/never-persist.ts`. The guard throws loudly if any write payload contains this field.

No existing code ever writes `engine_serial` — the guard is a prospective protection against future accidental writes.

---

## Conclusion

No column on `listings` stores engine serial numbers. The `decoded_engine` field holds editorial descriptions from NHTSA, not serial numbers. The NEVER_PERSIST_FIELDS guard prevents future writes containing `engine_serial`. Phase 3 requirement is satisfied.
