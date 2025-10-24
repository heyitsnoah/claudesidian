---
name: setup-firecrawl
description: Interactive setup wizard for Firecrawl web scraping scripts
allowed-tools: [Read, Write, Bash, AskUserQuestion]
argument-hint:
  "(optional) skip steps with 'quick' if you already have API key configured"
---

# Firecrawl Setup Wizard

This command guides you through setting up Firecrawl for web scraping, enabling
you to save articles, documentation, and web content directly to your vault as
clean, searchable markdown.

## Task

Set up Firecrawl web scraping by:

1. Explaining the benefits of Firecrawl for research workflows
2. Getting a Firecrawl API key (300 free credits to start)
3. Configuring the FIRECRAWL_API_KEY environment variable
4. Understanding the available scripts (single and batch scraping)
5. Testing with a sample scrape
6. Showing example research workflows

## Process

### 1. Welcome & Explain Benefits

Start by explaining what Firecrawl enables:

**The Research Game-Changer:** Instead of Claude reading webpages and
summarizing (losing details), Firecrawl saves the FULL text as markdown in your
vault. This means:

- **Permanent archive**: Articles stay in your vault forever
- **Full context**: Complete text, not summaries
- **Searchable**: Find anything across thousands of saved articles
- **No limits**: Build a massive research library without context limits
- **Clean format**: Beautiful markdown, not messy HTML

**Perfect for:**

- Research projects (save all related articles)
- Documentation archives (keep important guides)
- Knowledge bases (build your own reference library)
- Reading lists (save now, read later)
- Academic research (preserve sources)

### 2. Prerequisites Check

Verify required tools are installed:

```bash
curl --version  # Should be installed
jq --version    # Should be installed (for JSON parsing)
```

If jq is missing:

- **macOS**: `brew install jq`
- **Linux**: `apt-get install jq` or `yum install jq`
- **Windows**: Use WSL or Git Bash

### 3. Get Firecrawl API Key

Ask: "Do you already have a Firecrawl API key? (yes/no)"

If no:

1. Direct them to: https://firecrawl.dev
2. Explain:
   - Sign up for free account
   - Get 300 free credits to start
   - Open-source project, can self-host if needed
3. Guide to dashboard: "Go to your dashboard and copy your API key (starts with
   'fc-...')"
4. Wait for them to confirm they have the key

If yes:

1. Check if it's already in their environment: `echo $FIRECRAWL_API_KEY`
2. If not set, ask them to provide it

### 4. Configure Environment Variable

Detect their shell:

```bash
echo $SHELL
```

Based on the shell, add the API key to the appropriate config file:

**For zsh** (.zshrc):

```bash
echo 'export FIRECRAWL_API_KEY="fc-their-actual-key"' >> ~/.zshrc
source ~/.zshrc
```

**For bash** (.bashrc or .bash_profile):

```bash
echo 'export FIRECRAWL_API_KEY="fc-their-actual-key"' >> ~/.bashrc
source ~/.bashrc
```

Verify it's set:

```bash
echo $FIRECRAWL_API_KEY
```

### 5. Explain Available Scripts

There are two scraping scripts in `.scripts/`:

#### firecrawl-scrape.sh (Single URL)

For scraping one URL at a time with control over the filename:

```bash
# Basic usage
.scripts/firecrawl-scrape.sh "https://example.com/article" "00_Inbox/Clippings/article-name.md"

# You choose the filename
.scripts/firecrawl-scrape.sh "https://blog.com/post" "03_Resources/Articles/my-note.md"
```

#### firecrawl-batch.sh (Multiple URLs)

For scraping multiple URLs at once with auto-generated filenames:

```bash
# Default: saves to 00_Inbox/Clippings/
.scripts/firecrawl-batch.sh "https://url1.com" "https://url2.com" "https://url3.com"

# Custom output directory
.scripts/firecrawl-batch.sh -o "01_Projects/Research/" "https://url1.com" "https://url2.com"
.scripts/firecrawl-batch.sh --output-dir "03_Resources/Articles/" "https://url1.com"
```

### 6. Create Necessary Folders

Make sure the default Clippings folder exists:

```bash
mkdir -p 00_Inbox/Clippings
```

### 7. Test Connection

Perform a test scrape to verify everything works:

Ask: "Would you like to test with a sample article? (yes/no)"

If yes:

```bash
.scripts/firecrawl-scrape.sh "https://example.com" "00_Inbox/test-scrape.md"
```

Check the output:

- Look for: "✓ Scraped content saved to: 00_Inbox/test-scrape.md"
- Verify the file has content: `wc -l 00_Inbox/test-scrape.md`
- Show first few lines: `head -20 00_Inbox/test-scrape.md`

If successful, offer to delete test file:

```bash
rm 00_Inbox/test-scrape.md
```

### 8. Show Research Workflows

#### Workflow 1: Save Single Article

```bash
# User says: "Save this article to my vault: https://blog.example.com/great-post"
# You run:
.scripts/firecrawl-scrape.sh "https://blog.example.com/great-post" "00_Inbox/Clippings/great-post.md"
```

#### Workflow 2: Batch Research Collection

```bash
# User provides list of research URLs
# You run:
.scripts/firecrawl-batch.sh -o "01_Projects/AI-Research/" \
  "https://paper1.com" \
  "https://paper2.com" \
  "https://paper3.com"
```

#### Workflow 3: Build Reference Library

```bash
# Save documentation and tutorials to Resources
.scripts/firecrawl-batch.sh -o "03_Resources/Tech-Docs/" \
  "https://docs.example.com/guide1" \
  "https://docs.example.com/guide2"
```

#### Workflow 4: Reading List

```bash
# Quickly save interesting articles to read later
.scripts/firecrawl-batch.sh \
  "https://article1.com" \
  "https://article2.com" \
  "https://article3.com"
# All saved to 00_Inbox/Clippings/ for later processing
```

### 9. Usage Tips

**Best Practices:**

1. **Organize as you save**: Use meaningful filenames and folders
2. **Batch similar content**: Group related articles in same folder
3. **Add frontmatter**: After scraping, add tags/metadata to notes
4. **Link notes**: Create connections between related saved articles
5. **Clean up**: Regularly process Clippings folder

**Cost Management:**

- Free tier: 300 credits
- Each scrape uses ~1 credit
- Monitor usage in Firecrawl dashboard
- Can self-host for unlimited use

**Common Patterns:**

- Ask Claude: "Save this to my vault: [URL]"
- Ask Claude: "Scrape these 10 articles into my Research folder: [URLs]"
- Ask Claude: "Find and save the top 5 articles about [topic]"

### 10. Success Message

Show a summary:

```
✓ Firecrawl is now set up!

Available scripts:
  .scripts/firecrawl-scrape.sh <url> <output_file>
  .scripts/firecrawl-batch.sh [-o dir] <url1> <url2> ...

Usage with Claude:
  "Save this article to my vault: https://example.com"
  "Scrape these URLs to my Research folder: url1, url2, url3"

Your research workflow is now supercharged!
```

## Troubleshooting

Common issues:

1. **"jq: command not found"**
   - Install jq: `brew install jq` (macOS) or `apt-get install jq` (Linux)

2. **"Failed to scrape content"**
   - Check API key is set: `echo $FIRECRAWL_API_KEY`
   - Verify key is valid at https://firecrawl.dev/dashboard
   - Check credits remaining
   - Some sites may block scraping

3. **"Permission denied"**
   - Make scripts executable: `chmod +x .scripts/firecrawl-*.sh`

4. **Empty or incomplete files**
   - Some sites have aggressive anti-scraping
   - Try the URL directly in browser first
   - Check if site requires authentication

## Reference Documentation

For detailed script documentation: `.scripts/README.md`

For more web scraping options: https://docs.firecrawl.dev

## Output

Progress through each step, showing:

- ✓ Checkmarks for completed steps
- Clear examples of usage
- Verification that scraping works
- Workflow examples tailored to user's needs
- Final success message with quick reference

## Example Usage

```
/setup-firecrawl
```

Or with API key already configured:

```
/setup-firecrawl quick
```
