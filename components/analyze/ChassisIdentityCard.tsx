import type { Tables } from '@/lib/supabase/types'

type Props = {
  listing: Tables<'listings'>
  generation: Tables<'porsche_generations'> | null
  colorData?: Tables<'porsche_color_codes'> | null
}

export function ChassisIdentityCard({ listing, generation, colorData }: Props) {
  // VIN is not stored in the database per compliance policy (NEVER_PERSIST_FIELDS).
  // It is available in the API response for the subject listing only.
  // Display from DB is not possible — session-storage display is a deferred V1 UX improvement.
  // Always show mileage — em dash when null (largest comp engine weight; absence is confusing)
  const mileageValue =
    listing.mileage != null ? `${listing.mileage.toLocaleString('en-US')} mi` : '—'

  const fields: Array<{ label: string; value: string | null | undefined; mono?: boolean }> = [
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
    { label: 'Exterior Color', value: listing.exterior_color },
  ]

  const present = fields.filter(({ value }) => value != null && value !== '')

  const rarityLabel =
    colorData != null
      ? colorData.rarity !== 'common' || colorData.is_special_order
        ? 'Rare or special-order'
        : 'Common factory color'
      : null

  const rarityDotClass =
    rarityLabel === 'Common factory color'
      ? 'bg-severity-positive'
      : 'bg-severity-caution'

  const hasContent = present.length > 0 || rarityLabel != null

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Chassis Identity</p>
      {!hasContent ? (
        <p className="mt-4 font-sans text-[13px] text-text-tertiary">No chassis data available.</p>
      ) : (
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
          {present.map(({ label, value, mono }) => (
            <div key={label}>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
              <dd className={`mt-1 break-all ${mono ? 'font-mono text-[12px] tracking-[0.04em] text-text-quaternary' : 'font-serif text-[17px] text-text-primary'}`}>
                {value}
              </dd>
            </div>
          ))}
          {rarityLabel != null && (
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">Color Rarity</dt>
              <dd className="mt-1 flex items-center gap-[6px]">
                <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${rarityDotClass}`} aria-hidden="true" />
                <span className="font-serif text-[14px] text-text-primary">{rarityLabel}</span>
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
