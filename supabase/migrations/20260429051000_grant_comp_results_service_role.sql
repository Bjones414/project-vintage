-- Grant service_role full access to comp_results.
-- In Supabase, newly-created tables need explicit GRANT to service_role for
-- PostgREST to insert/update via the admin client.

BEGIN;
GRANT ALL ON comp_results TO service_role;
COMMIT;
