import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { pool } from "../config"
import { RowDataPacket } from "mysql2"
import { User } from "../types/types"
import { comparePassword, createHttpError } from "../helpers"
import { Request } from "express"

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req: Request, email: string, password: string, done) => {
      try {
        // Buscar al usuario por email en la base de datos
        const [results] = await pool.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE email = ?",
          [email]
        )

        if (results.length === 0) {
          return done(createHttpError(404, "Credenciales inválidas"))
        }

        const user: User = results[0] as User

        // Comparar la contraseña del usuario encontrado con la proporcionada
        const validPassword = await comparePassword(password, user.password)

        if (!validPassword) {
          return done(createHttpError(404, "Credenciales inválidas"))
        }

        // Si el usuario existe y la contraseña es válida, retornar el usuario
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

// Serializar al usuario para almacenarlo en la sesión
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

// Deserializar al usuario para obtener sus datos desde la sesión
passport.deserializeUser(async (id: string, done) => {
  const [results] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  )

  if (results.length === 0) {
    return done(createHttpError(404, "Usuario no encontrado"))
  }

  const user: User = results[0] as User

  return done(null, user)
})

export default passport
