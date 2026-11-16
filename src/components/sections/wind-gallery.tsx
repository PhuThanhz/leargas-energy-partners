"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react"
import Image from "next/image"
import { useRef, useState } from "react"

import { Reveal, RevealLines } from "@/components/motion/reveal"
import { gallerySlides } from "@/content/media"
import { cn } from "@/lib/utils"

/** Drift speed of the reel, in pixels per second. */
const SPEED = 28
const ease = [0.22, 1, 0.36, 1] as const
const count = gallerySlides.length

/**
 * The wind spectrum as a slowly drifting, endless photo reel (Flickity-style): it glides on its
 * own, can be dragged, pauses on hover, and the tabs / arrows glide it to a given segment.
 */
export function WindGallery() {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const firstCard = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const onScreen = useInView(sectionRef)
  const hovering = useRef(false)
  const busy = useRef(false) // dragging or gliding to a target

  /** Width of one card including its gutter. */
  const step = () => firstCard.current?.offsetWidth ?? 1
  /** Width of one full set of cards (the reel is rendered twice and wraps at this point). */
  const span = () => step() * count

  const wrap = (v: number) => {
    const s = span()
    if (s <= 1) return v
    let w = v % s
    if (w > 0) w -= s
    return w
  }

  useAnimationFrame((_, delta) => {
    if (reduce || !onScreen || hovering.current || busy.current) return
    x.set(wrap(x.get() - (SPEED * delta) / 1000))
  })

  useMotionValueEvent(x, "change", (v) => {
    const i = ((Math.round(-v / step()) % count) + count) % count
    setSelected(i)
  })

  const glideTo = (target: number) => {
    busy.current = true
    animate(x, target, {
      duration: 0.9,
      ease,
      onComplete: () => {
        x.set(wrap(x.get()))
        busy.current = false
      },
    })
  }

  const goTo = (i: number) => {
    const current = x.get()
    // Nearest position showing card i first, moving forward or back by the shortest way.
    const base = -i * step()
    const s = span()
    const options = [base, base - s, base + s]
    const target = options.reduce((a, b) => (Math.abs(b - current) < Math.abs(a - current) ? b : a))
    glideTo(target)
  }

  const nudge = (dir: 1 | -1) => {
    const snapped = Math.round(x.get() / step()) * step()
    glideTo(snapped - dir * step())
  }

  const reel = [...gallerySlides, ...gallerySlides]

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      aria-label="The wind spectrum"
      className="relative section-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,#f7f2e7_0%,#ebe3d2_100%)] py-12 text-ink selection:bg-gold selection:text-ink md:py-16 lg:py-[clamp(28px,5vh,56px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-10 size-[650px] rounded-full bg-[radial-gradient(circle,rgba(249,194,30,0.1)_0%,transparent_70%)]"
      />

      <div className="relative z-10 wrap flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h2 className="shrink-0 font-heading text-[clamp(26px,min(2.8vw,4.6vh),40px)] leading-[1.1] font-bold tracking-[-0.02em]">
          <RevealLines
            lines={[
              "From highland ridges",
              <span key="1" className="inline-block pb-1 text-gold-deep italic">
                to open ocean waters.
              </span>,
            ]}
          />
        </h2>
        <Reveal delay={0.1} className="lg:max-w-[400px] xl:max-w-[440px]">
          <p className="text-[13.5px] leading-[1.65] text-muted-foreground">
            Six wind segments, each with its own risk and return.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="flex items-center gap-4">
          <span className="font-heading text-lg font-semibold text-green tabular-nums">
            {String(selected + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="font-heading text-sm text-muted-foreground tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
          <div className="mx-1 h-4 w-px bg-line" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous segment"
              onClick={() => nudge(-1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-paper text-ink shadow-xs transition-all hover:bg-green hover:text-white"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next segment"
              onClick={() => nudge(1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-paper text-ink shadow-xs transition-all hover:bg-green hover:text-white"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </Reveal>
      </div>

      {/* Segment tabs */}
      <div className="relative z-10 wrap mt-[clamp(16px,3vh,28px)]">
        <div className="flex scrollbar-none items-center gap-6 overflow-x-auto border-b border-line">
          {gallerySlides.map((slide, idx) => (
            <button
              key={slide.kicker}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "relative -mb-px shrink-0 cursor-pointer border-b py-2.5 text-xs font-semibold tracking-wide transition-colors duration-500",
                selected === idx
                  ? "border-green text-green"
                  : "border-transparent text-ink/55 hover:text-ink"
              )}
            >
              {slide.kicker}
            </button>
          ))}
        </div>
      </div>

      {/* Endless drifting reel */}
      <div
        className="relative z-10 mt-[clamp(16px,3vh,28px)] w-full overflow-hidden px-6 md:px-[6%]"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
        aria-roledescription="carousel"
      >
        <motion.div
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDragStart={() => (busy.current = true)}
          onDragEnd={() => {
            x.set(wrap(x.get()))
            busy.current = false
          }}
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
        >
          {reel.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              ref={i === 0 ? firstCard : undefined}
              aria-hidden={i >= count}
              className="w-[88%] shrink-0 pr-6 sm:w-[60%] md:w-[44%] lg:w-[34%] xl:w-[30%]"
            >
              <article
                aria-label={`${(i % count) + 1} of ${count}: ${slide.kicker}`}
                className="group relative h-[clamp(300px,50vh,500px)] overflow-hidden rounded-[4px] bg-green-deep text-white shadow-[0_20px_40px_rgba(0,43,30,0.12)]"
              >
                <Image
                  src={slide.src}
                  alt={i < count ? slide.alt : ""}
                  fill
                  draggable={false}
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 34vw, (min-width: 768px) 44vw, 88vw"
                  className="pointer-events-none object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] select-none group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-deep/90 via-green-deep/10 to-black/20" />

                <div className="absolute inset-x-5 top-5 flex items-center justify-between text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                  <span className="text-xs font-medium">{slide.kicker}</span>
                  <span className="font-heading text-sm tabular-nums">
                    {String((i % count) + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="line-clamp-1 font-heading text-[clamp(18px,2.4vh,22px)] leading-[1.2] font-medium transition-colors duration-300 group-hover:text-gold-pale">
                    {slide.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-white/65 tabular-nums">
                    <span className="h-px w-6 bg-white/30 transition-all duration-500 group-hover:w-10 group-hover:bg-gold-pale" />
                    {slide.capacity}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
