import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Stub parsePcaMartListing to avoid real HTTP calls.
// parsePcaMartHtml is tested directly below — no mock needed for that path.
// ---------------------------------------------------------------------------
const { mockParsePcaMartListing } = vi.hoisted(() => ({
  mockParsePcaMartListing: vi.fn(),
}))

vi.mock('@/lib/listing-parser/pca-mart', () => ({
  parsePcaMartListing: mockParsePcaMartListing,
  parsePcaMartHtml: vi.fn(),
}))

import { parseListing } from '@/lib/listing-parser'
import { parsePcaMartHtml } from '@/lib/listing-parser/pca-mart'

const PCA_MART_URL = 'https://mart.pca.org/listing/12345'

const STUB_LISTING = {
  source_platform: 'pca_mart' as const,
  source_url: PCA_MART_URL,
  source_listing_id: '12345',
  title: '1994 993 Carrera',
  year: 1994,
  make: 'Porsche',
  model: '993',
  trim: 'Carrera',
  vin: null,
  mileage: 50000,
  engine: null,
  transmission: null,
  exterior_color: null,
  interior_color: null,
  sold_price_cents: null,
  high_bid_cents: null,
  asking_price_cents: 4500000,
  listing_status: 'asking' as const,
  bid_count: null,
  reserve_met: null,
  has_no_reserve: false,
  auction_end_date: null,
  seller_info: null,
  description: null,
  modification_notes: null,
  image_urls: [],
  raw_data: {},
  should_persist: false as const,
}

beforeEach(() => {
  mockParsePcaMartListing.mockResolvedValue(STUB_LISTING)
})

// ─── Routing ─────────────────────────────────────────────────────────────────

describe('PCA Mart routing — mart.pca.org dispatches to PCA Mart parser', () => {
  it('mart.pca.org URL resolves successfully (not PlatformNotSupportedError)', async () => {
    const result = await parseListing(PCA_MART_URL)
    expect(result.success).toBe(true)
  })

  it('www.mart.pca.org is normalised and routes correctly', async () => {
    const result = await parseListing('https://www.mart.pca.org/listing/12345')
    expect(result.success).toBe(true)
  })

  it('unsupported platform does not route to PCA Mart parser', async () => {
    const result = await parseListing('https://unsupported.example.com/listing/1')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Platform not yet supported/)
  })
})

// ─── Source attribution and isolation (via routing stub) ─────────────────────

describe('PCA Mart listing — source platform and isolation guarantees', () => {
  it('source_platform is pca_mart', async () => {
    const result = await parseListing(PCA_MART_URL)
    if (!result.success) throw new Error(result.error)
    expect(result.listing.source_platform).toBe('pca_mart')
  })

  it('listing_status is "asking" — never qualifies as a sold comp', async () => {
    const result = await parseListing(PCA_MART_URL)
    if (!result.success) throw new Error(result.error)
    expect(result.listing.listing_status).toBe('asking')
  })

  it('sold_price_cents is null — PCA Mart has no sold prices', async () => {
    const result = await parseListing(PCA_MART_URL)
    if (!result.success) throw new Error(result.error)
    expect(result.listing.sold_price_cents).toBeNull()
  })

  it('should_persist is false — listing is classified, not an auction result', async () => {
    const result = await parseListing(PCA_MART_URL)
    if (!result.success) throw new Error(result.error)
    expect(result.listing.should_persist).toBe(false)
  })
})

// ─── HTML parser — isolation fields (real parsePcaMartHtml, no mock needed) ──

// Minimal PCA Mart page: title via h1 with border-bottom style, price block.
const MINIMAL_HTML = `<!DOCTYPE html><html><head></head><body>
  <h1 style="border-bottom: 1px solid #ccc">1994 993 Carrera</h1>
  <h1 class="classified-price">$45,000</h1>
</body></html>`

// Re-import the real parsePcaMartHtml via importActual so the mock above
// doesn't interfere with the HTML parser tests.
let realParsePcaMartHtml: typeof parsePcaMartHtml

beforeEach(async () => {
  const actual = await vi.importActual<typeof import('@/lib/listing-parser/pca-mart')>(
    '@/lib/listing-parser/pca-mart',
  )
  realParsePcaMartHtml = actual.parsePcaMartHtml
})

describe('parsePcaMartHtml — hardcoded isolation fields', () => {
  it('source_platform is always pca_mart', () => {
    const listing = realParsePcaMartHtml(MINIMAL_HTML, PCA_MART_URL)
    expect(listing.source_platform).toBe('pca_mart')
  })

  it('listing_status is always "asking"', () => {
    const listing = realParsePcaMartHtml(MINIMAL_HTML, PCA_MART_URL)
    expect(listing.listing_status).toBe('asking')
  })

  it('sold_price_cents is always null', () => {
    const listing = realParsePcaMartHtml(MINIMAL_HTML, PCA_MART_URL)
    expect(listing.sold_price_cents).toBeNull()
  })

  it('should_persist is always false', () => {
    const listing = realParsePcaMartHtml(MINIMAL_HTML, PCA_MART_URL)
    expect(listing.should_persist).toBe(false)
  })
})
