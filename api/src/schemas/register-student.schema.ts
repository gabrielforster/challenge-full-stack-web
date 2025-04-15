import { z } from "zod"

export const registerStudentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  cpf: z.string().length(11, { message: "CPF must be 11 digits" }),
  birthDate: z.string().refine((dateString) => {
    const date = new Date(dateString)

    if (date.toString() === "Invalid Date") return false
    return date <= new Date()
  }, { message: "Birth date must be in the past" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
})
