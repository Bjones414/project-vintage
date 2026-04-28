// TODO Phase 4+: implement via Apify or direct parse
import { PlatformNotSupportedError } from './types'
import type { CanonicalListing } from './types'

export async function parseCaBListing(_url: string): Promise<CanonicalListing> {
  throw new PlatformNotSupportedError('cars-and-bids')
}
