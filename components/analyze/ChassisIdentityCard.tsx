import type { Tables } from '@/lib/supabase/types'

type Props = {
  listing: Tables<'listings'>
  generation: Tables<'porsche_generations'> | null
  colorData?: Tables<'porsche_color_codes'> | null
}

type RarityTier = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'paint_to_sample'

const RARITY_CONFIG: Record<RarityTier, { label: string; dotClass: string }> = {
  common:          { label: 'Common',          dotClass: 'bg-gray-400' },
  uncommon:        { label: 'Uncommon',        dotClass: 'bg-green-500' },
  rare:            { label: 'Rare',            dotClass: 'bg-blue-500' },
  very_rare:       { label: 'Very Rare',       dotClass: 'bg-purple-500' },
  paint_to_sample: { label: 'Paint to Sample', dotClass: 'bg-amber-400' },
}

function resolveRarityTier(colorData: Tables<'porsche_color_codes'> | null | undefined): RarityTier {
  if (!colorData) return 'common'
  if (colorData.is_special_order) return 'paint_to_sample'
  const r = colorData.rarity?.toLowerCase().replace(/\s+/g, '_') ?? ''
  if (r === 'very_rare') return 'very_rare'
  if (r === 'rare') return 'rare'
  if (r === 'uncommon') return 'uncommon'
  return 'common'
}

export function ChassisIdentityCard({ listing, generation, colorData }: Props) {
  // VIN is not stored in the database per compliance policy (NEVER_PERSIST_FIELDS).
  // Always show mileage — em dash when null (largest comp engine weight; absence is confusing)
  const mileageValue =
    listing.mileage != null ? `${listing.mileage.toLocaleString('en-US')} mi` : '—'

  const rarity = resolveRarityTier(colorData)
  const { label: rarityLabel, dotClass: rarityDotClass } = RARITY_CONFIG[rarity]

  type Field = {
    label: string
    value: string | null | undefined
    mono?: boolean
    customContent?: React.ReactNode
  }

  const fields: Field[] = [
    {
      label: 'Generation',
      value: listing.generation ?? generation?.generation_id ?? null,
    },
    {
      label: 'Model Year',
      value: listing.decoded_year != null
        ? String(listing.decoded_year)
        : String(listing.year),
    },
    { label: 'Mileage', value: mileageValue },
    { label: 'Variant', value: listing.trim },
    { label: 'Engine', value: listing.decoded_engine },
    { label: 'Assembly Plant', value: listing.decoded_plant },
    {
      label: 'Body',
      value: listing.decoded_body_class ?? listing.body_style,
    },
    {
      label: 'Transmission',
      value: listing.decoded_transmission ?? listing.transmission,
    },
    {
      label: 'Exterior Color',
      value: listing.exterior_color,
      customContent: listing.exterior_color != null ? (
        <div>
          <div className="flex items-center gap-[5px]">
            <span className="font-serif text-[17px] text-text-primary">{listing.exterior_color}</span>
            <span
              className={`h-[5px] w-[5px] shrink-0 rounded-full ${rarityDotClass}`}
              aria-hidden="true"
            />
          </div>
          <p className="mt-[3px] font-sans text-[10px] text-text-quaternary">{rarityLabel}</p>
        </div>
      ) : null,
    },
  ]

  const present = fields.filter(({ value }) => value != null && value !== '')

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Chassis Identity</p>
      {present.length === 0 ? (
        <p className="mt-4 font-sans text-[13px] text-text-tertiary">No chassis data available.</p>
      ) : (
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          {present.map(({ label, value, mono, customContent }) => (
            <div key={label}>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
              <dd className="mt-1">
                {customContent ?? (
                  <span className={`hyphens-none break-words ${mono ? 'font-mono text-[12px] tracking-[0.04em] text-text-quaternary' : 'font-serif text-[17px] text-text-primary'}`}>
                    {value}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
