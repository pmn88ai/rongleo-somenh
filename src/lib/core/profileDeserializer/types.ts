// types.ts — profileDeserializer

import type { UnifiedAstrologyProfile } from "@/types/UnifiedAstrologyProfile"

export type { UnifiedAstrologyProfile }

export type ProfileDeserializerInput = {
  raw: string
}

export type DeserializedProfile = UnifiedAstrologyProfile
