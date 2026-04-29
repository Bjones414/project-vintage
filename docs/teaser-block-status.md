# Teaser Block — Status Report

**Status:** Complete
**Date:** 2026-04-29

## Component location

`components/analyze/TeaserBlock.tsx` — Server Component (no interaction state, pure presentation).
Placed in `app/(app)/analyze/[id]/page.tsx` between the two-column card grid and `AnonymousSignupCTA`.

## Headline branching logic

| Condition | Headline |
|-----------|----------|
| `finding_count === 0` or `analysisRow === null` | "Continue with the full analysis." |
| `finding_count === 1` | "We found 1 thing you should ask the seller about this car." |
| `finding_count > 1` | "We found N things you should ask the seller about this car." |

Rendered in `font-serif text-xl font-semibold` — section header weight, smaller than the page headline.

## Tile rendering rules

- Tiles show the first 3 entries from `parseFindings(analysisRow.findings)` (zero-indexed, sliced to 3).
- `parseFindings` validates shape: must have `rule_id`, `title`, `body` as strings. Malformed items are dropped.
- If `findings.length < 3`: render only the available tiles. No padding, no placeholders.
- If `findings.length === 0`: tile section is skipped entirely.

## Blur treatment

- `finding.title`: rendered plainly, not blurred.
- `finding.body`: `className="select-none blur-sm"` + `aria-hidden="true"`. Text is real finding content obscured at teaser layer.
- Affordance: "Sign in to read" (text, `text-xs text-gray-400`). Word "Locked" is banned and does not appear.
- Severity accent chip (`positive` → green-50/green-700, `caution` → amber-50/amber-700, `concern` → red-50/red-700). Uses existing Tailwind tokens.

## "Also in the full report" copy

Five items, static, multi-marque-neutral:
- Numbered findings list with full detail
- Generation deep-dive
- Full vehicle data
- Color rarity context
- Comp set with recency weighting

Separator dots (`·`) between items via Fragment pattern. `text-xs text-gray-500`.

## CTA link by tier

| Tier | Label | Href |
|------|-------|------|
| anonymous | "Sign in for the full analysis" | `/signup?next=/analyze/[id]/full` |
| free | "Read the full analysis" | `/analyze/[id]/full` |
| pro | "Read the full analysis" | `/analyze/[id]/full` |

**TODO planted** at the link site in `TeaserBlock.tsx`: `/analyze/[id]/full` does not exist yet — route will 404 until the full report page is built.

## Types updated

`lib/supabase/types.ts` — `listing_analyses` Row/Insert/Update now includes `findings`, `finding_count`, `confidence_score`, `comp_count` (Phase 5 columns).

`components/analyze/types.ts` — `Finding` type and `parseFindings` helper added (shape per Phase 5 migration comment).

## Fixtures added

- `ANALYSIS_ROW_EMPTY`: `findings: []`, `finding_count: 0` — current expected state.
- `ANALYSIS_ROW_3_FINDINGS`: 3 plausible findings (caution/positive/concern) for the 930 Turbo context.

## Tests added (14 new)

Headline branching, tile counts (0/1/3), blur/select-none class presence, "Also in the full report" strip, CTA by tier, "Locked" banned string assertion.

## Build / lint

- `npm run build` — passed (174 tests, 0 errors)
- `npm run lint` — no warnings or errors

## Commit hash

TBD (see git log)
