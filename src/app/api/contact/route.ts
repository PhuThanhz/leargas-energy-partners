import { NextResponse } from "next/server"
import { z } from "zod"

import { contactSchema } from "@/validations/contact"

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    )
  }

  // TODO(phase 1): send email (e.g. Resend / SMTP).
  // TODO(phase 2): forward to Spring Boot – apiFetch("/api/enquiries", { method: "POST", body: parsed.data })
  console.info("[enquiry] new enquiry from", parsed.data.email)

  return NextResponse.json({ ok: true })
}
