// src/insights/extractor.ts
//
// API: extractInsights(input: ExtractInput) → Insight[]
//
// Dùng object input để không vỡ khi thêm system mới (Tử Vi, Human Design...).
// Mỗi system có sub-extractor riêng — extractor.ts chỉ orchestrate.

import type { UnifiedAstrologyProfile } from "@/lib/profileAggregator/types"
import type { BaziData }               from "@/engines/bazi/types"
import type { Insight }                from "./types"

import {
  LIFE_PATH_INSIGHTS,
  EXPRESSION_INSIGHTS,
  PERSONAL_YEAR_INSIGHTS,
  KARMIC_DEBT_INSIGHTS,
} from "./data/numerology.rules"

import {
  ELEMENT_INSIGHTS,
  ANIMAL_INSIGHTS,
  WESTERN_ZODIAC_INSIGHTS,
  CUNG_PHI_INSIGHTS,
} from "./data/astrology.rules"

import { extractBaziInsights } from "./baziExtractor"

// ─────────────────────────────────────────────────────────────────────────────
// INPUT TYPE — extensible: thêm system mới chỉ cần thêm field optional
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractInput = {
  raw:   UnifiedAstrologyProfile   // numerology + astrology (always present)
  bazi?: BaziData                  // bát tự (optional, cần lunar-javascript)
  // tuvi?: TuViData               // tử vi (future)
  // humanDesign?: HumanDesignData // human design (future)
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-EXTRACTORS
// ─────────────────────────────────────────────────────────────────────────────

function extractNumerology(raw: UnifiedAstrologyProfile): Insight[] {
  const out: Insight[] = []

  const lpKey = raw.numerology.lifePath.masterNumber ?? raw.numerology.lifePath.baseNumber
  const lpRules = LIFE_PATH_INSIGHTS[lpKey]
  if (lpRules) out.push(...lpRules)

  const expInsight = EXPRESSION_INSIGHTS[raw.numerology.expression.baseNumber]
  if (expInsight) out.push(expInsight)

  const pyInsight = PERSONAL_YEAR_INSIGHTS[raw.numerology.personalYear.baseNumber]
  if (pyInsight) out.push(pyInsight)

  if (raw.numerology.karmicDebtNumber.hasDebt) {
    for (const debt of raw.numerology.karmicDebtNumber.debts) {
      const di = KARMIC_DEBT_INSIGHTS[debt.debtNumber]
      if (di) out.push(di)
    }
  }

  return out
}

function extractAstrology(raw: UnifiedAstrologyProfile): Insight[] {
  const out: Insight[] = []

  const elementRules = ELEMENT_INSIGHTS[raw.astrology.element]
  if (elementRules) out.push(...elementRules)

  const animalInsight = ANIMAL_INSIGHTS[raw.astrology.animal]
  if (animalInsight) out.push(animalInsight)

  const zodiacInsight = WESTERN_ZODIAC_INSIGHTS[raw.westernAstrology.zodiacSign]
  if (zodiacInsight) out.push(zodiacInsight)

  if (raw.fengShui) {
    const cungInsight = CUNG_PHI_INSIGHTS[raw.fengShui.cungPhi]
    if (cungInsight) out.push(cungInsight)
  }

  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export function extractInsights(input: ExtractInput): Insight[] {
  const { raw, bazi } = input

  return [
    ...extractNumerology(raw),
    ...extractAstrology(raw),
    ...(bazi ? extractBaziInsights(bazi) : []),
    // ...(input.tuvi ? extractTuViInsights(input.tuvi) : []),  // future
  ]
}
