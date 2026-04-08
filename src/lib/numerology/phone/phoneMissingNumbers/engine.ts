import type { PhoneMissingNumbersInput, PhoneMissingNumbersResult } from "@/lib/numerology/phone/phoneMissingNumbers/types"

const ALL_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

export function calculatePhoneMissingNumbers(
  input: PhoneMissingNumbersInput
): PhoneMissingNumbersResult {
  const { frequency } = input

  const missingDigits: number[] = []

  for (const digit of ALL_DIGITS) {
    if ((frequency[digit] ?? 0) === 0) {
      missingDigits.push(parseInt(digit, 10))
    }
  }

  return {
    missingDigits,
    missingCount: missingDigits.length,
  }
}
