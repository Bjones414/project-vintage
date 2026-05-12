// Auction codes for 2023–2026. Format: 2-letter location + 2-digit year.
// Confirmed from /en/results for 2026: az, mc, mi, pa, cc, mw, mf, as.
// Additional codes (am, ny, lo, mu) estimated from known RM event history.
// endDate: ISO 8601 date of the final auction session. Null = unconfirmed.
// Ordered oldest-first so partial runs produce usable comp history.

export interface RmAuction {
  code: string;
  endDate: string | null;
}

export const RM_AUCTIONS: readonly RmAuction[] = [
  // ── 2023 ──────────────────────────────────────────────────────────────────
  { code: 'az23', endDate: '2023-01-21' }, // Scottsdale
  { code: 'am23', endDate: '2023-03-11' }, // Amelia Island
  { code: 'pa23', endDate: null },          // Paris
  { code: 'mc23', endDate: '2023-05-13' }, // Monaco
  { code: 'mi23', endDate: null },          // Milan / other
  { code: 'lo23', endDate: null },          // London/Battersea
  { code: 'cc23', endDate: null },
  { code: 'mw23', endDate: null },
  { code: 'mf23', endDate: null },
  { code: 'as23', endDate: null },
  { code: 'ny23', endDate: '2023-12-09' }, // New York
  { code: 'mu23', endDate: null },          // Munich
  // ── 2024 ──────────────────────────────────────────────────────────────────
  { code: 'az24', endDate: '2024-01-21' }, // Scottsdale
  { code: 'am24', endDate: '2024-03-09' }, // Amelia Island
  { code: 'pa24', endDate: null },          // Paris
  { code: 'mc24', endDate: '2024-05-04' }, // Monaco
  { code: 'mi24', endDate: null },
  { code: 'lo24', endDate: null },
  { code: 'cc24', endDate: null },
  { code: 'mw24', endDate: null },
  { code: 'mf24', endDate: null },
  { code: 'as24', endDate: null },
  { code: 'ny24', endDate: '2024-12-07' }, // New York
  { code: 'mu24', endDate: null },
  // ── 2025 ──────────────────────────────────────────────────────────────────
  { code: 'az25', endDate: '2025-01-18' }, // Scottsdale
  { code: 'am25', endDate: '2025-03-07' }, // Amelia Island
  { code: 'pa25', endDate: null },
  { code: 'mc25', endDate: '2025-05-10' }, // Monaco
  { code: 'mi25', endDate: null },
  { code: 'lo25', endDate: null },
  { code: 'cc25', endDate: null },
  { code: 'mw25', endDate: null },
  { code: 'mf25', endDate: null },
  { code: 'as25', endDate: null },
  { code: 'ny25', endDate: '2025-12-06' }, // New York
  { code: 'mu25', endDate: null },
  // ── 2026 — confirmed from /en/results ─────────────────────────────────────
  { code: 'az26', endDate: '2026-01-25' }, // Scottsdale — confirmed
  { code: 'mc26', endDate: null },
  { code: 'mi26', endDate: null },
  { code: 'pa26', endDate: null },
  { code: 'cc26', endDate: null },
  { code: 'mw26', endDate: null },
  { code: 'mf26', endDate: null },
  { code: 'as26', endDate: null },
];

export const RM_AUCTION_CODES: readonly string[] = RM_AUCTIONS.map(a => a.code);

const DATE_BY_CODE = new Map(RM_AUCTIONS.map(a => [a.code, a.endDate]));

export function auctionEndDate(code: string): string | null {
  return DATE_BY_CODE.get(code.toLowerCase()) ?? null;
}
