import type { PersonalMonthInput, PersonalMonthResult } from "@/lib/numerology/personalMonth/types"
import { reducePlain }                                   from "@/lib/core/numerology"
import { formatNumerologyResult }                        from "@/lib/core/numerology/formatNumerologyResult"

export function calculatePersonalMonth(input: PersonalMonthInput): PersonalMonthResult {
  return formatNumerologyResult(input.personalYearBase + reducePlain(input.currentMonth))
}
