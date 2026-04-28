// TODO Phase 4+: implement
import { PlatformNotSupportedError } from './types'
import type { CanonicalListing } from './types'

export async function parseRmSothebysListing(_url: string): Promise<CanonicalListing> {
  throw new PlatformNotSupportedError('rm-sothebys')
}
