"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** Sticky table of contents that highlights the section currently being read. */
export function ArticleToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0]!.target.id)
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 text-[13px] font-medium text-ink">In this article</p>
      <ol className="relative border-l border-line">
        {items.map((item) => {
          const on = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-2 pl-4 text-[13px] leading-[1.5] transition-colors duration-300",
                  on
                    ? "border-green text-green"
                    : "border-transparent text-muted-foreground hover:text-ink"
                )}
              >
                {item.title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
