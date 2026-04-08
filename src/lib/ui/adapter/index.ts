// ─────────────────────────────────────────────
//  src/lib/ui/adapter/index.ts
//
//  Public export surface for the UI Adapter layer.
//
//  IMPORT RULES:
//    • UI components and pages import from here only.
//    • Never import directly from profileAdapter.ts
//      or types.ts — always use this index.
//    • Never import UnifiedAstrologyProfile from
//      this module — it is intentionally not
//      re-exported. Use @/lib/profileAggregator/types
//      only in the Observatory page to type the raw
//      result, then pass it immediately into adaptProfile().
// ─────────────────────────────────────────────

export { adaptProfile }          from "./profileAdapter"
export type { AdapterInput }     from "./types"
export type { ObservatoryMeta }  from "./types"
export type { ObservatoryProfile } from "./types"
