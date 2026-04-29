# Analyze Refactor 3a — Tier Plumbing, Verdict Block by Tier, Metric Tiles Unlocked

**Status:** Complete  
**Date:** 2026-04-29

## Tier helper

**Location:** `lib/auth/viewer-tier.ts`  
**Signature:** `async function getViewerTier(): Promise<{ tier: ViewerTier; bypass: boolean }>`  
**Called in:** `app/(app)/analyze/[id]/page.tsx` via `Promise.all` alongside the listing query

**Logic:**
| Condition | tier | bypass |
|-----------|------|--------|
| No session | `anonymous` | false |
| role in ('admin', 'beta') | `pro` | true |
| subscription_tier in ('pro', 'collector') | `pro` | false |
| Any other signed-in user | `free` | false |

## TODOs planted

- `lib/auth/viewer-tier.ts` (bypass site): "TODO: bypass mechanism is provisional — when real Pro entitlements ship, this needs to read from a subscriptions table or equivalent."
- `lib/auth/viewer-tier.ts` (pro flag): "TODO: until a subscriptions table ships, manually setting subscription_tier is the only way to grant pro access outside admin/beta bypass."

## ViewerTier type migration

`'anonymous' | 'member'` → `'anonymous' | 'free' | 'pro'`  
Defined in `lib/auth/viewer-tier.ts`, re-exported from `components/analyze/types.ts` for backwards-compat with all component imports.  
`ColorRarityCard` had a `viewerTier === 'member'` check (missed in original port); fixed to `!== 'anonymous'` — no UX change.

## Verdict block copy by tier

| Tier | Headline | Body | CTA |
|------|----------|------|-----|
| anonymous | "Sign in to see the verdict on this car." | Value prop (1 sentence) | "Unlock — it's free" → `/signup?next=/analyze/[id]` |
| free | analysisData.lede | analysisData.secondary_line | confidence_label (text only; confidence_score numeric % not shown) |
| pro | Same as free (pro expansion is a later task) | — | — |

## Metric tile changes

- Removed `locked` prop and "Free account" value-replacement from `MetricTiles.tsx`
- All four tiles show real values for all tiers
- Anonymous + Comps Used tile: shows the count + hint `"Sign in to see full comparison"` (no blur, no lock icon)

## Tests added / updated

- `tests/lib/auth/viewer-tier.test.ts` (new): 7 tests covering all session/role/tier combos including admin/beta bypass
- `tests/components/analyze/components.test.tsx`: all `viewerTier="member"` references replaced with `"free"`, VerdictBlock and MetricTiles tests rewritten for new tier behavior, "Locked" / old lock pattern assertions added, 15 snapshots regenerated

## Build / lint

- `npm run build` — passed (142 tests, 0 errors)
- `npm run lint` — no warnings or errors
- Total tests: 142 passing

## Commit hash

TBD (see git log)
