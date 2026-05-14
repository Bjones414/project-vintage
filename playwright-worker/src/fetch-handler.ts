/**
 * SAFETY PRINCIPLE: This worker only fetches when called by the main Vercel app
 * in response to a direct user paste action. There are NO scheduled jobs, NO
 * batch operations, NO background refreshes.
 *
 * Volume scales 1:1 with active user activity. One user paste = one Playwright fetch.
 *
 * If you ever consider adding:
 *   - A queue that processes URLs in the background → STOP, that's automation
 *   - A cron job that refreshes anything → STOP, that's automation
 *   - A retry loop that fires multiple Playwright loads → STOP, that's automation
 *   - Parallel batch fetches across many URLs → STOP, that's a scraping pattern
 *
 * The whole point of this architecture is plausible deniability: this worker's
 * traffic is indistinguishable from one user manually browsing the source site.
 */

import { browserPool } from './lib/browser-pool'
import { parseCarsAndBidsHtml } from './parsers/cars-and-bids'
import type { ParsedListing } from './parsers/cars-and-bids'

const SUPPORTED_SOURCES = ['cars-and-bids'] as const
type SupportedSource = (typeof SUPPORTED_SOURCES)[number]

// Random jitter between min and max ms — makes render wait less mechanical.
function jitter(minMs: number, maxMs: number): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const CLOUDFLARE_SIGNALS = [
  'just a moment',
  'checking your browser',
  'attention required',
  'please wait',
  'cf-browser-verification',
  'enable javascript and cookies',
]

function isCloudflareChallenge(title: string, html: string): boolean {
  const titleLower = title.toLowerCase()
  const htmlLower = html.toLowerCase()
  return (
    CLOUDFLARE_SIGNALS.some((s) => titleLower.includes(s)) ||
    (htmlLower.includes('cf-challenge') && htmlLower.includes('cf-spinner'))
  )
}

export type WorkerResponse =
  | { status: 'success'; data: ParsedListing }
  | { status: 'blocked'; reason: 'cloudflare_challenge'; message: string }
  | { status: 'timeout'; reason: 'fetch_timeout'; message: string }
  | { status: 'parse_error'; reason: 'missing_required_fields'; message: string; details: string }
  | { status: 'unsupported'; reason: 'no_parser_for_source'; message: string }

export async function handleFetch(url: string, source: string): Promise<WorkerResponse> {
  if (!(SUPPORTED_SOURCES as readonly string[]).includes(source)) {
    return {
      status: 'unsupported',
      reason: 'no_parser_for_source',
      message: `This source is not supported by the worker.`,
    }
  }

  const typedSource = source as SupportedSource
  let context = null

  try {
    context = await browserPool.newContext()
    const page = await context.newPage()

    // Navigate with 30-second timeout.
    let navigationResponse = null
    try {
      navigationResponse = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('timeout')) {
        return {
          status: 'timeout',
          reason: 'fetch_timeout',
          message: 'The source site took too long to respond.',
        }
      }
      throw err
    }

    // Immediate 403 check.
    if (navigationResponse && navigationResponse.status() === 403) {
      return {
        status: 'blocked',
        reason: 'cloudflare_challenge',
        message: 'The source site is temporarily blocking automated access.',
      }
    }

    // Wait for SPA hydration: 8–12 seconds of jitter.
    await jitter(8_000, 12_000)

    const pageTitle = await page.title()
    const html = await page.content()

    // Cloudflare interstitial check.
    if (isCloudflareChallenge(pageTitle, html)) {
      return {
        status: 'blocked',
        reason: 'cloudflare_challenge',
        message: 'The source site is temporarily blocking automated access.',
      }
    }

    // Route to parser.
    let parsed: ParsedListing | null = null
    if (typedSource === 'cars-and-bids') {
      parsed = parseCarsAndBidsHtml(html, url)
    }

    if (!parsed) {
      return {
        status: 'parse_error',
        reason: 'missing_required_fields',
        message: 'Could not extract listing data from this page.',
        details: 'Parser returned null — page structure may have changed.',
      }
    }

    // Require at minimum year and either a price or a status signal.
    if (!parsed.year && !parsed.sold_price_cents && parsed.listing_status === 'unknown') {
      return {
        status: 'parse_error',
        reason: 'missing_required_fields',
        message: 'Could not extract listing data from this page.',
        details: 'Year and price not found in rendered HTML.',
      }
    }

    return { status: 'success', data: parsed }
  } finally {
    if (context) {
      await context.close().catch(() => { /* swallow — browser may have already closed */ })
    }
  }
}
