"use client"

// ─────────────────────────────────────────────
//  Energy Creature — Explanation Panel
//  src/lib/ui/energyCreature/EnergyExplainPanel.tsx
//
//  Displays the calculation breakdown from Python engine.
//  Title: "Giải thích cách tính"
//
//  RULES:
//  - Reads AxisExplainEntry[] built by energyExplainBuilder
//  - NO recompute
//  - NO interpretation
//  - NO personality / archetype labels
//  - Pure display of Python-returned numbers
// ─────────────────────────────────────────────

import React, { useState } from "react"
import type { AxisExplainEntry } from "./energyCreatureTypes"

type Props = {
  entries: AxisExplainEntry[]
}

const ACCENT   = "#34d399"
const POSITIVE = "#34d399"
const NEGATIVE = "#f87171"
const NEUTRAL  = "#64748b"

function valueColor(v: number): string {
  if (v > 0) return POSITIVE
  if (v < 0) return NEGATIVE
  return NEUTRAL
}

function barWidth(v: number): string {
  // normalized value 0–10 → bar width 0–100%
  return `${Math.min(100, Math.max(0, v * 10)).toFixed(1)}%`
}

export function EnergyExplainPanel({ entries }: Props) {
  const [openAxis, setOpenAxis] = useState<string | null>(null)

  return (
    <div style={s.root}>

      {/* header */}
      <div style={s.header}>
        <div style={{ ...s.dot, background: ACCENT, boxShadow: `0 0 6px ${ACCENT}77` }} />
        <span style={{ ...s.title, color: ACCENT }}>Giải thích cách tính</span>
        <span style={s.badge}>6 trục</span>
      </div>

      {/* column headers */}
      <div style={s.colHeaders}>
        <span style={{ flex: 3 }}>Trục</span>
        <span style={{ flex: 2, textAlign: "right" as const }}>Thô</span>
        <span style={{ flex: 2, textAlign: "right" as const }}>Chuẩn hóa</span>
        <span style={{ flex: 4 }}>Mức độ</span>
        <span style={{ flex: 1 }} />
      </div>

      {/* axis rows */}
      {entries.map((entry) => {
        const isOpen = openAxis === entry.axis
        return (
          <div key={entry.axis} style={s.axisBlock}>

            {/* summary row */}
            <div
              style={{ ...s.axisRow, cursor: "pointer" }}
              onClick={() => setOpenAxis(isOpen ? null : entry.axis)}
            >
              <span style={{ ...s.axisLabel, flex: 3 }}>{entry.label}</span>

              <span style={{ ...s.val, flex: 2, textAlign: "right" as const, color: valueColor(entry.rawValue) }}>
                {entry.rawValue >= 0 ? "+" : ""}{entry.rawValue.toFixed ? entry.rawValue.toFixed(0) : entry.rawValue}
              </span>

              <span style={{ ...s.val, flex: 2, textAlign: "right" as const, color: ACCENT }}>
                {typeof entry.normalizedValue === "number" ? entry.normalizedValue.toFixed(2) : entry.normalizedValue}
              </span>

              <div style={{ flex: 4, paddingRight: 8 }}>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width: barWidth(entry.normalizedValue), background: ACCENT }} />
                </div>
              </div>

              <span style={{ flex: 1, textAlign: "right" as const, color: "#475569", fontSize: 10 }}>
                {isOpen ? "▲" : "▼"}
              </span>
            </div>

            {/* contribution breakdown — only when open */}
            {isOpen && (
              <div style={s.contributions}>
                <div style={s.contribHeader}>
                  <span style={{ flex: 4 }}>Nguồn tín hiệu</span>
                  <span style={{ flex: 1, textAlign: "right" as const }}>Giá trị</span>
                </div>
                {entry.contributions.length === 0 && (
                  <div style={s.contribRow}>
                    <span style={{ color: "#475569", fontSize: 10 }}>Không có dữ liệu</span>
                  </div>
                )}
                {entry.contributions.map((c, i) => (
                  <div key={i} style={s.contribRow}>
                    <span style={{ ...s.contribSignal, flex: 4 }}>{c.signal}</span>
                    <span style={{ ...s.val, flex: 1, textAlign: "right" as const, color: valueColor(c.value) }}>
                      {c.value >= 0 ? "+" : ""}{c.value}
                    </span>
                  </div>
                ))}
                <div style={s.contribFooter}>
                  <span style={{ color: "#475569" }}>Tổng thô</span>
                  <span style={{ color: valueColor(entry.rawValue), fontWeight: 700 }}>
                    {entry.rawValue >= 0 ? "+" : ""}{entry.rawValue}
                  </span>
                  <span style={{ color: "#475569" }}>→ Chuẩn hóa</span>
                  <span style={{ color: ACCENT, fontWeight: 700 }}>
                    {typeof entry.normalizedValue === "number" ? entry.normalizedValue.toFixed(2) : entry.normalizedValue}
                  </span>
                </div>
              </div>
            )}

          </div>
        )
      })}

    </div>
  )
}

// ─── styles ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily:   "'IBM Plex Mono', 'Fira Code', monospace",
    background:   "#0d1117",
    border:       "1px solid #1e2631",
    borderRadius: 10,
    overflow:     "hidden",
    color:        "#e2e8f0",
  },
  header: {
    display:      "flex",
    alignItems:   "center",
    gap:          8,
    padding:      "12px 16px",
    borderBottom: "1px solid #1e2631",
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
  },
  title: {
    fontSize:      11,
    fontWeight:    700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  badge: {
    marginLeft:   "auto",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding:       "1px 7px",
    borderRadius:  3,
    background:    `${ACCENT}11`,
    color:         ACCENT,
    border:        `1px solid ${ACCENT}33`,
  },
  colHeaders: {
    display:       "flex",
    alignItems:    "center",
    padding:       "6px 16px",
    fontSize:       9,
    fontWeight:     700,
    letterSpacing:  "0.06em",
    textTransform:  "uppercase",
    color:          "#334155",
    borderBottom:   "1px solid #1e2631",
    gap:            8,
  },
  axisBlock: {
    borderBottom: "1px solid #1e2631",
  },
  axisRow: {
    display:     "flex",
    alignItems:  "center",
    padding:     "10px 16px",
    gap:          8,
    userSelect:  "none",
  },
  axisLabel: {
    fontSize:   11,
    fontWeight: 600,
    color:      "#94a3b8",
  },
  val: {
    fontSize:   10,
    fontWeight: 700,
  },
  barTrack: {
    background:   "#1e2631",
    borderRadius:  3,
    height:        6,
    overflow:     "hidden",
  },
  barFill: {
    height:       "100%",
    borderRadius:  3,
    transition:   "width 0.3s ease",
  },
  contributions: {
    background:   "#0a0f16",
    borderTop:    "1px solid #1e2631",
    padding:      "8px 16px 12px",
  },
  contribHeader: {
    display:       "flex",
    gap:            8,
    fontSize:       9,
    fontWeight:     700,
    letterSpacing:  "0.06em",
    textTransform:  "uppercase",
    color:          "#334155",
    paddingBottom:  6,
    marginBottom:   4,
    borderBottom:   "1px solid #1e2631",
  },
  contribRow: {
    display:    "flex",
    alignItems: "center",
    gap:         8,
    padding:    "3px 0",
  },
  contribSignal: {
    fontSize:     10,
    color:        "#64748b",
    overflow:     "hidden",
    textOverflow: "ellipsis",
    whiteSpace:   "nowrap",
  },
  contribFooter: {
    display:      "flex",
    gap:           12,
    alignItems:    "center",
    marginTop:     8,
    paddingTop:    8,
    borderTop:    "1px solid #1e2631",
    fontSize:      10,
  },
}
