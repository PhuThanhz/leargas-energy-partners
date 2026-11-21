import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { localPosts } from "@/content/posts"
import { addHeadingIds } from "@/lib/heading-ids"
import { isApiConfigured } from "@/lib/env"
import type { PageResponse, Post, PostSummary } from "@/types"

import { apiFetch } from "./client"
import { ApiError } from "./errors"

export const blogTags = {
  all: "posts",
  post: (slug: string) => `post:${slug}`,
}

function toSummary(post: Post): PostSummary {
  const { content, updatedAt, ...summary } = post
  void content
  void updatedAt
  return summary
}

/** Phase-1 fallback: page through the static articles with the same shape as Spring's `Page<T>`. */
function localPage(page: number, size: number): PageResponse<PostSummary> {
  const sorted = [...localPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const content = sorted.slice(page * size, page * size + size).map(toSummary)
  const totalPages = Math.max(1, Math.ceil(sorted.length / size))
  return {
    content,
    totalElements: sorted.length,
    totalPages,
    number: page,
    size,
    first: page === 0,
    last: page >= totalPages - 1,
  }
}

/** GET /api/posts?page=&size= – Spring Data pageable endpoint. */
export async function getPosts(page = 0, size = 12): Promise<PageResponse<PostSummary>> {
  "use cache"
  cacheLife("hours")
  cacheTag(blogTags.all)

  if (!isApiConfigured) return localPage(page, size)
  return apiFetch<PageResponse<PostSummary>>("/api/posts", {
    query: { page, size, sort: "publishedAt,desc" },
  })
}

/** GET /api/posts/{slug}. Returns null when the post does not exist. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache"
  cacheLife("hours")
  cacheTag(blogTags.all, blogTags.post(slug))

  if (!isApiConfigured) return localPosts.find((post) => post.slug === slug) ?? null
  try {
    const post = await apiFetch<Post>(`/api/posts/${encodeURIComponent(slug)}`)
    return { ...post, content: addHeadingIds(post.content) }
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

/** Build a table of contents from `<h2 id="…">` headings in the post HTML. */
export function getTableOfContents(html: string) {
  return [...html.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(
    ([, id, title]) => ({
      id: id!,
      title: title!.replace(/<[^>]+>/g, ""),
    })
  )
}
