export type ZodiacRelationship = "Tam Hợp" | "Lục Hợp" | "Tứ Hành Xung" | "Trung lập"
export type CompatibilityTier  = "Tốt" | "Trung bình" | "Xung"

export type ZodiacPairCompatibilityInput = {
  animalA: string // zodiacChineseAnimal.animal of person A — e.g. "Chuột", "Hổ"
  animalB: string // zodiacChineseAnimal.animal of person B
}

export type ZodiacPairCompatibilityResult = {
  relationship:      ZodiacRelationship
  compatibilityTier: CompatibilityTier
  isHarmonic:        boolean // true for Tam Hợp or Lục Hợp
  isConflict:        boolean // true for Tứ Hành Xung
}
