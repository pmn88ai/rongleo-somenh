// engine.ts — profileSerializer

import type { ProfileSerializerInput, SerializedProfile } from "@/lib/core/profileSerializer/types"

export function calculateProfileSerializer(
  input: ProfileSerializerInput
): SerializedProfile {
  return JSON.stringify(input.profile)
}
