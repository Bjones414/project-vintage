# Project Vintage — Product State

**Last updated:** 2026-05-07 (rebuilt from CLAUDE.md + ARCHITECTURE.md + SCHEMA.md)
**Source of truth for Claude sessions. Sections marked [VERIFY] should be confirmed against live repo/DB.**

---

## What It Is

Project Vintage is a SaaS analytics platform for collector car enthusiasts. It answers two questions every serious buyer and seller has:

1. **What is it worth?** — comparable sales, fair value estimation, price trend analysis
2. **Is it real?** — originality assessment, condition flags, specification verification, VIN history

**Launches Porsche-only. Architected from day one to expand to Ferrari, Mercedes, BMW, Alfa Romeo, etc. without structural rework.** Core data layer and engine are marque-agnostic. Content and marketing are Porsche-focused until a second marque is fully supported.

> **Core architectural rule:** Build data and infrastructure as if for all collector cars. Build content and marketing as if only for Porsche.

---

## Brand Foundation — Do Not Lose This

The product's origin story centers on the founder's father: a serious Porsche collector with seven Porsches. Project Vintage is built in honor of him. This is not a marketing angle — it is the emotional core of the product.

**Founding Collectors wall:** Curated wall of founding collectors. The founder's father is #1. Permanent, honored place in the product — not a promotional feature.

**The [Dad's Name] Test:** Every Porsche listing analysis runs through a curated evaluation checklist attributed to the founder's father. The checklist carries his name and is presented as his standard, not algorithmic output. Name TBD — use `[Dad's Name]` as placeholder until confirmed.

**Explicitly rejected — AI persona named after the founder's dad.** Do not propose in any form. Reasons: hallucination risk damages the tribute; named AI personas read as gimmicky to a wealthy collector audience; naming a chatbot after him caps the tribute at "feature" rather than brand foundation. The tribute lives in the checklist, the Founding Collectors wall, and the origin story.

---

## People

- **Blake** — solo non-developer founder. Builds with Claude desktop (strategy/review), Claude Code CLI (builder), Cursor (direct file edits).
- **Blake's dad** — Porsche domain expert. Reviews editorial content for voice and accuracy. Signs off on defect catalog records.

**Workflow rule:** Never paste into Claude Code without discussing in this chat first.

---

## Two-Pillar Product Thesis

### Pillar 1 — What Is It Worth?
- Aggregated auction results from BaT, Cars & Bids, PCarMarket, Classic.com, RM Sotheby's, and others
- Comparable sales filtered by year, model, generation, transmission, color, options, mileage
- Fair value range (low / median / high) with confidence scoring
- Price trend visualization (rolling 90-day, 1-year, 3-year)
- Reserve-met vs. no-sale rate by spec

### Pillar 2 — Is It Real?
- Option code and color code verification vs. claimed spec
- Originality flags: aftermarket wheels, non-factory colors, engine/gearbox swaps
- Service history signal detection from listing descriptions
- Ownership count and listing history across platforms
- VIN structure validation and partial decode

---

## Roadmap Phases

### V1 — The Core Loop (current focus)
- Paste any auction URL → structured analysis in ~15 seconds
- Comparable sales, fair-value verdict (low/median/high), condition flags, generation context
- VIN decode, Porsche color and option code lookup
- Save listings to a watchlist

### V1.5 — Garage
- Add owned cars to a personal garage with live valuations
- Photo upload and storage (Cloudflare R2)
- Maintenance tracking
- Document vault (title, service records, insurance)
- Originality flags from uploaded photos
- `subscription_grants` table for founding collector comps and PCA partnerships

### V2 — Platform
- Saved-search alerts across platforms
- Dealer inventory feed
- Vendor directory
- Lifestyle and commerce layer
- **Marque expansion beyond Porsche**

---

## Pricing Tiers

| Tier | Price | Included |
|---|---|---|
| Free | $0 | 3 analyses/month, 1 saved alert, basic comps |
| Pro | $29/month | Unlimited analyses, unlimited alerts, full comp engine, VIN history |
| Collector | $99/month | Garage, insurance docs, portfolio tracking, pre-list alerts, advanced trends |
| Pro-grade | $200–500/month | Dealer/broker tier — Year 2 |

**Critical rule:** Feature gating enforced server-side. `subscription_tier` in Supabase is the authority. Never rely on client-side state or JWT claim alone — always verify against DB on the server.

The `listing_analyses` table is the system of record for free-tier rate limiting. Count rows per user per calendar month before allowing a new analysis on the free tier.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Cloudflare R2 (photos, HTML snapshots) |
| App Hosting | Vercel (auto-deploy on push to main) |
| Scraping | Apify (~$50–100/month; bring in-house Year 2 if economics warrant) |
| Email | Resend |
| Payments | Stripe |
| Error Tracking | Sentry |
| Analytics | PostHog |
| Mobile | PWA — no React Native or native iOS/Android in V1 |

**Repo:** github.com/Bjones414/project-vintage (private)
**Local:** `C:\Users\blake\projects\project-vintage`

---

## Data Sources

### Approved to scrape or integrate
Bring a Trailer, Cars & Bids, PCarMarket, Collecting Cars, Hemmings, RM Sotheby's, Gooding & Company, Mecum, Bonhams, Barrett-Jackson, NHTSA vPIC (VIN decode), Rennbow (Porsche color reference)

### Explicitly NOT data dependencies — these are competitors
Hagerty Valuation Tools, Classic.com, Sports Car Market, Carfax, AutoCheck, Kelley Blue Book, Edmunds

Do not propose architecture requiring competitor data. Solve with our own scraped auction history instead.

---

## Repo Structure

```
app/
  layout.tsx                    # Root layout (fonts, Sentry, PostHog)
  page.tsx                      # Marketing homepage (Porsche-focused)
  (marketing)/                  # about/, pricing/, blog/[slug]/
  (auth)/                       # login/, signup/, callback/route.ts
  (app)/                        # Authenticated app shell
    layout.tsx                  # Nav, sidebar
    dashboard/
    analyze/                    # Paste-and-go input page
    search/[listingId]/         # Listing detail + comp analysis [VERIFY: may be /analyze/[id]]
    garage/[vehicleId]/
    alerts/
    account/billing/
  api/
    analyze/route.ts            # POST URL → ListingAnalysis
    webhooks/stripe/route.ts
    webhooks/supabase/route.ts
    cron/scrape/route.ts

components/
  ui/                           # Primitives (button, input, modal, badge)
  listings/                     # Listing card, listing detail, comp table
  charts/                       # Price trend charts, distribution histograms
  garage/
  layout/                       # Navbar, sidebar, footer

lib/
  supabase/                     # client.ts, server.ts, middleware.ts, types.ts (generated)
  comp-engine/
    types.ts
    default.ts                  # Marque-agnostic valuation logic
    porsche.ts                  # Porsche overrides: generation weights, option premiums, color desirability
    ferrari.ts                  # Placeholder — do not implement until Ferrari launch
    mercedes.ts                 # Placeholder — do not implement until Mercedes launch
  listing-parser/               # On-demand URL parsing for paste-and-go
    index.ts                    # parseListingUrl(url) → RawListing
    identify.ts
    bring-a-trailer.ts
    cars-and-bids.ts / pcarmarket.ts / rm-sothebys.ts / gooding.ts / mecum.ts
  valuation/                    # getValuation(vehicleSpec) → ValuationRange + confidence
  vin/porsche.ts + generic.ts
  option-codes/porsche.ts
  originality.ts
  stripe/plans.ts
  resend/client.ts
  auth/viewer-tier.ts           # viewerTier computation; admin/beta bypass TODO comment here
  utils/currency.ts + mileage.ts + date.ts

scrapers/                       # Isolated from app/ — scheduled jobs, not request path
  types.ts                      # RawListing (pre-normalization)
  normalize.ts                  # RawListing → listings insert type
  runner.ts                     # Orchestrates runs, deduplication, upsert
  [platform].ts per source

emails/                         # React Email templates
  welcome.tsx / alert-match.tsx / weekly-digest.tsx

docs/reference/
  defects/                      # Defect catalog Files 00–27
  porsche_[decade]_reference.md # All 7 decade docs (1960s–2020s) complete

supabase/migrations/            # Numbered SQL migration files
CLAUDE.md / ARCHITECTURE.md / ARCHITECTURE_DECISIONS.md / SCHEMA.md / DESIGN.md
design/reference/               # Canonical visual mockups — UI must match these
tests/comp-engine/ + scrapers/ + originality/
```

---

## Database Schema Summary

### Key rules
- All monetary amounts in **cents (integers)**. Never floats. Application layer handles display.
- `source_platform` on listings must be exactly: `'bring-a-trailer'`, `'cars-and-bids'`, `'pcarmarket'`, `'rm-sothebys'`, `'gooding'`, `'mecum'`, `'collecting-cars'`, `'hemmings'`, `'bonhams'`, `'barrett-jackson'`
- RLS enabled on all user-facing tables. Never disable RLS to work around a permission problem.

### Core listing data (marque-agnostic)

**`listings`** — One row per listing per source platform.
- Identity: `make`, `model`, `generation`, `trim`, `year`, `vin`, `body_style`
- Spec: `mileage`, `mileage_unit`, `transmission`, `drivetrain`, `engine_displacement_cc`
- Color: `exterior_color`, `exterior_color_code`, `interior_color`, `interior_material`
- Options/mods: `options jsonb`, `modifications jsonb`
- Pricing: `asking_price`, `high_bid`, `final_price`, `reserve_met`, `currency` (all cents)
- Status: `status` (active/sold/no_sale/withdrawn), `listing_status` (live/sold/no-sale/unknown)
- Raw: `raw_description`, `raw_html_snapshot_key` (R2 object key)
- Unique: `(source_platform, source_listing_id)`

**Comp Engine V2 additions to `listings`** (migrations 20260429–20260430):
- Classification: `trim_category`, `trim_variant`, `generation_id`, `market_region`, `body_style_normalized`, `transmission_variant`
- Condition: `condition_signal`, `paint_signal`, `interior_signal`, `numbers_matching`, `mod_status`
- Provenance: `has_porsche_coa`, `has_kardex`, `has_service_records`, `has_window_sticker`, `has_owners_manual`, `owner_count`, `documentation_score`
- Auction dynamics: `bid_count`, `comment_count`, `bid_to_buy_ratio`, `final_to_reserve_ratio`
- Options: `factory_options text[]` (marque-agnostic), `is_paint_to_sample`, `has_x50_powerkit`, `has_aero_kit`, `has_sport_seats`
- Editorial: `is_comp_resistant boolean` — excludes from all comp pools; returns "uncomparable" verdict
- Deduplication: `cross_listing_group_id` — groups same physical car across platforms

**`listing_analyses`** — Every paste-and-go analysis run. System of record for free-tier rate limiting. `user_id` nullable (anonymous analyses allowed). Includes `findings jsonb`, `confidence_score`, `comp_count`.

**`market_snapshots`** — Periodic comp aggregations per (generation, trim, date). Written by background jobs; read by comp engine and trends UI.

**`comp_engine_runs`** — Prediction audit log. Every V2 execution writes one row. Powers backtesting and drift detection. Authenticated read gated on `role IN ('admin', 'beta')`.

**`trim_taxonomy`** — Which trim categories exist per generation; whether they form a separate market (comps only against themselves). Seeded for 993: 16 rows including `turbo_s`, `rs_touring`, `rs_clubsport`, `gt2`, `speedster`, `cup` as separate markets.

**`generation_weight_config`** — Per-generation similarity factor weights; editable without code deploys. 993 weights: mileage=0.30, condition_stub=0.15, year=0.10, trim_variant=0.10, market_region=0.10, spec_composite=0.10, transmission_variant=0.05, color_rarity=0.05, consignor_tier=0.05, mechanical_remediation=0.00.

**`generation_mileage_bands`** — Per-generation mileage band boundaries. 993: ultra_low(0–5k), low(5k–25k), moderate(25k–75k), high(75k–125k), very_high(125k+).

### Porsche reference tables (marque-specific)

**`porsche_generations`** — Authoritative generation registry. Key fields: `generation_id` (e.g. '993', '997.1'), `model`, `model_family`, `year_start/end`, `body_styles[]`, `notes` (short — era card), `notes_full` (long-form — full report page), `hero_image_*`, `common_issues jsonb`, `period_reviews jsonb`, `content_status` (draft/verified/published).

**`porsche_color_codes`** — Factory paint codes with generation applicability, rarity, finish type.

**`porsche_option_codes`** — Factory option codes per generation. PK is `(code, generation_id)` — same code means different things across generations.

### User-facing tables (marque-agnostic)
`users` (extends Supabase Auth), `garages`, `vehicles`, `saved_searches`, `watched_listings`

Planned for V1.5: `vehicle_photos`, `subscription_grants`

---

## Marque Expansion Pattern

Adding a new marque requires only:
1. `lib/comp-engine/<marque>.ts` — marque-specific heuristics
2. `lib/vin/<marque>.ts` — VIN rules
3. `lib/option-codes/<marque>.ts` — option/color code registry
4. New reference tables (`<marque>_color_codes`, `<marque>_option_codes`, `<marque>_generations`)
5. Populate reference data

Core schema, engine default logic, and all user tables require no changes.

---

## Defect Catalog → Product Connection

The defect catalog (`docs/reference/defects/`) feeds the product:
1. **Era card** — `porsche_generations.common_issues jsonb` is populated from defect records
2. **Comp engine** — defect risk informs condition scoring and value adjustments
3. **`[Dad's Name]` checklist** — defect records are the underlying source for the evaluation checklist

**Catalog status:** Files 00–24 + 99 complete (90 records, all verified). Files 25 (region-specific), 26 (halo models), 27 (Taycan) remaining.

**After catalog is done:**
1. Trim taxonomy lock
2. Markdown → JSON pipeline (defect files + decade docs → Postgres)
3. Build `/generations/[id]` route
4. Wire era card to DB (replace 997.2 hardcode [VERIFY])

---

## Coding Rules (key — full rules in CLAUDE.md)

- TypeScript strict. `any` banned. `@ts-ignore` requires comment + removal ticket.
- Server Components default. `"use client"` only for browser APIs/state/effects.
- All DB access via typed Supabase client. No raw SQL in app code.
- RLS always on. Never disable to work around permissions — fix the policy.
- Scrapers isolated in `/scrapers/`. Cannot import from `/app/` or `/lib/` except canonical types.
- All scraper/background errors reported to Sentry with structured context.
- Secrets in env vars only. Never in source code or commits.
- UI must match `DESIGN.md` and `design/reference/` mockups. Aesthetic target: Excellence magazine, not generic SaaS dashboard.

---

## Workflow Rules

- `git status` before any new work session — confirm clean baseline
- Migration safety: every migration → `npx supabase db push` → verification SELECT. Has failed 3+ times without this.
- After schema changes: `npx supabase gen types` → restart `npm run dev`
- Status reports save to `docs/*.md` so they survive context compaction
- When Claude Code proposals contradict CLAUDE.md, push back

---

## Known TODOs [VERIFY currency against actual state]

- `GRANT ALL ON listings TO service_role` — verify applied; re-run if DB reset
- Resend, Stripe, PostHog, Sentry env vars not yet set in Vercel
- `/analyze/[id]/full` — full report route (404s)
- `/generations/[id]` — dedicated generation page (404s; era card "Read more" broken)
- Watch-list MVP, Garage MVP, Account settings, Beta gate
- Signup polish, search page polish
- Trim taxonomy lock (blocking pipeline)
- Markdown → JSON pipeline (blocking era card + generation pages for all gens)
- `subscription_grants` table (V1.5 — manual comps for founding collectors)
- `vehicle_photos` table (V1.5)
- Hagerty/Classic.com partnership outreach — strategy person to advise timing
- ~35 generation editorial notes still draft; only 992 and 993 published [VERIFY]

---

## What This Doc Does Not Cover

- `DESIGN.md` — full visual design system, component patterns, mockups
- `ARCHITECTURE_DECISIONS.md` — ADRs for major technical choices
- Full RLS policy definitions (in `supabase/migrations/`)
- Comp engine V2 full scoring logic (in `lib/comp-engine/`)
- Apify job configuration and scheduling
