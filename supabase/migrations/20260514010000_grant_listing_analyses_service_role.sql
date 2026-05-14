-- service_role was missing SELECT/INSERT/UPDATE/DELETE on listing_analyses.
-- The /api/analyze route uses the admin client (service_role) to insert analysis
-- snapshots and was denied with error code 42501 (permission denied for table).
-- RLS policies are correct; this is the missing base-table GRANT.
-- Same fix pattern as comp_results (20260429051000) and research_records (20260511080000).
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE listing_analyses TO service_role;
