import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      profile_id,
      core_tags,
      strengths,
      warnings,
      summary,
    } = body

    const res = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: "POST",
      body: JSON.stringify({
        sheet: "INSIGHTS",
        data: [
          profile_id,
          core_tags.join(", "),
          strengths.join(" | "),
          warnings.join(" | "),
          summary,
          new Date().toISOString(),
        ],
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Save insight failed" }, { status: 500 })
  }
}