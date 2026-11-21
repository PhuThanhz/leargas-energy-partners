"use server"

import { updateTag } from "next/cache"
import { cookies } from "next/headers"

import { blogTags } from "@/lib/api/blog"
import { SITE_CONTENT_TAG } from "@/lib/api/site-content"

/**
 * Expire the public blog cache after an admin creates, edits or deletes a post,
 * so /blog and /blog/[slug] show the change on the next request.
 */
export async function refreshBlog(...slugs: (string | undefined)[]) {
  const store = await cookies()
  if (!store.get("leargas_admin_token")?.value) return

  updateTag(blogTags.all)
  for (const slug of new Set(slugs.filter(Boolean) as string[])) {
    updateTag(blogTags.post(slug))
  }
}

/** Expire the cached website content after a section is edited in Admin → Website. */
export async function refreshSiteContent() {
  const store = await cookies()
  if (!store.get("leargas_admin_token")?.value) return
  updateTag(SITE_CONTENT_TAG)
}
