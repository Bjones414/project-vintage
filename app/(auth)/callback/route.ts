// Placeholder: Supabase Auth OAuth callback handler.
// Exchanges the code from Supabase for a session and redirects the user.
// See: https://supabase.com/docs/guides/auth/server-side/nextjs
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // TODO: implement code exchange via createServerClient
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/dashboard";
  return NextResponse.redirect(new URL(next, request.url));
}
