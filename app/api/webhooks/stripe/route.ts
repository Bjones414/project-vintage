// POST /api/webhooks/stripe
// Handles Stripe webhook events: subscription created/updated/deleted,
// payment succeeded/failed. Updates users.subscription_tier and related fields.
// Must verify the Stripe-Signature header before processing.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
