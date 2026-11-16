import { cn } from "@/lib/utils"

/** Standard section rhythm; children are placed inside the brand `wrap`. */
export function Section({
  className,
  innerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & { innerClassName?: string }) {
  return (
    <section className={cn("py-[70px] md:py-[100px]", className)} {...props}>
      <div className={cn("wrap", innerClassName)}>{children}</div>
    </section>
  )
}
