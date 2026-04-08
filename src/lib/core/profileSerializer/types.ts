// types.ts — profileSerializer

import type { UnifiedAstrologyProfile } from "@/types/UnifiedAstrologyProfile"

export type { UnifiedAstrologyProfile }

export type ProfileSerializerInput = {
  profile: UnifiedAstrologyProfile
}

export type SerializedProfile = string
// Format contract: valid JSON string representing a UnifiedAstrologyProfile
