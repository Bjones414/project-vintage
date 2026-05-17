import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

// Creates a service-role Supabase client for use in middleware (Edge runtime).
// No-op cookie handlers are intentional — middleware manages cookies separately
// via updateSession. This client bypasses RLS; import only in server-side files.
// Env var SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix and is never
// bundled to the client.
export function createServiceRoleClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}
