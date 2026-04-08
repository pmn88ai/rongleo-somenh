import type { SignalGroup } from "../shared/types"

export type BarChartOrientation = "horizontal" | "vertical"

// BarChart renders one bar per signal in the group.
// Each signal.value is coerced to a number for bar sizing.
// Non-numeric or null values are clamped to 0.
// The caller (page/container) is responsible for providing
// numeric-coercible values in each SignalEntry.

export type BarChartInput = {
  group: SignalGroup
  title?: string
  orientation?: BarChartOrientation  // default: "horizontal"
  maxValue?: number                  // explicit scale ceiling; defaults to max value in group
}
