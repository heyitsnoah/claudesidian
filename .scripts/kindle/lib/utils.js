import { createHash } from 'node:crypto'

/**
 * Sanitize a string for use in filenames by replacing invalid characters
 */
export function fileSafe(input) {
  return input.replace(/[\\/:*?"<>|]/g, '_').trim()
}

/**
 * Generate a stable hash-based ID for a highlight
 * Uses text + location to ensure stability across exports
 */
export function generateHighlightId(text, location) {
  const content = location ? `${text}::${location}` : text
  return createHash('sha256').update(content).digest('hex').slice(0, 16)
}

/**
 * Extract ASIN from Amazon Kindle Notebook URL
 * Falls back to slugified title if ASIN not found
 */
export function extractBookId(url, title) {
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
export function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toISOString().split('T')[0]
}

/**
 * Extract author's last name from full author name
 */
function extractLastName(author) {
  if (!author) return 'Unknown'
  const parts = author.trim().split(/\s+/)
  return parts[parts.length - 1] || 'Unknown'
}

/**
 * Create a safe filename from book title and author
 */
export function createBookFilename(title, author) {
  const safeTitle = fileSafe(title)

  if (author) {
    const lastName = extractLastName(author)
    const safeLastName = fileSafe(lastName)
    return `${safeLastName} - ${safeTitle}.md`
  }
  return `${safeTitle}.md`
}
