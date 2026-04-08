// ─────────────────────────────────────────────
//  Energy Creature — Types
//  src/lib/ui/energyCreature/energyCreatureTypes.ts
//
//  Input types for the Energy Creature UI layer.
//  All values sourced from Python engine response only.
//  No computation. No interpretation.
// ─────────────────────────────────────────────

// AxisVector — mirrors Python engine output shape
export type AxisVector = {
  hanh_dong: number
  phan_tich:  number
  cam_nhan:   number
  on_dinh:    number
  bien_doi:   number
  kiem_soat:  number
}

// SignalMapping — one signal's per-axis contribution from Python engine
export type SignalMapping = {
  signal:  string
  mapping: AxisVector
}

// EnergyCreatureModel — visual parameters derived from normalizedVector
// Each field maps directly to one axis value. No extra computation.
export type EnergyCreatureModel = {
  spikeCount:  number   // from hanh_dong — controls number of polygon points
  roundness:   number   // from cam_nhan  — 0–1, controls blob smoothing
  symmetry:    number   // from phan_tich — 0–1, controls point regularity
  distortion:  number   // from bien_doi  — 0–1, controls noise offset
  rigidity:    number   // from kiem_soat — 0–1, controls sharpness
  stability:   number   // from on_dinh   — 0–1, controls base size
}

// AxisExplainEntry — one axis row in the explanation panel
export type AxisExplainEntry = {
  axis:          string        // axis key (e.g. "hanh_dong")
  label:         string        // Vietnamese label
  rawValue:      number        // from raw_vector
  normalizedValue: number      // from normalized_vector
  contributions: ContributionEntry[]  // per-signal contribution from mappings[]
}

// ContributionEntry — one signal's value for this axis
export type ContributionEntry = {
  signal: string   // e.g. "Sun in Aries"
  value:  number   // mapping[axis] for this signal
}
