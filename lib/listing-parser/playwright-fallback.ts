import type { CanonicalListing, SourcePlatform } from './types'

const WORKER_TIMEOUT_MS = 35_000  // 5s more than the worker's own 30s timeout

// WorkerResponse shapes mirroring playwright-worker/src/fetch-handler.ts
type WorkerSuccess = {
  status: 'success'
  data: Omit<CanonicalListing, 'seller_info' | 'modification_notes' | 'raw_data'>
}
type WorkerBlocked = { status: 'blocked'; reason: string; message: string }
type WorkerTimeout = { status: 'timeout'; reason: string; message: string }
type WorkerParseError = { status: 'parse_error'; reason: string; message: string; details?: string }
type WorkerUnsupported = { status: 'unsupported'; reason: string; message: string }
type WorkerResponse = WorkerSuccess | WorkerBlocked | WorkerTimeout | WorkerParseError | WorkerUnsupported

export class PlaywrightWorkerError extends Error {
  constructor(
    message: string,
    public readonly status: string,
    public readonly reason: string,
    public readonly userMessage: string,
  ) {
    super(message)
    this.name = 'PlaywrightWorkerError'
  }
}

/**
 * Calls the Railway Playwright worker to render and parse a listing URL.
 *
 * @param url - The full auction listing URL (e.g. https://carsandbids.com/auctions/…)
 * @param source - Parser identifier matching SUPPORTED_SOURCES in the worker
 * @returns Parsed CanonicalListing on success
 * @throws PlaywrightWorkerError on any non-success response or network failure
 *
 * DO NOT call this from background jobs. Only call in response to a user paste action.
 */
export async function callPlaywrightWorker(
  url: string,
  source: SourcePlatform,
): Promise<CanonicalListing> {
  const workerUrl = process.env.PLAYWRIGHT_WORKER_URL
  const workerSecret = process.env.PLAYWRIGHT_WORKER_SECRET

  if (!workerUrl || !workerSecret) {
    throw new PlaywrightWorkerError(
      'Playwright worker is not configured',
      'config_error',
      'worker_not_configured',
      'This listing type requires a service that is not currently set up.',
    )
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), WORKER_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${workerUrl}/fetch`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Worker-Secret': workerSecret,
      },
      body: JSON.stringify({ url, source }),
    })
  } catch (err) {
    clearTimeout(timeoutId)
    const msg = err instanceof Error ? err.message : String(err)
    throw new PlaywrightWorkerError(
      `Playwright worker network error: ${msg}`,
      'network_error',
      'worker_unreachable',
      'Could not reach the listing fetch service. Please try again.',
    )
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 401) {
    throw new PlaywrightWorkerError(
      'Playwright worker auth failure — check PLAYWRIGHT_WORKER_SECRET',
      'auth_error',
      'worker_auth_failed',
      'Could not authenticate with the listing fetch service.',
    )
  }

  let body: WorkerResponse
  try {
    body = (await response.json()) as WorkerResponse
  } catch {
    throw new PlaywrightWorkerError(
      'Playwright worker returned unparseable response',
      'parse_error',
      'invalid_response',
      'The listing fetch service returned an unexpected response.',
    )
  }

  if (body.status === 'success') {
    // Re-attach fields the worker doesn't track.
    return {
      ...body.data,
      seller_info: null,
      modification_notes: null,
      raw_data: {},
      // Engine may be absent in some sources; default to null.
      engine: (body.data as CanonicalListing & { engine?: string | null }).engine ?? null,
    } as CanonicalListing
  }

  const userMessages: Record<string, string> = {
    cloudflare_challenge: 'This listing site is temporarily blocking lookups. Try again in a few minutes.',
    fetch_timeout: 'The listing page took too long to load. Try again shortly.',
    missing_required_fields: 'Could not extract listing data from this page. The page layout may have changed.',
    no_parser_for_source: 'This auction source is not yet supported for automatic lookup.',
  }

  const userMessage = userMessages[body.reason] ?? 'Something went wrong fetching this listing. Please try again.'

  throw new PlaywrightWorkerError(
    `Playwright worker returned status "${body.status}" (${body.reason})`,
    body.status,
    body.reason,
    userMessage,
  )
}
