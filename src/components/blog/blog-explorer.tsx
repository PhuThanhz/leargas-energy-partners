"use client"

import { Search } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import { formatDate } from "@/lib/seo"
import { cn } from "@/lib/utils"
import type { PostSummary } from "@/types"

import { BlogCard } from "./blog-card"

const ALL = "All articles"
const ease = [0.22, 1, 0.36, 1] as const

/**
 * Blog index: the newest article as a large feature, then category tabs + search over a
 * borderless grid. While filtering, every match goes into the grid.
 */
export function BlogExplorer({ posts }: { posts: PostSummary[] }) {
  const [category, setCategory] = useState(ALL)
  const [query, setQuery] = useState("")

  const categories = useMemo(() => [ALL, ...new Set(posts.map((p) => p.category))], [posts])

  const q = query.trim().toLowerCase()
  const filtering = category !== ALL || q.length > 0
  const visible = posts.filter((post) => {
    const inCategory = category === ALL || post.category === category
    const matches = !q || `${post.title} ${post.excerpt}`.toLowerCase().includes(q)
    return inCategory && matches
  })

  const [featured, ...rest] = posts
  const grid = filtering ? visible : rest

  return (
    <>
      {featured && !filtering && <FeaturedPost post={featured} />}

      {/* Category tabs + search */}
      <div className="mt-[clamp(56px,8vh,96px)] flex flex-col gap-6 border-b border-line md:flex-row md:items-end md:justify-between">
        <div
          className="-mb-px flex scrollbar-none gap-7 overflow-x-auto"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 cursor-pointer border-b py-3.5 text-sm transition-colors duration-300",
                category === c
                  ? "border-green font-medium text-green"
                  : "border-transparent text-muted-foreground hover:text-ink"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="group mb-3 flex w-full items-center gap-3 text-muted-foreground md:max-w-[280px]">
          <Search className="size-4 shrink-0 transition-colors group-focus-within:text-green" />
          <span className="sr-only">Search articles</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            className="w-full bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {grid.length === 0 ? (
        <p className="py-16 text-muted-foreground">
          {filtering ? "No articles match your search." : "More articles are on the way."}
        </p>
      ) : (
        <motion.div layout className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {grid.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, ease, delay: Math.min(i, 6) * 0.06 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  )
}

/** The newest article as a large split feature. */
function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.2 }}
      className="group relative grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-green">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            priority
            unoptimized={post.coverImageUrl.includes("/uploads/")}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-gold-deep">Latest · {post.category}</span>
          <span className="h-px w-4 bg-ink/20" />
          <time dateTime={post.publishedAt} className="text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h2 className="mt-4 font-heading text-[clamp(28px,3vw,44px)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-green">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">{post.excerpt}</p>
        <div className="mt-7 flex items-center gap-4 text-sm">
          <span className="font-medium text-green">Read article</span>
          <span className="h-px w-10 bg-green/40 transition-all duration-500 group-hover:w-16 group-hover:bg-green" />
          <span className="text-muted-foreground">{post.readingTimeMinutes} min read</span>
        </div>
      </div>
    </motion.article>
  )
}
