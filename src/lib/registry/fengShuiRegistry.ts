// ─────────────────────────────────────────────
//  Feng Shui Registry
//
//  Named map of every feng shui engine function.
//  The profileAggregator imports engines through
//  this registry instead of individual modules.
//
//  Pipeline: kua → baTrachCungPhi → directions → lucky
// ─────────────────────────────────────────────

import { calculateKuaNumber }       from "@/lib/fengshui/kuaNumber/engine"
import { resolveBaTrachCungPhi }    from "@/lib/fengshui/baTrachCungPhi/engine"
import { resolveBaTrachDirections } from "@/lib/fengshui/baTrachDirection/engine"
import { resolveLuckyColors }       from "@/lib/fengshui/luckyColor/engine"
import { resolveLuckyDirections }   from "@/lib/fengshui/luckyDirection/engine"
import { calculateLuckyNumber }     from "@/lib/fengshui/luckyNumber/engine"

export const fengShuiModules = {
  calculateKuaNumber,
  resolveBaTrachCungPhi,
  resolveBaTrachDirections,
  resolveLuckyColors,
  resolveLuckyDirections,
  calculateLuckyNumber,
} as const

export type FengShuiModules = typeof fengShuiModules
