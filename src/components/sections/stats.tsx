import { Container } from "@/components/layout/container"
import { stats } from "@/content/stats"

export function Stats() {
  return (
    <section className="border-y bg-muted/50 py-12">
      <Container>
        <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="font-heading text-3xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
