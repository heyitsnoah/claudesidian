---
description: Rename generic attachment files with descriptive names - suggest when 10+ IMG_/CleanShot files exist
argument-hint: [number of files to process]
allowed-tools:
  - Read
  - Write
  - Edit
  - mcp__gemini-vision__analyze_image
  - mcp__gemini-vision__analyze_multiple
  - Bash(ls:*)
  - Bash(mv:*)
  - Bash(pdftotext:*)
  - Bash(rg:*)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git push:*)
version: 1.0.0
---

You are organizing attachment files in the Obsidian vault, renaming generic files with descriptive titles based on their content.

**Note:** This command works best with Gemini Vision MCP for image analysis. If not available, it will fall back to manual naming based on context.

## Current Context
- Working directory: !`pwd`
- Number of files to process: $ARGUMENTS (default: 3 if not specified)
- Target folder: 05 Attachments/
- Organized folder: 05 Attachments/Organized/

## Your Task

## Argument Validation

Parse $ARGUMENTS to determine number of files to process:

```bash
# If $ARGUMENTS is empty, default to 3
# If $ARGUMENTS is not a number, show usage and exit
```

**Usage if invalid:**
```
Usage: /organize-attachments [number]

Examples:
  /organize-attachments     # Process 3 files (default)
  /organize-attachments 5   # Process 5 files
```

### Step 1: Check Current Status

Check your attachments folder for files with generic names (adjust path as needed):
!`ls -1 "Attachments/" | head -20`

### Step 2: Identify Files to Process

**CRITICAL - Use ONLY this approach:**

List all files in your attachments folder (adjust path to match your vault):
!`ls -1 "Attachments/"`

Then MANUALLY identify $ARGUMENTS files with generic names (default 3 if not specified):
- IMG_*.jpg/png (camera defaults)
- CleanShot*.png (screenshot tool)
- Pasted image*.png (clipboard)
- Screenshot*.png
- document*.pdf
- download*.pdf

**NEVER use find, grep, or pattern matching!**

### Step 3: Process Files

#### For PDFs:
1. Extract text: `pdftotext "Attachments/file.pdf" -`
2. Analyze content for meaningful title
3. Generate descriptive name (format: Topic - Key Content.pdf)

#### For Images (if Gemini Vision MCP available):
Use Gemini Vision to analyze up to 3 images at once:
```
mcp__gemini-vision__analyze_multiple
- image_paths: ["path1", "path2", "path3"]
- prompt: "For each image provide: 1) Descriptive filename (max 60 chars), 2) Type (screenshot/diagram/photo/chart), 3) Contains text (yes/no)"
```

#### For Images (fallback without MCP):
Read surrounding markdown context to infer descriptive names.

### Error Handling

If file analysis fails:
- Skip that file and continue with next
- Log failed files for manual review
- Report summary at end: "Processed X/Y files, Z failures"

If Gemini Vision returns unclear title:
- Use conservative fallback: "Document - [Date]" or "Image - [Date]"
- Flag for manual review in commit message

### Step 4: Rename Files

For each file:
```bash
# Rename with descriptive title (adjust paths to match your vault)
mv "Attachments/generic-name.ext" "Attachments/Descriptive Title - Context.ext"
```

### Step 5: Update References

Search for and update all references to renamed files:
```bash
# Find files referencing the old name
rg -l "old-filename.ext"
```

Use Edit tool to update each reference to the new filename.

### Step 6: Verify Updates

Confirm all links are properly updated:
```bash
# Verify old filename no longer referenced
rg -l "old-filename.ext"  # Should return no results

# Verify new filename is properly referenced
rg -l "New Filename.ext"  # Should show expected files
```

### Step 7: Version Control

```bash
git add -A
git commit -m "Organize ${1:-3} attachment files with descriptive names"
git push
```

## Naming Conventions

### Images:
- Screenshots: `Tool/App Name - Feature/Content Description.png`
- Diagrams: `Topic - Diagram Type.png`
- Photos: `Subject - Context/Event.jpg`
- Charts: `Data Topic - Chart Type.png`

### PDFs:
- Articles: `Title - Author or Source.pdf`
- Documents: `Document Type - Topic/Title.pdf`
- Reports: `Report Name - Date or Version.pdf`

### Examples:
- `IMG_1234.jpg` → `Team Meeting - Whiteboard Brainstorm.jpg`
- `CleanShot 2025-01-15.png` → `Obsidian Settings - Plugin Configuration.png`
- `document1.pdf` → `Q4 Financial Report - Acme Corp 2024.pdf`

## Important Rules

1. Process ONLY the number of files specified in $ARGUMENTS (default 3)
2. Move to Organized/ subfolder after renaming
3. Never use complex shell patterns or find commands
4. **ALWAYS verify links manually** - the automatic update may miss some references
5. Keep names concise but descriptive (max 60 chars preferred)
6. Include dates in format YYYY-MM-DD when relevant
7. Use hyphens to separate name components

## Critical Success Factors

- **Manual Verification is Required**: Always verify all references are updated
- **Use `rg` to find all references** to both old and new filenames
- **Check both old and new filenames** to ensure complete transition
- **Manually fix any remaining broken links** using the Edit tool
- **Test in your vault** to ensure links still work

## Common Issues

- References without full paths (`![[filename]]`) may need updating
- Check both wiki-style links and markdown links
- Verify embedded images (`![[image.png]]`) and regular links (`[[file.pdf]]`)
- Always run final verification commands before considering the task complete