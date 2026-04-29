import { load } from 'cheerio'
import type { CanonicalListing } from './types'

const BAT_HOSTNAME = 'bringatrailer.com'

// Epoch-seconds bounds for a plausible auction end time.
const TS_MIN = 1262304000  // 2010-01-01T00:00:00Z
const TS_MAX = 2240524799  // 2040-12-31T23:59:59Z

/**
 * Three-tier extraction strategy (primary DOM → fallback DOM → JS regex).
 * Returns an ISO 8601 UTC string or null if extraction fails or looks suspicious.
 */
export function extractAuctionEndDate(
  $: ReturnType<typeof load>,
  rawHtml: string,
): string | null {
  // (a) Live auctions: span.listing-end-time carries data-timestamp.
  let tsStr: string | undefined =
    $('span.listing-end-time[data-timestamp]').attr('data-timestamp')

  // (b) Ended auctions: "Auction Ended" stats row, adjacent-sibling span.
  if (!tsStr) {
    tsStr = $(
      'td.listing-stats-label:contains("Auction Ended") + td span[data-timestamp]',
    ).attr('data-timestamp')
  }

  // (c) BAT_VMS JS variable fallback — take MAX across all bid end_timestamp values.
  if (!tsStr) {
    const re = /"end_timestamp":(\d{10,13})/g
    let maxTs = -Infinity
    let m: RegExpExecArray | null
    while ((m = re.exec(rawHtml)) !== null) {
      const v = parseInt(m[1], 10)
      if (v > maxTs) maxTs = v
    }
    if (isFinite(maxTs)) tsStr = String(maxTs)
  }

  if (!tsStr) return null

  const ts = parseInt(tsStr, 10)
  if (isNaN(ts) || ts < TS_MIN || ts > TS_MAX) {
    console.warn('[BaT parser] suspicious auction end timestamp, ignoring:', tsStr)
    return null
  }

  return new Date(ts * 1000).toISOString()
}

function parseMileageValue(raw: string): number | null {
  if (/k$/i.test(raw)) {
    const n = parseInt(raw.slice(0, -1), 10)
    return isNaN(n) ? null : n * 1000
  }
  const n = parseInt(raw.replace(/,/g, ''), 10)
  return isNaN(n) ? null : n
}

/**
 * Detects reserve status from visible page text.
 * "reserve not met" is checked before "reserve met" to prevent substring false-positive.
 */
export function detectReserveStatus(visibleText: string): {
  reserve_met: boolean | null
  has_no_reserve: boolean
} {
  const lower = visibleText.toLowerCase()
  if (lower.includes('reserve not met')) return { reserve_met: false, has_no_reserve: false }
  if (lower.includes('reserve met')) return { reserve_met: true, has_no_reserve: false }
  if (lower.includes('no reserve')) return { reserve_met: null, has_no_reserve: true }
  return { reserve_met: null, has_no_reserve: false }
}

/**
 * Extracts current bid amount in cents from visible page text.
 * Matches: "Current Bid $48,250", "Current Bid: $48,250", "Current Bid: USD 48,250",
 *          "Current Bid: USD $1,250,000", "Current Bid $48,250.00"
 */
export function extractCurrentBid(visibleText: string): number | null {
  const m = visibleText.match(
    /Current\s+Bid\s*:?\s*(?:USD\s*)?\$?([\d,]+(?:\.\d{2})?)/i,
  )
  if (!m) return null
  const amount = parseFloat(m[1].replace(/,/g, ''))
  if (isNaN(amount)) return null
  return Math.round(amount * 100)
}

export async function parseBaTListing(url: string): Promise<CanonicalListing> {
  try {
    // Step 1 — Validate and normalize URL
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      throw new Error(`Invalid URL: ${url}`)
    }
    const hostname = parsed.hostname.replace(/^www\./, '')
    if (hostname !== BAT_HOSTNAME) {
      throw new Error(`Expected a bringatrailer.com URL, got: ${parsed.hostname}`)
    }
    parsed.protocol = 'https:'
    const normalizedUrl = parsed.href.replace(/\/$/, '')

    // Step 2 — Fetch page
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30_000)
    let html: string
    try {
      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProjectVintage/1.0)' },
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText} fetching ${normalizedUrl}`)
      }
      html = await response.text()
    } finally {
      clearTimeout(timeoutId)
    }

    const $ = load(html)

    // Step 3 — Extract JSON-LD Product schema
    let title = ''
    let description: string | null = null
    let image_urls: string[] = []
    let sold_price_cents: number | null = null
    let productSchema: Record<string, unknown> | null = null

    $('script[type="application/ld+json"]').each((_, el) => {
      let entry: unknown
      try {
        entry = JSON.parse($(el).html() ?? '')
      } catch {
        return
      }
      if (typeof entry !== 'object' || entry === null) return
      const obj = entry as Record<string, unknown>
      if (obj['@type'] !== 'Product') return

      productSchema = obj
      if (typeof obj['name'] === 'string') title = obj['name']
      if (typeof obj['description'] === 'string') description = obj['description']

      const rawImage = obj['image']
      if (typeof rawImage === 'string') {
        image_urls = [rawImage]
      } else if (Array.isArray(rawImage)) {
        image_urls = rawImage.filter((i): i is string => typeof i === 'string')
      }

      const offersRaw = obj['offers']
      const offers =
        Array.isArray(offersRaw)
          ? (offersRaw[0] as Record<string, unknown> | undefined)
          : (offersRaw as Record<string, unknown> | undefined)
      if (offers && offers['priceCurrency'] === 'USD') {
        const price = offers['price']
        if (typeof price === 'number') {
          sold_price_cents = Math.round(price * 100)
        } else if (typeof price === 'string' && price !== '') {
          const n = parseFloat(price)
          if (!isNaN(n)) sold_price_cents = Math.round(n * 100)
        }
      }
    })

    // Step 4 — Extract lot number from meta description
    const metaDesc = $('meta[name="description"]').attr('content') ?? ''
    const lotMatch = metaDesc.match(/Lot #([\d,]+)/)
    let source_listing_id: string
    if (lotMatch?.[1]) {
      source_listing_id = lotMatch[1].replace(/,/g, '')
    } else {
      const pathSegments = parsed.pathname.split('/').filter(Boolean)
      source_listing_id = pathSegments[pathSegments.length - 1] ?? ''
    }

    // Step 5 — Parse title into year / make / model
    let year: number | null = null
    let make: string | null = null
    let model: string | null = null
    const titleMatch = title.match(/(\d{4})\s+(.+)$/)
    if (titleMatch) {
      const parsedYear = parseInt(titleMatch[1], 10)
      year = parsedYear >= 1900 && parsedYear <= 2030 ? parsedYear : null
      const parts = titleMatch[2].split(/\s+/)
      make = parts[0] ?? null
      // TODO: improve model/trim splitting for Porsche naming conventions
      model = parts.slice(1).join(' ') || null
    }

    // Step 6 — Extract VIN from "Chassis:" bullet in any <li>
    // BaT labels the VIN as "Chassis" with the value wrapped in an <a> tag.
    let vin: string | null = null
    $('li').each((_, el) => {
      const match = $(el).text().match(/Chassis:\s*([A-HJ-NPR-Z0-9]{6,17})/i)
      if (match) {
        vin = match[1]
        return false
      }
    })

    // Step 7 — Extract specs from the Listing Details <ul>
    // BaT uses an unlabeled bullet list rather than a <dl> for vehicle details.
    let mileage: number | null = null
    let transmission: string | null = null
    let exterior_color: string | null = null
    let interior_color: string | null = null

    const headingEl = $('*').filter((_, el) => {
      const clone = $(el).clone()
      clone.children().remove()
      return /listing details/i.test(clone.text())
    }).first()

    const detailsUl = headingEl.next('ul').length > 0
      ? headingEl.next('ul')
      : headingEl.nextAll('ul').first()

    detailsUl.find('li').each((_, el) => {
      const text = $(el).text().trim()

      const mileageMatch = text.match(/(\d{1,3}(?:,\d{3})*|\d+k)\s*Miles/i)
      if (mileageMatch) {
        mileage = parseMileageValue(mileageMatch[1])
        return
      }

      if (/\b(Manual|Automatic|PDK|Tiptronic)\b/.test(text)) {
        transmission = text
        return
      }

      const paintMatch = text.match(/^(.+?)\s+Paint$/i)
      if (paintMatch) {
        exterior_color = paintMatch[1].trim()
        return
      }

      if (/upholstery/i.test(text)) {
        interior_color = text
      }
    })

    // Step 8 — Extract auction end date (three-tier: primary DOM, fallback DOM, regex)
    const auction_end_date = extractAuctionEndDate($, html)

    // Step 9 — Determine listing_status by matching status phrases adjacent to a USD price.
    // BaT pages embed an i18n dictionary inside <script> tags listing all
    // status phrases as raw translation values. The dictionary is identical
    // across all listings regardless of state. Strip scripts/styles first
    // and require a dollar amount adjacent to each phrase — the rendered
    // hero always renders "Current Bid: USD $X" with the price; dictionary
    // entries are bare phrases without prices.
    const cleaned = $.root().clone()
    cleaned.find('script, style').remove()
    const visibleText = cleaned.find('body').text()

    const priceTail = String.raw`[\s:]*(?:USD\s*)?\$[\d,]+`
    const matchers: Array<[CanonicalListing['listing_status'], RegExp]> = [
      ['sold', new RegExp(`Sold for${priceTail}`, 'i')],
      ['no-sale', new RegExp(`Bid to${priceTail}`, 'i')],
      ['live', new RegExp(`Current Bid${priceTail}`, 'i')],
    ]
    const found = matchers
      .map(([label, re]) => [label, visibleText.search(re)] as [CanonicalListing['listing_status'], number])
      .filter(([, pos]) => pos !== -1)
      .sort((a, b) => a[1] - b[1])

    let listing_status: CanonicalListing['listing_status'] = 'unknown'
    if (found.length > 0) {
      listing_status = found[0][0]
    }

    // Step 10 — Reserve status detection.
    // "reserve not met" must be checked before "reserve met" (substring containment).
    const { reserve_met, has_no_reserve } = detectReserveStatus(visibleText)

    // Step 11 — Current bid extraction.
    const high_bid_cents = extractCurrentBid(visibleText)

    // Step 12 — Assemble CanonicalListing
    return {
      source_platform: 'bring-a-trailer',
      source_url: normalizedUrl,
      source_listing_id,
      title,
      year,
      make,
      model,
      trim: null,
      vin,
      mileage,
      engine: null,
      transmission,
      exterior_color,
      interior_color,
      sold_price_cents,
      high_bid_cents,
      listing_status,
      bid_count: null,
      reserve_met,
      has_no_reserve,
      auction_end_date,
      seller_info: null,
      description,
      modification_notes: null,
      image_urls,
      raw_data: {
        json_ld: productSchema,
      },
    }
  } catch (error) {
    throw new Error(
      `Failed to parse BaT listing at ${url}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
