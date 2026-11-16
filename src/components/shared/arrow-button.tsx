import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Premium luxury button: refined pill geometry, tactile feedback. */
export const arrowButtonVariants = cva(
  "group/btn inline-flex cursor-pointer items-center justify-center rounded-full border font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        gold: "border-gold bg-gold font-semibold text-green-deep shadow-[0_2px_12px_rgba(249,194,30,0.25)] hover:bg-[#ffd54f] hover:shadow-[0_4px_22px_rgba(249,194,30,0.4)]",
        green: "border-green bg-green text-white shadow-sm hover:bg-green-soft",
        light:
          "border-white/25 bg-white/5 text-white backdrop-blur-xs hover:border-white/50 hover:bg-white/15",
        ghost:
          "border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
      },
      size: {
        sm: "gap-1.5 px-4.5 py-1.5 text-xs",
        md: "gap-2 px-6 py-2.5 text-[13px]",
        lg: "gap-2.5 px-7 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "green",
      size: "md",
    },
  }
)

export type ArrowButtonVariants = VariantProps<typeof arrowButtonVariants>

export function arrowButton(props?: ArrowButtonVariants & { className?: string }) {
  return cn(arrowButtonVariants({ variant: props?.variant, size: props?.size }), props?.className)
}
