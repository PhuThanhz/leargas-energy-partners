import { capabilities } from "@/content/home"

/** Infinite ticker of capabilities across the investment lifecycle. */
export function Marquee() {
  const row = (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
      {capabilities.map((word) => (
        <li key={word} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-heading text-[clamp(26px,3vw,44px)] leading-none font-normal italic">
            {word}
          </span>
          <span className="text-2xl font-light text-gold/30 select-none">/</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="overflow-hidden border-y border-gold/20 bg-green py-5 text-white/90 md:py-6">
      <p className="sr-only">{capabilities.join(", ")}</p>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  )
}
