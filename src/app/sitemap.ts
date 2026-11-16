import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { getPosts } from "@/lib/api/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(0, 100)

  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.content.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
