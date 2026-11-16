import { Section } from "@/components/shared/section"
import { SectionHeading } from "@/components/shared/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { projects } from "@/content/projects"

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading eyebrow="Portfolio" title="Featured projects" />
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title}>
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                {project.capacity}
              </Badge>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.location}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {project.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}
