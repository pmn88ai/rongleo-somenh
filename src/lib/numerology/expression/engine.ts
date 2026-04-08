import type { ExpressionInput, ExpressionResult } from "@/lib/numerology/expression/types"
import { LETTER_VALUES }                           from "@/lib/core/numerology"
import { formatNumerologyResult }                  from "@/lib/core/numerology/formatNumerologyResult"

export function calculateExpression(input: ExpressionInput): ExpressionResult {
  let total = 0
  for (const c of input.normalizedFullName) {
    const v = LETTER_VALUES[c]
    if (v !== undefined) total += v
  }
  return formatNumerologyResult(total)
}
