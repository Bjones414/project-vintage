import { load } from 'cheerio';
import { createHash } from 'node:crypto';
import type { RawListing } from '../types';

const BASE_URL = 'https://rmsothebys.com';

// Approximate country mapping by 2-letter auction location prefix.
const LOCATION_COUNTRY: Record<string, string> = {
  az: 'US', am: 'US', ny: 'US', cc: 'US', mw: 'US', mf: 'US', as: 'US',
  lo: 'GB',
  pa: 'FR',
  mc: 'MC',
  mu: 'DE',
  mi: 'IT',
  hk: 'HK',
  to: 'CA',
};

// Confirmed response shape from DevTools capture.
export interface SearchLotsResponse {
  items: RmLot[];
  pager: {
    totalItems: number;
    currentPage: number;   // 1-indexed
    pageSize: number;
    totalPages: number;
    startPage: number;
    endPage: number;
  };
}

// Confirmed lot fields from DevTools capture. Unknown extras captured by index signature.
export interface RmLot {
  id?: string;
  auctionId?: string;
  header?: string;           // "ARIZONA 2026"
  publicName?: string;       // "1987 Porsche 911 Turbo Coupe"
  lot?: string;              // "132"
  referenceId?: string;      // "r0046" — used as source_listing_id suffix
  value?: string;            // "$240,800 USD"
  valueType?: string;        // "Sold" | "Not Sold" | ""
  sold?: boolean;
  auctioned?: boolean;
  preSaleEstimate?: string;  // "$225,000 - $275,000" or ""
  link?: string;             // "/auctions/az26/lots/r0046-..."
  crop?: string;             // CDN image URL
  locationFlag?: string;     // "/media/General/Flags/241855/us.png"
  [key: string]: unknown;
}

export function extractLots(response: SearchLotsResponse): RmLot[] {
  return response.items ?? [];
}

export function extractTotalPages(response: SearchLotsResponse): number {
  return response.pager?.totalPages ?? 1;
}

function hashVinPartial(chassis: string | null | undefined): string | null {
  if (!chassis || chassis.trim().length < 6) return null;
  const last6 = chassis.trim().toUpperCase().slice(-6);
  return createHash('sha256').update(last6, 'utf8').digest('hex');
}

function parseMileageToMiles(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim();
  const match = cleaned.match(/(\d+(?:\.\d+)?)\s*(km|miles?)/i);
  if (!match) return null;
  const value = parseFloat(match[1]);
  if (isNaN(value)) return null;
  return /km/i.test(match[2]) ? Math.round(value * 0.621371) : Math.round(value);
}

function detectCurrency(valueStr: string): string {
  if (valueStr.includes('$')) return 'USD';
  if (valueStr.includes('£')) return 'GBP';
  if (valueStr.includes('€')) return 'EUR';
  if (valueStr.includes('CHF')) return 'CHF';
  return 'USD';
}

function parseFinalPriceCents(valueStr: string, currency: string): number | null {
  if (currency !== 'USD') return null;
  const match = valueStr.match(/\$([\d,]+)/);
  if (!match) return null;
  const dollars = parseInt(match[1].replace(/,/g, ''), 10);
  return isNaN(dollars) ? null : dollars * 100;
}

function parseEstimateCents(estimateStr: string): { low: number | null; high: number | null } {
  if (!estimateStr) return { low: null, high: null };
  const matches = Array.from(estimateStr.matchAll(/\$([\d,]+)/g));
  if (matches.length === 0) return { low: null, high: null };
  const cents = matches.map(m => parseInt(m[1].replace(/,/g, ''), 10) * 100);
  return { low: cents[0] ?? null, high: cents[1] ?? cents[0] ?? null };
}

function parsePublicName(
  publicName: string,
): { year: number; make: string; model: string; trim: string | null } | null {
  const parts = publicName.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  if (isNaN(year) || year < 1950 || year > 2030) return null;
  if (parts[1].toLowerCase() !== 'porsche') return null;
  const model = parts[2];
  const trim = parts.length > 3 ? parts.slice(3).join(' ') : null;
  return { year, make: 'Porsche', model, trim };
}

type IndexFields = Omit<
  RawListing,
  'mileage' | 'exterior_color' | 'interior_color' | 'transmission' | 'vin_hash_partial'
>;

export function parseLotFromIndex(
  lot: RmLot,
  auctionCode: string,
  auctionEndDate: string | null,
): IndexFields | null {
  if (!lot.publicName || !lot.referenceId) return null;

  const parsed = parsePublicName(lot.publicName);
  if (!parsed) return null;

  const valueStr = lot.value ?? '';
  const currency = detectCurrency(valueStr);
  const finalPriceCents = parseFinalPriceCents(valueStr, currency);
  const estimate = parseEstimateCents(lot.preSaleEstimate ?? '');

  const listingStatus: RawListing['listing_status'] =
    lot.sold === true ? 'sold' : lot.auctioned === true ? 'no-sale' : 'unknown';

  const locationPrefix = auctionCode.slice(0, 2).toLowerCase();
  const countryOfSale = LOCATION_COUNTRY[locationPrefix] ?? null;

  const detailPath = lot.link ?? `/en/auctions/${auctionCode}/lots/`;
  const sourceUrl = detailPath.startsWith('http') ? detailPath : `${BASE_URL}${detailPath}`;

  return {
    source_platform: 'rm-sothebys',
    source_listing_id: `${auctionCode}-${lot.referenceId}`,
    source_url: sourceUrl,
    year: parsed.year,
    make: parsed.make,
    model: parsed.model,
    trim: parsed.trim,
    listing_status: listingStatus,
    final_price_cents: finalPriceCents,
    currency,
    estimate_low_cents: estimate.low,
    estimate_high_cents: estimate.high,
    lot_number: lot.lot ?? null,
    image_url: lot.crop ?? null,
    auction_ends_at: auctionEndDate,
    country_of_sale: countryOfSale,
    has_no_reserve: false,
  };
}

export interface DetailPageFields {
  mileage: number | null;
  exterior_color: string | null;
  interior_color: string | null;
  transmission: string | null;
  vin_hash_partial: string | null;
  engine_description: string | null; // informational; no DB column yet
}

// Searches for a spec value across common auction-site HTML patterns.
function findByLabel($: ReturnType<typeof load>, labels: string[]): string | null {
  for (const label of labels) {
    // Definition list: <dt>Label</dt><dd>Value</dd>
    const dt = $('dt')
      .filter((_, el) => $(el).text().trim().toLowerCase().includes(label.toLowerCase()))
      .first();
    if (dt.length) {
      const val = dt.next('dd').text().trim();
      if (val) return val;
    }

    // Table row: <td>Label</td><td>Value</td>
    const labelCell = $('td, th')
      .filter((_, el) => $(el).text().trim().toLowerCase().includes(label.toLowerCase()))
      .first();
    if (labelCell.length) {
      const val = labelCell.next('td').text().trim();
      if (val) return val;
    }

    // RM Sotheby's .idlabel / .iddata sibling pattern (Chassis No., Engine No.)
    const idLabel = $('.idlabel')
      .filter((_, el) => $(el).text().trim().toLowerCase().includes(label.toLowerCase()))
      .first();
    if (idLabel.length) {
      const val = idLabel.siblings('.iddata').first().text().trim();
      if (val) return val;
    }

    // Generic labeled div: element with label text, sibling/child contains value
    const labelEl = $('[class*="label"], [class*="key"], strong, b')
      .filter((_, el) => $(el).text().trim().toLowerCase().includes(label.toLowerCase()))
      .first();
    if (labelEl.length) {
      const sibling = labelEl.next('[class*="value"], span, p');
      if (sibling.length && sibling.text().trim()) return sibling.text().trim();
      const parentText = labelEl.parent().text().replace(labelEl.text(), '').trim();
      if (parentText) return parentText;
    }
  }
  return null;
}

// ── Natural-language extraction from RM Sotheby's bullet highlights ───────────
// Mileage and color are not in structured label:value fields on RM Sotheby's
// lot pages — they appear only in the ul.list-bullets highlight text.

function extractMileageFromText(text: string): string | null {
  const miles = text.match(/\b([\d,]+)\s*(?:miles?|mi)\b/i);
  if (miles) return `${miles[1]} miles`;
  const km = text.match(/\b([\d,]+)\s*(?:km|kilometres?|kilometers?)\b/i);
  if (km) return `${km[1]} km`;
  return null;
}

function extractExteriorColorFromText(text: string): string | null {
  // "Classic Guards Red over a Black interior" → "Classic Guards Red"
  const beforeOver = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\s+over\s+/);
  if (beforeOver) return beforeOver[1].trim();
  // "finished in Silver Metallic" / "painted in Guards Red"
  const finishedIn = text.match(/(?:finished|painted|presented|offered)\s+in\s+([A-Z]\w+(?:\s+[A-Z]\w+)?)/i);
  if (finishedIn) return finishedIn[1].trim();
  // "Guards Red exterior"
  const beforeExterior = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+exterior\b/);
  if (beforeExterior) return beforeExterior[1].trim();
  return null;
}

function extractInteriorColorFromText(text: string): string | null {
  // "over a Black partial leather interior" / "over an Espresso leather interior"
  const withArticle = text.match(
    /over\s+an?\s+((?:(?!partial|leather|cloth|vinyl|fabric|interior|upholstery)\w+\s*){1,2})/i,
  );
  if (withArticle) return withArticle[1].trim();
  // "over Black leather interior" (no article)
  const noArticle = text.match(
    /over\s+((?:(?!partial|leather|cloth|vinyl|fabric|interior|upholstery)\w+\s*){1,2})(?:partial\s+)?(?:leather|cloth|interior)/i,
  );
  if (noArticle) return noArticle[1].trim();
  return null;
}

function extractTransmissionFromText(text: string): string | null {
  // "5-speed manual", "4-speed manual gearbox", "5-speed Getrag manual"
  const speedGear = text.match(/\b(\d[-–]speed\s+(?:manual|automatic|Tiptronic)(?:\s+\w+)?)\b/i);
  if (speedGear) return speedGear[1].replace(/\s+/g, ' ').trim();
  // Tiptronic / PDK
  const auto = text.match(/\b(Tiptronic(?:\s+automatic)?|PDK(?:\s+[\w-]+)?)\b/);
  if (auto) return auto[1];
  // "manual gearbox" / "automatic transmission"
  const gearbox = text.match(/\b(manual|automatic)\s+(?:gearbox|transmission)\b/i);
  if (gearbox) return gearbox[0];
  return null;
}

export function parseDetailPage(html: string): DetailPageFields {
  const $ = load(html);

  // Structured fields from .idlabel/.iddata (Chassis No., Engine No. on RM Sotheby's)
  const chassisRaw = findByLabel($, ['chassis no', 'chassis number', 'chassis', 'vin']);
  const engineRaw = findByLabel($, ['engine no', 'engine number', 'engine', 'powerplant', 'displacement']);

  // Structured fallbacks for sites that do have label:value pairs for these fields
  const mileageStructured = findByLabel($, ['mileage', 'odometer', 'kilometres', 'kilometrage', 'miles showing']);
  const colorStructured = findByLabel($, ['exterior colour', 'exterior color', 'colour', 'color', 'paint', 'finish']);
  const interiorStructured = findByLabel($, ['interior colour', 'interior color', 'interior', 'upholstery', 'trim']);
  // Omit 'gearbox'/'gearchange' — RM Sotheby's "Gearbox No." returns a serial number,
  // not a transmission type. The text extractor handles "manual gearbox" etc.
  const transmissionStructured = findByLabel($, ['transmission']);

  // RM Sotheby's puts mileage and color only in ul.list-bullets highlight text —
  // there are no structured label:value fields for these on their lot pages.
  const bulletItems: string[] = [];
  $('ul.list-bullets li, ul[class*="bullet"] li').each((_, el) => {
    bulletItems.push($(el).text().trim());
  });
  const bulletText = bulletItems.join(' ');

  // Include full catalog description text for transmission and mileage fallback
  const descText = $('.lang-en-US').text().replace(/\s+/g, ' ').trim();
  const searchText = `${bulletText} ${descText}`;

  // Search full text for mileage — some lots bury it in the catalog essay rather than bullets
  const mileageRaw = mileageStructured ?? extractMileageFromText(searchText);
  const colorRaw = colorStructured ?? extractExteriorColorFromText(bulletText);
  const interiorRaw = interiorStructured ?? extractInteriorColorFromText(bulletText);
  const transmissionRaw = transmissionStructured ?? extractTransmissionFromText(searchText);

  return {
    mileage: mileageRaw ? parseMileageToMiles(mileageRaw) : null,
    exterior_color: colorRaw ? colorRaw.replace(/\s+/g, ' ').trim() : null,
    interior_color: interiorRaw ? interiorRaw.replace(/\s+/g, ' ').trim() : null,
    transmission: transmissionRaw ? transmissionRaw.replace(/\s+/g, ' ').trim() : null,
    vin_hash_partial: hashVinPartial(chassisRaw),
    engine_description: engineRaw ? engineRaw.replace(/\s+/g, ' ').trim() : null,
  };
}
