import Image from "next/image"

import { Reveal, RevealLines } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/shared/eyebrow"
import { brandValues } from "@/content/home"
import { cn } from "@/lib/utils"
import logoOriginal from "@/../public/brand/leargas-logo-original.webp"

/** Explains the meaning of the logo and its three colours. */
export function BrandMark() {
  return (
    <section aria-labelledby="brand-heading" className="bg-green-deep text-white">
      <div className="wrap grid gap-14 py-[80px] md:py-[130px] lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="text-gold">The meaning behind our mark</Eyebrow>
          </Reveal>
          <h2 id="brand-heading" className="mt-7 section-title">
            <RevealLines
              lines={[
                "See further.",
                <span key="1" className="text-gold italic">
                  Then make it happen.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 copy text-white/70">
              Our mark is built for people with a long horizon. A classical wordmark for enduring
              standards – and a single red stroke rising over the É: the vision set high, and the
              resolve to turn it into results.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <div className="relative overflow-hidden rounded-[2px] ring-1 ring-white/10">
              <Image
                src={logoOriginal}
                alt="LÉARGAS Energy Partners logo"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>

        <ul className="divide-y divide-white/10 border-y border-white/10">
          {brandValues.map((value, i) => (
            <li key={value.colour}>
              <Reveal delay={i * 0.12} className="group grid grid-cols-[64px_1fr] gap-6 py-9">
                <span
                  aria-hidden
                  className={cn(
                    "mt-1 block h-16 w-16 rounded-full ring-1 ring-white/35 ring-offset-4 ring-offset-green-deep transition-transform duration-500 group-hover:scale-110",
                    value.swatch
                  )}
                />
                <div>
                  <p className="text-[11px] tracking-[0.25em] text-white/50 uppercase">
                    {value.colour}
                  </p>
                  <h3 className="mt-2 font-heading text-[30px] leading-tight md:text-[36px]">
                    {value.name}
                  </h3>
                  <p className="mt-3 max-w-[460px] text-sm leading-[1.85] text-white/70">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
