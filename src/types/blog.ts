/**
 * Types mirroring the Spring Boot DTOs (phase 2).
 * Keep these in sync with the backend `PostDto` / Spring Data `Page<T>`.
 */

export type Author = {
  id: number
  name: string
  avatarUrl?: string | null
}

export type PostSummary = {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImageUrl?: string | null
  publishedAt: string // ISO-8601 (java.time.Instant / OffsetDateTime)
  author?: Author | null
  tags?: string[]
}

export type Post = PostSummary & {
  content: string // HTML or Markdown from the backend
  updatedAt?: string | null
}

/** Spring Data `Page<T>` JSON shape. */
export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number // zero-based page index
  size: number
  first: boolean
  last: boolean
}
