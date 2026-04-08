"use client"

import React, { useState, useMemo } from "react"
import type { SignalTableInput } from "./types"
import type { SignalEntry } from "../shared/types"
import { formatValue } from "../shared/formatValue"

function resolveLabel(signal: SignalEntry): string {
  return signal.label ?? signal.engine
}

// Derive unique domains directly from the signal list — no hardcoding
function deriveDomains(signals: SignalEntry[]): string[] {
  return Array.from(new Set(signals.map((s) => s.domain))).sort()
}

// ─── domain color map — keyed by known domain names, graceful fallback ───────

const DOMAIN_PALETTE: Record<string, { fg: string; bg: string; border: string }> = {
  numerology:      { fg: "#818cf8", bg: "#818cf811", border: "#818cf833" },
  astrology:       { fg: "#fb923c", bg: "#fb923c11", border: "#fb923c33" },
  fengshui:        { fg: "#34d399", bg: "#34d39911", border: "#34d39933" },
  phoneNumerology: { fg: "#38bdf8", bg: "#38bdf811", border: "#38bdf833" },
  compatibility:   { fg: "#f472b6", bg: "#f472b611", border: "#f472b633" },
  demographics:    { fg: "#a78bfa", bg: "#a78bfa11", border: "#a78bfa33" },
  core:            { fg: "#94a3b8", bg: "#94a3b811", border: "#94a3b833" },
}
const FALLBACK_PALETTE = { fg: "#64748b", bg: "#64748b11", border: "#64748b33" }

function domainColor(domain: string) {
  return DOMAIN_PALETTE[domain] ?? FALLBACK_PALETTE
}

// ─── sub-components ──────────────────────────────────────────────────────────

function DomainBadge({ domain }: { domain: string }) {
  const c = domainColor(domain)
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 7px",
      borderRadius: 3,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      background: c.bg,
      color: c.fg,
      border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      {domain}
    </span>
  )
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color?: { fg: string; bg: string; border: string }
  onClick: () => void
}) {
  const c = color ?? FALLBACK_PALETTE
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 9px",
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
        border: `1px solid ${active ? c.fg : c.border}`,
        background: active ? c.bg : "transparent",
        color: active ? c.fg : "#475569",
        transition: "all 0.1s",
      }}
    >
      {label}
    </button>
  )
}

function SignalRow({ signal, index }: { signal: SignalEntry; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const raw = formatValue(signal.value)
  const isLong = raw.length > 42

  return (
    <tr style={{ background: index % 2 === 0 ? "transparent" : "#080d14" }}>
      {/* engine */}
      <td style={s.tdEngine}>{signal.engine}</td>
      {/* domain */}
      <td style={s.tdDomain}><DomainBadge domain={signal.domain} /></td>
      {/* label */}
      <td style={s.tdLabel}>{resolveLabel(signal)}</td>
      {/* value */}
      <td style={s.tdValue}>
        {isLong ? (
          <code
            style={{
              ...s.valueCode,
              maxWidth: 260,
              overflow: "hidden",
              textOverflow: expanded ? "clip" : "ellipsis",
              whiteSpace: expanded ? "normal" : "nowrap",
              wordBreak: "break-all",
              display: "block",
              cursor: "pointer",
            }}
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {raw}
          </code>
        ) : (
          <code style={s.valueCode}>{raw}</code>
        )}
      </td>
    </tr>
  )
}

// ─── component ───────────────────────────────────────────────────────────────

export function SignalTable({ signals }: SignalTableInput) {
  const [search, setSearch]             = useState("")
  const [activeDomain, setActiveDomain] = useState<string | null>(null)

  const domains = useMemo(() => deriveDomains(signals), [signals])

  const filtered = useMemo(() => {
    return signals.filter((sig) => {
      const matchDomain = activeDomain === null || sig.domain === activeDomain
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        sig.engine.toLowerCase().includes(q) ||
        sig.domain.toLowerCase().includes(q) ||
        resolveLabel(sig).toLowerCase().includes(q) ||
        formatValue(sig.value).toLowerCase().includes(q)
      return matchDomain && matchSearch
    })
  }, [signals, search, activeDomain])

  return (
    <div style={s.root}>

      {/* ── header ── */}
      <div style={s.header}>
        <div>
          <span style={s.title}>Signal Table</span>
          <span style={s.count}>{filtered.length} / {signals.length} signals</span>
        </div>
        <input
          style={s.search}
          placeholder="Search engine, domain, label, value…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── domain filter chips ── */}
      <div style={s.chipBar}>
        <FilterChip
          label="all"
          active={activeDomain === null}
          onClick={() => setActiveDomain(null)}
          color={{ fg: "#e2e8f0", bg: "#1e2631", border: "#334155" }}
        />
        {domains.map((d) => (
          <FilterChip
            key={d}
            label={d}
            active={activeDomain === d}
            color={domainColor(d)}
            onClick={() => setActiveDomain(activeDomain === d ? null : d)}
          />
        ))}
      </div>

      {/* ── table ── */}
      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Engine", "Domain", "Label", "Value"].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={s.empty}>
                  No signals match the current filter.
                </td>
              </tr>
            ) : (
              filtered.map((sig, i) => (
                <SignalRow key={`${sig.engine}-${i}`} signal={sig} index={i} />
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── styles ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
    background: "#0d1117",
    border: "1px solid #1e2631",
    borderRadius: 10,
    overflow: "hidden",
    color: "#e2e8f0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #1e2631",
    gap: 12,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#e2e8f0",
    marginRight: 10,
  },
  count: {
    fontSize: 10,
    color: "#475569",
  },
  search: {
    background: "#131920",
    border: "1px solid #1e2631",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 11,
    color: "#e2e8f0",
    outline: "none",
    width: 280,
    fontFamily: "inherit",
  },
  chipBar: {
    display: "flex",
    gap: 5,
    padding: "8px 16px",
    borderBottom: "1px solid #1e2631",
    flexWrap: "wrap",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 11,
  },
  th: {
    textAlign: "left",
    padding: "7px 14px",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#475569",
    borderBottom: "1px solid #1e2631",
    background: "#0d1117",
    whiteSpace: "nowrap",
  },
  tdEngine: {
    padding: "7px 14px",
    color: "#7dd3fc",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  tdDomain: {
    padding: "7px 14px",
    whiteSpace: "nowrap",
  },
  tdLabel: {
    padding: "7px 14px",
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },
  tdValue: {
    padding: "7px 14px",
    maxWidth: 300,
    overflow: "hidden",
  },
  valueCode: {
    color: "#fcd34d",
    fontFamily: "inherit",
    fontSize: 11,
  },
  empty: {
    padding: "28px 14px",
    textAlign: "center",
    color: "#334155",
    fontSize: 11,
  },
}
