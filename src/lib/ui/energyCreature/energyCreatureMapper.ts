// ─────────────────────────────────────────────
//  Energy Creature — Mapper
//  src/lib/ui/energyCreature/energyCreatureMapper.ts
//
//  Maps normalizedVector → EnergyCreatureModel
//
//  RULES:
//  - Input MUST be normalizedVector from Python engine response
//  - Each field maps to exactly ONE axis value
//  - NO additional computation
//  - NO derived values
//  - NO clamping beyond what spec defines
// ─────────────────────────────────────────────

import type { AxisVector, EnergyCreatureModel } from "./energyCreatureTypes"

// Spec mapping (per order in task):
//   spikeCount  = round(hanh_dong)
//   roundness   = cam_nhan  / 10
//   symmetry    = phan_tich / 10
//   distortion  = bien_doi  / 10
//   rigidity    = kiem_soat / 10
//   stability   = on_dinh   / 10

export function mapToCreature(normalizedVector: AxisVector): EnergyCreatureModel {
  return {
    spikeCount:  Math.round(normalizedVector.hanh_dong),
    roundness:   normalizedVector.cam_nhan   / 10,
    symmetry:    normalizedVector.phan_tich  / 10,
    distortion:  normalizedVector.bien_doi   / 10,
    rigidity:    normalizedVector.kiem_soat  / 10,
    stability:   normalizedVector.on_dinh    / 10,
  }
}
