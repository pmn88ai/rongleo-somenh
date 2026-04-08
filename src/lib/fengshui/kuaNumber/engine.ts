import type { KuaInput, KuaResult } from "@/lib/fengshui/kuaNumber/types"
import { reducePlain }              from "@/lib/core/numerology"

export function calculateKuaNumber(input: KuaInput): KuaResult {
  const reduced = reducePlain(input.zodiacYear)
  let kua = input.gender === "male" ? 11 - reduced : reduced + 4
  kua = reducePlain(kua)
  if (kua === 5) kua = input.gender === "male" ? 2 : 8
  return { kuaNumber: kua }
}
