import Link from "next/link"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"

export function Cta() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Ready to build the future of energy?
        </h2>
        <Link href="/#contact" className={buttonVariants({ size: "lg", variant: "secondary" })}>
          Contact our team
        </Link>
      </Container>
    </section>
  )
}
