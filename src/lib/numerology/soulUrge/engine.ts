import type { SoulUrgeInput, SoulUrgeResult }  from "@/lib/numerology/soulUrge/types"
import { LETTER_VALUES, VOWELS }               from "@/lib/core/numerology"
import { formatNumerologyResult }               from "@/lib/core/numerology/formatNumerologyResult"

export function calculateSoulUrge(input: SoulUrgeInput): SoulUrgeResult {
  let total = 0
  for (const c of input.normalizedFullName.toUpperCase()) {
    if (VOWELS.has(c)) {
      const v = LETTER_VALUES[c]
      if (v !== undefined) total += v
    }
  }
  return formatNumerologyResult(total)
}
