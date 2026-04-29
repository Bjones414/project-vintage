# Route Rename: /search/[listingId] → /analyze/[id]

**Status:** Complete  
**Date:** 2026-04-29

## Changes

| File | Change |
|------|--------|
| `app/(app)/analyze/[id]/page.tsx` | Created — new route (params renamed from `listingId` to `id`) |
| `app/(app)/search/[listingId]/page.tsx` | Deleted — old route |
| `app/(app)/analyze/page.tsx` | `router.replace('/search/...')` → `router.replace('/analyze/...')` |
| `tests/components/analyze-page.test.tsx` | Updated test description and assertion to `/analyze/...` |
| `next.config.mjs` | Added 301 redirect: `/search/:listingId` → `/analyze/:listingId` |

## Verification

- `npm run build` — passed, `/analyze/[id]` appears as dynamic route
- `npm run lint` — no warnings or errors
- `/search` placeholder page (`app/(app)/search/page.tsx`) untouched — separate feature
- `/api/listings/[id]/refresh-status` — already used `[id]`, no change needed
- No remaining `/search/` references in application code (only the redirect `source`)
