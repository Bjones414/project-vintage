# Schema Expansion Step 8 — Tests

**Status:** Complete  
**Date:** 2026-04-29

## New test file

`tests/schema/migration-smoke.test.ts`

## Strategy

Reads migration SQL files from disk (no database connection — consistent with project's "integration test infrastructure deferred" policy). Asserts each expected column name appears in the correct migration file and verifies structural properties of the market_snapshots migration (RLS, grants, index name).

## Test results

| Metric | Before | After |
|--------|--------|-------|
| Test files | 25 passed, 4 skipped | 26 passed, 4 skipped |
| Tests | 308 passing | 346 passing |
| New tests | — | +38 |
| Regressions | — | 0 |

## Covers

- Step 1: 4 column assertions
- Step 2: 2 column assertions
- Step 3: 5 column assertions + 2 CHECK value assertions
- Step 4: 7 column assertions
- Step 5: 5 column assertions
- Step 6: 8 column assertions + table creation + index + RLS + GRANT assertions (12 tests)
