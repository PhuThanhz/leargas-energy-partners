"use client"

import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion/reveal"
import { services } from "@/content/home"
import { photos } from "@/content/media"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const
const PANEL_MS = 6000

/**
 * One photograph per service, in the same order as `services`. `focus` is the object-position
 * that keeps the main turbine (tower, hub and blades) inside even the narrow collapsed strip.
 */
const panelPhotos = [
  { ...photos.sunsetSky, focus: "29% 50%" },
  { ...photos.aerialGolden, focus: "80% 50%" },
  { ...photos.hillside, focus: "82% 50%" },
  { ...photos.silhouette, focus: "77% 50%" },
  { ...photos.offshoreDay, focus: "41% 50%" },
  { ...photos.foggyOffshore, focus: "74% 55%" },
]

/**
 * Advisory capabilities as six photographic panels. The active panel widens to reveal its
 * service; panels auto-advance quietly and open on hover or focus.
 */
export function ExpertiseSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % services.length), PANEL_MS)
    return () => window.clearTimeout(id)
  }, [index, paused])

  return (
    <section
      id="services"
      className="relative isolate section-screen overflow-hidden bg-[#00140e] py-14 text-white md:py-16 lg:py-[clamp(28px,5vh,56px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 size-[650px] rounded-full bg-[radial-gradient(circle,rgba(246,231,180,0.07)_0%,transparent_70%)]"
      />

      <div className="relative z-10 wrap">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <h2 className="font-heading text-[clamp(26px,min(2.8vw,4.6vh),40px)] leading-[1.1] font-bold tracking-[-0.02em]">
            <RevealLines
              lines={[
                "One senior partner for the",
                <span key="1" className="inline-block pb-1 text-gold-pale italic">
                  entire investment lifecycle.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1} className="lg:max-w-[380px]">
            <p className="text-[14px] leading-[1.65] text-white/65">
              From first regulatory read to commercial operation – engineers, legal and tax advisers
              coordinated by one accountable partner.
            </p>
          </Reveal>
        </div>

        {/* Expanding photographic panels */}
        <Stagger
          step={0.07}
          delay={0.15}
          className="mt-[clamp(20px,4vh,40px)] flex h-[clamp(520px,62vh,640px)] flex-col gap-2 lg:h-[clamp(360px,calc(100svh-76px-2*clamp(28px,5vh,56px)-170px),620px)] lg:flex-row lg:gap-3"
        >
          {services.map((service, i) => {
            const on = i === index
            const photo = panelPhotos[i % panelPhotos.length]!
            return (
              <StaggerItem
                key={service.title}
                className={cn(
                  "relative min-h-0 min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  on ? "grow-[3]" : "grow"
                )}
                style={{ flexBasis: 0 }}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setIndex(i)}
                  onMouseEnter={() => {
                    setIndex(i)
                    setPaused(true)
                  }}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => setIndex(i)}
                  className="group absolute inset-0 cursor-pointer overflow-hidden rounded-[4px] text-left"
                >
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    style={{ objectPosition: photo.focus }}
                    className={cn(
                      "object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      on ? "scale-100" : "scale-[1.03] group-hover:scale-100"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-0 transition-colors duration-700",
                      on
                        ? "bg-[linear-gradient(0deg,rgba(0,20,14,0.92)_0%,rgba(0,20,14,0.35)_55%,rgba(0,20,14,0.1)_100%)]"
                        : "bg-[linear-gradient(0deg,rgba(0,20,14,0.85)_0%,rgba(0,20,14,0.25)_45%,rgba(0,20,14,0.15)_100%)] group-hover:bg-[#00140e]/10"
                    )}
                  />

                  {/* Number, always visible */}
                  <span
                    className={cn(
                      "absolute top-4 left-4 font-heading text-sm tabular-nums transition-colors duration-500 lg:top-5 lg:left-5",
                      on ? "text-gold-pale" : "text-white/55"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Collapsed: short title running up the panel (desktop) */}
                  <span
                    className={cn(
                      "absolute bottom-5 left-1/2 hidden origin-center -translate-x-1/2 rotate-180 font-heading text-[15px] whitespace-nowrap text-white/75 transition-opacity duration-300 [writing-mode:vertical-rl] lg:block",
                      on ? "opacity-0" : "opacity-100 delay-300"
                    )}
                  >
                    {service.title.split(" ")[0]}
                  </span>
                  {/* Collapsed: title on one line (mobile) */}
                  <span
                    className={cn(
                      "absolute top-1/2 left-14 -translate-y-1/2 font-heading text-base text-white/80 lg:hidden",
                      on && "opacity-0"
                    )}
                  >
                    {service.title}
                  </span>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {on && (
                      <motion.span
                        key="content"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.6, ease, delay: 0.25 }}
                        className="absolute inset-x-5 bottom-5 block lg:inset-x-7 lg:bottom-7"
                      >
                        <span className="block max-w-[460px] font-heading text-[clamp(22px,min(2.4vw,4vh),36px)] leading-[1.1] font-medium tracking-[-0.015em] text-white">
                          {service.title}
                        </span>
                        <span className="mt-2.5 block max-w-[420px] text-[14px] leading-[1.6] text-white/70">
                          {service.description}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
