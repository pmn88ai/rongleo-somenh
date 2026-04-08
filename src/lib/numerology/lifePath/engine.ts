import type { LifePathInput, LifePathResult }   from "@/lib/numerology/lifePath/types"
import { reducePlain }                           from "@/lib/core/numerology"
import { formatNumerologyResult }                from "@/lib/core/numerology/formatNumerologyResult"

export function calculateLifePath(input: LifePathInput): LifePathResult {
  const total = reducePlain(input.birthYear) + reducePlain(input.birthMonth) + reducePlain(input.birthDay)
  return formatNumerologyResult(total)
}
