import dotenv from "dotenv"
dotenv.config()

export const {
  NODE_ENV,
  PORT: SERVER_PORT,
  SECRET_SESSION: SERVER_SECRET_SESSION,
  MYSQL_HOST,
  MYSQL_TEST_HOST,
  MYSQL_DOCKER_PORT,
  MYSQL_USER,
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE,
} = process.env

export const PORT = Number(SERVER_PORT) || 8080
export const SECRET_SESSION =
  process.env.SECRET_SESSION || "dklanglkdjsgn321y1736g8!!re32fj"
