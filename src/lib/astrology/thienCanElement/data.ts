export type ThienCanEntry = {
  stemName: string
  stemElement: string
  stemElementEnglish: string
  stemPolarity: "Dương" | "Âm"
}

export const THIEN_CAN: ThienCanEntry[] = [
  { stemName: "Giáp", stemElement: "Mộc", stemElementEnglish: "Wood",  stemPolarity: "Dương" }, // 0
  { stemName: "Ất",   stemElement: "Mộc", stemElementEnglish: "Wood",  stemPolarity: "Âm"    }, // 1
  { stemName: "Bính", stemElement: "Hỏa", stemElementEnglish: "Fire",  stemPolarity: "Dương" }, // 2
  { stemName: "Đinh", stemElement: "Hỏa", stemElementEnglish: "Fire",  stemPolarity: "Âm"    }, // 3
  { stemName: "Mậu",  stemElement: "Thổ", stemElementEnglish: "Earth", stemPolarity: "Dương" }, // 4
  { stemName: "Kỷ",   stemElement: "Thổ", stemElementEnglish: "Earth", stemPolarity: "Âm"    }, // 5
  { stemName: "Canh", stemElement: "Kim", stemElementEnglish: "Metal", stemPolarity: "Dương" }, // 6
  { stemName: "Tân",  stemElement: "Kim", stemElementEnglish: "Metal", stemPolarity: "Âm"    }, // 7
  { stemName: "Nhâm", stemElement: "Thủy", stemElementEnglish: "Water", stemPolarity: "Dương" }, // 8
  { stemName: "Quý",  stemElement: "Thủy", stemElementEnglish: "Water", stemPolarity: "Âm"    }, // 9
]
