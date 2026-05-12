'use client'

import { useEffect, useState } from 'react'

interface Props {
  decades: string[]
}

export function DecadeNav({ decades }: Props) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const intersecting = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id)
          else intersecting.delete(entry.target.id)
        }
        const found = decades.find((d) => intersecting.has(d))
        setActive(found ?? null)
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    )

    for (const decade of decades) {
      const el = document.getElementById(decade)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [decades])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div
      className="sticky top-0 z-10 border-b-[0.5px] border-t-[0.5px] border-border-default bg-bg-elevated"
      style={{ padding: '16px 28px' }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-center">
        {decades.map((decade, i) => (
          <span key={decade} className="flex items-center">
            {i > 0 && (
              <span
                className="select-none font-serif text-[12px] text-accent-secondary"
                style={{ margin: '0 14px' }}
                aria-hidden="true"
              >
                ·
              </span>
            )}
            <a
              href={`#${decade}`}
              onClick={(e) => handleClick(e, decade)}
              className={[
                "relative whitespace-nowrap py-[4px] font-serif text-[13px] font-medium uppercase tracking-[0.18em]",
                active === decade
                  ? "text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-accent-primary after:content-['']"
                  : 'text-accent-primary hover:opacity-60',
              ].join(' ')}
            >
              {decade}
            </a>
          </span>
        ))}
      </div>
    </div>
  )
}
