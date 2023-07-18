import { Request, Response, NextFunction } from "express"
import type { User } from "../types/types"
import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  registerUserService,
  updateUserService,
} from "../services/users.services"
import { isHttpError } from "../helpers"

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, phone_number, username }: User = req.body

    const newUser = await registerUserService({
      email,
      password,
      phone_number,
      username,
    })

    if (isHttpError(newUser)) {
      throw newUser
    }

    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
}

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Eliminar la contraseña del usuario
    const { password, ...userWithoutPassword } = req.user as User

    res.json(userWithoutPassword)
  } catch (error) {
    next(error)
  }
}

export const logoutUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.logOut((err) => err && next(err))

    res.json({ message: "Sesión cerrada" })
  } catch (error) {
    next(error)
  }
}

export const getUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Eliminar la contraseña del usuario
    const { password, ...userWithoutPassword } = req.user as User

    res.json(userWithoutPassword)
  } catch (error) {
    next(error)
  }
}

export const getUsersController = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsersService()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const user = await getUserByIdService(Number(id))

    if (isHttpError(user)) {
      throw user
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { email, password, phone_number, username } = req.body

    const updatedUser = await updateUserService({
      email,
      password,
      phone_number,
      username,
      id: Number(id),
    })

    if (isHttpError(updatedUser)) {
      throw updatedUser
    }

    res.json(updatedUser)
  } catch (err) {
    next(err)
  }
}

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const isDeleted = await deleteUserService(Number(id))

    if (isHttpError(isDeleted)) {
      throw isDeleted
    }

    res.json({ message: "Usuario eliminado" })
  } catch (err) {
    next(err)
  }
}
