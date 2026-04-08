import type { ZodiacInput, ZodiacResult } from "@/lib/astrology/westernZodiac/types"
import { ZODIAC_BOUNDARIES }              from "@/lib/astrology/westernZodiac/data"

// Returns true if (month, day) is on or after the boundary start date.
function onOrAfter(month: number, day: number, bMonth: number, bDay: number): boolean {
  return month > bMonth || (month === bMonth && day >= bDay)
}

export function resolveWesternZodiac(input: ZodiacInput): ZodiacResult {
  const { month, day } = input

  // Walk boundaries in reverse (Dec → Jan).
  // The first boundary whose start date is <= (month, day) is the sign.
  for (let i = ZODIAC_BOUNDARIES.length - 1; i >= 0; i--) {
    const b = ZODIAC_BOUNDARIES[i]
    if (onOrAfter(month, day, b.month, b.day)) {
      return { sign: b.sign }
    }
  }

  // Fell through: date is in Jan 1–19, which still belongs to Capricorn
  // (Capricorn starts Dec 22 and wraps into the new year until Jan 19).
  return { sign: "Capricorn" }
}
