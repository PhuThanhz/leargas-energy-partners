"use client"

import { motion } from "motion/react"
import type { CSSProperties } from "react"

const ease = [0.22, 1, 0.36, 1] as const

/** Seconds for the timeline to travel the full width; each milestone lights as it is reached. */
const TRAVEL = 2.4

/** Advisory process: a timeline that draws itself and lights each milestone in turn. */
export function ExecutionSteps({
  title,
  steps,
}: {
  title: string
  steps: { title: string; detail: string }[]
}) {
  const executionSteps = steps.map((s, i) => ({ ...s, step: String(i + 1).padStart(2, "0") }))
  const at = (i: number) => (i / Math.max(executionSteps.length, 1)) * TRAVEL

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      <motion.h3
        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.8, ease }}
        className="font-heading text-[clamp(22px,2.8vh+0.6vw,32px)] leading-tight font-medium text-white"
      >
        {title}
      </motion.h3>

      <div className="relative mt-[clamp(20px,4vh,36px)]">
        {/* Track + travelling progress: vertical on phones/tablets, horizontal on desktop */}
        <div className="absolute top-[5px] bottom-2 left-[5px] w-px bg-white/12 lg:inset-x-0 lg:top-[5px] lg:bottom-auto lg:h-px lg:w-auto" />
        <motion.div
          className="absolute top-[5px] bottom-2 left-[5px] w-px origin-top bg-gold-pale/80 lg:hidden"
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
          transition={{ duration: TRAVEL, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.div
          className="absolute inset-x-0 top-[5px] hidden h-px origin-left bg-gradient-to-r from-gold-pale/80 via-gold-pale to-gold-pale/60 lg:block"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: TRAVEL, ease: "easeInOut", delay: 0.3 }}
        />

        <ol
          className="relative grid gap-x-8 gap-y-9 lg:[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]"
          style={{ "--steps": Math.max(executionSteps.length, 1) } as CSSProperties}
        >
          {executionSteps.map((item, i) => (
            <li key={item.step} className="group relative pl-10 lg:pl-0">
              {/* Milestone dot lights up as the line reaches it */}
              <motion.span
                aria-hidden
                className="absolute top-0 left-0 block size-[11px] rounded-full border border-white/30 bg-[#012a1d] lg:relative"
                variants={{
                  hidden: { borderColor: "rgba(255,255,255,0.3)", backgroundColor: "#012a1d" },
                  show: { borderColor: "#f6e7b4", backgroundColor: "#f6e7b4" },
                }}
                transition={{ duration: 0.4, delay: 0.3 + at(i) }}
              >
                <motion.span
                  className="absolute inset-[-6px] rounded-full border border-gold-pale/50"
                  variants={{
                    hidden: { scale: 0.4, opacity: 0 },
                    show: { scale: [0.4, 1.8], opacity: [0.9, 0] },
                  }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 + at(i) }}
                />
              </motion.span>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.8, ease, delay: 0.4 + at(i) }}
                className="rounded-[4px] transition-colors duration-500 lg:-mx-4 lg:mt-[clamp(16px,3vh,28px)] lg:px-4 lg:py-3 lg:hover:bg-white/[0.04]"
              >
                <span className="block font-heading text-[clamp(40px,7vh,72px)] leading-none font-semibold text-transparent tabular-nums transition-colors duration-500 [-webkit-text-stroke:1px_rgba(246,231,180,0.55)] group-hover:text-gold-pale">
                  {item.step}
                </span>
                <h4 className="mt-3 font-heading text-[19px] font-medium text-white">
                  {item.title}
                </h4>
                <p className="mt-1.5 max-w-[30ch] text-[13px] leading-[1.6] text-white/60">
                  {item.detail}
                </p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  )
}
