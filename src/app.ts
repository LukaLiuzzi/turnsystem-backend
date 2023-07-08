import express from "express"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors())
app.use(helmet())

app.get("/", (req, res) => {
  res.send("Hello World!")
})

export { app }
