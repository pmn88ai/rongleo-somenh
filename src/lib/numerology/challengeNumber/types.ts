export type ChallengeBaseNumber = number

export type ChallengeValue = {
  baseNumber: number
}

export type ChallengeNumberInput = {
  birthMonth: number
  birthDay:   number
  birthYear:  number
}

export type ChallengeNumberResult = {
  challenge1: ChallengeValue
  challenge2: ChallengeValue
  challenge3: ChallengeValue
  challenge4: ChallengeValue
}
