'use client'

import { useState } from 'react'
import type { Tables } from '@/lib/supabase/types'
import { PLATFORM_NAMES } from '@/lib/utils/platforms'
import type { ViewerTier } from './types'
import { SignupModal } from './SignupModal'

type Props = {
  listing: Tables<'listings'>
  viewerTier: ViewerTier
}

export function ActionRow({ listing, viewerTier }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  const platformName =
    PLATFORM_NAMES[listing.source_platform] ?? listing.source_platform

  function handleWatchClick() {
    if (viewerTier === 'anonymous') {
      setModalOpen(true)
      return
    }
    // TODO: persist watch for authenticated members
  }

  function handleSaveClick() {
    if (viewerTier === 'anonymous') {
      setModalOpen(true)
      return
    }
    // TODO: persist save-analysis for authenticated members
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-[10px] border-t-[0.5px] border-border-default pt-5">
        <a
          href={listing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-button bg-text-primary px-5 py-[10px] font-sans text-[13px] font-medium tracking-[0.02em] text-bg-canvas hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
        >
          View on {platformName} ↗
        </a>
        <button
          type="button"
          onClick={handleWatchClick}
          className="inline-flex items-center rounded-button border-[0.5px] border-text-primary bg-transparent px-5 py-[10px] font-sans text-[13px] font-medium tracking-[0.02em] text-text-primary hover:bg-bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
        >
          Watch this car
        </button>
        <button
          type="button"
          onClick={handleSaveClick}
          className="inline-flex items-center rounded-button border-[0.5px] border-text-primary bg-transparent px-5 py-[10px] font-sans text-[13px] font-medium tracking-[0.02em] text-text-primary hover:bg-bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
        >
          Save analysis
        </button>
      </div>
      <SignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
