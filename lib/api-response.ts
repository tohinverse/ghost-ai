import { NextResponse } from "next/server"

/**
 * Consistent response shapes for every project route handler. Successful
 * responses carry their payload at the top level; failures always carry a
 * single `error` string so clients can branch on status alone.
 */
export interface ApiErrorBody {
  error: string
}

export function jsonOk<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status })
}

export function jsonError(message: string, status: number): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: message }, { status })
}

export const unauthorized = (): NextResponse<ApiErrorBody> => jsonError("Unauthorized", 401)

export const forbidden = (): NextResponse<ApiErrorBody> => jsonError("Forbidden", 403)

export const notFound = (): NextResponse<ApiErrorBody> => jsonError("Not found", 404)

export const badRequest = (message: string): NextResponse<ApiErrorBody> => jsonError(message, 400)

export const conflict = (message: string): NextResponse<ApiErrorBody> => jsonError(message, 409)
