-- Create wishes table to store prayer/wish form submissions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  gender TEXT,
  prayer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
