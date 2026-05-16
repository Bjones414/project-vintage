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
const VIZ_H   = 60

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

      {/* Labels below track */}
      {bidX !== null && activePriceCents !== null && (
        <text
          x={bidX}
          y={TRACK_Y + 26}
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
      <text
        x={medX}
        y={TRACK_Y + 26}
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Source Serif 4', Georgia, serif"
        fill="var(--text-tertiary)"
      >
        {formatK(medianCents)} median
      </text>
      <text
        x={p75X}
        y={TRACK_Y + 26}
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
