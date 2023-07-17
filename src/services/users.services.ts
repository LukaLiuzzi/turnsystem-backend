import { OkPacket, RowDataPacket } from "mysql2"
import { pool } from "../config"
import { User, UserWithId } from "../types/types"
import { createHttpError, hashPassword } from "../helpers"

export const registerUserService = async ({
  email,
  password,
  phone_number,
  username,
}: User) => {
  // Verificar si el usuario ya existe
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )

  if (rows.length > 0) {
    throw createHttpError(400, "El usuario ya existe")
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
}

export const getUsersService = async () => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users")

  return rows
}

export const getUserByIdService = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  )
  if (rows.length === 0) {
    throw createHttpError(404, "Usuario no encontrado")
  }

  // Eliminar la contraseña del usuario
  delete rows[0].password

  return rows[0]
}

export const updateUserService = async ({
  email,
  password,
  phone_number,
  username,
  id,
}: UserWithId) => {
  const user = await getUserByIdService(id)

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
}

export const deleteUserService = async (id: number) => {
  const [rows] = await pool.query<OkPacket>("DELETE FROM users WHERE id = ?", [
    id,
  ])
  if (rows.affectedRows === 0) {
    throw createHttpError(404, "Usuario no encontrado")
  }

  return true
}
