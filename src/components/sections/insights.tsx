import Link from "next/link"

import { Reveal, RevealLines } from "@/components/motion/reveal"
import type { SiteContent } from "@/content/site"
import { getPosts } from "@/lib/api/blog"

import { InsightsSlider } from "./insights-slider"

export async function Insights({ content }: { content: SiteContent["insights"] }) {
  const posts = await getPosts(0, 6)

  return (
    <section
      id="insights"
      className="relative section-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,#faf6ed_0%,#ede4d2_100%)] py-12 md:py-16 lg:py-[clamp(28px,5vh,56px)]"
    >
      {/* Ambient Lighting Bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-1/4 size-[550px] rounded-full bg-[radial-gradient(circle,rgba(249,194,30,0.1)_0%,transparent_70%)]"
      />

      <div className="relative z-10 wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-heading text-[clamp(26px,min(2.8vw,4.6vh),40px)] leading-[1.1] font-bold tracking-[-0.02em] text-ink">
              <RevealLines
                lines={[
                  content.title,
                  <span key="1" className="inline-block pb-1 text-gold-deep italic">
                    {content.accent}
                  </span>,
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 border-b border-ink/40 pb-1 text-sm text-ink transition-colors hover:border-gold-deep hover:text-gold-deep"
            >
              {content.linkLabel}
            </Link>
          </Reveal>
        </div>

        {/* Flickity Interactive Slider */}
        <InsightsSlider posts={posts.content} />
      </div>
    </section>
  )
}
