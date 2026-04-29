# Project Vintage — Claude Code Source of Truth

## What This Product Is

Project Vintage is a SaaS analytics platform for collector car enthusiasts. It answers two questions every serious buyer and seller has:

1. **What is it worth?** — comparable sales, fair value estimation, price trend analysis
2. **Is it real?** — originality assessment, condition flags, specification verification, VIN history

The product launches Porsche-only. It is architected to expand to other marques (Ferrari, Mercedes, BMW, Alfa Romeo, etc.) without structural rework.

---

## Brand Foundation — Do Not Lose This

The product's origin story centers on the founder's father: a serious Porsche collector with seven Porsches. Project Vintage is built in honor of him. This is not a marketing angle — it is the emotional core of the product and must not be diluted.

**Founding Collectors wall:** The product includes a curated wall of founding collectors. The founder's father is #1. This is a permanent, honored place in the product, not a promotional feature.

**The [Dad's Name] Test:** Every Porsche listing analysis runs through a curated evaluation checklist attributed to the founder's father. The checklist carries his name and is presented as his standard, not as an algorithmic output. (Name is TBD — use `[Dad's Name]` as a placeholder until confirmed.)

**Explicitly rejected — AI persona named after the founder's dad:** This was considered and rejected. Do not propose it in any form in future sessions. Reasons: (1) hallucination risk means the AI will sometimes be wrong, and being wrong under his name damages the tribute; (2) named AI personas read as gimmicky to a wealthy, discerning collector audience; (3) naming a chatbot after him caps the tribute at "feature" rather than letting it be brand foundation. The tribute lives in the checklist, the Founding Collectors wall, and the product's origin story — not in an AI persona.

---

## Two-Pillar Product Thesis

### Pillar 1 — What Is It Worth?
- Aggregated auction results from Bring a Trailer, Cars & Bids, PCarMarket, Classic.com, RM Sotheby's, and others
- Comparable sales filtering by year, model, generation, transmission, color, options, mileage
- Fair value range estimation (low / median / high) with confidence scoring
- Price trend visualization over time (rolling 90-day, 1-year, 3-year)
- Reserve-met vs. no-sale rate by spec to surface market demand signals

### Pillar 2 — Is It Real?
- Option code and color code verification (e.g., Porsche paint and option codes vs. claimed spec)
- Originality flags: aftermarket wheels, non-factory colors, engine/gearbox swaps
- Service history signal detection from listing descriptions
- Ownership count and listing history across platforms
- VIN structure validation and partial decode

---

## V1 Scope Discipline

The wedge is the paste-and-go workflow. A user pastes any auction URL and gets a 15-second analysis. Do not propose features outside V1 scope when asked to build V1 features.

**V1 — The Core Loop**
- Paste any auction URL (Bring a Trailer, Cars & Bids, PCarMarket, RM Sotheby's, Gooding & Company, Mecum) and receive a structured analysis in ~15 seconds
- Analysis includes: comparable sales, fair-value verdict (low / median / high), condition flags, generation context
- VIN decode, Porsche color and option code lookup
- Save listings to a watchlist

**V1.5 — Garage**
- Add owned cars to a personal garage
- Live valuations on garage vehicles
- Photo upload and storage
- Maintenance tracking
- Document vault (title, service records, insurance)
- Originality flags derived from uploaded photos

**V2 — Platform**
- Saved-search alerts across platforms
- Dealer inventory feed
- Vendor directory
- Lifestyle and commerce layer
- Marque expansion beyond Porsche

---

## Data Source Policy

**Approved sources to scrape or integrate:**
- Bring a Trailer
- Cars & Bids
- PCarMarket
- Collecting Cars
- Hemmings
- RM Sotheby's
- Gooding & Company
- Mecum
- Bonhams
- Barrett-Jackson
- NHTSA vPIC (VIN decode)
- Rennbow (Porsche color reference)

**Explicitly NOT data dependencies — these are competitors:**
- Hagerty Valuation Tools
- Classic.com
- Sports Car Market
- Carfax
- AutoCheck
- Kelley Blue Book
- Edmunds

Do not propose architecture that requires data from the competitor list. If a feature seems to need that data, solve it with our own scraped auction history instead.

---

## Pricing and Tier Gating

| Tier | Price | Included |
|---|---|---|
| Free | $0 | 3 listing analyses/month, 1 saved alert, basic comps |
| Pro | $29/month | Unlimited analyses, unlimited alerts, full comp engine, VIN history |
| Collector | $99/month | Garage, insurance docs, portfolio tracking, pre-list alerts, advanced trends |
| Pro-grade (Year 2) | $200–500/month | Dealer and broker tier — defined later |

Feature gating must be enforced server-side. The user's `subscription_tier` stored in Supabase is the authority. Never rely on client-side state or a JWT claim alone to gate a paid feature — always verify against the database on the server.

---

## Core Architectural Rule

> **Build data and infrastructure as if for all collector cars. Build content and marketing as if only for Porsche.**

This means:

- Every database table is marque-agnostic. `listings` has a `make` column; it does not have a `porsche_listings` table.
- The comp engine has a `default.ts` with generic valuation logic and a `porsche.ts` override with Porsche-specific heuristics (generation weighting, desirable option codes, color premiums, matching-numbers sensitivity).
- The scrapers normalize all data into the same canonical schema regardless of source platform.
- The frontend, copy, SEO, and onboarding are Porsche-focused. Do not expose multi-marque UI until a second marque is fully supported.
- Marque-specific reference tables (`porsche_color_codes`, `porsche_option_codes`, `porsche_generations`) live alongside the generic core. Adding `ferrari_color_codes` later requires no schema migration on the core.

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
| App Hosting | Vercel |
| Email | Resend |
| Payments | Stripe |
| Error Tracking | Sentry |
| Product Analytics | PostHog |
| Mobile | Progressive Web App (PWA) — no React Native or native iOS/Android in V1 |

---

## Coding Rules

### TypeScript
- Strict mode is enabled. `"strict": true` in tsconfig. No exceptions.
- `any` is banned. Use `unknown` and narrow, or write a proper type. `@ts-ignore` requires a comment explaining why and a ticket to remove it.
- All Supabase queries use the typed client generated from the database schema. Never write raw SQL strings in application code; use the query builder or RPC calls.

### Next.js Component Model
- Server Components are the default. Every component starts as a Server Component.
- Mark a component `"use client"` only when it requires browser APIs, event handlers, or React state/effects.
- Data fetching happens in Server Components or Route Handlers. Never fetch from a Client Component directly when a Server Component can own the data boundary.

### Secrets and Environment Variables
- All secrets live in environment variables. No secret, API key, token, or credential appears in source code or commits.
- Local development uses `.env.local` (git-ignored). Staging and production use Vercel environment variables.
- The `.env.example` file documents every required variable with a placeholder value and a comment describing what it is for.

### Data Access
- All database access goes through the typed Supabase client (`@/lib/supabase/`). No raw `pg` or `postgres` connections in application code.
- Row-level security (RLS) is enabled on all user-facing tables. Never disable RLS to work around a permission problem — fix the policy.
- Prefer the typed Supabase client for all data access. Use Supabase RPC functions only when you need atomic multi-step transactions, database-level constraints, or operations that benefit from being executed close to the data. Do not default to RPC for ordinary mutations.

### Scrapers
- Scrapers are isolated in `/scrapers/`. They do not import from `/app/` or `/lib/` except for the canonical schema types and the Supabase client.
- Each scraper normalizes its output to the `listings` insert type before writing. No platform-specific fields bleed into the database.
- Scrapers run as scheduled jobs (Vercel Cron or external scheduler), not in the request path.

### Error Handling
- All scraper errors and background job errors are reported to Sentry with structured context (platform, listing URL, job run ID).
- User-facing errors use typed error objects, not thrown strings.

### Testing
- Unit tests cover the comp engine logic and option/color code validators.
- Scraper normalization is tested via input fixture → expected database row, with the database write mocked.
- Integration test infrastructure (local Supabase or a test database) is deferred until V1 has paying users.

---

## Design System

All UI work must conform to `DESIGN.md`. Reference mockups at `/design/reference/` are the canonical visual implementation. Deviations require written justification and approval. When in doubt, choose the option that better matches Excellence magazine, not the option that better matches a typical SaaS dashboard.
