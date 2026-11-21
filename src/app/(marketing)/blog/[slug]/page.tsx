import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ArticleView } from "@/components/blog/article-view"
import { BlogCard } from "@/components/blog/blog-card"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { EnquiryButton } from "@/components/enquiry/enquiry-button"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { photos } from "@/content/media"
import { getPostBySlug, getPosts, getTableOfContents } from "@/lib/api/blog"
import { createMetadata } from "@/lib/seo"

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

      <ArticleView
        title={post.title}
        excerpt={post.excerpt}
        content={post.content}
        category={post.category}
        author={post.author}
        coverImageUrl={post.coverImageUrl}
        backgroundColor={post.backgroundColor}
        publishedAt={post.publishedAt}
        readingTimeMinutes={post.readingTimeMinutes}
        toc={toc}
      />

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
