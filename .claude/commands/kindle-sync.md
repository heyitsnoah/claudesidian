# Kindle Highlights Sync

Sync your Kindle highlights to the vault with zero-config setup.

## Important Instructions

**Step 1: Check if this is first run:**

Check if `.kindle/config.json` exists:

- If it EXISTS: Skip to Step 2b
- If it DOES NOT exist: This is first run, go to Step 1b

**Step 1b (First run only): Ask for output folder:**

Ask the user:

```
This is your first time syncing Kindle highlights! Where would you like to save them?

1. 03_Resources/Kindle Highlights (default)
2. A custom path (e.g., 02_Areas/Reading)

Your choice:
```

Wait for their answer, then continue to Step 2a with the `--output` flag.

**Step 2a: Ask how many books to sync:**

Present this text directly:

```
How many books would you like to sync? This syncs your most recent books first.

A. 10 books - Quick test sync of your setup
B. 25 books - Broader sync
C. 50 books - Extensive sync
D. All books - Complete library (10-30 min for large libraries)
E. Custom number - You specify how many

Just reply with A, B, C, D, E, or a number.
```

Wait for their answer, then continue to Step 3.

**Step 2b: Ask how many books to sync:**

Present this text directly:

```
How many books would you like to sync?

A. 10 books (recommended) - Quick sync of your 10 most-recently highlighted books
B. 25 books - Broader sync
C. 50 books - Extensive sync
D. All books - Resyncs your complete library (10-30 min for large libraries -- only )
E. Custom number - You specify how many

Just reply with A, B, C, D, E, or a number.
```

**Step 3: Run the command immediately after their answer:**

Based on their response and whether it's first run:

**If first run (no config):**

- If they answer **A** or **10**: Run
  `pnpm kindle:sync --limit 10 --output "[their-folder-choice]"`
- If they answer **B** or **25**: Run
  `pnpm kindle:sync --limit 25 --output "[their-folder-choice]"`
- If they answer **C** or **50**: Run
  `pnpm kindle:sync --limit 50 --output "[their-folder-choice]"`
- If they answer **D** or **all**: Run
  `pnpm kindle:sync --all --output "[their-folder-choice]"`
- If they answer **E** or a number: Run
  `pnpm kindle:sync --limit [number] --output "[their-folder-choice]"`

**If NOT first run (config exists):**

- If they answer **A** or **10**: Run `pnpm kindle:sync --limit 10`
- If they answer **B** or **25**: Run `pnpm kindle:sync --limit 25`
- If they answer **C** or **50**: Run `pnpm kindle:sync --limit 50`
- If they answer **D** or **all**: Run `pnpm kindle:sync --all`
- If they answer **E** or a number: Run `pnpm kindle:sync --limit [number]`

Note: If user just presses Enter for default folder, use
`03_Resources/Kindle Highlights` as the path.

## What This Does

Fetches your Kindle highlights from Amazon and creates beautifully formatted
Markdown notes in your vault.

**✨ First Run Magic**:

- First time? You'll choose where to save highlights (defaults to
  `03_Resources/Kindle Highlights`)
- Not authenticated? Browser opens automatically for Amazon login
- Everything just works!

**Subsequent syncs:**

- Uses your saved folder location
- Uses cached authentication
- Much faster!

## What Gets Created

Each book creates a note with:

- **YAML frontmatter:** title, author, ASIN, tags, sync date
- **Metadata:** Total highlights, Kindle notebook link
- **All highlights:** Each with location and your notes
- **Kindle app links:** Click to open specific location in Kindle app
- **Notes section:** Space for your own thoughts

## Changing Your Settings

Want to change where highlights are saved or other settings? You have four
options:

### Option 1: View Current Settings

See what your current configuration is:

```bash
pnpm kindle:config
```

### Option 2: Edit Config File Directly (Recommended for Multiple Changes)

Open `.kindle/config.json` in your vault and edit:

```json
{
  "outputFolder": "03_Resources/Kindle Highlights",
  "templatePath": ".scripts/kindle/templates/kindle-note.md.hbs",
  "overwrite": true,
  "addTags": ["kindle", "highlights", "books"],
  "lastSync": "2025-10-19T22:30:00.000Z"
}
```

**Available settings:**

- `outputFolder`: Where to save notes (default:
  `03_Resources/Kindle Highlights`)
- `templatePath`: Custom Handlebars template location
- `overwrite`: Whether to replace existing files on re-sync (default: `true`)
- `addTags`: Tags to add to all notes (default:
  `["kindle", "highlights", "books"]`)
- `lastSync`: Timestamp of last sync (auto-updated)

### Option 3: Reset to First-Run Prompt

Delete the config file to trigger the folder selection prompt again:

```bash
rm .kindle/config.json
# Next /kindle-sync will ask where to save highlights
```

### Option 4: One-Time Override

Use the `--output` flag to save to a different folder just once (without
changing config):

```bash
pnpm kindle:sync --limit 10 --output "01_Projects/Current Reading"
```

## Tips

### Expected Timing

- **10 books:** 1-3 minutes
- **50 books:** 5-10 minutes
- **100+ books (all):** 15-30 minutes

Rate limiting delays are required to avoid Amazon detection.

### Organization

- Notes are automatically named: `<Author Last Name> - <Title>.md`
- All include `#kindle`, `#highlights`, `#books` tags by default
- Easy to find with Obsidian search or graph view

## Troubleshooting

### "Not authenticated" error

Shouldn't happen anymore! The script auto-detects and runs authentication. But
if you see this:

- Just run `/kindle-sync` again
- It will automatically handle authentication

### No books found

- Check if your Kindle library is visible at read.amazon.com/notebook
- Verify you have highlights (not just books in library)

### Preventing file overwrites

By default, kindle-sync will overwrite existing files on re-sync. To preserve
your edits:

- Set `overwrite: false` in `.kindle/config.json`
- Or rename files you've edited so they won't match the sync pattern

### Scraping seems slow

- Normal! Amazon requires delays between requests
- Use smaller number of books for faster syncs
