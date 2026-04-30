import type { Tables } from '@/lib/supabase/types'

type Props = {
  listing: Tables<'listings'>
  generation: Tables<'porsche_generations'> | null
}

export function ChassisIdentityCard({ listing, generation }: Props) {
  const fields: Array<{ label: string; value: string | null | undefined; mono?: boolean }> = [
    { label: 'VIN', value: listing.vin, mono: true },
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

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Chassis Identity</p>
      {present.length === 0 ? (
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
        </dl>
      )}
    </div>
  )
}
