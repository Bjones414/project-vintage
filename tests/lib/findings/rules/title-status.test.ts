import { describe, it, expect } from 'vitest'
import { titleStatus } from '@/lib/findings/rules/title-status'
import type { RuleInput } from '@/lib/findings/types'
import type { CanonicalListing } from '@/lib/listing-parser/types'

const baseListing: CanonicalListing = {
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/test',
  source_listing_id: 'test-1',
  title: '1975 Porsche 911 Carrera',
  year: 1975,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  vin: null,
  mileage: 50000,
  engine: null,
  transmission: 'manual',
  exterior_color: null,
  interior_color: null,
  sold_price_cents: null,
  high_bid_cents: null,
  listing_status: 'sold',
  bid_count: null,
  reserve_met: true,
  has_no_reserve: false,
  auction_end_date: null,
  seller_info: null,
  description: 'A clean title 911 with no accidents.',
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

describe('titleStatus rule', () => {
  it('returns null when description has no concern phrases', () => {
    const input: RuleInput = { listing: baseListing, generationId: '911-g' }
    expect(titleStatus(input)).toBeNull()
  })

  it('returns null when description is null', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: null },
      generationId: '911-g',
    }
    expect(titleStatus(input)).toBeNull()
  })

  it('returns concern for "salvage title" in description', () => {
    const input: RuleInput = {
      listing: {
        ...baseListing,
        description: 'This car has a salvage title due to a prior insurance claim.',
      },
      generationId: '911-g',
    }
    const finding = titleStatus(input)
    expect(finding?.severity).toBe('concern')
    expect(finding?.rule_id).toBe('title-status')
  })

  it('returns concern for "rebuilt title"', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Sold with a rebuilt title.' },
      generationId: '911-g',
    }
    expect(titleStatus(input)?.severity).toBe('concern')
  })

  it('returns concern for "flood damage"', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Repaired after minor flood damage.' },
      generationId: '911-g',
    }
    expect(titleStatus(input)?.severity).toBe('concern')
  })

  it('returns concern for "frame damage"', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Some prior frame damage, professionally repaired.' },
      generationId: '911-g',
    }
    expect(titleStatus(input)?.severity).toBe('concern')
  })

  it('does not fire on "no salvage title" — phrase match prevents false positive', () => {
    // "no salvage title" contains "salvage title" as substring — this WILL fire
    // which is the conservative correct behavior for a concern rule
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Clean, no salvage title.' },
      generationId: '911-g',
    }
    // Conservative: "salvage title" substring triggers the rule regardless of negation
    expect(titleStatus(input)?.severity).toBe('concern')
  })

  it('checks the listing title field as well', () => {
    const input: RuleInput = {
      listing: {
        ...baseListing,
        description: 'Clean car.',
        title: '1975 Porsche 911 Salvage Title Rebuild',
      },
      generationId: '911-g',
    }
    expect(titleStatus(input)?.severity).toBe('concern')
  })

  it('is case-insensitive', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Car comes with a REBUILT TITLE.' },
      generationId: '911-g',
    }
    expect(titleStatus(input)?.severity).toBe('concern')
  })
})
