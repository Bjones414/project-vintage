# Overnight Docs — Synthesis Review
**Date:** 2026-05-18 | **Reviewer:** Claude Code | **Status:** USER TO REVIEW

---

## Executive Summary

Seven overnight documents cover the product across four axes: codebase health, comp-engine V2 readiness, editorial content (catalog, trim list, production counts, lineage copy, inspection checklists). The codebase and comp-engine audits are high-quality and immediately actionable. The editorial docs are largely solid but contain one confirmed factual error (996.2 IMS "improvement" claim is false), one significant oversimplification (996.1 vs 996.2 IMS framing), and five confirmed erroneous trim entries in models.ts that must be removed before any comp engine work can be trusted. Session 1 of the comp engine has zero implementation complete — the audit is accurate and the work breakdown is realistic. The alpha-blocking bugs are real; three must close before any paying user touches the product.

---

## Per-Document Breakdown

---

### 1. `codebase-audit.md`

**Exec summary:** Systematic scan of TODOs, unused exports, dead dependencies, orphan files, duplicate logic, and TypeScript errors. 17 TODOs catalogued with severity ratings; 8 TS errors across 5 files identified.

**HIGH findings:**
- OAuth callback (`app/(auth)/callback/route.ts`) is a stub — auth code exchange not implemented. Any OAuth login flow will redirect without creating a session. **Alpha-blocking.**
- `/api/listings/[id]/refresh-status/route.ts` — no auth, no rate limiting. Self-flagged as launch blocker. **Alpha-blocking.**
- Sentry and PostHog installed, zero code wired. No error tracking exists. **Alpha-blocking for paying users.**
- 9+ route handlers bypass `lib/supabase/` typed wrapper and create raw Supabase clients. Violates the architectural rule; exposes untyped DB access paths.

**MEDIUM findings:**
- `zod` listed in dependencies, never imported anywhere.
- `WatchlistCard`, `WatchlistRefresher`, `TopNav`, `WatchlistSaveButton` — fully built components, never mounted.
- `recencyWeight` duplicated in v1 and v2 engines with near-identical logic.
- `lib/currency.ts:formatCents` duplicated privately in `lib/watchlist/reasoning.ts`.
- Save-analysis button does nothing for authenticated users (ActionRow.tsx:28).
- Full comp list deep link is a dead `href="#"` (ComparableSalesCard.tsx:211).
- EraCard is hardcoded 997.2 JSX, not wired to markdown→DB pipeline.
- Tier gating injection point documented but not implemented (`analyze/route.ts:55`).

**LOW findings:**
- Timezone hardcoded to `America/Los_Angeles`. RM Sotheby's, PCarMarket, Cars & Bids scrapers are stubs (Phase 4+, correctly deferred). V2 placeholders (ferrari.ts, mercedes.ts, vin stubs) create navigation noise.

**[VERIFY] count:** 0 — this is a code audit; all claims are code-verifiable.

**Quality / confidence: 5/5.** Every finding references a specific file and line number. No Porsche-specific speculation; purely structural. Fully trustworthy.

---

### 2. `comp-engine-readiness.md`

**Exec summary:** Module-by-module audit of `lib/comp-engine-v2/` against the locked Session 1 spec. Status is clearly labelled per deliverable. Net finding: Session 1 has zero implementation started; all 7 deliverables are either "not started" or "partially implemented (raw inputs only)."

**HIGH findings:**
- `feature-registry.ts` does not exist. It is the foundation — Ridge regression cannot be built without it.
- Ridge regression not started (`aggregation.ts` is 9-line weighted-percentile only).
- No math/stats library installed. Ridge requires matrix inverse — either inline (feasible for 3 features) or `ml-matrix`.
- Era taxonomy (air_cooled / water_cooled_na / water_cooled_gt / modern_turbo) does not exist anywhere. The `mileage_log_x_era` interaction term is doubly blocked until this is defined.
- `logger.ts` explicitly drops `factor_scores` at line 24–31. Per-prediction contribution logging is impossible until fixed.

**MEDIUM findings:**
- Prior blending weights table (70/40/20/5% by tier) exists in spec but nowhere in code. Low risk while `generation_priors` table is unseeded.
- `config-loader.ts` will need `loadGenerationPrior()` added; correctly flagged as pre-Session 2 but needs skeleton now.
- Backward-compat risk on `V2CompsResult` type if `feature_contributions` added — optional field + logger-first update mitigates this.

**LOW findings:**
- `methodology.ts` text doesn't yet mention Ridge. Not a Session 1 blocker.
- `ml-matrix` dependency choice deferred correctly — inline math is sufficient for 3-feature case.

**[VERIFY] count:** 0 — all findings reference specific file paths and line numbers.

**Quality / confidence: 5/5.** The most rigorous doc in the batch. The recommended order of operations (era taxonomy → feature-registry → inline Ridge math with hand-solved test → blendWithPrior → engine.ts Stage 6) is sound. The risk assessment is accurate (inline Ridge with omitted column centering is the most plausible silent failure mode). Trust this doc completely.

---

### 3. `watch-for-catalog-audit.md`

**Exec summary:** Audits 29 defect catalog files and `generation-content.ts` watch-for data across all Porsche generations. Checks the three task-specified mandatory actions (993 IMS, AOS, proposed 993 additions). Proposes new catalog entries generation-by-generation.

**HIGH findings:**
- 993 IMS reference **confirmed absent** — no erroneous record exists. No action required.
- Water pump failure (plastic impeller / bearing failure) is confirmed deferred-but-evidence-bar-cleared for 987.2, 997.2, 991.1, 991.2 — ready for file 18 authoring. Multiple Tier-B sources cited in file 13 itself.
- 957 Cayenne rear coolant hose failure has two Tier-B sources; file 06 explicitly flags for re-sourcing.
- 928 suspension ball joints (aluminum→steel revision): Tier-B sourcing (Rennlist buyer's guide); deferred to chassis file.
- 987.1 coolant crossover hose failure: specialist-documented with multiple sources; HIGH severity.
- 958 Cayenne and Macan 95B are entirely absent from the defect catalog — significant gap if those models attract auction traffic.
- Taycan HV battery recall (NHTSA, Tier A) should be verified against file 27 content.

**MEDIUM findings:**
- 16 [VERIFY] items flagged by the agent — appropriate caution throughout.
- 992.1 PADM active mount recall: Tier-A NHTSA recall confirmed; file 20 authoring candidate.
- 991 COV vacuum solenoid: Tier-B Kadunza source; file 21 candidate.
- 993 distributor belt: severity uncertain, needs PCA/Pelican source before authoring.
- PDK mechatronics gap spans 997.2 through 992, Cayenne 958, Panamera — no record exists anywhere.

**LOW findings:**
- 993 A/C "coldest of any air-cooled 911" — enthusiast talking point, not sourced; correctly blocked for verification.
- 993 hydraulic valve lifters positive note: text already exists in generation-content.ts line 188; this is a presentation decision, not new content.

**[VERIFY] count:** 16 (explicitly flagged in Section 7).

**Quality / confidence: 4/5.** Thorough and appropriately cautious. Proposed entries are ranked by evidence tier and many self-block on Tier-C-only sourcing. No obviously wrong Porsche-specific facts identified in confirmed content. The 993 IMS check is clean. Minor concern: the agent does not cross-reference proposed additions against file 09/19 (Drivetrain Transmissions) before recommending new PDK records — those files may already have content.

---

### 4. `trim-list-audit.md`

**Exec summary:** Line-by-line audit of `lib/porsche/models.ts` trim arrays against factory production records. Identified 27 missing trims, 5 erroneous trims, 4 year-boundary errors, and 2 entirely absent models (356, 912).

**HIGH findings — REMOVALS (confirmed by web search):**
- **964 Carrera 4S — does not exist.** No 964 C4S was ever produced. Confirmed. Must remove from `models.ts` and DB seed.
- **993 Speedster — not a production trim.** Only 2 bespoke Exclusive department commissions. Must remove or flag explicitly.
- **996.1 Carrera 4S — did not exist.** C4S debuted with 996.2 (2002). Remove from 996.1.
- **996.1 Targa — did not exist.** 996 Targa debuted 2002 (996.2). Remove from 996.1, add to 996.2.
- **997.1 Turbo S — did not exist.** Confirmed by web search: Turbo S was 997.2 only (MY2010+). Must remove from 997.1.
- **981 Cayman GT4 RS — did not exist.** GT4 RS was 982/718 generation only.

**HIGH findings — STRUCTURAL:**
- `derive930()` in `lib/trim-category/index.ts` is a dead branch — `'930'` is not a valid `genId` in `GENERATION_DEFS`. Either add a `'930'` generation or merge the handler into `'pre-964'`.
- Macan Gen II trim list (`['Base', 'S', 'GTS', 'Turbo']`) is entirely wrong — the EV Macan uses `'Macan 4'`, `'Macan Turbo'` naming, not ICE-era names.
- `991.2 yearEnd: 2018` should be `2019` to accommodate the Speedster and other swan-song models.

**MEDIUM findings:**
- 997.2 Sport Classic (250 units) and Speedster (356 units) missing.
- 992.1 missing: Carrera T, Sport Classic, Dakar, S/T, GT3 Touring, Targa 4 GTS.
- F-series trims 911T, 911E, 911S absent from pre-964 generation.
- 991.2 Speedster (1,948 units) missing from catalog.
- Panamera Sport Turismo and Executive missing across both generations.
- Taycan 4 (AWD base tier, introduced MY2021) missing.

**LOW findings:**
- 356 and 912 entirely absent from models.ts (DB seed already has rows for 356 sub-generations).
- 991.2 Sport Classic existence needs VERIFY before adding.
- 718 T variant existence needs VERIFY.
- 10 additional [VERIFY] items around Cayenne III non-hybrid Turbo S, Coupé variants.

**[VERIFY] count:** 10.

**Quality / confidence: 4.5/5.** The six removal candidates are all confirmed correct. Additions are well-sourced from factory specs. This is the highest-impact editorial doc for product credibility — erroneous trims in the comp engine would produce nonsensical matches (a 964 "C4S" comp query would never find results, or would find wrong results).

---

### 5. `production-counts.md`

**Exec summary:** Production figures for every significant Porsche generation and variant, with numbered source citations. Extensive [VERIFY] and [UNVERIFIED] tagging throughout.

**HIGH findings:**
- 993 Turbo S dispute: 345 (community consensus, Stuttcars) vs. 435 (Porsche Newsroom) — not resolved, confirmed as genuine conflict by web search. **Must choose one and source it before publishing.**
- 996 GT3 Mk2 total math doesn't add up: 1,868 (Mk1) + 2,589 (Mk2) = 4,457, but combined GT3 figure cited as 5,894. ~1,437 unit discrepancy flagged correctly.
- 964 total production: three figures cited (62,172 / 63,762 / 66,571). Gap is large enough to matter.

**MEDIUM findings:**
- 944 Turbo S: 775 vs. ~1,300 vs. 1,635 — reflect different spec definitions; correctly flagged.
- 991 GT2 RS: 1,000 (official press announcement) vs. ~1,580 (registry analysis) — both flagged.
- 987 Boxster and Cayman worldwide totals marked [UNVERIFIED] — honest.
- 718/982 total production not published by Porsche — honest.

**LOW findings:**
- 911 SC (1978–1983) year-by-year breakdown marked [UNVERIFIED] — consistent with what's publicly available.

**[VERIFY] count:** ~15 explicit [VERIFY] tags + several [UNVERIFIED] markers.

**Quality / confidence: 4/5.** Good citation discipline — numbered sources with URLs throughout. The disputes flagged are real disputes, not agent uncertainty. The year-by-year 928 table (175 through 199 units per year) is suspiciously detailed; likely copied from the 928OC production registry, which is a reputable source. The 993 Turbo S figure should be resolved before this content appears in product copy — recommend using 435 (Porsche Newsroom primary source) with a note that 345 is cited in community registries.

---

### 6. `lineage-moments.md`

**Exec summary:** Rich editorial callouts for each generation — collector-magazine voice, "why it matters today" framing. Suitable for generation pages.

**HIGH finding — CONFIRMED FACTUAL ERROR:**
- **996.2 IMS claim is wrong.** The doc states: "Revised headlights and quieter IMS improvement arrived in the same model year [2002]." Web search (LN Engineering definitive guide, PCA Oregon chapter) confirms: **there was no IMS improvement in 2002.** All 996.2 (2002–2005) cars use the problematic single-row bearing. The changeover from dual-row to single-row began in MY2000, and all 2002+ cars have the single-row until MY2006 (997.2). Presenting this as an "improvement" is materially incorrect and could cause a buyer to skip IMS due diligence on a 996.2. **Do not publish this claim.**

**MEDIUM findings:**
- 997.2 Speedster production count self-flagged with [VERIFY] — correctly cautious; 356 units confirmed by multiple sources.
- 997 Sport Classic "250 units" self-flagged with [VERIFY] — confirmed by production-counts.md and factory records.
- 991.1 "first 7-speed manual production car" self-flagged with [VERIFY] — correct instinct.
- 992 GT3 RS "860kg of downforce" self-flagged with [VERIFY] — Porsche claimed 860kg at 177mph at launch.
- 996 GT2: doc recommends Carfax for accident history — Carfax is listed as a competitor in CLAUDE.md. Should be changed to "VIN history service."

**LOW findings:**
- The 911 R discussion is strong but the unit count claim ("Porsche produced 991 units... [VERIFY]") is confirmed at 991 by multiple sources; the [VERIFY] tag is unnecessary.

**[VERIFY] count:** ~6 explicit, 1 confirmed error.

**Quality / confidence: 3.5/5.** Editorial voice is excellent and most facts check out. But the 996.2 IMS "improvement" claim is a confirmed error that sits at the intersection of a technically complex topic and a product credibility issue. This is exactly the kind of confident-but-wrong pattern flagged in the task instructions (analogous to the IMS-on-993 error caught previously). The fact that it's in the most reader-facing document type (generation copy) makes it higher risk.

---

### 7. `inspection-checklists.md`

**Exec summary:** Pre-purchase inspection checklists for 964, 993, 996.2, and 997.1. Covers body/paint, drivetrain, suspension, interior, electrical, documentation, and test drive protocol for each. Self-described as supplement to a formal PPI.

**HIGH findings:**
- **IMS framing in 996.2 section is misleading.** The checklist states: "The 996.1 dual-row IMS bearing was statistically more reliable." This implies 996.1 = dual-row (safer), which is wrong for 2000–2001 MY 996.1 cars. Those cars have the same single-row bearing as the 996.2. The correct framing: 1998–1999 MY cars have dual-row; 2000–2001 MY cars may have either; 2002+ (all 996.2) have single-row. A buyer relying on this checklist for a 2001 MY 996 (996.1) would skip IMS due diligence because the doc implies 996.1 = safer.

**MEDIUM findings:**
- 997.1 bore scoring described as Bank 2 (cylinders 4–6) — **confirmed correct by web search** (LN Engineering, 911uk forum). The sooty right exhaust tip diagnosis is also correct.
- Several `[VERIFY]` cost estimates (DMF replacement, AOS replacement, convertible top, IMS failure rate 8%) are tagged correctly and should be confirmed before product launch.
- 996.2 section notes IMS failure rate as "approximately 8% [VERIFY]" — this is the figure from the Eisen class action lawsuit and is widely cited; considered credible.
- 993 chain tensioner section says "remove tensioner caps and measure the ratchet position [VERIFY specific measurement threshold]" — correctly defers to Porsche WSM.

**LOW findings:**
- 997.1 section says "PDK not available — note that PDK was not introduced until the 997.2" — correct and useful clarification.
- The 993 VarioRam note specifies 1996+ MY only — correct.

**[VERIFY] count:** ~8 explicit.

**Quality / confidence: 4/5.** Practical and detailed; the test drive sequences are particularly useful (cold-start bore scoring listen on 997.1 is the right protocol). The IMS framing issue is the only significant error. Remainder is solid.

---

## Cross-Document Conflicts

### CONFLICT 1 — IMS bearing across 996 generations (HIGH — two docs affected)

| Doc | Claim | Verdict |
|-----|-------|---------|
| `lineage-moments.md` | "quieter IMS improvement arrived" in 2002 (with 996.2 facelift) | **WRONG** — no improvement; all 996.2 (2002–2005) have single-row |
| `inspection-checklists.md` | "The 996.1 dual-row IMS bearing was statistically more reliable" | **MISLEADING** — 2000–2001 MY 996.1 cars also have single-row |

Both docs effectively tell the same false story: 996.1 = safer IMS, 996.2 = worse IMS. Reality: the fault line is 1998–1999 (dual-row) vs. 2000–2005 (single-row, spanning both 996.1 and 996.2). The 996.2 facelift brought no IMS change.

### CONFLICT 2 — 993 Carrera 4S start year (MEDIUM)

| Doc | Claim |
|-----|-------|
| `production-counts.md` | C4S: "1995–1998" |
| `trim-list-audit.md` | C4S: "1996–1998, first year is 1996, not 1994" |

The 1994 vs. 1995 vs. 1996 start date matters for validation logic. Factory data supports 1996 MY (cars arrived at dealers late 1995 as MY1996). Production-counts likely uses a press-release date or delivery start date that doesn't match the model year designation. Trim-list-audit's 1996 figure is more likely correct.

### CONFLICT 3 — codebase-audit orphan stubs vs. comp-engine-readiness scope (LOW — not a real conflict)

`codebase-audit` flags `lib/comp-engine/default.ts` and `lib/comp-engine/porsche.ts` as "stub orphan modules." `comp-engine-readiness` correctly scopes entirely to `lib/comp-engine-v2/`. These are different directories; no conflict.

### CONFLICT 4 — Dead watchlist components vs. memory context (LOW)

`codebase-audit` reports `WatchlistCard`, `WatchlistRefresher`, and `WatchlistSaveButton` as never imported. The memory records "Watchlist page shipped 2026-05-15 with 5 components." Consistent: those components were built and then superseded by `WatchlistRow`. No conflict; they're dead code.

---

## Prioritized Action List

### HIGH — Close before alpha or before firing Session 1

| # | Action | Source Doc | Notes |
|---|--------|------------|-------|
| 1 | Fix OAuth callback — implement code exchange in `app/(auth)/callback/route.ts` | codebase-audit | Any OAuth login is silently broken |
| 2 | Rate-limit `refresh-status` endpoint — add Upstash or Vercel rate limiting | codebase-audit | No auth, no rate limit, self-flagged launch blocker |
| 3 | Wire Sentry before alpha goes live | codebase-audit | Zero error tracking currently; PostHog also dark |
| 4 | Remove `'Carrera 4S'` from 964 generation in `models.ts` + DB seed | trim-list-audit | Confirmed never existed; corrupts comp queries |
| 5 | Remove `'Turbo S'` from 997.1 generation in `models.ts` | trim-list-audit | Confirmed never existed; corrupts comp queries |
| 6 | Remove `'Speedster'` from 993 generation (or flag as non-production) | trim-list-audit | 2 bespoke commissions, not a production trim |
| 7 | Remove `'GT4 RS'` from 981-cayman in `models.ts` | trim-list-audit | Never produced in 981 generation |
| 8 | Remove `'Carrera 4S'` and `'Targa'` from 996.1 in `models.ts` | trim-list-audit | Both debuted with 996.2 only |
| 9 | Correct 996.2 IMS claim in `lineage-moments.md` | lineage-moments + spot check | "quieter IMS improvement in 2002" is factually wrong |
| 10 | Correct 996.1 IMS framing in `inspection-checklists.md` | inspection-checklists + spot check | Misleads buyers about 2000–2001 MY 996.1 safety |

### MEDIUM — This sprint

| # | Action | Source Doc |
|---|--------|------------|
| 11 | Fix 8 TypeScript errors (tsconfig + test fixture fields) | codebase-audit |
| 12 | Migrate raw Supabase client calls to `createAdminClient()` — 9+ route handlers | codebase-audit |
| 13 | Define era taxonomy (4 buckets) in `types.ts` — comp engine Session 1 is blocked | comp-engine-readiness |
| 14 | Author `lib/comp-engine-v2/feature-registry.ts` (Session 1 gate) | comp-engine-readiness |
| 15 | Author `file 18` (water pump failures): 987.2, 997.2, 991.1, 991.2 — evidence bar cleared | watch-for-catalog-audit |
| 16 | Fix `991.2 yearEnd: 2018` → `2019` to accommodate Speedster + other swan-song models | trim-list-audit |
| 17 | Add 997.2 missing trims: Sport Classic, Speedster | trim-list-audit |
| 18 | Resolve 993 Turbo S count: choose 435 (Porsche Newsroom) with note, or document the dispute | production-counts |
| 19 | Fix `derive930()` orphan in `trim-category/index.ts` — dead code path | trim-list-audit |
| 20 | Replace Macan Gen II trim list with EV-accurate names (`'Macan 4'`, `'Macan Turbo'`) | trim-list-audit |

### LOW — Post-launch / backlog

| # | Action | Source Doc |
|---|--------|------------|
| 21 | Delete dead components: WatchlistCard, WatchlistRefresher, WatchlistSaveButton, TopNav | codebase-audit |
| 22 | Remove unused dependencies: pdf-parse, @types/pdf-parse (wrong dep type + unused) | codebase-audit |
| 23 | Consolidate recencyWeight into shared utility | codebase-audit |
| 24 | Decide on 356 and 912 structural treatment in models.ts | trim-list-audit |
| 25 | Add 992.1 missing trims: Carrera T, Sport Classic, Dakar, S/T, GT3 Touring, Targa 4 GTS | trim-list-audit |
| 26 | Add 991.1/991.2 Targa 4 GTS; pre-964 F-series trims (911T, 911E, 911S) | trim-list-audit |
| 27 | Verify and add 987.1 RS 60 Spyder; 982 Spyder RS | trim-list-audit |
| 28 | Add Taycan 4 to taycan-i generation | trim-list-audit |
| 29 | Verify [VERIFY] items in watch-for-catalog (16 items); prioritize water-pump-in-footwell 986 and 987.1 crossover hose | watch-for-catalog-audit |
| 30 | Surface 993 hydraulic valve lifters note in watch_for array (text already in generation-content.ts line 188) | watch-for-catalog-audit |

---

## Trust Map

| Doc | Trust Level | Reasoning |
|-----|------------|-----------|
| `codebase-audit.md` | **5/5 — Lean on heavily** | Code facts are verifiable; file + line references throughout; no opinion or speculation |
| `comp-engine-readiness.md` | **5/5 — Lean on heavily** | Most technically rigorous doc; ordered work breakdown is sound; risk assessment matches actual failure modes |
| `trim-list-audit.md` | **4.5/5 — High trust; verify before implementing removals** | 6 removal candidates confirmed by web search; additions are factory-sourced; 10 [VERIFY] items on edge cases |
| `watch-for-catalog-audit.md` | **4/5 — Solid; proposed additions need Tier-B sourcing** | Existing catalog findings are correct; proposals are appropriately blocked on Tier-C-only sourcing; 16 [VERIFY] items are honest |
| `production-counts.md` | **4/5 — Good foundation; disputes are real** | Strong citation discipline; flagged disputes match known community disagreements; 928 year-by-year table is trustworthy (928OC source) |
| `inspection-checklists.md` | **3.5/5 — Fix IMS framing before publishing** | Solid practical content; bore scoring bank confirmed correct; IMS framing is the one structural error that must be corrected |
| `lineage-moments.md` | **3.5/5 — Fix before publishing; verify [VERIFY] items** | Excellent editorial voice; most facts hold up; one confirmed factual error (996.2 IMS "improvement") and one Carfax competitor mention must be fixed; [VERIFY] items are appropriate |

---

## Spot Checks Performed

1. **IMS dual-row → single-row changeover year** — confirmed via LN Engineering definitive guide: transition in MY2000 (not MY2002). Lineage-moments claim is false.
2. **993 Turbo S 345 vs. 435** — confirmed genuine conflict between community data (345) and Porsche Newsroom (435).
3. **997.1 bore scoring bank identification** — confirmed Bank 2 (cylinders 4–6) via LN Engineering and 911UK forum. Checklists doc is correct.
4. **964 Carrera 4S existence** — confirmed via Wikipedia and Stuttcars: no 964 C4S was ever produced. Trim audit is correct; entry must be removed.
5. **997.1 Turbo S existence** — confirmed via Elferspot and Wikipedia: Turbo S was 997.2 only, MY2010. Trim audit is correct; entry must be removed.
6. **996.2 IMS revision in 2002** — confirmed no improvement: all 2002–2005 cars have single-row bearing per LN Engineering. Lineage-moments claim is false.

---

*End of review. No source documents modified. No production code, data, or migrations modified. No commits made.*
