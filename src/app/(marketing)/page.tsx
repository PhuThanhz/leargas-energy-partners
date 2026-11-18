import {
  ContactCta,
  ExpertiseSection,
  FirmIdentity,
  Hero,
  Insights,
  Marquee,
  WindGallery,
} from "@/components/sections"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FirmIdentity />
      <ExpertiseSection />
      <WindGallery />
      <Insights />
      <ContactCta />
    </>
  )
}
