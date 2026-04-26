// Stripe plan definitions and feature gate helpers.
// Tiers: free ($0), pro ($29/mo), collector ($99/mo) — see CLAUDE.md for full gate matrix.
// Feature gating must always be verified server-side against users.subscription_tier in Supabase.
// Stub — implement when wiring up payments.
