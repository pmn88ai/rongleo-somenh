import type { LunarMonthResolverInput, LunarMonthResolverResult } from "@/lib/astrology/lunarMonthResolver/types"

export function calculateLunarMonthResolver(
  input: LunarMonthResolverInput
): LunarMonthResolverResult {
  const { lunarMonth, isLeapMonth } = input

  if (lunarMonth < 1 || lunarMonth > 12) {
    throw new Error(`Invalid lunarMonth: ${lunarMonth}. Must be between 1 and 12.`)
  }

  const lunarMonthLabel = isLeapMonth
    ? `Tháng ${lunarMonth} Nhuận`
    : `Tháng ${lunarMonth}`

  return {
    lunarMonth,
    isLeapMonth,
    lunarMonthLabel,
  }
}
