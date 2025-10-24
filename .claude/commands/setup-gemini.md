---
name: setup-gemini
description: Interactive setup wizard for Gemini Vision MCP server for image/video analysis
allowed-tools: [Read, Write, Bash, AskUserQuestion]
argument-hint: "(optional) skip steps with 'quick' if you already have API key configured"
---

# Gemini Vision Setup Wizard

This command guides you through setting up the Gemini Vision MCP server, which enables Claude to analyze images, videos, PDFs, and other visual content in your vault.

## Task

Set up Gemini Vision MCP server by:
1. Checking prerequisites (Node.js v22+, pnpm, Claude Code)
2. Getting a free Gemini API key from Google AI Studio
3. Configuring the GEMINI_API_KEY environment variable
4. Installing required dependencies
5. Registering the MCP server with Claude
6. Testing the connection

## Process

### 1. Welcome & Prerequisites Check

Start by welcoming the user and explaining what Gemini Vision does:
- Analyze images directly (screenshots, diagrams, photos)
- Extract text from PDFs and scanned documents
- Process videos (local files and YouTube URLs)
- Auto-generate filenames based on content
- Compare multiple images

Then check prerequisites:
```bash
node --version  # Should be v22+
pnpm --version  # Should be installed
claude --version  # Should be installed
```

If any are missing, guide them to install:
- Node.js: https://nodejs.org/ (v22+)
- pnpm: `npm install -g pnpm`
- Claude Code: https://claude.ai/code

### 2. Get Gemini API Key

Ask: "Do you already have a Gemini API key configured? (yes/no)"

If no:
1. Direct them to: https://aistudio.google.com/apikey
2. Explain: "Click 'Create API Key' and copy the key (starts with 'AIzaSy...')"
3. Wait for them to confirm they have the key

If yes:
1. Check if it's already in their environment: `echo $GEMINI_API_KEY`
2. If not set, ask them to provide it

### 3. Configure Environment Variable

Detect their shell:
```bash
echo $SHELL
```

Based on the shell, add the API key to the appropriate config file:

**For zsh** (.zshrc):
```bash
echo 'export GEMINI_API_KEY="their-actual-api-key"' >> ~/.zshrc
source ~/.zshrc
```

**For bash** (.bashrc or .bash_profile):
```bash
echo 'export GEMINI_API_KEY="their-actual-api-key"' >> ~/.bashrc
source ~/.bashrc
```

Verify it's set:
```bash
echo $GEMINI_API_KEY
```

### 4. Install Dependencies

CRITICAL: Must install dependencies BEFORE registering MCP server!

```bash
pnpm install
```

This installs:
- @google/generative-ai (Gemini API client)
- @modelcontextprotocol/sdk (MCP server framework)
- Other required dependencies

If pnpm fails, fall back to npm:
```bash
npm install
```

### 5. Register MCP Server

Ask: "Do you want project-scoped (just this vault) or user-scoped (all projects) installation?"

**Project-scoped (recommended for this vault only)**:
```bash
claude mcp add --scope project gemini-vision node .claude/mcp-servers/gemini-vision.mjs
```

This will create .mcp.json. The MCP server will automatically inherit the GEMINI_API_KEY environment variable from your shell.

**User-scoped (all projects)**:
```bash
claude mcp add --scope user gemini-vision node .claude/mcp-servers/gemini-vision.mjs
```

This will update ~/.claude.json. The MCP server will automatically inherit the GEMINI_API_KEY environment variable from your shell.

**Important**: The API key is read from your shell environment (set in .zshrc/.bashrc), NOT stored in any config file. The MCP server inherits it automatically when Claude Code starts.

### 6. Test Connection

Important: User must open a NEW Claude Code window for MCP to connect!

Guide them to:
1. Exit current Claude session (or open new terminal)
2. Start Claude again: `claude`
3. Check connection: `/mcp`
4. Look for: `gemini-vision ✔ connected`

If connected, test with a sample command:
"Try: 'Use gemini-vision to list available tools'"

### 7. Success & Next Steps

If everything works:
- Congratulate them!
- Show example commands:
  - "Analyze this image: 05_Attachments/screenshot.png"
  - "Extract text from this PDF: 05_Attachments/document.pdf"
  - "Analyze this YouTube video: https://youtube.com/watch?v=..."
  - "Suggest a filename for IMG_1234.jpg"

If issues occur:
- Direct them to troubleshooting guide: `.claude/mcp-servers/GEMINI_VISION_QUICK_START.md`
- Common issues:
  - Dependencies not installed → run `pnpm install`
  - Server not showing in /mcp → restart Claude Code
  - API key not working → verify at https://aistudio.google.com/apikey

## Troubleshooting Reference

For detailed troubleshooting, refer to: `.claude/mcp-servers/GEMINI_VISION_QUICK_START.md`

Common issues:
1. "Cannot find package '@modelcontextprotocol/sdk'" → Run `pnpm install`
2. Server shows "failed" → Check API key is set: `echo $GEMINI_API_KEY`
3. Tools don't work → Verify API key is valid, restart terminal to reload env vars
4. Server not listed in /mcp → Must restart Claude Code after adding server

## Output

Progress through each step, showing:
- ✓ Checkmarks for completed steps
- Clear instructions for manual steps
- Verification of each component
- Final success message with usage examples

## Example Usage

```
/setup-gemini
```

Or with API key already configured:
```
/setup-gemini quick
```
