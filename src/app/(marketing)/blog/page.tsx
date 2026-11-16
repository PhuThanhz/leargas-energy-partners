import Image from "next/image"

import { BlogExplorer } from "@/components/blog/blog-explorer"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { photos } from "@/content/media"
import { getPosts } from "@/lib/api/blog"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Practical perspectives on wind energy investment, project readiness and the M&A process in Vietnam and Southeast Asia.",
  path: "/blog",
})

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      {/* Immersive header: full-bleed turbine photograph under the transparent nav */}
      <section className="relative isolate -mt-[68px] flex min-h-[62svh] items-end overflow-hidden bg-green-deep pt-[140px] pb-[clamp(48px,8vh,88px)] text-white md:-mt-[76px]">
        <Image
          src={photos.fogSunrise.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 animate-[blog-hero-zoom_14s_ease-out_forwards] object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,28,20,0.92)_0%,rgba(0,28,20,0.6)_55%,rgba(0,28,20,0.25)_100%),linear-gradient(0deg,rgba(0,28,20,0.85)_0%,transparent_60%)]" />

        <div className="wrap">
          <h1 className="font-heading text-[clamp(44px,6.5vw,96px)] leading-[1] font-medium tracking-[-0.03em]">
            <RevealLines
              animateOnMount
              delay={0.1}
              lines={[
                "Perspectives",
                <span key="1" className="text-gold-pale italic">
                  on wind.
                </span>,
              ]}
            />
          </h1>
          <Reveal delay={0.5} y={16}>
            <p className="mt-6 max-w-[520px] text-[16px] leading-[1.7] text-white/75">
              Notes on wind investment, project readiness and M&amp;A in Vietnam and Southeast Asia.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone-soft pt-[clamp(48px,8vh,96px)] pb-[clamp(72px,12vh,140px)]">
        <div className="wrap">
          {posts.content.length === 0 ? (
            <p className="py-9 text-muted-foreground">Articles are coming soon.</p>
          ) : (
            <BlogExplorer posts={posts.content} />
          )}
        </div>
      </section>
    </>
  )
}
