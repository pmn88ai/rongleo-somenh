"use client"

import React, { useState } from "react"
import type { NumerologyPanelInput } from "./types"
import type { SignalEntry } from "../shared/types"
import { formatValue } from "../shared/formatValue"

function resolveLabel(signal: SignalEntry): string {
  return signal.label ?? signal.engine
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SignalRow({ signal, index }: { signal: SignalEntry; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const raw = formatValue(signal.value)
  const isLong = raw.length > 36

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "8px 0",
        borderBottom: "1px solid #0f1520",
        gap: 12,
        minHeight: 36,
        background: index % 2 === 0 ? "transparent" : "#0a0f18",
      }}
    >
      {/* label */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={s.rowLabel}>{resolveLabel(signal)}</span>
        <span style={s.rowEngine}>{signal.engine}</span>
      </div>

      {/* value */}
      <div style={{ textAlign: "right", minWidth: 0 }}>
        {isLong ? (
          <div>
            <code
              style={{
                ...s.rowValue,
                display: "block",
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: expanded ? "clip" : "ellipsis",
                whiteSpace: expanded ? "normal" : "nowrap",
                wordBreak: "break-all",
                cursor: "pointer",
              }}
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Click to collapse" : "Click to expand"}
            >
              {raw}
            </code>
          </div>
        ) : (
          <code style={s.rowValue}>{raw}</code>
        )}
      </div>
    </div>
  )
}

// ─── component ───────────────────────────────────────────────────────────────

export function NumerologyPanel({ group }: NumerologyPanelInput) {
  return (
    <div style={s.root}>

      {/* header */}
      <div style={s.header}>
        <div style={s.dot} />
        <span style={s.title}>Numerology</span>
        <span style={s.badge}>{group.domain}</span>
        <span style={s.count}>{group.signals.length} signals</span>
      </div>

      {/* signal rows */}
      <div style={s.body}>
        {group.signals.length === 0 ? (
          <div style={s.empty}>No signals in this group.</div>
        ) : (
          group.signals.map((signal, i) => (
            <SignalRow key={signal.engine} signal={signal} index={i} />
          ))
        )}
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
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid #1e2631",
    flexWrap: "wrap",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#818cf8",
    boxShadow: "0 0 6px #818cf877",
    flexShrink: 0,
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#818cf8",
  },
  badge: {
    padding: "1px 7px",
    borderRadius: 3,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.06em",
    background: "#818cf811",
    color: "#818cf8",
    border: "1px solid #818cf833",
    textTransform: "uppercase",
  },
  count: {
    marginLeft: "auto",
    fontSize: 10,
    color: "#334155",
  },
  body: {
    padding: "4px 16px 10px",
  },
  rowLabel: {
    fontSize: 11,
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },
  rowEngine: {
    fontSize: 9,
    color: "#334155",
    letterSpacing: "0.04em",
  },
  rowValue: {
    fontSize: 11,
    color: "#7dd3fc",
    fontFamily: "inherit",
  },
  empty: {
    padding: "20px 0",
    textAlign: "center",
    fontSize: 12,
    color: "#334155",
  },
}
