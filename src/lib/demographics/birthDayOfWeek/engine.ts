import type { BirthDayOfWeekInput, BirthDayOfWeekResult } from "@/lib/demographics/birthDayOfWeek/types"
import { DAY_OF_WEEK_TABLE } from "@/lib/demographics/birthDayOfWeek/data"

// ─────────────────────────────────────────────────────────────────
//  Tomohiko Sakamoto's algorithm
//
//  Computes the day of the week (0=Sunday … 6=Saturday) for any
//  valid Gregorian date using pure integer arithmetic.
//  No Date object, no external libraries, fully deterministic.
//
//  Reference: Tomohiko Sakamoto, 1993
// ─────────────────────────────────────────────────────────────────

// Month offset table used by Sakamoto's algorithm (index 0 = January)
const MONTH_OFFSET = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4] as const

function sakamoto(year: number, month: number, day: number): number {
  // For January and February, treat as months 13 and 14 of previous year
  const y = month < 3 ? year - 1 : year
  return (
    y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) +
    MONTH_OFFSET[month - 1] +
    day
  ) % 7
}

export function calculateBirthDayOfWeek(
  input: BirthDayOfWeekInput
): BirthDayOfWeekResult {
  const { birthYear, birthMonth, birthDay } = input

  if (birthMonth < 1 || birthMonth > 12) {
    throw new Error(`Invalid birthMonth: ${birthMonth}. Must be 1–12.`)
  }
  if (birthDay < 1 || birthDay > 31) {
    throw new Error(`Invalid birthDay: ${birthDay}. Must be 1–31.`)
  }

  const dayIndex = sakamoto(birthYear, birthMonth, birthDay)

  const entry = DAY_OF_WEEK_TABLE[dayIndex]

  if (entry === undefined) {
    throw new Error(`Unexpected dayIndex: ${dayIndex}. Must be 0–6.`)
  }

  return {
    dayIndex,
    dayNameEnglish:    entry.dayNameEnglish,
    dayNameVietnamese: entry.dayNameVietnamese,
  }
}
