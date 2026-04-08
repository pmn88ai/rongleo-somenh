export type FengShuiGroup = "Đông tứ mệnh" | "Tây tứ mệnh"

export const baTrachCungPhi: Record<number, {
  cungPhi: string
  element: "Kim"|"Mộc"|"Thủy"|"Hỏa"|"Thổ"
  group:   FengShuiGroup
}> = {
  1: { cungPhi:"Khảm", element:"Thủy", group:"Đông tứ mệnh" },
  2: { cungPhi:"Khôn", element:"Thổ",  group:"Tây tứ mệnh"  },
  3: { cungPhi:"Chấn", element:"Mộc",  group:"Đông tứ mệnh" },
  4: { cungPhi:"Tốn",  element:"Mộc",  group:"Đông tứ mệnh" },
  6: { cungPhi:"Càn",  element:"Kim",  group:"Tây tứ mệnh"  },
  7: { cungPhi:"Đoài", element:"Kim",  group:"Tây tứ mệnh"  },
  8: { cungPhi:"Cấn",  element:"Thổ",  group:"Tây tứ mệnh"  },
  9: { cungPhi:"Ly",   element:"Hỏa",  group:"Đông tứ mệnh" },
}
