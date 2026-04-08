import type { BaTrachEnergy, CompassDirection } from "@/lib/fengshui/baTrachDirection/data"

export type DirectionEnergy        = { direction: CompassDirection; energy: BaTrachEnergy }
export type BaTrachDirectionResult = {
  auspicious:   DirectionEnergy[]
  inauspicious: DirectionEnergy[]
  all:          DirectionEnergy[]
}
