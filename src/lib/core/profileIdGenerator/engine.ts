// engine.ts — profileIdGenerator

import type { ProfileIdInput, ProfileId } from "@/lib/core/profileIdGenerator/types"

function formatDateSegment(date: Date): string {
  const year  = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day   = String(date.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

export function calculateProfileIdGenerator(input: ProfileIdInput): ProfileId {
  const datePart   = formatDateSegment(input.timestamp)
  const randomPart = input.randomSegment
  return `profile_${datePart}_${randomPart}`
}
