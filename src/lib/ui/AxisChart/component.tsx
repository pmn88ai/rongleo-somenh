"use client"

import React from "react"
import type { AxisChartInput } from "./types"
import type { SignalEntry } from "../shared/types"

// ─── helpers ─────────────────────────────────────────────────────────────────

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  const n = Number(value)
  return isNaN(n) ? 0 : n
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

function resolveLabel(signal: SignalEntry): string {
  return signal.label ?? signal.engine
}

function mapToRange(val: number, min: number, max: number): number {
  if (max === min) return 0.5
  return (val - min) / (max - min)
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

// ─── single axis row ─────────────────────────────────────────────────────────

function AxisRow({
  signal,
  minValue,
  maxValue,
  accent,
  index,
  trackW,
  labelW,
}: {
  signal: SignalEntry
  minValue: number
  maxValue: number
  accent: string
  index: number
  trackW: number
  labelW: number
}) {
  const val      = clamp(toNumber(signal.value), minValue, maxValue)
  const ratio    = mapToRange(val, minValue, maxValue)
  const markerX  = labelW + ratio * trackW
  const rowH     = 36

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "0 16px",
        height: rowH,
        background: index % 2 === 0 ? "transparent" : "#080d14",
        position: "relative",
      }}
    >
      {/* label */}
      <span style={{
        width: labelW,
        fontSize: 10,
        color: "#94a3b8",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flexShrink: 0,
        paddingRight: 8,
      }}>
        {resolveLabel(signal)}
      </span>

      {/* track + marker */}
      <div style={{ flex: 1, position: "relative", height: rowH, display: "flex", alignItems: "center" }}>

        {/* track line */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          height: 2,
          background: "#1e2631",
          borderRadius: 1,
        }} />

        {/* filled portion */}
        <div style={{
          position: "absolute",
          left: 0,
          width: `${ratio * 100}%`,
          height: 2,
          background: `${accent}66`,
          borderRadius: 1,
        }} />

        {/* marker dot */}
        <div style={{
          position: "absolute",
          left: `${ratio * 100}%`,
          transform: "translateX(-50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: accent,
          border: "2px solid #0d1117",
          boxShadow: `0 0 5px ${accent}88`,
          zIndex: 1,
        }} />

        {/* value label above marker */}
        <span style={{
          position: "absolute",
          left: `${ratio * 100}%`,
          transform: "translateX(-50%)",
          bottom: -2,
          fontSize: 9,
          fontWeight: 700,
          color: accent,
          fontFamily: "'IBM Plex Mono', monospace",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}>
          {val % 1 === 0 ? val : val.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

// ─── scale header ─────────────────────────────────────────────────────────────

function ScaleHeader({
  minValue,
  maxValue,
  labelW,
}: {
  minValue: number
  maxValue: number
  labelW: number
}) {
  const mid = (minValue + maxValue) / 2
  return (
    <div style={{
      display: "flex",
      padding: "4px 16px 4px",
      gap: 0,
    }}>
      <div style={{ width: labelW, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
        <span style={scaleTextStyle}>{minValue}</span>
        <span style={scaleTextStyle}>{mid % 1 === 0 ? mid : mid.toFixed(1)}</span>
        <span style={scaleTextStyle}>{maxValue}</span>
      </div>
    </div>
  )
}

const scaleTextStyle: React.CSSProperties = {
  fontSize: 8,
  color: "#334155",
  fontFamily: "'IBM Plex Mono', monospace",
}

// ─── component ───────────────────────────────────────────────────────────────

const LABEL_W = 100

export function AxisChart({
  group,
  title,
  minValue = 0,
  maxValue,
}: AxisChartInput) {
  const signals = group.signals
  const accent  = accentColor(group.domain)
  const values  = signals.map((s) => toNumber(s.value))
  const scale   = maxValue ?? Math.max(...values, 1)

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
          {title ?? "Axis Chart"}
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

      {/* scale header */}
      <ScaleHeader minValue={minValue} maxValue={scale} labelW={LABEL_W} />

      {/* axis rows */}
      <div style={{ paddingBottom: 12 }}>
        {signals.map((sig, i) => (
          <AxisRow
            key={sig.engine}
            signal={sig}
            minValue={minValue}
            maxValue={scale}
            accent={accent}
            index={i}
            trackW={240}   // approximate; true width handled by flex
            labelW={LABEL_W}
          />
        ))}
      </div>

      {/* scale footer */}
      <div style={{
        borderTop: "1px solid #1e2631",
        padding: "6px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 9, color: "#334155" }}>
          range: {minValue} — {scale}
        </span>
        <span style={{ fontSize: 9, color: "#334155" }}>
          {signals.length} axes
        </span>
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
