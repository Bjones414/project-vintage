-- service_role was missing SELECT/INSERT/UPDATE/DELETE on research_records.
-- The /api/research route uses adminClient() (service_role) and was denied with 42501.
-- RLS policies were already correct; this is the missing GRANT.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE research_records TO service_role;
