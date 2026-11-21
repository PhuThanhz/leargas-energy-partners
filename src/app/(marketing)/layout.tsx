import { EnquiryProvider } from "@/components/enquiry/enquiry-provider"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { getSiteContent } from "@/lib/api/site-content"

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteContent()

  return (
    <EnquiryProvider>
      <Header nav={site.navigation.items} />
      <main className="flex-1">{children}</main>
      <Footer content={site.footer} nav={site.navigation.items} />
    </EnquiryProvider>
  )
}
