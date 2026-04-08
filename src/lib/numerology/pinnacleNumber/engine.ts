import { reduceNumber, reducePlain } from "@/lib/core/numerology"
import type { PinnacleNumberInput, PinnacleNumberResult, PinnacleValue } from "@/lib/numerology/pinnacleNumber/types"

function toPinnacleValue(n: number): PinnacleValue {
  const result = reduceNumber(n)
  if (result.masterNumber !== undefined) {
    return { baseNumber: result.baseNumber, masterNumber: result.masterNumber }
  }
  return { baseNumber: result.baseNumber }
}

export function calculatePinnacleNumber(input: PinnacleNumberInput): PinnacleNumberResult {
  const reducedMonth = reducePlain(input.birthMonth)
  const reducedDay   = reducePlain(input.birthDay)
  const reducedYear  = reducePlain(input.birthYear)

  const rawP1 = reducedMonth + reducedDay
  const rawP2 = reducedDay   + reducedYear
  const rawP3 = rawP1        + rawP2
  const rawP4 = reducedMonth + reducedYear

  return {
    pinnacle1: toPinnacleValue(rawP1),
    pinnacle2: toPinnacleValue(rawP2),
    pinnacle3: toPinnacleValue(rawP3),
    pinnacle4: toPinnacleValue(rawP4),
  }
}
