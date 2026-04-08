import type { PhoneBalanceInput, PhoneBalanceResult } from "@/lib/numerology/phone/phoneBalance/types"

const MASTER_NUMBERS = new Set([11, 22, 33])
const ALL_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

function sumDigitsOf(n: number): number {
  let total = 0
  while (n > 0) {
    total += n % 10
    n = Math.floor(n / 10)
  }
  return total
}

function reduce(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = sumDigitsOf(n)
  }
  return n
}

export function calculatePhoneBalance(
  input: PhoneBalanceInput
): PhoneBalanceResult {
  const { frequency } = input

  const presentDigits: number[] = []

  for (const digit of ALL_DIGITS) {
    if ((frequency[digit] ?? 0) > 0) {
      presentDigits.push(parseInt(digit, 10))
    }
  }

  if (presentDigits.length === 0) {
    throw new Error("phoneBalance: frequency map contains no digit occurrences.")
  }

  const rawSum = presentDigits.reduce((acc, d) => acc + d, 0)
  const phoneBalance = rawSum === 0 ? 0 : reduce(rawSum)
  const isMaster = MASTER_NUMBERS.has(phoneBalance)

  return {
    phoneBalance,
    isMaster,
    uniqueDigitCount: presentDigits.length,
  }
}
