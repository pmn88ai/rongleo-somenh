export type ChallengeStage = 1 | 2 | 3 | 4

export type ChallengeAgeRange = {
  startAge: number
  endAge:   number | null
}

export type ChallengeCycleResolverInput = {
  lifePathBaseNumber: number
  currentAge:         number
}

export type ChallengeCycleResolverResult = {
  activeChallengeStage:  ChallengeStage
  firstChallengeLength:  number
  ageRanges:             Record<ChallengeStage, ChallengeAgeRange>
}
