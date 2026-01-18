# OpenCode Setup for Claudesidian

This directory contains configuration for [OpenCode](https://github.com/sst/opencode), an open-source alternative to Claude Code.

## Quick Start

1. Install OpenCode following [their documentation](https://github.com/sst/opencode)
2. Run OpenCode in this directory: `opencode`
3. Run the setup wizard: `/init-bootstrap`

## Directory Structure

```
.opencode/
├── opencode.json          # Main configuration (permissions, MCP)
├── command/               # Slash commands (equivalent to .claude/commands/)
│   ├── thinking-partner.md
│   ├── daily-review.md
│   ├── research-assistant.md
│   └── ... (15 commands total)
├── skills/                # Skills (equivalent to .claude/skills/)
│   ├── obsidian-markdown/SKILL.md
│   ├── systematic-debugging/SKILL.md
│   └── ... (6 skills total)
└── plugin/                # TypeScript plugins (equivalent to .claude/hooks/)
    └── session-hooks.ts   # First-run welcome, update checking, skill discovery
```

## Differences from Claude Code

| Feature | Claude Code | OpenCode |
|---------|-------------|----------|
| Config file | `.claude/settings.json` | `opencode.json` |
| Commands | `.claude/commands/*.md` | `.opencode/command/*.md` |
| Skills | `.claude/skills/*/SKILL.md` | `.opencode/skills/*/SKILL.md` |
| Hooks | Bash scripts in `.claude/hooks/` | TypeScript in `.opencode/plugin/` |
| Frontmatter | `allowed-tools`, `argument-hint` | `description` only |

## Configuration

### opencode.json

The main config file supports:

- **permission.autoApprove**: Tools that run without confirmation
- **mcp**: MCP server definitions
- **instructions**: Global system instructions

Note: Model configuration is handled by your OpenCode setup, not this file.

### Commands

Commands use simplified frontmatter:

```yaml
---
description: Brief description of what this command does
---

# Command instructions here...
```

### Skills

Skills work identically to Claude Code - place `SKILL.md` files in subdirectories of `.opencode/skills/`.

### Plugins

Plugins are TypeScript modules that can hook into:

- `onSessionStart`: Run on session initialization
- `UserPromptSubmit`: Run when user submits a prompt
- `PreToolUse` / `PostToolUse`: Run before/after tool execution

The plugin dependency `@opencode-ai/plugin` is included in package.json.

## MCP Servers

The Gemini Vision MCP server is pre-configured. To enable:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com)
2. Set the environment variable: `export GEMINI_API_KEY="your-key"`

## Available Commands

Run with `/command-name`:

- `/thinking-partner` - Collaborative exploration
- `/daily-review` - End of day reflection
- `/weekly-synthesis` - Weekly patterns
- `/research-assistant` - Deep topic research
- `/inbox-processor` - Organize inbox items
- `/create-command` - Build new commands
- `/de-ai-ify` - Remove AI jargon
- `/upgrade` - Update claudesidian
- `/pragmatic-review` - Code review
- `/add-frontmatter` - Add YAML frontmatter
- `/release` - Version and release
- `/install-claudesidian-command` - Shell alias
- `/download-attachment` - Download files
- `/pull-request` - Create PRs
- `/init-bootstrap` - Setup wizard

## Available Skills

Invoke by mentioning "skill" in your prompt or loading directly:

- `obsidian-markdown` - Obsidian syntax (wikilinks, callouts, embeds)
- `obsidian-bases` - Database views (.base files)
- `json-canvas` - Visual canvases (.canvas files)
- `systematic-debugging` - Debug methodology
- `git-worktrees` - Parallel development
- `skill-creator` - Create new skills

## Troubleshooting

### Commands not found

Ensure you're running OpenCode from the vault root directory where `opencode.json` exists.

### MCP servers not working

Check that environment variables are set before starting OpenCode:
```bash
export GEMINI_API_KEY="your-key"
opencode
```

### Plugin errors

Run `pnpm install` to ensure `@opencode-ai/plugin` is installed.
