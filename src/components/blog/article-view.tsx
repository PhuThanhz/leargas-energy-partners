import type * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { ArticleToc } from "@/components/blog/article-toc"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { photos } from "@/content/media"
import { formatDate } from "@/lib/seo"
import { cn } from "@/lib/utils"

export interface ArticleViewProps {
  title: string
  excerpt?: string
  content: string
  category: string
  author: string
  coverImageUrl?: string | null
  publishedAt: string
  readingTimeMinutes: number
  toc: { id: string; title: string }[]
  /** Rendered inside the admin editor: no overlap with the site nav, shorter cover, no animation. */
  preview?: boolean
}

/** Entrance animation on the public page; plain wrapper in the admin preview (re-renders per keystroke). */
function Appear({
  preview,
  children,
  delay,
  y,
}: {
  preview: boolean
  children: React.ReactNode
  delay?: number
  y?: number
}) {
  return preview ? (
    <div>{children}</div>
  ) : (
    <Reveal delay={delay} y={y}>
      {children}
    </Reveal>
  )
}

/**
 * Cover header and reading column of a blog article.
 * Shared by the public /blog/[slug] page and the admin preview so both look identical.
 */
export function ArticleView({
  title,
  excerpt,
  content,
  category,
  author,
  coverImageUrl,
  publishedAt,
  readingTimeMinutes,
  toc,
  preview = false,
}: ArticleViewProps) {
  const heading = preview ? title : <RevealLines animateOnMount delay={0.15} lines={[title]} />
  const meta = (
    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-[14px] text-white/70">
      <span className="text-white">{author}</span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      <span>{readingTimeMinutes} min read</span>
    </div>
  )

  return (
    <>
      {/* Full-bleed cover with the headline set over it */}
      <header
        className={cn(
          "relative isolate flex items-end overflow-hidden bg-green-deep text-white",
          preview
            ? "min-h-[420px] pt-24 pb-10"
            : "-mt-[68px] min-h-[78svh] pt-[140px] pb-[clamp(40px,8vh,80px)] md:-mt-[76px]"
        )}
      >
        <Image
          src={coverImageUrl || photos.fogSunrise.src}
          alt=""
          fill
          priority={!preview}
          unoptimized={preview}
          sizes="100vw"
          className={cn(
            "-z-20 object-cover",
            !preview && "animate-[blog-hero-zoom_14s_ease-out_forwards]"
          )}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,28,20,0.95)_0%,rgba(0,28,20,0.55)_45%,rgba(0,28,20,0.3)_100%)]" />

        <div className={preview ? "w-full px-10" : "wrap"}>
          <Appear preview={preview} y={12}>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] text-white/60"
            >
              <Link href="/blog" className="transition-colors hover:text-white">
                Blog
              </Link>
              <span className="h-px w-4 bg-white/30" />
              <span className="text-gold-pale">{category}</span>
            </nav>
          </Appear>
          <h1
            className={cn(
              "mt-6 max-w-[980px] font-heading leading-[1.05] font-semibold tracking-[-0.025em]",
              preview ? "text-[clamp(30px,3.2vw,48px)]" : "text-[clamp(34px,4.6vw,72px)]"
            )}
          >
            {heading}
          </h1>
          <Appear preview={preview} delay={0.45} y={12}>
            {meta}
          </Appear>
        </div>
      </header>

      {/* Body: sticky contents beside a comfortable reading column */}
      <div className="bg-stone-soft">
        <div
          className={cn(
            "grid gap-10",
            preview
              ? "px-10 py-14 lg:grid-cols-[200px_minmax(0,720px)] lg:gap-12"
              : "wrap pt-[clamp(56px,9vh,96px)] pb-[clamp(72px,12vh,128px)] lg:grid-cols-[240px_minmax(0,720px)] lg:justify-between lg:gap-16 xl:grid-cols-[260px_minmax(0,720px)_120px]"
          )}
        >
          <aside className="hidden self-start lg:sticky lg:top-[120px] lg:block">
            <ArticleToc items={toc} />
          </aside>

          <div>
            {excerpt && (
              <Appear preview={preview} y={16}>
                <p className="font-heading text-[clamp(20px,1.9vw,26px)] leading-[1.5] font-medium tracking-[-0.01em] text-green">
                  {excerpt}
                </p>
              </Appear>
            )}
            <div className="my-10 h-px bg-line" />
            {/* HTML comes from the admin CMS (Spring Boot). Only signed-in editors can write it. */}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </>
  )
}
