---
description: Add or update YAML frontmatter properties to enhance note organization
---

# Add Frontmatter

Analyze Obsidian notes and add intelligent YAML frontmatter properties
to enhance organization and discoverability.

## Input

- Path: $ARGUMENTS (file or folder to process)

## Process

### Step 1: Identify Notes to Process

If single file, read it. If folder, find all .md files.

### Step 2: Analyze Note Content

For each note, examine:
- Main topics and themes
- Note type (meeting, daily, reference, project)
- Key entities (people, projects, dates)
- Existing properties (preserve valid ones)

### Step 3: Generate Appropriate Properties

#### Meeting Notes:
```yaml
---
title: [Descriptive meeting title]
date: YYYY-MM-DD
type: meeting
attendees: ['Person 1', 'Person 2']
tags: [meeting, project-name]
status: complete
---
```

#### Daily Notes:
```yaml
---
title: Daily Note - YYYY-MM-DD
date: YYYY-MM-DD
type: daily-note
tags: [daily]
---
```

#### Reference/Article Notes:
```yaml
---
title: [Article title]
type: reference
source: URL or [[Note]]
tags: [topic1, topic2]
---
```

#### Project Notes:
```yaml
---
title: [Project Name]
type: project
status: in-progress
deadline: YYYY-MM-DD
priority: high
---
```

### Step 4: Apply Properties

1. Check for existing frontmatter
2. Merge new properties (don't duplicate)
3. Fix deprecated formats (tag → tags, alias → aliases)
4. Ensure valid YAML syntax

## Property Guidelines

- Use lowercase with underscores: `date_created`
- Be consistent with existing patterns
- Prefer clear over clever names

## Quality Checks

- ✅ Valid YAML syntax
- ✅ No duplicate properties
- ✅ Appropriate property types
- ✅ Quoted internal links
- ✅ Meaningful values (not empty)

Properties should enhance organization, not clutter. Only add what provides
value for finding and connecting notes.
