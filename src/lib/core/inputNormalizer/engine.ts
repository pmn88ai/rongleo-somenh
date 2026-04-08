// ─────────────────────────────────────────────
//  InputNormalizer — Engine
//  Layer : Core / Input
//  Spec  : v4 (VALID)
//
//  Constraints:
//    ✓ Pure function
//    ✓ No side effects
//    ✓ No external libraries
//    ✓ No Date object for birthdate parsing
//    ✓ Collect-all error strategy
// ─────────────────────────────────────────────

import type {
  RawProfileInput,
  UserProfile,
  ValidationError,
  NormalizationResult,
} from "@/lib/core/inputNormalizer/types"

// ─────────────────────────────────────────────
//  Field normalizers
// ─────────────────────────────────────────────

function normalizeName(raw: string): string {
  return raw
    .trim()
    .replace(/ {2,}/g, " ")
    .toUpperCase()
}

function normalizeBirthLocation(raw: string): string {
  return raw.trim()
}

function normalizePhone(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "")
  return digits.length > 0 ? digits : undefined
}

// ─────────────────────────────────────────────
//  Field validators
// ─────────────────────────────────────────────

function validateBirthdate(
  raw: string
): { year: number; month: number; day: number } | null {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null

  const parts = raw.split("-")
  const year  = Number(parts[0])
  const month = Number(parts[1])
  const day   = Number(parts[2])

  if (month < 1 || month > 12) return null
  if (day   < 1 || day   > 31) return null

  const daysInMonth = maxDaysInMonth(year, month)
  if (day > daysInMonth) return null

  return { year, month, day }
}

function maxDaysInMonth(year: number, month: number): number {
  const days30 = [4, 6, 9, 11]
  if (days30.includes(month)) return 30
  if (month === 2) return isLeapYear(year) ? 29 : 28
  return 31
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function validateBirthTime(raw: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(raw)) return false

  const parts   = raw.split(":")
  const hours   = Number(parts[0])
  const minutes = Number(parts[1])

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

// ─────────────────────────────────────────────
//  Main export — pure function
// ─────────────────────────────────────────────

export function normalizeProfile(input: RawProfileInput): NormalizationResult {

  const errors: ValidationError[] = []

  const normalizedFullName = normalizeName(input.fullName)
  if (normalizedFullName.length === 0) {
    errors.push({
      field:  "fullName",
      reason: "fullName must not be empty after normalization",
    })
  }

  const parsedDate = validateBirthdate(input.birthdate)
  if (parsedDate === null) {
    errors.push({
      field:  "birthdate",
      reason: "birthdate must be a valid calendar date in YYYY-MM-DD format",
    })
  }

  if (input.birthTime !== undefined) {
    if (!validateBirthTime(input.birthTime)) {
      errors.push({
        field:  "birthTime",
        reason: "birthTime must be a valid time in HH:mm format (00:00–23:59)",
      })
    }
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  const date = parsedDate!

  const profile: UserProfile = {
    rawFullName:        input.fullName,
    normalizedFullName,

    birthYear:  date.year,
    birthMonth: date.month,
    birthDay:   date.day,

    gender:        input.gender,
    birthLocation: input.birthLocation !== undefined
                     ? normalizeBirthLocation(input.birthLocation)
                     : undefined,
    birthTime:     input.birthTime,
    phone:         input.phone !== undefined
                     ? normalizePhone(input.phone)
                     : undefined,
  }

  return { success: true, data: profile }
}
