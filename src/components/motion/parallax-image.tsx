"use client"

import { motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { useRef } from "react"

import { cn } from "@/lib/utils"

/** Image that drifts slightly slower than the page for a subtle depth effect. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "100vw",
  strength = 12,
  priority,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  /** Max drift as a percentage of the frame height. */
  strength?: number
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-[-15%_0]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  )
}
