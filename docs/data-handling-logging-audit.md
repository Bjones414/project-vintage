# Logging Audit — VIN in logs and error tracking

Audit performed 2026-04-30 as part of data handling compliance pass (Phase 1, Step 6).
Confirms full VINs cannot appear in logs, analytics events, or error tracking payloads.

---

## Current Logging State

### Sentry / Error Tracking
- `@sentry/nextjs` version 10.50.0 is installed as a dependency.
- Sentry is NOT YET instantiated in the application. `app/layout.tsx` has a TODO comment:
  `// TODO: Add Sentry and PostHog providers here once configured`
- No `Sentry.captureException()`, `Sentry.captureEvent()`, or `Sentry.setContext()` calls found anywhere in the codebase.
- **Risk: Zero.** No error payloads are being sent to Sentry at this time.
- **Action required when Sentry is wired:** Ensure `beforeSend` hook in Sentry config strips any field named `vin` or `engine_serial` from error event data, breadcrumbs, and request payloads.

### PostHog / Analytics
- `posthog-js` and `posthog-node` are installed.
- PostHog is NOT YET instantiated in the application.
- No PostHog `capture()` calls found anywhere in the codebase.
- **Risk: Zero.** No analytics events are being sent.
- **Action required when PostHog is wired:** Ensure no event property named `vin` or containing a VIN pattern is captured.

### Console Logging
Grepped all console.log/warn/error calls. VIN-bearing context reviewed:

| Location | Log Call | VIN Risk? |
|---|---|---|
| `app/api/analyze/route.ts:85` | `console.warn('[api/analyze] generation match needs review', {...})` | Was risky before (logged `source_url` with VIN-bearing URL, but no VIN directly). Now the `row` object no longer has `vin` so no accidental VIN capture. |
| `lib/listing-parser/bring-a-trailer.ts:45` | `console.warn('[BaT parser] suspicious auction end timestamp')` | No VIN in context. Safe. |
| `lib/comp-engine-v2/logger.ts:54` | `console.error()` on failed comp run log | Logs `subject_listing_id` and error message, not the listing object. Safe. |

### Supabase-based Audit Log
- `lib/comp-engine-v2/logger.ts` writes to `comp_engine_runs` table.
- The `subject_data` JSONB column stores a snapshot of `V2Subject` at run time.
- **VIN risk assessment:** `V2Subject` is constructed from the `listings` row. Since the `vin` column is now NULL on all records, and the write path no longer writes `vin`, any `V2Subject` constructed after this compliance pass will not contain a VIN.
- **Historical records:** Existing `comp_engine_runs` rows may contain `subject_data` with a `vin` field if they were computed before this pass. These are internal audit logs, not user-facing. Risk is low.

---

## Actions Taken

1. `app/api/analyze/route.ts` — removed `vin` from the write `row` object. The `console.warn` at line 85 logs generation match review context which does not include VIN.
2. No other code changes needed for logging at this time (Sentry/PostHog not wired).

## Actions Deferred

1. **Sentry `beforeSend` hook** — add VIN redaction when Sentry is wired. Log this as a prerequisite in the Sentry setup task.
2. **PostHog property filter** — ensure no `vin` property is captured when PostHog is wired.
3. **comp_engine_runs historical data** — historical rows may have `subject_data.vin`. Consider a one-time UPDATE to remove the `vin` key from `subject_data` JSONB for existing rows. Deferred to a separate task.
