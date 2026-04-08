import type { NguHanhElement }              from "@/lib/astrology/zodiacElement/types"
import type { ElementCompatibilityResult }  from "@/lib/astrology/elementCompatibility/types"

const MAP: Record<NguHanhElement, ElementCompatibilityResult> = {
  "Kim":  { generates:"Thủy", generatedBy:"Thổ",  destroys:"Mộc",  destroyedBy:"Hỏa"  },
  "Mộc":  { generates:"Hỏa",  generatedBy:"Thủy", destroys:"Thổ",  destroyedBy:"Kim"  },
  "Thủy": { generates:"Mộc",  generatedBy:"Kim",  destroys:"Hỏa",  destroyedBy:"Thổ"  },
  "Hỏa":  { generates:"Thổ",  generatedBy:"Mộc",  destroys:"Kim",  destroyedBy:"Thủy" },
  "Thổ":  { generates:"Kim",  generatedBy:"Hỏa",  destroys:"Thủy", destroyedBy:"Mộc"  },
}

export function resolveElementCompatibility(element: NguHanhElement): ElementCompatibilityResult {
  return MAP[element]
}
