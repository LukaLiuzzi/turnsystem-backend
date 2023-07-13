import { Request, Response, NextFunction } from "express"
import { createHttpError } from "../helpers"
import { ZodObject } from "zod"

export const validataSchema =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err: any) {
      const error = err?.errors?.map((err: any) => err?.message)
      next(createHttpError(400, error))
    }
  }
