-- Add a user role column so reveal actions can be restricted to dad or mom.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS user_role TEXT;

UPDATE users
  SET user_role = CASE lower(name)
    WHEN 'dad' THEN 'dad'
    WHEN 'mom' THEN 'mom'
    ELSE 'guest'
  END
  WHERE user_role IS NULL;

ALTER TABLE users
  ALTER COLUMN user_role SET NOT NULL,
  ALTER COLUMN user_role SET DEFAULT 'guest';

CREATE INDEX IF NOT EXISTS idx_users_user_role ON users(user_role);
