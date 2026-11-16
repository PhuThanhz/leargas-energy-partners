import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { isApiConfigured } from "@/lib/env"
import type { PageResponse, Post, PostSummary } from "@/types"

import { apiFetch } from "./client"
import { ApiError } from "./errors"

export const blogTags = {
  all: "posts",
  post: (slug: string) => `post:${slug}`,
}

/** GET /api/posts?page=&size= – Spring Data pageable endpoint. */
export async function getPosts(page = 0, size = 9): Promise<PageResponse<PostSummary> | null> {
  "use cache"
  cacheLife("hours")
  cacheTag(blogTags.all)

  if (!isApiConfigured) return null
  return apiFetch<PageResponse<PostSummary>>("/api/posts", {
    query: { page, size, sort: "publishedAt,desc" },
  })
}

/** GET /api/posts/{slug}. Returns null when the post does not exist. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache"
  cacheLife("hours")
  cacheTag(blogTags.all, blogTags.post(slug))

  if (!isApiConfigured) return null
  try {
    return await apiFetch<Post>(`/api/posts/${encodeURIComponent(slug)}`)
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}
