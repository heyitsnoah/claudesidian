/**
 * Custom error types for Kindle sync functionality
 */

/**
 * Base error class for all Kindle export errors
 */
export class KindleExportError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
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
  constructor(message, errors, context = {}) {
    super(message, context);
    this.errors = errors;
  }
}

/**
 * Error thrown when file operations fail
 */
export class FileSystemError extends KindleExportError {
  constructor(message, path, context = {}) {
    super(message, { ...context, path });
    this.path = path;
  }
}

/**
 * Format error for user-friendly display
 */
export function formatError(error) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}
