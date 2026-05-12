import type { ResearchRecord } from '@/lib/research/types'
import { PVMark } from '@/components/brand/PVMark'

interface Props {
  record: ResearchRecord
}

function Dot() {
  return (
    <span
      className="mx-[10px] inline-block h-[5px] w-[5px] rounded-full bg-text-muted align-middle"
      aria-hidden="true"
    />
  )
}

export function ResultAnchor({ record }: Props) {
  const { year, model, trim, body_style, transmission, mileage, exterior_color, interior_color } = record

  const h1Parts = [year, 'Porsche', model, trim, body_style].filter(Boolean).join(' ')

  const subtitleSegments: string[] = []

  if (exterior_color || interior_color) {
    if (exterior_color && interior_color) {
      subtitleSegments.push(`${exterior_color} over ${interior_color}`)
    } else {
      subtitleSegments.push((exterior_color ?? interior_color) as string)
    }
  }

  if (transmission) subtitleSegments.push(transmission)
  if (mileage != null) subtitleSegments.push(`${mileage.toLocaleString('en-US')} mi`)

  return (
    <div className="mx-auto max-w-[1080px] px-7 pb-14 pt-[60px] text-center">
      {/* PV mark */}
      <div className="mb-[22px] flex justify-center text-accent-primary">
        <PVMark size={52} />
      </div>

      {/* Eyebrow */}
      <p
        className="mb-[18px] font-serif text-[11px] uppercase tracking-[0.24em] text-accent-primary"
        style={{ fontVariant: 'small-caps' }}
      >
        Project Vintage · Research
      </p>

      {/* H1 */}
      <h1 className="mx-auto mb-[14px] max-w-[760px] px-7 font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.01em] text-text-primary">
        {h1Parts}
      </h1>

      {/* Subtitle */}
      {subtitleSegments.length > 0 && (
        <p className="font-serif text-[15px] italic leading-[1.55] text-text-tertiary">
          {subtitleSegments.map((seg, i) => (
            <span key={i}>
              {i > 0 && <Dot />}
              {seg}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
