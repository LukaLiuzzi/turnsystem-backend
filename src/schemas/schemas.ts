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
  address: z.optional(
    z.string().max(70, {
      message: "La dirección debe tener como máximo 70 caracteres",
    })
  ),
  city: z.optional(
    z.string().max(50, {
      message: "La ciudad debe tener como máximo 50 caracteres",
    })
  ),
  notes: z.optional(
    z.string().max(100, {
      message: "Las notas deben tener como máximo 100 caracteres",
    })
  ),
})

export const clientSchemaPartial = clientSchema.partial()

export type ClientSchema = z.infer<typeof clientSchema>

export const turnSchema = z.object({
  client_id: z.number({
    required_error: "El id del cliente es requerido",
  }),
  date: z
    .string({
      required_error: "La fecha es requerida",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD"),
  time: z
    .string({
      required_error: "La hora es requerida",
    })
    .regex(/^\d{2}:\d{2}$/, "La hora debe tener el formato HH:MM"),
  status: z.enum(["Pending", "Confirmed", "Cancelled"], {
    required_error:
      "El estado es requerido y debe ser Pending, Confirmed o Cancelled",
  }),
  service_id: z.number({
    required_error: "El id del servicio es requerido",
  }),
})

export const turnSchemaPartial = turnSchema.partial()

export type TurnSchema = z.infer<typeof turnSchema>

export const loginSchema = z.object({
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
})

export type LoginSchema = z.infer<typeof loginSchema>
