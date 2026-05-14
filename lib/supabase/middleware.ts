import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — must not use supabase client between createServerClient and getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lazy alpha expiration: on every authenticated request, check whether an alpha
  // account's access window has closed and downgrade it to 'free' if so.
  // The downgrade is triggered only by a direct user action (this request), never
  // by a background job or cron. Gracefully degrades on any DB error.
  //
  // Performance note: this adds one DB SELECT (and occasionally one UPDATE) per
  // authenticated request. Acceptable for a 5-user alpha. Future optimization:
  // store account_type in Supabase app_metadata so it travels with the JWT,
  // eliminating the SELECT. The UPDATE would still need to call
  // supabase.auth.admin.updateUserById to sync app_metadata on downgrade.
  if (user) {
    try {
      const { data: profile } = await supabase
        .from("users")
        .select("account_type, alpha_expires_at")
        .eq("id", user.id)
        .single();

      if (
        profile?.account_type === "alpha" &&
        profile.alpha_expires_at !== null &&
        new Date() > new Date(profile.alpha_expires_at)
      ) {
        // Downgrade requires service role — account_type is write-protected from
        // the user's own session key.
        const supabaseAdmin = createServerClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { cookies: { getAll: () => [], setAll: () => {} } }
        );

        await supabaseAdmin
          .from("users")
          .update({ account_type: "free" })
          .eq("id", user.id);
      }
    } catch {
      // Let the request through — downgrade will be retried on the next request
    }
  }

  return supabaseResponse;
}
