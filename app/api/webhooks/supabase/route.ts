// POST /api/webhooks/supabase
// Handles Supabase database webhook events (e.g., new user created in auth.users →
// insert into public.users profile table).
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
