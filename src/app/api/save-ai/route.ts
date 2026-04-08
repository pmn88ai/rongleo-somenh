import { google } from "googleapis"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Lấy version hiện tại
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "AI_NARRATIVES!A2:A"
    })

    const version = (existing.data.values?.length || 0) + 1

    // Append dòng mới
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "AI_NARRATIVES!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          body.profile_id,
          version,
          body.temperature,
          body.content,
          new Date().toISOString()
        ]]
      }
    })

    return Response.json({ ok: true })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "save error" }, { status: 500 })
  }
}