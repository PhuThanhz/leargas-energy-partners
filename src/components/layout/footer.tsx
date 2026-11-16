import Link from "next/link"

import { Container } from "@/components/layout/container"
import { Logo } from "@/components/shared/logo"
import { footerNav } from "@/config/navigation"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <address className="space-y-1 text-sm text-muted-foreground not-italic">
          <p>{siteConfig.contact.address}</p>
          <p>
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
              {siteConfig.contact.email}
            </a>
          </p>
          <p>{siteConfig.contact.phone}</p>
        </address>
      </Container>
      <Container className="border-t py-6 text-xs text-muted-foreground">
        <Copyright />
      </Container>
    </footer>
  )
}

async function Copyright() {
  "use cache"
  return (
    <p>
      © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
    </p>
  )
}
