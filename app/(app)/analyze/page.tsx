'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeUrl } from '@/lib/analyze-url'
import { AnalyzeLoadingState } from '@/components/analyze/AnalyzeLoadingState'

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loadingPromise, setLoadingPromise] = useState<Promise<string> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const urlRef = useRef(url)
  urlRef.current = url

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const promise = analyzeUrl(urlRef.current.trim())
    setLoadingPromise(promise)
  }

  function handleSuccess(listingId: string) {
    router.replace(`/analyze/${listingId}`)
  }

  function handleError(err: Error) {
    setError(err.message || 'Network error — check your connection and try again')
    setLoadingPromise(null)
  }

  if (loadingPromise) {
    return (
      <AnalyzeLoadingState
        promise={loadingPromise}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    )
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
          className="self-start rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white"
        >
          Analyze
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
