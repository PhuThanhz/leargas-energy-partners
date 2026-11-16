import { z } from "zod"

/**
 * Centralised, validated environment variables.
 * Import `env` instead of reading `process.env` directly.
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  /** Spring Boot backend (phase 2). Optional during phase 1. */
  API_BASE_URL: z
    .union([z.url(), z.literal("")])
    .optional()
    .transform((value) => value || undefined),
})

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  API_BASE_URL: process.env.API_BASE_URL,
})

export const isApiConfigured = Boolean(env.API_BASE_URL)
