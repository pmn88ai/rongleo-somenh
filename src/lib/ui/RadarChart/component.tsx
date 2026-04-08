"use client"

import React from "react"
import type { RadarChartInput } from "./types"
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

// Polar → cartesian. angle=0 is top (−90° offset).
function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function pointsToPath(pts: [number, number][]): string {
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") + " Z"
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

function accentColor(domain: string) {
  return DOMAIN_COLOR[domain] ?? FALLBACK_COLOR
}

// ─── component ───────────────────────────────────────────────────────────────

const SVG_SIZE  = 320
const CX        = SVG_SIZE / 2
const CY        = SVG_SIZE / 2
const R_MAX     = 110   // outer ring radius
const R_RINGS   = 4     // number of concentric guide rings
const LABEL_PAD = 18    // extra distance from R_MAX for labels

export function RadarChart({ group, title, maxValue }: RadarChartInput) {
  const signals  = group.signals
  const n        = signals.length
  const accent   = accentColor(group.domain)

  if (n < 3) {
    return (
      <div style={{ ...s.root, padding: 20, textAlign: "center", color: "#475569", fontSize: 11 }}>
        RadarChart requires at least 3 signals. Received {n}.
      </div>
    )
  }

  // Coerce all values to numbers
  const values   = signals.map((sig) => toNumber(sig.value))
  const dataMax  = Math.max(...values, 1)
  const scale    = maxValue ?? dataMax

  const stepAngle = 360 / n

  // Compute polygon points for data shape
  const dataPoints: [number, number][] = signals.map((sig, i) => {
    const ratio = toNumber(sig.value) / scale
    return polar(CX, CY, R_MAX * ratio, i * stepAngle)
  })

  // Compute axis spoke endpoints
  const axisPoints: [number, number][] = signals.map((_, i) =>
    polar(CX, CY, R_MAX, i * stepAngle)
  )

  // Compute label positions
  const labelPoints: { x: number; y: number; label: string; value: number }[] = signals.map(
    (sig, i) => {
      const [x, y] = polar(CX, CY, R_MAX + LABEL_PAD, i * stepAngle)
      return { x, y, label: resolveLabel(sig), value: toNumber(sig.value) }
    }
  )

  // Guide rings
  const rings = Array.from({ length: R_RINGS }, (_, i) => {
    const r = (R_MAX / R_RINGS) * (i + 1)
    const pts = signals.map((_, j) => polar(CX, CY, r, j * stepAngle))
    return pointsToPath(pts)
  })

  return (
    <div style={s.root}>

      {/* header */}
      <div style={s.header}>
        <div
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: accent, boxShadow: `0 0 6px ${accent}77`,
            flexShrink: 0,
          }}
        />
        <span style={{ ...s.title, color: accent }}>
          {title ?? "Radar Chart"}
        </span>
        <span
          style={{
            marginLeft: "auto", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "1px 7px", borderRadius: 3,
            background: `${accent}11`, color: accent,
            border: `1px solid ${accent}33`,
          }}
        >
          {group.domain}
        </span>
      </div>

      {/* SVG radar */}
      <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 8px" }}>
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          style={{ overflow: "visible" }}
        >
          {/* guide rings */}
          {rings.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#1e2631" strokeWidth={1} />
          ))}

          {/* axis spokes */}
          {axisPoints.map(([x, y], i) => (
            <line
              key={i}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke="#1e2631" strokeWidth={1}
            />
          ))}

          {/* data shape — filled */}
          <path
            d={pointsToPath(dataPoints)}
            fill={`${accent}22`}
            stroke={accent}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* data point dots */}
          {dataPoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3.5} fill={accent} />
          ))}

          {/* center dot */}
          <circle cx={CX} cy={CY} r={3} fill="#1e2631" stroke="#334155" strokeWidth={1} />

          {/* axis labels */}
          {labelPoints.map(({ x, y, label, value }, i) => {
            // Anchor adjustment based on x position relative to center
            const anchor = x < CX - 4 ? "end" : x > CX + 4 ? "start" : "middle"
            const baseline = y < CY - 4 ? "auto" : y > CY + 4 ? "hanging" : "central"
            return (
              <g key={i}>
                <text
                  x={x} y={y}
                  textAnchor={anchor}
                  dominantBaseline={baseline}
                  fontSize={9}
                  fontWeight={600}
                  fill="#94a3b8"
                  fontFamily="'IBM Plex Mono', monospace"
                >
                  {label}
                </text>
                <text
                  x={x}
                  y={baseline === "hanging" ? y + 11 : baseline === "auto" ? y - 11 : y + 11}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fontSize={8}
                  fontWeight={700}
                  fill={accent}
                  fontFamily="'IBM Plex Mono', monospace"
                >
                  {value}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* legend row */}
      <div style={s.legend}>
        {signals.map((sig, i) => (
          <div key={i} style={s.legendItem}>
            <span style={{ ...s.legendDot, background: accent }} />
            <span style={s.legendLabel}>{resolveLabel(sig)}</span>
            <span style={{ ...s.legendValue, color: accent }}>{toNumber(sig.value)}</span>
          </div>
        ))}
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
  title: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  legend: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "0",
    borderTop: "1px solid #1e2631",
    padding: "4px 8px 8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 6px",
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: 9,
    color: "#64748b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  legendValue: {
    fontSize: 9,
    fontWeight: 700,
    flexShrink: 0,
  },
}
