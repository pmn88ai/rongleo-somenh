import type {
  ChallengeCycleResolverInput,
  ChallengeCycleResolverResult,
  ChallengeAgeRange,
  ChallengeStage,
} from "@/lib/numerology/challengeCycleResolver/types"

// ─────────────────────────────────────────────────────────────────
//  Challenge Cycle Resolver
//
//  Challenge stages share the same age boundary structure as
//  pinnacle stages. The first stage length is: 36 - lifePathBaseNumber.
//  Subsequent stages each span 9 years (stages 2 and 3).
//  Stage 4 has no upper bound.
//
//  This engine is scoped entirely to the challenge domain.
//  It does not depend on pinnacleCycleResolver.
// ─────────────────────────────────────────────────────────────────

export function calculateChallengeCycleResolver(
  input: ChallengeCycleResolverInput
): ChallengeCycleResolverResult {
  const { lifePathBaseNumber, currentAge } = input

  const firstChallengeLength = 36 - lifePathBaseNumber

  const ageRanges: Record<ChallengeStage, ChallengeAgeRange> = {
    1: { startAge: 0,                          endAge: firstChallengeLength - 1  },
    2: { startAge: firstChallengeLength,        endAge: firstChallengeLength + 8  },
    3: { startAge: firstChallengeLength + 9,    endAge: firstChallengeLength + 17 },
    4: { startAge: firstChallengeLength + 18,   endAge: null                      },
  }

  let activeChallengeStage: ChallengeStage

  if (currentAge <= (ageRanges[1].endAge as number)) {
    activeChallengeStage = 1
  } else if (currentAge <= (ageRanges[2].endAge as number)) {
    activeChallengeStage = 2
  } else if (currentAge <= (ageRanges[3].endAge as number)) {
    activeChallengeStage = 3
  } else {
    activeChallengeStage = 4
  }

  return { activeChallengeStage, firstChallengeLength, ageRanges }
}
