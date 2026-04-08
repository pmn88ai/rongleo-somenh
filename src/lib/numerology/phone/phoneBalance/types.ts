export type PhoneBalanceInput = {
  frequency: Record<string, number> // from phoneDigitFrequency
}

export type PhoneBalanceResult = {
  phoneBalance: number      // reduced value: 1–9, or master number 11 | 22 | 33
  isMaster: boolean         // true if result is 11, 22, or 33
  uniqueDigitCount: number  // how many distinct digits contributed to the sum
}
