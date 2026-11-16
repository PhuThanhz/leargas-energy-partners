import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email"),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
