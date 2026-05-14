# Persistence-Layer Error Investigation — 2026-05-14

## Error 1: `permission denied for table listing_analyses`

### Symptom
Every call to `POST /api/analyze` logs:
```
[api/analyze] listing_analyses insert failed (non-fatal)
{ listing_id: '...', error: 'permission denied for table listing_analyses' }
```
HTTP 200 is returned but the analysis snapshot is never persisted, so every re-analyze re-runs the full pipeline.

### Root Cause
`listing_analyses` was created directly in the Supabase dashboard (not through a local migration file). The baseline migration `20260428021950_remote_commit.sql` is empty — the table schema lives only in the remote database.

Because the table was created without an explicit `GRANT ... TO service_role`, the `service_role` Postgres role has **no table-level privilege** on `listing_analyses`. PostgreSQL's `permission denied for table` is a GRANT-level error — distinct from an RLS policy violation (`new row violates row-level security policy`). PostgREST enforces base-table privileges even when RLS is bypassed via the service role.

### Why the Existing Code Isn't the Bug
`app/api/analyze/route.ts` lines 60–63 correctly create a service-role admin client:
```ts
const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
```
The `listing_analyses` insert at line 284 correctly uses `supabaseAdmin`. The client is right; the missing piece is the Postgres GRANT on the table.

### Precedent in This Codebase
This exact issue has occurred twice before:
- `comp_results` — fixed via `20260429051000_grant_comp_results_service_role.sql`:
  `GRANT ALL ON comp_results TO service_role;`
- `research_records` — fixed via `20260511080000_grant_research_records_service_role.sql`:
  `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE research_records TO service_role;`

### Fix Path Chosen: New Grant Migration
Following the `research_records` pattern (narrower than ALL, scoped to what the API actually does):
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE listing_analyses TO service_role;
```
Migration file: `supabase/migrations/20260514010000_grant_listing_analyses_service_role.sql`

The code does not change. No RLS policy changes needed — the table has user-scoped RLS already (user_id foreign key + nullable change in `20260428080000`) and that's correct. The GRANT fixes the base-table privilege layer.

---

## Error 2: `cascade_level` column missing on `comp_engine_runs`

### Symptom
Every comp engine run logs:
```
[comp-engine-v2] failed to log run
{ error: "Could not find the 'cascade_level' column of 'comp_engine_runs' in the schema cache" }
```

### Root Cause
`lib/comp-engine-v2/logger.ts` line 49 writes `cascade_level: result.cascade_level ?? null` on every `comp_engine_runs` insert. The migration to add this column (`20260514000000_add_cascade_level_to_comp_engine_runs.sql`) was written and exists on disk but:
1. Was never committed to git (shows as `??` untracked in `git status`)
2. Was therefore never applied via `npx supabase db push`
3. The column does not exist in the remote database schema cache

The migration content is correct:
```sql
ALTER TABLE comp_engine_runs
  ADD COLUMN IF NOT EXISTS cascade_level integer;
```

### Fix
Apply the existing migration. No code changes needed.

---

## Migration Apply Order
Both migrations have 2026-05-14 timestamps. Apply order:
1. `20260514000000_add_cascade_level_to_comp_engine_runs.sql` (cascade_level column)
2. `20260514010000_grant_listing_analyses_service_role.sql` (listing_analyses GRANT)

Command: `npx supabase db push`
