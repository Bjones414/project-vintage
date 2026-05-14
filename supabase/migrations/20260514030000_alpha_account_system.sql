BEGIN;

-- =============================================================================
-- Alpha Account System
--
-- Changes:
--   1. account_type_t enum — 'alpha' | 'free' | 'paid' | 'admin'
--   2. Alter users table: account_type, alpha_expires_at, first_name, last_name,
--      home_city, home_state, home_lat, home_lng
--   3. Backfill existing admin-role users → account_type = 'admin'
--   4. Index on account_type for capacity-count query
--   5. RPC: create_alpha_user — atomic cap check + insert via advisory lock
--
-- Lazy expiration (no cron): middleware.ts reads account_type + alpha_expires_at
-- on every authenticated request and updates account_type → 'free' when expired.
-- The downgrade is triggered only by direct user action, never by background jobs.
--
-- Alpha cap: 5 accounts max, enforced inside create_alpha_user via advisory lock.
-- Home location (home_city, home_state, home_lat, home_lng) is the personalization
-- source of truth, populated via US Census Geocoder at signup.
--
-- Reversible: ALTER TABLE ... DROP COLUMN IF EXISTS for each added column;
--             DROP FUNCTION create_alpha_user;
--             DROP TYPE account_type_t;
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. account_type_t enum
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'account_type_t' AND typtype = 'e'
  ) THEN
    CREATE TYPE account_type_t AS ENUM ('alpha', 'free', 'paid', 'admin');
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Alter users — add alpha account + home-location columns
--
--    account_type default is 'free' for existing rows. New alpha signups are
--    set to 'alpha' explicitly by the signup endpoint.
-- ---------------------------------------------------------------------------
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS account_type     account_type_t NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS alpha_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_name       TEXT,
  ADD COLUMN IF NOT EXISTS last_name        TEXT,
  ADD COLUMN IF NOT EXISTS home_city        TEXT,
  ADD COLUMN IF NOT EXISTS home_state       CHAR(2),
  ADD COLUMN IF NOT EXISTS home_lat         NUMERIC(9, 6),
  ADD COLUMN IF NOT EXISTS home_lng         NUMERIC(9, 6);

-- ---------------------------------------------------------------------------
-- 3. Backfill existing admin-role users to account_type = 'admin' so the
--    lazy-expiration middleware never attempts to downgrade them.
-- ---------------------------------------------------------------------------
UPDATE users SET account_type = 'admin' WHERE role = 'admin';

-- ---------------------------------------------------------------------------
-- 4. Index for alpha capacity-count query inside create_alpha_user
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS users_account_type_idx ON users (account_type);

-- ---------------------------------------------------------------------------
-- 5. RPC: create_alpha_user
--
--    Atomically checks the 5-account alpha cap and inserts the new user row.
--    Uses pg_advisory_xact_lock to serialize concurrent signup attempts so two
--    simultaneous requests at count=4 cannot both succeed.
--
--    Returns JSONB:
--      { "success": true }              — user inserted
--      { "error": "alpha_capacity_reached" } — cap hit, auth user must be cleaned up
--
--    SECURITY DEFINER runs as the table owner (postgres), bypassing RLS.
--    search_path is pinned to public to prevent privilege-escalation via search_path.
--    Called only from the server-side signup API route using the service role.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_alpha_user(
  p_id         UUID,
  p_email      TEXT,
  p_first_name TEXT,
  p_last_name  TEXT,
  p_home_city  TEXT,
  p_home_state TEXT,
  p_home_lat   NUMERIC,
  p_home_lng   NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alpha_count INTEGER;
BEGIN
  -- Serialize concurrent alpha signups. Any transaction calling this function
  -- will block until the previous one commits or rolls back.
  PERFORM pg_advisory_xact_lock(hashtext('project_vintage_alpha_signup'));

  SELECT COUNT(*) INTO v_alpha_count
  FROM users
  WHERE account_type = 'alpha';

  IF v_alpha_count >= 5 THEN
    RETURN jsonb_build_object('error', 'alpha_capacity_reached');
  END IF;

  INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    home_city,
    home_state,
    home_lat,
    home_lng,
    account_type,
    alpha_expires_at
  ) VALUES (
    p_id,
    p_email,
    p_first_name,
    p_last_name,
    p_home_city,
    p_home_state,
    p_home_lat,
    p_home_lng,
    'alpha',
    NOW() + INTERVAL '45 days'
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Grant execute to service_role only — this function is called server-side
-- with the service role key, never from the browser client.
GRANT EXECUTE ON FUNCTION create_alpha_user(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC)
  TO service_role;

COMMIT;
