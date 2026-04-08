export type PinnacleStage = 1 | 2 | 3 | 4

export type PinnacleAgeRange = {
  startAge: number
  endAge:   number | null
}

export type PinnacleValue = {
  baseNumber:    number
  masterNumber?: number
}

export type PinnacleCycleResolverInput = {
  lifePathBaseNumber: number
  currentAge:         number
}

export type PinnacleCycleResolverResult = {
  activePinnacle:      PinnacleStage
  firstPinnacleLength: number
  ageRanges:           Record<PinnacleStage, PinnacleAgeRange>
}
