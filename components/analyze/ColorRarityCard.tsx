import type { Tables } from '@/lib/supabase/types'
import { Card } from '@/components/ui/card'
import type { ViewerTier } from './types'

type Props = {
  listing: Tables<'listings'>
  colorData: Tables<'porsche_color_codes'> | null
  viewerTier: ViewerTier
}

const RARITY_LABELS: Record<string, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  very_rare: 'Very Rare',
}

export function ColorRarityCard({ listing, colorData, viewerTier }: Props) {
  const colorName = listing.exterior_color ?? colorData?.color_name ?? null

  if (!colorName) return null

  const rarityLabel =
    colorData?.rarity != null ? (RARITY_LABELS[colorData.rarity] ?? colorData.rarity) : null

  return (
    <Card title="Color Rarity">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-gray-900">{colorName}</span>
        {listing.exterior_color_code && (
          <span className="text-xs text-gray-500">
            ({listing.exterior_color_code})
          </span>
        )}
      </div>
      {rarityLabel && (
        <p className="mt-1 text-lg font-bold text-gray-900">{rarityLabel}</p>
      )}
      {viewerTier !== 'anonymous' && colorData && (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {colorData.color_family && (
            <div>
              <dt className="text-xs text-gray-500">Family</dt>
              <dd className="font-medium text-gray-900">{colorData.color_family}</dd>
            </div>
          )}
          {colorData.finish_type && (
            <div>
              <dt className="text-xs text-gray-500">Finish</dt>
              <dd className="font-medium text-gray-900">{colorData.finish_type}</dd>
            </div>
          )}
          {colorData.is_special_order && (
            <div className="col-span-2">
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                Special Order / Paint to Sample
              </span>
            </div>
          )}
          {colorData.notes && (
            <div className="col-span-2">
              <dt className="text-xs text-gray-500">Notes</dt>
              <dd className="text-gray-700">{colorData.notes}</dd>
            </div>
          )}
        </dl>
      )}
      {viewerTier === 'anonymous' && rarityLabel && (
        <p className="mt-2 text-xs text-gray-400">
          Color history and context available with a free account.
        </p>
      )}
    </Card>
  )
}
