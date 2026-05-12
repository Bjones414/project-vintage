import type { Database } from '../lib/supabase/types';
import type { RawListing } from './types';

type BaseInsert = Database['public']['Tables']['listings']['Insert'];

// Patterns that indicate a third-party heavily-modified build.
const COACHBUILT_PATTERNS: RegExp[] = [
  /\bsinger\b/i,
  /\bruf\b/i,
  /\bworkshop[\s-]?5001\b/i,
  /\bmagnus[\s-]?walker\b/i,
  /\boutlaw\b/i,
  /\brestomod\b/i,
  /\brestoration[\s-]?mod\b/i,
]

// Patterns that indicate a factory limited-edition variant (production < ~2000 units).
// 'Carrera 4S Cabriolet' and similar mainstream trims must NOT match.
const LIMITED_PATTERNS: RegExp[] = [
  /\bsport[\s-]?classic\b/i,
  /\banniversary\b/i,
  /\b911[\s-]R\b/i,           // "911 R" — factory limited; excludes "RS", "Carrera"
  /\bspeedster\b/i,
  /\bdakar\b/i,
  /\bclub[\s-]?sport\b/i,
  /\bsalzburg\b/i,
  /\bheritage[\s-]?design\b/i,
  /\bheritage[\s-]?edition\b/i,
]

/**
 * Derive trim_category from listing text. Checks trim and optional title.
 * Returns 'coachbuilt' | 'limited' | null.
 * Coachbuilt is evaluated first — a Singer Sport Classic is coachbuilt, not limited.
 */
export function deriveTrimCategory(
  trim: string | null,
  title?: string | null,
): 'coachbuilt' | 'limited' | null {
  const text = [trim, title].filter(Boolean).join(' ')
  if (!text) return null
  if (COACHBUILT_PATTERNS.some(p => p.test(text))) return 'coachbuilt'
  if (LIMITED_PATTERNS.some(p => p.test(text))) return 'limited'
  return null
}

// Columns added by migrations not yet reflected in generated types.
// Re-run `npx supabase gen types typescript --linked > lib/supabase/types.ts` after applying
// all pending migrations to remove these extensions.
export type ListingInsert = BaseInsert & {
  estimate_low_cents?: number | null;
  estimate_high_cents?: number | null;
  lot_number?: string | null;
  data_source?: string | null;
};

export function normalizeToInsert(raw: RawListing): ListingInsert {
  return {
    source_platform: raw.source_platform,
    source_listing_id: raw.source_listing_id,
    source_url: raw.source_url,
    year: raw.year,
    make: raw.make,
    model: raw.model,
    trim: raw.trim ?? undefined,
    trim_category: deriveTrimCategory(raw.trim, raw.title) ?? undefined,
    listing_status: raw.listing_status,
    final_price: raw.final_price_cents ?? null,
    currency: raw.currency,
    estimate_low_cents: raw.estimate_low_cents,
    estimate_high_cents: raw.estimate_high_cents,
    lot_number: raw.lot_number,
    mileage: raw.mileage ?? undefined,
    mileage_unit: 'mi',
    exterior_color: raw.exterior_color ?? undefined,
    interior_color: raw.interior_color ?? undefined,
    transmission: raw.transmission ?? undefined,
    vin_hash_partial: raw.vin_hash_partial ?? undefined,
    has_no_reserve: raw.has_no_reserve,
    auction_ends_at: raw.auction_ends_at ?? undefined,
    country_of_sale: raw.country_of_sale ?? undefined,
  };
}
