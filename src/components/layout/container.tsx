import { cn } from "@/lib/utils"

/** Page-width wrapper matching the brand grid (max 1370px, 6% gutters). */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("wrap", className)} {...props} />
}
