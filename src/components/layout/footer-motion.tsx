"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

/** Oversized brand wordmark that rises into place as the footer scrolls in. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none overflow-hidden select-none">
      <motion.p
        style={{ y, opacity }}
        className="bg-gradient-to-b from-white/[0.14] to-white/0 bg-clip-text text-center font-heading text-[clamp(72px,19vw,300px)] leading-[0.8] font-bold tracking-[0.06em] text-transparent"
      >
        LÉARGAS
      </motion.p>
    </div>
  )
}

/** Quiet text control that glides back to the top of the page. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex cursor-pointer items-center gap-3 text-white/60 transition-colors hover:text-white"
    >
      <span className="h-px w-6 bg-white/30 transition-all duration-500 group-hover:w-10 group-hover:bg-gold-pale" />
      Back to top
    </button>
  )
}
