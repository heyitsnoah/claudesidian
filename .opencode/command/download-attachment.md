---
description: Download files from URLs to attachments folder and organize them
---

# Download Attachment

Download files from URLs to attachments folder and organize them with
descriptive names.

## Usage

```
/download-attachment <url1> [url2] [url3...]
```

## Examples

```
/download-attachment https://example.com/document.pdf
/download-attachment https://site.com/image.png https://site.com/report.pdf
```

## Process

### Step 1: Parse and Validate URLs

- Extract URL(s) from input
- Validate URL scheme (only http:// or https://)
- Reject invalid URLs

### Step 2: Download Files

```bash
# Sanitize filename
filename=$(basename "$url" | sed 's/[^a-zA-Z0-9._-]/_/g')

# Download with timeout
curl --max-time 30 -L "$url" -o "05_Attachments/$filename"
```

### Step 3: Verify Downloads

Check files were downloaded successfully.

### Step 4: Organize Files

After downloading:
- For PDFs: Extract text and analyze for meaningful title
- For Images: Use vision analysis for descriptive filename

### Step 5: Move to Organized

Move renamed files to `05_Attachments/Organized/` with descriptive names.

### Step 6: Update Index

Add entries to `05_Attachments/00_Index.md`

## Supported Types

- Images: .png, .jpg, .jpeg, .gif, .webp
- Documents: .pdf, .doc, .docx
- Text: .txt, .md
- Data: .csv, .xlsx

## Workflow

1. Download file(s) from provided URL(s)
2. Identify file type and analyze content
3. Generate descriptive filename
4. Move to Organized folder
5. Update index and references

## Tips

- For multiple URLs, process in batch
- Keep filenames concise but descriptive (max 60 chars)
- Preserve original file extensions
