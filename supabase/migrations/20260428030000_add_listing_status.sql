ALTER TABLE listings
  ADD COLUMN listing_status TEXT
  CHECK (listing_status IN ('live', 'sold', 'no-sale', 'unknown'));
