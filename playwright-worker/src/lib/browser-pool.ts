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

import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import type { Browser, BrowserContext } from 'playwright'
import { randomUserAgent } from './user-agents'

// Apply stealth plugin once at module load.
chromium.use(StealthPlugin())

const HEADLESS = process.env.PLAYWRIGHT_HEADLESS !== 'false'

class BrowserPool {
  private browser: Browser | null = null
  private launching = false
  private launchQueue: Array<() => void> = []

  async getBrowser(): Promise<Browser> {
    if (this.browser) return this.browser

    if (this.launching) {
      await new Promise<void>((resolve) => this.launchQueue.push(resolve))
      return this.browser!
    }

    this.launching = true
    try {
      console.log('[browser-pool] launching Chromium...')
      this.browser = await chromium.launch({
        headless: HEADLESS,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      }) as unknown as Browser

      this.browser.on('disconnected', () => {
        console.warn('[browser-pool] browser disconnected — will relaunch on next request')
        this.browser = null
        this.launching = false
      })

      console.log('[browser-pool] Chromium ready')
    } finally {
      this.launching = false
      for (const resolve of this.launchQueue) resolve()
      this.launchQueue = []
    }

    return this.browser!
  }

  async newContext(): Promise<BrowserContext> {
    const browser = await this.getBrowser()
    const ua = randomUserAgent()

    const context = await browser.newContext({
      userAgent: ua,
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/Denver',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      },
    })

    return context
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  isRunning(): boolean {
    return this.browser !== null && this.browser.isConnected()
  }
}

export const browserPool = new BrowserPool()
