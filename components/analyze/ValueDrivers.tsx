// FUTURE V2: When compResult has sufficient coverage for a factor (e.g., 3+ comps with mileage data
// spread across the value range), replace generic description with specific dollar deltas.
// Example V2 output:
//   "Mileage: This car has 62,000 mi. Comps under 50K miles sold for ~$18K more on average."
//   "Transmission: Manual — adds ~$12K vs Tiptronic in our comp data."
// The threshold for switching to specific deltas: at least 5 comps with the relevant feature populated
// and variance > $5K across the comp range.

import type { CompResultRow } from '@/lib/comp-engine/db-types'
import { getValueDrivers } from '@/lib/era-content/generation-content'
import { UNIVERSAL_VALUE_DRIVERS } from '@/lib/era-content/value-drivers-fallback'
import type { ValueDriver } from '@/lib/era-content/generation-content'

type Props = {
  generationId: string | null
  compResult: CompResultRow | null
}

function generationLabel(id: string): string {
  // 993, 997.2, 996.1, etc. read well as-is
  return id.toUpperCase()
}

export function ValueDrivers({ generationId, compResult: _compResult }: Props) {
  const generationDrivers: ValueDriver[] | null = generationId
    ? getValueDrivers(generationId)
    : null
  const driversToShow: ValueDriver[] = generationDrivers ?? UNIVERSAL_VALUE_DRIVERS
  const isUniversalFallback = generationDrivers === null

  const header = isUniversalFallback
    ? 'THINGS TO CONSIDER'
    : `WHAT MOVES VALUE ON THE ${generationLabel(generationId!)}`

  return (
    <div className="mt-8 border-t-[0.5px] border-border-default pt-8">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
        {header}
      </p>
      <div className="mt-[18px]">
        {driversToShow.map((driver, index) => (
          <div
            key={driver.name}
            className={
              index > 0
                ? 'mt-4 border-t-[0.5px] border-border-subtle pt-4'
                : undefined
            }
          >
            <p className="font-serif text-[15px] font-bold text-text-primary">{driver.name}</p>
            <p className="mt-1 font-serif text-[14px] italic leading-[1.55] text-text-secondary">
              {driver.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
