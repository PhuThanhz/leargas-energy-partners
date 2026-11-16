import { ParallaxImage } from "@/components/motion/parallax-image"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/shared/eyebrow"
import { approachSteps } from "@/content/home"
import { photos } from "@/content/media"

const deliverables = [
  "Mandate Charter & Feasibility Synthesis",
  "Counterparty DD, Land & Grid Concessions",
  "SPA/SHA Negotiation & Financial Close",
  "Asset Monitoring & Ongoing Value Enhancement",
]

export function Approach() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden bg-[#013525] py-[90px] text-white md:py-[140px]"
    >
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow className="text-gold">Advisory Methodology · End-to-End Governance</Eyebrow>
          </Reveal>
          <h2 className="mt-6 font-heading text-[clamp(38px,4.5vw,66px)] leading-[1.04] font-medium tracking-[-0.015em]">
            <RevealLines
              lines={[
                "From initial thesis",
                <span key="1" className="text-gold italic">
                  to operating assets.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15px] leading-[1.85] text-white/70">
              We do not produce theoretical slide decks and depart. Every advisory mandate is
              anchored in clear accountability—staying alongside sponsors and capital providers
              through complex regulatory milestones, contractor negotiations, and construction.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 hidden lg:block">
            <div className="overflow-hidden rounded-[3px] border border-white/10 shadow-2xl">
              <ParallaxImage
                src={photos.foggyOffshore.src}
                alt={photos.foggyOffshore.alt}
                sizes="40vw"
                className="aspect-[4/3]"
              />
            </div>
          </Reveal>
        </div>

        <ol className="relative">
          <span
            aria-hidden
            className="absolute top-4 bottom-4 left-[21px] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent"
          />
          {approachSteps.map((step, i) => (
            <li key={step.title} className="group relative pb-14 last:pb-0">
              <Reveal delay={i * 0.08} className="grid grid-cols-[44px_1fr] gap-6 md:gap-10">
                <span className="relative z-10 grid size-11 place-items-center rounded-full border border-gold/70 bg-[#013525] font-mono text-xs font-bold text-gold tabular-nums shadow-md transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-green">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="rounded-[3px] border border-white/10 bg-[#002b1e]/60 p-6 backdrop-blur-xs transition-all duration-300 group-hover:border-gold/40 group-hover:bg-[#002b1e]/90 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-gold uppercase">
                      PHASE 0{i + 1} &middot; {step.label}
                    </span>
                    <span className="hidden font-mono text-[10px] text-white/40 uppercase sm:inline-block">
                      DELIVERABLE: {deliverables[i]}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-[clamp(26px,2.6vw,36px)] leading-tight font-medium text-white transition-colors group-hover:text-gold-pale">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.85] text-white/70">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
