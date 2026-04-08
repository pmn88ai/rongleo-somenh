import type { ThienCanElementInput, ThienCanElementResult } from "@/lib/astrology/thienCanElement/types"
import { THIEN_CAN } from "@/lib/astrology/thienCanElement/data"

export function calculateThienCanElement(
  input: ThienCanElementInput
): ThienCanElementResult {
  const { yearStemIndex } = input

  if (yearStemIndex < 0 || yearStemIndex > 9) {
    throw new Error(`Invalid yearStemIndex: ${yearStemIndex}. Must be between 0 and 9.`)
  }

  const entry = THIEN_CAN[yearStemIndex]

  return {
    stemIndex: yearStemIndex,
    stemName: entry.stemName,
    stemElement: entry.stemElement,
    stemElementEnglish: entry.stemElementEnglish,
    stemPolarity: entry.stemPolarity,
  }
}
