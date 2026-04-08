import type { EarthlyBranch }               from "@/lib/astrology/sexagenaryCycle/types"
import type { ZodiacCompatibilityResult }   from "@/lib/astrology/zodiacCompatibility/types"
import { zodiacCompatibility }              from "@/lib/astrology/zodiacCompatibility/data"

export function resolveZodiacCompatibility(branch: EarthlyBranch): ZodiacCompatibilityResult {
  return zodiacCompatibility[branch]
}
