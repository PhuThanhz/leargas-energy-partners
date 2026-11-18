import { env } from "@/lib/env"

export const siteConfig = {
  name: "LÉARGAS Energy Partners",
  title: "LÉARGAS Energy Partners | Strategic & Investment Advisory · Vietnam & APAC",
  description:
    "A boutique strategic and investment advisory firm connecting international capital with energy opportunities in Vietnam – from market entry and M&A to project delivery.",
  url: env.NEXT_PUBLIC_SITE_URL,
  keywords: [
    "investment advisory Vietnam",
    "energy M&A Vietnam",
    "renewable energy investment APAC",
    "market entry Vietnam",
    "project development advisory",
    "government relations Vietnam",
    "boutique advisory firm",
  ],
  links: {
    linkedin: "https://www.linkedin.com/company/leargasenergy",
  },
  footerNote: "Global perspective. Local insight. Lasting value.",
} as const

export type SiteConfig = typeof siteConfig
