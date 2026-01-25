---
name: gtd-method
description: Getting Things Done (GTD) methodology by David Allen. Use for task management, project planning, and productivity workflows. Apply when helping with task organization, weekly reviews, or processing captured items.
version: 1.0.0
---

# Getting Things Done (GTD) Method

## Overview

GTD is a personal productivity methodology created by David Allen. It's based on
the principle that your mind is for having ideas, not holding them. By capturing
everything and organizing it systematically, you free mental space for creative
work.

**Core principle:** Get everything out of your head and into a trusted system.

## The Five Steps

### 1. Capture

Collect everything that has your attention into trusted inboxes.

**What to capture:**
- Tasks and to-dos
- Ideas and thoughts
- Commitments (to self and others)
- Information to reference later
- Anything "incomplete" in your mind

**Capture tools:**
- Fleeting notes folder (`01_FleetingNotes/`)
- Daily notes (`Daily/`)
- Physical inbox (paper, notebook)
- Voice memos, email drafts

**Rules:**
- Capture immediately - don't trust your memory
- Keep capture frictionless
- Don't process while capturing
- Empty capture tools regularly

### 2. Clarify

Process captured items one at a time.

**The clarifying question:** "What is this?"

**Decision tree:**
```
Is it actionable?
├── NO → Reference, Someday/Maybe, or Trash
└── YES → What's the next action?
    ├── Takes < 2 minutes → Do it now
    ├── Someone else should do it → Delegate
    └── Takes > 2 minutes → Defer (schedule or add to list)
```

**For each item, determine:**
1. Is it actionable?
2. What's the desired outcome?
3. What's the very next physical action?

**Processing rules:**
- One item at a time, top to bottom
- Never put items back in the inbox
- Make a decision for every item
- 2-minute rule: if it takes less than 2 minutes, do it now

### 3. Organize

Put clarified items in the right place.

**GTD Lists:**

| List | Contains | Review Frequency |
|------|----------|------------------|
| **Next Actions** | Single, concrete tasks you can do | Daily |
| **Projects** | Outcomes requiring 2+ actions | Weekly |
| **Waiting For** | Delegated items with dates | Weekly |
| **Someday/Maybe** | Future possibilities | Monthly |
| **Calendar** | Time-specific commitments | Daily |
| **Reference** | Non-actionable information | As needed |

**Contexts (optional):**
- @computer - tasks requiring computer
- @phone - calls to make
- @errands - things to do while out
- @home - tasks at home
- @office - tasks at work
- @anywhere - tasks with no location requirement

**File organization:**
```
00_GTD/
├── Reference/          # Non-actionable information
├── Templates/          # GTD templates
├── Next Actions.md     # Current actionable tasks
├── Projects.md         # Active projects with outcomes
├── Waiting For.md      # Delegated items
└── Someday Maybe.md    # Future possibilities
```

### 4. Reflect

Review your system regularly to keep it current and trusted.

**Daily Review (5-10 minutes):**
- Check calendar for today and tomorrow
- Review Next Actions list
- Process any items in inbox
- Ensure nothing is forgotten

**Weekly Review (30-60 minutes):**

The weekly review is the cornerstone of GTD. Do ALL of these:

1. **Get Clear**
   - Empty all inboxes (physical, digital, notes)
   - Process all fleeting notes
   - Clear your mind with a brain dump

2. **Get Current**
   - Review Next Actions - remove completed, add new
   - Review Projects - verify next actions defined
   - Review Waiting For - follow up if needed
   - Review calendar (past week for loose ends, upcoming)

3. **Get Creative**
   - Review Someday/Maybe list
   - Look for new projects to start
   - Think about goals and priorities

**Monthly Review:**
- Review Someday/Maybe for items to activate
- Review completed projects
- Assess higher-level goals

### 5. Engage

Choose and complete actions with confidence.

**Choosing what to do - the four criteria:**
1. **Context** - What can I do here with what I have?
2. **Time available** - How much time before the next commitment?
3. **Energy available** - What's my current mental/physical state?
4. **Priority** - What has the biggest payoff?

**The Six Horizons of Focus:**
- Ground: Current actions
- Horizon 1: Current projects
- Horizon 2: Areas of focus and accountability
- Horizon 3: 1-2 year goals
- Horizon 4: 3-5 year vision
- Horizon 5: Purpose and principles

## Key Concepts

### Next Actions

A next action is the very next physical, visible activity required to move
something forward.

**Good next actions:**
- "Call Dr. Smith to schedule appointment"
- "Draft outline for quarterly report"
- "Email John about project timeline"

**Bad next actions:**
- "Organize office" (too vague)
- "Project X" (that's a project, not an action)
- "Think about vacation" (not physical/visible)

### Projects

A project is any outcome requiring more than one action step.

**Project format:**
```markdown
## Project: [Desired Outcome]

**Purpose/Why:** [Why this matters]
**Success looks like:** [How you'll know it's done]

### Next Actions:
- [ ] [Specific next action]

### Supporting material:
- [[Related notes]]
```

### The 2-Minute Rule

If an action takes less than 2 minutes to complete, do it immediately. The time
spent organizing it would exceed the time to just do it.

### Mind Like Water

The ideal state where you respond appropriately to whatever comes up - not
over-reacting or under-reacting. Achieved by having complete capture and
organization of all commitments.

## Implementation Tips

### Starting GTD

1. Set aside 2-4 hours for initial capture
2. Do a complete brain dump
3. Process and organize everything
4. Set up your lists and calendar
5. Schedule your first weekly review

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Not capturing everything | Keep capture tools always available |
| Processing while capturing | Separate the two activities |
| Vague next actions | Ask "What's the very next physical action?" |
| Skipping weekly review | Schedule it as an immovable appointment |
| Overcomplicating contexts | Start with 2-3 contexts max |
| Never reviewing Someday/Maybe | Include in monthly review |

### Integration with Zettelkasten

GTD handles actionable items and commitments. Zettelkasten handles knowledge and ideas.

**When processing captures:**
- Actionable → GTD system
- Idea/insight → Fleeting note → Zettelkasten flow
- Reference info → GTD Reference or permanent note

**The handoff:**
- Fleeting notes with actions → extract to GTD, keep idea in Zettelkasten
- Project research → Literature notes linked to project
- Completed project insights → Permanent notes

## Quick Reference

**Daily:**
- Capture everything immediately
- Check calendar and Next Actions
- Process inbox items

**Weekly:**
- Complete weekly review (Get Clear → Get Current → Get Creative)
- Empty all inboxes
- Review all lists

**When stuck:**
- Ask: "What's the next physical action?"
- If overwhelmed: Do a brain dump
- If anxious: Review your lists
- If stuck on project: Define clearer outcome
