import { reduceNumber, LETTER_VALUES } from "@/lib/core/numerology"
import type { BalanceNumberInput, BalanceNumberResult } from "@/lib/numerology/balanceNumber/types"

export function calculateBalanceNumber(input: BalanceNumberInput): BalanceNumberResult {
  const words = input.normalizedFullName.split(" ").filter(w => w.length > 0)

  if (words.length === 0) {
    throw new Error("BalanceNumber: normalizedFullName must not be empty")
  }

  const rawSum = words.reduce((sum, word) => {
    const value = LETTER_VALUES[word[0]]
    return sum + (value !== undefined ? value : 0)
  }, 0)

  if (rawSum === 0) {
    throw new Error("BalanceNumber: no initial letters could be mapped to a numerology value")
  }

  const result = reduceNumber(rawSum)

  if (result.masterNumber !== undefined) {
    return { baseNumber: result.baseNumber, masterNumber: result.masterNumber }
  }
  return { baseNumber: result.baseNumber }
}
