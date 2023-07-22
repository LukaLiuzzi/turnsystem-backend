import request, { SuperAgentTest } from "supertest"
import { app } from "../app"
import { User, UserWithId } from "../types/types"
import { connection } from "../db_connection"
import { hashPassword } from "../helpers"
import { server } from ".."

const newUser: User = {
  email: `test${Math.floor(Math.random() * 100)}@test.com`,
  password: "hola1234",
  phone_number: "1234567890",
  username: `test${Math.floor(Math.random() * 100)}`,
}

const existingUser = {
  email: "prueba@prueba.com",
  password: "hola1234",
  phone_number: "1234567890",
  username: "prueba",
  hashedPassword: "",
}

let agent: SuperAgentTest = request.agent(app)

describe("Users", () => {
  beforeAll(async () => {
    // Cargamos los datos de prueba en la base de datos
    await connection.query("DELETE FROM administrators")
    await connection.query("DELETE FROM users")
    existingUser.hashedPassword = await hashPassword(existingUser.password)
    await connection.query(
      "INSERT INTO users SET email = ?, password = ?, phone_number = ?, username = ?",
      [
        existingUser.email,
        existingUser.hashedPassword,
        existingUser.phone_number,
        existingUser.username,
      ]
    )
    await connection.query(
      "INSERT INTO administrators SET user_id = (SELECT id FROM users WHERE email = ?)",
      [existingUser.email]
    )

    // Realizamos el login
    await agent.post("/api/v1/users/login").send({
      email: existingUser.email,
      password: existingUser.password,
    })
  })

  describe("GET /api/v1/users", () => {
    test("should return 200", async () => {
      const response = await agent.get("/api/v1/users")
      expect(response.status).toBe(200)
    })

    test("should return an array of users", async () => {
      const response = await agent.get("/api/v1/users")
      expect(Array.isArray(response.body)).toBe(true)
    })

    test("should return an array of users with the correct properties", async () => {
      const response = await agent.get("/api/v1/users")
      const user = response.body[0]
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("phone_number")
      expect(user).toHaveProperty("username")
    })

    test("should not return the password property", async () => {
      const response = await agent.get("/api/v1/users")
      const user = response.body[0]
      expect(user).not.toHaveProperty("password")
    })

    test("should return an array of users with the correct values", async () => {
      const response = await agent.get("/api/v1/users")
      const user = response.body[0]
      expect(user.id).toEqual(expect.any(Number))
      expect(user.email).toEqual(expect.any(String))
      expect(user.phone_number).toEqual(expect.any(String))
      expect(user.username).toEqual(expect.any(String))
    })
  })

  describe("GET /api/v1/users/user", () => {
    test("should return 200", async () => {
      const response = await agent.get("/api/v1/users/user")
      expect(response.status).toBe(200)
    })

    test("should return an object", async () => {
      const response = await agent.get("/api/v1/users/user")
      expect(typeof response.body).toBe("object")
    })

    test("should return the logged in user", async () => {
      const response = await agent.get("/api/v1/users/user")
      const user = response.body
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("phone_number")
      expect(user).toHaveProperty("username")
    })

    test("should not return the password property", async () => {
      const response = await agent.get("/api/v1/users/user")
      const user = response.body
      expect(user).not.toHaveProperty("password")
    })

    test("should return the correct values", async () => {
      const response = await agent.get("/api/v1/users/user")
      const user = response.body
      expect(user.id).toEqual(expect.any(Number))
      expect(user.email).toEqual(expect.any(String))
      expect(user.phone_number).toEqual(expect.any(String))
      expect(user.username).toEqual(expect.any(String))
    })

    test("should return 401 if not logged in", async () => {
      await agent.post("/api/v1/users/logout")
      const response = await agent.get("/api/v1/users/user")
      expect(response.status).toBe(401)
    })
  })

  describe("POST /api/v1/users/register", () => {
    beforeEach(async () => {
      // Eliminamos el usuario creado
      await connection.query("DELETE FROM users WHERE email = ?", [
        newUser.email,
      ])

      await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
    })

    test("should return 201", async () => {
      const response = await agent.post("/api/v1/users/register").send(newUser)
      expect(response.status).toBe(201)
    })

    test("should return the created user", async () => {
      const response = await agent.post("/api/v1/users/register").send(newUser)
      const user = response.body
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("phone_number")
      expect(user).toHaveProperty("username")
    })

    test("should not return the password property", async () => {
      const response = await agent.post("/api/v1/users/register").send(newUser)
      const user = response.body

      expect(user).not.toHaveProperty("password")
    })

    test("should return the correct values", async () => {
      const response = await agent.post("/api/v1/users/register").send(newUser)
      const user = response.body
      expect(user.id).toEqual(expect.any(Number))
      expect(user.email).toEqual(newUser.email)
      expect(user.phone_number).toEqual(newUser.phone_number)
      expect(user.username).toEqual(newUser.username)
    })

    test("should return 400 if email is missing", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        email: "",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is invalid", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        email: "invalid",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is already in use", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        email: existingUser.email,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is missing", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        password: "",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is too short", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        password: "123",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is too long", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        password: "1234567890123456789012345678901",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if phone_number is missing", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        phone_number: "",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if phone_number is invalid", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        phone_number: "invalid",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if username is missing", async () => {
      const response = await agent.post("/api/v1/users/register").send({
        ...newUser,
        username: "",
      })
      expect(response.status).toBe(400)
    })

    test("should return 401 if not logged in", async () => {
      await agent.post("/api/v1/users/logout")
      const response = await agent.post("/api/v1/users/register").send(newUser)
      expect(response.status).toBe(401)
    })
  })

  describe("POST /api/v1/users/login", () => {
    test("should return 200", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
      expect(response.status).toBe(200)
    })

    test("should return the logged in user", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
      const user = response.body
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("phone_number")
      expect(user).toHaveProperty("username")
    })

    test("should not return the password property", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
      const user = response.body
      expect(user).not.toHaveProperty("password")
    })

    test("should return the correct values", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
      const user = response.body
      expect(user.id).toEqual(expect.any(Number))
      expect(user.email).toEqual(existingUser.email)
      expect(user.phone_number).toEqual(existingUser.phone_number)
      expect(user.username).toEqual(existingUser.username)
    })

    test("should return 400 if email is missing", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: "",
        password: existingUser.password,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is invalid", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: "invalid",
        password: existingUser.password,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is missing", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: "",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is too short", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: "123",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is too long", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: "1234567890123456789012345678901",
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is not registered", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: "fdsg@gds.com",
        password: existingUser.password,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if password is incorrect", async () => {
      const response = await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: "incorrect",
      })
      expect(response.status).toBe(400)
    })
  })

  describe("POST /api/v1/users/logout", () => {
    test("should return 200", async () => {
      const response = await agent.post("/api/v1/users/logout")
      expect(response.status).toBe(200)
    })

    test("should return 401 if not logged in", async () => {
      await agent.post("/api/v1/users/logout")
      const response = await agent.post("/api/v1/users/logout")
      expect(response.status).toBe(401)
    })
  })

  describe("GET /api/v1/users/:id", () => {
    let id: number
    beforeAll(async () => {
      // Nos logueamos
      await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })

      const user = await agent.post("/api/v1/users/register").send(newUser)

      // Guardamos el id en una nueva variable
      id = user.body.id
    })

    test("should return 200", async () => {
      const response = await agent.get(`/api/v1/users/${id}`)
      expect(response.status).toBe(200)
    })

    test("should return an object", async () => {
      const response = await agent.get(`/api/v1/users/${id}`)
      expect(typeof response.body).toBe("object")
    })

    test("should return the user with the given id", async () => {
      const response = await agent.get(`/api/v1/users/${id}`)
      const user = response.body
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("phone_number")
      expect(user).toHaveProperty("username")
    })

    test("should not return the password property", async () => {
      const response = await agent.get(`/api/v1/users/${id}`)
      const user = response.body
      expect(user).not.toHaveProperty("password")
    })

    test("should return the correct values", async () => {
      const response = await agent.get(`/api/v1/users/${id}`)
      const user = response.body
      expect(user.id).toEqual(id)
      expect(user.email).toEqual(newUser.email)
      expect(user.phone_number).toEqual(newUser.phone_number)
      expect(user.username).toEqual(newUser.username)
    })

    test("should return 400 if id is not a number", async () => {
      const response = await agent.get("/api/v1/users/invalid")
      expect(response.status).toBe(400)
    })

    test("should return 404 if user does not exist", async () => {
      const response = await agent.get("/api/v1/users/999999")
      expect(response.status).toBe(404)
    })

    test("should return 401 if not logged in", async () => {
      await agent.post("/api/v1/users/logout")
      const response = await agent.get(`/api/v1/users/${id}`)
      expect(response.status).toBe(401)
    })
  })

  describe("PATCH /api/v1/users/:id", () => {
    beforeAll(async () => {
      await connection.query("DELETE FROM users WHERE email = ?", [
        newUser.email,
      ])
      // Nos logueamos
      await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
    })

    let id: number
    test("should return 200", async () => {
      const user = await agent.post("/api/v1/users/register").send(newUser)
      id = user.body.id
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
      })
      expect(response.status).toBe(200)
    })
    test("should return the updated user", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      const user = response.body
      expect(user).toHaveProperty("id")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("phone_number")
      expect(user).toHaveProperty("username")
    })

    test("should not return the password property", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      const user = response.body
      expect(user).not.toHaveProperty("password")
    })

    test("should return the correct values", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      const user = response.body
      expect(user.id).toEqual(id)
      expect(user.email).toEqual(newUser.email)
      expect(user.phone_number).toEqual(newUser.phone_number)
      expect(user.username).toEqual(newUser.username)
    })

    test("should return 400 if id is not a number", async () => {
      const response = await agent.patch("/api/v1/users/invalid").send({
        email: newUser.email,
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is missing", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: "",
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is invalid", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: "invalid",
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if email is already in use", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: existingUser.email,
      })

      expect(response.status).toBe(400)
    })

    test("should return 400 if phone_number is missing", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: "",
        username: newUser.username,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if phone_number is invalid", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: "invalid",
        username: newUser.username,
      })
      expect(response.status).toBe(400)
    })

    test("should return 400 if username is missing", async () => {
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: newUser.phone_number,
        username: "",
      })
      expect(response.status).toBe(400)
    })

    test("should return 401 if not logged in", async () => {
      await agent.post("/api/v1/users/logout")
      const response = await agent.patch(`/api/v1/users/${id}`).send({
        email: newUser.email,
        phone_number: newUser.phone_number,
        username: newUser.username,
      })
      expect(response.status).toBe(401)
    })
  })

  describe("DELETE /api/v1/users/:id", () => {
    beforeAll(async () => {
      await connection.query("DELETE FROM users WHERE email = ?", [
        newUser.email,
      ])
      // Nos logueamos
      await agent.post("/api/v1/users/login").send({
        email: existingUser.email,
        password: existingUser.password,
      })
    })

    let id: number

    beforeEach(async () => {
      const user = await agent.post("/api/v1/users/register").send(newUser)
      id = user.body.id
    })

    test("should return 200", async () => {
      const response = await agent.delete(`/api/v1/users/${id}`)
      expect(response.status).toBe(200)
    })

    test("should return json with message property", async () => {
      const response = await agent.delete(`/api/v1/users/${id}`)
      expect(response.type).toBe("application/json")
      expect(response.body).toEqual({
        message: "Usuario eliminado",
      })
    })

    test("should not return the password property", async () => {
      const response = await agent.delete(`/api/v1/users/${id}`)
      const user = response.body
      expect(user).not.toHaveProperty("password")
    })

    test("should return 400 if id is not a number", async () => {
      const response = await agent.delete("/api/v1/users/invalid")
      expect(response.status).toBe(400)
    })

    test("should return 404 if user does not exist", async () => {
      const response = await agent.delete("/api/v1/users/999999")
      expect(response.status).toBe(404)
    })

    test("should return 401 if not logged in", async () => {
      await agent.post("/api/v1/users/logout")
      const response = await agent.delete(`/api/v1/users/${id}`)
      expect(response.status).toBe(401)
    })
  })

  afterAll(async () => {
    await connection.query("DELETE FROM administrators")
    await connection.query("DELETE FROM users")
    await connection.end()
    server.close()
  })
})
