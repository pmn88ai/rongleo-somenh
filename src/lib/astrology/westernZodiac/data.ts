// Each entry: the sign begins on (month, day) and runs until the next entry.
// List is ordered by calendar position Jan → Dec.
// Capricorn wraps across Dec/Jan and is handled explicitly in the engine.
export type ZodiacBoundary = {
  sign:  string
  month: number
  day:   number
}

export const ZODIAC_BOUNDARIES: ZodiacBoundary[] = [
  { sign: "Aquarius",    month:  1, day: 20 },
  { sign: "Pisces",      month:  2, day: 19 },
  { sign: "Aries",       month:  3, day: 21 },
  { sign: "Taurus",      month:  4, day: 20 },
  { sign: "Gemini",      month:  5, day: 21 },
  { sign: "Cancer",      month:  6, day: 21 },
  { sign: "Leo",         month:  7, day: 23 },
  { sign: "Virgo",       month:  8, day: 23 },
  { sign: "Libra",       month:  9, day: 23 },
  { sign: "Scorpio",     month: 10, day: 23 },
  { sign: "Sagittarius", month: 11, day: 22 },
  { sign: "Capricorn",   month: 12, day: 22 },
]
