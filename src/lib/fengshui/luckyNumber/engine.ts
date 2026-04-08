import type { LuckyNumberInput, LuckyNumberResult } from "@/lib/fengshui/luckyNumber/types"
import { KUA_LUCKY_NUMBER_TABLE } from "@/lib/fengshui/luckyNumber/data"

export function calculateLuckyNumber(
  input: LuckyNumberInput
): LuckyNumberResult {
  const { kuaNumber } = input

  const entry = KUA_LUCKY_NUMBER_TABLE[kuaNumber]

  if (entry === undefined) {
    throw new Error(
      `No lucky number entry for kuaNumber: ${kuaNumber}. ` +
      `Valid values are 1, 2, 3, 4, 6, 7, 8, 9.`
    )
  }

  return {
    luckyNumber:  entry.luckyNumber,
    luckyNumbers: entry.luckyNumbers,
  }
}
