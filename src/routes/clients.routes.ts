import { Router } from "express"
import { validataSchema } from "../middlewares/validator.middleware"
import { clientSchema, clientSchemaPartial } from "../schemas/schemas"
import { isAuthenticated } from "../middlewares/authorization.middleware"
import {
  getClientsController,
  registerClientController,
  getClientByEmailController,
  getClientByIdController,
  getClientByPhoneNumberController,
} from "../controllers/clients.controllers"

const clientsRouter = Router()

clientsRouter.get("/", isAuthenticated, getClientsController)
clientsRouter.get("/:id", isAuthenticated, getClientByIdController)
clientsRouter.get("/email/:email", isAuthenticated, getClientByEmailController)
clientsRouter.get(
  "/phone_number/:phone_number",
  isAuthenticated,
  getClientByPhoneNumberController
)

clientsRouter.post("/", validataSchema(clientSchema), registerClientController)

export { clientsRouter }
