"use client"

import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { CountUp } from "@/components/motion/count-up"
import { Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion/reveal"
import { photos } from "@/content/media"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const
const CORRIDOR_MS = 6000

interface Corridor {
  id: string
  name: string
  province: string
  type: string
  photo: string
  /** Resource potential in MW (shown as "N MW+"). */
  potentialMw: number
  grid: string
  pdp8Status: string
}

const corridors: Corridor[] = [
  {
    id: "south-central",
    name: "South-Central Coast",
    province: "Ninh Thuận · Bình Thuận · Khánh Hòa",
    type: "Onshore & nearshore cluster",
    photo: photos.coastline.src,
    potentialMw: 8500,
    grid: "500 / 220 kV",
    pdp8Status: "Priority renewable centre",
  },
  {
    id: "mekong-delta",
    name: "Mekong Delta",
    province: "Bạc Liêu · Sóc Trăng · Trà Vinh · Bến Tre",
    type: "Intertidal & shallow-water nearshore",
    photo: photos.offshoreBlue.src,
    potentialMw: 5000,
    grid: "220 kV coastal",
    pdp8Status: "Active intertidal concessions",
  },
  {
    id: "highlands",
    name: "Central Highlands",
    province: "Gia Lai · Đắk Lắk · Đắk Nông",
    type: "Elevated high-capacity onshore",
    photo: photos.hillside.src,
    potentialMw: 3200,
    grid: "220 kV regional",
    pdp8Status: "Operating & secondary M&A",
  },
  {
    id: "cross-border",
    name: "Offshore & Cross-Border",
    province: "Laos interconnect · Southern offshore",
    type: "Regional ASEAN interconnection",
    photo: photos.foggyOffshore.src,
    potentialMw: 10000,
    grid: "500 kV / HVDC",
    pdp8Status: "Bilateral cooperation framework",
  },
]

/**
 * Corridors: the active region's photograph fills the section; a large index of the four
 * corridors drives it (auto-advancing quietly), and its headline numbers sit beside.
 */
export function CorridorsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const active = corridors[index]!

  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % corridors.length), CORRIDOR_MS)
    return () => window.clearTimeout(id)
  }, [index, paused])

  return (
    <section
      id="corridors"
      className="relative isolate section-screen overflow-hidden bg-green-deep py-14 text-white md:py-16 lg:py-[clamp(28px,5vh,56px)]"
    >
      {/* Full-bleed photograph of the active corridor: cross-fade with a slow push-in */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active.id}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: CORRIDOR_MS / 1000 + 2, ease: "linear" }}
          >
            <Image src={active.photo} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,28,20,0.95)_0%,rgba(0,28,20,0.82)_42%,rgba(0,28,20,0.35)_75%,rgba(0,28,20,0.25)_100%),linear-gradient(0deg,rgba(0,28,20,0.85)_0%,transparent_45%)]"
      />

      <div className="relative z-10 wrap flex flex-col gap-[clamp(28px,6vh,64px)]">
        <div className="max-w-[640px]">
          <h2 className="font-heading text-[clamp(26px,min(2.8vw,4.6vh),40px)] leading-[1.1] font-bold tracking-[-0.02em]">
            <RevealLines
              lines={[
                "Ground truth across",
                <span key="1" className="inline-block pb-1 text-gold-pale italic">
                  Vietnam&apos;s key energy corridors.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-3 text-[14px] leading-[1.65] text-white/65">
              Grid, wind and permitting differ sharply from one region to the next.
            </p>
          </Reveal>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          {/* Corridor index */}
          <Stagger step={0.1} delay={0.15}>
            <div
              role="tablist"
              aria-label="Energy corridors"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {corridors.map((c, i) => {
                const on = i === index
                return (
                  <StaggerItem key={c.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setIndex(i)}
                      className="group relative block w-full cursor-pointer py-[clamp(10px,2vh,18px)] text-left"
                    >
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-px transition-colors duration-700",
                          on ? "bg-white/45" : "bg-white/10"
                        )}
                      />
                      <span className="flex items-baseline gap-5">
                        <span
                          className={cn(
                            "w-6 shrink-0 text-xs tabular-nums transition-colors duration-500",
                            on ? "text-gold-pale" : "text-white/35"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-heading text-[clamp(22px,min(2.6vw,4.4vh),40px)] leading-[1.1] font-medium tracking-[-0.015em] transition-all duration-500",
                            on
                              ? "text-white"
                              : "text-white/35 group-hover:translate-x-1 group-hover:text-white/70"
                          )}
                        >
                          {c.name}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid pl-11 transition-all duration-500",
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <span className="overflow-hidden text-[13px] text-white/60">
                          <span className="block pt-1.5">{c.province}</span>
                        </span>
                      </span>
                    </button>
                  </StaggerItem>
                )
              })}
            </div>
          </Stagger>

          {/* Active corridor numbers */}
          <div aria-live="polite" className="lg:pb-[clamp(10px,2vh,18px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease }}
              >
                <p className="text-sm text-white/60">{active.type}</p>
                <div className="mt-3 font-heading text-[clamp(48px,min(6vw,10vh),104px)] leading-none font-semibold tracking-[-0.04em] text-white tabular-nums">
                  <CountUp to={active.potentialMw} duration={1.2} />
                  <span className="ml-2 text-[0.3em] font-normal tracking-normal text-white/60">
                    MW+
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-white/50">Resource potential</p>

                <dl className="mt-[clamp(20px,4vh,36px)] grid grid-cols-2 gap-6">
                  <div>
                    <dt className="text-[13px] text-white/50">Grid</dt>
                    <dd className="mt-1 font-heading text-[clamp(16px,2.2vh,20px)] text-white">
                      {active.grid}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-white/50">PDP8 status</dt>
                    <dd className="mt-1 font-heading text-[clamp(16px,2.2vh,20px)] text-gold-pale">
                      {active.pdp8Status}
                    </dd>
                  </div>
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
