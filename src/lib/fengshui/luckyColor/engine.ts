import type { NguHanhElement }                   from "@/lib/astrology/zodiacElement/types"
import type { LuckyColorResult }                 from "@/lib/fengshui/luckyColor/types"
import { luckyColors }                           from "@/lib/fengshui/luckyColor/data"

export function resolveLuckyColors(element: NguHanhElement): LuckyColorResult {
  return { colors: luckyColors[element] }
}
