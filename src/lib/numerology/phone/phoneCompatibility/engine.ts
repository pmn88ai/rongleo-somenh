import type { PhoneCompatibilityInput, PhoneCompatibilityResult, PhoneCompatibilityLabel } from "@/lib/numerology/phone/phoneCompatibility/types"
import { PHONE_COMPATIBILITY_TABLE, MASTER_NUMBER_NORMALIZATION } from "@/lib/numerology/phone/phoneCompatibility/data"

function normalize(n: number): number {
  return MASTER_NUMBER_NORMALIZATION[n] ?? n
}

function toLabel(score: number): PhoneCompatibilityLabel {
  if (score >= 8) return "Rất tốt"
  if (score >= 6) return "Tốt"
  if (score >= 4) return "Trung bình"
  return "Kém"
}

export function calculatePhoneCompatibility(
  input: PhoneCompatibilityInput
): PhoneCompatibilityResult {
  const { phoneLifePathA, phoneLifePathB } = input

  const normalizedA = normalize(phoneLifePathA)
  const normalizedB = normalize(phoneLifePathB)

  if (normalizedA < 1 || normalizedA > 9) {
    throw new Error(`Invalid phoneLifePathA after normalization: ${normalizedA}. Must be 1–9 or master number.`)
  }
  if (normalizedB < 1 || normalizedB > 9) {
    throw new Error(`Invalid phoneLifePathB after normalization: ${normalizedB}. Must be 1–9 or master number.`)
  }

  const min = Math.min(normalizedA, normalizedB)
  const max = Math.max(normalizedA, normalizedB)
  const key = `${min}_${max}`

  const entry = PHONE_COMPATIBILITY_TABLE[key]

  if (entry === undefined) {
    throw new Error(`No compatibility entry found for pair: ${key}`)
  }

  return {
    compatibilityScore: entry.score,
    compatibilityLabel: toLabel(entry.score),
    isHarmonic:         entry.score >= 8,
  }
}
