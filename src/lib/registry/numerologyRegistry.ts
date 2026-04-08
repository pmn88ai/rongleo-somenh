// ─────────────────────────────────────────────
//  Numerology Registry
//
//  Named map of every numerology engine function.
//  The profileAggregator imports engines through
//  this registry instead of individual modules.
//
//  IMPORTANT: the registry does NOT define a shared
//  context type or dispatch via a loop.  Each engine
//  keeps its own typed input signature.  The aggregator
//  calls them explicitly, in dependency order.
// ─────────────────────────────────────────────

import { calculateLifePath }                from "@/lib/numerology/lifePath/engine"
import { calculateExpression }              from "@/lib/numerology/expression/engine"
import { calculateSoulUrge }                from "@/lib/numerology/soulUrge/engine"
import { calculatePersonality }             from "@/lib/numerology/personality/engine"
import { calculateBirthday }                from "@/lib/numerology/birthday/engine"
import { calculateMaturity }                from "@/lib/numerology/maturity/engine"
import { calculatePersonalYear }            from "@/lib/numerology/personalYear/engine"
import { calculatePersonalMonth }           from "@/lib/numerology/personalMonth/engine"
import { calculatePersonalDay }             from "@/lib/numerology/personalDay/engine"
import { calculatePinnacleNumber }          from "@/lib/numerology/pinnacleNumber/engine"
import { calculateChallengeNumber }         from "@/lib/numerology/challengeNumber/engine"
import { calculateBalanceNumber }           from "@/lib/numerology/balanceNumber/engine"
import { calculateHiddenPassion }           from "@/lib/numerology/hiddenPassion/engine"
import { calculateKarmicDebtNumber }        from "@/lib/numerology/karmicDebtNumber/engine"
import { calculatePinnacleCycleResolver }   from "@/lib/numerology/pinnacleCycleResolver/engine"
import { calculateChallengeCycleResolver }  from "@/lib/numerology/challengeCycleResolver/engine"
import { calculateCurrentPinnacleResolver } from "@/lib/numerology/currentPinnacleResolver/engine"
import { calculateCurrentChallengeResolver } from "@/lib/numerology/currentChallengeResolver/engine"
import { calculateNumerologyCompatibility } from "@/lib/numerology/numerologyCompatibility/engine"

export const numerologyModules = {
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
  calculateBirthday,
  calculateMaturity,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculatePersonalDay,
  calculatePinnacleNumber,
  calculateChallengeNumber,
  calculateBalanceNumber,
  calculateHiddenPassion,
  calculateKarmicDebtNumber,
  calculatePinnacleCycleResolver,
  calculateChallengeCycleResolver,
  calculateCurrentPinnacleResolver,
  calculateCurrentChallengeResolver,
  calculateNumerologyCompatibility,
} as const

export type NumerologyModules = typeof numerologyModules
