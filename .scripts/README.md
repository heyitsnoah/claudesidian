# Scripts Directory

Helper scripts for vault automation and web content capture.

## Available Scripts

### Web Content Capture

**Note**: These scripts require API keys to function:

#### firecrawl-scrape.sh

Scrapes a single URL and saves as markdown.

```bash
# Requires FIRECRAWL_API_KEY environment variable
.scripts/firecrawl-scrape.sh <url> <output_file>
```

#### firecrawl-batch.sh

Scrapes multiple URLs and auto-generates filenames.

```bash
# Requires FIRECRAWL_API_KEY environment variable

# Basic usage - saves to 01_FleetingNotes/
.scripts/firecrawl-batch.sh <url1> <url2> <url3>

# Custom output directory
.scripts/firecrawl-batch.sh -o 02_LiteratureNotes/ <url1> <url2>
.scripts/firecrawl-batch.sh --output-dir "Digital Twin/" <url1> <url2>
```

### Transcript Extraction

#### transcript-extract.sh

Extracts transcripts from YouTube videos.

```bash
# Basic usage - saves to 01_FleetingNotes/
.scripts/transcript-extract.sh <youtube-url>

# Custom output directory
.scripts/transcript-extract.sh <youtube-url> 02_LiteratureNotes/
```

### Vault Statistics

#### vault-stats.sh

Shows statistics about your vault.

```bash
.scripts/vault-stats.sh
# or
pnpm vault:stats
```

## NPM Scripts

Run these from the vault root with `pnpm`:

| Command       | Description                     |
| ------------- | ------------------------------- |
| `vault:stats` | Show vault statistics           |
| `lint`        | Run ESLint and Prettier         |
| `format`      | Format code with Prettier       |

## Setup Requirements

### For Web Scraping

1. Get a Firecrawl API key from [firecrawl.dev](https://firecrawl.dev)
2. Add to your shell profile:
   ```bash
   export FIRECRAWL_API_KEY="your-key-here"
   ```

### For Transcript Extraction

- Requires `yt-dlp` and `jq` installed:

  ```bash
  # macOS
  brew install yt-dlp jq

  # Linux
  apt-get install yt-dlp jq
  ```

## Adding Custom Scripts

1. Create script in `.scripts/`
2. Make it executable: `chmod +x .scripts/your-script.sh`
3. Add npm script to `package.json` if needed
4. Document here

## Notes

- Scripts assume Unix-like environment (macOS/Linux)
- Windows users may need WSL or Git Bash
- All paths are relative to vault root
- Check script comments for additional requirements
