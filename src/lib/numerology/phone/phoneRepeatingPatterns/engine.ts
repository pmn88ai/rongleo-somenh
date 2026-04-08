import type { PhoneRepeatingPatternsInput, PhoneRepeatingPatternsResult, RepeatingEntry } from "@/lib/numerology/phone/phoneRepeatingPatterns/types"

const ALL_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

export function calculatePhoneRepeatingPatterns(
  input: PhoneRepeatingPatternsInput
): PhoneRepeatingPatternsResult {
  const { frequency } = input

  const repeatingDigits: RepeatingEntry[] = []

  for (const digit of ALL_DIGITS) {
    const occurrences = frequency[digit] ?? 0
    if (occurrences >= 2) {
      repeatingDigits.push({
        digit: parseInt(digit, 10),
        occurrences,
      })
    }
  }

  return {
    repeatingDigits,
    repeatingCount: repeatingDigits.length,
  }
}
