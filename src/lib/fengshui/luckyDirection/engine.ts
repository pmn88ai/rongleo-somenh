import type { DirectionEnergy }      from "@/lib/fengshui/baTrachDirection/types"
import type { LuckyDirectionResult } from "@/lib/fengshui/luckyDirection/types"

export function resolveLuckyDirections(auspicious: DirectionEnergy[]): LuckyDirectionResult {
  return {
    primary:   auspicious[0].direction,
    secondary: auspicious.slice(1).map(e => e.direction),
  }
}
