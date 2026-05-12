'use client'

import { useState } from 'react'
import type { WatchForItem } from '@/lib/era-content/generation-content'

interface Props {
  items: WatchForItem[]
}

const PILL = {
  concern: {
    label: 'HIGH',
    text: 'text-[#A32D2D]',
    bg: 'bg-[#A32D2D]/10',
    border: 'border-[#A32D2D]/40',
  },
  caution: {
    label: 'MEDIUM',
    text: 'text-[#BA7517]',
    bg: 'bg-[#BA7517]/10',
    border: 'border-[#BA7517]/40',
  },
} as const

function WatchForRow({ item }: { item: WatchForItem }) {
  const [open, setOpen] = useState(false)
  const pill = PILL[item.severity] ?? PILL.caution

  return (
    <div className="border-b-[0.5px] border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className={`mt-[2px] shrink-0 inline-flex items-center border-[0.5px] px-[7px] py-[3px] font-sans text-[8.5px] tracking-[0.14em] ${pill.bg} ${pill.text} ${pill.border}`}
        >
          {pill.label}
        </span>
        <span className="flex-1 font-serif text-[15px] leading-[1.3] text-text-primary">
          {item.title}
        </span>
        <span
          className="ml-3 shrink-0 font-serif text-[18px] leading-none text-text-quaternary"
          aria-hidden="true"
        >
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="pb-6 pl-[calc(52px_+_1rem)] pr-2">
          <p className="font-sans text-[13px] leading-[1.65] text-text-secondary">{item.body}</p>
          <div className="mt-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
              Ask the seller
            </p>
            <p className="mt-1 font-sans text-[12px] italic leading-relaxed text-text-tertiary">
              {item.buyer_question}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function WatchForSection({ items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <WatchForRow key={item.title} item={item} />
      ))}
    </div>
  )
}
