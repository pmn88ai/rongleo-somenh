import type { PersonalYearInput, PersonalYearResult } from "@/lib/numerology/personalYear/types"
import { reducePlain }                                 from "@/lib/core/numerology"
import { formatNumerologyResult }                      from "@/lib/core/numerology/formatNumerologyResult"

export function calculatePersonalYear(input: PersonalYearInput): PersonalYearResult {
  const total = reducePlain(input.birthMonth) + reducePlain(input.birthDay) + reducePlain(input.currentYear)
  return formatNumerologyResult(total)
}
