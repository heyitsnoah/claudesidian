/**
 * Custom error types for Kindle sync functionality
 */

/**
 * Base error class for all Kindle export errors
 */
export class KindleExportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error thrown when authentication fails or is missing
 */
export class AuthenticationError extends KindleExportError {}

/**
 * Error thrown when data validation fails
 */
export class ValidationError extends KindleExportError {
  public errors: string[]

  constructor(message: string, errors: string[]) {
    super(message)
    this.errors = errors
  }
}

/**
 * Error thrown when file operations fail
 */
export class FileSystemError extends KindleExportError {
  public path: string

  constructor(message: string, path: string) {
    super(message)
    this.path = path
  }
}

/**
 * Format error for user-friendly display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }
  return String(error)
}
