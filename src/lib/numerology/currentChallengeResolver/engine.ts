import type { CurrentChallengeResolverInput, CurrentChallengeResolverResult } from "@/lib/numerology/currentChallengeResolver/types"

export function calculateCurrentChallengeResolver(
  input: CurrentChallengeResolverInput
): CurrentChallengeResolverResult {
  const { challenge1, challenge2, challenge3, challenge4, activeChallengeStage } = input

  const values = [
    undefined,       // index 0 — unused
    challenge1,      // stage 1
    challenge2,      // stage 2
    challenge3,      // stage 3
    challenge4,      // stage 4
  ]

  const currentChallengeValue = values[activeChallengeStage]

  if (currentChallengeValue === undefined) {
    throw new Error(
      `Invalid activeChallengeStage: ${activeChallengeStage}. Must be 1 | 2 | 3 | 4.`
    )
  }

  return {
    currentChallengeStage: activeChallengeStage,
    currentChallengeValue,
  }
}
