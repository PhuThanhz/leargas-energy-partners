import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { DEFAULT_SITE_CONTENT, mergeSiteContent, type SiteContent } from "@/content/site"
import { isApiConfigured } from "@/lib/env"

import { apiFetch } from "./client"

export const SITE_CONTENT_TAG = "site-content"

/**
 * Website copy and images: defaults overlaid with edits from Admin → Website.
 * Falls back to the defaults if the backend is down, so the site never breaks.
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache"
  cacheLife("hours")
  cacheTag(SITE_CONTENT_TAG)

  if (!isApiConfigured) return DEFAULT_SITE_CONTENT
  try {
    const saved = await apiFetch<Record<string, unknown>>("/api/content", { timeoutMs: 5_000 })
    return mergeSiteContent(saved)
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}
