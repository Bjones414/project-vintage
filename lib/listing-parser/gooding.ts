import type { CanonicalListing } from './types'

const GOODING_HOSTNAME = 'goodingco.com'

// Accepted lot URL path patterns
const VALID_LOT_PATTERNS: readonly RegExp[] = [
  /^\/lot\/[^/]+\/?$/,
  /^\/auctions\/[^/]+\/lots\/[^/]+\/?$/,
]

// --- Internal Contentful types ---

interface CloudinaryImage {
  public_id: string
  height?: number
  width?: number
}

interface SubEvent {
  __typename: string
  startDate?: string
}

interface ContentfulLot {
  lotNumber: number | null
  lowEstimate: number | null
  highEstimate: number | null
  hasReservePrice: boolean
  salePrice: number | null
  slug: string | null
  auction: {
    name: string
    currency: string
    subEvents: SubEvent[] | null
  } | null
  item: {
    title: string | null
    highlights: string[] | null
    specifications: string[] | null
    make: { name: string } | null
    modelYear: number | null
    model: string | null
    chassis: string | null
    cloudinaryImagesCombined: CloudinaryImage[] | null
    cloudinaryImages1: CloudinaryImage[] | null
    cloudinaryImages2: CloudinaryImage[] | null
    cloudinaryImages3: CloudinaryImage[] | null
    cloudinaryImages4: CloudinaryImage[] | null
    cloudinaryImages5: CloudinaryImage[] | null
    cloudinaryImages6: CloudinaryImage[] | null
  } | null
}

// --- URL helpers ---

function buildPageDataUrl(parsedUrl: URL): string {
  const pathname = parsedUrl.pathname.replace(/\/$/, '')
  return `https://www.goodingco.com/page-data${pathname}/page-data.json`
}

// --- Field extractors ---

function extractMileage(highlights: string[]): number | null {
  for (const h of highlights) {
    const miMatch = h.match(/(\d[\d,]+)\s+Miles?/i)
    if (miMatch) {
      const n = parseInt(miMatch[1].replace(/,/g, ''), 10)
      return isNaN(n) ? null : n
    }
    const kmMatch = h.match(/(\d[\d,]+)\s+(?:Kilometers?|KM)\b/i)
    if (kmMatch) {
      const n = parseInt(kmMatch[1].replace(/,/g, ''), 10)
      if (isNaN(n)) return null
      return Math.round(n * 0.621371)
    }
  }
  return null
}

function extractColors(highlights: string[]): {
  exterior_color: string | null
  interior_color: string | null
} {
  let exterior_color: string | null = null
  let interior_color: string | null = null

  for (const h of highlights) {
    if (!exterior_color) {
      // "Finished in Elegant Black over Black Color Combination"
      const m = h.match(/Finished in (.+)/i)
      if (m) {
        const raw = m[1]
        const overIdx = raw.search(/\s+over\s+/i)
        exterior_color = (overIdx >= 0 ? raw.slice(0, overIdx) : raw).trim()
      }
    }
    if (!interior_color) {
      // "...over Black Color Combination" or "over Tan Leather Interior"
      const m = h.match(/\bover\s+(.+?)(?:\s+(?:Color\s+)?(?:Combination|Interior|Leather|Upholstery|Cloth)|$)/i)
      if (m) interior_color = m[1].trim()
    }
    if (exterior_color && interior_color) break
  }

  return { exterior_color, interior_color }
}

function extractTransmission(specifications: string[]): string | null {
  for (const spec of specifications) {
    if (/transaxle|transmission/i.test(spec)) return spec
  }
  return null
}

function extractEngine(specifications: string[]): string | null {
  for (const spec of specifications) {
    if (/cylinder|engine\b/i.test(spec)) return spec
  }
  return null
}

function buildImageUrls(images: CloudinaryImage[]): string[] {
  return images.map(
    img =>
      `https://media.goodingco.com/image/upload/f_auto,q_auto/v1/${img.public_id
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/')}`,
  )
}

function extractAuctionEndDate(subEvents: SubEvent[] | null): string | null {
  if (!subEvents) return null
  const auctionDays = subEvents.filter(
    e => e.__typename === 'ContentfulSubEventAuction' && e.startDate,
  )
  if (auctionDays.length === 0) return null
  // Take the last auction day (multi-day events end on the later date)
  const last = auctionDays[auctionDays.length - 1]
  if (!last.startDate) return null
  const d = new Date(last.startDate)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

// --- Pure parser: accepts already-fetched JSON ---

export function parseGoodingPageData(json: unknown, sourceUrl: string): CanonicalListing {
  let lot: ContentfulLot
  try {
    if (typeof json !== 'object' || json === null) throw new Error('root not object')
    const root = json as Record<string, unknown>
    const result = root['result'] as Record<string, unknown> | undefined
    if (!result || typeof result !== 'object') throw new Error('missing result')
    const data = result['data'] as Record<string, unknown> | undefined
    if (!data || typeof data !== 'object') throw new Error('missing result.data')
    const contentfulLot = data['contentfulLot']
    if (!contentfulLot || typeof contentfulLot !== 'object') throw new Error('missing contentfulLot')
    lot = contentfulLot as ContentfulLot
  } catch {
    throw new Error("Couldn't parse this Gooding listing. The page format may have changed.")
  }

  // Currency check — USD only
  const currency = lot.auction?.currency
  if (currency && currency !== 'USD') {
    throw new Error(
      "Gooding listings outside USD aren't supported in V1. International support coming soon.",
    )
  }

  const item = lot.item
  const highlights = item?.highlights ?? []
  const specifications = item?.specifications ?? []

  const title = item?.title?.trim() ?? ''
  const year: number | null =
    typeof item?.modelYear === 'number' &&
    item.modelYear >= 1886 &&
    item.modelYear <= 2030
      ? item.modelYear
      : null
  const make: string | null = item?.make?.name?.trim() ?? null
  const model: string | null = item?.model?.trim() ?? null

  // Trim = anything in the title beyond "{year} {make} {model}"
  const baseTitle = [year, make, model].filter(Boolean).join(' ')
  const trimRaw = title.startsWith(baseTitle) ? title.slice(baseTitle.length).trim() : null
  const trim: string | null = trimRaw || null

  // VIN / chassis — pre-1981 cars have shorter chassis numbers; keep as-is
  const chassisRaw = item?.chassis?.trim() ?? null
  let vin: string | null = null
  if (chassisRaw) {
    vin = chassisRaw.length === 17 ? chassisRaw.toUpperCase() : chassisRaw
  }

  const mileage = extractMileage(highlights)
  const { exterior_color, interior_color } = extractColors(highlights)
  const transmission = extractTransmission(specifications)
  const engine = extractEngine(specifications)

  // Prices — Gooding stores USD whole dollars; convert to cents
  const rawSalePrice = lot.salePrice
  const sold_price_cents: number | null =
    typeof rawSalePrice === 'number' && rawSalePrice > 0
      ? Math.round(rawSalePrice * 100)
      : null

  const listing_status: CanonicalListing['listing_status'] =
    sold_price_cents !== null ? 'sold' : 'no-sale'

  const hasReserve = lot.hasReservePrice
  const reserve_met: boolean | null =
    sold_price_cents !== null && hasReserve
      ? true
      : sold_price_cents === null && hasReserve
        ? false
        : null
  const has_no_reserve = hasReserve === false

  const auction_end_date = extractAuctionEndDate(lot.auction?.subEvents ?? null)

  // Combine all cloudinaryImages arrays into one image list
  const allImages: CloudinaryImage[] = [
    ...(item?.cloudinaryImagesCombined ?? []),
    ...(item?.cloudinaryImages1 ?? []),
    ...(item?.cloudinaryImages2 ?? []),
    ...(item?.cloudinaryImages3 ?? []),
    ...(item?.cloudinaryImages4 ?? []),
    ...(item?.cloudinaryImages5 ?? []),
    ...(item?.cloudinaryImages6 ?? []),
  ]
  const image_urls = buildImageUrls(allImages)

  const source_listing_id = lot.slug ?? String(lot.lotNumber ?? '')

  return {
    source_platform: 'gooding',
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
    high_bid_cents: null,
    listing_status,
    bid_count: null,
    reserve_met,
    has_no_reserve,
    auction_end_date,
    seller_info: null,
    description: null,
    modification_notes: null,
    image_urls,
    raw_data: {
      lot_number: lot.lotNumber,
      auction_name: lot.auction?.name ?? null,
      estimate_low_cents:
        typeof lot.lowEstimate === 'number' ? Math.round(lot.lowEstimate * 100) : null,
      estimate_high_cents:
        typeof lot.highEstimate === 'number' ? Math.round(lot.highEstimate * 100) : null,
      has_reserve_price: hasReserve,
    },
  }
}

// --- Network fetcher ---

export async function parseGoodingListing(url: string): Promise<CanonicalListing> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }

  const hostname = parsed.hostname.replace(/^www\./, '')
  if (hostname !== GOODING_HOSTNAME) {
    throw new Error(`Expected a goodingco.com URL, got: ${parsed.hostname}`)
  }

  if (!VALID_LOT_PATTERNS.some(re => re.test(parsed.pathname))) {
    throw new Error("This doesn't appear to be a valid Gooding lot URL.")
  }

  parsed.protocol = 'https:'
  const pageDataUrl = buildPageDataUrl(parsed)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  let response: Response
  try {
    response = await fetch(pageDataUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'application/json,text/javascript,*/*;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Referer: `https://www.goodingco.com${parsed.pathname}`,
      },
    })
  } catch {
    clearTimeout(timeoutId)
    throw new Error(
      "Couldn't load this Gooding listing. The auction may have been removed or the URL is invalid.",
    )
  }
  clearTimeout(timeoutId)

  if (response.status === 403 || response.status === 404) {
    throw new Error(
      "Couldn't load this Gooding listing. The auction may have been removed or the URL is invalid.",
    )
  }
  if (!response.ok) {
    throw new Error(
      "Couldn't load this Gooding listing. The auction may have been removed or the URL is invalid.",
    )
  }

  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new Error("Couldn't parse this Gooding listing. The page format may have changed.")
  }

  return parseGoodingPageData(json, url)
}
