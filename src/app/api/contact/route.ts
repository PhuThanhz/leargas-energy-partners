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

  // Forward to Spring Boot backend CRM if available
  try {
    const backendUrl = process.env.API_BASE_URL || "http://localhost:8080"
    await fetch(`${backendUrl}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        topic: parsed.data.interest,
        message: parsed.data.overview,
      }),
    })
  } catch (err) {
    console.warn("[enquiry] Failed to forward to backend CRM:", err)
  }

  console.info("[enquiry] new enquiry from", parsed.data.email)

  return NextResponse.json({ ok: true })
}
