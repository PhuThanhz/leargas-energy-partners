"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // TODO: report to an error tracking service (e.g. Sentry)
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  )
}
