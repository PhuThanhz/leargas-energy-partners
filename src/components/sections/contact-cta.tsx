import Image from "next/image"

import { EnquiryButton } from "@/components/enquiry/enquiry-button"
import { Reveal, RevealLines } from "@/components/motion/reveal"
import { photos } from "@/content/media"

import { ExecutionSteps } from "./execution"
import { TurbineArt } from "./turbine-art"

export function ContactCta() {
  return (
    <section
      id="contact"
      className="relative isolate section-screen overflow-hidden bg-[radial-gradient(ellipse_at_bottom_left,#001a12_0%,#013525_50%,#001c14_100%)] py-14 text-white md:py-18 lg:py-[clamp(28px,5vh,56px)]"
    >
      <Image
        src={photos.sunsetSky.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[center_60%] opacity-40 mix-blend-luminosity"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,26,18,0.96),rgba(1,53,37,0.75)_50%,rgba(0,28,20,0.95))]" />

      {/* Golden Aura Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 -bottom-20 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,194,30,0.18)_0%,transparent_70%)]"
      />

      <div id="approach" className="relative z-10 wrap scroll-mt-[100px]">
        <ExecutionSteps />
      </div>

      <div className="relative z-10 wrap mt-[clamp(28px,6vh,64px)]">
        <div className="grid items-end gap-8 border-t border-white/10 pt-[clamp(24px,5vh,48px)] lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="max-w-[820px] font-heading text-[clamp(30px,4vh+1.6vw,60px)] leading-[1.02] font-bold tracking-[-0.02em]">
              <RevealLines
                lines={[
                  "Bring us your ambition.",
                  <span key="1" className="text-gold-pale italic">
                    We&apos;ll bring the ground truth.
                  </span>,
                ]}
              />
            </h2>
            <Reveal
              viewport={{ once: true }}
              delay={0.2}
              className="mt-[clamp(16px,3vh,28px)] flex flex-wrap items-center gap-6"
            >
              <EnquiryButton variant="gold" size="lg">
                Start a conversation
              </EnquiryButton>
              <p className="text-[14px] text-white/65">
                A confidential conversation with our founding partners.
              </p>
            </Reveal>
          </div>
          <Reveal viewport={{ once: true }} delay={0.3} y={0} className="hidden lg:block">
            <TurbineArt className="h-[clamp(160px,30vh,300px)] w-auto" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
