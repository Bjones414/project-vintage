import type { Tables } from '@/lib/supabase/types'
import type { ViewerTier } from './types'

type Props = {
  listing: Tables<'listings'>
  colorData: Tables<'porsche_color_codes'> | null
  viewerTier: ViewerTier
}

export function ColorRarityCard({ listing, colorData, viewerTier }: Props) {
  const colorName = listing.exterior_color ?? colorData?.color_name ?? null

  if (!colorName) return null

  const rarityLabel =
    colorData != null
      ? colorData.rarity !== 'common' || colorData.is_special_order
        ? 'Rare or special-order'
        : 'Common'
      : null

  const rarityDotColor =
    rarityLabel === 'Rare or special-order'
      ? 'bg-severity-caution'
      : 'bg-text-quaternary'

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Color rarity</p>
          <p className="mt-1 font-serif text-[16px] text-text-primary">
            {colorName}
            {listing.exterior_color_code && (
              <span className="ml-2 font-mono text-[12px] tracking-[0.04em] text-text-quaternary">
                ({listing.exterior_color_code})
              </span>
            )}
          </p>
        </div>
        {rarityLabel && (
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-2">
              <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${rarityDotColor}`} aria-hidden="true" />
              <span className="font-serif text-[15px] italic text-text-secondary">{rarityLabel}</span>
            </div>
          </div>
        )}
      </div>

      {viewerTier !== 'anonymous' && colorData && (
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t-[0.5px] border-border-subtle pt-4">
          {colorData.color_family && (
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">Family</dt>
              <dd className="mt-1 font-serif text-[15px] text-text-primary">{colorData.color_family}</dd>
            </div>
          )}
          {colorData.finish_type && (
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">Finish</dt>
              <dd className="mt-1 font-serif text-[15px] text-text-primary">{colorData.finish_type}</dd>
            </div>
          )}
          {colorData.notes && (
            <div className="col-span-2">
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">Notes</dt>
              <dd className="mt-1 font-serif text-[15px] italic leading-[1.65] text-text-secondary">{colorData.notes}</dd>
            </div>
          )}
        </dl>
      )}
      {viewerTier === 'anonymous' && rarityLabel && (
        <p className="mt-3 font-sans text-[12px] text-text-muted">
          Color history and context available with a free account.
        </p>
      )}
    </div>
  )
}
