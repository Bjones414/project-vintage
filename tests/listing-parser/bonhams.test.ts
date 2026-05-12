import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseBonhamsHtml, USD_ONLY_ERROR, PARSE_ERROR } from '@/lib/listing-parser/bonhams'

const FIXTURE_URL =
  'https://cars.bonhams.com/auction/29099/lot/6099801/1973-porsche-911-carrera-rs-27'

function loadFixture(name: string): string {
  return readFileSync(join(__dirname, '..', 'fixtures', name), 'utf-8')
}

// Minimal GBP page — exercises USD-only filter (real currency schema: nested object)
const GBP_HTML = `
<!DOCTYPE html><html><head>
<title>1974 Porsche 911 | Bonhams Cars</title>
<script id="__NEXT_DATA__" type="application/json">
{"props":{"pageProps":{"lot":{
  "iSaleItemNo": 9999,
  "sDesc": "1974 Porsche 911",
  "currency": {"iso_code": "GBP", "bonhams_code": "£"},
  "dHammerPremium": 60000,
  "sLotStatus": "SOLD"
}}}}
</script>
</head><body><h1>1974 Porsche 911</h1><span class="price">£60,000</span></body></html>
`

// Minimal page with no __NEXT_DATA__ — HTML-only fallback path
const HTML_ONLY_PAGE = `
<!DOCTYPE html><html><head>
<title>1989 Porsche 911 Carrera | Bonhams Cars</title>
</head><body>
<h1>1989 Porsche 911 Carrera</h1>
<span class="badge">Sold</span>
<dl>
  <dt>Chassis No.</dt><dd>WPOAB0917KS122456</dd>
  <dt>Mileage</dt><dd>42,100 Miles</dd>
  <dt>Exterior</dt><dd>Guards Red</dd>
  <dt>Interior</dt><dd>Black</dd>
</dl>
<span class="estimate">Estimate: $80,000 - $110,000</span>
<span class="price-label">Hammer price inc. premium</span>
<span class="price-value">$95,000</span>
<time datetime="2023-08-18T00:00:00.000Z">August 18, 2023</time>
</body></html>
`

describe('parseBonhamsHtml — USD fixture (primary __NEXT_DATA__ path)', () => {
  let result: ReturnType<typeof parseBonhamsHtml>

  beforeAll(() => {
    result = parseBonhamsHtml(loadFixture('bonhams-listing.html'), FIXTURE_URL)
  })

  it('sets source_platform to bonhams', () => {
    expect(result.source_platform).toBe('bonhams')
  })

  it('uses iSaleItemNo as source_listing_id (globally unique)', () => {
    expect(result.source_listing_id).toBe('6099801')
  })

  it('extracts title from sDesc (before Chassis no.)', () => {
    expect(result.title).toBe('1973 Porsche 911 Carrera RS 2.7')
  })

  it('extracts year from title', () => {
    expect(result.year).toBe(1973)
  })

  it('extracts make from title', () => {
    expect(result.make).toBe('Porsche')
  })

  it('extracts model from title', () => {
    expect(result.model).toBe('911 Carrera RS 2.7')
  })

  it('extracts chassis number from sDesc (pre-1981 = stays as-is)', () => {
    expect(result.vin).toBe('9113600803')
  })

  it('extracts engine number into raw_data (never persisted)', () => {
    expect(result.raw_data['engine_number']).toBe('6630803')
  })

  it('engine field is null (only engine description would go here, not serial)', () => {
    expect(result.engine).toBeNull()
  })

  it('extracts mileage from sExtraDesc prose', () => {
    expect(result.mileage).toBe(45200)
  })

  it('extracts exterior color from dt/dd', () => {
    expect(result.exterior_color).toBe('Grand Prix White')
  })

  it('extracts interior color from dt/dd', () => {
    expect(result.interior_color).toBe('Black Leatherette')
  })

  it('extracts transmission from body text', () => {
    expect(result.transmission).toMatch(/Manual/i)
  })

  it('uses dHammerPremium as sold_price_cents (incl. premium)', () => {
    // 990000 dollars × 100 = 99000000 cents
    expect(result.sold_price_cents).toBe(99_000_000)
  })

  it('high_bid_cents is null for a sold lot', () => {
    expect(result.high_bid_cents).toBeNull()
  })

  it('flags price_includes_premium true in raw_data', () => {
    expect(result.raw_data['price_includes_premium']).toBe(true)
  })

  it('stores estimate range in raw_data', () => {
    expect(result.raw_data['estimate_low_cents']).toBe(75_000_000)
    expect(result.raw_data['estimate_high_cents']).toBe(95_000_000)
  })

  it('maps sLotStatus SOLD → listing_status sold', () => {
    expect(result.listing_status).toBe('sold')
  })

  it('sets reserve_met true for sold lot with reserve', () => {
    expect(result.reserve_met).toBe(true)
  })

  it('has_no_reserve false (lWithoutReserve: false)', () => {
    expect(result.has_no_reserve).toBe(false)
  })

  it('extracts auction_end_date from hammerTime.datetime', () => {
    expect(result.auction_end_date).toBe('2024-01-18T22:00:00.000Z')
  })

  it('extracts image URLs from images[i].image_url', () => {
    expect(result.image_urls).toHaveLength(2)
    expect(result.image_urls[0]).toContain('bonhams.com')
  })

  it('flags next_data_available true', () => {
    expect(result.raw_data['next_data_available']).toBe(true)
  })
})

describe('parseBonhamsHtml — USD-only filter (real nested currency schema)', () => {
  it('throws USD_ONLY_ERROR for a GBP lot', () => {
    expect(() =>
      parseBonhamsHtml(GBP_HTML, 'https://cars.bonhams.com/auction/12345/lot/9999/1974-porsche-911'),
    ).toThrow(USD_ONLY_ERROR)
  })

  it('error message is user-facing (no internal jargon)', () => {
    let msg = ''
    try {
      parseBonhamsHtml(GBP_HTML, 'https://cars.bonhams.com/auction/12345/lot/9999/1974-porsche-911')
    } catch (e) {
      msg = (e as Error).message
    }
    expect(msg).toContain('V1')
    expect(msg).not.toContain('undefined')
    expect(msg).not.toContain('null')
  })
})

describe('parseBonhamsHtml — HTML-only fallback (no __NEXT_DATA__)', () => {
  let result: ReturnType<typeof parseBonhamsHtml>
  const url = 'https://cars.bonhams.com/auction/55555/lot/7/1989-porsche-911-carrera'

  beforeAll(() => {
    result = parseBonhamsHtml(HTML_ONLY_PAGE, url)
  })

  it('falls back to h1 for title', () => {
    expect(result.title).toBe('1989 Porsche 911 Carrera')
  })

  it('parses year from title', () => {
    expect(result.year).toBe(1989)
  })

  it('extracts 17-char VIN from dt/dd chassis label and normalizes to uppercase', () => {
    expect(result.vin).toBe('WPOAB0917KS122456')
  })

  it('extracts mileage from dt/dd pair', () => {
    expect(result.mileage).toBe(42100)
  })

  it('extracts estimate from HTML prose', () => {
    expect(result.raw_data['estimate_low_cents']).toBe(8_000_000)
    expect(result.raw_data['estimate_high_cents']).toBe(11_000_000)
  })

  it('extracts hammer inc. premium from HTML prose', () => {
    expect(result.sold_price_cents).toBe(9_500_000)
    expect(result.raw_data['price_includes_premium']).toBe(true)
  })

  it('falls back to sold status from visible text', () => {
    expect(result.listing_status).toBe('sold')
  })

  it('sets next_data_available false', () => {
    expect(result.raw_data['next_data_available']).toBe(false)
  })

  it('extracts auction_end_date from <time datetime>', () => {
    expect(result.auction_end_date).toBe('2023-08-18T00:00:00.000Z')
  })
})

describe('parseBonhamsHtml — no-sale lot (UNSOLD status)', () => {
  const NO_SALE_HTML = `
    <!DOCTYPE html><html><head>
    <title>1988 Porsche 930 Turbo | Bonhams Cars</title>
    <script id="__NEXT_DATA__" type="application/json">
    {"props":{"pageProps":{"lot":{
      "iSaleItemNo": 5050505,
      "sDesc": "1988 Porsche 930 Turbo Chassis no. WP0ZZZ93ZJS000123",
      "currency": {"iso_code": "USD", "bonhams_code": "US$"},
      "dEstimateLowCur": 200000, "dEstimateHighCur": 275000,
      "dHammerPrice": 185000, "dHammerPremium": 0,
      "sLotStatus": "UNSOLD",
      "lWithoutReserve": false,
      "hammerTime": {"datetime": "2023-08-18T00:00:00.000Z"}
    }}}}
    </script>
    </head><body><h1>1988 Porsche 930 Turbo</h1><span>Not Sold</span></body></html>
  `

  it('maps UNSOLD → no-sale', () => {
    const r = parseBonhamsHtml(NO_SALE_HTML, 'https://cars.bonhams.com/auction/99/lot/5050505/1988-porsche-930-turbo')
    expect(r.listing_status).toBe('no-sale')
  })

  it('puts dHammerPrice into high_bid_cents (not sold_price_cents) when UNSOLD', () => {
    const r = parseBonhamsHtml(NO_SALE_HTML, 'https://cars.bonhams.com/auction/99/lot/5050505/1988-porsche-930-turbo')
    expect(r.sold_price_cents).toBeNull()
    expect(r.high_bid_cents).toBe(18_500_000)
  })

  it('sets reserve_met false for UNSOLD lot', () => {
    const r = parseBonhamsHtml(NO_SALE_HTML, 'https://cars.bonhams.com/auction/99/lot/5050505/1988-porsche-930-turbo')
    expect(r.reserve_met).toBe(false)
  })

  it('uses iSaleItemNo as source_listing_id', () => {
    const r = parseBonhamsHtml(NO_SALE_HTML, 'https://cars.bonhams.com/auction/99/lot/5050505/1988-porsche-930-turbo')
    expect(r.source_listing_id).toBe('5050505')
  })
})

describe('parseBonhamsHtml — no-reserve lot', () => {
  const NO_RESERVE_HTML = `
    <!DOCTYPE html><html><head>
    <title>1972 Porsche 911 S | Bonhams Cars</title>
    <script id="__NEXT_DATA__" type="application/json">
    {"props":{"pageProps":{"lot":{
      "iSaleItemNo": 6141103,
      "sDesc": "1972 Porsche 911 S Chassis no. 9112301234",
      "currency": {"iso_code": "USD", "bonhams_code": "US$"},
      "dEstimateLowCur": 80000, "dEstimateHighCur": 110000,
      "dHammerPrice": 95000, "dHammerPremium": 115000,
      "sLotStatus": "SOLD",
      "lWithoutReserve": true,
      "hammerTime": {"datetime": "2026-05-31T16:00:00.000Z"}
    }}}}
    </script>
    </head><body><h1>1972 Porsche 911 S</h1></body></html>
  `

  it('sets has_no_reserve true when lWithoutReserve is true', () => {
    const r = parseBonhamsHtml(NO_RESERVE_HTML, 'https://cars.bonhams.com/auction/32391/preview-lot/6141103/1972-porsche-911-s')
    expect(r.has_no_reserve).toBe(true)
  })

  it('reserve_met is null for no-reserve lots', () => {
    const r = parseBonhamsHtml(NO_RESERVE_HTML, 'https://cars.bonhams.com/auction/32391/preview-lot/6141103/1972-porsche-911-s')
    expect(r.reserve_met).toBeNull()
  })

  it('handles /preview-lot/ URL path for source_listing_id', () => {
    const r = parseBonhamsHtml(NO_RESERVE_HTML, 'https://cars.bonhams.com/auction/32391/preview-lot/6141103/1972-porsche-911-s')
    // iSaleItemNo takes precedence over URL
    expect(r.source_listing_id).toBe('6141103')
  })
})

describe('parseBonhamsHtml — missing title throws PARSE_ERROR', () => {
  it('throws when title cannot be extracted', () => {
    const emptyHtml = `
      <!DOCTYPE html><html><head></head><body>
      <script id="__NEXT_DATA__" type="application/json">
      {"props":{"pageProps":{"lot":{"currency":{"iso_code":"USD"},"dHammerPremium":0}}}}
      </script>
      </body></html>
    `
    expect(() =>
      parseBonhamsHtml(emptyHtml, 'https://cars.bonhams.com/auction/1/lot/1/test'),
    ).toThrow(PARSE_ERROR)
  })
})

describe('parseBonhamsHtml — km mileage conversion', () => {
  it('converts km to miles from prose', () => {
    const kmHtml = `
      <!DOCTYPE html><html><head>
      <title>1972 Porsche 911 T | Bonhams Cars</title>
      <script id="__NEXT_DATA__" type="application/json">
      {"props":{"pageProps":{"lot":{
        "iSaleItemNo": 9876,
        "sDesc": "1972 Porsche 911 T",
        "sExtraDesc": "<p>72,000 km from new.</p>",
        "currency": {"iso_code": "USD", "bonhams_code": "US$"},
        "dHammerPremium": 150000,
        "sLotStatus": "SOLD"
      }}}}
      </script>
      </head><body><h1>1972 Porsche 911 T</h1></body></html>
    `
    const r = parseBonhamsHtml(kmHtml, 'https://cars.bonhams.com/auction/100/lot/9876/1972-porsche-911-t')
    // 72000 km * 0.621371 ≈ 44739 miles
    expect(r.mileage).toBe(44739)
  })
})
