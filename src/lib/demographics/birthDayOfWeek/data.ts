// ─────────────────────────────────────────────────────────────────
//  Day of Week Name Table
//
//  Index follows JS Date convention: 0 = Sunday … 6 = Saturday.
//  Used to resolve dayIndex → English and Vietnamese weekday names.
// ─────────────────────────────────────────────────────────────────

export type DayOfWeekEntry = {
  dayNameEnglish:    string
  dayNameVietnamese: string
}

export const DAY_OF_WEEK_TABLE: Record<number, DayOfWeekEntry> = {
  0: { dayNameEnglish: "Sunday",    dayNameVietnamese: "Chủ Nhật" },
  1: { dayNameEnglish: "Monday",    dayNameVietnamese: "Thứ Hai"  },
  2: { dayNameEnglish: "Tuesday",   dayNameVietnamese: "Thứ Ba"   },
  3: { dayNameEnglish: "Wednesday", dayNameVietnamese: "Thứ Tư"   },
  4: { dayNameEnglish: "Thursday",  dayNameVietnamese: "Thứ Năm"  },
  5: { dayNameEnglish: "Friday",    dayNameVietnamese: "Thứ Sáu"  },
  6: { dayNameEnglish: "Saturday",  dayNameVietnamese: "Thứ Bảy"  },
}
