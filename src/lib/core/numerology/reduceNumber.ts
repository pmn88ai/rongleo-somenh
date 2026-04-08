import { sumDigits } from "@/lib/core/numerology/sumDigits"

export type ReduceResult = {
  baseNumber:    number
  masterNumber?: number
}

export function reduceNumber(n: number): ReduceResult {
  if (n === 11 || n === 22) {
    return { masterNumber: n, baseNumber: sumDigits(n) }
  }
  let r = n
  while (r > 9) r = sumDigits(r)
  return { baseNumber: r }
}
