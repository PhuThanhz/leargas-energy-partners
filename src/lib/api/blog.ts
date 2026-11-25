import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { localPosts } from "@/content/posts"
import { addHeadingIds } from "@/lib/heading-ids"
import { env, isApiConfigured } from "@/lib/env"
import type { PageResponse, Post, PostSummary } from "@/types"

import { apiFetch } from "./client"
import { ApiError } from "./errors"

export const blogTags = {
  all: "posts",
  post: (slug: string) => `post:${slug}`,
}

/**
 * Uploads are stored as `/uploads/x.png`. next/image fetches relative sources from the Next server,
 * which has no `/uploads`, so point them at the public origin (nginx → Spring Boot) in production
 * and at the backend directly in dev. Both hosts are allowed in `next.config.ts` remotePatterns.
 */
const mediaOrigin =
  process.env.NODE_ENV === "production" ? env.NEXT_PUBLIC_SITE_URL : env.API_BASE_URL

function withMediaUrl<T extends { coverImageUrl?: string | null }>(post: T): T {
  const url = post.coverImageUrl
  if (!mediaOrigin || !url?.startsWith("/uploads/")) return post
  return { ...post, coverImageUrl: `${mediaOrigin.replace(/\/$/, "")}${url}` }
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
  const data = await apiFetch<PageResponse<PostSummary>>("/api/posts", {
    query: { page, size, sort: "publishedAt,desc" },
  })
  return { ...data, content: data.content.map(withMediaUrl) }
}

/** GET /api/posts/{slug}. Returns null when the post does not exist. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache"
  cacheLife("hours")
  cacheTag(blogTags.all, blogTags.post(slug))

  if (!isApiConfigured) return localPosts.find((post) => post.slug === slug) ?? null
  try {
    const post = await apiFetch<Post>(`/api/posts/${encodeURIComponent(slug)}`)
    return withMediaUrl({ ...post, content: addHeadingIds(post.content) })
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

export { getTableOfContents } from "@/lib/heading-ids"
