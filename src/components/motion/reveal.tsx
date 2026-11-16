"use client"

import { motion, type HTMLMotionProps } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number
  /** Vertical offset in px the element travels while fading in. */
  y?: number
}

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ delay = 0, y = 32, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Reveals each line from behind a mask – used for large display headings.
 * To style a line, pass it as an element, e.g. `<span className="text-gold">…</span>`.
 *
 * The in-view observer sits on the (unclipped) wrapper; masked children animate via variants.
 */
export function RevealLines({
  lines,
  className,
  delay = 0,
  animateOnMount = false,
}: {
  lines: React.ReactNode[]
  className?: string
  delay?: number
  animateOnMount?: boolean
}) {
  const trigger = animateOnMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }

  return (
    <motion.span
      className={`block ${className ?? ""}`}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: delay } },
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 1.1, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Unmasks its children left-to-right while settling from a slight zoom – for photography. */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease, delay }}
    >
      <motion.div
        className="size-full"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** A hairline rule that draws in from the left when it enters the viewport. */
export function LineDraw({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left ${className ?? "bg-line"}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease, delay }}
    />
  )
}

/** Container whose `StaggerItem` children fade up one after another. */
export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.08,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  step?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
