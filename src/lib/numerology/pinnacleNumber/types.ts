export type PinnacleNumberInput = {
  birthMonth: number
  birthDay:   number
  birthYear:  number
}

export type PinnacleValue = {
  baseNumber:    number
  masterNumber?: number
}

export type PinnacleNumberResult = {
  pinnacle1: PinnacleValue
  pinnacle2: PinnacleValue
  pinnacle3: PinnacleValue
  pinnacle4: PinnacleValue
}
