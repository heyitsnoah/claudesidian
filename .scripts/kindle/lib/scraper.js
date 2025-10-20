import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

import { DEFAULT_SCRAPER_CONFIG, NOTEBOOK_URL } from './config.js'
import { AuthenticationError } from './errors.js'
import { generateHighlightId } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_DIR = path.resolve(__dirname, '../../../.kindle/auth')

/**
 * Extract text content from an element
 */
async function extractText(item, selector) {
  const el = await item.$(selector)
  return el ? (await el.textContent())?.trim() : undefined
}

/**
 * Launch a persistent browser context using saved authentication
 */
export async function getContext(headless = false) {
  return chromium.launchPersistentContext(AUTH_DIR, {
    headless,
    viewport: { height: 900, width: 1000 },
    // Keep browser in consistent position for both auth and scraping
    args: headless ? [] : ['--window-position=50,50'],
  })
}

/**
 * Verify authentication by checking if we're redirected to signin
 */
export async function ensureAuth(page) {
  console.log(`🔍 Navigating to: ${NOTEBOOK_URL}`)
  await page.goto(NOTEBOOK_URL, { waitUntil: 'networkidle' })
  console.log(`📍 Current URL: ${page.url()}`)

  if (/signin|ap\/signin/i.test(page.url())) {
    throw new AuthenticationError(
      'Not authenticated. Authentication is required to access Kindle highlights.',
    )
  }

  console.log('✅ Authentication verified')
}

/**
 * Discover all books from the sidebar
 */
export async function discoverBooks(page, config = DEFAULT_SCRAPER_CONFIG) {
  console.log('🔍 Discovering books from sidebar...')

  // Wait for notebook container to load
  await page
    .waitForSelector(config.bookSelectors.container, {
      timeout: 10000,
    })
    .catch(() => {
      console.warn(
        '⚠️  Could not find notebook container, proceeding anyway...',
      )
    })

  // Extract all book items from sidebar
  const bookSelector = config.bookSelectors.links
  const books = await page.$$eval(
    bookSelector,
    (elements, selectors) => {
      return elements.map((el) => {
        // ASIN is the ID of the book div
        const asin = el.id || ''

        // Extract title
        const titleEl = el.querySelector(selectors.title)
        const title = titleEl?.textContent.trim() || 'Unknown'

        // Extract author
        const authorEl = el.querySelector(selectors.author)
        let author = authorEl?.textContent.trim()
        if (author) {
          // Remove "By: " prefix if present
          author = author.replace(/^By:\s*/i, '')
        }

        return { asin, author, title }
      })
    },
    {
      author: config.metadataSelectors.author,
      title: config.metadataSelectors.title,
    },
  )

  console.log(`📚 Found ${books.length} book(s)`)
  return books.filter((b) => b.asin) // Only return books with valid ASINs
}

/**
 * Click a book in the sidebar and wait for highlights to load
 */
export async function clickBook(page, asin) {
  // Find the book div by ASIN
  // The data-action is on a span, and the anchor is inside it
  const bookDiv = page.locator(`#${asin}`)
  const clickableLink = bookDiv.locator(
    'span[data-action="get-annotations-for-asin"] a',
  )

  await clickableLink.click()

  // Wait for highlights to load
  await page
    .waitForSelector('#kp-notebook-annotations', { timeout: 5000 })
    .catch(() => {
      console.warn('⚠️  Annotations container not found, continuing anyway...')
    })

  // Additional wait for content to populate
  await page.waitForTimeout(500)
}

/**
 * Scrape a single book's highlights from the current page (after clicking it)
 */
export async function scrapeBook(
  page,
  bookInfo,
  config = DEFAULT_SCRAPER_CONFIG,
) {
  const { asin, author, title } = bookInfo

  // Click the book to load its highlights
  await clickBook(page, asin)

  // Check for copyright truncation warning
  const truncated =
    (await page.locator(config.metadataSelectors.truncationWarning).count()) > 0

  // Extract highlights from the annotations container
  const annotationsContainer = '#kp-notebook-annotations'
  const highlightItems = await page.$$(
    `${annotationsContainer} > .a-row.a-spacing-base`,
  )

  const highlights = await Promise.all(
    highlightItems.map(async (item) => {
      // Extract highlight text
      const text =
        (await extractText(item, '.kp-notebook-highlight #highlight')) || ''

      // Extract note text (if present)
      const note = await extractText(item, '.kp-notebook-note #note')

      // Extract location from metadata
      const locationText = await extractText(item, '#annotationHighlightHeader')
      const location = locationText?.match(/Location:\s*(\S+)/i)?.[1]

      return {
        location,
        note,
        text,
      }
    }),
  )

  // Filter out empty highlights and generate stable IDs
  const validHighlights = highlights
    .filter((h) => h.text.length > 0)
    .map((h) => ({
      ...h,
      id: generateHighlightId(h.text, h.location),
    }))

  const notebookUrl = `${NOTEBOOK_URL}?asin=${asin}`

  console.log(`✅ Scraped: ${title} (${validHighlights.length} highlights)`)

  return {
    author: author || undefined,
    bookId: asin,
    extractedAt: new Date().toISOString(),
    highlights: validHighlights,
    meta: {
      totalHighlights: validHighlights.length,
      truncatedByCopyright: truncated || undefined,
    },
    notebookUrl,
    source: 'read.amazon.com',
    title,
  }
}

/**
 * Scrape all books from Kindle Notebook
 */
export async function scrapeAllBooks(options = {}) {
  const { config = DEFAULT_SCRAPER_CONFIG, headless = false, limit } = options

  console.log('📖 Starting Kindle Notebook scraper\n')

  // Launch browser and authenticate
  // Using headed mode by default because Amazon detects headless browsers
  const ctx = await getContext(headless)
  const page = await ctx.newPage()

  try {
    await ensureAuth(page)

    // Discover all books from the sidebar
    const allBooks = await discoverBooks(page, config)

    if (allBooks.length === 0) {
      console.warn(
        '⚠️  No books found. Check selectors or notebook page structure.',
      )
      await ctx.close()
      return { books: [], errors: [] }
    }

    // Apply limit if specified
    const books = limit ? allBooks.slice(0, limit) : allBooks

    if (limit && allBooks.length > limit) {
      console.log(
        `📚 Found ${allBooks.length} books, scraping first ${limit}\n`,
      )
    }

    // Scrape each book
    const results = []
    const errors = []

    for (let i = 0; i < books.length; i++) {
      const bookInfo = books[i]
      console.log(
        `\n📄 Processing book ${i + 1}/${books.length}: ${bookInfo.title}`,
      )

      try {
        const book = await scrapeBook(page, bookInfo, config)
        results.push(book)

        // Rate limiting: random delay between books
        if (i < books.length - 1) {
          const delay =
            config.scraping.rateLimitBaseDelay +
            Math.random() * config.scraping.rateLimitJitter
          await page.waitForTimeout(delay)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`❌ Failed to scrape book: ${errorMsg}`)
        errors.push({
          asin: bookInfo.asin,
          error: errorMsg,
          title: bookInfo.title,
        })
      }
    }

    await ctx.close()

    return { books: results, errors }
  } catch (error) {
    await ctx.close()
    throw error
  }
}
