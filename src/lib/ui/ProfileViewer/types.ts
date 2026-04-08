// src/lib/ui/ProfileViewer/types.ts
//
// Types for the ProfileViewer debug component.
// UnifiedAstrologyProfile shape is defined by DATA_SCHEMA.md.

// ---------------------------------------------------------------------------
// Signal group keys — must match DATA_SCHEMA.md exactly
// ---------------------------------------------------------------------------

export type SignalGroupKey =
  | "numerologySignals"
  | "astrologySignals"
  | "fengShuiSignals"
  | "phoneSignals"
  | "compatibilitySignals"
  | "derivedSignals";

// ---------------------------------------------------------------------------
// UnifiedAstrologyProfile — structural contract from DATA_SCHEMA.md
// ---------------------------------------------------------------------------

export type SignalGroupData = Record<string, unknown>;

export type UnifiedAstrologyProfile = {
  profileId: string;
  fullName: string;
  birthDate: string;
  birthHour: number | null;
  gender: "male" | "female" | "other" | "unspecified";
  phone: string;

  numerologySignals: SignalGroupData;
  astrologySignals: SignalGroupData;
  fengShuiSignals: SignalGroupData;
  phoneSignals: SignalGroupData;
  compatibilitySignals: SignalGroupData;
  derivedSignals: SignalGroupData;

  [key: string]: unknown; // allows unknown top-level fields — rendered under "Other"
};

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export type ProfileViewerProps = {
  profile: UnifiedAstrologyProfile;
  visibleGroups?: SignalGroupKey[];
  // Optional filter — defaults to all six groups in schema order
};

export type SignalPanelProps = {
  label: string;
  groupKey: SignalGroupKey;
  data: SignalGroupData;
  defaultOpen?: boolean;
};
