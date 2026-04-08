// ─────────────────────────────────────────────
//  Demographics Registry
//
//  Named map of every demographics engine function.
// ─────────────────────────────────────────────

import { calculateAge }           from "@/lib/demographics/ageCalculation"
import { calculateChineseAge }    from "@/lib/demographics/chineseAgeCalculation/engine"
import { calculateBirthDayOfWeek } from "@/lib/demographics/birthDayOfWeek/engine"

export const demographicsModules = {
  calculateAge,
  calculateChineseAge,
  calculateBirthDayOfWeek,
} as const

export type DemographicsModules = typeof demographicsModules
