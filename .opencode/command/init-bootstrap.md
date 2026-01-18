---
description: Interactive setup wizard to create personalized configuration
---

# Initialize Bootstrap Configuration

This command helps you create a personalized configuration file by asking
questions about your Obsidian workflow and preferences.

## Environment Detection

**IMPORTANT**: This setup works with both Claude Code and OpenCode. Detect which
environment is running:

```bash
# Check for OpenCode markers
if [ -d ".opencode" ] && [ -f "opencode.json" ]; then
  TOOL="opencode"
  CONFIG_DIR=".opencode"
  CONFIG_FILE=".opencode/config.json"
elif [ -d ".claude" ]; then
  TOOL="claude-code"
  CONFIG_DIR=".claude"
  CONFIG_FILE=".claude/vault-config.json"
fi
```

When configuring:
- **Claude Code**: Use `.claude/vault-config.json` for preferences
- **OpenCode**: Use `.opencode/config.json` for preferences
- Both use the same CLAUDE.md for user-facing instructions
- Both share the same vault structure and commands

## Task

Read the CLAUDE-BOOTSTRAP.md template and interactively gather information about
the user's workflow to generate a customized configuration file.

## Process

### 1. Initial Environment Setup

- Get current date with `date` command for timestamps
- Check current folder name and ask if they want to rename it
- Check for package.json and install dependencies (pnpm preferred, npm fallback)
- Check git status:
  - If no .git folder: Initialize git repository
  - If has remote origin: Ask about development vs personal vault
- Don't create folders yet - wait until after asking about organization method

### 2. Check Existing Configuration

- Look for existing CLAUDE.md or OpenCode configuration
- If exists, ask if they want to update or start fresh
- Check for CLAUDE-BOOTSTRAP.md template

### 3. Gather Vault Information

Search common locations for existing Obsidian vaults:
- `~/Documents` (maxdepth 3)
- `~/Desktop` (maxdepth 3)
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents` (macOS only)
- Home directory (maxdepth 2)

If found, analyze vault structure:
- Run `tree -L 3 -d [path]` to see folder hierarchy
- Sample notes to understand content types
- Detect organization system (PARA, Zettelkasten, etc.)

### 4. Ask Configuration Questions

- "What's your name?" (for personalization)
- "Would you like me to research your public work?"
- "Do you follow the PARA method or have a different organization system?"
- "What are your main use cases?" (research, writing, projects, daily notes)

**If using PARA:**
- "What active projects are you working on?"
- "What areas of responsibility do you maintain?"
- "What topics do you research frequently?"

**General preferences:**
- Check existing plugins
- Detect naming conventions
- Ask about git usage
- Ask about writing style preferences

### 5. Optional Tool Setup

**Gemini Vision (already included)**
- Ask if they want to activate it
- Guide API key setup if yes

**Firecrawl (already included)**
- Ask if they want to set it up
- Guide API key setup if yes

### 6. Generate Custom Configuration

- Save preferences to the appropriate config file based on tool detected:
  - Claude Code: `.claude/vault-config.json`
  - OpenCode: `.opencode/config.json`
- Start with template as base
- Add user-specific sections:
  - Custom folder structure
  - Personal workflows
  - Preferred tools and scripts

### 7. Import Existing Vault (if applicable)

- Create OLD_VAULT folder
- Copy entire vault preserving structure
- Copy Obsidian configuration
- Show summary of imported files

### 8. Create Supporting Files

- Generate folder structure if new vault
- Create README files for main folders
- Set up project subfolders (Research/, Chats/, Daily Progress/)
- Create 05_Attachments/Organized/ directory
- Set up .gitignore if using git
- Remove FIRST_RUN marker file if exists

### 9. Run Test Commands

- Execute `pnpm vault:stats` to verify scripts work
- Test MCP tools if configured
- Verify git is tracking correctly

### 10. Provide Next Steps

- Summary of what was created
- Quick start guide
- List of available commands
- Test commands to verify setup

## Important Notes

### Handling Multiple Vaults

When multiple vaults detected:
1. List all vaults with clear numbering
2. Require explicit selection
3. Confirm before proceeding

### Platform Compatibility

Works on Linux, macOS, and Windows (WSL/Git Bash):
- iCloud vault detection is macOS only
- Standard locations work on all platforms

### User Path Validation

When users provide vault path:
- Expand tilde to home directory
- Validate path exists
- Check for .obsidian folder
- Verify read permissions

## Example Usage

```
/init-bootstrap
/init-bootstrap new
/init-bootstrap ~/Documents/MyVault
```
