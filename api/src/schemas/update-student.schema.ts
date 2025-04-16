import { z } from "zod"

export const updateStudentSchema = z.object({
  ra: z.string(),
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
})
