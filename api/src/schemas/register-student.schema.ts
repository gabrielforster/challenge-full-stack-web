import { z } from "zod"

export const registerStudentSchema = z.object({
  ra: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  cpf: z.string().length(11, { message: "CPF must be 11 digits" }),
  birthDate: z.string().refine((dateString) => {
    const date = new Date(dateString)

    if (date.toString() === "Invalid Date") return false
    return date <= new Date()
  }, { message: "Birth date must be in the past" })
})
