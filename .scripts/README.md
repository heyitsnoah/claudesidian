# Scripts Directory

Helper scripts for vault automation and web content capture.

Folder destinations can be customized in `.claude/vault-config.json`:

```json
{
  "folders": {
    "clippings": "00_Inbox/Clippings",
    "attachments": "05_Attachments",
    "attachmentsOrganized": "05_Attachments/Organized"
  }
}
```

The capture and attachment-link scripts read these values and fall back to the
defaults above when the file or a specific setting is missing.

## Available Scripts

### Attachment Management

These are primarily called via npm/pnpm commands in package.json:

- `update-attachment-links.js` - Updates note links after moving attachments
- `fix-renamed-links.js` - Fixes links after renaming files

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

# Basic usage - saves to 00_Inbox/Clippings/
.scripts/firecrawl-batch.sh <url1> <url2> <url3>

# Custom output directory
.scripts/firecrawl-batch.sh -o 01_Projects/Research/ <url1> <url2>
.scripts/firecrawl-batch.sh --output-dir 03_Resources/Articles/ <url1> <url2>
```

### Transcript Extraction

#### transcript-extract.sh

Extracts transcripts from YouTube videos.

```bash
# Basic usage - saves to 00_Inbox/Clippings/
.scripts/transcript-extract.sh <youtube-url>

# Custom output directory
.scripts/transcript-extract.sh <youtube-url> 01_Projects/Research/
```

## NPM Scripts

Run these from the vault root with `pnpm`:

| Command                        | Description                           |
| ------------------------------ | ------------------------------------- |
| `attachments:list`             | Show first 20 unprocessed attachments |
| `attachments:count`            | Count unprocessed attachments         |
| `attachments:organized`        | Count files in Organized folder       |
| `attachments:unprocessed`      | Same as count                         |
| `attachments:refs <file>`      | Find references to a specific file    |
| `attachments:sizes`            | Show 20 largest attachment files      |
| `attachments:orphans`          | Find unreferenced attachments         |
| `attachments:recent`           | Show files added in last 7 days       |
| `attachments:create-organized` | Create the Organized subfolder        |

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
