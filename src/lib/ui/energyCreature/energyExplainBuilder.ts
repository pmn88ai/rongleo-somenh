// ─────────────────────────────────────────────
//  Energy Creature — Explanation Builder
//  src/lib/ui/energyCreature/energyExplainBuilder.ts
//
//  Builds the explanation panel data from the full
//  Python engine response. Reads data only — no recompute.
//
//  RULES:
//  - Input: full energyAxis object from /api/energy-axis
//  - Output: AxisExplainEntry[] — one row per axis
//  - contributions[] come from mappings[] in the API response
//  - values are READ from Python data, never recomputed
//  - NO new math
//  - NO derived values
// ─────────────────────────────────────────────

import type {
  AxisVector,
  SignalMapping,
  AxisExplainEntry,
} from "./energyCreatureTypes"

// Vietnamese labels for each axis key
export const AXIS_LABELS: Record<string, string> = {
  hanh_dong: "Hành động",
  phan_tich:  "Phân tích",
  cam_nhan:   "Cảm nhận",
  on_dinh:    "Ổn định",
  bien_doi:   "Biến đổi",
  kiem_soat:  "Kiểm soát",
}

const AXIS_KEYS: (keyof AxisVector)[] = [
  "hanh_dong",
  "phan_tich",
  "cam_nhan",
  "on_dinh",
  "bien_doi",
  "kiem_soat",
]

export function buildExplanation(
  rawVector:        AxisVector,
  normalizedVector: AxisVector,
  mappings:         SignalMapping[],
): AxisExplainEntry[] {
  return AXIS_KEYS.map((axis) => ({
    axis,
    label:           AXIS_LABELS[axis] ?? axis,
    rawValue:        rawVector[axis],
    normalizedValue: normalizedVector[axis],
    contributions:   mappings.map((m) => ({
      signal: m.signal,
      value:  m.mapping[axis],
    })),
  }))
}
