// Scraper orchestrator: runs all enabled scrapers, handles deduplication, upserts to Supabase.
// Triggered by POST /api/cron/scrape on a Vercel Cron schedule.
// Errors are reported to Sentry with structured context (platform, listing URL, job run ID).
// Stub — implement when building scrapers.
