// ─────────────────────────────────────────────────────────────────────────────
//  src/lib/ui/shared/formatValue.ts
//
//  CENTRALIZED formatting function for all UI signal values.
//
//  RULES (per FORMAT LAYER RULES governance):
//    • boolean  → "Có" / "Không"
//    • null/undefined → "—"
//    • array of primitives → join(", ")
//    • array of objects   → JSON.stringify(item) per element, join(", ")
//    • empty array        → "—"
//    • object             → JSON.stringify(value)
//    • primitive          → String(value)
//
//  FORBIDDEN:
//    • NO domain-specific transformation
//    • NO interpretation
//    • NO labeling based on meaning
//    • NO computed display
//
//  All UI components MUST import from this file.
//  Components MUST NOT define their own formatValue.
// ─────────────────────────────────────────────────────────────────────────────

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—"

  if (typeof value === "boolean") return value ? "Có" : "Không"

  if (Array.isArray(value)) {
    if (value.length === 0) return "—"
    return value
      .map((item) =>
        item !== null && typeof item === "object"
          ? JSON.stringify(item)
          : String(item)
      )
      .join(", ")
  }

  if (typeof value === "object") return JSON.stringify(value)

  return String(value)
}
