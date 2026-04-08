import { LETTER_VALUES } from "@/lib/core/numerology"
import type { HiddenPassionInput, HiddenPassionResult } from "@/lib/numerology/hiddenPassion/types"

const BASE_NUMBERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function calculateHiddenPassion(input: HiddenPassionInput): HiddenPassionResult {
  const letters = input.normalizedFullName
    .split("")
    .filter((c): c is string => LETTER_VALUES[c] !== undefined)

  if (letters.length === 0) {
    return { dominantDigits: [], frequency: 0, digitCounts: {} }
  }

  const digitCounts: Record<number, number> = {}

  for (const letter of letters) {
    const digit = LETTER_VALUES[letter]
    digitCounts[digit] = (digitCounts[digit] ?? 0) + 1
  }

  let maxFreq = 0
  for (const d of BASE_NUMBERS) {
    const count = digitCounts[d] ?? 0
    if (count > maxFreq) maxFreq = count
  }

  const dominantDigits: number[] = []
  for (const d of BASE_NUMBERS) {
    if ((digitCounts[d] ?? 0) === maxFreq) dominantDigits.push(d)
  }

  return { dominantDigits, frequency: maxFreq, digitCounts }
}
