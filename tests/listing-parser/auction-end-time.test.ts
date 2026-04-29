import { describe, it, expect } from 'vitest'
import { load } from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'
import { extractAuctionEndDate } from '@/lib/listing-parser/bring-a-trailer'

// ---------------------------------------------------------------------------
// Fixtures are HTML snapshots saved by the Phase 4 Task 5 diagnostic run.
// They live in tests/scrapers/fixtures/auction-end-time/ (shared with the
// scraper fixture folder by convention — they are BaT pages, not scraper output).
// ---------------------------------------------------------------------------
const FIXTURE_DIR = path.join(__dirname, '../scrapers/fixtures/auction-end-time')

function load_fixture(filename: string) {
  const html = fs.readFileSync(path.join(FIXTURE_DIR, filename), 'utf-8')
  return { html, $: load(html) }
}

// ---------------------------------------------------------------------------
// (a) Live fixture — primary DOM selector (span.listing-end-time[data-timestamp])
// ---------------------------------------------------------------------------
describe('live-911-gt3-2026 (live, primary DOM selector)', () => {
  it('extracts 2026-05-05T19:09:00.000Z', () => {
    const { html, $ } = load_fixture('live-911-gt3-2026.html')
    expect(extractAuctionEndDate($, html)).toBe('2026-05-05T19:09:00.000Z')
  })
})

// ---------------------------------------------------------------------------
// (b) Live fixture — 1988 Carrera (primary DOM selector, confirms non-GT3 car)
// ---------------------------------------------------------------------------
describe('probe-911-carrera-88 (live, 1988 Carrera)', () => {
  it('extracts 2026-05-01T18:16:00.000Z', () => {
    const { html, $ } = load_fixture('probe-911-carrera-88.html')
    expect(extractAuctionEndDate($, html)).toBe('2026-05-01T18:16:00.000Z')
  })
})

// ---------------------------------------------------------------------------
// (c) Live fixture — pre-1981 356A (primary DOM selector, confirms pre-1981 works)
// ---------------------------------------------------------------------------
describe('probe-356a (live, pre-1981 car)', () => {
  it('extracts 2026-04-29T17:15:00.000Z', () => {
    const { html, $ } = load_fixture('probe-356a.html')
    expect(extractAuctionEndDate($, html)).toBe('2026-04-29T17:15:00.000Z')
  })
})

// ---------------------------------------------------------------------------
// (d) Sold fixture — "Auction Ended" stats row selector
// ---------------------------------------------------------------------------
describe('sold-cayman-2009 (sold, fallback DOM selector)', () => {
  it('extracts 2026-04-24T18:55:42.000Z', () => {
    const { html, $ } = load_fixture('sold-cayman-2009.html')
    expect(extractAuctionEndDate($, html)).toBe('2026-04-24T18:55:42.000Z')
  })
})

// ---------------------------------------------------------------------------
// (e) Sold no-reserve fixture — "Auction Ended" stats row selector
// ---------------------------------------------------------------------------
describe('sold-cayman-r-2012 (sold no-reserve, fallback DOM selector)', () => {
  it('extracts 2026-04-27T17:19:38.000Z', () => {
    const { html, $ } = load_fixture('sold-cayman-r-2012.html')
    expect(extractAuctionEndDate($, html)).toBe('2026-04-27T17:19:38.000Z')
  })
})

// ---------------------------------------------------------------------------
// (f) No-sale fixture — "Auction Ended" stats row (Ferrari, reserve not met)
// ---------------------------------------------------------------------------
describe('no-sale-ferrari-360-spider (no-sale, fallback DOM selector)', () => {
  it('extracts 2025-11-07T20:45:12.000Z', () => {
    const { html, $ } = load_fixture('no-sale-ferrari-360-spider.html')
    expect(extractAuctionEndDate($, html)).toBe('2025-11-07T20:45:12.000Z')
  })
})

// ---------------------------------------------------------------------------
// (g) No end-time markers anywhere → null
// ---------------------------------------------------------------------------
describe('no end-time markers present', () => {
  it('returns null when no selectors and no regex match', () => {
    const html = '<html><body><p>No auction data here.</p></body></html>'
    const $ = load(html)
    expect(extractAuctionEndDate($, html)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// (h) Malformed timestamps → null, no throw
// ---------------------------------------------------------------------------
describe('malformed data-timestamp values', () => {
  it('returns null for non-numeric attribute value "abc123"', () => {
    const html = `<html><body>
      <span class="listing-end-time" data-timestamp="abc123">bad</span>
    </body></html>`
    const $ = load(html)
    expect(() => extractAuctionEndDate($, html)).not.toThrow()
    expect(extractAuctionEndDate($, html)).toBeNull()
  })

  it('returns null for far-future epoch (16-digit) attribute value', () => {
    // 9999999999999999 epoch-seconds is year ~317m — outside TS_MAX (2040)
    const html = `<html><body>
      <span class="listing-end-time" data-timestamp="9999999999999999">bad</span>
    </body></html>`
    const $ = load(html)
    expect(() => extractAuctionEndDate($, html)).not.toThrow()
    expect(extractAuctionEndDate($, html)).toBeNull()
  })

  it('returns null for pre-2010 epoch value (before TS_MIN)', () => {
    // 1000000000 = 2001-09-09 — before our 2010 floor
    const html = `<html><body>
      <span class="listing-end-time" data-timestamp="1000000000">bad</span>
    </body></html>`
    const $ = load(html)
    expect(extractAuctionEndDate($, html)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// (i) Regex fallback only — DOM stripped, only BAT_VMS JS present
// ---------------------------------------------------------------------------
describe('BAT_VMS regex fallback (DOM stripped)', () => {
  it('returns correct ISO string when span is absent but end_timestamp appears in script', () => {
    // Simulates a page where the DOM has been stripped but the inline JS survives.
    // Uses the same epoch as live-911-gt3-2026 (1778008140) for easy spot-checking.
    const html = `<html><body>
      <script>
        var BAT_VMS = {"comments":[
          {"type":"bat-bid","end_timestamp":1778008140},
          {"type":"bat-bid","end_timestamp":1778008140}
        ]};
      </script>
    </body></html>`
    const $ = load(html)
    expect(extractAuctionEndDate($, html)).toBe('2026-05-05T19:09:00.000Z')
  })

  it('takes the MAX when multiple distinct end_timestamp values appear (soft-close scenario)', () => {
    // Soft-close can produce bid objects with earlier timestamps followed by the extended one.
    const earlier = 1778008000
    const later   = 1778008140
    const html = `<html><body>
      <script>
        var BAT_VMS = {"comments":[
          {"type":"bat-bid","end_timestamp":${earlier}},
          {"type":"bat-bid","end_timestamp":${later}}
        ]};
      </script>
    </body></html>`
    const $ = load(html)
    expect(extractAuctionEndDate($, html)).toBe(new Date(later * 1000).toISOString())
  })
})
