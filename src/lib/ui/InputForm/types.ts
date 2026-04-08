// src/lib/ui/InputForm/types.ts

export type BirthHour =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
  | 18 | 19 | 20 | 21 | 22 | 23
  | null;

export type Gender =
  | "male"
  | "female"
  | "other"
  | "unspecified";

export type InputFormValues = {
  fullName: string;
  birthDate: string;      // ISO format: YYYY-MM-DD
  birthHour: BirthHour;  // null if not provided
  gender: Gender;         // defaults to "unspecified"
  phoneNumber: string;    // raw string; empty string if not provided
};

export type InputFormProps = {
  onSubmit: (values: InputFormValues) => void;
  isLoading?: boolean;
  error?: string | null;
};

export type ValidationErrors = Partial<Record<keyof InputFormValues, string>>;
