export type LuckyNumberInput = {
  kuaNumber: number // kuaNumber.kuaNumber — guaranteed 1–9 excl. 5 by upstream engine
}

export type LuckyNumberResult = {
  luckyNumber:  number    // primary lucky number (1–9)
  luckyNumbers: number[]  // full set of auspicious numbers for this kua
}
