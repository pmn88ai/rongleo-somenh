import type { EarthlyBranch }      from "@/lib/astrology/sexagenaryCycle/types"
import type { ZodiacAnimalResult } from "@/lib/astrology/zodiacChineseAnimal/types"

const BRANCH_TO_ANIMAL: Record<EarthlyBranch, string> = {
  "Tý":"Chuột","Sửu":"Trâu","Dần":"Hổ","Mão":"Mèo",
  "Thìn":"Rồng","Tỵ":"Rắn","Ngọ":"Ngựa","Mùi":"Dê",
  "Thân":"Khỉ","Dậu":"Gà","Tuất":"Chó","Hợi":"Lợn",
}

export function resolveZodiacAnimal(branch: EarthlyBranch): ZodiacAnimalResult {
  return { animal: BRANCH_TO_ANIMAL[branch], branch }
}
