// ─────────────────────────────────────────────
//  src/lib/ui/adapter/profileAdapter.ts
//
//  Converts UnifiedAstrologyProfile (runtime schema)
//  into ObservatoryProfile (UI schema).
//
//  ARCHITECTURE RULES:
//    • This is the ONLY file in the UI layer that may
//      import from @/lib/profileAggregator/types.
//    • No computation — restructuring and labelling only.
//    • No throws — all optional sections are handled
//      with safe fallbacks.
//    • All UI labels are in Vietnamese per LUAT_UI.md.
// ─────────────────────────────────────────────

import type { UnifiedAstrologyProfile } from "@/lib/profileAggregator/types"
import type { SignalEntry, SignalGroup } from "@/lib/ui/shared/types"
import type { AdapterInput, ObservatoryMeta, ObservatoryProfile } from "./types"

// ─────────────────────────────────────────────
//  SECTION BUILDERS
//  Each function builds one SignalGroup from the
//  corresponding runtime section.
// ─────────────────────────────────────────────

function buildNumerologyGroup(
  profile: UnifiedAstrologyProfile,
): SignalGroup {
  const n = profile.numerology

  const signals: SignalEntry[] = [
    {
      engine: "lifePath",
      domain: "numerology",
      value:  n.lifePath.baseNumber,
      label:  "Đường đời",
    },
    {
      engine: "expression",
      domain: "numerology",
      value:  n.expression.baseNumber,
      label:  "Biểu đạt",
    },
    {
      engine: "soulUrge",
      domain: "numerology",
      value:  n.soulUrge.baseNumber,
      label:  "Linh hồn",
    },
    {
      engine: "personality",
      domain: "numerology",
      value:  n.personality.baseNumber,
      label:  "Nhân cách",
    },
    {
      engine: "birthday",
      domain: "numerology",
      value:  n.birthday.baseNumber,
      label:  "Ngày sinh",
    },
    {
      engine: "maturity",
      domain: "numerology",
      value:  n.maturity.baseNumber,
      label:  "Trưởng thành",
    },
    {
      engine: "personalYear",
      domain: "numerology",
      value:  n.personalYear.baseNumber,
      label:  "Năm cá nhân",
    },
    {
      engine: "personalMonth",
      domain: "numerology",
      value:  n.personalMonth.baseNumber,
      label:  "Tháng cá nhân",
    },
    {
      engine: "personalDay",
      domain: "numerology",
      value:  n.personalDay.baseNumber,
      label:  "Ngày cá nhân",
    },
    {
      engine: "balanceNumber",
      domain: "numerology",
      value:  n.balanceNumber.baseNumber,
      label:  "Số cân bằng",
    },
    {
      engine: "hiddenPassion",
      domain: "numerology",
      value:  n.hiddenPassion.dominantDigits,
      label:  "Đam mê ẩn",
    },
    {
      engine: "karmicDebtNumber",
      domain: "numerology",
      value:  n.karmicDebtNumber.debts,
      label:  "Nghiệp số",
    },
    {
      engine: "pinnacleNumber",
      domain: "numerology",
      value:  n.pinnacleNumber,
      label:  "Đỉnh cao",
    },
    {
      engine: "challengeNumber",
      domain: "numerology",
      value:  n.challengeNumber,
      label:  "Thách thức",
    },
    {
      engine: "pinnacleCycleResolver",
      domain: "numerology",
      value:  n.pinnacleCycleResolver.activePinnacle,
      label:  "Giai đoạn đỉnh cao",
    },
    {
      engine: "challengeCycleResolver",
      domain: "numerology",
      value:  n.challengeCycleResolver.activeChallengeStage,
      label:  "Giai đoạn thách thức",
    },
    {
      engine: "currentPinnacleResolver",
      domain: "numerology",
      value:  n.currentPinnacleResolver.currentPinnacleValue,
      label:  "Giá trị đỉnh cao hiện tại",
    },
    {
      engine: "currentChallengeResolver",
      domain: "numerology",
      value:  n.currentChallengeResolver.currentChallengeValue,
      label:  "Giá trị thách thức hiện tại",
    },
  ]

  return { domain: "numerology", signals }
}

// ─────────────────────────────────────────────

function buildAstrologyGroup(
  profile: UnifiedAstrologyProfile,
): SignalGroup {
  const a  = profile.astrology
  const wa = profile.westernAstrology
  const c  = profile.calendar

  const signals: SignalEntry[] = [
    {
      engine: "zodiacChineseAnimal",
      domain: "astrology",
      value:  a.animal,
      label:  "Con giáp",
    },
    {
      engine: "sexagenaryCycle",
      domain: "astrology",
      value:  a.canChi,
      label:  "Can Chi",
    },
    {
      engine: "zodiacElement",
      domain: "astrology",
      value:  a.element,
      label:  "Hành",
    },
    {
      engine: "naAmResolver",
      domain: "astrology",
      value:  a.naAm.name,
      label:  "Nạp Âm",
    },
    {
      engine: "westernZodiac",
      domain: "astrology",
      value:  wa.zodiacSign,
      label:  "Cung hoàng đạo",
    },
    {
      engine: "zodiacHourBranch",
      domain: "astrology",
      value:  a.hourBranch ?? null,
      label:  "Chi giờ sinh",
    },
    {
      engine: "lunarMonthResolver",
      domain: "astrology",
      value:  a.lunarMonthLabel ?? null,
      label:  "Tháng âm lịch",
    },
    {
      engine: "thienCanElement",
      domain: "astrology",
      value:  a.thienCan?.stemName ?? null,
      label:  "Thiên Can",
    },
    {
      engine: "solarToLunar",
      domain: "astrology",
      value:  c.lunarDate,
      label:  "Âm lịch",
    },
    {
      engine: "lunarYearResolver",
      domain: "astrology",
      value:  a.zodiacYear,
      label:  "Năm âm lịch",
    },
  ]

  return { domain: "astrology", signals }
}

// ─────────────────────────────────────────────

function buildCompatibilityGroup(
  profile: UnifiedAstrologyProfile,
): SignalGroup {
  const co = profile.compatibility
  const ec = profile.elementCompatibility

  const signals: SignalEntry[] = [
    {
      engine: "zodiacCompatibility",
      domain: "compatibility",
      value:  co.tamHop,
      label:  "Tam Hợp",
    },
    {
      engine: "lucHop",
      domain: "compatibility",
      value:  co.lucHop,
      label:  "Lục Hợp",
    },
    {
      engine: "tuHanhXung",
      domain: "compatibility",
      value:  co.tuHanhXung,
      label:  "Tứ Hành Xung",
    },
    {
      engine: "elementCompatibility_generates",
      domain: "compatibility",
      value:  ec.generates,
      label:  "Sinh ra",
    },
    {
      engine: "elementCompatibility_generatedBy",
      domain: "compatibility",
      value:  ec.generatedBy,
      label:  "Được sinh bởi",
    },
    {
      engine: "elementCompatibility_destroys",
      domain: "compatibility",
      value:  ec.destroys,
      label:  "Khắc",
    },
    {
      engine: "elementCompatibility_destroyedBy",
      domain: "compatibility",
      value:  ec.destroyedBy,
      label:  "Bị khắc bởi",
    },
  ]

  return { domain: "compatibility", signals }
}

// ─────────────────────────────────────────────

function buildFengShuiGroup(
  profile: UnifiedAstrologyProfile,
): SignalGroup | null {
  const fs = profile.fengShui

  // fengShui is optional — absent when gender is not male/female
  if (fs === undefined) return null

  const signals: SignalEntry[] = [
    {
      engine: "kuaNumber",
      domain: "fengshui",
      value:  fs.kuaNumber,
      label:  "Số Quái",
    },
    {
      engine: "baTrachCungPhi",
      domain: "fengshui",
      value:  fs.cungPhi,
      label:  "Cung Phi",
    },
    {
      engine: "baTrachElement",
      domain: "fengshui",
      value:  fs.element,
      label:  "Hành Phong Thủy",
    },
    {
      engine: "baTrachGroup",
      domain: "fengshui",
      value:  fs.group,
      label:  "Nhóm",
    },
    {
      engine: "luckyColor",
      domain: "fengshui",
      value:  fs.luckyColors,
      label:  "Màu may mắn",
    },
    {
      engine: "luckyDirection_primary",
      domain: "fengshui",
      value:  fs.luckyDirections.primary,
      label:  "Hướng chính",
    },
    {
      engine: "luckyDirection_secondary",
      domain: "fengshui",
      value:  fs.luckyDirections.secondary,
      label:  "Hướng phụ",
    },
    {
      engine: "luckyNumber",
      domain: "fengshui",
      value:  fs.luckyNumber,
      label:  "Số may mắn",
    },
    {
      engine: "luckyNumbers",
      domain: "fengshui",
      value:  fs.luckyNumbers,
      label:  "Các số may mắn",
    },
  ]

  return { domain: "fengshui", signals }
}

// ─────────────────────────────────────────────

function buildPhoneGroup(
  profile: UnifiedAstrologyProfile,
): SignalGroup | null {
  const ph = profile.phoneNumerology

  // phoneNumerology is optional — absent when no phone number was provided
  if (ph === undefined) return null

  const signals: SignalEntry[] = [
    {
      engine: "phoneLifePath",
      domain: "phoneNumerology",
      value:  ph.phoneLifePath,
      label:  "Đường đời số ĐT",
    },
    {
      engine: "isMasterPhoneNumber",
      domain: "phoneNumerology",
      value:  ph.isMasterPhoneNumber,
      label:  "Số chủ",
    },
    {
      engine: "phoneDigitFrequency",
      domain: "phoneNumerology",
      value:  ph.digitFrequency,
      label:  "Tần số chữ số",
    },
    {
      engine: "phoneDominantNumber",
      domain: "phoneNumerology",
      value:  ph.dominantDigits,
      label:  "Số trội",
    },
    {
      engine: "phoneDominantFrequency",
      domain: "phoneNumerology",
      value:  ph.dominantFrequency,
      label:  "Tần suất trội",
    },
    {
      engine: "phoneBalance",
      domain: "phoneNumerology",
      value:  ph.phoneBalance,
      label:  "Số cân bằng ĐT",
    },
    {
      engine: "isMasterBalance",
      domain: "phoneNumerology",
      value:  ph.isMasterBalance,
      label:  "Cân bằng chủ",
    },
    {
      engine: "phoneMissingNumbers",
      domain: "phoneNumerology",
      value:  ph.missingDigits,
      label:  "Số thiếu",
    },
    {
      engine: "phoneRepeatingPatterns",
      domain: "phoneNumerology",
      value:  ph.repeatingDigits,
      label:  "Mẫu lặp",
    },
  ]

  return { domain: "phoneNumerology", signals }
}

// ─────────────────────────────────────────────

function buildDemographicsGroup(
  profile: UnifiedAstrologyProfile,
): SignalGroup {
  const d = profile.demographics

  const signals: SignalEntry[] = [
    {
      engine: "ageCalculation",
      domain: "demographics",
      value:  d.age,
      label:  "Tuổi dương",
    },
    {
      engine: "chineseAgeCalculation",
      domain: "demographics",
      value:  d.chineseAge,
      label:  "Tuổi âm",
    },
    {
      engine: "birthDayOfWeek",
      domain: "demographics",
      value:  d.birthDayOfWeekVi,
      label:  "Thứ sinh",
    },
  ]

  return { domain: "demographics", signals }
}

// ─────────────────────────────────────────────
//  META BUILDER
// ─────────────────────────────────────────────

function buildMeta(
  formValues: AdapterInput["formValues"],
  profile:    UnifiedAstrologyProfile,
): ObservatoryMeta {
  return {
    fullName:    formValues.fullName,
    birthDate:   formValues.birthDate,
    birthHour:   formValues.birthHour,
    gender:      formValues.gender,
    phone:       formValues.phoneNumber.trim() !== "" ? formValues.phoneNumber : null,
    hasFengShui: profile.fengShui !== undefined,
    hasPhone:    profile.phoneNumerology !== undefined,
  }
}

// ─────────────────────────────────────────────
//  PUBLIC ADAPTER FUNCTION
// ─────────────────────────────────────────────

/**
 * adaptProfile()
 *
 * Converts a UnifiedAstrologyProfile + form input values
 * into a flat, UI-ready ObservatoryProfile.
 *
 * This is the single crossing point between the engine world
 * and the UI world. No UI component should access
 * UnifiedAstrologyProfile directly.
 *
 * Never throws. Optional sections (fengShui, phoneNumerology)
 * are handled safely — their groups are omitted from groups[]
 * when absent, and the meta flags reflect their status.
 */
export function adaptProfile(input: AdapterInput): ObservatoryProfile {
  const { formValues, profile } = input

  // ── Build meta from form input + presence flags from profile ──
  const meta = buildMeta(formValues, profile)

  // ── Build groups in fixed render order ──────────────────────
  const fengShuiGroup  = buildFengShuiGroup(profile)
  const phoneGroup     = buildPhoneGroup(profile)

  const groups: SignalGroup[] = [
    buildNumerologyGroup(profile),    // 1 — always present
    buildAstrologyGroup(profile),     // 2 — always present
    buildCompatibilityGroup(profile), // 3 — always present
    ...(fengShuiGroup  !== null ? [fengShuiGroup]  : []),  // 4 — conditional
    ...(phoneGroup     !== null ? [phoneGroup]     : []),  // 5 — conditional
    buildDemographicsGroup(profile),  // 6 — always present
  ]

  return { meta, groups }
}
