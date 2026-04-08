export type PhoneLifePathInput = {
  phoneDigits: string // normalized digit string from phoneNumberNormalizer e.g. "0901234567"
}

export type PhoneLifePathResult = {
  phoneLifePath: number // reduced value: 1–9, or master number 11 | 22 | 33
  isMaster: boolean     // true if result is 11, 22, or 33
}
