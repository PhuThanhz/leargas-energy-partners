import {
  ContactCta,
  ExpertiseSection,
  FirmIdentity,
  Hero,
  Insights,
  Marquee,
  WindGallery,
} from "@/components/sections"
import { getSiteContent } from "@/lib/api/site-content"

export default async function HomePage() {
  const site = await getSiteContent()

  return (
    <>
      <Hero content={site.hero} />
      <Marquee items={site.marquee.items} />
      <FirmIdentity content={site.about} />
      <ExpertiseSection content={site.services} />
      <WindGallery content={site.portfolio} />
      <Insights content={site.insights} />
      <ContactCta content={site.contact} />
    </>
  )
}
