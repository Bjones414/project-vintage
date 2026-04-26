// POST /api/analyze
// Accepts a listing URL, fetches and parses the listing, runs the comp engine,
// returns a ListingAnalysis. Enforces free-tier rate limit (3/month) server-side
// by counting listing_analyses rows for the user in the current calendar month.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
