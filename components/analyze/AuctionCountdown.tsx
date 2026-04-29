'use client'

import { useState, useEffect, useRef } from 'react'
import { formatAuctionEndTime } from '@/lib/utils/date'

export type AuctionCountdownProps = {
  endsAt: string | null
  listingId: string
}

type DisplayState =
  | { type: 'unavailable' }
  | { type: 'static'; text: string }
  | { type: 'live'; text: string; urgent: boolean }
  | { type: 'verifying' }
  | { type: 'ended' }

type RefreshResponseBody = {
  refreshed: boolean
  listing?: { listing_status: string; auction_ends_at: string | null } | null
  reason?: string
}

export function buildDisplay(endsAt: string, now: number): DisplayState {
  const target = new Date(endsAt).getTime()
  const diff = target - now

  if (diff <= 0) return { type: 'verifying' }
  if (diff > 24 * 3600 * 1000) return { type: 'static', text: formatAuctionEndTime(endsAt) }

  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (diff > 3600 * 1000) {
    return { type: 'live', text: `Ends in ${hours}h ${minutes}m`, urgent: false }
  }
  if (diff > 60 * 1000) {
    const totalMins = Math.floor(totalSeconds / 60)
    return { type: 'live', text: `Ends in ${totalMins}m ${seconds}s`, urgent: false }
  }
  return { type: 'live', text: `Ends in ${totalSeconds}s`, urgent: true }
}

function nextTickMs(diffMs: number): number | null {
  if (diffMs <= 0 || diffMs > 24 * 3600 * 1000) return null
  return diffMs > 3600 * 1000 ? 60_000 : 1_000
}

async function fetchVerify(
  listingId: string,
  currentTargetMs: number,
): Promise<{ kind: 'extension'; newEndsAt: string } | { kind: 'ended' }> {
  try {
    const res = await fetch(`/api/listings/${listingId}/refresh-status`, { method: 'POST' })
    if (!res.ok) return { kind: 'ended' }
    const body = (await res.json()) as RefreshResponseBody
    const newEndsAt = body.listing?.auction_ends_at
    if (body.refreshed && newEndsAt && new Date(newEndsAt).getTime() > currentTargetMs) {
      return { kind: 'extension', newEndsAt }
    }
    return { kind: 'ended' }
  } catch {
    console.error('[AuctionCountdown] refresh-status fetch failed')
    return { kind: 'ended' }
  }
}

export function AuctionCountdown({ endsAt, listingId }: AuctionCountdownProps) {
  // SSR-safe: initial state is always the static formatted string to avoid hydration mismatch.
  // useEffect updates to live display after mount.
  const [display, setDisplay] = useState<DisplayState>(() => {
    if (!endsAt) return { type: 'unavailable' }
    return { type: 'static', text: formatAuctionEndTime(endsAt) }
  })

  const targetRef = useRef<string | null>(endsAt)
  const verifyFiredRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!endsAt) return

    targetRef.current = endsAt
    verifyFiredRef.current = false

    function schedule(delayMs: number) {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(tick, delayMs)
    }

    function tick() {
      const currentTarget = targetRef.current
      if (!currentTarget) return

      const now = Date.now()
      const diff = new Date(currentTarget).getTime() - now
      const nextDisplay = buildDisplay(currentTarget, now)
      setDisplay(nextDisplay)

      if (nextDisplay.type === 'verifying') {
        if (!verifyFiredRef.current) {
          verifyFiredRef.current = true
          void fetchVerify(listingId, new Date(currentTarget).getTime()).then((result) => {
            if (result.kind === 'extension') {
              targetRef.current = result.newEndsAt
              verifyFiredRef.current = false
              const newNow = Date.now()
              const newDiff = new Date(result.newEndsAt).getTime() - newNow
              setDisplay(buildDisplay(result.newEndsAt, newNow))
              const delay = nextTickMs(newDiff)
              if (delay !== null) schedule(delay)
            } else {
              setDisplay({ type: 'ended' })
            }
          })
        }
        return
      }

      const delay = nextTickMs(diff)
      if (delay !== null) schedule(delay)
    }

    tick()

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [endsAt, listingId])

  switch (display.type) {
    case 'unavailable':
      return <span className="text-sm text-gray-500">Auction end time unavailable</span>
    case 'verifying':
      return <span className="text-sm italic text-gray-500">Verifying final result…</span>
    case 'ended':
      return <span className="text-sm font-medium text-gray-700">Auction ended</span>
    case 'live':
      return display.urgent ? (
        <span className="text-sm font-bold text-amber-600">{display.text}</span>
      ) : (
        <span className="text-sm text-gray-700">{display.text}</span>
      )
    case 'static':
      return <span className="text-sm text-gray-700">{display.text}</span>
  }
}
