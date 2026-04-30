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
-- content_status_t postgres enum — shared by porsche_generations and porsche_color_codes.
-- generation_editorial uses a TEXT column with a CHECK constraint (added in migration
-- 20260428090000) and is intentionally kept separate from this enum.
-- TODO (future): editorial drafts live in generation_editorial; on publish they are
-- promoted into porsche_generations.notes / notes_full. That promote-on-publish workflow
-- is out of scope for Phase 5 and will be implemented in a separate migration.
CREATE TYPE content_status_t AS ENUM ('draft', 'verified', 'published');

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
    content_status              content_status_t NOT NULL DEFAULT 'draft',
    created_at                  timestamptz NOT NULL DEFAULT now(),
    updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Porsche model generations with authoritative year ranges and editorial context.
-- Defined before porsche_option_codes due to FK dependency.
-- Phase 4 added: model_family text, production_count integer
-- Phase 5 added: notes_full, hero image columns, content_status, jsonb shape updates
CREATE TABLE porsche_generations (
    generation_id               text PRIMARY KEY,                   -- e.g., '964', '993', '996', '997.1', '997.2', '991.1', '991.2', '992'
    model                       text NOT NULL,                      -- e.g., '911', 'Boxster', 'Cayman'
    model_family                text,                               -- e.g., '911', '718', 'Cayenne' — groups generations for cross-gen queries
    year_start                  smallint NOT NULL,
    year_end                    smallint,                           -- Null if generation is current
    body_styles                 text[],                             -- e.g., ['Coupe', 'Cabriolet', 'Targa']
    engine_type                 text,                               -- 'Air-cooled', 'Water-cooled', 'Hybrid', etc.
    notes                       text,                               -- Short editorial summary for initial report card
    notes_full                  text,                               -- Long-form editorial prose for full report page
    hero_image_url              text,
    hero_image_caption          text,
    hero_image_license          text,
    production_count            integer,
    -- jsonb arrays: filter individual entries by their per-entry content_status at the
    -- APPLICATION LAYER (TypeScript, after fetch). Do not use generated columns or
    -- SQL-side jsonb filtering for V1 — keeps queries simple, avoids index overhead.
    common_issues               jsonb NOT NULL DEFAULT '[]',
    -- Element shape: { title: string, severity: 'low'|'moderate'|'high',
    --   mileage_threshold: integer|null, body: string,
    --   content_status: 'draft'|'verified'|'published' }
    period_reviews              jsonb NOT NULL DEFAULT '[]',
    -- Element shape: { publication: string, date: 'YYYY-MM', title: string,
    --   url: string|null, archive_url: string|null, summary: string,
    --   pull_quote: string|null, pull_quote_attribution: string|null,
    --   paywalled: boolean, content_status: 'draft'|'verified'|'published' }
    content_status              content_status_t NOT NULL DEFAULT 'draft',
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
-- Phase 4: user_id made nullable (anonymous analyses allowed for acquisition flow)
-- Phase 5: findings tracking, normalized confidence score, comp_count denormalization
CREATE TABLE listing_analyses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid REFERENCES users(id) ON DELETE CASCADE,        -- Nullable: anonymous analyses allowed
    listing_id      uuid REFERENCES listings(id) ON DELETE SET NULL,    -- Null until the listing is saved to our database
    source_url      text NOT NULL,
    source_platform text,
    analysis_data   jsonb NOT NULL,
    findings        jsonb NOT NULL DEFAULT '[]',
    -- Element shape: { rule_id: string, category: 'this_car'|'worth_asking'|'watch_closely',
    --   severity: 'positive'|'caution'|'concern', title: string, body: string,
    --   qualifier: string|null }
    finding_count   integer NOT NULL DEFAULT 0,
    confidence_score numeric(4,3)                                        -- 0.000–1.000 normalized scale; populated by comp engine V1.5+
                        CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)),
    comp_count      integer,                                             -- Denormalized from analysis_data.comps_used for fast filtering
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX listing_analyses_user_id_created_at_idx ON listing_analyses (user_id, created_at DESC);
CREATE INDEX listing_analyses_listing_id_idx         ON listing_analyses (listing_id) WHERE listing_id IS NOT NULL;
```

---

## Schema Expansion — Comp Engine V2 (2026-04-29)

All columns are nullable unless noted. Current state: all null (no extraction logic yet). Populated by Phase 2 enrichment jobs and updated scrapers.

### Additions to `listings`

#### Step 1 — Auction dynamics (migration `20260429060000`)

```sql
-- Added to listings:
bid_count              integer,             -- bids placed at auction close; scrapers when available
comment_count          integer,             -- page comment count (BaT engagement signal)
bid_to_buy_ratio       numeric(10,4),       -- high_bid / asking_price; null when no BIN price
final_to_reserve_ratio numeric(10,4),       -- final_price / reserve estimate; null when reserve unknown

-- Already existed (NOT added again):
--   listed_at        timestamptz  (migration 20260429040000)
--   days_on_market   integer      (migration 20260429040000)
--   auction_ends_at  timestamptz  (migration 20260428040000) — serves as sold_at
```

#### Step 2 — Vehicle attributes (migration `20260429070000`)

```sql
-- Added to listings:
trim_category   text,   -- normalized grouping (GT3, Turbo, Carrera, Targa);
                        --   distinct from raw trim text; used by comp engine
country_of_sale text,   -- ISO 3166-1 alpha-2 (US, UK, DE); affects comp weighting
```

#### Step 3 — Condition & originality signals (migration `20260429080000`)

```sql
-- Added to listings (all nullable, Phase 2 extraction):
condition_signal text
  check (condition_signal in ('concours','excellent','good','driver','project')),
paint_signal     text
  check (paint_signal in ('original','repaint_partial','repaint_full','unknown')),
interior_signal  text
  check (interior_signal in ('original','refurbished','replaced')),
numbers_matching boolean,   -- engine/gearbox serial numbers match factory VIN
mod_status       text
  check (mod_status in ('stock','light_reversible','heavy','unknown')),
```

#### Step 4 — Documentation & provenance signals (migration `20260429090000`)

```sql
-- Added to listings (all nullable):
has_porsche_coa     boolean,   -- Certificate of Authenticity from Porsche AG
has_kardex          boolean,   -- factory build record from Porsche Archives
has_service_records boolean,   -- Phase 2 structured flag (see note on service_history_present)
has_window_sticker  boolean,   -- Monroney / delivery sticker
has_owners_manual   boolean,   -- original owners manual
owner_count         integer,   -- normalized count (see note on ownership_count)
documentation_score integer,   -- derived 0–6 sum of above flags; future scoring job
```

**Overlap notes:**
- `has_service_records` is distinct from existing `service_history_present boolean` (base schema). The base column is set by scraper-level detection; the new column is the Phase 2 enrichment signal. May consolidate in a future migration.
- `owner_count integer` is distinct from existing `ownership_count smallint` (base schema). Same relationship — Phase 2 normalized value alongside the original scraper field.

#### Step 5 — Factory options (migration `20260429100000`)

```sql
-- Added to listings (all nullable):
factory_options    text[],    -- normalized factory option codes (marque-agnostic);
                              --   e.g., ['M637','030','220']; distinct from raw options jsonb
has_x50_powerkit   boolean,   -- Porsche M637 / X50 GT powerkit (Porsche-specific convenience)
has_aero_kit       boolean,   -- Porsche factory aero package
has_sport_seats    boolean,   -- Porsche factory sport/bucket seats
is_paint_to_sample boolean,   -- Paint-to-Sample special order color
```

**Architecture note:** `factory_options text[]` is marque-agnostic. The four BOOLEAN convenience columns are Porsche-specific denormalizations stored alongside the generic array per the core architectural rule ("build data as if for all cars"). Adding Ferrari convenience flags later requires only new columns; no schema change on `factory_options`.

---

### New table: `market_snapshots` (migration `20260429110000`)

Periodic market aggregations per (generation, trim, date). Written by background aggregation jobs; read by comp engine and market trends UI.

```sql
CREATE TABLE market_snapshots (
  id                    uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id         text,                    -- nullable; matches porsche_generations.generation_id
  trim_category         text,                    -- nullable; matches listings.trim_category
  snapshot_date         date         NOT NULL,   -- date of aggregation (daily or weekly)
  active_listing_count  integer,                 -- unsold listings as of snapshot_date
  sold_count_30d        integer,                 -- sold in 30-day window ending snapshot_date
  median_price_30d      bigint,                  -- median final_price cents in 30-day window
  median_dom_30d        integer,                 -- median days_on_market in 30-day window
  sell_through_rate_30d numeric(5,4)             -- sold_count / (sold + active); 0.0000–1.0000
    check (sell_through_rate_30d is null
           or (sell_through_rate_30d >= 0 and sell_through_rate_30d <= 1))
);

-- Primary access pattern: all snapshots for a (generation, trim) pair ordered by date
CREATE INDEX market_snapshots_gen_trim_date_idx
  ON market_snapshots (generation_id, trim_category, snapshot_date DESC);
```

**RLS:** enabled. `market_snapshots_public_read` policy allows anon + authenticated SELECT. `service_role` has ALL.

---

## Schema Expansion — Comp Engine V2 (2026-04-30)

Migrations `20260430000000` through `20260430040000`. All columns on `listings` are nullable unless noted. All new tables have RLS enabled.

### New columns on `listings` (migration `20260430000000`)

**Comp engine V2 inputs — identity & classification**
```sql
generation_id             text,            -- normalized generation key matching porsche_generations.generation_id (e.g. '993', '996.1')
trim_category             text,            -- normalized trim grouping for comp matching (e.g. 'carrera_2_narrow', 'gt3', 'turbo_base')
trim_variant              text,            -- sub-variant within trim_category (e.g. 'x50', 'sport_classic')
market_region             text,            -- 'US' | 'EU' | 'UK' | 'ROW' — affects comp weighting
body_style_normalized     text,            -- canonical body_style: 'coupe' | 'cabriolet' | 'targa' | 'speedster'
drivetrain_normalized     text,            -- canonical: 'RWD' | 'AWD'
transmission_variant      text,            -- 'manual' | 'pdk' | 'tiptronic' | 'g50' | 'getrag'
```

**Comp engine V2 inputs — factory options & spec**
```sql
is_paint_to_sample        boolean,         -- PTS (paint-to-sample / Sonderwunsch) flag
seats_type                text,            -- 'standard' | 'sport' | 'sport_plus' | 'bucket'
wheels_factory_correct    boolean,         -- true if listing shows factory-correct wheels
interior_color_rarity     text,            -- 'common' | 'uncommon' | 'rare' — from porsche_color_codes lookup
factory_options_normalized text[],         -- normalized array of factory option codes (e.g. ['M220','M637'])
has_x50_powerkit          boolean,         -- Porsche M637 X50/GT powerkit
has_aero_kit              boolean,         -- factory aero package
has_sport_seats           boolean,         -- factory sport/bucket seats
```

**Comp engine V2 inputs — condition signals (V1 stub)**
```sql
paint_meter_max_microns   integer,         -- worst paint meter reading in µm; <150 original, ≥300 repainted
accident_history_stated   text            -- 'none_stated' | 'minor_stated' | 'major_stated' | 'unknown'
                            check (accident_history_stated in ('none_stated','minor_stated','major_stated','unknown')),
listing_photo_count       integer,         -- total photos on listing page; proxy for documentation quality
is_featured_listing       boolean,         -- BaT featured listing flag; correlates with higher presentation quality
```

**Comp engine V2 inputs — provenance**
```sql
consignor_type            text,            -- 'dealer' | 'private' | 'auction_house' | 'unknown'
mechanical_remediation_status text,        -- 'none' | 'minor' | 'major' | 'unknown'
                            check (mechanical_remediation_status in ('none','minor','major','unknown')),
cross_listing_group_id    text,            -- groups the same physical car across platforms for deduplication
```

**Comp engine V2 — editorial control**
```sql
is_comp_resistant         boolean NOT NULL DEFAULT false,  -- editorial flag: exclude from ALL comp pools
                                                            -- returns "this car is uncomparable" verdict when set
```

**Expanded condition & provenance signals (Phase 1 overnight)**
```sql
-- Condition
condition_signal          text check (condition_signal in ('concours','excellent','good','driver','project','unknown')),
paint_signal              text check (paint_signal in ('original','repaint_partial','repaint_full','unknown')),
interior_signal           text check (interior_signal in ('original','restored','modified','unknown')),
numbers_matching          boolean,
mod_status                text check (mod_status in ('stock','light_reversible','heavy','unknown','period_correct_enhanced')),
-- Documentation
has_porsche_coa           boolean,         -- Certificate of Authenticity from Porsche AG
has_kardex                boolean,         -- factory build record from Porsche Archives
has_service_records       boolean,         -- structured flag (distinct from service_history_present)
has_window_sticker        boolean,
has_owners_manual         boolean,
owner_count               integer,         -- normalized integer (distinct from ownership_count smallint)
documentation_score       integer,         -- derived 0–6 sum of documentation flags
-- Auction dynamics
bid_count                 integer,
comment_count             integer,
bid_to_buy_ratio          numeric(10,4),
final_to_reserve_ratio    numeric(10,4),
-- Vehicle attributes
country_of_sale           text,
-- Factory options (additional)
factory_options           text[],          -- marque-agnostic array of raw option codes
has_tool_kit_complete     boolean,
```

### New table: `trim_taxonomy` (migration `20260430010000`)

Editorial configuration: which trim categories exist per generation and whether they form a separate market (i.e. only comp against themselves).

```sql
CREATE TABLE trim_taxonomy (
  generation    text NOT NULL,          -- matches porsche_generations.generation_id
  trim_category text NOT NULL,          -- matches listings.trim_category
  is_separate_market boolean NOT NULL DEFAULT false,
                                        -- true → comps restricted to same trim_category
  production_count integer,             -- optional reference figure
  PRIMARY KEY (generation, trim_category)
);
```

**RLS:** enabled. Public SELECT for all authenticated users.

Seeded for gen='993' (16 rows): `carrera_2_narrow`, `carrera_4_narrow`, `carrera_s_wide`, `carrera_4s_wide`, `targa`, `turbo_base`, `turbo_x50`, `turbo_s` (separate), `turbo_look_m491`, `rs_touring` (separate), `rs_clubsport` (separate), `gt2` (separate), `gt2_evo` (separate), `speedster` (separate), `cup` (separate), `supercup` (separate).

### New table: `generation_weight_config` (migration `20260430020000`)

Generation-specific similarity factor weights for the comp engine. Editable without code deploys.

```sql
CREATE TABLE generation_weight_config (
  generation  text NOT NULL,            -- matches porsche_generations.generation_id; 'default' = fallback
  factor_name text NOT NULL,            -- one of 10 factor names (see lib/comp-engine-v2/types.ts)
  weight      numeric(4,3) NOT NULL     -- 0.000–1.000; all weights for a generation must sum to 1.0
                check (weight >= 0 and weight <= 1),
  PRIMARY KEY (generation, factor_name)
);
```

**RLS:** enabled. Public SELECT. Seeded: `993` (10 factors, sum=1.0), `996.1` (mechanical=0.15, transmission=0.15 variants), `default` (copy of 993).

**993 weights:** mileage=0.30, condition_stub=0.15, year=0.10, trim_variant=0.10, market_region=0.10, spec_composite=0.10, transmission_variant=0.05, color_rarity=0.05, consignor_tier=0.05, mechanical_remediation=0.00.

### New table: `generation_mileage_bands` (migration `20260430030000`)

Per-generation mileage band definitions. The similarity matrix is fixed in code; only band boundaries are configurable here.

```sql
CREATE TABLE generation_mileage_bands (
  generation text NOT NULL,             -- matches porsche_generations.generation_id; 'default' = fallback
  band_name  text NOT NULL,             -- 'ultra_low' | 'low' | 'moderate' | 'high' | 'very_high'
  min_miles  integer NOT NULL,          -- inclusive lower bound
  max_miles  integer,                   -- NULL = unbounded upper; otherwise exclusive
  PRIMARY KEY (generation, band_name)
);
```

**RLS:** enabled. Public SELECT. Seeded: `993` (5 bands), `default` (copy of 993).

**993 bands:** ultra_low(1000–5000), low(5000–25000), moderate(25000–75000), high(75000–125000), very_high(125000–∞).

### New table: `comp_engine_runs` (migration `20260430040000`)

Prediction audit log. Every comp engine V2 execution writes one row. Powers backtesting and drift detection.

```sql
CREATE TABLE comp_engine_runs (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  subject_listing_id   uuid references listings(id),   -- nullable for synthetic/backtest subjects
  subject_data         jsonb NOT NULL,                 -- snapshot of V2Subject at run time
  model_version        text NOT NULL,                  -- e.g. 'v1.0' — bumped on every logic/weight change
  generation_used      text,
  weights_json         jsonb,                          -- GenerationWeights snapshot
  comps_used_json      jsonb,                          -- array of ScoredComp
  predicted_median_cents bigint,
  predicted_p25_cents  bigint,
  predicted_p75_cents  bigint,
  confidence_score     numeric(5,2) check (confidence_score between 0 and 100),
  methodology_text     text,
  actual_price_cents   bigint,                         -- populated for backtest rows
  was_backtest         boolean NOT NULL DEFAULT false,
  verdict              text check (verdict in ('value_estimate','no_comps','comp_resistant','error'))
);
```

**RLS:** enabled. `authenticated` SELECT gated on `role IN ('admin', 'beta')` via `auth.jwt() ->> 'app_role'`.

**Indexes:** `(subject_listing_id)`, `(model_version, created_at DESC)`, `(was_backtest, created_at DESC)`.

---

## Notes

- All monetary amounts are stored as integers in the smallest currency unit (cents for USD, pence for GBP) to avoid floating-point rounding errors. The application layer handles display formatting.
- `options` and `modifications` on `listings` and `vehicles` use `jsonb` rather than junction tables because option codes are highly marque-specific and their schemas differ too much to normalize into a generic junction table without collapsing all structure.
- RLS policies are not written here — they will be defined in numbered migration files under `supabase/migrations/` and cover: users can only read/write their own rows in `garages`, `vehicles`, `saved_searches`, and `watched_listings`; `listings` is readable by all authenticated users (and potentially public for SEO purposes); Porsche reference tables are read-only for all authenticated users.
- The `porsche_option_codes` primary key is `(code, generation_id)` as a composite because the same code string was reused across generations for different options. `porsche_generations` must be created before `porsche_option_codes` in migrations due to the FK dependency.
- Vehicle photos are deferred to V1.5. A `vehicle_photos` table will be added in a later migration; the planned shape is `(id, vehicle_id, r2_object_key, is_cover, sort_order, created_at)`.
- The `listing_analyses` table is the system of record for free-tier rate limiting. Server-side checks must count rows in `listing_analyses` for the user in the current calendar month before allowing a new analysis on the free tier.
- A `subscription_grants` table is planned for V1.5 to support manual comps (e.g., founding collectors, PCA partnerships, promotional codes). Planned shape: `(id, user_id, granted_tier, granted_by, reason, starts_at, ends_at, created_at)`. Until that exists, comps are handled by directly setting `subscription_tier` and `trial_ends_at` on the user record.
