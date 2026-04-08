// src/lib/ui/ProfileViewer/index.tsx
//
// ARCHITECTURE RULES:
// - Pure display component. No API calls. No engine imports.
// - Receives UnifiedAstrologyProfile as a prop.
// - Renders all six signal groups as collapsible panels.
// - No aggregator, persistence, or engine imports permitted.

import React, { useState } from "react";
import type {
  ProfileViewerProps,
  SignalGroupKey,
  SignalGroupData,
  SignalPanelProps,
  UnifiedAstrologyProfile,
} from "./types";

// ---------------------------------------------------------------------------
// Constants — ordered as defined in DATA_SCHEMA.md
// ---------------------------------------------------------------------------

const ALL_GROUPS: { key: SignalGroupKey; label: string }[] = [
  { key: "numerologySignals",   label: "Numerology Signals" },
  { key: "astrologySignals",    label: "Astrology Signals" },
  { key: "fengShuiSignals",     label: "Feng Shui Signals" },
  { key: "phoneSignals",        label: "Phone Signals" },
  { key: "compatibilitySignals",label: "Compatibility Signals" },
  { key: "derivedSignals",      label: "Derived Signals" },
];

const KNOWN_META_KEYS = new Set([
  "profileId", "fullName", "birthDate", "birthHour", "gender", "phone",
  ...ALL_GROUPS.map((g) => g.key),
]);

// ---------------------------------------------------------------------------
// Value rendering helpers
// ---------------------------------------------------------------------------

function renderValue(value: unknown, depth = 0): React.ReactNode {
  if (value === null || value === undefined) {
    return <span style={styles.emptyCell}>—</span>;
  }

  if (typeof value === "boolean") {
    return <span style={styles.boolCell}>{String(value)}</span>;
  }

  if (typeof value === "number") {
    return <span style={styles.numberCell}>{value}</span>;
  }

  if (typeof value === "string") {
    if (value.trim() === "") return <span style={styles.emptyCell}>—</span>;
    return <span style={styles.stringCell}>{value}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={styles.emptyCell}>—</span>;
    return (
      <span style={styles.arrayCell}>
        {value.map(String).join(", ")}
      </span>
    );
  }

  if (typeof value === "object") {
    if (depth >= 1) {
      // Deep nesting: render as JSON string
      return (
        <code style={styles.jsonCell}>
          {JSON.stringify(value, null, 0)}
        </code>
      );
    }
    // One level deep: render as sub-table
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span style={styles.emptyCell}>—</span>;
    return (
      <table style={styles.subTable}>
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k}>
              <td style={styles.subKey}>{k}</td>
              <td style={styles.subValue}>{renderValue(v, depth + 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <span>{String(value)}</span>;
}

// ---------------------------------------------------------------------------
// SignalPanel — collapsible panel for one signal group
// ---------------------------------------------------------------------------

function SignalPanel({ label, groupKey, data, defaultOpen = true }: SignalPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const entries = Object.entries(data);

  return (
    <div style={styles.panel} data-testid={`panel-${groupKey}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={styles.panelHeader}
        aria-expanded={open}
      >
        <span style={styles.panelToggle}>{open ? "▾" : "▸"}</span>
        <span style={styles.panelLabel}>{label}</span>
        <span style={styles.panelCount}>{entries.length} signal{entries.length !== 1 ? "s" : ""}</span>
      </button>

      {open && (
        <div style={styles.panelBody}>
          {entries.length === 0 ? (
            <p style={styles.noData}>No data available.</p>
          ) : (
            <table style={styles.signalTable}>
              <thead>
                <tr>
                  <th style={styles.thKey}>Signal</th>
                  <th style={styles.thValue}>Value</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([key, val]) => (
                  <tr key={key} style={styles.signalRow}>
                    <td style={styles.signalKey}>{key}</td>
                    <td style={styles.signalValue}>{renderValue(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MetaBlock — renders profileId and core input fields
// ---------------------------------------------------------------------------

function MetaBlock({ profile }: { profile: UnifiedAstrologyProfile }) {
  const fields: { label: string; key: keyof UnifiedAstrologyProfile }[] = [
    { label: "Profile ID",  key: "profileId" },
    { label: "Full Name",   key: "fullName" },
    { label: "Birth Date",  key: "birthDate" },
    { label: "Birth Hour",  key: "birthHour" },
    { label: "Gender",      key: "gender" },
    { label: "Phone",       key: "phone" },
  ];

  return (
    <div style={styles.metaBlock}>
      <div style={styles.metaHeading}>Profile Metadata</div>
      <table style={styles.metaTable}>
        <tbody>
          {fields.map(({ label, key }) => (
            <tr key={key}>
              <td style={styles.metaKey}>{label}</td>
              <td style={styles.metaValue}>{renderValue(profile[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProfileViewer({ profile, visibleGroups }: ProfileViewerProps) {
  // Determine which groups to render
  const groupsToRender = visibleGroups
    ? ALL_GROUPS.filter((g) => visibleGroups.includes(g.key))
    : ALL_GROUPS;

  // Collect unknown top-level keys not in known set
  const otherKeys = Object.keys(profile).filter((k) => !KNOWN_META_KEYS.has(k));
  const otherData: Record<string, unknown> = {};
  otherKeys.forEach((k) => { otherData[k] = profile[k]; });

  return (
    <div style={styles.viewer} data-testid="profile-viewer">
      <div style={styles.viewerHeader}>
        <h2 style={styles.viewerTitle}>Profile Viewer</h2>
        <span style={styles.viewerSubtitle}>Debug UI — Symbol Engine Platform</span>
      </div>

      <MetaBlock profile={profile} />

      <div style={styles.divider} />

      {groupsToRender.length === 0 ? (
        <p style={styles.noGroupsMessage}>No groups selected.</p>
      ) : (
        <div style={styles.panelList}>
          {groupsToRender.map(({ key, label }) => (
            <SignalPanel
              key={key}
              groupKey={key}
              label={label}
              data={(profile[key] as Record<string, unknown>) ?? {}}
              defaultOpen={true}
            />
          ))}
        </div>
      )}

      {otherKeys.length > 0 && (
        <>
          <div style={styles.divider} />
          <SignalPanel
            groupKey={"derivedSignals"} // closest category — used only for testid here
            label="Other (unknown fields)"
            data={otherData}
            defaultOpen={false}
          />
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles — utilitarian debug aesthetic
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  // Viewer shell
  viewer: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: 12,
    background: "#0f0f11",
    border: "1px solid #2a2a2e",
    borderRadius: 6,
    color: "#d4d4d8",
    maxWidth: 860,
    overflow: "hidden",
  },
  viewerHeader: {
    padding: "20px 24px 16px",
    borderBottom: "1px solid #1c1c1f",
  },
  viewerTitle: {
    margin: "0 0 4px 0",
    fontSize: 15,
    fontWeight: 600,
    color: "#f4f4f5",
    letterSpacing: "0.02em",
  },
  viewerSubtitle: {
    fontSize: 10,
    color: "#52525b",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  // Meta block
  metaBlock: {
    padding: "16px 24px",
    background: "#111113",
  },
  metaHeading: {
    fontSize: 10,
    fontWeight: 700,
    color: "#52525b",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  metaTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  metaKey: {
    color: "#71717a",
    fontSize: 11,
    paddingRight: 24,
    paddingBottom: 5,
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: 120,
  },
  metaValue: {
    color: "#e4e4e7",
    fontSize: 12,
    paddingBottom: 5,
  },

  // Layout
  divider: {
    borderTop: "1px solid #1c1c1f",
  },
  panelList: {
    display: "flex",
    flexDirection: "column",
  },
  noGroupsMessage: {
    padding: "24px",
    color: "#52525b",
    fontStyle: "italic",
    margin: 0,
  },

  // Panel
  panel: {
    borderBottom: "1px solid #1c1c1f",
  },
  panelHeader: {
    all: "unset",
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "12px 24px",
    cursor: "pointer",
    boxSizing: "border-box",
    background: "transparent",
  },
  panelToggle: {
    color: "#3b82f6",
    fontSize: 13,
    width: 14,
    display: "inline-block",
  },
  panelLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 600,
    color: "#a1a1aa",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  panelCount: {
    fontSize: 10,
    color: "#3f3f46",
  },
  panelBody: {
    padding: "0 24px 16px 48px",
  },
  noData: {
    color: "#3f3f46",
    fontStyle: "italic",
    margin: "8px 0",
    fontSize: 11,
  },

  // Signal table
  signalTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thKey: {
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    color: "#3f3f46",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    paddingBottom: 6,
    paddingRight: 24,
    borderBottom: "1px solid #1c1c1f",
  },
  thValue: {
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    color: "#3f3f46",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    paddingBottom: 6,
    borderBottom: "1px solid #1c1c1f",
  },
  signalRow: {
    borderBottom: "1px solid #18181b",
  },
  signalKey: {
    color: "#71717a",
    fontSize: 11,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 24,
    verticalAlign: "top",
    whiteSpace: "nowrap",
  },
  signalValue: {
    paddingTop: 7,
    paddingBottom: 7,
    verticalAlign: "top",
  },

  // Sub-table for nested objects
  subTable: {
    borderCollapse: "collapse",
  },
  subKey: {
    color: "#52525b",
    fontSize: 11,
    paddingRight: 12,
    paddingBottom: 2,
    verticalAlign: "top",
    whiteSpace: "nowrap",
  },
  subValue: {
    paddingBottom: 2,
    verticalAlign: "top",
  },

  // Value type styles
  emptyCell: {
    color: "#3f3f46",
  },
  numberCell: {
    color: "#60a5fa",
  },
  stringCell: {
    color: "#86efac",
  },
  boolCell: {
    color: "#c084fc",
  },
  arrayCell: {
    color: "#fbbf24",
  },
  jsonCell: {
    color: "#94a3b8",
    fontSize: 10,
    wordBreak: "break-all",
  },
};
