import type { SignalEntry } from "../shared/types"

// SignalTable receives a flat array of all signals across domains.
// The caller (page/container) concatenates multiple SignalGroups
// into a single SignalEntry[] before passing to this component.

export type SignalTableInput = {
  signals: SignalEntry[]
}
