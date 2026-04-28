# Project Vintage — Proposed Database Schema

These are proposed `CREATE TABLE` statements for review. Do not execute against any database until approved.

All tables use `uuid` primary keys and include `created_at` / `updated_at` timestamps where appropriate. Row-level security (RLS) must be enabled on all user-facing tables before they are exposed to the client.

---

## Core Listing Data (Marque-Agnostic)

```sql
-- Canonical listing record. One row per listing per source platform.
-- Deduplication across platforms happens at the application layer using VIN + spec matching.
CREATE TABLE listings (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source platform metadata
    source_platform         text NOT NULL                           -- 'bring-a-trailer' | 'cars-and-bids' | 'pcarmarket' | 'rm-sothebys' | 'gooding' | 'mecum' | 'collecting-cars' | 'hemmings' | 'bonhams' | 'barrett-jackson'
                                CHECK (source_platform IN ('bring-a-trailer', 'cars-and-bids', 'pcarmarket', 'rm-sothebys', 'gooding', 'mecum', 'collecting-cars', 'hemmings', 'bonhams', 'barrett-jackson')),
    source_url              text NOT NULL,
    source_listing_id       text NOT NULL,                          -- Platform's own ID for the listing

    -- Vehicle identity
    vin                     text                                    -- Pre-1981 vehicles may have shorter VINs; 17 chars is the modern standard.
                                CHECK (vin IS NULL OR char_length(vin) <= 17),
    make                    text NOT NULL,                          -- 'Porsche', 'Ferrari', etc.
    model                   text NOT NULL,                          -- '911', '356', 'Cayman', etc.
    generation              text,                                   -- '964', '993', '996', '997', '991', '992', etc.
    trim                    text,                                   -- 'Carrera', 'Carrera S', 'GT3', 'Turbo S', etc.
    body_style              text,                                   -- 'Coupe', 'Cabriolet', 'Targa', 'Speedster', etc.
    year                    smallint NOT NULL                       CHECK (year BETWEEN 1900 AND 2030),

    -- Mechanical spec
    mileage                 integer,
    mileage_unit            text NOT NULL DEFAULT 'mi'              CHECK (mileage_unit IN ('mi', 'km')),
    transmission            text,                                   -- 'Manual' | 'PDK' | 'Automatic' | 'Tiptronic'
    drivetrain              text,                                   -- 'RWD' | 'AWD' | '4WD'
    engine_displacement_cc  integer,                                -- In cc for consistency across markets

    -- Color and trim
    exterior_color          text,                                   -- Human-readable color name from listing
    exterior_color_code     text,                                   -- Manufacturer paint code (e.g., 'L80K', 'G1')
    interior_color          text,
    interior_material       text,                                   -- 'Leather' | 'Alcantara' | 'Half-leather' | etc.

    -- Options and modifications (flexible jsonb to avoid rigid marque-specific columns)
    options                 jsonb NOT NULL DEFAULT '[]',            -- Array of option code strings or descriptive strings
    modifications           jsonb NOT NULL DEFAULT '[]',            -- Array of {description, category, reversible} objects

    -- History signals
    service_history_present boolean,                                -- Null if unknown; true if records mentioned
    ownership_count         smallint,                               -- Null if unknown

    -- Listing lifecycle
    listed_date             date,
    ended_date              date,
    status                  text NOT NULL DEFAULT 'active'          CHECK (status IN ('active', 'sold', 'no_sale', 'withdrawn')),
    listing_status          text                                    CHECK (listing_status IN ('live', 'sold', 'no-sale', 'unknown')),  -- Parsed from page: 'live' | 'sold' | 'no-sale' | 'unknown'

    -- Pricing
    asking_price            integer,                                -- In smallest currency unit (cents for USD)
    high_bid                integer,                                -- Highest bid reached at auction (cents)
    final_price             integer,                                -- Hammer price / final sale price (cents)
    reserve_met             boolean,                                -- Null for fixed-price listings
    currency                text NOT NULL DEFAULT 'USD'             CHECK (char_length(currency) = 3),

    -- Raw data preservation for re-processing
    raw_description         text,
    raw_html_snapshot_key   text,                                   -- R2 object key for stored HTML snapshot

    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now(),

    UNIQUE (source_platform, source_listing_id)
);

CREATE INDEX listings_make_idx         ON listings (make);
CREATE INDEX listings_make_model_idx   ON listings (make, model);
CREATE INDEX listings_generation_idx   ON listings (make, generation);
CREATE INDEX listings_year_idx         ON listings (year);
CREATE INDEX listings_status_idx       ON listings (status);
CREATE INDEX listings_final_price_idx  ON listings (final_price) WHERE final_price IS NOT NULL;
CREATE INDEX listings_vin_idx          ON listings (vin) WHERE vin IS NOT NULL;
CREATE INDEX listings_updated_at_idx   ON listings (updated_at DESC);
```

---

## Porsche Reference Tables (Marque-Specific)

```sql
-- Porsche factory paint codes with generation applicability.
-- Used for color-code verification and rarity scoring.
CREATE TABLE porsche_color_codes (
    paint_code                  text PRIMARY KEY,                   -- e.g., 'L80K', 'M2U', 'GT1'
    color_name                  text NOT NULL,                      -- e.g., 'Guards Red', 'Midnight Blue Metallic'
    color_family                text,                               -- 'Red' | 'Blue' | 'Green' | 'Silver' | etc.
    finish_type                 text,                               -- 'Solid' | 'Metallic' | 'Special'
    generation_applicability    text[],                             -- Array of generation IDs where this code is valid
    is_special_order            boolean NOT NULL DEFAULT false,     -- Paint-to-Sample or special program
    rarity                      text                                CHECK (rarity IN ('common', 'uncommon', 'rare', 'very_rare')),
    notes                       text,
    created_at                  timestamptz NOT NULL DEFAULT now(),
    updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Porsche model generations with authoritative year ranges and editorial context.
-- Defined before porsche_option_codes due to FK dependency.
CREATE TABLE porsche_generations (
    generation_id               text PRIMARY KEY,                   -- e.g., '964', '993', '996', '997.1', '997.2', '991.1', '991.2', '992'
    model                       text NOT NULL,                      -- e.g., '911', 'Boxster', 'Cayman'
    year_start                  smallint NOT NULL,
    year_end                    smallint,                           -- Null if generation is current
    body_styles                 text[],                             -- e.g., ['Coupe', 'Cabriolet', 'Targa']
    engine_type                 text,                               -- 'Air-cooled', 'Water-cooled', 'Hybrid', etc.
    notes                       text,                               -- Editorial notes on the generation's significance
    common_issues               jsonb,                              -- Array of {issue, severity, mileage_threshold} objects
    period_reviews              jsonb,                              -- Array of {publication, year, summary, url} objects
    created_at                  timestamptz NOT NULL DEFAULT now(),
    updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Porsche factory option codes with generation applicability.
-- Used for option verification and comp engine weighting.
-- Same option code can mean different things across generations, so the primary key is the (code, generation_id) pair. One row per code per generation.
CREATE TABLE porsche_option_codes (
    code              text NOT NULL,
    generation_id     text NOT NULL REFERENCES porsche_generations(generation_id),
    description       text NOT NULL,
    category          text,
    affects_value     boolean NOT NULL DEFAULT false,
    desirability      text CHECK (desirability IN ('negative', 'neutral', 'positive', 'highly_positive')),
    notes             text,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (code, generation_id)
);
CREATE INDEX porsche_option_codes_generation_idx ON porsche_option_codes (generation_id);
```

---

## User-Facing Tables (Marque-Agnostic)

```sql
-- Users. Mirrors Supabase Auth users; extended profile data lives here.
-- auth.users is managed by Supabase. This table is a 1:1 extension.
CREATE TABLE users (
    id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email               text NOT NULL UNIQUE,
    display_name        text,
    avatar_url          text,
    subscription_tier       text NOT NULL DEFAULT 'free'    CHECK (subscription_tier IN ('free', 'pro', 'collector')),          -- Tiers per CLAUDE.md: free, pro ($29/mo), collector ($99/mo). pro_grade dealer tier added in Year 2.
    subscription_status     text NOT NULL DEFAULT 'active'  CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'paused')),  -- Mirrors Stripe subscription status. Updated by the Stripe webhook handler.
    trial_ends_at           timestamptz,                                                                                                               -- Null if not in trial. Set when granting a trial. Application logic must downgrade tier when this passes if the user has not converted to paid.
    subscription_period_end timestamptz,                                                                                                               -- When the user cancels, tier stays at the paid level until this date, then downgrades to free. Set from Stripe webhooks.
    stripe_customer_id      text UNIQUE,
    onboarding_complete boolean NOT NULL DEFAULT false,
    preferred_currency  text NOT NULL DEFAULT 'USD'     CHECK (char_length(preferred_currency) = 3),
    preferred_mileage   text NOT NULL DEFAULT 'mi'      CHECK (preferred_mileage IN ('mi', 'km')),
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

-- A user's garage: vehicles they own, have owned, or are actively tracking.
CREATE TABLE garages (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        text NOT NULL DEFAULT 'My Garage',
    is_default  boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),

    UNIQUE (user_id, name)
);
CREATE UNIQUE INDEX garages_one_default_per_user_idx ON garages (user_id) WHERE is_default = true; -- Enforces at most one default garage per user.

-- Individual vehicles in a garage.
CREATE TABLE vehicles (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    garage_id       uuid NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- Denormalized for RLS

    -- Vehicle spec (mirrors listings schema for comp matching)
    vin             text,
    make            text NOT NULL,
    model           text NOT NULL,
    generation      text,
    trim            text,
    body_style      text,
    year            smallint NOT NULL,
    mileage         integer,
    mileage_unit    text NOT NULL DEFAULT 'mi'  CHECK (mileage_unit IN ('mi', 'km')),
    transmission    text,
    exterior_color  text,
    exterior_color_code text,
    interior_color  text,
    options         jsonb NOT NULL DEFAULT '[]',
    modifications   jsonb NOT NULL DEFAULT '[]',

    -- Ownership metadata
    purchase_price    integer,                    -- What the user paid (cents)
    purchase_date     date,
    purchase_currency text DEFAULT 'USD'          CHECK (char_length(purchase_currency) = 3),  -- Currency the user paid in; may differ from preferred_currency on the user.
    ownership_status  text NOT NULL DEFAULT 'owned'  CHECK (ownership_status IN ('owned', 'sold', 'wanted')),
    notes           text,

    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vehicles_user_id_idx   ON vehicles (user_id);
CREATE INDEX vehicles_garage_id_idx ON vehicles (garage_id);
CREATE INDEX vehicles_make_idx      ON vehicles (make, model, year);

-- Saved searches. When a new listing matches, the user gets an alert.
CREATE TABLE saved_searches (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    label           text,                                   -- User-defined name for the search

    -- Filter criteria stored as flexible jsonb
    -- Schema: { make, model, generation, year_min, year_max, mileage_max, transmission,
    --           price_min, price_max, exterior_color_codes[], option_codes[], platforms[] }
    filters         jsonb NOT NULL DEFAULT '{}',

    alert_enabled   boolean NOT NULL DEFAULT true,
    alert_frequency text NOT NULL DEFAULT 'immediate'       CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
    last_alerted_at timestamptz,

    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX saved_searches_user_id_idx     ON saved_searches (user_id);
CREATE INDEX saved_searches_filters_gin_idx ON saved_searches USING gin (filters); -- GIN index on filters jsonb to make 'find saved searches matching this new listing' fast.

-- Watched listings. A user bookmarks a specific listing to track price changes or revisit.
CREATE TABLE watched_listings (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id      uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

    notes           text,                                   -- User's private notes on this listing
    notify_on_close boolean NOT NULL DEFAULT true,          -- Alert when listing ends

    created_at      timestamptz NOT NULL DEFAULT now(),

    UNIQUE (user_id, listing_id)
);

CREATE INDEX watched_listings_user_id_idx    ON watched_listings (user_id);
CREATE INDEX watched_listings_listing_id_idx ON watched_listings (listing_id);

-- Records every paste-and-go analysis a user runs.
-- Required to enforce the free-tier 3-per-month limit and to cache results.
CREATE TABLE listing_analyses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id      uuid REFERENCES listings(id) ON DELETE SET NULL,    -- Null until the listing is saved to our database
    source_url      text NOT NULL,
    source_platform text,
    analysis_data   jsonb NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX listing_analyses_user_id_created_at_idx ON listing_analyses (user_id, created_at DESC);
CREATE INDEX listing_analyses_listing_id_idx         ON listing_analyses (listing_id) WHERE listing_id IS NOT NULL;
```

---

## Notes

- All monetary amounts are stored as integers in the smallest currency unit (cents for USD, pence for GBP) to avoid floating-point rounding errors. The application layer handles display formatting.
- `options` and `modifications` on `listings` and `vehicles` use `jsonb` rather than junction tables because option codes are highly marque-specific and their schemas differ too much to normalize into a generic junction table without collapsing all structure.
- RLS policies are not written here — they will be defined in numbered migration files under `supabase/migrations/` and cover: users can only read/write their own rows in `garages`, `vehicles`, `saved_searches`, and `watched_listings`; `listings` is readable by all authenticated users (and potentially public for SEO purposes); Porsche reference tables are read-only for all authenticated users.
- The `porsche_option_codes` primary key is `(code, generation_id)` as a composite because the same code string was reused across generations for different options. `porsche_generations` must be created before `porsche_option_codes` in migrations due to the FK dependency.
- Vehicle photos are deferred to V1.5. A `vehicle_photos` table will be added in a later migration; the planned shape is `(id, vehicle_id, r2_object_key, is_cover, sort_order, created_at)`.
- The `listing_analyses` table is the system of record for free-tier rate limiting. Server-side checks must count rows in `listing_analyses` for the user in the current calendar month before allowing a new analysis on the free tier.
- A `subscription_grants` table is planned for V1.5 to support manual comps (e.g., founding collectors, PCA partnerships, promotional codes). Planned shape: `(id, user_id, granted_tier, granted_by, reason, starts_at, ends_at, created_at)`. Until that exists, comps are handled by directly setting `subscription_tier` and `trial_ends_at` on the user record.
