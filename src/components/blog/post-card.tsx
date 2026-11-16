import Image from "next/image"
import Link from "next/link"

import type { PostSummary } from "@/types"
import { cn } from "@/lib/utils"

/** `compact` trims image height and type so the card fits a one-screen home section. */
export function PostCard({ post, compact = false }: { post: PostSummary; compact?: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[3px] bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-gold-deep hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,43,30,0.12)]">
      <div
        className={cn(
          "relative overflow-hidden bg-green",
          compact ? "h-[clamp(130px,20vh,195px)]" : "h-60 md:h-[195px]"
        )}
      >
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover opacity-85 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-green-deep/40 to-transparent" />
      </div>
      <div className={cn("flex flex-1 flex-col", compact ? "p-5" : "p-[27px]")}>
        <span
          className={cn(
            "text-gold-deep",
            compact ? "text-xs" : "text-[10px] tracking-[1.5px] uppercase"
          )}
        >
          {post.category}
        </span>
        <h3
          className={cn(
            "font-heading leading-[1.15] font-medium",
            compact ? "my-2 line-clamp-2 text-[20px]" : "my-[15px] text-[28px]"
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className={cn("text-[10px] text-muted-foreground", compact ? "mb-2" : "mb-3.5")}>
          {post.author} &nbsp;·&nbsp; {post.readingTimeMinutes} min read
        </p>
        <p
          className={cn(
            "text-[13px] text-muted-foreground",
            compact ? "hidden" : "mb-[25px] leading-[1.8]"
          )}
        >
          {post.excerpt}
        </p>
        <span
          className={cn(
            "mt-auto flex justify-between border-t border-line text-xs",
            compact ? "pt-3" : "pt-[18px]"
          )}
        >
          Read article
        </span>
      </div>
    </article>
  )
}
