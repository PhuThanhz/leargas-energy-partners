"use client"

import { useEffect } from "react"

import { arrowButton } from "@/components/shared/arrow-button"

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // TODO: report to an error tracking service (e.g. Sentry)
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="section-title">We couldn&apos;t load this page.</h1>
      <button
        type="button"
        onClick={() => retry()}
        className={arrowButton({ variant: "green", size: "md" })}
      >
        <span>Try again</span>
      </button>
    </div>
  )
}
