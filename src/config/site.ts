import { env } from "@/lib/env"

export const siteConfig = {
  name: "LEARGAS Energy Partners",
  shortName: "LEARGAS",
  description:
    "LEARGAS Energy Partners develops, finances and operates clean energy projects that power a sustainable future.",
  url: env.NEXT_PUBLIC_SITE_URL,
  ogImage: "/opengraph-image",
  keywords: ["renewable energy", "solar", "wind", "energy partners", "LEARGAS"],
  contact: {
    email: "info@leargas.com",
    phone: "+00 000 000 000",
    address: "Your office address",
  },
  links: {
    linkedin: "https://www.linkedin.com/",
  },
} as const

export type SiteConfig = typeof siteConfig
