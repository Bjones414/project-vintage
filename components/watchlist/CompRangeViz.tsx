// Inline SVG comp range visualization for the watchlist expanded panel.
// No external chart library — built to spec with SVG primitives.
//
// The bid marker can sit OUTSIDE the range bar when the current bid is far
// below or above the comp range. The SVG viewBox is padded ±30% beyond
// the data extremes to accommodate this honestly.

interface Props {
  p25Cents: number
  medianCents: number
  p75Cents: number
  bidCents: number | null
  finalPriceCents: number | null
  isActive: boolean
}

const TOTAL_W = 280
const TRACK_Y = 22
const VIZ_H   = 88

// Four-row label layout — each label occupies its own y-row so collision is geometrically impossible
const BID_LABEL_Y    = 10   // row 1 (ABOVE bar): "$Xk bid/sold"
const MEDIAN_LABEL_Y = 52   // row 3 (below bar): "$Yk median"
const TOP_LABEL_Y    = 70   // row 4 (staggered below median): "$Zk top"
const CLAMP_PAD      = 36   // min px from viewBox edge to centered-text anchor

function clampX(x: number): number {
  return Math.max(CLAMP_PAD, Math.min(TOTAL_W - CLAMP_PAD, x))
}

function formatK(cents: number): string {
  const dollars = Math.round(cents / 100)
  if (dollars >= 1000) return `$${Math.round(dollars / 1000)}k`
  return `$${dollars.toLocaleString()}`
}

export function CompRangeViz({ p25Cents, medianCents, p75Cents, bidCents, finalPriceCents, isActive }: Props) {
  const activePriceCents = isActive ? bidCents : finalPriceCents

  // Build price-to-x mapping with 30% padding beyond data extremes
  const prices = [p25Cents, medianCents, p75Cents, activePriceCents].filter((p): p is number => p !== null)
  if (prices.length === 0) return null

  const dataMin = Math.min(...prices)
  const dataMax = Math.max(...prices)
  // Require a non-trivial range to render; identical values (e.g. zeroed data) produce unusable geometry
  const dataRange = dataMax - dataMin
  if (dataRange === 0) return null

  const pad = dataRange * 0.3
  const viewMin = dataMin - pad
  const viewMax = dataMax + pad
  const viewRange = viewMax - viewMin

  function toX(price: number): number {
    return ((price - viewMin) / viewRange) * TOTAL_W
  }

  const p25X    = toX(p25Cents)
  const p75X    = toX(p75Cents)
  const medX    = toX(medianCents)
  const bidX    = activePriceCents !== null ? toX(activePriceCents) : null
  const bidLabel = isActive ? 'bid' : 'sold'

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${TOTAL_W} ${VIZ_H}`}
      overflow="visible"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Track */}
      <line
        x1={0}
        y1={TRACK_Y}
        x2={TOTAL_W}
        y2={TRACK_Y}
        stroke="var(--border-default)"
        strokeWidth="0.5"
      />

      {/* Range bar — p25 to p75, 3px, accent-secondary at 60% opacity */}
      <rect
        x={p25X}
        y={TRACK_Y - 1.5}
        width={Math.max(p75X - p25X, 1)}
        height={3}
        fill="var(--accent-secondary)"
        fillOpacity="0.6"
      />

      {/* Median tick — 1px wide, 14px tall */}
      <line
        x1={medX}
        y1={TRACK_Y - 7}
        x2={medX}
        y2={TRACK_Y + 7}
        stroke="var(--accent-primary)"
        strokeWidth="1"
      />

      {/* Current bid / final price marker — 2px line + 8px dot, 16px tall */}
      {bidX !== null && (
        <>
          <line
            x1={bidX}
            y1={TRACK_Y - 8}
            x2={bidX}
            y2={TRACK_Y + 8}
            stroke="var(--text-primary)"
            strokeWidth="2"
          />
          <circle
            cx={bidX}
            cy={TRACK_Y}
            r={4}
            fill="var(--text-primary)"
          />
        </>
      )}

      {/* Bid/sold label — row 1, ABOVE bar, centered at the bid/sold marker position */}
      {bidX !== null && activePriceCents !== null && (
        <text
          x={clampX(bidX)}
          y={BID_LABEL_Y}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'Source Serif 4', Georgia, serif"
          fontStyle="italic"
          fontWeight="500"
          fill="var(--text-primary)"
        >
          {formatK(activePriceCents)} {bidLabel}
        </text>
      )}

      {/* Median label — row 3, centered at the median tick */}
      <text
        x={clampX(medX)}
        y={MEDIAN_LABEL_Y}
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Source Serif 4', Georgia, serif"
        fill="var(--text-tertiary)"
      >
        {formatK(medianCents)} median
      </text>

      {/* Top label — row 4, centered at the p75 tick (staggered below median row) */}
      <text
        x={clampX(p75X)}
        y={TOP_LABEL_Y}
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Source Serif 4', Georgia, serif"
        fill="var(--text-tertiary)"
      >
        {formatK(p75Cents)} top
      </text>
    </svg>
  )
}
