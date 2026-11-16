"use client"

import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { arrowButton } from "@/components/shared/arrow-button"
import { heroSlides } from "@/content/media"
import { cn } from "@/lib/utils"

const SLIDE_MS = 6500
const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const slide = heroSlides[index]!

  // Auto-advance quietly; hovering the scene list holds the current scene.
  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [index, paused])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Energy opportunities across Vietnam and Asia-Pacific"
      className="relative isolate -mt-[68px] flex min-h-[100dvh] flex-col overflow-hidden bg-green-deep text-white md:-mt-[76px]"
    >
      {/* Slides: cross-fade with a slow Ken Burns zoom */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_MS / 1000 + 2, ease: "linear" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[center_56%]"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,43,30,.94),rgba(1,66,46,.55)_58%,rgba(1,66,46,.15)),linear-gradient(0deg,rgba(0,43,30,.9),transparent_45%)]"
      />

      <div className="wrap flex flex-1 flex-col justify-between pt-[100px] pb-[clamp(24px,5vh,48px)] md:pt-[125px]">
        {/* Hero Title & Actions */}
        <div className="my-auto py-6">
          <h1 className="font-heading text-[clamp(34px,min(6.2vw,10vh),100px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            <span className="sr-only">
              Where global capital meets Vietnam&apos;s energy future.
            </span>
            <span aria-hidden className="block">
              <BlurWords className="block text-white" words="Where global capital" delay={0.25} />
              <BlurWords className="block text-white" words="meets Vietnam's" delay={0.55} />
              <BlurWords className="block text-gold-pale" words="energy future." delay={0.8} />
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.3 }}
            className="mt-[clamp(24px,5vh,48px)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-[440px] text-[16px] leading-[1.7] text-white/75">
              Boutique advisory connecting international capital with energy in Vietnam and
              Asia-Pacific.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/#services" className={arrowButton({ variant: "gold", size: "md" })}>
                <span>Our capabilities</span>
              </Link>
              <Link href="/#contact" className={arrowButton({ variant: "light", size: "md" })}>
                <span>Start a conversation</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slide index: each scene with a progress rule that drives the carousel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 1 }}
          className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4"
          role="tablist"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-label="Hero scenes"
        >
          {heroSlides.map((s, i) => {
            const active = i === index
            return (
              <button
                key={s.caption}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setIndex(i)}
                className="group cursor-pointer text-left"
              >
                <span
                  className={cn(
                    "block h-px transition-colors duration-700",
                    active ? "bg-white/70" : "bg-white/20 group-hover:bg-white/40"
                  )}
                />
                <span className="mt-4 flex items-baseline gap-3">
                  <span
                    className={cn(
                      "text-xs tabular-nums transition-colors duration-500",
                      active ? "text-gold-pale" : "text-white/40"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-[15px] transition-colors duration-500 md:text-base",
                      active ? "text-white" : "text-white/50 group-hover:text-white/80"
                    )}
                  >
                    {s.caption}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-1 block pl-[30px] text-xs transition-all duration-500",
                    active ? "text-white/60 opacity-100" : "text-white/40 opacity-0 md:opacity-100"
                  )}
                >
                  {s.location}
                </span>
              </button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/** Words that rise out of a soft blur one after another – used for the hero headline. */
function BlurWords({
  words,
  className,
  delay = 0,
}: {
  words: string
  className?: string
  delay?: number
}) {
  return (
    <span className={className}>
      {words.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: "0.35em", filter: "blur(14px)" }}
          animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
        >
          {word}
          {i < words.split(" ").length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  )
}
