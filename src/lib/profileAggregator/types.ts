// ─────────────────────────────────────────────
//  ProfileAggregator — Types
// ─────────────────────────────────────────────

import type { LunarDate }       from "@/lib/astrology/solarToLunar/types"
import type { PinnacleValue }   from "@/lib/numerology/pinnacleNumber/types"
import type { ChallengeValue }  from "@/lib/numerology/challengeNumber/types"
import type { KarmicDebtEntry } from "@/lib/numerology/karmicDebtNumber/types"
import type { PinnacleStage, PinnacleAgeRange } from "@/lib/numerology/pinnacleCycleResolver/types"
import type { ChallengeStage, ChallengeAgeRange } from "@/lib/numerology/challengeCycleResolver/types"

export type NumerologySection = {
  lifePath: {
    baseNumber:    number
    masterNumber?: number
  }
  expression: {
    baseNumber:    number
    masterNumber?: number
  }
  soulUrge: {
    baseNumber:    number
    masterNumber?: number
  }
  personality: {
    baseNumber:    number
    masterNumber?: number
  }
  birthday: {
    baseNumber:    number
    masterNumber?: number
  }
  maturity: {
    baseNumber:    number
    masterNumber?: number
  }
  personalYear: {
    baseNumber:    number
    masterNumber?: number
  }
  personalMonth: {
    baseNumber:    number
    masterNumber?: number
  }
  personalDay: {
    baseNumber:    number
    masterNumber?: number
  }
  pinnacleNumber: {
    pinnacle1: PinnacleValue
    pinnacle2: PinnacleValue
    pinnacle3: PinnacleValue
    pinnacle4: PinnacleValue
  }
  challengeNumber: {
    challenge1: ChallengeValue
    challenge2: ChallengeValue
    challenge3: ChallengeValue
    challenge4: ChallengeValue
  }
  balanceNumber: {
    baseNumber:    number
    masterNumber?: number
  }
  hiddenPassion: {
    dominantDigits: number[]
    frequency:      number
    digitCounts:    Partial<Record<number, number>>
  }
  karmicDebtNumber: {
    debts:   KarmicDebtEntry[]
    hasDebt: boolean
  }
  pinnacleCycleResolver: {
    activePinnacle:      PinnacleStage
    firstPinnacleLength: number
    ageRanges:           Record<PinnacleStage, PinnacleAgeRange>
  }
  challengeCycleResolver: {
    activeChallengeStage:  ChallengeStage
    firstChallengeLength:  number
    ageRanges:             Record<ChallengeStage, ChallengeAgeRange>
  }
  currentPinnacleResolver: {
    activePinnacle:       PinnacleStage
    currentPinnacleValue: PinnacleValue
  }
  currentChallengeResolver: {
    currentChallengeStage: ChallengeStage
    currentChallengeValue: ChallengeValue
  }
}

export type AstrologySection = {
  zodiacYear:  number
  canChi:      string
  animal:      string
  element:     string
  naAm: {
    name:    string
    element: string
  }
  hourBranch?:      string
  lunarMonthLabel?: string
  thienCan?: {
    stemName:           string
    stemElement:        string
    stemElementEnglish: string
    stemPolarity:       "Dương" | "Âm"
  }
}

export type CompatibilitySection = {
  tamHop:     string[]
  lucHop:     string
  tuHanhXung: string[]
}

export type ElementCompatibilitySection = {
  generates:   string
  generatedBy: string
  destroys:    string
  destroyedBy: string
}

export type FengShuiSection = {
  kuaNumber:   number
  cungPhi:     string
  element:     string
  group:       string
  luckyColors: string[]
  luckyDirections: {
    primary:   string
    secondary: string[]
  }
  luckyNumber:  number
  luckyNumbers: number[]
}

export type PhoneNumerologySection = {
  phoneLifePath:        number
  isMasterPhoneNumber:  boolean
  digitFrequency:       Record<string, number>
  digitCount:           number
  dominantDigits:       number[]
  dominantFrequency:    number
  phoneBalance:         number
  isMasterBalance:      boolean
  missingDigits:        number[]
  missingCount:         number
  repeatingDigits:      Array<{ digit: number; occurrences: number }>
  repeatingCount:       number
}

export type DemographicsSection = {
  age:              number
  chineseAge:       number
  birthDayOfWeek:   string
  birthDayOfWeekVi: string
}

export type WesternAstrologySection = {
  zodiacSign: string
}

export type UnifiedAstrologyProfile = {
  numerology:           NumerologySection
  astrology:            AstrologySection
  compatibility:        CompatibilitySection
  elementCompatibility: ElementCompatibilitySection
  fengShui?:            FengShuiSection
  phoneNumerology?:     PhoneNumerologySection
  calendar: {
    solarDate: string
    lunarDate: LunarDate
  }
  westernAstrology:     WesternAstrologySection
  demographics:         DemographicsSection
}
