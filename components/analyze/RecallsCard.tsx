import type { NhtsaRecall } from '@/lib/recalls/nhtsa'

type Props = {
  recalls: NhtsaRecall[]
}

export function RecallsCard({ recalls }: Props) {
  if (recalls.length === 0) return null

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <div className="flex items-baseline gap-3">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
          Known Recalls
        </p>
        <span className="font-sans text-[11px] text-text-quaternary">
          {recalls.length} {recalls.length === 1 ? 'recall' : 'recalls'} — NHTSA
        </span>
      </div>
      <ul className="mt-4 space-y-5">
        {recalls.map((recall) => (
          <li key={recall.campaignNumber} className="border-l-2 border-amber-400/50 pl-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-quaternary">
                {recall.campaignNumber}
              </span>
              {recall.reportReceivedDate && (
                <span className="font-sans text-[10px] text-text-quaternary">
                  · {recall.reportReceivedDate}
                </span>
              )}
            </div>
            <p className="font-sans text-[12px] font-medium text-text-primary">
              {recall.component}
            </p>
            {recall.summary && (
              <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-text-secondary">
                {recall.summary}
              </p>
            )}
            {recall.remedy && (
              <p className="mt-1.5 font-sans text-[11px] text-text-tertiary">
                <span className="text-text-quaternary">Remedy: </span>
                {recall.remedy}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
