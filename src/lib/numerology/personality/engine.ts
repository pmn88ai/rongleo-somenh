import type { PersonalityInput, PersonalityResult } from "@/lib/numerology/personality/types"
import { LETTER_VALUES, VOWELS }                     from "@/lib/core/numerology"
import { formatNumerologyResult }                     from "@/lib/core/numerology/formatNumerologyResult"

export function calculatePersonality(input: PersonalityInput): PersonalityResult {
  let total = 0
  for (const c of input.normalizedFullName.toUpperCase()) {
    if (!VOWELS.has(c)) {
      const v = LETTER_VALUES[c]
      if (v !== undefined) total += v
    }
  }
  return formatNumerologyResult(total)
}
