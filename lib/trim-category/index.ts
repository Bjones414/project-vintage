// ============================================================
// Trim Category Derivation
//
// Maps a raw trim string to a generation-specific trim_category
// value that the comp engine uses as a hard filter.
//
// Categories are generation-specific (not universal) to match
// the granularity of each generation's collector market segments.
// The 993 taxonomy (carrera_2_narrow, turbo_base, rs_touring, …)
// is the established pattern — all other generations follow it.
//
// Returns null when the trim string cannot be confidently mapped;
// the engine's D6 rule then skips the filter for that listing.
// ============================================================

export type TrimCategory = string  // open string so new generations can add categories freely

export function deriveTrimCategory(
  trim: string | null,
  generationId: string | null,
): TrimCategory | null {
  if (!trim || !generationId) return null

  switch (generationId) {
    case '930': return derive930(trim)
    case '964': return derive964(trim)
    case '993': return derive993(trim)
    case '996':
    case '996.1':
    case '996.2': return derive996(trim)
    case '997.1':
    case '997.2': return derive997(trim)
    case '991.1':
    case '991.2': return derive991(trim)
    case '992.1':
    case '992.2': return derive992(trim)
    case '986': return deriveBoxster986(trim)
    case '987.1-boxster':
    case '987.2-boxster': return deriveBoxster987(trim)
    case '981-boxster':
    case '982-boxster': return deriveBoxster718(trim)
    case '987.1-cayman':
    case '987.2-cayman': return deriveCayman987(trim)
    case '981-cayman':
    case '982-cayman': return deriveCayman718(trim)
    case 'cayenne-i': return deriveCayenneI(trim)
    case 'cayenne-ii': return deriveCayenneII(trim)
    case 'cayenne-iii': return deriveCayenneIII(trim)
    case 'panamera-i': return derivePanameraI(trim)
    case 'panamera-ii': return derivePanameraII(trim)
    default: return null
  }
}

// ─── 930 (G-series Turbo, 1975–1989) ────────────────────────────────────────
// All 930s are turbocharged; the only meaningful sub-category is the rare Turbo S.

function derive930(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  return null
}

// ─── 964 (1989–1994) ────────────────────────────────────────────────────────

function derive964(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()

  // Singer / restomod builds — 'coachbuilt' matches the existing ALWAYS_SEPARATE_MARKET
  // convention in hard-filter.ts and the pre-existing prod data for these listings.
  if (t.includes('singer') || t.includes('reimagined')) return 'coachbuilt'

  // Speedster — 'limited' matches the pre-existing prod convention for the 964 Speedster.
  // The decoded_body_class='Speedster' also provides body-style isolation.
  if (t.includes('speedster')) return 'limited'

  // Anniversary — 911-unit Carrera 4 widebody (distinct collector comp pool, not a Turbo)
  if (t.includes('30 jahre')) return 'anniversary'

  // Turbo Look appearance package: wide body WITHOUT turbo drivetrain — must not land in turbo_base.
  // Route C4 Turbo Look to carrera_4_narrow; C2 Turbo Look to carrera_2_narrow.
  if (t.includes('turbo look') || t.includes('turbolook')) {
    return t.includes('carrera 4') ? 'carrera_4_narrow' : 'carrera_2_narrow'
  }

  // Turbo S variants: catch 'Turbo S Leichtbau' (contains 'turbo s') and 'Turbo 3.6 S'
  // (does NOT contain 'turbo s' adjacently — substring check handles it explicitly).
  if (t.includes('turbo s') || t.includes('turbo 3.6 s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'

  // RS America (US-market lightweight base, different from homologation RS)
  if (t.includes('rs america')) return 'rs_america'

  // Homologation RS / Leichtbau: Carrera RS, S Lightweight, RS N/GT
  if (/\brs\b/.test(t) || t.includes('lightweight') || t.includes('leichtbau')) return 'rs_lightweight'

  // Targa (semi-open top, distinct comp market)
  if (t.includes('targa')) return 'targa'

  // Cabriolet/convertible body — comp within same trim line (body filter separates from coupes)
  if (t.includes('cabriolet') || t.includes('convertible') || t.includes('cabrio')) {
    return t.includes('carrera 4') ? 'carrera_4_narrow' : 'carrera_2_narrow'
  }

  if (t.includes('carrera 4')) return 'carrera_4_narrow'
  if (t.includes('carrera 2') || t.includes('carrera')) return 'carrera_2_narrow'

  return null
}

// ─── 993 (1994–1998) ────────────────────────────────────────────────────────

function derive993(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()

  // Speedster / race-car variants (highest specificity first)
  if (t.includes('speedster')) return 'speedster'
  if (t.includes('supercup')) return 'supercup'
  if (t.includes('gt2 evo')) return 'gt2_evo'
  if (t.includes('gt2')) return 'gt2'
  if (/\bcup\b/.test(t)) return 'cup'

  // Turbo variants
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('x50')) return 'turbo_x50'
  if (t.includes('turbo look') || t.includes('m491')) return 'turbo_look_m491'
  if (t.includes('turbo')) return 'turbo_base'

  // RS variants
  if (t.includes('rs club')) return 'rs_clubsport'
  if (/\brs\b/.test(t)) return 'rs_touring'

  // Targa
  if (t.includes('targa')) return 'targa'

  // Wide-body variants (check 4S before S to prevent partial match)
  if (t.includes('carrera 4s')) return 'carrera_4s_wide'
  if (t.includes('carrera s')) return 'carrera_s_wide'

  // Narrow-body base (cabriolets share same category — body_style filter separates)
  if (t.includes('carrera 4')) return 'carrera_4_narrow'
  if (t.includes('carrera 2') || t.includes('carrera')) return 'carrera_2_narrow'

  return null
}

// ─── 996 (1999–2004) ────────────────────────────────────────────────────────

function derive996(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()

  if (t.includes('gt2')) return 'gt2'
  if (t.includes('gt3 rs')) return 'gt3_rs'
  if (t.includes('gt3')) return 'gt3'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('targa')) return 'targa'
  if (t.includes('40 jahre') || t.includes('anniversary')) return '40_jahre'
  if (t.includes('carrera 4s')) return 'carrera_4s'
  if (t.includes('carrera s')) return 'carrera_s'
  if (t.includes('cabriolet') || t.includes('convertible') || t.includes('cabrio')) {
    return t.includes('carrera 4') ? 'carrera_4' : 'carrera_base'
  }
  if (t.includes('carrera 4')) return 'carrera_4'
  if (t.includes('carrera')) return 'carrera_base'

  return null
}

// ─── 997 (2005–2012) ────────────────────────────────────────────────────────

function derive997(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()

  if (t.includes('gt2 rs')) return 'gt2_rs'
  if (t.includes('gt2')) return 'gt2'
  if (t.includes('gt3 rs 4.0')) return 'gt3_rs_40'
  if (t.includes('gt3 rs')) return 'gt3_rs'
  if (t.includes('gt3')) return 'gt3'
  if (t.includes('sport classic')) return 'sport_classic'
  if (t.includes('speedster')) return 'speedster'
  if (/\br\b/.test(t) && t.includes('turbo') === false) return 'r'  // 997.2 R
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('gts')) return 'gts'
  if (t.includes('targa')) return 'targa'
  if (t.includes('carrera 4s')) return 'carrera_4s'
  if (t.includes('carrera s')) return 'carrera_s'
  if (t.includes('cabriolet') || t.includes('convertible') || t.includes('cabrio')) {
    return t.includes('carrera 4') ? 'carrera_4' : 'carrera_base'
  }
  if (t.includes('carrera 4')) return 'carrera_4'
  if (t.includes('carrera')) return 'carrera_base'

  return null
}

// ─── 991 (2012–2019) ────────────────────────────────────────────────────────

function derive991(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()

  if (t.includes('gt2 rs')) return 'gt2_rs'
  if (t.includes('gt3 rs')) return 'gt3_rs'
  if (t.includes('gt3 touring')) return 'gt3_touring'  // must precede generic 'gt3'
  if (t.includes('gt3')) return 'gt3'
  if (t.includes('sport classic')) return 'sport_classic'
  if (t.includes('speedster')) return 'speedster'
  if (/\br\b/.test(t) && !t.includes('turbo') && !t.includes('carrera')) return 'r'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('targa') && t.includes('gts')) return 'targa_4_gts'  // must precede generic 'gts'
  if (t.includes('gts')) return 'gts'
  if (t.includes('targa')) return 'targa'
  if (t.includes('50th') || t.includes('anniversary')) return 'anniversary'
  if (t.includes('carrera t')) return 'carrera_t'  // must precede generic 'carrera'
  if (t.includes('carrera 4s')) return 'carrera_4s'
  if (t.includes('carrera s')) return 'carrera_s'
  if (t.includes('cabriolet') || t.includes('convertible') || t.includes('cabrio')) {
    return t.includes('carrera 4') ? 'carrera_4' : 'carrera_base'
  }
  if (t.includes('carrera 4')) return 'carrera_4'
  if (t.includes('carrera')) return 'carrera_base'

  return null
}

// ─── 992 (2019–present) ─────────────────────────────────────────────────────

function derive992(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()

  if (t.includes('gt3 rs')) return 'gt3_rs'
  if (t.includes('gt3 touring')) return 'gt3_touring'  // must precede generic 'gt3'
  if (t.includes('gt3')) return 'gt3'
  if (t.includes('sport classic')) return 'sport_classic'
  if (t.includes('dakar')) return 'dakar'
  if (t.includes('s/t')) return 'st'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('targa') && t.includes('gts')) return 'targa_4_gts'  // must precede generic 'gts'
  if (t.includes('gts')) return 'gts'
  if (t.includes('targa')) return 'targa'
  if (t.includes('carrera t')) return 'carrera_t'  // must precede generic 'carrera'
  if (t.includes('carrera 4s')) return 'carrera_4s'
  if (t.includes('carrera s')) return 'carrera_s'
  if (t.includes('cabriolet') || t.includes('convertible') || t.includes('cabrio')) {
    return t.includes('carrera 4') ? 'carrera_4' : 'carrera_base'
  }
  if (t.includes('carrera 4')) return 'carrera_4'
  if (t.includes('carrera')) return 'carrera_base'

  return null
}

// ─── Boxster / 718 Boxster ───────────────────────────────────────────────────

function deriveBoxster986(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('boxster s')) return 'boxster_s'
  if (t.includes('boxster')) return 'boxster_base'
  return null
}

function deriveBoxster987(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('spyder')) return 'boxster_spyder'
  if (t.includes('boxster s') || t.includes('gts')) return 'boxster_s'
  if (t.includes('boxster')) return 'boxster_base'
  return null
}

function deriveBoxster718(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('spyder')) return 'boxster_spyder'
  if (t.includes('gt4 rs')) return 'boxster_gt4_rs'  // 718 Boxster GT4 RS
  if (t.includes('gt4')) return 'boxster_gt4'          // 718 Boxster GT4
  if (t.includes('gts') || t.includes('boxster s') || t.includes('718 s')) return 'boxster_s'
  if (t.includes('boxster') || t.includes('718')) return 'boxster_base'
  return null
}

// ─── Cayman / 718 Cayman ────────────────────────────────────────────────────

function deriveCayman987(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('cayman r')) return 'cayman_r'
  if (t.includes('cayman s') || t.includes('gts')) return 'cayman_s'
  if (t.includes('cayman')) return 'cayman_base'
  return null
}

function deriveCayman718(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('gt4 rs')) return 'cayman_gt4_rs'
  if (t.includes('gt4')) return 'cayman_gt4'
  if (t.includes('gts') || t.includes('cayman s') || t.includes('718 s')) return 'cayman_s'
  if (t.includes('cayman') || t.includes('718')) return 'cayman_base'
  return null
}

// ─── Cayenne (2003–present) ──────────────────────────────────────────────────

function deriveCayenneI(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  if (t.includes('transsyberia')) return 'transsyberia'  // special edition before turbo_s
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('gts')) return 'gts'
  if (t.includes('diesel')) return 'diesel'
  if (t.includes('s')) return 's'
  if (t.includes('base')) return 'base'
  return null
}

function deriveCayenneII(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  // Turbo S E-Hybrid before Turbo S before Turbo; S Hybrid before S; S Diesel before Diesel
  if (t.includes('turbo s e-hybrid') || t.includes('turbo s ehybrid')) return 'turbo_s_e_hybrid'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('gts')) return 'gts'
  if (t.includes('e-hybrid') || t.includes('e hybrid')) return 'e_hybrid'
  if (t.includes('s hybrid')) return 's_hybrid'
  if (t.includes('s diesel')) return 's_diesel'
  if (t.includes('diesel')) return 'diesel'
  if (t.includes('s')) return 's'
  if (t.includes('base')) return 'base'
  return null
}

function deriveCayenneIII(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  // Coupé variants must be checked before generic trim names (longer match wins in comp engine)
  if (t.includes('turbo s e-hybrid') && t.includes('coup')) return 'turbo_s_e_hybrid_coupe'
  if (t.includes('turbo s e-hybrid') || t.includes('turbo s ehybrid')) return 'turbo_s_e_hybrid'
  if (t.includes('e-hybrid') && t.includes('coup')) return 'e_hybrid_coupe'
  if (t.includes('gts') && t.includes('coup')) return 'gts_coupe'
  // Turbo Coupé before generic Turbo; S Coupé before generic S
  if (t.includes('turbo') && t.includes('coup')) return 'turbo_coupe'
  if (t.includes('s') && t.includes('coup')) return 's_coupe'
  if (t.includes('coup')) return 'coupe'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo_base'
  if (t.includes('gts')) return 'gts'
  if (t.includes('e-hybrid') || t.includes('e hybrid')) return 'e_hybrid'
  if (t.includes('s')) return 's'
  if (t.includes('base')) return 'base'
  return null
}

// ─── Panamera (2010–present) ─────────────────────────────────────────────────

function derivePanameraI(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  // Turbo S E-Hybrid before Turbo S before Turbo; S Hybrid before S; 4S before 4
  if (t.includes('turbo s e-hybrid') || t.includes('turbo s ehybrid')) return 'turbo_s_e_hybrid'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo'
  if (t.includes('gts')) return 'gts'
  if (t.includes('4 e-hybrid') || t.includes('4_e-hybrid') || t.includes('4 ehybrid')) return 'awd_e_hybrid'
  if (t.includes('s hybrid')) return 's_hybrid'
  if (t.includes('executive')) return 'executive'
  if (t.includes('4s')) return 'awd_s'
  if (t === 's' || (t.includes('s') && !t.includes('4'))) return 'rwd_s'
  if (t.includes('4')) return 'awd_base'
  return 'rwd_base'
}

function derivePanameraII(trim: string): TrimCategory | null {
  const t = trim.toLowerCase()
  // Sport Turismo variants before sedan equivalents
  if ((t.includes('turbo s e-hybrid') || t.includes('turbo s ehybrid')) && t.includes('sport turismo')) return 'turbo_s_e_hybrid_st'
  if (t.includes('4 e-hybrid') && t.includes('sport turismo')) return 'awd_e_hybrid_st'
  if (t.includes('sport turismo')) return 'sport_turismo'
  if (t.includes('turbo s e-hybrid') || t.includes('turbo s ehybrid')) return 'turbo_s_e_hybrid'
  if (t.includes('turbo s')) return 'turbo_s'
  if (t.includes('turbo')) return 'turbo'
  if (t.includes('gts')) return 'gts'
  if (t.includes('4 e-hybrid') || t.includes('4_e-hybrid') || t.includes('4 ehybrid')) return 'awd_e_hybrid'
  if (t.includes('executive')) return 'executive'
  if (t.includes('4s')) return 'awd_s'
  if (t === 's' || (t.includes('s') && !t.includes('4') && !t.includes('turbo'))) return 'rwd_s'
  if (t.includes('4')) return 'awd_base'
  return 'rwd_base'
}
