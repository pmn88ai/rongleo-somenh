"use client"

import { useState, useMemo, useEffect } from "react"
import type { ObservatoryProfile } from "@/lib/ui/adapter/types"
import type { UnifiedAstrologyProfile } from "@/lib/profileAggregator/types"
import type { SignalGroup, SignalEntry } from "@/lib/ui/shared/types"
import type { BaziData }               from "@/engines/bazi/types"

import { extractInsights } from "@/insights/extractor"
import { groupInsights, getNonEmptyGroups, INSIGHT_TYPE_LABELS, buildSummary, generateCrossInsights, detectConflicts } from "@/insights/merger"
import type { GroupedInsights } from "@/insights/merger"
import type { InsightType } from "@/insights/merger"
import type { Conflict } from "@/insights/merger"
import type { Insight } from "@/insights/types"
import type { InsightSummary } from "@/insights/merger"

import { buildPrompt } from "@/ai/promptBuilder"
import { callGroq, clearNarrativeCache } from "@/ai/groqClient"

export function ProfileDashboard({
  profile,
  raw,
  bazi = null,
}: {
  profile: ObservatoryProfile
  raw:     UnifiedAstrologyProfile
  bazi?:   BaziData | null
}) {
  const { meta, groups } = profile

  const allInsights: Insight[] = useMemo(() => {
    const base  = extractInsights({ raw, bazi: bazi ?? undefined })
    const cross = generateCrossInsights(base)
    return [...base, ...cross]
  }, [raw, bazi])

  useEffect(() => {
  if (!allInsights || allInsights.length === 0) return

  const profile_id = `${meta.fullName}|${meta.birthDate}|${meta.gender}`

  const core_tags = allInsights
    .flatMap(i => i.tags || [])
    .slice(0, 5)
    .join(", ")

  const strengths = allInsights
    .filter(i => i.tone === "positive")
    .map(i => i.content)
    .slice(0, 3)
    .join(" | ")

  const warnings = allInsights
    .filter(i => i.tone === "warning")
    .map(i => i.content)
    .slice(0, 3)
    .join(" | ")

  const summary = allInsights[0]?.content || ""

  fetch("/api/save-insight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile_id,
      core_tags,
      strengths,
      warnings,
      summary,
    }),
  })

}, [allInsights])

  const conflicts: Conflict[]    = useMemo(() => detectConflicts(allInsights), [allInsights])
  const grouped: GroupedInsights = useMemo(() => groupInsights(allInsights), [allInsights])
  const summary: InsightSummary  = useMemo(() => buildSummary(grouped), [grouped])
  const nonEmpty = getNonEmptyGroups(grouped)

  const [aiText, setAiText] = useState<string>("")

  type Tab = "insights" | string
  const [activeTab, setActiveTab] = useState<Tab>("insights")

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* person card */}
      <div className="mb-8 rounded-2xl bg-white/[0.03] border border-white/5 p-5 flex items-start gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-sm font-semibold text-black">
          {meta.fullName.trim().split(" ").pop()?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-medium text-white/90 truncate">{meta.fullName}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span className="text-xs text-white/30">{formatDate(meta.birthDate)}</span>
            {meta.birthHour !== null && <span className="text-xs text-white/30">{String(meta.birthHour).padStart(2,"0")}:00</span>}
            {meta.gender !== "unspecified" && <span className="text-xs text-white/30">{meta.gender === "male" ? "Nam" : "Nữ"}</span>}
            {meta.phone && <span className="text-xs text-white/30">{meta.phone}</span>}
          </div>
        </div>
      </div>

      {/* tab bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <TabBtn label="🔮 Luận giải" active={activeTab === "insights"} onClick={() => setActiveTab("insights")} />
        {bazi && (
          <TabBtn label="☯ Tứ Trụ" active={activeTab === "bazi"} onClick={() => setActiveTab("bazi")} />
        )}
        {groups.map(g => {
          const dm = domainMeta(g.domain)
          return (
            <TabBtn key={g.domain} label={`${dm.icon} ${dm.label}`} active={activeTab === g.domain} onClick={() => setActiveTab(g.domain)} />
          )
        })}
      </div>

      {/* content */}
      {activeTab === "insights"
        ? <InsightPanel
            grouped={grouped}
            nonEmpty={nonEmpty}
            allInsights={allInsights}
            summary={summary}
            meta={meta}
            aiText={aiText}
            onAiText={setAiText}
            conflicts={conflicts}
          />
        : activeTab === "bazi" && bazi
        ? <BaziPanel bazi={bazi} insights={allInsights.filter(i => i.source === "astrology" && i.priority === "core")} />
        : <SignalPanel group={groups.find(g => g.domain === activeTab)!} />
      }

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// InsightPanel
// ─────────────────────────────────────────────────────────────────────────────

function InsightPanel({
  grouped, nonEmpty, allInsights, summary, meta, aiText, onAiText, conflicts,
}: {
  grouped:     GroupedInsights
  nonEmpty:    InsightType[]
  allInsights: Insight[]
  summary:     InsightSummary
  meta:        ObservatoryProfile["meta"]
  aiText:      string
  onAiText:    (t: string) => void
  conflicts:   Conflict[]
}) {
  const [activeType, setActiveType] = useState<InsightType>(nonEmpty[0] ?? "personality")
  const [aiLoading,  setAiLoading]  = useState(false)
  const [aiError,    setAiError]    = useState<string>("")
  const [fromCache,  setFromCache]  = useState(false)
  const [writeCount, setWriteCount] = useState(0)

  const profileKey = `${meta.fullName}|${meta.birthDate}|${meta.gender}`

  async function handleAiClick(isRewrite = false) {
    setAiLoading(true)
    setAiError("")
    const prompt = buildPrompt({ meta, insights: allInsights, summary, conflicts, isRewrite })
    const result = await callGroq(prompt, profileKey, isRewrite)
    if (result.ok) {
      onAiText(result.text)
      setFromCache(result.fromCache)
      if (!result.fromCache) setWriteCount(c => c + 1)
    } else {
      setAiError(result.error)
    }
    setAiLoading(false)
  }

  function handleRewrite() {
    clearNarrativeCache(profileKey)
    handleAiClick(true)
  }

  if (nonEmpty.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
        <p className="text-white/30 text-sm">Chưa có luận giải nào.</p>
      </div>
    )
  }

  const insights = grouped[activeType]

  return (
    <div className="space-y-4">

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 space-y-3">
        <p className="text-sm text-white/60 leading-relaxed italic">&quot;{summary.one_liner}&quot;</p>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
              <span className="text-[11px] text-white/30">Điểm mạnh: {summary.tone_counts.positive}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400/60" />
              <span className="text-[11px] text-white/30">Cần chú ý: {summary.tone_counts.warning}</span>
            </div>
            {summary.dominant_tags.length > 0 && (
              <div className="flex items-center gap-1">
                {summary.dominant_tags.map(t => (
                  <span key={t} className="text-[11px] text-white/25 bg-white/5 px-1.5 py-0.5 rounded">#{t}</span>
                ))}
              </div>
            )}
          </div>

          {!aiText && (
            <button
              onClick={() => handleAiClick(false)}
              disabled={aiLoading}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all",
                aiLoading
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-500/80 to-purple-600/80 hover:from-violet-400/90 hover:to-purple-500/90 text-white shadow-lg shadow-purple-900/20",
              ].join(" ")}
            >
              {aiLoading ? (
                <>
                  <span className="w-3 h-3 rounded-full border border-white/30 border-t-white/80 animate-spin" />
                  Đang viết…
                </>
              ) : (
                <>✨ Viết luận giải AI</>
              )}
            </button>
          )}
        </div>

        {aiError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start gap-2">
            <span className="text-red-400/70 text-xs mt-0.5">⚠</span>
            <span className="text-xs text-red-300/70">{aiError}</span>
          </div>
        )}
      </div>

      {aiText && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-violet-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-violet-400/70">✨</span>
              <span className="text-xs text-white/40 uppercase tracking-widest">Luận Giải AI</span>
              {fromCache && (
                <span className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">cached</span>
              )}
              {writeCount > 1 && !fromCache && (
                <span className="text-[10px] text-violet-300/30">#{writeCount}</span>
              )}
            </div>
            <button
              onClick={() => { onAiText(""); setAiError(""); setFromCache(false) }}
              className="text-[11px] text-white/20 hover:text-white/40 transition-colors"
            >
              Xoá
            </button>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-white/75 leading-[1.9] whitespace-pre-line">{aiText}</p>
            <button
              onClick={handleRewrite}
              disabled={aiLoading}
              className="mt-4 text-[11px] text-violet-400/50 hover:text-violet-400/80 transition-colors disabled:opacity-30"
            >
              {aiLoading ? "Đang viết lại…" : "↺ Viết lại (góc nhìn khác)"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {nonEmpty.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={[
              "px-3 py-1 rounded-full text-xs transition-all",
              type === activeType ? insightTypeColor(type) + " font-medium" : "bg-white/5 text-white/30 hover:text-white/50",
            ].join(" ")}
          >
            {INSIGHT_TYPE_LABELS[type]}
            <span className="ml-1.5 opacity-50">({grouped[type].length})</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5">
          <span className="text-xs text-white/30 uppercase tracking-widest">{INSIGHT_TYPE_LABELS[activeType]}</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      </div>

    </div>
  )
}

function InsightCard({ insight }: { insight: Insight }) {
  const borderColor = insight.tone === "positive" ? "border-l-emerald-500/50"
                    : insight.tone === "warning"  ? "border-l-amber-500/50"
                    : "border-l-white/10"
  const priorityDot = insight.priority === "core"   ? "bg-amber-400/80"
                    : insight.priority === "strong" ? "bg-white/40"
                    : "bg-white/15"
  return (
    <div className={["px-5 py-4 flex gap-4 items-start border-l-2 ml-0", borderColor].join(" ")}>
      <div className="shrink-0 mt-2">
        <div className={["w-1.5 h-1.5 rounded-full", priorityDot].join(" ")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/75 leading-relaxed">{insight.content}</p>
        <div className="flex flex-wrap gap-2 mt-2.5">
          <span className={["text-[10px] px-2 py-0.5 rounded-full", toneColor(insight.tone)].join(" ")}>
            {toneLabel(insight.tone)}
          </span>
          <span className={["text-[10px] px-2 py-0.5 rounded-full", sourceColor(insight.source)].join(" ")}>
            {sourceLabel(insight.source)}
          </span>
          {insight.tags?.filter(t => t).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/20">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BaziPanel
// ─────────────────────────────────────────────────────────────────────────────

function BaziPanel({ bazi, insights }: { bazi: BaziData; insights: Insight[] }) {
  const ELEMENT_COLOR: Record<string, string> = {
    Kim: "text-slate-300", Mộc: "text-green-400", Thủy: "text-blue-400",
    Hỏa: "text-orange-400", Thổ: "text-amber-600",
  }
  const strengthColor = bazi.strength === "Vượng" ? "text-emerald-400"
                      : bazi.strength === "Nhược" ? "text-amber-400"
                      : "text-white/60"
  const topInsights = insights
    .sort((a, b) => (b.priority === "core" ? 1 : 0) - (a.priority === "core" ? 1 : 0))
    .slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5">
          <span className="text-xs text-white/30 uppercase tracking-widest">Tứ Trụ — Thông số chính</span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-white/5">
          <div className="px-5 py-4">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Nhật Chủ</p>
            <p className="text-lg font-medium text-white/90">{bazi.dayMaster}</p>
            <p className={["text-xs mt-0.5", ELEMENT_COLOR[bazi.dayMasterElement] ?? "text-white/40"].join(" ")}>
              Hành {bazi.dayMasterElement}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Trạng thái</p>
            <p className={["text-lg font-medium", strengthColor].join(" ")}>{bazi.strength}</p>
            <p className="text-xs text-white/25 mt-0.5">điểm {bazi.strongScore}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Dụng thần</p>
            <p className={["text-lg font-medium", ELEMENT_COLOR[bazi.useful.primary] ?? "text-white/70"].join(" ")}>
              {bazi.useful.primary}
            </p>
            {bazi.useful.secondary.length > 0 && (
              <p className="text-xs text-white/25 mt-0.5">phụ: {bazi.useful.secondary.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5">
          <span className="text-xs text-white/30 uppercase tracking-widest">Tứ Trụ</span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-white/[0.04]">
          {(["year","month","day","hour"] as const).map((key, i) => {
            const labels = ["Năm", "Tháng", "Ngày", "Giờ"]
            const p = bazi.pillars[key]
            return (
              <div key={key} className="px-3 py-4 text-center">
                <p className="text-[10px] text-white/25 mb-2">{labels[i]}</p>
                <p className="text-sm text-white/80 font-medium">{p.can}</p>
                <p className="text-sm text-white/60">{p.chi}</p>
                <p className="text-[10px] text-white/25 mt-1 leading-tight">{p.napAm}</p>
              </div>
            )
          })}
        </div>
      </div>

      {bazi.shensha.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5">
            <span className="text-xs text-white/30 uppercase tracking-widest">Thần Sát</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {bazi.shensha.map((s, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-white/75">{s.name}</span>
                  <span className="text-xs text-white/30 ml-2">({s.pillar})</span>
                </div>
                <span className="text-xs text-white/30 text-right max-w-[55%]">{s.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topInsights.length > 0 && (
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-amber-500/10">
            <span className="text-xs text-amber-300/50 uppercase tracking-widest">Luận giải từ Tứ Trụ</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topInsights.map((insight, i) => (
              <div key={i} className="px-5 py-3.5 flex gap-3 items-start">
                <div className={[
                  "w-1.5 h-1.5 rounded-full shrink-0 mt-1.5",
                  insight.tone === "positive" ? "bg-emerald-400/70"
                  : insight.tone === "warning" ? "bg-amber-400/70"
                  : "bg-white/20",
                ].join(" ")} />
                <p className="text-sm text-white/70 leading-relaxed">{insight.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SignalPanel
// ─────────────────────────────────────────────────────────────────────────────

function SignalPanel({ group }: { group: SignalGroup }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs text-white/30 uppercase tracking-widest">{domainMeta(group.domain).label}</span>
        <span className="text-xs text-white/15">{group.signals.length} tín hiệu</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {group.signals.map((signal, i) => <SignalRow key={signal.engine + i} signal={signal} />)}
      </div>
    </div>
  )
}

function SignalRow({ signal }: { signal: SignalEntry }) {
  const [expanded, setExpanded] = useState(false)
  const formatted = formatValue(signal.value)
  const isComplex = formatted.length > 40
  return (
    <div
      className={["px-5 py-3.5 flex items-start justify-between gap-4", isComplex ? "cursor-pointer hover:bg-white/[0.02]" : ""].join(" ")}
      onClick={() => isComplex && setExpanded(e => !e)}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm text-white/70">{signal.label ?? signal.engine}</span>
        <span className="text-[10px] text-white/20 font-mono">{signal.engine}</span>
      </div>
      <div className="shrink-0 text-right max-w-[55%]">
        {isComplex ? (
          <div>
            <span className="text-xs text-white/40">{expanded ? "▲ Thu gọn" : "▼ Xem"}</span>
            {expanded && (
              <pre className="mt-2 text-xs text-amber-300/70 font-mono whitespace-pre-wrap text-left bg-white/5 rounded-lg p-3">
                {JSON.stringify(signal.value, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <span className={["inline-block px-2.5 py-1 rounded-md text-xs font-mono", domainColor(signal.domain)].join(" ")}>
            {formatted}
          </span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={["shrink-0 px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all whitespace-nowrap", active ? "bg-white/10 text-white/90" : "text-white/30 hover:text-white/50 hover:bg-white/5"].join(" ")}
    >
      {label}
    </button>
  )
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "string")  return value
  if (typeof value === "number")  return String(value)
  if (typeof value === "boolean") return value ? "có" : "không"
  if (Array.isArray(value)) {
    if (value.length === 0) return "—"
    if (value.every(v => typeof v === "string" || typeof v === "number")) return value.join(", ")
    return `[${value.length} mục]`
  }
  return JSON.stringify(value)
}

function formatDate(d: string): string {
  const p = d.split("-")
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d
}

function domainColor(domain: string): string {
  const m: Record<string, string> = {
    numerology: "bg-violet-500/10 text-violet-300/80",
    astrology: "bg-blue-500/10 text-blue-300/80",
    compatibility: "bg-pink-500/10 text-pink-300/80",
    fengShui: "bg-emerald-500/10 text-emerald-300/80",
    phoneNumerology: "bg-cyan-500/10 text-cyan-300/80",
    demographics: "bg-amber-500/10 text-amber-300/80",
  }
  return m[domain] ?? "bg-white/5 text-white/60"
}

function domainMeta(domain: string) {
  const m: Record<string, { label: string; icon: string }> = {
    numerology:      { label: "Thần Số Học",   icon: "◆" },
    astrology:       { label: "Chiêm Tinh",    icon: "☽" },
    compatibility:   { label: "Tương Hợp",     icon: "◎" },
    fengShui:        { label: "Phong Thủy",    icon: "⬡" },
    phoneNumerology: { label: "Số Điện Thoại", icon: "⊞" },
    demographics:    { label: "Nhân Khẩu",     icon: "○" },
  }
  return m[domain] ?? { label: domain, icon: "·" }
}

function insightTypeColor(type: InsightType): string {
  const m: Record<InsightType, string> = {
    personality:  "bg-violet-500/15 text-violet-300/90",
    career:       "bg-blue-500/15 text-blue-300/90",
    relationship: "bg-pink-500/15 text-pink-300/90",
    finance:      "bg-emerald-500/15 text-emerald-300/90",
    health:       "bg-amber-500/15 text-amber-300/90",
  }
  return m[type] ?? "bg-white/10 text-white/70"
}

function sourceColor(source: string): string {
  const m: Record<string, string> = {
    numerology: "bg-violet-500/10 text-violet-300/60",
    astrology:  "bg-blue-500/10 text-blue-300/60",
    fengshui:   "bg-emerald-500/10 text-emerald-300/60",
  }
  return m[source] ?? "bg-white/5 text-white/30"
}

function sourceLabel(source: string): string {
  const m: Record<string, string> = {
    numerology: "Thần Số",
    astrology:  "Chiêm Tinh",
    fengshui:   "Phong Thủy",
  }
  return m[source] ?? source
}

function toneColor(tone: string): string {
  if (tone === "positive") return "bg-emerald-500/10 text-emerald-300/60"
  if (tone === "warning")  return "bg-amber-500/10  text-amber-300/60"
  return "bg-white/5 text-white/25"
}

function toneLabel(tone: string): string {
  if (tone === "positive") return "Điểm mạnh"
  if (tone === "warning")  return "Cần chú ý"
  return "Đặc điểm"
}
