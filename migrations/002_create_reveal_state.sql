-- Create reveal_state table to track whether dad and mom have revealed
CREATE TABLE IF NOT EXISTS reveal_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dad_revealed BOOLEAN NOT NULL DEFAULT false,
  mom_revealed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO reveal_state (dad_revealed, mom_revealed)
SELECT false, false
WHERE NOT EXISTS (SELECT 1 FROM reveal_state);
