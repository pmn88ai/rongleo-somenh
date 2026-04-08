// Shared UI contract types.
// These are the only types that UI components may accept.
// Components must NOT import engine types or UnifiedAstrologyProfile.

export type SignalEntry = {
  engine: string
  domain: string
  value: unknown
  label?: string
}

export type SignalGroup = {
  domain: string
  signals: SignalEntry[]
}
