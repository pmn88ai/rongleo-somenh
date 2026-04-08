// src/app/api/ai/interpret/route.ts
//
// API route proxy → Groq.
// GROQ_API_KEY chỉ tồn tại phía server, không bao giờ ra client.
//
// .env.local cần có:
//   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx

import { NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL   = "llama-3.3-70b-versatile"

export async function POST(req: Request) {
  // ── Validate input ──────────────────────────────────────────────
  let prompt: string
  let temperature: number
  try {
    const body = await req.json()
    prompt = body.prompt
    temperature = typeof body.temperature === "number"
      ? Math.min(Math.max(body.temperature, 0.1), 1.0)  // clamp 0.1–1.0
      : 0.72
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // ── API key ─────────────────────────────────────────────────────
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY chưa được cấu hình trong .env.local" },
      { status: 500 }
    )
  }

  // ── Call Groq ───────────────────────────────────────────────────
  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        temperature,
        max_tokens:  900,
        messages: [
          {
            role:    "system",
            content: "Bạn là chuyên gia mệnh lý học. Viết tiếng Việt tự nhiên, sâu sắc, không sáo rỗng.",
          },
          {
            role:    "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}))
      console.error("[Groq API error]", err)
      return NextResponse.json(
        { error: err?.error?.message ?? `Groq API ${groqRes.status}` },
        { status: 502 }
      )
    }

    const data = await groqRes.json()
    const text = data.choices?.[0]?.message?.content ?? ""

    return NextResponse.json({ text })

  } catch (err) {
    console.error("[Groq fetch error]", err)
    return NextResponse.json(
      { error: "Không thể kết nối đến Groq API" },
      { status: 503 }
    )
  }
}
