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

import 'dotenv/config'
import express from 'express'
import { authMiddleware } from './middleware/auth'
import { handleFetch } from './fetch-handler'
import { browserPool } from './lib/browser-pool'

const PORT = parseInt(process.env.PORT ?? '3000', 10)

const app = express()
app.use(express.json())

// Health check — unauthenticated so Railway can probe it.
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    browser: browserPool.isRunning() ? 'running' : 'restarting',
  })
})

// Fetch endpoint — requires auth on all POST routes.
app.use(authMiddleware)

app.post('/fetch', async (req, res) => {
  const { url, source } = req.body as { url?: unknown; source?: unknown }

  if (typeof url !== 'string' || !url.startsWith('http')) {
    res.status(400).json({ error: 'Invalid or missing url field' })
    return
  }
  if (typeof source !== 'string') {
    res.status(400).json({ error: 'Invalid or missing source field' })
    return
  }

  console.log(`[fetch] ${source} → ${url}`)

  try {
    const result = await handleFetch(url, source)
    res.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[fetch] unhandled error:', message)
    res.json({
      status: 'parse_error',
      reason: 'missing_required_fields',
      message: 'An unexpected error occurred while processing the page.',
      details: message,
    })
  }
})

// Pre-warm browser on startup so the first request doesn't pay the launch cost.
browserPool.getBrowser().catch((err) => {
  console.error('[startup] Failed to pre-warm browser:', err)
})

app.listen(PORT, () => {
  console.log(`[playwright-worker] listening on port ${PORT}`)
})

// Graceful shutdown.
process.on('SIGTERM', async () => {
  console.log('[playwright-worker] SIGTERM received — shutting down')
  await browserPool.close()
  process.exit(0)
})
