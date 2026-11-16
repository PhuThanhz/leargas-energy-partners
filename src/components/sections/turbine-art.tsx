import { cn } from "@/lib/utils"

/** Line-art wind turbine whose rotor turns slowly (paused for reduced-motion users). */
export function TurbineArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" aria-hidden fill="none" className={cn("text-gold-pale", className)}>
      {/* Tower */}
      <path d="M96 96 L91 316 H109 L104 96 Z" stroke="currentColor" strokeOpacity="0.45" />
      {/* Nacelle */}
      <rect x="92" y="86" width="22" height="12" rx="3" stroke="currentColor" strokeOpacity="0.6" />
      {/* Rotor */}
      <g className="origin-[100px_92px] animate-[spin_14s_linear_infinite] motion-reduce:animate-none">
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            transform={`rotate(${deg} 100 92)`}
            d="M100 92 C 104 70, 106 40, 101 6 C 98 30, 95 60, 100 92 Z"
            stroke="currentColor"
            strokeOpacity="0.7"
            fill="currentColor"
            fillOpacity="0.06"
          />
        ))}
        <circle cx="100" cy="92" r="5" fill="currentColor" fillOpacity="0.9" />
      </g>
      {/* Ground line */}
      <path d="M40 316 H160" stroke="currentColor" strokeOpacity="0.25" />
    </svg>
  )
}
