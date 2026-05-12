interface StatCalloutRowProps {
  productionYears?: string | null
  unitsProduced?: string | null
  engine?: string | null
  plant?: string | null
}

const COLS = [
  { key: 'productionYears', label: 'Production' },
  { key: 'unitsProduced',   label: 'Units Produced' },
  { key: 'engine',          label: 'Engine' },
  { key: 'plant',           label: 'Plant' },
] as const

export function StatCalloutRow({ productionYears, unitsProduced, engine, plant }: StatCalloutRowProps) {
  const values: Record<string, string | null | undefined> = {
    productionYears,
    unitsProduced,
    engine,
    plant: plant ?? 'Zuffenhausen',
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {COLS.map(({ key, label }) => {
          const value = values[key]
          return (
            <div key={key}>
              <p className="font-serif text-[10px] uppercase tracking-[0.16em] text-accent-primary">
                {label}
              </p>
              {value ? (
                <p className="mt-1.5 font-serif text-[20px] leading-[1.3] text-text-primary">
                  {value}
                </p>
              ) : (
                <p className="mt-1.5 font-serif text-[20px] leading-[1.3] text-text-muted">
                  —
                </p>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-[30px]" style={{ width: 120, height: 1.5, backgroundColor: 'var(--accent-primary)' }} />
    </div>
  )
}
