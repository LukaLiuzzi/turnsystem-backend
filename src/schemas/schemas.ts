import { z } from "zod"

export const userSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
    })
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre de usuario debe tener como máximo 50 caracteres",
    }),
  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    })
    .max(16, {
      message: "La contraseña debe tener como máximo 16 caracteres",
    }),
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "El email debe ser una dirección de email válida",
    })
    .max(100, {
      message: "El email debe tener como máximo 100 caracteres",
    }),
  phone_number: z
    .string({
      required_error: "El número de teléfono es requerido",
    })
    .min(10, {
      message: "El número de teléfono debe tener al menos 10 caracteres",
    })
    .max(10, {
      message: "El número de teléfono debe tener como máximo 10 caracteres",
    }),
})

export const userSchemaPartial = userSchema.partial()

export type UserSchema = z.infer<typeof userSchema>

export const clientSchema = z.object({
  first_name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre debe tener como máximo 50 caracteres",
    }),
  last_name: z
    .string({
      required_error: "El apellido es requerido",
    })
    .min(3, {
      message: "El apellido debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El apellido debe tener como máximo 50 caracteres",
    }),
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "El email debe ser una dirección de email válida",
    })
    .max(100, {
      message: "El email debe tener como máximo 100 caracteres",
    }),
  phone_number: z
    .string({
      required_error: "El número de teléfono es requerido",
    })
    .min(10, {
      message: "El número de teléfono debe tener al menos 10 caracteres",
    })
    .max(10, {
      message: "El número de teléfono debe tener como máximo 10 caracteres",
    }),
})

export const clientSchemaPartial = clientSchema.partial()

export type ClientSchema = z.infer<typeof clientSchema>
