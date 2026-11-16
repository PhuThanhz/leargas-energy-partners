import { cn } from "@/lib/utils"

interface SectionDividerProps {
  chapter: string
  title: string
  tag?: string
  tone?: "light" | "dark"
  className?: string
}

export function SectionDivider({
  chapter,
  title,
  tag = "LÉARGAS MANDATE",
  tone = "light",
  className,
}: SectionDividerProps) {
  const isDark = tone === "dark"

  return (
    <div
      role="separator"
      aria-label={`Chapter ${chapter}: ${title}`}
      className={cn(
        "relative w-full border-y transition-colors duration-300",
        isDark
          ? "border-white/10 bg-[#00160f] text-white/70"
          : "border-line/70 bg-[#f5efe4] text-ink/70",
        className
      )}
    >
      <div className="wrap flex items-center justify-between py-2.5 font-mono text-[10px] tracking-[0.22em] uppercase md:text-[11px]">
        <div className="flex items-center gap-3">
          <span className="flex size-2 items-center justify-center">
            <span className={cn("size-1.5 rotate-45", isDark ? "bg-gold" : "bg-gold-deep")} />
          </span>
          <span className={cn("font-bold", isDark ? "text-white" : "text-ink")}>CH. {chapter}</span>
          <span className="opacity-40">/</span>
          <span className="tracking-[0.18em]">{title}</span>
        </div>

        <div className="hidden items-center gap-3 text-[10px] tracking-[0.25em] opacity-75 sm:flex">
          <span className="size-1 rounded-full bg-red" />
          <span>{tag}</span>
        </div>

        <div className="font-medium tracking-[0.15em] tabular-nums opacity-80">
          <span>SEC // {chapter}</span>
        </div>
      </div>
    </div>
  )
}
