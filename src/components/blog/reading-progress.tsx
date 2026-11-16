"use client"

import { motion, useScroll, useSpring } from "motion/react"

/** Thin champagne rule under the header that fills as the reader moves through the page. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gold-pale"
    />
  )
}
