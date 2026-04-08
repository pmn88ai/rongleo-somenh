import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      profile_id,
      name,
      birthdate,
      time,
      gender,
      phone,
    } = body

    const res = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: "POST",
      body: JSON.stringify({
        sheet: "PROFILES",
        data: [
          profile_id,
          name,
          birthdate,
          time,
          gender,
          phone,
          new Date().toISOString(),
        ],
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Save profile failed" }, { status: 500 })
  }
}