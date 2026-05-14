import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { CanonicalListing } from '@/lib/listing-parser/types'

// ---------------------------------------------------------------------------
// Module isolation strategy
//
// dataCaptureEnabled is a constant captured at import time in write.ts.
// To test different kill-switch states we must reset the module cache and
// re-import with a fresh process.env value before each test.
// ---------------------------------------------------------------------------

const BASE_LISTING: CanonicalListing = {
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/test-911',
  source_listing_id: '12345',
  title: '1990 Porsche 911 Carrera 2',
  year: 1990,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera 2',
  vin: null,
  mileage: 45000,
  engine: null,
  transmission: 'manual',
  exterior_color: 'Guards Red',
  interior_color: null,
  sold_price_cents: 8500000,
  high_bid_cents: null,
  listing_status: 'sold',
  bid_count: 42,
  reserve_met: true,
  has_no_reserve: false,
  auction_end_date: '2026-05-10T20:00:00.000Z',
  seller_info: null,
  description: 'Clean 964 with full service history. No accidents.',
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

const BASE_INPUT = {
  listing: BASE_LISTING,
  listingId: 'listing-uuid-001',
  analyzeRunId: 'analysis-uuid-001',
  generationId: '964',
  generationNeedsReview: false,
}

const originalEnv = process.env.DATA_CAPTURE_ENABLED

afterEach(() => {
  if (originalEnv === undefined) {
    delete process.env.DATA_CAPTURE_ENABLED
  } else {
    process.env.DATA_CAPTURE_ENABLED = originalEnv
  }
  vi.resetModules()
})

// ---------------------------------------------------------------------------
// Kill switch OFF
// ---------------------------------------------------------------------------
describe('writeListingCapture — kill switch OFF', () => {
  beforeEach(() => {
    delete process.env.DATA_CAPTURE_ENABLED
    vi.resetModules()
  })

  it('returns without calling supabase when dataCaptureEnabled is false', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn()
    const mockAdmin = { from: () => ({ insert: mockInsert }) }

    await writeListingCapture(mockAdmin, BASE_INPUT)

    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('does not throw when kill switch is off', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockAdmin = { from: vi.fn() }

    await expect(writeListingCapture(mockAdmin, BASE_INPUT)).resolves.toBeUndefined()
    expect(mockAdmin.from).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Kill switch ON
// ---------------------------------------------------------------------------
describe('writeListingCapture — kill switch ON', () => {
  beforeEach(() => {
    process.env.DATA_CAPTURE_ENABLED = 'true'
    vi.resetModules()
  })

  it('calls supabase insert with required top-level columns', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockAdmin = { from: (_: string) => ({ insert: mockInsert }) }

    await writeListingCapture(mockAdmin, BASE_INPUT)

    expect(mockInsert).toHaveBeenCalledOnce()
    const row = (mockInsert.mock.calls[0] as [Record<string, unknown>])[0]
    expect(row.source_platform).toBe('bring-a-trailer')
    expect(row.source_url).toBe(BASE_LISTING.source_url)
    expect(row.source_listing_id).toBe(BASE_LISTING.source_listing_id)
    expect(row.analyze_run_id).toBe('analysis-uuid-001')
    expect(row.listing_id).toBe('listing-uuid-001')
    expect(row.capture_version).toBe('v1')
  })

  it('stores raw_description verbatim', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockAdmin = { from: (_: string) => ({ insert: mockInsert }) }

    await writeListingCapture(mockAdmin, BASE_INPUT)

    const row = (mockInsert.mock.calls[0] as [Record<string, unknown>])[0]
    expect(row.raw_description).toBe('Clean 964 with full service history. No accidents.')
    expect(row.raw_title).toBe(BASE_LISTING.title)
  })

  it('structured_data contains parser metadata and generation match', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockAdmin = { from: (_: string) => ({ insert: mockInsert }) }

    await writeListingCapture(mockAdmin, BASE_INPUT)

    const row = (mockInsert.mock.calls[0] as [Record<string, unknown>])[0]
    const sd = row.structured_data as Record<string, unknown>
    expect(sd.year).toBe(1990)
    expect(sd.make).toBe('Porsche')
    expect(sd.model).toBe('911')
    expect(sd.trim).toBe('Carrera 2')
    expect(sd.mileage).toBe(45000)
    expect(sd.transmission).toBe('manual')
    expect(sd.listing_status).toBe('sold')
    expect(sd.generation_id).toBe('964')
    expect(sd.generation_needs_review).toBe(false)
  })

  it('propagates supabase insert error so the route try/catch can handle it', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn().mockRejectedValue(new Error('db error'))
    const mockAdmin = { from: (_: string) => ({ insert: mockInsert }) }

    await expect(writeListingCapture(mockAdmin, BASE_INPUT)).rejects.toThrow('db error')
  })

  it('handles null listing_id and analyzeRunId gracefully', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockAdmin = { from: (_: string) => ({ insert: mockInsert }) }

    await writeListingCapture(mockAdmin, { ...BASE_INPUT, listingId: null, analyzeRunId: null })

    const row = (mockInsert.mock.calls[0] as [Record<string, unknown>])[0]
    expect(row.listing_id).toBeNull()
    expect(row.analyze_run_id).toBeNull()
  })

  it('stores null raw_description when listing.description is null', async () => {
    const { writeListingCapture } = await import('@/lib/data-capture/write')
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockAdmin = { from: (_: string) => ({ insert: mockInsert }) }

    await writeListingCapture(mockAdmin, {
      ...BASE_INPUT,
      listing: { ...BASE_LISTING, description: null },
    })

    const row = (mockInsert.mock.calls[0] as [Record<string, unknown>])[0]
    expect(row.raw_description).toBeNull()
  })
})
