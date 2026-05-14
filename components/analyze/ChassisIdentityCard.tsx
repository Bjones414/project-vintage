import type { Tables } from '@/lib/supabase/types'
import { formatGenerationDisplay } from '@/lib/era-content/generation-display'
import { lookupFactorySpecs } from '@/lib/era-content/factory-specs'
import { lookupVariantProduction, type ProductionResult } from '@/lib/era-content/generation-content'

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

// Condenses a verbose NHTSA engine string to a compact display form.
// "Horizontally opposed (boxer) 3.6L 6-cyl" → "3.6L flat-6"
// "3.0L 6-cyl turbocharged" → "3.0L flat-6 turbo"
function buildEngineDisplay(raw: string | null | undefined): string | null {
  if (!raw) return null
  const displacementMatch = raw.match(/(\d+\.?\d*)\s*[Ll]/)
  const cylinderMatch = raw.match(/(\d+)[-\s]?cyl/i)
  const vMatch = raw.match(/\bV[-\s]?(\d+)\b/i)
  const isBoxer = /boxer|horizontally[\s\S]{0,12}opposed/i.test(raw)
  const isTurbo = /turbo/i.test(raw)

  const displacement = displacementMatch ? `${displacementMatch[1]}L` : null
  const cylinders = cylinderMatch
    ? parseInt(cylinderMatch[1], 10)
    : vMatch
    ? parseInt(vMatch[1], 10)
    : null

  let config: string | null = null
  if (isBoxer && cylinders) config = `flat-${cylinders}`
  else if (vMatch) config = `V${vMatch[1]}`
  else if (cylinders) config = `${cylinders}-cyl`

  const parts = ([displacement, config, isTurbo ? 'turbo' : null] as (string | null)[]).filter(
    (p): p is string => p !== null,
  )
  return parts.length > 0 ? parts.join(' ') : raw
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

// Derives drivetrain from listing field first, then from trim+model as fallback.
// Boxster/Cayman/718 are always RWD. For 911: Carrera 4, Targa 4, Turbo → AWD.
function deriveDrivetrain(
  drivetrainField: string | null | undefined,
  model: string | null | undefined,
  trim: string | null | undefined,
): string {
  if (drivetrainField) return drivetrainField.toUpperCase()

  const t = (trim ?? '').toLowerCase()
  const m = (model ?? '').toLowerCase()

  if (
    m.includes('boxster') ||
    m.includes('cayman') ||
    m === '718 boxster' ||
    m === '718 cayman'
  ) return 'RWD'

  // AWD 911 trims: Carrera 4, Targa 4 (all variants), Turbo, Turbo S
  if (
    t.includes('carrera 4') ||
    t.includes('targa 4') ||
    t === 'turbo' ||
    t === 'turbo s'
  ) return 'AWD'

  if (m === '911') return 'RWD'

  return '—'
}

export function ChassisIdentityCard({ listing, generation, colorData }: Props) {
  const rarity = resolveRarityTier(colorData)
  const { label: rarityLabel, dotClass: rarityDotClass } = RARITY_CONFIG[rarity]

  const vinValue = listing.vin ?? null
  const isModernVin =
    (vinValue !== null && vinValue.length === 17) ||
    (vinValue === null && listing.year !== null && listing.year >= 1981)
  const vinLabel = isModernVin ? 'VIN' : 'Chassis No.'

  const generationDisplay = (() => {
    const raw = listing.generation ?? generation?.generation_id ?? null
    return raw ? formatGenerationDisplay(raw) : null
  })()

  const drivetrain = deriveDrivetrain(listing.drivetrain, listing.model, listing.trim)

  const specsGenerationId = listing.generation ?? generation?.generation_id ?? null
  const specs = lookupFactorySpecs(specsGenerationId, listing.trim)
  const productionLookup = lookupVariantProduction(specsGenerationId, listing.trim)
  const variantProduction: ProductionResult | null =
    productionLookup?.tier === 'variant' ? productionLookup : null
  const specItems = specs
    ? [
        { label: 'Power',        value: specs.hp },
        { label: 'Torque',       value: specs.torque },
        { label: '0–60 mph',     value: specs.zero_to_sixty },
        { label: 'Top Speed',    value: specs.top_speed_mph ?? '—' },
        { label: 'Curb Weight',  value: specs.curb_weight_lb ?? '—' },
        { label: 'Redline',      value: specs.redline_rpm ?? '—' },
      ]
    : null

  // Factory engine takes priority over NHTSA-decoded string (which is unreliable).
  // Falls back to the parsed string, then hides the field entirely if both are null.
  const engineDisplay = specs?.engine ?? buildEngineDisplay(listing.decoded_engine) ?? null

  // 5 rows × 2 cols grid. Engine is omitted when no factory or parsed data is available,
  // leaving Transmission alone in the last row (preferable to showing "Engine —").
  // Row 1: Generation | Model
  // Row 2: Trim       | Model Year
  // Row 3: Mileage    | Drivetrain
  // Row 4: Engine (when available) | Transmission
  // Row 5: Exterior Color | Interior Color  (rendered separately for rarity dot)
  const fields = [
    { label: 'Generation', value: generationDisplay ?? '—' },
    { label: 'Model',      value: listing.model ?? '—' },
    { label: 'Trim',       value: listing.trim ?? '—' },
    {
      label: 'Model Year',
      value: listing.decoded_year != null
        ? String(listing.decoded_year)
        : listing.year != null
        ? String(listing.year)
        : '—',
    },
    {
      label: 'Mileage',
      value: listing.mileage != null ? `${listing.mileage.toLocaleString('en-US')} mi` : '—',
    },
    { label: 'Drivetrain',    value: drivetrain },
    ...(engineDisplay !== null ? [{ label: 'Engine', value: engineDisplay }] : []),
    { label: 'Transmission',  value: listing.decoded_transmission ?? listing.transmission ?? '—' },
  ]

  const exteriorColor = listing.exterior_color ?? null
  const interiorColor = listing.interior_color ?? null
  const isRepainted = listing.is_repainted ?? null
  const originalExteriorColor = listing.original_exterior_color ?? null
  const repaintYear = listing.repaint_year ?? null
  const isReupholstered = listing.is_reupholstered ?? null
  const originalInteriorColor = listing.original_interior_color ?? null

  const hasAnyContent = vinValue !== null || listing.model != null || listing.year != null

  return (
    <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
        Chassis Identity
      </p>

      {!hasAnyContent ? (
        <p className="mt-4 font-sans text-[13px] text-text-tertiary">No chassis data available.</p>
      ) : (
        <div className="mt-4 flex flex-1 flex-col">
          {/* VIN — full-width single-line header */}
          {vinValue !== null && (
            <p className="hyphens-none break-all">
              <span className="font-serif text-[10px] uppercase tracking-[0.16em] text-text-quaternary">
                {vinLabel}:{' '}
              </span>
              <span className="font-mono text-[13px] tracking-[0.04em] text-text-primary">
                {vinValue}
              </span>
            </p>
          )}

          {/* Production figure — variant-specific when matched; generation total as fallback */}
          {variantProduction !== null && (
            <p className={`hyphens-none break-words ${vinValue !== null ? 'mt-2' : 'mt-0'}`}>
              <span className="font-serif text-[10px] uppercase tracking-[0.16em] text-text-quaternary">
                {variantProduction.label}:{' '}
              </span>
              <span className="font-serif text-[13px] italic text-text-secondary">
                {variantProduction.figure}
              </span>
            </p>
          )}

          {/* 10-field grid (5 rows × 2 cols — always even, no orphan cells) */}
          <dl
            className={`${vinValue !== null || variantProduction !== null ? 'mt-4 border-t-[0.5px] border-border-subtle pt-4' : ''} flex-auto content-between grid grid-cols-2 gap-x-4 gap-y-4`}
          >
            {/* Rows 1–4: 8 uniform fields */}
            {fields.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                  {label}
                </dt>
                <dd className="mt-1">
                  <span className="hyphens-none break-words font-serif text-[17px] text-text-primary">
                    {value}
                  </span>
                </dd>
              </div>
            ))}

            {/* Row 5: Exterior Color (with rarity indicator + repaint disclosure) */}
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                Exterior Color
              </dt>
              {exteriorColor != null ? (
                <dd className="mt-1">
                  <div className="flex items-center gap-[6px]">
                    <span className="hyphens-none break-words font-serif text-[17px] text-text-primary">
                      {exteriorColor}
                    </span>
                    {isRepainted === true && (
                      <span className="font-serif text-[13px] italic text-text-tertiary">(current)</span>
                    )}
                    <span
                      className={`h-[6px] w-[6px] shrink-0 rounded-full ${rarityDotClass}`}
                      aria-hidden="true"
                    />
                  </div>
                  {isRepainted === true && originalExteriorColor != null ? (
                    <p className="mt-[3px] font-serif text-[12px] italic text-text-secondary">
                      Originally: {originalExteriorColor}{repaintYear != null ? ` · Repainted ${repaintYear}` : ''}
                    </p>
                  ) : isRepainted === false ? (
                    <p className="mt-[3px] font-sans text-[11px] italic text-[#1D9E75]">
                      Original paint
                    </p>
                  ) : (
                    <p className="mt-[3px] font-serif text-[12px] italic text-text-tertiary">
                      {rarityLabel}
                    </p>
                  )}
                </dd>
              ) : (
                <dd className="mt-1">
                  <span className="font-serif text-[17px] text-text-primary">—</span>
                </dd>
              )}
            </div>

            {/* Row 5: Interior Color (with reupholstery disclosure) */}
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                Interior Color
              </dt>
              <dd className="mt-1">
                <span className="hyphens-none break-words font-serif text-[17px] text-text-primary">
                  {interiorColor ?? '—'}
                </span>
                {isReupholstered === true && (
                  <p className="mt-[3px] font-serif text-[12px] italic text-text-secondary">
                    {originalInteriorColor != null ? `Originally: ${originalInteriorColor}` : 'Reupholstered'}
                  </p>
                )}
                {isReupholstered === false && (
                  <p className="mt-[3px] font-sans text-[11px] italic text-[#1D9E75]">
                    Original interior
                  </p>
                )}
              </dd>
            </div>
          </dl>

          {specItems !== null && (
            <div className="mt-3 flex flex-auto flex-col">
              <div className="border-t-[0.5px] border-border-subtle" />
              <p className="mt-4 font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
                Factory Specs
              </p>
              <dl className="mt-4 flex-auto content-between grid grid-cols-2 gap-x-4 gap-y-4">
                {specItems.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                      {label}
                    </dt>
                    <dd className="mt-1">
                      <span className="font-serif text-[17px] text-text-primary">{value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
