"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Editorial section label: a thin gold rule that draws in, followed by small
 * tracked uppercase text. No pill / border / background.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  accent?: boolean
  dot?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-gold-deep uppercase",
        className
      )}
    >
      <motion.span
        aria-hidden
        className="block h-px w-7 origin-left bg-current"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 0.8, ease }}
      />
      <motion.span
        variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.7, ease, delay: 0.25 }}
      >
        {children}
      </motion.span>
    </motion.div>
  )
}
