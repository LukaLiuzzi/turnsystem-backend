import { OkPacket, RowDataPacket } from "mysql2"
import { Client, ClientWithId } from "../types/types"
import { createHttpError, hashPassword, isHttpError } from "../helpers"
import { prisma } from "../db_connection"
import { HttpError } from "../types"

export const getClientsService = async () => {
  try {
    const clients: Client[] = await prisma.client.findMany({
      select: {
        id: true,
        email: true,
        phone_number: true,
        first_name: true,
        last_name: true,
      },
    })

    return clients
  } catch (error) {
    throw createHttpError(500, "Error getting clients")
  }
}

export const getClientByIdService = async (id: number) => {
  try {
    const client: Client | null = await prisma.client.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return createHttpError(404, "Cliente no encontrado")
    }

    return client
  } catch (error) {
    throw createHttpError(500, "Error al buscar cliente")
  }
}

export const getClientByEmailService = async (email: string) => {
  try {
    const client: Client | null = await prisma.client.findUnique({
      where: {
        email,
      },
    })

    if (!client) {
      return createHttpError(404, "Cliente no encontrado")
    }

    return client
  } catch (error) {
    throw createHttpError(500, "Error al buscar cliente")
  }
}

export const getClientByPhoneNumberService = async (phone_number: string) => {
  try {
    const client: Client | null = await prisma.client.findUnique({
      where: {
        phone_number,
      },
    })

    if (!client) {
      return createHttpError(404, "Cliente no encontrado")
    }

    return client
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
    const client: Client | null = await prisma.client.findUnique({
      where: {
        email,
      },
    })

    if (client) {
      return createHttpError(400, "El email ya está registrado")
    }

    // Chequeamos que el teléfono no esté registrado
    const client2: Client | null = await prisma.client.findUnique({
      where: {
        phone_number,
      },
    })

    if (client2) {
      return createHttpError(400, "El teléfono ya está registrado")
    }

    // Guardamos el cliente en la base de datos
    const result: ClientWithId = await prisma.client.create({
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        address,
        city,
        notes,
      },
    })

    return result
  } catch (error) {
    console.error(error)
    throw createHttpError(500, "Error al registrar el cliente")
  }
}
