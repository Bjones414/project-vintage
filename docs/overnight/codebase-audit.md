# Codebase Audit — 2026-05-18

## Top 10 Highest-Impact Cleanup Candidates

1. **HIGH** — `app/api/listings/[id]/refresh-status/route.ts:6` — Unauthenticated endpoint with no rate limiting; TODO acknowledges launch blocker
2. **HIGH** — `app/(auth)/callback/route.ts` — OAuth callback is a stub; code exchange not implemented, silently redirects without establishing a session
3. **HIGH** — Multiple route handlers bypass `lib/supabase/` typed wrapper, calling `@supabase/supabase-js` `createClient` directly with raw string credentials — violates the architectural rule
4. **HIGH** — `zod` is listed in `dependencies` (not devDependencies) but is never imported anywhere in the codebase
5. **MEDIUM** — `components/nav/TopNav.tsx` — superseded component still has active test files; creates maintenance confusion and false coverage
6. **MEDIUM** — `pdf-parse` and `@types/pdf-parse` are installed but never imported; `@types/pdf-parse` is in `dependencies` (not `devDependencies`)
7. **MEDIUM** — `lib/watchlist/reasoning.ts` defines a private `formatDollars` function that duplicates `lib/utils/currency.ts:formatCents`
8. **MEDIUM** — `recencyWeight` function is near-identically duplicated across `lib/comp-engine/recency-weight.ts` and `lib/comp-engine-v2/aggregation.ts`
9. **MEDIUM** — `components/watchlist/WatchlistSaveButton.tsx` and `components/watchlist/WatchlistCard.tsx` are fully built components that are never imported by any page
10. **MEDIUM** — `lib/option-codes/`, `lib/vin/`, `lib/valuation/`, `lib/comp-engine/default.ts`, `lib/comp-engine/porsche.ts` are stub orphan modules with no exports and no consumers

---

## Estimated Effort by Category

| Category | Items | Effort |
|---|---|---|
| TODO/FIXME comments | 17 | M |
| Unused exports | 8 | S |
| Unused dependencies | 4 packages | S |
| Orphan files | 18 | M |
| Duplicate logic | 3 pairs | S |
| TypeScript errors | 8 errors across 5 files | M |

---

## 1. TODO / FIXME / HACK / XXX Comments

### `app/layout.tsx`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 24 | TODO | `// TODO: Add Sentry and PostHog providers here once configured` | (a) Real work — Sentry and PostHog packages are installed (`@sentry/nextjs`, `posthog-js`, `posthog-node`) but no providers are wired. Without providers, error tracking and product analytics are completely non-functional. **HIGH** |

---

### `app/(auth)/callback/route.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 7 | TODO | `// TODO: implement code exchange via createServerClient` | (a) Real work — the OAuth callback handler silently redirects without ever exchanging the auth code for a session. Any OAuth login flow will complete the redirect but will not establish an authenticated session. **HIGH** |

---

### `app/(app)/home/page.tsx`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 73 | TODO | `// TODO: derive from home_lat/home_lng when needed` | (a) Real work — timezone is hardcoded to `America/Los_Angeles`. Low priority but noted. **LOW** |
| 364 | TODO | `{/* TODO: wire to watch-setup route once built (/watchlist/new or similar) */}` | (a) Real work — the "Set up a watch" CTA links to `/watchlist` as a placeholder; route `/watchlist/new` is not yet built. **LOW** |

---

### `app/api/analyze/route.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 55 | TODO | `// TODO Task 6: When implementing analyze page gates, watch-list limits, and report counters, bypass all gates for users with role IN ('admin', 'beta').` | (a) Real work — no tier gating is implemented yet; this comment marks the precise injection point. **MEDIUM** |

---

### `app/api/listings/[id]/refresh-status/route.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 6 | TODO | `// TODO (Task 8): Add per-IP rate limiting before launch. No rate limit middleware (Upstash, Vercel, etc.) exists in this repo yet.` | (a) Real work — this endpoint has no auth and no rate limiting. A client can spam it. Explicitly flagged as a launch blocker. **HIGH** |

---

### `lib/generation-match.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 358 | TODO | `// TODO: bump the upper bound as production years advance past 2040.` | (c) Explanatory note — explains why a hard ceiling of 2040 exists in the generation table bounds. Not actionable until ~2038. **LOW** |

---

### `lib/findings/rules/generation-watchout.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 1 | TODO | `// TODO: When non-Porsche marques ship, this rule needs a marque dispatch` | (a) Real work — a V2 architectural change required when adding Ferrari/Mercedes. Tracked correctly. **LOW** (V2 scope) |

---

### `lib/findings/rules/mileage-vs-average.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 3 | TODO | `// TODO: porsche_generations has no average_mileage_at_year column. This rule is dormant until reference data is populated.` | (a) Real work — the rule exports a no-op function. The mileage-vs-average finding will never fire until the DB column and logic are implemented. **MEDIUM** |

---

### `lib/era-content/generation-content.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 498 | TODO | `// TODO: Verify exact US allocation, RS-specific weight figure, and any dealer-exclusive market restrictions...` | (a) Real work — fact-checking placeholder on published copy for the 996.2 GT3 RS. Needs primary source verification before launch. **MEDIUM** |

---

### `lib/listing-parser/rm-sothebys.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 1 | TODO | `// TODO Phase 4+: implement` | (a) Real work — stub; function throws `PlatformNotSupportedError`. Intentionally deferred to Phase 4+. **LOW** (deferred) |

---

### `lib/listing-parser/pcarmarket.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 1 | TODO | `// TODO Phase 4+: implement` | (a) Real work — stub; function throws `PlatformNotSupportedError`. Intentionally deferred. **LOW** (deferred) |

---

### `lib/listing-parser/cars-and-bids.ts`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 1 | TODO | `// TODO Phase 4+: implement via Apify or direct parse` | (a) Real work — stub; function throws `PlatformNotSupportedError`. Intentionally deferred. **LOW** (deferred) |

---

### `components/analyze/ActionRow.tsx`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 28 | TODO | `// TODO: persist save-analysis for authenticated members` | (a) Real work — the save button is wired for anonymous users (shows SignupModal) but does nothing for authenticated users. **MEDIUM** |

---

### `components/GreetingHeader.tsx`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 107 | TODO | `{/* TODO: update href to /garage/new once that route is built */}` | (a) Real work — Garage link on home welcome state is a placeholder. **LOW** |

---

### `components/analyze/ComparableSalesCard.tsx`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 211 | TODO | `{/* TODO: replace href with /analyze/[id]/full once full-report page exists */}` | (a) Real work — the full comp list deep link is a dead `href="#"`. `app/(app)/analyze/[id]/full/page.tsx` exists but redirects back to the analysis page. **MEDIUM** |

---

### `components/analyze/EraCard.tsx`

| Line | Tag | Comment | Category |
|---|---|---|---|
| 182 | TODO | `// Hardcoded 997.2 content — visual UX test ahead of the markdown→DB pipeline (TODO #9)` | (a) Real work — the entire 997.2 branch in EraCard is hardcoded JSX. Migration to the markdown→DB pipeline is pending. **MEDIUM** |

---

## 2. Unused Exports

### `lib/originality.ts`

| Export | Line | Description |
|---|---|---|
| `deriveEngineFamily` | 56 | Exported but only called internally within `originality.ts`. No external import found. Consider making it a private (non-exported) function. **LOW** |

---

### `lib/comp-engine/index.ts`

| Export | Line | Description |
|---|---|---|
| `recencyWeight` | 8 | Re-exported from `recency-weight.ts`. Only imported by V1 tests and scripts, not by any app page or route. The app exclusively uses `comp-engine-v2`. **MEDIUM** |
| `monthsAgo` | 8 | Re-exported from `recency-weight.ts`. Only used inside `ComparableSalesCard.tsx` via a direct import from `comp-engine/recency-weight`. The re-export at the index level is not consumed. **LOW** |
| `computeFairValue` | 9 | Re-exported at index level; only used internally by `computeComps`. No external consumer imports it from the index. **LOW** |
| `fetchGenerationPool`, `selectComps` | 10 | Re-exported at index level; not imported anywhere outside V1 internal use and scripts. **LOW** |

---

### `lib/comp-engine-v2/condition-stub.ts`

| Export | Line | Description |
|---|---|---|
| `paintScore`, `accidentScore`, `photoScore`, `featuredScore` | 20–47 | Exported individually but only consumed by `computeConditionStub` within the same file. External consumers import `computeConditionStub` only (via `similarity.ts`). Consider un-exporting sub-functions. **LOW** |

---

### `lib/option-codes/types.ts`

| Export | Line | Description |
|---|---|---|
| `OptionCodeValidationResult` | 3 | Exported from a stub file. No file in the codebase imports it. **MEDIUM** |

---

### `lib/watchlist/state.ts`

| Export | Line | Description |
|---|---|---|
| `isOlderThan12h` | 123 | Exported but not imported anywhere outside `state.ts` tests. **LOW** |

---

## 3. Unused Dependencies

### `dependencies` in package.json

| Package | Finding |
|---|---|
| `zod` ^4.3.6 | **UNUSED** — Not imported anywhere in `.ts`/`.tsx` files. Should be removed unless actively planned for imminent use. |
| `pdf-parse` ^2.4.5 | **UNUSED** — Not imported anywhere. No PDF processing code exists in the codebase. |
| `@types/pdf-parse` ^1.1.5 | **MISCLASSIFIED + UNUSED** — A types-only package placed in `dependencies` instead of `devDependencies`. Also not imported anywhere. Should be removed or moved. |
| `posthog-js` ^1.372.1 | **UNUSED** in code — Installed but no PostHog client or provider is wired. The root layout has a TODO comment acknowledging this. |
| `posthog-node` ^5.30.4 | **UNUSED** in code — Same as above; no server-side PostHog calls exist. |
| `@sentry/nextjs` ^10.50.0 | **UNUSED** in code — Installed but no Sentry configuration, `sentry.client.config.ts`, or `sentry.server.config.ts` files exist. Root layout TODO acknowledges this. |
| `stripe` ^22.1.0 | **STUB ONLY** — `lib/stripe/client.ts` and `lib/stripe/plans.ts` are comment-only stubs. `app/api/webhooks/stripe/route.ts` and `app/(app)/account/billing/page.tsx` exist but the Stripe client is never instantiated. The `stripe` package import does not appear in any non-stub file. |
| `resend` ^6.12.2 | **STUB ONLY** — `lib/resend/client.ts` is a comment-only stub. `emails/*.tsx` templates exist but no Resend client import appears in any file that sends email. |

### `devDependencies` — No obvious orphans

All devDependencies (`@testing-library/react`, `@testing-library/user-event`, `@vitejs/plugin-react`, `vitest`, `dotenv`, `tsx`, `typescript`, `eslint`, `eslint-config-next`, `happy-dom`, `postcss`, `tailwindcss`, `@types/*`) have visible usage in test files, config files, or build scripts.

---

## 4. Orphan Files

Files that are not Next.js route files and are not imported by any other file in the codebase.

### Stub modules — no exports, no consumers

| File | Description |
|---|---|
| `lib/vin/index.ts` | "VIN decoding entry point. Routes to porsche.ts for Porsche VINs." Comment-only stub. No exports. |
| `lib/vin/porsche.ts` | "Porsche-specific VIN structure rules." Comment-only stub. No exports. |
| `lib/vin/generic.ts` | "WMI/VDS/VIS generic VIN decode using NHTSA vPIC API." Comment-only stub. No exports. All VIN decode functionality is in `lib/vin-decode/nhtsa.ts` (separate module). |
| `lib/valuation/index.ts` | "getValuation(vehicleSpec) → ValuationRange." Comment-only stub. No exports. |
| `lib/valuation/confidence.ts` | "Confidence scoring for valuation results." Comment-only stub. No exports. |
| `lib/comp-engine/default.ts` | "Marque-agnostic comparable sales logic." Comment-only stub. No exports. |
| `lib/comp-engine/porsche.ts` | "Porsche-specific comp engine overrides." Comment-only stub. No exports. |
| `lib/utils/mileage.ts` | "Mileage unit conversion: mi ↔ km." Comment-only stub. No exports. |
| `lib/listing-parser/identify.ts` | "Identifies which auction platform a URL belongs to." Comment-only stub. No exports. |
| `lib/listing-parser/mecum.ts` | "Mecum URL parser." Comment-only stub. No exports. |

### Stub modules — exports defined but no consumers

| File | Export(s) | Description |
|---|---|---|
| `lib/option-codes/types.ts` | `OptionCodeValidationResult` | `unknown` type alias; companion to `lib/option-codes/porsche.ts` stub. Neither file is imported anywhere. |
| `lib/option-codes/porsche.ts` | (none — comment-only) | "Validates Porsche option codes against a given generation." Stub. |
| `lib/comp-engine/ferrari.ts` | (none) | "Placeholder — do not implement until Ferrari marque launch (V2+)." One-line comment. |
| `lib/comp-engine/mercedes.ts` | (none) | "Placeholder — do not implement until Mercedes marque launch (V2+)." One-line comment. |
| `lib/listing-parser/playwright-fallback.ts` | `PlaywrightWorkerError`, `callPlaywrightWorker` | Fully implemented Playwright worker HTTP bridge. Not imported in `lib/listing-parser/index.ts` or anywhere else in the app. |

### Built components with no consumers

| File | Export | Description |
|---|---|---|
| `components/watchlist/WatchlistCard.tsx` | `WatchlistCard` | Fully built watchlist card component. Not imported in `app/(app)/watchlist/page.tsx` or any other page. Superseded by `WatchlistRow`. |
| `components/watchlist/WatchlistRefresher.tsx` | `WatchlistRefresher` | Fully built client-side background refresher. Not imported in the watchlist page. The watchlist page comment explicitly says refreshes are user-triggered only; this component may represent a discarded design. |
| `components/nav/TopNav.tsx` | `TopNav` | Older nav component. Not imported in any app page or layout. Superseded by `components/layout/Nav.tsx`. Tests still reference it (`TopNav.test.tsx`, `TopNav.redirect-cleanup.test.tsx`). |
| `components/watchlist/WatchlistSaveButton.tsx` | `WatchlistSaveButton` | Standalone watchlist save toggle button. Not imported anywhere in the app. |

---

## 5. Duplicate Logic

### Pair 1 — `recencyWeight` in `lib/comp-engine` and `lib/comp-engine-v2`

| File A | `lib/comp-engine/recency-weight.ts` lines 24–40 |
|---|---|
| File B | `lib/comp-engine-v2/aggregation.ts` lines 21–34 |

Near-identical interpolation algorithm using the same `BREAKPOINTS` table `[0,1.0],[6,1.0],[12,0.8],[24,0.6],[36,0.4]`. V2 adds a `maxMonths` parameter but the core interpolation is copy-pasted. `ComparableSalesCard.tsx` imports `monthsAgo` directly from V1 (`lib/comp-engine/recency-weight`) while the V2 engine computes months inline. The divergence should be resolved: either V2 imports from V1, or both are consolidated into a shared `lib/utils/recency.ts`.

---

### Pair 2 — Currency formatting in `lib/utils/currency.ts` and `lib/watchlist/reasoning.ts`

| File A | `lib/utils/currency.ts:formatCents` — Uses `Intl.NumberFormat` with `style: 'currency'`, rounds to whole dollars |
|---|---|
| File B | `lib/watchlist/reasoning.ts:formatDollars` (private, line 5–7) — Uses `'$' + Math.round(cents / 100).toLocaleString('en-US')` |

Both produce `$XX,XXX` output for USD. The `reasoning.ts` private function should be replaced with an import of `formatCents` from `lib/utils/currency`. Note: `formatCents` is already available across the codebase; no new dependency needed.

---

### Pair 3 — Raw `@supabase/supabase-js` client creation in route handlers vs. `lib/supabase/server.ts`

The typed admin client is exported as `createAdminClient()` from `lib/supabase/server.ts`. However, at least 9 route handlers create their own raw Supabase client directly:

- `app/api/analyze/route.ts:16`
- `app/api/listings/[id]/refresh-status/route.ts:10`
- `app/api/watchlist/refresh/route.ts:16`
- `app/api/admin/comp-flags/route.ts:6`
- `app/api/debug/listing-cache/route.ts:7`
- `app/api/watchlist/[listingId]/refresh/route.ts:20`
- `app/(app)/research/page.tsx:1`
- `app/(app)/research/[id]/page.tsx:2`
- `lib/comp-engine-v2/index.ts:8`, `lib/comp-engine-v2/logger.ts:6`, `lib/comp-engine-v2/config-loader.ts:6`
- `lib/research/comp-query.ts:1`

These bypass the typed `Database` generic and violate the architectural rule "All database access goes through the typed Supabase client (`@/lib/supabase/`). No raw `pg` or `postgres` connections." Each should be migrated to import `createAdminClient` from `@/lib/supabase/server`.

---

## 6. TypeScript Errors (Baseline)

Run: `npx tsc --noEmit`
**Total errors: 8 across 5 files**

```
tests/api/admin/comp-flags.test.ts(22,24): error TS1378:
  Top-level 'await' expressions are only allowed when the 'module' option is set to
  'es2022', 'esnext', 'system', 'node16', 'node18', 'node20', 'nodenext', or 'preserve',
  and the 'target' option is set to 'es2017' or higher.

tests/api/watchlist/refresh.test.ts(38,18): error TS1378: (same module/target mismatch)

tests/api/watchlist/route.test.ts(19,31): error TS1378: (same module/target mismatch)

tests/components/analyze-page.test.tsx(110,7): error TS2345:
  Argument of type '({ onSuccess } : ...) => null' is not assignable to parameter of type
  '(new (...args: unknown[]) => any) | ...'
  Types of parameters '__0' and 'args' are incompatible.
  Type 'unknown' is not assignable to type '{ promise: ... onSuccess: ... onError: ... }'.

tests/components/analyze-page.test.tsx(138,7): error TS2345: (same mock typing issue)

tests/components/analyze/components.test.tsx(1227,9): error TS2322:
  Type '...CompListing[]' not assignable — 'source_publication' is missing in test fixture.
  (also at lines 1244, 1256 — same fixture missing field)

tests/lib/listing-parser/pca-mart-routing.test.ts(72,19): error TS2339:
  Property 'error' does not exist on type 'ListingParseResult'.
  Property 'error' does not exist on type '{ success: true; listing: CanonicalListing; }'.
```

### Root Causes

**TS1378 (3 errors)** — Three test files use top-level `await` but the project `tsconfig.json` targets an older module format that doesn't support it. This is a tsconfig/test environment configuration issue. The test runner (vitest) handles this at runtime, which masks the error, but it fails strict `tsc --noEmit`. Fix: add `"module": "esnext"` or `"node16"` to the tsconfig target for the tests directory, or use a `tsconfig.test.json` override.

**TS2345 (2 errors)** — In `tests/components/analyze-page.test.tsx`, vi.mock callback types don't align because the mock function signature uses destructured props with specific types but TypeScript infers `unknown` for the spread. Fix: cast the mock implementation to `vi.fn<...>()` or use `as ComponentType<...>`.

**TS2322 (3 errors)** — Test fixtures in `tests/components/analyze/components.test.tsx` are missing the `source_publication` field that was added to `CompListing`. The fixtures need to include `source_publication: null` (or a string value).

**TS2339 (1 error)** — `tests/lib/listing-parser/pca-mart-routing.test.ts` accesses `.error` on a `ListingParseResult` without narrowing to the failure branch first. Fix: use a type narrowing check `if (!result.success)` before accessing `result.error`.

---

## Summary Notes

**Architecture violation (moderate severity):** The "all DB access through typed client" rule is widely bypassed in route handlers and lib files. `createAdminClient()` in `lib/supabase/server.ts` exists and is correct; the raw direct calls should migrate to it. This is the highest-count systemic issue in the codebase.

**Stub accumulation:** Roughly 14 stub files exist with no exports or no consumers. These are intentional placeholders for V2 features. They are low risk but create noise during navigation and may confuse future contributors. Consider organizing them under a `lib/stubs/` directory or adding a prominent `// STUB — V2+` file header.

**Dead components:** `WatchlistCard`, `WatchlistRefresher`, and `WatchlistSaveButton` are fully implemented but never mounted. `TopNav` is superseded. These should be deleted or documented as archived.

**Missing analytics/error tracking:** Sentry, PostHog (both `posthog-js` and `posthog-node`) are installed but entirely unwired. For a product in alpha with real users, error tracking is a launch-blocking gap.
