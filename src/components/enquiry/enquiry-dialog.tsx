"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { arrowButton } from "@/components/shared/arrow-button"
import { Eyebrow } from "@/components/shared/eyebrow"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { contactSchema, interestOptions, type ContactInput } from "@/validations/contact"

const fieldClass =
  "w-full rounded-[2px] border border-input bg-white px-3 py-3 text-sm text-ink outline-none transition focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/30 aria-invalid:border-destructive"

export function EnquiryDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { interest: interestOptions[0] },
  })

  async function onSubmit(values: ContactInput) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      toast.error("Something went wrong. Please try again.")
      return
    }
    toast.success("Thank you. We'll be in touch to arrange a confidential conversation.")
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-md bg-paper p-7 text-ink ring-0 sm:max-w-[610px] sm:p-9">
        <DialogHeader className="gap-3">
          <Eyebrow>Start a conversation</Eyebrow>
          <DialogTitle className="font-heading text-[38px] leading-tight font-medium">
            Tell us what comes next.
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Share a short brief – our founders will respond personally and in confidence.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-2 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" error={errors.name?.message}>
              <input
                className={fieldClass}
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
            </Field>
            <Field label="Work email" error={errors.email?.message}>
              <input
                type="email"
                className={fieldClass}
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </Field>
          </div>
          <Field label="Company" error={errors.company?.message}>
            <input
              className={fieldClass}
              autoComplete="organization"
              aria-invalid={!!errors.company}
              {...register("company")}
            />
          </Field>
          <Field label="Area of interest" error={errors.interest?.message}>
            <select className={fieldClass} {...register("interest")}>
              {interestOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Project or investment overview" error={errors.overview?.message}>
            <textarea
              rows={3}
              className={cn(fieldClass, "resize-y")}
              placeholder="Market, project stage, capacity and indicative timeline. Please exclude sensitive information."
              aria-invalid={!!errors.overview}
              {...register("overview")}
            />
          </Field>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Please do not include confidential or commercially sensitive information in this form.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={arrowButton({
              variant: "gold",
              size: "md",
              className: "w-full justify-center",
            })}
          >
            <span>{isSubmitting ? "Sending…" : "Send enquiry"}</span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-[7px] text-xs">
      {label}
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
