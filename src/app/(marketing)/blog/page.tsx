import Link from "next/link"

import { Section } from "@/components/shared/section"
import { SectionHeading } from "@/components/shared/section-heading"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPosts } from "@/lib/api/blog"
import { createMetadata, formatDate } from "@/lib/seo"

export const metadata = createMetadata({
  title: "Blog",
  description: "News and insights from LEARGAS Energy Partners.",
  path: "/blog",
})

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <Section>
      <SectionHeading eyebrow="Insights" title="Blog" />
      {!posts || posts.content.length === 0 ? (
        <p className="text-center text-muted-foreground">Articles are coming soon. Stay tuned!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.content.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full transition hover:ring-primary/40">
                <CardHeader>
                  <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
