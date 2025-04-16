import { z } from "zod"

export const registerStudentSchema = z.object({
  ra: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  cpf: z.string().length(11, { message: "CPF must be 11 digits" }),
})
