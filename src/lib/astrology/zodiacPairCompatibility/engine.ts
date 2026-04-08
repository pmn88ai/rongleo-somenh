import type { ZodiacPairCompatibilityInput, ZodiacPairCompatibilityResult, ZodiacRelationship, CompatibilityTier } from "@/lib/astrology/zodiacPairCompatibility/types"
import { ZODIAC_ORDER, ZODIAC_PAIR_TABLE } from "@/lib/astrology/zodiacPairCompatibility/data"

function toTier(relationship: ZodiacRelationship): CompatibilityTier {
  if (relationship === "Tam Hợp" || relationship === "Lục Hợp") return "Tốt"
  if (relationship === "Tứ Hành Xung") return "Xung"
  return "Trung bình"
}

export function calculateZodiacPairCompatibility(
  input: ZodiacPairCompatibilityInput
): ZodiacPairCompatibilityResult {
  const { animalA, animalB } = input

  const indexA = ZODIAC_ORDER.indexOf(animalA)
  const indexB = ZODIAC_ORDER.indexOf(animalB)

  if (indexA === -1) {
    throw new Error(`Unknown zodiac animal: "${animalA}"`)
  }
  if (indexB === -1) {
    throw new Error(`Unknown zodiac animal: "${animalB}"`)
  }

  const min = Math.min(indexA, indexB)
  const max = Math.max(indexA, indexB)
  const key = `${min}_${max}`

  const entry = ZODIAC_PAIR_TABLE[key]
  const relationship: ZodiacRelationship = entry?.relationship ?? "Trung lập"

  return {
    relationship,
    compatibilityTier: toTier(relationship),
    isHarmonic: relationship === "Tam Hợp" || relationship === "Lục Hợp",
    isConflict: relationship === "Tứ Hành Xung",
  }
}
