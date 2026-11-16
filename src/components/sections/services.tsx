import { Section } from "@/components/shared/section"
import { SectionHeading } from "@/components/shared/section-heading"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { services } from "@/content/services"

export function Services() {
  return (
    <Section id="services" className="bg-muted/30">
      <SectionHeading eyebrow="What we do" title="Our services" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="mb-2 size-8 text-primary" aria-hidden />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  )
}
