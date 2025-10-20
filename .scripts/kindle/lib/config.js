/**
 * Configuration for Kindle Notebook scraper
 * Centralizes all selectors and scraping parameters
 */

/**
 * Default configuration for Kindle Notebook scraper
 * These selectors were last verified: 2025-10-18
 *
 * NOTE: Amazon's Kindle Notebook page structure may change.
 * If scraping fails, inspect the page DOM and update these selectors.
 */
export const DEFAULT_SCRAPER_CONFIG = {
  bookSelectors: {
    // Sidebar container with list of books
    container: ['#kp-notebook-library', '.kp-notebook-library'],
    // Individual book items in sidebar (not actual links, but clickable divs)
    links: '.kp-notebook-library-each-book',
  },
  highlightSelectors: {
    // Color is in the class name, e.g., .kp-notebook-highlight-yellow
    colorAttribute: ['.kp-notebook-highlight'],
    // Container for all highlights
    item: ['#kp-notebook-annotations > .a-row.a-spacing-base', '.a-row.a-spacing-base'],
    // Location is in the highlight header
    location: ['#annotationHighlightHeader', '.kp-notebook-metadata'],
    // Note text
    note: ['.kp-notebook-note span#note', '.kp-notebook-note #note', 'span#note'],
    // Highlight text
    text: [
      '.kp-notebook-highlight span#highlight',
      '.kp-notebook-highlight #highlight',
      '#highlight',
    ],
  },
  metadataSelectors: {
    // Author in sidebar
    author: [
      '.kp-notebook-library-each-book p.kp-notebook-searchable',
      'p.kp-notebook-searchable',
    ],
    // Title in sidebar
    title: [
      '.kp-notebook-library-each-book h2.kp-notebook-searchable',
      'h2.kp-notebook-searchable',
    ],
    // Copyright truncation warning
    truncationWarning: [
      '.copyright-export-limit',
      '.kp-notebook-annotations-limit-warning',
    ],
  },
  scraping: {
    maxLazyLoadRounds: 30,
    maxStableRounds: 3,
    pageLoadTimeout: 30000,
    rateLimitBaseDelay: 500,
    rateLimitJitter: 400,
    scrollBaseDelay: 600,
    scrollDelayIncrease: 20,
    scrollJitter: 400,
  },
};

export const NOTEBOOK_URL = 'https://read.amazon.com/notebook';
