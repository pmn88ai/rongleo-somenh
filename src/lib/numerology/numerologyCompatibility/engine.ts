import type { NumerologyCompatibilityInput, NumerologyCompatibilityResult, CompatibilityLabel } from "@/lib/numerology/numerologyCompatibility/types"
import { NUMEROLOGY_COMPATIBILITY_TABLE } from "@/lib/numerology/numerologyCompatibility/data"

function toLabel(score: number): CompatibilityLabel {
  if (score >= 8) return "Rất tốt"
  if (score >= 6) return "Tốt"
  if (score >= 4) return "Trung bình"
  return "Kém"
}

export function calculateNumerologyCompatibility(
  input: NumerologyCompatibilityInput
): NumerologyCompatibilityResult {
  const { baseNumberA, baseNumberB } = input

  if (baseNumberA < 1 || baseNumberA > 9) {
    throw new Error(`Invalid baseNumberA: ${baseNumberA}. Must be between 1 and 9.`)
  }
  if (baseNumberB < 1 || baseNumberB > 9) {
    throw new Error(`Invalid baseNumberB: ${baseNumberB}. Must be between 1 and 9.`)
  }

  const min = Math.min(baseNumberA, baseNumberB)
  const max = Math.max(baseNumberA, baseNumberB)
  const key = `${min}_${max}`

  const entry = NUMEROLOGY_COMPATIBILITY_TABLE[key]

  if (entry === undefined) {
    throw new Error(`No compatibility entry found for pair: ${key}`)
  }

  return {
    compatibilityScore: entry.score,
    compatibilityLabel: toLabel(entry.score),
    isComplementary:    entry.isComplementary,
  }
}
