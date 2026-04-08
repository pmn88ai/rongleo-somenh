import type { PhoneLifePathInput, PhoneLifePathResult } from "@/lib/numerology/phone/phoneLifePath/types"

const MASTER_NUMBERS = new Set([11, 22, 33])

function sumDigits(n: number): number {
  let total = 0
  while (n > 0) {
    total += n % 10
    n = Math.floor(n / 10)
  }
  return total
}

function reduce(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = sumDigits(n)
  }
  return n
}

export function calculatePhoneLifePath(
  input: PhoneLifePathInput
): PhoneLifePathResult {
  const { phoneDigits } = input

  if (!phoneDigits || phoneDigits.length === 0) {
    throw new Error("phoneDigits must not be empty.")
  }

  if (!/^\d+$/.test(phoneDigits)) {
    throw new Error(`phoneDigits must contain only digits. Received: "${phoneDigits}"`)
  }

  const digitSum = phoneDigits
    .split("")
    .reduce((acc, ch) => acc + parseInt(ch, 10), 0)

  const phoneLifePath = reduce(digitSum)
  const isMaster = MASTER_NUMBERS.has(phoneLifePath)

  return {
    phoneLifePath,
    isMaster,
  }
}
