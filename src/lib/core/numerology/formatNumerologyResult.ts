import { reduceNumber } from "@/lib/core/numerology/reduceNumber"
import { sumDigits }    from "@/lib/core/numerology/sumDigits"

export type NumerologyResult = {
  baseNumber:    number
  masterNumber?: number
}

export function formatNumerologyResult(total: number): NumerologyResult {
  const result = reduceNumber(total)
  if (result.masterNumber !== undefined) {
    return {
      masterNumber: result.masterNumber,
      baseNumber:   sumDigits(result.masterNumber),
    }
  }
  return { baseNumber: result.baseNumber }
}
