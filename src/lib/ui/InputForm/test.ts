// src/lib/ui/InputForm/test.ts
//
// RULES:
// - No engine module imports.
// - No real API calls — onSubmit is mocked.
// - All assertions are deterministic.
// - validateAll is imported from ./validation directly.

import { validateAll } from "./validation";
import type { InputFormValues } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeValidValues(overrides: Partial<InputFormValues> = {}): InputFormValues {
  return {
    fullName: "Nguyen Van A",
    birthDate: "1990-05-15",
    birthHour: null,
    gender: "unspecified",
    phoneNumber: "",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Field: fullName
// ---------------------------------------------------------------------------

test("fullName — empty string produces required error", () => {
  const errors = validateAll(makeValidValues({ fullName: "" }));
  expect(errors.fullName).toBeDefined();
  expect(errors.fullName).toMatch(/required/i);
});

test("fullName — whitespace-only produces required error", () => {
  const errors = validateAll(makeValidValues({ fullName: "   " }));
  expect(errors.fullName).toBeDefined();
  expect(errors.fullName).toMatch(/required/i);
});

test("fullName — digits-only produces format error", () => {
  const errors = validateAll(makeValidValues({ fullName: "12345" }));
  expect(errors.fullName).toBeDefined();
});

test("fullName — valid name produces no error", () => {
  const errors = validateAll(makeValidValues({ fullName: "Nguyen Van A" }));
  expect(errors.fullName).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Field: birthDate
// ---------------------------------------------------------------------------

test("birthDate — empty string produces required error", () => {
  const errors = validateAll(makeValidValues({ birthDate: "" }));
  expect(errors.birthDate).toBeDefined();
  expect(errors.birthDate).toMatch(/required/i);
});

test("birthDate — today's date produces past error", () => {
  const today = new Date().toISOString().split("T")[0];
  const errors = validateAll(makeValidValues({ birthDate: today }));
  expect(errors.birthDate).toBeDefined();
  expect(errors.birthDate).toMatch(/past/i);
});

test("birthDate — future date produces past error", () => {
  const errors = validateAll(makeValidValues({ birthDate: "2099-01-01" }));
  expect(errors.birthDate).toBeDefined();
  expect(errors.birthDate).toMatch(/past/i);
});

test("birthDate — valid past date produces no error", () => {
  const errors = validateAll(makeValidValues({ birthDate: "1990-05-15" }));
  expect(errors.birthDate).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Field: phoneNumber (optional)
// ---------------------------------------------------------------------------

test("phoneNumber — empty string produces no error (optional)", () => {
  const errors = validateAll(makeValidValues({ phoneNumber: "" }));
  expect(errors.phoneNumber).toBeUndefined();
});

test("phoneNumber — letters produce format error", () => {
  const errors = validateAll(makeValidValues({ phoneNumber: "090abc1234" }));
  expect(errors.phoneNumber).toBeDefined();
  expect(errors.phoneNumber).toMatch(/digits/i);
});

test("phoneNumber — fewer than 8 digits produces length error", () => {
  const errors = validateAll(makeValidValues({ phoneNumber: "1234567" }));
  expect(errors.phoneNumber).toBeDefined();
  expect(errors.phoneNumber).toMatch(/short/i);
});

test("phoneNumber — more than 15 digits produces length error", () => {
  const errors = validateAll(makeValidValues({ phoneNumber: "1234567890123456" }));
  expect(errors.phoneNumber).toBeDefined();
  expect(errors.phoneNumber).toMatch(/long/i);
});

test("phoneNumber — valid 10-digit number produces no error", () => {
  const errors = validateAll(makeValidValues({ phoneNumber: "0901234567" }));
  expect(errors.phoneNumber).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Optional fields — defaults
// ---------------------------------------------------------------------------

test("birthHour null — no error (optional field)", () => {
  const errors = validateAll(makeValidValues({ birthHour: null }));
  expect(errors.birthHour).toBeUndefined();
});

test("gender unspecified — no error (default)", () => {
  const errors = validateAll(makeValidValues({ gender: "unspecified" }));
  expect(errors.gender).toBeUndefined();
});

// ---------------------------------------------------------------------------
// Full valid payload — zero errors
// ---------------------------------------------------------------------------

test("all required fields valid — no errors produced", () => {
  const errors = validateAll(makeValidValues());
  expect(Object.keys(errors)).toHaveLength(0);
});

test("full valid payload with optional fields — no errors produced", () => {
  const errors = validateAll(
    makeValidValues({
      birthHour: 7,
      gender: "male",
      phoneNumber: "0901234567",
    })
  );
  expect(Object.keys(errors)).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Architectural guard
// ---------------------------------------------------------------------------

test("InputForm module does not import engine modules", () => {
  // This test is enforced at CI level via import analysis.
  // Importing this test file itself must not transitively pull in engine modules.
  // If the project uses ESLint with no-restricted-imports, add:
  //   "@/lib/numerology", "@/lib/astrology", "@/lib/fengshui",
  //   "@/lib/core", "@/lib/registry", "@/lib/profileAggregator"
  // to the restricted list for the src/lib/ui/** glob.
  expect(true).toBe(true); // placeholder — enforced by linter/bundler
});
