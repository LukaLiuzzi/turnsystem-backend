import { Request, Response, NextFunction } from "express"
import type { Client, ClientWithId } from "../types/types"
import {
  getClientsService,
  registerClientService,
  getClientByEmailService,
  getClientByIdService,
  getClientByPhoneNumberService,
} from "../services/clients.services"
import { createHttpError, isHttpError } from "../helpers"

export const getClientsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await getClientsService()

    if (isHttpError(clients)) {
      throw clients
    }

    res.status(200).json(clients)
  } catch (error) {
    next(error)
  }
}

export const getClientByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const client = await getClientByIdService(Number(id))

    if (isHttpError(client)) {
      throw client
    }

    res.status(200).json(client)
  } catch (error) {
    next(error)
  }
}

export const getClientByEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params

    const client = await getClientByEmailService(email)

    if (isHttpError(client)) {
      throw client
    }

    res.status(200).json(client)
  } catch (error) {
    next(error)
  }
}

export const getClientByPhoneNumberController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number } = req.params

    const client = await getClientByPhoneNumberService(phone_number)

    if (isHttpError(client)) {
      throw client
    }

    res.status(200).json(client)
  } catch (error) {
    next(error)
  }
}

export const registerClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      notes,
    }: Client = req.body

    const newClient = await registerClientService({
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      notes,
    })

    if (isHttpError(newClient)) {
      throw newClient
    }

    res.status(201).json(newClient)
  } catch (err) {
    next(err)
  }
}
