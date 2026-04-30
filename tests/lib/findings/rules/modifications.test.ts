import { describe, it, expect } from 'vitest'
import { modifications } from '@/lib/findings/rules/modifications'
import type { RuleInput } from '@/lib/findings/types'
import type { CanonicalListing } from '@/lib/listing-parser/types'

const baseListing: CanonicalListing = {
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/test',
  source_listing_id: 'test-1',
  title: '1990 Porsche 964 Carrera 4',
  year: 1990,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera 4',
  vin: null,
  mileage: 75000,
  engine: null,
  transmission: 'manual',
  exterior_color: null,
  interior_color: null,
  sold_price_cents: null,
  high_bid_cents: null,
  listing_status: 'live',
  bid_count: null,
  reserve_met: null,
  has_no_reserve: false,
  auction_end_date: null,
  seller_info: null,
  description: 'A numbers-matching, unmodified 964.',
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

describe('modifications rule', () => {
  it('returns positive finding when no modification keywords found', () => {
    const input: RuleInput = { listing: baseListing, generationId: '964' }
    const finding = modifications(input)
    expect(finding?.severity).toBe('positive')
    expect(finding?.rule_id).toBe('modifications')
  })

  it('returns caution when "modified" is in description', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Engine has been modified for more power.' },
      generationId: '964',
    }
    const finding = modifications(input)
    expect(finding?.severity).toBe('caution')
  })

  it('returns caution when "aftermarket" is in description', () => {
    const input: RuleInput = {
      listing: {
        ...baseListing,
        description: 'Aftermarket exhaust and intake fitted by previous owner.',
      },
      generationId: '964',
    }
    expect(modifications(input)?.severity).toBe('caution')
  })

  it('returns caution when modification_notes is non-empty', () => {
    const input: RuleInput = {
      listing: {
        ...baseListing,
        description: 'Clean 964 in great shape.',
        modification_notes: 'Bilstein PSS10 coilovers installed',
      },
      generationId: '964',
    }
    expect(modifications(input)?.severity).toBe('caution')
  })

  it('returns positive when modification_notes is null and description is clean', () => {
    const input: RuleInput = {
      listing: { ...baseListing, modification_notes: null },
      generationId: '964',
    }
    expect(modifications(input)?.severity).toBe('positive')
  })

  it('returns caution for "coilover" keyword', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Runs coilovers from previous owner.' },
      generationId: '964',
    }
    expect(modifications(input)?.severity).toBe('caution')
  })

  it('is case-insensitive', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'AFTERMARKET exhaust fitted.' },
      generationId: '964',
    }
    expect(modifications(input)?.severity).toBe('caution')
  })
})
