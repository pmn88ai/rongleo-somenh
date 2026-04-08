import type { BirthdayInput, BirthdayResult } from "@/lib/numerology/birthday/types"
import { formatNumerologyResult }              from "@/lib/core/numerology/formatNumerologyResult"

export function calculateBirthday(input: BirthdayInput): BirthdayResult {
  return formatNumerologyResult(input.birthDay)
}
