"use client"

import { useState } from "react"
import type { UnifiedAstrologyProfile } from "@/lib/profileAggregator/types"
import type { InputFormValues } from "@/lib/ui/InputForm/types"
import type { ObservatoryProfile } from "@/lib/ui/adapter/types"
import { buildUnifiedAstrologyProfile } from "@/lib/profileAggregator/engine"
import { adaptProfile } from "@/lib/ui/adapter"

import { ProfileDashboard } from "./ProfileDashboard"

// ─── types ────────────────────────────────────────────────────────────────────

type AppState =
  | { phase: "input" }
  | { phase: "loading" }
  | { phase: "result"; profile: ObservatoryProfile; raw: UnifiedAstrologyProfile}
  | { phase: "error"; message: string }

// ─── helpers ──────────────────────────────────────────────────────────────────

function mapGender(g: InputFormValues["gender"]): "male" | "female" | "other" {
  if (g === "male" || g === "female") return g
  return "other"
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Page() {
  const [state, setState] = useState<AppState>({ phase: "input" })
  const [form, setForm]   = useState<InputFormValues>({
    fullName:    "",
    birthDate:   "",
    birthHour:   null,
    gender:      "unspecified",
    phoneNumber: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof InputFormValues, string>>>({})

  // ── validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.fullName.trim())  e.fullName  = "Vui lòng nhập họ tên"
    if (!form.birthDate.trim()) e.birthDate = "Vui lòng nhập ngày sinh"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── submit ──────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!validate()) return
    setState({ phase: "loading" })

    setTimeout(() => {
      try {
        const gender    = mapGender(form.gender)
        const dateParts = form.birthDate.split("-").map(Number)

        // Numerology + Astrology engine (existing)
        const raw = buildUnifiedAstrologyProfile({
          fullName:    form.fullName.trim(),
          birthdate:   form.birthDate,
          gender,
          birthTime:   form.birthHour !== null ? `${String(form.birthHour).padStart(2,"0")}:00` : undefined,
          phoneNumber: form.phoneNumber.trim() || undefined,
        })

        const adapted = adaptProfile({ formValues: form, profile: raw })

        // Bát Tự engine — optional, lỗi không crash toàn app

        setState({ phase: "result", profile: adapted, raw})
      } catch (err) {
        setState({ phase: "error", message: err instanceof Error ? err.message : "Lỗi không xác định" })
      }
    }, 0)
  }

  function handleReset() {
    setState({ phase: "input" })
  }

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-[#e8e4dc] font-[system-ui]">

      {/* header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 opacity-90" />
          <span className="text-sm tracking-widest uppercase text-white/40 font-light">Mệnh Lý</span>
        </div>
        {state.phase === "result" && (
          <button
            onClick={handleReset}
            className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
          >
            ← Nhập mới
          </button>
        )}
      </header>

      {/* phases */}
      {state.phase === "input"   && <InputPhase form={form} setForm={setForm} errors={errors} onSubmit={handleSubmit} />}
      {state.phase === "loading" && <LoadingPhase />}
      {state.phase === "result"  && <ProfileDashboard profile={state.profile} raw={state.raw}/>}
      {state.phase === "error"   && <ErrorPhase message={state.message} onReset={handleReset} />}

    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT PHASE
// ─────────────────────────────────────────────────────────────────────────────

function InputPhase({
  form, setForm, errors, onSubmit,
}: {
  form:     InputFormValues
  setForm:  (v: InputFormValues) => void
  errors:   Partial<Record<keyof InputFormValues, string>>
  onSubmit: () => void
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  function set<K extends keyof InputFormValues>(k: K, v: InputFormValues[K]) {
    setForm({ ...form, [k]: v })
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">

      {/* title */}
      <div className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-white/90 mb-2">
          Hồ sơ mệnh lý
        </h1>
        <p className="text-sm text-white/30 leading-relaxed">
          Nhập thông tin để phân tích Thần Số học, Chiêm Tinh và Phong Thủy
        </p>
      </div>

      {/* form */}
      <div className="space-y-5">

        {/* họ tên */}
        <Field label="Họ và tên" error={errors.fullName} required>
          <input
            type="text"
            value={form.fullName}
            onChange={e => set("fullName", e.target.value)}
            placeholder="Nguyễn Văn A"
            className={inputCls(!!errors.fullName)}
          />
        </Field>

        {/* ngày sinh */}
        <Field label="Ngày sinh" error={errors.birthDate} required>
          <input
            type="date"
            value={form.birthDate}
            onChange={e => set("birthDate", e.target.value)}
            className={inputCls(!!errors.birthDate)}
          />
        </Field>

        {/* giờ sinh + giới tính — row */}
        <div className="grid grid-cols-2 gap-4">

          <Field label="Giờ sinh" hint="tuỳ chọn">
            <select
              value={form.birthHour ?? ""}
              onChange={e => set("birthHour", e.target.value === "" ? null : Number(e.target.value) as InputFormValues["birthHour"])}
              className={inputCls(false)}
            >
              <option value="">-- không rõ --</option>
              {hours.map(h => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00 — {hourLabel(h)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Giới tính">
            <select
              value={form.gender}
              onChange={e => set("gender", e.target.value as InputFormValues["gender"])}
              className={inputCls(false)}
            >
              <option value="unspecified">-- không xác định --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </Field>

        </div>

        {/* số điện thoại */}
        <Field label="Số điện thoại" hint="tuỳ chọn — để phân tích Phone Numerology">
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={e => set("phoneNumber", e.target.value)}
            placeholder="0901234567"
            className={inputCls(false)}
          />
        </Field>

        {/* submit */}
        <button
          onClick={onSubmit}
          className="
            w-full mt-4 py-3.5 rounded-xl
            bg-gradient-to-r from-amber-500/90 to-orange-500/90
            hover:from-amber-400 hover:to-orange-400
            text-white font-medium tracking-wide text-sm
            transition-all duration-200
            shadow-lg shadow-orange-900/20
          "
        >
          Phân tích
        </button>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING
// ─────────────────────────────────────────────────────────────────────────────

function LoadingPhase() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
      <p className="text-sm text-white/30 tracking-wider">Đang tính toán…</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR
// ─────────────────────────────────────────────────────────────────────────────

function ErrorPhase({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <p className="text-red-400/80 text-sm mb-2">Có lỗi xảy ra</p>
      <p className="text-white/30 text-xs mb-8 font-mono">{message}</p>
      <button onClick={onReset} className="text-sm text-amber-400/70 hover:text-amber-400 transition-colors">
        ← Thử lại
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  label, hint, error, required, children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/40 tracking-wider uppercase flex items-center gap-2">
        {label}
        {required && <span className="text-amber-500/60">*</span>}
        {hint && <span className="text-white/20 normal-case tracking-normal">({hint})</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-400/70">{error}</span>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl text-sm",
    "bg-white/5 border text-white/80",
    "placeholder:text-white/20",
    "focus:outline-none focus:ring-1 focus:ring-amber-400/40",
    "transition-colors",
    "[color-scheme:dark]",
    hasError ? "border-red-400/40" : "border-white/10 hover:border-white/20",
  ].join(" ")
}

function hourLabel(h: number): string {
  const labels: Record<number, string> = {
    23: "Tý", 1: "Tý", 2: "Sửu", 3: "Sửu", 4: "Dần", 5: "Dần",
    6: "Mão", 7: "Mão", 8: "Thìn", 9: "Thìn", 10: "Tỵ", 11: "Tỵ",
    12: "Ngọ", 13: "Ngọ", 14: "Mùi", 15: "Mùi", 16: "Thân", 17: "Thân",
    18: "Dậu", 19: "Dậu", 20: "Tuất", 21: "Tuất", 22: "Hợi", 0: "Hợi",
  }
  return labels[h] ?? ""
}
