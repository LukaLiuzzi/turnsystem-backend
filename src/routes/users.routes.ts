import { Router } from "express"
import { validataSchema } from "../middlewares/validator.middleware"
import { loginSchema, userSchema, userSchemaPartial } from "../schemas/schemas"
import passport from "../libs/passport"
import { isAuthenticated } from "../middlewares/authorization.middleware"
import {
  deleteUserController,
  getUserByIdController,
  getUserController,
  getUsersController,
  loginUserController,
  logoutUserController,
  registerUserController,
  updateUserController,
} from "../controllers/users.controllers"

const userRouter = Router()

// Rutas de autenticación de usuarios

userRouter.post(
  "/register",
  isAuthenticated,
  validataSchema(userSchema),
  registerUserController
)

userRouter.post(
  "/login",
  validataSchema(loginSchema),
  passport.authenticate("local"),
  loginUserController
)

userRouter.post("/logout", isAuthenticated, logoutUserController)

// Rutas de manejo de usuarios
userRouter.get("/user", isAuthenticated, getUserController)

userRouter.get("/", isAuthenticated, getUsersController)

userRouter.get("/:id", isAuthenticated, getUserByIdController)

userRouter.patch(
  "/:id",
  isAuthenticated,
  validataSchema(userSchemaPartial),
  updateUserController
)

userRouter.delete("/:id", isAuthenticated, deleteUserController)

export { userRouter }
