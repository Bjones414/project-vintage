# Architecture Decision Records

---

## ADR-001: Marque-Agnostic Core, Marque-Specific Content

**Date:** 2026-04-25
**Status:** Accepted

---

### Context

Project Vintage launches as a Porsche-focused analytics platform. The founding premise is deep, authoritative coverage of one marque rather than shallow coverage of many. However, the long-term business opportunity is to expand to other collector car marques: Ferrari, Mercedes-Benz, BMW M, Alfa Romeo, and others.

This creates a structural decision at the start of the project: at what layer should the system be designed for Porsche-only, and at what layer should it anticipate expansion?

---

### Decision

**Build data and infrastructure as if for all collector cars. Build content and marketing as if only for Porsche.**

Concretely:

- The `listings` table is marque-agnostic. It has a `make` column; it will never be renamed `porsche_listings` or forked into a parallel `ferrari_listings` table.
- The comp engine has a `default.ts` with generic valuation logic that any marque can run through. Porsche-specific heuristics (generation weighting, option code premiums, color desirability, matching-numbers sensitivity) live in `porsche.ts` as an override layer.
- Scrapers normalize output to the canonical `listings` schema regardless of source platform or marque. No platform-specific or marque-specific columns leak into the database.
- User-facing tables (`users`, `garages`, `vehicles`, `saved_searches`, `watched_listings`) are fully marque-agnostic.
- Porsche-specific reference data (`porsche_color_codes`, `porsche_option_codes`, `porsche_generations`) lives in separate tables alongside the generic core. Adding `ferrari_color_codes` requires no schema changes to existing tables.
- The frontend, copy, SEO, onboarding, and marketing are Porsche-focused. No multi-marque UI is surfaced until a second marque is ready for launch.

---

### Alternatives Considered

**Alternative A: Single-marque-only design**

Design everything for Porsche. Use `porsche_listings`, `porsche_generations`, etc. as the primary tables. If the product ever expands, refactor the schema at that time.

*Rejected because:* The database migration cost of refactoring from marque-specific to marque-agnostic is high and disruptive once real data exists. A `porsche_listings` table that gets renamed to `listings` with a `make` column added is a multi-step migration that touches every foreign key, index, RLS policy, and application query. The risk of data loss or downtime during that migration is real. The generic schema costs almost nothing extra to implement at the start — the `make` column is one field — and eliminates the migration entirely.

**Alternative B: Fully generic from day one (including UI)**

Build the full multi-marque experience from the start: marque selection, multi-marque search, cross-marque analytics, generic option code handling, universal comp engine with no marque-specific logic.

*Rejected because:* The product's defensibility comes from depth, not breadth. Porsche has a rich ecosystem of generation-specific lore, option codes, color codes, and originality markers that reward deep, marque-specific knowledge. A generic system built before we understand what makes Porsche valuations tick will be the wrong abstraction. Building generic UI before a second marque exists is premature optimization that slows down the launch and dilutes focus. The rule "content and marketing as if only for Porsche" keeps the team honest: every user-facing decision is made in terms of what a serious Porsche buyer or seller needs, not a hypothetical multi-marque user.

---

### Consequences

**Positive:**
- Adding a second marque requires no schema migrations on the core. It requires: a new `<marque>.ts` in the comp engine, a new `<marque>.ts` in VIN and option-code logic, new reference tables, and populating them. The blast radius is contained and additive.
- The Porsche launch ships with full depth: generation-aware comps, option code verification, color rarity scoring, all backed by purpose-built Porsche reference data.
- The scraper pipeline works for any source platform from day one. Adding a new platform (e.g., Gooding & Company) only requires a new scraper file and normalization logic.

**Negative / Watch:**
- Discipline is required to keep the comp engine's Porsche-specific heuristics in `porsche.ts` and out of `default.ts`. Code review must enforce this boundary.
- The `options` and `modifications` columns use `jsonb` rather than normalized junction tables, which trades some query ergonomics for marque-agnostic flexibility. Complex option filtering will require Postgres `jsonb` operators or a denormalized search column; this is an acceptable tradeoff at launch scale.
- The generic schema means some Porsche-specific fields (e.g., `matching_numbers`, `coa_present`) that would be natural first-class columns will instead live inside the `options` jsonb or as derived flags in the application layer. If these fields become high-frequency filter criteria, they can be promoted to real columns in a targeted migration.
