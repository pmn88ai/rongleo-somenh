export type ThienCanElementInput = {
  yearStemIndex: number // 0–9, from lunarYearResolver
}

export type ThienCanElementResult = {
  stemIndex: number
  stemName: string
  stemElement: string
  stemElementEnglish: string
  stemPolarity: "Dương" | "Âm"
}
