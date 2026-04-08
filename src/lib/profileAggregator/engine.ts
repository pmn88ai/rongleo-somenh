// ─────────────────────────────────────────────
//  ProfileAggregator — Engine
//
//  Orchestrates the full Vietnamese astrology
//  + numerology pipeline into a single profile.
//
//  ARCHITECTURE RULES:
//    • Never imports individual engine modules.
//      All functions come from the registries.
//    • Never loops over a registry map.
//      Every call is explicit, named, and typed.
//    • Dependency order is enforced by call sequence.
// ─────────────────────────────────────────────

import type { UnifiedAstrologyProfile } from "@/lib/profileAggregator/types"
import type { NumerologySection }        from "@/lib/profileAggregator/types"

import { normalizeProfile }        from "@/lib/core/inputNormalizer/engine"

import { numerologyModules }       from "@/lib/registry/numerologyRegistry"
import { astrologyModules }        from "@/lib/registry/astrologyRegistry"
import { fengShuiModules }         from "@/lib/registry/fengShuiRegistry"
import { phoneNumerologyModules }  from "@/lib/registry/phoneNumerologyRegistry"
import { demographicsModules }     from "@/lib/registry/demographicsRegistry"

export type AggregatorInput = {
  fullName:     string
  birthdate:    string
  gender?:      "male" | "female" | "other"
  birthTime?:   string
  phoneNumber?: string
}

export function buildUnifiedAstrologyProfile(
  input: AggregatorInput,
): UnifiedAstrologyProfile {

  // ── Step 1: Normalize & validate input ──────────────────────────
  const normalized = normalizeProfile({
    fullName:  input.fullName,
    birthdate: input.birthdate,
    gender:    input.gender,
    birthTime: input.birthTime,
  })

  if (!normalized.success) {
    throw new Error(
      "Profile normalization failed: " +
      normalized.errors.map(e => `${e.field}: ${e.reason}`).join("; ")
    )
  }

  const p = normalized.data

  const today        = new Date()
  const currentYear  = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay   = today.getDate()

  // ── Step 2: Numerology — explicit calls in dependency order ──────
  const {
    calculateLifePath, calculateExpression, calculateSoulUrge,
    calculatePersonality, calculateBirthday, calculatePersonalYear,
    calculateMaturity, calculatePersonalMonth, calculatePersonalDay,
    calculatePinnacleNumber, calculateChallengeNumber,
    calculateBalanceNumber, calculateHiddenPassion,
    calculateKarmicDebtNumber, calculatePinnacleCycleResolver,
    calculateChallengeCycleResolver, calculateCurrentPinnacleResolver,
    calculateCurrentChallengeResolver,
  } = numerologyModules

  //  Independent (no cross-module inputs):
  const lifePath = calculateLifePath({
    birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay,
  })
  const expression = calculateExpression({
    normalizedFullName: p.normalizedFullName,
  })
  const soulUrge = calculateSoulUrge({
    normalizedFullName: p.normalizedFullName,
  })
  const personality = calculatePersonality({
    normalizedFullName: p.normalizedFullName,
  })
  const birthday = calculateBirthday({
    birthDay: p.birthDay,
  })
  const personalYear = calculatePersonalYear({
    birthMonth: p.birthMonth, birthDay: p.birthDay, currentYear,
  })

  //  Birth dates only:
  const pinnacleNumber = calculatePinnacleNumber({
    birthMonth: p.birthMonth, birthDay: p.birthDay, birthYear: p.birthYear,
  })
  const challengeNumber = calculateChallengeNumber({
    birthMonth: p.birthMonth, birthDay: p.birthDay, birthYear: p.birthYear,
  })

  //  Full name only:
  const balanceNumber = calculateBalanceNumber({
    normalizedFullName: p.normalizedFullName,
  })
  const hiddenPassion = calculateHiddenPassion({
    normalizedFullName: p.normalizedFullName,
  })

  //  Birth dates + full name:
  const karmicDebtNumber = calculateKarmicDebtNumber({
    birthMonth: p.birthMonth, birthDay: p.birthDay, birthYear: p.birthYear,
    normalizedFullName: p.normalizedFullName,
  })

  //  Dependent on lifePath + expression → maturity:
  const maturity = calculateMaturity({
    lifePathBase: lifePath.baseNumber, expressionBase: expression.baseNumber,
  })

  //  Dependent on personalYear:
  const personalMonth = calculatePersonalMonth({
    personalYearBase: personalYear.baseNumber, currentMonth,
  })

  //  Dependent on personalMonth:
  const personalDay = calculatePersonalDay({
    personalMonthBase: personalMonth.baseNumber, currentDay,
  })

  //  Dependent on lifePath + current age:
  const currentAge = today.getFullYear() - p.birthYear
  const pinnacleCycleResolver = calculatePinnacleCycleResolver({
    lifePathBaseNumber: lifePath.baseNumber,
    currentAge,
  })

  //  Challenge cycle — parallel structure to pinnacle:
  const challengeCycleResolver = calculateChallengeCycleResolver({
    lifePathBaseNumber: lifePath.baseNumber,
    currentAge,
  })

  //  Current pinnacle — depends on pinnacleNumber + pinnacleCycleResolver:
  const currentPinnacleResolver = calculateCurrentPinnacleResolver({
    activePinnacle: pinnacleCycleResolver.activePinnacle,
    pinnacle1: pinnacleNumber.pinnacle1,
    pinnacle2: pinnacleNumber.pinnacle2,
    pinnacle3: pinnacleNumber.pinnacle3,
    pinnacle4: pinnacleNumber.pinnacle4,
  })

  //  Current challenge — depends on challengeNumber + challengeCycleResolver:
  const currentChallengeResolver = calculateCurrentChallengeResolver({
    activeChallengeStage: challengeCycleResolver.activeChallengeStage,
    challenge1: challengeNumber.challenge1,
    challenge2: challengeNumber.challenge2,
    challenge3: challengeNumber.challenge3,
    challenge4: challengeNumber.challenge4,
  })

  const numerology: NumerologySection = {
    lifePath, expression, soulUrge, personality,
    birthday, maturity, personalYear, personalMonth, personalDay,
    pinnacleNumber, challengeNumber, balanceNumber,
    hiddenPassion, karmicDebtNumber,
    pinnacleCycleResolver, challengeCycleResolver,
    currentPinnacleResolver, currentChallengeResolver,
  }

  // ── Step 3: Astrology — sequential, each step feeds the next ─────
  const {
    resolveLunarYear, calculateSexagenary, resolveZodiacAnimal,
    resolveZodiacElement, resolveNaAm, resolveZodiacHour,
    resolveZodiacCompatibility, resolveElementCompatibility,
    convertSolarToLunar, resolveWesternZodiac,
    calculateLunarMonthResolver, calculateThienCanElement,
  } = astrologyModules

  const lunarYear = resolveLunarYear({
    birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay,
  })
  if (!lunarYear.success) throw new Error("Lunar year calculation failed")

  const sexagenary    = calculateSexagenary({ zodiacYear: lunarYear.zodiacYear })
  const zodiacAnimal  = resolveZodiacAnimal(sexagenary.branch)
  const zodiacEl      = resolveZodiacElement(sexagenary.stem)
  const naAm          = resolveNaAm({ cycleIndex: sexagenary.cycleIndex })
  const hourBranch    = p.birthTime
    ? resolveZodiacHour({ birthHour: parseInt(p.birthTime.split(":")[0], 10) })
    : null
  const zodiacCompat  = resolveZodiacCompatibility(sexagenary.branch)
  const elementCompat = resolveElementCompatibility(zodiacEl.element)
  const lunarDate     = convertSolarToLunar({
    year: p.birthYear, month: p.birthMonth, day: p.birthDay,
  })
  const westernZodiac = resolveWesternZodiac({
    month: p.birthMonth, day: p.birthDay,
  })

  //  Batch 4 extensions:
  const lunarMonth = calculateLunarMonthResolver({
    lunarMonth:  lunarDate.month,
    isLeapMonth: lunarDate.isLeapMonth,
  })
  const thienCan = calculateThienCanElement({
    yearStemIndex: sexagenary.cycleIndex % 10,
  })

  // ── Step 4: Feng Shui — sequential, male/female only ────────────
  const {
    calculateKuaNumber, resolveBaTrachCungPhi,
    resolveBaTrachDirections, resolveLuckyColors,
    resolveLuckyDirections, calculateLuckyNumber,
  } = fengShuiModules

  let fengShui: UnifiedAstrologyProfile["fengShui"] = undefined

  if (p.gender === "male" || p.gender === "female") {
    const kua        = calculateKuaNumber({ zodiacYear: lunarYear.zodiacYear, gender: p.gender })
    const baTrach    = resolveBaTrachCungPhi({ kuaNumber: kua.kuaNumber })
    const directions = resolveBaTrachDirections(baTrach.cungPhi)
    const colors     = resolveLuckyColors(zodiacEl.element)
    const luckyDirs  = resolveLuckyDirections(directions.auspicious)
    const luckyNum   = calculateLuckyNumber({ kuaNumber: kua.kuaNumber })

    fengShui = {
      kuaNumber:   kua.kuaNumber,
      cungPhi:     baTrach.cungPhi,
      element:     baTrach.element,
      group:       baTrach.group,
      luckyColors: colors.colors,
      luckyDirections: {
        primary:   luckyDirs.primary,
        secondary: luckyDirs.secondary,
      },
      luckyNumber:  luckyNum.luckyNumber,
      luckyNumbers: luckyNum.luckyNumbers,
    }
  }

  // ── Step 5: Phone Numerology (optional) ──────────────────────────
  const {
    calculatePhoneLifePath, calculatePhoneDigitFrequency,
    calculatePhoneDominantNumber, calculatePhoneBalance,
    calculatePhoneMissingNumbers, calculatePhoneRepeatingPatterns,
  } = phoneNumerologyModules

  let phoneNumerology: UnifiedAstrologyProfile["phoneNumerology"] = undefined

  if (input.phoneNumber && input.phoneNumber.length > 0) {
    const phoneDigits = input.phoneNumber.replace(/\D/g, "")
    if (phoneDigits.length > 0) {
      const phoneLp        = calculatePhoneLifePath({ phoneDigits })
      const phoneFreq      = calculatePhoneDigitFrequency({ phoneDigits })
      const phoneDominant  = calculatePhoneDominantNumber({ frequency: phoneFreq.frequency })
      const phoneBalance   = calculatePhoneBalance({ frequency: phoneFreq.frequency })
      const phoneMissing   = calculatePhoneMissingNumbers({ frequency: phoneFreq.frequency })
      const phoneRepeating = calculatePhoneRepeatingPatterns({ frequency: phoneFreq.frequency })

      phoneNumerology = {
        phoneLifePath:        phoneLp.phoneLifePath,
        isMasterPhoneNumber:  phoneLp.isMaster,
        digitFrequency:       phoneFreq.frequency,
        digitCount:           phoneFreq.digitCount,
        dominantDigits:       phoneDominant.dominantDigits,
        dominantFrequency:    phoneDominant.dominantFrequency,
        phoneBalance:         phoneBalance.phoneBalance,
        isMasterBalance:      phoneBalance.isMaster,
        missingDigits:        phoneMissing.missingDigits,
        missingCount:         phoneMissing.missingCount,
        repeatingDigits:      phoneRepeating.repeatingDigits,
        repeatingCount:       phoneRepeating.repeatingCount,
      }
    }
  }

  // ── Step 6: Demographics ─────────────────────────────────────────
  const { calculateAge, calculateChineseAge, calculateBirthDayOfWeek } = demographicsModules

  const ageResult    = calculateAge({
    birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay,
  })
  const chineseAge   = calculateChineseAge({
    birthYear: p.birthYear, currentYear, currentMonth, currentDay,
  })
  const birthDow     = calculateBirthDayOfWeek({
    birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay,
  })

  // ── Assemble ─────────────────────────────────────────────────────
  return {
    numerology,
    astrology: {
      zodiacYear: lunarYear.zodiacYear,
      canChi:     sexagenary.canChi,
      animal:     zodiacAnimal.animal,
      element:    zodiacEl.element,
      naAm:       { name: naAm.name, element: naAm.element },
      hourBranch: hourBranch?.branch,
      lunarMonthLabel: lunarMonth.lunarMonthLabel,
      thienCan: {
        stemName:           thienCan.stemName,
        stemElement:        thienCan.stemElement,
        stemElementEnglish: thienCan.stemElementEnglish,
        stemPolarity:       thienCan.stemPolarity,
      },
    },
    compatibility: {
      tamHop:     zodiacCompat.tamHop,
      lucHop:     zodiacCompat.lucHop,
      tuHanhXung: zodiacCompat.tuHanhXung,
    },
    elementCompatibility: {
      generates:   elementCompat.generates,
      generatedBy: elementCompat.generatedBy,
      destroys:    elementCompat.destroys,
      destroyedBy: elementCompat.destroyedBy,
    },
    fengShui,
    phoneNumerology,
    calendar: {
      solarDate: `${p.birthYear}-${p.birthMonth}-${p.birthDay}`,
      lunarDate,
    },
    westernAstrology: { zodiacSign: westernZodiac.sign },
    demographics: {
      age:              ageResult.age,
      chineseAge:       chineseAge.chineseAge,
      birthDayOfWeek:   birthDow.dayNameEnglish,
      birthDayOfWeekVi: birthDow.dayNameVietnamese,
    },
  }
}
