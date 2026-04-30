# Comp Engine Step 6 — BaT Archive Seeding

**Status:** Complete  
**Date:** 2026-04-30

## What happened

BaT's tag archive pages (`/tag/porsche-911-993/`) now return 404 — their site was restructured. Discovered and switched to BaT's public listings-filter REST API (`/wp-json/bringatrailer/1.0/data/listings-filter`), which exposes full pagination, sold status, and listing URLs.

## Seed results

| Metric | Value |
|--------|-------|
| Generation | 993 |
| URLs discovered | 200 |
| Seeded (new) | 198 |
| Skipped (already in DB) | 1 |
| Failed | 1 |
| computeComps run | 199 |
| computeComps failures | 0 |

The one failure was `listing/manuals-15` — a parts/manuals listing with no `make`, which correctly failed the DB not-null constraint and was not seeded.

## API discovery

BaT exposes `/wp-json/bringatrailer/1.0/data/listings-filter` with params:
- `page` (required)
- `get_items=1` to return listing objects
- `state=sold` for sold-only results
- `include_s` for keyword search
- `minimum_year` / `maximum_year` for model year filter

Total available for "porsche 993" 1993–1998: **986 sold listings** across 28 pages.

## Files changed

- `scripts/seed-corpus-bat.ts` — replaced tag-page HTML scrape with API pagination; added `GENERATION_PARAMS` map for generation → search params

## Next step

Step 7: Run computeComps idempotent refresh on all 993 listings in corpus.
