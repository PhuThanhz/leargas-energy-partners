/**
 * Photography used across the site.
 * Stored locally in /public/images for high-speed edge delivery.
 */

export type Photo = { src: string; alt: string }

export const photos = {
  sunsetField: { src: "/images/wind.jpg", alt: "Wind turbines across a field at sunset" },
  mistyMountain: {
    src: "/images/misty-mountain.jpg",
    alt: "A wind turbine rising above a misty, forested mountain",
  },
  foggyOffshore: {
    src: "/images/foggy-offshore.jpg",
    alt: "Offshore wind turbines standing in a foggy sea",
  },
  coastline: {
    src: "/images/coastline.jpg",
    alt: "Aerial view of wind turbines along a coastline",
  },
  offshoreBlue: {
    src: "/images/offshore-blue.jpg",
    alt: "A row of wind turbines in the deep blue ocean",
  },
  offshoreDay: {
    src: "/images/offshore-day.jpg",
    alt: "A group of offshore wind turbines in the ocean",
  },
  fogSunrise: {
    src: "/images/fog-sunrise.jpg",
    alt: "A wind turbine emerging from fog at sunrise",
  },
  hillside: {
    src: "/images/hillside.jpg",
    alt: "Wind farm spread across rolling green hills",
  },
  duskRidge: {
    src: "/images/dusk-ridge.jpg",
    alt: "Wind turbines standing on a ridge at dusk",
  },
  aerialGolden: {
    src: "/images/aerial-golden.jpg",
    alt: "Wind turbines on farmland at golden hour",
  },
  silhouette: {
    src: "/images/silhouette.jpg",
    alt: "Wind turbine silhouettes against an evening sky",
  },
  sunsetSky: {
    src: "/images/sunset-sky.jpg",
    alt: "Wind turbines under a dramatic orange sunset",
  },
} satisfies Record<string, Photo>

export const heroSlides = [
  photos.sunsetField,
  photos.silhouette,
  photos.coastline,
  photos.offshoreDay,
]

export interface GallerySlide extends Photo {
  kicker: string
  title: string
  text: string
  capacity: string
  keyFocus: string
  status: string
}

export const gallerySlides: GallerySlide[] = [
  {
    ...photos.hillside,
    kicker: "Onshore",
    title: "Scale on solid ground",
    text: "Utility-scale wind farms where grid access, land clearance and permitting define bankability.",
    capacity: "50MW – 250MW",
    keyFocus: "Land acquisition & 110/220kV Grid Access",
    status: "Active Deployment",
  },
  {
    ...photos.offshoreBlue,
    kicker: "Offshore",
    title: "The next frontier",
    text: "Long-horizon gigawatt opportunities across the region, shaped by marine spatial planning.",
    capacity: "500MW – 2,000MW+",
    keyFocus: "Seabed surveys & Direct PPA framework",
    status: "Strategic Horizon",
  },
  {
    ...photos.aerialGolden,
    kicker: "Utility Solar",
    title: "High-yield ground generation",
    text: "Utility-scale solar farms positioned for DPPA direct power purchase and secondary portfolio transactions.",
    capacity: "30MW – 250MW+",
    keyFocus: "Substation capacity & DPPA off-take contracts",
    status: "Operational & Pipeline",
  },
  {
    ...photos.sunsetSky,
    kicker: "Roof-top Solar",
    title: "Distributed C&I portfolios",
    text: "Commercial & Industrial (C&I) rooftop assets offering immediate cash flow and investment-grade corporate PPAs.",
    capacity: "1MW – 25MW+ Portfolios",
    keyFocus: "Corporate credit risk & Long-term lease structure",
    status: "Active Syndication",
  },
]
