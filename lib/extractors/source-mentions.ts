/**
 * V1 regex/keyword extractor for source-mention signals.
 *
 * Operates on listing text at fetch time. Returns structured booleans + source citations.
 * Raw text is NOT stored — extract → set boolean → discard text.
 *
 * Phase 2 will replace these regexes with AI extraction over the same text,
 * with the same discard-after-extraction rule.
 *
 * DISPLAY RULE (enforceable in code review):
 *   Never display these signals as Project Vintage assertions.
 *   Always frame as "Source mentions: [signal]" on the subject page.
 *   On comp listings: icon/label only, linking to source for verification.
 */

export interface SourceMentionSignals {
  mentioned_repaint: boolean | null
  mentioned_accident_history: boolean | null
  mentioned_engine_service: boolean | null
  mentioned_transmission_service: boolean | null
  mentioned_matching_numbers: boolean | null
  mentioned_modifications: boolean | null
  mentioned_recent_ppi: boolean | null
  mentioned_original_owner: boolean | null
}

export interface SourceMentionResult extends SourceMentionSignals {
  /** Publication name + URL concatenated as "Name|URL" for DB storage. */
  source_citation: string
}

const PATTERNS = {
  repaint: [
    /\brepaint(ed)?\b/i,
    /\brespray(ed)?\b/i,
    /\bfresh\s+paint\b/i,
    /\bnew\s+paint\b/i,
    /\bpaint\s+correction\b/i,
    /\bpaint\s+work\b/i,
    /\bcolor\s+change\b/i,
    /\brepainted\s+in\b/i,
  ],
  accident_history: [
    /\baccident[- ]free\b/i,
    /\bno\s+accidents?\b/i,
    /\bno\s+stories\b/i,
    /\bclean\s+carfax\b/i,
    /\bno\s+accidents?\s+reported\b/i,
    /\baccident\s+history\b/i,
    /\bhas\s+been\s+in\s+an?\s+accident\b/i,
    /\bminor\s+(collision|fender|damage)\b/i,
  ],
  engine_service: [
    /\bengine\s+(rebuild|rebuilt|overhauled|service|serviced|work)\b/i,
    /\btop[\s-]end\s+(rebuild|refresh|service)\b/i,
    /\bengine\s+out\b/i,
    /\bIMS\s+(bearing|replacement|retrofit)\b/i,
    /\bRMS\s+(replacement|replaced|done)\b/i,
    /\bbore\s+scor(ing|ed)\b/i,
    /\bengine\s+replacement\b/i,
    /\bfresh\s+engine\b/i,
  ],
  transmission_service: [
    /\btransmission\s+(rebuild|rebuilt|service|serviced|replaced|replacement)\b/i,
    /\bgearbox\s+(rebuild|rebuilt|service|serviced|replaced)\b/i,
    /\bclutch\s+(replaced|replacement|new|fresh)\b/i,
    /\bflywheel\s+(replaced|replacement)\b/i,
    /\bPDK\s+service\b/i,
    /\btiptronic\s+service\b/i,
  ],
  matching_numbers: [
    /\bmatching[\s-]numbers?\b/i,
    /\bnumbers?[\s-]matching\b/i,
    /\boriginal\s+(engine|motor|numbers?)\b/i,
    /\bKardex\s+confirms?\b/i,
    /\bCOA\s+confirms?\b/i,
    /\bmatching\s+engine\b/i,
  ],
  modifications: [
    /\bmodified\b/i,
    /\baftermarket\b/i,
    /\bupgrades?\b/i,
    /\btune(d)?\b/i,
    /\bcustom\b/i,
    /\bnon[\s-]stock\b/i,
    /\bnon[\s-]factory\b/i,
    /\bperformance\s+(upgrade|part|modification)\b/i,
  ],
  recent_ppi: [
    /\bPPI\b/,
    /\bpre[\s-]purchase\s+inspection\b/i,
    /\brecent\s+inspection\b/i,
    /\binspected\s+by\b/i,
    /\bpassed\s+(inspection|PPI)\b/i,
  ],
  original_owner: [
    /\boriginal\s+owner\b/i,
    /\bfirst\s+owner\b/i,
    /\bone[\s-]owner\b/i,
    /\bsingle[\s-]owner\b/i,
    /\bfrom\s+new\b/i,
    /\bsince\s+new\b/i,
    /\boriginal\s+purchaser\b/i,
  ],
} as const

function matchesAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((re) => re.test(text))
}

/**
 * Extract source-mention signals from listing text.
 *
 * @param text - The raw source text (listing description, seller copy, etc.)
 * @param sourcePublication - Human-readable publication name (e.g., "Bring a Trailer")
 * @param sourceUrl - The listing URL for citation linking
 * @returns Structured signals. Raw text is not stored by this function.
 */
export function extractSourceMentions(
  text: string,
  sourcePublication: string,
  sourceUrl: string,
): SourceMentionResult {
  const mentioned_repaint = matchesAny(text, PATTERNS.repaint) ? true : null
  const mentioned_accident_history = matchesAny(text, PATTERNS.accident_history) ? true : null
  const mentioned_engine_service = matchesAny(text, PATTERNS.engine_service) ? true : null
  const mentioned_transmission_service = matchesAny(text, PATTERNS.transmission_service) ? true : null
  const mentioned_matching_numbers = matchesAny(text, PATTERNS.matching_numbers) ? true : null
  const mentioned_modifications = matchesAny(text, PATTERNS.modifications) ? true : null
  const mentioned_recent_ppi = matchesAny(text, PATTERNS.recent_ppi) ? true : null
  const mentioned_original_owner = matchesAny(text, PATTERNS.original_owner) ? true : null

  return {
    mentioned_repaint,
    mentioned_accident_history,
    mentioned_engine_service,
    mentioned_transmission_service,
    mentioned_matching_numbers,
    mentioned_modifications,
    mentioned_recent_ppi,
    mentioned_original_owner,
    source_citation: `${sourcePublication}|${sourceUrl}`,
  }
}

/** Maps a SourcePlatform slug to a human-readable publication name. */
export function platformToPublication(platform: string): string {
  const map: Record<string, string> = {
    'bring-a-trailer': 'Bring a Trailer',
    'cars-and-bids': 'Cars & Bids',
    'pcarmarket': 'PCarMarket',
    'rm-sothebys': 'RM Sotheby\'s',
    'gooding': 'Gooding & Company',
    'mecum': 'Mecum',
    'collecting-cars': 'Collecting Cars',
    'hemmings': 'Hemmings',
    'bonhams': 'Bonhams',
    'barrett-jackson': 'Barrett-Jackson',
  }
  return map[platform] ?? platform
}
