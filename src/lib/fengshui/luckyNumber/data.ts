// ─────────────────────────────────────────────────────────────────
//  Kua Lucky Number Table
//
//  Keyed by kuaNumber (1–9, excluding 5).
//  Kua 5 is remapped by the upstream kuaNumber engine:
//    male   → 2
//    female → 8
//  so kuaNumber 5 will never reach this table.
//
//  luckyNumber:  primary auspicious number for this kua
//  luckyNumbers: full set of auspicious numbers, most to least lucky
//
//  Source: Ba Trạch / Eight Mansions Feng Shui tradition.
// ─────────────────────────────────────────────────────────────────

export type KuaLuckyEntry = {
  luckyNumber:  number
  luckyNumbers: number[]
}

export const KUA_LUCKY_NUMBER_TABLE: Record<number, KuaLuckyEntry> = {
  1: { luckyNumber: 1, luckyNumbers: [1, 6, 7, 8] },
  2: { luckyNumber: 2, luckyNumbers: [2, 7, 5, 6] },
  3: { luckyNumber: 3, luckyNumbers: [3, 4, 9, 1] },
  4: { luckyNumber: 4, luckyNumbers: [4, 3, 1, 9] },
  6: { luckyNumber: 6, luckyNumbers: [6, 7, 2, 8] },
  7: { luckyNumber: 7, luckyNumbers: [7, 6, 8, 2] },
  8: { luckyNumber: 8, luckyNumbers: [8, 7, 6, 2] },
  9: { luckyNumber: 9, luckyNumbers: [9, 1, 3, 4] },
}
