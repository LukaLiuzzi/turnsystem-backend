import { OkPacket, RowDataPacket } from "mysql2"
import { User, UserWithId } from "../types/types"
import { createHttpError, hashPassword, isHttpError } from "../helpers"
import { prisma } from "../db_connection"

export const registerUserService = async ({
  email,
  password,
  phone_number,
  username,
}: User) => {
  try {
    // Verificar si el usuario ya existe
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      return createHttpError(400, "El usuario ya existe")
    }

    if (!password) return createHttpError(400, "La contraseña es requerida")
    // Hashear contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const result = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone_number,
      },
    })

    const newUser = {
      id: result.id,
      email: result.email,
      phone_number: result.phone_number,
    }

    return newUser
  } catch (error) {
    throw createHttpError(500, "Error al registrar usuario")
  }
}

export const getUsersService = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone_number: true,
      },
    })

    return users
  } catch (error) {
    throw createHttpError(500, "Error al obtener usuarios")
  }
}

export const getUserByIdService = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
      },
    })

    if (!user) {
      return createHttpError(404, "Usuario no encontrado")
    }

    return user
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
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return createHttpError(404, "Usuario no encontrado")
    }

    // Si hay otro usuario con el mismo email se lanza un error
    if (email && email !== user.email) {
      const users = await prisma.user.findMany({
        where: {
          email,
        },
      })

      if (users.length > 0) {
        return createHttpError(400, "El email ya está en uso")
      }
    }

    // Actualizamos solo los campos que se envían
    const updatedEmail = email || user.email
    const updatedPhoneNumber = phone_number || user.phone_number
    const updatedPassword = password
      ? await hashPassword(password)
      : user.password

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: updatedEmail,
        password: updatedPassword,
        phone_number: updatedPhoneNumber,
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
      },
    })

    return updatedUser
  } catch (error) {
    throw createHttpError(500, "Error al actualizar usuario")
  }
}

export const deleteUserService = async (id: number) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
      },
    })

    if (!deletedUser) {
      return createHttpError(404, "Usuario no encontrado")
    }

    return deletedUser
  } catch (error) {
    console.log(error)
    throw createHttpError(500, "Error al eliminar usuario")
  }
}
