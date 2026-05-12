-- Research records — persisted form submissions from /research
-- ID is a 16-char hex string derived from a UUID (URL-safe, no hyphens).

CREATE TABLE research_records (
  id           TEXT PRIMARY KEY DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 16),
  year         INTEGER NOT NULL,
  model        TEXT    NOT NULL,
  trim         TEXT    NOT NULL,
  mileage      INTEGER,
  asking_price_cents BIGINT,
  transmission TEXT,
  exterior_color     TEXT,
  interior_color     TEXT,
  vin          TEXT,
  -- Derived at write time so the result page never has to re-derive
  generation_id TEXT,
  drivetrain    TEXT,
  body_style    TEXT,
  cooling       TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Result pages are publicly readable (no auth required)
ALTER TABLE research_records ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON research_records TO anon, authenticated;
GRANT INSERT ON research_records TO anon, authenticated;

CREATE POLICY "research_records_public_read"
  ON research_records FOR SELECT USING (true);

-- INSERT via the /api/research route; anon role needs INSERT access through PostgREST
CREATE POLICY "Public can insert research_records"
  ON research_records FOR INSERT WITH CHECK (true);
