import type { HttpError } from "./types"

export function createHttpError(
  statusCode: number,
  message: string
): HttpError {
  return { statusCode, message }
}

export function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  )
}
