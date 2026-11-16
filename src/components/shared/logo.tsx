import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import logoOnDark from "@/../public/brand/logo-on-dark.png"
import logoOnLight from "@/../public/brand/logo-on-light.png"

/**
 * Official LÉARGAS wordmark (from the brand master in /public/brand).
 * `tone="dark"` = gold/white artwork for green or photographic backgrounds.
 * `tone="light"` = green artwork for ivory/light backgrounds.
 */
export function LogoImage({
  tone = "dark",
  className,
  priority,
}: {
  tone?: "dark" | "light"
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={tone === "dark" ? logoOnDark : logoOnLight}
      alt={siteConfig.name}
      priority={priority}
      sizes="240px"
      className={cn("h-auto w-[156px] md:w-[196px]", className)}
    />
  )
}

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light"
  className?: string
}) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={cn("block", className)}>
      <LogoImage tone={tone} priority />
    </Link>
  )
}

/** The red accent stroke from the É – a forward, upward mark used as a brand motif. */
export function AccentMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-[3px] w-5 shrink-0 -skew-x-[50deg] bg-red", className)}
    />
  )
}
