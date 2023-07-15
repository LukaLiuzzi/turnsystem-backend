import { Router, Request, Response, NextFunction } from "express"
import { pool } from "../config"
import { RowDataPacket, OkPacket } from "mysql2"
import { createHttpError } from "../helpers"
import { validataSchema } from "../middlewares/validator.middleware"
import { loginSchema, userSchema } from "../schemas/schemas"
import passport from "../libs/passport"
import { User } from "../types/types"
import bcrypt from "bcrypt"

const userRouter = Router()

// Rutas de autenticación de usuarios

userRouter.post(
  "/register",
  validataSchema(userSchema),
  async (req, res, next) => {
    try {
      const { email, password, phone_number, username }: User = req.body

      // Verificar si el usuario ya existe
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      )

      if (rows.length > 0) {
        throw createHttpError(400, "El usuario ya existe")
      }

      // Hashear contraseña
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Crear usuario
      const [result] = await pool.query<OkPacket>(
        "INSERT INTO users (email, password, phone_number, username) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, phone_number, username]
      )

      const newUser = {
        id: result.insertId,
        email,
        phone_number,
        username,
      }

      res.json(newUser)
    } catch (err) {
      next(err)
    }
  }
)

userRouter.post(
  "/login",
  validataSchema(loginSchema),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: User, info: any) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return next(createHttpError(400, info.message))
      }

      // Iniciar sesión
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }

        // Eliminar la contraseña del usuario
        const { password, ...userWithoutPassword } = user

        return res.json(userWithoutPassword)
      })
    })(req, res, next)
  }
)

userRouter.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logOut((err) => err && next(err))

  res.json({ message: "Sesión cerrada" })
})

// Rutas de manejo de usuarios

userRouter.get("/", async (_, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users")

    // Eliminar la contraseña de todos los usuarios
    rows.forEach((user) => delete user.password)

    res.json(rows)
  } catch (err) {
    next(err)
  }
})

userRouter.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    )
    if (rows.length === 0) {
      throw createHttpError(404, "Usuario no encontrado")
    }

    // Eliminar la contraseña del usuario
    delete rows[0].password

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

userRouter.put("/:id", async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body
    const [rows] = await pool.query<OkPacket>(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, phone_number = ? WHERE id = ?",
      [first_name, last_name, email, password, phone_number, req.params.id]
    )
    if (rows.affectedRows === 0) {
      throw createHttpError(404, "Usuario no encontrado")
    }
    res.json({ id: Number(req.params.id), ...req.body })
  } catch (err) {
    next(err)
  }
})

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query<OkPacket>(
      "DELETE FROM users WHERE id = ?",
      [req.params.id]
    )
    if (rows.affectedRows === 0) {
      throw createHttpError(404, "Usuario no encontrado")
    }
    res.json({ id: Number(req.params.id) })
  } catch (err) {
    next(err)
  }
})

export { userRouter }
