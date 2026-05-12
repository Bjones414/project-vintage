import { load } from 'cheerio'
import type { CanonicalListing } from './types'

const BONHAMS_HOSTNAME = 'cars.bonhams.com'
const KM_TO_MILES = 0.621371

export const USD_ONLY_ERROR =
  "Bonhams listings outside USD aren't supported in V1. International support coming soon."
export const FETCH_ERROR =
  "Couldn't load this Bonhams listing. The auction may have been removed or the URL is invalid."
export const PARSE_ERROR =
  "Couldn't parse this Bonhams listing. The page format may have changed."

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePriceCents(s: string | number): number | null {
  const n = typeof s === 'number' ? s : parseFloat(String(s).replace(/[^\d.]/g, ''))
  return isNaN(n) || n <= 0 ? null : Math.round(n * 100)
}

function parseMileageMiles(raw: string): number | null {
  const m = raw.match(/([\d,]+)\s*(km|mi(?:les?)?)?/i)
  if (!m) return null
  const n = parseInt(m[1].replace(/,/g, ''), 10)
  if (isNaN(n)) return null
  return /km/i.test(m[2] ?? '') ? Math.round(n * KM_TO_MILES) : n
}

function detectCurrency(text: string): 'USD' | 'GBP' | 'EUR' | 'UNKNOWN' {
  if (/\$/.test(text) || /\bUSD\b/i.test(text)) return 'USD'
  if (/£/.test(text) || /\bGBP\b/i.test(text)) return 'GBP'
  if (/€/.test(text) || /\bEUR\b/i.test(text)) return 'EUR'
  return 'UNKNOWN'
}

// ── __NEXT_DATA__ extraction ──────────────────────────────────────────────────
// Bonhams Next.js pages embed lot data at props.pageProps.lot.
// Real field schema discovered from live inspection:
//   currency: { iso_code: 'USD', bonhams_code: 'US$' }
//   sDesc: plain-text lot description (title + chassis + engine inline)
//   sCatalogDesc: HTML with <B> title + "Chassis no." / "Engine no." labels
//   dEstimateLowCur / dEstimateHighCur: estimate in sale currency (0 = TBD)
//   dHammerPrice: hammer pre-premium; dHammerPremium: hammer incl. premium
//   sLotStatus: 'NEW' | 'SOLD' | 'UNSOLD' | 'WITHDRAWN'
//   hammerTime: { datetime: ISO string } — lot-level hammer time
//   lWithoutReserve: boolean
//   iSaleItemNo: globally unique item number (used as source_listing_id)
//   images: [{ image_url, lot_main_url, ... }]
function extractNextDataLot(html: string): Record<string, unknown> | null {
  const match = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) return null
  let data: unknown
  try {
    data = JSON.parse(match[1])
  } catch {
    return null
  }
  if (typeof data !== 'object' || data === null) return null
  const pp = ((data as Record<string, unknown>)?.['props'] as Record<string, unknown> | undefined)
    ?.['pageProps'] as Record<string, unknown> | undefined
  if (!pp) return null
  // Try common paths — Bonhams uses 'lot' on lot detail pages
  const candidates = [
    pp['lot'],
    pp['listing'],
    (pp['data'] as Record<string, unknown> | undefined)?.['lot'],
  ]
  for (const c of candidates) {
    if (c && typeof c === 'object') return c as Record<string, unknown>
  }
  return null
}

function extractNextDataAuction(html: string): Record<string, unknown> | null {
  const match = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) return null
  try {
    const data = JSON.parse(match[1]) as Record<string, unknown>
    const pp = (data?.['props'] as Record<string, unknown>)?.['pageProps'] as Record<string, unknown> | undefined
    const auction = pp?.['auction']
    return (typeof auction === 'object' && auction !== null) ? auction as Record<string, unknown> : null
  } catch {
    return null
  }
}

// ── Title + chassis + engine from sDesc ───────────────────────────────────────
// sDesc format: "1957 Porsche 356A T1 Speedster Chassis no. 83066 Engine no. P62349"
// Everything before "Chassis no." is the title.
function parseSDesc(sDesc: string): { title: string; chassis: string | null; engineNo: string | null } {
  const chassisMatch = sDesc.match(/\bChassis\s+no\.\s*(.+?)(?:\s+Engine\s+no\.|$)/i)
  const engineMatch = sDesc.match(/\bEngine\s+no\.\s*(.+?)(?:\s*\(see\s+text\))?$/i)
  const titlePart = chassisMatch
    ? sDesc.slice(0, sDesc.toLowerCase().indexOf('chassis no.')).trim()
    : sDesc.trim()
  return {
    title: titlePart || sDesc.trim(),
    chassis: chassisMatch ? chassisMatch[1].trim() : null,
    engineNo: engineMatch ? engineMatch[1].trim() : null,
  }
}

// ── sCatalogDesc HTML parser for chassis + engine (when sDesc is incomplete) ──
function parseCatalogDescHtml(html: string): { chassis: string | null; engineNo: string | null } {
  const $ = load(html)
  let chassis: string | null = null
  let engineNo: string | null = null
  // sCatalogDesc contains raw HTML: "Chassis no. 83066 <br/> Engine no. P62349"
  const text = $.text()
  const cm = text.match(/Chassis\s+no\.\s*([^\n,]+)/i)
  if (cm) chassis = cm[1].trim()
  const em = text.match(/Engine\s+no\.\s*([^\n,]+?)(?:\s*\(see\s+text\))?$/im)
  if (em) engineNo = em[1].trim()
  return { chassis, engineNo }
}

/**
 * Pure HTML parser for Bonhams lot pages — no network I/O.
 * Primary: __NEXT_DATA__ JSON (real field schema). Fallback: HTML DOM.
 */
export function parseBonhamsHtml(html: string, sourceUrl: string): CanonicalListing {
  const $ = load(html)
  const parsedUrl = new URL(sourceUrl)

  // Lot + auction ID from URL:
  // /auction/{auctionId}/preview-lot/{itemNo}/{slug}/ (upcoming)
  // /auction/{auctionId}/lot/{itemNo}/{slug}/          (completed)
  const segs = parsedUrl.pathname.split('/').filter(Boolean)
  const auctionIdx = segs.indexOf('auction')
  const lotSegIdx = segs.findIndex(s => s === 'lot' || s === 'preview-lot')
  const urlAuctionId = auctionIdx !== -1 ? segs[auctionIdx + 1] : null
  const urlItemNo = lotSegIdx !== -1 ? segs[lotSegIdx + 1] : null

  const nd = extractNextDataLot(html)
  const auctionNd = extractNextDataAuction(html)

  // ── Currency ──────────────────────────────────────────────────────────────
  // Bonhams __NEXT_DATA__: lot.currency = { iso_code: 'USD', bonhams_code: 'US$' }
  let currency: 'USD' | 'GBP' | 'EUR' | 'UNKNOWN' = 'UNKNOWN'

  if (nd?.['currency'] && typeof nd['currency'] === 'object') {
    const isoCode = (nd['currency'] as Record<string, unknown>)?.['iso_code']
    if (typeof isoCode === 'string') currency = detectCurrency(isoCode)
  } else if (nd?.['currency'] && typeof nd['currency'] === 'string') {
    currency = detectCurrency(nd['currency'] as string)
  }

  if (currency === 'UNKNOWN') {
    const priceBlock = $('[class*="estimate"], [class*="price"], [class*="hammer"], [class*="realised"]').text()
    if (priceBlock) currency = detectCurrency(priceBlock)
  }

  if (currency === 'UNKNOWN') {
    currency = detectCurrency($('body').text())
  }

  if (currency !== 'USD') {
    throw new Error(USD_ONLY_ERROR)
  }

  // ── Source listing ID ─────────────────────────────────────────────────────
  // Prefer iSaleItemNo (globally unique across all Bonhams sales)
  const itemNo = nd?.['iSaleItemNo'] ? String(nd['iSaleItemNo']) : null
  const source_listing_id =
    itemNo ??
    (urlAuctionId && urlItemNo ? `${urlAuctionId}-${urlItemNo}` : segs[segs.length - 1] ?? '')

  // ── Title from sDesc + HTML fallback ──────────────────────────────────────
  // sDesc: "1973 Porsche 911 Carrera RS 2.7 Chassis no. 9113600803 Engine no. 6630803"
  let title = ''
  let chassisFromJson: string | null = null
  let engineNumberFromJson: string | null = null

  const sDesc = typeof nd?.['sDesc'] === 'string' ? nd['sDesc'] as string : ''
  if (sDesc) {
    const parsed = parseSDesc(sDesc)
    title = parsed.title
    chassisFromJson = parsed.chassis
    engineNumberFromJson = parsed.engineNo
  }

  // Also try sCatalogDesc for chassis/engine if sDesc didn't yield them
  const sCatalogDesc = typeof nd?.['sCatalogDesc'] === 'string' ? nd['sCatalogDesc'] as string : ''
  if (sCatalogDesc && (!chassisFromJson || !engineNumberFromJson)) {
    const fromCatalog = parseCatalogDescHtml(sCatalogDesc)
    if (!chassisFromJson) chassisFromJson = fromCatalog.chassis
    if (!engineNumberFromJson) engineNumberFromJson = fromCatalog.engineNo
  }

  if (!title) title = $('h1').first().text().trim()
  if (!title) title = $('title').text().replace(/\s*\|.*$/, '').trim()
  if (!title) throw new Error(PARSE_ERROR)

  // ── Year / make / model / trim ────────────────────────────────────────────
  let year: number | null = null
  let make: string | null = null
  let model: string | null = null
  const trim: string | null = null

  // Title format: "1973 Porsche 911 Carrera RS 2.7" — parse year and make from title
  const titleMatch = title.match(/^(\d{4})\s+(.+)$/)
  if (titleMatch) {
    const parsedYear = parseInt(titleMatch[1], 10)
    if (!isNaN(parsedYear) && parsedYear >= 1886 && parsedYear <= 2030) year = parsedYear
    const words = titleMatch[2].split(/\s+/)
    make = words[0] ?? null
    if (words.length > 1) model = words.slice(1).join(' ')
  }

  // ── VIN / chassis number ──────────────────────────────────────────────────
  let vin: string | null = chassisFromJson

  if (!vin) {
    $('dt').each((_, el) => {
      if (/chassis\s*(no\.?|number)?|vin/i.test($(el).text())) {
        const val = $(el).next('dd').text().trim()
        if (val) { vin = val; return false }
      }
    })
  }

  if (!vin) {
    const m = $('body').text().match(
      /(?:Chassis\s*(?:No\.?|Number)?|VIN)\s*:?\s*([A-HJ-NPR-Z0-9]{6,17})/i,
    )
    if (m) vin = m[1]
  }

  if (vin && vin.length === 17) vin = vin.toUpperCase()

  // ── Engine number (raw_data only — never persisted) ───────────────────────
  let engineNumber = engineNumberFromJson
  if (!engineNumber) {
    const m = $('body').text().match(/Engine\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9/*]{4,20})/i)
    if (m) engineNumber = m[1]
  }

  // ── Mileage ───────────────────────────────────────────────────────────────
  // Not a structured field in Bonhams __NEXT_DATA__; extract from description HTML or prose.
  let mileage: number | null = null

  const descHtml = typeof nd?.['sExtraDesc'] === 'string' ? nd['sExtraDesc'] as string : ''
  const descText = descHtml ? load(descHtml).text() : ''

  for (const source of [descText, $('body').text()]) {
    if (!source) continue
    const m = source.match(/([\d,]+)\s*(km|miles?)\b/i)
    if (m) { mileage = parseMileageMiles(m[0]); break }
  }

  // dt/dd fallback
  if (mileage === null) {
    $('dt').each((_, el) => {
      if (/mileage|odometer/i.test($(el).text())) {
        const val = $(el).next('dd').text().trim()
        if (val) { mileage = parseMileageMiles(val); return false }
      }
    })
  }

  // ── Exterior / interior color ─────────────────────────────────────────────
  let exterior_color: string | null = null
  let interior_color: string | null = null

  $('dt').each((_, el) => {
    const label = $(el).text().toLowerCase()
    const value = $(el).next('dd').text().trim() || null
    if (!exterior_color && /exterior|paint|colou?r/i.test(label)) exterior_color = value
    if (!interior_color && /interior|upholstery/i.test(label)) interior_color = value
  })

  // ── Transmission ──────────────────────────────────────────────────────────
  let transmission: string | null = null
  const bodyText = $('body').text()
  const txMatch = bodyText.match(/\b(\d[-\s]?[Ss]peed\s+(?:Manual|Automatic)|Manual|Automatic|PDK|Tiptronic)\b/)
  if (txMatch) transmission = txMatch[1]

  // ── Estimate ──────────────────────────────────────────────────────────────
  // dEstimateLowCur / dEstimateHighCur: estimate in sale currency (0 = TBD)
  let estimate_low_cents: number | null = null
  let estimate_high_cents: number | null = null

  if (nd?.['dEstimateLowCur'] != null) estimate_low_cents = parsePriceCents(nd['dEstimateLowCur'] as number)
  if (nd?.['dEstimateHighCur'] != null) estimate_high_cents = parsePriceCents(nd['dEstimateHighCur'] as number)
  // Fallback to raw estimate fields
  if (!estimate_low_cents && nd?.['dEstimateLow'] != null) estimate_low_cents = parsePriceCents(nd['dEstimateLow'] as number)
  if (!estimate_high_cents && nd?.['dEstimateHigh'] != null) estimate_high_cents = parsePriceCents(nd['dEstimateHigh'] as number)

  if (estimate_low_cents === null || estimate_high_cents === null) {
    const m = bodyText.match(/estimate[:\s]+(?:USD\s*)?\$?([\d,]+)\s*[-–—]\s*(?:USD\s*)?\$?([\d,]+)/i)
    if (m) {
      estimate_low_cents = parsePriceCents(m[1])
      estimate_high_cents = parsePriceCents(m[2])
    }
  }

  // ── Hammer price → final price ────────────────────────────────────────────
  // dHammerPremium: hammer including buyer's premium (preferred — matches other platforms)
  // dHammerPrice: pre-premium hammer (fallback)
  let sold_price_cents: number | null = null
  let price_includes_premium = false

  if (nd?.['dHammerPremium'] != null) {
    const v = parsePriceCents(nd['dHammerPremium'] as number)
    if (v !== null) { sold_price_cents = v; price_includes_premium = true }
  }
  if (sold_price_cents === null && nd?.['dHammerPrice'] != null) {
    sold_price_cents = parsePriceCents(nd['dHammerPrice'] as number)
    price_includes_premium = false
  }

  if (sold_price_cents === null) {
    const inclMatch = bodyText.match(
      /(?:hammer(?:\s+price)?\s+inc(?:l(?:uding)?)?\.?\s+premium|realised\s+inc(?:l(?:uding)?)?\.?\s+premium|sold\s+for)[:\s\n]*(?:USD\s*)?\$?([\d,]+)/i,
    )
    if (inclMatch) { sold_price_cents = parsePriceCents(inclMatch[1]); price_includes_premium = true }
  }
  if (sold_price_cents === null) {
    const hammerMatch = bodyText.match(/hammer\s+price[:\s]+(?:USD\s*)?\$?([\d,]+)/i)
    if (hammerMatch) { sold_price_cents = parsePriceCents(hammerMatch[1]); price_includes_premium = false }
  }

  // ── Listing status ────────────────────────────────────────────────────────
  // sLotStatus: 'NEW' (upcoming), 'SOLD', 'UNSOLD', 'WITHDRAWN'
  let listing_status: CanonicalListing['listing_status'] = 'unknown'
  const rawStatus = typeof nd?.['sLotStatus'] === 'string' ? nd['sLotStatus'] as string : ''

  switch (rawStatus.toUpperCase()) {
    case 'SOLD':    listing_status = 'sold'; break
    case 'UNSOLD':  listing_status = 'no-sale'; break
    case 'NEW':     listing_status = 'unknown'; break
    // 'WITHDRAWN' — not in CanonicalListing union; stored as 'unknown' + raw_data.raw_status
  }

  // HTML text fallback only when __NEXT_DATA__ had no status at all (rawStatus empty).
  // Don't use it when rawStatus='NEW' — the page body may contain "sold" in unrelated context.
  if (listing_status === 'unknown' && !rawStatus) {
    const lower = bodyText.toLowerCase()
    if (lower.includes('not sold') || lower.includes('unsold')) listing_status = 'no-sale'
    else if (lower.includes('sold')) listing_status = 'sold'
  }

  // ── Reserve ───────────────────────────────────────────────────────────────
  const lWithoutReserve = nd?.['lWithoutReserve'] === true || bodyText.toLowerCase().includes('no reserve')
  let reserve_met: boolean | null = null
  if (!lWithoutReserve) {
    if (listing_status === 'sold') reserve_met = true
    else if (listing_status === 'no-sale') reserve_met = false
  }

  // ── Auction / sale date ───────────────────────────────────────────────────
  let auction_end_date: string | null = null

  // lot.hammerTime.datetime (lot-level hammer time)
  const hammerTime = nd?.['hammerTime'] as Record<string, unknown> | undefined
  const rawDate = typeof hammerTime?.['datetime'] === 'string' ? hammerTime['datetime'] : null

  // Fallback: auction.dates.end.datetime
  const auctionDates = auctionNd?.['dates'] as Record<string, unknown> | undefined
  const auctionEnd = (auctionDates?.['end'] as Record<string, unknown> | undefined)?.['datetime']
  const rawAuctionDate = typeof auctionEnd === 'string' ? auctionEnd : null

  for (const candidate of [rawDate, rawAuctionDate]) {
    if (!candidate) continue
    const d = new Date(candidate)
    if (!isNaN(d.getTime())) { auction_end_date = d.toISOString(); break }
  }

  if (!auction_end_date) {
    const datetime = $('time[datetime]').first().attr('datetime')
    if (datetime) {
      const d = new Date(datetime)
      if (!isNaN(d.getTime())) auction_end_date = d.toISOString()
    }
  }

  // ── Images ────────────────────────────────────────────────────────────────
  const image_urls: string[] = []
  const ndImages = nd?.['images']
  if (Array.isArray(ndImages)) {
    for (const img of ndImages) {
      const src =
        (img as Record<string, unknown>)?.['image_url'] ??
        (img as Record<string, unknown>)?.['lot_main_url'] ??
        (img as Record<string, unknown>)?.['url']
      if (typeof src === 'string' && src) image_urls.push(src)
    }
  }

  // ── Description ───────────────────────────────────────────────────────────
  // sExtraDesc is the detailed narrative description (HTML)
  const descriptionHtml = typeof nd?.['sExtraDesc'] === 'string' ? nd['sExtraDesc'] as string : ''
  const description = descriptionHtml ? load(descriptionHtml).text().trim() || null : null

  return {
    source_platform: 'bonhams',
    source_url: sourceUrl,
    source_listing_id,
    title,
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
    sold_price_cents: listing_status === 'sold' ? sold_price_cents : null,
    high_bid_cents: listing_status !== 'sold' ? sold_price_cents : null,
    listing_status,
    bid_count: null,
    reserve_met,
    has_no_reserve: lWithoutReserve,
    auction_end_date,
    seller_info: null,
    description,
    modification_notes: null,
    image_urls,
    raw_data: {
      lot_number: nd?.['iSaleLotNo'] ?? urlItemNo,
      auction_id: nd?.['iSaleNo'] != null
        ? (nd['iSaleNo'] as Record<string, unknown>)?.['iSaleNo'] ?? urlAuctionId
        : urlAuctionId,
      estimate_low_cents,
      estimate_high_cents,
      price_includes_premium,
      engine_number: engineNumber,
      raw_status: rawStatus || null,
      next_data_available: nd !== null,
    },
  }
}

export async function parseBonhamsListing(url: string): Promise<CanonicalListing> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }

  const hostname = parsed.hostname.replace(/^www\./, '')
  if (hostname !== BONHAMS_HOSTNAME) {
    throw new Error(`Expected a cars.bonhams.com URL, got: ${parsed.hostname}`)
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
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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

    if (!response.ok) throw new Error(FETCH_ERROR)
    html = await response.text()
  } catch (err) {
    if (err instanceof Error && err.message === FETCH_ERROR) throw err
    throw new Error(FETCH_ERROR)
  } finally {
    clearTimeout(timeoutId)
  }

  // USD_ONLY_ERROR and PARSE_ERROR bubble up as user-facing messages
  return parseBonhamsHtml(html, normalizedUrl)
}
