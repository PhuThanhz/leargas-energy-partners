"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheck, Info, AlertTriangle, CircleX, Loader2 } from "lucide-react"

const Toaster = ({ position = "top-right", ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={position}
      icons={{
        success: (
          <CircleCheck className="size-5 text-[#52c41a] shrink-0" />
        ),
        info: (
          <Info className="size-5 text-[#1677ff] shrink-0" />
        ),
        warning: (
          <AlertTriangle className="size-5 text-[#faad14] shrink-0" />
        ),
        error: (
          <CircleX className="size-5 text-[#ff4d4f] shrink-0" />
        ),
        loading: (
          <Loader2 className="size-5 animate-spin text-[#0f2b20] shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#1f1f1f",
          "--normal-border": "#f0f0f0",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast font-sans !bg-white !text-[#1f1f1f] shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12)] border border-[#f0f0f0] rounded-xl p-4 gap-3",
          title: "!text-[#1f1f1f] !font-semibold !text-sm",
          description: "!text-[#595959] !text-xs !mt-0.5",
          error:
            "!bg-white !border-l-4 !border-l-[#ff4d4f] !border-[#ffccc7] [&_[data-title]]:!text-[#cf1322] [&_[data-icon]]:!text-[#ff4d4f] [&_[data-description]]:!text-[#595959]",
          success:
            "!bg-white !border-l-4 !border-l-[#52c41a] !border-[#b7eb8f] [&_[data-title]]:!text-[#237804] [&_[data-icon]]:!text-[#52c41a] [&_[data-description]]:!text-[#595959]",
          warning:
            "!bg-white !border-l-4 !border-l-[#faad14] !border-[#ffe58f] [&_[data-title]]:!text-[#d48806] [&_[data-icon]]:!text-[#faad14] [&_[data-description]]:!text-[#595959]",
          info:
            "!bg-white !border-l-4 !border-l-[#1677ff] !border-[#91caff] [&_[data-title]]:!text-[#0958d9] [&_[data-icon]]:!text-[#1677ff] [&_[data-description]]:!text-[#595959]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
