// engine.ts — profileDeserializer

import type { ProfileDeserializerInput, DeserializedProfile } from "@/lib/core/profileDeserializer/types"

export function calculateProfileDeserializer(
  input: ProfileDeserializerInput
): DeserializedProfile {
  return JSON.parse(input.raw) as DeserializedProfile
}
