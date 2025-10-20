import Handlebars from 'handlebars';
import { decode } from 'html-entities';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBookFilename, formatDate } from './utils.js';
import { parseBookExports } from './validation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Extract author's last name from full author name
 */
function extractLastName(author) {
  if (!author) return 'Unknown';
  const parts = author.trim().split(/\s+/);
  return parts[parts.length - 1] || 'Unknown';
}

/**
 * Create a Kindle app link for a specific location
 */
function createKindleLink(bookId, location) {
  if (!location) return '';
  // Remove commas from location number
  const cleanLocation = location.replace(/,/g, '');
  return `kindle://book?action=open&asin=${bookId}&location=${cleanLocation}`;
}

/**
 * Register Handlebars helpers
 */
function registerHandlebarsHelpers() {
  // Helper to decode HTML entities
  Handlebars.registerHelper('decode', function (text) {
    return new Handlebars.SafeString(decode(text || ''));
  });

  // Helper to create Kindle app links
  Handlebars.registerHelper('kindleLink', function (bookId, location) {
    return createKindleLink(bookId, location);
  });

  // Helper to format dates
  Handlebars.registerHelper('formatDate', function (date) {
    return formatDate(date);
  });
}

/**
 * Load and compile Handlebars template
 */
export async function loadTemplate(templatePath) {
  // Default template location
  const defaultTemplate = path.resolve(__dirname, '../templates/kindle-note.md.hbs');
  const resolvedPath = templatePath || defaultTemplate;

  const templateSrc = await fs.readFile(resolvedPath, 'utf-8');
  return Handlebars.compile(templateSrc);
}

/**
 * Render a single book to Markdown
 */
export function renderBook(book, template) {
  registerHandlebarsHelpers();
  return template(book);
}

/**
 * Export books to Markdown format using Handlebars template
 */
export async function exportBooksToMarkdown(books, outputDir, options = {}) {
  const {
    templatePath,
    overwrite = false,
    template: precompiledTemplate,
  } = options;

  // Use provided template or load from path
  const template = precompiledTemplate || (await loadTemplate(templatePath));

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  let written = 0;
  let skipped = 0;
  const files = [];

  for (const book of books) {
    // Create filename
    const filename = createBookFilename(book.title, book.author, book.bookId);
    const destPath = path.join(outputDir, filename);

    // Check if file exists and handle overwrite logic
    if (!overwrite) {
      try {
        await fs.access(destPath);
        skipped++;
        continue; // File exists and we don't want to overwrite
      } catch {
        // File doesn't exist, proceed
      }
    }

    const markdown = renderBook(book, template);
    await fs.writeFile(destPath, markdown, 'utf-8');
    written++;
    files.push({ book, path: destPath });
  }

  return { written, skipped, files };
}

/**
 * Load books from JSON file
 */
export async function loadBooksFromJSON(jsonPath) {
  const rawJson = await fs.readFile(jsonPath, 'utf-8');
  const parsedJson = JSON.parse(rawJson);
  return parseBookExports(parsedJson);
}

/**
 * Save books to JSON file
 */
export async function saveBooksToJSON(books, jsonPath) {
  await fs.mkdir(path.dirname(jsonPath), { recursive: true });
  await fs.writeFile(jsonPath, JSON.stringify(books, null, 2), 'utf-8');
}
