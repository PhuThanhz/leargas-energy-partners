import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ArticleToc } from "@/components/blog/article-toc"
import { BlogCard } from "@/components/blog/blog-card"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { EnquiryButton } from "@/components/enquiry/enquiry-button"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { photos } from "@/content/media"
import { getPostBySlug, getPosts, getTableOfContents } from "@/lib/api/blog"
import { createMetadata, formatDate } from "@/lib/seo"

export async function generateStaticParams() {
  const posts = await getPosts(0, 100)
  const slugs = posts.content.map((post) => ({ slug: post.slug }))
  // Cache Components requires at least one param; unknown slugs render on demand.
  return slugs.length > 0 ? slugs : [{ slug: "__placeholder__" }]
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  })
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const toc = getTableOfContents(post.content)
  const related = (await getPosts(0, 12)).content.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article>
      <ReadingProgress />

      {/* Full-bleed cover with the headline set over it */}
      <header className="relative isolate -mt-[68px] flex min-h-[78svh] items-end overflow-hidden bg-green-deep pt-[140px] pb-[clamp(40px,8vh,80px)] text-white md:-mt-[76px]">
        <Image
          src={post.coverImageUrl ?? photos.fogSunrise.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 animate-[blog-hero-zoom_14s_ease-out_forwards] object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,28,20,0.95)_0%,rgba(0,28,20,0.55)_45%,rgba(0,28,20,0.3)_100%)]" />

        <div className="wrap">
          <Reveal y={12}>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] text-white/60"
            >
              <Link href="/blog" className="transition-colors hover:text-white">
                Blog
              </Link>
              <span className="h-px w-4 bg-white/30" />
              <span className="text-gold-pale">{post.category}</span>
            </nav>
          </Reveal>
          <h1 className="mt-6 max-w-[980px] font-heading text-[clamp(34px,4.6vw,72px)] leading-[1.05] font-semibold tracking-[-0.025em]">
            <RevealLines animateOnMount delay={0.15} lines={[post.title]} />
          </h1>
          <Reveal delay={0.45} y={12}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-[14px] text-white/70">
              <span className="text-white">{post.author}</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Body: sticky contents beside a comfortable reading column */}
      <div className="bg-stone-soft">
        <div className="wrap grid gap-10 pt-[clamp(56px,9vh,96px)] pb-[clamp(72px,12vh,128px)] lg:grid-cols-[240px_minmax(0,720px)] lg:justify-between lg:gap-16 xl:grid-cols-[260px_minmax(0,720px)_120px]">
          <aside className="hidden self-start lg:sticky lg:top-[120px] lg:block">
            <ArticleToc items={toc} />
          </aside>

          <div>
            <Reveal y={16}>
              <p className="font-heading text-[clamp(20px,1.9vw,26px)] leading-[1.5] font-medium tracking-[-0.01em] text-green">
                {post.excerpt}
              </p>
            </Reveal>
            <div className="my-10 h-px bg-line" />
            {/* HTML comes from our own content source / Spring Boot API. Sanitise server-side if editors can inject raw HTML. */}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>

      {/* Closing invitation */}
      <section className="relative isolate overflow-hidden bg-green-deep py-[clamp(64px,12vh,120px)] text-white">
        <Image
          src={photos.sunsetSky.src}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[720px] font-heading text-[clamp(30px,3.6vw,52px)] leading-[1.05] font-bold tracking-[-0.02em]">
            <RevealLines
              lines={[
                "Weighing a wind investment",
                <span key="1" className="text-gold-pale italic">
                  in Vietnam?
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.2} viewport={{ once: true }}>
            <EnquiryButton variant="gold" size="lg">
              Start a conversation
            </EnquiryButton>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-stone-soft py-[clamp(64px,10vh,112px)]">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-heading text-[clamp(26px,2.6vw,36px)] font-semibold tracking-[-0.02em] text-ink">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="border-b border-ink/30 pb-0.5 text-sm text-ink transition-colors hover:border-green hover:text-green"
              >
                All articles
              </Link>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
