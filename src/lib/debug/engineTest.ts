import { buildUnifiedAstrologyProfile } from "@/lib/profileAggregator/engine"

type TestCase = {
  fullName:   string
  birthdate:  string
  gender?:    "male" | "female" | "other"
  birthTime?: string
}

const testCases: TestCase[] = [
  {
    fullName:  "NGUYEN VAN AN",
    birthdate: "1990-07-15",
    gender:    "male",
    birthTime: "08:30",
  },
  {
    fullName:  "TRAN THI MAI",
    birthdate: "1995-11-02",
    gender:    "female",
    birthTime: "14:20",
  },
  {
    fullName:  "LE MINH TRI",
    birthdate: "1988-04-07",
    gender:    "male",
  },
]

export function runEngineTests() {
  const results = []

  for (const test of testCases) {
    try {
      const profile = buildUnifiedAstrologyProfile(test)
      results.push({ input: test, success: true, result: profile })
    } catch (err) {
      results.push({ input: test, success: false, error: String(err) })
    }
  }

  return results
}
