import type { PersonalDayInput, PersonalDayResult } from "@/lib/numerology/personalDay/types"
import { reducePlain }                               from "@/lib/core/numerology"
import { formatNumerologyResult }                    from "@/lib/core/numerology/formatNumerologyResult"

export function calculatePersonalDay(input: PersonalDayInput): PersonalDayResult {
  return formatNumerologyResult(input.personalMonthBase + reducePlain(input.currentDay))
}
