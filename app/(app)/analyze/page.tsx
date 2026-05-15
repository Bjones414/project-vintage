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
    <main className="min-h-screen bg-bg-canvas">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 28px' }}>
        <h1
          className="font-serif font-normal text-text-primary"
          style={{ fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 12 }}
        >
          Know what you&rsquo;re bidding on.
        </h1>
        <p
          className="font-serif italic text-text-secondary"
          style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 640 }}
        >
          Paste any auction listing URL below. You&rsquo;ll get comparables, a fair-value
          verdict, and condition flags in about 15 seconds.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 640 }}>
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
