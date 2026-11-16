"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { LogoImage } from "@/components/shared/logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mainNav } from "@/config/navigation"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  // Close the menu when the viewport grows to the desktop breakpoint.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 80rem)")
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation"
        className="-mr-2 flex size-11 items-center justify-center xl:hidden"
      >
        <MenuIcon className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="border-gold/20 bg-green text-white">
        <SheetHeader>
          <SheetTitle>
            <LogoImage className="w-[140px]" />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="flex flex-col px-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 font-serif text-2xl"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
