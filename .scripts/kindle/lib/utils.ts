import { createHash } from 'node:crypto'

/**
 * Sanitize a string for use in filenames by replacing invalid characters
 */
export function fileSafe(input: string): string {
  return input.replace(/[\\/:*?"<>|]/g, '_').trim()
}

/**
 * Generate a stable hash-based ID for a highlight
 * Uses text + location/page to ensure stability across exports
 */
export function generateHighlightId(
  text: string,
  location: string | undefined,
  page?: string | undefined,
): string {
  const positionMarker = location || page
  const content = positionMarker ? `${text}::${positionMarker}` : text
  return createHash('sha256').update(content).digest('hex').slice(0, 16)
}

/**
 * Extract ASIN from Amazon Kindle Notebook URL
 * Falls back to slugified title if ASIN not found
 */
export function extractBookId(url: string, title: string): string {
  const asinMatch = /[?&]asin=([^&]+)/.exec(url)
  if (asinMatch?.[1]) {
    return asinMatch[1]
  }

  // Fallback: slugify title
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50) // Reasonable length limit
}

/**
 * Format date for YAML frontmatter
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toISOString().split('T')[0]
}

/**
 * Extract author's last name from full author name
 * For multiple authors, extracts the last name of the first author:
 * - 3+ authors (with comma): "Juan Rulfo, Gabriel García Márquez, and Douglas J. Weatherford"
 * - 2 authors (with "and"): "Juan Rulfo and Gabriel García Márquez"
 * - Single author: "Juan Rulfo"
 */
function extractLastName(author: string): string {
  if (!author) return 'Unknown'

  let firstAuthor = author.trim()

  // If there's a comma, take everything before the first comma (handles 3+ authors)
  if (firstAuthor.includes(',')) {
    firstAuthor = firstAuthor.split(',')[0].trim()
  }
  // Otherwise, if there's "and", take everything before it (handles 2 authors)
  else if (/\band\b/i.test(firstAuthor)) {
    firstAuthor = firstAuthor.split(/\band\b/i)[0].trim()
  }

  // Extract the last name (last word) from the first author
  const parts = firstAuthor.split(/\s+/)
  return parts[parts.length - 1] || 'Unknown'
}

/**
 * Create a safe filename from book title and author
 */
export function createBookFilename(
  title: string,
  author: string | undefined,
): string {
  const safeTitle = fileSafe(title)

  if (author) {
    const lastName = extractLastName(author)
    const safeLastName = fileSafe(lastName)
    return `${safeLastName} - ${safeTitle}.md`
  }
  return `${safeTitle}.md`
}
