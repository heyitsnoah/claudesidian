---
description: Add YAML frontmatter for organization - suggest when moving content from inbox to organized folders
argument-hint: [file or folder path]
allowed-tools: Read, Write, Edit, Glob
---

You will analyze Obsidian notes and add intelligent YAML frontmatter properties
to enhance organization and discoverability.

## Input
- Path: ${1} (file or folder to process)
- Current date: !`date +%Y-%m-%d`

## Your Task

### Step 1: Identify Notes to Process

```bash
# If single file
Read the specified file

# If folder
Find all .md files in folder
```

### Step 2: Analyze Note Content

For each note, examine:

- Main topics and themes
- Note type (meeting, daily, reference, project)
- Key entities (people, projects, dates)
- Existing properties (preserve valid ones)
- Title quality (add/improve if needed)

### Step 3: Generate Appropriate Properties

#### Standard Properties by Note Type

**Meeting Notes:**

```yaml
---
title: [Descriptive meeting title]
date: YYYY-MM-DD
type: meeting
attendees: ["Person 1", "Person 2"]
project: Project Name
tags: [meeting, project-name]
action_items:
  - "Action item 1"
  - "Action item 2"
status: complete
---
```

**Daily Notes:**

```yaml
---
title: Daily Note - YYYY-MM-DD
date: YYYY-MM-DD
type: daily-note
tags: [daily]
highlights:
  - "Key event or thought"
mood: productive
---
```

**Reference/Article Notes:**

```yaml
---
title: [Article or concept title]
type: reference
source: "[[Source Note]]" or URL
author: Author Name
date_saved: YYYY-MM-DD
tags: [topic1, topic2]
key_concepts: [concept1, concept2]
---
```

**Project Notes:**

```yaml
---
title: [Project Name - Component]
type: project
status: in-progress
deadline: YYYY-MM-DD
stakeholders: ["Person 1", "Team 2"]
tags: [project, area]
priority: high
---
```

### Step 4: Apply Properties

For each note:

1. Check for existing frontmatter
2. Merge new properties (don't duplicate)
3. Fix any deprecated formats:
   - `tag` → `tags`
   - `alias` → `aliases`
   - `cssclass` → `cssclasses`
4. Ensure valid YAML syntax

### Step 5: Update File

```yaml
# Format:
---
property: value
list_property: ["item1", "item2"]
date_property: YYYY-MM-DD
linked_property: "[[Note Name]]"
---

[Original content]
```

## Property Guidelines

### Naming Conventions

- Use lowercase with underscores: `date_created`, `action_items`
- Be consistent with existing vault patterns
- Prefer clear over clever names

### Value Types

- **Text**: Simple strings, use quotes for links
- **List**: Arrays for multiple values
- **Date**: ISO format (YYYY-MM-DD)
- **Number**: For counts, ratings, priorities
- **Checkbox**: For boolean states

### Quality Checks

- ✅ Valid YAML syntax
- ✅ No duplicate properties
- ✅ Appropriate property types
- ✅ Quoted internal links
- ✅ Meaningful values (not empty)

## Special Cases

### Untitled Notes

Generate title from:

1. First heading if exists
2. First paragraph summary
3. Main topic/concept discussed

### Bulk Processing

When processing folders:

- Maintain consistency across similar notes
- Use same property names for same concepts
- Report summary of changes made

### Existing Properties

- Preserve valid existing properties
- Update deprecated formats
- Merge new properties carefully
- Never delete without reason

## Examples

### Before:

```markdown
Had a great meeting with the team about Q1 planning...
```

### After:

```markdown
---
title: Q1 Planning Team Meeting
date: 2025-09-02
type: meeting
attendees: ["Team"]
project: Q1 Planning
tags: [meeting, planning, q1-2025]
status: complete
---

Had a great meeting with the team about Q1 planning...
```

Remember: Properties should enhance organization, not clutter. Only add what
provides value for finding and connecting notes.
