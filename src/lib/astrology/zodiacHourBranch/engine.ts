import type { EarthlyBranch }                         from "@/lib/astrology/sexagenaryCycle/types"
import type { ZodiacHourInput, ZodiacHourResult }     from "@/lib/astrology/zodiacHourBranch/types"

export function resolveZodiacHour(input: ZodiacHourInput): ZodiacHourResult {
  const h = input.birthHour === 23 ? -1 : input.birthHour
  let branch: EarthlyBranch
  if      (h <  1)  branch = "Tý"
  else if (h <  3)  branch = "Sửu"
  else if (h <  5)  branch = "Dần"
  else if (h <  7)  branch = "Mão"
  else if (h <  9)  branch = "Thìn"
  else if (h < 11)  branch = "Tỵ"
  else if (h < 13)  branch = "Ngọ"
  else if (h < 15)  branch = "Mùi"
  else if (h < 17)  branch = "Thân"
  else if (h < 19)  branch = "Dậu"
  else if (h < 21)  branch = "Tuất"
  else              branch = "Hợi"
  return { branch }
}
