import { notFound } from "next/navigation"
import { Suspense } from "react"

import { Container } from "@/components/layout/container"
import { getPostBySlug } from "@/lib/api/blog"
import { formatDate } from "@/lib/seo"

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Container className="max-w-3xl py-16">
      <Suspense fallback={<p className="text-muted-foreground">Loading article…</p>}>
        {params.then(({ slug }) => (
          <PostContent slug={slug} />
        ))}
      </Suspense>
    </Container>
  )
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article>
      <p className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">{post.title}</h1>
      {/* Content comes from our own trusted backend. Sanitise if editors can inject raw HTML. */}
      <div className="mt-8 leading-7" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
