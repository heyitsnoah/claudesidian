import { z } from 'zod'

import { ValidationError } from './errors.js'

/**
 * Zod schema for a single highlight
 */
export const highlightSchema = z.object({
  id: z.string().min(1),
  location: z.string().optional(),
  note: z.string().optional(),
  text: z.string().min(1),
})

export type Highlight = z.infer<typeof highlightSchema>

/**
 * Zod schema for book export metadata
 */
export const bookMetaSchema = z
  .object({
    totalHighlights: z.number().int().nonnegative().optional(),
    truncatedByCopyright: z.boolean().optional(),
  })
  .optional()

export type BookMeta = z.infer<typeof bookMetaSchema>

/**
 * Zod schema for a complete book export
 */
export const bookExportSchema = z.object({
  author: z.string().optional(),
  bookId: z.string().min(1),
  extractedAt: z.string().datetime(),
  highlights: z.array(highlightSchema),
  meta: bookMetaSchema,
  notebookUrl: z.string().url().optional(),
  source: z.literal('read.amazon.com'),
  title: z.string().min(1),
})

export type BookExport = z.infer<typeof bookExportSchema>

/**
 * Zod schema for an array of book exports
 */
export const bookExportsSchema = z.array(bookExportSchema)

export type BookExports = z.infer<typeof bookExportsSchema>

/**
 * Format Zod error issues into readable error messages
 */
function formatZodError(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.')
    return `${path}: ${issue.message}`
  })
}

/**
 * Parse and validate an array of book exports
 * @throws {ValidationError} if validation fails
 */
export function parseBookExports(data: unknown): BookExports {
  try {
    return bookExportsSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        'Failed to validate book exports',
        formatZodError(error),
      )
    }
    throw error
  }
}

/**
 * Validate a single book export
 */
export function validateBookExport(data: unknown): BookExport {
  try {
    return bookExportSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        'Failed to validate book export',
        formatZodError(error),
      )
    }
    throw error
  }
}
