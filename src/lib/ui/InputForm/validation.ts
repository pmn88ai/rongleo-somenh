// src/lib/ui/InputForm/validation.ts
//
// Pure validation logic for InputForm.
// No React imports. No API calls. No engine imports.
// Both functions are exported for direct use in index.tsx and test.ts.

import type { InputFormValues, ValidationErrors } from "./types";

export function validateField(
  field: keyof InputFormValues,
  value: InputFormValues[keyof InputFormValues]
): string | undefined {
  switch (field) {
    case "fullName": {
      const v = (value as string).trim();
      if (!v) return "Name is required.";
      if (/^\d+$/.test(v)) return "Name cannot be digits only.";
      return undefined;
    }
    case "birthDate": {
      const v = value as string;
      if (!v) return "Birth date is required.";
      const parsed = new Date(v);
      if (isNaN(parsed.getTime())) return "Invalid date.";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsed >= today) return "Birth date must be in the past.";
      return undefined;
    }
    case "phoneNumber": {
      const v = (value as string).trim();
      if (!v) return undefined; // optional field
      if (!/^\d+$/.test(v)) return "Phone must contain digits only.";
      if (v.length < 8) return "Phone number too short (min 8 digits).";
      if (v.length > 15) return "Phone number too long (max 15 digits).";
      return undefined;
    }
    default:
      return undefined;
  }
}

export function validateAll(values: InputFormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  (Object.keys(values) as (keyof InputFormValues)[]).forEach((field) => {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}
