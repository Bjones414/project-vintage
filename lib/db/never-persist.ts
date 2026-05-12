/**
 * Fields that must never be written to any persistent store.
 * Engine serial numbers are display-only.
 *
 * VIN is intentionally writable: it is publicly visible on every source listing,
 * and storing it enables Chassis Identity display and cross-listing deduplication.
 * vin_hash_partial (SHA-256 of last 6 chars) continues to be stored alongside for
 * listings that pre-date full VIN persistence and for efficient hash-based lookups.
 *
 * This guard is load-bearing. Every database write must pass through guardWrite()
 * before reaching Supabase. Violations throw — they do not warn.
 */
export const NEVER_PERSIST_FIELDS = ['engine_serial'] as const

export type NeverPersistField = (typeof NEVER_PERSIST_FIELDS)[number]

/**
 * Throws if the payload contains any field from NEVER_PERSIST_FIELDS.
 * Pass the row object through this before every database upsert/insert/update.
 *
 * @throws Error with field name and caller context if a violation is found.
 */
export function guardWrite(payload: Record<string, unknown>, caller: string): void {
  for (const field of NEVER_PERSIST_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      throw new Error(
        `[NEVER_PERSIST_FIELDS] Attempted to write restricted field "${field}" to the database. ` +
          `Caller: ${caller}. This field must never be persisted.`
      )
    }
  }
}
