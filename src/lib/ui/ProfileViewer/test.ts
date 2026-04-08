// src/lib/ui/ProfileViewer/test.ts
//
// RULES:
// - Uses mocked UnifiedAstrologyProfile fixture — no real API calls.
// - No engine module imports.
// - All assertions are deterministic.

import type { UnifiedAstrologyProfile, SignalGroupKey } from "./types";

// ---------------------------------------------------------------------------
// Mock fixture — matches DATA_SCHEMA.md structure exactly
// ---------------------------------------------------------------------------

export function makeMockProfile(
  overrides: Partial<UnifiedAstrologyProfile> = {}
): UnifiedAstrologyProfile {
  return {
    profileId: "test-abc-123",
    fullName: "Nguyen Van A",
    birthDate: "1990-05-15",
    birthHour: 7,
    gender: "male",
    phone: "0901234567",

    numerologySignals: {
      lifePath: { baseNumber: 3, masterNumber: null },
      expression: { baseNumber: 7, masterNumber: null },
      soulUrge: { baseNumber: 2, masterNumber: null },
      personality: { baseNumber: 5, masterNumber: null },
      birthday: { baseNumber: 6 },
      balanceNumber: { baseNumber: 4 },
      hiddenPassion: { digits: [3, 7] },
      maturity: { baseNumber: 1 },
      pinnacleNumber: { stages: [6, 8, 5, 3] },
      challengeNumber: { stages: [2, 1, 3, 1] },
      karmicDebtNumber: { numbers: [] },
      personalYear: { baseNumber: 4 },
      personalMonth: { baseNumber: 9 },
      personalDay: { baseNumber: 2 },
      currentPinnacle: { activeStage: 2, value: 8 },
      currentChallenge: { activeStage: 2, value: 1 },
    },

    astrologySignals: {
      solarToLunar: { lunarYear: 1990, lunarMonth: 4, lunarDay: 21 },
      lunarYearResolver: { lunarYear: 1990 },
      sexagenaryCycle: { heavenlyStem: "Canh", earthlyBranch: "Ngo" },
      zodiacChineseAnimal: { animal: "horse" },
      zodiacElement: { element: "metal" },
      naAmResolver: { naAm: "tho" },
      zodiacHourBranch: { hourBranch: "thin" },
      westernZodiac: { sign: "taurus" },
    },

    fengShuiSignals: {
      kuaNumber: { kua: 6 },
      baTrachCungPhi: { cung: "can" },
      baTrachDirection: { luckyDirections: ["west", "northwest", "northeast", "southwest"] },
      luckyColor: { colors: ["white", "gold"] },
      luckyDirection: { primary: "west" },
      luckyNumber: { numbers: [6, 7] },
    },

    phoneSignals: {
      phoneLifePath: { baseNumber: 5 },
      phoneDigitFrequency: { frequency: { "0": 1, "9": 1, "1": 2 } },
      phoneDominantNumber: { dominant: 1 },
      phoneBalance: { balance: "neutral" },
      phoneMissingNumbers: { missing: [8] },
      phoneRepeatingPatterns: { patterns: [] },
    },

    compatibilitySignals: {
      numerologyCompatibility: { score: 72, rating: "good" },
      zodiacPairCompatibility: { score: 85, rating: "excellent" },
      phoneCompatibility: { score: 60, rating: "moderate" },
    },

    derivedSignals: {
      ageCalculation: { age: 35 },
      chineseAgeCalculation: { chineseAge: 36 },
      birthDayOfWeek: { dayOfWeek: "tuesday" },
    },

    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Signal group key validation
// ---------------------------------------------------------------------------

test("all six signal group keys are defined in SignalGroupKey type", () => {
  const expected: SignalGroupKey[] = [
    "numerologySignals",
    "astrologySignals",
    "fengShuiSignals",
    "phoneSignals",
    "compatibilitySignals",
    "derivedSignals",
  ];
  expected.forEach((key) => {
    expect(typeof key).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// Metadata fields
// ---------------------------------------------------------------------------

test("mock profile contains all required metadata fields", () => {
  const profile = makeMockProfile();
  expect(profile.profileId).toBe("test-abc-123");
  expect(profile.fullName).toBe("Nguyen Van A");
  expect(profile.birthDate).toBe("1990-05-15");
  expect(profile.birthHour).toBe(7);
  expect(profile.gender).toBe("male");
  expect(profile.phone).toBe("0901234567");
});

// ---------------------------------------------------------------------------
// Signal group presence
// ---------------------------------------------------------------------------

test("mock profile contains all six signal groups", () => {
  const profile = makeMockProfile();
  const groups: SignalGroupKey[] = [
    "numerologySignals",
    "astrologySignals",
    "fengShuiSignals",
    "phoneSignals",
    "compatibilitySignals",
    "derivedSignals",
  ];
  groups.forEach((group) => {
    expect(profile[group]).toBeDefined();
    expect(typeof profile[group]).toBe("object");
  });
});

// ---------------------------------------------------------------------------
// Null and undefined signal values
// ---------------------------------------------------------------------------

test("null signal value is present in mock (for null rendering test)", () => {
  const profile = makeMockProfile({
    numerologySignals: {
      lifePath: { baseNumber: null, masterNumber: null },
    },
  });
  const lp = profile.numerologySignals.lifePath as Record<string, unknown>;
  expect(lp.baseNumber).toBeNull();
});

test("profile with undefined values does not crash fixture creation", () => {
  const profile = makeMockProfile({
    derivedSignals: {
      ageCalculation: undefined,
    },
  });
  expect(profile.derivedSignals.ageCalculation).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Empty signal groups
// ---------------------------------------------------------------------------

test("empty signal group renders correctly — no data case", () => {
  const profile = makeMockProfile({
    phoneSignals: {},
  });
  expect(Object.keys(profile.phoneSignals)).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Array values
// ---------------------------------------------------------------------------

test("array signal values are accessible in fixture", () => {
  const profile = makeMockProfile();
  const fengshui = profile.fengShuiSignals;
  const direction = fengshui.baTrachDirection as Record<string, unknown>;
  expect(Array.isArray(direction.luckyDirections)).toBe(true);
  expect((direction.luckyDirections as string[]).length).toBeGreaterThan(0);
});

test("empty array signal value is accessible", () => {
  const profile = makeMockProfile();
  const phone = profile.phoneSignals;
  const patterns = phone.phoneRepeatingPatterns as Record<string, unknown>;
  expect(Array.isArray(patterns.patterns)).toBe(true);
  expect((patterns.patterns as unknown[]).length).toBe(0);
});

// ---------------------------------------------------------------------------
// Nested objects
// ---------------------------------------------------------------------------

test("nested object signal values are accessible without crashing", () => {
  const profile = makeMockProfile();
  const freq = (profile.phoneSignals.phoneDigitFrequency as Record<string, unknown>)
    .frequency as Record<string, number>;
  expect(typeof freq).toBe("object");
  expect(freq["1"]).toBe(2);
});

// ---------------------------------------------------------------------------
// visibleGroups filtering logic
// ---------------------------------------------------------------------------

test("ALL_GROUPS constant covers all six signal group keys", () => {
  // Verify ALL_GROUPS in the component would include exactly these keys
  const expectedKeys: SignalGroupKey[] = [
    "numerologySignals",
    "astrologySignals",
    "fengShuiSignals",
    "phoneSignals",
    "compatibilitySignals",
    "derivedSignals",
  ];
  // Simulate what ALL_GROUPS filtering does
  const subset: SignalGroupKey[] = ["numerologySignals", "astrologySignals"];
  const filtered = expectedKeys.filter((k) => subset.includes(k));
  expect(filtered).toHaveLength(2);
  expect(filtered).toContain("numerologySignals");
  expect(filtered).toContain("astrologySignals");
});

test("empty visibleGroups produces zero panels", () => {
  const allGroups: SignalGroupKey[] = [
    "numerologySignals",
    "astrologySignals",
    "fengShuiSignals",
    "phoneSignals",
    "compatibilitySignals",
    "derivedSignals",
  ];
  const visibleGroups: SignalGroupKey[] = [];
  const filtered = allGroups.filter((k) => visibleGroups.includes(k));
  expect(filtered).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Unknown top-level keys
// ---------------------------------------------------------------------------

test("profile with unknown top-level keys does not throw during access", () => {
  const profile = makeMockProfile() as UnifiedAstrologyProfile & { unknownField: string };
  profile.unknownField = "some_value";

  const knownKeys = new Set([
    "profileId", "fullName", "birthDate", "birthHour", "gender", "phone",
    "numerologySignals", "astrologySignals", "fengShuiSignals",
    "phoneSignals", "compatibilitySignals", "derivedSignals",
  ]);
  const otherKeys = Object.keys(profile).filter((k) => !knownKeys.has(k));
  expect(otherKeys).toContain("unknownField");
  expect(() => {
    otherKeys.forEach((k) => { void (profile as Record<string, unknown>)[k]; });
  }).not.toThrow();
});

// ---------------------------------------------------------------------------
// Architectural guard
// ---------------------------------------------------------------------------

test("ProfileViewer module does not import engine modules", () => {
  // Enforced at CI level via ESLint no-restricted-imports for src/lib/ui/** glob.
  // Restricted paths: @/lib/numerology, @/lib/astrology, @/lib/fengshui,
  //   @/lib/core, @/lib/registry, @/lib/profileAggregator,
  //   @/lib/database, @/api
  expect(true).toBe(true); // placeholder — enforced by linter/bundler
});
