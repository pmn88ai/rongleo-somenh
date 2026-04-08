import type { PhoneDominantNumberInput, PhoneDominantNumberResult } from "@/lib/numerology/phone/phoneDominantNumber/types"

const ALL_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

export function calculatePhoneDominantNumber(
  input: PhoneDominantNumberInput
): PhoneDominantNumberResult {
  const { frequency } = input

  let maxFrequency = 0

  for (const digit of ALL_DIGITS) {
    const count = frequency[digit] ?? 0
    if (count > maxFrequency) {
      maxFrequency = count
    }
  }

  if (maxFrequency === 0) {
    throw new Error("phoneDominantNumber: frequency map contains no digit occurrences.")
  }

  const dominantDigits: number[] = []

  for (const digit of ALL_DIGITS) {
    if ((frequency[digit] ?? 0) === maxFrequency) {
      dominantDigits.push(parseInt(digit, 10))
    }
  }

  return {
    dominantDigits,
    dominantFrequency: maxFrequency,
  }
}
