export type PhoneDominantNumberInput = {
  frequency: Record<string, number> // from phoneDigitFrequency
}

export type PhoneDominantNumberResult = {
  dominantDigits: number[]   // digit(s) with highest frequency — may be multiple if tied
  dominantFrequency: number  // how many times the dominant digit(s) appear
}
