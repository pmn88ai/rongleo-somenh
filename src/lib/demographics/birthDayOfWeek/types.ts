export type BirthDayOfWeekInput = {
  birthYear:  number // from inputProfileNormalizer
  birthMonth: number // 1–12
  birthDay:   number // 1–31
}

export type BirthDayOfWeekResult = {
  dayIndex:           number // 0 = Sunday … 6 = Saturday (JS Date convention)
  dayNameEnglish:     string // e.g. "Monday"
  dayNameVietnamese:  string // e.g. "Thứ Hai"
}
