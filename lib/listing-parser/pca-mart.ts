import { load } from 'cheerio'
import type { CanonicalListing } from './types'
import { splitModelTrim } from './bring-a-trailer'

const PCA_MART_HOSTNAME = 'mart.pca.org'

/**
 * Pure HTML parser — accepts already-fetched HTML and the normalized source URL.
 * No network I/O; safe to call from both the on-demand route and tests.
 */
export function parsePcaMartHtml(html: string, sourceUrl: string): CanonicalListing & { should_persist: false } {
  const $ = load(html)
  const parsedUrl = new URL(sourceUrl)
  const origin = `${parsedUrl.protocol}//${parsedUrl.hostname}`

  // --- Title ---
  // Primary: the <h1> with border-bottom styling that carries the listing title.
  // Fallback: og:title stripped of site boilerplate.
  let rawTitle = $('h1').filter((_, el) => {
    const style = $(el).attr('style') ?? ''
    return style.includes('border-bottom')
  }).first().text().trim()

  if (!rawTitle) {
    const ogTitle = $('meta[property="og:title"]').attr('content') ?? ''
    rawTitle = ogTitle.replace(/^For Sale:\s*/i, '').replace(/\s*\|.*$/, '').trim()
  }

  // --- Year / make / model / trim ---
  // PCA Mart titles are "YEAR MODEL TRIM" with no explicit make (Porsche is implicit).
  const yearMatch = rawTitle.match(/^(\d{4})\s+(.+)$/)
  let year: number | null = null
  let model: string | null = null
  let trim: string | null = null
  if (yearMatch) {
    const parsedYear = parseInt(yearMatch[1], 10)
    year = parsedYear >= 1900 && parsedYear <= 2030 ? parsedYear : null
    const parsed = splitModelTrim(yearMatch[2].trim())
    model = parsed.model
    trim = parsed.trim
  }
  // PCA Mart is Porsche-only by definition.
  const make = 'Porsche'

  // --- Source listing ID ---
  // Prefer Ad# from page; fall back to URL path segment.
  const adNumMatch = html.match(/<span[^>]*>Ad#:\s*<\/span>\s*(\d+)/)
  let source_listing_id: string
  if (adNumMatch?.[1]) {
    source_listing_id = adNumMatch[1]
  } else {
    const segments = parsedUrl.pathname.split('/').filter(Boolean)
    source_listing_id = segments[segments.length - 1] ?? ''
  }

  // --- Asking price ---
  const priceText = $('h1.classified-price').first().text().trim()
  let asking_price_cents: number | null = null
  const priceMatch = priceText.match(/\$([\d,]+)/)
  if (priceMatch) {
    const amount = parseFloat(priceMatch[1].replace(/,/g, ''))
    if (!isNaN(amount)) asking_price_cents = Math.round(amount * 100)
  }

  // --- Structured spec fields ---
  // Two-column layout: each column is a col-md-6 col-lg-6 col-xl-6 div containing a <p>.
  // Label spans have font-weight:550; text nodes following each span are the values.
  // &nbsp; characters decode to   in cheerio — normalize before regex matching.
  const specText = $('.col-md-6.col-lg-6.col-xl-6 p')
    .map((_, el) => $(el).text())
    .get()
    .join('\n')
    .replace(/ /g, ' ')

  function extractSpec(label: string): string | null {
    const re = new RegExp(`${label}:\\s*([^\\n]+)`, 'i')
    const m = specText.match(re)
    return m ? m[1].trim() : null
  }

  // Mileage
  const mileageRaw = extractSpec('Mileage')
  let mileage: number | null = null
  if (mileageRaw) {
    const n = parseInt(mileageRaw.replace(/,/g, ''), 10)
    if (!isNaN(n)) mileage = n
  }

  const exterior_color = extractSpec('Exterior')
  const interior_color = extractSpec('Interior')
  const transmission = extractSpec('Transmission')
  // Generation is structured (e.g. "993", "992") — stored in raw_data for comp engine use.
  const generation = extractSpec('Generation')

  // VIN — present on ~2/3 of listings; null when absent.
  const vinRaw = extractSpec('VIN')
  let vin: string | null = null
  if (vinRaw) {
    const clean = vinRaw.replace(/\s+/g, '')
    if (clean.length >= 5) {
      vin = clean.length === 17 ? clean.toUpperCase() : clean
    }
  }

  // --- Description ---
  const description = $('.martAdDescription').text().trim() || null

  // --- Images ---
  // Full-size images are in <a href="includes/images/martAdImages/{id}/..."> anchors.
  // Thumbnail anchors share the same href pattern but their img src has "_thumbnail".
  // We collect the anchor hrefs (full-res) and resolve to absolute URLs.
  const seen = new Set<string>()
  const image_urls: string[] = []
  $('a[href*="martAdImages"]').each((_, el) => {
    const href = $(el).attr('href') ?? ''
    if (!href) return
    const abs = href.startsWith('http') ? href : `${origin}/${href.replace(/^\//, '')}`
    if (!seen.has(abs)) {
      seen.add(abs)
      image_urls.push(abs)
    }
  })

  return {
    source_platform: 'pca_mart',
    source_url: sourceUrl,
    source_listing_id,
    title: rawTitle || `${year ?? ''} Porsche ${model ?? ''}`.trim(),
    year,
    make,
    model,
    trim,
    vin,
    mileage,
    engine: null,
    transmission,
    exterior_color,
    interior_color,
    sold_price_cents: null,
    high_bid_cents: null,
    asking_price_cents,
    listing_status: 'asking',
    bid_count: null,
    reserve_met: null,
    has_no_reserve: false,
    auction_end_date: null,
    seller_info: null,
    description,
    modification_notes: null,
    image_urls,
    raw_data: {
      generation,
      ad_number: source_listing_id,
    },
    should_persist: false,
  }
}

export async function parsePcaMartListing(url: string): Promise<CanonicalListing & { should_persist: false }> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }
  const hostname = parsed.hostname.replace(/^www\./, '')
  if (hostname !== PCA_MART_HOSTNAME) {
    throw new Error(`Expected a mart.pca.org URL, got: ${parsed.hostname}`)
  }
  parsed.protocol = 'https:'
  const normalizedUrl = parsed.href.replace(/\/$/, '')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)
  let html: string
  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} fetching ${normalizedUrl}`)
    }
    html = await response.text()
  } finally {
    clearTimeout(timeoutId)
  }

  return parsePcaMartHtml(html, normalizedUrl)
}
