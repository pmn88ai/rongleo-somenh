import type { ChallengeValue }  from "@/lib/numerology/challengeNumber/types"
import type { ChallengeStage }  from "@/lib/numerology/challengeCycleResolver/types"

export type { ChallengeValue, ChallengeStage }

export type CurrentChallengeResolverInput = {
  challenge1: ChallengeValue
  challenge2: ChallengeValue
  challenge3: ChallengeValue
  challenge4: ChallengeValue
  activeChallengeStage: ChallengeStage
}

export type CurrentChallengeResolverResult = {
  currentChallengeStage: ChallengeStage
  currentChallengeValue: ChallengeValue
}
