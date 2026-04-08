import type { PinnacleValue }  from "@/lib/numerology/pinnacleNumber/types"
import type { PinnacleStage }  from "@/lib/numerology/pinnacleCycleResolver/types"

export type { PinnacleStage, PinnacleValue }

export type CurrentPinnacleResolverInput = {
  activePinnacle: PinnacleStage
  pinnacle1:      PinnacleValue
  pinnacle2:      PinnacleValue
  pinnacle3:      PinnacleValue
  pinnacle4:      PinnacleValue
}

export type CurrentPinnacleResolverResult = {
  activePinnacle:       PinnacleStage
  currentPinnacleValue: PinnacleValue
}
