import type { SignalGroup } from "../shared/types"

// RadarChart renders one axis per signal in the group.
// Each signal.value is coerced to a number for plotting.
// Non-numeric or null values are clamped to 0.
// The caller (page/container) is responsible for providing
// numeric-coercible values in each SignalEntry.

export type RadarChartInput = {
  group: SignalGroup
  title?: string
  maxValue?: number  // explicit scale ceiling; defaults to max value in group
}
