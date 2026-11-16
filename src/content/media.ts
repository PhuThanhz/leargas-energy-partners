/**
 * Photography used across the site.
 * Remote images are free-licensed Unsplash photos (https://unsplash.com/license),
 * served via next/image. Replace with LÉARGAS's own project photography when available.
 */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`

export type Photo = { src: string; alt: string }

export const photos = {
  sunsetField: { src: "/images/wind.jpg", alt: "Wind turbines across a field at sunset" },
  mistyMountain: {
    src: unsplash("1769939850264-94fea42a301f"),
    alt: "A wind turbine rising above a misty, forested mountain",
  },
  foggyOffshore: {
    src: unsplash("1780226987896-08f39ce84466"),
    alt: "Offshore wind turbines standing in a foggy sea",
  },
  coastline: {
    src: unsplash("1576343331836-1dae5f63375b"),
    alt: "Aerial view of wind turbines along a coastline",
  },
  offshoreBlue: {
    src: unsplash("1771749372003-193cddcc3c6b"),
    alt: "A row of wind turbines in the deep blue ocean",
  },
  offshoreDay: {
    src: unsplash("1654083198752-56ff209c8129"),
    alt: "A group of offshore wind turbines in the ocean",
  },
  fogSunrise: {
    src: unsplash("1615209853186-e4bd66602508"),
    alt: "A wind turbine emerging from fog at sunrise",
  },
  hillside: {
    src: unsplash("1508791290064-c27cc1ef7a9a"),
    alt: "Wind farm spread across rolling green hills",
  },
  duskRidge: {
    src: unsplash("1742777614427-99be659a9edb"),
    alt: "Wind turbines standing on a ridge at dusk",
  },
  aerialGolden: {
    src: unsplash("1600113544677-f5638ddf5a6f"),
    alt: "Wind turbines on farmland at golden hour",
  },
  silhouette: {
    src: unsplash("1565085360602-de694f1d7650"),
    alt: "Wind turbine silhouettes against an evening sky",
  },
  sunsetSky: {
    src: unsplash("1466629437334-b4f6603563c5"),
    alt: "Wind turbines under a dramatic orange sunset",
  },
} satisfies Record<string, Photo>

export const heroSlides = [
  { ...photos.sunsetField, caption: "Onshore wind", location: "Local insight" },
  { ...photos.silhouette, caption: "Highland projects", location: "Long-term vision" },
  { ...photos.coastline, caption: "Nearshore", location: "Vietnam's coastal belt" },
  { ...photos.offshoreDay, caption: "Offshore", location: "The regional frontier" },
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
    ...photos.mistyMountain,
    kicker: "Highlands",
    title: "Complex terrain, strong resource",
    text: "Elevated sites with high capacity factors and complex logistics that reward early diligence.",
    capacity: "100MW – 350MW",
    keyFocus: "Steep-slope transport & Wind resource yield",
    status: "High Capacity Yield",
  },
  {
    ...photos.coastline,
    kicker: "Nearshore",
    title: "Where land meets sea",
    text: "Coastal and intertidal projects – a defining and rapidly advancing segment of Vietnam's pipeline.",
    capacity: "80MW – 400MW",
    keyFocus: "Intertidal foundations & Marine logistics",
    status: "Core Vietnam Asset",
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
    ...photos.duskRidge,
    kicker: "Operating assets",
    title: "Performance on record",
    text: "Operational wind farms where audited generation history, availability and PPA contracts de-risk capital.",
    capacity: "Operational Portfolios",
    keyFocus: "Secondary M&A & Refinancing yield",
    status: "De-risked Cashflow",
  },
  {
    ...photos.fogSunrise,
    kicker: "Development",
    title: "Clarity before commitment",
    text: "Early-stage projects where rigorous feasibility studies and institutional co-investment set the foundation.",
    capacity: "Early to Mid-stage",
    keyFocus: "PDP8 allocation & In-principle approvals",
    status: "Origination Stage",
  },
]
