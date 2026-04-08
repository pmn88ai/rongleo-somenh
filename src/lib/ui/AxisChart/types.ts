import type { SignalGroup } from "../shared/types"

// AxisChart renders one horizontal axis track per signal.
// Each signal.value is coerced to a number and mapped to a
// position on a normalized [minValue, maxValue] scale line.
// Non-numeric or null values are clamped to minValue.
// The caller (page/container) is responsible for providing
// numeric-coercible values in each SignalEntry.
//
// Primary use case: Energy Axis scores (Phase 3).
// Also accepts any SignalGroup with numeric-coercible values.

export type AxisChartInput = {
  group: SignalGroup
  title?: string
  minValue?: number  // scale floor; defaults to 0
  maxValue?: number  // scale ceiling; defaults to max value in group
}
