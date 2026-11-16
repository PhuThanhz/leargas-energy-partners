/** Instant skeleton while an article not prerendered at build time is fetched. */
export default function ArticleLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="-mt-[68px] flex min-h-[78svh] items-end bg-green-deep pt-[140px] pb-20 md:-mt-[76px]">
        <div className="wrap animate-pulse space-y-6">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-14 w-full max-w-[860px] rounded bg-white/10" />
          <div className="h-14 w-full max-w-[600px] rounded bg-white/10" />
        </div>
      </div>
      <span className="sr-only">Loading article…</span>
    </div>
  )
}
