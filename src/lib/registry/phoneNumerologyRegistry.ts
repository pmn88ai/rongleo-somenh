// ─────────────────────────────────────────────
//  Phone Numerology Registry
//
//  Named map of every phone numerology engine function.
//  Pipeline order:
//    phoneLifePath       → life path of phone number
//    phoneDigitFrequency → raw digit frequency map
//      ↓ (all below consume frequency output)
//    phoneDominantNumber
//    phoneBalance
//    phoneMissingNumbers
//    phoneRepeatingPatterns
//    phoneCompatibility  → compares two phone life paths
// ─────────────────────────────────────────────

import { calculatePhoneLifePath }           from "@/lib/numerology/phone/phoneLifePath/engine"
import { calculatePhoneDigitFrequency }     from "@/lib/numerology/phone/phoneDigitFrequency/engine"
import { calculatePhoneDominantNumber }     from "@/lib/numerology/phone/phoneDominantNumber/engine"
import { calculatePhoneBalance }            from "@/lib/numerology/phone/phoneBalance/engine"
import { calculatePhoneMissingNumbers }     from "@/lib/numerology/phone/phoneMissingNumbers/engine"
import { calculatePhoneRepeatingPatterns }  from "@/lib/numerology/phone/phoneRepeatingPatterns/engine"
import { calculatePhoneCompatibility }      from "@/lib/numerology/phone/phoneCompatibility/engine"

export const phoneNumerologyModules = {
  calculatePhoneLifePath,
  calculatePhoneDigitFrequency,
  calculatePhoneDominantNumber,
  calculatePhoneBalance,
  calculatePhoneMissingNumbers,
  calculatePhoneRepeatingPatterns,
  calculatePhoneCompatibility,
} as const

export type PhoneNumerologyModules = typeof phoneNumerologyModules
