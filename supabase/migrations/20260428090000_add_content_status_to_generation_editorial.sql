-- Draft/verified/published workflow for generation_editorial.
-- Content must be explicitly promoted to 'verified' before surfacing on the analyze page.
ALTER TABLE generation_editorial
  ADD COLUMN content_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (content_status IN ('draft', 'verified', 'published'));

CREATE INDEX IF NOT EXISTS generation_editorial_content_status_idx
  ON generation_editorial (content_status);
