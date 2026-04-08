import type { LunarYearInput, LunarYearResult } from "@/lib/astrology/lunarYearResolver/types"
import { chineseNewYear }                        from "@/lib/astrology/lunarYearResolver/data"

function pad2(n: number): string { return n < 10 ? "0" + n : String(n) }
function formatISO(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`
}

export function resolveLunarYear(input: LunarYearInput): LunarYearResult {
  const cnyDateStr = chineseNewYear[input.birthYear]
  if (cnyDateStr === undefined)
    return {
      success: false,
      error: {
        code:    "YEAR_OUT_OF_RANGE",
        year:    input.birthYear,
        message: `Year ${input.birthYear} is outside supported range (1900–2100)`,
      },
    }

  const birthDateStr = formatISO(input.birthYear, input.birthMonth, input.birthDay)
  const zodiacYear   = birthDateStr < cnyDateStr ? input.birthYear - 1 : input.birthYear
  return { success: true, zodiacYear }
}
