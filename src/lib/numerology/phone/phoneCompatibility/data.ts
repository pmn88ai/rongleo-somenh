// ─────────────────────────────────────────────────────────────────
//  Phone Compatibility Table
//
//  Keys are canonical pair strings: "${min}_${max}"
//  covering all 45 unique pairs from the set {1–9}.
//
//  Master numbers are normalized before lookup:
//    11 → 2 | 22 → 4 | 33 → 6
//
//  Score scale: 1–10
//
//  This table is local to phoneCompatibility.
//  Each engine owns its own data per AI_ARCHITECTURE_RULES.md.
// ─────────────────────────────────────────────────────────────────

export type PhoneCompatibilityEntry = {
  score: number
}

export const PHONE_COMPATIBILITY_TABLE: Record<string, PhoneCompatibilityEntry> = {
  // ── 1 pairs ────────────────────────────────────────────────────
  "1_1": { score: 7 },
  "1_2": { score: 6 },
  "1_3": { score: 9 },
  "1_4": { score: 5 },
  "1_5": { score: 8 },
  "1_6": { score: 6 },
  "1_7": { score: 8 },
  "1_8": { score: 7 },
  "1_9": { score: 5 },
  // ── 2 pairs ────────────────────────────────────────────────────
  "2_2": { score: 7 },
  "2_3": { score: 5 },
  "2_4": { score: 9 },
  "2_5": { score: 4 },
  "2_6": { score: 9 },
  "2_7": { score: 6 },
  "2_8": { score: 8 },
  "2_9": { score: 7 },
  // ── 3 pairs ────────────────────────────────────────────────────
  "3_3": { score: 8 },
  "3_4": { score: 4 },
  "3_5": { score: 7 },
  "3_6": { score: 8 },
  "3_7": { score: 5 },
  "3_8": { score: 5 },
  "3_9": { score: 9 },
  // ── 4 pairs ────────────────────────────────────────────────────
  "4_4": { score: 6 },
  "4_5": { score: 3 },
  "4_6": { score: 7 },
  "4_7": { score: 8 },
  "4_8": { score: 9 },
  "4_9": { score: 4 },
  // ── 5 pairs ────────────────────────────────────────────────────
  "5_5": { score: 5 },
  "5_6": { score: 4 },
  "5_7": { score: 7 },
  "5_8": { score: 6 },
  "5_9": { score: 8 },
  // ── 6 pairs ────────────────────────────────────────────────────
  "6_6": { score: 8 },
  "6_7": { score: 5 },
  "6_8": { score: 6 },
  "6_9": { score: 9 },
  // ── 7 pairs ────────────────────────────────────────────────────
  "7_7": { score: 7 },
  "7_8": { score: 4 },
  "7_9": { score: 6 },
  // ── 8 pairs ────────────────────────────────────────────────────
  "8_8": { score: 7 },
  "8_9": { score: 5 },
  // ── 9 pairs ────────────────────────────────────────────────────
  "9_9": { score: 8 },
}

// Master number normalization map: 11 → 2, 22 → 4, 33 → 6
export const MASTER_NUMBER_NORMALIZATION: Record<number, number> = {
  11: 2,
  22: 4,
  33: 6,
}
