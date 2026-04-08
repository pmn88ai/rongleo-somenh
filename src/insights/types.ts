// src/insights/types.ts

export type InsightType =
  | "personality"
  | "career"
  | "relationship"
  | "health"
  | "finance"

export type InsightSource =
  | "numerology"
  | "astrology"
  | "fengshui"

// Tone: điểm mạnh / trung tính / cảnh báo
// Dùng để highlight UI và để AI biết tone khi diễn đạt
export type InsightTone =
  | "positive"   // điểm mạnh, tiềm năng
  | "neutral"    // đặc điểm trung tính, thông tin
  | "warning"    // điểm yếu, bài học, cần chú ý

// Priority: xác định insight nào là cốt lõi
// core   = Life Path, Ngũ Hành — xương sống của profile
// strong = Expression, Animal, Zodiac — quan trọng nhưng thứ yếu
// weak   = năm cá nhân, feng shui — theo hoàn cảnh
export type InsightPriority =
  | "core"
  | "strong"
  | "weak"

export interface Insight {
  type:     InsightType
  source:   InsightSource
  priority: InsightPriority
  tone:     InsightTone
  weight:   number          // 1–10, dùng để sort trong cùng priority
  content:  string          // tiếng Việt, 1–2 câu
  tags?:    string[]
}

export type InsightRule<T> = {
  match:   (data: T) => boolean
  insight: Insight
}
