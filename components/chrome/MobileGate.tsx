'use client'

import { useEffect, useState } from 'react'
import { PVMark } from '@/components/brand/PVMark'

export function MobileGate() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (!isMobile) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-canvas px-8 text-center">
      <div className="mb-6 text-text-tertiary">
        <PVMark size={40} />
      </div>
      <h1 className="mb-3 font-serif text-[30px] font-normal leading-[1.2] tracking-[-0.01em] text-text-primary">
        Best experienced on desktop.
      </h1>
      <p className="font-serif text-base italic text-text-tertiary">
        Mobile coming soon.
      </p>
    </div>
  )
}
