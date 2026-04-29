import { describe, it, expect } from 'vitest'
import { serviceRecords } from '@/lib/findings/rules/service-records'
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

describe('serviceRecords rule', () => {
  it('returns null when description is null', () => {
    const input: RuleInput = { listing: baseListing, generationId: '993' }
    expect(serviceRecords(input)).toBeNull()
  })

  it('returns null when description has no service record keywords', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'A clean 993 with a fresh set of tires.' },
      generationId: '993',
    }
    expect(serviceRecords(input)).toBeNull()
  })

  it('returns positive finding when "service records" is in description', () => {
    const input: RuleInput = {
      listing: {
        ...baseListing,
        description: 'This car comes with complete service records from new.',
      },
      generationId: '993',
    }
    const finding = serviceRecords(input)
    expect(finding).not.toBeNull()
    expect(finding?.severity).toBe('positive')
    expect(finding?.rule_id).toBe('service-records')
  })

  it('returns positive finding for "service history" keyword', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Full service history on file.' },
      generationId: '993',
    }
    expect(serviceRecords(input)?.severity).toBe('positive')
  })

  it('returns positive finding for "maintenance records"', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Comes with all maintenance records.' },
      generationId: '993',
    }
    expect(serviceRecords(input)?.severity).toBe('positive')
  })

  it('is case-insensitive', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'SERVICE RECORDS available from original dealer.' },
      generationId: '993',
    }
    expect(serviceRecords(input)?.severity).toBe('positive')
  })

  it('finding has required shape', () => {
    const input: RuleInput = {
      listing: { ...baseListing, description: 'Has full service book.' },
      generationId: '993',
    }
    const finding = serviceRecords(input)
    expect(finding?.id).toBe('service-records')
    expect(finding?.rule_id).toBe('service-records')
    expect(finding?.rule_version).toBeTruthy()
    expect(finding?.source).toBe('rules-engine')
    expect(typeof finding?.title).toBe('string')
    expect(typeof finding?.body).toBe('string')
  })
})
