// In-memory sliding-window rate limiter keyed by an arbitrary string (typically user_id).
// Resets the window after WINDOW_MS elapses, counting requests within the window.
// Not shared across serverless instances — appropriate for per-user abuse prevention,
// not for hard distributed quotas.

type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()
const WINDOW_MS = 1_000 // 1 second
const MAX = 5            // requests per window

export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = windows.get(key)

  if (!entry || now >= entry.resetAt) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX) return false
  entry.count++
  return true
}
