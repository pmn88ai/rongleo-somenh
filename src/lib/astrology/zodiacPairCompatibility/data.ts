// ─────────────────────────────────────────────────────────────────
//  Zodiac Pair Compatibility Table
//
//  ZODIAC_ORDER: fixed array of 12 Vietnamese animal names in
//  traditional Earthly Branch sequence (Tý=0 → Hợi=11).
//  Used to build canonical index-based pair keys.
//
//  ZODIAC_PAIR_TABLE: keyed by "${minIdx}_${maxIdx}".
//  Only named relationships are stored.
//  Unlisted pairs default to "Trung lập" in the engine.
//
//  Relationship types:
//    Tam Hợp   — Triple harmony (strongest affinity)
//    Lục Hợp   — Six harmonies (friendly affinity)
//    Tứ Hành Xung — Four-direction clash (conflict)
// ─────────────────────────────────────────────────────────────────

import type { ZodiacRelationship } from "@/lib/astrology/zodiacPairCompatibility/types"

// Index 0–11 maps to Earthly Branches Tý → Hợi
export const ZODIAC_ORDER: string[] = [
  "Chuột", // 0  Tý
  "Trâu",  // 1  Sửu
  "Hổ",    // 2  Dần
  "Mèo",   // 3  Mão
  "Rồng",  // 4  Thìn
  "Rắn",   // 5  Tỵ
  "Ngựa",  // 6  Ngọ
  "Dê",    // 7  Mùi
  "Khỉ",   // 8  Thân
  "Gà",    // 9  Dậu
  "Chó",   // 10 Tuất
  "Lợn",   // 11 Hợi
]

export type ZodiacPairEntry = {
  relationship: ZodiacRelationship
}

// Canonical key format: "${minIdx}_${maxIdx}"
export const ZODIAC_PAIR_TABLE: Record<string, ZodiacPairEntry> = {

  // ── Tam Hợp (Triple Harmony triads) ───────────────────────────
  // Triad 1: Chuột(0) – Rồng(4) – Khỉ(8)
  "0_4":  { relationship: "Tam Hợp" },
  "0_8":  { relationship: "Tam Hợp" },
  "4_8":  { relationship: "Tam Hợp" },

  // Triad 2: Trâu(1) – Rắn(5) – Gà(9)
  "1_5":  { relationship: "Tam Hợp" },
  "1_9":  { relationship: "Tam Hợp" },
  "5_9":  { relationship: "Tam Hợp" },

  // Triad 3: Hổ(2) – Ngựa(6) – Chó(10)
  "2_6":  { relationship: "Tam Hợp" },
  "2_10": { relationship: "Tam Hợp" },
  "6_10": { relationship: "Tam Hợp" },

  // Triad 4: Mèo(3) – Dê(7) – Lợn(11)
  "3_7":  { relationship: "Tam Hợp" },
  "3_11": { relationship: "Tam Hợp" },
  "7_11": { relationship: "Tam Hợp" },

  // ── Lục Hợp (Six Harmonies pairs) ─────────────────────────────
  "0_1":  { relationship: "Lục Hợp" }, // Chuột – Trâu
  "2_11": { relationship: "Lục Hợp" }, // Hổ   – Lợn
  "3_10": { relationship: "Lục Hợp" }, // Mèo  – Chó
  "4_9":  { relationship: "Lục Hợp" }, // Rồng – Gà
  "5_8":  { relationship: "Lục Hợp" }, // Rắn  – Khỉ
  "6_7":  { relationship: "Lục Hợp" }, // Ngựa – Dê

  // ── Tứ Hành Xung (Four-Direction Clash groups) ─────────────────
  // Clash group 1: Chuột(0) – Ngựa(6) – Mèo(3) – Gà(9)
  "0_6":  { relationship: "Tứ Hành Xung" },
  "0_3":  { relationship: "Tứ Hành Xung" },
  "0_9":  { relationship: "Tứ Hành Xung" },
  "3_6":  { relationship: "Tứ Hành Xung" },
  "3_9":  { relationship: "Tứ Hành Xung" },
  "6_9":  { relationship: "Tứ Hành Xung" },

  // Clash group 2: Trâu(1) – Dê(7) – Hổ(2) – Khỉ(8)
  "1_7":  { relationship: "Tứ Hành Xung" },
  "1_2":  { relationship: "Tứ Hành Xung" },
  "1_8":  { relationship: "Tứ Hành Xung" },
  "2_7":  { relationship: "Tứ Hành Xung" },
  "2_8":  { relationship: "Tứ Hành Xung" },
  "7_8":  { relationship: "Tứ Hành Xung" },

  // Clash group 3: Rồng(4) – Chó(10) – Rắn(5) – Lợn(11)
  "4_10": { relationship: "Tứ Hành Xung" },
  "4_5":  { relationship: "Tứ Hành Xung" },
  "4_11": { relationship: "Tứ Hành Xung" },
  "5_10": { relationship: "Tứ Hành Xung" },
  "5_11": { relationship: "Tứ Hành Xung" },
  "10_11":{ relationship: "Tứ Hành Xung" },
}
