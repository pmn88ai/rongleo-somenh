import type { PhoneDigitFrequencyInput, PhoneDigitFrequencyResult } from "@/lib/numerology/phone/phoneDigitFrequency/types"

export function calculatePhoneDigitFrequency(
  input: PhoneDigitFrequencyInput
): PhoneDigitFrequencyResult {
  const { phoneDigits } = input

  if (!phoneDigits || phoneDigits.length === 0) {
    throw new Error("phoneDigits must not be empty.")
  }

  if (!/^\d+$/.test(phoneDigits)) {
    throw new Error(`phoneDigits must contain only digits. Received: "${phoneDigits}"`)
  }

  const frequency: Record<string, number> = {
    "0": 0, "1": 0, "2": 0, "3": 0, "4": 0,
    "5": 0, "6": 0, "7": 0, "8": 0, "9": 0,
  }

  for (const ch of phoneDigits) {
    frequency[ch]++
  }

  return {
    frequency,
    digitCount: phoneDigits.length,
  }
}
