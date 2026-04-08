// src/lib/ui/InputForm/index.tsx
//
// ARCHITECTURE RULES:
// - This component does NOT call createProfileAPI internally.
// - The parent page owns the API call.
// - This component fires onSubmit(values) with validated input only.
// - No engine, aggregator, persistence, or API imports.
// - Validation logic lives in ./validation — not exported from this file.

import React, { useState } from "react";
import type {
  InputFormProps,
  InputFormValues,
  BirthHour,
  Gender,
  ValidationErrors,
} from "./types";
import { validateAll } from "./validation";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BIRTH_HOURS = Array.from({ length: 24 }, (_, i) => i) as number[];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "unspecified", label: "Not specified" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const INITIAL_VALUES: InputFormValues = {
  fullName: "",
  birthDate: "",
  birthHour: null,
  gender: "unspecified",
  phoneNumber: "",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface FieldRowProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FieldRow({ label, required, error, children }: FieldRowProps) {
  return (
    <div style={styles.fieldRow}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>
      {children}
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function InputForm({ onSubmit, isLoading = false, error = null }: InputFormProps) {
  const [values, setValues] = useState<InputFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<keyof InputFormValues, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validateAll(values);

  const visibleErrors: ValidationErrors = {};
  (Object.keys(errors) as (keyof InputFormValues)[]).forEach((field) => {
    if (touched[field] || submitAttempted) {
      visibleErrors[field] = errors[field];
    }
  });

  function handleChange(field: keyof InputFormValues, value: string) {
    setValues((prev) => {
      if (field === "birthHour") {
        const parsed = value === "" ? null : (parseInt(value, 10) as BirthHour);
        return { ...prev, birthHour: parsed };
      }
      return { ...prev, [field]: value };
    });
  }

  function handleBlur(field: keyof InputFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);

    const allErrors = validateAll(values);
    if (Object.keys(allErrors).length > 0) return;

    onSubmit(values);
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate style={styles.form}>
      <h2 style={styles.heading}>Profile Input</h2>
      <p style={styles.subheading}>Debug UI — Symbol Engine Platform</p>

      <FieldRow label="Full Name" required error={visibleErrors.fullName}>
        <input
          type="text"
          value={values.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          placeholder="Enter full name"
          style={styles.input}
          disabled={isLoading}
          aria-required="true"
        />
      </FieldRow>

      <FieldRow label="Birth Date" required error={visibleErrors.birthDate}>
        <input
          type="date"
          value={values.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          onBlur={() => handleBlur("birthDate")}
          style={styles.input}
          disabled={isLoading}
          aria-required="true"
        />
      </FieldRow>

      <FieldRow label="Birth Hour" error={visibleErrors.birthHour}>
        <select
          value={values.birthHour === null ? "" : String(values.birthHour)}
          onChange={(e) => handleChange("birthHour", e.target.value)}
          onBlur={() => handleBlur("birthHour")}
          style={styles.input}
          disabled={isLoading}
        >
          <option value="">Not provided</option>
          {BIRTH_HOURS.map((h) => (
            <option key={h} value={String(h)}>
              {String(h).padStart(2, "0")}:00
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow label="Gender" error={visibleErrors.gender}>
        <select
          value={values.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          onBlur={() => handleBlur("gender")}
          style={styles.input}
          disabled={isLoading}
        >
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow label="Phone Number" error={visibleErrors.phoneNumber}>
        <input
          type="text"
          value={values.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          onBlur={() => handleBlur("phoneNumber")}
          placeholder="Digits only (optional)"
          style={styles.input}
          disabled={isLoading}
          inputMode="numeric"
        />
      </FieldRow>

      {error && (
        <div style={styles.apiError} role="alert">
          <strong>API Error:</strong> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (submitAttempted && hasErrors)}
        style={{
          ...styles.button,
          ...(isLoading ? styles.buttonDisabled : {}),
        }}
      >
        {isLoading ? "Generating profile…" : "Generate Profile"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Inline styles — minimal debug aesthetic
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  form: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: 13,
    maxWidth: 520,
    padding: "32px 36px",
    background: "#0f0f11",
    border: "1px solid #2a2a2e",
    borderRadius: 6,
    color: "#d4d4d8",
  },
  heading: {
    margin: "0 0 4px 0",
    fontSize: 16,
    fontWeight: 600,
    color: "#f4f4f5",
    letterSpacing: "0.04em",
  },
  subheading: {
    margin: "0 0 28px 0",
    fontSize: 11,
    color: "#52525b",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  fieldRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "#a1a1aa",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  required: {
    color: "#f87171",
  },
  input: {
    background: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: 4,
    color: "#f4f4f5",
    fontFamily: "inherit",
    fontSize: 13,
    padding: "8px 10px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  fieldError: {
    fontSize: 11,
    color: "#f87171",
    marginTop: 2,
  },
  apiError: {
    background: "#1c0a0a",
    border: "1px solid #7f1d1d",
    borderRadius: 4,
    color: "#fca5a5",
    fontSize: 12,
    padding: "10px 12px",
    marginBottom: 16,
  },
  button: {
    background: "#3b82f6",
    border: "none",
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    marginTop: 4,
    padding: "10px 20px",
    width: "100%",
  },
  buttonDisabled: {
    background: "#1e3a5f",
    color: "#60a5fa",
    cursor: "not-allowed",
  },
};
