// ─────────────────────────────────────────────────────────────────
//  solarToLunar — Engine
//  Converts a Gregorian (solar) date to the Vietnamese lunar date.
//
//  Algorithm: Julian Day Number + Ho Ngoc Duc astronomical method.
//  Timezone: UTC+7 (Vietnam Standard Time) throughout.
//  Pure functions, no Date object, no external libraries.
// ─────────────────────────────────────────────────────────────────

import type { SolarDate, LunarDate } from "./types"

const TZ = 7
const DR = Math.PI / 180

// ── Julian Day Number (integer, Gregorian calendar) ───────────────
function jdn(y: number, m: number, d: number): number {
  const a  = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3
  return (
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045
  )
}

// ── JDN of the k-th new moon since Jan 1900 ──────────────────────
function newMoonDay(k: number): number {
  const T  = k / 1236.85
  const T2 = T * T
  const T3 = T2 * T

  const jd = 2415020.75933
    + 29.53058868  * k
    + 0.0001178    * T2
    - 0.000000155  * T3
    + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DR)

  const M   = 359.2242  + 29.10535608  * k - 0.0000333  * T2 - 0.00000347 * T3
  const Mpr = 306.0253  + 385.81691806 * k + 0.0107306  * T2 + 0.00001236 * T3
  const F   = 21.2964   + 390.67050646 * k - 0.0016528  * T2 - 0.00000239 * T3

  const c = (0.1734 - 0.000393 * T) * Math.sin(M   * DR)
    + 0.0021 * Math.sin(2 * M   * DR)
    - 0.4068 * Math.sin(Mpr * DR)
    + 0.0161 * Math.sin(2 * Mpr * DR)
    - 0.0004 * Math.sin(3 * Mpr * DR)
    + 0.0104 * Math.sin(2 * F   * DR)
    - 0.0051 * Math.sin((M  + Mpr) * DR)
    - 0.0074 * Math.sin((M  - Mpr) * DR)
    + 0.0004 * Math.sin((2 * F + M)   * DR)
    - 0.0004 * Math.sin((2 * F - M)   * DR)
    - 0.0006 * Math.sin((2 * F + Mpr) * DR)
    + 0.0010 * Math.sin((2 * F - Mpr) * DR)
    + 0.0005 * Math.sin((M + 2 * Mpr) * DR)

  const dT = T < -11
    ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
    : -0.000278 + 0.000265 * T + 0.000262 * T2

  return Math.floor(jd + c - dT + 0.5 + TZ / 24)
}

// ── Sun's major solar term index (0–11) ───────────────────────────
function sunTerm(dayNum: number): number {
  const T  = (dayNum - 2451545.5 - TZ / 24) / 36525
  const T2 = T * T
  const M  = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
  const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * DR)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * DR)
    + 0.00029 * Math.sin(3 * M * DR)
  let L = L0 + DL
  L = L - 360 * Math.floor(L / 360)
  return Math.floor(L / 30)
}

// ── JDN of the month-11 new moon anchor for a Gregorian year ─────
// Lunar month 11 always contains Đông Chí (Winter Solstice, term 9).
function monthEleven(year: number): number {
  const offset = jdn(year, 12, 31) - 2415021
  const k      = Math.floor(offset / 29.530588853)
  let   nm     = newMoonDay(k)
  if (sunTerm(nm) >= 9) nm = newMoonDay(k - 1)
  return nm
}

// ── Index (months since a11) of the leap month, or -1 ────────────
function leapMonthOffset(a11: number): number {
  const k = Math.floor(0.5 + (a11 - 2415021.076) / 29.530588853)
  for (let i = 1; i < 14; i++) {
    if (sunTerm(newMoonDay(k + i)) === sunTerm(newMoonDay(k + i + 1))) return i
  }
  return -1
}

// ── New moon JDN that started the lunar month containing dayNumber ─
// The k estimate from the formula can be off by ±1 at synodic
// boundaries, so we also check k+1 when the gap is >= 29 days.
function findMonthStart(dayNumber: number): number {
  const k  = Math.floor((dayNumber - 2415021.076) / 29.530588853)
  const nm = newMoonDay(k)
  if (nm > dayNumber) return newMoonDay(k - 1)
  const next = newMoonDay(k + 1)
  if (next <= dayNumber) return next
  return nm
}

// ── Main conversion ───────────────────────────────────────────────
export function convertSolarToLunar(input: SolarDate): LunarDate {
  const { year, month, day } = input
  const dayNumber  = jdn(year, month, day)
  const monthStart = findMonthStart(dayNumber)
  const lunarDay   = dayNumber - monthStart + 1

  // Find the month-11 anchors that bracket this lunar month.
  // a11 is always the month-11 BEFORE monthStart.
  // b11 is the month-11 AFTER monthStart (i.e. end of that lunar year).
  const a11orig = monthEleven(year)
  let a11: number
  let b11: number
  let swapped: boolean

  if (a11orig >= monthStart) {
    // monthStart is before this Gregorian year's month-11 → use prior year's anchor
    b11     = a11orig
    a11     = monthEleven(year - 1)
    swapped = true
  } else {
    a11     = a11orig
    b11     = monthEleven(year + 1)
    swapped = false
  }

  // Months elapsed since a11 new moon
  const diff = Math.round((monthStart - a11) / 29.530588853)

  // Leap year and leap month
  const hasLeap     = Math.round((b11 - a11) / 29.530588853) === 13
  const leapOffset  = hasLeap ? leapMonthOffset(a11) : -1
  const isLeapMonth = hasLeap && diff === leapOffset

  // Calendar month: a11 itself = month 11, so offset by +11 and wrap.
  // In a leap year, months AT or AFTER the leap offset are shifted:
  //   - The leap month itself shares the number of its predecessor (diff-1)
  //   - All months after the leap point also decrement by 1 to stay correct
  const adjustedDiff = (hasLeap && diff >= leapOffset) ? diff - 1 : diff
  let lunarMonth = adjustedDiff + 11
  if (lunarMonth > 12) lunarMonth -= 12
  if (lunarMonth <= 0) lunarMonth += 12

  // Lunar year:
  //   Case swapped=true:  a11 belongs to (year-1). Months 11-12 → year-1; months 1-10 → year
  //   Case swapped=false: a11 belongs to year.     Months 11-12 → year;   months 1-10 → year+1
  let lunarYear: number
  if (swapped) {
    lunarYear = lunarMonth >= 11 ? year - 1 : year
  } else {
    lunarYear = lunarMonth >= 11 ? year : year + 1
  }

  return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeapMonth }
}
