// types.ts — profileIdGenerator

export type ProfileIdInput = {
  timestamp: Date
  randomSegment: string
}

export type ProfileId = string
// Format contract: "profile_YYYYMMDD_xxxxxx"
// Example:         "profile_20260310_ab12cd"
