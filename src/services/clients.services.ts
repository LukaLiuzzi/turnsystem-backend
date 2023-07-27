import { OkPacket, RowDataPacket } from "mysql2"
import { Client, ClientWithId } from "../types/types"
import { createHttpError, hashPassword, isHttpError } from "../helpers"
import { connection } from "../db_connection"

export const getClientsService = async () => {
  try {
    const [clients] = await connection.query("SELECT * FROM clients")
    return clients as ClientWithId[]
  } catch (error) {
    throw createHttpError(500, "Error getting clients")
  }
}

export const getClientByIdService = async (id: number) => {
  try {
    const [client] = await connection.query(
      "SELECT * FROM clients WHERE id = ?",
      [id]
    )

    if ((client as RowDataPacket[]).length === 0) {
      return createHttpError(404, "Cliente no encontrado")
    }

    return (client as RowDataPacket[])[0] as ClientWithId
  } catch (error) {
    throw createHttpError(500, "Error al buscar cliente")
  }
}

export const getClientByEmailService = async (email: string) => {
  try {
    const [client] = await connection.query(
      "SELECT * FROM clients WHERE email = ?",
      [email]
    )

    if ((client as RowDataPacket[]).length === 0) {
      return createHttpError(404, "Cliente no encontrado")
    }

    return (client as RowDataPacket[])[0] as ClientWithId
  } catch (error) {
    throw createHttpError(500, "Error al buscar cliente")
  }
}

export const getClientByPhoneNumberService = async (phone_number: string) => {
  try {
    const [client] = await connection.query(
      "SELECT * FROM clients WHERE phone_number = ?",
      [phone_number]
    )

    if ((client as RowDataPacket[]).length === 0) {
      return createHttpError(404, "Cliente no encontrado")
    }

    return (client as RowDataPacket[])[0] as ClientWithId
  } catch (error) {
    throw createHttpError(500, "Error al buscar cliente")
  }
}

export const registerClientService = async ({
  first_name,
  last_name,
  email,
  phone_number,
  address,
  city,
  notes,
}: Client) => {
  try {
    // Chequeamos que el email no esté registrado
    const [existingClient] = await connection.query(
      "SELECT * FROM clients WHERE email = ?",
      [email]
    )

    if ((existingClient as RowDataPacket[]).length > 0) {
      return createHttpError(400, "El email ya está registrado")
    }

    // Chequeamos que el teléfono no esté registrado
    const [existingClient2] = await connection.query(
      "SELECT * FROM clients WHERE phone_number = ?",
      [phone_number]
    )

    if ((existingClient2 as RowDataPacket[]).length > 0) {
      return createHttpError(400, "El teléfono ya está registrado")
    }

    // Guardamos el cliente en la base de datos
    const [result] = await connection.query(
      "INSERT INTO clients (first_name, last_name, email, phone_number, address, city, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone_number, address, city, notes]
    )

    const { insertId } = result as OkPacket

    return {
      id: insertId,
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      notes,
    } as ClientWithId
  } catch (error) {
    console.error(error)
    throw createHttpError(500, "Error al registrar el cliente")
  }
}
