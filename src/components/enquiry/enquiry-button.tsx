"use client"

import { arrowButton, type ArrowButtonVariants } from "@/components/shared/arrow-button"

import { useEnquiry } from "./enquiry-provider"

type EnquiryButtonProps = ArrowButtonVariants & {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function EnquiryButton({ children, variant, size, className, onClick }: EnquiryButtonProps) {
  const { open } = useEnquiry()
  return (
    <button
      type="button"
      className={arrowButton({ variant, size, className })}
      onClick={() => {
        onClick?.()
        open()
      }}
    >
      <span>{children}</span>
    </button>
  )
}
