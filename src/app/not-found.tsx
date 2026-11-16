import Link from "next/link"

import { arrowButton } from "@/components/shared/arrow-button"
import { LogoImage } from "@/components/shared/logo"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-green-deep px-6 py-24 text-center text-white">
      <LogoImage className="w-[200px]" />
      <p className="mt-6 eyebrow text-gold">404 / Page not found</p>
      <h1 className="section-title">This page has moved on.</h1>
      <p className="copy text-white/70">
        The page you are looking for does not exist or is no longer available.
      </p>
      <Link href="/" className={arrowButton({ variant: "gold", size: "md", className: "mt-2" })}>
        <span>Back to home</span>
      </Link>
    </div>
  )
}
