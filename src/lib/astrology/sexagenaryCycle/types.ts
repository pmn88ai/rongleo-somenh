export type HeavenlyStem =
  | "Giáp" | "Ất" | "Bính" | "Đinh" | "Mậu"
  | "Kỷ" | "Canh" | "Tân" | "Nhâm" | "Quý"

export type EarthlyBranch =
  | "Tý"
  | "Sửu"
  | "Dần"
  | "Mão"
  | "Thìn"
  | "Tỵ"
  | "Ngọ"
  | "Mùi"
  | "Thân"
  | "Dậu"
  | "Tuất"
  | "Hợi"

export type SexagenaryInput = {
  zodiacYear: number
}

export type SexagenaryResult = {
  stem: HeavenlyStem
  branch: EarthlyBranch
  canChi: string
  cycleIndex: number
}