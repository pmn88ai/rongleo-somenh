// src/ai/promptBuilder.ts
//
// Nhận insights đã processed + summary → trả về prompt string cho Groq.
// KHÔNG nhận raw engine ctx. KHÔNG nhận UnifiedAstrologyProfile trực tiếp.
// Chỉ làm việc với Insight[] và InsightSummary — đã qua dedup + priority sort.

import type { Insight } from "@/insights/types"
import type { InsightSummary } from "@/insights/merger"
import type { Conflict }      from "@/insights/merger"
import type { ObservatoryMeta } from "@/lib/ui/adapter/types"

// ─────────────────────────────────────────────────────────────────────────────

export type PromptInput = {
  meta:        ObservatoryMeta
  insights:    Insight[]
  summary:     InsightSummary
  conflicts?:  Conflict[]          // optional — từ detectConflicts()
  isRewrite?:  boolean
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildPrompt(input: PromptInput): string {
  const { meta, insights, summary, conflicts = [], isRewrite = false } = input

  // core = xương sống, strong = bối cảnh
  const coreInsights   = insights.filter(i => i.priority === "core")
  const strongInsights = insights.filter(i => i.priority === "strong")

  const coreStrengths = coreInsights
    .filter(i => i.tone === "positive")
    .slice(0, 5)
    .map(i => `• ${i.content}`)
    .join("\n")

  const coreWarnings = coreInsights
    .filter(i => i.tone === "warning")
    .slice(0, 3)
    .map(i => `• ${i.content}`)
    .join("\n")

  const contextInsights = strongInsights
    .slice(0, 2)
    .map(i => `• [${i.source === "numerology" ? "Thần Số" : "Chiêm Tinh"}] ${i.content}`)
    .join("\n")

  // Cross-system insights — đã được xác nhận từ nhiều hệ
  const crossInsights = insights
    .filter(i => i.tags?.includes("cross-system"))
    .slice(0, 3)
    .map(i => `• ${i.content}`)
    .join("\n")

  // Conflicts — mâu thuẫn giữa các hệ + resolution hint
  const conflictSection = conflicts.length > 0
    ? conflicts.slice(0, 2).map(c =>
        `• Mâu thuẫn [${c.systems.join(" vs ")}]: ${c.description}\n  → Gợi ý giải quyết: ${c.resolution}`
      ).join("\n")
    : ""

  // Top tags — xu hướng nổi bật
  const topTags = summary.dominant_tags
    .map(t => TAG_LABELS[t] ?? t)
    .join(", ")

  // (2) Tone distribution — AI biết cân bằng positive/warning
  const toneNote = summary.tone_counts.warning >= 3
    ? "Hồ sơ có nhiều mâu thuẫn nội tâm — hãy giải thích tại sao chúng cùng tồn tại, không phủ nhận nhau."
    : summary.tone_counts.positive >= 6
    ? "Hồ sơ có nhiều điểm mạnh — tránh viết quá tích cực, hãy thêm chiều sâu và thực tế."
    : ""

  // (2) Variation instruction — tránh lặp khi viết lại
  const variationNote = isRewrite
    ? "\n⚠ ĐÂY LÀ LẦN VIẾT LẠI: Bắt đầu bằng góc nhìn hoàn toàn khác. Không dùng lại câu mở đầu, cấu trúc hay cách diễn đạt của lần trước."
    : ""

  const gender = meta.gender === "male" ? "Nam" : meta.gender === "female" ? "Nữ" : "không xác định"

  return `
Bạn là chuyên gia mệnh lý học tổng hợp, kết hợp Thần Số học và Chiêm Tinh học.
Viết bằng tiếng Việt tự nhiên, ấm áp và sâu sắc — như một người thầy đang nói chuyện trực tiếp.${variationNote}

## THÔNG TIN
- Tên: ${meta.fullName}
- Ngày sinh: ${formatDate(meta.birthDate)}
- Giới tính: ${gender}

## TỔNG QUAN
${summary.one_liner}

## XU HƯỚNG NỔI BẬT
${topTags || "chưa xác định"}

${crossInsights ? `## ĐIỂM ĐƯỢC XÁC NHẬN TỪ NHIỀU HỆ (cross-system — rất đáng tin)\n${crossInsights}` : ""}

## ĐIỂM MẠNH CỐT LÕI
${coreStrengths || "Chưa có dữ liệu."}

## ĐIỂM CẦN CHÚ Ý
${coreWarnings || "Không có cảnh báo đặc biệt."}

## BỐI CẢNH HIỆN TẠI
${contextInsights || "Chưa có dữ liệu chu kỳ."}

${conflictSection ? `## MÂU THUẪN CẦN GIẢI THÍCH (quan trọng — AI phải đề cập)\n${conflictSection}` : ""}

${toneNote}

## YÊU CẦU VIẾT
Một đoạn DUY NHẤT, 280–380 chữ, cấu trúc tự nhiên:
1. Mở đầu bằng đặc điểm nổi bật nhất (kể như câu chuyện, không liệt kê)
2. Giải thích điểm mạnh biểu hiện thế nào trong cuộc sống thực
3. Nêu thách thức và lý do tại sao nó xuất hiện (không phán xét)
4. Kết bằng 1–2 câu định hướng cụ thể, thực tế

KHÔNG: bullet points — số thô (số đường đời, hành...) — từ "bạn" (dùng tên hoặc "anh/chị") — lời chúc sáo rỗng
  `.trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag → nhãn tiếng Việt dễ đọc cho AI
// ─────────────────────────────────────────────────────────────────────────────

const TAG_LABELS: Record<string, string> = {
  leadership:       "xu hướng lãnh đạo",
  independence:     "tính tự chủ cao",
  creativity:       "tư duy sáng tạo",
  analytical:       "phân tích sâu",
  empathy:          "đồng cảm mạnh",
  discipline:       "kỷ luật",
  freedom:          "yêu tự do",
  stability:        "cần ổn định",
  ambition:         "tham vọng",
  intuition:        "trực giác",
  humanitarian:     "tư duy nhân văn",
  depth:            "chiều sâu nội tâm",
  adaptability:     "khả năng thích nghi",
  nurturing:        "bản năng chăm sóc",
  responsibility:   "tinh thần trách nhiệm",
  wisdom:           "tư duy triết lý",
  charisma:         "sức hút tự nhiên",
  passion:          "nhiệt huyết",
  "master-number":  "số chủ — tiềm năng đặc biệt",
}

// ─────────────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const p = iso.split("-")
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : iso
}
