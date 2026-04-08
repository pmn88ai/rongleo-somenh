// ─────────────────────────────────────────────────────────────────
//  Numerology Compatibility Table
//
//  Keys are canonical pair strings: "${min}_${max}"
//  covering all 45 unique pairs from the set {1–9}.
//
//  Score scale: 1–10
//  isComplementary: true for traditionally harmonious pairings
//
//  Sources: Vietnamese numerology tradition + Pythagorean
//  compatibility principles.
// ─────────────────────────────────────────────────────────────────

export type CompatibilityEntry = {
  score:           number
  isComplementary: boolean
}

export const NUMEROLOGY_COMPATIBILITY_TABLE: Record<string, CompatibilityEntry> = {
  // ── 1 pairs ────────────────────────────────────────────────────
  "1_1": { score: 7,  isComplementary: false },
  "1_2": { score: 6,  isComplementary: false },
  "1_3": { score: 9,  isComplementary: true  },
  "1_4": { score: 5,  isComplementary: false },
  "1_5": { score: 8,  isComplementary: true  },
  "1_6": { score: 6,  isComplementary: false },
  "1_7": { score: 8,  isComplementary: true  },
  "1_8": { score: 7,  isComplementary: false },
  "1_9": { score: 5,  isComplementary: false },
  // ── 2 pairs ────────────────────────────────────────────────────
  "2_2": { score: 7,  isComplementary: false },
  "2_3": { score: 5,  isComplementary: false },
  "2_4": { score: 9,  isComplementary: true  },
  "2_5": { score: 4,  isComplementary: false },
  "2_6": { score: 9,  isComplementary: true  },
  "2_7": { score: 6,  isComplementary: false },
  "2_8": { score: 8,  isComplementary: true  },
  "2_9": { score: 7,  isComplementary: false },
  // ── 3 pairs ────────────────────────────────────────────────────
  "3_3": { score: 8,  isComplementary: true  },
  "3_4": { score: 4,  isComplementary: false },
  "3_5": { score: 7,  isComplementary: false },
  "3_6": { score: 8,  isComplementary: true  },
  "3_7": { score: 5,  isComplementary: false },
  "3_8": { score: 5,  isComplementary: false },
  "3_9": { score: 9,  isComplementary: true  },
  // ── 4 pairs ────────────────────────────────────────────────────
  "4_4": { score: 6,  isComplementary: false },
  "4_5": { score: 3,  isComplementary: false },
  "4_6": { score: 7,  isComplementary: false },
  "4_7": { score: 8,  isComplementary: true  },
  "4_8": { score: 9,  isComplementary: true  },
  "4_9": { score: 4,  isComplementary: false },
  // ── 5 pairs ────────────────────────────────────────────────────
  "5_5": { score: 5,  isComplementary: false },
  "5_6": { score: 4,  isComplementary: false },
  "5_7": { score: 7,  isComplementary: false },
  "5_8": { score: 6,  isComplementary: false },
  "5_9": { score: 8,  isComplementary: true  },
  // ── 6 pairs ────────────────────────────────────────────────────
  "6_6": { score: 8,  isComplementary: true  },
  "6_7": { score: 5,  isComplementary: false },
  "6_8": { score: 6,  isComplementary: false },
  "6_9": { score: 9,  isComplementary: true  },
  // ── 7 pairs ────────────────────────────────────────────────────
  "7_7": { score: 7,  isComplementary: false },
  "7_8": { score: 4,  isComplementary: false },
  "7_9": { score: 6,  isComplementary: false },
  // ── 8 pairs ────────────────────────────────────────────────────
  "8_8": { score: 7,  isComplementary: false },
  "8_9": { score: 5,  isComplementary: false },
  // ── 9 pairs ────────────────────────────────────────────────────
  "9_9": { score: 8,  isComplementary: true  },
}
