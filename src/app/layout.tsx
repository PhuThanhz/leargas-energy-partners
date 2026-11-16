import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import { MotionProvider } from "@/components/motion/motion-provider"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import "./globals.css"

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const fontHeading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        secureUrl: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
  },
}

export const viewport: Viewport = {
  themeColor: "#01422e",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: "Leargas Energy",
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo-on-dark.png`,
  description: siteConfig.description,
  sameAs: [siteConfig.links.linkedin],
  address: [
    {
      "@type": "PostalAddress",
      addressLocality: "Hanoi",
      addressCountry: "VN",
    },
    {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    {
      "@type": "PostalAddress",
      addressLocality: "Singapore",
      addressCountry: "SG",
    },
  ],
  knowsAbout: [
    "Energy Investment Advisory",
    "Renewable Energy M&A",
    "Vietnam Energy Transition",
    "APAC Infrastructure & Power",
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(fontSans.variable, fontHeading.variable, "h-full antialiased")}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain flex min-h-full flex-col">
        <MotionProvider>{children}</MotionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
