'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeUrl } from '@/lib/analyze-url'
import { AnalyzeLoadingState } from '@/components/analyze/AnalyzeLoadingState'

export function AnalyzeLandingForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loadingPromise, setLoadingPromise] = useState<Promise<string> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const urlRef = useRef(url)
  urlRef.current = url

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = urlRef.current.trim()
    if (!trimmed) {
      setError('Paste a listing URL to get started.')
      return
    }
    const promise = analyzeUrl(trimmed)
    setLoadingPromise(promise)
  }

  function handleSuccess(listingId: string) {
    router.push(`/analyze/${listingId}`)
  }

  function handleError(err: Error) {
    setError(err.message || 'Network error — check your connection and try again.')
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
    <div className="mx-auto max-w-[640px]">
      <form onSubmit={handleSubmit}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: '1fr auto',
            border: '0.5px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null) }}
            placeholder="https://bringatrailer.com/listing/…"
            className="bg-transparent px-[22px] py-[18px] font-mono text-[15px] tracking-[0.04em] text-text-primary placeholder:font-serif placeholder:text-[15px] placeholder:italic placeholder:text-text-muted focus:outline-none"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
            aria-label="Listing URL"
          />
          <button
            type="submit"
            className="border-l-[0.5px] border-border-default bg-text-primary px-[30px] font-sans text-[13px] font-medium uppercase tracking-[0.04em] text-bg-canvas"
          >
            Analyze →
          </button>
        </div>
      </form>
      {error && (
        <p className="mt-2 font-sans text-[12px] text-severity-concern">{error}</p>
      )}
      <p className="mt-[14px] text-center font-sans text-[11px] tracking-[0.04em] text-text-quaternary">
        Supported: Bring a Trailer · Cars &amp; Bids · RM Sotheby&apos;s · Hagerty
      </p>
    </div>
  )
}
