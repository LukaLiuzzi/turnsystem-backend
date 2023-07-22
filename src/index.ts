import { app } from "./app"
import { PORT } from "./config"
import { IncomingMessage, ServerResponse, Server } from "http"

let server: Server<typeof IncomingMessage, typeof ServerResponse>
try {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
} catch (error) {
  console.error(error)
}

export { server }
