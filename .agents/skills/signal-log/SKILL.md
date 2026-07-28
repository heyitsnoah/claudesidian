---
name: signal-log
description: Capture dated observations and turn recurring patterns into durable working principles. Use whenever the user notices, records, or wants to review a signal, pattern, observation, lesson, or principle; ask for a domain and append to a designated signal log without assuming a vault folder layout.
---

# Signal Log

Use this skill to preserve small observations before they disappear and to make
recurring patterns easier to recognize. Keep the log lightweight: an entry is
useful when it is specific enough to revisit, not when it is polished prose.

## Choose the log file

Use the signal-log file the user names. If they have not named one, use
`SIGNAL_LOG.md` at the project root. Do not assume an Obsidian folder layout or
create extra directories. Before changing a file, inspect it and preserve its
existing headings, ordering, and line endings where practical.

If the default file does not exist, create it with a single `# Signal Log`
heading followed by a blank line. Never overwrite an existing log.

## Capture an observation

When the user shares a signal, observation, lesson, or emerging pattern:

1. Ask for a short domain only if one is not clear from context (for example,
   `work`, `health`, or `relationships`). Keep it lowercase and concise.
2. Preserve the user's meaning and concrete wording; do not turn a tentative
   observation into a claim of fact.
3. Append one line using this exact format:

   `YYYY-MM-DD | domain | observation`

   Use the current local date. If the user says the observation feels like a
   durable, principle-shaped lesson, mark it after the separator:

   `YYYY-MM-DD | domain | ★ principle: create a rough draft before optimizing.`

4. Keep the entry append-only. Do not silently rewrite or delete earlier
   observations, and do not add metadata fields that change the format.

After appending, show the exact line that was recorded and the file path.

## Review the log

When the user asks to review signals, find patterns, or extract principles,
read the designated log and group observations by recurring idea and domain.
Distinguish clearly between:

- observations (what was recorded),
- hypotheses (a possible explanation), and
- candidate principles (a reusable rule suggested by multiple observations).

Cite the dates and domains of supporting entries. Do not promote a candidate to
a durable principle without the user's confirmation. Once confirmed, keep it
in the same designated file under a `## Principles` heading, preserving the
original observation lines below it. If that heading is absent, add it at the
end of the file rather than reorganizing the log.

## Safety and scope

Only edit the designated signal-log file. Do not modify vault configuration,
daily notes, or other project files as part of capture or review. If the user
asks to move, merge, or delete entries, explain the proposed change and get
confirmation before making a destructive edit.

## Examples

**Capture**

User: “I get better ideas after I write a rough first draft. Log that under
work.”

Append:

`2026-07-28 | work | I get better ideas after I write a rough first draft.`

**Principle-shaped capture**

User: “That feels like a principle: draft before optimizing.”

Append:

`2026-07-28 | work | ★ principle: draft before optimizing.`

**Review**

Report the repeated observations first, then offer a candidate principle with
the dates that support it. Wait for confirmation before adding it to
`## Principles`.
