export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24" role="status" aria-live="polite">
      <span className="size-8 animate-spin rounded-full border-2 border-stone-deep border-t-ink" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
