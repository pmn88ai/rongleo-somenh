import type { PinnacleCycleResolverInput, PinnacleCycleResolverResult, PinnacleAgeRange } from "@/lib/numerology/pinnacleCycleResolver/types"

export function calculatePinnacleCycleResolver(input: PinnacleCycleResolverInput): PinnacleCycleResolverResult {
  const { lifePathBaseNumber, currentAge } = input

  const firstPinnacleLength = 36 - lifePathBaseNumber

  const ageRanges: Record<1 | 2 | 3 | 4, PinnacleAgeRange> = {
    1: { startAge: 0,                        endAge: firstPinnacleLength - 1  },
    2: { startAge: firstPinnacleLength,       endAge: firstPinnacleLength + 8  },
    3: { startAge: firstPinnacleLength + 9,   endAge: firstPinnacleLength + 17 },
    4: { startAge: firstPinnacleLength + 18,  endAge: null                     },
  }

  let activePinnacle: 1 | 2 | 3 | 4

  if (currentAge <= (ageRanges[1].endAge as number)) {
    activePinnacle = 1
  } else if (currentAge <= (ageRanges[2].endAge as number)) {
    activePinnacle = 2
  } else if (currentAge <= (ageRanges[3].endAge as number)) {
    activePinnacle = 3
  } else {
    activePinnacle = 4
  }

  return { activePinnacle, firstPinnacleLength, ageRanges }
}
