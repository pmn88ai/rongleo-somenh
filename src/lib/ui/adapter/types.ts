// ─────────────────────────────────────────────
//  src/lib/ui/adapter/types.ts
//
//  Output types for the UI Adapter layer.
//
//  ARCHITECTURE RULES:
//    • ObservatoryProfile is the ONLY type UI components
//      may accept as profile data.
//    • UI components must NOT import UnifiedAstrologyProfile
//      or any type from @/lib/profileAggregator/types.
//    • All engine-world types are translated here and
//      never cross into the UI layer directly.
// ─────────────────────────────────────────────

import type { SignalGroup } from "@/lib/ui/shared/types"
import type { InputFormValues } from "@/lib/ui/InputForm/types"

// ─────────────────────────────────────────────
//  AdapterInput
//
//  Everything the adapter needs to produce
//  a complete ObservatoryProfile.
//  Caller (Observatory page) must supply both.
// ─────────────────────────────────────────────

export type AdapterInput = {
  /** Raw form values as submitted by the user. */
  formValues: InputFormValues
  /** Runtime profile as returned by buildUnifiedAstrologyProfile(). */
  profile: import("@/lib/profileAggregator/types").UnifiedAstrologyProfile
}

// ─────────────────────────────────────────────
//  ObservatoryMeta
//
//  Request-level context that lives outside the
//  profile object. Populated from form input values,
//  not from engine output.
// ─────────────────────────────────────────────

export type ObservatoryMeta = {
  /** Full name as entered by the user. */
  fullName: string

  /** Birth date in ISO format: YYYY-MM-DD. */
  birthDate: string

  /** Birth hour (0–23), or null if not provided. */
  birthHour: number | null

  /** Gender as selected in the form. */
  gender: string

  /** Phone number as entered, or null if not provided / empty. */
  phone: string | null

  /**
   * True if the fengShui section is present in the runtime profile.
   * False when gender is "other", "unspecified", or absent.
   * UI uses this to conditionally render the FengShui panel.
   */
  hasFengShui: boolean

  /**
   * True if the phoneNumerology section is present in the runtime profile.
   * False when no phone number was provided.
   * UI uses this to conditionally render the Phone panel.
   */
  hasPhone: boolean
}

// ─────────────────────────────────────────────
//  ObservatoryProfile
//
//  The complete UI-ready profile object.
//  Produced by adaptProfile().
//  Consumed by Observatory page and all its
//  child components.
//
//  groups[] is always ordered:
//    1. numerology
//    2. astrology
//    3. compatibility
//    4. fengshui        (only if meta.hasFengShui)
//    5. phoneNumerology (only if meta.hasPhone)
//    6. demographics
// ─────────────────────────────────────────────

export type ObservatoryProfile = {
  /** Request-level metadata from form input. */
  meta: ObservatoryMeta

  /**
   * Ordered array of signal groups ready for UI rendering.
   * Each group maps to one panel / chart in the Observatory.
   * Optional sections (fengShui, phoneNumerology) are omitted
   * when the corresponding data is absent.
   */
  groups: SignalGroup[]
}
