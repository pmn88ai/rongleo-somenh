import { reducePlain } from "@/lib/core/numerology"
import type { ChallengeNumberInput, ChallengeNumberResult } from "@/lib/numerology/challengeNumber/types"

export function calculateChallengeNumber(input: ChallengeNumberInput): ChallengeNumberResult {
  const reducedMonth = reducePlain(input.birthMonth)
  const reducedDay   = reducePlain(input.birthDay)
  const reducedYear  = reducePlain(input.birthYear)

  const c1 = reducePlain(Math.abs(reducedMonth - reducedDay))
  const c2 = reducePlain(Math.abs(reducedDay   - reducedYear))
  const c3 = reducePlain(Math.abs(c1           - c2))
  const c4 = reducePlain(Math.abs(reducedMonth - reducedYear))

  return {
    challenge1: { baseNumber: c1 },
    challenge2: { baseNumber: c2 },
    challenge3: { baseNumber: c3 },
    challenge4: { baseNumber: c4 },
  }
}
