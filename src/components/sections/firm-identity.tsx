"use client"

import { CountUp } from "@/components/motion/count-up"
import { ParallaxImage } from "@/components/motion/parallax-image"
import {
  ImageReveal,
  LineDraw,
  Reveal,
  RevealLines,
  Stagger,
  StaggerItem,
} from "@/components/motion/reveal"
import { photos } from "@/content/media"

const stats = [
  { value: 3260, decimals: 0, unit: "km", label: "Coastline" },
  { value: 9.5, decimals: 1, unit: "m/s", label: "Mean wind speed" },
  { value: 28, decimals: 0, unit: "GW", label: "PDP8 target by 2030" },
]

const pillars = [
  {
    code: "GLOBAL",
    title: "International Network",
    desc: "Institutional governance, cross-border capital syndication, and direct access to global funds and DFIs.",
  },
  {
    code: "LOCAL",
    title: "Local Insights",
    desc: "Decades of relationships with provincial authorities, local developers, and energy regulators.",
  },
]

/** Who we are: a tall turbine portrait beside the firm's thesis, headline numbers and pillars. */
export function FirmIdentity() {
  return (
    <section
      id="about"
      className="relative section-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,#faf7f0_0%,#f5efe2_100%)] py-12 text-ink md:py-16 lg:py-[clamp(28px,5vh,56px)]"
    >
      <div className="relative z-10 wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Portrait: the full turbine, top to base */}
        <ImageReveal className="relative h-[420px] overflow-hidden rounded-[4px] lg:col-span-5 lg:h-[calc(100svh-76px-2*clamp(28px,5vh,56px))]">
          <ParallaxImage
            src={photos.mistyMountain.src}
            alt={photos.mistyMountain.alt}
            sizes="(min-width: 1024px) 40vw, 100vw"
            strength={6}
            className="size-full [&_img]:object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-deep/70 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 font-heading text-sm text-white/90 italic">
            Clean energy infrastructure, Vietnam
          </p>
        </ImageReveal>

        <div className="flex flex-col justify-center lg:col-span-7">
          <h2 className="font-heading text-[clamp(30px,min(3.6vw,6vh),56px)] leading-[1.05] font-bold tracking-[-0.025em]">
            <RevealLines
              lines={[
                "Accelerating Vietnam's",
                <span key="1" className="inline-block pb-1 text-gold-deep italic">
                  wind energy transition.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-[clamp(12px,2.5vh,24px)] max-w-[460px] text-[15px] leading-[1.7] text-muted-foreground">
              International capital, connected to Vietnam&apos;s best wind assets.
            </p>
          </Reveal>

          {/* Headline numbers */}
          <div className="mt-[clamp(28px,6vh,64px)]">
            <LineDraw className="bg-ink/15" />
            <div className="grid grid-cols-3 divide-x divide-ink/10">
              {stats.map((s) => (
                <div key={s.label} className="py-[clamp(16px,3vh,28px)] pr-4 pl-5 first:pl-0">
                  <div className="font-heading text-[clamp(30px,min(3.4vw,6vh),56px)] leading-none font-semibold tracking-[-0.03em] text-green tabular-nums">
                    <CountUp to={s.value} decimals={s.decimals} repeat />
                    <span className="ml-1 text-[0.4em] font-normal tracking-normal text-muted-foreground">
                      {s.unit}
                    </span>
                  </div>
                  <div className="mt-2 text-[13px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <LineDraw className="bg-ink/15" delay={0.2} />
          </div>

          {/* Pillars */}
          <Stagger className="mt-[clamp(20px,4vh,40px)] grid gap-6 sm:grid-cols-2" delay={0.3}>
            {pillars.map((p) => (
              <StaggerItem key={p.code} className="group">
                <div className="font-heading text-sm font-semibold text-gold-deep">{p.code}</div>
                <h3 className="mt-1.5 font-heading text-[17px] font-semibold text-ink transition-colors group-hover:text-green">
                  {p.title}
                </h3>
                <p className="mt-1 text-[13px] leading-[1.6] text-muted-foreground">{p.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
