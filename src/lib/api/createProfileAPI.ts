// src/lib/api/createProfileAPI.ts
// NOTE: This file is a stub. The main app flow uses buildUnifiedAstrologyProfile
// directly from @/lib/profileAggregator. This API wrapper is reserved for
// future server-side use with a database layer.

import { buildUnifiedAstrologyProfile } from "@/lib/profileAggregator"

export async function createProfileAPI(values: {
  fullName:    string
  birthDate:   string
  birthHour?:  number | null
  gender?:     "male" | "female" | "other" | "unspecified"
  phoneNumber?: string
}) {
  const gender = values.gender === "male" || values.gender === "female" ? values.gender : "other"

  const profile = buildUnifiedAstrologyProfile({
    fullName:    values.fullName,
    birthdate:   values.birthDate,
    gender,
    birthTime:   values.birthHour != null
      ? `${String(values.birthHour).padStart(2, "0")}:00`
      : undefined,
    phoneNumber: values.phoneNumber?.trim() || undefined,
  })

  return profile
}
