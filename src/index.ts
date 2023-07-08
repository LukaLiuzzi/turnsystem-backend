import { app } from "./app"
import { PORT } from "./config"

try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
} catch (error) {
  console.error(error)
}
