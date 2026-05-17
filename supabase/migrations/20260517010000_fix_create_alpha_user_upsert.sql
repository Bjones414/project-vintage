-- =============================================================================
-- Fix create_alpha_user: replace broken EXISTS guard with upsert
--
-- Root cause: handle_new_user trigger fires on auth.users INSERT and creates a
-- skeleton row in public.users (id + email, all profile fields NULL,
-- account_type = 'free') before the RPC runs. The previous idempotency guard
-- (IF EXISTS → return early) saw the trigger-created skeleton and exited
-- without writing any profile fields, leaving first_name, last_name, home_city,
-- home_state NULL and account_type stuck at the 'free' column default.
--
-- Fix: replace the EXISTS guard + plain INSERT with a single
-- INSERT ... ON CONFLICT (id) DO UPDATE that writes all profile fields whether
-- the row is new or a trigger-created skeleton. Idempotency for double-call
-- scenarios is preserved: a second call with identical arguments simply
-- overwrites with the same values.
--
-- Cap check is adjusted to exclude p_id so re-upsert of an already-alpha user
-- (retry or double-call) is never blocked by the cap.
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
BEGIN
  -- Serialize concurrent alpha signups. Any transaction calling this function
  -- will block until the previous one commits or rolls back.
  PERFORM pg_advisory_xact_lock(hashtext('project_vintage_alpha_signup'));

  -- Cap check: exclude p_id so a retry or double-call for an existing alpha
  -- user does not consume a cap slot twice.
  IF (
    SELECT COUNT(*)
    FROM public.users
    WHERE account_type = 'alpha'
      AND id != p_id
  ) >= 15 THEN
    RETURN jsonb_build_object('success', false, 'error', 'alpha_capacity_reached');
  END IF;

  -- Upsert: handles both fresh rows and the skeleton row created by the
  -- handle_new_user trigger before this RPC runs. ON CONFLICT ensures all
  -- profile fields are written in both paths.
  INSERT INTO public.users (
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
  )
  ON CONFLICT (id) DO UPDATE SET
    email            = EXCLUDED.email,
    first_name       = EXCLUDED.first_name,
    last_name        = EXCLUDED.last_name,
    home_city        = EXCLUDED.home_city,
    home_state       = EXCLUDED.home_state,
    home_lat         = EXCLUDED.home_lat,
    home_lng         = EXCLUDED.home_lng,
    account_type     = 'alpha',
    alpha_expires_at = NOW() + INTERVAL '45 days',
    updated_at       = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Re-grant execute to service_role (CREATE OR REPLACE preserves the function
-- but does not carry forward permissions in all Postgres versions).
GRANT EXECUTE ON FUNCTION create_alpha_user(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC)
  TO service_role;

-- =============================================================================
-- Backfill for users created before this fix
--
-- Two known alpha users have NULL profile fields and account_type='free' because
-- the broken EXISTS guard saw the trigger-created skeleton row and returned
-- early before writing any data. Fill in the correct values and run these
-- UPDATE statements manually AFTER applying this migration. Do not uncomment
-- them here — run them interactively so values can be verified first.
-- =============================================================================
--
-- UPDATE public.users
-- SET first_name       = 'Blake',
--     last_name        = 'Jones',
--     home_city        = 'Chandler',
--     home_state       = 'AZ',
--     account_type     = 'alpha',
--     alpha_expires_at = NOW() + INTERVAL '45 days',
--     updated_at       = NOW()
-- WHERE email = 'rangersfanaz@gmail.com';
--
-- UPDATE public.users
-- SET first_name       = 'Todd',
--     last_name        = '[lastname]',
--     home_city        = '[city]',
--     home_state       = '[state]',
--     account_type     = 'alpha',
--     alpha_expires_at = NOW() + INTERVAL '45 days',
--     updated_at       = NOW()
-- WHERE email = '[dads_email]';
