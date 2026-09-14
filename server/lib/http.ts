import type { Response } from 'express'
import type { ApiError } from '../../shared/types'

/**
 * Every failure leaves here in the same shape, so a judge poking at the API
 * from their phone gets something readable rather than an HTML stack trace.
 */
export function fail(res: Response, status: number, error: string, message: string) {
  const body: ApiError = { error, message }
  return res.status(status).json(body)
}

export const CONFLICT = 409
export const NOT_FOUND = 404
export const BAD_REQUEST = 400
