export interface RawListing {
  source_platform: string;
  source_listing_id: string;
  source_url: string;
  title?: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  listing_status: 'sold' | 'no-sale' | 'live' | 'unknown';
  final_price_cents: number | null;
  currency: string;
  estimate_low_cents: number | null;
  estimate_high_cents: number | null;
  lot_number: string | null;
  mileage: number | null;
  exterior_color: string | null;
  interior_color: string | null;
  transmission: string | null;
  vin_hash_partial: string | null;
  image_url: string | null;
  auction_ends_at: string | null;
  country_of_sale: string | null;
  has_no_reserve: boolean;
}
