'use client'

import { useEffect, useState } from 'react'
import type React from 'react'

export interface StickyNavLink {
  label: string
  href: string
}

interface Props {
  links: StickyNavLink[]
  heroSentinelId?: string
}

export function StickyNav({ links, heroSentinelId }: Props) {
  const [activeHref, setActiveHref] = useState<string | null>(null)
  // Default visible when no sentinel provided (backward-compat usage outside analyze page)
  const [visible, setVisible] = useState(!heroSentinelId)

  // Show nav only after the hero scrolls out of view
  useEffect(() => {
    if (!heroSentinelId) return
    const sentinel = document.getElementById(heroSentinelId)
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [heroSentinelId])

  // Track which section is in view
  useEffect(() => {
    const sectionIds = links.map((l) => l.href.slice(1))
    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id)
          } else {
            intersecting.delete(entry.target.id)
          }
        }
        const active = sectionIds.find((id) => intersecting.has(id))
        setActiveHref(active ? `#${active}` : null)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [links])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(href.slice(1))?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div
      className={`sticky top-0 z-30 border-b-[0.5px] border-border-default bg-bg-elevated transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-6 py-3 sm:px-8 lg:px-10">
        {links.map((link, i) => (
          <span key={link.href} className="flex shrink-0 items-center">
            {i > 0 && (
              <span
                className="mx-3 select-none font-serif text-[10px] leading-none text-[#B4B2A9]"
                aria-hidden="true"
              >
                ·
              </span>
            )}
            <a
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`whitespace-nowrap border-b-[1.5px] pb-[3px] font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary hover:opacity-60 ${
                activeHref === link.href ? 'border-accent-primary' : 'border-transparent'
              }`}
            >
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  )
}
