/**
 * Types mirroring the Spring Boot DTOs (phase 2).
 * Keep these in sync with the backend `PostDto` / Spring Data `Page<T>`.
 */

export type PostSummary = {
  id: number
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  readingTimeMinutes: number
  coverImageUrl?: string | null
  publishedAt: string // ISO-8601 (java.time.LocalDate / Instant)
}

export type Post = PostSummary & {
  /** HTML body. `<h2 id="…">` headings are used to build the table of contents. */
  content: string
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
