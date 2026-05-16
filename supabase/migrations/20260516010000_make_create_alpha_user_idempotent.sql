-- =============================================================================
-- Make create_alpha_user idempotent
--
-- Adds an EXISTS check inside the advisory lock: if the target user row already
-- exists, the function returns { "success": true } immediately and skips the
-- capacity check and INSERT. This makes back-to-back calls safe.
--
-- Root cause of the duplicate-call behaviour was not found in application code
-- (route.ts has one explicit RPC call; postgrest-js v2.104.1 only retries GET).
-- The duplication is confirmed to happen inside a single Vercel function
-- invocation, somewhere in the Next.js / Vercel / Supabase connection path.
-- As of 2026-05-16 the mechanism is unknown. This migration papers over the
-- symptom by making the function safe to call twice.
--
-- All other behaviour preserved: advisory lock, capacity cap (>= 15),
-- alpha_expires_at (+45 days), SECURITY DEFINER, search_path = public, grant.
-- =============================================================================

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

  -- Idempotency guard: if this auth user already has a row in public.users,
  -- return success immediately. This handles infrastructure-level double-
  -- invocations where the same RPC is called twice within one Vercel function
  -- execution. Checked inside the advisory lock so it captures rows inserted
  -- by a concurrent first call that committed just before we acquired the lock.
  IF EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
    RETURN jsonb_build_object('success', true);
  END IF;

  SELECT COUNT(*) INTO v_alpha_count
  FROM users
  WHERE account_type = 'alpha';

  IF v_alpha_count >= 15 THEN
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

-- Re-grant execute to service_role (CREATE OR REPLACE preserves the function
-- but does not carry forward permissions in all Postgres versions).
GRANT EXECUTE ON FUNCTION create_alpha_user(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC)
  TO service_role;
