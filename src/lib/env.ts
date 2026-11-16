import { z } from "zod"

/**
 * Centralised, validated environment variables.
 * Import `env` instead of reading `process.env` directly.
 */
const defaultSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "https://leargas-energy-partners.vercel.app"
}

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default(defaultSiteUrl()),
  /** Spring Boot backend (phase 2). Optional during phase 1. */
  API_BASE_URL: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .transform((value) => value || undefined),
})

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl(),
  API_BASE_URL: process.env.API_BASE_URL,
})

export const isApiConfigured = Boolean(env.API_BASE_URL)
