"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import type { NavItem } from "@/types"

/**
 * Desktop navigation. On the home page the link for the section in view is lit (scroll-spy);
 * elsewhere the current page is. A thin champagne rule marks it — no boxes.
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const [section, setSection] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== "/") return
    const ids = items.filter((i) => i.href.startsWith("/#")).map((i) => i.href.slice(2))
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    els.forEach((el) => observer.observe(el))
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) setSection(null)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname, items])

  return (
    <>
      {items.map((item) => {
        const current = item.href.startsWith("/#")
          ? pathname === "/" && section === item.href.slice(2)
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? (item.href.startsWith("/#") ? "location" : "page") : undefined}
            className={cn(
              "group/link relative py-2 tracking-[0.01em] transition-colors duration-300 outline-none hover:text-white focus-visible:text-white",
              current ? "text-white" : "text-white/70"
            )}
          >
            {item.title}
            <span
              className={cn(
                "absolute inset-x-0 bottom-0.5 h-px origin-left bg-gold-pale transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100",
                current ? "scale-x-100" : "scale-x-0"
              )}
            />
          </Link>
        )
      })}
    </>
  )
}
