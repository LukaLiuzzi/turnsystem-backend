import { OkPacket, RowDataPacket } from "mysql2"
import { pool } from "../config"
import { User, UserWithId } from "../types/types"
import { createHttpError, hashPassword, isHttpError } from "../helpers"

export const registerUserService = async ({
  email,
  password,
  phone_number,
  username,
}: User) => {
  try {
    // Verificar si el usuario ya existe
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length > 0) {
      return createHttpError(400, "El usuario ya existe")
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password)

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

    return newUser
  } catch (error) {
    throw createHttpError(500, "Error al registrar usuario")
  }
}

export const getUsersService = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users")

    return rows
  } catch (error) {
    throw createHttpError(500, "Error al obtener usuarios")
  }
}

export const getUserByIdService = async (id: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
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

    // Actualizamos solo los campos que se envían
    const updatedEmail = email || user.email
    const updatedPhoneNumber = phone_number || user.phone_number
    const updatedUsername = username || user.username
    const hashedPassword = await hashPassword(password)
    const updatedPassword = password ? hashedPassword : user.password

    // Actualizar usuario
    await pool.query(
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
    const [rows] = await pool.query<OkPacket>(
      "DELETE FROM users WHERE id = ?",
      [id]
    )
    if (rows.affectedRows === 0) {
      return createHttpError(404, "Usuario no encontrado")
    }

    return true
  } catch (error) {
    throw createHttpError(500, "Error al eliminar usuario")
  }
}
