export type PhoneRepeatingPatternsInput = {
  frequency: Record<string, number> // from phoneDigitFrequency
}

export type RepeatingEntry = {
  digit:       number // the digit value 0–9
  occurrences: number // how many times it appears (≥ 2)
}

export type PhoneRepeatingPatternsResult = {
  repeatingDigits: RepeatingEntry[] // digits appearing 2+ times, in ascending order
  repeatingCount:  number           // how many distinct digits repeat
}
