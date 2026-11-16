import { EnquiryProvider } from "@/components/enquiry/enquiry-provider"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </EnquiryProvider>
  )
}
