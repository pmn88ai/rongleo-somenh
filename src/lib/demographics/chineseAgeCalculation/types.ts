export type ChineseAgeCalculationInput = {
  birthYear:    number // from inputProfileNormalizer
  currentYear:  number // calendar year at time of calculation
  currentMonth: number // 1–12, current calendar month
  currentDay:   number // 1–31, current calendar day
}

export type ChineseAgeCalculationResult = {
  chineseAge: number // age in Vietnamese/Chinese traditional counting system (tuổi ta)
}
