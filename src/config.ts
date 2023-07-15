import dotenv from "dotenv"
import { createPool } from "mysql2/promise"
dotenv.config()

export const PORT = process.env.NODE_DOCKER_PORT || 8080
export const NODE_ENV = process.env.NODE_ENV || "development"
export const SECRET_SESSION =
  process.env.SECRET_SESSION || "dklanglkdjsgn321y1736g8!!re32fj"

export const pool = createPool({
  host: process.env.MYSQL_HOST || "mysqldb",
  port: Number(process.env.MYSQL_DOCKER_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "root",
  database: process.env.MYSQL_DATABASE || "turnsystem",
})
