"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-600 shrink-0" />
        ),
        info: (
          <InfoIcon className="size-5 text-blue-600 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 text-amber-600 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-600 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-[#0f2b20] shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#111827",
          "--normal-border": "#e5e7eb",
          "--border-radius": "14px",
          "--error-bg": "#fef2f2",
          "--error-border": "#fecaca",
          "--error-text": "#991b1b",
          "--success-bg": "#f0fdf4",
          "--success-border": "#bbf7d0",
          "--success-text": "#166534",
          "--warning-bg": "#fffbeb",
          "--warning-border": "#fde68a",
          "--warning-text": "#92400e",
          "--info-bg": "#eff6ff",
          "--info-border": "#bfdbfe",
          "--info-text": "#1e40af",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-sans shadow-xl border text-sm backdrop-blur-md",
          error: "!bg-[#fef2f2] !border-[#fecaca] !text-[#991b1b] [&_[data-title]]:!text-[#991b1b] [&_[data-title]]:!font-semibold [&_[data-description]]:!text-[#b91c1c] [&_[data-icon]]:!text-[#dc2626]",
          success: "!bg-[#f0fdf4] !border-[#bbf7d0] !text-[#166534] [&_[data-title]]:!text-[#166534] [&_[data-title]]:!font-semibold [&_[data-description]]:!text-[#15803d] [&_[data-icon]]:!text-[#16a34a]",
          warning: "!bg-[#fffbeb] !border-[#fde68a] !text-[#92400e] [&_[data-title]]:!text-[#92400e] [&_[data-title]]:!font-semibold [&_[data-description]]:!text-[#b45309] [&_[data-icon]]:!text-[#d97706]",
          info: "!bg-[#eff6ff] !border-[#bfdbfe] !text-[#1e40af] [&_[data-title]]:!text-[#1e40af] [&_[data-title]]:!font-semibold [&_[data-description]]:!text-[#1d4ed8] [&_[data-icon]]:!text-[#2563eb]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
