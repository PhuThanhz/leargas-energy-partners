/**
 * Editable website content. These defaults are what the site shows until a section is edited
 * in Admin → Website; edits are stored per section in the backend and merged over these.
 */
import { capabilities, services } from "@/content/home"
import { gallerySlides, heroSlides, photos } from "@/content/media"

export interface ImageRef {
  src: string
  alt: string
}

export interface SiteContent {
  navigation: {
    items: { title: string; href: string }[]
  }
  hero: {
    line1: string
    line2: string
    accent: string
    intro: string
    primaryCta: string
    secondaryCta: string
    slides: ImageRef[]
  }
  marquee: {
    items: string[]
  }
  about: {
    title: string
    accent: string
    intro: string
    image: ImageRef
    caption: string
    stats: { value: string; unit: string; label: string }[]
    pillars: { code: string; title: string; description: string }[]
  }
  services: {
    title: string
    accent: string
    intro: string
    items: { title: string; description: string; image: ImageRef; focus?: string }[]
  }
  portfolio: {
    title: string
    accent: string
    intro: string
    slides: { kicker: string; title: string; capacity: string; image: ImageRef }[]
  }
  insights: {
    title: string
    accent: string
    linkLabel: string
  }
  contact: {
    stepsTitle: string
    steps: { title: string; detail: string }[]
    title: string
    accent: string
    buttonLabel: string
    note: string
    image: ImageRef
  }
  footer: {
    line1: string
    line2: string
    accent: string
    description: string
    presence: string[]
    linkedin: string
    image: ImageRef
  }
}

export type SectionKey = keyof SiteContent

const servicePhotos = [
  { ...photos.sunsetSky, focus: "29% 50%" },
  { ...photos.aerialGolden, focus: "80% 50%" },
  { ...photos.hillside, focus: "82% 50%" },
  { ...photos.silhouette, focus: "77% 50%" },
  { ...photos.offshoreDay, focus: "41% 50%" },
  { ...photos.foggyOffshore, focus: "74% 55%" },
]

export const DEFAULT_SITE_CONTENT: SiteContent = {
  navigation: {
    items: [
      { title: "Who we are", href: "/#about" },
      { title: "Services", href: "/#services" },
      { title: "Portfolio", href: "/#portfolio" },
      { title: "Approach", href: "/#approach" },
      { title: "Blog", href: "/blog" },
    ],
  },
  hero: {
    line1: "Where global capital",
    line2: "meets Vietnam's",
    accent: "energy future.",
    intro:
      "Specialist M&A advisory connecting international capital with renewable energy opportunities in Vietnam.",
    primaryCta: "Our capabilities",
    secondaryCta: "Start a conversation",
    slides: heroSlides.map(({ src, alt }) => ({ src, alt })),
  },
  marquee: {
    items: [...capabilities],
  },
  about: {
    title: "Accelerating Vietnam's",
    accent: "wind energy transition.",
    intro: "International capital, connected to Vietnam's best wind assets.",
    image: { ...photos.mistyMountain },
    caption: "Clean energy infrastructure, Vietnam",
    stats: [
      { value: "26–38", unit: "GW", label: "Onshore wind target" },
      { value: "10–15%", unit: "/ year", label: "Electricity demand growth" },
      { value: "10%", unit: "/ year", label: "GDP growth target" },
    ],
    pillars: [
      {
        code: "GLOBAL",
        title: "International Network",
        description:
          "Institutional governance, cross-border capital syndication, and direct access to global funds and DFIs.",
      },
      {
        code: "LOCAL",
        title: "Local Insights",
        description:
          "Decades of relationships with provincial authorities, local developers, and energy regulators.",
      },
    ],
  },
  services: {
    title: "One senior partner for the",
    accent: "entire investment lifecycle.",
    intro:
      "From first regulatory read to commercial operation – engineers, legal and tax advisers coordinated by one accountable partner.",
    items: services.map((s, i) => {
      const { focus, ...image } = servicePhotos[i % servicePhotos.length]!
      return { title: s.title, description: s.description, image, focus }
    }),
  },
  portfolio: {
    title: "From utility-scale onshore",
    accent: "to open ocean waters.",
    intro: "Core renewable segments, each with its own risk and return.",
    slides: gallerySlides.map((s) => ({
      kicker: s.kicker,
      title: s.title,
      capacity: s.capacity,
      image: { src: s.src, alt: s.alt },
    })),
  },
  insights: {
    title: "Perspectives on energy transition.",
    accent: "Clarity for your next mandate.",
    linkLabel: "All insights",
  },
  contact: {
    stepsTitle: "How we work",
    steps: [
      { title: "Discover", detail: "Turn your investment thesis into a clear mandate." },
      { title: "Validate", detail: "Regulatory, grid and land due diligence on the ground." },
      { title: "Transact", detail: "Structuring, negotiation and financial close." },
      { title: "Steward", detail: "Support through operation and refinancing." },
    ],
    title: "Bring us your ambition.",
    accent: "We'll bring the ground truth.",
    buttonLabel: "Start a conversation",
    note: "A confidential conversation with our founding partners.",
    image: { ...photos.sunsetSky },
  },
  footer: {
    line1: "Global perspective.",
    line2: "Local insight.",
    accent: "Lasting value.",
    description:
      "Boutique strategic and investment advisory, connecting international capital with energy across Vietnam.",
    presence: ["Hanoi", "Ho Chi Minh City"],
    linkedin: "https://www.linkedin.com/company/leargasenergy",
    image: { ...photos.silhouette },
  },
}

/**
 * Overlay saved edits on the defaults, one section at a time. Fields missing from an edit
 * (e.g. added in a later release) keep their default; lists are replaced as a whole.
 */
export function mergeSiteContent(
  saved: Partial<Record<string, unknown>> | null | undefined
): SiteContent {
  const result = { ...DEFAULT_SITE_CONTENT } as Record<string, unknown>
  for (const key of Object.keys(DEFAULT_SITE_CONTENT) as SectionKey[]) {
    const edit = saved?.[key]
    if (edit && typeof edit === "object" && !Array.isArray(edit)) {
      result[key] = { ...DEFAULT_SITE_CONTENT[key], ...(edit as object) }
    }
  }
  return result as unknown as SiteContent
}
