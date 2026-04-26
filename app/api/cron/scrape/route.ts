// POST /api/cron/scrape
// Vercel Cron endpoint that triggers the scraper runner.
// Must validate the CRON_SECRET header to prevent unauthorized invocations.
// Scrapers run as isolated jobs in scrapers/runner.ts — this is just the entry point.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
