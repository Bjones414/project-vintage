import { load } from 'cheerio'

// Matches the CanonicalListing shape from lib/listing-parser/types.ts in the main app.
export interface ParsedListing {
  source_platform: 'cars-and-bids'
  source_url: string
  source_listing_id: string
  title: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  vin: string | null
  mileage: number | null
  engine: string | null
  transmission: string | null
  exterior_color: string | null
  interior_color: string | null
  sold_price_cents: number | null
  high_bid_cents: number | null
  listing_status: 'live' | 'sold' | 'no-sale' | 'unknown'
  bid_count: number | null
  reserve_met: boolean | null
  has_no_reserve: boolean
  auction_end_date: string | null
  description: string | null
  image_urls: string[]
}

// Model prefixes in longest-first order (mirrors bring-a-trailer.ts).
const PORSCHE_MODEL_PREFIXES: readonly string[] = [
  '718 Boxster', '718 Cayman', '918 Spyder', 'Carrera GT',
  'Panamera', 'Cayenne', 'Boxster', 'Cayman', 'Taycan', 'Macan',
  '912E', '914', '924', '928', '944', '959', '968', '911', '912',
]

function splitModelTrim(postMake: string): { model: string | null; trim: string | null } {
  for (const prefix of PORSCHE_MODEL_PREFIXES) {
    if (postMake === prefix || postMake.startsWith(prefix + ' ')) {
      const remainder = postMake.slice(prefix.length).trim()
      return { model: prefix, trim: remainder || null }
    }
  }
  return { model: postMake || null, trim: null }
}

function parseYear(raw: string): number | null {
  const n = parseInt(raw, 10)
  return n >= 1900 && n <= 2030 ? n : null
}

function parseMileage(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, '').replace(/miles?$/i, '').trim()
  const n = parseInt(cleaned, 10)
  return isNaN(n) ? null : n
}

function parsePriceCents(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const n = parseFloat(cleaned)
  return isNaN(n) ? null : Math.round(n * 100)
}

// Extracts a labeled detail value from C&B's rendered spec list.
// C&B renders specs as <li> or <dt>/<dd> pairs; we try both patterns.
function extractDetailField($: ReturnType<typeof load>, label: string): string | null {
  // Strategy 1: <dt> with label text, followed by <dd>
  let value: string | null = null
  $('dt').each((_, el) => {
    const text = $(el).text().trim()
    if (text.toLowerCase().includes(label.toLowerCase())) {
      const dd = $(el).next('dd')
      if (dd.length) {
        value = dd.text().trim() || null
        return false
      }
    }
  })
  if (value) return value

  // Strategy 2: <li> containing "Label: Value" or "Label Value" patterns
  $('li').each((_, el) => {
    const text = $(el).text().trim()
    const re = new RegExp(`^${label}\\s*[:\\-]?\\s*(.+)$`, 'i')
    const m = text.match(re)
    if (m?.[1]) {
      value = m[1].trim()
      return false
    }
  })
  if (value) return value

  // Strategy 3: any element with a data-label or aria-label containing the label
  $('[data-label], [aria-label]').each((_, el) => {
    const attr = ($(el).attr('data-label') ?? $(el).attr('aria-label') ?? '').toLowerCase()
    if (attr.includes(label.toLowerCase())) {
      value = $(el).text().trim() || null
      return false
    }
  })
  if (value) return value

  // Strategy 4: sibling span / div pattern — <span class="label">Label</span><span class="value">…
  $('span, div').each((_, el) => {
    const text = $(el).clone().children().remove().end().text().trim()
    if (text.toLowerCase() === label.toLowerCase()) {
      const sibling = $(el).next()
      if (sibling.length) {
        value = sibling.text().trim() || null
        return false
      }
    }
  })

  return value
}

export function parseCarsAndBidsHtml(html: string, sourceUrl: string): ParsedListing | null {
  const $ = load(html)

  // Extract source_listing_id from URL slug (last path segment).
  let source_listing_id = ''
  try {
    const pathname = new URL(sourceUrl).pathname
    source_listing_id = pathname.split('/').filter(Boolean).pop() ?? ''
  } catch {
    source_listing_id = 'unknown'
  }

  // --- Title ---
  // Prefer page-level h1, fall back to document.title.
  let title = $('h1').first().text().trim()
  if (!title) {
    title = $('title').text().split('|')[0].trim()
  }
  if (!title) return null

  // --- Year / Make / Model / Trim ---
  // Title pattern: "YYYY Make [Model] [Trim]"
  const titleMatch = title.match(/^(\d{4})\s+(.+)$/)
  let year: number | null = null
  let make: string | null = null
  let model: string | null = null
  let trim: string | null = null

  if (titleMatch) {
    year = parseYear(titleMatch[1])
    const rest = titleMatch[2].trim()
    const parts = rest.split(/\s+/)
    make = parts[0] ?? null
    const postMake = parts.slice(1).join(' ')
    if (postMake) {
      const parsed = splitModelTrim(postMake)
      model = parsed.model
      trim = parsed.trim
    }
  }

  // --- VIN ---
  // C&B shows VIN in details; also scan raw HTML as fallback.
  const VIN_17 = /\b([A-HJ-NPR-Z0-9]{17})\b/
  let vin: string | null = null

  const vinField = extractDetailField($, 'VIN') ?? extractDetailField($, 'Chassis')
  if (vinField) {
    const m = vinField.match(VIN_17)
    vin = m ? m[1].toUpperCase() : vinField.trim()
  }
  if (!vin) {
    const m = html.match(VIN_17)
    if (m) vin = m[1].toUpperCase()
  }

  // --- Specs from detail fields ---
  const mileageRaw = extractDetailField($, 'Mileage')
  const mileage = mileageRaw ? parseMileage(mileageRaw) : null

  const exterior_color = extractDetailField($, 'Exterior Color')
    ?? extractDetailField($, 'Exterior')
  const interior_color = extractDetailField($, 'Interior Color')
    ?? extractDetailField($, 'Interior')
  const transmission = extractDetailField($, 'Transmission')
  const engine = extractDetailField($, 'Engine')

  // --- Visible text for price/status detection ---
  const cleanedRoot = $.root().clone()
  cleanedRoot.find('script, style').remove()
  const visibleText = cleanedRoot.find('body').text().replace(/\s+/g, ' ')

  // --- Listing status & price ---
  // C&B patterns:
  //   Sold:    "Sold for $XX,XXX" or "Sold $XX,XXX"
  //   No Sale: "Bid to $XX,XXX" or "No Sale" with bid shown
  //   Live:    "Current Bid $XX,XXX" or time remaining shown

  let listing_status: 'live' | 'sold' | 'no-sale' | 'unknown' = 'unknown'
  let sold_price_cents: number | null = null
  let high_bid_cents: number | null = null

  const soldMatch = visibleText.match(/Sold\s+(?:for\s+)?\$?([\d,]+)/i)
  const bidToMatch = visibleText.match(/Bid\s+to\s+\$?([\d,]+)/i)
  const currentBidMatch = visibleText.match(/Current\s+Bid\s*[:\-]?\s*\$?([\d,]+)/i)
  const noSaleIndicator = /no[\s-]sale|reserve\s+not\s+met/i.test(visibleText)

  if (soldMatch && !noSaleIndicator) {
    listing_status = 'sold'
    sold_price_cents = parsePriceCents(soldMatch[1])
  } else if (bidToMatch || noSaleIndicator) {
    listing_status = 'no-sale'
    if (bidToMatch) high_bid_cents = parsePriceCents(bidToMatch[1])
    sold_price_cents = null
  } else if (currentBidMatch) {
    listing_status = 'live'
    high_bid_cents = parsePriceCents(currentBidMatch[1])
  }

  // --- Reserve ---
  const lower = visibleText.toLowerCase()
  const reserve_met = lower.includes('reserve not met')
    ? false
    : lower.includes('reserve met')
      ? true
      : null
  const has_no_reserve = lower.includes('no reserve')

  // --- Bid count ---
  let bid_count: number | null = null
  const bidCountMatch = visibleText.match(/(\d+)\s+(?:total\s+)?bids?/i)
  if (bidCountMatch) bid_count = parseInt(bidCountMatch[1], 10)

  // --- Auction end date ---
  // C&B embeds end timestamps in <time> elements or data attributes.
  let auction_end_date: string | null = null
  $('time[datetime]').each((_, el) => {
    const dt = $(el).attr('datetime')
    if (dt) {
      try {
        const d = new Date(dt)
        if (!isNaN(d.getTime())) {
          auction_end_date = d.toISOString()
          return false
        }
      } catch { /* ignore */ }
    }
  })
  if (!auction_end_date) {
    // Fallback: epoch timestamp in JS variable or data attribute
    const tsMatch = html.match(/"(?:endsAt|end_time|auction_end)"\s*:\s*"([^"]+)"/i)
    if (tsMatch) {
      try {
        const d = new Date(tsMatch[1])
        if (!isNaN(d.getTime())) auction_end_date = d.toISOString()
      } catch { /* ignore */ }
    }
  }

  // --- Description ---
  const description = $('meta[name="description"]').attr('content') ?? null

  // --- Images ---
  const image_urls: string[] = []
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src')
    if (src && /\.(jpg|jpeg|png|webp)/i.test(src) && !src.includes('logo')) {
      image_urls.push(src)
    }
  })

  return {
    source_platform: 'cars-and-bids',
    source_url: sourceUrl,
    source_listing_id,
    title,
    year,
    make,
    model,
    trim,
    vin,
    mileage,
    engine,
    transmission,
    exterior_color,
    interior_color,
    sold_price_cents,
    high_bid_cents,
    listing_status,
    bid_count,
    reserve_met,
    has_no_reserve,
    auction_end_date,
    description,
    image_urls: image_urls.slice(0, 20),
  }
}
