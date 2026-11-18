import { ParallaxImage } from "@/components/motion/parallax-image"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/shared/eyebrow"
import { photos } from "@/content/media"

const facts = [
  {
    value: "Global",
    title: "International Network",
    label: "Cross-border capital syndication reach and institutional governance",
  },
  {
    value: "Local",
    title: "Local Insights",
    label: "Decades of relationships, provincial access & Vietnam ground truth",
  },
]

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#faf7f0] py-[90px] text-ink md:py-[140px]"
    >
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <Reveal>
              <Eyebrow>Institutional Heritage · Boutique Execution</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-heading text-[clamp(38px,4.8vw,72px)] leading-[1.02] font-medium tracking-[-0.02em]">
              <RevealLines
                lines={[
                  "A boutique firm with",
                  <span key="1" className="text-gold-deep italic">
                    international discipline
                  </span>,
                  "and local ground truth.",
                ]}
              />
            </h2>
          </div>

          {/* Authentic Gaelic Etymology Box */}
          <Reveal delay={0.1}>
            <div className="relative rounded-[3px] border border-line bg-paper/95 p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-line/70 pb-3 text-xs">
                <span className="text-green-dark font-semibold">Etymology &amp; Philosophy</span>
                <span className="text-muted-foreground">Gaelic Origin</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <h3 className="font-heading text-3xl font-semibold text-green italic">Léargas</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  /ˈlʲeːɾˠɡəsˠ/ · noun (Irish)
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/80 italic">
                “Clear sight, comprehensive perception, profound insight; the rare capability to see
                through transient noise to discern enduring value.”
              </p>
              <p className="mt-4 border-t border-line/60 pt-3.5 text-[13.5px] leading-[1.8] text-muted-foreground">
                Our founders were educated in Europe and built senior leadership careers bridging
                European capital markets and Asian project development. We know precisely what
                institutional investment committees demand—and how complex transactions actually
                close on Vietnamese soil.
              </p>
            </div>
          </Reveal>

          {/* Tri-Pillar Track Record Badges */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-3 divide-x divide-line rounded-[3px] border border-line bg-paper shadow-xs">
              {facts.map((fact) => (
                <div key={fact.value} className="p-5 md:p-6">
                  <div className="font-heading text-[32px] leading-none font-medium text-green md:text-[44px]">
                    {fact.value}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-ink">{fact.title}</div>
                  <div className="mt-1 hidden text-[11px] leading-normal text-muted-foreground sm:block">
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Photography Showcase Frame */}
        <div className="relative grid grid-cols-6 gap-4">
          <Reveal className="col-span-6 sm:col-span-5" y={32}>
            <div className="relative overflow-hidden rounded-[3px] border border-line shadow-xl">
              <ParallaxImage
                src={photos.mistyMountain.src}
                alt={photos.mistyMountain.alt}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="aspect-[4/5] sm:aspect-[5/6]"
              />
            </div>
          </Reveal>
          <Reveal
            delay={0.2}
            y={48}
            className="z-10 col-span-4 col-start-3 -mt-24 sm:col-span-3 sm:col-start-4 sm:-mt-36"
          >
            <div className="rounded-[3px] border border-line bg-paper p-3 shadow-2xl">
              <ParallaxImage
                src={photos.coastline.src}
                alt={photos.coastline.alt}
                sizes="(min-width: 1024px) 22vw, 50vw"
                strength={8}
                className="aspect-square rounded-[2px]"
              />
              <div className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                <span className="inline-block h-[2px] w-3 -skew-x-[50deg] bg-red" />
                South-Central Coast · Vietnam
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
