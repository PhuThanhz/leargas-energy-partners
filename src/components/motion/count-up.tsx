"use client"

import { animate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/**
 * Counts a number up from zero when it is well inside the viewport (writes to the DOM, no
 * re-renders). With `repeat`, it resets on leaving and counts again every time it returns.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 2.2,
  repeat = false,
  className,
}: {
  to: number
  decimals?: number
  duration?: number
  repeat?: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: !repeat, amount: 1 })
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = format(to, decimals)
      return
    }
    if (!inView) {
      if (repeat) el.textContent = format(0, decimals)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = format(v, decimals)),
    })
    return () => controls.stop()
  }, [inView, reduce, repeat, to, decimals, duration])

  return (
    <span ref={ref} className={className}>
      {format(reduce ? to : 0, decimals)}
    </span>
  )
}
