#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import readline from 'node:readline';
import { loadConfig, updateConfig } from './config.js';
import { scrapeAllBooks } from './lib/scraper.js';
import { exportBooksToMarkdown, saveBooksToJSON, loadTemplate } from './lib/renderer.js';
import { formatError, AuthenticationError } from './lib/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.resolve(__dirname, '../../.kindle/cache/all_books.json');
const AUTH_DIR = path.resolve(__dirname, '../../.kindle/auth');
const AUTH_SCRIPT = path.resolve(__dirname, './auth.js');
const CONFIG_PATH = path.resolve(__dirname, '../../.kindle/config.json');

/**
 * Check if authentication exists
 */
async function checkAuthExists() {
  try {
    const stats = await fs.stat(AUTH_DIR);
    if (!stats.isDirectory()) return false;

    // Check if auth directory has files
    const files = await fs.readdir(AUTH_DIR);
    return files.length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if this is the first run (no config file exists)
 */
async function isFirstRun() {
  try {
    await fs.access(CONFIG_PATH);
    return false;
  } catch {
    return true;
  }
}

/**
 * Prompt user for output folder on first run
 */
async function promptForOutputFolder() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('\n📁 Kindle Sync Setup\n');
    console.log('Where would you like to save your Kindle highlights?');
    console.log('(Press Enter to use default: 03_Resources/Kindle Highlights)\n');

    rl.question('Output folder: ', (answer) => {
      rl.close();
      const folder = answer.trim() || '03_Resources/Kindle Highlights';
      resolve(folder);
    });
  });
}

/**
 * Run authentication script
 */
async function runAuth() {
  console.log('🔐 Authentication required. Starting auth flow...\n');

  return new Promise((resolve, reject) => {
    const authProcess = spawn('node', [AUTH_SCRIPT], {
      stdio: 'inherit', // Pass through stdin/stdout/stderr
      cwd: path.dirname(AUTH_SCRIPT),
    });

    authProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Authentication complete! Continuing with sync...\n');
        resolve();
      } else {
        reject(new Error(`Authentication failed with exit code ${code}`));
      }
    });

    authProcess.on('error', (error) => {
      reject(new Error(`Failed to start auth process: ${error.message}`));
    });
  });
}

/**
 * Main sync function
 */
async function sync(options) {
  const {
    all = false,
    limit,
    last,
    force = false,
    books: specificBooks,
    outputFolder,
    headless = false,
  } = options;

  console.log('📚 Kindle Highlights Sync\n');

  // Check if first run and prompt for folder
  const firstRun = await isFirstRun();
  if (firstRun && !outputFolder) {
    const userFolder = await promptForOutputFolder();
    outputFolder = userFolder;
    console.log(`\n✅ Will save highlights to: ${userFolder}\n`);

    // Save the user's choice to config
    await updateConfig({ outputFolder: userFolder });
  } else if (firstRun && outputFolder) {
    // First run with --output flag provided: save to config
    console.log(`📁 First run: saving output folder to config...\n`);
    await updateConfig({ outputFolder });
  }

  // Debug: Log options
  console.log('Options:', { all, limit, last, force, books: specificBooks, outputFolder });
  console.log();

  // Check authentication before proceeding with scraping
  const needsScraping = force || all || specificBooks || !all;
  if (needsScraping) {
    const hasAuth = await checkAuthExists();
    if (!hasAuth) {
      console.log('⚠️  No authentication found.\n');
      await runAuth();
    }
  }

  // Load configuration
  const config = await loadConfig();
  const resolvedOutputFolder = outputFolder || config.outputFolder;

  // Resolve output folder relative to vault root
  const vaultRoot = path.resolve(__dirname, '../../');
  const outputDir = path.resolve(vaultRoot, resolvedOutputFolder);

  console.log(`📁 Output folder: ${resolvedOutputFolder}`);
  console.log(`📄 Template: ${config.templatePath}\n`);

  // Check if we should use cached data or scrape fresh
  let books;
  const useCache = !force && !all && !specificBooks && !limit;

  if (useCache) {
    try {
      console.log('🔍 Checking for cached data...');
      const { loadBooksFromJSON } = await import('./lib/renderer.js');
      books = await loadBooksFromJSON(CACHE_PATH);
      console.log(`✅ Loaded ${books.length} books from cache\n`);
    } catch (error) {
      console.log('📥 No cache found, will scrape fresh data\n');
      books = null;
    }
  }

  // Scrape if no cache or forced
  if (!books) {
    console.log('🌐 Scraping Kindle Notebook...\n');

    // Determine scraping strategy
    // --last requires scraping ALL books to know which are the last N
    const scrapeLimit = all ? undefined : (last ? undefined : limit);

    if (last) {
      console.log(`📋 Will scrape all books, then select last ${last}...\n`);
    } else if (limit) {
      console.log(`📋 Will scrape first ${limit} books...\n`);
    }

    try {
      const result = await scrapeAllBooks({
        limit: scrapeLimit,
        headless,
      });

      books = result.books;

      // If using --last flag, get the last N books instead of first N
      if (last) {
        if (books.length > last) {
          console.log(`\n📚 Selecting last ${last} books from ${books.length} total...\n`);
          books = books.slice(-last);
        } else {
          console.log(`\n📚 Found ${books.length} books (less than ${last} requested)\n`);
        }
      }

      if (result.errors.length > 0) {
        console.warn(`\n⚠️  Failed to scrape ${result.errors.length} book(s):`);
        result.errors.forEach(({ title, error }) => {
          console.warn(`   - ${title}: ${error}`);
        });
      }

      // Save to cache
      console.log('\n💾 Saving to cache...');
      await saveBooksToJSON(books, CACHE_PATH);
      console.log(`   ✅ Cached ${books.length} books`);
    } catch (error) {
      // If authentication error, try to re-auth and retry once
      if (error instanceof AuthenticationError) {
        console.error('\n❌ Authentication expired or invalid.\n');
        await runAuth();
        console.log('\n🔄 Retrying scrape...\n');

        try {
          const result = await scrapeAllBooks({
            limit: scrapeLimit,
            headless,
          });
          books = result.books;

          if (last) {
            if (books.length > last) {
              books = books.slice(-last);
            }
          }

          if (result.errors.length > 0) {
            console.warn(`\n⚠️  Failed to scrape ${result.errors.length} book(s):`);
            result.errors.forEach(({ title, error }) => {
              console.warn(`   - ${title}: ${error}`);
            });
          }

          // Save to cache
          console.log('\n💾 Saving to cache...');
          await saveBooksToJSON(books, CACHE_PATH);
          console.log(`   ✅ Cached ${books.length} books`);
        } catch (retryError) {
          console.error('\n❌ Scraping failed after re-authentication:');
          console.error(formatError(retryError));
          throw retryError;
        }
      } else {
        console.error('\n❌ Scraping failed:');
        console.error(formatError(error));
        throw error;
      }
    }
  }

  if (books.length === 0) {
    console.log('⚠️  No books to sync');
    return;
  }

  // Filter for specific books if requested
  let booksToExport = books;
  if (specificBooks) {
    const bookTitles = specificBooks.split(',').map((t) => t.trim().toLowerCase());
    booksToExport = books.filter((b) =>
      bookTitles.some((title) => b.title.toLowerCase().includes(title))
    );
    console.log(`\n🔍 Filtered to ${booksToExport.length} book(s) matching: ${specificBooks}`);
  }

  // Load template
  console.log('\n📝 Rendering Markdown...');
  const templatePath = path.resolve(vaultRoot, config.templatePath);
  const template = await loadTemplate(templatePath);

  // Export to Markdown
  const result = await exportBooksToMarkdown(booksToExport, outputDir, {
    template,
    overwrite: config.overwrite,
  });

  console.log('\n✅ Sync complete!');
  console.log(`   📝 Written: ${result.written} file(s)`);
  if (result.skipped > 0) {
    console.log(`   ⏭️  Skipped: ${result.skipped} file(s) (already exist)`);
  }
  console.log(`   📁 Location: ${outputDir}`);

  // Update last sync time
  await updateConfig({ lastSync: new Date().toISOString() });

  // TODO: Optionally create index file if config.createIndex is true
  if (config.createIndex) {
    console.log('\n📋 Index file creation not yet implemented');
    console.log('   You can manually create an index by linking to the book notes');
  }
}

/**
 * CLI interface
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('all', {
      alias: 'a',
      description: 'Sync all books (re-scrape everything)',
      type: 'boolean',
      default: false,
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
      description: 'Force re-scrape even if cache exists',
      type: 'boolean',
      default: false,
    })
    .option('books', {
      alias: 'b',
      description: 'Comma-separated list of book titles to sync (partial match)',
      type: 'string',
    })
    .option('output', {
      alias: 'o',
      description: 'Override output folder from config',
      type: 'string',
    })
    .option('headless', {
      description: 'Run browser in headless mode (not recommended - may cause auth issues)',
      type: 'boolean',
      default: false,
    })
    .example('$0', 'Sync using cached data')
    .example('$0 --all', 'Re-scrape all books')
    .example('$0 --limit 5', 'Scrape first 5 books only')
    .example('$0 --last 5', 'Scrape last 5 books only')
    .example('$0 --books "Atomic Habits,Deep Work"', 'Sync specific books')
    .help()
    .alias('h', 'help')
    .parseAsync();

  await sync({
    all: argv.all,
    limit: argv.limit,
    last: argv.last,
    force: argv.force,
    books: argv.books,
    outputFolder: argv.output,
    headless: argv.headless,
  });
}

main().catch((error) => {
  console.error('\n❌ Sync failed:', formatError(error));
  process.exit(1);
});
