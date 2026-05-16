-- =============================================================================
-- Bump alpha account cap from 5 to 15
--
-- Reason: first 5-user alpha cohort filled. Opening 10 additional slots for
-- the next cohort of founding collectors while the team continues to tune
-- the product foundations.
--
-- Only change: the cap comparison in create_alpha_user (>= 5  →  >= 15).
-- All other RPC behavior is unchanged: advisory lock, account_type default,
-- alpha_expires_at (+45 days), SECURITY DEFINER / search_path pin, grant.
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
