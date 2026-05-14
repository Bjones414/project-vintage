# Persistence-Layer Fix — Change Log — 2026-05-14

## Files Changed

### New Migration: `supabase/migrations/20260514010000_grant_listing_analyses_service_role.sql`
Grants `SELECT, INSERT, UPDATE, DELETE` on `listing_analyses` to `service_role`.
Fixes "permission denied for table listing_analyses" on every analyze run.
**Applied via `npx supabase db push` on 2026-05-14.**
No application code changes — `app/api/analyze/route.ts` was already using the
correct service-role admin client.

### Pre-existing Migration: `supabase/migrations/20260514000000_add_cascade_level_to_comp_engine_runs.sql`
Written in a prior session; existed on disk as untracked (`??` in git status).
Adds `cascade_level INTEGER` (nullable) to `comp_engine_runs`.
**Already applied to the remote DB** — not shown in `db push` pending list, confirming
it was pushed previously without being committed to git.
No application code changes — `lib/comp-engine-v2/logger.ts` was already
writing `cascade_level` correctly.

## No Application Code Changes
Both errors were purely infrastructure gaps. The route and logger code was correct.

## Apply Commands (reference — already run)
```
npx supabase db push
# Applied: 20260514010000_grant_listing_analyses_service_role.sql
# (20260514000000 was already applied in a prior session)
```

## Verification Queries
```sql
-- Confirm cascade_level column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comp_engine_runs' AND column_name = 'cascade_level';

-- Confirm service_role privilege on listing_analyses
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'listing_analyses' AND grantee = 'service_role';

-- Confirm 0 rows pre-fix (all blocked)
SELECT COUNT(*) FROM listing_analyses;

-- After first post-fix analyze run, verify row was created:
SELECT * FROM listing_analyses ORDER BY created_at DESC LIMIT 1;
```

## Data Loss Assessment
- `listing_analyses` had **0 rows total** — the GRANT was never applied since table creation,
  meaning no analysis snapshot has ever persisted in any session.
- **43 listings** were fetched today (02:17 UTC through 18:14 UTC), all bring-a-trailer.
- All 43 fetches had their `listing_analyses` insert silently fail.
- **Re-pasting URLs will NOT fix missing snapshots**: the cache hit path in `route.ts`
  (lines 94–103) skips the `listing_analyses` insert — it only calls `computeCompsV2`
  and returns early. The insert only runs on a fresh (non-cached) fetch.
- A backfill script is needed to insert `listing_analyses` rows for the 43 listings
  (and any from prior sessions). Decision deferred to user.

## Files written this session
- `research/audit-2026-05-14/s-persist/investigation.md`
- `research/audit-2026-05-14/s-persist/changes.md` (this file)
- `supabase/migrations/20260514010000_grant_listing_analyses_service_role.sql`
