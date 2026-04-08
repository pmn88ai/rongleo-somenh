import type { FengShuiGroup } from "@/lib/fengshui/baTrachCungPhi/data"

export type BaTrachInput  = { kuaNumber: number }
export type BaTrachResult = {
  cungPhi: string
  element: "Kim"|"Mộc"|"Thủy"|"Hỏa"|"Thổ"
  group:   FengShuiGroup
}
