/**
 * Configuration for Kindle Notebook scraper
 * Centralizes all selectors and scraping parameters
 */

export interface BookSelectors {
  container: string // Sidebar container with list of books
  links: string // Individual book items in sidebar (not actual links, but clickable divs)
}

export interface HighlightSelectors {
  item: string // Container for all highlights
  location: string // Location is in the highlight header
  note: string // Note text
  text: string // Highlight text
}

export interface MetadataSelectors {
  author: string // Author in sidebar
  title: string // Title in sidebar
  truncationWarning: string // Copyright truncation warning
}

export interface ScraperConfig {
  bookSelectors: BookSelectors
  highlightSelectors: HighlightSelectors
  metadataSelectors: MetadataSelectors
  scraping: ScrapingConfig
}

export interface ScrapingConfig {
  rateLimitBaseDelay: number
  rateLimitJitter: number
}

/**
 * Default configuration for Kindle Notebook scraper
 * These selectors were last verified: 2025-10-18
 *
 * NOTE: Amazon's Kindle Notebook page structure may change.
 * If scraping fails, inspect the page DOM and update these selectors.
 */
export const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  bookSelectors: {
    container: '#kp-notebook-library', // Sidebar container with list of books
    links: '.kp-notebook-library-each-book', // Individual book items in sidebar (not actual links, but clickable divs)
  },
  highlightSelectors: {
    item: '#kp-notebook-annotations > .a-row.a-spacing-base', // Container for all highlights
    location: '#annotationHighlightHeader', // Location is in the highlight header
    note: '.kp-notebook-note #note', // Note text
    text: '.kp-notebook-highlight #highlight', // Highlight text
  },
  metadataSelectors: {
    author: '.kp-notebook-library-each-book p.kp-notebook-searchable', // Author in sidebar
    title: '.kp-notebook-library-each-book h2.kp-notebook-searchable', // Title in sidebar
    truncationWarning: '.copyright-export-limit', // Copyright truncation warning
  },
  scraping: {
    rateLimitBaseDelay: 500,
    rateLimitJitter: 400,
  },
}

export const NOTEBOOK_URL = 'https://read.amazon.com/notebook'
