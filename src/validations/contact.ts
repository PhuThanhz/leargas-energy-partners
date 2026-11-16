import { z } from "zod"

export const interestOptions = [
  "Market entry into Vietnam / APAC",
  "Acquiring a project or company (buy-side)",
  "Selling a project or stake (sell-side)",
  "Project development support",
  "Capital raising & financing",
  "Finding partners or contractors",
  "Other",
] as const

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid work email"),
  company: z.string().trim().min(2, "Please enter your company").max(120),
  interest: z.enum(interestOptions),
  overview: z
    .string()
    .trim()
    .min(20, "Please add a short overview (at least 20 characters)")
    .max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
