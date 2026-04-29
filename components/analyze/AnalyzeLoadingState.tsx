'use client'

import { useEffect, useRef, useState } from 'react'

const STEPS = [
  'Identifying the listing',
  'Parsing the details',
  'Pulling comparable sales',
  'Generating your analysis',
] as const

// ms at which each step completes (and next becomes active)
const STEP_COMPLETE_AT = [2000, 5000, 9000, 12000] as const

type StepStatus = 'pending' | 'active' | 'complete'

type Props = {
  promise: Promise<string>
  onSuccess: (listingId: string) => void
  onError: (error: Error) => void
}

export function AnalyzeLoadingState({ promise, onSuccess, onError }: Props) {
  const [statuses, setStatuses] = useState<StepStatus[]>([
    'active',
    'pending',
    'pending',
    'pending',
  ])

  // Refs so timer callbacks always see latest values without stale closure issues
  const resolvedId = useRef<string | null>(null)
  const step4Done = useRef(false)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  // Step advancement timers — run once on mount
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < 3; i++) {
      const idx = i
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev] as StepStatus[]
            next[idx] = 'complete'
            next[idx + 1] = 'active'
            return next
          })
        }, STEP_COMPLETE_AT[idx]),
      )
    }

    // Step 4 completes and potentially triggers navigation
    timers.push(
      setTimeout(() => {
        setStatuses((prev) => {
          const next = [...prev] as StepStatus[]
          next[3] = 'complete'
          return next
        })
        step4Done.current = true
        if (resolvedId.current !== null) {
          onSuccessRef.current(resolvedId.current)
        }
      }, STEP_COMPLETE_AT[3]),
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  // Resolve the API promise; navigate only after step 4 has visually completed
  useEffect(() => {
    let cancelled = false
    promise
      .then((listingId) => {
        if (cancelled) return
        resolvedId.current = listingId
        if (step4Done.current) {
          onSuccessRef.current(listingId)
        }
      })
      .catch((err) => {
        if (cancelled) return
        onErrorRef.current(err instanceof Error ? err : new Error(String(err)))
      })
    return () => {
      cancelled = true
    }
  }, [promise])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-8">
        <ol className="flex flex-col gap-6" aria-label="Analysis progress">
          {STEPS.map((label, i) => {
            const status = statuses[i]
            return (
              <li key={label} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm',
                    status === 'complete'
                      ? 'bg-green-100 text-green-700'
                      : status === 'active'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-400',
                  ].join(' ')}
                >
                  {status === 'complete' ? (
                    '✓'
                  ) : status === 'active' ? (
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none"
                      aria-label="active"
                    />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </span>
                <span
                  className={[
                    'text-sm',
                    status === 'complete'
                      ? 'font-medium text-gray-900'
                      : status === 'active'
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
