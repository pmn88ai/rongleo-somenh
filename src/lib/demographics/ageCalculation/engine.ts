import type { AgeInput, AgeResult } from "@/lib/demographics/ageCalculation/types"

export function calculateAge(input: AgeInput): AgeResult {
  const today = new Date()
  const todayYear  = today.getFullYear()
  const todayMonth = today.getMonth() + 1   // getMonth() is 0-indexed
  const todayDay   = today.getDate()

  let age = todayYear - input.birthYear

  // Subtract 1 if the birthday has not yet occurred this calendar year
  const birthdayPassedThisYear =
    todayMonth > input.birthMonth ||
    (todayMonth === input.birthMonth && todayDay >= input.birthDay)

  if (!birthdayPassedThisYear) {
    age -= 1
  }

  return { age }
}
