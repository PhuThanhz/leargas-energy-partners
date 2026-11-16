import { ParallaxImage } from "@/components/motion/parallax-image"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/shared/eyebrow"
import { lensItems } from "@/content/home"
import { photos } from "@/content/media"

export function InvestmentLens() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-[#faf7f0] py-[90px] text-ink md:py-[140px]"
    >
      <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-[80px]">
        <div>
          <Reveal>
            <Eyebrow>Institutional Edge · The LÉARGAS Thesis</Eyebrow>
          </Reveal>
          <h2 className="my-6 font-heading text-[clamp(38px,4.8vw,74px)] leading-[1.02] font-medium tracking-[-0.02em]">
            <RevealLines
              lines={[
                "The trusted bridge between",
                <span key="1" className="text-gold-deep italic">
                  global capital & local truth.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-[500px] text-[15px] leading-[1.85] text-muted-foreground">
              International capital allocators face an information asymmetry when deploying in
              Southeast Asia. We eliminate that uncertainty by operating with the rigorous
              analytical discipline of European finance and the deep, unvarnished realities of local
              execution.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <div className="overflow-hidden rounded-[3px] border border-line shadow-xl">
              <ParallaxImage
                src={photos.silhouette.src}
                alt={photos.silhouette.alt}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[16/10]"
              />
            </div>
          </Reveal>
        </div>

        <ul className="space-y-4 lg:pt-14">
          {lensItems.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 0.1}>
                <article className="group relative rounded-[3px] border border-line bg-paper/90 p-7 transition-all duration-300 hover:border-gold-deep hover:bg-paper hover:shadow-md md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-xl font-bold text-gold-deep tabular-nums">
                        0{i + 1}
                      </span>
                      <h3 className="font-heading text-[24px] leading-tight font-medium text-ink transition-colors group-hover:text-green md:text-[28px]">
                        {item.title}
                      </h3>
                    </div>
                    <span
                      aria-hidden
                      className="font-mono text-sm text-red transition-transform duration-500 group-hover:rotate-45"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="mt-3.5 border-l-2 border-line pl-7 text-[14px] leading-[1.8] text-muted-foreground transition-colors group-hover:border-gold">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
