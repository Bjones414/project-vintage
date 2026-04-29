import { describe, it, expect } from 'vitest'
import { mileageVsAverage } from '@/lib/findings/rules/mileage-vs-average'
import type { RuleInput } from '@/lib/findings/types'
import type { CanonicalListing } from '@/lib/listing-parser/types'

const baseListing: CanonicalListing = {
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/test',
  source_listing_id: 'test-1',
  title: '1995 Porsche 993 Carrera',
  year: 1995,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  vin: null,
  mileage: 60000,
  engine: null,
  transmission: 'manual',
  exterior_color: null,
  interior_color: null,
  sold_price_cents: null,
  listing_status: 'live',
  bid_count: null,
  reserve_met: null,
  auction_end_date: null,
  seller_info: null,
  description: null,
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

const baseInput: RuleInput = { listing: baseListing, generationId: '993' }

describe('mileageVsAverage rule', () => {
  it('always returns null (dormant)', () => {
    expect(mileageVsAverage(baseInput)).toBeNull()
  })

  it('returns null even with mileage present', () => {
    const input: RuleInput = { ...baseInput, listing: { ...baseListing, mileage: 200000 } }
    expect(mileageVsAverage(input)).toBeNull()
  })
})
