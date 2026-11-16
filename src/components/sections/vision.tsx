import Image from "next/image"

import { Reveal, RevealLines } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/shared/eyebrow"
import { milestones } from "@/content/home"
import { photos } from "@/content/media"
import { cn } from "@/lib/utils"

/** Long-term ambition: from advisory firm to an investment platform for Vietnam & APAC. */
export function Vision() {
  return (
    <section id="vision" className="relative isolate overflow-hidden bg-green-deep text-white">
      <Image
        src={photos.offshoreBlue.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-deep via-green-deep/95 to-green-deep/70" />

      <div className="wrap py-[80px] md:py-[130px]">
        <div className="max-w-[900px]">
          <Reveal>
            <Eyebrow className="text-gold">04 / Our vision</Eyebrow>
          </Reveal>
          <h2 className="mt-7 section-title text-[clamp(42px,5.6vw,88px)]">
            <RevealLines
              lines={[
                "Today, a trusted adviser.",
                <span key="1" className="text-gold italic">
                  Tomorrow, a platform for capital.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 copy max-w-[620px] text-white/70">
              Our long-term ambition is to build a platform where international investors and
              capital providers come to put their capital to work – in quality projects across
              Vietnam and Asia-Pacific.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-0">
          <span
            aria-hidden
            className="absolute top-[22px] right-0 left-0 hidden h-px bg-gradient-to-r from-gold via-gold/40 to-white/10 md:block"
          />
          {milestones.map((m, i) => (
            <li key={m.title} className="relative md:pr-10">
              <Reveal delay={i * 0.15}>
                <span
                  className={cn(
                    "relative z-10 grid size-11 place-items-center rounded-full border text-xs tabular-nums",
                    m.current
                      ? "border-gold bg-gold text-green-deep"
                      : "border-white/30 bg-green-deep text-white/80"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className={cn(
                    "mt-6 flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase",
                    m.current ? "text-gold" : "text-white/50"
                  )}
                >
                  {m.stage}
                  {m.current && <span className="inline-block size-1.5 rounded-full bg-red" />}
                </p>
                <h3 className="mt-3 font-heading text-[30px] leading-tight font-medium">
                  {m.title}
                </h3>
                <p className="mt-3 max-w-[340px] text-sm leading-[1.85] text-white/65">
                  {m.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-[11px] leading-relaxed text-white/45">
          LÉARGAS currently provides advisory services only and does not manage, raise or accept
          investor funds.
        </p>
      </div>
    </section>
  )
}
