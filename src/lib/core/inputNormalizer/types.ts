// ─────────────────────────────────────────────
//  InputNormalizer — Types
//  Layer : Core / Input
//  Spec  : v4 (VALID)
// ─────────────────────────────────────────────

export type RawProfileInput = {
  fullName:      string
  birthdate:     string          // format: YYYY-MM-DD, must be a valid calendar date
  gender?:       "male" | "female" | "other"
  birthLocation?: string
  birthTime?:    string          // format: HH:mm
  phone?:        string
}

export type UserProfile = {
  rawFullName:        string
  normalizedFullName: string

  birthYear:  number
  birthMonth: number             // 1–12
  birthDay:   number

  gender?:       "male" | "female" | "other"
  birthLocation?: string
  birthTime?:    string
  phone?:        string
}

export type ValidationError = {
  field:  keyof RawProfileInput
  reason: string
}

export type NormalizationResult =
  | { success: true;  data: UserProfile }
  | { success: false; errors: ValidationError[] }
