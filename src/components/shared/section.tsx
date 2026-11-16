import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

/** Standard vertical rhythm + anchor id for landing page sections. */
export function Section({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("scroll-mt-20 py-20 sm:py-28", className)} {...props}>
      <Container>{children}</Container>
    </section>
  )
}
