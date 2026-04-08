import type { NguHanhElement } from "@/lib/astrology/zodiacElement/types"

export type ElementCompatibilityResult = {
  generates:   NguHanhElement
  generatedBy: NguHanhElement
  destroys:    NguHanhElement
  destroyedBy: NguHanhElement
}
