import type { ChineseAgeCalculationInput, ChineseAgeCalculationResult } from "@/lib/demographics/chineseAgeCalculation/types"
import { CHINESE_NEW_YEAR } from "@/lib/demographics/chineseAgeCalculation/data"

// ─────────────────────────────────────────────────────────────────
//  Build a zero-padded "YYYY-MM-DD" string from numeric parts.
//  Used for lexicographic date comparison without a Date object.
// ─────────────────────────────────────────────────────────────────
function toDateString(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

export function calculateChineseAge(
  input: ChineseAgeCalculationInput
): ChineseAgeCalculationResult {
  const { birthYear, currentYear, currentMonth, currentDay } = input

  if (currentYear < birthYear) {
    throw new Error(
      `currentYear (${currentYear}) must be >= birthYear (${birthYear})`
    )
  }

  const lunarNewYearStr = CHINESE_NEW_YEAR[currentYear]

  if (lunarNewYearStr === undefined) {
    throw new Error(
      `No Lunar New Year date found for year: ${currentYear}. ` +
      `Supported range is 1900–2100.`
    )
  }

  const currentDateStr = toDateString(currentYear, currentMonth, currentDay)

  // Lexicographic comparison is safe for zero-padded "YYYY-MM-DD" strings.
  // If current date has already reached or passed Lunar New Year:
  //   chineseAge = currentYear - birthYear + 1
  // If current date is still before Lunar New Year:
  //   chineseAge = currentYear - birthYear
  const passedLunarNewYear = currentDateStr >= lunarNewYearStr
  const chineseAge = passedLunarNewYear
    ? currentYear - birthYear + 1
    : currentYear - birthYear

  return { chineseAge }
}
