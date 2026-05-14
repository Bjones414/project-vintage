import { load } from 'cheerio'
import type { CanonicalListing } from './types'

const BAT_HOSTNAME = 'bringatrailer.com'

// Epoch-seconds bounds for a plausible auction end time.
const TS_MIN = 1262304000  // 2010-01-01T00:00:00Z
const TS_MAX = 2240524799  // 2040-12-31T23:59:59Z

// Longest-first so multi-word models ("718 Cayman") are matched before their
// single-word overlaps ("Cayman"). The order within same-length groups is
// arbitrary but must remain stable to keep backfill results reproducible.
export const PORSCHE_MODEL_PREFIXES: readonly string[] = [
  '718 Boxster',
  '718 Cayman',
  '918 Spyder',
  'Carrera GT',
  'Panamera',
  'Cayenne',
  'Boxster',
  'Cayman',
  'Taycan',
  'Macan',
  '912E',
  '914',
  '924',
  '928',
  '930',
  '944',
  '959',
  '968',
  '356',
  '911',
  '912',
]

/**
 * Splits a post-make title fragment (everything after "Porsche" in a BaT
 * title) into canonical model and trim using longest-prefix matching.
 *
 * Returns { model: null, trim: null } when no prefix matches and logs a
 * warning — callers must not fall back to storing the raw string.
 *
 * Handles concatenated variant designators: "911S Targa" → model "911", trim "S Targa".
 * Handles hyphenated sub-models: "914-6 Coupe" → model "914", trim "6 Coupe".
 */
export function splitModelTrim(postMake: string): { model: string | null; trim: string | null } {
  for (const prefix of PORSCHE_MODEL_PREFIXES) {
    if (postMake === prefix) {
      return { model: prefix, trim: null }
    }
    if (postMake.startsWith(prefix)) {
      const next = postMake[prefix.length]
      // Valid separator after prefix: space (normal trim), uppercase letter (e.g. 911S),
      // or hyphen (e.g. 914-6). Digits are NOT valid — prevents "9110" matching "911".
      if (next === ' ' || next === '-' || /^[A-Z]/.test(next)) {
        const remainder = postMake.slice(prefix.length).trim()
        // Strip leading hyphen so "914-6 Coupe" → trim "6 Coupe", not "-6 Coupe"
        const trimValue = remainder.startsWith('-') ? remainder.slice(1).trim() : remainder
        return { model: prefix, trim: trimValue || null }
      }
    }
  }
  console.warn(`[BaT parser] unrecognized model string, leaving unparsed: "${postMake}"`)
  return { model: null, trim: null }
}

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

// Trim a color candidate to only proper-noun words (uppercase-initial).
// "Cashmere Beige leather" → "Cashmere Beige", "Black dashboard" → "Black"
function trimToProperNouns(candidate: string): string {
  const words = candidate.trim().split(/\s+/)
  let end = 0
  for (let i = 0; i < words.length; i++) {
    if (/^[A-Z]/.test(words[i])) end = i + 1
    else break
  }
  return words.slice(0, end).join(' ')
}

function isValidColorCandidate(candidate: string): boolean {
  if (!candidate) return false
  const words = candidate.trim().split(/\s+/)
  if (words.length === 0 || words.length > 4) return false
  if (!words.some((w) => /^[A-Z]/.test(w))) return false
  if (/\d/.test(candidate)) return false
  const JUNK = new Set(['The', 'And', 'This', 'With', 'Its', 'Over', 'Or', 'A', 'An'])
  if (words.length === 1 && JUNK.has(candidate)) return false
  return true
}

// Scans description prose for color mentions not captured by the structured <ul>.
// target = 'interior': tries upholstery / interior / seats patterns first, then "X over Y" group 2.
// target = 'exterior': tries painted/finished patterns, then "X over Y" group 1.
function extractColorFromDescription(
  desc: string,
  target: 'interior' | 'exterior',
): string | null {
  const interiorPatterns: Array<{ re: RegExp; group: number }> = [
    // "upholstered in Cashmere Beige leather"
    {
      re: /upholstered\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3}?)\s+(?:leather|cloth|alcantara|vinyl|leatherette)/i,
      group: 1,
    },
    // "Cashmere Beige leather interior" / "Black partial leather upholstery"
    {
      re: /([A-Za-z]+(?:\s+[A-Za-z]+){0,2})\s+(?:partial\s+)?(?:leather|cloth|alcantara|vinyl|leatherette)\s+(?:interior|upholstery|seats)/i,
      group: 1,
    },
    // "interior is finished in Black" / "interior finished in Cashmere"
    {
      re: /interior\s+(?:is\s+)?finished\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
      group: 1,
    },
    // "interior in Cashmere Beige"
    {
      re: /interior\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
      group: 1,
    },
    // "seats in Black" / "upholstery in Cognac"
    {
      re: /(?:seats|upholstery)\s+(?:are\s+)?in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
      group: 1,
    },
    // "[Exterior] over [Interior]" — both sides capitalized; group 2 = interior
    {
      re: /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+over\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\b/,
      group: 2,
    },
  ]

  const exteriorPatterns: Array<{ re: RegExp; group: number }> = [
    // "painted in Guards Red" / "finished in Silver"
    {
      re: /(?:painted|refinished)\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
      group: 1,
    },
    // "[Exterior] over [Interior]" — group 1 = exterior
    {
      re: /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+over\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\b/,
      group: 1,
    },
    // "Guards Red exterior" / "Silver exterior color"
    {
      re: /([A-Za-z]+(?:\s+[A-Za-z]+){0,2})\s+exterior(?:\s+color)?/i,
      group: 1,
    },
  ]

  const patterns = target === 'interior' ? interiorPatterns : exteriorPatterns

  for (const { re, group } of patterns) {
    const m = desc.match(re)
    if (!m?.[group]) continue
    const raw = trimToProperNouns(m[group].trim())
    if (isValidColorCandidate(raw)) return raw
  }
  return null
}

// Title-cases a raw string: "blue metallic" → "Blue Metallic"
function titleCase(str: string): string {
  return str.replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

// Strips trailing prepositions/stopwords and validates as a plausible color.
// Returns the cleaned, title-cased string or null if the candidate looks invalid.
function cleanColorCapture(raw: string): string | null {
  const STOPWORDS = new Set(['in', 'at', 'by', 'to', 'from', 'on', 'and', 'or', 'the', 'a', 'an', 'of', 'with', 'its'])
  const words = titleCase(raw.trim()).split(/\s+/)
  while (words.length > 0 && STOPWORDS.has(words[words.length - 1].toLowerCase())) words.pop()
  if (words.length === 0 || words.length > 4) return null
  if (words.some((w) => /\d/.test(w) || w.length < 2)) return null
  return words.join(' ')
}

// Extracts the sentence containing `pos` from `text` (capped at 300 chars).
function extractSentenceAt(text: string, pos: number): string {
  let start = pos
  while (start > 0 && !/[.!?]/.test(text[start - 1])) start--
  let end = pos
  while (end < text.length && !/[.!?]/.test(text[end])) end++
  if (end < text.length) end++
  const s = text.slice(start, end).trim()
  return s.length > 300 ? s.slice(0, 297) + '...' : s
}

// Looks for a 4-digit year (1950–2030) in a context window around `nearPos`.
function extractYearNear(text: string, nearPos: number): number | null {
  const ctx = text.slice(Math.max(0, nearPos - 20), Math.min(text.length, nearPos + 150))
  // Primary: "in YYYY" or "around YYYY"
  const re1 = /\b(?:in|around)\s+((?:19|20)\d{2})\b/gi
  let m: RegExpExecArray | null
  while ((m = re1.exec(ctx)) !== null) {
    const y = parseInt(m[1], 10)
    if (y >= 1950 && y <= 2030) return y
  }
  // Fallback: standalone 4-digit year
  const re2 = /\b((?:19|20)\d{2})\b/g
  while ((m = re2.exec(ctx)) !== null) {
    const y = parseInt(m[1], 10)
    if (y >= 1950 && y <= 2030) return y
  }
  return null
}

export interface PaintDisclosureResult {
  is_repainted: boolean | null
  original_exterior_color: string | null
  current_color_from_disclosure: string | null
  repaint_year: number | null
  repaint_disclosure: string | null
}

/**
 * Scans listing description prose for repaint disclosures and original-color mentions.
 *
 * Returns:
 *   is_repainted = true   — seller disclosed a repaint
 *   is_repainted = false  — seller confirmed original paint
 *   is_repainted = null   — no mention found
 */
export function extractPaintDisclosure(text: string): PaintDisclosureResult {
  const none: PaintDisclosureResult = {
    is_repainted: null,
    original_exterior_color: null,
    current_color_from_disclosure: null,
    repaint_year: null,
    repaint_disclosure: null,
  }
  if (!text) return none

  // Seller-confirmed original paint → is_repainted = false
  const ORIGINAL_CONFIRMED = [
    /\bnever\s+(?:been\s+)?repainted\b/i,
    /\bunrepainted\b/i,
    /\boriginal\s+factory\s+paint\b/i,
    /\bfactory\s+paint\s+(?:is\s+)?intact\b/i,
    /\ball[-\s]original\s+paint\b/i,
  ]
  for (const re of ORIGINAL_CONFIRMED) {
    if (re.test(text)) return { ...none, is_repainted: false }
  }

  // "color change from [ORIG] to [CURRENT]"
  const colorChangeRe = /colou?r\s+change\s+from\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})\s+to\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i
  const ccm = text.match(colorChangeRe)
  if (ccm) {
    const pos = text.indexOf(ccm[0])
    return {
      is_repainted: true,
      original_exterior_color: cleanColorCapture(ccm[1]),
      current_color_from_disclosure: cleanColorCapture(ccm[2]),
      repaint_year: extractYearNear(text, pos),
      repaint_disclosure: extractSentenceAt(text, pos),
    }
  }

  // Repaint disclosure patterns — ordered most-specific first
  const REPAINT: Array<{ re: RegExp; colorGroup: number | null }> = [
    // "was repainted in Blue Metallic" / "has been repainted in Guards Red"
    { re: /(?:was|has\s+been)\s+repainted\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i, colorGroup: 1 },
    // "refinished in Blue Metallic"
    { re: /refinished\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,                      colorGroup: 1 },
    // "Blue Metallic respray"
    { re: /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+respray\b/,                   colorGroup: 1 },
    // generic "repainted" with no inline color
    { re: /\brepainted\b/i,                                                              colorGroup: null },
  ]

  let matchPos = -1
  let currentColor: string | null = null

  for (const { re, colorGroup } of REPAINT) {
    const m = text.match(re)
    if (!m) continue
    matchPos = text.indexOf(m[0])
    if (colorGroup !== null && m[colorGroup]) {
      currentColor = cleanColorCapture(m[colorGroup])
    }
    break
  }

  if (matchPos === -1) return none

  // Scan full text for original-color mentions
  const ORIG: Array<RegExp> = [
    /left\s+the\s+factory\s+(?:finished\s+)?in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
    /factory\s+(?:original\s+)?colou?r\s+(?:was|is)\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
    /original\s+(?:exterior\s+)?colou?r\s+(?:was|is)\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
    /originally\s+(?:(?:finished|painted|delivered)\s+in\s+)?([A-Za-z]+(?:\s+[A-Za-z]+){0,3})\s+(?:from\s+the\s+factory|from\s+new)/i,
    /\bborn\s+in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
    /delivered\s+(?:new\s+)?in\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,3})/i,
  ]

  let originalColor: string | null = null
  for (const re of ORIG) {
    const m = text.match(re)
    if (m?.[1]) {
      const c = cleanColorCapture(m[1])
      if (c) { originalColor = c; break }
    }
  }

  return {
    is_repainted: true,
    original_exterior_color: originalColor,
    current_color_from_disclosure: currentColor,
    repaint_year: extractYearNear(text, matchPos),
    repaint_disclosure: extractSentenceAt(text, matchPos),
  }
}

export interface ReupholsteryDisclosureResult {
  is_reupholstered: boolean | null
  original_interior_color: string | null
  reupholstery_disclosure: string | null
}

/**
 * Scans listing description prose for interior reupholstery disclosures.
 */
export function extractReupholsteryDisclosure(text: string): ReupholsteryDisclosureResult {
  const none: ReupholsteryDisclosureResult = {
    is_reupholstered: null,
    original_interior_color: null,
    reupholstery_disclosure: null,
  }
  if (!text) return none

  const ORIGINAL_CONFIRMED = [
    /\bnever\s+(?:been\s+)?reupholstered\b/i,
    /\boriginal\s+(?:factory\s+)?interior\b/i,
    /\boriginal\s+(?:factory\s+)?upholstery\b/i,
  ]
  for (const re of ORIGINAL_CONFIRMED) {
    if (re.test(text)) return { ...none, is_reupholstered: false }
  }

  const REUPHOLSTERED = [
    /\breupholstered\b/i,
    /interior\s+(?:was\s+)?recovered\s+in\b/i,
    /new\s+(?:leather|cloth|alcantara)\s+(?:interior|upholstery)\b/i,
  ]
  for (const re of REUPHOLSTERED) {
    const m = text.match(re)
    if (m) {
      const pos = text.indexOf(m[0])
      return {
        is_reupholstered: true,
        original_interior_color: null,
        reupholstery_disclosure: extractSentenceAt(text, pos),
      }
    }
  }

  return none
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

// Requires at least one of these context words to qualify a bullet as a transmission entry.
// Prevents false-positive matches on "Automatic Climate Control", "Manual mirrors", etc.
const TX_CONTEXT =
  /transaxle|transmission|gearbox|\bPDK\b|\bTiptronic\b|\b(three|four|five|six|seven|eight|nine|\d+)[\s‑-]?speed\b|\bG(50|96|81)\b/i

const WORD_TO_DIGIT: Record<string, string> = {
  three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9',
}

/**
 * Returns true only when the bullet text contains transmission-specific context.
 * Standalone "Automatic" or "Manual" words are NOT sufficient.
 */
export function isTransmissionBullet(text: string): boolean {
  return TX_CONTEXT.test(text)
}

/**
 * Converts a raw BaT transmission bullet to a compact canonical form:
 *   "Six-Speed Manual Transaxle"            → "6-Speed Manual"
 *   "G50 Five-Speed Manual Transaxle"       → "5-Speed Manual (G50)"
 *   "Seven-Speed PDK Dual-Clutch Transaxle" → "7-Speed PDK"
 *   "Four-Speed Tiptronic Automatic Transaxle" → "4-Speed Tiptronic"
 *   "Tiptronic S Automatic Transaxle"       → "Tiptronic S"
 */
export function normalizeTransmission(raw: string): string {
  // Normalize non-breaking hyphens to regular hyphens
  let s = raw.replace(/‑/g, '-').trim()
  // Convert word numbers to digit form: "Six-Speed" → "6-Speed"
  s = s.replace(
    /\b(three|four|five|six|seven|eight|nine)([\s-]?)speed\b/gi,
    (_, word) => `${WORD_TO_DIGIT[word.toLowerCase()]}-Speed`,
  )

  const speedMatch = s.match(/\b(\d+)[\s-]?[Ss]peed\b/)
  const speed = speedMatch ? speedMatch[1] : null
  const speedStr = speed ? `${speed}-Speed` : ''

  const isPDK       = /\bPDK\b/i.test(s)
  const isTipS      = /\bTiptronic\s+S\b/i.test(s)
  const isTip       = /\bTiptronic\b/i.test(s)
  const isManual    = /\bManual\b/i.test(s)
  const gboxMatch   = s.match(/\bG(50|96|81)\b/i)
  const gcode       = gboxMatch ? `G${gboxMatch[1]}` : null

  if (isPDK)    return speedStr ? `${speedStr} PDK`        : 'PDK'
  if (isTipS)   return speedStr ? `${speedStr} Tiptronic S` : 'Tiptronic S'
  if (isTip)    return speedStr ? `${speedStr} Tiptronic`   : 'Tiptronic'
  if (isManual) {
    const base = speedStr ? `${speedStr} Manual` : 'Manual'
    return gcode ? `${base} (${gcode})` : base
  }
  if (speedStr) return `${speedStr} Automatic`

  return s
}

/**
 * Pure HTML parser — steps 3–12 of the original parsing logic.
 * Accepts already-fetched HTML and the normalized source URL.
 * No network I/O; safe to call from both the on-demand route and the scraper.
 */
export function parseBatHtml(html: string, sourceUrl: string): CanonicalListing {
  const parsedUrl = new URL(sourceUrl)
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
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
    source_listing_id = pathSegments[pathSegments.length - 1] ?? ''
  }

  // Step 5 — Parse title into year / make / model / trim
  let year: number | null = null
  let make: string | null = null
  let model: string | null = null
  let trim: string | null = null
  const titleMatch = title.match(/(\d{4})\s+(.+)$/)
  if (titleMatch) {
    const parsedYear = parseInt(titleMatch[1], 10)
    year = parsedYear >= 1900 && parsedYear <= 2030 ? parsedYear : null
    const parts = titleMatch[2].split(/\s+/)
    make = parts[0] ?? null
    const postMake = parts.slice(1).join(' ')
    if (postMake) {
      if (make?.toLowerCase() === 'porsche') {
        // Porsche-specific prefix matching (validates against known model list)
        const parsed = splitModelTrim(postMake)
        model = parsed.model
        trim = parsed.trim
      } else {
        // Generic non-Porsche: treat first token as model, remainder as trim.
        // Skips Porsche-specific validation; allows caching for comparable sale data.
        const nonPorscheParts = postMake.split(/\s+/)
        model = nonPorscheParts[0] ?? null
        trim = nonPorscheParts.slice(1).join(' ') || null
      }
    }
  }

  // Step 6 — Extract VIN/chassis number from listing details.
  // BaT uses "Chassis: <value>" in BaT Essentials / Listing Details sections.
  // Labels vary: "Chassis:", "Chassis No.:", "Chassis Number:", "VIN:", "VIN Number:".
  // Four-tier strategy: list/table items → dt/dd pairs → adjacent sibling elements → raw HTML scan.
  let vin: string | null = null
  const VIN_17 = /\b([A-HJ-NPR-Z0-9]{17})\b/
  const CHASSIS_INLINE = /(?:chassis(?:\s*(?:no\.?|num(?:ber)?|#))?|vin(?:\s+num(?:ber)?)?)\s*[:#]?\s*([A-HJ-NPR-Z0-9]{6,17})/i
  const CHASSIS_LABEL  = /^\s*(?:chassis(?:\s*(?:no\.?|num(?:ber)?|#))?|vin(?:\s+num(?:ber)?)?)\s*[:#]?\s*$/i
  const VALUE_ONLY     = /^([A-HJ-NPR-Z0-9]{6,17})$/i

  // Tier 1: label+value co-located in a single element's full text content.
  // Handles <li>Chassis: WP0...</li> and <td>Chassis: WP0...</td> layouts.
  $('li, td').each((_, el) => {
    if (vin) return false
    const m = $(el).text().match(CHASSIS_INLINE)
    if (m) vin = m[1]
  })

  // Tier 2: <dt>/<th> label with value in adjacent <dd>/<td> (definition list layout).
  if (!vin) {
    $('dt, th').each((_, el) => {
      if (vin) return false
      if (!CHASSIS_LABEL.test($(el).text())) return
      const val = $(el).next('dd, td').text().trim()
      const m = val.match(VALUE_ONLY)
      if (m) vin = m[1]
    })
  }

  // Tier 3: label in one element, value in immediately adjacent sibling.
  // Handles <span class="label">Chassis:</span><span class="value">WP0...</span> grid layouts.
  if (!vin) {
    $('span, p, div').each((_, el) => {
      if (vin) return false
      const direct = $(el).clone().children().remove().end().text().trim()
      if (!CHASSIS_LABEL.test(direct)) return
      const nextText = $(el).next().text().trim()
      const m = nextText.match(VALUE_ONLY)
      if (m) vin = m[1]
    })
  }

  // Tier 4: raw HTML scan for exactly 17-char VIN (catches values in <script> JSON blobs).
  // Pre-1981 chassis numbers (<17 chars) are only captured by Tiers 1-3 via labeled match.
  if (!vin) {
    const rawMatch = html.match(VIN_17)
    if (rawMatch) vin = rawMatch[1]
  }

  if (vin) vin = vin.toUpperCase()

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

    if (transmission === null && isTransmissionBullet(text)) {
      transmission = normalizeTransmission(text)
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

  // Step 7b — Extract visible page text (cheap DOM pass; reused by Steps 7b/7c/9/10/11).
  const cleaned = $.root().clone()
  cleaned.find('script, style').remove()
  const visibleText = cleaned.find('body').text()

  // Step 7c — Color fallbacks: description prose first, then full visible text.
  // Cascades only when the structured <ul> didn't yield a value.
  if (interior_color === null && description) {
    interior_color = extractColorFromDescription(description, 'interior')
  }
  if (exterior_color === null && description) {
    exterior_color = extractColorFromDescription(description, 'exterior')
  }
  // Third tier: visibleText catches old BaT listings without JSON-LD description.
  if (interior_color === null) {
    interior_color = extractColorFromDescription(visibleText, 'interior')
  }
  if (exterior_color === null) {
    exterior_color = extractColorFromDescription(visibleText, 'exterior')
  }

  // Step 7d — Paint and upholstery disclosure extraction from description prose.
  // Runs after color fallbacks so current_color_from_disclosure can fill exterior_color when null.
  const descForDisclosure = description ?? visibleText
  const paintDisclosure = extractPaintDisclosure(descForDisclosure)
  const upholsteryDisclosure = extractReupholsteryDisclosure(descForDisclosure)
  if (exterior_color === null && paintDisclosure.current_color_from_disclosure !== null) {
    exterior_color = paintDisclosure.current_color_from_disclosure
  }

  // Step 8 — Extract auction end date (three-tier: primary DOM, fallback DOM, regex)
  const auction_end_date = extractAuctionEndDate($, html)

  // Step 9 — Determine listing_status

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
  const { reserve_met, has_no_reserve } = detectReserveStatus(visibleText)

  // Step 11 — High-bid extraction.
  // Live auctions: "Current Bid $X" → high_bid_cents.
  // Ended no-sale auctions: "Bid to USD $X" → high_bid_cents.
  // For no-sale listings the JSON-LD price field holds the final bid amount, not a
  // completed sale — null out sold_price_cents and store the amount in high_bid_cents.
  let high_bid_cents: number | null = extractCurrentBid(visibleText)
  if (listing_status === 'no-sale') {
    const m = visibleText.match(/Bid\s+to\s+(?:USD\s*)?\$?([\d,]+(?:\.\d{2})?)/i)
    if (m) {
      const amount = parseFloat(m[1].replace(/,/g, ''))
      high_bid_cents = isNaN(amount) ? null : Math.round(amount * 100)
    }
    sold_price_cents = null
  }

  // Step 12 — Assemble CanonicalListing
  return {
    source_platform: 'bring-a-trailer',
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
    original_exterior_color: paintDisclosure.original_exterior_color,
    is_repainted: paintDisclosure.is_repainted,
    repaint_year: paintDisclosure.repaint_year,
    repaint_disclosure: paintDisclosure.repaint_disclosure,
    original_interior_color: upholsteryDisclosure.original_interior_color,
    is_reupholstered: upholsteryDisclosure.is_reupholstered,
    reupholstery_disclosure: upholsteryDisclosure.reupholstery_disclosure,
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

    return parseBatHtml(html, normalizedUrl)
  } catch (error) {
    throw new Error(
      `Failed to parse BaT listing at ${url}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
