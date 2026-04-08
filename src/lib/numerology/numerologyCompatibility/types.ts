export type CompatibilityLabel = "Rất tốt" | "Tốt" | "Trung bình" | "Kém"

export type NumerologyCompatibilityInput = {
  baseNumberA: number // lifePath.baseNumber of person A (1–9)
  baseNumberB: number // lifePath.baseNumber of person B (1–9)
}

export type NumerologyCompatibilityResult = {
  compatibilityScore: number             // 1–10 scale
  compatibilityLabel: CompatibilityLabel // derived from score bands
  isComplementary:    boolean            // true if pair is a known harmonious pairing
}
