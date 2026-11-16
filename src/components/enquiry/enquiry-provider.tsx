"use client"

import { createContext, use, useState } from "react"

import { EnquiryDialog } from "./enquiry-dialog"

type EnquiryContextValue = { open: () => void }

const EnquiryContext = createContext<EnquiryContextValue | null>(null)

/** Hosts the single "Let's talk" dialog so any button on the page can open it. */
export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <EnquiryContext value={{ open: () => setIsOpen(true) }}>
      {children}
      <EnquiryDialog open={isOpen} onOpenChange={setIsOpen} />
    </EnquiryContext>
  )
}

export function useEnquiry() {
  const ctx = use(EnquiryContext)
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>")
  return ctx
}
