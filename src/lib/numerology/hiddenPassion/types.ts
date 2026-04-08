export type HiddenPassionInput = {
  normalizedFullName: string
}

export type HiddenPassionResult = {
  dominantDigits: number[]
  frequency:      number
  digitCounts:    Record<number, number>
}
