"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Transparent over the home and blog heroes; once scrolled it becomes deep-green frosted glass
 * with a hairline. It slips away while reading down and returns as soon as you scroll up.
 * Exposes state via `data-solid` for `group-data-[solid=true]:` styling.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const overHero = pathname === "/" || pathname.startsWith("/blog")
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // Hide after the first screen when scrolling down; reveal on any upward scroll.
      if (y > window.innerHeight * 0.6 && y > lastY.current + 4) setHidden(true)
      else if (y < lastY.current - 4 || y < 80) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const solid = !overHero || scrolled

  return (
    <header
      data-solid={solid}
      className={cn(
        "group sticky top-0 z-40 text-white transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden && "-translate-y-full",
        solid
          ? "bg-[#00241a]/90 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
          : "bg-gradient-to-b from-black/25 to-transparent"
      )}
    >
      {children}
    </header>
  )
}
