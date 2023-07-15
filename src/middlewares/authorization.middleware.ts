import { NextFunction, Request, Response } from "express"
import { createHttpError } from "../helpers"

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next()
  }
  next(createHttpError(401, "No autorizado"))
}
