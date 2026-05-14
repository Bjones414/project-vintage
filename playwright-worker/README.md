# playwright-worker

A stateless HTTP service that renders SPA auction pages with a real Chromium browser and returns parsed listing data. Deployed to Railway; called by the Project Vintage Vercel app on demand.

## Architecture

**SAFETY PRINCIPLE:** Every fetch this worker performs is triggered by a direct user paste action in the main app. There are NO scheduled jobs, NO batch operations, NO background refreshes.

Volume scales 1:1 with active user activity. One user paste = one Playwright load. Period.

```
User pastes URL → Vercel app → POST /fetch → Playwright renders page → returns JSON
```

If you ever consider adding:
- A queue that processes URLs in the background → STOP, that's automation
- A cron job that refreshes anything → STOP, that's automation
- A retry loop that fires multiple Playwright loads → STOP, that's automation
- Parallel batch fetches across many URLs → STOP, that's a scraping pattern

The whole point of this architecture is plausible deniability: this worker's traffic is indistinguishable from one user manually browsing the source site.

## Endpoints

### `GET /health`
Unauthenticated. Returns `{ status: "healthy", browser: "running" | "restarting" }`. Used by Railway health checks.

### `POST /fetch`
Requires `X-Worker-Secret` header. Body:
```json
{
  "url": "https://carsandbids.com/auctions/abc123-porsche-911",
  "source": "cars-and-bids"
}
```

Returns HTTP 200 always (structured status in body). See `src/fetch-handler.ts` for response shapes.

## Authentication

All `/fetch` requests require the header:
```
X-Worker-Secret: <secret>
```

Both the worker (Railway) and the main app (Vercel) must have the same value for `PLAYWRIGHT_WORKER_SECRET`. Generate one secret and set it in both places.

**Generate a secret:**
```bash
openssl rand -hex 32
```

## Local Development

**1. Install dependencies**
```bash
cd playwright-worker
npm install
npx playwright install chromium
```

**2. Configure environment**
```bash
cp .env.example .env
# Edit .env — set PLAYWRIGHT_WORKER_SECRET to any string for local use
```

**3. Start the worker**
```bash
npm run dev
# Worker starts on http://localhost:3000 with PLAYWRIGHT_HEADLESS=false
# You'll see a Chrome window open for each fetch request
```

**4. Configure the main Vercel app for local use**

In the main project `.env.local`, set:
```
PLAYWRIGHT_WORKER_URL=http://localhost:3000
PLAYWRIGHT_WORKER_SECRET=<same value as in playwright-worker/.env>
```

## Testing Locally

```bash
# Health check (no auth needed)
curl http://localhost:3000/health

# Fetch a listing
curl -X POST http://localhost:3000/fetch \
  -H "Content-Type: application/json" \
  -H "X-Worker-Secret: your-secret-here" \
  -d '{"url":"https://carsandbids.com/auctions/some-listing","source":"cars-and-bids"}'
```

## Deploying to Railway

**1. Connect GitHub repo to Railway**
- Create a new Railway project
- Connect your GitHub repo
- Set the root directory to `playwright-worker/`

**2. Set environment variables in Railway**
| Variable | Value |
|---|---|
| `PLAYWRIGHT_WORKER_SECRET` | Same 64-char hex value set in Vercel |
| `PLAYWRIGHT_HEADLESS` | `true` |
| `PORT` | Set automatically by Railway — do not override |

**3. Deploy**
Railway builds using the Dockerfile automatically. First deploy installs Chromium (takes ~3 minutes). Subsequent deploys are faster if `package.json` hasn't changed.

**4. Note the service URL**
Railway provides a URL like `https://playwright-worker-production-xxxx.up.railway.app`. Set this as `PLAYWRIGHT_WORKER_URL` in Vercel.

**5. Set environment variables in Vercel**
| Variable | Value |
|---|---|
| `PLAYWRIGHT_WORKER_URL` | Railway service URL (no trailing slash) |
| `PLAYWRIGHT_WORKER_SECRET` | Same 64-char hex value as Railway |

**Memory:** Railway allows configuring memory per service. Chromium needs at least 512MB; 1GB is recommended for headless operation under load.

## Wire-up (deferred)

The helper function in the main app lives at `lib/listing-parser/playwright-fallback.ts`. Once the worker is deployed and tested, the analyze route at `app/api/analyze/route.ts` needs to call `callPlaywrightWorker()` when the pasted URL resolves to a Cars & Bids listing.

That wire-up is intentionally left as a follow-up task — deploy and smoke-test the worker first.

## Adding New Sources

1. Create `src/parsers/{source-name}.ts` implementing the same `ParsedListing` interface
2. Add the source name to `SUPPORTED_SOURCES` in `src/fetch-handler.ts`
3. Add a `if (typedSource === '{source-name}')` branch in `handleFetch`
4. Update this README and the main app's `playwright-fallback.ts`
