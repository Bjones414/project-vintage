import { parseBaTListing } from './bring-a-trailer'
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
