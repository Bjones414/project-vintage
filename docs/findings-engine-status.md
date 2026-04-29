# Findings Engine — Status Report

**Status:** Complete
**Date:** 2026-04-29

## File layout

```
lib/findings/
  types.ts           — canonical Finding type, RuleInput, RuleFn, parseFindings
  dispatcher.ts      — runFindingsRules: runs all rules, try/catch per rule, filters nulls
  index.ts           — re-exports dispatcher + types
  rules/
    mileage-vs-average.ts   — DORMANT (no reference data)
    service-records.ts
    modifications.ts
    title-status.ts
    generation-watchout.ts
```

## Canonical Finding type

`lib/findings/types.ts` is the source of truth. `components/analyze/types.ts` re-exports from there.

```ts
type Finding = {
  id: string           // same as rule_id for now
  rule_id: string
  rule_version: string
  source: string
  category: FindingCategory
  severity: FindingSeverity
  title: string
  body: string
  qualifier: string | null
}
```

`parseFindings` moved here from `components/analyze/types.ts`. Validator checks `rule_id`, `title`, `body`, `severity` — loose enough to tolerate DB rows written before the full shape was established.

## Rules

| Rule | Trigger | Finding |
|------|---------|---------|
| `mileage-vs-average` | — | **null (dormant)** — no `average_mileage_at_year` in `porsche_generations` |
| `service-records` | Keywords in `description` | positive if matched, null if not |
| `modifications` | Keywords in `description` or non-empty `modification_notes` | caution if found, positive if clean |
| `title-status` | Phrases in `description` or listing `title` | concern if found, null if clean |
| `generation-watchout` | `generationId` in IMS at-risk set (`996`, `997`, `997-gen1`) | positive if IMS addressed keywords found, else caution |

### Keyword matching notes
- `modifications` uses a leading `\b` word boundary so `"modified"` does not match `"unmodified"`, but `"coilover"` still matches `"coilovers"`.
- `title-status` uses full phrases only (e.g., `"salvage title"` not just `"salvage"`) to reduce false positives. Note: `"no salvage title"` still triggers the rule — conservative behavior is intentional for a concern-category rule.
- All checks are case-insensitive.

## Dispatcher

`runFindingsRules(input: RuleInput): Finding[]`

- Runs all 5 rules in sequence
- Wraps each in try/catch — one rule throwing does not block others
- Returns only non-null results
- Logs errors to console.error with rule name

## Wired into /api/analyze

`app/api/analyze/route.ts` now calls `runFindingsRules` after generation matching and includes the output in the `listing_analyses` insert:

```ts
const findings = runFindingsRules({ listing, generationId: generationResult.generation_id })
// ...
findings: findings as any,
finding_count: findings.length,
```

## Tests

40 new tests across 6 files in `tests/lib/findings/`:

- `rules/mileage-vs-average.test.ts` — 2 tests: always returns null
- `rules/service-records.test.ts` — 7 tests: null cases, keyword coverage, case-insensitivity, shape
- `rules/modifications.test.ts` — 7 tests: positive when clean, caution from description keywords, caution from modification_notes, boundary fix
- `rules/title-status.test.ts` — 8 tests: null case, concern phrases, title field, case-insensitivity, conservative "no salvage title" behavior
- `rules/generation-watchout.test.ts` — 9 tests: null for safe generations, caution for 996/997, positive on IMS keywords, case-insensitivity
- `dispatcher.test.ts` — 6 tests: array return, null filtering, shape validation, error isolation

## TODOs planted

- `mileage-vs-average.ts`: dormant until `porsche_generations` has average mileage reference data
- `generation-watchout.ts`: multi-marque dispatch TODO at file top — when non-Porsche marques ship, extract era-specific concerns into a config keyed by `(marque, generation_code)`
- `generation-watchout.ts`: IMS at-risk set (`IMS_AT_RISK_GENERATION_IDS`) should be verified against actual `porsche_generations.generation_id` values in the database

## Build / lint

- `npm run build` — passed (214 tests, 0 errors)
- `npm run lint` — no warnings or errors
