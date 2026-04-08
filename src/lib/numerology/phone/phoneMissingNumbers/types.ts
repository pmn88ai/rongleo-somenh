export type PhoneMissingNumbersInput = {
  frequency: Record<string, number> // from phoneDigitFrequency
}

export type PhoneMissingNumbersResult = {
  missingDigits: number[] // digits with frequency = 0, in ascending order 0–9
  missingCount:  number   // how many digits are absent
}
