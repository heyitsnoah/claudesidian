# Obsidian Vault Guidelines - Bootstrap Template

**Getting Started with Claude Code + Obsidian**

## Quick Setup

1. **Start every session**: Run `git pull` to sync latest changes
2. **After changes**: Commit and push to preserve your work
3. **Use built-in tools**: Prefer WebSearch and WebFetch for web content

## Version Control Best Practices

**CRITICAL - START EVERY SESSION**: Always run `git pull` at the beginning of
each new Claude session to ensure you have the latest changes from the remote
repository.

**Commit workflow**:

- After creating new notes: `git add .` → `git commit -m "message"` → `git push`
- After significant edits: Commit and push immediately
- Use `git status` to check for modifications
- When agents modify files: Always commit those changes

## Folder Structure (GTD + Zettelkasten)

```
vault/
├── 00_GTD/                    # GTD system
│   ├── _GTD.md                # Main dashboard
│   ├── 00_Actions/            # Action lists
│   │   ├── Inbox.md           # Capture here
│   │   ├── Next.md            # Next actions
│   │   ├── Recurring.md       # Regular tasks
│   │   └── Someday.md         # Future possibilities
│   ├── 01_Projects/           # Active projects
│   │   ├── _PJM.md            # Project dashboard
│   │   ├── Personal/          # Personal projects
│   │   └── Work/              # Work projects
│   └── 02_Reference/          # Non-actionable reference
├── 01_FleetingNotes/          # Quick captures (process in 1-2 days)
├── 02_LiteratureNotes/        # Notes from external sources
├── 03_PermanentNotes/         # Atomic, interconnected ideas
├── 04_Templates/              # Reusable note templates
├── Daily/                     # Daily notes and journals
├── Digital Twin/              # Study: Digital Twin technology
└── Morphic/                   # Study: Morphic programming
```

## GTD Method Details

### Capture
Collect everything into `00_GTD/00_Actions/Inbox.md` or fleeting notes.

### Clarify
Process each item - what is it and what action is required?

### Organize
- **Inbox**: `00_GTD/00_Actions/Inbox.md` - Capture everything here
- **Next Actions**: `00_GTD/00_Actions/Next.md` - Ready to do
- **Projects**: `00_GTD/01_Projects/` - Personal and Work folders
- **Someday/Maybe**: `00_GTD/00_Actions/Someday.md` - Future possibilities
- **Reference**: `00_GTD/02_Reference/` - Non-actionable info

### Reflect
- Daily: Check `_GTD.md` dashboard, process inbox
- Weekly: Full review using checklist in `_GTD.md`

### Engage
Work from Next Actions with confidence. Use `_GTD.md` as your starting point.

## Zettelkasten Method Details

### Fleeting Notes (01)

- Quick captures of ideas, thoughts, observations
- Temporary - process within 1-2 days
- Don't overthink - capture first, process later

### Literature Notes (02)

- Notes from books, articles, videos, podcasts
- Always in your own words (paraphrase, don't copy)
- Include source citations
- Extract key ideas for permanent notes

### Permanent Notes (03)

- **Atomic**: One idea per note
- **Self-contained**: Understandable without context
- **Linked**: Connected to other permanent notes
- **Evergreen**: Timeless, not tied to specific moments

### The Zettelkasten Flow

```
Capture → Fleeting Note → Literature Note → Permanent Note
   ↓           ↓               ↓                  ↓
(quick)   (1-2 days)     (source-based)     (atomic idea)
```

## Study Folders

### Digital Twin
Research and notes on Digital Twin technology - virtual representations of
physical objects, systems, and processes.

### Morphic
Research on Morphic programming paradigm - direct-manipulation UI framework
from Self/Smalltalk.

## Daily Notes Workflow

### Morning
1. Run `git pull`
2. Create daily note in `Daily/`
3. Review fleeting notes for processing
4. Check active projects and tasks

### During Day
- Capture ideas to `01_FleetingNotes/`
- Log tasks and observations to daily note
- Process literature as you consume content

### Evening
1. Process fleeting notes
2. Update project notes
3. Commit and push changes

### Weekly Review
1. Process all remaining fleeting notes
2. Review and update literature notes
3. Create new permanent notes from insights
4. Review GTD lists and projects
5. Archive completed items

## File Organization Guidelines

### Naming Conventions

- Daily notes: `YYYY-MM-DD.md`
- Fleeting notes: `[Brief description].md`
- Literature notes: `[Source Title] - Notes.md`
- Permanent notes: `[Clear descriptive title].md`

### Movement Rules

- Use `mv` command (not `cp`) to avoid duplicates
- Verify destination folders exist first
- Update internal links after moves
- Add YAML frontmatter when organizing

## Web Content Workflow

### Built-in Tools (Preferred)

- **WebSearch**: For general web searches
- **WebFetch**: For specific URLs
- Save to appropriate folder based on content type

### Custom Scripts (When Needed)

- Single URL: `pnpm firecrawl:scrape <url> <output>`
- Batch URLs: `pnpm firecrawl:batch <url1> <url2>`
- Saves to `01_FleetingNotes/` with frontmatter for processing

## Writing Style Guidelines

### Structure

- Use `[[WikiLinks]]` for internal references
- Include YAML frontmatter (dates, tags, status)
- Consistent Markdown formatting
- Link generously - connections create value

### Permanent Note Format

```markdown
---
created: YYYY-MM-DD
tags: [topic1, topic2]
---

# [Clear, descriptive title]

[A single, well-articulated idea in 1-3 paragraphs]

## Related

- [[Related Note 1]]
- [[Related Note 2]]

## Sources

- [[Literature Note]]
```

## AI Assistant Guidelines

### Before Any Organization

1. Map complete folder structure: `find . -type d | sort`
2. Verify all destination folders exist

### Working with Content

- Respect the Zettelkasten flow (fleeting → literature → permanent)
- Always use `mv` not `cp` when organizing
- Preserve and update bidirectional links
- Add appropriate YAML frontmatter

### Processing Notes

- Help identify notes ready for promotion
- Suggest connections between ideas
- Recommend when to create new permanent notes
- Respect atomic note principle (one idea per note)

## Best Practices

### Organization

- Keep folder structure shallow
- Use linking over deep nesting
- Let structure emerge organically
- Include README in major folders

### Content Creation

- Capture first, organize later
- One idea per permanent note
- Write in your own words
- Link generously

### Maintenance

- Process fleeting notes within 1-2 days
- Weekly review and synthesis
- Regular git commits
- Quarterly review of permanent notes

---

_This is a bootstrap template. Customize based on your workflow and needs._
