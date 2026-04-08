export type KarmicDebtSource = "lifePath" | "expression" | "birthday" | "personality"

export type KarmicDebtValue = number

export type KarmicDebtEntry = {
  source:     KarmicDebtSource
  debtNumber: KarmicDebtValue
}

export type KarmicDebtNumberInput = {
  birthMonth:         number
  birthDay:           number
  birthYear:          number
  normalizedFullName: string
}

export type KarmicDebtNumberResult = {
  debts:   KarmicDebtEntry[]
  hasDebt: boolean
}
