import type { BaTrachEnergy, CompassDirection } from "@/lib/fengshui/baTrachDirection/data"
import type { DirectionEnergy, BaTrachDirectionResult } from "@/lib/fengshui/baTrachDirection/types"
import { baTrachDirections }                    from "@/lib/fengshui/baTrachDirection/data"

const AUSPICIOUS   = new Set<BaTrachEnergy>(["Sinh Khí","Thiên Y","Diên Niên","Phục Vị"])
const ENERGY_RANK: Record<BaTrachEnergy, number> = {
  "Sinh Khí":1,"Thiên Y":2,"Diên Niên":3,"Phục Vị":4,
  "Họa Hại":5,"Lục Sát":6,"Ngũ Quỷ":7,"Tuyệt Mệnh":8,
}

export function resolveBaTrachDirections(cungPhi: string): BaTrachDirectionResult {
  const map = baTrachDirections[cungPhi]
  const all = (Object.entries(map) as [CompassDirection, BaTrachEnergy][])
                .map(([direction, energy]) => ({ direction, energy }))
                .sort((a, b) => ENERGY_RANK[a.energy] - ENERGY_RANK[b.energy])
  return {
    all,
    auspicious:   all.filter(e => AUSPICIOUS.has(e.energy)),
    inauspicious: all.filter(e => !AUSPICIOUS.has(e.energy)),
  }
}
