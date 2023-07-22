import { createPool } from "mysql2/promise"
import {
  MYSQL_DATABASE,
  MYSQL_DOCKER_PORT,
  MYSQL_HOST,
  MYSQL_ROOT_PASSWORD,
  MYSQL_TEST_HOST,
  MYSQL_USER,
  NODE_ENV,
} from "./config"

interface MysqlConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

let config: MysqlConfig = {
  host: process.env.MYSQL_HOST || "mysqldb",
  port: Number(process.env.MYSQL_DOCKER_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "root",
  database: process.env.MYSQL_DATABASE || "turnsystem",
}

if (NODE_ENV === "production") {
  config = {
    host: MYSQL_HOST!,
    port: Number(MYSQL_DOCKER_PORT),
    user: MYSQL_USER!,
    password: MYSQL_ROOT_PASSWORD!,
    database: MYSQL_DATABASE!,
  }
}

if (NODE_ENV === "test") {
  config = {
    host: MYSQL_TEST_HOST || "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "turnsystemtesting",
  }
}

export const connection = createPool(config)

export const closeConnection = async () => {
  if (connection) {
    await connection.end()
  }
}
