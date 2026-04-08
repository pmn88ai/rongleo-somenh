import type { PhoneNumberNormalizerInput, PhoneNumberNormalizerResult } from "@/lib/core/phoneNumberNormalizer/types"

export function calculatePhoneNumberNormalizer(
  input: PhoneNumberNormalizerInput
): PhoneNumberNormalizerResult {
  const { rawPhone } = input

  let phoneDigits = ""

  for (let i = 0; i < rawPhone.length; i++) {
    const char = rawPhone[i]
    if (char >= "0" && char <= "9") {
      phoneDigits += char
    }
  }

  return { phoneDigits }
}
