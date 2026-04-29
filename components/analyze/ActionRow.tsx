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
      <div className="flex flex-wrap gap-3">
        <a
          href={listing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          View on {platformName}
        </a>
        <button
          type="button"
          onClick={handleWatchClick}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          Watch this car
        </button>
        <button
          type="button"
          onClick={handleSaveClick}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          Save analysis
        </button>
      </div>
      <SignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
