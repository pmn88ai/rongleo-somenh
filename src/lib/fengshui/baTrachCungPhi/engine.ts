import type { BaTrachInput, BaTrachResult } from "@/lib/fengshui/baTrachCungPhi/types"
import { baTrachCungPhi }                   from "@/lib/fengshui/baTrachCungPhi/data"

export function resolveBaTrachCungPhi(input: BaTrachInput): BaTrachResult {
  const entry = baTrachCungPhi[input.kuaNumber]
  return { cungPhi: entry.cungPhi, element: entry.element, group: entry.group }
}
