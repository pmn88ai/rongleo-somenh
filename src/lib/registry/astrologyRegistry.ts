// ─────────────────────────────────────────────
//  Astrology Registry
//
//  Named map of every astrology engine function.
//  The profileAggregator imports engines through
//  this registry instead of individual modules.
// ─────────────────────────────────────────────

import { resolveLunarYear }                    from "@/lib/astrology/lunarYearResolver/engine"
import { calculateSexagenary }                 from "@/lib/astrology/sexagenaryCycle/engine"
import { resolveZodiacAnimal }                 from "@/lib/astrology/zodiacChineseAnimal/engine"
import { resolveZodiacElement }                from "@/lib/astrology/zodiacElement/engine"
import { resolveNaAm }                         from "@/lib/astrology/naAmResolver/engine"
import { resolveZodiacHour }                   from "@/lib/astrology/zodiacHourBranch/engine"
import { resolveZodiacCompatibility }          from "@/lib/astrology/zodiacCompatibility/engine"
import { resolveElementCompatibility }         from "@/lib/astrology/elementCompatibility/engine"
import { convertSolarToLunar }                 from "@/lib/astrology/solarToLunar"
import { resolveWesternZodiac }                from "@/lib/astrology/westernZodiac"
import { calculateLunarMonthResolver }         from "@/lib/astrology/lunarMonthResolver/engine"
import { calculateThienCanElement }            from "@/lib/astrology/thienCanElement/engine"
import { calculateZodiacPairCompatibility }    from "@/lib/astrology/zodiacPairCompatibility/engine"

export const astrologyModules = {
  resolveLunarYear,
  calculateSexagenary,
  resolveZodiacAnimal,
  resolveZodiacElement,
  resolveNaAm,
  resolveZodiacHour,
  resolveZodiacCompatibility,
  resolveElementCompatibility,
  convertSolarToLunar,
  resolveWesternZodiac,
  calculateLunarMonthResolver,
  calculateThienCanElement,
  calculateZodiacPairCompatibility,
} as const

export type AstrologyModules = typeof astrologyModules
