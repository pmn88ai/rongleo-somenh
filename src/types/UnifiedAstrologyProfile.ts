// ─────────────────────────────────────────────
//  src/types/UnifiedAstrologyProfile.ts
//
//  Canonical re-export of the UnifiedAstrologyProfile
//  type from the profileAggregator layer.
//
//  This file is the single @/types/UnifiedAstrologyProfile
//  import target used by the persistence and serialization
//  modules. It re-exports from the authoritative source
//  so the schema is never duplicated.
// ─────────────────────────────────────────────

export type { UnifiedAstrologyProfile } from "@/lib/profileAggregator/types"
