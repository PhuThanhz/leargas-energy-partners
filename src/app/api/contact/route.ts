import { NextResponse } from "next/server"

import { contactSchema } from "@/validations/contact"

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  // TODO(phase 1): send email (e.g. Resend / SMTP).
  // TODO(phase 2): forward to Spring Boot – apiFetch("/api/contact", { method: "POST", body: parsed.data })
  console.info("[contact] new message from", parsed.data.email)

  return NextResponse.json({ ok: true })
}
