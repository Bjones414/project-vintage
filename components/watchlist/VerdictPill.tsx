import type { VerdictPillState } from '@/lib/watchlist/state'

interface PillConfig {
  copy: string
  bg: string
  color: string
  isItalicSerif?: boolean
}

const PILL_CONFIG: Record<VerdictPillState, PillConfig> = {
  'tracking-fair': { copy: 'Tracking fair',     bg: '#E1E8DC', color: '#3D5A40' },
  'tracking-high': { copy: 'Tracking high',     bg: '#EFD9D2', color: '#8C3A28' },
  'too-early':     { copy: 'Too early to call', bg: 'var(--bg-elevated)', color: 'var(--text-tertiary)' },
  'sold-above':    { copy: 'Sold strong',       bg: '#EFD9D2', color: '#8C3A28' },
  'sold-below':    { copy: 'Sold below',        bg: '#E1E8DC', color: '#3D5A40' },
  'sold-fair':     { copy: 'Sold fair',         bg: 'var(--bg-elevated)', color: 'var(--text-tertiary)' },
  'no-sale':       { copy: 'No sale',           bg: 'var(--bg-elevated)', color: 'var(--text-tertiary)', isItalicSerif: true },
}

interface Props {
  state: VerdictPillState
  // For no-sale rows: the high bid at auction close, pre-formatted (e.g. "$107,000").
  // When provided, the pill reads "Bid to $X (no sale)" instead of "No sale".
  noSaleBidFormatted?: string
}

export function VerdictPill({ state, noSaleBidFormatted }: Props) {
  const { bg, color, isItalicSerif } = PILL_CONFIG[state]
  const copy = state === 'no-sale' && noSaleBidFormatted
    ? `Bid to ${noSaleBidFormatted} (no sale)`
    : PILL_CONFIG[state].copy

  return (
    <span
      className={
        isItalicSerif
          ? 'inline-block rounded-[2px] px-[12px] py-[6px] font-serif text-[10px] italic'
          : 'inline-block rounded-[2px] px-[12px] py-[6px] font-sans text-[10px] uppercase tracking-[0.06em]'
      }
      style={{ backgroundColor: bg, color }}
    >
      {copy}
    </span>
  )
}
