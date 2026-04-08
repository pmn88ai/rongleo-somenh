"use client"

// ─────────────────────────────────────────────
//  Energy Creature — Renderer
//  src/lib/ui/energyCreature/EnergyCreatureRenderer.tsx
//
//  SVG polygon/blob shaped by EnergyCreatureModel.
//  Label: "Hình dạng năng lượng"
//
//  RULES:
//  - Receives EnergyCreatureModel — no raw axis data
//  - No computation beyond SVG geometry
//  - No interpretation, no personality, no archetype
//  - Pure display: model values → shape parameters
// ─────────────────────────────────────────────

import React from "react"
import type { EnergyCreatureModel } from "./energyCreatureTypes"

type Props = {
  model: EnergyCreatureModel
}

const SIZE   = 300
const CX     = SIZE / 2
const CY     = SIZE / 2
const R_BASE = 80   // base radius

// Deterministic pseudo-noise per point index — no Math.random()
// Uses a fixed seed sequence so shape is always identical for same model
function deterministicOffset(index: number, distortion: number): number {
  const seeds = [0.13, 0.67, 0.29, 0.81, 0.44, 0.55, 0.07, 0.92, 0.36, 0.18,
                 0.73, 0.61, 0.25, 0.88, 0.47, 0.03]
  const seed = seeds[index % seeds.length] ?? 0.5
  // Map seed to [-1, 1] range, then scale by distortion
  return (seed * 2 - 1) * distortion * R_BASE * 0.4
}

function buildPolygonPoints(model: EnergyCreatureModel): string {
  const { spikeCount, roundness, symmetry, distortion, rigidity, stability } = model

  // Minimum 3 points, maximum 12
  const n = Math.max(3, Math.min(12, spikeCount))

  // Base radius scales with stability
  const baseR = R_BASE * (0.5 + stability * 0.5)

  const points: [number, number][] = []

  for (let i = 0; i < n; i++) {
    const angleDeg = (360 / n) * i - 90
    const angleRad = (angleDeg * Math.PI) / 180

    // symmetry affects how evenly spaced the angle is
    // rigidity tightens the radius variance
    // roundness pushes radius toward base (softer shape)
    const symmetryOffset = symmetry < 0.5
      ? (i % 2 === 0 ? 1 : -1) * (0.5 - symmetry) * baseR * 0.3
      : 0

    const noiseOffset = deterministicOffset(i, distortion)

    const r = baseR
      + symmetryOffset
      + noiseOffset
      - rigidity * baseR * 0.1   // rigidity shrinks variance slightly
      + roundness * baseR * 0.05  // roundness adds slight outward push

    const clampedR = Math.max(10, r)

    points.push([
      CX + clampedR * Math.cos(angleRad),
      CY + clampedR * Math.sin(angleRad),
    ])
  }

  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")
}

function buildSmoothPath(model: EnergyCreatureModel): string {
  const { spikeCount, roundness, symmetry, distortion, rigidity, stability } = model

  const n = Math.max(3, Math.min(12, spikeCount))
  const baseR = R_BASE * (0.5 + stability * 0.5)

  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const angleDeg = (360 / n) * i - 90
    const angleRad = (angleDeg * Math.PI) / 180

    const symmetryOffset = symmetry < 0.5
      ? (i % 2 === 0 ? 1 : -1) * (0.5 - symmetry) * baseR * 0.3
      : 0

    const noiseOffset = deterministicOffset(i, distortion)
    const r = baseR + symmetryOffset + noiseOffset
      - rigidity * baseR * 0.1
      + roundness * baseR * 0.05
    const clampedR = Math.max(10, r)

    pts.push([
      CX + clampedR * Math.cos(angleRad),
      CY + clampedR * Math.sin(angleRad),
    ])
  }

  // If roundness is high, use cubic bezier curves for smooth blob
  if (roundness > 0.5) {
    const d: string[] = []
    for (let i = 0; i < n; i++) {
      const curr = pts[i]!
      const next = pts[(i + 1) % n]!
      const tension = 0.3 + roundness * 0.2

      const cp1x = curr[0] + (next[0] - pts[(i - 1 + n) % n]![0]) * tension
      const cp1y = curr[1] + (next[1] - pts[(i - 1 + n) % n]![1]) * tension
      const cp2x = next[0] - (pts[(i + 2) % n]![0] - curr[0]) * tension
      const cp2y = next[1] - (pts[(i + 2) % n]![1] - curr[1]) * tension

      if (i === 0) d.push(`M ${curr[0].toFixed(2)},${curr[1].toFixed(2)}`)
      d.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${next[0].toFixed(2)},${next[1].toFixed(2)}`)
    }
    d.push("Z")
    return d.join(" ")
  }

  // Low roundness — straight polygon
  return `M ${pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ")} Z`
}

const ACCENT = "#a78bfa"

export function EnergyCreatureRenderer({ model }: Props) {
  const polygonPoints = buildPolygonPoints(model)
  const smoothPath    = buildSmoothPath(model)

  return (
    <div style={s.root}>

      {/* header */}
      <div style={s.header}>
        <div style={{ ...s.dot, background: ACCENT, boxShadow: `0 0 6px ${ACCENT}77` }} />
        <span style={{ ...s.title, color: ACCENT }}>Hình dạng năng lượng</span>
        <span style={s.badge}>SVG</span>
      </div>

      {/* SVG creature */}
      <div style={s.svgWrap}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ overflow: "visible" }}
        >
          {/* guide circle */}
          <circle
            cx={CX} cy={CY} r={R_BASE}
            fill="none"
            stroke="#1e2631"
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* creature shape — filled area */}
          <path
            d={smoothPath}
            fill={`${ACCENT}18`}
            stroke={ACCENT}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* polygon points (vertices) */}
          {polygonPoints.split(" ").map((pt, i) => {
            const [x, y] = pt.split(",").map(Number)
            if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) return null
            return <circle key={i} cx={x} cy={y} r={3} fill={ACCENT} />
          })}

          {/* center dot */}
          <circle cx={CX} cy={CY} r={3} fill="#1e2631" stroke="#334155" strokeWidth={1} />
        </svg>
      </div>

      {/* model values */}
      <div style={s.grid}>
        {([
          ["Hành động (spikes)",  model.spikeCount.toString()],
          ["Cảm nhận (roundness)", model.roundness.toFixed(2)],
          ["Phân tích (symmetry)", model.symmetry.toFixed(2)],
          ["Biến đổi (distortion)", model.distortion.toFixed(2)],
          ["Kiểm soát (rigidity)", model.rigidity.toFixed(2)],
          ["Ổn định (stability)", model.stability.toFixed(2)],
        ] as [string, string][]).map(([label, val]) => (
          <div key={label} style={s.gridItem}>
            <span style={s.gridLabel}>{label}</span>
            <span style={{ ...s.gridVal, color: ACCENT }}>{val}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

// ─── styles ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily:  "'IBM Plex Mono', 'Fira Code', monospace",
    background:  "#0d1117",
    border:      "1px solid #1e2631",
    borderRadius: 10,
    overflow:    "hidden",
    color:       "#e2e8f0",
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
    textTransform: "uppercase" as const,
  },
  badge: {
    marginLeft:    "auto",
    fontSize:       9,
    fontWeight:     700,
    letterSpacing:  "0.06em",
    textTransform:  "uppercase" as const,
    padding:        "1px 7px",
    borderRadius:   3,
    background:     `${ACCENT}11`,
    color:          ACCENT,
    border:         `1px solid ${ACCENT}33`,
  },
  svgWrap: {
    display:         "flex",
    justifyContent:  "center",
    padding:         "20px 0 12px",
  },
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    borderTop:           "1px solid #1e2631",
    padding:             "4px 8px 8px",
  },
  gridItem: {
    display:     "flex",
    alignItems:  "center",
    gap:         6,
    padding:     "4px 6px",
  },
  gridLabel: {
    fontSize:       9,
    color:          "#64748b",
    flex:           1,
    overflow:       "hidden",
    textOverflow:   "ellipsis",
    whiteSpace:     "nowrap" as const,
  },
  gridVal: {
    fontSize:   9,
    fontWeight: 700,
    flexShrink: 0,
  },
}
