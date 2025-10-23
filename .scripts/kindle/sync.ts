#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import type { BookExports } from './lib/validation.js'

import { loadConfig, updateConfig } from './config.js'
import { AuthenticationError, formatError } from './lib/errors.js'
import {
  exportBooksToMarkdown,
  loadTemplate,
  saveBooksToJSON,
} from './lib/renderer.js'
import { scrapeAllBooks } from './lib/scraper.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_PATH = path.resolve(__dirname, '../../.kindle/cache/all_books.json')
const AUTH_DIR = path.resolve(__dirname, '../../.kindle/auth')
const AUTH_SCRIPT = path.resolve(__dirname, './auth.ts')
const CONFIG_PATH = path.resolve(__dirname, '../../.kindle/config.json')

export interface SyncOptions {
  all?: boolean
  books?: string
  force?: boolean
  headless?: boolean
  last?: number
  limit?: number
  outputFolder?: string
}

interface GetOrScrapeOptions {
  all: boolean
  force: boolean
  headless: boolean
  last?: number
  limit?: number
  specificBooks?: string
}

/**
 * Check if authentication exists
 */
async function checkAuthExists(): Promise<boolean> {
  try {
    const stats = await fs.stat(AUTH_DIR)
    if (!stats.isDirectory()) return false

    // Check if auth directory has files
    const files = await fs.readdir(AUTH_DIR)
    return files.length > 0
  } catch {
    return false
  }
}

/**
 * Check if this is the first run (no config file exists)
 */
async function isFirstRun(): Promise<boolean> {
  try {
    await fs.access(CONFIG_PATH)
    return false
  } catch {
    return true
  }
}

/**
 * Prompt user for output folder on first run
 */
async function promptForOutputFolder(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    console.log('\n📁 Kindle Sync Setup\n')
    console.log('Where would you like to save your Kindle highlights?')
    console.log(
      '(Press Enter to use default: 03_Resources/Kindle Highlights)\n',
    )

    rl.question('Output folder: ', (answer) => {
      rl.close()
      const folder = answer.trim() || '03_Resources/Kindle Highlights'
      resolve(folder)
    })
  })
}

/**
 * Run authentication script
 */
async function runAuth(): Promise<void> {
  console.log('🔐 Authentication required. Starting auth flow...\n')

  return new Promise((resolve, reject) => {
    const authProcess = spawn('tsx', [AUTH_SCRIPT], {
      cwd: path.dirname(AUTH_SCRIPT),
      stdio: 'inherit', // Pass through stdin/stdout/stderr
    })

    authProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Authentication complete! Continuing with sync...\n')
        resolve()
      } else {
        reject(new Error(`Authentication failed with exit code ${code}`))
      }
    })

    authProcess.on('error', (error) => {
      reject(new Error(`Failed to start auth process: ${error.message}`))
    })
  })
}

/**
 * Handle first-run setup: prompt for output folder and save to config
 */
async function ensureFirstRunSetup(
  outputFolder?: string,
): Promise<string | undefined> {
  const firstRun = await isFirstRun()

  if (firstRun && !outputFolder) {
    const userFolder = await promptForOutputFolder()
    console.log(`\n✅ Will save highlights to: ${userFolder}\n`)
    await updateConfig({ outputFolder: userFolder })
    return userFolder
  } else if (firstRun && outputFolder) {
    console.log(`📁 First run: saving output folder to config...\n`)
    await updateConfig({ outputFolder })
    return outputFolder
  }

  return outputFolder
}

/**
 * Get books either from cache or by scraping, with auth retry logic
 */
async function getOrScrapeBooks(
  options: GetOrScrapeOptions,
): Promise<BookExports> {
  const { all, force, headless, last, limit, specificBooks } = options

  // Determine scraping strategy
  const scrapeLimit = all ? undefined : last ? undefined : limit
  const useCache = !force && !all && !specificBooks && !limit

  // Try to use cache first
  if (useCache) {
    try {
      console.log('🔍 Checking for cached data...')
      const { loadBooksFromJSON } = await import('./lib/renderer.js')
      const books = await loadBooksFromJSON(CACHE_PATH)
      console.log(`✅ Loaded ${books.length} books from cache\n`)
      return books
    } catch (_error) {
      console.log('📥 No cache found, will scrape fresh data\n')
    }
  }

  // Scrape fresh data
  console.log('🌐 Scraping Kindle Notebook...\n')

  if (last) {
    console.log(`📋 Will scrape all books, then select last ${last}...\n`)
  } else if (limit) {
    console.log(`📋 Will scrape first ${limit} books...\n`)
  }

  try {
    return await attemptScrape(scrapeLimit, headless, last)
  } catch (error) {
    // If authentication error, try to re-auth and retry once
    if (error instanceof AuthenticationError) {
      console.error('\n❌ Authentication expired or invalid.\n')
      await runAuth()
      console.log('\n🔄 Retrying scrape...\n')

      try {
        return await attemptScrape(scrapeLimit, headless, last)
      } catch (retryError) {
        console.error('\n❌ Scraping failed after re-authentication:')
        console.error(formatError(retryError))
        throw retryError
      }
    } else {
      console.error('\n❌ Scraping failed:')
      console.error(formatError(error))
      throw error
    }
  }
}

/**
 * Attempt to scrape books with proper error handling and caching
 */
async function attemptScrape(
  scrapeLimit: number | undefined,
  headless: boolean,
  last: number | undefined,
): Promise<BookExports> {
  const scrapeOptions: { headless: boolean; limit?: number } = { headless }
  if (scrapeLimit !== undefined) {
    scrapeOptions.limit = scrapeLimit
  }
  const result = await scrapeAllBooks(scrapeOptions)
  let books = result.books

  // If using --last flag, get the last N books instead of first N
  if (last) {
    if (books.length > last) {
      console.log(
        `\n📚 Selecting last ${last} books from ${books.length} total...\n`,
      )
      books = books.slice(-last)
    } else {
      console.log(
        `\n📚 Found ${books.length} books (less than ${last} requested)\n`,
      )
    }
  }

  if (result.errors.length > 0) {
    console.warn(`\n⚠️  Failed to scrape ${result.errors.length} book(s):`)
    result.errors.forEach(({ error, title }) => {
      console.warn(`   - ${title}: ${error}`)
    })
  }

  // Save to cache
  console.log('\n💾 Saving to cache...')
  await saveBooksToJSON(books, CACHE_PATH)
  console.log(`   ✅ Cached ${books.length} books`)

  return books
}

/**
 * Main sync function
 */
async function sync(options: SyncOptions): Promise<void> {
  const {
    all = false,
    books: specificBooks,
    force = false,
    outputFolder: initialOutputFolder,
  } = options

  console.log('📚 Kindle Highlights Sync\n')

  // Handle first-run setup
  const outputFolder = await ensureFirstRunSetup(initialOutputFolder)

  // Check authentication before proceeding with scraping
  const needsScraping = force || all || specificBooks || !all
  if (needsScraping) {
    const hasAuth = await checkAuthExists()
    if (!hasAuth) {
      console.log('⚠️  No authentication found.\n')
      await runAuth()
    }
  }

  // Load configuration
  const config = await loadConfig()
  const resolvedOutputFolder = outputFolder || config.outputFolder

  // Resolve output folder relative to vault root
  const vaultRoot = path.resolve(__dirname, '../../')
  const outputDir = path.resolve(vaultRoot, resolvedOutputFolder)

  console.log(`📁 Output folder: ${resolvedOutputFolder}`)
  console.log(`📄 Template: ${config.templatePath}\n`)

  // Get books from cache or by scraping
  const scrapeOptions: GetOrScrapeOptions = {
    all,
    force,
    headless: options.headless ?? false,
  }
  if (options.last !== undefined) {
    scrapeOptions.last = options.last
  }
  if (options.limit !== undefined) {
    scrapeOptions.limit = options.limit
  }
  if (specificBooks !== undefined) {
    scrapeOptions.specificBooks = specificBooks
  }
  const books = await getOrScrapeBooks(scrapeOptions)

  if (books.length === 0) {
    console.log('⚠️  No books to sync')
    return
  }

  // Filter for specific books if requested
  let booksToExport = books
  if (specificBooks) {
    const bookTitles = specificBooks
      .split(',')
      .map((t) => t.trim().toLowerCase())
    booksToExport = books.filter((b) =>
      bookTitles.some((title) => b.title.toLowerCase().includes(title)),
    )
    console.log(
      `\n🔍 Filtered to ${booksToExport.length} book(s) matching: ${specificBooks}`,
    )
  }

  // Load template
  console.log('\n📝 Rendering Markdown...')
  const templatePath = path.resolve(vaultRoot, config.templatePath)
  const template = await loadTemplate(templatePath)

  // Export to Markdown
  const result = await exportBooksToMarkdown(booksToExport, outputDir, {
    overwrite: config.overwrite,
    template,
  })

  console.log('\n✅ Sync complete!')
  console.log(`   📝 Written: ${result.written} file(s)`)
  if (result.skipped > 0) {
    console.log(`   ⏭️  Skipped: ${result.skipped} file(s) (already exist)`)
  }
  console.log(`   📁 Location: ${outputDir}`)

  // Update last sync time
  await updateConfig({ lastSync: new Date().toISOString() })
}

/**
 * CLI interface
 */
async function main(): Promise<void> {
  const argv = await yargs(hideBin(process.argv))
    .option('all', {
      alias: 'a',
      default: false,
      description: 'Sync all books (re-scrape everything)',
      type: 'boolean',
    })
    .option('limit', {
      alias: 'l',
      description: 'Limit number of books to sync - takes FIRST N books',
      type: 'number',
    })
    .option('last', {
      description: 'Sync last N books instead of first N',
      type: 'number',
    })
    .option('force', {
      alias: 'f',
      default: false,
      description: 'Force re-scrape even if cache exists',
      type: 'boolean',
    })
    .option('books', {
      alias: 'b',
      description:
        'Comma-separated list of book titles to sync (partial match)',
      type: 'string',
    })
    .option('output', {
      alias: 'o',
      description: 'Override output folder from config',
      type: 'string',
    })
    .option('headless', {
      default: false,
      description:
        'Run browser in headless mode (not recommended - may cause auth issues)',
      type: 'boolean',
    })
    .example('$0', 'Sync using cached data')
    .example('$0 --all', 'Re-scrape all books')
    .example('$0 --limit 5', 'Scrape first 5 books only')
    .example('$0 --last 5', 'Scrape last 5 books only')
    .example('$0 --books "Atomic Habits,Deep Work"', 'Sync specific books')
    .help()
    .alias('h', 'help')
    .parseAsync()

  const syncOptions: SyncOptions = {
    all: argv.all,
    force: argv.force,
    headless: argv.headless,
  }
  if (argv.books !== undefined) {
    syncOptions.books = argv.books
  }
  if (argv.last !== undefined) {
    syncOptions.last = argv.last
  }
  if (argv.limit !== undefined) {
    syncOptions.limit = argv.limit
  }
  if (argv.output !== undefined) {
    syncOptions.outputFolder = argv.output
  }
  await sync(syncOptions)
}

main().catch((error: unknown) => {
  console.error('\n❌ Sync failed:', formatError(error))
  process.exit(1)
})
