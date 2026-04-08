export type LunarYearInput = {
    birthYear: number
    birthMonth: number
    birthDay: number
  }
  
  export type LunarYearResult =
    | { success: true; zodiacYear: number }
    | {
        success: false
        error: {
          code: "YEAR_OUT_OF_RANGE"
          year: number
          message: string
        }
      }