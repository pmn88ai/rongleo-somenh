import type { SexagenaryInput, SexagenaryResult } from "@/lib/astrology/sexagenaryCycle/types"
import { sexagenaryCycle }                         from "@/lib/astrology/sexagenaryCycle/data"

export function calculateSexagenary(input: SexagenaryInput): SexagenaryResult {
  const cycleIndex = ((input.zodiacYear - 1984) % 60 + 60) % 60
  const entry      = sexagenaryCycle[cycleIndex]
  return { stem: entry.stem, branch: entry.branch, canChi: `${entry.stem} ${entry.branch}`, cycleIndex }
}
