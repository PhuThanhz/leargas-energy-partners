import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

type SeoInput = {
  title?: string
  description?: string
  path?: string
  image?: string
}

/** Build page metadata with consistent canonical URL and Open Graph data. */
export function createMetadata({ title, description, path = "/", image }: SeoInput = {}): Metadata {
  const desc = description ?? siteConfig.description
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: title ?? siteConfig.name,
      description: desc,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      ...(image && { images: [image] }),
    },
    twitter: { card: "summary_large_image", title: title ?? siteConfig.name, description: desc },
  }
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(iso))
}
