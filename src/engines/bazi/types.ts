// src/engines/bazi/types.ts
// Stub types for Bazi (Tứ Trụ) engine
// Full implementation can be added later

export type BaziPillar = {
  can:   string
  chi:   string
  napAm: string
}

export type BaziShensha = {
  name:    string
  pillar:  string
  meaning: string
}

export type BaziData = {
  dayMaster:        string
  dayMasterElement: string
  strength:         "Vượng" | "Nhược" | "Trung Bình"
  strongScore:      number
  useful: {
    primary:   string
    secondary: string[]
  }
  pillars: {
    year:  BaziPillar
    month: BaziPillar
    day:   BaziPillar
    hour:  BaziPillar
  }
  shensha: BaziShensha[]
}
