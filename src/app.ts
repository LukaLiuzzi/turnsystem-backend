import express, { NextFunction, Request, Response } from "express"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import { isHttpError } from "./helpers"
import { userRouter } from "./routes/users.routes"

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors())
app.use(helmet())

app.use("/api/v1/users", userRouter)

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)

  let errorMessage = "An internal error occurred"
  let statusCode = 500

  if (isHttpError(error)) {
    statusCode = error.statusCode
    errorMessage = error.message
  }

  res.status(statusCode).json({ error: errorMessage })
})

export { app }
