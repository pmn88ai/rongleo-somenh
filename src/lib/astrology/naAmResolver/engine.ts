import type { NaAmInput, NaAmResult } from "@/lib/astrology/naAmResolver/types"
import { naAmElements }               from "@/lib/astrology/naAmResolver/data"

export function resolveNaAm(input: NaAmInput): NaAmResult {
  const entry = naAmElements[input.cycleIndex]
  return { name: entry.name, element: entry.element }
}
