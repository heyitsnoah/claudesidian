---
description: Organize inbox files using PARA method - suggest when 15+ unorganized files accumulate
argument-hint: [number of files to process] [--dry-run] [--confirm]
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash(ls:*)
  - Bash(mv:*)
  - Bash(mkdir:*)
  - Bash(git:*)
  - Bash(pwd:*)
  - Bash(date:*)
version: 1.0.0
---

You are organizing files in the Obsidian vault inbox, moving them to appropriate PARA locations based on content analysis.

**Note:** This command assumes a PARA-style folder structure. Adapt folder names and organization to match your vault's structure.

## Safety Mode

**Check for flags in arguments:**

If $ARGUMENTS contains "--dry-run":
- Show what WOULD be moved (source → destination)
- Print exact `mv` commands that would execute
- Do NOT actually move files
- Exit after showing plan

If $ARGUMENTS contains "--confirm" or neither flag:
- Proceed with actual file moves
- Show each move as it happens

## Current Context
- Working directory: !`pwd`
- Number of files to process: $ARGUMENTS (default: 10 if not specified)
- Current date: !`date +%Y-%m-%d`

## Your Task

### Step 1: Check Inbox Status

Inbox contents: !`ls -1 "00 Inbox/" | grep -v "^[.]"`

### Step 2: Clean Filenames (Optional)

**If your vault has a filename cleaning script:**

Check what needs cleaning, then run your cleanup script if needed.

This removes special characters (curly quotes, em dashes, etc.) that cause issues with file operations.

**Otherwise, proceed to Step 3.**

### Step 3: Identify Files to Process

**Use ONLY this approach:**

List markdown files: !`ls -1 "00 Inbox/"*.md 2>/dev/null | head -20`

Clippings to organize: !`ls -1 "00 Inbox/Clippings/"*.md 2>/dev/null | head -20`

Then MANUALLY identify $ARGUMENTS files to organize (default 10):

**NEVER MOVE THESE:**
- Files with number prefixes (00-06) - permanent inbox residents
- Daily/Weekly/Monthly Summaries folders (but DO organize files inside them)
- Files with #keep-in-inbox tag

**DO ORGANIZE:**
- Files in Clippings/ folder → move to 03 Resources/Articles/[Topic]/
- Any standalone .md files in inbox root

### Step 4: Analyze Vault Structure

Check existing areas: !`ls -1 "02 Areas/"`

Check existing projects: !`ls -1 "01 Projects/"`

Check resource topics: !`ls -1 "03 Resources/"`

### Step 5: Read and Categorize Files

For each file to process:
1. Read content to understand topic and type
2. Check for existing frontmatter/tags
3. Determine best destination using PARA method:

**01 Projects** - Time-bound initiatives with clear completion criteria:
- Active project work
- Project planning documents
- Specific deliverables with deadlines

**02 Areas** - Ongoing responsibilities without end dates:
- Work/ - Professional work and clients
- Personal/ - Personal matters
- Health/ - Health and fitness
- Finance/ - Financial matters
- Learning/ - Ongoing learning topics
- (Adapt these to match your vault's area structure)

**03 Resources** - Reference materials by topic:
- Articles/ - Saved articles by topic
- Books/ - Book notes and references
- Courses/ - Course materials
- Tools/ - Tool documentation
- (Adapt these to match your resource topics)

**04 Archive** - Completed work (>3 months old):
- Old projects
- Old summaries

### Step 6: Verify Destinations

Before moving each file:
```bash
# Check if destination exists
ls -la "target/folder/"

# Create if needed (only for 7+ related files)
mkdir -p "new/folder/"
```

### Step 7: Execute Moves

**CRITICAL - Keep it simple:**

Process ONE file at a time:
1. Read the file to understand content
2. Decide destination folder
3. Verify destination exists with `ls`
4. Move with simple `mv` command
5. Confirm move succeeded
6. Move to next file

```bash
# Simple move - no scripts, no loops, no special commands
mv "00 Inbox/Clippings/article.md" "03 Resources/Articles/AI/article.md"
```

**Rules:**
- ONE file per move command
- Use basic `mv` only - no scripts or complex commands
- Never use `cp` - files should move, not duplicate
- Process files sequentially, not in batches

### Step 8: Update Index or Summaries

If organizing clippings or articles:
- Update relevant index files
- Add to topic-specific MOCs (Maps of Content)

### Step 9: Version Control

```bash
git add -A
git commit -m "Organize inbox: Move ${1:-10} files to PARA locations

[Brief description of what was organized]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

## Organization Rules

### Work-Related Content
- Client work: `02 Areas/Work/Clients/[Client Name]/` or your work area structure
- Never create unnecessary nested folders

### Projects
- Active projects with clear deliverables: `01 Projects/[Project Name]/`
- Check if project folder already exists first
- Only create new project folders for active, time-bound work

### Documentation
- Tool/tech documentation: Relevant area folder
- General reference: `03 Resources/[Topic]/`

### Articles & Research
- Saved articles: `03 Resources/Articles/[Topic]/`
  - Analyze content to determine appropriate topic
  - Group similar articles together
- Research notes: Topic-specific resource folders

**Adapt these rules to match your vault's organization system.**

## Common Mistakes to Avoid

❌ Creating unnecessary subfolders
❌ Putting professional work in "Personal"
❌ Duplicating existing folder structures
❌ Moving numbered files (00-06 prefix)
❌ Moving the Clippings FOLDER itself (organize files inside it)
❌ Using `cp` instead of `mv`
❌ Not checking if destination exists first
❌ Creating folders for <7 files

## Final Report

Provide summary:
- Number of files processed
- Destinations (Projects/Areas/Resources)
- Files skipped and why
- Folders created (if any)
- Remaining inbox items

## Notes
- Respect existing organizational patterns
- Ask if uncertain about categorization
- Keep folder structure shallow (max 3 levels)
- Use consistent naming (lowercase-with-hyphens)
