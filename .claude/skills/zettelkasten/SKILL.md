---
name: zettelkasten
description: Zettelkasten note-taking method for building a networked knowledge base. Use when processing notes, creating permanent notes, or building connections between ideas. Apply for research, learning, and knowledge management.
version: 1.0.0
---

# Zettelkasten Method

## Overview

Zettelkasten ("slip box" in German) is a knowledge management method developed
by sociologist Niklas Luhmann. It emphasizes atomic notes, connections between
ideas, and emergent structure through linking.

**Core principle:** One idea per note, densely interconnected.

Luhmann published 70 books and 400+ articles using his Zettelkasten. The method
works because it mirrors how ideas actually develop - through connection and
recombination.

## The Three Note Types

### 1. Fleeting Notes

Quick captures of ideas, thoughts, and observations.

**Purpose:** Capture before you forget

**Characteristics:**
- Temporary (process within 1-2 days)
- Unpolished and brief
- Raw material for processing
- Written quickly without formatting

**Location:** `01_FleetingNotes/`

**Examples:**
- "Idea: What if X relates to Y?"
- Quick observation during reading
- Shower thought
- Something someone said

**Processing:**
- Review daily or every 1-2 days
- Expand into literature or permanent notes
- Delete if no longer relevant
- Don't let fleeting notes accumulate

### 2. Literature Notes

Notes taken while engaging with external sources.

**Purpose:** Capture ideas from sources in your own words

**Characteristics:**
- Source-based (tied to specific content)
- Written in your own words (not quotes)
- Includes citations
- Selective (only what's relevant to you)

**Location:** `02_LiteratureNotes/`

**Template:**
```markdown
---
source: [Book/Article/Video title]
author: [Author name]
date_consumed: YYYY-MM-DD
type: book/article/video/podcast
---

# [Source Title] - Notes

## Key Ideas

- Main insight 1 (page/timestamp)
- Main insight 2 (page/timestamp)

## Quotes

> "Direct quote for later reference" (p. XX)

## My Reactions

[Your thoughts, questions, disagreements]

## Ideas for Permanent Notes

- [ ] Idea 1 could become permanent note about X
- [ ] Idea 2 connects to [[existing permanent note]]

## Related

- [[Permanent Note 1]]
- [[Permanent Note 2]]
```

**Rules:**
- Always paraphrase - copying doesn't create understanding
- Note page numbers/timestamps for reference
- Capture your reactions, not just content
- Identify potential permanent notes

### 3. Permanent Notes

The core of your Zettelkasten - atomic, interconnected ideas.

**Purpose:** Store refined, standalone ideas for long-term use

**Characteristics:**
- **Atomic:** One idea per note
- **Self-contained:** Understandable without context
- **In your own words:** Fully processed and internalized
- **Linked:** Connected to other permanent notes
- **Evergreen:** Timeless, not tied to specific moments

**Location:** `03_PermanentNotes/`

**Template:**
```markdown
---
created: YYYY-MM-DD
tags: [topic1, topic2]
---

# [Clear, Descriptive Title]

[A single, well-articulated idea in 1-3 paragraphs. This should be
understandable on its own, without needing to read other notes first.]

## Related Notes

- [[Related Note 1]] - [brief explanation of connection]
- [[Related Note 2]] - [why this relates]

## Sources

- [[Literature Note that inspired this]]
```

**Rules:**
- One idea only - if you have multiple points, create multiple notes
- Write for your future self - be clear and complete
- Explain connections - don't just link, say why
- Title should capture the idea, not just the topic

## The Zettelkasten Workflow

```
Capture → Fleeting Note → Literature Note → Permanent Note
   ↓           ↓               ↓                  ↓
(instant)  (1-2 days)    (while reading)    (refined idea)
                              ↓
                        Extract insights
                              ↓
                    Create permanent notes
                              ↓
                      Link to existing
```

### Processing Flow

1. **Capture** (during the day)
   - Write fleeting notes immediately
   - Don't worry about format or quality
   - Focus on capturing the idea

2. **Process literature** (while consuming content)
   - Create literature note for the source
   - Paraphrase key ideas
   - Note your reactions and questions

3. **Create permanent notes** (dedicated time)
   - Review fleeting and literature notes
   - Extract atomic ideas
   - Write in your own words
   - Link to existing permanent notes

4. **Connect** (ongoing)
   - When creating any note, ask "What does this relate to?"
   - Add bidirectional links
   - Explain the connection

## Linking Strategies

### Types of Links

**Direct connection:**
```markdown
The [[Mere Exposure Effect]] explains why [[Familiarity breeds liking]] -
repeated exposure increases positive feelings.
```

**Contrast/Tension:**
```markdown
This contrasts with [[Novelty seeking]] - we seek both the familiar and
the new, depending on context.
```

**Building on:**
```markdown
Building on [[Information foraging theory]], users satisfice rather than
optimize when searching.
```

**Example of:**
```markdown
The iPhone launch is an example of [[Category creation vs. competition]].
```

### Finding Connections

When creating a new permanent note:

1. **Search for related terms** - What topics does this touch?
2. **Review recent notes** - What have you been thinking about?
3. **Check structure notes** - Does this fit an existing cluster?
4. **Ask:** "What does this remind me of?"

### Structure Notes (Index Notes)

When clusters emerge, create structure notes that organize related permanent
notes.

```markdown
# Structure: [Topic Name]

## Overview

Brief description of this topic cluster.

## Core Concepts

- [[Fundamental concept 1]]
- [[Fundamental concept 2]]

## Applications

- [[Application example 1]]
- [[Application example 2]]

## Open Questions

- What about X?
- How does Y relate?
```

## Writing Permanent Notes

### The Atomic Principle

**Bad (multiple ideas):**
```markdown
# Learning Techniques

Spaced repetition is effective because...
Also, active recall is better than passive review...
And interleaving topics improves retention...
```

**Good (atomic):**
```markdown
# Spaced repetition leverages the forgetting curve

By reviewing material at increasing intervals, we catch memories
just before they fade, strengthening retention with minimal effort.
This is more effective than massed practice because...

## Related
- [[Active recall outperforms passive review]]
- [[Interleaving improves transfer]]
```

### Writing for Your Future Self

**Bad:**
```markdown
# The thing from the book

That interesting point about how things work.
```

**Good:**
```markdown
# Feedback loops amplify small changes over time

A feedback loop occurs when the output of a system becomes an input
that affects future outputs. Positive feedback amplifies changes
(wealth begets wealth), while negative feedback dampens them
(thermostats stabilize temperature).

## Related
- [[Compound interest as positive feedback]]
- [[Homeostasis as negative feedback]]

## Sources
- [[Thinking in Systems by Meadows - Notes]]
```

### Explaining Connections

**Bad:**
```markdown
## Related
- [[Note 1]]
- [[Note 2]]
- [[Note 3]]
```

**Good:**
```markdown
## Related
- [[Feedback loops amplify small changes]] - the mechanism behind compound growth
- [[Small actions compound over time]] - practical application of this principle
- [[Systems thinking]] - the broader framework this belongs to
```

## Common Patterns

### The Note Sequence

Related permanent notes often form sequences:

```
[[Problem statement]]
    ↓
[[Existing approaches]]
    ↓
[[Limitations of existing approaches]]
    ↓
[[Proposed solution]]
    ↓
[[Evidence for solution]]
```

### The Concept Network

Ideas cluster around core concepts:

```
                    [[Core Concept]]
                    /      |      \
        [[Example 1]] [[Example 2]] [[Counter-example]]
              |            |
        [[Application] [[Application]]
```

### Progressive Summarization

As you revisit notes, progressively refine them:
- First pass: Capture the idea
- Second pass: Clarify the language
- Third pass: Add connections
- Fourth pass: Identify gaps

## Integration with GTD

| Capture Type | GTD Handling | Zettelkasten Handling |
|--------------|--------------|----------------------|
| Task/Action | Next Actions list | Not applicable |
| Idea/Insight | - | Fleeting → Permanent note |
| Reference Info | GTD Reference | Permanent note |
| Project Research | Project support | Literature notes |
| Completed Learning | Archive project | Permanent notes remain |

**The handoff:**
- If actionable → GTD
- If an idea → Zettelkasten
- If both → Extract action to GTD, idea to Zettelkasten

## Quality Checklist

Before marking a permanent note complete:

- [ ] Contains one atomic idea
- [ ] Written in my own words
- [ ] Self-contained (understandable alone)
- [ ] Has a descriptive title (captures the idea)
- [ ] Links to related notes with explanations
- [ ] Sources cited if applicable

## Common Mistakes

| Mistake | Solution |
|---------|----------|
| Collecting without processing | Process fleeting notes within 1-2 days |
| Copying instead of paraphrasing | Always write in your own words |
| Multiple ideas per note | Split into separate atomic notes |
| Links without explanation | Always explain why notes relate |
| Filing without connecting | Ask "What does this relate to?" |
| Perfectionism | Start rough, refine over time |
| Category-based organization | Let structure emerge from links |

## Quick Reference

**Daily:**
- Capture fleeting notes immediately
- Process yesterday's fleeting notes

**While reading/learning:**
- Create literature notes
- Paraphrase, don't copy
- Note page numbers

**Dedicated note time:**
- Review literature notes
- Extract permanent notes
- Connect to existing notes

**Periodically:**
- Review orphan notes
- Create structure notes for clusters
- Refine existing notes
