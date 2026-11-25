import Image from "next/image"
import Link from "next/link"

import { formatDate } from "@/lib/seo"
import type { PostSummary } from "@/types"

/** Borderless editorial card: photograph, category and date, headline, short excerpt. */
export function BlogCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-green">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            unoptimized={post.coverImageUrl.includes("/uploads/")}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
          />
        )}
        <div className="absolute inset-0 bg-green-deep/0 transition-colors duration-500 group-hover:bg-green-deep/15" />
      </div>
      <div className="mt-5 flex items-center gap-3 text-[13px]">
        <span className="text-gold-deep">{post.category}</span>
        <span className="h-px w-4 bg-ink/20" />
        <time dateTime={post.publishedAt} className="text-muted-foreground">
          {formatDate(post.publishedAt)}
        </time>
      </div>
      <h3 className="mt-2.5 font-heading text-[22px] leading-[1.25] font-medium tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-green">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-[14px] leading-[1.65] text-muted-foreground">
        {post.excerpt}
      </p>
      <p className="mt-3 text-[13px] text-muted-foreground">{post.readingTimeMinutes} min read</p>
    </article>
  )
}
