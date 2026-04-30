'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { analyzeUrl } from '@/lib/analyze-url'
import { AnalyzeLoadingState } from '@/components/analyze/AnalyzeLoadingState'

export function HeroForm() {
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
    setLoadingPromise(null)
    router.push(`/analyze/${listingId}`)
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
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a listing URL to analyze…"
        className="w-full rounded-button border-[0.5px] border-border-default bg-bg-surface px-[18px] py-[14px] font-sans text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
      />
      {error && (
        <p className="mt-2 font-sans text-xs text-severity-concern">{error}</p>
      )}
      <p className="mt-4 text-center">
        <Link
          href="/analyze/86c5d062-e121-4173-bcfa-1983c058c95c"
          className="font-sans text-[12px] text-text-quaternary hover:underline"
        >
          See a sample report: 1997 Porsche 993 Turbo →
        </Link>
      </p>
    </form>
  )
}
