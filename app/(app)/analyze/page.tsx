'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeUrl, AnalyzeError } from '@/lib/analyze-url'
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
    const trimmed = urlRef.current.trim()
    if (!trimmed) return
    setLoadingPromise(analyzeUrl(trimmed))
  }

  function handleSuccess(listingId: string) {
    router.push(`/analyze/${listingId}`)
    setLoadingPromise(null)
  }

  function handleError(err: Error) {
    setLoadingPromise(null)
    if (err instanceof AnalyzeError && err.status === 422) {
      router.push('/research?parse_failed=1')
    } else {
      setError(err.message || 'Network error — check your connection and try again')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[640px]">
        <h1 className="mb-4 text-center font-serif text-h1 text-text-primary">
          Know what you&rsquo;re bidding on.
        </h1>
        <p className="mx-auto mb-8 max-w-[580px] text-balance text-center font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
          Paste any auction listing URL below. You&rsquo;ll get comparables, a fair-value
          verdict, and condition flags in about 15 seconds.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null) }}
            placeholder="Paste a listing URL →"
            className="flex-1 border-[0.5px] border-border-default bg-bg-canvas px-[18px] py-[11px] font-serif text-[13px] italic text-text-tertiary placeholder:text-text-tertiary focus:border-accent-primary focus:outline-none"
          />
          <button
            type="submit"
            className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] bg-text-primary text-bg-canvas px-6 py-[11px] hover:opacity-90 transition-opacity"
          >
            Analyze
          </button>
        </form>
        {error && (
          <p className="mt-2 font-sans text-xs text-severity-concern">{error}</p>
        )}
      </div>
      {loadingPromise && (
        <AnalyzeLoadingState
          promise={loadingPromise}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </main>
  )
}
