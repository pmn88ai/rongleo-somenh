import type { MaturityInput, MaturityResult } from "@/lib/numerology/maturity/types"
import { formatNumerologyResult }              from "@/lib/core/numerology/formatNumerologyResult"

export function calculateMaturity(input: MaturityInput): MaturityResult {
  return formatNumerologyResult(input.lifePathBase + input.expressionBase)
}
