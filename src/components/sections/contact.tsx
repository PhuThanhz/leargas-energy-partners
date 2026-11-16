import { ContactForm } from "@/components/sections/contact-form"
import { Section } from "@/components/shared/section"
import { SectionHeading } from "@/components/shared/section-heading"

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk"
        description="Tell us about your project and our team will get back to you."
      />
      <div className="mx-auto max-w-xl">
        <ContactForm />
      </div>
    </Section>
  )
}
