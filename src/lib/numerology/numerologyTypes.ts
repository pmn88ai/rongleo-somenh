// Relaxed to plain number to avoid literal union assignment errors
export type BaseNumber = number
export type MasterNumber = number

export type NumerologyResult = {
  baseNumber:    number
  masterNumber?: number
}
