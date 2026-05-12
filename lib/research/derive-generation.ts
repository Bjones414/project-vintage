// Derives Porsche-specific attributes from year/model/trim without a real listing row.
// All derived fields are annotated "(derived)" in the UI.

import { formatGenerationDisplay } from '@/lib/era-content/generation-display'

export function deriveGenerationId(year: number, model: string): string | null {
  const m = model.toLowerCase().trim()

  if (m === '911') {
    if (year >= 2024) return '992.2'
    if (year >= 2019) return '992.1'
    if (year >= 2016) return '991.2'
    if (year >= 2012) return '991.1'
    if (year >= 2009) return '997.2'
    if (year >= 2005) return '997.1'
    if (year >= 2002) return '996.2'
    if (year >= 1999) return '996.1'
    if (year >= 1994) return '993'
    if (year >= 1989) return '964'
    return null
  }

  if (m === '718 cayman') return '982-cayman'
  if (m === '718 boxster') return '982-boxster'

  if (m === 'cayman') {
    if (year >= 2013) return '981-cayman'
    if (year >= 2009) return '987.2-cayman'
    return '987.1-cayman'
  }

  if (m === 'boxster') {
    if (year >= 2012) return '981-boxster'
    if (year >= 2009) return '987.2-boxster'
    if (year >= 2005) return '987.1-boxster'
    return '986'
  }

  // Cayenne, Macan, Panamera, Taycan — generation IDs TBD in DB
  return null
}

export function formatGenerationLabel(genId: string): string {
  return formatGenerationDisplay(genId)
}

export function deriveDrivetrain(model: string, trim: string): string | null {
  const t = trim.toLowerCase()
  if (t.includes('carrera 4') || t.includes('targa 4') || t.includes('4s')) return 'AWD'
  const m = model.toLowerCase()
  if (m === 'cayenne' || m === 'macan') return 'AWD'
  if (m === 'panamera' && t.includes('4')) return 'AWD'
  if (m === '911') return 'RWD'
  if (m === 'cayman' || m === '718 cayman') return 'RWD'
  if (m === 'boxster' || m === '718 boxster') return 'RWD'
  return null
}

export function deriveBodyStyle(model: string, trim: string): string | null {
  const t = trim.toLowerCase()
  if (t.includes('targa')) return 'Targa'
  const m = model.toLowerCase()
  if (m === 'boxster' || m === '718 boxster') return 'Roadster'
  if (m === '911') return 'Coupe'
  if (m === 'cayman' || m === '718 cayman') return 'Coupe'
  return null
}

export function deriveCooling(genId: string | null): string | null {
  if (!genId) return null
  // All pre-996 are air-cooled; 996 onwards water-cooled
  const airCooled = ['964', '993']
  if (airCooled.includes(genId)) return 'Air-cooled'
  // Very early (pre-964) also air-cooled but genId is null so covered above
  return 'Water-cooled'
}

export function parseAskingPriceCents(raw: string): number | null {
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return null
  const n = parseInt(digits, 10)
  return isNaN(n) ? null : n * 100
}

export function parseMileage(raw: string): number | null {
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return null
  const n = parseInt(digits, 10)
  return isNaN(n) ? null : n
}
