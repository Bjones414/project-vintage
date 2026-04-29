'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeUrl } from '@/lib/analyze-url'

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const listingId = await analyzeUrl(url)
      // Keep loading=true — the redirect fires now and the component unmounts.
      router.replace(`/analyze/${listingId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error — check your connection and try again')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Analyze a Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="listing-url" className="text-sm font-medium text-gray-700">
            Paste an auction URL
          </label>
          <input
            id="listing-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://bringatrailer.com/listing/..."
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
