export type PhoneDigitFrequencyInput = {
  phoneDigits: string // normalized digit string from phoneNumberNormalizer
}

export type PhoneDigitFrequencyResult = {
  frequency: Record<string, number> // e.g. { "0": 2, "1": 1, ..., "9": 1 }
  digitCount: number                 // total number of digits processed
}
