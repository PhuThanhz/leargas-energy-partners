"use client"

import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { PostCard } from "@/components/blog/post-card"
import type { PostSummary } from "@/types/blog"

export function InsightsSlider({ posts }: { posts: PostSummary[] }) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!embla) return
    setCanScrollPrev(embla.canScrollPrev())
    setCanScrollNext(embla.canScrollNext())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on("select", onSelect).on("reInit", onSelect)
    return () => {
      embla.off("select", onSelect)
    }
  }, [embla, onSelect])

  return (
    <div className="relative mt-[clamp(12px,2.5vh,24px)] w-full">
      <div className="mb-3 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous insight"
            disabled={!canScrollPrev}
            onClick={() => embla?.scrollPrev()}
            className="grid size-8 cursor-pointer place-items-center rounded-full border border-line bg-paper text-ink shadow-xs transition-all hover:bg-green hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next insight"
            disabled={!canScrollNext}
            onClick={() => embla?.scrollNext()}
            className="grid size-8 cursor-pointer place-items-center rounded-full border border-line bg-paper text-ink shadow-xs transition-all hover:bg-green hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={emblaRef}
        className="cursor-grab overflow-visible active:cursor-grabbing"
        aria-roledescription="carousel"
      >
        <div className="-ml-6 flex touch-pan-y">
          {posts.map((post) => (
            <div
              key={post.id}
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-6 sm:basis-[60%] md:basis-[45%] lg:basis-[33.333%]"
            >
              <div className="h-full">
                <PostCard post={post} compact />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
