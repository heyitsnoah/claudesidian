import { chromium } from 'playwright';
import { AuthenticationError } from './errors.js';
import { generateHighlightId } from './utils.js';
import { DEFAULT_SCRAPER_CONFIG, NOTEBOOK_URL } from './config.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_DIR = path.resolve(__dirname, '../../../.kindle/auth');

/**
 * Launch a persistent browser context using saved authentication
 */
export async function getContext(headless = false) {
  return chromium.launchPersistentContext(AUTH_DIR, {
    headless,
    viewport: { height: 900, width: 1000 },
    // Keep browser in consistent position for both auth and scraping
    args: headless ? [] : ['--window-position=50,50'],
  });
}

/**
 * Verify authentication by checking if we're redirected to signin
 */
export async function ensureAuth(page) {
  console.log(`🔍 Navigating to: ${NOTEBOOK_URL}`);
  await page.goto(NOTEBOOK_URL, { waitUntil: 'networkidle' });
  console.log(`📍 Current URL: ${page.url()}`);

  if (/signin|ap\/signin/i.test(page.url())) {
    throw new AuthenticationError(
      'Not authenticated. Authentication is required to access Kindle highlights.',
      { currentUrl: page.url(), expectedUrl: NOTEBOOK_URL }
    );
  }

  console.log('✅ Authentication verified');
}

/**
 * Discover all books from the sidebar
 */
export async function discoverBooks(page, config = DEFAULT_SCRAPER_CONFIG) {
  console.log('🔍 Discovering books from sidebar...');

  // Wait for notebook container to load
  const containerSelector = config.bookSelectors.container.join(', ');
  await page
    .waitForSelector(containerSelector, {
      timeout: 10000,
    })
    .catch(() => {
      console.warn('⚠️  Could not find notebook container, proceeding anyway...');
    });

  // Extract all book items from sidebar
  const bookSelector = config.bookSelectors.links;
  const books = await page.$$eval(
    bookSelector,
    (elements, selectors) => {
      return elements.map((el) => {
        // ASIN is the ID of the book div
        const asin = el.id || '';

        // Extract title
        let title = 'Unknown';
        for (const selector of selectors.title) {
          const titleEl = el.querySelector(selector);
          if (titleEl?.textContent.trim()) {
            title = titleEl.textContent.trim();
            break;
          }
        }

        // Extract author
        let author;
        for (const selector of selectors.author) {
          const authorEl = el.querySelector(selector);
          if (authorEl?.textContent.trim()) {
            author = authorEl.textContent.trim();
            // Remove "By: " prefix if present
            author = author.replace(/^By:\s*/i, '');
            break;
          }
        }

        return { asin, author, title };
      });
    },
    {
      author: config.metadataSelectors.author,
      title: config.metadataSelectors.title,
    }
  );

  console.log(`📚 Found ${books.length} book(s)`);
  return books.filter((b) => b.asin); // Only return books with valid ASINs
}

/**
 * Click a book in the sidebar and wait for highlights to load
 */
export async function clickBook(page, asin) {
  // Find the book div by ASIN
  // The data-action is on a span, and the anchor is inside it
  const bookDiv = page.locator(`#${asin}`);
  const clickableLink = bookDiv.locator('span[data-action="get-annotations-for-asin"] a');

  await clickableLink.click();

  // Wait for highlights to load
  await page.waitForSelector('#kp-notebook-annotations', { timeout: 5000 }).catch(() => {
    console.warn('⚠️  Annotations container not found, continuing anyway...');
  });

  // Additional wait for content to populate
  await page.waitForTimeout(500);
}

/**
 * Scrape a single book's highlights from the current page (after clicking it)
 */
export async function scrapeBook(page, bookInfo, config = DEFAULT_SCRAPER_CONFIG) {
  const { asin, author, title } = bookInfo;

  // Click the book to load its highlights
  await clickBook(page, asin);

  // Check for copyright truncation warning
  const truncationSelector = config.metadataSelectors.truncationWarning.join(', ');
  const truncated = (await page.locator(truncationSelector).count()) > 0;

  // Extract highlights from the annotations container
  const annotationsContainer = '#kp-notebook-annotations';
  const highlightItems = await page.$$(
    `${annotationsContainer} > .a-row.a-spacing-base`
  );

  const highlights = await Promise.all(
    highlightItems.map(async (item) => {
      // Extract highlight text
      let text = '';
      const highlightTextEl = await item.$('.kp-notebook-highlight #highlight');
      if (highlightTextEl) {
        text = (await highlightTextEl.textContent())?.trim() || '';
      }

      // Extract note text (if present)
      let note;
      const noteTextEl = await item.$('.kp-notebook-note #note');
      if (noteTextEl) {
        note = (await noteTextEl.textContent())?.trim() || undefined;
      }

      // Extract location from metadata
      let location;
      const locationEl = await item.$('#annotationHighlightHeader');
      if (locationEl) {
        const locationText = (await locationEl.textContent())?.trim() || '';
        // Parse "Yellow highlight | Location: 102" to extract location
        const match = /Location:\s*(\S+)/i.exec(locationText);
        if (match) {
          location = match[1];
        }
      }

      // Extract color from highlight class
      let color;
      const highlightDiv = await item.$('.kp-notebook-highlight');
      if (highlightDiv) {
        const className = await highlightDiv.getAttribute('class');
        // Look for color in class name like "kp-notebook-highlight-yellow"
        const colorMatch = className?.match(/kp-notebook-highlight-(\w+)/);
        if (colorMatch) {
          color = colorMatch[1];
        }
      }

      return {
        text,
        note,
        location,
        color,
      };
    })
  );

  // Filter out empty highlights and generate stable IDs
  const validHighlights = highlights
    .filter((h) => h.text.length > 0)
    .map((h) => ({
      ...h,
      id: generateHighlightId(h.text, h.location),
    }));

  const notebookUrl = `${NOTEBOOK_URL}?asin=${asin}`;

  console.log(`✅ Scraped: ${title} (${validHighlights.length} highlights)`);

  return {
    bookId: asin,
    title,
    author: author || undefined,
    source: 'read.amazon.com',
    extractedAt: new Date().toISOString(),
    notebookUrl,
    highlights: validHighlights,
    meta: {
      totalHighlights: validHighlights.length,
      truncatedByCopyright: truncated || undefined,
    },
  };
}

/**
 * Scrape all books from Kindle Notebook
 */
export async function scrapeAllBooks(options = {}) {
  const { limit, headless = false, config = DEFAULT_SCRAPER_CONFIG } = options;

  console.log('📖 Starting Kindle Notebook scraper\n');

  // Launch browser and authenticate
  // Using headed mode by default because Amazon detects headless browsers
  const ctx = await getContext(headless);
  const page = await ctx.newPage();

  try {
    await ensureAuth(page);

    // Discover all books from the sidebar
    const allBooks = await discoverBooks(page, config);

    if (allBooks.length === 0) {
      console.warn('⚠️  No books found. Check selectors or notebook page structure.');
      await ctx.close();
      return { books: [], errors: [] };
    }

    // Apply limit if specified
    const books = limit ? allBooks.slice(0, limit) : allBooks;

    if (limit && allBooks.length > limit) {
      console.log(`📚 Found ${allBooks.length} books, scraping first ${limit}\n`);
    }

    // Scrape each book
    const results = [];
    const errors = [];

    for (let i = 0; i < books.length; i++) {
      const bookInfo = books[i];
      console.log(`\n📄 Processing book ${i + 1}/${books.length}: ${bookInfo.title}`);

      try {
        const book = await scrapeBook(page, bookInfo, config);
        results.push(book);

        // Rate limiting: random delay between books
        if (i < books.length - 1) {
          const delay =
            config.scraping.rateLimitBaseDelay +
            Math.random() * config.scraping.rateLimitJitter;
          await page.waitForTimeout(delay);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`❌ Failed to scrape book: ${errorMsg}`);
        errors.push({ asin: bookInfo.asin, title: bookInfo.title, error: errorMsg });
      }
    }

    await ctx.close();

    return { books: results, errors };
  } catch (error) {
    await ctx.close();
    throw error;
  }
}
