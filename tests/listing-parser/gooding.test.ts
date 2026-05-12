import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { parseGoodingPageData } from '@/lib/listing-parser/gooding'

const FIXTURE_DIR = path.join(__dirname, '../fixtures')

function loadFixture(filename: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, filename), 'utf-8'))
}

// ---------------------------------------------------------------------------
// Fixture: 2009 Porsche 997 GT2 — sold, USD, with reserve
// ---------------------------------------------------------------------------
describe('gooding-page-data.json (2009 Porsche 997 GT2, sold)', () => {
  const fixture = loadFixture('gooding-page-data.json')
  const SOURCE_URL = 'https://www.goodingco.com/lot/2009-porsche-997-gt2/'
  const listing = parseGoodingPageData(fixture, SOURCE_URL)

  it('source_platform is "gooding"', () => {
    expect(listing.source_platform).toBe('gooding')
  })

  it('source_url preserved', () => {
    expect(listing.source_url).toBe(SOURCE_URL)
  })

  it('source_listing_id is the slug', () => {
    expect(listing.source_listing_id).toBe('2009-porsche-997-gt2')
  })

  it('title', () => {
    expect(listing.title).toBe('2009 Porsche 997 GT2')
  })

  it('year', () => {
    expect(listing.year).toBe(2009)
  })

  it('make', () => {
    expect(listing.make).toBe('Porsche')
  })

  it('model', () => {
    expect(listing.model).toBe('997 GT2')
  })

  it('trim is null (title exactly matches year+make+model)', () => {
    expect(listing.trim).toBeNull()
  })

  it('vin — 17-char normalized to uppercase', () => {
    expect(listing.vin).toBe('WP0AD29939S778090')
  })

  it('mileage extracted from highlights (17,800 → 17800)', () => {
    expect(listing.mileage).toBe(17800)
  })

  it('exterior_color extracted from "Finished in Elegant Black over..."', () => {
    expect(listing.exterior_color).toBe('Elegant Black')
  })

  it('interior_color extracted from "...over Black Color Combination"', () => {
    expect(listing.interior_color).toBe('Black')
  })

  it('transmission extracted from specifications', () => {
    expect(listing.transmission).toBe('6-Speed Manual Transaxle')
  })

  it('engine extracted from specifications', () => {
    expect(listing.engine).toBe('3,600 CC DOHC Flat 6-Cylinder Engine')
  })

  it('sold_price_cents — $368,000 → 36800000 cents', () => {
    expect(listing.sold_price_cents).toBe(36800000)
  })

  it('high_bid_cents is null (Gooding has no bidding data)', () => {
    expect(listing.high_bid_cents).toBeNull()
  })

  it('listing_status is "sold"', () => {
    expect(listing.listing_status).toBe('sold')
  })

  it('reserve_met is true (sold with reserve)', () => {
    expect(listing.reserve_met).toBe(true)
  })

  it('has_no_reserve is false (hasReservePrice = true)', () => {
    expect(listing.has_no_reserve).toBe(false)
  })

  it('auction_end_date is ISO string of last auction subEvent', () => {
    // 2026-03-06T11:00-05:00 → UTC 16:00
    expect(listing.auction_end_date).toBe('2026-03-06T16:00:00.000Z')
  })

  it('image_urls constructed from cloudinaryImagesCombined', () => {
    expect(listing.image_urls).toHaveLength(2)
    expect(listing.image_urls[0]).toBe(
      'https://media.goodingco.com/image/upload/f_auto,q_auto/v1/Prod/FL26_Amelia%20Island%202026/524_2009%20Porsche%20997%20GT2/2009_Porsche_997_GT2_22_ebfigp',
    )
  })

  it('raw_data contains estimate_low_cents and estimate_high_cents', () => {
    expect(listing.raw_data.estimate_low_cents).toBe(40000000)
    expect(listing.raw_data.estimate_high_cents).toBe(50000000)
  })

  it('raw_data contains lot_number', () => {
    expect(listing.raw_data.lot_number).toBe(113)
  })

  it('raw_data contains auction_name', () => {
    expect(listing.raw_data.auction_name).toBe('Amelia Island Auctions')
  })
})

// ---------------------------------------------------------------------------
// No-sale scenario: salePrice null → listing_status "no-sale", reserve_met false
// ---------------------------------------------------------------------------
describe('no-sale scenario (salePrice null, hasReservePrice true)', () => {
  const fixture = loadFixture('gooding-page-data.json')
  const base = JSON.parse(JSON.stringify(fixture)) as {
    result: { data: { contentfulLot: { salePrice: number | null } } }
  }
  base.result.data.contentfulLot.salePrice = null

  const listing = parseGoodingPageData(base, 'https://www.goodingco.com/lot/test/')

  it('listing_status is "no-sale"', () => {
    expect(listing.listing_status).toBe('no-sale')
  })

  it('sold_price_cents is null', () => {
    expect(listing.sold_price_cents).toBeNull()
  })

  it('reserve_met is false (reserve not met)', () => {
    expect(listing.reserve_met).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// No-reserve scenario: hasReservePrice false
// ---------------------------------------------------------------------------
describe('no-reserve scenario (hasReservePrice false)', () => {
  const fixture = loadFixture('gooding-page-data.json')
  const base = JSON.parse(JSON.stringify(fixture)) as {
    result: {
      data: {
        contentfulLot: { hasReservePrice: boolean; salePrice: number | null }
      }
    }
  }
  base.result.data.contentfulLot.hasReservePrice = false
  base.result.data.contentfulLot.salePrice = 300000

  const listing = parseGoodingPageData(base, 'https://www.goodingco.com/lot/test/')

  it('has_no_reserve is true', () => {
    expect(listing.has_no_reserve).toBe(true)
  })

  it('reserve_met is null when no reserve', () => {
    expect(listing.reserve_met).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// USD-only filter: EUR auction throws
// ---------------------------------------------------------------------------
describe('EUR auction → throws USD-only error', () => {
  const fixture = loadFixture('gooding-page-data.json')
  const eur = JSON.parse(JSON.stringify(fixture)) as {
    result: { data: { contentfulLot: { auction: { currency: string } } } }
  }
  eur.result.data.contentfulLot.auction.currency = 'EUR'

  it('throws with the V1 USD-only message', () => {
    expect(() => parseGoodingPageData(eur, 'https://www.goodingco.com/lot/test/')).toThrow(
      "Gooding listings outside USD aren't supported in V1. International support coming soon.",
    )
  })
})

// ---------------------------------------------------------------------------
// Malformed JSON: missing contentfulLot → throws parse error
// ---------------------------------------------------------------------------
describe('malformed page-data (missing contentfulLot)', () => {
  it('throws parse error', () => {
    const bad = { result: { data: {} } }
    expect(() => parseGoodingPageData(bad, 'https://www.goodingco.com/lot/test/')).toThrow(
      "Couldn't parse this Gooding listing. The page format may have changed.",
    )
  })

  it('non-object input throws parse error', () => {
    expect(() => parseGoodingPageData('not json', 'https://www.goodingco.com/lot/test/')).toThrow(
      "Couldn't parse this Gooding listing. The page format may have changed.",
    )
  })
})

// ---------------------------------------------------------------------------
// Pre-1981 chassis number: kept as-is (not normalized to uppercase 17-char)
// ---------------------------------------------------------------------------
describe('pre-1981 chassis number (< 17 chars)', () => {
  const fixture = loadFixture('gooding-page-data.json')
  const pre81 = JSON.parse(JSON.stringify(fixture)) as {
    result: {
      data: {
        contentfulLot: {
          item: { chassis: string; modelYear: number }
        }
      }
    }
  }
  pre81.result.data.contentfulLot.item.chassis = '356123'
  pre81.result.data.contentfulLot.item.modelYear = 1958

  const listing = parseGoodingPageData(pre81, 'https://www.goodingco.com/lot/test/')

  it('vin preserved as-is for short chassis numbers', () => {
    expect(listing.vin).toBe('356123')
  })

  it('year is 1958', () => {
    expect(listing.year).toBe(1958)
  })
})
