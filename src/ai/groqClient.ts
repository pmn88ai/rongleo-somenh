// src/ai/groqClient.ts
//
// Gọi Groq API qua Next.js API route /api/ai/interpret.
// GROQ_API_KEY chỉ tồn tại phía server — không bao giờ ra client.
//
// (3) Session cache: lưu kết quả theo cacheKey trong memory.
// Cache mất khi reload page — đủ để không gọi lại API khi switch tab.
// Không cần DB, không cần localStorage.

export type GroqResult =
  | { ok: true;  text: string; fromCache: boolean }
  | { ok: false; error: string }

// ─── in-memory cache ───────────────────────────────────────────────────────
// key = cacheKey (thường là profileKey từ caller)
// value = narrative text
const narrativeCache = new Map<string, string>()

// ─────────────────────────────────────────────────────────────────────────────

export async function callGroq(
  prompt:      string,
  cacheKey?:   string,    // nếu có → check cache trước khi gọi API
  isRewrite?:  boolean,   // true → bỏ qua cache, gọi API với temperature cao hơn
): Promise<GroqResult> {

  // (3) Cache hit — chỉ khi không phải rewrite
  if (cacheKey && !isRewrite) {
    const cached = narrativeCache.get(cacheKey)
    if (cached) return { ok: true, text: cached, fromCache: true }
  }

  try {
    const res = await fetch("/api/ai/interpret", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        prompt,
        // (2) rewrite → temperature cao hơn để tránh lặp 80%
        temperature: isRewrite ? 0.92 : 0.72,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, error: body.error ?? `HTTP ${res.status}` }
    }

    const data = await res.json()
    const text = data.text ?? ""
    if (!text) return { ok: false, error: "Groq trả về nội dung trống." }

    // (3) Lưu vào cache
    if (cacheKey) narrativeCache.set(cacheKey, text)

    return { ok: true, text, fromCache: false }

  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" }
  }
}

// Xoá cache cho 1 profile cụ thể (khi user muốn reset hoàn toàn)
export function clearNarrativeCache(cacheKey: string): void {
  narrativeCache.delete(cacheKey)
}
