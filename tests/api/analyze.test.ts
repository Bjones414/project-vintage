import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// vi.hoisted — values created here are available in vi.mock factories even
// though vi.mock calls are hoisted to the top of the file by Vitest.
// ---------------------------------------------------------------------------
const {
  mockGetSession,
  mockParseListing,
  mockDecodeVin,
  mockMatchGeneration,
  mockComputeComps,
} = vi.hoisted(() => ({
  mockGetSession:     vi.fn(),
  mockParseListing:   vi.fn(),
  mockDecodeVin:      vi.fn(),
  mockMatchGeneration: vi.fn(),
  mockComputeComps:   vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({ auth: { getSession: mockGetSession } }),
}))

vi.mock('@/lib/listing-parser', () => ({ parseListing: mockParseListing }))
vi.mock('@/lib/vin-decode/nhtsa', () => ({ decodeVin: mockDecodeVin }))
vi.mock('@/lib/generation-match', () => ({ matchGeneration: mockMatchGeneration }))
vi.mock('@/lib/comp-engine', () => ({ computeComps: mockComputeComps }))

// Mutable holders so individual tests can swap chain behaviour
let mockSingle = vi.fn()
let mockInsert = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'listings') {
        return {
          upsert: () => ({
            select: () => ({ single: () => mockSingle() }),
          }),
        }
      }
      if (table === 'listing_analyses') {
        return { insert: (row: unknown) => mockInsert(row) }
      }
      return {}
    },
  }),
}))

// ---------------------------------------------------------------------------
// Import handler after mocks are wired up
// ---------------------------------------------------------------------------
import { POST } from '@/app/api/analyze/route'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const CANONICAL_LISTING = {
  source_platform: 'bring-a-trailer' as const,
  source_url: 'https://bringatrailer.com/listing/test-car',
  source_listing_id: '99999',
  title: '2024 Porsche 718 Cayman GT4 RS',
  year: 2024,
  make: 'Porsche',
  model: '718 Cayman',
  trim: 'GT4 RS',
  vin: 'WP0AC2A84RS270001',
  mileage: 847,
  engine: null,
  transmission: 'PDK',
  exterior_color: 'Shark Blue',
  interior_color: 'Black',
  sold_price_cents: 22000000,
  listing_status: 'sold' as const,
  bid_count: null,
  reserve_met: true,
  auction_end_date: '2024-09-08T20:00:00.000Z',
  seller_info: null,
  description: 'A 2024 Porsche 718 Cayman GT4 RS.',
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

// ---------------------------------------------------------------------------
// Default setup — authenticated session, successful parse, no VIN decode
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks()

  mockGetSession.mockResolvedValue({
    data: { session: { user: { id: 'user-uuid-001' } } },
  })

  mockParseListing.mockResolvedValue({ success: true, listing: CANONICAL_LISTING })

  mockDecodeVin.mockResolvedValue(null)

  mockMatchGeneration.mockReturnValue({
    generation_id: '982-cayman',
    confidence: 'high',
    needs_review: false,
    candidates: ['982-cayman'],
    reason: 'year + model',
  })

  mockSingle = vi.fn().mockResolvedValue({
    data: { id: 'listing-db-uuid-001' },
    error: null,
  })

  mockInsert = vi.fn().mockResolvedValue({ error: null })
  mockComputeComps.mockResolvedValue({ tier: 'strict', comp_count: 8, fair_value: { low_cents: 90_000_00, median_cents: 100_000_00, high_cents: 110_000_00 } })
})

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------
describe('POST /api/analyze — auth', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } })
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(res.status).toBe(401)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Authentication required')
  })
})

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
describe('POST /api/analyze — input validation', () => {
  it('returns 400 for non-JSON body', async () => {
    const req = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'text/plain' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when url field is missing', async () => {
    const res = await POST(makeRequest({ notUrl: 'x' }))
    expect(res.status).toBe(400)
    const body = await res.json() as { error: string }
    expect(body.error).toContain('url')
  })

  it('returns 400 when url is empty string', async () => {
    const res = await POST(makeRequest({ url: '   ' }))
    expect(res.status).toBe(400)
  })
})

// ---------------------------------------------------------------------------
// Parse failure
// ---------------------------------------------------------------------------
describe('POST /api/analyze — parse failure', () => {
  it('returns 422 when parser fails', async () => {
    mockParseListing.mockResolvedValueOnce({ success: false, error: 'Unsupported platform' })
    const res = await POST(makeRequest({ url: 'https://ebay.com/item/123' }))
    expect(res.status).toBe(422)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Unsupported platform')
  })

  it('returns 422 when required fields are missing', async () => {
    mockParseListing.mockResolvedValueOnce({
      success: true,
      listing: { ...CANONICAL_LISTING, make: null, model: null },
    })
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(res.status).toBe(422)
    const body = await res.json() as { error: string }
    expect(body.error).toContain('make, model, year')
  })
})

// ---------------------------------------------------------------------------
// Database error
// ---------------------------------------------------------------------------
describe('POST /api/analyze — database error', () => {
  it('returns 500 when upsert fails', async () => {
    mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'unique constraint violated' },
    })
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(res.status).toBe(500)
    const body = await res.json() as { error: string }
    expect(body.error).toContain('Database error')
  })
})

// ---------------------------------------------------------------------------
// Success path
// ---------------------------------------------------------------------------
describe('POST /api/analyze — success', () => {
  it('returns 200 with listingId', async () => {
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(res.status).toBe(200)
    const body = await res.json() as { listingId: string; listing: unknown }
    expect(body.listingId).toBe('listing-db-uuid-001')
  })

  it('response includes the canonical listing for backward compat', async () => {
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    const body = await res.json() as { listingId: string; listing: typeof CANONICAL_LISTING }
    expect(body.listing).toMatchObject({
      source_platform: 'bring-a-trailer',
      make: 'Porsche',
      model: '718 Cayman',
    })
  })

  it('creates a listing_analyses row linked to the upserted listing', async () => {
    await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(mockInsert).toHaveBeenCalledOnce()
    const arg = (mockInsert.mock.calls[0] as [Record<string, unknown>])[0]
    expect(arg.listing_id).toBe('listing-db-uuid-001')
    expect(arg.user_id).toBe('user-uuid-001')
    expect(arg.source_url).toBe(CANONICAL_LISTING.source_url)
    expect(arg.source_platform).toBe('bring-a-trailer')
  })

  it('listing_analyses insert failure is non-fatal — still returns 200 with listingId', async () => {
    mockInsert = vi.fn().mockResolvedValue({ error: { message: 'insert failed' } })
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(res.status).toBe(200)
    const body = await res.json() as { listingId: string }
    expect(body.listingId).toBe('listing-db-uuid-001')
  })

  it('calls computeComps with the upserted listing id', async () => {
    await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(mockComputeComps).toHaveBeenCalledOnce()
    expect(mockComputeComps).toHaveBeenCalledWith('listing-db-uuid-001')
  })

  it('computeComps failure is non-fatal — still returns 200', async () => {
    mockComputeComps.mockRejectedValueOnce(new Error('comp engine exploded'))
    const res = await POST(makeRequest({ url: 'https://bringatrailer.com/listing/test' }))
    expect(res.status).toBe(200)
    const body = await res.json() as { listingId: string }
    expect(body.listingId).toBe('listing-db-uuid-001')
  })
})
