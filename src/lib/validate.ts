/**
 * Form validation, shared by every auth screen so the rules cannot drift
 * between sign-up and password reset.
 */

export const MIN_PASSWORD_LENGTH = 8

/** Deliberately permissive. Over-strict email regexes reject real addresses. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isStrongEnough(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH
}
