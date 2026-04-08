import type { HeavenlyStem }                          from "@/lib/astrology/sexagenaryCycle/types"
import type { NguHanhElement, ZodiacElementResult }   from "@/lib/astrology/zodiacElement/types"

const STEM_TO_ELEMENT: Record<HeavenlyStem, NguHanhElement> = {
  "Giáp":"Mộc","Ất":"Mộc",
  "Bính":"Hỏa","Đinh":"Hỏa",
  "Mậu":"Thổ","Kỷ":"Thổ",
  "Canh":"Kim","Tân":"Kim",
  "Nhâm":"Thủy","Quý":"Thủy",
}

export function resolveZodiacElement(stem: HeavenlyStem): ZodiacElementResult {
  return { element: STEM_TO_ELEMENT[stem] }
}
