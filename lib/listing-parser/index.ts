import { parseBaTListing } from './bring-a-trailer'
import { parseBonhamsListing } from './bonhams'
import { parseGoodingListing } from './gooding'
import { PlatformNotSupportedError } from './types'
import type { ListingParseResult } from './types'

export async function parseListing(url: string): Promise<ListingParseResult> {
  try {
    let hostname: string
    try {
      hostname = new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return { success: false, error: `Invalid URL: ${url}` }
    }

    if (hostname === 'bringatrailer.com') {
      const listing = await parseBaTListing(url)
      return { success: true, listing }
    }

    if (/bonhams\.com$/.test(hostname)) {
      const listing = await parseBonhamsListing(url)
      return { success: true, listing }
    }

    if (/goodingco\.com$/.test(hostname)) {
      const listing = await parseGoodingListing(url)
      return { success: true, listing }
    }

    throw new PlatformNotSupportedError(hostname)
  } catch (error) {
    if (error instanceof PlatformNotSupportedError) {
      return { success: false, error: `Platform not yet supported: ${error.platform}` }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
