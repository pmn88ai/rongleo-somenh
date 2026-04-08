// src/insights/merger.ts
//
// Nhận Insight[] → dedup → nhóm → sort → tạo summary
// Không có logic biểu tượng — chỉ sắp xếp, lọc, tổng hợp.

import type { Insight, InsightType, InsightPriority } from "./types"

export type GroupedInsights = Record<InsightType, Insight[]>

export type InsightSummary = {
  dominant_tags: string[]   // tags xuất hiện nhiều nhất
  tone_counts: {
    positive: number
    neutral:  number
    warning:  number
  }
  one_liner: string         // 1 câu tổng quan pre-built (trước khi có AI)
}

export const INSIGHT_TYPE_ORDER: InsightType[] = [
  "personality",
  "career",
  "relationship",
  "finance",
  "health",
]

export const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  personality:  "Tính cách & Bản thân",
  career:       "Sự nghiệp & Công việc",
  relationship: "Tình cảm & Quan hệ",
  finance:      "Tài chính",
  health:       "Sức khoẻ",
}

// ─────────────────────────────────────────────────────────────────────────────
// DEDUP — tránh insight trùng ý nghĩa từ nhiều nguồn
//
// Logic: 2 insights bị coi là trùng khi:
//   (a) Cùng type VÀ share ít nhất 1 tag quan trọng
//   (b) Nếu trùng: giữ cái có priority cao hơn (core > strong > weak)
//       Nếu cùng priority: giữ cái weight cao hơn
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITY_RANK: Record<InsightPriority, number> = {
  core: 3, strong: 2, weak: 1,
}

// Tags được coi là "signature" — nếu 2 insights share tag này thì trùng ý
const SIGNATURE_TAGS = new Set([
  "leadership", "independence", "creativity", "analytical", "empathy",
  "discipline", "freedom", "stability", "ambition", "intuition",
  "humanitarian", "depth", "adaptability",
])

function isSignatureTag(tag: string): boolean {
  return SIGNATURE_TAGS.has(tag)
}

function shareSignatureTag(a: Insight, b: Insight): boolean {
  if (!a.tags || !b.tags) return false
  return a.tags.some(t => isSignatureTag(t) && b.tags!.includes(t))
}

export function deduplicateInsights(insights: Insight[]): Insight[] {
  const result: Insight[] = []

  for (const incoming of insights) {
    const dupeIdx = result.findIndex(
      existing =>
        existing.type === incoming.type &&
        shareSignatureTag(existing, incoming)
    )

    if (dupeIdx === -1) {
      // Không trùng → thêm vào
      result.push(incoming)
    } else {
      const existing = result[dupeIdx]
      const incomingRank = PRIORITY_RANK[incoming.priority]
      const existingRank = PRIORITY_RANK[existing.priority]

      // Giữ insight "mạnh hơn"
      if (
        incomingRank > existingRank ||
        (incomingRank === existingRank && incoming.weight > existing.weight)
      ) {
        result[dupeIdx] = incoming
      }
      // Ngược lại: giữ existing, bỏ incoming
    }
  }

  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP + SORT
// Sort thứ tự trong mỗi nhóm: core trước → strong → weak, rồi weight giảm dần
// ─────────────────────────────────────────────────────────────────────────────

function sortInsights(insights: Insight[]): Insight[] {
  return [...insights].sort((a, b) => {
    const pr = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]
    if (pr !== 0) return pr
    return b.weight - a.weight
  })
}

export function groupInsights(insights: Insight[]): GroupedInsights {
  const deduped = deduplicateInsights(insights)

  const grouped: GroupedInsights = {
    personality:  [],
    career:       [],
    relationship: [],
    finance:      [],
    health:       [],
  }

  for (const insight of deduped) {
    grouped[insight.type].push(insight)
  }

  for (const type of INSIGHT_TYPE_ORDER) {
    grouped[type] = sortInsights(grouped[type])
  }

  return grouped
}

export function getNonEmptyGroups(grouped: GroupedInsights): InsightType[] {
  return INSIGHT_TYPE_ORDER.filter(t => grouped[t].length > 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY — pre-built, trước khi có AI
// ─────────────────────────────────────────────────────────────────────────────

export function buildSummary(grouped: GroupedInsights): InsightSummary {
  const all = Object.values(grouped).flat()

  // Đếm tone
  const tone_counts = { positive: 0, neutral: 0, warning: 0 }
  for (const i of all) tone_counts[i.tone]++

  // Tìm dominant tags (top 3)
  const tagFreq: Record<string, number> = {}
  for (const i of all) {
    for (const t of (i.tags ?? [])) {
      tagFreq[t] = (tagFreq[t] ?? 0) + 1
    }
  }
  const dominant_tags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)

  // One-liner: ghép từ core personality insights
  const corePersonality = grouped.personality
    .filter(i => i.priority === "core")
    .slice(0, 2)

  let one_liner = ""
  if (corePersonality.length === 0) {
    one_liner = "Hồ sơ đang được tổng hợp."
  } else if (corePersonality.length === 1) {
    // Lấy câu đầu của content
    one_liner = corePersonality[0].content.split(".")[0] + "."
  } else {
    // Có warning → nhắc đến
    const hasWarning = tone_counts.warning > 0
    const base = corePersonality[0].content.split(".")[0]
    one_liner = hasWarning
      ? `${base} — nhưng cần chú ý cân bằng một số điểm yếu trong tính cách.`
      : `${base} — đây là nền tảng cốt lõi của hồ sơ này.`
  }

  return { dominant_tags, tone_counts, one_liner }
}

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-SYSTEM INSIGHTS (Fix 5)
//
// Đọc insights từ nhiều hệ → tìm pattern → tạo insight tổng hợp mới.
// Input: flat list sau dedup (chưa group).
// Output: Insight[] mới — sẽ được merge vào list trước khi group.
//
// Logic: so sánh theo tags. Nếu 2 hệ khác nhau cùng nói về cùng topic
// nhưng khác tone → tạo insight "kết nối" giải thích mâu thuẫn/bổ sung.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-SYSTEM ENGINE
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export type CrossConfidence = "high" | "medium" | "low"

export type CrossRule = {
  triggerTags:    string[]
  requireSources: string[]
  type:           InsightType
  tone:           Insight["tone"]
  content:        string
  tags:           string[]
  // Fix 1: confidence — bao nhiêu hệ xác nhận
  // "high"   = tất cả requireSources đều có signal mạnh (priority=core)
  // "medium" = có signal nhưng không phải tất cả core
  // "low"    = suy luận từ tags gần nghĩa
  confidence:     CrossConfidence
}

export type Conflict = {
  topic:       InsightType
  systems:     string[]
  tagA:        string
  tagB:        string
  description: string
  // Fix 2: resolution hint — đưa vào AI prompt để giải thích cụ thể hơn
  resolution:  string
}

// ─── CrossRule data ───────────────────────────────────────────────────────────

export const CROSS_RULES: CrossRule[] = [
  {
    triggerTags:    ["leadership"],
    requireSources: ["numerology", "astrology"],
    type: "career", tone: "positive",
    confidence: "high",
    content: "Xu hướng lãnh đạo được xác nhận đồng thời từ Thần Số lẫn Chiêm Tinh — không phải ngẫu nhiên. Đây là đặc điểm bẩm sinh cốt lõi: sinh ra để mở đường, không phải đi theo.",
    tags: ["leadership", "cross-system"],
  },
  {
    triggerTags:    ["analytical", "depth"],
    requireSources: ["numerology", "astrology"],
    type: "career", tone: "positive",
    confidence: "high",
    content: "Cả hai hệ mệnh lý đều xác nhận tư duy phân tích sâu. Thế mạnh nằm ở khả năng nhìn thấy những gì người khác bỏ qua — lợi thế cạnh tranh hiếm gặp.",
    tags: ["analytical", "depth", "cross-system"],
  },
  {
    triggerTags:    ["empathy"],
    requireSources: ["numerology", "astrology"],
    type: "relationship", tone: "positive",
    confidence: "high",
    content: "Khả năng đồng cảm được xác nhận từ nhiều hệ mệnh lý: đây là người có thể thực sự hiểu người khác ở tầng sâu. Điều này tạo ra kết nối đặc biệt khó tìm thấy ở người khác.",
    tags: ["empathy", "cross-system"],
  },
  {
    triggerTags:    ["discipline", "structure"],
    requireSources: ["numerology", "astrology"],
    type: "career", tone: "positive",
    confidence: "high",
    content: "Tính kỷ luật được xác nhận đồng thời — nền tảng giúp biến tiềm năng thành kết quả thực tế. Nhiều người có tài nhưng thiếu kỷ luật; hồ sơ này có cả hai.",
    tags: ["discipline", "cross-system"],
  },
  {
    triggerTags:    ["creativity", "expression"],
    requireSources: ["numerology", "astrology"],
    type: "career", tone: "positive",
    confidence: "medium",
    content: "Năng lực sáng tạo được xác nhận từ nhiều chiều: Thần Số nói về cách biểu đạt, Chiêm Tinh nói về bản năng thẩm mỹ. Kết hợp tạo nên một con người vừa có ý tưởng, vừa có khả năng truyền đạt.",
    tags: ["creativity", "cross-system"],
  },
  {
    triggerTags:    ["stability", "responsibility"],
    requireSources: ["numerology", "astrology"],
    type: "relationship", tone: "positive",
    confidence: "medium",
    content: "Vai trò trụ cột được khẳng định từ nhiều hướng: người xung quanh có thể tin tưởng và dựa vào. Đây không phải gánh nặng — đây là quyền lực mềm rất thực tế.",
    tags: ["stability", "cross-system"],
  },
  {
    triggerTags:    ["wisdom", "humanitarian"],
    requireSources: ["numerology", "astrology"],
    type: "personality", tone: "positive",
    confidence: "medium",
    content: "Tư duy rộng lớn và tấm lòng nhân ái xuất hiện trong cả hai hệ — người có sứ mệnh đóng góp ở tầm cao hơn cá nhân, không chỉ tìm kiếm thành công cho riêng mình.",
    tags: ["wisdom", "humanitarian", "cross-system"],
  },
  {
    triggerTags:    ["adaptability"],
    requireSources: ["numerology", "astrology"],
    type: "personality", tone: "positive",
    confidence: "medium",
    content: "Khả năng thích nghi được xác nhận từ nhiều hệ — trong thế giới biến động nhanh, đây là lợi thế sống còn. Người này không bị cuốn trôi bởi thay đổi mà học cách lướt trên nó.",
    tags: ["adaptability", "cross-system"],
  },
]

// ─── Conflict data (Fix 2: thêm resolution) ──────────────────────────────────

type ConflictDef = {
  tagPair:    [string, string]
  type:       InsightType
  description: string
  resolution:  string   // Fix 2: gợi ý hành động cụ thể
}

const CONFLICT_DEFS: ConflictDef[] = [
  {
    tagPair:     ["freedom", "discipline"],
    type:        "personality",
    description: "Một hệ chỉ ra khao khát tự do, hệ kia nhấn mạnh nhu cầu kỷ luật và cấu trúc.",
    resolution:  "Tìm môi trường có cấu trúc rõ ràng nhưng trao quyền tự quyết trong phạm vi đó — như làm chủ doanh nghiệp riêng hoặc vai trò senior với autonomy cao.",
  },
  {
    tagPair:     ["independence", "partnership"],
    type:        "relationship",
    description: "Một hệ nhấn mạnh tính tự lập cao, hệ kia cho thấy nhu cầu kết nối và hợp tác.",
    resolution:  "Xây dựng các mối quan hệ với người tôn trọng không gian cá nhân. Hợp tác theo dự án cụ thể thay vì gắn bó 24/7.",
  },
  {
    tagPair:     ["leadership", "empathy"],
    type:        "career",
    description: "Xu hướng dẫn dắt mạnh từ một hệ và bản năng đồng cảm sâu từ hệ kia.",
    resolution:  "Không mâu thuẫn — đây là hồ sơ lãnh đạo phục vụ. Phát huy bằng cách dẫn dắt theo phong cách coach: trao quyền, lắng nghe, rồi định hướng.",
  },
  {
    tagPair:     ["ambition", "nurturing"],
    type:        "career",
    description: "Tham vọng cá nhân cao và bản năng chăm sóc người khác cùng tồn tại.",
    resolution:  "Chọn ngành có thể gắn tham vọng với tác động xã hội — giáo dục, y tế, doanh nghiệp xã hội, hoặc xây dựng team mạnh.",
  },
  {
    tagPair:     ["depth", "adaptability"],
    type:        "personality",
    description: "Tư duy sâu và cần thời gian xử lý từ một hệ, khả năng thích nghi nhanh từ hệ kia.",
    resolution:  "Quản lý năng lượng theo chu kỳ: giai đoạn đào sâu (tắt thông báo, làm việc một mình) xen kẽ giai đoạn kết nối rộng. Không cố gắng làm cả hai cùng lúc.",
  },
]

// ─── Engine functions ─────────────────────────────────────────────────────────

// Fix 3: Tính confidence thực tế bằng cách đếm source có core signal
function computeConfidence(
  rule:     CrossRule,
  insights: Insight[],
): CrossConfidence {
  const coreSourceCount = rule.requireSources.filter(src =>
    insights.some(
      i => i.source === src &&
           i.priority === "core" &&
           rule.triggerTags.some(t => i.tags?.includes(t))
    )
  ).length

  if (coreSourceCount === rule.requireSources.length) return "high"
  if (coreSourceCount >= 1) return "medium"
  return "low"
}

export function generateCrossInsights(insights: Insight[]): Insight[] {
  const generated: Insight[] = []

  for (const rule of CROSS_RULES) {
    const allSourcesPresent = rule.requireSources.every(src =>
      insights.some(
        i => i.source === src &&
             rule.triggerTags.some(t => i.tags?.includes(t))
      )
    )
    if (!allSourcesPresent) continue

    const exists = generated.some(
      g => g.tags?.includes("cross-system") &&
           g.type === rule.type &&
           rule.triggerTags.some(t => g.tags?.includes(t))
    )
    if (exists) continue

    const confidence = computeConfidence(rule, insights)

    generated.push({
      type:     rule.type,
      source:   "numerology",
      // Fix 3: cross insight "high" confidence → core; medium/low → strong
      priority: confidence === "high" ? "core" : "strong",
      tone:     rule.tone,
      // Fix 3: boost weight theo confidence
      weight:   confidence === "high" ? 10 : confidence === "medium" ? 8 : 6,
      content:  rule.content,
      // Đính confidence vào tags để UI/PDF dùng
      tags:     [...rule.tags, `confidence:${confidence}`],
    })
  }

  return generated
}

export function detectConflicts(insights: Insight[]): Conflict[] {
  const conflicts: Conflict[] = []

  for (const def of CONFLICT_DEFS) {
    const [tagA, tagB] = def.tagPair

    const withA = insights.filter(i => i.tags?.includes(tagA))
    const withB = insights.filter(i => i.tags?.includes(tagB))
    if (withA.length === 0 || withB.length === 0) continue

    const sourcesA = [...new Set(withA.map(i => i.source))]
    const sourcesB = [...new Set(withB.map(i => i.source))]
    const differentSources = sourcesA.some(s => !sourcesB.includes(s)) ||
                             sourcesB.some(s => !sourcesA.includes(s))

    if (differentSources) {
      conflicts.push({
        topic:       def.type,
        systems:     [...new Set([...sourcesA, ...sourcesB])],
        tagA,
        tagB,
        description: def.description,
        resolution:  def.resolution,  // Fix 2
      })
    }
  }

  return conflicts
}

export type { InsightType }