# Project Vintage — Proposed Repository Structure

This is a proposal only. Do not create these folders until scaffolding begins.

## Directory Tree

```
project-vintage/
├── .env.example                        # All required env vars with placeholder values
├── .env.local                          # Local secrets (git-ignored)
├── .gitignore
├── README.md                           # GitHub front-door: what the project is, how to run it
├── middleware.ts                        # Next.js root middleware (auth session refresh)
├── CLAUDE.md                           # Project source of truth for Claude Code
├── ARCHITECTURE.md                     # This file
├── ARCHITECTURE_DECISIONS.md           # Architectural decision records
├── SCHEMA.md                           # Proposed database schema
├── next.config.ts
├── tsconfig.json                       # strict: true
├── tailwind.config.ts
├── postcss.config.ts
├── package.json
│
├── app/                                # Next.js 14 App Router
│   ├── layout.tsx                      # Root layout (fonts, Sentry, PostHog, analytics)
│   ├── page.tsx                        # Marketing homepage (Porsche-focused)
│   ├── globals.css
│   │
│   ├── (marketing)/                    # Route group: unauthenticated marketing pages
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   │
│   ├── (auth)/                         # Route group: sign-in, sign-up, forgot-password
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts               # Supabase Auth callback handler
│   │
│   ├── (app)/                          # Route group: authenticated app shell
│   │   ├── layout.tsx                  # App shell layout (nav, sidebar)
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── analyze/
│   │   │   └── page.tsx               # Paste-and-go: paste URL, get 15-second analysis
│   │   │
│   │   ├── search/                     # Listing search and comp filtering
│   │   │   ├── page.tsx
│   │   │   └── [listingId]/
│   │   │       └── page.tsx           # Individual listing detail + comp analysis
│   │   │
│   │   ├── garage/                     # User's saved vehicles
│   │   │   ├── page.tsx
│   │   │   └── [vehicleId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── alerts/                     # Saved searches and watched listings
│   │   │   └── page.tsx
│   │   │
│   │   └── account/
│   │       ├── page.tsx
│   │       └── billing/
│   │           └── page.tsx
│   │
│   └── api/                            # Route Handlers (server-side only)
│       ├── analyze/
│       │   └── route.ts               # POST a URL, returns ListingAnalysis
│       ├── webhooks/
│       │   ├── stripe/
│       │   │   └── route.ts
│       │   └── supabase/
│       │       └── route.ts
│       └── cron/                       # Vercel Cron job endpoints
│           └── scrape/
│               └── route.ts
│
├── components/                         # Shared UI components
│   ├── ui/                             # Primitives (button, input, modal, badge, etc.)
│   ├── listings/                       # Listing card, listing detail, comp table
│   ├── charts/                         # Price trend charts, distribution histograms
│   ├── garage/                         # Garage card, vehicle summary
│   └── layout/                         # Navbar, sidebar, footer
│
├── lib/                                # Core application logic (marque-agnostic unless noted)
│   │
│   ├── supabase/                       # Supabase client setup
│   │   ├── client.ts                   # Browser client (for Client Components)
│   │   ├── server.ts                   # Server client (for Server Components + Route Handlers)
│   │   ├── middleware.ts               # Auth session refresh middleware
│   │   └── types.ts                    # Generated database types (from supabase gen types)
│   │
│   ├── comp-engine/                    # Comparable sales and valuation engine
│   │   ├── types.ts                    # CompQuery, CompResult, ValuationRange types
│   │   ├── default.ts                  # Marque-agnostic comp logic (filter, score, aggregate)
│   │   ├── porsche.ts                  # Porsche-specific overrides: generation weights,
│   │   │                               #   option code premiums, color desirability,
│   │   │                               #   matching-numbers sensitivity, GT car adjustments
│   │   ├── ferrari.ts                  # Placeholder — do not implement until Ferrari launch
│   │   └── mercedes.ts                 # Placeholder — do not implement until Mercedes launch
│   │
│   ├── listing-parser/                 # On-demand URL parsing for the paste-and-go workflow.
│   │   │                               #   Distinct from scrapers/ (scheduled background jobs) but
│   │   │                               #   both share normalization logic via scrapers/normalize.ts.
│   │   ├── index.ts                    # parseListingUrl(url) → RawListing
│   │   ├── identify.ts                 # Identifies which platform a URL belongs to
│   │   ├── bring-a-trailer.ts          # BaT URL parser
│   │   ├── cars-and-bids.ts            # Cars & Bids URL parser
│   │   ├── pcarmarket.ts               # PCarMarket URL parser
│   │   ├── rm-sothebys.ts              # RM Sotheby's URL parser
│   │   ├── gooding.ts                  # Gooding & Company URL parser
│   │   └── mecum.ts                    # Mecum URL parser
│   │
│   ├── valuation/                      # Fair value estimation layer (calls comp-engine)
│   │   ├── index.ts                    # getValuation(vehicleSpec) → ValuationRange
│   │   └── confidence.ts               # Confidence scoring based on comp count and spread
│   │
│   ├── vin/                            # VIN decoding and validation
│   │   ├── index.ts
│   │   ├── porsche.ts                  # Porsche-specific VIN structure rules
│   │   └── generic.ts                  # WMI/VDS/VIS generic decode
│   │
│   ├── option-codes/                   # Option and color code verification
│   │   ├── porsche.ts                  # Validates Porsche option codes against generation
│   │   └── types.ts
│   │
│   ├── originality.ts                  # Originality flag detection: paint code mismatches,
│   │                                   #   option availability checks, description NLP heuristics.
│   │                                   #   Split into a folder if logic outgrows one file.
│   │
│   ├── stripe/
│   │   ├── client.ts
│   │   └── plans.ts                    # Plan definitions and feature gates
│   │
│   ├── resend/
│   │   └── client.ts
│   │
│   └── utils/
│       ├── currency.ts                 # Format and convert currencies
│       ├── mileage.ts                  # mi ↔ km conversion
│       └── date.ts
│
├── scrapers/                           # Listing scrapers — isolated from app/
│   ├── types.ts                        # RawListing type (pre-normalization)
│   ├── normalize.ts                    # Transforms RawListing → listings insert type
│   ├── runner.ts                       # Orchestrates scraper runs, deduplication, upsert
│   │
│   ├── bring-a-trailer.ts              # Bring a Trailer scraper
│   ├── cars-and-bids.ts                # Cars & Bids scraper
│   ├── pcarmarket.ts                   # PCarMarket scraper
│   ├── gooding.ts                      # Gooding & Company scraper
│   ├── mecum.ts                        # Mecum Auctions scraper
│   └── rm-sothebys.ts                  # RM Sotheby's scraper
│
├── emails/                             # Resend email templates (React Email)
│   ├── welcome.tsx
│   ├── alert-match.tsx                 # Saved search hit notification
│   └── weekly-digest.tsx
│
├── public/
│   ├── fonts/
│   └── images/
│
├── supabase/                           # Supabase local dev config
│   ├── config.toml
│   └── migrations/                     # SQL migration files (numbered)
│
└── tests/
    ├── comp-engine/
    │   ├── default.test.ts
    │   └── porsche.test.ts
    ├── scrapers/
    │   ├── normalize.test.ts
    │   └── fixtures/                   # Raw HTML/JSON fixtures for scraper tests
    └── originality/
        └── color.test.ts
```

## Key Separation Points

### Marque-Agnostic Core
- `app/` routing and page structure
- `lib/supabase/` — database client and generated types
- `lib/comp-engine/default.ts` — base valuation logic
- `lib/listing-parser/` — on-demand URL parsing for the paste-and-go workflow
- `lib/originality.ts` — originality flag detection
- `lib/valuation/` — orchestration layer
- `lib/vin/generic.ts`
- `scrapers/types.ts` and `scrapers/normalize.ts`
- All user-facing tables (`users`, `garages`, `vehicles`, `saved_searches`, `watched_listings`)

### Marque-Specific Code
- `lib/comp-engine/porsche.ts` — Porsche heuristics and adjustments
- `lib/vin/porsche.ts` — Porsche VIN rules
- `lib/option-codes/porsche.ts` — Porsche option/color code registry
- Porsche reference tables in the database (`porsche_color_codes`, `porsche_option_codes`, `porsche_generations`)
- Marketing copy and SEO metadata in `app/(marketing)/`

Adding a new marque means: adding `lib/comp-engine/<marque>.ts`, `lib/vin/<marque>.ts`, `lib/option-codes/<marque>.ts`, new reference tables, and populating them. The core schema and engine require no changes.
