import { OkPacket, RowDataPacket } from "mysql2"
import { User, UserWithId } from "../types/types"
import { createHttpError, hashPassword, isHttpError } from "../helpers"
import { connection } from "../db_connection"

export const registerUserService = async ({
  email,
  password,
  phone_number,
  username,
}: User) => {
  try {
    // Verificar si el usuario ya existe
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length > 0) {
      return createHttpError(400, "El usuario ya existe")
    }

    if (!password) return createHttpError(400, "La contraseña es requerida")
    // Hashear contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const [result] = await connection.query<OkPacket>(
      "INSERT INTO users (email, password, phone_number, username) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, phone_number, username]
    )

    const newUser = {
      id: result.insertId,
      email,
      phone_number,
      username,
    }

    return newUser
  } catch (error) {
    throw createHttpError(500, "Error al registrar usuario")
  }
}

export const getUsersService = async () => {
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users"
    )

    // Eliminar la contraseña de los usuarios
    const users: User[] = rows.map((user: RowDataPacket) => {
      const { id, email, phone_number, username } = user
      return { id, email, phone_number, username }
    })

    return users
  } catch (error) {
    throw createHttpError(500, "Error al obtener usuarios")
  }
}

export const getUserByIdService = async (id: number) => {
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    )
    if (rows.length === 0) {
      return createHttpError(404, "Usuario no encontrado")
    }

    // Eliminar la contraseña del usuario
    delete rows[0].password

    return rows[0]
  } catch (error) {
    throw createHttpError(500, "Error al obtener usuario")
  }
}

export const updateUserService = async ({
  email,
  password,
  phone_number,
  username,
  id,
}: UserWithId) => {
  try {
    const user = await getUserByIdService(id)

    if (isHttpError(user)) {
      return user
    }

    // Si hay otro usuario con el mismo email se lanza un error
    if (email && email !== user.email) {
      const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      )

      if (rows.length > 0) {
        return createHttpError(400, "El usuario ya existe")
      }
    }

    // Actualizamos solo los campos que se envían
    const updatedEmail = email || user.email
    const updatedPhoneNumber = phone_number || user.phone_number
    const updatedUsername = username || user.username
    const updatedPassword = password
      ? await hashPassword(password)
      : user.password

    // Actualizar usuario
    await connection.query(
      "UPDATE users SET email = ?, password = ?, phone_number = ?, username = ? WHERE id = ?",
      [updatedEmail, updatedPassword, updatedPhoneNumber, updatedUsername, id]
    )

    const updatedUser = {
      id,
      email: updatedEmail,
      phone_number: updatedPhoneNumber,
      username: updatedUsername,
    }

    return updatedUser
  } catch (error) {
    throw createHttpError(500, "Error al actualizar usuario")
  }
}

export const deleteUserService = async (id: number) => {
  try {
    const [rows] = await connection.query<OkPacket>(
      "DELETE FROM users WHERE id = ?",
      [id]
    )
    if (rows.affectedRows === 0) {
      return createHttpError(404, "Usuario no encontrado")
    }

    return true
  } catch (error) {
    console.log(error)
    throw createHttpError(500, "Error al eliminar usuario")
  }
}
