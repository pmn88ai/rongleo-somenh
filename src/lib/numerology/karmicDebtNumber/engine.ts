import { sumDigits, reducePlain, LETTER_VALUES, VOWELS } from "@/lib/core/numerology"
import type { KarmicDebtNumberInput, KarmicDebtNumberResult, KarmicDebtEntry, KarmicDebtSource, KarmicDebtValue } from "@/lib/numerology/karmicDebtNumber/types"

const KARMIC_DEBT_NUMBERS: KarmicDebtValue[] = [13, 14, 16, 19]

function getDetectionChain(n: number): number[] {
  const chain: number[] = [n]
  let current = n
  while (current > 9) {
    current = sumDigits(current)
    chain.push(current)
  }
  return chain
}

function findDebt(raw: number): KarmicDebtValue | null {
  const chain = getDetectionChain(raw)
  for (const value of chain) {
    if ((KARMIC_DEBT_NUMBERS as number[]).includes(value)) {
      return value as KarmicDebtValue
    }
  }
  return null
}

export function calculateKarmicDebtNumber(input: KarmicDebtNumberInput): KarmicDebtNumberResult {
  const { birthMonth, birthDay, birthYear, normalizedFullName } = input

  const reducedMonth = reducePlain(birthMonth)
  const reducedDay   = reducePlain(birthDay)
  const reducedYear  = reducePlain(birthYear)

  const letters = normalizedFullName.split("").filter(c => LETTER_VALUES[c] !== undefined)

  const rawBirthday    = birthDay
  const rawLifePath    = reducedMonth + reducedDay + reducedYear
  const rawExpression  = letters.reduce((sum, c) => sum + LETTER_VALUES[c], 0)
  const rawPersonality = letters
    .filter(c => !VOWELS.has(c))
    .reduce((sum, c) => sum + LETTER_VALUES[c], 0)

  const sources: Array<{ source: KarmicDebtSource; raw: number }> = [
    { source: "birthday",    raw: rawBirthday    },
    { source: "lifePath",    raw: rawLifePath    },
    { source: "expression",  raw: rawExpression  },
    { source: "personality", raw: rawPersonality },
  ]

  const debts: KarmicDebtEntry[] = []

  for (const { source, raw } of sources) {
    const debtNumber = findDebt(raw)
    if (debtNumber !== null) {
      debts.push({ source, debtNumber })
    }
  }

  return { debts, hasDebt: debts.length > 0 }
}
