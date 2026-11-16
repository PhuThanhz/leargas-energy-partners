import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("font-heading text-lg font-bold tracking-tight", className)}>
      {siteConfig.shortName}
      <span className="font-normal text-muted-foreground"> Energy Partners</span>
    </Link>
  )
}
