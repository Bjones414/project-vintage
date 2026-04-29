import { describe, it, expect } from 'vitest'
import { generationWatchout } from '@/lib/findings/rules/generation-watchout'
import type { RuleInput } from '@/lib/findings/types'
import type { CanonicalListing } from '@/lib/listing-parser/types'

const baseListing: CanonicalListing = {
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/test',
  source_listing_id: 'test-1',
  title: '2001 Porsche 996 Carrera',
  year: 2001,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  vin: null,
  mileage: 55000,
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
  description: 'A clean 996 with recent service.',
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

describe('generationWatchout rule', () => {
  it('returns null for non-IMS generation (993)', () => {
    const input: RuleInput = { listing: baseListing, generationId: '993' }
    expect(generationWatchout(input)).toBeNull()
  })

  it('returns null for non-IMS generation (930)', () => {
    const input: RuleInput = { listing: baseListing, generationId: '930' }
    expect(generationWatchout(input)).toBeNull()
  })

  it('returns null when generationId is null', () => {
    const input: RuleInput = { listing: baseListing, generationId: null }
    expect(generationWatchout(input)).toBeNull()
  })

  it('returns caution for 996 with no IMS mention', () => {
    const input: RuleInput = { listing: baseListing, generationId: '996' }
    const finding = generationWatchout(input)
    expect(finding?.severity).toBe('caution')
    expect(finding?.rule_id).toBe('generation-watchout')
    expect(finding?.qualifier).toBe('IMS bearing')
  })

  it('returns caution for 997 generation with no IMS mention', () => {
    const input: RuleInput = { listing: baseListing, generationId: '997' }
    expect(generationWatchout(input)?.severity).toBe('caution')
  })

  it('returns positive for 996 when IMS retrofit is mentioned', () => {
    const input: RuleInput = {
      listing: {
        ...baseListing,
        description: 'IMS retrofit completed by LN Engineering at 40k miles.',
      },
      generationId: '996',
    }
    const finding = generationWatchout(input)
    expect(finding?.severity).toBe('positive')
    expect(finding?.title).toMatch(/IMS retrofit/i)
  })

  it('returns positive for "IMS replaced" keyword', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'IMS replaced and RMS done.' },
      generationId: '996',
    }
    expect(generationWatchout(input)?.severity).toBe('positive')
  })

  it('returns positive for "LN Engineering" keyword', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'LN Engineering IMS kit installed.' },
      generationId: '996',
    }
    expect(generationWatchout(input)?.severity).toBe('positive')
  })

  it('is case-insensitive for IMS keywords', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'IMS RETROFIT done at dealer.' },
      generationId: '996',
    }
    expect(generationWatchout(input)?.severity).toBe('positive')
  })
})
