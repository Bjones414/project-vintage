-- Add role column to the application-side users table.
-- Controls gate bypass: admin and beta users skip all V1 free-tier limits.
-- Existing rows receive the DEFAULT 'member'. Specific accounts are promoted
-- manually via SQL after reviewing — do NOT add UPDATE statements here.
ALTER TABLE users
  ADD COLUMN role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member', 'beta', 'admin'));

CREATE INDEX users_role_idx ON users (role);
