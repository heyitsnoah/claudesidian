---
description: Review a slash command file for best practices and improvements
argument-hint: '<command-file-path> [--interactive]'
allowed-tools: [Read, Grep, Glob]
---

# Review Slash Command

I'll analyze a slash command file and provide detailed feedback on best
practices, security, and improvements.

## Step 0: Parse Arguments and Read Target File

**CRITICAL - DO THIS FIRST:**

**If user used @ syntax (like @.claude/commands/organize-attachments.md):**
- That file is already loaded in context - you can see it
- Review that file directly, skip the search steps below

**Otherwise, if $ARGUMENTS is provided:**

1. **Extract filename from $ARGUMENTS:**
   - Remove any flags (--interactive, --dry-run, etc.)
   - Get the actual command filename to review

2. **Find the file:**
   - If $ARGUMENTS contains `/` or ends with `.md`: treat as direct path, use Read
   - Otherwise: use Glob to search for `.claude/commands/**/*<name>*.md`
   - If multiple matches: list them and ask user which one to review

3. **Read the target file:**
   - Use Read tool to get the full contents
   - Parse frontmatter and content structure

**If neither @ file nor $ARGUMENTS provided:**
- Ask the user to specify which command file to review

**Example:**
- User says: `/commands:review-command organize-inbox`
- You search: `.claude/commands/**/organize-inbox.md`
- You read: `.claude/commands/organize-inbox.md`
- You review: That file's contents

## Input & Flags

**Arguments:** $ARGUMENTS

**Supported Flags:**

- `--emit-patch`: Generate unified diff and save to
  `.claude/reports/patches/<file>.<timestamp>.patch`
- `--fix-safe`: Apply non-destructive metadata/format fixes only (with backup)
- `--format`: Normalize frontmatter order and formatting
- `--dry-run`: Review only, never modify files (overrides other flags)

**Default behavior:** Read-only review with comprehensive feedback report

## Review Mode

**Default (Recommended)**: Provide complete feedback all at once for easy review
**Interactive Mode**: If `--interactive` flag is present, break down feedback
step-by-step

## Review Process

### 1. Resolve Target Path

- If input contains `/` or ends with `.md`, treat as direct path
- Otherwise search `.claude/commands/**/<name>.md`
- If multiple matches found, list them and ask for clarification

### 2. Read and Parse Command

Read the file and parse frontmatter + content structure.

### 3. Audit Checklist (Scored 0-100)

#### Frontmatter Quality (25 points)

- **description**: Present, clear, concise? (Required for AI discovery)
- **argument-hint**: Helpful format shown to users?
- **model**: Appropriate or inherit?
- **version**: Present for tracking changes?
- **disable-model-invocation**: Set for dangerous operations?

**Score deductions:**

- Missing description: -10
- Unclear argument-hint: -5
- No version: -5
- Missing disable flag on dangerous ops: -5

#### Least-Privilege Tools (15 points)

- **Overly broad permissions** (critical): `Bash(*)`, `Read(*)`, `Write(*)`
- **Proper scoping**: `Bash(git:*)` vs `Bash(*)`
- **Unused tools** in allowed-tools
- **Missing tools** that content uses

**Score deductions:**

- Wildcard `Bash(*)` or `Read(*)`: -10
- Missing required tools: -5

#### Safety & Gating (15 points)

- **Dry-run mode** for destructive operations
- **Prerequisite checks** before executing
- **Error handling** instructions
- **Verification steps** after changes
- **Destructive ops** properly gated with `--force` or `--confirm`

**Score deductions:**

- Destructive ops without dry-run: -10
- No error handling: -5

#### Arguments & Validation (10 points)

- **Proper use** of `$ARGUMENTS`, `$1`, `$2`
- **Usage message** when no args provided
- **Validation** of required inputs

**Score deductions:**

- No usage on missing args: -5
- Poor argument handling: -5

#### Structure & Clarity (15 points)

Evaluate:

- **Clear sections**: Headers, numbered steps, organized flow?
- **Argument usage**: Proper use of `$ARGUMENTS`, `$1`, `$2`, etc.?
- **Dynamic context**: Appropriate use of ! (shell) and @ (file includes)?
- **Instructions clarity**: Specific, actionable steps vs vague directions?

### 4. Safety & Error Handling

Check for:

- **Dry-run mode**: For destructive operations, is there a `--dry-run` or
  `--confirm` pattern?
- **Prerequisite checks**: Does it validate before executing?
- **Error handling**: Clear instructions for what to do if steps fail?
- **Verification**: Post-execution checks to confirm success?
- **Dangerous operations**: Properly warned and gated?

**Score deductions:**

- Poor structure/no headings: -10
- Vague instructions: -5

#### Tool/Permission Alignment (10 points)

- All ! shell commands in allowed-tools?
- All @ file references have Read permissions?
- Any tool mismatches?

**Score deductions:**

- Tool/permission mismatch: -10

#### Maintainability & Namespacing (10 points)

- Proper location/namespace?
- Clear, imperative naming?
- No stale references?
- Version tracked?

**Score deductions:**

- Poor naming: -5
- Stale references: -5

## Review Output Format

### SCORE: N/100

Provide overall numeric score based on weighted categories.

### SUMMARY

2-3 sentence overall assessment.

### CHECKLIST

```
✓ Frontmatter       [PASS/WARN/FAIL] - Brief rationale
✓ Tools             [PASS/WARN/FAIL] - Brief rationale
✓ Safety            [PASS/WARN/FAIL] - Brief rationale
✓ Arguments         [PASS/WARN/FAIL] - Brief rationale
✓ Structure         [PASS/WARN/FAIL] - Brief rationale
✓ Alignment         [PASS/WARN/FAIL] - Brief rationale
✓ Maintainability   [PASS/WARN/FAIL] - Brief rationale
```

### RISKS (if any)

Itemized list ordered by severity:

1. **🔴 Critical**: Description with impact
2. **🟡 Important**: Description with impact
3. **⚪ Minor**: Description with impact

### SUGGESTIONS (ALL at once)

#### 📊 Category Scores

- **Security**: 🟢 Good / 🟡 Needs work / 🔴 Critical issues
- **Best Practices**: 🟢 Good / 🟡 Needs work / 🔴 Poor
- **Usability**: 🟢 Good / 🟡 Needs work / 🔴 Confusing
- **Overall**: Ready to use / Needs improvements / Major refactor needed

#### ✅ Strengths

- What this command does well
- Good patterns to keep

#### 📋 Frontmatter Improvements (copy-pastable)

```yaml
---
description: 'Improved description'
argument-hint: '[arg1] [arg2]'
allowed-tools:
  - Read
  - Write
  - Bash(git status:*) # Scoped, not Bash(*)
version: 1.0.0
---
```

#### 📝 Content Improvements (copy-pastable)

**Add Safety Section:**

```markdown
## Safety

If $ARGUMENTS lacks "--confirm":

- Print what WOULD be changed
- Exit without modifications
- Instruct user to add --confirm
```

**Improve Error Handling:**

```markdown
If any step fails:

- Stop immediately
- Print error details
- Suggest fixes
```

## Optional Actions (Based on Flags)

### If `--emit-patch` present:

1. Build normalized version
2. Generate unified diff
3. Ensure `.claude/reports/patches/` exists
4. Write: `.claude/reports/patches/<filename>.<timestamp>.patch`
5. Print: "✅ Patch written to <path>"

### If `--fix-safe` present (and NOT `--dry-run`):

1. Backup: `<file>.bak-<timestamp>`
2. Apply non-destructive fixes:
   - Normalize frontmatter order
   - Fix formatting
   - Add missing version
3. Print each: "✅ Fixed: <description>"
4. Do NOT modify logic or add sections

### If `--format` present:

1. Backup
2. Normalize YAML formatting
3. Standardize headings/lists
4. Print: "✅ Formatted <file>"

## Execution Steps

**IMPORTANT: You already completed Step 0 above (reading the target file)**

**Step 1:** Parse the file you just read (frontmatter + content)
**Step 2:** Score across all categories (show numeric score)
**Step 3:** Output comprehensive report with ALL findings at once
**Step 4:** Apply optional actions if flags present
**Step 5:** Ask user how to proceed with implementing changes

## Next Steps Prompt

After presenting the review, ask the user how they'd like to proceed:

```
## How would you like to proceed?

1. **Interactive review** - Go through suggestions one by one for approval
2. **Auto-apply safe fixes** - Let me apply non-destructive improvements automatically
3. **Manual implementation** - I'll implement the changes myself
4. **Skip for now** - Just wanted the review

Please choose an option (1-4) or describe what you'd like me to do.
```

**Handle user response:**

- Option 1: Walk through each suggestion, asking for approval before applying
- Option 2: Apply frontmatter fixes and formatting automatically (with backup)
- Option 3: Acknowledge and end
- Option 4: Acknowledge and end

## Begin Review

1. First, complete Step 0 above - find and read the target file
2. Then, analyze that file's contents using the rubric
3. Provide the scored review with specific feedback
