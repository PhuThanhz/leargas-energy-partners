import Link from "next/link"

import { Container } from "@/components/layout/container"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Logo } from "@/components/shared/logo"
import { buttonVariants } from "@/components/ui/button"
import { mainNav } from "@/config/navigation"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
          <Link href="/#contact" className={buttonVariants({ size: "sm" })}>
            Get in touch
          </Link>
        </nav>
        <MobileNav />
      </Container>
    </header>
  )
}
