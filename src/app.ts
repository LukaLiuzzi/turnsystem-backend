import express, { NextFunction, Request, Response } from "express"
import session from "express-session"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import { isHttpError } from "./helpers"
import { userRouter } from "./routes/users.routes"
import { SECRET_SESSION } from "./config"
import passport from "passport"
import morgan from "morgan"

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(helmet())
app.use(morgan("dev"))

// Configuración de sesión
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
)

// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())

// Rutas
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
