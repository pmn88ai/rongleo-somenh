export type PhoneCompatibilityLabel = "Rất tốt" | "Tốt" | "Trung bình" | "Kém"

export type PhoneCompatibilityInput = {
  phoneLifePathA: number // phoneLifePath.phoneLifePath of phone A (1–9, 11, 22, 33)
  phoneLifePathB: number // phoneLifePath.phoneLifePath of phone B (1–9, 11, 22, 33)
}

export type PhoneCompatibilityResult = {
  compatibilityScore: number                 // 1–10 scale
  compatibilityLabel: PhoneCompatibilityLabel
  isHarmonic:         boolean                // true if score ≥ 8
}
