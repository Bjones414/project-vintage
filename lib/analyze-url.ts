// Client-side fetch helper for the /api/analyze route.
// Separated from the page component so Next.js page type checking
// doesn't flag the non-default export.
export async function analyzeUrl(url: string): Promise<string> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  const data = (await response.json()) as { listingId?: string; error?: string }
  if (!response.ok || !data.listingId) {
    throw new Error(data.error ?? `Request failed with status ${response.status}`)
  }
  return data.listingId
}
