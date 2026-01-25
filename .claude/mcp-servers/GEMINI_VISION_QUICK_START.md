# Gemini Vision MCP Server - Quick Start Guide

**For getting Gemini Vision working on a new machine in under 5 minutes**

## Prerequisites Check

Run these commands to verify you have everything needed:

```bash
node --version  # Should be v22+
pnpm --version  # Should be installed
claude --version  # Claude Code should be installed
```

If any are missing:

- Node.js: Install from [nodejs.org](https://nodejs.org/) (v22+)
- pnpm: `npm install -g pnpm`
- Claude Code: Download from [claude.ai/code](https://claude.ai/code)

## Step 1: Get Your Gemini API Key

1. Go to
   [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIzaSy...`)

## Step 2: Set Up Environment Variable

### For Linux/macOS with Bash:

```bash
echo 'export GEMINI_API_KEY="your-actual-api-key-here"' >> ~/.bashrc
source ~/.bashrc
echo $GEMINI_API_KEY  # Verify it shows your key
```

### For Linux/macOS with Zsh:

```bash
echo 'export GEMINI_API_KEY="your-actual-api-key-here"' >> ~/.zshrc
source ~/.zshrc
echo $GEMINI_API_KEY  # Verify it shows your key
```

### For Windows PowerShell:

```powershell
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your-key-here', 'User')
# Restart PowerShell
$env:GEMINI_API_KEY  # Verify it shows your key
```

## Step 3: Install Dependencies

**⚠️ CRITICAL: This step MUST be done before adding the MCP server!**

Navigate to your Obsidian vault:

```bash
cd ~/your-vault  # Or wherever your vault is
```

Install the required dependencies:

```bash
# Install npm packages (REQUIRED - do this first!)
pnpm install

# This installs:
# - @google/generative-ai (Gemini API client)
# - @modelcontextprotocol/sdk (MCP server framework)
# - Other dependencies from package.json
```

**Common Error Fix**: If you see
`Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@modelcontextprotocol/sdk'`,
you forgot to run `pnpm install`!

**To hide node_modules from Obsidian** (optional but recommended):

1. Open Obsidian
2. Go to Settings → Files & Links → Excluded files
3. Click "Manage"
4. Add `node_modules/` to the list
5. Optionally also add: `pnpm-lock.yaml`, `.gitignore`

This keeps your vault clean while using standard Node.js module resolution.

## Step 4: Register the MCP Server

**For project-scoped installation (recommended for team use):**

```bash
# Add server to project (creates .mcp.json file)
claude mcp add --scope project gemini-vision node .claude/mcp-servers/gemini-vision.mjs
```

**For user-scoped installation (personal use across all projects):**

```bash
# Add server to your user config
claude mcp add --scope user gemini-vision node .claude/mcp-servers/gemini-vision.mjs
```

After adding, you'll need to edit the `.mcp.json` file to add your API key:

```json
{
  "mcpServers": {
    "gemini-vision": {
      "type": "stdio",
      "command": "node",
      "args": [".claude/mcp-servers/gemini-vision.mjs"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**IMPORTANT**:

- The command must be run from the Obsidian vault root directory
- You MUST have run `pnpm install` first
- The `.mcp.json` file is gitignored for security

## Step 5: Verify It's Working

1. **Open a NEW Claude Code window** (critical - must be new):

   ```bash
   cd ~/dev/Obsidian
   claude
   ```

2. **Check the server is connected**: Type `/mcp` in Claude

   You should see:

   ```
   gemini-vision ✔ connected
   ```

3. **Test with an actual command**:
   ```
   Use gemini-vision to extract text from [path/to/any-image.png]
   ```

## Troubleshooting

### "gemini-vision failed" or not showing in /mcp

1. **MOST COMMON ISSUE - Dependencies not installed**:

   ```bash
   # If you see: Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@modelcontextprotocol/sdk'
   # Run this:
   pnpm install
   ```

   Then reconnect the MCP server in Claude Code.

2. **Check API key is configured**:
   - For project-scoped: Check `.mcp.json` has your API key in the env section
   - For user-scoped: Check `~/.claude.json` has your API key
   - The key should be in the format: `"GEMINI_API_KEY": "AIzaSy..."`

3. **Test server can run directly**:

   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   node .claude/mcp-servers/gemini-vision.mjs
   ```

   Should show: "🚀 Gemini Vision MCP Server running" Press Ctrl+C to exit.

4. **Re-add the server (for project scope)**:

   ```bash
   claude mcp remove gemini-vision --scope project
   claude mcp add --scope project gemini-vision node .claude/mcp-servers/gemini-vision.mjs
   # Then edit .mcp.json to add your API key
   ```

5. **Check logs**:

   ```bash
   # Find log directory
   ls ~/Library/Caches/claude-cli-nodejs/*/mcp-logs-gemini-vision/
   # Or on Linux:
   ls ~/.cache/claude-cli-nodejs/*/mcp-logs-gemini-vision/

   # View latest log
   tail -f [log-directory]/*.txt
   ```

### "Cannot find module" errors

1. **Verify package.json exists**:

   ```bash
   cat package.json
   ```

   Should show @google/generative-ai and @modelcontextprotocol/sdk

2. **Reinstall dependencies**:

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **Check node_modules was created**:
   ```bash
   ls node_modules/@google/generative-ai
   ```

### Server runs but tools don't work

1. **Test API key directly**:

   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
   ```

   Should return a list of models, not an error.

2. **Check file paths**:
   - Use absolute paths from vault root
   - Example: `Daily/image.png` not `./Daily/image.png`

## Available Tools

Once working, you can use these in Claude:

### Image Analysis

```
# Analyze an image
Use gemini-vision to analyze Daily/screenshot.png

# Extract text (OCR)
Use gemini-vision to extract text from 02_LiteratureNotes/document.jpg

# Compare images
Use gemini-vision to compare image1.png and image2.png

# Suggest a filename
Use gemini-vision to suggest a filename for IMG_1234.jpg

# Analyze multiple images
Use gemini-vision to analyze multiple: image1.png, image2.png, image3.png
```

### Video Analysis (NEW!)

```
# Analyze a local video file
Use gemini-vision to analyze video Morphic/demo-video.mp4

# Analyze a YouTube video
Use gemini-vision to analyze YouTube video https://www.youtube.com/watch?v=VIDEO_ID

# Custom video analysis prompt
Use gemini-vision to analyze video file.mp4 and extract all visible text
```

**Note:** Video processing may take 30-60 seconds as files need to reach ACTIVE
state before analysis. The server will automatically wait and show progress
updates.

### Supported Formats

**Images:** JPG, JPEG, PNG, GIF, BMP, WebP **Videos:** MP4, AVI, MOV, WebM, MKV,
WMV, FLV, 3GP, M4V **Documents:** PDF, TXT, DOC, DOCX, ODT, RTF **Special:**
YouTube URLs (direct support without download)

## Quick Reinstall (If Already Set Up Once)

If you've already set up the API key in your shell profile:

```bash
cd ~/dev/Obsidian
git pull
pnpm install
claude mcp add gemini-vision \
  --scope local \
  --env GEMINI_API_KEY=$GEMINI_API_KEY \
  -- node .claude/mcp-servers/gemini-vision.mjs
```

Then open a new Claude window and test.

## File Locations

- **Server code**: `.claude/mcp-servers/gemini-vision.mjs`
- **Dependencies**: `package.json`
- **This guide**: `.claude/mcp-servers/GEMINI_VISION_QUICK_START.md`

## Need Help?

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Make sure you're in the Obsidian vault root directory
4. Ensure the API key is properly set in your environment

---

_Last tested: September 2025_
