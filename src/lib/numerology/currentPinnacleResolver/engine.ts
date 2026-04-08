import type { CurrentPinnacleResolverInput, CurrentPinnacleResolverResult } from "@/lib/numerology/currentPinnacleResolver/types"

export function calculateCurrentPinnacleResolver(
  input: CurrentPinnacleResolverInput
): CurrentPinnacleResolverResult {
  const { activePinnacle, pinnacle1, pinnacle2, pinnacle3, pinnacle4 } = input

  const values = [
    undefined,    // index 0 — unused
    pinnacle1,    // stage 1
    pinnacle2,    // stage 2
    pinnacle3,    // stage 3
    pinnacle4,    // stage 4
  ]

  const currentPinnacleValue = values[activePinnacle]

  if (currentPinnacleValue === undefined) {
    throw new Error(
      `Invalid activePinnacle: ${activePinnacle}. Must be 1 | 2 | 3 | 4.`
    )
  }

  return {
    activePinnacle,
    currentPinnacleValue,
  }
}
