"use client"

import React from "react"
import type { BarChartInput } from "./types"
import type { SignalEntry } from "../shared/types"

// ─── helpers ─────────────────────────────────────────────────────────────────

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  const n = Number(value)
  return isNaN(n) ? 0 : Math.max(0, n)
}

function resolveLabel(signal: SignalEntry): string {
  return signal.label ?? signal.engine
}

// ─── domain color ─────────────────────────────────────────────────────────────

const DOMAIN_COLOR: Record<string, string> = {
  numerology:      "#818cf8",
  astrology:       "#fb923c",
  fengshui:        "#34d399",
  phoneNumerology: "#38bdf8",
  compatibility:   "#f472b6",
  demographics:    "#a78bfa",
  core:            "#94a3b8",
}
const FALLBACK_COLOR = "#64748b"

function accentColor(domain: string): string {
  return DOMAIN_COLOR[domain] ?? FALLBACK_COLOR
}

// ─── horizontal bar chart ────────────────────────────────────────────────────

function HorizontalBars({
  signals,
  scale,
  accent,
  svgW,
}: {
  signals: SignalEntry[]
  scale: number
  accent: string
  svgW: number
}) {
  const ROW_H    = 32
  const LABEL_W  = 110
  const VALUE_W  = 32
  const BAR_AREA = svgW - LABEL_W - VALUE_W - 16
  const svgH     = signals.length * ROW_H

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
      {signals.map((sig, i) => {
        const val   = toNumber(sig.value)
        const ratio = scale > 0 ? val / scale : 0
        const barW  = Math.max(0, ratio * BAR_AREA)
        const y     = i * ROW_H

        return (
          <g key={sig.engine}>
            {/* row background */}
            <rect
              x={0} y={y}
              width={svgW} height={ROW_H}
              fill={i % 2 === 0 ? "transparent" : "#080d14"}
            />

            {/* label */}
            <text
              x={LABEL_W - 8} y={y + ROW_H / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={10}
              fill="#94a3b8"
              fontFamily="'IBM Plex Mono', monospace"
            >
              {resolveLabel(sig)}
            </text>

            {/* track */}
            <rect
              x={LABEL_W} y={y + ROW_H / 2 - 4}
              width={BAR_AREA} height={8}
              rx={2}
              fill="#131920"
            />

            {/* bar */}
            {barW > 0 && (
              <rect
                x={LABEL_W} y={y + ROW_H / 2 - 4}
                width={barW} height={8}
                rx={2}
                fill={`${accent}cc`}
              />
            )}

            {/* value label */}
            <text
              x={LABEL_W + BAR_AREA + 8}
              y={y + ROW_H / 2}
              dominantBaseline="central"
              fontSize={10}
              fontWeight={700}
              fill={accent}
              fontFamily="'IBM Plex Mono', monospace"
            >
              {val}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── vertical bar chart ──────────────────────────────────────────────────────

function VerticalBars({
  signals,
  scale,
  accent,
  svgW,
}: {
  signals: SignalEntry[]
  scale: number
  accent: string
  svgW: number
}) {
  const n         = signals.length
  const BAR_AREA  = 140
  const LABEL_H   = 20
  const VALUE_H   = 16
  const svgH      = BAR_AREA + LABEL_H + VALUE_H + 16
  const colW      = n > 0 ? (svgW - 24) / n : svgW
  const BAR_MAX_W = Math.min(colW - 8, 40)

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
      {signals.map((sig, i) => {
        const val   = toNumber(sig.value)
        const ratio = scale > 0 ? val / scale : 0
        const barH  = Math.max(0, ratio * BAR_AREA)
        const cx    = 12 + i * colW + colW / 2
        const barX  = cx - BAR_MAX_W / 2

        return (
          <g key={sig.engine}>
            {/* track */}
            <rect
              x={barX}
              y={8}
              width={BAR_MAX_W}
              height={BAR_AREA}
              rx={3}
              fill="#131920"
            />

            {/* bar — grows upward from bottom */}
            {barH > 0 && (
              <rect
                x={barX}
                y={8 + BAR_AREA - barH}
                width={BAR_MAX_W}
                height={barH}
                rx={3}
                fill={`${accent}cc`}
              />
            )}

            {/* value */}
            <text
              x={cx}
              y={8 + BAR_AREA - barH - 4}
              textAnchor="middle"
              dominantBaseline="auto"
              fontSize={9}
              fontWeight={700}
              fill={accent}
              fontFamily="'IBM Plex Mono', monospace"
            >
              {val}
            </text>

            {/* label */}
            <text
              x={cx}
              y={svgH - 4}
              textAnchor="middle"
              dominantBaseline="auto"
              fontSize={9}
              fill="#64748b"
              fontFamily="'IBM Plex Mono', monospace"
            >
              {resolveLabel(sig).slice(0, 8)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── component ───────────────────────────────────────────────────────────────

export function BarChart({
  group,
  title,
  orientation = "horizontal",
  maxValue,
}: BarChartInput) {
  const signals = group.signals
  const accent  = accentColor(group.domain)
  const values  = signals.map((s) => toNumber(s.value))
  const scale   = maxValue ?? Math.max(...values, 1)
  const SVG_W   = 380

  if (signals.length === 0) {
    return (
      <div style={{ ...s.root, padding: 20, textAlign: "center", color: "#475569", fontSize: 11 }}>
        No signals to display.
      </div>
    )
  }

  return (
    <div style={s.root}>

      {/* header */}
      <div style={s.header}>
        <div style={{ ...s.dot, background: accent, boxShadow: `0 0 6px ${accent}77` }} />
        <span style={{ ...s.title, color: accent }}>
          {title ?? "Bar Chart"}
        </span>
        <span style={{
          marginLeft: "auto", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "1px 7px", borderRadius: 3,
          background: `${accent}11`, color: accent,
          border: `1px solid ${accent}33`,
        }}>
          {group.domain}
        </span>
      </div>

      {/* chart body */}
      <div style={{ padding: "14px 16px 10px", overflowX: "auto" }}>
        {orientation === "horizontal" ? (
          <HorizontalBars signals={signals} scale={scale} accent={accent} svgW={SVG_W} />
        ) : (
          <VerticalBars signals={signals} scale={scale} accent={accent} svgW={SVG_W} />
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
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
}
