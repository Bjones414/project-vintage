-- Allow unauthenticated users to run their first analysis without signing up (V1 acquisition pattern).
-- Drops the NOT NULL constraint only. The FK (listing_analyses_user_id_fkey → users.id ON DELETE CASCADE)
-- is unaffected — NULL values are excluded from FK checks in PostgreSQL.
ALTER TABLE listing_analyses ALTER COLUMN user_id DROP NOT NULL;
