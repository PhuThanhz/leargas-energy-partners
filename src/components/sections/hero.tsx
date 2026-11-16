import Link from "next/link"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container className="max-w-4xl text-center">
        <p className="mb-4 text-sm font-semibold tracking-wider text-primary uppercase">
          Clean energy, delivered
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Powering a sustainable future together
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/#contact" className={buttonVariants({ size: "lg" })}>
            Partner with us
          </Link>
          <Link href="/#projects" className={buttonVariants({ size: "lg", variant: "outline" })}>
            View projects
          </Link>
        </div>
      </Container>
    </section>
  )
}
